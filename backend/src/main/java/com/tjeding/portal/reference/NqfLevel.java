package com.tjeding.portal.reference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Maps "nqf_levels" (V2 migration, seeded in V8). Fixed 1-10 rows
 * aligned to SAQA's NQF - read-only from the API, same spirit as
 * Sector.
 */
@Entity
@Table(name = "nqf_levels")
@Getter
@Setter
public class NqfLevel {

    @Id
    private Short id;

    @Column(name = "level_name", nullable = false)
    private String levelName;

    @Column(name = "sub_framework", nullable = false)
    private String subFramework;

    @Column(name = "typical_example")
    private String typicalExample;

    @Column(name = "source_url", nullable = false)
    private String sourceUrl;
}