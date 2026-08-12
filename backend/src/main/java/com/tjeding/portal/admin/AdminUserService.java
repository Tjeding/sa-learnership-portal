package com.tjeding.portal.admin;

import com.tjeding.portal.admin.dto.UserSummaryResponse;
import com.tjeding.portal.user.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public AdminUserService(UserRepository userRepository,
                             ApplicantProfileRepository applicantProfileRepository,
                             ProviderProfileRepository providerProfileRepository) {
        this.userRepository = userRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toSummary)
                .toList();
    }

    private UserSummaryResponse toSummary(User user) {
        String displayName = switch (user.getRole()) {
            case applicant -> applicantProfileRepository.findById(user.getId())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(user.getEmail());
            case provider -> providerProfileRepository.findById(user.getId())
                    .map(ProviderProfile::getOrganizationName)
                    .orElse(user.getEmail());
            case admin -> user.getEmail();
        };

        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.isVerified(),
                displayName,
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}
