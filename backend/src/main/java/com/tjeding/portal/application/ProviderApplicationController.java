package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ApplicationSummaryResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/provider/applications")
@Tag(name = "Provider Applications", description = "Applications received across a provider's own opportunities")
@SecurityRequirement(name = "bearerAuth")
public class ProviderApplicationController {

    private final ApplicationService applicationService;

    public ProviderApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ApiResponse<List<ApplicationSummaryResponse>> getApplicants(Authentication authentication) {
        return ApiResponse.success(applicationService.getApplicantsForProvider(authentication.getName()));
    }

    @PostMapping("/{id}/shortlist")
    public ApiResponse<ApplicationSummaryResponse> shortlist(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(applicationService.shortlist(authentication.getName(), id));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<ApplicationSummaryResponse> reject(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(applicationService.reject(authentication.getName(), id));
    }

    @PostMapping("/{id}/offer")
    public ApiResponse<ApplicationSummaryResponse> offer(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(applicationService.offer(authentication.getName(), id));
    }
}