import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser as apiLogin } from '../services/api';

// ── Inline SVG icons (no emoji) ──────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloudRainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16" y1="13" x2="16" y2="21" />
    <line x1="8" y1="13" x2="8" y2="21" />
    <line x1="12" y1="15" x2="12" y2="23" />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: 'spin 0.8s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);
// ────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [form, setForm] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const sendOtp = () => {
    if (!form.phone) { setError('Please enter your registered mobile number.'); return; }
    setLoading(true);
    setTimeout(() => { setOtpSent(true); setLoading(false); }, 1200);
  };

  const login = async () => {
    if (!form.otp || form.otp !== '1234') {
      setError('Invalid OTP. Use 1234 for demo.');
      return;
    }
    setLoading(true);

    const result = await apiLogin(form.phone, form.otp);

    if (result && !result.error) {
      const userData = {
        id: result.id,
        name: result.name,
        phone: result.phone,
        email: result.email,
        city: result.city,
        platform: result.platform,
        vehicleType: result.vehicle_type ?? 'Bike',
        dailyEarnings: result.daily_earnings ?? 800,
        registeredAt: result.registered_at,
        trustScore: result.trust_score ?? 42,
        riskProfile: result.risk_profile,
      };
      localStorage.setItem('gs_user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem('gs_user'));
      if (saved && (saved.phone === form.phone || form.phone.replace(/\s/g, '').endsWith(saved.phone?.slice(-10)))) {
        setUser(saved);
        navigate('/dashboard');
      } else {
        setError(result?.error || 'No account found for this number. Please register first.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="auth-page">
        <div className="auth-wrap fade-up" style={{ maxWidth: 420 }}>

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <ShieldIcon />
            </div>
            <span className="auth-logo-name">GigShield</span>
          </div>

          <div className="card">
            <div className="mb-20">
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>Welcome back</h2>
              <p className="text-sm text-2">Login with your registered mobile number</p>
            </div>

            {/* Weather Auto-Pay Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--color-success-bg, #e8f5e9)',
              border: '1px solid var(--color-success-border, #a5d6a7)',
              marginBottom: 16,
              color: 'var(--color-success-text, #2e7d32)',
            }}>
              <span style={{ marginTop: 1, flexShrink: 0 }}><CloudRainIcon /></span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                  Auto Weather Pay Active
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>
                  If extreme weather is detected in your area (heavy rain, storms, heatwaves),
                  compensation is automatically credited to your account — no manual claim required.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary, #888)',
                  display: 'flex', alignItems: 'center',
                }}>
                  <PhoneIcon />
                </span>
                <input
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  disabled={otpSent}
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>

            {/* OTP */}
            {otpSent && (
              <div className="form-group fade-up">
                <label className="form-label">One-Time Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 10, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-secondary, #888)',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <LockIcon />
                  </span>
                  <input
                    className="form-input"
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    value={form.otp}
                    onChange={e => set('otp', e.target.value)}
                    autoFocus
                    style={{ paddingLeft: 34 }}
                  />
                </div>
                <div className="text-xs text-3 mt-4">
                  OTP sent to {form.phone}.{' '}
                  <span
                    style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => { setOtpSent(false); setForm(p => ({ ...p, otp: '' })); }}
                  >
                    Change number?
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="alert alert-red mb-16 fade-up">
                <span className="alert-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <AlertIcon />
                </span>
                <span style={{ fontSize: 13 }}>{error}</span>
              </div>
            )}

            {/* CTA */}
            {!otpSent ? (
              <button className="btn btn-primary w-full btn-lg" onClick={sendOtp} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <SpinnerIcon /> : <ArrowRightIcon />}
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            ) : (
              <button className="btn btn-primary w-full btn-lg" onClick={login} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <SpinnerIcon /> : <ArrowRightIcon />}
                {loading ? 'Logging in…' : 'Login to Dashboard'}
              </button>
            )}

            <div className="divider" />

            <p className="text-center text-sm text-2">
              New to GigShield?{' '}
              <span
                style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/register')}
              >
                Create an account
              </span>
            </p>
          </div>

          <p className="text-center text-xs text-3 mt-16">
            <span
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              onClick={() => navigate('/')}
            >
              <ChevronLeftIcon /> Back to Home
            </span>
          </p>
        </div>
      </div>
    </>
  );
}