# Development guide

Start PostgreSQL, backend, and frontend as described in [installation](installation.md). Put backend features in their feature package: DTO/controller, service, repository/entity where needed, tests, then API/docs updates. Add database changes as the next numbered immutable Flyway SQL migration; do not alter a migration already used by a shared database. Add frontend pages under the relevant role folder, register them in `App.jsx`, and use `AuthContext`/role layouts consistently.

Before committing, run `mvn test`, `npm run lint`, and `npm run build` where applicable. Inspect OpenAPI at `/swagger-ui.html` after API changes. The repository does not define a branch convention or formatting tool beyond the commands above; use descriptive branches/commits and keep documentation in sync. Avoid committing `.env`, uploads, generated JARs, or tokens.
