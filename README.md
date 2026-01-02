# Mortgage Calculator WordPress Plugin

A comprehensive multi-mode mortgage calculator plugin for WordPress, designed specifically for the Irish mortgage market. Display interactive mortgage calculators on your WordPress site with real-time rate data from Broker360.

## Features

- **7 Specialized Calculator Types** - First-Time Buyer, Moving House, Buy-to-Let, Mortgage Switching, LTV Calculator, Home Improvement, and Foreign National
- **Real-time Rate Data** - Automatically fetches current mortgage rates from centralized Broker360 API
- **Dynamic Rate Display** - Shows top 3 best rates from different lenders (excluding AIB & EBS)
- **Interactive Calculations** - Instant monthly payment calculations based on loan term and amount
- **Responsive Design** - Mobile-friendly interface that works on all devices
- **Rate Timestamp Footer** - Displays when rates were last updated with link to Broker360 Plugins
- **Single/Joint Application Support** - Toggle between single and joint mortgage applications
- **Customizable Loan Terms** - Adjustable loan terms with slider (5-35 years, capped at age 70)

## Calculator Types

### 1. First-Time Buyer (`[mortgage_calculator]`)
Calculate mortgage eligibility for first-time buyers based on age, salary, and deposit.

### 2. Moving House (`[mh_calculator]`)
Calculate mortgage needs when upgrading or moving to a new property, factoring in current equity.

### 3. Buy-to-Let (`[btl_calculator]`)
Specialized calculator for investment properties with BTL-specific rates.

### 4. Mortgage Switcher (`[switcher_calculator]`)
Compare savings when switching your existing mortgage to a new lender.

### 5. LTV Calculator (`[mortgage_ltv]`)
Calculate loan-to-value ratios for mortgage applications.

### 6. Home Improvement (`[home_improvement_calculator]`)
Calculate borrowing capacity for home improvement loans.

### 7. Foreign National (`[fn_calculator]`)
Mortgage calculator tailored for foreign nationals purchasing property in Ireland.

## Installation

1. Upload the `mortgage-calculator` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use shortcodes to add calculators to any page or post

## Shortcodes

```
[mortgage_calculator]           - First-Time Buyer Calculator
[mh_calculator]                 - Moving House Calculator
[btl_calculator]                - Buy-to-Let Calculator
[switcher_calculator]           - Mortgage Switcher Calculator
[mortgage_ltv]                  - LTV Calculator
[home_improvement_calculator]   - Home Improvement Calculator
[fn_calculator]                 - Foreign National Calculator
```

## Usage Example

Simply add a shortcode to any WordPress page or post:

```html
[mortgage_calculator]
```

The calculator will automatically display with all functionality enabled.

## Recent Updates

### Version 0.99 (December 2025)

#### ✨ New Features
- **Centralized Rate Feed**: All calculators now pull from external API at `https://broker360.ai/rates/bestrate360.json`
- **Rate Timestamp Footer**: Displays last updated date and Broker360 branding on all calculators
- **Metadata Support**: JSON feed includes timestamp metadata for accurate rate update tracking

#### 🔧 Technical Improvements
- **Unified JSON Format**: Migrated from legacy format to new `bestrate360.json` structure
  - Field changes: `Company` → `lender`, `Rate` → `ratePercent`, `NOTES` → `notes`
- **Improved Rate Sorting**: Fixed sorting algorithm to display actual best 3 rates by lender
- **BTL Rate Filtering**: Enhanced Buy-to-Let calculator to correctly filter BTL-specific rates
- **35-Year Term Cap**: Implemented maximum loan term of 35 years across all calculators
- **Age-Based Term Calculation**: Automatic loan term adjustment ensuring repayment by age 70

#### 🐛 Bug Fixes
- Fixed best3.js to use correct JSON file path
- Resolved conflicts between old and new JSON formats
- Corrected rate display issues after JSON migration
- Fixed duplicate rate display from same lenders

## Technical Details

### Architecture

- **Plugin Structure**: Modular design with separate JavaScript files for each calculator type
- **Data Source**: External JSON API for real-time rate updates
- **Shared Components**: `best3.js` provides reusable rate display functionality
- **Responsive CSS**: Custom styling for professional appearance across devices

### File Structure

```
mortgage-calculator/
├── css/
│   └── mortgage-calculator.css
├── js/
│   ├── best3.js                    # Shared rate display
│   ├── mortgage-calculator.js      # First-time buyer
│   ├── mh-calculator.js            # Moving house
│   ├── btl-calculator.js           # Buy-to-let
│   ├── switcher-calculator.js      # Switcher
│   ├── mortgage-ltv.js             # LTV calculator
│   ├── home-improvement.js         # Home improvement
│   └── foreign-national.js         # Foreign national
├── shortcodes/
│   ├── mortgage.php
│   ├── moving-house.php
│   ├── buy-to-let.php
│   ├── switcher.php
│   ├── mortgage-ltv.php
│   ├── home-improvement.php
│   └── foreign-national.php
├── images/                         # Lender logos
└── mortgage-calculator.php         # Main plugin file
```

### Data Format

The plugin expects JSON data in the following format:

```json
[
  {
    "_metadata": "timestamp",
    "last_updated": "2025-12-30 07:00:03 UTC",
    "last_updated_iso": "2025-12-30T07:00:03.365234+00:00"
  },
  {
    "lender": "Avant",
    "product": "Product Name",
    "type": "Fixed",
    "fixTermYears": 3,
    "ratePercent": 3.45,
    "aprPercent": 3.67,
    "ltvMin": 0,
    "ltvMax": 90,
    "minLoan": 75000,
    "maxLoan": 1000000,
    "notes": "Additional information"
  }
]
```

### Requirements

- WordPress 5.0 or higher
- jQuery (included with WordPress)
- Modern web browser with JavaScript enabled

## Changelog

### [Unreleased]
- All changes committed to branch `claude/add-table-footer-53xcD`

#### Added
- Table footer with rate timestamp and Broker360 link on all calculators
- Metadata extraction from JSON for timestamp display
- Centralized external rate feed integration

#### Changed
- Migrated all calculators to use `bestrate360.json` format
- Updated field names: `Company` → `lender`, `Rate` → `ratePercent`
- Switched from local JSON files to external API endpoint
- Improved rate sorting and filtering logic

#### Fixed
- Merge conflict resolution between JSON format changes
- BTL calculator now uses lowercase `notes` field for filtering
- Consistent field references across all calculator types

### [0.99] - 2025-12-30

#### Added
- New WordPress plugin metadata (Plugin URI, Author info updated to Broker360)
- External JSON data source support

#### Changed
- Updated plugin version to 0.99
- Plugin URI changed to https://broker360.ai/plugins
- Author changed to "Broker 360"
- Author URI changed to https://broker360.ai

#### Fixed
- Best rate sorting logic to display actual top 3 rates
- BTL calculator filtering for BTL-specific rates
- Loan term capping at 35 years maximum
- Duplicate rate display from same lenders

### [Initial] - 2025-12

#### Added
- Initial plugin release
- 7 different mortgage calculator types
- Dynamic rate display functionality
- Single/Joint application toggle
- Responsive design and styling

## Support

For support and feature requests, please visit [Broker360 Plugins](https://broker360.ie/plugins/)

## Credits

**Author**: Broker 360
**Plugin URI**: https://broker360.ai/plugins
**Author URI**: https://broker360.ai

## License

This plugin is proprietary software developed for Broker360.

---

*Rate data powered by Broker360 - Updated in real-time*
