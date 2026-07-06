// ============================================================
// App.js — InsightFlow React
// This is the root router. All 7 pages are mapped here.
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components
import LoginPage from './pages/LoginPage';
import SuperLoginPage from './pages/SuperLoginPage';
import DashboardPage from './pages/DashboardPage';
import CriticalIssuesPage from './pages/CriticalIssuesPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackDetailPage from './pages/FeedbackDetailPage';
import SuperAdminPage from './pages/SuperAdminPage';
import CreateAdminPage from './pages/CreateAdminPage';

// Import global CSS (equivalent to style.css in original project)
import './styles/global.css';

// ─── Route Guards ─────────────────────────────────────────
// Mirrors the inline JS security checks in original HTML files

function AdminRoute({ children }) {
  const userRole = localStorage.getItem('role');
  const isSuperVerified = localStorage.getItem('super_verified') === 'true';
  const hasAccess = userRole === 'admin' || isSuperVerified;
  if (!hasAccess) {
    alert('Access Denied! Redirecting to login...');
    return <Navigate to="/" replace />;
  }
  return children;
}

function UserRoute({ children }) {
  const user = localStorage.getItem('user');
  if (!user) {
    alert('Please login first');
    return <Navigate to="/" replace />;
  }
  return children;
}

function SuperAdminRoute({ children }) {
  const isVerified = localStorage.getItem('VERIFIED_VARUN') === 'YES';
  if (!isVerified) {
    return <Navigate to="/super-login" replace />;
  }
  return children;
}

// ─── App Root ─────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>
        {/* glass.html → Login / Signup page */}
        <Route path="/" element={<LoginPage />} />

        {/* super-login.html → Super Admin login */}
        <Route path="/super-login" element={<SuperLoginPage />} />

        {/* Dashboard.html → Admin analytics dashboard */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />

        {/* Criticalissues.html → Critical issues monitoring */}
        <Route
          path="/critical-issues"
          element={
            <AdminRoute>
              <CriticalIssuesPage />
            </AdminRoute>
          }
        />

        {/* feedback.html → Citizen feedback submission */}
        <Route
          path="/feedback"
          element={
            <UserRoute>
              <FeedbackPage />
            </UserRoute>
          }
        />

        {/* feedback2.html → Investigation deep-dive (feedback detail) */}
        <Route
          path="/feedback-detail"
          element={
            <AdminRoute>
              <FeedbackDetailPage />
            </AdminRoute>
          }
        />

        {/* superadmin.html → Super admin control panel */}
        <Route
          path="/super-admin"
          element={
            <SuperAdminRoute>
              <SuperAdminPage />
            </SuperAdminRoute>
          }
        />

        {/* createadmin.html → Create new admin form */}
        <Route
          path="/create-admin"
          element={
            <SuperAdminRoute>
              <CreateAdminPage />
            </SuperAdminRoute>
          }
        />

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
