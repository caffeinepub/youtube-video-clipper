# Beast Clipping

## Current State
Full-stack YouTube clipping app with dark cyberpunk UI, clip management, admin panel, messaging, feedback/bug reports, user roles, scheduled uploads, trending clips, and a social feed. Backend uses Motoko with authorization, blob-storage, and http-outcalls components.

## Requested Changes (Diff)

### Add
- **Creator Collab Finder** — A new page/section where users can browse and discover other creators to collaborate with. Users can post a "collab listing" (niche, description, contact info/principal) and browse listings from others.
- **Report User feature** — A "Report" button on each collab listing (and optionally on user profiles) that submits a report against another user. Reports include: reported user's principal, reporter's principal, reason/description, and timestamp.
- **Admin: Reports Viewer** — A new section in the Admin Panel showing all submitted reports (reporter, reported user, reason, timestamp) with ability to dismiss/resolve them.

### Modify
- Backend: add `CollabListing` type and `CreatorReport` type with corresponding CRUD functions.
- Admin panel frontend: add "Reports" tab showing submitted creator reports.
- App navigation: add "Collab" nav link to AppShell sidebar/bottom nav.
- App router: add `/collab` route rendering the new CollabFinder page.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `CollabListing` and `CreatorReport` types to `main.mo` with full CRUD:
   - `postCollabListing(niche, description, contactInfo)` — authenticated users
   - `getCollabListings()` — any authenticated user
   - `deleteCollabListing(id)` — listing owner or admin
   - `reportCreator(reportedPrincipal, reason, description)` — authenticated users
   - `getCreatorReports()` — admin only
   - `resolveCreatorReport(id)` — admin only
2. Regenerate `backend.d.ts` to expose new functions.
3. Build `CollabFinderPage.tsx` — grid of collab listings with a "Post Listing" modal and a "Report" button on each card.
4. Build `ReportUserModal.tsx` — modal form for submitting a report (reason dropdown + description).
5. Update `AdminPanel.tsx` — add a "Reports" tab showing all creator reports with resolve action.
6. Update `AppShell.tsx` — add "Collab" navigation item.
7. Update `App.tsx` router — register `/collab` route.
