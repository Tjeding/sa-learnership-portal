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

  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      refreshUser();
    }
  }, [user, refreshUser]);

  /* Convenience: build Topbar user prop from the stored user record */
  const topbarUser = user
    ? {
        name: user.displayName || user.email || "User",
        role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User",
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
    <AuthContext.Provider value={{ user, topbarUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
