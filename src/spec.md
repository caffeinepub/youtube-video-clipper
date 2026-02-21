# Specification

## Summary
**Goal:** Fix Google OAuth configuration to enable YouTube channel connection.

**Planned changes:**
- Configure VITE_GOOGLE_CLIENT_ID environment variable in frontend build configuration
- Verify backend Google OAuth credentials are correctly set up for callback flow
- Test complete Google account connection flow from button click through OAuth callback

**User-visible outcome:** Users can successfully click "Connect Google Account", complete the OAuth flow without errors, and see their connected YouTube channel status, enabling them to post clips to YouTube.
