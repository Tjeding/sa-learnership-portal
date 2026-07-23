import { useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Search, Star, X, Eye } from "lucide-react";
import { providerApplicants } from "../../data/mockData";

export default function Applications() {
  const [rows, setRows] = useState(providerApplicants);
  const [q, setQ] = useState("");

  function setStatus(id, status) {
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.opportunity.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Applications" subtitle="Review, shortlist and reject applicants across all your listings."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 360 }}>
            <Search size={15} color="var(--stone)" />
            <input placeholder="Search applicants or opportunities…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Opportunity</th><th>NQF</th><th>Match</th><th>Applied</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div className="avatar" style={{ background: "var(--sun-deep)", width: 30, height: 30, fontSize: 11 }}>
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="cell-primary">{a.name}</span>
                    </td>
                    <td>{a.opportunity}</td>
                    <td>Level {a.nqf}</td>
                    <td><span className="mono" style={{ fontWeight: 600, color: a.match >= 80 ? "var(--veld-deep)" : "var(--stone)" }}>{a.match}%</span></td>
                    <td>{a.appliedAt}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View profile"><Eye size={13} /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Shortlist" onClick={() => setStatus(a.id, "shortlisted")}><Star size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Reject" onClick={() => setStatus(a.id, "rejected")}><X size={13} color="var(--rust)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
