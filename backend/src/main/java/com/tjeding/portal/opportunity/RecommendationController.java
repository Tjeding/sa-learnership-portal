package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applicant/recommendations")
@Tag(name = "Recommendations", description = "Baseline skill/NQF match scoring against open opportunities")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ApiResponse<List<RecommendationResponse>> getRecommendations(Authentication authentication) {
        return ApiResponse.success(recommendationService.getRecommendations(authentication.getName(), 20));
    }
}