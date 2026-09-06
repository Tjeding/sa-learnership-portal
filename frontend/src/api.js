const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
let refreshing;
export async function apiFetch(url, options = {}) {
  const response = await globalThis.fetch(url, options);
  if (response.status !== 401 || !options.headers?.Authorization || (String(url).includes("/auth/") && !String(url).endsWith("/auth/me"))) return response;
  const previousToken = localStorage.getItem("accessToken");
  if (previousToken && options.headers.Authorization !== `Bearer ${previousToken}`) {
    return globalThis.fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${previousToken}` } });
  }
  if (!refreshing) {
    refreshing = (async () => {
      const token = localStorage.getItem("refreshToken");
      if (!token) return null;
      const res = await globalThis.fetch(`${API_URL}/api/v1/auth/refresh-token`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken: token }) });
      const body = await res.json();
      if (!res.ok || !body.success) return null;
      if (previousToken !== localStorage.getItem("accessToken")) return null;
      localStorage.setItem("accessToken", body.data.accessToken);
      localStorage.setItem("refreshToken", body.data.refreshToken);
      return body.data.accessToken;
    })().finally(() => { refreshing = null; });
  }
  const token = await refreshing;
  if (token) return globalThis.fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
  if (previousToken === localStorage.getItem("accessToken")) {
    for (const key of ["accessToken", "refreshToken", "user"]) localStorage.removeItem(key);
    window.dispatchEvent(new Event("session-expired"));
  }
  return response;
}
