# Specification

## Summary
**Goal:** Overhaul the Beast Clipping app with a Cyberpunk dark theme, advanced clip editing tools, social/profile features, a notification system, and backend support for minted collectibles and social feed.

**Planned changes:**

### UI / Theme (REQ-8)
- Apply Cyberpunk dark theme globally: deep purple (#240046) backgrounds, neon cyan (#00f2ff) accents, glassmorphism cards, neon glow buttons, and smooth CSS transitions across all pages

### Profile & Social Feed (REQ-1)
- Add a Profile page showing the logged-in user's display name, avatar, and chronological clip/action history
- Add a Social Feed page listing recent clip activity from all users (creator, clip title, viral score, timestamp)
- Add both pages to sidebar navigation

### Notification System (REQ-2)
- Add a bell icon in the header/sidebar with an unread count badge
- Clicking the bell opens a dropdown notification inbox with messages and timestamps
- New notifications appear as non-blocking toast popups
- Backend stores per-user notifications with read/unread status

### Smart Transcription & Text-to-Clip (REQ-3, REQ-4)
- After a YouTube video loads, show a scrollable transcript panel with simulated timestamped segments (mock data based on video duration)
- Clicking a transcript segment populates the clip start/end timestamp fields and highlights the selected segment

### Vertical Mode / Auto-Reframe (REQ-5)
- Add a "Vertical Mode" toggle in the clip editor that switches the preview to 9:16 aspect ratio with a center-crop overlay guide and "Auto-Reframe: Subject Centered" label

### Timeline Seek Bar (REQ-6)
- Add a custom visual seek bar below the YouTube player showing YouTube thumbnail previews on hover
- Clicking the seek bar updates the current playback timestamp displayed in MM:SS format

### One-Touch Presets (REQ-7)
- Add "Last 30s", "Last 60s", and "Auto-Highlight" preset buttons in the clip editor
- "Last 30s"/"Last 60s" set timestamps relative to current playback position
- "Auto-Highlight" uses Web Audio API to detect peak volume and auto-fills timestamps; shows a loading state

### Burn-in Captions (REQ-9)
- Add a "Burn-in Captions" toggle in the clip editor
- When enabled, animated caption overlays (bold white text on semi-transparent dark bar, fade-in) cycle through transcript segments in the clip preview

### Multi-Format Export (REQ-10)
- Add a format dropdown near the download button with "MP4 (High Res)", "GIF (Meme Format)", and "MP3 (Audio Only)" options
- Selected format label is appended to the filename; a toast confirms the export format

### Share Clip (REQ-11)
- Add a "Share Clip" button on ClipCard and in the clip editor that copies a YouTube timestamped URL to clipboard
- Add "Share to X" (Twitter intent URL) and "Share to Discord" (clipboard copy with Discord-ready message) quick-share buttons

### Hype Detection (REQ-12)
- Add a "Detect Hype" button in the clip editor that uses Web Audio API to find volume spike timestamps and renders colored clickable markers on the seek bar

### Smart Clips Panel (REQ-13)
- Add a "Smart Clips" panel that pattern-matches transcript segments for gaming keywords (Victory, Eliminated, Level Up, Kill, Win)
- Matching segments are highlighted with a badge and listed as clickable suggestions that populate timestamp fields

### TikTokify Preset (REQ-14)
- Add a "TikTokify" preset button that activates a dual-view 9:16 preview with webcam placeholder (top) and video (bottom)
- Add a "Neon Captions" toggle that renders captions in bold yellow-green (#CCFF00) with black stroke, synced to playback position

### Slow-Mo Toggle (REQ-15)
- Add a "Slow-Mo" toggle in the clip editor toolbar; when active, display a "Slow-Mo: Last 2s @ 0.5x" badge on the clip preview

### Send to Discord (REQ-16)
- Add a "Send to Discord" button on ClipCard and in the clip editor
- Clicking opens a form with a webhook URL input; on submit, POSTs a formatted clip message to the webhook via frontend fetch

### Meme Overlay Panel (REQ-17)
- Add a collapsible "Meme Overlays" panel in the clip editor with sound effect buttons (Airhorn, Bruh, Mission Failed, Victory Royale) using Web Audio API synthesized tones
- Include green-screen overlay buttons that toggle a color tint on the clip preview

### Mint to Gallery (REQ-18)
- Add a "Mint to Gallery" button on ClipCard and in the clip editor that calls a backend endpoint to store clip metadata as a permanent collectible
- Minted clips display a "Minted ✓" neon cyan badge
- Add a "My Gallery" page listing all minted collectibles for the logged-in user

### Backend Updates (REQ-19)
- Add `Notification` type (id, recipientPrincipal, message, notificationType, timestamp, isRead) with methods: `getMyNotifications`, `markNotificationRead`
- Add `MintedCollectible` type (clipId, videoId, title, startTime, endTime, viralScore, mintedAt, ownerPrincipal) with methods: `mintClip`, `getMintedCollectibles`
- Add social feed storage and `getSocialFeed` method returning the 50 most recent clip creation events across all users

**User-visible outcome:** Users get a fully redesigned Cyberpunk dark UI with glassmorphism styling, an extensive clip editing suite (transcription, captions, hype detection, presets, TikTokify, slow-mo, meme overlays, multi-format export), social profile and feed pages, an in-app notification inbox, Discord/X sharing, and a Web3-inspired gallery for minted clips.
