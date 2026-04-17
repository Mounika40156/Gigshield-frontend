import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';

export default function Claims() {
  const navigate = useNavigate();
  const {
    user, policy, claims,
    addClaim, blockClaim, runFraudCheck,
    activeTrigger, autoClaim,
    refreshAllData, platformData, floodData,
    FAKE_WORKERS_DB,
  } = useApp();

  const [fraudSteps,    setFraudSteps]    = useState([]);
  const [fraudStep,     setFraudStep]     = useState(-1);
  const [fraudDone,     setFraudDone]     = useState(false);
  const [fraudPassed,   setFraudPassed]   = useState(null);
  const [processing,    setProcessing]    = useState(false);
  const [latestClaim,   setLatestClaim]   = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [demoWorker,    setDemoWorker]    = useState(null);

  useEffect(() => {
    if (!user) { navigate('/register'); return; }
    setLoading(true);
    refreshAllData(user.city, user.platform).finally(() => setLoading(false));
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (autoClaim && !latestClaim) {
      setFraudDone(true);
      setFraudPassed(true);
      setLatestClaim(autoClaim);
      setFraudStep(999);
    }
  }, [autoClaim]); // eslint-disable-line

  if (!user) return null;

  const ALL_TRIGGERS = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          <path d="M12 20v2M8 20v2M16 20v2"/>
        </svg>
      ),
      key: 'rain',
      name: 'Heavy Rain (78mm)', threshold: 'Rainfall > 60mm',
      api: 'OpenWeatherMap API', impact: '40-60% order drop',
      active: activeTrigger?.type === 'Heavy Rain',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ),
      key: 'heat',
      name: 'Heatwave (46°C)', threshold: 'Temperature > 45°C',
      api: 'IMD + OpenWeatherMap', impact: '25-35% order drop',
      active: activeTrigger?.type === 'Heatwave',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 8h18M3 12h18M3 16h18"/>
          <circle cx="20" cy="8" r="2" fill="currentColor" stroke="none"/>
          <circle cx="20" cy="16" r="2" fill="currentColor" stroke="none"/>
        </svg>
      ),
      key: 'aqi',
      name: 'Severe AQI (405)', threshold: 'AQI Index > 400',
      api: 'CPCB AQI API', impact: '20-30% order drop',
      active: activeTrigger?.type === 'Severe AQI',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
          <path d="M2 18c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
          <path d="M12 3l3 6H9l3-6z"/>
        </svg>
      ),
      key: 'flood',
      name: floodData ? `Flood Alert (${floodData.waterlogging || 'Level 2'})` : 'Flood Alert',
      threshold: floodData ? `NDMA Level: ${floodData.level}` : 'NDMA advisory',
      api: 'NDMA Mock API', impact: 'Near-zero deliveries',
      active: activeTrigger?.type === 'Flood Alert',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
          <path d="M9 8l2 2-2 2M13 10h2"/>
        </svg>
      ),
      key: 'outage',
      name: platformData ? `${platformData.platform || user.platform} Outage (${platformData.outageHours || 3.1}hr)` : 'Platform Outage',
      threshold: platformData ? `Uptime: ${platformData.uptime || 98.7}%` : '> 2hr downtime',
      api: 'Platform Status API', impact: 'Zero order generation',
      active: activeTrigger?.type === 'Platform Outage',
    },
  ];

  const simulateClaim = async (trigger) => {
    if (!policy) { navigate('/policy'); return; }
    const workerIdx = Math.floor(Math.random() * FAKE_WORKERS_DB.length);
    const worker    = demoWorker || FAKE_WORKERS_DB[workerIdx];
    setDemoWorker(worker);
    setFraudStep(0);
    setFraudDone(false);
    setFraudPassed(null);
    setLatestClaim(null);
    setProcessing(true);
    const result = await runFraudCheck(worker);
    setFraudSteps(result.steps);
    let s = 0;
    const id = setInterval(() => {
      s++;
      setFraudStep(s);
      if (s >= result.steps.length) {
        clearInterval(id);
        setTimeout(async () => {
          setFraudDone(true);
          setProcessing(false);
          setFraudPassed(result.passed);
          if (result.passed) {
            const SEVERITY = {
              'Heavy Rain (78mm)': 0.40,
              'Heatwave (46°C)': 0.30,
              'Severe AQI (405)': 0.25,
              'Flood Alert': 0.60,
              'Platform Outage': 0.50,
            };
            const severity = SEVERITY[trigger.name] || 0.35;
            const dailyEarnings = parseFloat(worker.dailyEarnings || worker.daily_earnings) || 800;
            const amount = Math.min(
              Math.round(dailyEarnings * severity * 1.5),
              policy.maxPayout
            );
            const c = await addClaim(trigger.name, amount, false);
            setLatestClaim(c);
          } else {
            const blocked = blockClaim(trigger.name, worker);
            setLatestClaim(blocked);
          }
        }, 500);
      }
    }, 750);
  };

  const paidClaims    = claims.filter(c => c.status === 'PAID');
  const blockedClaims = claims.filter(c => c.status === 'FRAUD BLOCKED');
  const totalPaid     = paidClaims.reduce((s, c) => s + c.amount, 0);
  const autoClaims    = claims.filter(c => c.autoTriggered).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">

        {/* GRADIENT HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent, #4f46e5) 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
              Claims Management
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
              Claims Management
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 6, marginBottom: 0 }}>
              Zero-touch parametric claims — auto-triggered by 5 live disruption APIs, paid in under 5 minutes
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: 4 }}>TOTAL PAID OUT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>₹{totalPaid.toLocaleString()}</span>
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20M6 15h4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Auto-claim notice */}
        {autoClaim && (
          <div style={{ background: 'linear-gradient(135deg,#065f46,#047857)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }} className="fade-up">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20M6 15h4"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Zero-Touch Claim Auto-Initiated — {autoClaim.triggerLabel}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 3 }}>{autoClaim.id} · ₹{autoClaim.amount} · No action needed from you</div>
            </div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 1v6l3 3" strokeLinecap="round"/><circle cx="8" cy="8" r="7"/></svg>
              Auto
            </span>
          </div>
        )}

        {!policy && (
          <div className="alert alert-yellow mb-20">
            <span className="alert-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 1l7 13H1L8 1z" strokeLinejoin="round"/>
                <path d="M8 6v4M8 11.5v.5" strokeLinecap="round"/>
              </svg>
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>No Active Policy</div>
              <div className="text-sm text-2 mt-4">Activate a policy first. <span style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/policy')}>Activate Now →</span></div>
            </div>
          </div>
        )}

        {/* Demo Worker Selector */}
        <div className="card mb-20" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="5" r="3"/>
              <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
            </svg>
            Demo Mode — Select Worker Profile to Simulate Fraud Check
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {FAKE_WORKERS_DB.map((w) => (
              <button
                key={w.id}
                className={`btn btn-sm ${demoWorker?.id === w.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDemoWorker(w)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {w.fraudFlag
                    ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--red)" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 5l6 6M11 5l-6 6" strokeLinecap="round"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--green)" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                </span>
                <span>{w.name}</span>
                <span className={`badge ${w.fraudFlag ? 'badge-red' : 'badge-green'}`} style={{ fontSize: 10 }}>
                  {w.fraudFlag ? 'FRAUD' : 'CLEAN'}
                </span>
              </button>
            ))}
          </div>
          {demoWorker && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-2)' }}>
              Selected: <strong>{demoWorker.name}</strong> · {demoWorker.city} · Trust Score: {demoWorker.trustScore}/100
              {demoWorker.fraudFlag && (
                <span style={{ color: 'var(--red)', marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l7 13H1L8 1z" strokeLinejoin="round"/><path d="M8 6v4" strokeLinecap="round"/></svg>
                  {demoWorker.fraudReason}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid-4 mb-20">
          {[
            { l: 'Total Claims',    v: claims.length,                    sub: 'since activation'      },
            { l: 'Total Paid Out',  v: '₹' + totalPaid.toLocaleString(), sub: paidClaims.length + ' approved' },
            { l: 'Fraud Blocked',   v: blockedClaims.length,             sub: 'zero payouts released' },
            { l: 'Avg Payout Time', v: '< 5 min',                        sub: 'fully automated'       },
          ].map((m, i) => (
            <div className="metric-card" key={i}>
              <div className="metric-label">{m.l}</div>
              <div className="metric-value" style={{ fontSize: 20 }}>{m.v}</div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2 mb-20" style={{ alignItems: 'start' }}>
          {/* Triggers */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 15 }}>Live Parametric Triggers</h3>
              {loading && <span className="spinner spinner-dark" />}
            </div>
            <p className="text-sm text-2 mb-16">5 disruption APIs monitored in real-time · Click Simulate to demo the claim flow</p>
            {ALL_TRIGGERS.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, padding: '12px 14px', borderRadius: 9, background: t.active ? 'var(--red-bg)' : 'var(--surface2)', border: '1px solid ' + (t.active ? 'var(--red-border)' : 'var(--border)') }}>
                <span style={{ flexShrink: 0, color: t.active ? 'var(--red)' : 'var(--text-2)' }}>{t.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div className="text-xs text-3">{t.threshold} · {t.api}</div>
                  <div className="text-xs" style={{ color: 'var(--yellow)', marginTop: 2 }}>{t.impact}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span className={`badge ${t.active ? 'badge-red' : 'badge-green'}`}>{t.active ? '● TRIGGERED' : '✓ CLEAR'}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => simulateClaim(t)} disabled={processing}>Simulate →</button>
                </div>
              </div>
            ))}

            {/* API Health */}
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 9, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 10 }}>API Health</div>
              {[
                { name: 'OpenWeatherMap', status: 'LIVE', latency: '142ms' },
                { name: 'CPCB AQI',       status: 'LIVE', latency: '89ms'  },
                { name: 'NDMA Flood',     status: 'MOCK', latency: '400ms' },
                { name: 'Platform Status',status: 'MOCK', latency: '500ms' },
                { name: 'IMD Heatwave',   status: 'LIVE', latency: '210ms' },
              ].map((api, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: api.status === 'LIVE' ? 'var(--green)' : 'var(--yellow)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{api.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${api.status === 'LIVE' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 10 }}>{api.status}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{api.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fraud Detection Panel */}
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>AI Fraud Detection</h3>
            <p className="text-sm text-2 mb-16">5-layer verification runs in real-time on every claim</p>

            {fraudStep === -1 && !fraudDone && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
                      fill="var(--brand-light)" stroke="var(--brand)" strokeWidth="1.5"/>
                    <path d="M7 10l2 2 4-4" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-sm">Select a worker above, then simulate a trigger to see AI fraud detection in action</div>
              </div>
            )}

            {(fraudStep >= 0 || fraudDone) && fraudSteps.map((s, i) => {
              const done    = fraudDone || i < fraudStep;
              const running = !fraudDone && i === fraudStep;
              const stepPassed = s.passed;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, opacity: i > fraudStep && !fraudDone ? 0.25 : 1, transition: 'opacity 0.3s' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: done ? (stepPassed ? 'var(--green-bg)' : 'var(--red-bg)') : running ? 'var(--blue-bg)' : 'var(--surface2)',
                    border: '1.5px solid ' + (done ? (stepPassed ? 'var(--green-border)' : 'var(--red-border)') : running ? 'var(--blue-border)' : 'var(--border)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, marginTop: 1,
                    color: done ? (stepPassed ? 'var(--green)' : 'var(--red)') : running ? 'var(--brand)' : 'var(--text-3)',
                  }}>
                    {running ? <span className="spinner spinner-dark" style={{ width: 12, height: 12 }} /> : done ? (stepPassed ? '✓' : '✗') : i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: done ? (stepPassed ? 'var(--green)' : 'var(--red)') : 'var(--text)' }}>{s.label}</div>
                    <div className="text-xs text-3">{done ? s.detail : s.note}</div>
                  </div>
                </div>
              );
            })}

            {fraudDone && latestClaim && (
              <>
                {fraudPassed ? (
                  <div className="alert alert-green mt-12">
                    <span className="alert-icon">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Claim Approved — {latestClaim.id}</div>
                      <div className="text-sm text-2 mt-4">₹{latestClaim.amount} → {latestClaim.channel || 'UPI'} transfer initiated</div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-red mt-12" style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)' }}>
                    <span className="alert-icon">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--red)" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 5l6 6M11 5l-6 6" strokeLinecap="round"/></svg>
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--red)' }}>Claim BLOCKED — Fraud Detected</div>
                      <div className="text-sm mt-4" style={{ color: 'var(--text-2)' }}>{latestClaim.fraudReason}</div>
                      <div className="text-xs mt-4" style={{ color: 'var(--text-3)' }}>No payout released. Flagged for review.</div>
                    </div>
                  </div>
                )}

                {fraudPassed && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 9, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 10 }}>Payout Breakdown</div>
                    {[
                      { label: 'Daily Earnings',      value: '₹' + (demoWorker?.dailyEarnings || parseFloat(user.dailyEarnings) || 800) },
                      { label: 'Disruption Severity', value: '35%'                                         },
                      { label: 'Duration Factor',     value: '×1.5'                                        },
                      { label: 'Plan Cap',            value: policy ? '₹' + policy.maxPayout : '—'         },
                      { label: 'Payout Channel',      value: latestClaim.channel || 'UPI'                  },
                      { label: 'Final Payout',        value: '₹' + latestClaim.amount, highlight: true    },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, paddingBottom: row.highlight ? 0 : 6, borderBottom: row.highlight ? 'none' : '1px solid var(--border)' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: row.highlight ? 700 : 500, color: row.highlight ? 'var(--green)' : 'var(--text)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {fraudPassed && latestClaim?.status === 'PAID' && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--green-bg)', borderRadius: 9, border: '1px solid var(--green-border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      UPI Transfer Confirmed
                    </div>
                    {[
                      { label: 'Transaction ID', value: `UPI${Date.now().toString().slice(-10)}` },
                      { label: 'UPI ID',         value: `${user.phone?.slice(-10)}@upi`          },
                      { label: 'Amount',         value: `₹${latestClaim.amount}`                 },
                      { label: 'Status',         value: 'SUCCESS'                                },
                      { label: 'Time',           value: new Date().toLocaleTimeString('en-IN')   },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: row.label === 'Status' ? 'var(--green)' : 'var(--text)', fontFamily: row.label === 'Transaction ID' ? 'monospace' : 'inherit' }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Claims History */}
        <div className="card">
          <div className="flex items-center justify-between mb-16">
            <h3 style={{ fontSize: 15 }}>Claims History</h3>
            <div className="flex gap-8">
              <span className="badge badge-green">{paidClaims.length} Paid</span>
              <span className="badge badge-red">{blockedClaims.length} Fraud Blocked</span>
              <span className="badge badge-blue">{autoClaims} Auto-Triggered</span>
            </div>
          </div>
          {claims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>No claims yet. Simulate one above.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Claim ID</th><th>Date</th><th>Trigger</th><th>Amount</th><th>Channel</th><th>Type</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand)' }}>{c.id}</td>
                      <td className="text-2">{c.date}</td>
                      <td style={{ fontWeight: 500 }}>{c.trigger}</td>
                      <td style={{ fontWeight: 600, color: c.status === 'FRAUD BLOCKED' ? 'var(--red)' : 'var(--green)' }}>
                        {c.status === 'FRAUD BLOCKED' ? '₹0 (Blocked)' : '₹' + c.amount}
                      </td>
                      <td className="text-2">{c.channel || '—'}</td>
                      <td>
                        <span className={`badge ${c.autoTriggered ? 'badge-green' : 'badge-gray'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {c.autoTriggered
                            ? <><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 1v6l3 3" strokeLinecap="round"/><circle cx="8" cy="8" r="7"/></svg> Auto</>
                            : 'Manual'
                          }
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${c.status === 'PAID' ? 'badge-green' : c.status === 'FRAUD BLOCKED' ? 'badge-red' : c.status === 'PROCESSING' ? 'badge-blue' : 'badge-yellow'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}