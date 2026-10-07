# GRA PAYE Calculator

WordPress plugin for the Ghana Revenue Authority Pay As You Earn calculator. Year of Assessment 2026 bands. Shortcode: `[paye_calculator]`.

Updates are read from public GitHub releases of this repository. WordPress shows them on Plugins → Updates after version 1.0.3 is installed.

## Publish a release

1. Set `Version` and `const VERSION` in `gra-paye-calculator.php` to the new number.
2. From the project folder, run `bash build-release.sh`. That writes `zip/gra-paye-calculator.zip` with the plugin folder inside.
3. Commit and push, then create a release whose tag is `v` plus that version, for example `v1.0.4`.
4. Attach `zip/gra-paye-calculator.zip` to the release. The asset name must stay `gra-paye-calculator.zip`.

The installed copy checks `https://api.github.com/repos/chillboy0101/gra-paye-calculator/releases/latest` about every half hour, and again when someone clicks Check again on the Plugins screen.
