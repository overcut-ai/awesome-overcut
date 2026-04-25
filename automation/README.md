# Automation

This directory contains repository automation code that is intentionally separate from product runtime code under `apps/`.

## Issue processing

The `issue-processing` module provides the workflow entry point for loading issue content and running classification before downstream RCA, planning, or code-fix automation continues.

- `processIssue.ts` is the Phase 1 entry point.
- `classifyIssue.ts` is the dedicated classification boundary invoked immediately after issue content is available.
- `dispositionSyntheticIssue.ts` contains the Phase 3 synthetic/non-actionable issue disposition policy.

The issue-processing module now supports applying non-actionable synthetic-issue disposition through an automation-layer operations interface. When synthetic issue classification is detected and issue disposition operations are supplied, the automation plan will:

- add the labels `triage/synthetic` and `won't-fix`
- remove the label `needs-rca`
- add a disposition comment explaining why no defect workflow will continue
- close the issue through the injected issue-operations boundary
