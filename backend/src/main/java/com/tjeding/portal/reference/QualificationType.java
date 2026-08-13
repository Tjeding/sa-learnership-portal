package com.tjeding.portal.reference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Maps "qualification_types" (V2 migration, seeded in V8). Sourced
 * from SAQA's registered qualifications list - see docs for the
 * justification writeup. Populates the applicant-profile and
 * opportunity-listing qualification dropdowns; never hardcode these
 * in the frontend.
 */
@Entity
@Table(name = "qualification_types")
@Getter
@Setter
public class QualificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "saqa_id")
    private String saqaId;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nqf_level_id", nullable = false)
    private NqfLevel nqfLevel;

    @Column(name = "qualification_category", nullable = false)
    private String qualificationCategory;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "source_url", nullable = false)
    private String sourceUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}