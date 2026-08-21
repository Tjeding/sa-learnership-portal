package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ApplicantDashboardResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/applicant/dashboard")
@Tag(name = "Applicant Dashboard")
@SecurityRequirement(name = "bearerAuth")
public class ApplicantDashboardController {

    private final ApplicantDashboardService applicantDashboardService;

    public ApplicantDashboardController(ApplicantDashboardService applicantDashboardService) {
        this.applicantDashboardService = applicantDashboardService;
    }

    @GetMapping
    public ApiResponse<ApplicantDashboardResponse> getDashboard(Authentication authentication) {
        return ApiResponse.success(applicantDashboardService.getDashboard(authentication.getName()));
    }
}