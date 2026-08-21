import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { Plus, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function NQFManagement() {
  const [tab, setTab] = useState("levels");
  const [nqfLevels, setNqfLevels] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/reference/nqf-levels`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/qualifications`).then((r) => r.json()),
    ]).then(([levels, quals]) => {
      if (levels.success) setNqfLevels(levels.data);
      if (quals.success) setQualifications(quals.data);
    }).finally(() => setLoading(false));
  }, []);

  const suggestions = [
    { id: 1, title: "Renewable Energy Technician Learnership", nqf: 4, submittedBy: "PowerGrid Training Centre", url: "https://allqs.saqa.org.za/search.php" },
    { id: 2, title: "Occupational Certificate: Marine Diesel Mechanic", nqf: 4, submittedBy: "Ocean Skills Academy", url: "https://allqs.saqa.org.za/search.php" },
  ];

  return (
    <>
      <Topbar
        eyebrow="Admin" title="NQF Management" subtitle="Reference data sourced from SAQA — never hardcoded in the app."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20, background: "#eeeaf6", border: "none", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Source: SAQA — National Qualifications Framework level descriptors and the NLRD registered qualifications search.
          </p>
          <a href="https://allqs.saqa.org.za/search.php" className="btn btn-outline btn-sm"><ExternalLink size={13} /> Open SAQA NLRD</a>
        </div>

        <div className="tabs">
          {[["levels", "NQF Levels"], ["types", "Qualification Types"], ["suggestions", "Admin Suggestions"]].map(([k, l]) => (
            <div key={k} className={"tab" + (tab === k ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(k)}>{l}</div>
          ))}
        </div>

        {tab === "levels" && (
          <div className="card">
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Level</th><th>Sub-framework</th><th>Typical example</th></tr></thead>
                  <tbody>
                    {nqfLevels.map((n) => (
                      <tr key={n.id}><td className="cell-primary">{n.levelName}</td><td>{n.subFramework}</td><td>{n.typicalExample}</td></tr>
                    ))}
                    {nqfLevels.length === 0 && <tr><td colSpan={3} className="text-sm text-stone">No NQF levels loaded.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "types" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Registered qualification types</span>
              <button className="btn btn-outline btn-sm"><Plus size={14} /> Add type</button>
            </div>
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Title</th><th>NQF Level</th><th>Category</th><th></th></tr></thead>
                  <tbody>
                    {qualifications.map((q) => (
                      <tr key={q.id}>
                        <td className="cell-primary">{q.title}</td>
                        <td>{q.nqfLevelName || `Level ${q.nqfLevelId}`}</td>
                        <td>{q.qualificationCategory}</td>
                        <td><span className="badge badge-veld">Active</span></td>
                      </tr>
                    ))}
                    {qualifications.length === 0 && <tr><td colSpan={4} className="text-sm text-stone">No qualification types loaded.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "suggestions" && (
          <div className="card">
            <div className="card-header"><span className="card-title">Pending qualification suggestions</span></div>
            <div className="list-plain">
              {suggestions.map((s) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div>
                    <div className="cell-primary">{s.title}</div>
                    <div className="cell-sub">Suggested by {s.submittedBy} · NQF Level {s.nqf}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="icon-btn" style={{ width: 30, height: 30 }}><CheckCircle2 size={13} color="var(--veld)" /></button>
                    <button className="icon-btn" style={{ width: 30, height: 30 }}><XCircle size={13} color="var(--rust)" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
