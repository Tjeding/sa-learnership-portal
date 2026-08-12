-- Change users.email from PostgreSQL CITEXT to VARCHAR
ALTER TABLE users
    ALTER COLUMN email TYPE VARCHAR(255)
    USING email::text;

-- Preserve case-insensitive uniqueness
DROP INDEX IF EXISTS users_email_key;

CREATE UNIQUE INDEX uq_users_email_lower
    ON users (LOWER(email));