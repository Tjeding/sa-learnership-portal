package com.tjeding.portal.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByProvider_UserIdOrderByCreatedAtDesc(Long providerUserId);
    List<Opportunity> findByStatusOrderByClosingDateAsc(OpportunityStatus status);
    List<Opportunity> findAllByOrderByCreatedAtDesc();
    long countByStatus(OpportunityStatus status);
    long countByProvider_UserIdAndStatus(Long providerUserId, OpportunityStatus status);
}