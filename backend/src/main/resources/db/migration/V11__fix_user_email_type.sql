-- Change users.email from PostgreSQL CITEXT to VARCHAR and preserve case-insensitive uniqueness.
ALTER TABLE users
    ALTER COLUMN email TYPE VARCHAR(255)
    USING email::text;

-- Remove the legacy unique constraint/index created by the original CITEXT column.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
DROP INDEX IF EXISTS users_email_key;
DROP INDEX IF EXISTS uq_users_email_lower;

CREATE UNIQUE INDEX uq_users_email_lower
    ON users (LOWER(email));