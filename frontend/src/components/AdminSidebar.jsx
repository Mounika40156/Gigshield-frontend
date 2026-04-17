import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const NAV = [
  {
    group: 'Overview',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/analytics', label: 'Analytics' },
    ],
  },
  {
    group: 'Management',
    items: [
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/policies', label: 'Policies' },
      { path: '/admin/claims', label: 'Claims' },
    ],
  },
  {
    group: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings' },
    ],
  },
];

const ICONS = {
  '/admin/dashboard': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  ),
  '/admin/analytics': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 14V8l3-2 3 3 3-5 3 2v8H2z" />
      <path d="M2 14h12" />
    </svg>
  ),
  '/admin/users': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" />
    </svg>
  ),
  '/admin/policies': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 1z" />
      <path d="M9 1v5h5" />
      <path d="M5 9h6M5 11.5h4" />
    </svg>
  ),
  '/admin/claims': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M10 6.5 7.5 9 6 7.5" />
    </svg>
  ),
  '/admin/settings': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2" />
      <path d="M13.5 8a5.5 5.5 0 0 1-.2 1.3l1.4 1.1a.3.3 0 0 1 .1.4l-1.4 2.4a.3.3 0 0 1-.4.1l-1.6-.7a5.2 5.2 0 0 1-1.1.6l-.2 1.7a.3.3 0 0 1-.3.3H7.1a.3.3 0 0 1-.3-.3l-.2-1.7a5 5 0 0 1-1.1-.6l-1.6.7a.3.3 0 0 1-.4-.1L2.1 10.8a.3.3 0 0 1 .1-.4l1.4-1.1A5.5 5.5 0 0 1 3.5 8c0-.4 0-.9.1-1.3L2.2 5.6a.3.3 0 0 1-.1-.4l1.4-2.4a.3.3 0 0 1 .4-.1l1.6.7c.3-.2.7-.5 1.1-.6L6.8 1.1A.3.3 0 0 1 7.1.8h2.8a.3.3 0 0 1 .3.3l.2 1.7c.4.1.8.4 1.1.6l1.6-.7a.3.3 0 0 1 .4.1l1.4 2.4a.3.3 0 0 1-.1.4l-1.4 1.1c.1.4.1.9.1 1.3z" />
    </svg>
  ),
};

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, theme, setTheme } = useAdmin();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark" style={{ background: '#7C3AED' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M8 1L2 4v4c0 3.5 2.6 6.5 6 7.5 3.4-1 6-4 6-7.5V4L8 1z" />
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-name">GigShield</div>
          <div className="sidebar-logo-tag" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
            Admin Panel
          </div>
        </div>
      </div>

      {admin && (
        <div className="sidebar-worker">
          <div className="flex items-center gap-8 mb-8">
            <div
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(124,58,237,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#7C3AED', flexShrink: 0,
              }}
            >
              {admin.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sidebar-worker-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {admin.name}
              </div>
              <div className="sidebar-worker-sub">{admin.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <span className="sidebar-worker-badge" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED', borderColor: 'rgba(124,58,237,0.3)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
            {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : 'Viewer'}
          </span>
        </div>
      )}

      <nav className="sidebar-nav">
        {NAV.map((section) => (
          <div key={section.group}>
            <div className="sidebar-section-label">{section.group}</div>
            {section.items.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={location.pathname === item.path ? { background: 'rgba(124,58,237,0.1)', color: '#7C3AED' } : {}}
              >
                <span className="nav-icon">{ICONS[item.path]}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <span className="nav-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        <button className="nav-item" onClick={() => navigate('/')} style={{ color: 'var(--text-2)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" />
          </svg>
          Back to App
        </button>

        <button className="nav-item" onClick={logout} style={{ color: 'var(--red)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
