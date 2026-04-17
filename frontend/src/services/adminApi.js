/**
 * Admin API Client
 *
 * All HTTP calls for the admin dashboard. Every function automatically
 * attaches the JWT Bearer token from localStorage.
 */

const BASE = 'https://gigshield-backend-production.up.railway.app';

function getToken() {
  return localStorage.getItem('gs_admin_token') || '';
}

async function adminRequest(path, options = {}) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      return { error: data.detail || data.error || 'Request failed', status: res.status };
    }

    return data;
  } catch (err) {
    console.error(`[AdminAPI] ${path} failed:`, err);
    return { error: err.message || 'Network error' };
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function adminLogin(username, password) {
  return adminRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getAdminProfile() {
  return adminRequest('/admin/profile');
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function getUsers() {
  return adminRequest('/admin/users');
}

export function getUser(userId) {
  return adminRequest(`/admin/users/${encodeURIComponent(userId)}`);
}

export function updateUser(userId, updates) {
  return adminRequest(`/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deleteUser(userId) {
  return adminRequest(`/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

// ─── Policies ────────────────────────────────────────────────────────────────

export function getPolicies() {
  return adminRequest('/admin/policies');
}

export function updatePolicy(userId, updates) {
  return adminRequest(`/admin/policies/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deletePolicy(userId) {
  return adminRequest(`/admin/policies/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

// ─── Claims ──────────────────────────────────────────────────────────────────

export function getClaims() {
  return adminRequest('/admin/claims');
}

export function updateClaim(claimId, updates) {
  return adminRequest(`/admin/claims/${encodeURIComponent(claimId)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deleteClaim(claimId) {
  return adminRequest(`/admin/claims/${encodeURIComponent(claimId)}`, {
    method: 'DELETE',
  });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function getAnalytics() {
  return adminRequest('/admin/analytics');
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function getSettings() {
  return adminRequest('/admin/settings');
}

export function updateSettings(settings) {
  return adminRequest('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ─── Admin Accounts ──────────────────────────────────────────────────────────

export function getAdmins() {
  return adminRequest('/admin/admins');
}

export function createAdmin(data) {
  return adminRequest('/admin/admins', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteAdmin(adminId) {
  return adminRequest(`/admin/admins/${encodeURIComponent(adminId)}`, {
    method: 'DELETE',
  });
}
