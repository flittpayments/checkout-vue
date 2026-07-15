# Changelog

## [1.16.9]

### Changed

- 3DS page title presentation.
- Configuration for showing or hiding the close action.

## [1.16.8]

### Added

- PayByPayMe button with deeplink redirect support.
- QR code payments with deeplink support.
- CVV requirement configuration.
- Humo and Uzcard card icons.
- Uzbek localization.
- Localization support for BNPL and Open Banking mobile application names.
- Support for opening mobile applications in the current or a new tab.

### Changed

- Click to Pay integration.
- Single payment method flow.
- QR page wording based on payment method configuration.
- Country-specific test card presentation.
- Build configuration for branch-specific bundles and routing.

### Fixed

- QR code sizing.
- Card layout when CVV is not required.
- Unnecessary fee calculation requests on QR code and deeplink pages.
- QR links parsing in the TBC mobile application.

## [1.15.5]

### Changed

- Tooltip behavior when focusing card form fields.

## [1.15.4]

### Changed

- Wallets layout when only a single wallet payment method is available.

### Fixed

- Tooltip visibility after route changes.
- Tab content rendering.
- Installments tab visibility for recurring payments.

## [1.15.3]

### Fixed

- Loading of allowed language resources.

## [1.15.2]

### Added

- Georgian localization updates.

### Changed

- Automatic focus on card input when switching to the card payment tab.

## [1.15.1]

### Changed

- Merchant terms and conditions checkbox visibility configuration.

## [1.15.0]

### Fixed

- Active tab selection behavior.

## [1.14.0]

### Fixed

- Display of disabled payment methods in the Most Popular tab.

## [1.13.1]

### Changed

- Internal improvements

## [1.13.0]

### Added

- Internal improvements

## [1.12.1]

### Fixed

- Internal improvements

## [1.12.0]

### Fixed

- Handling of hidden state start time values.
- Reporting of cases when card payment methods are disabled.

## [1.11.1]

### Fixed

- CVV masking in the plain layout.
- Google Pay and Apple Pay tab creation when custom fields are present.

## [1.11.0]

### Added

- Subresource Integrity (SRI) support.

### Build

- Dependency updates.

## [1.10.4]

### Added

- Internal improvements

## [1.10.2]

### Added

- Spanish localization improvements.

## [1.10.1]

### Fixed

- Validation of month value `00` in card expiration date fields.

## [1.10.0]

### Changed

- English localization updates.

## [1.9.0]

### Changed

- Payment method routing based on URL parameters.

### Fixed

- Payment method rendering.

## [1.8.0]

### Added

- Automatic payment submission.

### Changed

- Renamed `banklinks_eu` to `banks`.

## [1.7.1]

### Build

- JS SDK dependency updates.

## [1.7.0]

### Added

- Automatic redirect from the success page to the merchant response URL.

## [1.6.2]

### Added

- Display of Flitt and TBC branding alongside merchant logos.

### Fixed

- Google Pay button border radius in dark browser themes.

## [1.6.1]

### Changed

- Default preset and merchant configuration.

## [1.6.0]

### Added

- Wallet-only layout.
- Default visibility options for the plain layout.

## [1.5.1]

### Fixed

- Georgian localization for merchant terms links.

## [1.5.0]

### Added

- Monorepo project structure.
- Checkout npm package.
- Checkout React package.

## [1.4.3] - 2025-05-21

### Fixed

- 3DS window sizing.

## [1.4.1] - 2025-05-06

### Build

- Dependency updates.

## [1.4.0]

### Added

- Error events for expired tokens.

## [1.3.0]

### Added

- "Processed by Flitt" visibility option.

## [1.2.0]

### Added

- Plain layout.
- Configuration for hiding checkout elements.
- Border radius CSS variable.

## [1.1.0]

### Build

- Dependency updates.

## [1.0.0]

- Initial release
