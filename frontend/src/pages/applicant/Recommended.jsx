import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { Sparkles, TrendingUp } from "lucide-react";
import { currentApplicant } from "../../data/mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Recommended() {
  const navigate = useNavigate();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/applicant/recommendations`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (cancelled || !body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load recommendations.");
        setRecs(body.data);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="Recommended for You" subtitle="Matched to your NQF level and tagged skills."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>{error}</div>}
        <div className="card" style={{ marginBottom: 20, background: "var(--sun-tint)", border: "none", display: "flex", gap: 14, alignItems: "center" }}>
          <Sparkles size={22} color="var(--sun-deep)" />
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            These matches compare your tagged skills and NQF level against each open opportunity's
            stated requirements — a baseline scoring signal that a smarter matching model can build on later.
          </p>
        </div>

        <div className="grid grid-3">
          {loading && <p className="text-sm text-stone">Loading…</p>}
          {!loading && recs.map((r) => (
            <div key={r.opportunityId} className="opp-card">
              <div className="opp-card-top">
                <span className="badge badge-veld">{r.matchPercentage}% match</span>
                {r.meetsNqfRequirement && <span className="badge badge-teal"><TrendingUp size={12} /> NQF met</span>}
              </div>
              <h4>{r.opportunityTitle}</h4>
              <p className="text-sm text-stone">{r.matchingSkills} of {r.requiredSkillsTotal} required skills matched</p>
              <Link to={`/applicant/opportunities/${r.opportunityId}`} className="btn btn-primary btn-sm">View &amp; Apply</Link>
            </div>
          ))}
          {!loading && recs.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}><h3>No recommendations yet</h3><p>Tag some skills on your profile to get matched to opportunities.</p></div>
          )}
        </div>
      </div>
    </>
  );
}