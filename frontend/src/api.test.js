import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { apiFetch } from "./api.js";
const response = (status, data) => ({ status, ok: status < 400, json: async () => data });
beforeEach(() => {
  const values = new Map([["accessToken", "old"], ["refreshToken", "refresh"], ["user", "{}"]]);
  globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  globalThis.window = new EventTarget();
});
test("retries an expired authenticated request after rotating tokens", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("refresh-token")) return response(200, { success: true, data: { accessToken: "new", refreshToken: "rotated" } });
    return response(options.headers.Authorization === "Bearer new" ? 200 : 401, {});
  };
  assert.equal((await apiFetch("http://localhost:8080/api/v1/notifications", { headers: { Authorization: "Bearer old" } })).status, 200);
  assert.equal(calls.length, 3);
  assert.equal(localStorage.getItem("refreshToken"), "rotated");
});
test("invalid refresh clears the session and notifies the app", async () => {
  let expired = false;
  window.addEventListener("session-expired", () => { expired = true; });
  globalThis.fetch = async () => response(401, { success: false });
  await apiFetch("http://localhost:8080/api/v1/notifications", { headers: { Authorization: "Bearer old" } });
  assert.equal(localStorage.getItem("accessToken"), null);
  assert.equal(expired, true);
});
test("public login failures do not attempt token refresh", async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return response(401, {}); };
  await apiFetch("http://localhost:8080/api/v1/auth/login", { method: "POST" });
  assert.equal(calls, 1);
  assert.equal(localStorage.getItem("accessToken"), "old");
});
test("concurrent failures share one refresh request", async () => {
  let rotations = 0;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("refresh-token")) { rotations++; await new Promise(resolve => setTimeout(resolve, 10)); return response(200, { success: true, data: { accessToken: "new", refreshToken: "rotated" } }); }
    return response(options.headers.Authorization === "Bearer new" ? 200 : 401, {});
  };
  const results = await Promise.all([1, 2, 3].map(() => apiFetch("http://localhost:8080/api/v1/messages", { headers: { Authorization: "Bearer old" } })));
  assert.ok(results.every(result => result.status === 200));
  assert.equal(rotations, 1);
});
