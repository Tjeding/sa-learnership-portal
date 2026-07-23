import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { sectors, nqfLevels, skills } from "../../data/mockData";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function PostOpportunity() {
  const navigate = useNavigate();
  const [reqs, setReqs] = useState(["Matric with Mathematics"]);
  const [tags, setTags] = useState(["Communication"]);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/provider/opportunities");
  }

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Post New Opportunity" subtitle="This listing will be sent to an admin for approval before it goes live."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        <form onSubmit={handleSubmit} className="grid grid-2-1">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Basic details</span></div>
              <div className="field"><label>Opportunity title</label><input className="input" placeholder="e.g. Software Development Learnership" required /></div>
              <div className="field-row">
                <div className="field">
                  <label>Type</label>
                  <select className="input"><option>Learnership</option><option>Internship</option><option>Apprenticeship</option></select>
                </div>
                <div className="field">
                  <label>Sector</label>
                  <select className="input">{sectors.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </div>
              <div className="field"><label>Description</label><textarea className="input" rows={5} placeholder="Describe the programme, structure and what learners will gain…" required /></div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Requirements</span></div>
              {reqs.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input className="input" defaultValue={r} />
                  <button type="button" className="icon-btn" onClick={() => setReqs(reqs.filter((_, idx) => idx !== i))}><X size={14} /></button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setReqs([...reqs, ""])}><Plus size={14} /> Add requirement</button>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Required skills</span></div>
              <div className="chip-row" style={{ marginBottom: 12 }}>
                {tags.map((t) => (
                  <span className="chip" key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {t} <X size={12} style={{ cursor: "pointer" }} onClick={() => setTags(tags.filter((x) => x !== t))} />
                  </span>
                ))}
              </div>
              <select className="input" onChange={(e) => e.target.value && setTags([...new Set([...tags, e.target.value])])}>
                <option value="">+ Add a skill…</option>
                {skills.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Logistics</span></div>
              <div className="field"><label>Location</label><input className="input" placeholder="e.g. Johannesburg" required /></div>
              <div className="field"><label>Province</label><select className="input"><option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option><option>Eastern Cape</option></select></div>
              <div className="field-row">
                <div className="field"><label>Duration (months)</label><input className="input" type="number" min={1} defaultValue={12} /></div>
                <div className="field"><label>Positions available</label><input className="input" type="number" min={1} defaultValue={5} /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Stipend (R / month)</label><input className="input" type="number" min={0} defaultValue={5000} /></div>
                <div className="field"><label>Closing date</label><input className="input" type="date" required /></div>
              </div>
              <div className="field"><label>Minimum NQF level</label><select className="input">{nqfLevels.map((n) => <option key={n.id}>{n.name}</option>)}</select></div>
            </div>

            <div className="card">
              <button className="btn btn-primary btn-block" type="submit">Submit for approval</button>
              <button className="btn btn-outline btn-block" style={{ marginTop: 10 }} type="button">Save as draft</button>
              <p className="text-sm text-stone" style={{ marginTop: 12 }}>An admin reviews new listings before they appear to applicants.</p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
