import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard, Search, FileText, UserCircle, MessageSquare,
  Bell, Folder, Bookmark, Sparkles, Settings,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const baseSections = [
  {
    items: [
      { to: "/applicant", end: true, label: "Dashboard", icon: LayoutDashboard },
      { to: "/applicant/opportunities", label: "Find Opportunities", icon: Search },
      { to: "/applicant/applications", label: "My Applications", icon: FileText },
      { to: "/applicant/profile", label: "Profile", icon: UserCircle },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/applicant/messages", label: "Messages", icon: MessageSquare },
      { to: "/applicant/notifications", label: "Notifications", icon: Bell, count: 0 },
    ],
  },
  {
    label: "Library",
    items: [
      { to: "/applicant/documents", label: "My Documents", icon: Folder },
      { to: "/applicant/saved", label: "Saved Opportunities", icon: Bookmark },
      { to: "/applicant/recommended", label: "Recommended", icon: Sparkles },
    ],
  },
  {
    items: [{ to: "/applicant/settings", label: "Settings", icon: Settings }],
  },
];

export default function ApplicantLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(`${API_URL}/api/v1/notifications/unread-count`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => { if (body.success) setUnreadCount(body.data?.unreadCount ?? 0); })
      .catch(() => {});
  }, []);

  /* Inject the live unread count into the notifications sidebar item */
  const sections = baseSections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.to === "/applicant/notifications" ? { ...item, count: unreadCount } : item
    ),
  }));

  return (
    <div className="app-shell">
      <Sidebar role="applicant" sections={sections} />
      <div className="main-col">
        <Outlet />
      </div>
    </div>
  );
}
