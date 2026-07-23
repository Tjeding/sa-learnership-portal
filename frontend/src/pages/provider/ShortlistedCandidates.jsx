import Topbar from "../../components/Topbar";
import { Mail, Phone, FileText } from "lucide-react";
import { providerApplicants } from "../../data/mockData";

export default function ShortlistedCandidates() {
  const shortlisted = providerApplicants.filter((a) => a.status === "shortlisted" || a.status === "offered");

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Shortlisted Candidates" subtitle="Applicants you've moved forward for interviews or offers."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        <div className="grid grid-3">
          {shortlisted.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div className="avatar" style={{ background: "var(--sun-deep)", width: 44, height: 44 }}>{a.name.split(" ").map((n) => n[0]).join("")}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.name}</div>
                  <div className="text-sm text-stone">NQF Level {a.nqf} · {a.match}% match</div>
                </div>
              </div>
              <div className="text-sm text-stone" style={{ marginBottom: 12 }}>Applied for {a.opportunity}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}><Mail size={13} /> Message</button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}><FileText size={13} /> View CV</button>
              </div>
              <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 8 }}>Send Offer</button>
            </div>
          ))}
          {shortlisted.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}><h3>No shortlisted candidates yet</h3><p>Shortlist applicants from the Applications page.</p></div>
          )}
        </div>
      </div>
    </>
  );
}
