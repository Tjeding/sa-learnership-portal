package com.tjeding.portal.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpportunityMatchScoreRepository extends JpaRepository<OpportunityMatchScore, OpportunityMatchScoreId> {
    List<OpportunityMatchScore> findById_ApplicantId(Long applicantId);
}