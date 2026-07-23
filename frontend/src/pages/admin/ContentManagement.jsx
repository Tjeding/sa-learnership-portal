import { useState } from "react";
import Topbar from "../../components/Topbar";
import { Plus, X } from "lucide-react";
import { skills, sectors } from "../../data/mockData";

export default function ContentManagement() {
  const [tab, setTab] = useState("skills");

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
            <div className="chip-row">
              {skills.map((s) => (
                <span className="chip" key={s} style={{ display: "flex", gap: 6, alignItems: "center" }}>{s} <X size={12} style={{ cursor: "pointer" }} /></span>
              ))}
            </div>
          </div>
        )}

        {tab === "sectors" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Sectors</span>
              <button className="btn btn-outline btn-sm"><Plus size={14} /> Add sector</button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Sector</th><th>Open opportunities</th><th></th></tr></thead>
                <tbody>
                  {sectors.map((s, i) => (
                    <tr key={s}><td className="cell-primary">{s}</td><td className="mono">{(i * 7 + 12) % 60}</td><td><button className="icon-btn" style={{ width: 30, height: 30 }}><X size={13} /></button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
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
