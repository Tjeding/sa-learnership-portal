import { useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Search, ShieldCheck, Ban, Eye } from "lucide-react";
import { adminUsers } from "../../data/mockData";

export default function UserManagement() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filtered = adminUsers.filter((u) =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <Topbar
        eyebrow="Admin" title="User Management" subtitle="Manage applicants, providers and administrators."
        notifCount={2} msgCount={0}
        user={{ name: "Admin User", role: "Super Administrator", initials: "AU", color: "var(--role-admin)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
              <Search size={15} color="var(--stone)" />
              <input placeholder="Search by name or email…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="input" style={{ maxWidth: 200 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All roles</option>
              <option value="applicant">Applicant</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-primary">{u.name}</td>
                    <td className="text-stone">{u.email}</td>
                    <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                    <td>{u.joined}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View"><Eye size={13} /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Verify"><ShieldCheck size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Suspend"><Ban size={13} color="var(--rust)" /></button>
                      </div>
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
