CREATE TABLE saved_opportunities (
    applicant_id    BIGINT NOT NULL REFERENCES applicant_profiles(user_id) ON DELETE CASCADE,
    opportunity_id  BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    saved_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (applicant_id, opportunity_id)
);

CREATE INDEX idx_saved_opportunities_applicant ON saved_opportunities(applicant_id);