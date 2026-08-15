package com.tjeding.portal.application.dto;

import com.tjeding.portal.application.ApplicationStatus;

import java.time.Instant;

/** Applicant-facing view of their own application. */
public record ApplicationResponse(
        Long id,
        Long opportunityId,
        String opportunityTitle,
        String providerName,
        ApplicationStatus status,
        String coverNote,
        Instant appliedAt,
        Instant updatedAt
) {
}