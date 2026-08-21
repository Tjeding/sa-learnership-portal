package com.tjeding.portal.report.dto;

public record PlacementSuccessRow(
        Long sectorId,
        String sector,
        long totalApplications,
        long totalPlacements,
        double placementRatePct
) {}
