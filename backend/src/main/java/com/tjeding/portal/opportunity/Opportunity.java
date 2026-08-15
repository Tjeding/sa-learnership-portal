package com.tjeding.portal.opportunity;

import com.tjeding.portal.reference.NqfLevel;
import com.tjeding.portal.reference.Sector;
import com.tjeding.portal.user.ProviderProfile;
import com.tjeding.portal.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Maps "opportunities" (V3 migration). requirements/skills are
 * OneToMany child collections (opportunity_requirements /
 * opportunity_skills); opportunity_qualifications is out of scope
 * until a form field exists to populate it.
 */
@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "opportunity_type", nullable = false, columnDefinition = "opportunity_type")
    private OpportunityType opportunityType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "min_nqf_level_id")
    private NqfLevel minNqfLevel;

    @Column(name = "stipend_amount", precision = 10, scale = 2)
    private BigDecimal stipendAmount;

    @Column(name = "stipend_period")
    @Builder.Default
    private String stipendPeriod = "monthly";

    private String location;
    private String province;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "positions_available", nullable = false)
    @Builder.Default
    private Integer positionsAvailable = 1;

    @Column(name = "closing_date", nullable = false)
    private LocalDate closingDate;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "opportunity_status")
    @Builder.Default
    private OpportunityStatus status = OpportunityStatus.draft;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpportunityRequirement> requirements = new ArrayList<>();

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpportunitySkill> skills = new ArrayList<>();

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