package com.tjeding.portal.report.dto;

public record CustomViewRow(
        String grouping,
        String status,
        long count
) {}
