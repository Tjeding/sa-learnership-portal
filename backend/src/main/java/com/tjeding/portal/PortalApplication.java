package com.tjeding.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * SA Learnerships and Skills Development Portal - API entry point.
 *
 * Phase 1 scope: application bootstrap, DB connectivity (Flyway-managed
 * schema), security scaffolding, and shared web infrastructure
 * (exception handling, response wrapper, CORS, OpenAPI docs).
 *
 * Authentication endpoints are intentionally NOT implemented yet -
 * see Phase 2.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class PortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }
}
