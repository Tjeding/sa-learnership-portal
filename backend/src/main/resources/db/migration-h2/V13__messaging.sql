-- =====================================================================
-- V13__messaging.sql  (H2-compatible version)
-- Applicant ↔ Provider messaging.
-- =====================================================================

CREATE TABLE conversations (
    id              BIGSERIAL PRIMARY KEY,
    applicant_id    BIGINT NOT NULL REFERENCES applicant_profiles(user_id),
    provider_id     BIGINT NOT NULL REFERENCES provider_profiles(user_id),
    opportunity_id  BIGINT REFERENCES opportunities(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (applicant_id, provider_id, opportunity_id)
);

CREATE INDEX idx_conversations_applicant ON conversations(applicant_id);
CREATE INDEX idx_conversations_provider ON conversations(provider_id);
CREATE INDEX idx_conversations_opportunity ON conversations(opportunity_id);

CREATE TRIGGER trg_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       BIGINT NOT NULL REFERENCES users(id),
    body            TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;
