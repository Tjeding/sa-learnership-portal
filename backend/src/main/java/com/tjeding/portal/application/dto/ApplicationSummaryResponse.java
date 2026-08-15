package com.tjeding.portal.application.dto;

import com.tjeding.portal.application.ApplicationStatus;

import java.time.Instant;

/** Provider-facing view: who applied to which of their listings. */
public record ApplicationSummaryResponse(
        Long id,
        Long applicantId,
        String applicantName,
        String applicantPhone,
        String applicantCvUrl,
        Long opportunityId,
        String opportunityTitle,
        ApplicationStatus status,
        Instant appliedAt,
        Instant updatedAt
) {
}