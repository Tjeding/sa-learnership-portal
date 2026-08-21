package com.tjeding.portal.opportunity.dto;

public record RecommendationResponse(
        Long opportunityId,
        String opportunityTitle,
        int matchingSkills,
        int requiredSkillsTotal,
        int matchPercentage,
        boolean meetsNqfRequirement,
        String matchStrategy
) {
    /** Backwards-compatible constructor (defaults matchStrategy to "skill-based"). */
    public RecommendationResponse(Long opportunityId, String opportunityTitle,
                                   int matchingSkills, int requiredSkillsTotal,
                                   int matchPercentage, boolean meetsNqfRequirement) {
        this(opportunityId, opportunityTitle, matchingSkills, requiredSkillsTotal,
                matchPercentage, meetsNqfRequirement, "skill-based");
    }
}