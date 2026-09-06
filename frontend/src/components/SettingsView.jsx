import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import { useAuth } from "../context/AuthContext";
export default function SettingsView({ topbarProps }) {
  const { user } = useAuth();
  const base = `/${user?.role}`;
  return <><Topbar {...topbarProps} title="Account settings" subtitle="Your account and communication settings." /><div className="page"><div className="card" style={{ maxWidth: 640 }}><h3>Account details</h3><dl><dt>Email address</dt><dd>{user?.email}</dd><dt>Account type</dt><dd>{user?.role}</dd></dl><Link className="btn btn-primary" to={`${base}/profile`}>Edit profile</Link><hr className="divider" /><h3>Stay informed</h3><p className="text-stone">Read your account updates and manage conversations in your inbox.</p><div className="hero-cta"><Link className="btn btn-outline" to={`${base}/notifications`}>Notifications</Link><Link className="btn btn-outline" to={`${base}/messages`}>Messages</Link></div><hr className="divider" /><p className="text-sm text-stone">Email changes, password resets and notification delivery preferences are not available in the portal yet.</p></div></div></>;
}
