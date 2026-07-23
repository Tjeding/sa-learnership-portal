import Topbar from "../../components/Topbar";
import { FileText, Award, UploadCloud, Download, Trash2, ShieldCheck, Clock3 } from "lucide-react";
import { currentApplicant } from "../../data/mockData";

const docs = [
  { name: "Lindiwe_Mokoena_CV.pdf", type: "CV / Resume", size: "214 KB", date: "2026-06-02", status: "verified" },
  { name: "Matric_Certificate.pdf", type: "Qualification certificate", size: "1.1 MB", date: "2026-05-18", status: "verified" },
  { name: "NCV_Level4_Certificate.pdf", type: "Qualification certificate", size: "980 KB", date: "2026-07-01", status: "pending" },
  { name: "ID_Copy.pdf", type: "Identity document", size: "560 KB", date: "2026-05-18", status: "verified" },
];

export default function MyDocuments() {
  return (
    <>
      <Topbar
        eyebrow="Applicant" title="My Documents" subtitle="CV, certificates and ID documents used across your applications."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="stat-icon" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)" }}><UploadCloud size={18} /></div>
            <div>
              <div style={{ fontWeight: 700 }}>Upload a new document</div>
              <div className="text-sm text-stone">PDF, DOCX up to 5MB</div>
            </div>
          </div>
          <button className="btn btn-primary">Choose file</button>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Document</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.name}>
                    <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <FileText size={16} color="var(--stone)" /> <span className="cell-primary">{d.name}</span>
                    </td>
                    <td>{d.type}</td>
                    <td className="mono">{d.size}</td>
                    <td>{d.date}</td>
                    <td>
                      {d.status === "verified" ? (
                        <span className="badge badge-veld"><ShieldCheck size={12} /> Verified</span>
                      ) : (
                        <span className="badge badge-sun"><Clock3 size={12} /> Pending</span>
                      )}
                    </td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Download size={14} /></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Trash2 size={14} color="var(--rust)" /></button>
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
