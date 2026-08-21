package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ApplicantDashboardResponse;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.opportunity.RecommendationService;
import com.tjeding.portal.opportunity.dto.OpportunitySummaryResponse;
import com.tjeding.portal.opportunity.dto.RecommendationResponse;
import com.tjeding.portal.user.ApplicantProfile;
import com.tjeding.portal.user.ApplicantProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicantDashboardService {

    private final ApplicationRepository applicationRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final ApplicationService applicationService;

    public ApplicantDashboardService(ApplicationRepository applicationRepository,
                                      ApplicantProfileRepository applicantProfileRepository,
                                      OpportunityRepository opportunityRepository,
                                      UserRepository userRepository,
                                      RecommendationService recommendationService,
                                      ApplicationService applicationService) {
        this.applicationRepository = applicationRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
        this.recommendationService = recommendationService;
        this.applicationService = applicationService;
    }

    @Transactional(readOnly = true)
    public ApplicantDashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ApplicantProfile applicant = applicantProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found"));

        long total = applicationRepository.countByApplicant_UserId(applicant.getUserId());
        long shortlisted = applicationRepository.countByApplicant_UserIdAndStatus(applicant.getUserId(), ApplicationStatus.shortlisted);
        long offers = applicationRepository.countByApplicant_UserIdAndStatus(applicant.getUserId(), ApplicationStatus.offered)
                + applicationRepository.countByApplicant_UserIdAndStatus(applicant.getUserId(), ApplicationStatus.accepted);

        List<RecommendationResponse> recommendations = recommendationService.getRecommendations(email, 5);

        List<OpportunitySummaryResponse> closingSoon = opportunityRepository
                .findByStatusOrderByClosingDateAsc(OpportunityStatus.approved).stream()
                .limit(3)
                .map(o -> new OpportunitySummaryResponse(
                        o.getId(), o.getTitle(), o.getOpportunityType(),
                        o.getSector() != null ? o.getSector().getName() : null,
                        o.getProvider().getOrganizationName(),
                        o.getMinNqfLevel() != null ? o.getMinNqfLevel().getId() : null,
                        o.getStipendAmount(), o.getStipendPeriod(), o.getLocation(), o.getProvince(),
                        o.getDurationMonths(), o.getPositionsAvailable(), o.getClosingDate(), o.getStatus()))
                .toList();

        List<com.tjeding.portal.application.dto.ApplicationResponse> recent = applicationService.getMyApplications(email)
                .stream().limit(5).toList();

        return new ApplicantDashboardResponse(total, shortlisted, offers, recent, recommendations, closingSoon);
    }
}