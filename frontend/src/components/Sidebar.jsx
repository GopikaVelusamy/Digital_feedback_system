// ============================================================
// Sidebar.jsx — Shared Sidebar Component
// Used in: Dashboard, CriticalIssues, SuperAdmin pages
// Exact HTML structure from original files preserved
// ============================================================
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ variant = 'admin' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [closed, setClosed] = useState(false);

  const isDashboard = location.pathname === '/dashboard';
  const isCritical = location.pathname === '/critical-issues';
  const isSuperAdmin = location.pathname === '/super-admin';

  // Toggle sidebar open/closed (mirrors original JS toggle)
  const toggleSidebar = () => setClosed((prev) => !prev);

  if (variant === 'superadmin') {
    return (
      <>
        {/* Super Admin Sidebar — mirrors superadmin.html aside */}
        <aside className="w-72 min-w-[288px] glass-card h-screen sticky top-0 flex flex-col p-6 m-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-10 border-b border-green-800/10 pb-5">
            <div className="size-10 bg-gradient-to-br from-emerald-600 to-green-800 rounded-xl flex items-center justify-center text-white border border-white/25 shadow-md flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">insights</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#0f291b] leading-tight tracking-tight">InsightFlow</h1>
              <p className="text-xs font-bold text-[#4b6b58] uppercase tracking-wider mt-0.5" style={{ fontSize: '9px' }}>Super Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-200/40 transition"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/critical-issues'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-200/40 transition"
            >
              <span className="material-symbols-outlined">warning</span>
              <span className="font-medium">Critical Issues</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/super-admin'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span>Super Admin</span>
            </a>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/40">
            <div className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Varun S.</p>
                <p className="text-xs text-gray-500 uppercase">Master Admin</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('VERIFIED_VARUN');
                  navigate('/super-login');
                }}
                className="material-symbols-outlined text-gray-500 hover:text-red-500"
              >
                logout
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // ─── Admin Sidebar (Dashboard / Critical Issues) ───────────
  return (
    <>
      {/* Menu button — mirrors original ☰ button */}
      <button
        id="menuBtn"
        onClick={toggleSidebar}
        className="text-2xl text-[#9CA3AF] hover:text-[#1F2937] transition fixed top-6 left-6 z-[200]"
        style={{ position: 'relative', zIndex: 200, display: 'block' }}
      >
        ☰
      </button>

      {/* Sidebar — mirrors original aside#sidebar */}
      <aside
        id="sidebar"
        className={`w-72 transition-transform duration-300 flex flex-col glass-panel border-r border-white/20 m-4 rounded-xl${closed ? ' closed' : ''}`}
        style={closed ? { width: 0, padding: 0, overflow: 'hidden' } : {}}
      >
        <div className="p-6 flex items-center gap-3 border-b border-green-800/10 pb-5">
          <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
            <img src="/irratai_ellai.png" className="w-8 h-8 object-contain" alt="Logo" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#0f291b] leading-tight tracking-tight">ADMK Feedback</h1>
            <p className="text-xs font-bold text-[#4b6b58] uppercase tracking-wider mt-0.5" style={{ fontSize: '9px' }}>Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Dashboard */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={`nav-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300${isDashboard ? ' active-link' : ''}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Dashboard</span>
          </a>

          {/* Critical Issues */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/critical-issues'); }}
            className={`nav-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300${isCritical ? ' active-link' : ''}`}
          >
            <span className="material-symbols-outlined">warning</span>
            <span className="font-medium">Critical Issues</span>
          </a>

          {/* Super Admin */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/super-login'); }}
            className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="font-medium">Super Admin</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <img
              className="size-10 rounded-full border-2 border-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvRLL0IXpl7oX9kYEhuo6N3aVqBGyuqW-DWDIImkz7wT6Y7KWecYC8vPNyjSS9ncF1_QQNDxZ7p7zW5ohISVlqqh97r-p-k4RMakxC6zt2d6YFI-hZrvJw7dnyrnzUSdtGqGjQarLGlDcB85IjzH9rbgZY6yt4Nvw1L3UnU4tV_pVILS2i0MZCwXVOOfHVuu8MXoEamd71CtJ6X-F6H60LUfs6-wZL_rctOhHnqpriy4zh8qbbrt46lCaJGCqu5fXdBYCTr3Xfw"
              alt="User profile avatar"
            />
            <div className="overflow-hidden">
              <p className="text-xs uppercase tracking-wider font-bold truncate">Varun</p>
              <p className="text-xs opacity-60 truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
