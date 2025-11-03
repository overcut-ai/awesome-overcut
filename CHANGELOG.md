# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Shared pagination utility `applyPaginationDefaults` with configurable `MAX_PAGE_SIZE` (default **100**).
- Unit tests covering pagination helper edge cases.
- Integration tests validating enforced pagination across list endpoints.

### Changed
- List endpoints for Hotels, Customers, Rooms, and Reservations now automatically enforce a maximum page size of 100 records when the client omits or exceeds this limit. Negative `skip` values are clamped to `0`. (**Performance fix**, closes #84)

