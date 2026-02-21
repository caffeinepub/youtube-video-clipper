# Specification

## Summary
**Goal:** Enable users to connect their Google account and automatically post clips to their YouTube channel.

**Planned changes:**
- Implement Google OAuth 2.0 authentication flow in the backend to allow users to connect their Google accounts and authorize YouTube channel access
- Modify the ChannelConnection component to use real Google OAuth instead of mock implementation, displaying connected Google account and YouTube channel information
- Update the postToYouTube backend method to automatically post clips to the user's connected YouTube channel using stored OAuth credentials
- Add backend validation to ensure users have connected their Google account before allowing YouTube posts
- Update the ClipCard component to disable the YouTube post button with a helpful message when no Google account is connected

**User-visible outcome:** Users can connect their Google account through the ChannelConnection component, and when they click the post button on a clip, it will automatically post to their connected YouTube channel without manual interaction. If not connected, they'll see a disabled button with instructions to connect first.
