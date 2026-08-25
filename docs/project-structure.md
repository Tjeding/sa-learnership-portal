# Project structure

| Location | Responsibility |
|---|---|
| `backend/` | Spring Boot API, Maven build, Dockerfile, runtime configuration, Flyway migrations, and backend tests. |
| `backend/src/main/java/com/tjeding/portal/` | Feature packages for auth, users/profiles, opportunities, applications, messages, notifications, reporting, reference data, security, and configuration. |
| `backend/src/main/resources/db/migration/` | Ordered PostgreSQL schema/data migrations (`V1`–`V13`). `migration-h2` exists for test-oriented compatibility. |
| `frontend/` | Vite/React client. `src/pages` holds feature screens, `layouts` role shells, `components` shared UI, `context` session state, and `styles` global tokens/components. |
| `database/diagrams/` | Draw.io ERD source and exported PNG. |
| `docker/docker-compose.yml` | PostgreSQL and backend Compose services, volumes, health check, and runtime environment. |
| `.github/workflows/` | CI and Docker-build workflow definitions. |
| `docs/` | Project documentation; older design/sprint material is retained in its existing subdirectories. |

The repository has a root `CHANGELOG.md`, an obsolete frontend-specific README, and untracked runtime/video files at the time of this audit. They are not build inputs.
