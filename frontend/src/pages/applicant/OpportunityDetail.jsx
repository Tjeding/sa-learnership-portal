import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { MapPin, Clock, Wallet, Building2, CheckCircle2, Bookmark, ArrowLeft } from "lucide-react";
import { opportunities, currentApplicant } from "../../data/mockData";

export default function OpportunityDetail() {
  const { id } = useParams();
  const opp = opportunities.find((o) => String(o.id) === id) || opportunities[0];
  const [applied, setApplied] = useState(false);

  return (
    <>
      <Topbar
        eyebrow="Applicant"
        title="Opportunity Details"
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <Link to="/applicant/opportunities" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          <ArrowLeft size={15} /> Back to opportunities
        </Link>

        <div className="grid grid-2-1">
          <div>
            <div className="card">
              <span className="badge badge-sun">{opp.type}</span>
              <h2 style={{ fontSize: 26, marginTop: 12 }}>{opp.title}</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, color: "var(--stone)" }}>
                <Building2 size={16} /> <span className="text-sm">{opp.provider} · {opp.sector}</span>
              </div>
              <div className="opp-meta" style={{ marginTop: 16 }}>
                <span><MapPin size={13} /> {opp.location}, {opp.province}</span>
                <span><Clock size={13} /> {opp.duration} months</span>
                <span><Wallet size={13} /> R{opp.stipend.toLocaleString()}/{opp.stipendPeriod}</span>
              </div>
              <hr className="divider" />
              <h4 style={{ fontSize: 15, marginBottom: 8 }}>About this opportunity</h4>
              <p className="text-sm" style={{ lineHeight: 1.7, color: "var(--ink-soft)" }}>{opp.description}</p>

              <h4 style={{ fontSize: 15, margin: "20px 0 8px" }}>Requirements</h4>
              <ul className="list-plain">
                {opp.requirements.map((r) => (
                  <li key={r} style={{ display: "flex", gap: 10 }}>
                    <CheckCircle2 size={16} color="var(--veld)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className="text-sm">{r}</span>
                  </li>
                ))}
              </ul>

              <h4 style={{ fontSize: 15, margin: "20px 0 8px" }}>Skills this role is looking for</h4>
              <div className="chip-row">
                {opp.requiredSkills.map((s) => <span className="chip" key={s}>{s}</span>)}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div className="stat-value" style={{ fontSize: 22 }}>{opp.positions}</div>
                <div className="stat-label">positions available</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--stone)", marginBottom: 4 }}>Closing date</div>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>{opp.closingDate}</div>
              <div style={{ fontSize: 13, color: "var(--stone)", marginBottom: 4 }}>Minimum NQF level</div>
              <div style={{ fontWeight: 700, marginBottom: 20 }}>NQF Level {opp.nqf}</div>

              {applied ? (
                <div className="badge badge-veld" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
                  <CheckCircle2 size={14} /> Application submitted
                </div>
              ) : (
                <button className="btn btn-primary btn-block" onClick={() => setApplied(true)}>Apply Now</button>
              )}
              <button className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                <Bookmark size={15} /> Save for later
              </button>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header"><span className="card-title">Your match</span></div>
              <div style={{ fontSize: 30, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--veld-deep)" }}>92%</div>
              <p className="text-sm text-stone" style={{ marginTop: 6 }}>
                Based on your qualifications and {currentApplicant.skillTags.length} tagged skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
