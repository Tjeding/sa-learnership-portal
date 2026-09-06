import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function NotFound() {
  const { user } = useAuth();
  return <main className="page"><div className="card empty-state"><h1>Page not found</h1><p>The page may have moved or the address may be incorrect.</p><Link className="btn btn-primary" to={user ? `/${user.role}` : "/"}>{user ? "Back to dashboard" : "Back to home"}</Link></div></main>;
}
