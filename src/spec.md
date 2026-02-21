# Specification

## Summary
**Goal:** Fix admin access control to allow the authenticated owner (principal '7cho6-twidd-xljev-okmzv-oebuv-llwo6-5tmzy-3n3pb-4nhg5-54713-aae') to access the admin panel.

**Planned changes:**
- Fix backend owner principal verification in backend/main.mo to correctly authenticate the owner principal
- Verify owner principal initialization logic correctly stores and compares the owner principal during canister deployment
- Add comprehensive backend logging in isCallerAdmin method to output caller principal, stored owner principal, and comparison result
- Update frontend App.tsx admin route protection to display the exact principal in the access denied message for debugging

**User-visible outcome:** The authenticated owner can successfully access the admin panel without seeing "Access Denied", and debug information shows the principal comparison details.
