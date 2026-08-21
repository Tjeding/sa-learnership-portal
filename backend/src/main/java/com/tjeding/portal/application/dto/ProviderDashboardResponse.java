package com.tjeding.portal.application.dto;

import java.util.List;
import java.util.Map;

public record ProviderDashboardResponse(
        long activeOpportunities,
        long totalApplications,
        long shortlistedCount,
        long hiredCount,
        List<ApplicationSummaryResponse> recentApplications,
        Map<String, Long> applicationsByStatus,
        List<TopOpportunityResponse> topOpportunities
) {
    public record TopOpportunityResponse(Long opportunityId, String title, long applicationCount) {
    }
}