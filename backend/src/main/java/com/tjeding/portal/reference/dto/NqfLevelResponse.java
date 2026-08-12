package com.tjeding.portal.reference.dto;

public record NqfLevelResponse(
        Short id,
        String levelName,
        String subFramework,
        String typicalExample
) {
}