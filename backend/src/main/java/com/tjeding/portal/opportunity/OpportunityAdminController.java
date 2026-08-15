package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.opportunity.dto.OpportunityRejectRequest;
import com.tjeding.portal.opportunity.dto.OpportunityResponse;
import com.tjeding.portal.opportunity.dto.OpportunitySummaryResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/opportunities")
@Tag(name = "Admin Opportunities", description = "Admin approval/rejection of provider listings")
@SecurityRequirement(name = "bearerAuth")
public class OpportunityAdminController {

    private final OpportunityService opportunityService;

    public OpportunityAdminController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    public ApiResponse<List<OpportunitySummaryResponse>> listAll(@RequestParam(required = false) OpportunityStatus status) {
        return ApiResponse.success(opportunityService.listAllForAdmin(status));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<OpportunityResponse> approve(Authentication authentication, @PathVariable Long id) {
        return ApiResponse.success(opportunityService.approve(authentication.getName(), id));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<OpportunityResponse> reject(Authentication authentication, @PathVariable Long id,
                                                     @Valid @RequestBody OpportunityRejectRequest request) {
        return ApiResponse.success(opportunityService.reject(authentication.getName(), id, request.reason()));
    }
}