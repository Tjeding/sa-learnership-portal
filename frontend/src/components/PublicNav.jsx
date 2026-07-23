import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function PublicNav() {
  return (
    <header className="public-nav">
      <Link to="/" className="public-nav-brand">
        <div className="sidebar-brand-mark" style={{ "--role-color": "var(--veld)", background: "var(--veld)", color: "#fff" }}>
          <Sprout size={20} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>SA Learnerships</div>
          <div style={{ fontSize: 11, color: "var(--stone)", letterSpacing: "0.03em", textTransform: "uppercase" }}>Skills Development Portal</div>
        </div>
      </Link>
      <nav className="public-nav-links">
        <Link to="/opportunities-preview">Opportunities</Link>
        <Link to="/#how-it-works">How it works</Link>
        <Link to="/#providers">For Providers</Link>
        <Link to="/#faq">FAQ</Link>
      </nav>
      <div className="public-nav-cta">
        <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
      </div>
    </header>
  );
}
