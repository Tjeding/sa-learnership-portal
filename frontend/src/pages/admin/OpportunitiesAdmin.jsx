import { useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { opportunities as seed } from "../../data/mockData";

export default function OpportunitiesAdmin() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState("pending_approval");

  function setStatus(id, status) {
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Opportunities" subtitle="Approve, reject or remove provider listings."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
      />
      <div className="page">
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
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="cell-primary">{o.title}</td>
                    <td>{o.provider}</td>
                    <td>{o.sector}</td>
                    <td>{o.closingDate}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View"><Eye size={13} /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Approve" onClick={() => setStatus(o.id, "approved")}><CheckCircle2 size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Reject" onClick={() => setStatus(o.id, "rejected")}><XCircle size={13} color="var(--rust)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
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
