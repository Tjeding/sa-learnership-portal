import { useState, useEffect, useCallback } from "react";
import Topbar from "../../components/Topbar";
import { MiniBarChart, HBar, Donut } from "../../components/Widgets";
import { Download, FileDown, Save } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const tabs = ["Application Volume", "Placement Success", "Status Funnel", "Custom View"];

/* ── helper: trigger a file download from a blob ─────────────── */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsAdmin() {
  const [tab, setTab] = useState(tabs[0]);
  const [volumeData, setVolumeData] = useState([]);
  const [placementData, setPlacementData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [customData, setCustomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Custom-view filter state */
  const [filters, setFilters] = useState({
    fromDate: "", toDate: "", sector: "", opportunityType: "", groupBy: "month",
  });

  /* Sectors for the custom view filter dropdown */
  const [sectors, setSectors] = useState([]);

  /* ── Fetch helpers ──────────────────────────────────────────── */
  const fetchJson = useCallback(async (path) => {
    const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
    const body = await res.json();
    if (!body.success) throw new Error(body?.error?.message || "Request failed");
    return body.data;
  }, []);

  /* Load sectors on mount for the custom-view filter */
  useEffect(() => {
    fetch(`${API_URL}/api/v1/reference/sectors`)
      .then((r) => r.json())
      .then((body) => { if (body.success) setSectors(body.data); })
      .catch(() => {});
  }, []);

  /* Load the tab-specific data */
  useEffect(() => {
    setLoading(true);
    setError("");
    const loaders = {
      "Application Volume": () => fetchJson("/api/v1/admin/reports/application-volume").then(setVolumeData),
      "Placement Success": () => fetchJson("/api/v1/admin/reports/placement-success").then(setPlacementData),
      "Status Funnel": () => fetchJson("/api/v1/admin/reports/status-funnel").then(setFunnelData),
      "Custom View": () => Promise.resolve(),
    };
    (loaders[tab] || (() => Promise.resolve()))()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab, fetchJson]);

  /* Run custom view query */
  const runCustomView = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.fromDate) params.set("fromDate", filters.fromDate);
      if (filters.toDate) params.set("toDate", filters.toDate);
      if (filters.sector) params.set("sector", filters.sector);
      if (filters.opportunityType) params.set("opportunityType", filters.opportunityType);
      params.set("groupBy", filters.groupBy);
      const data = await fetchJson(`/api/v1/admin/reports/custom-view?${params}`);
      setCustomData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Export handler ─────────────────────────────────────────── */
  const reportKey = { "Application Volume": "application-volume", "Placement Success": "placement-success", "Status Funnel": "status-funnel" };

  const handleExport = async (format) => {
    const key = reportKey[tab];
    if (!key) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/reports/export/${key}?format=${format}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      downloadBlob(blob, `${key}-report.${format === "pdf" ? "pdf" : "csv"}`);
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

  const totalApps = placementData.reduce((s, r) => s + r.totalApplications, 0);
  const totalPlaced = placementData.reduce((s, r) => s + r.totalPlacements, 0);
  const overallRate = totalApps > 0 ? Math.round((totalPlaced / totalApps) * 100) : 0;

  /* Funnel: pivot into a table grouped by month */
  const funnelPivot = funnelData.reduce((acc, row) => {
    const monthKey = row.month || "Unknown";
    let entry = acc.find((a) => a.month === monthKey);
    if (!entry) { entry = { month: monthKey }; acc.push(entry); }
    entry[row.status] = (entry[row.status] || 0) + row.applicationCount;
    return acc;
  }, []);

  if (error && loading) return <div className="page"><p className="text-sm text-stone">Loading…</p></div>;

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Reports & Analytics" subtitle="The 3 core dashboard reports, plus a custom view builder."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
        actions={
          reportKey[tab] ? (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => handleExport("csv")}><Download size={14} /> CSV</button>
              <button className="btn btn-outline btn-sm" onClick={() => handleExport("pdf")}><FileDown size={14} /> PDF</button>
            </>
          ) : null
        }
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        <div className="tabs">
          {tabs.map((t) => (
            <div key={t} className={"tab" + (tab === t ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        {tab === "Application Volume" && (
          <div className="grid grid-2-1">
            <div className="card">
              <div className="card-header"><span className="card-title">Application volume — last 6 months</span></div>
              {loading ? <p className="text-sm text-stone">Loading…</p>
                : monthlyVolume.length > 0 ? <MiniBarChart data={monthlyVolume} />
                  : <p className="text-sm text-stone">No data available yet.</p>}
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Volume per opportunity</span></div>
              <div className="list-plain">
                {loading ? <p className="text-sm text-stone">Loading…</p>
                  : volumeData.slice(0, 8).map((o) => (
                    <div key={o.opportunityId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
                      <span className="text-sm">{o.opportunityTitle}</span>
                      <span className="mono" style={{ fontWeight: 700 }}>{o.totalApplications}</span>
                    </div>
                  ))}
                {!loading && volumeData.length === 0 && <p className="text-sm text-stone">No data yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === "Placement Success" && (
          <div className="grid grid-2-1">
            <div className="card">
              <div className="card-header"><span className="card-title">Placement success rate by sector</span></div>
              {loading ? <p className="text-sm text-stone">Loading…</p>
                : placementData.filter((s) => s.totalApplications > 0).map((s) =>
                  <HBar key={s.sectorId} label={s.sector} pct={s.placementRatePct} />
                )}
              {!loading && placementData.length === 0 && <p className="text-sm text-stone">No placement data yet.</p>}
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Overall placement rate</span></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Donut
                  segments={[
                    { label: "Placed", value: totalPlaced || 1, color: "var(--veld)" },
                    { label: "Not placed", value: Math.max(totalApps - totalPlaced, 1), color: "var(--line)" },
                  ]}
                  size={140} stroke={20}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--veld-deep)" }}>{overallRate}%</div>
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
                <thead><tr><th>Month</th><th>Submitted</th><th>Under Review</th><th>Shortlisted</th><th>Offered</th><th>Accepted</th><th>Rejected</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={7} className="text-sm text-stone">Loading…</td></tr>
                    : funnelPivot.length === 0
                      ? <tr><td colSpan={7} className="text-sm text-stone">No funnel data yet.</td></tr>
                      : funnelPivot.map((row) => (
                        <tr key={row.month}>
                          <td className="cell-primary">{row.month}</td>
                          <td className="mono">{row.submitted || 0}</td>
                          <td className="mono">{row.under_review || 0}</td>
                          <td className="mono">{row.shortlisted || 0}</td>
                          <td className="mono">{row.offered || 0}</td>
                          <td className="mono">{row.accepted || 0}</td>
                          <td className="mono">{row.rejected || 0}</td>
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
                <div className="field">
                  <label>Date range</label>
                  <input className="input" type="date" value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                </div>
                <div className="field">
                  <label>To</label>
                  <input className="input" type="date" value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Sector</label>
                  <select className="input" value={filters.sector}
                    onChange={(e) => setFilters({ ...filters, sector: e.target.value })}>
                    <option value="">All sectors</option>
                    {sectors.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Opportunity type</label>
                  <select className="input" value={filters.opportunityType}
                    onChange={(e) => setFilters({ ...filters, opportunityType: e.target.value })}>
                    <option value="">All types</option>
                    <option value="learnership">Learnership</option>
                    <option value="internship">Internship</option>
                    <option value="apprenticeship">Apprenticeship</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Group by</label>
                <select className="input" value={filters.groupBy}
                  onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}>
                  <option value="month">Month</option>
                  <option value="sector">Sector</option>
                  <option value="opportunity_type">Opportunity type</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" onClick={runCustomView}>Run report</button>
                <button className="btn btn-outline"><Save size={14} /> Save this view</button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Results</span></div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Grouping</th><th>Status</th><th>Count</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={3} className="text-sm text-stone">Loading…</td></tr>
                      : customData.length === 0
                        ? <tr><td colSpan={3} className="text-sm text-stone">Run a query to see results.</td></tr>
                        : customData.map((row, i) => (
                          <tr key={i}>
                            <td className="cell-primary">{row.grouping}</td>
                            <td>{row.status}</td>
                            <td className="mono">{row.count}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
