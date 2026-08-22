import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { MapPin, Clock, Wallet, Building2, CheckCircle2, Bookmark, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const { topbarUser } = useAuth();

  async function handleApply() {
    setApplying(true);
    setApplyError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/v1/applicant/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ opportunityId: opp.id }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to apply.");
      setApplied(true);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  }
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/opportunities/${id}`)
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (!body.success) throw new Error(body?.error?.message || "Opportunity not found.");
        setOpp(body.data);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="Opportunity Details"
          user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page">
          <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>{error}</div>
        </div>
      </>
    );
  }

  if (!opp) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="Opportunity Details" subtitle="Loading…"
          user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page"><p className="text-sm text-stone">Loading…</p></div>
      </>
    );
  }

  return (
    <>
      <Topbar eyebrow="Applicant" title="Opportunity Details"
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
      <div className="page">
        <Link to="/applicant/opportunities" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          <ArrowLeft size={15} /> Back to opportunities
        </Link>

        <div className="grid grid-2-1">
          <div>
            <div className="card">
              <span className="badge badge-sun">{opp.opportunityType}</span>
              <h2 style={{ fontSize: 26, marginTop: 12 }}>{opp.title}</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, color: "var(--stone)" }}>
                <Building2 size={16} /> <span className="text-sm">{opp.providerName} · {opp.sectorName}</span>
              </div>
              <div className="opp-meta" style={{ marginTop: 16 }}>
                <span><MapPin size={13} /> {opp.location}, {opp.province}</span>
                <span><Clock size={13} /> {opp.durationMonths} months</span>
                <span><Wallet size={13} /> {opp.stipendAmount ? `R${Number(opp.stipendAmount).toLocaleString()}/${opp.stipendPeriod}` : "Unpaid"}</span>
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
                {opp.skills.map((s) => <span className="chip" key={s.id}>{s.name}</span>)}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div className="stat-value" style={{ fontSize: 22 }}>{opp.positionsAvailable}</div>
                <div className="stat-label">positions available</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--stone)", marginBottom: 4 }}>Closing date</div>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>{opp.closingDate}</div>
              <div style={{ fontSize: 13, color: "var(--stone)", marginBottom: 4 }}>Minimum NQF level</div>
              <div style={{ fontWeight: 700, marginBottom: 20 }}>{opp.minNqfLevelName || "Not specified"}</div>

              {applyError && (
                <div style={{ background: "#fdecea", color: "#a32424", padding: "8px 12px", borderRadius: 8, fontSize: 12.5, marginBottom: 10 }}>
                  {applyError}
                </div>
              )}
              {applied ? (
                <div className="badge badge-veld" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
                  <CheckCircle2 size={14} /> Application submitted
                </div>
              ) : (
                <button className="btn btn-primary btn-block" onClick={handleApply} disabled={applying}>
                  {applying ? "Submitting…" : "Apply Now"}
                </button>
              )}
              <button className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                <Bookmark size={15} /> Save for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}