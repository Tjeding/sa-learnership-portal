package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.opportunity.dto.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/provider/opportunities")
@Tag(name = "Provider Opportunities", description = "A provider's own opportunity listings")
@SecurityRequirement(name = "bearerAuth")
public class ProviderOpportunityController {

    private final OpportunityService opportunityService;

    public ProviderOpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    public ApiResponse<List<OpportunitySummaryResponse>> getMyOpportunities(Authentication authentication) {
        return ApiResponse.success(opportunityService.getMyOpportunities(authentication.getName()));
    }

    @PostMapping
    public ApiResponse<OpportunityResponse> create(Authentication authentication,
                                                     @Valid @RequestBody OpportunityCreateRequest request) {
        return ApiResponse.success(opportunityService.createOpportunity(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ApiResponse<OpportunityResponse> update(Authentication authentication, @PathVariable Long id,
                                                     @Valid @RequestBody OpportunityUpdateRequest request) {
        return ApiResponse.success(opportunityService.updateOpportunity(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(Authentication authentication, @PathVariable Long id) {
        opportunityService.deleteOpportunity(authentication.getName(), id);
        return ApiResponse.ok();
    }
}