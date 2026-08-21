import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Download, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ApplicationsAdmin() {
  const { topbarUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/applications`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load applications.");
        setRows(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter((a) =>
    a.applicantName.toLowerCase().includes(q.toLowerCase()) ||
    a.opportunityTitle.toLowerCase().includes(q.toLowerCase()) ||
    a.providerName.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Applications" subtitle="System-wide view of every application in the pipeline."
        notifCount={2} msgCount={0}
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
        actions={<button className="btn btn-outline btn-sm" title="CSV export isn't built yet"><Download size={14} /> Export CSV</button>}
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
            <input placeholder="Search applicants, providers or opportunities…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Opportunity</th><th>Provider</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={5}><p className="text-sm text-stone">Loading…</p></td></tr>}
                {!loading && filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="cell-primary">{a.applicantName}</td>
                    <td>{a.opportunityTitle}</td>
                    <td>{a.providerName}</td>
                    <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5}><div className="empty-state"><h3>No applications yet</h3></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}