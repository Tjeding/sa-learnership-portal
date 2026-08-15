package com.tjeding.portal.opportunity.dto;

import com.tjeding.portal.opportunity.OpportunityType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OpportunityCreateRequest(
        @NotBlank(message = "title is required") String title,
        @NotBlank(message = "description is required") String description,
        @NotNull(message = "opportunityType is required") OpportunityType opportunityType,
        Integer sectorId,
        Short minNqfLevelId,
        @DecimalMin(value = "0", message = "stipendAmount cannot be negative") BigDecimal stipendAmount,
        String stipendPeriod,
        String location,
        String province,
        @Min(value = 1, message = "durationMonths must be at least 1") Integer durationMonths,
        @NotNull(message = "positionsAvailable is required")
        @Min(value = 1, message = "positionsAvailable must be at least 1") Integer positionsAvailable,
        @NotNull(message = "closingDate is required")
        @Future(message = "closingDate must be in the future") LocalDate closingDate,
        List<@NotBlank String> requirements,
        List<Integer> skillIds,
        boolean saveAsDraft
) {
}