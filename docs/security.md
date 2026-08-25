# Security notes

Implemented controls include BCrypt password hashing, signed JWT access/refresh tokens, hashed stored refresh tokens, refresh rotation, stateless role checks, ownership checks for several user-owned resources, bean validation, JPA/JdbcTemplate parameter binding, restrictive configurable CORS, multipart limits, and production error-detail suppression.

Important gaps: `/uploads/**` is publicly served; the frontend keeps tokens in `localStorage`; CSRF is disabled (appropriate to the current header-token API, but revisit if cookies are adopted); default development JWT/database values must never be deployed; and registration logs email-verification tokens because email delivery is not implemented. The security configuration has duplicate matchers and an `anyRequest().permitAll()` fallback, so new endpoints must be explicitly secured. Enable HTTPS, use unique secrets, restrict CORS, secure backup/upload storage, and scan dependencies before production.
