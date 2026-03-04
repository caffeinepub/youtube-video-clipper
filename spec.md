# Beast Clipping

## Current State

Full-stack YouTube video clipping app with:
- Dashboard with video URL input, YouTube player, AI clip suggestions, clip timestamp controls, caption editor, clip list, vertical 9:16 preview, clip queue, trending sidebar, user messages
- Side navigation + bottom nav (mobile), AppShell with profile section
- Clip library (searchable, filterable grid), tagging, favorites, reactions, comments, social sharing, download options, clip expiry
- User profiles (name, role, status, profile picture, YouTube auth)
- Roles: owner, admin, user, friend; Statuses: active, inactive, banned, suspended
- Admin panel: user/clip management, messaging, server controls, activity logs, analytics, feedback submissions, content manager, admin list management
- YouTube channel connection (OAuth flow), scheduling, post clips to YouTube Shorts
- Report a Bug / Request a Feature modal (FeedbackModal)
- In-app notifications via toast (sonner)
- Google OAuth credentials storage
- Banned/suspended users shown error screen (AccountStatusGuard)
- All styles: dark mode (#0B0E14), glassmorphism, indigo-500 accents

## Requested Changes (Diff)

### Add

**User Profiles & Social Feed**
- Profile page showing user activity history (clips created, clips viewed, reactions given)
- Social feed on dashboard showing recent clip activity from all users (new clips saved, trending clips)

**In-App Notification System**
- Notification bell icon in header with unread count badge
- Notification panel/dropdown with list of alerts (clip processed, someone reacted to your clip, new message received, system announcements)
- Backend: store notifications per user, mark as read

**Smart Transcription (UI only - simulated)**
- When a video is loaded, show a "Generate Transcript" button
- Display simulated timestamped transcript below the player
- Allow users to click a transcript line to set clip start/end points (Text-to-Clip)

**Auto-Reframe / Vertical Mode Toggle**
- Toggle button on ClipTimestampControls labeled "Vertical Mode (9:16)"
- When enabled, the VerticalClipPreview shows a cropped centered view indicator

**One-Touch Presets (already partially exists)**
- Ensure "Last 30s", "Last 60s", and "Auto-Highlight" preset buttons are visible and working in ClipTimestampControls

**Timeline Scrubbing**
- Visual waveform-style seek bar in the ClipTimestampControls (CSS bars representing intensity)

**Cyberpunk/Neon theme update**
- Accent color shift from indigo to neon cyan (#00f2ff) with deep purples (#240046) dark backgrounds
- Update index.css CSS variables and tailwind config

**Caption Overlays (Burn-in Captions)**
- Button "Burn-in Captions" in CaptionEditor that animates the caption text in the VerticalClipPreview

**Multi-Format Export dropdown**
- Replace/augment the download button with a dropdown: MP4 (High Res), GIF (Meme), MP3 (Audio)

**Direct Share**
- "Share to X" and "Share to Discord" buttons on each ClipCard that generate a share URL

**Hype-Detection**
- "Detect Hype" button in ClipSuggestions that simulates finding audio peaks and shows markers

**TikTokify / Dual-View Layout preset**
- Button "TikTokify" in ClipTimestampControls that sets the vertical mode and applies neon caption style

**Gamer / Neon Caption style**
- Toggle "Neon Captions" in CaptionEditor (yellow/green bold text with black stroke)

**Speed Ramping (Slow-Mo)**
- Toggle "Slow-Mo last 2s" in ClipTimestampControls (UI label only - indicates the effect will be applied)

**Discord Webhook Integration**
- "Send to Discord" button on clips - opens a small modal to enter a webhook URL and send

**Asset / Meme Overlay Library**
- New sidebar section or modal with sound effect overlays: Airhorn, Bruh, Mission Failed
- Click to "apply" overlay to current clip (UI state)

**Mint to Gallery (Web3)**
- "Mint to Gallery" button on each ClipCard
- Backend: store minted clips list per user with ICP timestamp
- Show minted badge on clips that have been minted

**Admin Panel: Links Manager**
- New tab in admin panel "Links" where admins/owner can add, edit, delete public links
- Links shown in a "Pinned Links" section visible to all users (sidebar or dashboard banner)
- Backend: store links array with title + url fields

**Fix YouTube connection**
- YouTube connection flow: when OAuth returns, store tokens and show connected state
- Fix the "connecting then disconnected" loop by persisting auth state properly in frontend

### Modify

- AppShell/SideNavigation: add Notifications bell with badge
- AppShell/SideNavigation: add Profile link
- HomePage: add social activity feed section
- ClipTimestampControls: add preset buttons, waveform scrubber, vertical mode toggle, slow-mo toggle, TikTokify button
- CaptionEditor: add neon caption style toggle, burn-in captions button
- ClipCard: add Share to X/Discord, Mint to Gallery button, minted badge
- AdminPanel: add Links tab

### Remove

- Nothing removed

## Implementation Plan

**Backend additions:**
1. `Notification` type + per-user notification store
2. `addNotification`, `getMyNotifications`, `markNotificationsRead` functions
3. `MintedClip` type + `mintClip`, `getMintedClips` per user
4. `AdminLink` type + `addAdminLink`, `getAdminLinks`, `deleteAdminLink`, `updateAdminLink` for admin link manager

**Frontend additions:**
1. Update theme: neon cyan accents, cyberpunk deep purples
2. NotificationBell component + notification panel
3. ProfilePage component (activity history)
4. SocialFeed component on homepage
5. TranscriptPanel component (simulated transcript with click-to-clip)
6. Update ClipTimestampControls: waveform scrubber CSS, presets, vertical mode, slow-mo, TikTokify
7. Update CaptionEditor: neon caption toggle, burn-in captions
8. Update ClipCard: share to X/Discord, mint button + badge
9. DiscordShareModal component
10. MemeOverlayLibrary component/sidebar section
11. AdminPanel: add Links tab with CRUD UI
12. PinnedLinks component for sidebar/dashboard
13. Fix YouTube connection persistence logic in ChannelConnection
