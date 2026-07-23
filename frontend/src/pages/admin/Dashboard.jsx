import Topbar from "../../components/Topbar";
import { StatCard, HBar, MiniBarChart } from "../../components/Widgets";
import { Users, Building2, Briefcase, FileText, UserCheck, Download, CheckCircle2, BarChart3, Settings2, FileEdit } from "lucide-react";
import { placementBySector, applicationVolumeMonths, auditLog } from "../../data/mockData";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <Topbar
        eyebrow="Admin" title="Welcome, Admin User 🛡️" subtitle="System overview and management."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={Users} label="Total Users" value="12,458" foot="+320 this month" footUp />
          <StatCard icon={Building2} label="Providers" value="1,024" foot="+45 this month" footUp tint="sun" />
          <StatCard icon={Briefcase} label="Active Opportunities" value="623" foot="+28 this month" footUp tint="teal" />
          <StatCard icon={FileText} label="Total Applications" value="8,947" foot="+560 this month" footUp tint="sun" />
        </div>
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={UserCheck} label="Placements Made" value="1,256" foot="+98 this month" footUp tint="veld" />
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header"><span className="card-title">Application Volume (Last 6 Months)</span></div>
            <MiniBarChart data={applicationVolumeMonths} />
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Placement Success Rates by Sector</span></div>
            {placementBySector.map((s) => <HBar key={s.sector} label={s.sector} pct={s.rate} />)}
          </div>
        </div>

        <div className="grid grid-2-1" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent System Notifications</span>
              <Link to="/admin/audit" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {auditLog.slice(0, 4).map((a) => (
                <div key={a.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 6, background: "var(--role-admin)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{a.action.replaceAll("_", " ").toLowerCase()}: {a.entity}</div>
                    <div className="text-sm text-stone">{a.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Quick Actions</span></div>
            <div className="list-plain">
              <Link to="/admin/opportunities" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><CheckCircle2 size={15} /> Approve Opportunities</Link>
              <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><Users size={15} /> Manage Users</Link>
              <Link to="/admin/reports" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><BarChart3 size={15} /> Generate Reports</Link>
              <Link to="/admin/settings" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><Settings2 size={15} /> System Settings</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card">
            <div className="stat-label">System Health</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <CheckCircle2 size={16} color="var(--veld)" /> <span style={{ fontWeight: 600, fontSize: 13.5 }}>All systems operational</span>
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Database Status</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <CheckCircle2 size={16} color="var(--veld)" /> <span style={{ fontWeight: 600, fontSize: 13.5 }}>Connected</span>
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Storage Usage</div>
            <div style={{ marginTop: 10 }}>
              <div style={{ background: "var(--line-soft)", borderRadius: "var(--r-pill)", height: 8 }}>
                <div style={{ width: "62%", height: "100%", background: "var(--sun)", borderRadius: "var(--r-pill)" }} />
              </div>
              <div className="text-sm text-stone" style={{ marginTop: 6 }}>62% used</div>
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Active Sessions</div>
            <div className="stat-value" style={{ fontSize: 22, marginTop: 6 }}>245</div>
            <div className="text-sm text-stone">Users online</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card-header"><span className="card-title">Export Reports</span></div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline btn-sm"><Download size={14} /> CSV</button>
            <button className="btn btn-outline btn-sm"><FileEdit size={14} /> PDF</button>
          </div>
        </div>
      </div>
    </>
  );
}
