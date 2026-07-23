import { useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { StatusBadge, Pathway } from "../../components/Widgets";
import { FileText } from "lucide-react";
import { myApplications, currentApplicant } from "../../data/mockData";

const tabs = ["all", "submitted", "under_review", "shortlisted", "rejected"];
const tabLabels = { all: "All", submitted: "Received", under_review: "In Review", shortlisted: "Shortlisted", rejected: "Rejected" };

export default function MyApplications() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? myApplications : myApplications.filter((a) => a.status === tab);

  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Applications" subtitle="Track every application from submission to outcome."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <div className="tabs">
          {tabs.map((t) => (
            <div key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)} style={{ cursor: "pointer" }}>
              {tabLabels[t]}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((a) => (
            <div className="card" key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)", width: 42, height: 42 }}>
                    <FileText size={19} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.title}</div>
                    <div className="text-sm text-stone">{a.org}</div>
                    <div className="text-sm text-stone" style={{ marginTop: 2 }}>Applied {a.appliedAt} · Updated {a.updatedAt}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <StatusBadge status={a.status} />
                  <Link to={`/applicant/opportunities/${a.opportunityId}`} className="btn btn-outline btn-sm">View Listing</Link>
                </div>
              </div>
              <hr className="divider" />
              <Pathway status={a.status} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>No applications here yet</h3>
              <p>Applications matching this status will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
