-- =====================================================================
-- V6__audit_and_reports.sql
-- Audit trail + saved custom report definitions (for the "custom view"
-- analytics requirement).
-- =====================================================================

CREATE TABLE audit_log (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id),   -- nullable: system-generated events have no user
    action      TEXT NOT NULL,                 -- e.g. 'LOGIN', 'OPPORTUNITY_APPROVED', 'APPLICATION_SHORTLISTED'
    entity_type TEXT NOT NULL,                 -- e.g. 'opportunity', 'application', 'user'
    entity_id   BIGINT,
    details     JSONB,                         -- free-form extra context
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Admins can save a filter configuration (e.g. "Q2 IT sector placements")
-- and re-run/export it later. filters is JSONB so your Java layer can
-- store whatever query parameters the report screen supports.
CREATE TABLE saved_reports (
    id          BIGSERIAL PRIMARY KEY,
    created_by  BIGINT NOT NULL REFERENCES users(id),
    report_name TEXT NOT NULL,
    filters     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_saved_reports_updated_at
    BEFORE UPDATE ON saved_reports
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
