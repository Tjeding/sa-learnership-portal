package com.tjeding.portal.application.dto;

import java.util.List;

public record AdminDashboardResponse(
        long totalUsers,
        long totalProviders,
        long activeOpportunities,
        long totalApplications,
        long placementsMade,
        List<MonthlyVolumeResponse> applicationVolume,
        List<SectorPlacementRateResponse> placementBySector
) {
    public record MonthlyVolumeResponse(String month, long value) {
    }

    public record SectorPlacementRateResponse(String sector, double placementRatePct) {
    }
}