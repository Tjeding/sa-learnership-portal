# Testing

Backend tests use JUnit 5 through `spring-boot-starter-test`, Spring Security Test, and Testcontainers PostgreSQL. The sole committed test, `ApplicantProfilePersistenceTest`, exercises the shared-primary-key applicant profile mapping against a PostgreSQL 16 Testcontainers instance and the main Flyway migrations. Docker must be available.

```powershell
cd backend
mvn test
mvn -Dtest=ApplicantProfilePersistenceTest test
```

The frontend has no test framework or test script. Available quality checks are:

```powershell
cd frontend
npm run lint
npm run build
```

There is no configured coverage tool, end-to-end suite, controller/API integration suite, or frontend component suite.
