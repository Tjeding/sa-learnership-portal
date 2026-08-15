package com.tjeding.portal.opportunity.dto;

import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.opportunity.OpportunityType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OpportunityResponse(
        Long id,
        Long providerId,
        String providerName,
        String title,
        String description,
        OpportunityType opportunityType,
        Integer sectorId,
        String sectorName,
        Short minNqfLevelId,
        String minNqfLevelName,
        BigDecimal stipendAmount,
        String stipendPeriod,
        String location,
        String province,
        Integer durationMonths,
        Integer positionsAvailable,
        LocalDate closingDate,
        OpportunityStatus status,
        String rejectionReason,
        List<String> requirements,
        List<SkillTagResponse> skills
) {
    public record SkillTagResponse(Integer id, String name, boolean required) {
    }
}