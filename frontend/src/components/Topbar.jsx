import { useState, useEffect } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Topbar({ eyebrow, title, subtitle, user, notifTo = "notifications", msgTo = "messages", actions }) {
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  /* Fetch real unread notification count from the database */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${API_URL}/api/v1/notifications/unread-count`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((body) => { if (body.success) setNotifCount(body.data?.unreadCount ?? 0); })
      .catch(() => {});
  }, []);

  /* Fetch real unread message count from the database */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${API_URL}/api/v1/messages/unread-count`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((body) => { if (body.success) setMsgCount(body.data ?? 0); })
      .catch(() => {});
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-greeting">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="text-stone text-sm" style={{ marginTop: 4 }}>{subtitle}</p>}
      </div>
      <div className="topbar-actions">
        {actions}
        <Link to={msgTo} className="icon-btn" aria-label="Messages">
          <MessageSquare size={17} strokeWidth={2} />
          {msgCount > 0 && <span className="dot">{msgCount}</span>}
        </Link>
        <Link to={notifTo} className="icon-btn" aria-label="Notifications">
          <Bell size={17} strokeWidth={2} />
          {notifCount > 0 && <span className="dot">{notifCount}</span>}
        </Link>
        <div className="user-chip">
          <div className="avatar" style={{ background: user.color }}>{user.initials}</div>
          <div>
            <div className="who">{user.name}</div>
            <div className="role">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
