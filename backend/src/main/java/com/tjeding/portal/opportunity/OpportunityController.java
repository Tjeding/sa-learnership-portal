package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.opportunity.dto.OpportunityResponse;
import com.tjeding.portal.opportunity.dto.OpportunitySummaryResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public, unauthenticated browsing of approved opportunities. */
@RestController
@RequestMapping("/api/v1/opportunities")
@Tag(name = "Opportunities", description = "Public opportunity listings")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    public ApiResponse<List<OpportunitySummaryResponse>> listApproved() {
        return ApiResponse.success(opportunityService.listApproved());
    }

    @GetMapping("/{id}")
    public ApiResponse<OpportunityResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(opportunityService.getPublicById(id));
    }
}