import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { activatePolicy as apiActivatePolicy } from '../services/api';

const PLANS = [
  { id:'Basic', price:49, maxPayout:1500, features:['₹1,500/week max payout','Rain + Heat triggers','3 claims per month','Standard AI fraud checks'], best:'Part-time workers' },
  { id:'Standard', price:99, maxPayout:3000, popular:true, features:['₹3,000/week max payout','Rain, Heat, AQI, Flood triggers','8 claims per month','Advanced 5-layer AI detection','Priority processing'], best:'Full-time workers' },
  { id:'Premium', price:149, maxPayout:5000, features:['₹5,000/week max payout','All triggers + Social disruptions','Unlimited claims','Instant payout < 5 min','Dedicated support line'], best:'High-earning partners' },
];

const TRIGGERS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        <path d="M12 20v2M8 20v2M16 20v2"/>
      </svg>
    ),
    name:'Heavy Rain', threshold:'>60mm/day', api:'OpenWeatherMap', plans:['Basic','Standard','Premium']
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
    name:'Heatwave', threshold:'>45°C', api:'OpenWeatherMap', plans:['Basic','Standard','Premium']
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12h18M3 6h18M3 18h18"/>
        <circle cx="19" cy="6" r="2" fill="currentColor" stroke="none"/>
        <circle cx="19" cy="18" r="2" fill="currentColor" stroke="none"/>
      </svg>
    ),
    name:'Severe AQI', threshold:'>400 AQI', api:'CPCB AQI API', plans:['Standard','Premium']
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
        <path d="M2 18c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
        <path d="M12 3l3 6H9l3-6z"/>
      </svg>
    ),
    name:'Flood Alert', threshold:'Govt. advisory', api:'NDMA API', plans:['Standard','Premium']
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    name:'Local Curfew', threshold:'Zone closure', api:'Social API (mock)', plans:['Premium']
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 8l2 2-2 2M13 10h2"/>
      </svg>
    ),
    name:'Platform Outage', threshold:'>2hr downtime', api:'Status API', plans:['Premium']
  },
];

export default function Policy() {
  const navigate = useNavigate();
  const { user, policy, setPolicy, calculatePremium } = useApp();
  const [selected, setSelected] = useState(policy?.plan||'Standard');
  const [paying, setPaying] = useState(false);
  const [premiumPrices, setPremiumPrices] = useState({ Basic: 49, Standard: 99, Premium: 149 });

  if(!user){ navigate('/register'); return null; }

  useEffect(() => {
    let cancelled = false;
    async function loadPrices() {
      const results = {};
      for (const plan of ['Basic', 'Standard', 'Premium']) {
        const p = await calculatePremium(plan, user.city, user.platform, user.dailyEarnings);
        if (!cancelled) results[plan] = p;
      }
      if (!cancelled) setPremiumPrices(results);
    }
    loadPrices();
    return () => { cancelled = true; };
  }, [user?.city, user?.platform, user?.dailyEarnings]); // eslint-disable-line

  const activate = async () => {
    setPaying(true);
    const result = await apiActivatePolicy(user.id, selected);
    if (result && !result.error) {
      const newPolicy = {
        plan: result.plan,
        premium: result.premium,
        maxPayout: result.max_payout ?? result.maxPayout ?? PLANS.find(p => p.id === selected).maxPayout,
        startDate: result.start_date ?? result.startDate,
        endDate: result.end_date ?? result.endDate,
        status: 'ACTIVE',
        claimsUsed: 0,
      };
      localStorage.setItem('gs_policy', JSON.stringify(newPolicy));
      setPolicy(newPolicy);
      setPaying(false);
      navigate('/dashboard');
    } else {
      const plan = PLANS.find(p => p.id === selected);
      const premium = premiumPrices[selected] || plan.price;
      const start = new Date(), end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newPolicy = {
        plan: selected, premium, maxPayout: plan.maxPayout,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        status: 'ACTIVE', claimsUsed: 0,
      };
      localStorage.setItem('gs_policy', JSON.stringify(newPolicy));
      setPolicy(newPolicy);
      setPaying(false);
      navigate('/dashboard');
    }
  };

  const renew = () => {
    const start=new Date(), end=new Date(start.getTime()+7*24*60*60*1000);
    setPolicy({...policy, startDate:start.toISOString().split('T')[0], endDate:end.toISOString().split('T')[0], claimsUsed:0});
  };

  return (
    <div className="app-shell">
      <Sidebar/>
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
              My Policy
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
              Insurance Policy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 6, marginBottom: 0 }}>
              Weekly parametric income protection — priced to match your payout cycle
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: 4 }}>CURRENT PLAN</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: policy ? '#34d399' : '#fbbf24' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{policy ? policy.plan + ' Active' : 'No Plan Yet'}</span>
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
                  fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
                <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Active policy */}
        {policy && (
          <div className="card-blue mb-20">
            <div className="flex items-center justify-between">
              <div>
                <div style={{fontSize:11,opacity:0.75,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Active Policy</div>
                <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:22,marginBottom:4}}>GigShield {policy.plan}</div>
                <div style={{opacity:0.9,fontSize:13}}>₹{policy.premium}/week · Up to ₹{policy.maxPayout.toLocaleString()} covered</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{background:'rgba(255,255,255,0.15)',borderRadius:8,padding:'8px 14px',marginBottom:8}}>
                  <div style={{fontSize:10,opacity:0.75,marginBottom:2,textTransform:'uppercase',letterSpacing:'0.05em'}}>Valid Until</div>
                  <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:700,fontSize:15}}>{policy.endDate}</div>
                </div>
                <button className="btn btn-sm" style={{background:'white',color:'var(--brand-dark)',fontWeight:700}} onClick={renew}>↻ Renew Week</button>
              </div>
            </div>
            <div style={{marginTop:18,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.2)',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
              {[{l:'Start Date',v:policy.startDate},{l:'End Date',v:policy.endDate},{l:'Claims Used',v:(policy.claimsUsed||0)+' this week'},{l:'Status',v:'● ACTIVE'}].map((x,i)=>(
                <div key={i}><div style={{fontSize:10,opacity:0.7,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{x.l}</div><div style={{fontWeight:600,fontSize:13}}>{x.v}</div></div>
              ))}
            </div>
          </div>
        )}

        {/* Plan selection */}
        <div className="mb-16">
          <h3 style={{fontSize:16,marginBottom:3}}>{policy?'Change Your Plan':'Choose a Plan'}</h3>
          <p className="text-sm text-2">AI adjusts the premium based on your city's risk score. All plans billed weekly.</p>
        </div>

        <div className="grid-3 mb-20">
          {PLANS.map(plan=>{
            const price = premiumPrices[plan.id] ?? plan.price;
            const isSelected = selected===plan.id;
            return (
              <div key={plan.id} className={`plan-card ${isSelected?'selected':''} ${plan.popular?'':''}` } onClick={()=>setSelected(plan.id)}>
                {plan.popular && <div className="plan-popular-badge">MOST POPULAR</div>}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text-2)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>{plan.id}</div>
                  <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:28,color:isSelected?'var(--brand)':'var(--text)',letterSpacing:'-0.5px'}}>
                    ₹{price}<span style={{fontSize:13,fontWeight:400,color:'var(--text-2)'}}>/ week</span>
                  </div>
                  {price!==plan.price&&<div className="text-xs text-3 mt-4">AI-adjusted from ₹{plan.price} for {user.city}</div>}
                  <div style={{fontSize:12,color:'var(--green)',marginTop:6,fontWeight:600}}>Up to ₹{plan.maxPayout.toLocaleString()} / week</div>
                </div>
                <div className="text-xs text-2 mb-12">Best for: {plan.best}</div>
                <div className="divider"/>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
                    <span style={{color:'var(--green)',fontSize:12,flexShrink:0,marginTop:1}}>✓</span>
                    <span className="text-sm text-2">{f}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Triggers table */}
        <div className="card mb-20">
          <h3 style={{fontSize:15,marginBottom:16}}>Parametric Triggers Covered</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {TRIGGERS.map((t,i)=>{
              const active = t.plans.includes(selected);
              return (
                <div key={i} style={{display:'flex',gap:12,alignItems:'center',padding:'12px 14px',borderRadius:9,background:active?'var(--blue-bg)':'var(--surface2)',border:'1px solid '+(active?'var(--blue-border)':'var(--border)'),opacity:active?1:0.5}}>
                  <span style={{flexShrink:0,color:active?'var(--brand)':'var(--text-3)'}}>{t.icon}</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{t.name}</div>
                    <div className="text-xs text-3">{t.threshold} · {t.api}</div>
                  </div>
                  {active&&<span className="badge badge-blue ml-auto" style={{fontSize:10}}>Active</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
          <button className="btn btn-primary btn-lg" onClick={activate} disabled={paying}>
            {paying?<><span className="spinner"/>Processing Razorpay...</>
              :policy?`Switch to ${selected} — ₹${premiumPrices[selected] ?? '...'}/week`
              :`Activate ${selected} — ₹${premiumPrices[selected] ?? '...'}/week`}
          </button>
          <p className="text-xs text-3">Coverage begins instantly · Cancel anytime · Zero hidden fees</p>
        </div>
      </main>
    </div>
  );
}