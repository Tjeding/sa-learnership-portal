# Authorization

Spring Security is stateless. Prefix rules require `ROLE_APPLICANT` for `/api/v1/applicant/**`, `ROLE_PROVIDER` for `/api/v1/provider/**`, and `ROLE_ADMIN` for `/api/v1/admin/**`; messages and notifications require authentication. Public routes include auth lifecycle routes, reference data, public opportunities, ping, OpenAPI, Actuator, and uploads.

| Capability | Applicant | Provider | Admin |
|---|:---:|:---:|:---:|
| Browse approved opportunities/reference data | ✓ | ✓ | ✓ |
| Maintain applicant profile, apply, save, recommendations | ✓ | — | — |
| Maintain organisation and own opportunities | — | ✓ | — |
| Review own opportunity applications | — | ✓ | — |
| Approve/reject opportunities and view system applications/users | — | — | ✓ |
| Read own notifications/messages | ✓ | ✓ | ✓ |

Service methods additionally restrict ownership (for example a provider acts only on its listings/applications and an applicant on its own profile/application). Client-side route guards are usability controls, not security boundaries.
