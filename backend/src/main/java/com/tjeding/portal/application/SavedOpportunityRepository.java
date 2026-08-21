package com.tjeding.portal.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedOpportunityRepository extends JpaRepository<SavedOpportunity, SavedOpportunityId> {
    List<SavedOpportunity> findByApplicant_UserIdOrderBySavedAtDesc(Long applicantUserId);
    boolean existsByApplicant_UserIdAndOpportunity_Id(Long applicantUserId, Long opportunityId);
}