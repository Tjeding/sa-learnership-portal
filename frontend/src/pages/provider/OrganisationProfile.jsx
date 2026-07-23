import Topbar from "../../components/Topbar";
import { ShieldCheck, Globe, MapPin } from "lucide-react";
import { sectors } from "../../data/mockData";

export default function OrganisationProfile() {
  return (
    <>
      <Topbar
        eyebrow="Provider" title="Organisation Profile" subtitle="This information appears on all your opportunity listings."
        notifCount={3} msgCount={4}
        user={{ name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" }}
      />
      <div className="page">
        <div className="grid grid-2-1">
          <div className="card">
            <div className="card-header"><span className="card-title">Organisation details</span></div>
            <div className="field"><label>Organisation name</label><input className="input" defaultValue="Tech Solutions SA" /></div>
            <div className="field-row">
              <div className="field"><label>Provider type</label><select className="input"><option>Employer</option><option selected>Training provider</option><option>Both</option></select></div>
              <div className="field"><label>Sector</label><select className="input">{sectors.map((s) => <option key={s} selected={s === "Information Technology"}>{s}</option>)}</select></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Registration number</label><input className="input" defaultValue="2019/123456/07" /></div>
              <div className="field"><label>SETA accreditation number</label><input className="input" defaultValue="MICT-SETA-4471" /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Contact person</label><input className="input" defaultValue="Thabo Ndlovu" /></div>
              <div className="field"><label>Phone</label><input className="input" defaultValue="012 345 6789" /></div>
            </div>
            <div className="field"><label>Website</label><input className="input" defaultValue="https://techsolutions.co.za" /></div>
            <div className="field-row">
              <div className="field"><label>Province</label><input className="input" defaultValue="Gauteng" /></div>
              <div className="field"><label>Town / City</label><input className="input" defaultValue="Pretoria" /></div>
            </div>
            <button className="btn btn-primary">Save changes</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div className="avatar" style={{ background: "var(--sun-deep)", width: 64, height: 64, margin: "0 auto 12px", fontSize: 20 }}>TS</div>
              <div style={{ fontWeight: 700 }}>Tech Solutions SA</div>
              <span className="badge badge-veld" style={{ marginTop: 8 }}><ShieldCheck size={12} /> Verified provider</span>
            </div>
            <div className="card">
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}><Globe size={16} color="var(--stone)" /> <span className="text-sm">techsolutions.co.za</span></div>
              <div style={{ display: "flex", gap: 10 }}><MapPin size={16} color="var(--stone)" /> <span className="text-sm">Pretoria, Gauteng</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
