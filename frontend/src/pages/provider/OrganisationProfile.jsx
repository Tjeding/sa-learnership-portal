import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { ShieldCheck, Globe, MapPin } from "lucide-react";

// Falls back to localhost for local dev; set VITE_API_URL in frontend/.env for other environments.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PROVIDER_TYPE_LABELS = {
  employer: "Employer",
  training_provider: "Training provider",
  both: "Both",
};

export default function OrganisationProfile() {
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [orgRes, sectorsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/provider/organisation`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/v1/reference/sectors`),
        ]);

        if (orgRes.status === 401) {
          navigate("/login");
          return;
        }

        const orgBody = await orgRes.json();
        if (!orgRes.ok || !orgBody.success) throw new Error(orgBody?.error?.message || "Failed to load organisation profile.");

        const sectorsBody = await sectorsRes.json();
        const sectorList = sectorsRes.ok && sectorsBody.success ? sectorsBody.data : [];

        if (!cancelled) {
          setOrg(orgBody.data);
          setSectors(sectorList);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load organisation profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [navigate]);

  function updateField(field, value) {
    setOrg((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_URL}/api/v1/provider/organisation`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          organizationName: org.organizationName,
          providerType: org.providerType,
          sectorId: org.sectorId || null,
          registrationNumber: org.registrationNumber || null,
          setaAccreditationNumber: org.setaAccreditationNumber || null,
          contactPerson: org.contactPerson || null,
          phone: org.phone || null,
          website: org.website || null,
          addressLine: org.addressLine || null,
          province: org.province || null,
          townCity: org.townCity || null,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body?.error?.message || "Failed to save changes.");
      setOrg(body.data);
      setNotice("Organisation profile updated.");
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar eyebrow="Provider" title="Organisation Profile" subtitle="Loading…" notifCount={0} msgCount={0}
          user={{ name: "", role: "Provider", initials: "…", color: "var(--sun-deep)" }} />
        <div className="page"><p className="text-sm text-stone">Loading your organisation profile…</p></div>
      </>
    );
  }

  if (!org) {
    return (
      <>
        <Topbar eyebrow="Provider" title="Organisation Profile" subtitle="Something went wrong." notifCount={0} msgCount={0}
          user={{ name: "", role: "Provider", initials: "?", color: "var(--sun-deep)" }} />
        <div className="page">
          <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8 }}>
            {error || "Could not load your organisation profile."}
          </div>
        </div>
      </>
    );
  }

  const initials = (org.organizationName || "")
    .split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Organisation Profile" subtitle="This information appears on all your opportunity listings."
        notifCount={3} msgCount={4}
        user={{ name: org.contactPerson || org.organizationName, role: org.organizationName, initials, color: "var(--sun-deep)" }}
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
          <div className="card">
            <div className="card-header"><span className="card-title">Organisation details</span></div>
            <div className="field"><label>Organisation name</label>
              <input className="input" value={org.organizationName || ""} onChange={(e) => updateField("organizationName", e.target.value)} />
            </div>
            <div className="field-row">
              <div className="field"><label>Provider type</label>
                <select className="input" value={org.providerType || "employer"} onChange={(e) => updateField("providerType", e.target.value)}>
                  {Object.entries(PROVIDER_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="field"><label>Sector</label>
                <select className="input" value={org.sectorId || ""} onChange={(e) => updateField("sectorId", e.target.value ? Number(e.target.value) : null)}>
                  <option value="">Select…</option>
                  {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field"><label>Registration number</label>
                <input className="input" value={org.registrationNumber || ""} onChange={(e) => updateField("registrationNumber", e.target.value)} />
              </div>
              <div className="field"><label>SETA accreditation number</label>
                <input className="input" value={org.setaAccreditationNumber || ""} onChange={(e) => updateField("setaAccreditationNumber", e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field"><label>Contact person</label>
                <input className="input" value={org.contactPerson || ""} onChange={(e) => updateField("contactPerson", e.target.value)} />
              </div>
              <div className="field"><label>Phone</label>
                <input className="input" value={org.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
            </div>
            <div className="field"><label>Website</label>
              <input className="input" value={org.website || ""} onChange={(e) => updateField("website", e.target.value)} />
            </div>
            <div className="field-row">
              <div className="field"><label>Province</label>
                <input className="input" value={org.province || ""} onChange={(e) => updateField("province", e.target.value)} />
              </div>
              <div className="field"><label>Town / City</label>
                <input className="input" value={org.townCity || ""} onChange={(e) => updateField("townCity", e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div className="avatar" style={{ background: "var(--sun-deep)", width: 64, height: 64, margin: "0 auto 12px", fontSize: 20 }}>{initials}</div>
              <div style={{ fontWeight: 700 }}>{org.organizationName}</div>
              {org.verified ? (
                <span className="badge badge-veld" style={{ marginTop: 8 }}><ShieldCheck size={12} /> Verified provider</span>
              ) : (
                <span className="badge badge-sun" style={{ marginTop: 8 }}>Pending verification</span>
              )}
            </div>
            <div className="card">
              {org.website && (
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}><Globe size={16} color="var(--stone)" /> <span className="text-sm">{org.website}</span></div>
              )}
              {(org.townCity || org.province) && (
                <div style={{ display: "flex", gap: 10 }}><MapPin size={16} color="var(--stone)" /> <span className="text-sm">{[org.townCity, org.province].filter(Boolean).join(", ")}</span></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
