package com.tjeding.portal.opportunity;

import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.common.exception.ForbiddenActionException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.opportunity.dto.*;
import com.tjeding.portal.reference.*;
import com.tjeding.portal.user.ProviderProfile;
import com.tjeding.portal.user.ProviderProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final NqfLevelRepository nqfLevelRepository;
    private final SkillRepository skillRepository;

    public OpportunityService(OpportunityRepository opportunityRepository,
                               ProviderProfileRepository providerProfileRepository,
                               UserRepository userRepository,
                               SectorRepository sectorRepository,
                               NqfLevelRepository nqfLevelRepository,
                               SkillRepository skillRepository) {
        this.opportunityRepository = opportunityRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.userRepository = userRepository;
        this.sectorRepository = sectorRepository;
        this.nqfLevelRepository = nqfLevelRepository;
        this.skillRepository = skillRepository;
    }

    // ---- helpers ----

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));
    }

    private ProviderProfile currentProvider(String email) {
        User user = currentUser(email);
        return providerProfileRepository.findById(user.getId())
                .orElseThrow(() -> ResourceNotFoundException.of("ProviderProfile", user.getId()));
    }

    private Opportunity findOwned(Long opportunityId, String email) {
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", opportunityId));
        ProviderProfile provider = currentProvider(email);
        if (!opp.getProvider().getUserId().equals(provider.getUserId())) {
            throw new ForbiddenActionException("You do not have permission to modify this opportunity.");
        }
        return opp;
    }

    private Sector resolveSector(Integer sectorId) {
        if (sectorId == null) return null;
        return sectorRepository.findById(sectorId)
                .orElseThrow(() -> new BadRequestException("Unknown sectorId: " + sectorId));
    }

    private NqfLevel resolveNqfLevel(Short nqfLevelId) {
        if (nqfLevelId == null) return null;
        return nqfLevelRepository.findById(nqfLevelId)
                .orElseThrow(() -> new BadRequestException("Unknown minNqfLevelId: " + nqfLevelId));
    }

    private void applyScalarFields(Opportunity opp, String title, String description, OpportunityType type,
                                    Integer sectorId, Short nqfLevelId, java.math.BigDecimal stipendAmount,
                                    String stipendPeriod, String location, String province, Integer durationMonths,
                                    Integer positionsAvailable, java.time.LocalDate closingDate) {
        opp.setTitle(title);
        opp.setDescription(description);
        opp.setOpportunityType(type);
        opp.setSector(resolveSector(sectorId));
        opp.setMinNqfLevel(resolveNqfLevel(nqfLevelId));
        opp.setStipendAmount(stipendAmount);
        opp.setStipendPeriod(stipendPeriod != null ? stipendPeriod : "monthly");
        opp.setLocation(location);
        opp.setProvince(province);
        opp.setDurationMonths(durationMonths);
        opp.setPositionsAvailable(positionsAvailable);
        opp.setClosingDate(closingDate);
    }

    private void replaceRequirements(Opportunity opp, List<String> requirementTexts) {
        opp.getRequirements().clear();
        if (requirementTexts == null) return;
        short order = 0;
        for (String text : requirementTexts) {
            if (text == null || text.isBlank()) continue;
            opp.getRequirements().add(OpportunityRequirement.builder()
                    .opportunity(opp).requirementText(text.trim()).displayOrder(order++).build());
        }
    }

    private void replaceSkills(Opportunity opp, List<Integer> skillIds) {
        opp.getSkills().clear();
        if (skillIds == null) return;
        for (Integer skillId : skillIds) {
            Skill skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new BadRequestException("Unknown skillId: " + skillId));
            opp.getSkills().add(OpportunitySkill.builder()
                    .id(new OpportunitySkillId(opp.getId(), skillId))
                    .opportunity(opp).skill(skill).required(true).build());
        }
    }

    // ---- provider actions ----

    @Transactional
    public OpportunityResponse createOpportunity(String email, OpportunityCreateRequest req) {
        ProviderProfile provider = currentProvider(email);
        Opportunity opp = new Opportunity();
        opp.setProvider(provider);
        opp.setStatus(req.saveAsDraft() ? OpportunityStatus.draft : OpportunityStatus.pending_approval);
        applyScalarFields(opp, req.title(), req.description(), req.opportunityType(), req.sectorId(),
                req.minNqfLevelId(), req.stipendAmount(), req.stipendPeriod(), req.location(), req.province(),
                req.durationMonths(), req.positionsAvailable(), req.closingDate());
        Opportunity saved = opportunityRepository.saveAndFlush(opp); // assigns the ID requirements/skills need
        replaceRequirements(saved, req.requirements());
        replaceSkills(saved, req.skillIds());
        return toResponse(opportunityRepository.save(saved));
    }

    @Transactional
    public OpportunityResponse updateOpportunity(String email, Long id, OpportunityUpdateRequest req) {
        Opportunity opp = findOwned(id, email);
        if (opp.getStatus() == OpportunityStatus.approved || opp.getStatus() == OpportunityStatus.closed
                || opp.getStatus() == OpportunityStatus.filled) {
            throw new ForbiddenActionException("Approved, closed, or filled opportunities can't be edited directly. Contact an admin.");
        }
        applyScalarFields(opp, req.title(), req.description(), req.opportunityType(), req.sectorId(),
                req.minNqfLevelId(), req.stipendAmount(), req.stipendPeriod(), req.location(), req.province(),
                req.durationMonths(), req.positionsAvailable(), req.closingDate());
        replaceRequirements(opp, req.requirements());
        replaceSkills(opp, req.skillIds());
        opp.setStatus(req.saveAsDraft() ? OpportunityStatus.draft : OpportunityStatus.pending_approval);
        opp.setRejectionReason(null);
        return toResponse(opportunityRepository.save(opp));
    }

    @Transactional
    public void deleteOpportunity(String email, Long id) {
        opportunityRepository.delete(findOwned(id, email));
    }

    @Transactional(readOnly = true)
    public List<OpportunitySummaryResponse> getMyOpportunities(String email) {
        ProviderProfile provider = currentProvider(email);
        return opportunityRepository.findByProvider_UserIdOrderByCreatedAtDesc(provider.getUserId())
                .stream().map(this::toSummary).toList();
    }

    // ---- public actions ----

    @Transactional(readOnly = true)
    public List<OpportunitySummaryResponse> listApproved() {
        return opportunityRepository.findByStatusOrderByClosingDateAsc(OpportunityStatus.approved)
                .stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public OpportunityResponse getPublicById(Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", id));
        if (opp.getStatus() != OpportunityStatus.approved) {
            throw ResourceNotFoundException.of("Opportunity", id);
        }
        return toResponse(opp);
    }

    // ---- admin actions ----

    @Transactional(readOnly = true)
    public List<OpportunitySummaryResponse> listAllForAdmin(OpportunityStatus statusFilter) {
        List<Opportunity> opps = statusFilter != null
                ? opportunityRepository.findByStatusOrderByClosingDateAsc(statusFilter)
                : opportunityRepository.findAllByOrderByCreatedAtDesc();
        return opps.stream().map(this::toSummary).toList();
    }

    @Transactional
    public OpportunityResponse approve(String adminEmail, Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", id));
        opp.setStatus(OpportunityStatus.approved);
        opp.setApprovedBy(currentUser(adminEmail));
        opp.setApprovedAt(Instant.now());
        opp.setRejectionReason(null);
        return toResponse(opportunityRepository.save(opp));
    }

    @Transactional
    public OpportunityResponse reject(String adminEmail, Long id, String reason) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Opportunity", id));
        opp.setStatus(OpportunityStatus.rejected);
        opp.setApprovedBy(currentUser(adminEmail));
        opp.setApprovedAt(Instant.now());
        opp.setRejectionReason(reason);
        return toResponse(opportunityRepository.save(opp));
    }

    // ---- mapping ----

    private OpportunityResponse toResponse(Opportunity o) {
        return new OpportunityResponse(
                o.getId(), o.getProvider().getUserId(), o.getProvider().getOrganizationName(),
                o.getTitle(), o.getDescription(), o.getOpportunityType(),
                o.getSector() != null ? o.getSector().getId() : null,
                o.getSector() != null ? o.getSector().getName() : null,
                o.getMinNqfLevel() != null ? o.getMinNqfLevel().getId() : null,
                o.getMinNqfLevel() != null ? o.getMinNqfLevel().getLevelName() : null,
                o.getStipendAmount(), o.getStipendPeriod(), o.getLocation(), o.getProvince(),
                o.getDurationMonths(), o.getPositionsAvailable(), o.getClosingDate(), o.getStatus(),
                o.getRejectionReason(),
                o.getRequirements().stream()
                        .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                        .map(OpportunityRequirement::getRequirementText).toList(),
                o.getSkills().stream()
                        .map(s -> new OpportunityResponse.SkillTagResponse(s.getSkill().getId(), s.getSkill().getName(), s.isRequired()))
                        .toList()
        );
    }

    private OpportunitySummaryResponse toSummary(Opportunity o) {
        return new OpportunitySummaryResponse(
                o.getId(), o.getTitle(), o.getOpportunityType(),
                o.getSector() != null ? o.getSector().getName() : null,
                o.getProvider().getOrganizationName(),
                o.getMinNqfLevel() != null ? o.getMinNqfLevel().getId() : null,
                o.getStipendAmount(), o.getStipendPeriod(), o.getLocation(), o.getProvince(),
                o.getDurationMonths(), o.getPositionsAvailable(), o.getClosingDate(), o.getStatus()
        );
    }
}