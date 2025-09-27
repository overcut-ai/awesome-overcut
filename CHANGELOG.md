# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Validation for `email` field on Customer create and update endpoints using RFC-compliant e-mail format checks.

### Changed
- Updated README with details of the new validation rule.

### Breaking
- Requests that provide an **invalid e-mail** for the `email` property will now be rejected with **HTTP 400** validation errors. Client integrations must supply a properly formatted e-mail or omit the field.
