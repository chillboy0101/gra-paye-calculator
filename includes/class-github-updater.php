<?php
/**
 * Checks GitHub releases and offers them on the WordPress Plugins screen.
 */

if (!defined('ABSPATH')) {
    exit;
}

class GRA_PAYE_GitHub_Updater {

    const REPO = 'chillboy0101/gra-paye-calculator';
    const ASSET = 'gra-paye-calculator.zip';
    const CACHE_KEY = 'gra_paye_github_release';
    const CACHE_TTL = 1800;

    private $plugin_basename;
    private $slug;

    public function __construct($plugin_file) {
        $this->plugin_basename = plugin_basename($plugin_file);
        $this->slug = dirname($this->plugin_basename);

        add_filter('update_plugins_github.com', array($this, 'filter_update'), 10, 4);
        add_filter('plugins_api', array($this, 'filter_plugin_info'), 10, 3);
    }

    public function filter_update($update, $plugin_data, $plugin_file, $locales) {
        unset($plugin_data, $locales);

        if ($plugin_file !== $this->plugin_basename) {
            return $update;
        }

        $release = $this->latest_release();
        if (!is_array($release) || $release['package'] === '') {
            return $update;
        }

        return array(
            'slug' => $this->slug,
            'version' => $release['version'],
            'url' => $release['url'],
            'package' => $release['package'],
            'tested' => '7.1',
            'requires_php' => '7.4',
        );
    }

    public function filter_plugin_info($result, $action, $args) {
        if ($action !== 'plugin_information' || empty($args->slug) || $args->slug !== $this->slug) {
            return $result;
        }

        $release = $this->latest_release();
        if (!is_array($release)) {
            return $result;
        }

        return (object) array(
            'name' => 'GRA PAYE Calculator',
            'slug' => $this->slug,
            'version' => $release['version'],
            'author' => 'GRA IT Department',
            'homepage' => 'https://gra.gov.gh/domestic-tax/tax-types/paye/',
            'download_link' => $release['package'],
            'requires_php' => '7.4',
            'tested' => '7.1',
            'sections' => array(
                'description' => 'Pay As You Earn calculator for the Ghana Revenue Authority website. Uses the Year of Assessment 2026 resident individual bands.',
                'changelog' => nl2br(esc_html($release['notes'])),
            ),
        );
    }

    private function latest_release() {
        $cached = get_site_transient(self::CACHE_KEY);
        if (is_array($cached) && self::is_trusted_release($cached)) {
            return $cached;
        }

        $response = wp_remote_get(
            'https://api.github.com/repos/' . self::REPO . '/releases/latest',
            array(
                'timeout' => 10,
                'headers' => array(
                    'Accept' => 'application/vnd.github+json',
                    'User-Agent' => 'GRA-PAYE-Calculator',
                ),
            )
        );

        if (is_wp_error($response) || 200 !== (int) wp_remote_retrieve_response_code($response)) {
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        if (!is_array($body) || empty($body['tag_name']) || empty($body['assets']) || !is_array($body['assets'])) {
            return null;
        }

        if (!preg_match('/^v(\d+\.\d+\.\d+)$/', (string) $body['tag_name'], $matches)) {
            return null;
        }

        $version = $matches[1];
        $package = self::package_url($version);
        $found = false;
        foreach ($body['assets'] as $asset) {
            if (!empty($asset['name']) && $asset['name'] === self::ASSET && isset($asset['browser_download_url']) && hash_equals($package, (string) $asset['browser_download_url'])) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            return null;
        }

        $notes = isset($body['body']) ? (string) $body['body'] : '';
        if (strlen($notes) > 5000) {
            $notes = substr($notes, 0, 5000);
        }

        $release = array(
            'version' => $version,
            'url' => 'https://github.com/' . self::REPO . '/releases/tag/v' . $version,
            'package' => $package,
            'notes' => $notes,
        );

        set_site_transient(self::CACHE_KEY, $release, self::CACHE_TTL);

        return $release;
    }

    private static function package_url($version) {
        return 'https://github.com/' . self::REPO . '/releases/download/v' . $version . '/' . self::ASSET;
    }

    private static function is_trusted_release($release) {
        if (empty($release['version']) || empty($release['package']) || !preg_match('/^\d+\.\d+\.\d+$/', $release['version'])) {
            return false;
        }

        return hash_equals(self::package_url($release['version']), (string) $release['package']);
    }
}
