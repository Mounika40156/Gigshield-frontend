import React, { useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard() {
  const { admin, analytics, fetchAnalytics, loading } = useAdmin();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const cityData = analytics?.users_by_city
    ? Object.entries(analytics.users_by_city).map(([name, value]) => ({ name, value }))
    : [];

  const platformData = analytics?.users_by_platform
    ? Object.entries(analytics.users_by_platform).map(([name, value]) => ({ name, value }))
    : [];

  const riskData = analytics?.risk_distribution
    ? Object.entries(analytics.risk_distribution)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const claimStatusData = analytics?.claims_by_status
    ? Object.entries(analytics.claims_by_status)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin?.name}. Here's your platform overview.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid-4 mb-24">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" />
              </svg>
            </div>
            <div className="metric-label">Total Users</div>
            <div className="metric-value">{analytics?.total_users ?? 0}</div>
            <div className="metric-sub">Registered gig workers</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 1z" />
                <path d="M9 1v5h5" />
              </svg>
            </div>
            <div className="metric-label">Active Policies</div>
            <div className="metric-value">{analytics?.active_policies ?? 0}</div>
            <div className="metric-sub">of {analytics?.total_policies ?? 0} total</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'var(--blue-bg)', color: 'var(--brand)' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="M1 6h14" />
              </svg>
            </div>
            <div className="metric-label">Premium Collected</div>
            <div className="metric-value">
              {analytics?.total_premium_collected ? `Rs. ${analytics.total_premium_collected.toLocaleString()}` : 'Rs. 0'}
            </div>
            <div className="metric-sub">Total revenue</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'var(--yellow-bg)', color: 'var(--yellow)' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" /><path d="M10 6.5 7.5 9 6 7.5" />
              </svg>
            </div>
            <div className="metric-label">Burning Cost Ratio</div>
            <div className="metric-value">{analytics?.bcr ?? 0}</div>
            <div className="metric-sub">Claims / Premium</div>
          </div>
        </div>

        {/* Claims Summary */}
        <div className="grid-3 mb-24">
          <div className="card" style={{ borderLeft: '3px solid var(--green)' }}>
            <div className="metric-label">Paid Claims</div>
            <div className="metric-value text-green">{analytics?.paid_claims ?? 0}</div>
            <div className="metric-sub">Rs. {(analytics?.total_claims_paid ?? 0).toLocaleString()} disbursed</div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--red)' }}>
            <div className="metric-label">Blocked Claims</div>
            <div className="metric-value text-red">{analytics?.blocked_claims ?? 0}</div>
            <div className="metric-sub">Fraud detected</div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--brand)' }}>
            <div className="metric-label">Total Claims</div>
            <div className="metric-value text-blue">{analytics?.total_claims ?? 0}</div>
            <div className="metric-sub">All time</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-24">
          {/* Users by City */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Users by City</h3>
            {cityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No user data yet</div>
            )}
          </div>

          {/* Risk Distribution */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Risk Distribution</h3>
            {riskData.length > 0 ? (
              <div className="flex items-center" style={{ gap: 24 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {riskData.map((_, i) => (
                        <Cell key={i} fill={['#10B981', '#F59E0B', '#EF4444'][i % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {riskData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-8 mb-8">
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: ['#10B981', '#F59E0B', '#EF4444'][i % 3] }} />
                      <span style={{ fontSize: 13 }}>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No risk data yet</div>
            )}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Users by Platform</h3>
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={platformData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="var(--text-3)" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No platform data yet</div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Claims by Status</h3>
            {claimStatusData.length > 0 ? (
              <div className="flex items-center" style={{ gap: 24 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={claimStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label>
                      {claimStatusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {claimStatusData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-8 mb-8">
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 13 }}>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No claims data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
