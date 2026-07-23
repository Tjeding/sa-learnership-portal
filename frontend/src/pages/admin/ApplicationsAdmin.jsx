import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Download, Search } from "lucide-react";
import { providerApplicants } from "../../data/mockData";

export default function ApplicationsAdmin() {
  return (
    <>
      <Topbar
        eyebrow="Admin" title="Applications" subtitle="System-wide view of every application in the pipeline."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
        actions={<button className="btn btn-outline btn-sm"><Download size={14} /> Export CSV</button>}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 360 }}>
            <Search size={15} color="var(--stone)" />
            <input placeholder="Search applicants, providers or opportunities…" />
          </div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Opportunity</th><th>NQF</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {providerApplicants.map((a) => (
                  <tr key={a.id}>
                    <td className="cell-primary">{a.name}</td>
                    <td>{a.opportunity}</td>
                    <td>Level {a.nqf}</td>
                    <td>{a.appliedAt}</td>
                    <td><StatusBadge status={a.status} /></td>
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
