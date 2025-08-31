# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2025-08-31

### Fixed

- Fixed reset function to properly restore default values instead of only clearing state
- Improved reset function implementation to iterate through default values explicitly

### Changed

- Refactored context usage in useTauriStore hook for better clarity and consistency
- Enhanced type safety by exposing store instance through context
- Improved hook API by spreading context values for cleaner access to state, dispatch, and store

### Technical

- Renamed internal context variable for better code readability
- Added store instance to context provider value for advanced use cases

## [0.1.3] - 2025-07-21

### Changed

- Updated dependencies to latest versions for better stability and security
  - @biomejs/biome: 1.9.4 → 2.1.2
  - @testing-library/react: ^16.2.0 → ^16.3.0
  - @types/react: ^19.0.10 → ^19.1.8
  - esbuild: ^0.25.0 → ^0.25.8
  - globals: ^15.15.0 → ^16.3.0
  - jsdom: ^26.0.0 → ^26.1.0
  - typescript: ^5.7.3 → ^5.8.3
  - vite: ^6.1.1 → ^7.0.5
  - vitest: ^3.0.6 → ^3.2.4
  - @tauri-apps/plugin-store: ^2.2.0 → ^2.3.0
  - react: ^19.0.0 → ^19.1.0

### Technical

- Added react-dom as explicit dev dependency for better test environment support
- Modified test script to use --run flag for CI/automated testing environments
- Improved package.json formatting for better maintainability

## [0.1.2] - 2024-12-01

### Added

- Initial stable release of react-tauri-store library

## [0.1.1] - 2024-11-30

### Changed

- Updated README documentation

## [0.1.0] - 2024-11-30

### Added

- Initial release of react-tauri-store
- TauriStoreProvider React context provider
- useTauriStore custom hook for state management
- Automatic persistence via Tauri's store plugin
- TypeScript support with full type definitions
- ESM/CJS dual export format
- Comprehensive test suite with vitest