import { useState } from "react";
import Topbar from "../../components/Topbar";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* No audit-log backend endpoint exists yet — page shows an empty state
   until the feature is implemented. */

export default function AuditLogs() {
  const { topbarUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Topbar
        eyebrow="Admin" title="Audit Logs" subtitle="Every significant action taken across the platform."
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 360 }}>
            <Search size={15} color="var(--stone)" />
            <input placeholder="Search by action, entity or user…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Action</th><th>Entity</th><th>User</th><th>Timestamp</th></tr></thead>
              <tbody>
                <tr><td colSpan={4}>
                  <div className="empty-state">
                    <h3>Audit log coming soon</h3>
                    <p>Audit history is not available in the portal yet.</p>
                  </div>
                </td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
