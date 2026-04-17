import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AdminProvider, useAdmin } from './context/AdminContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Policy from './pages/Policy'
import PremiumCalc from './pages/PremiumCalc'
import Claims from './pages/Claims'
import WeatherMonitor from './pages/WeatherMonitor'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import PolicyManagement from './pages/admin/PolicyManagement'
import ClaimsManagement from './pages/admin/ClaimsManagement'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'

function ProtectedRoute({ children }) {
  const context = useApp()

  const user = context?.user

  if (!user) {
    return <Navigate to="/register" replace />
  }

  return children
}

function AdminProtectedRoute({ children }) {
  const { admin, token } = useAdmin()

  if (!admin || !token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function AppRoutes() {
  const context = useApp()
  const user = context?.user

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/policy"
        element={
          <ProtectedRoute>
            <Policy />
          </ProtectedRoute>
        }
      />

      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <PremiumCalc />
          </ProtectedRoute>
        }
      />

      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <Claims />
          </ProtectedRoute>
        }
      />

      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <WeatherMonitor />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <UserManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/policies"
        element={
          <AdminProtectedRoute>
            <PolicyManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/claims"
        element={
          <AdminProtectedRoute>
            <ClaimsManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <Analytics />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <Settings />
          </AdminProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AdminProvider>
    </AppProvider>
  )
}
