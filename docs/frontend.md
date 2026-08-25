# Frontend

The client uses React 19, React Router 7, Vite 8, lucide-react, CSS tokens/components, and direct browser `fetch` calls. `main.jsx` mounts `App`; `App.jsx` defines public routes and applicant/provider/admin nested routes. Role layouts provide the shared navigation shell.

`AuthContext` retains `accessToken`, `refreshToken`, and a user object in `localStorage`. It calls `/api/v1/auth/me` when a token exists without a stored user, attempts server logout, and synchronises login/logout between tabs. `ProtectedRoute` performs client-side role redirects; backend role controls remain the authoritative protection.

Pages call `${VITE_API_URL || http://localhost:8080}/api/v1/...` individually. There is no central API client, proxy, React Query, Redux, or automatic token-refresh interceptor. Components generally hold request/loading/error state locally. Forms use browser controls plus API validation responses. Styling is plain CSS (`src/index.css`, `styles/tokens.css`, `styles/components.css`).

The currently committed frontend README is outdated: it refers to `mockData.js` and mock-only routing, but that file is absent and current pages issue API requests. Some screen names exceed available backend endpoints (for example admin settings/audit and general settings); those UI surfaces should not be read as API-backed functionality. `ContentManagement` and `NQFManagement` use public reference-data endpoints but do not have matching management endpoints. The public landing page also requests the admin-only dashboard endpoint, so that request receives an authorization error for unauthenticated visitors. Build with `npm run build`; lint with `npm run lint`.
