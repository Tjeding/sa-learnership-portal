import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard, Users, Briefcase, ClipboardList, BarChart3,
  GraduationCap, FileEdit, Settings, History,
} from "lucide-react";

const sections = [
  {
    items: [
      { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/users", label: "User Management", icon: Users },
      { to: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
      { to: "/admin/applications", label: "Applications", icon: ClipboardList },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Reference data",
    items: [
      { to: "/admin/nqf", label: "NQF Management", icon: GraduationCap },
      { to: "/admin/content", label: "Content Management", icon: FileEdit },
    ],
  },
  {
    items: [
      { to: "/admin/settings", label: "System Settings", icon: Settings },
      { to: "/admin/audit", label: "Audit Logs", icon: History },
    ],
  },
];

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="admin" sections={sections} />
      <div className="main-col">
        <Outlet />
      </div>
    </div>
  );
}
