package com.tjeding.portal.report.dto;

import java.time.LocalDate;

public record StatusFunnelRow(
        LocalDate month,
        String opportunityType,
        String sector,
        String status,
        long applicationCount
) {}
