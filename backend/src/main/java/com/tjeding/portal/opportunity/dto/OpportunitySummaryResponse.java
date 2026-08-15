package com.tjeding.portal.opportunity.dto;

import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.opportunity.OpportunityType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OpportunitySummaryResponse(
        Long id,
        String title,
        OpportunityType opportunityType,
        String sectorName,
        String providerName,
        Short minNqfLevelId,
        BigDecimal stipendAmount,
        String stipendPeriod,
        String location,
        String province,
        Integer durationMonths,
        Integer positionsAvailable,
        LocalDate closingDate,
        OpportunityStatus status
) {
}