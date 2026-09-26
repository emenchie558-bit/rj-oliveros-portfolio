import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Mail, KeyRound, AlertCircle, ArrowLeft, 
  CheckCircle2, Smartphone, ShieldCheck, Eye, EyeOff 
} from 'lucide-react';
import { ADMIN_CONFIG, generateMfaCode, verifyMfaCode, createSession, logActivity } from '../../utils/security';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPortfolio: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPortfolio }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate Limiting / Brute-force protection
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return Number(sessionStorage.getItem('reiner_login_failures') || '0');
  });
  const [lockedUntil, setLockedUntil] = useState<number>(() => {
    return Number(sessionStorage.getItem('reiner_locked_until') || '0');
  });
  const [remainingLockSeconds, setRemainingLockSeconds] = useState<number>(0);

  // MFA State
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSentToast, setMfaSentToast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (lockedUntil > now) {
        setRemainingLockSeconds(Math.ceil((lockedUntil - now) / 1000));
      } else {
        setRemainingLockSeconds(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if account is temporarily locked
    if (Date.now() < lockedUntil) {
      setError(`Access locked due to multiple failed attempts. Please wait ${remainingLockSeconds} seconds.`);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === ADMIN_CONFIG.EMAIL.toLowerCase() && cleanPassword === ADMIN_CONFIG.PASSWORD) {
      // Reset failed counter on success
      sessionStorage.removeItem('reiner_login_failures');
      sessionStorage.removeItem('reiner_locked_until');
      setFailedAttempts(0);
      setLockedUntil(0);

      // Generate secure 6-digit MFA challenge
      generateMfaCode();
      setMfaStep(true);
      setMfaSentToast(true);
      logActivity('Admin Credentials Authenticated', `Primary authentication passed for ${cleanEmail}. MFA challenge issued.`, 'info');
    } else {
      const newFailures = failedAttempts + 1;
      setFailedAttempts(newFailures);
      sessionStorage.setItem('reiner_login_failures', String(newFailures));

      if (newFailures >= 5) {
        const lockDuration = 10 * 60 * 1000; // 10 minutes lock
        const lockTime = Date.now() + lockDuration;
        setLockedUntil(lockTime);
        sessionStorage.setItem('reiner_locked_until', String(lockTime));
        setError('Maximum login attempts exceeded. Portal is locked for 10 minutes for security.');
        logActivity('Security Lockout Triggered', `5 failed login attempts for email: ${cleanEmail}. Access restricted.`, 'warning');
      } else {
        setError(`Invalid administrative credentials. Attempt ${newFailures} of 5.`);
        logActivity('Failed Login Attempt', `Unauthorized login attempt with email: ${cleanEmail}`, 'warning');
      }
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verifyMfaCode(mfaCode)) {
      createSession(rememberMe);
      logActivity('Admin MFA Authenticated', 'Successful 2FA verification. Encrypted administrative session started.', 'success');
      onLoginSuccess();
    } else {
      setError('Invalid 6-digit verification code. Please check your email and try again.');
      logActivity('Failed MFA Verification', 'Invalid 2FA code entered.', 'warning');
    }
  };

  const isLocked = Date.now() < lockedUntil;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing ambiance */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-700/20 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6 z-10 flex items-center justify-between">
        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Protected Administrative Gateway</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="bg-stone-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-stone-800">
          
          {/* Logo & Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-stone-900 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-amber-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif-title font-bold text-white tracking-tight">
              Administrator Authentication
            </h2>
            <p className="text-xs text-stone-400">
              {mfaStep 
                ? 'Step 2: Enter Multi-Factor Authentication Code' 
                : 'Restricted administrative access only'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!mfaStep ? (
            /* STEP 1: Email & Password Form (NO PASSWORD HINTS OR EXPOSED PASSWORDS) */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={isLocked}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-stone-700 rounded-xl bg-stone-950 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Enter admin email address"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLocked}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-stone-700 rounded-xl bg-stone-950 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-700 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Keep session active</span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLocked}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLocked ? `Locked (${remainingLockSeconds}s)` : 'Authenticate'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Multi-Factor Authentication (MFA) */
            <form onSubmit={handleMfaSubmit} className="space-y-5 animate-in fade-in">
              {mfaSentToast && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <span className="font-bold block text-amber-400">Security Verification Sent</span>
                  <p className="text-[11px] text-stone-300">
                    A 6-digit confirmation code was sent to your registered administrative email address.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-10 pr-3 py-3 border border-stone-700 rounded-xl bg-stone-950 text-white text-base tracking-widest font-mono text-center placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="••••••"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <button
                  type="button"
                  onClick={() => {
                    generateMfaCode();
                    setMfaSentToast(true);
                  }}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setMfaStep(false)}
                  className="hover:underline text-[11px]"
                >
                  Back
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter Dashboard</span>
              </button>
            </form>
          )}

          {/* Security notice */}
          <div className="mt-8 pt-6 border-t border-stone-800 text-[11px] text-stone-500 text-center space-y-1">
            <p>Protected by 256-bit AES database encryption and rate-limited security barriers.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
