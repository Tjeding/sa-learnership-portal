-- =====================================================================
-- V10__applicant_profile_image.sql
-- Adds profile image storage to applicant_profiles for H2 tests.
-- =====================================================================

ALTER TABLE applicant_profiles
    ADD COLUMN profile_image_path VARCHAR(255);

ALTER TABLE applicant_profiles
    ADD COLUMN profile_image_uploaded_at TIMESTAMP;
