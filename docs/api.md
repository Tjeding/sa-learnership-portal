# API reference

The base path is `/api/v1`. Implementation-generated API metadata is available at `/swagger-ui.html` and `/v3/api-docs` while the backend runs. Most JSON controller responses use `ApiResponse`, with `success`, `data`, `error`, and `timestamp` fields. The global exception handler maps validation/business-rule errors to 400, invalid login credentials to 401, forbidden/domain access errors to 403, missing resources to 404, and unexpected errors to 500. Spring Security may produce its own response for requests rejected before reaching a controller. Successful JSON controller methods return 200 unless noted; registration returns 201. Report-export endpoints stream CSV or PDF rather than returning `ApiResponse`. `Bearer JWT` means `Authorization: Bearer <accessToken>`.

## Auth and platform

| Method | URL | Auth | Request/query | Purpose |
|---|---|---|---|---|
| GET | `/ping` | Public | — | API availability. |
| POST | `/auth/register` | Public | `role`, `email`, `password`; applicant names or provider organisation/type fields | Register applicant/provider and issue tokens. |
| POST | `/auth/login` | Public | `email`, `password` | Issue access/refresh tokens. |
| POST | `/auth/refresh-token` | Public | `refreshToken` | Rotate refresh token and issue pair. |
| POST | `/auth/logout` | Public | `refreshToken` | Revoke stored refresh token if present. |
| GET | `/auth/me` | Bearer | — | Current id, email, role, verification and display name. |

```json
{ "email": "person@example.co.za", "password": "at-least-eight-characters" }
```

## Public/reference data

| Method | URL | Auth | Parameters | Purpose |
|---|---|---|---|---|
| GET | `/opportunities` | Public | — | Approved opportunity summaries. |
| GET | `/opportunities/{id}` | Public | `id` path | Approved opportunity detail. |
| GET | `/reference/sectors` | Public | — | Sectors. |
| GET | `/reference/nqf-levels` | Public | — | NQF levels. |
| GET | `/reference/qualifications` | Public | — | Qualification types. |
| GET | `/reference/skills` | Public | — | Skills. |

## Applicant endpoints

All require the applicant role.

| Method | URL | Request/query | Purpose |
|---|---|---|---|
| GET | `/applicant/dashboard` | — | Applicant dashboard. |
| GET | `/applicant/profile` | — | Read current profile. |
| PUT | `/applicant/profile` | Names required; optional 13-digit `idNumber`, contact/location/bio | Update profile. |
| POST | `/applicant/profile/cv` | multipart `file` | Upload CV. |
| POST | `/applicant/profile/image` | multipart `file` | Upload profile image. |
| GET | `/applicant/applications` | — | List applications. |
| POST | `/applicant/applications` | `opportunityId`, optional `coverNote` | Submit application. |
| POST | `/applicant/applications/{id}/withdraw` | `id` path | Withdraw own application. |
| GET | `/applicant/saved-opportunities` | — | Saved opportunity summaries. |
| POST | `/applicant/saved-opportunities/{opportunityId}` | path | Save opportunity. |
| DELETE | `/applicant/saved-opportunities/{opportunityId}` | path | Remove saved opportunity. |
| GET | `/applicant/recommendations` | — | Skill/NQF recommendations. |

```json
{ "opportunityId": 42, "coverNote": "Optional note" }
```

## Provider endpoints

All require the provider role.

| Method | URL | Request/query | Purpose |
|---|---|---|---|
| GET | `/provider/dashboard` | — | Provider dashboard. |
| GET | `/provider/organisation` | — | Read organisation. |
| PUT | `/provider/organisation` | Organisation/type required; other profile fields optional | Update organisation. |
| GET | `/provider/opportunities` | — | List own listings. |
| POST | `/provider/opportunities` | Opportunity payload | Create own listing. |
| PUT | `/provider/opportunities/{id}` | Opportunity payload | Update own listing. |
| DELETE | `/provider/opportunities/{id}` | path | Delete own listing. |
| GET | `/provider/applications` | — | Applications to own listings. |
| POST | `/provider/applications/{id}/shortlist` | path | Shortlist application. |
| POST | `/provider/applications/{id}/reject` | path | Reject application. |
| POST | `/provider/applications/{id}/offer` | path | Offer application. |
| GET | `/provider/reports/application-volume` | — | Application-volume data filtered by provider organisation name. |
| GET | `/provider/reports/placement-success` | — | Placement-success rows for sectors used by the provider; counts are not provider-filtered. |
| GET | `/provider/reports/status-funnel` | — | Funnel rows for sectors used by the provider; counts are not provider-filtered. |
| GET | `/provider/reports/export/{reportType}` | `format` default `csv`; allowed values `csv`/`pdf` | Download a CSV/PDF generated from system-wide report methods. |

Opportunity creates/updates require `title`, `description`, `opportunityType`, `positionsAvailable` (minimum 1), and a future `closingDate`; sector/NQF, stipend, location, duration, `requirements`, `skillIds`, and `saveAsDraft` are optional.

## Administrator endpoints

All require the admin role.

| Method | URL | Request/query | Purpose |
|---|---|---|---|
| GET | `/admin/dashboard` | — | System dashboard. |
| GET | `/admin/users` | — | User summaries. |
| GET | `/admin/opportunities` | optional `status` | All opportunities. |
| POST | `/admin/opportunities/{id}/approve` | path | Approve listing. |
| POST | `/admin/opportunities/{id}/reject` | `{ "reason": "..." }` | Reject listing. |
| GET | `/admin/applications` | — | All applications. |
| GET | `/admin/reports/application-volume` | — | System application volume. |
| GET | `/admin/reports/placement-success` | — | System placement success. |
| GET | `/admin/reports/status-funnel` | — | System status funnel. |
| GET | `/admin/reports/custom-view` | optional `fromDate`, `toDate`, `sector`, `opportunityType`, `groupBy` (default `month`) | Filtered report. |
| GET | `/admin/reports/export/{reportType}` | `format` default `csv` | Download report export. |

## Notifications and messages

| Method | URL | Auth | Request/query | Purpose |
|---|---|---|---|---|
| GET | `/notifications` | Bearer | — | Current user notifications. |
| GET | `/notifications/unread-count` | Bearer | — | Unread notification count. |
| PATCH | `/notifications/{id}/read` | Bearer | path | Mark owned notification read. |
| PATCH | `/notifications/mark-all-read` | Bearer | — | Mark all current-user notifications read. |
| GET | `/messages/unread-count` | Bearer | — | Unread-message count. |
| GET | `/messages/conversations` | Bearer | — | List conversations. |
| POST | `/messages/conversations` | Bearer | `recipientId`, optional `opportunityId` | Find/create conversation. |
| GET | `/messages/conversations/{conversationId}/messages` | Bearer | path | Conversation messages. |
| POST | `/messages/conversations/{conversationId}/messages` | Bearer | non-blank `body` | Send message. |

Messages/notifications require authentication; service logic enforces participant/ownership access. `/uploads/**`, Swagger/OpenAPI, and Actuator are currently public per `SecurityConfig`.
