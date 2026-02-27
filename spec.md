# Specification

## Summary
**Goal:** Fix the YouTube/Google OAuth connection flow so that after a successful OAuth callback the connection state is correctly persisted and remains connected in the UI.

**Planned changes:**
- Fix the OAuthCallback page to wait for backend actor initialization before processing and storing OAuth credentials, and surface a clear error if the actor is not ready in time.
- After the `storeGoogleOAuthCredentials` mutation succeeds, invalidate and refetch all YouTube connection-related React Query cache entries so the UI immediately reflects the connected state.
- Ensure the `ChannelConnection` component correctly reads and displays the persisted OAuth connection status from the backend without reverting to disconnected.
- Redirect to the main page after successful credential storage with the connection state already set to connected.

**User-visible outcome:** After completing the Google OAuth consent flow, the YouTube channel shows as connected and remains connected — including after a page refresh — without flickering back to a disconnected state.
