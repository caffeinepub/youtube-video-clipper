# Specification

## Summary
**Goal:** Fix the Google Client ID configuration error to enable Google Account connection.

**Planned changes:**
- Configure the VITE_GOOGLE_CLIENT_ID environment variable to be properly loaded and accessible to the frontend
- Verify the Google OAuth connection flow works end-to-end
- Ensure users can successfully connect their Google/YouTube accounts and post clips

**User-visible outcome:** Users can click "Connect Google Account" without encountering the configuration error, complete the Google OAuth flow, and successfully post video clips to YouTube.
