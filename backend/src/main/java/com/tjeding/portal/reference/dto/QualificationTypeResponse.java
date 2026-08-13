package com.tjeding.portal.reference.dto;

public record QualificationTypeResponse(
        Integer id,
        String title,
        Short nqfLevelId,
        String nqfLevelName,
        String qualificationCategory
) {
}