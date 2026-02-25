# Specification

## Summary
**Goal:** Add a feature request / bug report feedback system where authenticated users can submit feedback and admins/owner can view and manage submissions.

**Planned changes:**
- Add a `FeedbackSubmission` data type in the backend with fields for id, submitter principal, user ID, submission type (Feature Request / Bug Report), title, description, and timestamp, stored in stable storage
- Expose backend functions: `submitFeedback` (any authenticated user), `getFeedbackSubmissions` (admin/owner only), and `deleteFeedbackSubmission` (admin/owner only)
- Add a "Feedback" button in the header (wired through App.tsx) visible to all authenticated users
- Add a modal form with a type selector (Feature Request / Bug Report), Title input, Description textarea, and Submit button; shows a success toast and closes on successful submission
- Add React query/mutation hooks: `useFeedbackSubmit`, `useFeedbackSubmissions`, and `useDeleteFeedback`
- Add a "Feedback Submissions" section in the AdminPanel displaying all submissions with type badge, title, description, short user ID, full principal, timestamp, and a delete action; gated to admins and owner only

**User-visible outcome:** Authenticated users can submit feature requests or bug reports via a modal form in the header. Admins and the owner can view all submissions in the Admin Panel and delete individual entries.
