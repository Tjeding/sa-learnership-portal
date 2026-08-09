-- =====================================================================
-- V10__applicant_profile_image.sql
-- Adds profile image storage to applicant_profiles. cv_file_path /
-- cv_uploaded_at already exist from V1 for CV storage; this mirrors
-- that pattern for a profile picture.
-- =====================================================================

ALTER TABLE applicant_profiles
    ADD COLUMN profile_image_path TEXT,
    ADD COLUMN profile_image_uploaded_at TIMESTAMPTZ;
