# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies separately from source for faster rebuilds
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN useradd --system --create-home appuser
USER appuser

COPY --from=build /app/target/portal.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
