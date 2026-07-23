import { Bell, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Topbar({ eyebrow, title, subtitle, user, notifCount = 0, msgCount = 0, notifTo = "notifications", msgTo = "messages", actions }) {
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
