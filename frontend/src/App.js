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
import CreateConstituencyAdminPage from './pages/CreateConstituencyAdminPage';

// Import global CSS (equivalent to style.css in original project)
import './styles/global.css';

// ─── Route Guards ─────────────────────────────────────────
// Mirrors the inline JS security checks in original HTML files

function AdminRoute({ children }) {
  const userRole = localStorage.getItem('role') || localStorage.getItem('userRole');
  const isSuperVerified = localStorage.getItem('super_verified') === 'true' || localStorage.getItem('VERIFIED_VARUN') === 'YES';
  const currentUser = localStorage.getItem('currentUser');
  const hasAccess = userRole === 'admin' || userRole === 'department_admin' || userRole === 'constituency_admin' || userRole === 'leader' || isSuperVerified || currentUser;
  if (!hasAccess) {
    return <Navigate to="/super-login" replace />;
  }
  return children;
}

function UserRoute({ children }) {
  const user = localStorage.getItem('user') || localStorage.getItem('currentUser');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function SuperAdminRoute({ children }) {
  const isVerified = localStorage.getItem('super_verified') === 'true' || localStorage.getItem('VERIFIED_VARUN') === 'YES';
  const currentUserRaw = localStorage.getItem('currentUser');
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const isConstOrDeptAdmin = currentUser?.role === 'constituency_admin' || currentUser?.role === 'department_admin';
  if (!isVerified || isConstOrDeptAdmin) {
    return <Navigate to="/super-login" replace />;
  }
  return children;
}

// ─── App Root ─────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>
        {/* / → Main public portal (newer colorful FeedbackPage with dark nav + leader photos) */}
        <Route path="/" element={<FeedbackPage />} />

        {/* /login → Old login/signup page (kept for direct admin access) */}
        <Route path="/login" element={<LoginPage />} />

        {/* /feedback → Also serves the main portal (same as /) */}
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* super-login.html → Super Admin login */}
        <Route path="/super-login" element={<SuperLoginPage />} />
        <Route path="/super_login" element={<Navigate to="/super-login" replace />} />

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

        {/* Create constituency admin form */}
        <Route
          path="/create-constituency-admin"
          element={
            <SuperAdminRoute>
              <CreateConstituencyAdminPage />
            </SuperAdminRoute>
          }
        />

        {/* Catch-all → redirect to main portal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
