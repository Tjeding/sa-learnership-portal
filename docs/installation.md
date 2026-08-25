# Installation

## Prerequisites

Install Git, Node.js compatible with Vite 8, npm, JDK 21, Maven, and Docker Desktop (for PostgreSQL and the backend test container). PostgreSQL 16 is used by Compose and tests. The backend has no Maven Wrapper and does not declare a minimum Maven version; its Docker build uses Maven 3.9 with Eclipse Temurin 21.

## Local development

```powershell
git clone <repository-url>
cd sa-learnership-portal
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
docker compose -f docker/docker-compose.yml up -d postgres
cd backend
mvn spring-boot:run
```

In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

The frontend is normally at `http://localhost:5173`; the API is at `http://localhost:8080`. Before starting PostgreSQL, ensure the local `docker/.env` `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` values match `POSTGRES_DB`, `DB_USERNAME`, and `DB_PASSWORD` in `backend/.env`; both files are ignored and there is no tracked Docker environment example. Flyway creates and migrates the database automatically when the backend starts.

## Important configuration correction

`application-dev.yml` reads `POSTGRES_HOST`, `POSTGRES_PORT`, and `POSTGRES_DB`; the example provides these for a backend started outside Docker. Compose supplies `DB_*` names but activates the `dev` profile, whose datasource does not read them. As a result, the Compose **backend** service is currently inconsistent and should be fixed before it is relied on for a fresh deployment.

## Verify

Open `http://localhost:8080/api/v1/ping`, `http://localhost:8080/swagger-ui.html`, and the Vite URL. The public opportunities endpoint is `GET /api/v1/opportunities`.

Run backend tests with Docker available:

```powershell
cd backend
mvn test
```

Run the available frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

The project has no frontend test script. Flyway migration V8 seeds reference data, but there is no separate seed command.
