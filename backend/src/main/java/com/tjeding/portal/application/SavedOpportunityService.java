package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.SavedOpportunitySummaryResponse;
import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.Opportunity;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.user.ApplicantProfile;
import com.tjeding.portal.user.ApplicantProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedOpportunityService {

    private final SavedOpportunityRepository savedOpportunityRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    public SavedOpportunityService(SavedOpportunityRepository savedOpportunityRepository,
                                    ApplicantProfileRepository applicantProfileRepository,
                                    OpportunityRepository opportunityRepository,
                                    UserRepository userRepository) {
        this.savedOpportunityRepository = savedOpportunityRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
    }

    private ApplicantProfile currentApplicant(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return applicantProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found"));
    }

    @Transactional(readOnly = true)
    public List<SavedOpportunitySummaryResponse> getMySaved(String email) {
        ApplicantProfile applicant = currentApplicant(email);
        return savedOpportunityRepository.findByApplicant_UserIdOrderBySavedAtDesc(applicant.getUserId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void save(String email, Long opportunityId) {
        ApplicantProfile applicant = currentApplicant(email);
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", opportunityId));

        if (savedOpportunityRepository.existsByApplicant_UserIdAndOpportunity_Id(applicant.getUserId(), opportunityId)) {
            throw new BadRequestException("You have already saved this opportunity.");
        }

        SavedOpportunity saved = SavedOpportunity.builder()
                .id(new SavedOpportunityId(applicant.getUserId(), opportunityId))
                .applicant(applicant)
                .opportunity(opportunity)
                .build();
        savedOpportunityRepository.save(saved);
    }

    @Transactional
    public void unsave(String email, Long opportunityId) {
        ApplicantProfile applicant = currentApplicant(email);
        SavedOpportunityId id = new SavedOpportunityId(applicant.getUserId(), opportunityId);
        if (!savedOpportunityRepository.existsById(id)) {
            throw ResourceNotFoundException.of("SavedOpportunity", opportunityId);
        }
        savedOpportunityRepository.deleteById(id);
    }

    private SavedOpportunitySummaryResponse toResponse(SavedOpportunity s) {
        Opportunity o = s.getOpportunity();
        return new SavedOpportunitySummaryResponse(
                o.getId(), o.getTitle(), o.getProvider().getOrganizationName(),
                o.getSector() != null ? o.getSector().getName() : null,
                o.getOpportunityType().name(), o.getStipendAmount(), o.getStipendPeriod(),
                o.getLocation(), o.getDurationMonths(), o.getClosingDate(), s.getSavedAt()
        );
    }
}