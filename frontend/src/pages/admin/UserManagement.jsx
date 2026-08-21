import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import { StatusBadge } from "../../components/Widgets";
import { Search, ShieldCheck, Ban, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function UserManagement() {
  const { topbarUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/users`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body?.error?.message || "Failed to load users.");
        setUsers(body.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const role = (u.role || "").toLowerCase();
    const name = (u.displayName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return (roleFilter === "all" || role === roleFilter) &&
      (name.includes(q.toLowerCase()) || email.includes(q.toLowerCase()));
  });

  return (
    <>
      <Topbar
        eyebrow="Admin" title="User Management" subtitle="Manage applicants, providers and administrators."
        notifCount={2} msgCount={0}
        user={topbarUser || { name: "Admin", role: "Administrator", initials: "?", color: "var(--role-admin)" }}
      />
      <div className="page">
        {error && <div style={{ background: "#fdecea", color: "#a32424", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16 }}>{error}</div>}
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
                {loading && <tr><td colSpan={6}><p className="text-sm text-stone">Loading…</p></td></tr>}
                {!loading && filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-primary">{u.displayName}</td>
                    <td className="text-stone">{u.email}</td>
                    <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                    <td><StatusBadge status={u.active ? "active" : u.verified ? "active" : "pending"} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="View"><Eye size={13} /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Verify"><ShieldCheck size={13} color="var(--veld)" /></button>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Suspend"><Ban size={13} color="var(--rust)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6}><div className="empty-state"><h3>No users found</h3></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
