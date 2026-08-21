import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [providerOrg, setProviderOrg] = useState(null);

  /* Refresh user from /auth/me when we have a token but no stored user,
     or on initial mount to keep displayName in sync. */
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const body = await res.json();
      if (body.success && body.data) {
        setUser(body.data);
        localStorage.setItem("user", JSON.stringify(body.data));
      }
    } catch {
      /* non-critical — localStorage copy is fine */
    }
  }, []);

  /* Logout: clear local tokens, revoke refresh token on the backend,
     and reset React state so the Topbar/Sidebar reflect the logged-out
     state immediately. */
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    // Clear local state immediately (before the async API call)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setProviderOrg(null);

    // Best-effort backend call to revoke the refresh token
    if (refreshToken && accessToken) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        /* non-critical — token will expire on its own */
      }
    }
  }, []);

  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      refreshUser();
    }
  }, [user, refreshUser]);

  /* Multi-tab sync: the "storage" event fires in OTHER tabs when
     localStorage changes in THIS tab. If the token was removed (logout
     in another tab), clear our local state too. If a new token appeared
     (login in another tab), reload the user from storage. */
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "accessToken") {
        if (!e.newValue) {
          // Another tab logged out — clear our state too
          setUser(null);
          setProviderOrg(null);
        } else {
          // Another tab logged in (or refreshed the token) — sync from storage
          const stored = readStoredUser();
          setUser(stored);
        }
      }
      if (e.key === "user" && e.newValue) {
        // User data was updated in another tab
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          /* ignore parse errors */
        }
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* For provider users, fetch the organisation profile to get the real
     company name for the Topbar role subtitle. */
  useEffect(() => {
    if (user?.role !== "provider") return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${API_URL}/api/v1/provider/organisation`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((body) => {
        if (body.success && body.data) setProviderOrg(body.data);
      })
      .catch(() => {});
  }, [user?.role]);

  /* Convenience: build Topbar user prop from the stored user record.
     For providers, the role subtitle shows the real organisation name. */
  const topbarUser = user
    ? {
        name: user.displayName || user.email || "User",
        role:
          user.role === "provider" && providerOrg?.organizationName
            ? providerOrg.organizationName
            : user.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "User",
        initials: (user.displayName || user.email || "?")
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "?",
        color:
          user.role === "admin"
            ? "var(--role-admin)"
            : user.role === "provider"
              ? "var(--sun-deep)"
              : "var(--veld)",
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, topbarUser, providerOrg, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
