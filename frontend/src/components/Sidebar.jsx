import { NavLink, useNavigate } from "react-router-dom";
import { Sprout, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const roleMeta = {
  applicant: { color: "var(--role-applicant)", label: "Applicant Portal" },
  provider: { color: "var(--role-provider)", label: "Provider Portal" },
  admin: { color: "var(--role-admin)", label: "Admin Console" },
};

export default function Sidebar({ role, sections }) {
  const meta = roleMeta[role];
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout(e) {
    e.preventDefault();
    await logout();
    navigate("/");
  }

  return (
    <aside className="sidebar" style={{ "--role-color": meta.color }}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <Sprout size={20} strokeWidth={2.4} />
        </div>
        <div className="sidebar-brand-text">
          <div className="name">SA Learnerships</div>
          <div className="sub">{meta.label}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section, index) => (
          <div key={section.label || `section-${index}`}>
            {section.label && <div className="sidebar-section-label">{section.label}</div>}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
              >
                <item.icon size={17} strokeWidth={2} />
                <span>{item.label}</span>
                {item.count ? <span className="badge-count">{item.count}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", font: "inherit", color: "inherit" }}>
          <LogOut size={17} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
