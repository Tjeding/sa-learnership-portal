package com.tjeding.portal.profile;

import com.tjeding.portal.common.exception.ResourceNotFoundException;
import com.tjeding.portal.profile.dto.ApplicantProfileResponse;
import com.tjeding.portal.profile.dto.ApplicantProfileUpdateRequest;
import com.tjeding.portal.profile.dto.FileUploadResponse;
import com.tjeding.portal.storage.FileStorageService;
import com.tjeding.portal.user.ApplicantProfile;
import com.tjeding.portal.user.ApplicantProfileRepository;
import com.tjeding.portal.user.User;
import com.tjeding.portal.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class ApplicantProfileService {

    private final UserRepository userRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final FileStorageService fileStorageService;

    public ApplicantProfileService(UserRepository userRepository,
                                    ApplicantProfileRepository applicantProfileRepository,
                                    FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public ApplicantProfileResponse getMyProfile(String email) {
        ApplicantProfile profile = loadByEmail(email);
        return toResponse(profile);
    }

    @Transactional
    public ApplicantProfileResponse updateMyProfile(String email, ApplicantProfileUpdateRequest req) {
        ApplicantProfile profile = loadByEmail(email);

        profile.setFirstName(req.firstName().trim());
        profile.setLastName(req.lastName().trim());
        profile.setIdNumber(blankToNull(req.idNumber()));
        profile.setPhone(blankToNull(req.phone()));
        profile.setDateOfBirth(req.dateOfBirth());
        profile.setGender(req.gender());
        profile.setProvince(blankToNull(req.province()));
        profile.setTownCity(blankToNull(req.townCity()));
        profile.setAddressLine(blankToNull(req.addressLine()));
        profile.setPostalCode(blankToNull(req.postalCode()));
        profile.setBio(blankToNull(req.bio()));
        profile.setProfileCompleted(isSubstantiallyComplete(profile));

        applicantProfileRepository.save(profile);
        return toResponse(profile);
    }

    @Transactional
    public FileUploadResponse uploadCv(String email, MultipartFile file) {
        ApplicantProfile profile = loadByEmail(email);

        FileStorageService.StoredFile stored = fileStorageService.storeCv(file);
        Instant now = Instant.now();

        profile.setCvFilePath(stored.relativePath());
        profile.setCvUploadedAt(now);
        applicantProfileRepository.save(profile);

        return new FileUploadResponse(toUrl(stored.relativePath()), stored.originalFilename(), stored.sizeBytes(), now);
    }

    @Transactional
    public FileUploadResponse uploadProfileImage(String email, MultipartFile file) {
        ApplicantProfile profile = loadByEmail(email);

        FileStorageService.StoredFile stored = fileStorageService.storeProfileImage(file);
        Instant now = Instant.now();

        profile.setProfileImagePath(stored.relativePath());
        profile.setProfileImageUploadedAt(now);
        applicantProfileRepository.save(profile);

        return new FileUploadResponse(toUrl(stored.relativePath()), stored.originalFilename(), stored.sizeBytes(), now);
    }

    // ---- helpers ----

    private ApplicantProfile loadByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return applicantProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found"));
    }

    private ApplicantProfileResponse toResponse(ApplicantProfile p) {
        return new ApplicantProfileResponse(
                p.getUserId(),
                p.getUser().getEmail(),
                p.getFirstName(),
                p.getLastName(),
                p.getIdNumber(),
                p.getPhone(),
                p.getDateOfBirth(),
                p.getGender(),
                p.getProvince(),
                p.getTownCity(),
                p.getAddressLine(),
                p.getPostalCode(),
                p.getBio(),
                toUrl(p.getCvFilePath()),
                p.getCvUploadedAt(),
                toUrl(p.getProfileImagePath()),
                p.getProfileImageUploadedAt(),
                p.isProfileCompleted()
        );
    }

    private String toUrl(String relativePath) {
        return relativePath == null ? null : "/uploads/" + relativePath;
    }

    private boolean isSubstantiallyComplete(ApplicantProfile p) {
        return notBlank(p.getFirstName()) && notBlank(p.getLastName()) && notBlank(p.getPhone())
                && notBlank(p.getProvince()) && notBlank(p.getTownCity()) && p.getCvFilePath() != null;
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
