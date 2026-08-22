import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function MyOpportunities() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/provider/opportunities`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (cancelled || !body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load opportunities.");
        setOpportunities(body.data);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [navigate]);

  async function handleDelete(id) {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/provider/opportunities/${id}`, { method: "DELETE", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to delete.");
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Topbar
        eyebrow="Provider" title="My Opportunities" subtitle="Manage every listing you've posted."
        user={topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" }}
        actions={<Link to="/provider/opportunities/new" className="btn btn-gold btn-sm"><Plus size={14} /> Post New Opportunity</Link>}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Positions</th><th>Closing date</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={6}><p className="text-sm text-stone">Loading…</p></td></tr>}
                {!loading && opportunities.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="cell-primary">{o.title}</div>
                      <div className="cell-sub">{o.sectorName}</div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{o.opportunityType}</td>
                    <td>{o.positionsAvailable}</td>
                    <td>{o.closingDate}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <Link to={`/provider/opportunities/${o.id}`} className="icon-btn" style={{ width: 32, height: 32 }} title="View"><Eye size={14} /></Link>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} title="Edit"><Pencil size={14} /></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} title="Delete" onClick={() => handleDelete(o.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
                {!loading && opportunities.length === 0 && (
                  <tr><td colSpan={6}><div className="empty-state"><h3>No listings yet</h3><p>Post your first opportunity to get started.</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}