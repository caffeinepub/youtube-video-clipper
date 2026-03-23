# Beast Clipping

## Current State
Full-stack creator platform with 20+ pages including clips, admin panel, games (Snake/Pong/Tetris/2048/Memory), YouTube Studio, community hub, leaderboard, and more. Backend has 55 functions covering auth, clips, YouTube, messaging, notifications, collab, scheduling, and content management.

## Requested Changes (Diff)

### Add
- **Unified Game Leaderboard backend**: submitGameScore(gameId, score), getGameLeaderboard(gameId), getAllGameLeaderboard(), flagLeaderboardEntry(entryId), editLeaderboardScore(entryId, newScore), wipeGameLeaderboard(gameId)
- **RPG Progression backend**: addXP(amount), getUserProgression(user), claimDailyLogin(), claimDailyQuest(questId), getPlayerStats()
- **Clip Coins economy backend**: getClipCoins(), spendClipCoins(amount, reason), earnClipCoins(amount, reason)
- **Game Hub page** (`/games`): Dedicated page with 6 playable mini-games (Neon Drift, Timber Chop, Math Dash, Space Junk, Word Flash, Gravity Flip) using Canvas API, each submitting scores to unified leaderboard
- **Progression page** (`/progression`): XP bar, level display, class selector (The Editor / The Scout / The Viralist), skill tree, daily quests, 7-day streak tracker, achievement hunter (20+ achievements), prestige mode, milestone chests
- **Collectibles page** (`/collectibles`): Avatar shop (Clip Coins currency), UI skin switcher (Cyberpunk/Retro/Neon), sound packs, The Vault (Hall of Fame clips), sticker collection, legacy badges
- **Seasons page** (`/seasons`): Season Pass (Free/Premium tracks), themed season display, season leaderboard, exclusive emotes, limited quests, community patch notes voting
- **Economy widgets**: Daily login bonus popup, Clip Coins balance in header, discount wheel
- **Admin Leaderboard God Mode**: New tab in Admin Panel - search by game dropdown, score table with inline edit, Clear Leaderboard button, flag user toggle (sets is_flagged=true for all entries)
- **Easter egg**: Type "Beast" anywhere to unlock secret Beast Mode

### Modify
- Admin panel: Add "Game Leaderboards" tab with God Mode controls
- Sidebar nav: Add Games, Progression, Collectibles, Seasons links
- Header/nav: Show Clip Coins balance and XP level badge

### Remove
- Nothing removed

## Implementation Plan
1. Extend Motoko backend with leaderboard, XP/progression, and clip coins functions
2. Add new frontend pages: GameHub, Progression, Collectibles, Seasons
3. Add 6 playable Canvas games in GameHub with score submission
4. Add daily login bonus modal and coins display
5. Add Admin Leaderboard God Mode tab
6. Wire Easter egg "Beast" mode
