package com.tjeding.portal.profile.dto;

import com.tjeding.portal.user.ProviderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProviderProfileUpdateRequest(
        @NotBlank(message = "organizationName is required")
        String organizationName,

        @NotNull(message = "providerType is required")
        ProviderType providerType,

        Integer sectorId,
        String registrationNumber,
        String setaAccreditationNumber,
        String contactPerson,
        String phone,
        String website,
        String addressLine,
        String province,
        String townCity
) {
}
