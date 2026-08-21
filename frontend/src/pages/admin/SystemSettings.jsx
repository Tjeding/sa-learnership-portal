import { useState } from "react";
import Topbar from "../../components/Topbar";
import { useAuth } from "../../context/AuthContext";

const tabs = ["General", "Email", "Roles & Permissions", "Integrations"];

export default function SystemSettings() {
  const { topbarUser } = useAuth();
  const [tab, setTab] = useState(tabs[0]);
  return (
    <>
      <Topbar
        eyebrow="Admin" title="System Settings" subtitle="Platform-wide configuration."
        notifCount={2} msgCount={0}
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="tabs">
          {tabs.map((t) => <div key={t} className={"tab" + (tab === t ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(t)}>{t}</div>)}
        </div>

        {tab === "General" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="field"><label>Platform name</label><input className="input" defaultValue="SA Learnerships & Skills Development Portal" /></div>
            <div className="field"><label>Support email</label><input className="input" defaultValue="support@salearnerships.co.za" /></div>
            <div className="field"><label>Default applications close automatically after closing date</label>
              <select className="input"><option>Enabled</option><option>Disabled</option></select>
            </div>
            <button className="btn btn-primary">Save changes</button>
          </div>
        )}

        {tab === "Email" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="field"><label>SMTP host</label><input className="input" defaultValue="smtp.sendgrid.net" /></div>
            <div className="field-row">
              <div className="field"><label>Port</label><input className="input" defaultValue="587" /></div>
              <div className="field"><label>Encryption</label><select className="input"><option>STARTTLS</option><option>SSL</option></select></div>
            </div>
            <div className="field"><label>From address</label><input className="input" defaultValue="no-reply@salearnerships.co.za" /></div>
            <button className="btn btn-primary">Save changes</button>
          </div>
        )}

        {tab === "Roles & Permissions" && (
          <div className="card">
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Permission</th><th>Applicant</th><th>Provider</th><th>Admin</th></tr></thead>
                <tbody>
                  {[
                    ["Apply to opportunities", true, false, false],
                    ["Post opportunities", false, true, true],
                    ["Approve opportunities", false, false, true],
                    ["View system-wide reports", false, false, true],
                    ["Manage users", false, false, true],
                  ].map(([perm, a, p, ad]) => (
                    <tr key={perm}>
                      <td className="cell-primary">{perm}</td>
                      <td>{a ? "✓" : "—"}</td><td>{p ? "✓" : "—"}</td><td>{ad ? "✓" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Integrations" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="field"><label>SAQA NLRD reference URL</label><input className="input" defaultValue="https://allqs.saqa.org.za/search.php" /></div>
            <div className="field"><label>File storage</label><select className="input"><option>Local disk</option><option>AWS S3</option><option>Azure Blob</option></select></div>
            <button className="btn btn-primary">Save changes</button>
          </div>
        )}
      </div>
    </>
  );
}
