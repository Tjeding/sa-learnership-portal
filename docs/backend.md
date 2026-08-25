# Backend

The API is Spring Boot 3.3.5 on Java 21. `PortalApplication` is its entry point. Key dependencies are Spring Web, Data JPA, Security, Validation, Flyway, PostgreSQL, springdoc OpenAPI, Actuator, JJWT, OpenPDF, and Lombok.

Controllers expose `/api/v1`; services contain application/ownership/state-transition logic; repositories use JPA; request/response records prevent entity exposure. `GlobalExceptionHandler` returns the common `ApiResponse` envelope for validation, credentials, forbidden, not-found, integrity, upload-size, and unexpected errors. A successful envelope has `success` and `data`; errors include a code/message and may include field errors.

Major packages: `auth` registers/logs in users and manages token rotation; `profile` manages applicant/provider profiles and files; `opportunity` manages listings, approval, and recommendations; `application` manages applications, bookmarks, and dashboards; `message` and `notification` support user communication; `report` reads analytics views/exports; `reference` serves sectors, skills, qualifications, and NQF levels; `admin` lists users. `FileStorageService` stores uploads beneath configured storage and `WebConfig` exposes them under `/uploads/**`.

Transactions annotate state-changing services. PostgreSQL triggers additionally enforce the presence of a provider profile for opportunity writes, open opportunities for new applications, timestamps, status history, notifications, and preferences. See [API](api.md), [security](security.md), and [database](database.md).
