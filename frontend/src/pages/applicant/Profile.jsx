import Topbar from "../../components/Topbar";
import { ProgressRing } from "../../components/Widgets";
import { UploadCloud, FileCheck2, ShieldCheck, Clock3, Plus, X } from "lucide-react";
import { currentApplicant, nqfLevels } from "../../data/mockData";

export default function Profile() {
  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Profile" subtitle="Keep this up to date to improve your match scores."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <div className="grid grid-2-1">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Personal Details</span></div>
              <div className="field-row">
                <div className="field"><label>First name</label><input className="input" defaultValue="Lindiwe" /></div>
                <div className="field"><label>Last name</label><input className="input" defaultValue="Mokoena" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>ID number</label><input className="input" defaultValue="0203145678083" maxLength={13} /></div>
                <div className="field"><label>Phone</label><input className="input" defaultValue="071 234 5678" /></div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Province</label>
                  <select className="input" defaultValue="Gauteng"><option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option><option>Eastern Cape</option></select>
                </div>
                <div className="field"><label>Town / City</label><input className="input" defaultValue="Soweto" /></div>
              </div>
              <div className="field"><label>Bio</label><textarea className="input" defaultValue="Motivated recent Matric graduate looking to build a career in IT support and data." /></div>
              <button className="btn btn-primary">Save changes</button>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Qualifications</span>
                <button className="btn btn-outline btn-sm"><Plus size={14} /> Add qualification</button>
              </div>
              <div className="list-plain">
                {currentApplicant.qualifications.map((q) => (
                  <div key={q.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                    <div>
                      <div className="cell-primary">{q.title}</div>
                      <div className="cell-sub">{q.institution} · {q.year} · NQF Level {q.nqf}</div>
                    </div>
                    {q.verified ? (
                      <span className="badge badge-veld"><ShieldCheck size={12} /> Verified</span>
                    ) : (
                      <span className="badge badge-sun"><Clock3 size={12} /> Pending review</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone" style={{ marginTop: 12 }}>
                Qualification types are sourced from SAQA's registered qualifications database.
              </p>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Skills</span>
                <button className="btn btn-outline btn-sm"><Plus size={14} /> Add skill</button>
              </div>
              <div className="chip-row">
                {currentApplicant.skillTags.map((s) => (
                  <span className="chip" key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {s.name} · <span className="text-stone">{s.level}</span> <X size={12} style={{ cursor: "pointer" }} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ProgressRing value={currentApplicant.profileStrength} size={110} stroke={10} />
              </div>
              <div style={{ fontWeight: 700, marginTop: 12 }}>Profile Strength: Excellent</div>
              <p className="text-sm text-stone" style={{ marginTop: 6 }}>Add a second reference and verify your NCV certificate to reach 100%.</p>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">CV</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px dashed var(--line)", borderRadius: "var(--r-md)" }}>
                <FileCheck2 size={22} color="var(--veld)" />
                <div>
                  <div className="cell-primary" style={{ fontSize: 13.5 }}>{currentApplicant.cv.fileName}</div>
                  <div className="cell-sub">Uploaded {currentApplicant.cv.uploadedAt}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}>
                <UploadCloud size={15} /> Upload new CV
              </button>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">NQF Reference</span></div>
              <p className="text-sm text-stone" style={{ marginBottom: 10 }}>Your highest verified qualification maps to:</p>
              <div className="badge badge-teal" style={{ fontSize: 13, padding: "6px 12px" }}>
                {nqfLevels[3].name} — {nqfLevels[3].example}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
