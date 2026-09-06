-- Support agents can participate without a fabricated applicant/provider profile.
ALTER TABLE conversations DROP CONSTRAINT conversations_applicant_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT conversations_provider_id_fkey;
ALTER TABLE conversations ADD CONSTRAINT conversations_applicant_id_fkey FOREIGN KEY (applicant_id) REFERENCES users(id);
ALTER TABLE conversations ADD CONSTRAINT conversations_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES users(id);
