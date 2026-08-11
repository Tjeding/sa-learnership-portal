package com.tjeding.portal.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Maps "applicant_profiles" (V1 migration, profile image columns from
 * V10). Qualifications and skills are separate many-to-many tables and
 * are out of scope here - they arrive with the qualifications/skills
 * feature.
 */
@Entity
@Table(name = "applicant_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    public void setUser(User user) {
        this.user = user;
    }

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "id_number", length = 13, unique = true)
    private String idNumber;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "gender", columnDefinition = "gender_type")
    private GenderType gender;

    @Column(name = "province")
    private String province;

    @Column(name = "town_city")
    private String townCity;

    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "cv_file_path")
    private String cvFilePath;

    @Column(name = "cv_uploaded_at")
    private Instant cvUploadedAt;

    @Column(name = "profile_image_path")
    private String profileImagePath;

    @Column(name = "profile_image_uploaded_at")
    private Instant profileImageUploadedAt;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "profile_completed", nullable = false)
    @Builder.Default
    private boolean profileCompleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
