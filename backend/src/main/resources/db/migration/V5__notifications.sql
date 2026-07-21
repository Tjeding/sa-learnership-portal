-- =====================================================================
-- V5__notifications.sql
-- In-app + email notifications for status updates, new matches, and
-- upcoming closing dates.
-- =====================================================================

CREATE TABLE notifications (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                    notification_type NOT NULL,
    title                   TEXT NOT NULL,
    message                 TEXT NOT NULL,
    related_application_id  BIGINT REFERENCES applications(id) ON DELETE SET NULL,
    related_opportunity_id  BIGINT REFERENCES opportunities(id) ON DELETE SET NULL,
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    read_at                 TIMESTAMPTZ,
    email_sent              BOOLEAN NOT NULL DEFAULT FALSE,
    email_sent_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_email_pending ON notifications(email_sent) WHERE email_sent = FALSE;

-- ---------------------------------------------------------------------
-- TABLE: notification_preferences (1:1 with users)
-- ---------------------------------------------------------------------
CREATE TABLE notification_preferences (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    new_match_alerts    BOOLEAN NOT NULL DEFAULT TRUE,
    closing_reminders   BOOLEAN NOT NULL DEFAULT TRUE
);

-- Give every new user sensible default preferences automatically.
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_notification_prefs
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();

-- ---------------------------------------------------------------------
-- Auto-generate an in-app notification whenever an application's status
-- changes (received / shortlisted / rejected / offered / accepted).
-- Actual email dispatch stays in the Java layer (e.g. a scheduled job
-- that SELECTs WHERE email_sent = FALSE AND user has email_enabled,
-- sends via JavaMail/SES/SendGrid, then flips email_sent = TRUE).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION notify_on_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_applicant_user_id BIGINT;
    v_opportunity_title TEXT;
    v_message TEXT;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
        v_applicant_user_id := NEW.applicant_id;
        SELECT title INTO v_opportunity_title FROM opportunities WHERE id = NEW.opportunity_id;

        v_message := format('Your application for "%s" is now: %s', v_opportunity_title, NEW.status);

        INSERT INTO notifications (user_id, type, title, message, related_application_id, related_opportunity_id)
        VALUES (v_applicant_user_id, 'application_status', 'Application status updated', v_message, NEW.id, NEW.opportunity_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_application_status
    AFTER UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION notify_on_application_status_change();

-- ---------------------------------------------------------------------
-- Also notify the applicant the moment they submit (status = 'submitted'
-- on INSERT) so "received" confirmations work too.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION notify_on_application_created()
RETURNS TRIGGER AS $$
DECLARE
    v_opportunity_title TEXT;
BEGIN
    SELECT title INTO v_opportunity_title FROM opportunities WHERE id = NEW.opportunity_id;

    INSERT INTO notifications (user_id, type, title, message, related_application_id, related_opportunity_id)
    VALUES (
        NEW.applicant_id,
        'application_status',
        'Application received',
        format('We received your application for "%s".', v_opportunity_title),
        NEW.id,
        NEW.opportunity_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_application_created
    AFTER INSERT ON applications
    FOR EACH ROW EXECUTE FUNCTION notify_on_application_created();
