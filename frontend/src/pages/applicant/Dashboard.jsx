import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatCard, StatusBadge, Donut } from "../../components/Widgets";
import { FileText, Star, Award, ChevronRight, Sparkles, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/applicant/dashboard`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (cancelled || !body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load dashboard.");
        setData(body.data);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => { cancelled = true; };
  }, [navigate]);

  if (error) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="Dashboard" notifCount={0} msgCount={0}
          user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page"><div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>{error}</div></div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="Dashboard" subtitle="Loading…" notifCount={0} msgCount={0}
          user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page"><p className="text-sm text-stone">Loading…</p></div>
      </>
    );
  }

  const donutSegs = [
    { label: "Total", value: data.totalApplications || 0.001, color: "var(--teal)" },
    { label: "Shortlisted", value: data.shortlistedCount || 0.001, color: "var(--veld)" },
    { label: "Offers", value: data.offersCount || 0.001, color: "var(--sun)" },
  ];

  return (
    <>
      <Topbar
        eyebrow="Applicant"
        title={`Welcome${topbarUser ? `, ${topbarUser.name.split(" ")[0]}` : ""} 👋`}
        subtitle="Let's find the right opportunity for your future."
        notifCount={3} msgCount={2}
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }}
      />
      <div className="page">
        <div className="grid grid-3" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={FileText} label="Applications" value={data.totalApplications} tint="teal" />
          <StatCard icon={Star} label="Shortlisted" value={data.shortlistedCount} tint="sun" />
          <StatCard icon={Award} label="Offers" value={data.offersCount} footUp tint="veld" />
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header">
              <span className="card-title">My Applications</span>
              <Link to="/applicant/applications" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {data.recentApplications.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)" }}><FileText size={16} /></div>
                    <div>
                      <div className="cell-primary">{a.opportunityTitle}</div>
                      <div className="cell-sub">{a.providerName} · Updated {timeAgo(a.updatedAt)}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
              {data.recentApplications.length === 0 && <p className="text-sm text-stone" style={{ padding: "10px 0" }}>No applications yet.</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Recommended for You</span>
              <Sparkles size={16} color="var(--sun-deep)" />
            </div>
            <div className="list-plain">
              {data.recommendations.slice(0, 5).map((r) => (
                <Link to="/applicant/recommended" key={r.opportunityId} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="cell-primary" style={{ fontSize: 13.5 }}>{r.opportunityTitle}</div>
                  <div className="cell-sub">Match: {r.matchPercentage}% {r.meetsNqfRequirement ? "· NQF requirement met" : ""}</div>
                </Link>
              ))}
              {data.recommendations.length === 0 && <p className="text-sm text-stone" style={{ padding: "10px 0" }}>No recommendations yet — tag some skills on your profile.</p>}
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
                {[["Total", data.totalApplications, "var(--teal)"], ["Shortlisted", data.shortlistedCount, "var(--veld)"], ["Offers", data.offersCount, "var(--sun)"]].map(([label, val, color]) => (
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
              {data.closingSoon.map((o) => (
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
              {data.closingSoon.length === 0 && <p className="text-sm text-stone" style={{ padding: "10px 0" }}>Nothing closing soon.</p>}
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