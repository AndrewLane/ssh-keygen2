# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 15-Oct-2023

### Changed

- Change node support to Node 18 and above
- Bump dev dependencies
- Introduce prettier for code formatting
- Introduce sinon for advanced tests to complete code coverage

## [1.1.4] - 10-Jan-2023

### Changed
- Version bumps and security fix in dependencies

## [1.1.3] - 28-Mar-2022

### Changed
- Version bumps and security fix in dependencies

## [1.1.2] - 1-Oct-2020

### Changed
- Tweaking GitHub Actions (CI only)

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

[1.2.0]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/AndrewLane/ssh-keygen2/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/AndrewLane/ssh-keygen2/releases/tag/v1.0.1
