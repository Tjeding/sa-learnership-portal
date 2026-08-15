package com.tjeding.portal.opportunity.dto;

import jakarta.validation.constraints.NotBlank;

public record OpportunityRejectRequest(
        @NotBlank(message = "reason is required") String reason
) {
}