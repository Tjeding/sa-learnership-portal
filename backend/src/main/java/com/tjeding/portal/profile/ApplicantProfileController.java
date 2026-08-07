package com.tjeding.portal.profile;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.profile.dto.ApplicantProfileResponse;
import com.tjeding.portal.profile.dto.ApplicantProfileUpdateRequest;
import com.tjeding.portal.profile.dto.FileUploadResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/applicant/profile")
@Tag(name = "Applicant Profile", description = "Applicant's own profile, CV, and profile image")
@SecurityRequirement(name = "bearerAuth")
public class ApplicantProfileController {

    private final ApplicantProfileService applicantProfileService;

    public ApplicantProfileController(ApplicantProfileService applicantProfileService) {
        this.applicantProfileService = applicantProfileService;
    }

    @GetMapping
    public ApiResponse<ApplicantProfileResponse> getMyProfile(Authentication authentication) {
        return ApiResponse.success(applicantProfileService.getMyProfile(authentication.getName()));
    }

    @PutMapping
    public ApiResponse<ApplicantProfileResponse> updateMyProfile(Authentication authentication,
                                                                   @Valid @RequestBody ApplicantProfileUpdateRequest request) {
        return ApiResponse.success(applicantProfileService.updateMyProfile(authentication.getName(), request));
    }

    @PostMapping(value = "/cv", consumes = "multipart/form-data")
    public ApiResponse<FileUploadResponse> uploadCv(Authentication authentication,
                                                      @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(applicantProfileService.uploadCv(authentication.getName(), file));
    }

    @PostMapping(value = "/image", consumes = "multipart/form-data")
    public ApiResponse<FileUploadResponse> uploadProfileImage(Authentication authentication,
                                                                @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(applicantProfileService.uploadProfileImage(authentication.getName(), file));
    }
}
