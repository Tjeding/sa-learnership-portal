# CI/CD

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`. It checks out the code, installs Temurin JDK 21, caches Maven dependencies, and runs `cd backend && mvn -B test`. It relies on Docker being available on GitHub-hosted runners for Testcontainers.

`.github/workflows/cd.yml` runs on pushes to `main`. It builds the backend package with tests skipped, then builds a Docker image tagged `sa-learnership-portal-backend`. It does not authenticate to a registry, push an image, deploy a service, build the frontend, or declare environment secrets. Reproduce CI locally with `mvn -B test`; reproduce the CD image step with `docker build -t sa-learnership-portal-backend ./backend`.
