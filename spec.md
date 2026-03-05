# Beast Clipping

## Current State
The app is a full-stack YouTube clipping dashboard with:
- A Motoko backend with user profiles, roles (owner/admin/user/friend), statuses, notifications, messaging, activity logs, clip management, YouTube auth, feedback submissions, admin links, and system controls (pause/restart/shutdown).
- A React frontend with cyberpunk dark theme, sidebar nav, admin panel, clip library, social feed, messaging, scheduler, content manager, and paused screen.
- UserRole currently has: #owner, #admin, #user, #friend
- PausedScreen exists but shows a generic "App Paused" message with hardcoded copy.
- YouTube OAuth flow uses `window.location.href` redirect — no popup, so on returning from OAuth callback it re-checks the connection but sometimes shows "not connected."
- No donate/PayPal button anywhere.
- No Tester/Mod/Helper roles.
- No warnings feature for users.
- Shutdown screen message is hardcoded in PausedScreen.tsx.

## Requested Changes (Diff)

### Add
- **Donate button**: A PayPal donate button visible to all logged-in users (e.g., in the sidebar or dashboard header). The PayPal URL is configurable by the Owner only in the admin panel.
- **Shutdown/Paused screen message customization**: Admin and Owner can edit the shutdown message text shown on the PausedScreen from the admin panel (stored in backend). The message defaults to "Beast Clipping is currently down. Please wait for it to come back online."
- **New roles**: Add `#tester`, `#mod`, `#helper` to the `UserRole` variant in the backend. These can be assigned from the admin panel just like other roles.
- **Warnings system**: A warnings feature where admins can issue warnings to users (by principal). Each warning has a message and timestamp. Admins can view a user's warnings. Users can see how many warnings they have.
- **PayPal URL storage in backend**: New backend state: `var paypalUrl : Text` (owner-only get/set), and `var shutdownMessage : Text` (admin+owner get/set).

### Modify
- **PausedScreen**: Read the shutdown message from backend instead of hardcoding it.
- **UserRole type**: Extend with `#tester`, `#mod`, `#helper` variants.
- **setUserRole**: Handle the new roles — map #tester/#mod/#helper to #user permission level in AccessControl.
- **getOwnRole / getAllUserRoles**: Return new roles correctly.
- **Admin panel "Donate & PayPal" section**: Owner-only section to set the PayPal URL.
- **Admin panel "Shutdown Message" section**: Admin/Owner section to customize shutdown screen message.
- **Admin panel "Warnings" section**: Issue warnings to users, view warning history.
- **YouTube connection (ChannelConnection)**: The button click currently redirects the page via OAuth. Fix by opening the OAuth flow in a new tab/popup or ensuring the callback correctly updates state and returns user to the app. At minimum ensure connecting doesn't leave the user stuck.

### Remove
- Nothing removed.

## Implementation Plan

### Backend changes
1. Add `#tester`, `#mod`, `#helper` to `UserRole` variant.
2. Add `var paypalUrl : Text = ""` state.
3. Add `var shutdownMessage : Text = "Beast Clipping is currently down. Please wait for it to come back online."` state.
4. Add `UserWarning` type with `id`, `targetPrincipal`, `message`, `issuedBy`, `timestamp`.
5. Add `var userWarnings : [(Principal, [UserWarning])]` storage using a Map.
6. Add `getPaypalUrl()` — public query, no auth needed (so donate button works for all users).
7. Add `setPaypalUrl(url)` — owner-only.
8. Add `getShutdownMessage()` — public query, no auth needed (so paused screen works before login).
9. Add `setShutdownMessage(msg)` — admin+owner only.
10. Add `issueWarning(target, message)` — admin only.
11. Add `getWarningsForUser(target)` — admin can query any user; user can query own.
12. Add `getMyWarningCount()` — user queries own count.
13. Update `setUserRole` to handle `#tester`, `#mod`, `#helper` (all map to `#user` AccessControl permission).

### Frontend changes
1. **DonateButton component**: Fetches paypalUrl from backend, renders a PayPal donate button if URL is set.
2. Place DonateButton in sidebar/AppShell so it's visible to all logged-in users.
3. **Admin panel — Donate Settings section** (owner-only): Input + save button to set PayPal URL.
4. **Admin panel — Shutdown Message section** (admin+owner): Textarea + save button.
5. **Admin panel — Warnings section** (admin+owner): Input fields to issue warning by principal, list of warnings per user.
6. **PausedScreen**: Fetch and display `getShutdownMessage()` from backend.
7. **UserRoleBadge**: Add visual badges for tester/mod/helper roles.
8. **Role assignment UI in admin panel**: Add tester/mod/helper options to the role dropdown.
9. **YouTube fix**: Open OAuth URL in a popup window instead of full-page redirect, so the user stays on the app and the callback updates the parent window's state.
