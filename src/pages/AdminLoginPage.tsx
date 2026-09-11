/**
 * AdminLoginPage — /admin/login
 *
 * Staff-only login and registration page.
 * - Login:    username + password
 * - Register: username + password (creates account with role='user';
 *             a current admin must promote to 'admin' if needed)
 *
 * After successful login the user is redirected to the page they
 * originally tried to reach (or /admin/stock as default).
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

type Mode = 'login' | 'register';

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const PASSWORD_RE = /^.{8,}$/;

const AdminLoginPage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { signInWithUsername, signUpWithUsername } = useAuth();

  const from = (location.state as { from?: string })?.from ?? '/admin/stock';

  const [mode, setMode]               = useState<Mode>('login');
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [busy, setBusy]               = useState(false);
  const [registered, setRegistered]   = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────
  const usernameErr = username && !USERNAME_RE.test(username)
    ? 'Letters, digits and _ only, 3–30 characters'
    : '';
  const passwordErr = password && !PASSWORD_RE.test(password)
    ? 'Minimum 8 characters'
    : '';
  const confirmErr  = mode === 'register' && confirmPw && confirmPw !== password
    ? 'Passwords do not match'
    : '';

  const canSubmit =
    USERNAME_RE.test(username) &&
    PASSWORD_RE.test(password) &&
    (mode === 'login' || (confirmPw === password && agreed)) &&
    !busy;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);

    if (mode === 'login') {
      const { error } = await signInWithUsername(username.trim(), password);
      if (error) {
        toast.error(error.message ?? 'Login failed — check your credentials.');
        setBusy(false);
        return;
      }
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      const { error } = await signUpWithUsername(username.trim(), password);
      if (error) {
        toast.error(error.message ?? 'Registration failed — try a different username.');
        setBusy(false);
        return;
      }
      setRegistered(true);
      toast.success('Account created! An admin will grant you access shortly.');
      setBusy(false);
    }
  };

  // ── Post-registration success state ────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h2 className="text-xl font-extrabold">Registration Submitted</h2>
          <p className="text-muted-foreground text-sm">
            Your account <strong className="text-foreground font-mono">{username}</strong> has been created with
            standard access. Contact an existing admin at{' '}
            <a href="mailto:sales@c-hear.co.uk" className="text-primary hover:underline">sales@c-hear.co.uk</a>{' '}
            to have your access level upgraded.
          </p>
          <button
            onClick={() => { setRegistered(false); setMode('login'); setPassword(''); setConfirmPw(''); }}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In Now
          </button>
          <Link to="/" className="text-xs text-muted-foreground hover:underline">← Return to website</Link>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Staff Login — C-Hear Technologies Portal</title>
        <meta name="description" content="Staff-only login portal for C-Hear Technologies. Access quote builder, invoice builder and stock management tools." />
        <meta name="keywords" content="staff login, admin portal, C-Hear staff" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <Link to="/">
            <img
              src="/assets/logo/chear-logo.png"
              alt="C Hear Technologies"
              className="h-12 mx-auto mb-4 object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-2 bg-brand-black text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <ShieldCheck size={12} /> Staff Portal
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Staff Sign In' : 'Request Staff Access'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === 'login'
              ? 'Sign in to access stock, quote and invoice tools.'
              : 'Create a staff account — an admin will approve your access level.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm">

          {/* Mode tabs */}
          <div className="flex border-b border-border">
            {(['login', 'register'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setPassword(''); setConfirmPw(''); setAgreed(false); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-background"
                  required
                />
              </div>
              {usernameErr && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} /> {usernameErr}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
                  className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-background"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordErr && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} /> {passwordErr}</p>
              )}
            </div>

            {/* Confirm password — register only */}
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-background"
                    required
                  />
                </div>
                {confirmErr && (
                  <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} /> {confirmErr}</p>
                )}
              </div>
            )}

            {/* Agreement — register only */}
            {mode === 'register' && (
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-primary shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <span className="text-primary underline cursor-pointer">User Agreement</span>
                  {' '}and{' '}
                  <span className="text-primary underline cursor-pointer">Privacy Policy</span>
                  {' '}of C Hear Technologies Limited.
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {busy ? (
                <span className="animate-pulse">
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                <>{mode === 'login' ? <><Lock size={14} /> Sign In</> : <><ShieldCheck size={14} /> Request Access</>}</>
              )}
            </button>

            {/* Info banner (register) */}
            {mode === 'register' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 flex gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  New accounts start with <strong>user</strong> access.
                  An existing admin must elevate your role to grant full staff access to stock, quote and invoice tools.
                </span>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline text-primary">← Return to C Hear Technologies website</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
