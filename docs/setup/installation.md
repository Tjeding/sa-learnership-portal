# Phase 1 Setup - Project Foundation

## Prerequisites
- Java 21 (Temurin recommended)
- Maven 3.9+ (or use the included `mvnw` wrapper once generated)
- Docker + Docker Compose (for local PostgreSQL)

## Run PostgreSQL locally
```bash
cd docker
cp ../backend/.env.example .env   # edit values if needed
docker compose --env-file .env up -d postgres
```

## Run the backend
```bash
cd backend
cp .env.example .env              # edit values if needed
export $(grep -v '^#' .env | xargs)  # or use your IDE's env file support
mvn spring-boot:run
```

## Verify the deliverables
| Check | How |
|---|---|
| Spring Boot starts | `mvn spring-boot:run` logs `Started PortalApplication` |
| PostgreSQL connects | No `HikariPool` connection errors in the startup logs |
| Flyway runs V1-V8 | Startup logs show `Migrating schema ... to version "8 - seed reference data"`; confirm with `SELECT * FROM flyway_schema_history;` |
| JWT configured | `JWT_SECRET` env var loads into `JwtProperties` (no auth endpoints yet - Phase 2) |
| Security configured | App enforces a stateless session policy + CORS; all routes are `permitAll()` until Phase 2 adds login |
| Swagger/OpenAPI | Visit `http://localhost:8080/swagger-ui.html` |
| Smoke test | `curl http://localhost:8080/api/v1/ping` returns `{"success":true,"data":{"status":"ok", ...}}` |
| Actuator health | `curl http://localhost:8080/actuator/health` returns `{"status":"UP"}` |

## What's intentionally NOT in Phase 1
- Login/registration endpoints (Phase 2 - User Verification)
- Role-based authorization rules (Phase 2+)
- Any business-logic controllers/services/repositories (later phases)
