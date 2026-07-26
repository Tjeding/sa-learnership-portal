package com.tjeding.portal.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Maps "applicant_profiles" (V1 migration). Only the fields needed to
 * satisfy the table's NOT NULL constraints at registration time are
 * mapped here; profile-completion fields (CV, bio, address, etc.) will
 * be added when the applicant profile feature is built.
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

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

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
