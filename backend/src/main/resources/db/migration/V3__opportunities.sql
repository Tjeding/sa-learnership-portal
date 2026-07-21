-- =====================================================================
-- V3__opportunities.sql
-- Opportunity listings (learnerships / internships / apprenticeships)
-- =====================================================================

CREATE TABLE opportunities (
    id                  BIGSERIAL PRIMARY KEY,
    provider_id         BIGINT NOT NULL REFERENCES provider_profiles(user_id),
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    opportunity_type    opportunity_type NOT NULL,
    sector_id           INT REFERENCES sectors(id),
    min_nqf_level_id    SMALLINT REFERENCES nqf_levels(id),
    stipend_amount      NUMERIC(10,2),
    stipend_period      TEXT DEFAULT 'monthly',   -- 'monthly', 'once-off', 'unpaid'
    location            TEXT,
    province             TEXT,
    duration_months     INT,
    positions_available INT NOT NULL DEFAULT 1,
    closing_date        DATE NOT NULL,
    status              opportunity_status NOT NULL DEFAULT 'draft',
    rejection_reason    TEXT,
    approved_by         BIGINT REFERENCES users(id),
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_positions_available CHECK (positions_available >= 1)
);

CREATE TRIGGER trg_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_opportunities_provider ON opportunities(provider_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_closing_date ON opportunities(closing_date);
CREATE INDEX idx_opportunities_sector ON opportunities(sector_id);
CREATE INDEX idx_opportunities_type ON opportunities(opportunity_type);

-- Free-text requirements shown as a bullet list on the listing
-- (e.g. "Must have own transport", "Valid Code 8 driver's licence").
CREATE TABLE opportunity_requirements (
    id              BIGSERIAL PRIMARY KEY,
    opportunity_id  BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    requirement_text TEXT NOT NULL,
    display_order   SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_opportunity_requirements_opp ON opportunity_requirements(opportunity_id);

-- Structured skill requirements, used for matching/filtering.
CREATE TABLE opportunity_skills (
    opportunity_id  BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_id        INT NOT NULL REFERENCES skills(id),
    is_required     BOOLEAN NOT NULL DEFAULT TRUE,   -- required vs "nice to have"
    PRIMARY KEY (opportunity_id, skill_id)
);

-- Structured qualification requirements (NQF-aligned).
CREATE TABLE opportunity_qualifications (
    opportunity_id          BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    qualification_type_id   INT NOT NULL REFERENCES qualification_types(id),
    is_required             BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (opportunity_id, qualification_type_id)
);

-- Trigger: enforce that only users with role='provider' create opportunities
-- (defence in depth; the Java service layer should also check this).
CREATE OR REPLACE FUNCTION enforce_provider_owns_opportunity()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM provider_profiles WHERE user_id = NEW.provider_id
    ) THEN
        RAISE EXCEPTION 'user % has no provider profile', NEW.provider_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_opportunity_provider
    BEFORE INSERT OR UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION enforce_provider_owns_opportunity();

-- Convenience function: automatically flip status from 'approved' to
-- 'closed' once closing_date has passed. Call this from a scheduled
-- Java job (e.g. Spring @Scheduled) or a pg_cron job - see README.
CREATE OR REPLACE FUNCTION close_expired_opportunities()
RETURNS INTEGER AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE opportunities
       SET status = 'closed'
     WHERE status = 'approved'
       AND closing_date < CURRENT_DATE;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected;
END;
$$ LANGUAGE plpgsql;
