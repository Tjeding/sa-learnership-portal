package com.tjeding.portal.reference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Maps "sectors" (V1 migration, seeded in V8). Referenced by
 * provider_profiles and opportunities. Read-only from the API for now
 * - admins manage the seeded list directly in the DB until an
 * admin-content-management feature exists.
 */
@Entity
@Table(name = "sectors")
@Getter
@Setter
public class Sector {

    @Id
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;
}
