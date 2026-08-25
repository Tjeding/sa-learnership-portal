# Configuration

Copy `backend/.env.example` to `backend/.env` for local backend runs and `frontend/.env.example` to `frontend/.env` for Vite. Never commit either local file. Spring imports `backend/.env` only through the `dev` profile.

| Variable | Purpose / used by | Required | Example format | Security |
|---|---|---:|---|---|
| `SPRING_PROFILES_ACTIVE` | Spring profile | no | `dev` | no secret |
| `SERVER_PORT` | API listener | no | `8080` | no secret |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB` | `application-dev.yml` datasource | for local dev | `localhost`, `5433`, `sa_learnership` | no secret |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | `application-prod.yml`; also supplied to the Compose backend | production | host/name | no secret; the active Compose `dev` profile does not read these host/name variables |
| `DB_USERNAME`, `DB_PASSWORD` | datasource credentials; Compose also supplies them | required for a real database connection | username/password | secret |
| `CORS_ALLOWED_ORIGINS` | allowed browser origins | yes outside defaults | comma-separated URLs | restrict in production |
| `JWT_SECRET` | signs JWTs | yes outside defaults | random 32+ byte secret | secret; rotate if exposed |
| `JWT_EXPIRATION_MS`, `JWT_REFRESH_EXPIRATION_MS` | token lifetimes | no | milliseconds | balance security/usability |
| `UPLOAD_DIR` | CV/image storage | no | `./uploads` | protect filesystem access |
| `MAX_CV_SIZE_BYTES`, `MAX_IMAGE_SIZE_BYTES` | application file rules | no | integer bytes | no secret |
| `MATCHING_STRATEGY` | recommendation strategy | no | `skill-based` | no secret |
| `OPENAI_API_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL` | reserved OpenAI matching properties | not used by an implemented strategy | URL/key/model | key is secret |
| `OLLAMA_API_URL`, `OLLAMA_MODEL` | reserved Ollama matching properties | not used by an implemented strategy | URL/model | no secret normally |
| `VITE_API_URL` | browser API base URL | no | `http://localhost:8080` | public; never put secrets in Vite variables |

`application.yml` centralises Flyway, JPA validation, multipart limits, OpenAPI, Actuator and custom `app.*` properties. `application-prod.yml` requires its datasource variables; `application-dev.yml` enables verbose SQL/security/Flyway logging. `docker/docker-compose.yml` interpolates `POSTGRES_*`, `SPRING_PROFILES_ACTIVE`, and `JWT_SECRET`; a local `docker/.env` exists in this working tree but no tracked `docker/.env.example` exists. Vite has no proxy configuration, so browser access depends on `VITE_API_URL` and CORS matching exactly.
