package com.tjeding.portal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * PHASE 1 security posture:
 *  - Session management is stateless (JWT-ready), even though no JWT
 *    filter or auth endpoints exist yet.
 *  - CSRF disabled, since this is a stateless JSON API (not form-based).
 *  - CORS is locked down to the configured frontend origin(s).
 *  - Every request is currently permitted ("permitAll") because there
 *    is no login flow to authenticate against yet - Phase 2 will lock
 *    down endpoints per-role (applicant/provider/admin) and add the
 *    JWT authentication filter to this chain.
 *  - A BCryptPasswordEncoder bean is exposed now so the Phase 2 user
 *    registration/login feature can depend on it immediately.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsProperties corsProperties;

    public SecurityConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // TODO (Phase 2+): replace permitAll() with per-role rules once
                        // authentication is implemented, e.g.:
                        //   .requestMatchers("/api/auth/**").permitAll()
                        //   .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        //   .anyRequest().authenticated()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.allowedOriginsList());
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
