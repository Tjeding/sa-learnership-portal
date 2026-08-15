import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { Plus, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function PostOpportunity() {
  const navigate = useNavigate();
  const [reqs, setReqs] = useState(["Matric with Mathematics"]);
  const [tags, setTags] = useState([]);

  const [sectors, setSectors] = useState([]);
  const [nqfLevels, setNqfLevels] = useState([]);
  const [skills, setSkills] = useState([]);

  const [type, setType] = useState("learnership");
  const [sectorId, setSectorId] = useState("");
  const [minNqfLevelId, setMinNqfLevelId] = useState("");
  const [province, setProvince] = useState("Gauteng");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/reference/sectors`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/nqf-levels`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/skills`).then((r) => r.json()),
    ]).then(([s, n, sk]) => {
      if (s.success) setSectors(s.data);
      if (n.success) setNqfLevels(n.data);
      if (sk.success) setSkills(sk.data);
    });
  }, []);

  async function submitOpportunity(e, saveAsDraft) {
    e.preventDefault();
    setError("");
    const form = e.target;

    const payload = {
      title: form.title.value,
      description: form.description.value,
      opportunityType: type,
      sectorId: sectorId ? Number(sectorId) : null,
      minNqfLevelId: minNqfLevelId ? Number(minNqfLevelId) : null,
      stipendAmount: form.stipendAmount.value ? Number(form.stipendAmount.value) : null,
      stipendPeriod: "monthly",
      location: form.location.value,
      province,
      durationMonths: form.durationMonths.value ? Number(form.durationMonths.value) : null,
      positionsAvailable: Number(form.positionsAvailable.value),
      closingDate: form.closingDate.value,
      requirements: reqs.filter((r) => r.trim()),
      skillIds: tags.map((t) => t.id),
      saveAsDraft,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/provider/opportunities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to save opportunity.");
      navigate("/provider/opportunities");
    } catch (err) {
      setError(err.message || "Failed to save opportunity.");
    } finally {
      setSubmitting(false);
    }
  }

  function addSkill(skillId) {
    const skill = skills.find((s) => String(s.id) === skillId);
    if (skill && !tags.some((t) => t.id === skill.id)) setTags([...tags, skill]);
  }

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Post New Opportunity" subtitle="This listing will be sent to an admin for approval before it goes live."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <form onSubmit={(e) => submitOpportunity(e, false)} className="grid grid-2-1">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Basic details</span></div>
              <div className="field"><label>Opportunity title</label>
                <input className="input" name="title" placeholder="e.g. Software Development Learnership" required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Type</label>
                  <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="learnership">Learnership</option>
                    <option value="internship">Internship</option>
                    <option value="apprenticeship">Apprenticeship</option>
                  </select>
                </div>
                <div className="field">
                  <label>Sector</label>
                  <select className="input" value={sectorId} onChange={(e) => setSectorId(e.target.value)}>
                    <option value="">Select…</option>
                    {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label>Description</label>
                <textarea className="input" name="description" rows={5} placeholder="Describe the programme, structure and what learners will gain…" required />
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Requirements</span></div>
              {reqs.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input className="input" value={r} onChange={(e) => setReqs(reqs.map((x, idx) => (idx === i ? e.target.value : x)))} />
                  <button type="button" className="icon-btn" onClick={() => setReqs(reqs.filter((_, idx) => idx !== i))}><X size={14} /></button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setReqs([...reqs, ""])}><Plus size={14} /> Add requirement</button>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Required skills</span></div>
              <div className="chip-row" style={{ marginBottom: 12 }}>
                {tags.map((t) => (
                  <span className="chip" key={t.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {t.name} <X size={12} style={{ cursor: "pointer" }} onClick={() => setTags(tags.filter((x) => x.id !== t.id))} />
                  </span>
                ))}
              </div>
              <select className="input" onChange={(e) => e.target.value && addSkill(e.target.value)} value="">
                <option value="">+ Add a skill…</option>
                {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Logistics</span></div>
              <div className="field"><label>Location</label><input className="input" name="location" placeholder="e.g. Johannesburg" required /></div>
              <div className="field"><label>Province</label>
                <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
                  <option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option><option>Eastern Cape</option>
                  <option>Free State</option><option>Limpopo</option><option>Mpumalanga</option><option>North West</option><option>Northern Cape</option>
                </select>
              </div>
              <div className="field-row">
                <div className="field"><label>Duration (months)</label><input className="input" name="durationMonths" type="number" min={1} defaultValue={12} /></div>
                <div className="field"><label>Positions available</label><input className="input" name="positionsAvailable" type="number" min={1} defaultValue={5} required /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Stipend (R / month)</label><input className="input" name="stipendAmount" type="number" min={0} defaultValue={5000} /></div>
                <div className="field"><label>Closing date</label><input className="input" name="closingDate" type="date" required /></div>
              </div>
              <div className="field"><label>Minimum NQF level</label>
                <select className="input" value={minNqfLevelId} onChange={(e) => setMinNqfLevelId(e.target.value)}>
                  <option value="">Select…</option>
                  {nqfLevels.map((n) => <option key={n.id} value={n.id}>{n.levelName}</option>)}
                </select>
              </div>
            </div>

            <div className="card">
              <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit for approval"}
              </button>
              <button className="btn btn-outline btn-block" style={{ marginTop: 10 }} type="button" disabled={submitting}
                onClick={(e) => {
                  const form = e.target.closest("form");
                  submitOpportunity({ preventDefault: () => {}, target: form }, true);
                  }
                }>
                Save as draft
              </button>
              <p className="text-sm text-stone" style={{ marginTop: 12 }}>An admin reviews new listings before they appear to applicants.</p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}