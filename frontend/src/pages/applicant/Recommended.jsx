import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { Sparkles, TrendingUp, Cpu, Zap } from "lucide-react";
import { currentApplicant } from "../../data/mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const strategyMeta = {
  "skill-based": { icon: Zap, label: "Skill + NQF Matching", color: "var(--teal)" },
  "embedding":   { icon: Cpu, label: "Sentence Embeddings", color: "var(--sun-deep)" },
  "openai":      { icon: Sparkles, label: "OpenAI", color: "var(--veld)" },
  "ollama":      { icon: Cpu, label: "Ollama (local)", color: "var(--rust)" },
};

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

  const activeStrategy = recs.length > 0 ? (recs[0].matchStrategy || "skill-based") : "skill-based";
  const meta = strategyMeta[activeStrategy] || strategyMeta["skill-based"];
  const StrategyIcon = meta.icon;

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="Recommended for You" subtitle="AI-matched opportunities based on your profile."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>{error}</div>}

        {/* Strategy info banner */}
        <div className="card" style={{ marginBottom: 20, background: "var(--sun-tint)", border: "none", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ background: meta.color, borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <StrategyIcon size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{meta.label}</div>
            <p className="text-sm" style={{ color: "var(--ink-soft)", margin: 0 }}>
              {activeStrategy === "skill-based"
                ? "Compares your tagged skills and NQF level against each opportunity's requirements. A baseline signal that smarter models build on."
                : `Using ${meta.label} to semantically match your profile against opportunity descriptions.`}
            </p>
          </div>
          <span className="badge badge-teal" style={{ flexShrink: 0, fontSize: 11 }}>
            <Cpu size={11} /> {activeStrategy}
          </span>
        </div>

        <div className="grid grid-3">
          {loading && <p className="text-sm text-stone">Loading recommendations…</p>}
          {!loading && recs.map((r) => (
            <div key={r.opportunityId} className="opp-card">
              <div className="opp-card-top">
                <span className="badge badge-veld">{r.matchPercentage}% match</span>
                {r.meetsNqfRequirement && <span className="badge badge-teal"><TrendingUp size={12} /> NQF met</span>}
              </div>
              <h4>{r.opportunityTitle}</h4>
              <p className="text-sm text-stone">
                {r.matchingSkills} of {r.requiredSkillsTotal} required skills matched
                {r.requiredSkillsTotal === 0 && " — no specific skills required"}
              </p>
              {/* Visual match bar */}
              <div style={{ background: "var(--line-soft)", borderRadius: "var(--r-pill)", height: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{
                  width: `${r.matchPercentage}%`, height: "100%",
                  background: r.matchPercentage >= 75 ? "var(--veld)" : r.matchPercentage >= 40 ? "var(--sun)" : "var(--rust)",
                  borderRadius: "var(--r-pill)", transition: "width 0.4s ease",
                }} />
              </div>
              <Link to={`/applicant/opportunities/${r.opportunityId}`} className="btn btn-primary btn-sm">View &amp; Apply</Link>
            </div>
          ))}
          {!loading && recs.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <h3>No recommendations yet</h3>
              <p>Tag some skills on your profile and add qualifications to get matched to open opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
