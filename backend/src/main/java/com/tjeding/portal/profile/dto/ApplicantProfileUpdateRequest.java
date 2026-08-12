package com.tjeding.portal.profile.dto;

import com.tjeding.portal.user.GenderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record ApplicantProfileUpdateRequest(
        @NotBlank(message = "firstName is required")
        String firstName,

        @NotBlank(message = "lastName is required")
        String lastName,

        @Pattern(regexp = "^\\d{13}$", message = "idNumber must be exactly 13 digits")
        String idNumber,

        String phone,
        LocalDate dateOfBirth,
        GenderType gender,
        String province,
        String townCity,
        String addressLine,
        String postalCode,
        String bio
) {
}
