import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { Search, MapPin, Clock, Wallet, Bookmark, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function FindOpportunities() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [sector, setSector] = useState("all");
  const [sectors, setSectors] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { topbarUser } = useAuth();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/opportunities`).then((r) => r.json()),
      fetch(`${API_URL}/api/v1/reference/sectors`).then((r) => r.json()),
    ]).then(([opps, sec]) => {
      if (opps.success) setOpportunities(opps.data);
      if (sec.success) setSectors(sec.data);
    }).finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    return opportunities.filter((o) => {
      const matchesQ = !q || o.title.toLowerCase().includes(q.toLowerCase()) || (o.providerName || "").toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "all" || o.opportunityType === type;
      const matchesSector = sector === "all" || o.sectorName === sector;
      return matchesQ && matchesType && matchesSector;
    });
  }, [q, type, sector, opportunities]);

  return (
    <>
      <Topbar
        eyebrow="Applicant"
        title="Find Opportunities"
        subtitle={loading ? "Loading…" : `${results.length} open listings match your filters`}
        user={topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" }}
      />
      <div className="page">
        <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="search-bar" style={{ flex: 2, minWidth: 220 }}>
              <Search size={16} color="var(--stone)" />
              <input placeholder="Search by title or provider…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="input" style={{ maxWidth: 200 }} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              <option value="learnership">Learnership</option>
              <option value="internship">Internship</option>
              <option value="apprenticeship">Apprenticeship</option>
            </select>
            <select className="input" style={{ maxWidth: 220 }} value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="all">All sectors</option>
              {sectors.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <button className="btn btn-outline"><SlidersHorizontal size={15} /> More filters</button>
          </div>
        </div>

        <div className="grid grid-3">
          {results.map((o) => (
            <div key={o.id} className="opp-card">
              <div className="opp-card-top">
                <span className="badge badge-sun">{o.opportunityType}</span>
                <button className="icon-btn" style={{ width: 32, height: 32 }} aria-label="Save"><Bookmark size={14} /></button>
              </div>
              <div>
                <h4>{o.title}</h4>
                <p className="text-sm text-stone" style={{ marginTop: 4 }}>{o.providerName} · {o.sectorName}</p>
              </div>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}, {o.province}</span>
                <span><Clock size={13} /> {o.durationMonths} months</span>
                <span><Wallet size={13} /> {o.stipendAmount ? `R${Number(o.stipendAmount).toLocaleString()}/${o.stipendPeriod}` : "Unpaid"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span className="text-sm text-stone">Closes {o.closingDate}</span>
                <Link to={`/applicant/opportunities/${o.id}`} className="btn btn-primary btn-sm">View &amp; Apply</Link>
              </div>
            </div>
          ))}
          {!loading && results.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <h3>No opportunities match your filters</h3>
              <p>Try broadening your search or clearing a filter.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}