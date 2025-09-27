# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Email format validation for `customer.email` when creating or updating a customer record. Invalid emails now return `400 Bad Request` with message `Invalid email format`. ([#55](https://github.com/overcut-ai/awesome-overcut/issues/55))
