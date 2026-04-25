# Automation

This directory contains repository automation code that is intentionally separate from product runtime code under `apps/`.

## Issue processing

The `issue-processing` module provides the workflow entry point for loading issue content and running classification before downstream RCA, planning, or code-fix automation continues.

- `processIssue.ts` is the Phase 1 entry point.
- `classifyIssue.ts` is the dedicated classification boundary invoked immediately after issue content is available.

Phase 1 only establishes the boundary and call order. It does not yet apply synthetic-issue detection rules or perform issue/PR side effects.
