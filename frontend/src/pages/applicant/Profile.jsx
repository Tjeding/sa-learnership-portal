import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { ProgressRing } from "../../components/Widgets";
import { UploadCloud, FileCheck2, ShieldCheck, Clock3, Plus, X, ImagePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Falls back to localhost for local dev; set VITE_API_URL in frontend/.env for other environments.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Placeholder — replace once backend exposes applicant qualifications & skills endpoints
const PLACEHOLDER_QUALIFICATIONS = [
  { title: "National Senior Certificate (Matric)", institution: "—", year: "—", nqf: 4, verified: true },
];
const PLACEHOLDER_SKILLS = [
  { name: "Communication", level: "—" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { topbarUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [nqfLevels, setNqfLevels] = useState([]);

  const cvInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch(`${API_URL}/api/v1/applicant/profile`, { headers: authHeaders() });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const body = await res.json();
        if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to load profile.");
        if (!cancelled) setProfile(body.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/v1/reference/nqf-levels`)
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled && body.success) setNqfLevels(body.data);
      })
      .catch(() => {}); // non-critical for page load; badge just won't render
    return () => { cancelled = true; };
  }, []);

  function updateField(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_URL}/api/v1/applicant/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          idNumber: profile.idNumber || null,
          phone: profile.phone || null,
          dateOfBirth: profile.dateOfBirth || null,
          gender: profile.gender || null,
          province: profile.province || null,
          townCity: profile.townCity || null,
          addressLine: profile.addressLine || null,
          postalCode: profile.postalCode || null,
          bio: profile.bio || null,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to save changes.");
      setProfile(body.data);
      setNotice("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCvSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
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
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "CV upload failed.");
      setProfile((prev) => ({
        ...prev,
        cvUrl: body.data.fileUrl,
        cvUploadedAt: body.data.uploadedAt,
      }));
    } catch (err) {
      setError(err.message || "CV upload failed.");
    } finally {
      setCvUploading(false);
      e.target.value = "";
    }
  }

  async function handleImageSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/api/v1/applicant/profile/image`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Photo upload failed.");
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: body.data.fileUrl,
        profileImageUploadedAt: body.data.uploadedAt,
      }));
    } catch (err) {
      setError(err.message || "Photo upload failed.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="My Profile" subtitle="Loading…" notifCount={0} msgCount={0}
          user={{ name: "", role: "Applicant", initials: "…", color: "var(--veld)" }} />
        <div className="page"><p className="text-sm text-stone">Loading your profile…</p></div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Topbar eyebrow="Applicant" title="My Profile" subtitle="Something went wrong." notifCount={0} msgCount={0}
          user={{ name: "", role: "Applicant", initials: "?", color: "var(--veld)" }} />
        <div className="page">
          <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>
            {error || "Could not load your profile."}
          </div>
        </div>
      </>
    );
  }

  const initials = ((profile.firstName?.[0] || "") + (profile.lastName?.[0] || "")).toUpperCase() || "?";

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Profile" subtitle="Keep this up to date to improve your match scores."
        notifCount={3} msgCount={2}
        user={{ name: `${profile.firstName} ${profile.lastName}`, role: "Applicant", initials, color: "var(--veld)" }}
      />
      <div className="page">
        {error && (
          <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {notice && (
          <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>
            {notice}
          </div>
        )}

        <div className="grid grid-2-1">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Personal Details</span></div>
              <div className="field-row">
                <div className="field"><label>First name</label>
                  <input className="input" value={profile.firstName || ""} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div className="field"><label>Last name</label>
                  <input className="input" value={profile.lastName || ""} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
              </div>
              <div className="field-row">
                <div className="field"><label>ID number</label>
                  <input className="input" value={profile.idNumber || ""} maxLength={13}
                    onChange={(e) => updateField("idNumber", e.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="field"><label>Phone</label>
                  <input className="input" value={profile.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Province</label>
                  <select className="input" value={profile.province || ""} onChange={(e) => updateField("province", e.target.value)}>
                    <option value="">Select…</option>
                    <option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option><option>Eastern Cape</option>
                    <option>Free State</option><option>Limpopo</option><option>Mpumalanga</option><option>North West</option><option>Northern Cape</option>
                  </select>
                </div>
                <div className="field"><label>Town / City</label>
                  <input className="input" value={profile.townCity || ""} onChange={(e) => updateField("townCity", e.target.value)} />
                </div>
              </div>
              <div className="field"><label>Bio</label>
                <textarea className="input" value={profile.bio || ""} onChange={(e) => updateField("bio", e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Qualifications</span>
                <button className="btn btn-outline btn-sm"><Plus size={14} /> Add qualification</button>
              </div>
              {/* Qualifications/skills management is a separate feature; showing sample data for now. */}
              <div className="list-plain">
                {PLACEHOLDER_QUALIFICATIONS.map((q) => (
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
                {PLACEHOLDER_SKILLS.map((s) => (
                  <span className="chip" key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {s.name} · <span className="text-stone">{s.level}</span> <X size={12} style={{ cursor: "pointer" }} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                {profile.profileImageUrl ? (
                  <img
                    src={`${API_URL}${profile.profileImageUrl}`}
                    alt="Profile"
                    style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <ProgressRing value={85} size={110} stroke={10} />
                )}
              </div>
              <div style={{ fontWeight: 700, marginTop: 12 }}>
                {profile.profileImageUrl ? `${profile.firstName} ${profile.lastName}` : "Profile Strength: Excellent"}
              </div>
              <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleImageSelected} />
              <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}
                onClick={() => imageInputRef.current?.click()} disabled={imageUploading}>
                <ImagePlus size={15} /> {imageUploading ? "Uploading…" : profile.profileImageUrl ? "Change photo" : "Upload photo"}
              </button>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">CV</span></div>
              {profile.cvUrl ? (
                <a href={`${API_URL}${profile.cvUrl}`} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px dashed var(--line)", borderRadius: "var(--r-md)", textDecoration: "none", color: "inherit" }}>
                  <FileCheck2 size={22} color="var(--veld)" />
                  <div>
                    <div className="cell-primary" style={{ fontSize: 13.5 }}>View uploaded CV</div>
                    <div className="cell-sub">Uploaded {new Date(profile.cvUploadedAt).toLocaleDateString()}</div>
                  </div>
                </a>
              ) : (
                <p className="text-sm text-stone">No CV uploaded yet.</p>
              )}
              <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleCvSelected} />
              <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}
                onClick={() => cvInputRef.current?.click()} disabled={cvUploading}>
                <UploadCloud size={15} /> {cvUploading ? "Uploading…" : "Upload new CV"}
              </button>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">NQF Reference</span></div>
              <p className="text-sm text-stone" style={{ marginBottom: 10 }}>Your highest verified qualification maps to:</p>
              {nqfLevels.length > 0 ? (
                <div className="badge badge-teal" style={{ fontSize: 13, padding: "6px 12px" }}>
                  {nqfLevels[3].levelName} — {nqfLevels[3].typicalExample}
                </div>
              ) : (
                <p className="text-sm text-stone">Loading…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
