import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV = [
  { group: 'Main', items: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/policy', label: 'My Policy' },
    { path: '/claims', label: 'Claims' },
  ]},
  { group: 'Tools', items: [
    { path: '/premium', label: 'Premium Calculator' },
    { path: '/weather', label: 'Live Monitor' },
  ]},
];

const ICONS = {
  '/dashboard': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  '/policy': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 1z"/>
      <path d="M9 1v5h5"/>
      <path d="M5 9h6M5 11.5h4"/>
    </svg>
  ),
  '/claims': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/>
      <path d="M10 6.5 7.5 9 6 7.5"/>
    </svg>
  ),
  '/premium': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="10" rx="1.5"/>
      <path d="M1 6h14"/>
      <path d="M5 10h2M9 10h2"/>
    </svg>
  ),
  '/weather': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 7H11.26A4 4 0 1 0 6 12H12a2.5 2.5 0 0 0 0-5z"/>
    </svg>
  ),
};

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 5v5c0 4.418 3.134 8.557 7 9.9C13.866 18.557 17 14.418 17 10V5L10 2z"
      fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
    <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42"/>
  </svg>
);

const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6"/>
  </svg>
);

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, policy, logout, theme, setTheme } = useApp();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${open ? 'open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldIcon />
          </div>
          <div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: 17,
              color: 'var(--text)',
            }}>
              GigShield
            </div>
            <div style={{ fontSize: 10, color: 'var(--brand)', fontWeight: 600 }}>
              AI-Powered
            </div>
          </div>
        </div>

        {/* Worker */}
        {user && (
          <div className="sidebar-worker">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  {user.platform} · {user.city}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.group}>
              <div className="sidebar-section-label">{section.group}</div>

              {section.items.map(item => (
                <button
                  key={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                >
                  <span className="nav-icon">{ICONS[item.path]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">

         <button
  className="nav-item"
  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
>
  <span className="nav-icon">
    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
  </span>

  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
</button>

          <button
            className="nav-item"
            onClick={logout}
            style={{ color: 'var(--red)' }}
          >
            <span className="nav-icon" style={{ color: 'var(--red)' }}>
              <SignOutIcon />
            </span>
            Sign Out
          </button>

        </div>
      </div>
    </>
  );
}