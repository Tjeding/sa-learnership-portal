import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatCard, StatusBadge, Donut } from "../../components/Widgets";
import { Briefcase, ClipboardList, Star, UserCheck, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
const STATUS_COLORS = { submitted: "var(--teal)", under_review: "var(--sun)", shortlisted: "var(--veld)", rejected: "var(--rust)" };
const STATUS_LABELS = { submitted: "Received", under_review: "In Review", shortlisted: "Shortlisted", rejected: "Rejected" };

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/provider/dashboard`, { headers: authHeaders() })
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

  if (error) return <div className="page"><div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>{error}</div></div>;
  if (!data) return <div className="page"><p className="text-sm text-stone">Loading…</p></div>;

  const statusKeys = Object.keys(data.applicationsByStatus);
  const total = Object.values(data.applicationsByStatus).reduce((a, b) => a + b, 0) || 1;
  const donutSegs = statusKeys.map((k) => ({ label: STATUS_LABELS[k], value: data.applicationsByStatus[k] || 0.001, color: STATUS_COLORS[k] }));

  return (
    <>
      <Topbar
        eyebrow="Provider" title={`Welcome${topbarUser ? `, ${topbarUser.name.split(" ")[0]}` : ""} \u{1F44B}`} subtitle="Here's what's happening with your opportunities."
        notifCount={3} msgCount={4}
        user={topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" }}
        actions={<Link to="/provider/opportunities/new" className="btn btn-gold btn-sm"><Plus size={14} /> Post New Opportunity</Link>}
      />
      <div className="page">
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={Briefcase} label="Active Opportunities" value={data.activeOpportunities} tint="sun" />
          <StatCard icon={ClipboardList} label="Total Applications" value={data.totalApplications} tint="teal" />
          <StatCard icon={Star} label="Shortlisted" value={data.shortlistedCount} tint="veld" />
          <StatCard icon={UserCheck} label="Hired / Placed" value={data.hiredCount} footUp tint="veld" />
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Applications</span>
              <Link to="/provider/applications" className="card-link">View All</Link>
            </div>
            <div className="list-plain">
              {data.recentApplications.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="avatar" style={{ background: "var(--sun-deep)", width: 34, height: 34, fontSize: 12 }}>
                      {a.applicantName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="cell-primary">{a.applicantName}</div>
                      <div className="cell-sub">{a.opportunityTitle} · {new Date(a.appliedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
              {data.recentApplications.length === 0 && <p className="text-sm text-stone" style={{ padding: "10px 0" }}>No applications yet.</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Applications by Status</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Donut segments={donutSegs} size={110} stroke={18} />
              <div style={{ flex: 1 }}>
                {statusKeys.map((k) => (
                  <div className="legend-row" key={k}>
                    <span className="legend-swatch" style={{ background: STATUS_COLORS[k] }} />
                    {STATUS_LABELS[k]} <span className="legend-val">{Math.round((data.applicationsByStatus[k] / total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card-header">
            <span className="card-title">Top Opportunities</span>
            <Link to="/provider/opportunities" className="card-link">View All</Link>
          </div>
          <div className="list-plain">
            {data.topOpportunities.map((o) => (
              <div key={o.opportunityId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="stat-icon" style={{ background: "var(--sun-tint)", color: "var(--sun-deep)" }}><Briefcase size={16} /></div>
                  <div className="cell-primary" style={{ fontSize: 13.5 }}>{o.title}</div>
                </div>
                <span className="text-sm text-stone">{o.applicationCount} applications</span>
              </div>
            ))}
            {data.topOpportunities.length === 0 && <p className="text-sm text-stone" style={{ padding: "10px 0" }}>No applications yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}