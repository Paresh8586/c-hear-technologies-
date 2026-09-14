/**
 * AdminGuard
 *
 * Wraps any route that requires staff authentication.
 * - Not logged in  → redirect to /admin/login
 * - Logged in but role !== 'admin' → show "Access Pending" screen (not a hard
 *   redirect, so staff can see why they are blocked and who to contact)
 * - Admin → render children
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldX, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ── Not authenticated ────────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // ── Authenticated but not admin ──────────────────────────────────────────
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4">
          <div className="bg-amber-100 rounded-full p-4">
            <ShieldX size={36} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-extrabold">Access Pending</h2>
          <p className="text-muted-foreground text-sm">
            Your account <strong className="text-foreground font-mono">{profile?.username ?? user.email}</strong> is
            registered but does not yet have admin access. Please contact the C Hear Technologies team
            to have your role upgraded.
          </p>
          <a
            href="mailto:sales@c-hear.online?subject=Staff%20Portal%20Access%20Request"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Mail size={14} /> Email sales@c-hear.online
          </a>
          <button
            onClick={() => window.location.href = '/'}
            className="text-xs text-muted-foreground hover:underline"
          >
            ← Return to website
          </button>
        </div>
      </div>
    );
  }

  // ── Admin — grant access ─────────────────────────────────────────────────
  return <>{children}</>;
};

export default AdminGuard;
