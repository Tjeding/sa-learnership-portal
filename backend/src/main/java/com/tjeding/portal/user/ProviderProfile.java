package com.tjeding.portal.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

/**
 * Maps "provider_profiles" (V1 migration). Only the fields needed to
 * satisfy NOT NULL constraints and drive registration are mapped here;
 * SETA accreditation, sector, verification workflow etc. arrive with
 * the provider profile management feature.
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
    @Column(name = "user_id", nullable = false)
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

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "phone")
    private String phone;

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
