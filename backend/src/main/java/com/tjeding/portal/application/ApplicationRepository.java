package com.tjeding.portal.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicant_UserIdOrderByAppliedAtDesc(Long applicantUserId);
    List<Application> findByOpportunity_Provider_UserIdOrderByAppliedAtDesc(Long providerUserId);
    List<Application> findAllByOrderByAppliedAtDesc();
    boolean existsByApplicant_UserIdAndOpportunity_Id(Long applicantUserId, Long opportunityId);
}