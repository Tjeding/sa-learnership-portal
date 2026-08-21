package com.tjeding.portal.opportunity.matching;

import com.tjeding.portal.opportunity.OpportunityMatchScore;
import com.tjeding.portal.opportunity.OpportunityMatchScoreRepository;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Baseline matching strategy using the existing SQL view
 * {@code vw_applicant_opportunity_match_scores}.
 *
 * <p>Scoring formula:
 * <ul>
 *   <li>{@code matchPercentage = (matchingSkills / requiredSkillsTotal) * 100}</li>
 *   <li>Opportunities with no required skills score 100%.</li>
 *   <li>NQF level check is a boolean pass/fail from the view.</li>
 * </ul>
 *
 * <p>This is the default strategy. Replace with an AI-based strategy
 * (embedding, OpenAI, Ollama) by making that bean {@code @Primary} instead.
 */
@Component
@Primary
public class SkillBasedMatchingStrategy implements MatchingStrategy {

    private final OpportunityMatchScoreRepository matchScoreRepository;

    public SkillBasedMatchingStrategy(OpportunityMatchScoreRepository matchScoreRepository) {
        this.matchScoreRepository = matchScoreRepository;
    }

    @Override
    public String name() {
        return "skill-based";
    }

    @Override
    public List<RecommendationResponse> match(Long applicantUserId, int limit) {
        return matchScoreRepository.findById_ApplicantId(applicantUserId).stream()
                .map(this::toResponse)
                .sorted(Comparator.comparingInt(RecommendationResponse::matchPercentage).reversed())
                .limit(limit)
                .toList();
    }

    private RecommendationResponse toResponse(OpportunityMatchScore m) {
        int required = m.getRequiredSkillsTotal() != null ? m.getRequiredSkillsTotal() : 0;
        int matching = m.getMatchingSkills() != null ? m.getMatchingSkills() : 0;
        int percentage = required > 0 ? Math.round(100f * matching / required) : 100;
        return new RecommendationResponse(
                m.getId().getOpportunityId(),
                m.getOpportunityTitle(),
                matching,
                required,
                percentage,
                Boolean.TRUE.equals(m.getMeetsNqfRequirement()),
                name()
        );
    }
}
