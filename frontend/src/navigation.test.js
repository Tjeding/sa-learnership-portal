import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
let server;
let React, render, MemoryRouter, AuthProvider, InboxProvider, Topbar, Sidebar, Login;
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  React = (await import("react")).default;
  render = (await import("react-dom/server")).renderToStaticMarkup;
  MemoryRouter = (await import("react-router-dom")).MemoryRouter;
  AuthProvider = (await server.ssrLoadModule("/src/context/AuthContext.jsx")).AuthProvider;
  InboxProvider = (await server.ssrLoadModule("/src/context/InboxContext.jsx")).InboxProvider;
  Topbar = (await server.ssrLoadModule("/src/components/Topbar.jsx")).default;
  Sidebar = (await server.ssrLoadModule("/src/components/Sidebar.jsx")).default;
  Login = (await server.ssrLoadModule("/src/pages/auth/Login.jsx")).default;
});
after(async () => { await server?.close(); });
function view(role, element) {
  globalThis.localStorage = { getItem: key => key === "user" ? JSON.stringify({ role, displayName: "Test User" }) : null };
  return render(React.createElement(AuthProvider, null, React.createElement(InboxProvider, null,
    React.createElement(MemoryRouter, { initialEntries: [`/${role}/opportunities/42`] }, element))));
}
for (const role of ["applicant", "provider", "admin"]) {
  test(`${role} header links target the inbox from a nested page`, () => {
    const html = view(role, React.createElement(Topbar, { title: "Test" }));
    assert.ok(html.includes(`href="/${role}/notifications"`));
    assert.ok(html.includes(`href="/${role}/messages"`));
    assert.ok(!html.includes("42/messages"));
  });
}
test("provider sidebar ignores a stale hardcoded unread badge", () => {
  const icon = () => null;
  const html = view("provider", React.createElement(Sidebar, { role: "provider", sections: [{ items: [{ to: "/provider/notifications", label: "Notifications", icon, count: 3 }] }] }));
  assert.ok(!html.includes("badge-count"));
});
test("login uses account credentials without a role selector", () => {
  const html = view("applicant", React.createElement(Login));
  assert.ok(html.includes('name="email"'));
  assert.ok(html.includes('name="password"'));
  assert.ok(!html.includes("role-option"));
  assert.ok(!html.includes("Log in as"));
});
