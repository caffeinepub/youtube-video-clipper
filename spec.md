# Specification

## Summary
**Goal:** Fix YouTube channel connection status display, fix clip downloads, and add Principal ID visibility with copy buttons in the admin panel.

**Planned changes:**
- Fix the `useYouTubeChannel` hook and `OAuthCallback` flow so that existing stored Google OAuth credentials are correctly read and the `ChannelConnection` component shows the connected state on page load and after refresh
- Fix the `useDownloadClip` hook so that clicking the download button on a `ClipCard` fetches a valid URL from the backend and triggers a browser file download; surface error messages if the download fails
- In the admin panel's `UserStatusManagement` component, display each user's full Principal ID alongside their existing user ID, with a copy-to-clipboard button next to it
- In the admin panel's clip management section, display the clip owner's full Principal ID alongside existing owner info, with a copy-to-clipboard button next to it

**User-visible outcome:** Admins can see and copy Principal IDs for users and clips directly from the admin panel. Users will see their YouTube channel as connected after completing OAuth, and can successfully download clips from the website.
