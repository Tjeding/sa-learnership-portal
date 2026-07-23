import Topbar from "../../components/Topbar";
import { MiniBarChart, HBar, Donut } from "../../components/Widgets";
import { Download, FileDown } from "lucide-react";
import { applicationVolumeMonths, opportunities } from "../../data/mockData";

export default function Reports() {
  const perOpportunity = opportunities.slice(0, 5);
  const donutSegs = [
    { label: "Received", value: 68, color: "var(--teal)" },
    { label: "In Review", value: 45, color: "var(--sun)" },
    { label: "Shortlisted", value: 28, color: "var(--veld)" },
    { label: "Rejected", value: 15, color: "var(--rust)" },
  ];

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Reports & Analytics" subtitle="Track your applications, placements and listing performance."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
        actions={<button className="btn btn-outline btn-sm"><FileDown size={14} /> Export PDF</button>}
      />
      <div className="page">
        <div className="grid grid-2-1" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Application Volume (Last 6 Months)</span></div>
            <MiniBarChart data={applicationVolumeMonths} color="var(--sun-deep)" />
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Applications by Status</span></div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Donut segments={donutSegs} size={130} stroke={20} />
            </div>
            {donutSegs.map((s) => (
              <div className="legend-row" key={s.label}>
                <span className="legend-swatch" style={{ background: s.color }} /> {s.label} <span className="legend-val">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span className="card-title">Application volume per opportunity</span>
            <button className="btn btn-ghost btn-sm"><Download size={14} /> CSV</button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Opportunity</th><th>Total</th><th>Shortlisted</th><th>Offered</th><th>Accepted</th><th>Rejected</th></tr></thead>
              <tbody>
                {perOpportunity.map((o) => (
                  <tr key={o.id}>
                    <td className="cell-primary">{o.title}</td>
                    <td className="mono">{o.applications}</td>
                    <td className="mono">{Math.round(o.applications * 0.3)}</td>
                    <td className="mono">{Math.round(o.applications * 0.1)}</td>
                    <td className="mono">{Math.round(o.applications * 0.08)}</td>
                    <td className="mono">{Math.round(o.applications * 0.2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Placement success rate by sector (your listings)</span></div>
          <HBar label="Information Technology" pct={78} color="var(--sun-deep)" />
          <HBar label="Construction" pct={64} color="var(--sun-deep)" />
          <HBar label="Energy" pct={57} color="var(--sun-deep)" />
        </div>
      </div>
    </>
  );
}
