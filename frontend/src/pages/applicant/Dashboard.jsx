import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatCard, StatusBadge, ProgressRing, Donut } from "../../components/Widgets";
import { FileText, Star, Award, Clock, ChevronRight, Sparkles } from "lucide-react";
import { myApplications, recommended, currentApplicant, opportunities } from "../../data/mockData";

export default function ApplicantDashboard() {
  const counts = {
    total: myApplications.length,
    shortlisted: myApplications.filter((a) => a.status === "shortlisted").length,
    offered: myApplications.filter((a) => a.status === "offered" || a.status === "accepted").length,
  };
  const statusCounts = ["submitted", "under_review", "shortlisted", "rejected"].map((s) => ({
    label: s, value: myApplications.filter((a) => a.status === s).length,
  }));
  const donutSegs = [
    { label: "Received", value: statusCounts[0].value || 1, color: "var(--teal)" },
    { label: "In Review", value: statusCounts[1].value || 0.001, color: "var(--sun)" },
    { label: "Shortlisted", value: statusCounts[2].value || 0.001, color: "var(--veld)" },
    { label: "Rejected", value: statusCounts[3].value || 0.001, color: "var(--rust)" },
  ];
  const closingSoon = opportunities.filter((o) => o.status === "approved").slice(0, 2);

  return (
    <>
      <Topbar
        eyebrow="Applicant"
        title={`Welcome, ${currentApplicant.name.split(" ")[0]} 👋`}
        subtitle="Let's find the right opportunity for your future."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={FileText} label="Applications" value={counts.total} foot="3 in progress" tint="teal" />
          <StatCard icon={Star} label="Shortlisted" value={counts.shortlisted} foot="View details" tint="sun" />
          <StatCard icon={Award} label="Offers" value={counts.offered || 1} foot="Congratulations!" footUp tint="veld" />
          <div className="stat-card" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ProgressRing value={currentApplicant.profileStrength} size={64} stroke={7} />
            <div>
              <div className="stat-label">Profile Strength</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>Excellent</div>
            </div>
          </div>
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header">
              <span className="card-title">My Applications</span>
              <Link to="/applicant/applications" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {myApplications.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)" }}><FileText size={16} /></div>
                    <div>
                      <div className="cell-primary">{a.title}</div>
                      <div className="cell-sub">{a.org} · Updated {timeAgo(a.updatedAt)}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Recommended for You</span>
              <Sparkles size={16} color="var(--sun-deep)" />
            </div>
            <div className="list-plain">
              {recommended.map((r) => (
                <Link to="/applicant/recommended" key={r.id} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="cell-primary" style={{ fontSize: 13.5 }}>{r.title}</div>
                  <div className="cell-sub">{r.org} · Match: {r.match}% · NQF Level {r.nqf}</div>
                </Link>
              ))}
            </div>
            <Link to="/applicant/recommended" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 12 }}>
              View All Recommendations <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Application Status Overview</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <Donut segments={donutSegs} size={130} stroke={20} />
              <div style={{ flex: 1 }}>
                {[
                  ["Received", donutSegs[0].value, "var(--teal)"],
                  ["In Review", statusCounts[1].value, "var(--sun)"],
                  ["Shortlisted", statusCounts[2].value, "var(--veld)"],
                  ["Rejected", statusCounts[3].value, "var(--rust)"],
                ].map(([label, val, color]) => (
                  <div className="legend-row" key={label}>
                    <span className="legend-swatch" style={{ background: color }} />
                    {label} <span className="legend-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Upcoming Closing Dates</span>
              <Link to="/applicant/opportunities" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {closingSoon.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="stat-icon" style={{ background: "var(--rust-tint)", color: "var(--rust)" }}><Clock size={16} /></div>
                    <div>
                      <div className="cell-primary" style={{ fontSize: 13.5 }}>{o.title}</div>
                      <div className="cell-sub">Closes {o.closingDate}</div>
                    </div>
                  </div>
                  <span className="badge badge-rust">{daysLeft(o.closingDate)} days left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function timeAgo(dateStr) {
  const days = Math.round((Date.now() - new Date(dateStr)) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
function daysLeft(dateStr) {
  return Math.max(0, Math.round((new Date(dateStr) - Date.now()) / 86400000));
}
