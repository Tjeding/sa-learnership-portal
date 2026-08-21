import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function OpportunitiesAdmin() {
  const { topbarUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("pending_approval");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load(status) {
    setLoading(true);
    const url = new URL(`${API_URL}/api/v1/admin/opportunities`);
    if (status !== "all") url.searchParams.set("status", status);
    fetch(url, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load opportunities.");
        setRows(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(filter); }, [filter]);

  async function approve(id) {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/opportunities/${id}/approve`, { method: "POST", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to approve.");
      load(filter);
    } catch (err) {
      setError(err.message);
    }
  }

  async function reject(id) {
    const reason = prompt("Reason for rejecting this listing:");
    if (!reason) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/opportunities/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ reason }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to reject.");
      load(filter);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Opportunities" subtitle="Approve, reject or remove provider listings."
        notifCount={2} msgCount={0}
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="tabs">
          {[["pending_approval", "Pending Approval"], ["approved", "Approved"], ["closed", "Closed"], ["all", "All"]].map(([k, l]) => (
            <div key={k} className={"tab" + (filter === k ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setFilter(k)}>{l}</div>
          ))}
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Provider</th><th>Sector</th><th>Closing date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6}><p className="text-sm text-stone">Loading…</p></td></tr>}
                {!loading && rows.map((o) => (
                  <tr key={o.id}>
                    <td className="cell-primary">{o.title}</td>
                    <td>{o.providerName}</td>
                    <td>{o.sectorName}</td>
                    <td>{o.closingDate}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View"><Eye size={13} /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Approve" onClick={() => approve(o.id)}><CheckCircle2 size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Reject" onClick={() => reject(o.id)}><XCircle size={13} color="var(--rust)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={6}><div className="empty-state"><h3>Nothing here</h3><p>No opportunities match this filter.</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}