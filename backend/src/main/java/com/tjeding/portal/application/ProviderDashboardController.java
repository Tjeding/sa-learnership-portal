package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ProviderDashboardResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/provider/dashboard")
@Tag(name = "Provider Dashboard")
@SecurityRequirement(name = "bearerAuth")
public class ProviderDashboardController {

    private final ProviderDashboardService providerDashboardService;

    public ProviderDashboardController(ProviderDashboardService providerDashboardService) {
        this.providerDashboardService = providerDashboardService;
    }

    @GetMapping
    public ApiResponse<ProviderDashboardResponse> getDashboard(Authentication authentication) {
        return ApiResponse.success(providerDashboardService.getDashboard(authentication.getName()));
    }
}