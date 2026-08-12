-- =====================================================================
-- V1__core_users_and_profiles.sql
-- SA Learnerships and Skills Development Portal
-- Core: extensions, enum types, users, applicant profiles, provider profiles
-- Target: PostgreSQL 14+
-- =====================================================================

-- EXTENSIONS
-- pgcrypto: gives us gen_random_uuid() and crypt()/gen_salt() if you
--           ever want to verify password hashes at the DB level.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUM TYPES
CREATE TYPE user_role AS ENUM ('applicant', 'provider', 'admin');

CREATE TYPE provider_type AS ENUM ('employer', 'training_provider', 'both');

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

CREATE TYPE opportunity_type AS ENUM ('learnership', 'internship', 'apprenticeship');

CREATE TYPE opportunity_status AS ENUM (
    'draft',            -- provider still editing, not submitted
    'pending_approval',
    'approved',
    'rejected',
    'closed',            -- past closing date, no longer accepting applications
    'filled'             -- provider marked all positions filled
);

CREATE TYPE application_status AS ENUM (
    'submitted',
    'under_review',
    'shortlisted',
    'rejected',
    'offered',
    'accepted',
    'withdrawn'
);

CREATE TYPE notification_type AS ENUM (
    'application_status',
    'new_match',
    'closing_reminder',
    'system'
);

CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- REUSABLE FUNCTION: auto-update "updated_at" columns
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TABLE: users
-- One row per login, regardless of role. Role-specific data lives in
-- applicant_profiles / provider_profiles (1:1 extension tables).
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL,
    password_hash   TEXT NOT NULL,           -- store bcrypt/argon2 hash from Java (e.g. Spring Security BCryptPasswordEncoder), never plaintext
    role            user_role NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,   -- email verification flag
    verification_token      TEXT,
    verification_expires_at TIMESTAMPTZ,
    password_reset_token     TEXT,
    password_reset_expires_at TIMESTAMPTZ,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_users_email_lower
    ON users (LOWER(email));

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_role ON users(role);

-- TABLE: applicant_profiles (1:1 extension of users where role = applicant)
CREATE TABLE applicant_profiles (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    id_number           VARCHAR(13) UNIQUE,      -- SA 13-digit ID number; validate format in Java
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              gender_type,
    province            TEXT,                    -- e.g. 'Gauteng', 'Western Cape' - see reference table below
    town_city           TEXT,
    address_line        TEXT,
    postal_code         VARCHAR(10),
    cv_file_path        TEXT,                    -- path/URL to uploaded CV (store file on disk/S3, path here)
    cv_uploaded_at      TIMESTAMPTZ,
    bio                 TEXT,
    profile_completed   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_id_number_format CHECK (id_number IS NULL OR id_number ~ '^\d{13}$')
);

CREATE TRIGGER trg_applicant_profiles_updated_at
BEFORE UPDATE ON applicant_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_applicant_profiles_province ON applicant_profiles(province);

-- TABLE: sectors (used by both providers and opportunities, and for the
-- "placement success rate by sector" report)
CREATE TABLE sectors (
    id      SERIAL PRIMARY KEY,
    name    TEXT UNIQUE NOT NULL      -- e.g. 'Information Technology', 'Construction', 'Agriculture'
);

-- TABLE: provider_profiles (1:1 extension of users where role = provider)
CREATE TABLE provider_profiles (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_name   TEXT NOT NULL,
    provider_type       provider_type NOT NULL,
    registration_number TEXT,             -- company/SETA registration number
    seta_accreditation_number TEXT,       -- SETA accreditation, where applicable
    sector_id           INT REFERENCES sectors(id),
    contact_person      TEXT,
    phone               VARCHAR(20),
    website              TEXT,
    address_line        TEXT,
    province            TEXT,
    town_city           TEXT,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,   -- admin has vetted this organisation
    verified_by         BIGINT REFERENCES users(id),      -- admin user id
    verified_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_provider_profiles_updated_at
BEFORE UPDATE ON provider_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_provider_profiles_sector ON provider_profiles(sector_id);

-- CHECK: enforce that only users with the matching role get a profile row.
-- (Postgres can't do cross-table CHECK constraints directly, so we use
-- a trigger.)
CREATE OR REPLACE FUNCTION enforce_role_on_applicant_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id AND role = 'applicant') THEN
        RAISE EXCEPTION 'user % is not an applicant', NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_applicant_role
BEFORE INSERT OR UPDATE ON applicant_profiles
FOR EACH ROW EXECUTE FUNCTION enforce_role_on_applicant_profile();

CREATE OR REPLACE FUNCTION enforce_role_on_provider_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id AND role = 'provider') THEN
        RAISE EXCEPTION 'user % is not a provider', NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_provider_role
BEFORE INSERT OR UPDATE ON provider_profiles
FOR EACH ROW EXECUTE FUNCTION enforce_role_on_provider_profile();
