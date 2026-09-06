import { apiFetch as fetch } from "../../api";
import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ContentManagement() {
  const { topbarUser } = useAuth();
  const [tab, setTab] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/reference/skills`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/sectors`).then((r) => r.json()),
    ]).then(([sk, sec]) => {
      if (sk.success) setSkills(sk.data);
      if (sec.success) setSectors(sec.data);
    }).catch(() => setError("Unable to load reference data. Please reload this page.")).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Content Management" subtitle="Browse the skills and sectors available across the portal."
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        {error && <div className="feedback-error" role="alert">{error}</div>}
        <div className="tabs">
          {[["skills", "Skills Taxonomy"], ["sectors", "Sectors"]].map(([k, l]) => (
            <div key={k} className={"tab" + (tab === k ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(k)}>{l}</div>
          ))}
        </div>

        {tab === "skills" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Skill tags</span>

            </div>
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="chip-row">
                {skills.map((s) => (
                  <span className="chip" key={s.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>{s.name}</span>
                ))}
                {skills.length === 0 && <p className="text-sm text-stone">No skills loaded yet.</p>}
              </div>
            )}
          </div>
        )}

        {tab === "sectors" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Sectors</span>

            </div>
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Sector</th><th></th></tr></thead>
                  <tbody>
                    {sectors.map((s) => (
                      <tr key={s.id}><td className="cell-primary">{s.name}</td></tr>
                    ))}
                    {sectors.length === 0 && <tr><td colSpan={2} className="text-sm text-stone">No sectors loaded.</td></tr>}
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
