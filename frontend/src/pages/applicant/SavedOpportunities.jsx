import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { MapPin, Clock, Wallet, Bookmark } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function SavedOpportunities() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`${API_URL}/api/v1/applicant/saved-opportunities`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (!body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load saved opportunities.");
        setSaved(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [navigate]);

  async function unsave(opportunityId) {
    try {
      const res = await fetch(`${API_URL}/api/v1/applicant/saved-opportunities/${opportunityId}`, { method: "DELETE", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to unsave.");
      setSaved((prev) => prev.filter((o) => o.opportunityId !== opportunityId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="Saved Opportunities" subtitle="Listings you've bookmarked to apply to later."
        notifCount={3} msgCount={2}
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }}
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>{error}</div>}
        <div className="grid grid-3">
          {loading && <p className="text-sm text-stone">Loading…</p>}
          {!loading && saved.map((o) => (
            <div key={o.opportunityId} className="opp-card">
              <div className="opp-card-top">
                <span className="badge badge-sun">{o.opportunityType}</span>
                <Bookmark size={16} color="var(--sun-deep)" fill="var(--sun-deep)" style={{ cursor: "pointer" }} onClick={() => unsave(o.opportunityId)} />
              </div>
              <div>
                <h4>{o.title}</h4>
                <p className="text-sm text-stone" style={{ marginTop: 4 }}>{o.providerName} · {o.sectorName}</p>
              </div>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}</span>
                <span><Clock size={13} /> {o.durationMonths} months</span>
                <span><Wallet size={13} /> {o.stipendAmount ? `R${Number(o.stipendAmount).toLocaleString()}/${o.stipendPeriod}` : "Unpaid"}</span>
              </div>
              <Link to={`/applicant/opportunities/${o.opportunityId}`} className="btn btn-primary btn-sm">View &amp; Apply</Link>
            </div>
          ))}
          {!loading && saved.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}><h3>Nothing saved yet</h3><p>Bookmark opportunities from the listings page to see them here.</p></div>
          )}
        </div>
      </div>
    </>
  );
}