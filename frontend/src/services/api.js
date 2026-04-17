/**
 * GigShield API Client
 *
 * Central module for all backend HTTP calls.
 * Frontend hits the FastAPI backend directly on localhost:8000 during dev.
 * In production, change BASE to the deployed backend URL.
 *
 * Every function returns a Promise that resolves to the JSON response.
 * Errors are caught and returned as { error: string } so the UI
 * can handle them gracefully without uncaught exceptions.
 */

const BASE = 'https://gigshield-backend-production.up.railway.app';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.detail || data.error || 'Request failed' };
    }

    return data;
  } catch (err) {
    console.error(`[API] ${path} failed:`, err);
    return { error: err.message || 'Network error' };
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function sendOTP(phone) {
  return request('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export function verifyOTP(phone, otp) {
  return request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });
}

export function registerUser({ name, phone, email, platform, city, vehicleType, dailyEarnings, partnerIdFile }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      phone,
      email,
      platform,
      city,
      vehicle_type: vehicleType || 'Bike',
      daily_earnings: parseFloat(dailyEarnings) || 800,
      partner_id_file: partnerIdFile || null,
    }),
  });
}

export function loginUser(phone, otp) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });
}

// ─── Risk & Premium ──────────────────────────────────────────────────────────

export function assessRisk(city, platform, dailyEarnings = 800) {
  return request('/risk/assess', {
    method: 'POST',
    body: JSON.stringify({ city, platform, daily_earnings: parseFloat(dailyEarnings) || 800 }),
  });
}

export function calculatePremium(plan, city, platform, dailyEarnings = 800) {
  return request('/risk/premium', {
    method: 'POST',
    body: JSON.stringify({
      plan,
      city,
      platform,
      daily_earnings: parseFloat(dailyEarnings) || 800,
    }),
  });
}

export function getHistoricalDisruptions(city) {
  return request(`/risk/disruptions/${encodeURIComponent(city)}`);
}

// ─── Policy ──────────────────────────────────────────────────────────────────

export function activatePolicy(userId, plan) {
  return request('/policy/activate', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, plan }),
  });
}

export function getPolicy(userId) {
  return request(`/policy/${encodeURIComponent(userId)}`);
}

export function renewPolicy(userId) {
  return request(`/policy/${encodeURIComponent(userId)}/renew`, {
    method: 'POST',
  });
}

// ─── Claims & Fraud ──────────────────────────────────────────────────────────

export function processClaim(trigger, workerId = null, autoTriggered = false) {
  return request('/claims/process', {
    method: 'POST',
    body: JSON.stringify({
      trigger,
      worker_id: workerId,
      auto_triggered: autoTriggered,
    }),
  });
}

export function getClaimsHistory() {
  return request('/claims/history');
}

export function runFraudCheck(workerId = null) {
  return request('/claims/fraud-check', {
    method: 'POST',
    body: JSON.stringify({ worker_id: workerId }),
  });
}

export function getFraudStats() {
  return request('/claims/fraud-stats');
}

export function getBCR(userId = null) {
  const params = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
  return request(`/claims/bcr${params}`);
}

export function getWorkers() {
  return request('/claims/workers');
}

export function getWorker(workerId) {
  return request(`/claims/workers/${encodeURIComponent(workerId)}`);
}

// ─── Weather & Monitoring ────────────────────────────────────────────────────

export function fetchWeather(city) {
  return request(`/weather/current/${encodeURIComponent(city)}`);
}

export function fetchPlatformStatus(platform) {
  return request(`/weather/platform/${encodeURIComponent(platform)}`);
}

export function fetchFloodAdvisory(city) {
  return request(`/weather/flood/${encodeURIComponent(city)}`);
}

export function fetchAllMonitoringData(city, platform) {
  return request(`/weather/all?city=${encodeURIComponent(city)}&platform=${encodeURIComponent(platform)}`);
}

// ─── Health Check ────────────────────────────────────────────────────────────

export function healthCheck() {
  return request('/health');
}
