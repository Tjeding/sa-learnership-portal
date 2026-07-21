-- =====================================================================
-- V2__nqf_reference_data.sql
-- SA Data Integration requirement: NQF levels + registered qualification
-- types, sourced from SAQA (South African Qualifications Authority).
--
-- CHOSEN SOURCE (document this in your backlog too):
--   SAQA - South African Qualifications Authority
--   - NQF Level Descriptors: https://www.saqa.org.za/level-descriptors-for-the-south-african-national-qualifications-framework/
--   - National Learners' Records Database (NLRD) / searchable qualifications
--     database: https://allqs.saqa.org.za/search.php
--   SAQA does not expose a public REST API, so qualification types are
--   curated into the qualification_types table below (seeded from SAQA's
--   published registered-qualifications list) rather than fetched live.
--   Admins can add/edit rows via the admin UI as SAQA updates its lists -
--   see the admin_qualification_suggestions table for that workflow.
-- =====================================================================

-- ---------------------------------------------------------------------
-- TABLE: nqf_levels
-- The 10 official NQF levels (National Qualifications Framework Act
-- No. 67 of 2008), levels 1-4 sub-framework GFETQSF, 5-10 HEQSF/OQSF.
-- ---------------------------------------------------------------------
CREATE TABLE nqf_levels (
    id              SMALLINT PRIMARY KEY,   -- 1 through 10
    level_name      TEXT NOT NULL,          -- e.g. 'NQF Level 4'
    sub_framework   TEXT NOT NULL,          -- 'GFETQSF', 'HEQSF', or 'OQSF'
    typical_example TEXT,                   -- human-readable example, e.g. 'Grade 12 / National Senior Certificate'
    source_url      TEXT NOT NULL DEFAULT 'https://www.saqa.org.za/level-descriptors-for-the-south-african-national-qualifications-framework/'
);

-- ---------------------------------------------------------------------
-- TABLE: qualification_types
-- Registered qualification types linked to an NQF level. Populated from
-- SAQA's published qualifications list. The Java application should
-- populate its qualification dropdown by querying this table (never
-- hardcode qualification names in the frontend/backend).
-- ---------------------------------------------------------------------
CREATE TABLE qualification_types (
    id                  SERIAL PRIMARY KEY,
    saqa_id             TEXT UNIQUE,             -- SAQA qualification ID, where known/applicable
    title               TEXT NOT NULL,
    nqf_level_id        SMALLINT NOT NULL REFERENCES nqf_levels(id),
    qualification_category TEXT NOT NULL,        -- e.g. 'School Leaving', 'Learnership', 'Higher Certificate', 'Diploma', 'Degree'
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    source_url          TEXT NOT NULL DEFAULT 'https://allqs.saqa.org.za/search.php',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qualification_types_nqf_level ON qualification_types(nqf_level_id);

-- ---------------------------------------------------------------------
-- TABLE: admin_qualification_suggestions
-- Lets admins (or providers) propose a new qualification type that isn't
-- yet in the dropdown; an admin reviews and promotes it into
-- qualification_types. Keeps the reference data current without needing
-- a live SAQA API.
-- ---------------------------------------------------------------------
CREATE TABLE admin_qualification_suggestions (
    id              BIGSERIAL PRIMARY KEY,
    suggested_by    BIGINT NOT NULL REFERENCES users(id),
    proposed_title  TEXT NOT NULL,
    proposed_nqf_level_id SMALLINT REFERENCES nqf_levels(id),
    saqa_reference_url TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by     BIGINT REFERENCES users(id),
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- TABLE: skills
-- Skill tags used by both applicant profiles and opportunity listings.
-- ---------------------------------------------------------------------
CREATE TABLE skills (
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    category    TEXT,                 -- e.g. 'Technical', 'Soft Skill', 'Trade'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- TABLE: applicant_qualifications (M:N applicant <-> qualification_type,
-- with extra detail per record)
-- ---------------------------------------------------------------------
CREATE TABLE applicant_qualifications (
    id                      BIGSERIAL PRIMARY KEY,
    applicant_id            BIGINT NOT NULL REFERENCES applicant_profiles(user_id) ON DELETE CASCADE,
    qualification_type_id   INT NOT NULL REFERENCES qualification_types(id),
    institution_name        TEXT,
    year_completed          SMALLINT,
    certificate_file_path   TEXT,
    is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (applicant_id, qualification_type_id, institution_name)
);

CREATE INDEX idx_applicant_qualifications_applicant ON applicant_qualifications(applicant_id);
CREATE INDEX idx_applicant_qualifications_type ON applicant_qualifications(qualification_type_id);

-- ---------------------------------------------------------------------
-- TABLE: applicant_skills (M:N applicant <-> skill)
-- ---------------------------------------------------------------------
CREATE TABLE applicant_skills (
    applicant_id    BIGINT NOT NULL REFERENCES applicant_profiles(user_id) ON DELETE CASCADE,
    skill_id        INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency     proficiency_level NOT NULL DEFAULT 'beginner',
    PRIMARY KEY (applicant_id, skill_id)
);

CREATE INDEX idx_applicant_skills_skill ON applicant_skills(skill_id);
