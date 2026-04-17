import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';

export default function Settings() {
  const { admin, settings, fetchSettings, updateSettings } = useAdmin();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings && !form) {
      setForm({ ...settings });
    }
  }, [settings, form]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSettings(form);
    setSaving(false);
    if (!result.error) {
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleReset = () => {
    if (settings) setForm({ ...settings });
  };

  const isSuperAdmin = admin?.role === 'super_admin';

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Platform Settings</h1>
          <p>Configure platform-wide settings and thresholds</p>
        </div>

        {message && (
          <div className={`alert ${message.startsWith('Error') ? 'alert-red' : 'alert-green'} mb-16`}>
            <span>{message}</span>
          </div>
        )}

        {!isSuperAdmin && (
          <div className="alert alert-yellow mb-20">
            <span className="alert-icon">!</span>
            <span>Only super admins can modify settings. You have view-only access.</span>
          </div>
        )}

        {form ? (
          <div style={{ maxWidth: 640 }}>
            {/* General Settings */}
            <div className="card mb-20">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>General</h3>

              <div className="flex items-center justify-between mb-16" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="font-600" style={{ fontSize: 13 }}>Demo Mode</div>
                  <div className="text-3" style={{ fontSize: 12 }}>When enabled, OTP is always "1234" and mock data is used</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={form.demo_mode}
                    onChange={(e) => setForm({ ...form, demo_mode: e.target.checked })}
                    disabled={!isSuperAdmin}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: isSuperAdmin ? 'pointer' : 'not-allowed', inset: 0,
                    background: form.demo_mode ? '#7C3AED' : 'var(--surface3)', borderRadius: 24, transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', height: 18, width: 18, left: form.demo_mode ? 22 : 3, bottom: 3,
                      background: 'white', borderRadius: '50%', transition: '0.2s',
                    }} />
                  </span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Default OTP Code</label>
                <input
                  className="form-input"
                  value={form.otp_code}
                  onChange={(e) => setForm({ ...form, otp_code: e.target.value })}
                  disabled={!isSuperAdmin}
                  style={{ maxWidth: 200 }}
                />
              </div>
            </div>

            {/* Claims Settings */}
            <div className="card mb-20">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Claims Configuration</h3>

              <div className="flex items-center justify-between mb-16" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="font-600" style={{ fontSize: 13 }}>Auto-Approve Claims</div>
                  <div className="text-3" style={{ fontSize: 12 }}>Skip fraud check and auto-approve all claims</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={form.auto_approve_claims}
                    onChange={(e) => setForm({ ...form, auto_approve_claims: e.target.checked })}
                    disabled={!isSuperAdmin}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: isSuperAdmin ? 'pointer' : 'not-allowed', inset: 0,
                    background: form.auto_approve_claims ? '#7C3AED' : 'var(--surface3)', borderRadius: 24, transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', height: 18, width: 18, left: form.auto_approve_claims ? 22 : 3, bottom: 3,
                      background: 'white', borderRadius: '50%', transition: '0.2s',
                    }} />
                  </span>
                </label>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Fraud Threshold (0.0 - 1.0)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={form.fraud_threshold}
                    onChange={(e) => setForm({ ...form, fraud_threshold: parseFloat(e.target.value) || 0.5 })}
                    disabled={!isSuperAdmin}
                  />
                  <div className="text-3 mt-4" style={{ fontSize: 11 }}>Lower = stricter fraud detection</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Claims Per Week</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="10"
                    value={form.max_claims_per_week}
                    onChange={(e) => setForm({ ...form, max_claims_per_week: parseInt(e.target.value) || 3 })}
                    disabled={!isSuperAdmin}
                  />
                  <div className="text-3 mt-4" style={{ fontSize: 11 }}>Per user per policy period</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isSuperAdmin && (
              <div className="flex gap-12">
                <button
                  className="btn btn-primary"
                  style={{ background: '#7C3AED' }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <span className="spinner" /> : 'Save Settings'}
                </button>
                <button className="btn btn-ghost" onClick={handleReset}>
                  Reset
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center text-3" style={{ padding: 60 }}>
            Loading settings...
          </div>
        )}
      </div>
    </div>
  );
}
