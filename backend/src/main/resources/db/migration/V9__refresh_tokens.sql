-- =====================================================================
-- V9__refresh_tokens.sql
-- Server-side refresh token records so /logout and token rotation can
-- actually revoke a token, instead of relying on a purely stateless JWT
-- that can't be invalidated before it expires.
--
-- We store a SHA-256 hash of the refresh token, never the raw token,
-- the same way a password hash is stored instead of the password.
-- =====================================================================

CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(user_id) WHERE revoked_at IS NULL;
