# Deployment

Deployment is not currently configured. The CD workflow only builds an image locally on the runner and does not publish or deploy it.

## Existing container path

`docker/docker-compose.yml` starts PostgreSQL 16 and the backend. It persists database data and uploads in named volumes, waits for PostgreSQL health, maps API port 8080 by default, and needs production-grade values for `DB_PASSWORD`, `JWT_SECRET`, database settings, and allowed CORS origins. It does not contain a frontend service, reverse proxy, HTTPS, domain, backups, or rollback process.

## Potential future deployment approach

Build `frontend` with `VITE_API_URL` set to the public API URL, host its static output behind HTTPS, deploy the backend image and managed PostgreSQL, run Flyway during backend startup with a tested backup, set restrictive CORS, persist uploads in managed object storage, expose health checks, centralise logs, and use a registry plus staged deployment/rollback strategy.
