package com.tjeding.portal.user;

/**
 * Mirrors the Postgres "user_role" enum type (V1 migration). Constant
 * names are deliberately lowercase so Hibernate's NAMED_ENUM mapping
 * (see User.role) matches the DB labels exactly.
 */
public enum UserRole {
    applicant, provider, admin
}
