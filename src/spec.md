# Specification

## Summary
**Goal:** Implement user ID-based admin authentication system to enable admin access for specific user IDs.

**Planned changes:**
- Replace principal-based admin authentication with user ID system in backend
- Store and check admin user IDs instead of principals
- Add user ID '7cho6-twidd-xljev-okmzv-oebuv-llwo6-5tmzy-3n3pb-4nhg5-54713-aae' as the first admin
- Create addAdmin method that only existing admins can call
- Map Internet Identity principals to user IDs for authorization checks
- Ensure admin list persists across canister upgrades

**User-visible outcome:** The user with ID '7cho6-twidd-xljev-okmzv-oebuv-llwo6-5tmzy-3n3pb-4nhg5-54713-aae' will be able to access the admin panel, and existing admins will be able to add additional admin user IDs through the backend.
