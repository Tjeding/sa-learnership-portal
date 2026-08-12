package com.tjeding.portal.profile;

import com.tjeding.portal.common.exception.BadRequestException;
import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.profile.dto.ProviderProfileResponse;
import com.tjeding.portal.profile.dto.ProviderProfileUpdateRequest;
import com.tjeding.portal.reference.Sector;
import com.tjeding.portal.reference.SectorRepository;
import com.tjeding.portal.user.ProviderProfile;
import com.tjeding.portal.user.ProviderProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProviderProfileService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final SectorRepository sectorRepository;

    public ProviderProfileService(UserRepository userRepository,
                                   ProviderProfileRepository providerProfileRepository,
                                   SectorRepository sectorRepository) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.sectorRepository = sectorRepository;
    }

    @Transactional(readOnly = true)
    public ProviderProfileResponse getMyOrganisation(String email) {
        return toResponse(loadByEmail(email));
    }

    @Transactional
    public ProviderProfileResponse updateMyOrganisation(String email, ProviderProfileUpdateRequest req) {
        ProviderProfile profile = loadByEmail(email);

        Sector sector = null;
        if (req.sectorId() != null) {
            sector = sectorRepository.findById(req.sectorId())
                    .orElseThrow(() -> new BadRequestException("Unknown sectorId: " + req.sectorId()));
        }

        profile.setOrganizationName(req.organizationName().trim());
        profile.setProviderType(req.providerType());
        profile.setSector(sector);
        profile.setRegistrationNumber(blankToNull(req.registrationNumber()));
        profile.setSetaAccreditationNumber(blankToNull(req.setaAccreditationNumber()));
        profile.setContactPerson(blankToNull(req.contactPerson()));
        profile.setPhone(blankToNull(req.phone()));
        profile.setWebsite(blankToNull(req.website()));
        profile.setAddressLine(blankToNull(req.addressLine()));
        profile.setProvince(blankToNull(req.province()));
        profile.setTownCity(blankToNull(req.townCity()));

        providerProfileRepository.save(profile);
        return toResponse(profile);
    }

    // ---- helpers ----

    private ProviderProfile loadByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return providerProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
    }

    private ProviderProfileResponse toResponse(ProviderProfile p) {
        return new ProviderProfileResponse(
                p.getUserId(),
                p.getUser().getEmail(),
                p.getOrganizationName(),
                p.getProviderType(),
                p.getRegistrationNumber(),
                p.getSetaAccreditationNumber(),
                p.getSector() != null ? p.getSector().getId() : null,
                p.getSector() != null ? p.getSector().getName() : null,
                p.getContactPerson(),
                p.getPhone(),
                p.getWebsite(),
                p.getAddressLine(),
                p.getProvince(),
                p.getTownCity(),
                p.isVerified()
        );
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
