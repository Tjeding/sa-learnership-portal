package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ApplicationAdminResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/applications")
@Tag(name = "Admin Applications", description = "System-wide view of every application")
@SecurityRequirement(name = "bearerAuth")
public class AdminApplicationController {

    private final ApplicationService applicationService;

    public AdminApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ApiResponse<List<ApplicationAdminResponse>> listAll() {
        return ApiResponse.success(applicationService.listAllForAdmin());
    }
}