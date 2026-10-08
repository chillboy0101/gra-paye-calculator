# GRA PAYE Calculator

WordPress plugin for the Ghana Revenue Authority Pay As You Earn page. It calculates resident individual PAYE from the Year of Assessment 2026 bands published by GRA. Those rates took effect on 1 September 2026 under the Income Tax (Amendment) Act, 2026 (Act 1178).

The shortcode is:

```
[paye_calculator]
```

The shortcode does not change between versions. After an update, existing pages keep working.

Repository: https://github.com/chillboy0101/gra-paye-calculator

Author: GRA IT Department (https://gra.gov.gh)

Maintainer: Carl Quist (https://github.com/chillboy0101)

Official rates: https://gra.gov.gh/domestic-tax/tax-types/paye/

The PAYE page is https://gra.gov.gh/domestic-tax/tax-types/paye/. The slices in `assets/pay-as-you-earn.js` match that Year of Assessment 2026 table.

## What a visitor can do

The form has two modes.

- **Employee (Monthly).** Enter monthly chargeable income. The monthly 2026 bands are used.
- **Employee (Annual).** Enter annual chargeable income. The annual 2026 bands are used.

Personal reliefs match the GRA reliefs page: marriage or responsibility GH¢1,200 a year, child education GH¢600 a child up to 3 children, old age GH¢1,500 a year, aged dependent GH¢1,000 a relative up to 2 relatives, educational relief GH¢2,000 a year, and disability at 25% of the entered income. On monthly mode the annual relief amounts are divided by 12.

The income to enter is chargeable income after SSNIT (5.5% of basic salary), provident fund (up to 16.5% of basic salary), qualifying mortgage interest, and donations to a worthwhile cause. The form does not calculate those deductions. It also does not calculate overtime, bonus, casual-worker tax, or the non-resident flat rate of 25%.

The band table shows each GRA slice, the rate, the tax on that slice, the cumulative income, and the cumulative tax. The slices add up to GH¢50,000 a month and GH¢600,000 a year. Income above those lines is taxed at 35%.

"Year of Assessment 2026" is the name of this rate table. The calculator does not expire at the end of 2026. It keeps using these bands until a newer plugin version replaces them.

## What the plugin does not store

The calculation runs in the visitor's browser. Income figures, relief choices, and results are not sent to WordPress, to GRA, or to GitHub. The plugin has no accounts, no database tables, and no settings that hold taxpayer information.

## Install

1. Download `gra-paye-calculator.zip` from the latest release.
2. In WordPress, go to Plugins → Add New → Upload Plugin and choose that zip.
3. Activate **GRA PAYE Calculator**.
4. Put `[paye_calculator]` in a page. On the Financity / Goodlayers builder, use a Text or Shortcode element.

The zip must contain a folder named `gra-paye-calculator` with `gra-paye-calculator.php` inside it. Do not install GitHub's automatic "Source code" zip. That zip uses a different folder name and WordPress will not treat it as this plugin.

## Updates

The plugin header contains:

```
Update URI: https://github.com/chillboy0101/gra-paye-calculator
```

WordPress asks GitHub for the latest release. If the release version is higher than the installed version, Plugins shows an update. The download address must be exactly:

```
https://github.com/chillboy0101/gra-paye-calculator/releases/download/vX.Y.Z/gra-paye-calculator.zip
```

`X.Y.Z` is the version in the plugin file, and the tag must be `vX.Y.Z`. Any other address is ignored. The plugin does not use a token, does not log into GitHub, and does not follow a download link that points anywhere else.

Click **Enable auto-updates** on the Plugins screen if a new release should install itself. Leave it off if a person should press Update after looking at the release. Auto-updates install whatever zip is attached to the newest trusted release, so publish a release only after the zip has been checked.

This repository is **public**. It has to be public so WordPress can download the zip without a password stored on the website. The code and the tax rates are public information. The repository must not be made private unless the update checker is redesigned, because a private repository would stop updates.

## Security rules

Protect the GitHub account `chillboy0101`. Turn on two-factor authentication. Do not share the password. A person who can publish a release can ship code to every site that has auto-updates turned on.

Never commit any of these:

- WordPress passwords, database passwords, or `wp-config.php`
- GitHub tokens, personal access tokens, or SSH private keys
- Taxpayer names, TINs, salaries, or calculator results
- A copy of the live GRA website, its uploads, or its database

The calculation does not phone home. The only network call the plugin makes is the WordPress admin update check to `https://api.github.com/repos/chillboy0101/gra-paye-calculator/releases/latest`. Visitors who use the calculator do not trigger that call.

Before you publish a release, open the zip and confirm it contains `gra-paye-calculator/gra-paye-calculator.php` and `gra-paye-calculator/includes/class-github-updater.php`, and that it does not contain a `.git` folder.

## Publish a new version

1. Change both `Version:` and `const VERSION` in `gra-paye-calculator.php` to the same new number, such as `1.0.23`.
2. From this folder, run `bash build-zip.sh`. It writes `dist/gra-paye-calculator.zip` and refuses to include `.git`.
3. Commit the version change and push it to `main`.
4. Create a GitHub release. The tag must be `v` plus the version, for example `v1.0.23`.
5. Attach the zip. Its file name must stay `gra-paye-calculator.zip`.
6. On a site that has the plugin, open Plugins and use Check again if the update is not listed yet. The check is cached for 30 minutes.

Do not attach a second zip with a different name. The plugin accepts only `gra-paye-calculator.zip`.
