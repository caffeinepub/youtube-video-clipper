# Specification

## Summary
**Goal:** Implement AI-powered automatic clip generation functionality that analyzes YouTube videos and suggests viral-worthy clips.

**Planned changes:**
- Create backend function to generate 3-5 clip suggestions per video with timestamps, titles, and viral scores
- Implement frontend hook using React Query to call the clip generation backend method
- Add "Generate AI Clips" button to VideoUrlForm that triggers automatic clip generation
- Update App.tsx to manage and display AI-generated clip suggestions in the ClipSuggestions component

**User-visible outcome:** Users can click a "Generate AI Clips" button after entering a YouTube URL to automatically receive 3-5 suggested clips with timestamps, titles, and viral scores, which appear in the clip suggestions list.
