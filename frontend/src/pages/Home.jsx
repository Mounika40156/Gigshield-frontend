import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { theme, setTheme } = useApp();

  return (
    <div className="home-page">
      {/* Nav */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="auth-logo" style={{ margin: 0, justifyContent: 'flex-start' }}>
            <div className="auth-logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
                  fill="var(--text)" stroke="var(--brand)" strokeWidth="1.5"/>
                <path d="M7 10l2 2 4-4" stroke="var(--brand)"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="auth-logo-name">GigShield</span>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>AI-Powered</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
  {/* Theme toggle — left-most, visually separated */}
  <button
    className="btn-theme-toggle"
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    title="Toggle theme"
    style={{ marginRight: 10 }}
  >
    {theme === 'light'
      ? <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z"/></svg>
      : <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42"/></svg>
    }
  </button>

  {/* Subtle divider */}
  <div style={{ width: 1, height: 22, background: 'var(--border)', marginRight: 10 }} />

  {/* Admin — very muted, tertiary action */}
  <button
    className="btn btn-sm"
    onClick={() => navigate('/admin/login')}
    style={{
      background: 'transparent',
      border: 'none',
      color: 'var(--text-3)',
      fontSize: 12,
      fontWeight: 500,
      padding: '6px 10px',
    }}
  >
    Admin
  </button>

  {/* Login — secondary action */}
  <button
    className="btn btn-ghost btn-sm"
    onClick={() => navigate('/login')}
    style={{ fontSize: 13 }}
  >
    Login
  </button>

  {/* Get Started — primary CTA */}
  <button
    className="btn btn-primary btn-sm"
    onClick={() => navigate('/register')}
    style={{ fontSize: 13, paddingLeft: 16, paddingRight: 16 }}
  >
    Get Started →
  </button>
</div>
    </div>
      </nav>

      {/* Hero */}
      <section className="home-hero fade-up">
        <div className="home-hero-badge">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 10l-4 2.5 1.5-4.5L2 5.5h4.5L8 1z"/>
          </svg>
          Trusted by 10,000+ gig workers across India
        </div>
        <h1 className="home-hero-title">
          Income Protection for<br />
          <span className="home-hero-gradient">India's Gig Workers</span>
        </h1>
        <p className="home-hero-sub">
          GigShield uses AI-powered parametric insurance to protect delivery workers from income loss
          due to extreme weather, platform outages, and unexpected disruptions — with automatic payouts, no paperwork.
        </p>
        <div className="flex gap-12 justify-center" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Start Free Today →
          </button>
          <button className="btn btn-outline btn-lg">
            See How It Works
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats">
        <div className="home-stats-inner">
          {[
            { value: '₹2.4Cr+', label: 'Claims Paid Out' },
            { value: '< 2 hrs', label: 'Avg. Payout Time' },
            { value: '10,000+', label: 'Active Workers' },
            { value: '99.8%', label: 'Uptime SLA' },
          ].map((s) => (
            <div key={s.label} className="home-stat">
              <div className="home-stat-value">{s.value}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <div className="home-section-label">Why GigShield</div>
        <h2 className="home-section-title">Built for the way you work</h2>
        <div className="grid-3" style={{ gap: 20, marginTop: 36 }}>
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 1v6l3 3" strokeLinecap="round"/>
                  <circle cx="8" cy="8" r="7"/>
                </svg>
              ),
              iconBg: '#EFF6FF',
              title: 'Automatic Payouts',
              desc: 'No claims process. When a trigger event occurs — heavy rain, platform downtime — your payout is sent automatically within hours.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 7H11.26A4 4 0 1 0 6 12H12a2.5 2.5 0 0 0 0-5z"/>
                  <path d="M8 6V3M6 4l2-1 2 1" strokeLinecap="round"/>
                </svg>
              ),
              iconBg: '#ECFDF5',
              title: 'Real-Time Weather Monitoring',
              desc: 'We monitor live IMD data 24/7. If rainfall exceeds your coverage threshold in your delivery zone, you get paid — instantly.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="12" height="10" rx="2"/>
                  <path d="M5 7h2M5 9.5h4M9 7h2" strokeLinecap="round"/>
                </svg>
              ),
              iconBg: '#FFFBEB',
              title: 'AI Risk Assessment',
              desc: 'Our AI calculates your personalized premium based on your city, platform, and earnings profile — fair pricing for every worker.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="1" width="8" height="14" rx="2"/>
                  <path d="M7 12h2" strokeLinecap="round"/>
                </svg>
              ),
              iconBg: '#FEF2F2',
              title: 'Simple Mobile Dashboard',
              desc: 'Track your active policy, weather alerts, and payout history all in one place — designed for use on the go.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="12" height="8" rx="1.5"/>
                  <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
                  <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/>
                </svg>
              ),
              iconBg: '#EFF6FF',
              title: 'No Paperwork, Ever',
              desc: 'Parametric insurance means payouts are triggered by data, not documentation. No receipts, no proof, no delays.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="14" height="10" rx="1.5"/>
                  <path d="M1 6h14M5 10h2M9 10h2"/>
                </svg>
              ),
              iconBg: '#ECFDF5',
              title: 'Flexible Plans',
              desc: 'From ₹99/month Basic to ₹349/month Premium — choose coverage that fits your income and risk level.',
            },
          ].map((f) => (
            <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section home-section-alt">
        <div className="home-section-label">How It Works</div>
        <h2 className="home-section-title">Protected in 4 simple steps</h2>
        <div style={{ display: 'flex', gap: 0, marginTop: 40, position: 'relative' }}>
          <div className="home-steps-line" />
          {[
            {
              step: '01',
              icon: (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="5" r="3"/>
                  <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
                </svg>
              ),
              title: 'Create Account',
              desc: 'Enter your basic details — name, phone, email, and your delivery platform.',
            },
            {
              step: '02',
              icon: (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 1z"/>
                  <path d="M9 1v5h5M5 9h6M5 11.5h4"/>
                </svg>
              ),
              title: 'Choose a Plan',
              desc: 'Pick Basic, Standard, or Premium coverage based on your earnings and risk.',
            },
            {
              step: '03',
              icon: (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"/>
                  <path d="M6 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: 'Get Covered',
              desc: 'Your policy activates instantly. We start monitoring weather in your zone.',
            },
            {
              step: '04',
              icon: (
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="14" height="10" rx="1.5"/>
                  <path d="M1 6h14M5 10h2M9 10h2"/>
                </svg>
              ),
              title: 'Get Paid',
              desc: 'When a trigger happens, your payout lands in your account — no action needed.',
            },
          ].map((s) => (
            <div key={s.step} className="home-step">
              <div className="home-step-num">{s.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: 'var(--text-2)', fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="home-section">
        <div className="home-section-label">Pricing</div>
        <h2 className="home-section-title">Simple, transparent plans</h2>
        <div className="grid-3" style={{ gap: 20, marginTop: 36 }}>
          {[
            {
              name: 'Basic',
              price: '₹99',
              color: 'var(--text)',
              desc: 'Essential protection for occasional disruptions',
              features: ['₹500/day rain payout', 'Rainfall > 50mm trigger', 'Email alerts', 'Basic dashboard'],
              cta: 'Get Basic',
              popular: false,
            },
            {
              name: 'Standard',
              price: '₹199',
              color: 'var(--brand)',
              desc: 'Best value for full-time delivery workers',
              features: ['₹800/day rain payout', 'Rainfall > 35mm trigger', 'Platform outage cover', 'SMS + Email alerts', 'Priority support'],
              cta: 'Get Standard',
              popular: true,
            },
            {
              name: 'Premium',
              price: '₹349',
              color: 'var(--green)',
              desc: 'Maximum protection for power earners',
              features: ['₹1,500/day payout', 'Rainfall > 25mm trigger', 'All disruption types', 'Real-time alerts', 'Dedicated support'],
              cta: 'Get Premium',
              popular: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`plan-card${p.popular ? ' selected' : ''}`}
              style={{ position: 'relative' }}
            >
              {p.popular && <div className="plan-popular-badge">MOST POPULAR</div>}
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 18, color: p.color }}>{p.name}</div>
              <div style={{ marginTop: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 28 }}>{p.price}</span>
                <span style={{ color: 'var(--text-2)', fontSize: 13 }}> /month</span>
              </div>
              <div style={{ color: 'var(--text-2)', fontSize: 12, marginBottom: 16 }}>{p.desc}</div>
              <div className="divider" />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`btn w-full ${p.popular ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => navigate('/register')}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-section">
        <div className="card-blue" style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
                fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
              <path d="M7 10l2 2 4-4" stroke="white"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ color: 'white', fontSize: 24, marginBottom: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Don't let bad weather cost you your income
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, maxWidth: 480, margin: '0 auto 24px' }}>
            Join 10,000+ delivery workers across India who never worry about rainy days anymore.
            Sign up in 3 minutes.
          </p>
          <button
            className="btn btn-lg"
            style={{ background: 'white', color: 'var(--brand)', fontWeight: 700 }}
            onClick={() => navigate('/register')}
          >
            Create Your Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
          <div className="auth-logo-mark" style={{ width: 26, height: 26, fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
                fill="var(--brand-light)" stroke="var(--brand)" strokeWidth="1.5"/>
              <path d="M7 10l2 2 4-4" stroke="var(--brand)"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15 }}>GigShield</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 12 }}>
          © 2025 GigShield. AI-Powered Parametric Insurance for India's Gig Economy.
        </div>
      </footer>

      <style>{`
        .home-page { min-height: 100vh; background: var(--bg); }

        .home-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--home-nav-bg);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .home-nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .home-hero {
          max-width: 740px; margin: 0 auto;
          text-align: center; padding: 80px 32px 60px;
        }
       .home-hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--brand);
  border: 1px solid var(--brand-dark);
  color: white;
  font-size: 12px; font-weight: 600;
  padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
} 
        .home-hero-title {
          font-size: 48px; font-weight: 800; letter-spacing: -1.5px;
          line-height: 1.1; margin-bottom: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .home-hero-gradient {
          background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .home-hero-sub {
          color: var(--text-2); font-size: 16px; line-height: 1.7;
          margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto;
        }

        .home-stats {
          background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          padding: 28px 0;
        }
        .home-stats-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 32px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
        }
        .home-stat { text-align: center; padding: 0 20px; }
        .home-stat + .home-stat { border-left: 1px solid var(--border); }
        .home-stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px; font-weight: 800; color: var(--brand); letter-spacing: -0.5px;
        }
        .home-stat-label { color: var(--text-2); font-size: 13px; margin-top: 4px; }

        .home-section { max-width: 1100px; margin: 0 auto; padding: 72px 32px; }
        .home-section-alt { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); max-width: 100%; }
        .home-section-alt > * { max-width: 1100px; margin-left: auto; margin-right: auto; }
        .home-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--brand); margin-bottom: 10px;
        }
        .home-section-title {
          font-size: 30px; letter-spacing: -0.5px; color: var(--text);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .home-steps-line {
          position: absolute; top: 28px; left: 10%; right: 10%; height: 2px;
          background: var(--border); z-index: 0;
        }
        .home-step {
          flex: 1; text-align: center; padding: 0 20px; position: relative; z-index: 1;
        }
        .home-step-num {
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--surface); border: 2px solid var(--blue-border);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin: 0 auto 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .home-footer {
          text-align: center; padding: 32px;
          border-top: 1px solid var(--border);
          background: var(--surface);
        }

        @media (max-width: 768px) {
          .home-hero-title { font-size: 32px; }
          .home-stats-inner { grid-template-columns: 1fr 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .home-steps-line { display: none; }
          .home-step { margin-bottom: 24px; }
          div[style*="display: flex"][style*="gap: 0"] { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}