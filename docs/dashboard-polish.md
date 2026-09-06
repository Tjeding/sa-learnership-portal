# Dashboard and inbox fixes

## Implemented

- Header notification/message links resolve to absolute account-role routes, including nested pages. Admin routes and sidebar entries now exist.
- Shared unread counts refresh every 15 seconds, on window focus, and when messages or notifications are read. No demo notification badge remains.
- Messaging supports choosing contacts, starting conversations, replying, search, per-conversation drafts, periodic incoming-message refresh, read indicators, error recovery and responsive layouts.
- Provider application and shortlisted-candidate actions open the relevant opportunity conversation.
- Incoming-message reads and unread totals are scoped to the authenticated participant. Sending no longer marks a message read for its recipient. Conversation creation validates recipient roles, self-messaging, active recipients and opportunity ownership.
- Admin support conversations use migration V14, which changes conversation participant foreign keys to reference user accounts while preserving existing conversations.
- Sign-in uses the role returned by the server. Registration/sign-in update React state immediately. Protected routes wait for startup account loading. Authenticated API requests share token refresh and clear expired sessions.
- Authentication failures return HTTP 401; deactivated accounts cannot refresh tokens.
- Opportunity details persist bookmarks and recognise existing applications.
- Mobile navigation, keyboard focus, inbox empty states and a real not-found page replace broken navigation and misleading fallbacks.
- Account settings show the actual account. Fabricated qualifications, skills and qualification suggestions were removed. Unsupported settings and content-editing controls no longer imply that changes can be saved.

## Validation

- `cd frontend; npm test`: nine tests cover role-specific nested navigation, sidebar badge behaviour, login without role selection, token rotation, concurrent refresh and expired sessions.
- `cd frontend; npm run build`: production build passes.
- `cd frontend; npm run lint`: no errors; two Fast Refresh export warnings in React context modules.
- `cd backend; mvn -Dtest=MessageServiceTest test`: six messaging service regression tests pass.
- Full `mvn test` could not run the existing PostgreSQL persistence test because Testcontainers could not connect to a working Docker environment. No integration test was disabled.

## Runtime and remaining work

Restart the backend so Flyway applies `V14__support_conversations.sql` before using admin support conversations. This migration targets the normal PostgreSQL configuration; it has not been exercised against a live database in this pass.

Full browser end-to-end testing with real applicant, provider and admin accounts remains necessary. The checks above do not establish that every application feature is defect-free.

Password reset/change, email changes, notification delivery preferences, qualification/skill editing, site-content editing, runtime system configuration and audit-history UI remain unimplemented. Their previous mock controls were removed or replaced with honest availability information. They require further product/backend work, rather than pretending to save browser-only state.
