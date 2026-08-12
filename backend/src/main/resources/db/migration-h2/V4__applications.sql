-- =====================================================================
-- V4__applications.sql
-- Application workflow: submit, review, shortlist, reject, offer, accept
-- =====================================================================

CREATE TABLE applications (
    id              BIGSERIAL PRIMARY KEY,
    applicant_id    BIGINT NOT NULL REFERENCES applicant_profiles(user_id),
    opportunity_id  BIGINT NOT NULL REFERENCES opportunities(id),
    status          application_status NOT NULL DEFAULT 'submitted',
    cover_note      TEXT,
    reviewed_by     BIGINT REFERENCES users(id),   -- provider staff who last actioned it
    applied_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (applicant_id, opportunity_id)           -- one application per applicant per opportunity
);

CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Only allow applying to opportunities that are actually open.
CREATE OR REPLACE FUNCTION enforce_opportunity_open_for_application()
RETURNS TRIGGER AS $$
DECLARE
    opp_status opportunity_status;
    opp_closing DATE;
BEGIN
    SELECT status, closing_date INTO opp_status, opp_closing
    FROM opportunities WHERE id = NEW.opportunity_id;

    IF TG_OP = 'INSERT' THEN
        IF opp_status <> 'approved' THEN
            RAISE EXCEPTION 'opportunity % is not open for applications (status=%)', NEW.opportunity_id, opp_status;
        END IF;
        IF opp_closing < CURRENT_DATE THEN
            RAISE EXCEPTION 'opportunity % closed on %', NEW.opportunity_id, opp_closing;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_opportunity_open
BEFORE INSERT ON applications
FOR EACH ROW EXECUTE FUNCTION enforce_opportunity_open_for_application();

-- TABLE: application_status_history
-- Full audit trail of every status change, also the backbone for the
-- "application volume" and "placement success rate" analytics reports.
CREATE TABLE application_status_history (
    id              BIGSERIAL PRIMARY KEY,
    application_id  BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status          application_status NOT NULL,
    changed_by      BIGINT REFERENCES users(id),
    notes           TEXT,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_status_history_application ON application_status_history(application_id);
CREATE INDEX idx_app_status_history_status ON application_status_history(status);

-- Automatically record every status change into the history table,
-- and seed one row at creation time.
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO application_status_history (application_id, status, changed_by)
        VALUES (NEW.id, NEW.status, NEW.reviewed_by);
    ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO application_status_history (application_id, status, changed_by)
        VALUES (NEW.id, NEW.status, NEW.reviewed_by);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_application_status
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION log_application_status_change();
