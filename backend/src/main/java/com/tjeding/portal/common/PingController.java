package com.tjeding.portal.common;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Unauthenticated smoke-test endpoint for Phase 1: confirms the app is
 * up, Spring Security lets the request through, and responses use the
 * shared ApiResponse envelope. Remove or repurpose once real endpoints
 * exist.
 */
@RestController
@Tag(name = "System", description = "Infrastructure/health endpoints")
public class PingController {

    @GetMapping("/api/v1/ping")
    public ApiResponse<Map<String, String>> ping() {
        return ApiResponse.success(Map.of("status", "ok", "service", "sa-learnership-portal"));
    }
}
