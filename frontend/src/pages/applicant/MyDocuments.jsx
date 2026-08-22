import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/Topbar";
import { FileText, UploadCloud, Download, ShieldCheck, Clock3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function MyDocuments() {
  const { topbarUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /* Fetch the applicant profile to get the real CV data */
  useEffect(() => {
    fetch(`${API_URL}/api/v1/applicant/profile`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load profile.");
        setProfile(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* Upload a CV file */
  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/v1/applicant/profile/cv`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const body = await res.json();
      if (!body.success) throw new Error(body?.error?.message || "Upload failed.");

      // Refresh profile to show the new CV
      const profileRes = await fetch(`${API_URL}/api/v1/applicant/profile`, { headers: authHeaders() });
      const profileBody = await profileRes.json();
      if (profileBody.success) setProfile(profileBody.data);
      await refreshUser();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  /* Build the document list from real profile data */
  const docs = [];
  if (profile?.cvUrl) {
    const fileName = profile.cvUrl.split("/").pop() || "CV.pdf";
    docs.push({
      name: fileName,
      type: "CV / Resume",
      url: profile.cvUrl.startsWith("http") ? profile.cvUrl : `${API_URL}${profile.cvUrl}`,
      date: profile.cvUploadedAt
        ? new Date(profile.cvUploadedAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })
        : "—",
      status: "uploaded",
    });
  }

  if (loading) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="My Documents" subtitle="Loading…"
          user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page"><p className="text-sm text-stone">Loading…</p></div>
      </>
    );
  }

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Documents" subtitle="CV, certificates and ID documents used across your applications."
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8, marginBottom: 12 }}>
            {error}
            <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#a32424" }}>×</button>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)" }}><UploadCloud size={18} /></div>
            <div>
              <div style={{ fontWeight: 700 }}>{profile?.cvUrl ? "Replace your CV" : "Upload your CV"}</div>
              <div className="text-sm text-stone">PDF, DOCX up to 5MB</div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <button
            className="btn btn-primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Choose file"}
          </button>
        </div>

        <div className="card">
          {docs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <FileText size={40} color="var(--stone)" style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No documents uploaded yet</p>
              <p className="text-sm text-stone">Upload your CV using the button above to get started.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Document</th><th>Type</th><th>Uploaded</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.name}>
                      <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <FileText size={16} color="var(--stone)" /> <span className="cell-primary">{d.name}</span>
                      </td>
                      <td>{d.type}</td>
                      <td>{d.date}</td>
                      <td>
                        {d.status === "uploaded" ? (
                          <span className="badge badge-veld"><ShieldCheck size={12} /> Uploaded</span>
                        ) : (
                          <span className="badge badge-sun"><Clock3 size={12} /> Pending</span>
                        )}
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <Download size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
