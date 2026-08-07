package com.tjeding.portal.user;

import com.tjeding.portal.reference.Sector;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

/**
 * Maps "provider_profiles" (V1 migration). Verification workflow
 * (verified_by/verified_at, admin vetting) stays out of scope until the
 * admin provider-approval feature is built; is_verified is
 * read-only from this entity's own update path.
 */
@Entity
@Table(name = "provider_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "organization_name", nullable = false)
    private String organizationName;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "provider_type", nullable = false, columnDefinition = "provider_type")
    private ProviderType providerType;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "seta_accreditation_number")
    private String setaAccreditationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "phone")
    private String phone;

    @Column(name = "website")
    private String website;

    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "province")
    private String province;

    @Column(name = "town_city")
    private String townCity;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

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
