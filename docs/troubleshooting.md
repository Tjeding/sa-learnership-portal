# Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| Backend cannot connect to PostgreSQL | Port/service unavailable or dev variable-name mismatch | Start Compose PostgreSQL, use port 5433, and set `POSTGRES_*` for `application-dev.yml`. |
| Browser requests fail with CORS | frontend URL is not in `CORS_ALLOWED_ORIGINS` | Set the exact origin(s), restart backend. |
| API returns 401/403 | Missing/expired Bearer token or wrong role | Login again and use the route matching the account role. |
| `mvn test` cannot start | Docker/Testcontainers unavailable | Start Docker Desktop; the committed test requires PostgreSQL container support. |
| Upload rejected | multipart/server or app size limit exceeded | Keep requests below 10 MB multipart, CV 5 MB, image 2 MB defaults. |
| Frontend calls wrong API | `VITE_API_URL` missing/incorrect | Set `frontend/.env`, then restart Vite. |
| Docker backend does not use expected database values | Compose `DB_*` and dev profile `POSTGRES_*` differ | Resolve the configuration mismatch described in [installation](installation.md). |
| Frontend build fails | dependencies not installed or unsupported Node release | Run `npm ci` with a Vite-supported current Node version. |
