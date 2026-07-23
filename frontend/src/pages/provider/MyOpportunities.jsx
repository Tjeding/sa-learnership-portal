import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Plus, Pencil, Eye, Users } from "lucide-react";
import { opportunities } from "../../data/mockData";

export default function MyOpportunities() {
  return (
    <>
      <Topbar
        eyebrow="Provider" title="My Opportunities" subtitle="Manage every listing you've posted."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
        actions={<Link to="/provider/opportunities/new" className="btn btn-gold btn-sm"><Plus size={14} /> Post New Opportunity</Link>}
      />
      <div className="page">
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Positions</th><th>Closing date</th><th>Applications</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {opportunities.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="cell-primary">{o.title}</div>
                      <div className="cell-sub">{o.sector}</div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{o.type}</td>
                    <td>{o.positions}</td>
                    <td>{o.closingDate}</td>
                    <td>
                      <Link to="/provider/applications" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--veld)", fontWeight: 600 }}>
                        <Users size={13} /> {o.applications}
                      </Link>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} title="View"><Eye size={14} /></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} title="Edit"><Pencil size={14} /></button>
                    </td>
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
