import { apiFetch as fetch } from "../api";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
const InboxContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export function InboxProvider({ children }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ notifications: 0, messages: 0 });
  const refresh = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!user || !token) return;
    await Promise.allSettled(["notifications", "messages"].map(async (kind) => {
      const response = await fetch(`${API_URL}/api/v1/${kind}/unread-count`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();
      if (response.ok && body.success && token === localStorage.getItem("accessToken")) {
        setCounts(previous => ({ ...previous, [kind]: kind === "notifications" ? body.data.unreadCount : body.data }));
      }
    }));
  }, [user]);
  useEffect(() => {
    setCounts({ notifications: 0, messages: 0 });
    refresh();
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [refresh]);
  return <InboxContext.Provider value={{ ...counts, refresh }}>{children}</InboxContext.Provider>;
}
export function useInbox() { return useContext(InboxContext); }
