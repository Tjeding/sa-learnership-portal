package com.tjeding.portal.application;

import com.tjeding.portal.application.dto.*;
import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.Opportunity;
import com.tjeding.portal.opportunity.OpportunityRepository;
import com.tjeding.portal.opportunity.OpportunityStatus;
import com.tjeding.portal.user.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class ApplicationService {

    private static final Set<ApplicationStatus> TERMINAL_STATUSES =
            Set.of(ApplicationStatus.rejected, ApplicationStatus.accepted, ApplicationStatus.withdrawn);

    private final ApplicationRepository applicationRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                               ApplicantProfileRepository applicantProfileRepository,
                               ProviderProfileRepository providerProfileRepository,
                               OpportunityRepository opportunityRepository,
                               UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
    }

    // ---- helpers ----

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ApplicantProfile currentApplicant(String email) {
        User user = currentUser(email);
        return applicantProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found"));
    }

    private ProviderProfile currentProvider(String email) {
        User user = currentUser(email);
        return providerProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
    }

    private Application findOwnedByApplicant(Long applicationId, String email) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", applicationId));
        ApplicantProfile applicant = currentApplicant(email);
        if (!app.getApplicant().getUserId().equals(applicant.getUserId())) {
            throw new ForbiddenActionException("You do not have permission to modify this application.");
        }
        return app;
    }

    private Application findOwnedByProvider(Long applicationId, String email) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", applicationId));
        ProviderProfile provider = currentProvider(email);
        if (!app.getOpportunity().getProvider().getUserId().equals(provider.getUserId())) {
            throw new ForbiddenActionException("You do not have permission to act on this application.");
        }
        return app;
    }

    private String toFileUrl(String relativePath) {
        return relativePath == null ? null : "/uploads/" + relativePath;
    }

    private void transition(Application app, ApplicationStatus newStatus, String reviewerEmail) {
        if (TERMINAL_STATUSES.contains(app.getStatus())) {
            throw new BadRequestException("This application has already reached a final state (" + app.getStatus() + ") and can't be changed further.");
        }
        app.setStatus(newStatus);
        app.setReviewedBy(currentUser(reviewerEmail));
        applicationRepository.save(app);
    }

    // ---- applicant actions ----

    @Transactional
    public ApplicationResponse apply(String email, ApplicationCreateRequest req) {
        ApplicantProfile applicant = currentApplicant(email);

        Opportunity opportunity = opportunityRepository.findById(req.opportunityId())
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", req.opportunityId()));

        if (opportunity.getStatus() != OpportunityStatus.approved) {
            throw new BadRequestException("This opportunity is not currently open for applications.");
        }
        if (opportunity.getClosingDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("This opportunity closed on " + opportunity.getClosingDate() + ".");
        }
        if (applicationRepository.existsByApplicant_UserIdAndOpportunity_Id(applicant.getUserId(), opportunity.getId())) {
            throw new BadRequestException("You have already applied to this opportunity.");
        }

        Application app = Application.builder()
                .applicant(applicant)
                .opportunity(opportunity)
                .status(ApplicationStatus.submitted)
                .coverNote(req.coverNote())
                .build();

        return toResponse(applicationRepository.save(app));
    }

    @Transactional
    public ApplicationResponse withdraw(String email, Long applicationId) {
        Application app = findOwnedByApplicant(applicationId, email);
        if (TERMINAL_STATUSES.contains(app.getStatus())) {
            throw new BadRequestException("This application is already " + app.getStatus() + " and can't be withdrawn.");
        }
        app.setStatus(ApplicationStatus.withdrawn);
        // reviewedBy intentionally left as-is: withdrawal is the applicant's own action, not a provider/admin review.
        return toResponse(applicationRepository.save(app));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(String email) {
        ApplicantProfile applicant = currentApplicant(email);
        return applicationRepository.findByApplicant_UserIdOrderByAppliedAtDesc(applicant.getUserId())
                .stream().map(this::toResponse).toList();
    }

    // ---- provider actions ----

    @Transactional(readOnly = true)
    public List<ApplicationSummaryResponse> getApplicantsForProvider(String email) {
        ProviderProfile provider = currentProvider(email);
        return applicationRepository.findByOpportunity_Provider_UserIdOrderByAppliedAtDesc(provider.getUserId())
                .stream().map(this::toSummary).toList();
    }

    @Transactional
    public ApplicationSummaryResponse shortlist(String email, Long applicationId) {
        Application app = findOwnedByProvider(applicationId, email);
        transition(app, ApplicationStatus.shortlisted, email);
        return toSummary(app);
    }

    @Transactional
    public ApplicationSummaryResponse reject(String email, Long applicationId) {
        Application app = findOwnedByProvider(applicationId, email);
        transition(app, ApplicationStatus.rejected, email);
        return toSummary(app);
    }

    @Transactional
    public ApplicationSummaryResponse offer(String email, Long applicationId) {
        Application app = findOwnedByProvider(applicationId, email);
        transition(app, ApplicationStatus.offered, email);
        return toSummary(app);
    }

    // ---- admin actions ----

    @Transactional(readOnly = true)
    public List<ApplicationAdminResponse> listAllForAdmin() {
        return applicationRepository.findAllByOrderByAppliedAtDesc()
                .stream().map(this::toAdminResponse).toList();
    }

    // ---- mapping ----

    private ApplicationResponse toResponse(Application a) {
        return new ApplicationResponse(
                a.getId(), a.getOpportunity().getId(), a.getOpportunity().getTitle(),
                a.getOpportunity().getProvider().getOrganizationName(),
                a.getStatus(), a.getCoverNote(), a.getAppliedAt(), a.getUpdatedAt()
        );
    }

    private ApplicationSummaryResponse toSummary(Application a) {
        ApplicantProfile applicant = a.getApplicant();
        return new ApplicationSummaryResponse(
                a.getId(), applicant.getUserId(),
                applicant.getFirstName() + " " + applicant.getLastName(),
                applicant.getPhone(), toFileUrl(applicant.getCvFilePath()),
                a.getOpportunity().getId(), a.getOpportunity().getTitle(),
                a.getStatus(), a.getAppliedAt(), a.getUpdatedAt()
        );
    }

    private ApplicationAdminResponse toAdminResponse(Application a) {
        ApplicantProfile applicant = a.getApplicant();
        return new ApplicationAdminResponse(
                a.getId(), applicant.getFirstName() + " " + applicant.getLastName(),
                a.getOpportunity().getTitle(), a.getOpportunity().getProvider().getOrganizationName(),
                a.getStatus(), a.getAppliedAt()
        );
    }
}