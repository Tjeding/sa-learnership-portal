package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ApplicationCreateRequest;
import com.tjeding.portal.application.dto.ApplicationResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applicant/applications")
@Tag(name = "Applicant Applications", description = "An applicant's own applications")
@SecurityRequirement(name = "bearerAuth")
public class ApplicantApplicationController {

    private final ApplicationService applicationService;

    public ApplicantApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ApiResponse<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        return ApiResponse.success(applicationService.getMyApplications(authentication.getName()));
    }

    @PostMapping
    public ApiResponse<ApplicationResponse> apply(Authentication authentication,
                                                    @Valid @RequestBody ApplicationCreateRequest request) {
        return ApiResponse.success(applicationService.apply(authentication.getName(), request));
    }

    @PostMapping("/{id}/withdraw")
    public ApiResponse<ApplicationResponse> withdraw(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(applicationService.withdraw(authentication.getName(), id));
    }
}