import Topbar from "./Topbar";
import { CheckCheck, FileText, Sparkles, Clock3, Info } from "lucide-react";
import { notifications } from "../data/mockData";

const iconMap = {
  application_status: { icon: FileText, tint: "veld" },
  new_match: { icon: Sparkles, tint: "sun" },
  closing_reminder: { icon: Clock3, tint: "rust" },
  system: { icon: Info, tint: "teal" },
};

export default function NotificationsView({ topbarProps }) {
  return (
    <>
      <Topbar {...topbarProps} title="Notifications" subtitle="Application updates, new matches, and reminders." />
      <div className="page">
        <div className="card">
          <div className="card-header">
            <span className="card-title">All notifications</span>
            <button className="btn btn-ghost btn-sm"><CheckCheck size={15} /> Mark all as read</button>
          </div>
          <div className="list-plain">
            {notifications.map((n) => {
              const meta = iconMap[n.type];
              const Icon = meta.icon;
              return (
                <div key={n.id} style={{
                  display: "flex", gap: 14, padding: "14px 4px",
                  borderBottom: "1px solid var(--line-soft)",
                  background: n.read ? "transparent" : "var(--paper)",
                  borderRadius: "var(--r-md)",
                }}>
                  <div className="stat-icon" style={{ background: `var(--${meta.tint}-tint)`, color: `var(--${meta.tint}${meta.tint === "veld" ? "-deep" : meta.tint === "sun" ? "-deep" : ""})`, flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5 }}>{n.title}</span>
                      <span className="text-sm text-stone" style={{ whiteSpace: "nowrap" }}>{new Date(n.at).toLocaleString("en-ZA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="text-sm text-stone" style={{ marginTop: 4 }}>{n.message}</p>
                  </div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: 8, background: "var(--veld)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
