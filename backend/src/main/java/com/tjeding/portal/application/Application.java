package com.tjeding.portal.application;


import com.tjeding.portal.opportunity.Opportunity;
import com.tjeding.portal.user.ApplicantProfile;
import com.tjeding.portal.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

/**
 * Maps "applications" (V4 migration). status_history and notifications
 * are populated by DB triggers on INSERT/UPDATE - the Java layer never
 * writes to those tables directly.
 */
@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private ApplicantProfile applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "application_status")
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.submitted;

    @Column(name = "cover_note", columnDefinition = "text")
    private String coverNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private Instant appliedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.appliedAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
} 
