package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;
import com.tjeding.portal.opportunity.matching.MatchingStrategy;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Orchestrates opportunity recommendations for applicants.
 *
 * <p>Delegates the actual scoring to the active {@link MatchingStrategy}
 * bean (default: {@code SkillBasedMatchingStrategy}). To switch to an
 * AI-based strategy, create a new implementation, annotate it
 * {@code @Primary}, and update {@code app.matching.strategy} in
 * application.yml.
 */
@Service
public class RecommendationService {

    private final MatchingStrategy matchingStrategy;
    private final UserRepository userRepository;

    public RecommendationService(MatchingStrategy matchingStrategy,
                                  UserRepository userRepository) {
        this.matchingStrategy = matchingStrategy;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendations(String email, int limit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return matchingStrategy.match(user.getId(), limit);
    }

    /** @return the name of the currently active matching strategy */
    public String getActiveStrategyName() {
        return matchingStrategy.name();
    }
}
