package com.tjeding.portal.opportunity.dto;

public record RecommendationResponse(
        Long opportunityId,
        String opportunityTitle,
        int matchingSkills,
        int requiredSkillsTotal,
        int matchPercentage,
        boolean meetsNqfRequirement
) {
}