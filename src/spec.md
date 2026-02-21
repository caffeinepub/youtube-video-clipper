# Specification

## Summary
**Goal:** Fix the admin panel to properly display user identity and system statistics instead of showing only debug information.

**Planned changes:**
- Replace the "Debug Info" card with a user-friendly "Your Identity" or "User ID" section at the top of the admin panel that displays the authenticated user's principal ID with a copy-to-clipboard button
- Ensure system statistics (total clips count and trending clips table) render below the user identity section
- Remove or relocate the raw debug information (principal, isOwner boolean) to browser console or a collapsible debug section
- Verify the useAdminStats hook correctly fetches and returns data without errors

**User-visible outcome:** Admin users will see a properly structured admin dashboard with their user identity displayed prominently at the top, followed by meaningful system statistics including total clips count and a trending clips table, instead of raw debug information.
