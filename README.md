# SA Learnerships & Skills Development Portal

A full-stack portal for South African learnership and skills-development opportunities. Applicants can create an account, maintain a profile, browse opportunities, apply, save opportunities, receive recommendations, and communicate with providers. Providers can maintain their organisation, publish and manage listings, and process applications. Administrators can oversee users, opportunities, applications, and reports.

It is built as a React/Vite SPA backed by a Java 21 Spring Boot REST API and PostgreSQL. The project addresses the fragmented process of finding programmes and managing applications by keeping opportunity discovery, application workflow, and role-specific administration in one system.

## 🎥 Project Demo

> A demonstration video will be added here.

<!-- Replace this section with the GitHub-hosted project demo video once available. -->

## Implemented capabilities

- Applicant registration/login, profile, CV/image upload, applications, saved opportunities, recommendations, notifications, messages, and dashboard routes.
- Provider registration/login, organisation profile, opportunity CRUD, application shortlist/reject/offer actions, reports, notifications, messages, and dashboard routes.
- Administrator user/application views, opportunity approval/rejection, dashboard and reports.
- JWT authentication, BCrypt password hashing, refresh-token rotation, role-based API security, Flyway PostgreSQL migrations, OpenAPI/Swagger UI, Docker Compose, and backend CI.

Some navigation screens have no matching backend management endpoint (notably admin settings/audit, general settings, and mutation controls for content/NQF reference data). See [frontend limitations](docs/frontend.md).

## Technology stack

| Area | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8, CSS, lucide-react |
| Backend | Java 21, Spring Boot 3.3.5, Spring MVC, JPA, Security, Validation |
| Data | PostgreSQL 16, Flyway, H2 test migrations |
| API/security | REST, JWT/JJWT, springdoc OpenAPI, BCrypt |
| Build/test | Maven, npm, JUnit 5, Testcontainers |
| Containers/automation | Docker/Compose, GitHub Actions |

## Quick start

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
docker compose -f docker/docker-compose.yml up -d postgres
cd backend; mvn spring-boot:run
```

In another terminal run `cd frontend; npm ci; npm run dev`. Visit `http://localhost:5173`; the API normally uses `http://localhost:8080`. Read [installation](docs/installation.md) before using this in a fresh environment, especially the Docker Compose backend configuration note.

## Architecture

Browser → React SPA → Spring Boot REST API → JPA/Flyway → PostgreSQL. Files are stored under the configured backend upload directory. See [architecture](docs/architecture.md).

## Documentation

| Document | Description |
|---|---|
| [Installation](docs/installation.md) | Fresh-machine setup and verification |
| [Configuration](docs/configuration.md) | Environment variables and config files |
| [Architecture](docs/architecture.md) | Components, request flow, integrations |
| [Project structure](docs/project-structure.md) | Repository organisation |
| [Backend](docs/backend.md) | Spring API implementation |
| [Frontend](docs/frontend.md) | React application and current limitations |
| [Database](docs/database.md) | Schema, migrations, relationships |
| [API](docs/api.md) | Endpoint catalogue and conventions |
| [Authentication](docs/authentication.md) | JWT lifecycle |
| [Authorization](docs/authorization.md) | Roles and protected routes |
| [Testing](docs/testing.md) | Tests and available checks |
| [Deployment](docs/deployment.md) | Compose path and deployment gap |
| [CI/CD](docs/ci-cd.md) | GitHub workflows |
| [Troubleshooting](docs/troubleshooting.md) | Common project-specific issues |
| [Development guide](docs/development-guide.md) | Adding/changing features safely |
| [Contributing](docs/contributing.md) | Recommended contribution workflow |
| [User guide](docs/user-guide.md) | Role-specific workflows |
| [Security](docs/security.md) | Controls and security gaps |
| [Changelog](docs/changelog.md) | Git-history summary |

## Repository layout

`backend/` contains the Spring API and Flyway migrations; `frontend/` contains the SPA; `docker/` contains Compose; `database/` contains the ERD; `.github/workflows/` contains automation. See [the detailed structure guide](docs/project-structure.md).

## Screenshots

> Screenshots can be added here when curated project images are available.

## API and testing

With the backend running, Swagger UI is at `http://localhost:8080/swagger-ui.html`. The endpoint catalogue is in [API documentation](docs/api.md). Run `cd backend && mvn test`; run `cd frontend && npm run lint && npm run build` for the frontend checks.

## Deployment and contributions

Deployment is not yet automated beyond image building; see [deployment](docs/deployment.md). Follow [contributing](docs/contributing.md) for recommended changes.
