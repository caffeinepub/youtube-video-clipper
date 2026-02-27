# Specification

## Summary
**Goal:** Remove YouTube role restrictions, add banned/suspended blocking screens, and fix the YouTube OAuth connection flow in the Beast Clipping app.

**Planned changes:**
- Remove all role-based access checks from YouTube-related UI components (channel connection, video URL input, YouTube player, clip suggestions, clip creation, post-to-YouTube) so all authenticated users can use them regardless of role
- Add a full-screen blocking error page for users with `banned` or `suspended` account status, enforced at the app layout level so it cannot be bypassed
- Fix the YouTube OAuth callback flow to wait for the backend actor to be fully initialized before storing credentials, correctly persist OAuth credentials in the backend, and invalidate relevant React Query caches (channel connection status, OAuth credential status) after a successful save

**User-visible outcome:** All logged-in users can access YouTube features regardless of role; banned/suspended users see a clear blocking error screen instead of the app; and connecting a YouTube channel via Google OAuth now correctly persists and shows as connected without reverting.
