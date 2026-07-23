import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard, Briefcase, ClipboardList, Star, MessageSquare,
  Bell, BarChart3, Building2, Settings,
} from "lucide-react";

const sections = [
  {
    items: [
      { to: "/provider", end: true, label: "Dashboard", icon: LayoutDashboard },
      { to: "/provider/opportunities", label: "My Opportunities", icon: Briefcase },
      { to: "/provider/applications", label: "Applications", icon: ClipboardList },
      { to: "/provider/shortlisted", label: "Shortlisted Candidates", icon: Star },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/provider/messages", label: "Messages", icon: MessageSquare },
      { to: "/provider/notifications", label: "Notifications", icon: Bell, count: 3 },
    ],
  },
  {
    label: "Organisation",
    items: [
      { to: "/provider/reports", label: "Reports & Analytics", icon: BarChart3 },
      { to: "/provider/profile", label: "Organisation Profile", icon: Building2 },
    ],
  },
  {
    items: [{ to: "/provider/settings", label: "Settings", icon: Settings }],
  },
];

export default function ProviderLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="provider" sections={sections} />
      <div className="main-col">
        <Outlet />
      </div>
    </div>
  );
}
