package com.tjeding.portal.application.dto;

import jakarta.validation.constraints.NotNull;

public record ApplicationCreateRequest(
        @NotNull(message = "opportunityId is required") Long opportunityId,
        String coverNote
) {
}