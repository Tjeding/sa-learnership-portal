package com.tjeding.portal.report.dto;

import java.time.LocalDate;

public record CustomViewRequest(
        LocalDate fromDate,
        LocalDate toDate,
        String sector,
        String opportunityType,
        String groupBy
) {}
