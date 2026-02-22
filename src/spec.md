# Specification

## Summary
**Goal:** Add a user status/role system with four levels (Owner, Admin, User, Friend) that can be managed through the admin panel and displayed on the home screen.

**Planned changes:**
- Add a status field to user profiles in the backend with four possible values: Owner, Admin, User, Friend
- Implement backend methods to change user status, restricted to Admin and Owner roles only
- Add a user management section to the admin panel with UI to select users and change their status
- Display the current user's status prominently on the Home Screen
- Create a backend query to retrieve all users with their status information for the admin panel

**User-visible outcome:** Users will see their current status (Owner, Admin, User, or Friend) displayed on the home screen. Admins and Owners can access a new section in the admin panel to view all users and change their status/role assignments.
