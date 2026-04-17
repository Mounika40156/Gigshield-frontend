import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as adminApi from '../services/adminApi';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside AdminProvider');
  return context;
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gs_admin')) || null; } catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem('gs_admin_token') || null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setThemeState] = useState(() => localStorage.getItem('gs_admin_theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('gs_admin_theme', theme);
  }, [theme]);

  const setTheme = (t) => {
    setThemeState(t);
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('gs_admin_theme', t);
  };

  useEffect(() => {
    localStorage.setItem('gs_admin', JSON.stringify(admin));
  }, [admin]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('gs_admin_token', token);
    } else {
      localStorage.removeItem('gs_admin_token');
    }
  }, [token]);

  const login = async (username, password) => {
    const result = await adminApi.adminLogin(username, password);
    if (result.error) return result;

    setToken(result.access_token);
    setAdmin(result.admin);
    localStorage.setItem('gs_admin_token', result.access_token);
    return result;
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    setAnalytics(null);
    setUsers([]);
    setPolicies([]);
    setClaims([]);
    setSettings(null);
    localStorage.removeItem('gs_admin');
    localStorage.removeItem('gs_admin_token');
  };

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.getAnalytics();
    if (!data.error) setAnalytics(data);
    setLoading(false);
    return data;
  }, []);

  const fetchUsers = useCallback(async () => {
    const data = await adminApi.getUsers();
    if (!data.error) setUsers(data.users || []);
    return data;
  }, []);

  const fetchPolicies = useCallback(async () => {
    const data = await adminApi.getPolicies();
    if (!data.error) setPolicies(data.policies || []);
    return data;
  }, []);

  const fetchClaims = useCallback(async () => {
    const data = await adminApi.getClaims();
    if (!data.error) setClaims(data.claims || []);
    return data;
  }, []);

  const fetchSettings = useCallback(async () => {
    const data = await adminApi.getSettings();
    if (!data.error) setSettings(data);
    return data;
  }, []);

  const handleUpdateUser = async (userId, updates) => {
    const result = await adminApi.updateUser(userId, updates);
    if (!result.error) await fetchUsers();
    return result;
  };

  const handleDeleteUser = async (userId) => {
    const result = await adminApi.deleteUser(userId);
    if (!result.error) await fetchUsers();
    return result;
  };

  const handleUpdatePolicy = async (userId, updates) => {
    const result = await adminApi.updatePolicy(userId, updates);
    if (!result.error) await fetchPolicies();
    return result;
  };

  const handleDeletePolicy = async (userId) => {
    const result = await adminApi.deletePolicy(userId);
    if (!result.error) await fetchPolicies();
    return result;
  };

  const handleUpdateClaim = async (claimId, updates) => {
    const result = await adminApi.updateClaim(claimId, updates);
    if (!result.error) await fetchClaims();
    return result;
  };

  const handleDeleteClaim = async (claimId) => {
    const result = await adminApi.deleteClaim(claimId);
    if (!result.error) await fetchClaims();
    return result;
  };

  const handleUpdateSettings = async (newSettings) => {
    const result = await adminApi.updateSettings(newSettings);
    if (!result.error) setSettings(result);
    return result;
  };

  return (
    <AdminContext.Provider
      value={{
        admin, token, loading,
        theme, setTheme,
        analytics, users, policies, claims, settings,
        login, logout,
        fetchAnalytics, fetchUsers, fetchPolicies, fetchClaims, fetchSettings,
        updateUser: handleUpdateUser,
        deleteUser: handleDeleteUser,
        updatePolicy: handleUpdatePolicy,
        deletePolicy: handleDeletePolicy,
        updateClaim: handleUpdateClaim,
        deleteClaim: handleDeleteClaim,
        updateSettings: handleUpdateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
