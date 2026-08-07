package com.tjeding.portal.profile.dto;

import com.tjeding.portal.user.ProviderType;

public record ProviderProfileResponse(
        Long userId,
        String email,
        String organizationName,
        ProviderType providerType,
        String registrationNumber,
        String setaAccreditationNumber,
        Integer sectorId,
        String sectorName,
        String contactPerson,
        String phone,
        String website,
        String addressLine,
        String province,
        String townCity,
        boolean verified
) {
}
