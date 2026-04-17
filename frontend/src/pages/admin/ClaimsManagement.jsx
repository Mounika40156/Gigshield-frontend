import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';

const STATUS_OPTIONS = ['PAID', 'FRAUD BLOCKED', 'PROCESSING', 'REVERSED'];

export default function ClaimsManagement() {
  const { claims, fetchClaims, updateClaim, deleteClaim } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingClaim, setEditingClaim] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const filtered = claims.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (c.id || '').toLowerCase().includes(q) ||
      (c.trigger || '').toLowerCase().includes(q) ||
      (c.channel || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (claim) => {
    setEditingClaim(claim.id);
    setEditForm({
      status: claim.status || 'PAID',
      fraud_reason: claim.fraud_reason || '',
    });
  };

  const handleSave = async () => {
    const updates = { status: editForm.status };
    if (editForm.fraud_reason) updates.fraud_reason = editForm.fraud_reason;
    const result = await updateClaim(editingClaim, updates);
    if (!result.error) {
      setMessage('Claim updated successfully');
      setEditingClaim(null);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleDelete = async (claimId) => {
    if (!window.confirm(`Delete claim ${claimId}? This cannot be undone.`)) return;
    const result = await deleteClaim(claimId);
    if (!result.error) {
      setMessage('Claim deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const stats = {
    total: claims.length,
    paid: claims.filter((c) => c.status === 'PAID').length,
    blocked: claims.filter((c) => c.status === 'FRAUD BLOCKED').length,
    totalAmount: claims.filter((c) => c.status === 'PAID').reduce((s, c) => s + (c.amount || 0), 0),
  };

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Claims Management</h1>
          <p>Review, approve, and manage all insurance claims</p>
        </div>

        {message && (
          <div className={`alert ${message.startsWith('Error') ? 'alert-red' : 'alert-green'} mb-16`}>
            <span>{message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid-4 mb-20">
          <div className="metric-card">
            <div className="metric-label">Total Claims</div>
            <div className="metric-value">{stats.total}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Paid</div>
            <div className="metric-value text-green">{stats.paid}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Blocked</div>
            <div className="metric-value text-red">{stats.blocked}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Disbursed</div>
            <div className="metric-value">Rs. {stats.totalAmount.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-12 mb-16">
          <input
            className="form-input"
            style={{ maxWidth: 280 }}
            placeholder="Search by claim ID, trigger, or channel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="FRAUD BLOCKED">Fraud Blocked</option>
            <option value="PROCESSING">Processing</option>
          </select>
          <span className="badge badge-blue ml-auto">{filtered.length} claims</span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Date</th>
                <th>Trigger</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Channel</th>
                <th>Processed In</th>
                <th>Auto-Triggered</th>
                <th>Fraud Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-3" style={{ padding: 40 }}>
                    {search || statusFilter !== 'ALL' ? 'No claims match your filters' : 'No claims processed yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((claim) => (
                  <tr key={claim.id}>
                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{claim.id}</td>
                    <td>{claim.date}</td>
                    <td>{claim.trigger}</td>
                    <td className="font-600">
                      {claim.amount > 0 ? `Rs. ${claim.amount.toLocaleString()}` : '-'}
                    </td>
                    <td>
                      {editingClaim === claim.id ? (
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: 12, width: 130 }}
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${claim.status === 'PAID' ? 'badge-green' : claim.status === 'FRAUD BLOCKED' ? 'badge-red' : 'badge-yellow'}`}>
                          {claim.status}
                        </span>
                      )}
                    </td>
                    <td>{claim.channel || '-'}</td>
                    <td>{claim.processed_in || '-'}</td>
                    <td>
                      {claim.auto_triggered ? (
                        <span className="badge badge-blue">Auto</span>
                      ) : (
                        <span className="badge badge-gray">Manual</span>
                      )}
                    </td>
                    <td>
                      {editingClaim === claim.id ? (
                        <input
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: 12, width: 140 }}
                          placeholder="Fraud reason..."
                          value={editForm.fraud_reason}
                          onChange={(e) => setEditForm({ ...editForm, fraud_reason: e.target.value })}
                        />
                      ) : (
                        <span className="text-3" style={{ fontSize: 12 }}>{claim.fraud_reason || '-'}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-6">
                        {editingClaim === claim.id ? (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingClaim(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(claim)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(claim.id)}>Delete</button>
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
