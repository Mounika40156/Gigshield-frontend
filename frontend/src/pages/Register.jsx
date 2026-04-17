import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { registerUser as apiRegister } from '../services/api';

const STEPS = ['Personal Info', 'Work Details', 'Verification', 'Risk Profile'];
const PLATFORMS = ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Amazon Flex', 'Flipkart'];
const CITIES = ['Mumbai', 'Delhi', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

// ── SVG Icon Components ──────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IndianRupeeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8L15 13H6" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const NavigationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const IdCardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="12" r="2" /><path d="M14 9h4M14 12h4M14 15h2" />
  </svg>
);

const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 14v2M16 14v2" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: 'spin 0.8s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
// ────────────────────────────────────────────────────────────────────────────

// Reusable input with left icon
function InputWithIcon({ icon, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 10, top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-text-secondary, #888)',
        display: 'flex', alignItems: 'center', pointerEvents: 'none',
      }}>
        {icon}
      </span>
      <input {...props} style={{ ...(props.style || {}), paddingLeft: 34 }} />
    </div>
  );
}

// Verification row card
function VerifyCard({ icon, title, verified, verifiedLabel = 'Verified', children }) {
  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface2)',
      borderRadius: 10,
      border: verified
        ? '1px solid var(--color-success-border, #a5d6a7)'
        : '1px solid var(--border)',
      marginBottom: 14,
      transition: 'border-color 0.2s',
    }}>
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-8" style={{ color: 'var(--color-text-primary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', color: verified ? 'var(--color-success-text, #2e7d32)' : 'var(--color-text-secondary)' }}>
            {icon}
          </span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{title}</span>
        </div>
        {verified && (
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CheckIcon size={10} /> {verifiedLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { setUser, calculateRiskProfile } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [gpsOk, setGpsOk] = useState(false);
  const [riskProfile, setRiskProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', platform: '', city: '', vehicleType: 'Bike', dailyEarnings: '', partnerIdFile: null, otp: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const sendOtp = () => { setLoading(true); setTimeout(() => { setOtpSent(true); setLoading(false); }, 1200); };
  const verifyOtp = () => {
    if (form.otp !== '1234') { alert('Invalid OTP. Use 1234 for demo.'); return; }
    setLoading(true);
    setTimeout(() => { setOtpVerified(true); setLoading(false); }, 900);
  };
  const captureGps = () => {
    setLoading(true);
    if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(() => { setGpsOk(true); setLoading(false); }, () => { setGpsOk(true); setLoading(false); }); }
    else setTimeout(() => { setGpsOk(true); setLoading(false); }, 1200);
  };

  const next = async () => {
    if (step === 2) {
      setLoading(true);
      const risk = await calculateRiskProfile(form.city, form.platform, form.dailyEarnings);
      setRiskProfile(risk);
      setLoading(false);
    }
    setStep(s => s + 1);
  };

  const finish = async () => {
    setLoading(true);
    const result = await apiRegister(form);
    let newUser;
    if (result && !result.error) {
      newUser = { ...form, id: result.id, registeredAt: result.registered_at, trustScore: result.trust_score ?? 42, riskProfile: result.risk_profile ?? riskProfile };
    } else {
      newUser = { ...form, id: `GS-${Date.now()}`, registeredAt: new Date().toISOString(), trustScore: 42, riskProfile };
    }
    localStorage.setItem('gs_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    navigate('/policy');
  };

  const canNext = () => {
    if (step === 0) return form.name && form.phone && form.email;
    if (step === 1) return form.platform && form.city && form.dailyEarnings;
    if (step === 2) return otpVerified && gpsOk && form.partnerIdFile;
    return true;
  };

  const riskColor = riskProfile?.zone === 'HIGH' ? 'var(--red)' : riskProfile?.zone === 'MEDIUM' ? 'var(--yellow)' : 'var(--green)';

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="auth-page">
        <div className="auth-wrap fade-up">

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-mark"><ShieldIcon /></div>
            <span className="auth-logo-name">GigShield</span>
          </div>

          {/* Step indicator */}
          <div className="step-row">
            {STEPS.map((label, i) => (
              <React.Fragment key={i}>
                <div className="step-item">
                  <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    {i < step ? <CheckIcon size={12} /> : i + 1}
                  </div>
                  {i === step && <span className="step-text active">{label}</span>}
                </div>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="card">
            <div className="mb-20">
              <h2 style={{ fontSize: 18, marginBottom: 3 }}>{STEPS[step]}</h2>
              <p className="text-sm text-2">
                {step === 0 && 'Enter your basic details to create your account'}
                {step === 1 && 'Tell us about your delivery work so we can calculate your risk'}
                {step === 2 && 'Verify your identity — this prevents fraud and protects everyone'}
                {step === 3 && 'Your personalised AI risk profile based on location and platform data'}
              </p>
            </div>

            {/* ── Step 0: Personal Info ── */}
            {step === 0 && (<>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <InputWithIcon icon={<UserIcon />} className="form-input" placeholder="e.g. Arjun Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <InputWithIcon icon={<PhoneIcon />} className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <InputWithIcon icon={<MailIcon />} className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </>)}

            {/* ── Step 1: Work Details ── */}
            {step === 1 && (<>
              <div className="form-group">
                <label className="form-label">Delivery Platform</label>
                <select className="form-select" value={form.platform} onChange={e => set('platform', e.target.value)}>
                  <option value="">Select your platform</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your City</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #888)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <MapPinIcon />
                  </span>
                  <select className="form-select" value={form.city} onChange={e => set('city', e.target.value)} style={{ paddingLeft: 34 }}>
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Vehicle</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #888)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                      <TruckIcon />
                    </span>
                    <select className="form-select" value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)} style={{ paddingLeft: 34 }}>
                      <option>Bike</option><option>Auto</option><option>Scooter</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Avg Daily Earnings (₹)</label>
                  <InputWithIcon icon={<IndianRupeeIcon />} className="form-input" type="number" placeholder="800" value={form.dailyEarnings} onChange={e => set('dailyEarnings', e.target.value)} />
                </div>
              </div>
            </>)}

            {/* ── Step 2: Verification ── */}
            {step === 2 && (<>
              {/* OTP */}
              <VerifyCard icon={<SmartphoneIcon />} title="OTP Verification" verified={otpVerified}>
                {!otpVerified && (!otpSent
                  ? <button className="btn btn-outline btn-sm w-full" onClick={sendOtp} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {loading ? <SpinnerIcon /> : <SmartphoneIcon />}
                    Send OTP to {form.phone || 'your number'}
                  </button>
                  : <div className="flex gap-8">
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}><LockIcon /></span>
                      <input className="form-input" placeholder="4-digit OTP" maxLength={4} value={form.otp} onChange={e => set('otp', e.target.value)} style={{ paddingLeft: 32 }} />
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={verifyOtp} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {loading ? <SpinnerIcon /> : <CheckIcon size={13} />} Verify
                    </button>
                  </div>
                )}
              </VerifyCard>

              {/* GPS */}
              <VerifyCard icon={<NavigationIcon />} title="GPS Validation" verified={gpsOk} verifiedLabel="Captured">
                {!gpsOk
                  ? <button className="btn btn-outline btn-sm w-full" onClick={captureGps} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {loading ? <SpinnerIcon /> : <NavigationIcon />}
                    Capture My Location
                  </button>
                  : <p className="text-sm text-2" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPinIcon /> Zone registered: {form.city} Metro Area
                  </p>}
              </VerifyCard>

              {/* Partner ID */}
              <VerifyCard icon={<IdCardIcon />} title="Partner ID Upload" verified={!!form.partnerIdFile} verifiedLabel="Uploaded">
                <p className="text-sm text-2 mb-12">Upload your {form.platform || 'platform'} partner ID card or onboarding letter</p>
                <input type="file" accept="image/*,.pdf" onChange={e => set('partnerIdFile', e.target.files[0]?.name || null)} style={{ display: 'none' }} id="pidInput" />
                <label htmlFor="pidInput" className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FileIcon /> Choose File
                </label>
                {form.partnerIdFile && <span className="text-sm text-2" style={{ marginLeft: 10 }}>{form.partnerIdFile}</span>}
              </VerifyCard>
            </>)}

            {/* ── Step 3: Risk Profile ── */}
            {step === 3 && riskProfile && (<>
              <div className="alert alert-blue mb-20">
                <span className="alert-icon" style={{ display: 'flex', alignItems: 'center' }}><BotIcon /></span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>AI Risk Assessment Complete</div>
                  <div className="text-sm text-2">Based on your city, platform, and 12-month IMD weather data</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${riskColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: riskColor, lineHeight: 1 }}>{riskProfile.score}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)' }}>/ 100</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: riskColor }}>{riskProfile.zone} RISK ZONE</div>
                  <div className="text-sm text-2 mt-4">{form.city} · {form.platform}</div>
                  <div className="text-sm text-2 mt-4">Risk multiplier: <strong>×{riskProfile.multiplier.toFixed(2)}</strong></div>
                </div>
              </div>
              <div style={{ padding: '14px 16px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-8">
                  <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheckIcon /> Initial Trust Score</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 13 }}>42 / 100</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: '42%' }} /></div>
                <p className="text-xs text-3 mt-8">Grows automatically as we verify your delivery activity over 3–4 weeks</p>
              </div>
            </>)}

            {/* ── Navigation ── */}
            <div className="flex justify-between mt-20">
              {step > 0
                ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ArrowLeftIcon /> Back</button>
                : <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ArrowLeftIcon /> Home</button>}
              {step < STEPS.length - 1
                ? <button className="btn btn-primary" onClick={next} disabled={!canNext()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {loading ? <SpinnerIcon /> : null} Continue <ArrowRightIcon />
                </button>
                : <button className="btn btn-primary" onClick={finish} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {loading ? <SpinnerIcon /> : <ShieldCheckIcon />} Activate Coverage
                </button>}
            </div>
          </div>

          <p className="text-center text-sm text-2 mt-16">
            Already registered?{' '}
            <span style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Login here</span>
          </p>
        </div>
      </div>
    </>
  );
}