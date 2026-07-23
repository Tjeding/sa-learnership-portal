# SA Learnerships & Skills Development Portal — Frontend

A React (Vite) prototype covering every screen in the brief: the public site, and
the Applicant, Provider and Admin dashboards. It runs on **mock data** in
`src/data/mockData.js` — there are no real API calls yet, so it's safe to demo
or screenshot without a backend running.

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To produce a production build:

```bash
npm run build
npm run preview   # serve the build locally to sanity-check it
```

## Where things live

```
src/
  data/mockData.js       — all demo data (opportunities, applications, users, NQF levels…)
  styles/tokens.css      — design tokens (colours, type, spacing, radii)
  styles/components.css  — shared component styles (cards, tables, badges, sidebar, etc.)
  components/            — shared building blocks (Sidebar, Topbar, StatCard, Donut, Pathway…)
  layouts/                — one layout per role (sidebar + outlet)
  pages/
    public/               — landing page, opportunity browsing (pre-login)
    auth/                 — login, register
    applicant/            — 11 pages: dashboard, find opportunities, application detail,
                             my applications, profile, messages, notifications, documents,
                             saved opportunities, recommended, settings
    provider/             — 10 pages: dashboard, my opportunities, post opportunity form,
                             applications, shortlisted candidates, reports, organisation
                             profile, messages, notifications, settings
    admin/                — 9 pages: dashboard, user management, opportunity approvals,
                             applications, reports & analytics (the 3 required reports +
                             a custom view builder), NQF management, content management,
                             system settings, audit logs
```

## Navigating the prototype

There's no real auth — `/login` and `/register` just redirect to the selected
role's dashboard (`/applicant`, `/provider`, `/admin`). Use the role picker on
those pages, or jump straight to a URL.

## Wiring up the real backend

Every page currently imports fake data from `src/data/mockData.js`. To connect
the Spring Boot API:

1. Add an API client (e.g. `src/api/client.js` using `fetch` and a `VITE_API_BASE_URL` env var).
2. Replace the mock-data imports in each page with calls to that client
   (React Query or plain `useEffect` + `useState` both work fine here).
3. The shapes in `mockData.js` were written to mirror the Postgres schema
   (`opportunities`, `applications`, `applicant_profiles`, `notifications`, etc.)
   so the mapping from API response → UI prop should be close to 1:1.

## Design notes

- Palette: warm "paper" background, veld green (growth/opportunity), sun gold
  (highlights/CTAs), teal (in-progress states), rust (rejections/warnings only).
- Type: Space Grotesk for headings, Inter for UI/body text, IBM Plex Mono for
  stat figures and tabular numbers.
- The dotted "pathway" tracker (see `Pathway` in `components/Widgets.jsx`) is
  the app's signature motif for application status, used on the landing page,
  the applicant dashboard, and the My Applications page.
