import { useState } from "react";
import Topbar from "../../components/Topbar";
import { MiniBarChart, HBar, Donut } from "../../components/Widgets";
import { Download, FileDown, Save } from "lucide-react";
import { applicationVolumeMonths, placementBySector, opportunities, sectors } from "../../data/mockData";

const tabs = ["Application Volume", "Placement Success", "Status Funnel", "Custom View"];

export default function ReportsAdmin() {
  const [tab, setTab] = useState(tabs[0]);

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Reports & Analytics" subtitle="The 3 core dashboard reports, plus a custom view builder."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
        actions={
          <>
            <button className="btn btn-outline btn-sm"><Download size={14} /> CSV</button>
            <button className="btn btn-outline btn-sm"><FileDown size={14} /> PDF</button>
          </>
        }
      />
      <div className="page">
        <div className="tabs">
          {tabs.map((t) => (
            <div key={t} className={"tab" + (tab === t ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        {tab === "Application Volume" && (
          <div className="grid grid-2-1">
            <div className="card">
              <div className="card-header"><span className="card-title">Application volume — last 6 months</span></div>
              <MiniBarChart data={applicationVolumeMonths} />
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Volume per opportunity</span></div>
              <div className="list-plain">
                {opportunities.slice(0, 6).map((o) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
                    <span className="text-sm">{o.title}</span>
                    <span className="mono" style={{ fontWeight: 700 }}>{o.applications}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Placement Success" && (
          <div className="grid grid-2-1">
            <div className="card">
              <div className="card-header"><span className="card-title">Placement success rate by sector</span></div>
              {placementBySector.map((s) => <HBar key={s.sector} label={s.sector} pct={s.rate} />)}
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Overall placement rate</span></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Donut segments={[{ label: "Placed", value: 68, color: "var(--veld)" }, { label: "Not placed", value: 32, color: "var(--line)" }]} size={140} stroke={20} />
              </div>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--veld-deep)" }}>68%</div>
                <div className="text-sm text-stone">applications that reached "accepted"</div>
              </div>
            </div>
          </div>
        )}

        {tab === "Status Funnel" && (
          <div className="card">
            <div className="card-header"><span className="card-title">Application status funnel over time</span></div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Month</th><th>Received</th><th>In Review</th><th>Shortlisted</th><th>Offered</th><th>Accepted</th><th>Rejected</th></tr></thead>
                <tbody>
                  {applicationVolumeMonths.map((m) => (
                    <tr key={m.month}>
                      <td className="cell-primary">{m.month} 2026</td>
                      <td className="mono">{Math.round(m.value * 0.4)}</td>
                      <td className="mono">{Math.round(m.value * 0.25)}</td>
                      <td className="mono">{Math.round(m.value * 0.15)}</td>
                      <td className="mono">{Math.round(m.value * 0.08)}</td>
                      <td className="mono">{Math.round(m.value * 0.06)}</td>
                      <td className="mono">{Math.round(m.value * 0.06)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-stone" style={{ marginTop: 12 }}>Backed by <code>vw_application_status_funnel</code>, groupable by month, opportunity type and sector.</p>
          </div>
        )}

        {tab === "Custom View" && (
          <div className="grid grid-2-1">
            <div className="card">
              <div className="card-header"><span className="card-title">Build a custom view</span></div>
              <div className="field-row">
                <div className="field"><label>Date range</label><input className="input" type="date" /></div>
                <div className="field"><label>To</label><input className="input" type="date" /></div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Sector</label>
                  <select className="input"><option>All sectors</option>{sectors.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="field">
                  <label>Opportunity type</label>
                  <select className="input"><option>All types</option><option>Learnership</option><option>Internship</option><option>Apprenticeship</option></select>
                </div>
              </div>
              <div className="field"><label>Group by</label><select className="input"><option>Month</option><option>Sector</option><option>Province</option><option>Opportunity type</option></select></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary">Run report</button>
                <button className="btn btn-outline"><Save size={14} /> Save this view</button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Saved reports</span></div>
              <div className="list-plain">
                {["Q2 IT sector placements", "Gauteng learnerships — 2026", "Rejected applications by province"].map((r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
                    <span className="text-sm">{r}</span>
                    <button className="card-link" style={{ background: "none", border: "none" }}>Run</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
