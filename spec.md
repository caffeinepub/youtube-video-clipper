# Specification

## Summary
**Goal:** Build a premium dark-mode full-stack dashboard ("Beast Clipping Dashboard") with an admin panel, role-aware navigation, clip management, AI caption editor, YouTube scheduler, trending feed, and backend system controls.

**Planned changes:**

**Theme & Layout**
- Apply a consistent dark-mode theme across the entire app: base background #0B0E14, glassmorphism cards (semi-transparent, backdrop-blur, subtle border), indigo accents, Space Grotesk and Inter fonts
- Implement a responsive AppShell: fixed sidebar on desktop (md+) with user avatar, display name, time-based greeting, and role badge; persistent bottom navigation bar on mobile
- Both nav components are role-aware and highlight the active route

**Dashboard Components**
- Add a Vertical Clip Preview component (9:16 aspect ratio) showing clip thumbnail, title, time range, duration, and color-coded viral score badge; placed prominently on the main dashboard
- Enhance the AI caption editor: fully editable textarea with live character count, formatting hints, and glassmorphism card wrapper
- Enhance the YouTube upload scheduler page: clip selector, scheduled date/time picker, list of scheduled uploads with delete option, and YouTube channel connection status badge

**Trending & Content Manager Pages**
- Build/enhance the Trending in Niche page: ranked leaderboard grid of clips with creator info, trend scores, rank badges, top-3 visual distinction (gold/silver/bronze), loading skeletons, and empty state
- Build the Content Manager page (manager/admin/owner roles only): CRUD table/card list with inline/modal edit forms, add-new-entry form, and delete confirmation dialogs

**Admin Panel (admin/owner only)**
- User & Clip Management: searchable user table with Ban/Unban toggles; batch clip deletion tool by user ID
- System Controls: Restart Server and Shutdown Server buttons with confirmation dialogs wired to backend
- Analytics: auto-refreshing (15s) activity log table, click-tracking counter card, "Videos Per Hour" bar chart using Recharts
- Support Messaging: form to send a direct message to a user by User ID via `useSendAdminMessage`

**Backend (Motoko — main.mo)**
- Add `restartServer()` owner-only function: resets mutable counters, logs action to activityLogs, returns confirmation string
- Add `shutdownServer()` owner-only function: logs event to activityLogs, returns confirmation string
- Add `deleteClipsByUser(userId)` admin/owner-only function: removes all clips for the given user from the clips map
- Add `getClickStats()` query: returns total count of download/post activity log entries
- Add `getVideosPerHour()` query: returns array of `{hour, count}` records for the last 24 hours based on activityLogs

**User-visible outcome:** Users get a polished dark-mode dashboard with role-based navigation, a vertical clip preview, editable AI captions, a YouTube upload scheduler, a trending creator feed, and a content manager. Admins and owners gain a gated admin panel with user management, batch clip deletion, system control buttons, real-time analytics charts, and direct user messaging.
