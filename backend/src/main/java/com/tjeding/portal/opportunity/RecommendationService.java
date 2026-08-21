package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final OpportunityMatchScoreRepository matchScoreRepository;
    private final UserRepository userRepository;

    public RecommendationService(OpportunityMatchScoreRepository matchScoreRepository, UserRepository userRepository) {
        this.matchScoreRepository = matchScoreRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendations(String email, int limit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return matchScoreRepository.findById_ApplicantId(user.getId()).stream()
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
                m.getId().getOpportunityId(), m.getOpportunityTitle(),
                matching, required, percentage,
                Boolean.TRUE.equals(m.getMeetsNqfRequirement())
        );
    }
}