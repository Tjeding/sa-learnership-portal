package com.tjeding.portal.profile;

import com.tjeding.portal.common.ApiResponse;
import com.tjeding.portal.profile.dto.ProviderProfileResponse;
import com.tjeding.portal.profile.dto.ProviderProfileUpdateRequest;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/provider/organisation")
@Tag(name = "Provider Organisation", description = "Provider's own organisation profile")
@SecurityRequirement(name = "bearerAuth")
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    public ProviderProfileController(ProviderProfileService providerProfileService) {
        this.providerProfileService = providerProfileService;
    }

    @GetMapping
    public ApiResponse<ProviderProfileResponse> getMyOrganisation(Authentication authentication) {
        return ApiResponse.success(providerProfileService.getMyOrganisation(authentication.getName()));
    }

    @PutMapping
    public ApiResponse<ProviderProfileResponse> updateMyOrganisation(Authentication authentication,
                                                                       @Valid @RequestBody ProviderProfileUpdateRequest request) {
        return ApiResponse.success(providerProfileService.updateMyOrganisation(authentication.getName(), request));
    }
}
