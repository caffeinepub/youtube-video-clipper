# Beast Clipping

## Current State
Full-featured video clipping app with sidebar navigation, games, admin panel, and many creator tools.

## Requested Changes (Diff)

### Add
- A new "Browser" tab in the sidebar that renders an in-app web browser experience
- Address bar with URL input, Go button, and Enter key support
- Navigation controls: Back, Forward, Refresh, Home buttons
- An iframe viewport that loads the entered URL
- A fallback message when a site blocks iframe embedding (X-Frame-Options / CSP)
- New page at route `/browser`

### Modify
- Sidebar to include a Browser entry (globe icon)

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/BrowserPage.tsx` with address bar, nav buttons, and iframe
2. Add `/browser` route in App.tsx
3. Add Browser link to sidebar navigation
