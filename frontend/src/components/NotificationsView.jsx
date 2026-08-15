import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { CheckCheck, FileText, Sparkles, Clock3, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const iconMap = {
  application_status: { icon: FileText, tint: "veld" },
  new_match: { icon: Sparkles, tint: "sun" },
  closing_reminder: { icon: Clock3, tint: "rust" },
  system: { icon: Info, tint: "teal" },
};

export default function NotificationsView({ topbarProps }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`${API_URL}/api/v1/notifications`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (!body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load notifications.");
        setNotifications(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [navigate]);

  async function markRead(id) {
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/${id}/read`, { method: "PATCH", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to mark as read.");
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/mark-all-read`, { method: "PATCH", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to mark all as read.");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError(err.message);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Topbar {...topbarProps} title="Notifications" subtitle="Application updates, new matches, and reminders." notifCount={unreadCount} />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="card">
          <div className="card-header">
            <span className="card-title">All notifications</span>
            <button className="btn btn-ghost btn-sm" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck size={15} /> Mark all as read
            </button>
          </div>
          <div className="list-plain">
            {loading && <p className="text-sm text-stone" style={{ padding: "14px 4px" }}>Loading…</p>}
            {!loading && notifications.map((n) => {
              const meta = iconMap[n.type];
              const Icon = meta.icon;
              return (
                <div key={n.id} onClick={() => !n.read && markRead(n.id)} style={{
                  display: "flex", gap: 14, padding: "14px 4px",
                  borderBottom: "1px solid var(--line-soft)",
                  background: n.read ? "transparent" : "var(--paper)",
                  borderRadius: "var(--r-md)",
                  cursor: n.read ? "default" : "pointer",
                }}>
                  <div className="stat-icon" style={{ background: `var(--${meta.tint}-tint)`, color: `var(--${meta.tint}${meta.tint === "veld" ? "-deep" : meta.tint === "sun" ? "-deep" : ""})`, flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5 }}>{n.title}</span>
                      <span className="text-sm text-stone" style={{ whiteSpace: "nowrap" }}>
                        {new Date(n.createdAt).toLocaleString("en-ZA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-stone" style={{ marginTop: 4 }}>{n.message}</p>
                  </div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: 8, background: "var(--veld)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              );
            })}
            {!loading && notifications.length === 0 && (
              <div className="empty-state"><h3>No notifications yet</h3><p>You're all caught up.</p></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}