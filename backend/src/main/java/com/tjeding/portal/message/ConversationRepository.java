package com.tjeding.portal.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByApplicant_IdAndProvider_IdAndOpportunity_Id(
            Long applicantId, Long providerId, Long opportunityId);

    Optional<Conversation> findByApplicant_IdAndProvider_IdAndOpportunityIsNull(
            Long applicantId, Long providerId);

    /**
     * Returns every conversation where the given user is either the applicant
     * or the provider, ordered by most-recently-updated first.
     */
    @Query("""
            SELECT c FROM Conversation c
            WHERE c.applicant.id = :userId OR c.provider.id = :userId
            ORDER BY c.updatedAt DESC
            """)
    List<Conversation> findByParticipant(@Param("userId") Long userId);
}
