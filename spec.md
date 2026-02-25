# Specification

## Summary
**Goal:** Fix the OAuthCallback page so it waits for the actor to initialize before attempting the OAuth code exchange, instead of immediately failing with "Actor not available."

**Planned changes:**
- Modify `frontend/src/pages/OAuthCallback.tsx` to show a loading indicator while the actor is initializing
- Add a wait/retry mechanism (e.g., using React Query's `enabled` flag or a polling strategy) so the OAuth code exchange is only attempted once the actor is confirmed available
- If the actor becomes available within a reasonable timeout, proceed with the OAuth flow normally
- If the actor remains unavailable after the timeout, show a clear error with a retry option instead of immediately failing

**User-visible outcome:** A logged-in user completing the Google OAuth redirect flow will no longer see the "Connection Failed / Actor not available" error. Instead, they will see a loading state while the actor initializes, and the OAuth connection will complete successfully once the actor is ready.
