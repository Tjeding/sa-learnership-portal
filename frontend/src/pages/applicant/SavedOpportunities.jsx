import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { MapPin, Clock, Wallet, Bookmark } from "lucide-react";
import { opportunities, currentApplicant } from "../../data/mockData";

const savedIds = [2, 6, 8];

export default function SavedOpportunities() {
  const saved = opportunities.filter((o) => savedIds.includes(o.id));
  return (
    <>
      <Topbar
        eyebrow="Applicant" title="Saved Opportunities" subtitle="Listings you've bookmarked to apply to later."
        notifCount={3} msgCount={2}
        user={{ name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" }}
      />
      <div className="page">
        <div className="grid grid-3">
          {saved.map((o) => (
            <div key={o.id} className="opp-card">
              <div className="opp-card-top">
                <span className="badge badge-sun">{o.type}</span>
                <Bookmark size={16} color="var(--sun-deep)" fill="var(--sun-deep)" />
              </div>
              <div>
                <h4>{o.title}</h4>
                <p className="text-sm text-stone" style={{ marginTop: 4 }}>{o.provider} · {o.sector}</p>
              </div>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}</span>
                <span><Clock size={13} /> {o.duration} months</span>
                <span><Wallet size={13} /> R{o.stipend.toLocaleString()}/mo</span>
              </div>
              <Link to={`/applicant/opportunities/${o.id}`} className="btn btn-primary btn-sm">View &amp; Apply</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
