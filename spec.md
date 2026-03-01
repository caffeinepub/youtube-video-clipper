# Specification

## Summary
**Goal:** Fix the YouTube posting spinner, restore the bug report button, improve the messaging system with internal tabs and User ID display, add a global reply feature, and introduce an admin Pause/Resume toggle for the Beast Clipping app.

**Planned changes:**
- Fix the infinite loading spinner in the YouTube post flow so that clicking "Post to YouTube" on a ClipCard resolves with a success or error toast, and the clip is actually submitted to the connected YouTube channel via the backend.
- Re-add the "Report a Bug / Request a Feature" button to the sidebar (desktop) and bottom nav/floating button (mobile) for all authenticated users, opening the existing FeedbackModal.
- Update UserMessages so that clicking a message opens it in a new in-app tab or detail panel without leaving the app.
- Replace external download links with an in-app download mechanism using the `useDownloadClip` hook to trigger a browser download via a programmatic anchor click.
- Display all messages using the short 8-character User ID (from `userIdGenerator.ts`) instead of raw principal strings, in both sent and received views.
- Add a global "Reply" button/input to each message in UserMessages, allowing the recipient to reply to the original sender; replies are stored in the backend and visible in the thread.
- Add a Pause/Resume toggle to the Admin Panel (SystemControls area) requiring admin/owner authentication; when paused, regular users see a maintenance screen and cannot use the app; the pause state is persisted in a stable backend variable with `setPauseState` and `getAppStatus` methods.
- Generate a `migration.mo` to account for the new stable pause state variable in the backend.

**User-visible outcome:** Admins can pause and resume the app from the admin panel; all users see short User IDs in messages and can reply to messages in-app; clips can be posted to YouTube without spinner issues; files download directly in the browser; and a bug/feature report button is accessible from the main navigation.
