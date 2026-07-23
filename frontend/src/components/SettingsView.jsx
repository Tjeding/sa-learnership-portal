import { useState } from "react";
import Topbar from "./Topbar";

export default function SettingsView({ topbarProps, extraTabs = [] }) {
  const tabs = ["Account", "Notifications", "Security", ...extraTabs];
  const [tab, setTab] = useState("Account");

  return (
    <>
      <Topbar {...topbarProps} title="Settings" subtitle="Manage your account preferences." />
      <div className="page">
        <div className="tabs">
          {tabs.map((t) => (
            <div key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)} style={{ cursor: "pointer" }}>{t}</div>
          ))}
        </div>

        {tab === "Account" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="card-header"><span className="card-title">Account details</span></div>
            <div className="field"><label>Email address</label><input className="input" type="email" defaultValue="demo@example.co.za" /></div>
            <div className="field"><label>Language</label><select className="input"><option>English</option><option>isiZulu</option><option>Afrikaans</option><option>Sesotho</option></select></div>
            <button className="btn btn-primary">Save changes</button>
          </div>
        )}

        {tab === "Notifications" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="card-header"><span className="card-title">Notification preferences</span></div>
            {[
              ["Email notifications", "Get status updates and reminders by email", true],
              ["In-app notifications", "Show updates in the notification bell", true],
              ["New match alerts", "Notify me when a new opportunity matches my profile", true],
              ["Closing date reminders", "Remind me before an opportunity's closing date", false],
            ].map(([label, hint, checked]) => (
              <label key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{label}</div>
                  <div className="text-sm text-stone">{hint}</div>
                </div>
                <input type="checkbox" defaultChecked={checked} style={{ width: 18, height: 18 }} />
              </label>
            ))}
          </div>
        )}

        {tab === "Security" && (
          <div className="card" style={{ maxWidth: 560 }}>
            <div className="card-header"><span className="card-title">Change password</span></div>
            <div className="field"><label>Current password</label><input className="input" type="password" /></div>
            <div className="field"><label>New password</label><input className="input" type="password" /></div>
            <div className="field"><label>Confirm new password</label><input className="input" type="password" /></div>
            <button className="btn btn-primary">Update password</button>
            <hr className="divider" />
            <button className="btn btn-danger">Deactivate account</button>
          </div>
        )}

        {extraTabs.includes(tab) && (
          <div className="card" style={{ maxWidth: 560 }}>
            <p className="text-sm text-stone">Settings for "{tab}" go here.</p>
          </div>
        )}
      </div>
    </>
  );
}
