import { apiFetch as fetch } from "../../api";
import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function NQFManagement() {
  const { topbarUser } = useAuth();
  const [tab, setTab] = useState("levels");
  const [nqfLevels, setNqfLevels] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/reference/nqf-levels`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/qualifications`).then((r) => r.json()),
    ]).then(([levels, quals]) => {
      if (levels.success) setNqfLevels(levels.data);
      if (quals.success) setQualifications(quals.data);
    }).catch(() => setError("Unable to load reference data. Please reload this page.")).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar
        eyebrow="Admin" title="NQF Management" subtitle="Reference data sourced from SAQA — never hardcoded in the app."
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        {error && <div className="feedback-error" role="alert">{error}</div>}
        <div className="card" style={{ marginBottom: 20, background: "#eeeaf6", border: "none", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Source: SAQA — National Qualifications Framework level descriptors and the NLRD registered qualifications search.
          </p>
          <a href="https://allqs.saqa.org.za/search.php" className="btn btn-outline btn-sm"><ExternalLink size={13} /> Open SAQA NLRD</a>
        </div>

        <div className="tabs">
          {[["levels", "NQF Levels"], ["types", "Qualification Types"]].map(([k, l]) => (
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

      </div>
    </>
  );
}
