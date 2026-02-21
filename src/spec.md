# Specification

## Summary
**Goal:** Fix the admin panel route that is stuck displaying "checking permissions" indefinitely by debugging the permissions check flow and adding proper error handling.

**Planned changes:**
- Debug the admin route component in App.tsx to identify why the permissions check never resolves
- Add comprehensive error handling and 10-second timeout logic to prevent infinite loading states
- Verify the useIsOwner hook correctly handles React Query loading states and errors
- Add detailed console logging to track permissions check state transitions and render decisions

**User-visible outcome:** The admin panel loads successfully after permissions check, or displays a clear error/access denied message instead of being stuck on "checking permissions".
