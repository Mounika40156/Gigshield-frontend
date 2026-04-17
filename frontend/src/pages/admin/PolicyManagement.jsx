import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';

const STATUS_OPTIONS = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED'];
const PLAN_OPTIONS = ['Basic', 'Standard', 'Premium'];

export default function PolicyManagement() {
  const { policies, fetchPolicies, updatePolicy, deletePolicy } = useAdmin();
  const [search, setSearch] = useState('');
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const filtered = policies.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.user_id || '').toLowerCase().includes(q) ||
      (p.user_name || '').toLowerCase().includes(q) ||
      (p.plan || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q)
    );
  });

  const handleEdit = (policy) => {
    setEditingPolicy(policy.user_id);
    setEditForm({
      plan: policy.plan || 'Standard',
      status: policy.status || 'ACTIVE',
      max_payout: policy.max_payout || 3000,
    });
  };

  const handleSave = async () => {
    const result = await updatePolicy(editingPolicy, editForm);
    if (!result.error) {
      setMessage('Policy updated successfully');
      setEditingPolicy(null);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(`Delete policy for user ${userId}? This cannot be undone.`)) return;
    const result = await deletePolicy(userId);
    if (!result.error) {
      setMessage('Policy deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const stats = {
    total: policies.length,
    active: policies.filter((p) => p.status === 'ACTIVE').length,
    totalPremium: policies.reduce((s, p) => s + (p.premium || 0), 0),
  };

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Policy Management</h1>
          <p>Manage all insurance policies across the platform</p>
        </div>

        {message && (
          <div className={`alert ${message.startsWith('Error') ? 'alert-red' : 'alert-green'} mb-16`}>
            <span>{message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid-3 mb-20">
          <div className="metric-card">
            <div className="metric-label">Total Policies</div>
            <div className="metric-value">{stats.total}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Policies</div>
            <div className="metric-value text-green">{stats.active}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Premium</div>
            <div className="metric-value">Rs. {stats.totalPremium.toLocaleString()}</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between mb-16">
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder="Search by user ID, name, plan, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-blue">{filtered.length} policies</span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Plan</th>
                <th>Premium</th>
                <th>Max Payout</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Claims Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-3" style={{ padding: 40 }}>
                    {search ? 'No policies match your search' : 'No policies created yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((policy) => (
                  <tr key={policy.user_id}>
                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{policy.user_id}</td>
                    <td className="font-600">{policy.user_name || 'Unknown'}</td>
                    <td>
                      {editingPolicy === policy.user_id ? (
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: 12, width: 100 }}
                          value={editForm.plan}
                          onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                        >
                          {PLAN_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge badge-blue">{policy.plan}</span>
                      )}
                    </td>
                    <td>Rs. {policy.premium}</td>
                    <td>
                      {editingPolicy === policy.user_id ? (
                        <input
                          className="form-input"
                          type="number"
                          style={{ padding: '4px 8px', fontSize: 12, width: 80 }}
                          value={editForm.max_payout}
                          onChange={(e) => setEditForm({ ...editForm, max_payout: parseInt(e.target.value) || 0 })}
                        />
                      ) : (
                        `Rs. ${policy.max_payout}`
                      )}
                    </td>
                    <td>{policy.start_date}</td>
                    <td>{policy.end_date}</td>
                    <td>
                      {editingPolicy === policy.user_id ? (
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: 12, width: 110 }}
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${policy.status === 'ACTIVE' ? 'badge-green' : policy.status === 'EXPIRED' ? 'badge-gray' : 'badge-red'}`}>
                          {policy.status}
                        </span>
                      )}
                    </td>
                    <td>{policy.claims_used ?? 0}</td>
                    <td>
                      <div className="flex gap-6">
                        {editingPolicy === policy.user_id ? (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingPolicy(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(policy)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(policy.user_id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
