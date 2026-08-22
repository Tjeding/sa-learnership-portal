import { useState, useEffect, useCallback } from "react";
import Topbar from "../../components/Topbar";
import { MiniBarChart, HBar, Donut } from "../../components/Widgets";
import { Download, FileDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [volumeData, setVolumeData] = useState([]);
  const [placementData, setPlacementData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJson = useCallback(async (path) => {
    const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
    const body = await res.json();
    if (!body.success) throw new Error(body?.error?.message || "Request failed");
    return body.data;
  }, []);

  useEffect(() => {
    Promise.all([
      fetchJson("/api/v1/provider/reports/application-volume").then(setVolumeData),
      fetchJson("/api/v1/provider/reports/placement-success").then(setPlacementData),
      fetchJson("/api/v1/provider/reports/status-funnel").then(setFunnelData),
    ])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [fetchJson]);

  /* ── Export ──────────────────────────────────────────────────── */
  const handleExport = async (format) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/provider/reports/export/application-volume?format=${format}`,
        { headers: authHeaders() },
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      downloadBlob(blob, `application-volume-report.${format === "pdf" ? "pdf" : "csv"}`);
    } catch (e) {
      setError(e.message);
    }
  };

  /* ── Derived data ───────────────────────────────────────────── */
  const monthlyVolume = volumeData.reduce((acc, row) => {
    const m = row.closingDate ? row.closingDate.substring(0, 7) : "Unknown";
    const existing = acc.find((a) => a.month === m);
    if (existing) existing.value += row.totalApplications;
    else acc.push({ month: m, value: row.totalApplications });
    return acc;
  }, []);

  /* Status breakdown from funnel data */
  const statusTotals = funnelData.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + row.applicationCount;
    return acc;
  }, {});

  const donutSegs = [
    { label: "Submitted", value: statusTotals.submitted || 0, color: "var(--teal)" },
    { label: "In Review", value: statusTotals.under_review || 0, color: "var(--sun)" },
    { label: "Shortlisted", value: statusTotals.shortlisted || 0, color: "var(--veld)" },
    { label: "Rejected", value: statusTotals.rejected || 0, color: "var(--rust)" },
  ];

  if (loading) return <div className="page"><p className="text-sm text-stone">Loading…</p></div>;

  return (
    <>
      <Topbar
        eyebrow="Provider" title="Reports & Analytics" subtitle="Track your applications, placements and listing performance."
        user={{ name: "Provider", role: "Provider", initials: "PR", color: "var(--sun-deep)" }}
        actions={
          <>
            <button className="btn btn-outline btn-sm" onClick={() => handleExport("csv")}><Download size={14} /> CSV</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleExport("pdf")}><FileDown size={14} /> PDF</button>
          </>
        }
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        <div className="grid grid-2-1" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Application Volume (Last 6 Months)</span></div>
            {monthlyVolume.length > 0
              ? <MiniBarChart data={monthlyVolume} color="var(--sun-deep)" />
              : <p className="text-sm text-stone">No application data yet.</p>}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Applications by Status</span></div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Donut segments={donutSegs.filter((s) => s.value > 0)} size={130} stroke={20} />
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
            <button className="btn btn-ghost btn-sm" onClick={() => handleExport("csv")}><Download size={14} /> CSV</button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Opportunity</th><th>Total</th><th>Shortlisted</th><th>Offered</th><th>Accepted</th><th>Rejected</th></tr></thead>
              <tbody>
                {volumeData.length === 0
                  ? <tr><td colSpan={6} className="text-sm text-stone">No opportunities yet.</td></tr>
                  : volumeData.map((o) => (
                    <tr key={o.opportunityId}>
                      <td className="cell-primary">{o.opportunityTitle}</td>
                      <td className="mono">{o.totalApplications}</td>
                      <td className="mono">{o.shortlistedCount}</td>
                      <td className="mono">{o.offeredCount}</td>
                      <td className="mono">{o.acceptedCount}</td>
                      <td className="mono">{o.rejectedCount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Placement success rate by sector (your listings)</span></div>
          {placementData.filter((s) => s.totalApplications > 0).length === 0
            ? <p className="text-sm text-stone">No placement data yet.</p>
            : placementData.filter((s) => s.totalApplications > 0).map((s) =>
              <HBar key={s.sectorId} label={s.sector} pct={s.placementRatePct} color="var(--sun-deep)" />
            )}
        </div>
      </div>
    </>
  );
}
