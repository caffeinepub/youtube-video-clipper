# Beast Clipping

## Current State
Full-stack YouTube clipping dashboard with:
- SideNavigation with nav items, donate, feedback, and sign-out buttons
- ChannelConnection component — shows connect/connected state for YouTube
- DownloadClipModal — shows copy link + open YouTube, no actual device download
- FeedbackSubmissions — admin view of bug/feature reports, delete only
- AdminPanel with CreatorReports section — single "Resolve" button per report
- UserMessages / MessagesPage — in-page inbox with reply capability
- PausedScreen — "Check Again" button, no contact admin link
- ProfilePage — shows name, role, principal, clips stats, no nickname field
- WarningBanner — shows warnings at top of home dashboard via notifications
- No dedicated b3as1 YouTube channel video feed on dashboard

## Requested Changes (Diff)

### Add
- **Nickname field**: On ProfilePage and ProfileSetup, let users enter/edit a separate "nickname" field stored in their profile name or a separate alias. Show it in the sidebar and dashboard greeting.
- **b3as1 channel feed on Dashboard**: Embed a YouTube channel playlist for channel "b3as1" (channel ID: UCb3as1 or handle @b3as1) as a public section on the home dashboard visible to all users showing clickable video thumbnails via YouTube Data API or iframe embeds.
- **Disconnect YouTube button**: In ChannelConnection component and on ProfilePage, add a "Disconnect" button that clears the YouTube auth from the user's profile.
- **Collab report action menu**: In AdminPanel > CreatorReports, add action buttons per report: Warn, Ban, 1-Day Suspension, Delete Listing, Resolve — each wired to the appropriate backend call (addNotification for warn, updateUserStatus for ban/suspend, deleteCollabListing for delete listing).
- **Contact admin button on PausedScreen**: Add a "Contact Admin" button that opens an in-app feedback/contact form or copies admin contact info.
- **Message thread as Discord-style DM tab**: MessagesPage should open each conversation in a full-screen panel styled like Discord DMs (dark sidebar of conversations on left, full message thread on right with avatar, timestamps, reply input at bottom).
- **"Reply for more info" in FeedbackSubmissions**: Add a "Message User" button on each feedback submission card that pre-fills the AdminMessaging form with the submitter's principal.
- **Warning count/summary on Dashboard**: The WarningBanner is already on Dashboard — ensure it's prominent and shows warning message detail.

### Modify
- **SideNavigation buttons**: Make nav footer buttons (Report a Bug, Sign Out, Donate) smaller — reduce padding from `py-2.5` to `py-1.5`, text to `text-xs`, icons to `w-3.5 h-3.5`.
- **DownloadClipModal**: Change from "copy link + open YouTube" to actual in-browser download. Use the `generateDownloadVideoUrl` backend method to get a download URL, then trigger a programmatic `<a download>` click to download directly to device. Show a loading state while generating.
- **YouTube connect button**: The button calls `connectChannel()` which opens a popup/redirect. On desktop the popup may be silently blocked. Change to always use same-tab navigation (window.location.href) with a session storage return path. Remove the popup code path entirely to fix the "nothing happens" issue.
- **MessagesPage**: Redesign the full page layout to be Discord DM-style — left panel lists conversations, right panel shows thread with messages top-to-bottom, reply box at bottom. Use indigo/dark theming.

### Remove
- Remove the popup code path from `useYouTubeChannel.ts` connectMutation entirely (keep only same-tab nav).

## Implementation Plan
1. SideNavigation.tsx — reduce padding/size on footer buttons
2. useYouTubeChannel.ts — remove popup, use same-tab nav always; add disconnect mutation
3. ChannelConnection.tsx — add Disconnect button when connected
4. DownloadClipModal.tsx — use generateDownloadVideoUrl + programmatic download anchor
5. MessagesPage.tsx + UserMessages.tsx — redesign as Discord DM-style two-panel layout
6. FeedbackSubmissions.tsx — add "Message User" button per submission that opens AdminMessaging pre-filled
7. AdminPanel.tsx > CreatorReports — add Warn/Ban/Suspend/Delete Listing action buttons
8. PausedScreen.tsx — add "Contact Admin" button
9. ProfilePage.tsx — add nickname edit field
10. App.tsx (HomePage) — add b3as1 channel videos section on dashboard
