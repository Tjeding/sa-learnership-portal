import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { Plus, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ContentManagement() {
  const [tab, setTab] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/reference/skills`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/sectors`).then((r) => r.json()),
    ]).then(([sk, sec]) => {
      if (sk.success) setSkills(sk.data);
      if (sec.success) setSectors(sec.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Content Management" subtitle="Manage the skills taxonomy, sectors, and static site content."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="tabs">
          {[["skills", "Skills Taxonomy"], ["sectors", "Sectors"], ["pages", "Site Content"]].map(([k, l]) => (
            <div key={k} className={"tab" + (tab === k ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(k)}>{l}</div>
          ))}
        </div>

        {tab === "skills" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Skill tags</span>
              <button className="btn btn-outline btn-sm"><Plus size={14} /> Add skill</button>
            </div>
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="chip-row">
                {skills.map((s) => (
                  <span className="chip" key={s.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>{s.name} <X size={12} style={{ cursor: "pointer" }} /></span>
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
              <button className="btn btn-outline btn-sm"><Plus size={14} /> Add sector</button>
            </div>
            {loading ? <p className="text-sm text-stone">Loading…</p> : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Sector</th><th></th></tr></thead>
                  <tbody>
                    {sectors.map((s) => (
                      <tr key={s.id}><td className="cell-primary">{s.name}</td><td><button className="icon-btn" style={{ width: 30, height: 30 }}><X size={13} /></button></td></tr>
                    ))}
                    {sectors.length === 0 && <tr><td colSpan={2} className="text-sm text-stone">No sectors loaded.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "pages" && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header"><span className="card-title">Landing page copy</span></div>
            <div className="field"><label>Hero headline</label><input className="input" defaultValue="Find the next step on your career pathway." /></div>
            <div className="field"><label>Hero subtext</label><textarea className="input" defaultValue="One place to discover learnerships, internships and apprenticeships across South Africa." /></div>
            <button className="btn btn-primary">Save changes</button>
          </div>
        )}
      </div>
    </>
  );
}
