import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guard for protected routes (applicant/provider/admin portals).
 *
 * - If no access token is found in localStorage, redirect to /login.
 * - If a `requiredRole` is specified and the stored user's role doesn't
 *   match, redirect to the correct portal for their actual role.
 */
export default function ProtectedRoute({ requiredRole }) {
  const { user } = useAuth();

  const token = localStorage.getItem("accessToken");
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Send the user to the portal that matches their actual role
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}

/**
 * Guard for public-only routes (login/register pages).
 * If the user is already authenticated, redirect them to their portal.
 */
export function PublicOnlyRoute() {
  const { user } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (token && user?.role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}
