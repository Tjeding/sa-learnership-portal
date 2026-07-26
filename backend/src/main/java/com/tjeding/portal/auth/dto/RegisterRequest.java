package com.tjeding.portal.auth.dto;

import com.tjeding.portal.user.ProviderType;
import com.tjeding.portal.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * One payload for both applicant and provider sign-up, matching the
 * single Register.jsx form that toggles fields by role. Cross-field
 * rules (e.g. organizationName required when role=provider) are
 * enforced in AuthService rather than declaratively here, since they
 * depend on the value of another field.
 */
public record RegisterRequest(
        @NotNull(message = "role is required")
        UserRole role,

        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid address")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 8, message = "password must be at least 8 characters")
        String password,

        // --- applicant fields ---
        String firstName,
        String lastName,

        // --- provider fields ---
        String organizationName,
        ProviderType providerType,
        String contactPerson,
        String phone
) {
}
