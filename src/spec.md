# Specification

## Summary
**Goal:** Fix the admin panel error that prevents the authenticated owner from accessing the admin dashboard.

**Planned changes:**
- Debug and resolve errors in the AdminPanel component that prevent rendering
- Fix the admin route protection logic to properly handle isCallerAdmin checks
- Correct the backend isCallerAdmin method to successfully authenticate the owner principal
- Ensure the adminPrincipals HashMap correctly stores and retrieves the owner principal
- Add proper error handling and loading states throughout the admin access flow

**User-visible outcome:** The authenticated owner can successfully access and view the admin dashboard at /admin without errors.
