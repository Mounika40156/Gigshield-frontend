import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap" style={{ maxWidth: 420 }}>
        <div className="auth-logo">
          <div className="auth-logo-mark" style={{ background: '#7C3AED' }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M8 1L2 4v4c0 3.5 2.6 6.5 6 7.5 3.4-1 6-4 6-7.5V4L8 1z" />
            </svg>
          </div>
          <span className="auth-logo-name">GigShield Admin</span>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, marginBottom: 4 }}>Admin Login</h2>
          <p className="text-2" style={{ fontSize: 13, marginBottom: 20 }}>
            Sign in to access the admin dashboard
          </p>

          {error && (
            <div className="alert alert-red mb-16" style={{ padding: '10px 14px' }}>
              <span className="alert-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || !username || !password}
              style={{ justifyContent: 'center', padding: '11px 18px', background: '#7C3AED' }}
            >
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <div
            className="text-center mt-16"
            style={{ fontSize: 12, color: 'var(--text-3)' }}
          >
            Default credentials: admin / admin123
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/')}
            style={{ fontSize: 12 }}
          >
            Back to GigShield App
          </button>
        </div>
      </div>
    </div>
  );
}
