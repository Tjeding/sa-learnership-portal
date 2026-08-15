import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Search, Star, X, Eye } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Applications() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`${API_URL}/api/v1/provider/applications`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (!body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load applications.");
        setRows(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [navigate]);

  async function act(id, action) {
    try {
      const res = await fetch(`${API_URL}/api/v1/provider/applications/${id}/${action}`, { method: "POST", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || `Failed to ${action}.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = rows.filter((r) => r.applicantName.toLowerCase().includes(q.toLowerCase()) || r.opportunityTitle.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Applications" subtitle="Review, shortlist and reject applicants across all your listings."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 360 }}>
            <Search size={15} color="var(--stone)" />
            <input placeholder="Search applicants or opportunities…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Opportunity</th><th>Applied</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={5}><p className="text-sm text-stone">Loading…</p></td></tr>}
                {!loading && filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div className="avatar" style={{ background: "var(--sun-deep)", width: 30, height: 30, fontSize: 11 }}>
                        {a.applicantName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="cell-primary">{a.applicantName}</span>
                    </td>
                    <td>{a.opportunityTitle}</td>
                    <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View CV"
                          disabled={!a.applicantCvUrl}
                          onClick={() => window.open(`${API_URL}${a.applicantCvUrl}`, "_blank")}>
                          <Eye size={13} />
                        </button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Shortlist" onClick={() => act(a.id, "shortlist")}><Star size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Reject" onClick={() => act(a.id, "reject")}><X size={13} color="var(--rust)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5}><div className="empty-state"><h3>No applications yet</h3><p>Applications to your listings will show up here.</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}