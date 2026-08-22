import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatusBadge, Pathway } from "../../components/Widgets";
import { FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const tabs = ["all", "submitted", "under_review", "shortlisted", "rejected"];
const tabLabels = { all: "All", submitted: "Received", under_review: "In Review", shortlisted: "Shortlisted", rejected: "Rejected" };
const WITHDRAWABLE = new Set(["submitted", "under_review", "shortlisted", "offered"]);

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function MyApplications() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [tab, setTab] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`${API_URL}/api/v1/applicant/applications`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (!body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load applications.");
        setApplications(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [navigate]);

  async function handleWithdraw(id) {
    if (!confirm("Withdraw this application? You won't be able to reapply automatically.")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/applicant/applications/${id}/withdraw`, { method: "POST", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to withdraw.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = tab === "all" ? applications : applications.filter((a) => a.status === tab);

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Applications" subtitle="Track every application from submission to outcome."
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="tabs">
          {tabs.map((t) => (
            <div key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)} style={{ cursor: "pointer" }}>
              {tabLabels[t]}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading && <p className="text-sm text-stone">Loading…</p>}
          {!loading && filtered.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)", width: 42, height: 42 }}>
                    <FileText size={19} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.opportunityTitle}</div>
                    <div className="text-sm text-stone">{a.providerName}</div>
                    <div className="text-sm text-stone" style={{ marginTop: 2 }}>
                      Applied {new Date(a.appliedAt).toLocaleDateString()} · Updated {new Date(a.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <StatusBadge status={a.status} />
                  <Link to={`/applicant/opportunities/${a.opportunityId}`} className="btn btn-outline btn-sm">View Listing</Link>
                  {WITHDRAWABLE.has(a.status) && (
                    <button className="btn btn-ghost btn-sm" onClick={() => handleWithdraw(a.id)}>Withdraw</button>
                  )}
                </div>
              </div>
              <hr className="divider" />
              <Pathway status={a.status} />
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <h3>No applications here yet</h3>
              <p>Applications matching this status will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}