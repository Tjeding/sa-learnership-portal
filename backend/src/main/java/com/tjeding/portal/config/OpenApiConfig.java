package com.tjeding.portal.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger UI is served at /swagger-ui.html, raw spec at /v3/api-docs.
 * The bearerAuth scheme is pre-registered so controllers can reference
 * it with @SecurityRequirement("bearerAuth") once JWT auth lands.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI portalOpenApi() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("SA Learnerships and Skills Development Portal API")
                        .description("Connects work-seekers with SETA-accredited learnerships, "
                                + "internships, and apprenticeships across South Africa.")
                        .version("v0.1.0 (Phase 1 - foundation)")
                        .contact(new Contact().name("Project Team").email("dev@tjeding.example")))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
