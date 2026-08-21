package com.tjeding.portal.opportunity.matching;

import com.tjeding.portal.opportunity.dto.RecommendationResponse;

import java.util.List;

/**
 * Pluggable matching strategy for recommending opportunities to applicants.
 *
 * <p>Implementations:
 * <ul>
 *   <li>{@code SkillBasedMatchingStrategy} — baseline scoring using skill overlap
 *       and NQF level comparison from {@code vw_applicant_opportunity_match_scores}.</li>
 *   <li>Future: {@code EmbeddingMatchingStrategy} — sentence-embedding similarity
 *       between applicant profile text and opportunity descriptions.</li>
 *   <li>Future: {@code OpenAiMatchingStrategy} — OpenAI completions API for
 *       semantic matching.</li>
 *   <li>Future: {@code OllamaMatchingStrategy} — local Ollama model for
 *       offline-capable matching.</li>
 * </ul>
 *
 * <p>Active strategy is selected via {@code app.matching.strategy} in
 * application.yml. Only one strategy bean is primary at a time; the
 * {@link RecommendationService} injects the {@code @Primary} bean.
 */
public interface MatchingStrategy {

    /**
     * @return a short identifier for this strategy (e.g. "skill-based", "embedding", "openai").
     */
    String name();

    /**
     * Compute match scores for the given applicant against all open opportunities.
     *
     * @param applicantUserId the applicant's user ID
     * @param limit           max number of results to return
     * @return recommendations sorted by match quality (best first)
     */
    List<RecommendationResponse> match(Long applicantUserId, int limit);
}
