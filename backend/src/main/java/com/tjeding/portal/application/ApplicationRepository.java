package com.tjeding.portal.application;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicant_UserIdOrderByAppliedAtDesc(Long applicantUserId);
    List<Application> findByOpportunity_Provider_UserIdOrderByAppliedAtDesc(Long providerUserId);
    List<Application> findAllByOrderByAppliedAtDesc();
    boolean existsByApplicant_UserIdAndOpportunity_Id(Long applicantUserId, Long opportunityId);

    long countByApplicant_UserId(Long applicantUserId);
    long countByApplicant_UserIdAndStatus(Long applicantUserId, ApplicationStatus status);
    long countByOpportunity_Provider_UserId(Long providerUserId);
    long countByOpportunity_Provider_UserIdAndStatus(Long providerUserId, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);

    @Query("""
            select a.opportunity.id as opportunityId, a.opportunity.title as title, count(a) as applicationCount
            from Application a
            where a.opportunity.provider.userId = :providerUserId
            group by a.opportunity.id, a.opportunity.title
            order by count(a) desc
            """)
    List<TopOpportunityProjection> findTopOpportunitiesByProvider(@Param("providerUserId") Long providerUserId, Pageable pageable);

    interface TopOpportunityProjection {
        Long getOpportunityId();
        String getTitle();
        Long getApplicationCount();
    }
}