package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.SavedOpportunitySummaryResponse;
import com.tjeding.portal.common.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applicant/saved-opportunities")
@Tag(name = "Saved Opportunities", description = "An applicant's bookmarked listings")
@SecurityRequirement(name = "bearerAuth")
public class SavedOpportunityController {

    private final SavedOpportunityService savedOpportunityService;

    public SavedOpportunityController(SavedOpportunityService savedOpportunityService) {
        this.savedOpportunityService = savedOpportunityService;
    }

    @GetMapping
    public ApiResponse<List<SavedOpportunitySummaryResponse>> getMySaved(Authentication authentication) {
        return ApiResponse.success(savedOpportunityService.getMySaved(authentication.getName()));
    }

    @PostMapping("/{opportunityId}")
    public ApiResponse<Void> save(Authentication authentication, @PathVariable Long opportunityId) {
        savedOpportunityService.save(authentication.getName(), opportunityId);
        return ApiResponse.ok();
    }

    @DeleteMapping("/{opportunityId}")
    public ApiResponse<Void> unsave(Authentication authentication, @PathVariable Long opportunityId) {
        savedOpportunityService.unsave(authentication.getName(), opportunityId);
        return ApiResponse.ok();
    }
}