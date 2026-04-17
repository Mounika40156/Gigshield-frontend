import React, { useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function Analytics() {
  const { analytics, claims, users, fetchAnalytics, fetchUsers, fetchClaims } = useAdmin();

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
    fetchClaims();
  }, [fetchAnalytics, fetchUsers, fetchClaims]);

  // Derive time-series data from claims (group by date)
  const claimsByDate = {};
  (claims || []).forEach((c) => {
    const d = c.date || 'Unknown';
    if (!claimsByDate[d]) claimsByDate[d] = { date: d, paid: 0, blocked: 0, amount: 0 };
    if (c.status === 'PAID') {
      claimsByDate[d].paid += 1;
      claimsByDate[d].amount += c.amount || 0;
    } else if (c.status === 'FRAUD BLOCKED') {
      claimsByDate[d].blocked += 1;
    }
  });
  const claimsTimeline = Object.values(claimsByDate).sort((a, b) => a.date.localeCompare(b.date));

  // Earnings distribution
  const earningsBuckets = { '< 500': 0, '500-700': 0, '700-900': 0, '900-1100': 0, '> 1100': 0 };
  (users || []).forEach((u) => {
    const e = u.daily_earnings || 0;
    if (e < 500) earningsBuckets['< 500']++;
    else if (e < 700) earningsBuckets['500-700']++;
    else if (e < 900) earningsBuckets['700-900']++;
    else if (e < 1100) earningsBuckets['900-1100']++;
    else earningsBuckets['> 1100']++;
  });
  const earningsData = Object.entries(earningsBuckets)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // City data
  const cityData = analytics?.users_by_city
    ? Object.entries(analytics.users_by_city).map(([name, value]) => ({ name, value }))
    : [];

  // Platform data
  const platformData = analytics?.users_by_platform
    ? Object.entries(analytics.users_by_platform).map(([name, value]) => ({ name, value }))
    : [];

  // Risk data
  const riskData = analytics?.risk_distribution
    ? Object.entries(analytics.risk_distribution)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Deep insights into platform performance and user behavior</p>
        </div>

        {/* Financial KPIs */}
        <div className="grid-4 mb-24">
          <div className="card" style={{ borderTop: '3px solid #7C3AED' }}>
            <div className="metric-label">Premium Collected</div>
            <div className="metric-value" style={{ color: '#7C3AED' }}>
              Rs. {(analytics?.total_premium_collected ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--green)' }}>
            <div className="metric-label">Claims Disbursed</div>
            <div className="metric-value text-green">
              Rs. {(analytics?.total_claims_paid ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--brand)' }}>
            <div className="metric-label">Net Position</div>
            <div className="metric-value text-blue">
              Rs. {((analytics?.total_premium_collected ?? 0) - (analytics?.total_claims_paid ?? 0)).toLocaleString()}
            </div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--yellow)' }}>
            <div className="metric-label">BCR</div>
            <div className="metric-value text-yellow">{analytics?.bcr ?? 0}</div>
            <div className="metric-sub">Target: &lt; 0.65</div>
          </div>
        </div>

        {/* Claims Timeline */}
        <div className="card mb-24">
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>Claims Activity Over Time</h3>
          {claimsTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={claimsTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                <Tooltip />
                <Area type="monotone" dataKey="paid" stackId="1" stroke="#10B981" fill="rgba(16,185,129,0.2)" name="Paid" />
                <Area type="monotone" dataKey="blocked" stackId="1" stroke="#EF4444" fill="rgba(239,68,68,0.2)" name="Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-3" style={{ padding: 60 }}>No claims data available yet</div>
          )}
        </div>

        {/* Distribution Charts */}
        <div className="grid-2 mb-24">
          {/* Users by City */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Geographic Distribution</h3>
            {cityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No data available</div>
            )}
          </div>

          {/* Earnings Distribution */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Daily Earnings Distribution</h3>
            {earningsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Workers" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No data available</div>
            )}
          </div>
        </div>

        {/* Risk + Platform */}
        <div className="grid-2 mb-24">
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Risk Zone Distribution</h3>
            {riskData.length > 0 ? (
              <div className="flex items-center" style={{ gap: 24 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label>
                      {riskData.map((_, i) => (
                        <Cell key={i} fill={['#10B981', '#F59E0B', '#EF4444'][i % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {riskData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-8 mb-12">
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: ['#10B981', '#F59E0B', '#EF4444'][i % 3] }} />
                      <div>
                        <div className="font-600" style={{ fontSize: 13 }}>{item.name}</div>
                        <div className="text-3" style={{ fontSize: 11 }}>{item.value} users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No data available</div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Platform Distribution</h3>
            {platformData.length > 0 ? (
              <div className="flex items-center" style={{ gap: 24 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={platformData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label>
                      {platformData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {platformData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-8 mb-12">
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                      <div>
                        <div className="font-600" style={{ fontSize: 13 }}>{item.name}</div>
                        <div className="text-3" style={{ fontSize: 11 }}>{item.value} users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-3" style={{ padding: 40 }}>No data available</div>
            )}
          </div>
        </div>

        {/* Claim Amount Timeline */}
        {claimsTimeline.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Claim Amount Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={claimsTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-3)" />
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} name="Amount" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
