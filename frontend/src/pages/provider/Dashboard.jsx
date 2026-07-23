import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatCard, StatusBadge, Donut } from "../../components/Widgets";
import { Briefcase, ClipboardList, Star, UserCheck, Download, Plus } from "lucide-react";
import { providerApplicants, opportunities } from "../../data/mockData";

export default function ProviderDashboard() {
  const statusCounts = ["submitted", "under_review", "shortlisted", "rejected"].map((s) => providerApplicants.filter((a) => a.status === s).length);
  const total = statusCounts.reduce((a, b) => a + b, 0) || 1;
  const donutSegs = [
    { label: "Received", value: statusCounts[0] || 0.001, color: "var(--teal)" },
    { label: "In Review", value: statusCounts[1] || 0.001, color: "var(--sun)" },
    { label: "Shortlisted", value: statusCounts[2] || 0.001, color: "var(--veld)" },
    { label: "Rejected", value: statusCounts[3] || 0.001, color: "var(--rust)" },
  ];
  const topOpportunities = opportunities.filter((o) => o.status === "approved").sort((a, b) => b.applications - a.applications).slice(0, 3);

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Welcome, Thabo Ndlovu 👋" subtitle="Here's what's happening with your opportunities."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
        actions={<Link to="/provider/opportunities/new" className="btn btn-gold btn-sm"><Plus size={14} /> Post New Opportunity</Link>}
      />
      <div className="page">
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={Briefcase} label="Active Opportunities" value="7" foot="View all" tint="sun" />
          <StatCard icon={ClipboardList} label="Total Applications" value="156" foot="This month" tint="teal" />
          <StatCard icon={Star} label="Shortlisted" value="18" foot="This month" tint="veld" />
          <StatCard icon={UserCheck} label="Hired / Placed" value="6" foot="This month" footUp tint="veld" />
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Applications</span>
              <Link to="/provider/applications" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {providerApplicants.slice(0, 5).map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="avatar" style={{ background: "var(--sun-deep)", width: 34, height: 34, fontSize: 12 }}>
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="cell-primary">{a.name}</div>
                      <div className="cell-sub">{a.opportunity} · {a.appliedAt}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Applications by Status</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Donut segments={donutSegs} size={110} stroke={18} />
              <div style={{ flex: 1 }}>
                {["Received", "In Review", "Shortlisted", "Rejected"].map((label, i) => (
                  <div className="legend-row" key={label}>
                    <span className="legend-swatch" style={{ background: donutSegs[i].color }} />
                    {label} <span className="legend-val">{Math.round((statusCounts[i] / total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-2-1" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Opportunities</span>
              <Link to="/provider/opportunities" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {topOpportunities.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="stat-icon" style={{ background: "var(--sun-tint)", color: "var(--sun-deep)" }}><Briefcase size={16} /></div>
                    <div className="cell-primary" style={{ fontSize: 13.5 }}>{o.title}</div>
                  </div>
                  <span className="text-sm text-stone">{o.applications} applications</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "var(--veld-tint)", border: "none" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Need help?</div>
            <p className="text-sm" style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Visit our provider support center for posting tips and SETA guidance.</p>
            <button className="btn btn-primary btn-sm"><Download size={14} /> Download Applications (CSV)</button>
          </div>
        </div>
      </div>
    </>
  );
}
