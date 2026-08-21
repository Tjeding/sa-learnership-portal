import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { Search, MapPin, Clock, Wallet, Lock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function OpportunitiesPreview() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [sector, setSector] = useState("all");
  const [loading, setLoading] = useState(true);

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
    return opportunities.filter((o) => o.status === "approved").filter((o) => {
      const matchesQ = !q || o.title.toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "all" || o.opportunityType === type;
      const matchesSector = sector === "all" || o.sectorName === sector;
      return matchesQ && matchesType && matchesSector;
    });
  }, [q, type, sector, opportunities]);

  return (
    <div>
      <PublicNav />
      <div className="public-page section" style={{ paddingBottom: 0 }}>
        <div className="section-head">
          <span className="eyebrow">Open now</span>
          <h2>Browse opportunities</h2>
          <p>Create a free account to apply, save listings, and get matched by your skills and NQF level.</p>
        </div>
        <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="search-bar" style={{ flex: 2, minWidth: 220 }}>
              <Search size={16} color="var(--stone)" />
              <input placeholder="Search opportunities…" value={q} onChange={(e) => setQ(e.target.value)} />
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
          </div>
        </div>

        <div className="grid grid-3">
          {loading && <p className="text-sm text-stone" style={{ gridColumn: "1 / -1" }}>Loading…</p>}
          {!loading && results.map((o) => (
            <div key={o.id} className="opp-card">
              <span className="badge badge-sun">{o.opportunityType}</span>
              <h4>{o.title}</h4>
              <p className="text-sm text-stone">{o.providerName} · {o.sectorName}</p>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}</span>
                <span><Clock size={13} /> {o.durationMonths} months</span>
                <span><Wallet size={13} /> {o.stipendAmount ? `R${Number(o.stipendAmount).toLocaleString()}/mo` : "Unpaid"}</span>
              </div>
              <Link to="/register" className="btn btn-outline btn-sm"><Lock size={13} /> Log in to apply</Link>
            </div>
          ))}
          {!loading && !results.length && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <h3>No opportunities match your search</h3>
              <p>Try broadening your filters.</p>
            </div>
          )}
        </div>
      </div>
      <div className="section" />
    </div>
  );
}
