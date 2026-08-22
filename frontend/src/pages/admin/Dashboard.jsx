import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatCard, HBar, MiniBarChart } from "../../components/Widgets";
import { Users, Building2, Briefcase, FileText, UserCheck, CheckCircle2, BarChart3, Settings2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminDashboard() {
  const { topbarUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/dashboard`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load dashboard.");
        setData(body.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="page"><div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>{error}</div></div>;
  if (!data) return <div className="page"><p className="text-sm text-stone">Loading…</p></div>;

  const volumeChartData = data.applicationVolume.map((v) => ({ month: v.month, value: v.value }));

  return (
    <>
      <Topbar
        eyebrow="Admin" title={`Welcome${topbarUser ? `, ${topbarUser.name.split(" ")[0]}` : ""} 🛡️`} subtitle="System overview and management."
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={Users} label="Total Users" value={data.totalUsers.toLocaleString()} />
          <StatCard icon={Building2} label="Providers" value={data.totalProviders.toLocaleString()} tint="sun" />
          <StatCard icon={Briefcase} label="Active Opportunities" value={data.activeOpportunities.toLocaleString()} tint="teal" />
          <StatCard icon={FileText} label="Total Applications" value={data.totalApplications.toLocaleString()} tint="sun" />
        </div>
        <div className="grid grid-4" style={{ marginBottom: "var(--sp-5)" }}>
          <StatCard icon={UserCheck} label="Placements Made" value={data.placementsMade.toLocaleString()} tint="veld" />
        </div>

        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header"><span className="card-title">Application Volume (Last 6 Months)</span></div>
            {volumeChartData.length > 0 ? <MiniBarChart data={volumeChartData} /> : <p className="text-sm text-stone">No application activity yet.</p>}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Placement Success Rates by Sector</span></div>
            {data.placementBySector.length > 0
              ? data.placementBySector.map((s) => <HBar key={s.sector} label={s.sector} pct={s.placementRatePct} />)
              : <p className="text-sm text-stone">No placement data yet.</p>}
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card-header"><span className="card-title">Quick Actions</span></div>
          <div className="list-plain">
            <Link to="/admin/opportunities" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><CheckCircle2 size={15} /> Approve Opportunities</Link>
            <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><Users size={15} /> Manage Users</Link>
            <Link to="/admin/reports" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><BarChart3 size={15} /> Generate Reports</Link>
            <Link to="/admin/settings" className="btn btn-outline" style={{ justifyContent: "flex-start" }}><Settings2 size={15} /> System Settings</Link>
          </div>
        </div>
      </div>
    </>
  );
}