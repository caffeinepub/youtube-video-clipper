# Specification

## Summary
**Goal:** Restore all features from version 69 (user profiles, admin panel, YouTube channel connection, feedback button, trending, messaging, and social feed) while preserving the cyberpunk dark theme from version 70.

**Planned changes:**
- Restore ProfilePage with principal ID, display name, clip stats, and clip activity list; re-enable ProfileSetup modal on first login; wire up UserIdDisplay and UserRoleBadge components
- Restore full AdminPanel (owner-only) with collapsible sections: system controls, analytics, user management, admin messaging, feedback submissions, activity logs, admin list, and debug panel
- Restore ChannelConnection component on the Scheduler page showing YouTube connected/disconnected state alongside scheduled uploads and clip scheduling form
- Restore FeedbackModal trigger button in SideNavigation (desktop) and BottomNavigation (mobile) allowing Bug Report and Feature Request submissions
- Restore TrendingPage with trending clips ranked by viral score, TrendingSidebar top-5 leaderboard, and Trending nav link in both navigation components
- Restore MessagesPage with UserMessages component for viewing and replying to messages; add Messages nav item to both navigation components for authenticated users
- Restore SocialFeedPage showing recent clip activity with avatars, thumbnails, and timestamps; add Feed nav link to both navigation components
- Restore and verify all navigation links (Clips, Trending, Feed, Gallery, Profile, Messages, Scheduler) in SideNavigation and BottomNavigation with correct auth-gating and route mappings in App.tsx

**User-visible outcome:** All features present in version 69 are accessible again — users can view their profile, check trending clips, browse the social feed, send/receive messages, submit feedback, and connect their YouTube channel, all within the existing cyberpunk dark theme.
