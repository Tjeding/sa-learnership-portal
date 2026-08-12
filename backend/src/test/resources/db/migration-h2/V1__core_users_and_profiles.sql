-- =====================================================================
-- V1__core_users_and_profiles.sql (H2 TEST VERSION)
-- SA Learnerships and Skills Development Portal
-- Core: users, applicant profiles, provider profiles (H2 compatible)
-- =====================================================================

-- TABLE: users
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    role            VARCHAR(20) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token      VARCHAR(255),
    verification_expires_at TIMESTAMP,
    password_reset_token     VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);

-- TABLE: applicant_profiles
CREATE TABLE applicant_profiles (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name          VARCHAR(255) NOT NULL,
    last_name           VARCHAR(255) NOT NULL,
    id_number           VARCHAR(13) UNIQUE,
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              VARCHAR(20),
    province            VARCHAR(255),
    town_city           VARCHAR(255),
    address_line        VARCHAR(255),
    postal_code         VARCHAR(10),
    cv_file_path        VARCHAR(255),
    cv_uploaded_at      TIMESTAMP,
    bio                 TEXT,
    profile_completed   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applicant_profiles_province ON applicant_profiles(province);

-- TABLE: sectors
CREATE TABLE sectors (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(255) UNIQUE NOT NULL
);

-- TABLE: provider_profiles
CREATE TABLE provider_profiles (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_name   VARCHAR(255) NOT NULL,
    provider_type       VARCHAR(30) NOT NULL,
    registration_number VARCHAR(255),
    seta_accreditation_number VARCHAR(255),
    sector_id           INT REFERENCES sectors(id),
    contact_person      VARCHAR(255),
    phone               VARCHAR(20),
    website             VARCHAR(255),
    address_line        VARCHAR(255),
    province            VARCHAR(255),
    town_city           VARCHAR(255),
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by         BIGINT REFERENCES users(id),
    verified_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_profiles_sector ON provider_profiles(sector_id);