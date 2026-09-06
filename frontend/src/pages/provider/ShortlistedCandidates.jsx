import { apiFetch as fetch } from "../../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { Mail, FileText, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ShortlistedCandidates() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`${API_URL}/api/v1/provider/applications`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((body) => {
        if (!body) return;
        if (!body.success) throw new Error(body?.error?.message || "Failed to load candidates.");
        setRows(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [navigate]);

  async function sendOffer(id) {
    try {
      const res = await fetch(`${API_URL}/api/v1/provider/applications/${id}/offer`, { method: "POST", headers: authHeaders() });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to send offer.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const shortlisted = rows.filter((a) => a.status === "shortlisted" || a.status === "offered");

  async function contact(candidate) {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/conversations`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: candidate.applicantId, opportunityId: candidate.opportunityId }),
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.error?.message || "Unable to open conversation.");
      navigate(`/provider/messages?conversation=${body.data.conversationId}`);
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Shortlisted Candidates" subtitle="Applicants you've moved forward for interviews or offers."
        user={topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="grid grid-3">
          {loading && <p className="text-sm text-stone">Loading…</p>}
          {!loading && shortlisted.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div className="avatar" style={{ background: "var(--sun-deep)", width: 44, height: 44 }}>
                  {a.applicantName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.applicantName}</div>
                  <div className="text-sm text-stone">{a.status === "offered" ? "Offer sent" : "Shortlisted"}</div>
                </div>
              </div>
              <div className="text-sm text-stone" style={{ marginBottom: 12 }}>Applied for {a.opportunityTitle}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => contact(a)}><Mail size={13} /> Message</button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} disabled={!a.applicantCvUrl}
                  onClick={() => window.open(`${API_URL}${a.applicantCvUrl}`, "_blank")}>
                  <FileText size={13} /> View CV
                </button>
              </div>
              {a.status === "offered" ? (
                <div className="badge badge-veld btn-block" style={{ marginTop: 8, justifyContent: "center", padding: "8px 0" }}>Offer sent</div>
              ) : (
                <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => sendOffer(a.id)}>
                  <Send size={13} /> Send Offer
                </button>
              )}
            </div>
          ))}
          {!loading && shortlisted.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}><h3>No shortlisted candidates yet</h3><p>Shortlist applicants from the Applications page.</p></div>
          )}
        </div>
      </div>
    </>
  );
}