package com.tjeding.portal.config;

import com.tjeding.portal.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * PHASE 3 security posture:
 *  - Stateless sessions; auth is carried entirely in the JWT access
 *    token on each request (see JwtAuthenticationFilter).
 *  - CSRF disabled, since this is a stateless JSON API (not form-based).
 *  - CORS is locked down to the configured frontend origin(s).
 *  - /api/v1/auth/register, /login, /refresh-token, /logout are public;
 *    /api/v1/auth/me requires a valid access token.
 *  - /api/v1/applicant/** requires ROLE_APPLICANT, /api/v1/provider/**
 *    requires ROLE_PROVIDER, /api/v1/admin/** requires ROLE_ADMIN.
 *  - /uploads/** (CVs, profile images) is public for now - see the
 *    caution note on WebConfig.
 *  - Everything else not yet built stays permitAll() (see TODO below).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsProperties corsProperties;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CorsProperties corsProperties, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.corsProperties = corsProperties;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh-token",
                                "/api/v1/auth/logout"
                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/ping",
                                "/actuator/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/uploads/**",
                                "/api/v1/reference/**",
                                "/api/v1/opportunities/**"
                        ).permitAll()
                        .requestMatchers("/api/v1/auth/me").authenticated()
                        .requestMatchers("/api/v1/applicant/**").hasRole("APPLICANT")
                        .requestMatchers("/api/v1/provider/**").hasRole("PROVIDER")
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        // TODO (Phase 4+): replace permitAll() with real rules as each
                        // remaining feature (opportunities, applications, etc.) is built.
                        .requestMatchers("/api/v1/auth/me").authenticated()
                        .requestMatchers("/api/v1/notifications/**").authenticated()
                        .requestMatchers("/api/v1/applicant/**").hasRole("APPLICANT")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

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
