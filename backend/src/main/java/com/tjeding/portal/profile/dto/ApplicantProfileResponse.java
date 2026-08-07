package com.tjeding.portal.profile.dto;

import com.tjeding.portal.user.GenderType;

import java.time.Instant;
import java.time.LocalDate;

public record ApplicantProfileResponse(
        Long userId,
        String email,
        String firstName,
        String lastName,
        String idNumber,
        String phone,
        LocalDate dateOfBirth,
        GenderType gender,
        String province,
        String townCity,
        String addressLine,
        String postalCode,
        String bio,
        String cvUrl,
        Instant cvUploadedAt,
        String profileImageUrl,
        Instant profileImageUploadedAt,
        boolean profileCompleted
) {
}
