package com.tjeding.portal.application.dto;

import com.tjeding.portal.application.ApplicationStatus;

import java.time.Instant;

/** Admin-facing system-wide view. */
public record ApplicationAdminResponse(
        Long id,
        String applicantName,
        String opportunityTitle,
        String providerName,
        ApplicationStatus status,
        Instant appliedAt
) {
}