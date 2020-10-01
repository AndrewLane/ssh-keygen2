# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 1-Oct-2020

### Changed
- Tweaking GitHub Actions (CI only)

## [1.1.0] - 1-Oct-2020

### Added

- Added code scanning via a GitHub Action.

### Changed
- Removed the forwarding of the options object sent to to the keygen function on to the ssh-keygen spawn call.  I can't envision any scenario where this would be needed by any consumer of this library.

## [1.0.1] - 18-Sep-2020

### Initial Release

[1.1.1]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/AndrewLane/ssh-keygen2/releases/tag/v1.0.1

