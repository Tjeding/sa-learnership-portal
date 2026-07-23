import { Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { Pathway } from "../../components/Widgets";
import {
  GraduationCap, Building2, ShieldCheck, ArrowRight, MapPin, Clock, Wallet,
  Sparkles, BellRing, LineChart,
} from "lucide-react";
import { opportunities } from "../../data/mockData";

export default function Landing() {
  const featured = opportunities.filter((o) => o.status === "approved").slice(0, 3);

  return (
    <div>
      <PublicNav />

      <section className="public-page hero">
        <div>
          <span className="eyebrow">SETA-aligned · NQF-mapped · Free for work-seekers</span>
          <h1 style={{ marginTop: 10 }}>Find the next step on your career pathway.</h1>
          <p className="lede">
            One place to discover learnerships, internships and apprenticeships across South Africa,
            track every application from received to accepted, and get matched by your real
            NQF-aligned skills — not guesswork.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">
              I'm looking for opportunities <ArrowRight size={16} />
            </Link>
            <Link to="/register?role=provider" className="btn btn-outline">
              I'm posting opportunities
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">1,024</div><div className="lbl">Registered providers</div></div>
            <div className="hero-stat"><div className="num">623</div><div className="lbl">Open opportunities</div></div>
            <div className="hero-stat"><div className="num">1,256</div><div className="lbl">Placements this year</div></div>
          </div>
        </div>

        <div className="journey-card">
          <div className="card-header">
            <span className="card-title">Your application journey</span>
            <span className="badge badge-veld"><span className="badge-dot" />Live example</span>
          </div>
          <p className="text-sm text-stone" style={{ marginBottom: 18 }}>
            Software Development Learnership · ABC Training Institute
          </p>
          <Pathway status="shortlisted" />
          <hr className="divider" />
          <div className="grid grid-2" style={{ gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Sparkles size={18} color="var(--sun-deep)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>92% skill match</div>
                <div className="text-sm text-stone">Based on your profile</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <BellRing size={18} color="var(--veld)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Notified instantly</div>
                <div className="text-sm text-stone">At every stage change</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-page section" id="how-it-works">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three portals, one shared pipeline.</h2>
          <p>Work-seekers, employers and training providers, and administrators each get a purpose-built
            dashboard — all reading from the same NQF-aligned opportunity and application data.</p>
        </div>
        <div className="role-cards">
          <div className="role-card">
            <div className="mark" style={{ background: "var(--veld-tint)", color: "var(--veld-deep)" }}>
              <GraduationCap size={22} />
            </div>
            <h3>Applicants</h3>
            <p>Build one NQF-aligned profile, apply to multiple opportunities, and track every
              application on a single status pathway.</p>
            <Link to="/applicant" className="card-link">Preview applicant dashboard →</Link>
          </div>
          <div className="role-card">
            <div className="mark" style={{ background: "var(--sun-tint)", color: "var(--sun-deep)" }}>
              <Building2 size={22} />
            </div>
            <h3>Providers</h3>
            <p>Post learnerships, internships and apprenticeships, review applicants against real
              qualifications, and shortlist in a few clicks.</p>
            <Link to="/provider" className="card-link">Preview provider dashboard →</Link>
          </div>
          <div className="role-card">
            <div className="mark" style={{ background: "#eeeaf6", color: "var(--role-admin)" }}>
              <ShieldCheck size={22} />
            </div>
            <h3>Admins</h3>
            <p>Approve listings, verify providers, curate the NQF reference data, and export
              placement analytics for reporting.</p>
            <Link to="/admin" className="card-link">Preview admin console →</Link>
          </div>
        </div>
      </section>

      <section className="public-page section" id="opportunities">
        <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "none" }}>
          <div>
            <span className="eyebrow">Fresh this week</span>
            <h2>Featured opportunities</h2>
          </div>
          <Link to="/opportunities-preview" className="btn btn-outline btn-sm">Browse all opportunities</Link>
        </div>
        <div className="grid grid-3">
          {featured.map((o) => (
            <Link to="/opportunities-preview" key={o.id} className="opp-card">
              <div className="opp-card-top">
                <div>
                  <span className="badge badge-sun" style={{ marginBottom: 8 }}>{o.type}</span>
                  <h4>{o.title}</h4>
                </div>
              </div>
              <p className="text-sm text-stone">{o.provider} · {o.sector}</p>
              <div className="opp-meta">
                <span><MapPin size={13} /> {o.location}</span>
                <span><Clock size={13} /> {o.duration} months</span>
                <span><Wallet size={13} /> R{o.stipend.toLocaleString()}/mo</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="public-page section" id="providers">
        <div className="grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow">For employers &amp; training providers</span>
            <h2 style={{ fontSize: 30, marginTop: 10 }}>Reach the right candidates, faster.</h2>
            <p className="text-stone" style={{ marginTop: 14, lineHeight: 1.6 }}>
              Post a listing once and it's matched against applicant profiles by NQF level and
              tagged skills. Review, shortlist and message candidates without leaving the portal,
              and export placement reports for your SETA submissions.
            </p>
            <Link to="/register?role=provider" className="btn btn-gold" style={{ marginTop: 20 }}>
              Register your organisation
            </Link>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">What providers get</span></div>
            <ul className="list-plain">
              <li style={{ display: "flex", gap: 12 }}><LineChart size={18} color="var(--veld)" /> Application volume &amp; placement analytics</li>
              <li style={{ display: "flex", gap: 12 }}><ShieldCheck size={18} color="var(--veld)" /> Admin-verified, SETA-aligned applicant profiles</li>
              <li style={{ display: "flex", gap: 12 }}><Sparkles size={18} color="var(--veld)" /> AI-assisted candidate matching by skill overlap</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="public-page section" id="faq">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Good to know</h2>
        </div>
        <div className="grid grid-2">
          {[
            ["Is it free for work-seekers?", "Yes — creating a profile, applying to opportunities and tracking applications is always free for applicants."],
            ["How are qualifications verified?", "Qualification types and NQF levels are sourced from SAQA's registered qualifications data, and admins verify uploaded certificates."],
            ["Can I apply to more than one opportunity?", "Yes, you can apply to as many open opportunities as you qualify for and track each one separately."],
            ["How does matching work?", "Your tagged skills and NQF level are compared against each opportunity's stated requirements to produce a match score."],
          ].map(([q, a]) => (
            <div className="card" key={q}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{q}</div>
              <p className="text-sm text-stone" style={{ lineHeight: 1.6 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="public-page">
          <div className="footer-grid">
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 10 }}>SA Learnerships</div>
              <p style={{ maxWidth: "32ch" }}>Connecting work-seekers with SETA-accredited learnerships, internships and apprenticeships across South Africa.</p>
            </div>
            <div>
              <h5>Platform</h5>
              <ul className="footer-links">
                <li><Link to="/opportunities-preview">Opportunities</Link></li>
                <li><Link to="/register">Create account</Link></li>
                <li><Link to="/login">Log in</Link></li>
              </ul>
            </div>
            <div>
              <h5>Reference data</h5>
              <ul className="footer-links">
                <li><a href="https://www.saqa.org.za/level-descriptors-for-the-south-african-national-qualifications-framework/">NQF level descriptors (SAQA)</a></li>
                <li><a href="https://allqs.saqa.org.za/search.php">Registered qualifications (NLRD)</a></li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul className="footer-links">
                <li><a href="#how-it-works">How it works</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SA Learnerships &amp; Skills Development Portal. Student project prototype.</span>
            <span>Built with Spring Boot &amp; PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
