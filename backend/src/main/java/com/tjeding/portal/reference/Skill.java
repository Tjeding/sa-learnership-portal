package com.tjeding.portal.reference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Maps "skills" (V2 migration, seeded in V8). Shared tag set used by
 * both applicant_skills and opportunity_skills.
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private String category;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}