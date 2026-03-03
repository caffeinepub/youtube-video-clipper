# Beast Clipping

## Current State

The app is a full-stack YouTube video clipping dashboard (Beast Clipping) with:
- **Backend**: Motoko with VideoClip, UserProfile, AdminMessage, FeedbackSubmission, ScheduledUpload, ContentEntry, ActivityLog types. Methods for saving/deleting clips, user roles (owner/admin/user/friend), user status (active/inactive/banned/suspended), YouTube channel connection, Google OAuth, messaging, feedback, scheduler, content manager, admin panel.
- **Frontend**: React + Tailwind dark-mode dashboard. Pages: Home (clip creation), MyClips, Trending, Scheduler, ContentManager, Admin, Messages, OAuthCallback. Components: AdminPanel, ClipList, ClipTimestampControls, YouTubePlayer, TrendingSidebar, UserMessages, ChannelConnection, FeedbackModal, VerticalClipPreview, CaptionEditor, AppShell, BottomNavigation, SideNavigation, etc.
- VideoClip shape: `{ id, title, videoUrl, thumbnailUrl, startTime, endTime, createdAt, score }`

## Requested Changes (Diff)

### Add
- **Clip trimming & preview**: Scrub through video and set precise in/out points before saving (enhance ClipTimestampControls with visual scrubber)
- **One-click clip presets**: "Last 30s / Last 60s / Custom" quick-capture buttons in ClipTimestampControls
- **Clip queue**: Show pending/processing clips with progress indicators (new ClipQueue component + queue state)
- **Clip library**: Searchable, filterable grid of saved clips with thumbnails (enhance MyClipsPage/ClipList)
- **Tagging & categories**: Tag clips by game, streamer, moment type (funny, hype, fail) — backend needs tags field on VideoClip, new tag methods
- **Favorites / bookmarks**: Star clips to surface them later — backend needs favorites map per user
- **Direct share links**: One-click copy of a public clip URL per clip card
- **Download options**: Export in different resolutions (720p, 1080p) or formats (MP4, GIF) — UI dropdown on clip card calling existing generateDownloadVideoUrl
- **Share to Twitter/X, Discord, Reddit**: Social share buttons on each clip card
- **Reactions / upvotes**: Let viewers react to clips — backend needs reactions map per clip
- **Comments**: Simple threaded comments on clips — backend needs comments type and methods
- **Trending / Top Clips leaderboard**: Feed of most-viewed/liked clips (enhance TrendingPage with leaderboard view)
- **Notifications**: In-app toast alerts when clip finishes processing
- **Dark/light mode toggle**: Theme toggle in header/sidebar
- **Mobile-friendly clipping interface**: Ensure touch-optimized controls, already partially done via BottomNavigation
- **Clip expiry settings**: Let users choose if clips auto-delete after 7/30/90 days — backend clip needs optional expiresAt field
- **View counts per clip**: Backend needs viewCount field on VideoClip, increment on getClipById
- **Clip performance dashboard**: Views over time, top clips summary — new AnalyticsPage or section in existing admin analytics

### Modify
- **VideoClip type**: Add `tags: [Text]`, `favorites: Bool` (per-user via separate map), `viewCount: Nat`, `expiresAt: ?Time.Time`, `reactions: Nat`
- **ClipList / ClipCard**: Add tag badges, favorite star, share buttons, social share, reaction count, comment count, download dropdown
- **TrendingPage**: Add reaction-based leaderboard view alongside existing trending clips
- **AdminPanel**: Add view count stats section and clip performance analytics

### Remove
- Nothing removed, all existing functionality preserved

## Implementation Plan

1. **Backend** — Add to `main.mo`:
   - Extend `VideoClip` type with `tags`, `viewCount`, `expiresAt`, `reactions`
   - Add `ClipComment` type with `id, clipId, authorPrincipal, body, createdAt`
   - Add `userFavorites` map: `Map<Principal, Map<Text, ()>>`
   - Add methods: `addTagsToClip`, `getClipsByTag`, `toggleFavoriteClip`, `getUserFavorites`, `reactToClip`, `addComment`, `getComments`, `deleteComment`, `incrementViewCount`, `getClipViewStats`
   - Add `clipQueue` simulation via `ClipQueueItem` type with `id, clipId, status(#pending|#processing|#done), progress`

2. **Frontend** — Update/add:
   - Enhance `ClipTimestampControls` with last-30s / last-60s preset buttons and visual range scrubber
   - New `ClipQueue` component showing pending/processing clips with progress bars
   - New `TagEditor` component for adding/viewing tags on clips
   - Update `ClipCard` with: favorite star toggle, share-link copy, social share buttons (X, Discord, Reddit), download dropdown (720p/1080p, MP4/GIF), reaction button with count, comment count link
   - New `CommentsPanel` component (slide-in or modal) with threaded comments per clip
   - Enhance `ClipList` / `MyClipsPage` with search bar, filter by tag/category, favorites filter
   - New `ClipPerformanceDashboard` component (analytics page or tab) showing view counts over time
   - Add dark/light mode toggle to AppShell header and sidebar
   - Add in-app notification toasts when clip save completes
   - Ensure all clip controls are touch-friendly (larger tap targets, swipe-friendly on mobile)
