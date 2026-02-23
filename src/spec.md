# Specification

## Summary
**Goal:** Enable admin users to change user status from the admin panel.

**Planned changes:**
- Add status change dropdown in UserStatusManagement component for admins
- Implement backend setUserStatus method with admin authorization
- Create useSetUserStatus React hook following the existing useSetUserRole pattern
- Ensure status changes persist and trigger UI refresh

**User-visible outcome:** Admin users can change any user's status directly from the admin panel user management table, similar to how they currently change roles.
