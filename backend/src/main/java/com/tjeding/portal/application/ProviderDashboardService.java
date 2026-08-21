package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.ProviderDashboardResponse;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.user.ProviderProfile;
import com.tjeding.portal.user.ProviderProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProviderDashboardService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final ApplicationService applicationService;

    public ProviderDashboardService(ApplicationRepository applicationRepository,
                                     OpportunityRepository opportunityRepository,
                                     ProviderProfileRepository providerProfileRepository,
                                     UserRepository userRepository,
                                     ApplicationService applicationService) {
        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.userRepository = userRepository;
        this.applicationService = applicationService;
    }

    @Transactional(readOnly = true)
    public ProviderDashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ProviderProfile provider = providerProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        Long providerId = provider.getUserId();

        long active = opportunityRepository.countByProvider_UserIdAndStatus(providerId, OpportunityStatus.approved);
        long total = applicationRepository.countByOpportunity_Provider_UserId(providerId);
        long shortlisted = applicationRepository.countByOpportunity_Provider_UserIdAndStatus(providerId, ApplicationStatus.shortlisted);
        long hired = applicationRepository.countByOpportunity_Provider_UserIdAndStatus(providerId, ApplicationStatus.accepted);

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (ApplicationStatus s : List.of(ApplicationStatus.submitted, ApplicationStatus.under_review,
                ApplicationStatus.shortlisted, ApplicationStatus.rejected)) {
            byStatus.put(s.name(), applicationRepository.countByOpportunity_Provider_UserIdAndStatus(providerId, s));
        }

        List<ProviderDashboardResponse.TopOpportunityResponse> topOpportunities =
                applicationRepository.findTopOpportunitiesByProvider(providerId, PageRequest.of(0, 3)).stream()
                        .map(p -> new ProviderDashboardResponse.TopOpportunityResponse(p.getOpportunityId(), p.getTitle(), p.getApplicationCount()))
                        .toList();

        List<com.tjeding.portal.application.dto.ApplicationSummaryResponse> recent =
                applicationService.getApplicantsForProvider(email).stream().limit(5).toList();

        return new ProviderDashboardResponse(active, total, shortlisted, hired, recent, byStatus, topOpportunities);
    }
}