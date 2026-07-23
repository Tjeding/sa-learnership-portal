import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { Search, MapPin, Clock, Wallet, Lock } from "lucide-react";
import { opportunities, sectors } from "../../data/mockData";

export default function OpportunitiesPreview() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const results = useMemo(() => {
    return opportunities.filter((o) => o.status === "approved").filter((o) => {
      const matchesQ = !q || o.title.toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "all" || o.type === type;
      return matchesQ && matchesType;
    });
  }, [q, type]);

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
          </div>
        </div>

        <div className="grid grid-3">
          {results.map((o) => (
            <div key={o.id} className="opp-card">
              <span className="badge badge-sun">{o.type}</span>
              <h4>{o.title}</h4>
              <p className="text-sm text-stone">{o.provider} · {o.sector}</p>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}</span>
                <span><Clock size={13} /> {o.duration} months</span>
                <span><Wallet size={13} /> R{o.stipend.toLocaleString()}/mo</span>
              </div>
              <Link to="/register" className="btn btn-outline btn-sm"><Lock size={13} /> Log in to apply</Link>
            </div>
          ))}
        </div>
      </div>
      <div className="section" />
    </div>
  );
}
