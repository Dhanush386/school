import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

/**
 * ProtectedRoute
 *
 * Guards application routes behind authentication and optional role checks.
 *
 * Behaviour
 * ─────────
 *   1. While auth state is loading (localStorage rehydration), show a full-screen spinner.
 *   2. If the user is not authenticated, redirect to /login.
 *   3. If the user must change their password, redirect to /change-password.
 *   4. If `allowedRoles` is provided and the user's role is not in it,
 *      redirect to /dashboard (graceful fallback).
 *   5. Otherwise render the child route content inside the shared Layout.
 *
 * @param {string[]} [allowedRoles] – optional whitelist of roles that may access this route
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // ── 1. Loading splash ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── 2. Not authenticated ───────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ── 3. Must change password ────────────────────────────────────────────────
  if (user?.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  // ── 4. Role check ──────────────────────────────────────────────────────────
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── 5. Render child routes inside the shared Layout ────────────────────────
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
