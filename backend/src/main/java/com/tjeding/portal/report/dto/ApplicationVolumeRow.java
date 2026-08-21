package com.tjeding.portal.report.dto;

import java.time.LocalDate;

public record ApplicationVolumeRow(
        Long opportunityId,
        String opportunityTitle,
        String opportunityType,
        String sector,
        String providerName,
        LocalDate closingDate,
        String opportunityStatus,
        long totalApplications,
        long shortlistedCount,
        long offeredCount,
        long acceptedCount,
        long rejectedCount
) {}
