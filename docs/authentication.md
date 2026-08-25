# Authentication

Registration and login issue a signed JWT access token and JWT refresh token. Passwords are BCrypt-hashed. Access-token validity defaults to 24 hours and refresh-token validity to seven days. Only a SHA-256 hash of each refresh token is persisted; refresh rotates and revokes the old record. Logout is idempotent and revokes a stored refresh token when found.

`POST /api/v1/auth/register` accepts `role`, `email`, `password`, applicant names or provider organisation/type fields. Applicants and providers may self-register; `admin` may not. `POST /login`, `/refresh-token`, `/logout`, and authenticated `GET /me` complete the lifecycle. Email verification fields/tokens are created but no email is sent; the token is currently logged, which is unsuitable for production.

The frontend stores both tokens in `localStorage` and sends the access token as a Bearer header. This is convenient but exposes tokens to any successful XSS; production should consider a hardened token-storage/session design. See [API](api.md) and [security](security.md).
