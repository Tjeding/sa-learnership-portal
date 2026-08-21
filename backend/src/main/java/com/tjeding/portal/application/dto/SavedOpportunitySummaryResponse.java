package com.tjeding.portal.application.dto;

import java.time.Instant;

public record SavedOpportunitySummaryResponse(
        Long opportunityId,
        String title,
        String providerName,
        String sectorName,
        String opportunityType,
        java.math.BigDecimal stipendAmount,
        String stipendPeriod,
        String location,
        Integer durationMonths,
        java.time.LocalDate closingDate,
        Instant savedAt
) {
}