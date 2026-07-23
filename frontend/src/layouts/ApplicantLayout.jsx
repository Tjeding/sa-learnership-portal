import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard, Search, FileText, UserCircle, MessageSquare,
  Bell, Folder, Bookmark, Sparkles, Settings,
} from "lucide-react";
import { notifications } from "../data/mockData";

const sections = [
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
      { to: "/applicant/notifications", label: "Notifications", icon: Bell, count: notifications.filter(n => !n.read).length },
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
  return (
    <div className="app-shell">
      <Sidebar role="applicant" sections={sections} />
      <div className="main-col">
        <Outlet />
      </div>
    </div>
  );
}
