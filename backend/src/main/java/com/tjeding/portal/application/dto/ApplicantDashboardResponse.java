package com.tjeding.portal.application.dto;

import com.tjeding.portal.opportunity.dto.OpportunitySummaryResponse;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;

import java.util.List;

public record ApplicantDashboardResponse(
        long totalApplications,
        long shortlistedCount,
        long offersCount,
        List<ApplicationResponse> recentApplications,
        List<RecommendationResponse> recommendations,
        List<OpportunitySummaryResponse> closingSoon
) {
}