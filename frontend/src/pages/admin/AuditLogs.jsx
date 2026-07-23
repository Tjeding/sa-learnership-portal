import Topbar from "../../components/Topbar";
import { Search, Download } from "lucide-react";
import { auditLog } from "../../data/mockData";

export default function AuditLogs() {
  return (
    <>
      <Topbar
        eyebrow="Admin" title="Audit Logs" subtitle="Every significant action taken across the platform."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
        actions={<button className="btn btn-outline btn-sm"><Download size={14} /> Export CSV</button>}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 360 }}>
            <Search size={15} color="var(--stone)" />
            <input placeholder="Search by action, entity or user…" />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Action</th><th>Entity</th><th>User</th><th>Timestamp</th></tr></thead>
              <tbody>
                {auditLog.map((a) => (
                  <tr key={a.id}>
                    <td><span className="badge badge-stone">{a.action.replaceAll("_", " ")}</span></td>
                    <td className="cell-primary">{a.entity}</td>
                    <td>{a.user}</td>
                    <td className="mono">{a.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
