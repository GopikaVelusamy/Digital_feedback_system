// ============================================================
// Sidebar.jsx — Premium Glassmorphic Shared Sidebar
// Cohesive Theme: Emerald, Crimson, and Gold accents on Dark Forest
// ============================================================
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ variant = 'admin' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);

  const isDashboard = location.pathname === '/dashboard';
  const isCritical = location.pathname === '/critical-issues';
  const isSuperAdmin = location.pathname === '/super-admin';

  const toggleMobileSidebar = () => setIsOpenMobile(prev => !prev);
  const toggleDesktopCollapse = () => setIsCollapsedDesktop(prev => !prev);

  const handleLogoutSuper = () => {
    localStorage.removeItem('VERIFIED_VARUN');
    navigate('/super-login');
  };

  const menuItemsSuper = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/critical-issues', icon: 'warning', label: 'Critical Issues' },
    { path: '/super-admin', icon: 'admin_panel_settings', label: 'Super Admin', active: true },
  ];

  const menuItemsAdmin = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', active: isDashboard },
    { path: '/critical-issues', icon: 'warning', label: 'Critical Issues', active: isCritical },
    { path: '/super-login', icon: 'admin_panel_settings', label: 'Super Admin' },
  ];

  const menuItems = variant === 'superadmin' ? menuItemsSuper : menuItemsAdmin;

  return (
    <>
      {/* ── MOBILE NAVBAR/MENU BUTTON ── */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="p-3 bg-emerald-950/90 border border-emerald-800/40 rounded-xl text-emerald-400 hover:text-white transition shadow-lg backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isOpenMobile ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* ── MOBILE DRAWER BACKDROP ── */}
      {isOpenMobile && (
        <div
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* ── SIDEBAR CONTAINER (DESKTOP & MOBILE SIDEBAR) ── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col p-5
          border-r border-emerald-200/60 shadow-2xl transition-all duration-300 ease-out
          ${isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsedDesktop ? 'lg:w-20' : 'lg:w-72'}
          bg-[#ffffff]/90 lg:bg-white/80 backdrop-blur-2xl
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-emerald-200/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center flex-shrink-0 p-0.5 shadow-md shadow-emerald-700/10">
              <img src="/irratai_ellai.png" className="w-full h-full object-contain" alt="Logo" />
            </div>
            {!isCollapsedDesktop && (
              <div className="flex flex-col transition-all duration-300">
                <h1 className="font-extrabold text-[15px] text-[#064e3b] tracking-tight leading-tight">ADMK Feedback</h1>
                <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">
                  {variant === 'superadmin' ? 'Super Admin Portal' : 'Admin Workspace'}
                </p>
              </div>
            )}
          </div>
          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleDesktopCollapse}
            className="hidden lg:flex p-1.5 hover:bg-emerald-100/50 rounded-lg text-emerald-700 hover:text-[#064e3b] transition"
          >
            <span className="material-symbols-outlined text-sm">
              {isCollapsedDesktop ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item, idx) => {
            const isActive = item.active || (variant === 'superadmin' && item.path === '/super-admin' && isSuperAdmin) || (variant === 'admin' && item.path === '/dashboard' && isDashboard) || (variant === 'admin' && item.path === '/critical-issues' && isCritical);
            return (
              <a
                key={idx}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setIsOpenMobile(false);
                }}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-700/20'
                    : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/40'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#15803d] rounded-r-md" />
                )}
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-emerald-600'}`}>
                  {item.icon}
                </span>
                {(!isCollapsedDesktop || isOpenMobile) && (
                  <span className="text-sm tracking-wide">{item.label}</span>
                )}

                {/* Collapsed tooltip for desktop */}
                {isCollapsedDesktop && !isOpenMobile && (
                  <div className="absolute left-16 bg-white border border-emerald-200/80 text-emerald-800 text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* User profile / Logout footer */}
        <div className="pt-6 border-t border-emerald-200/50">
          {variant === 'superadmin' ? (
            <div className={`flex items-center justify-between rounded-xl bg-emerald-100/20 border border-emerald-200/50 ${isCollapsedDesktop ? 'p-1.5' : 'p-3.5'}`}>
              {(!isCollapsedDesktop || isOpenMobile) && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#064e3b] tracking-wide truncate">Varun S.</p>
                  <p className="text-[9px] text-emerald-700 uppercase tracking-widest mt-0.5">Master Admin</p>
                </div>
              )}
              <button
                onClick={handleLogoutSuper}
                className="p-2 hover:bg-red-100/40 rounded-lg text-slate-500 hover:text-red-600 transition"
                title="Logout Super Admin"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className={`flex items-center gap-3 rounded-xl bg-emerald-100/20 border border-emerald-200/50 ${isCollapsedDesktop ? 'p-1.5 justify-center' : 'p-3.5'}`}>
              <img
                className="size-9 rounded-full border-2 border-emerald-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvRLL0IXpl7oX9kYEhuo6N3aVqBGyuqW-DWDIImkz7wT6Y7KWecYC8vPNyjSS9ncF1_QQNDxZ7p7zW5ohISVlqqh97r-p-k4RMakxC6zt2d6YFI-hZrvJw7dnyrnzUSdtGqGjQarLGlDcB85IjzH9rbgZY6yt4Nvw1L3UnU4tV_pVILS2i0MZCwXVOOfHVuu8MXoEamd71CtJ6X-F6H60LUfs6-wZL_rctOhHnqpriy4zh8qbbrt46lCaJGCqu5fXdBYCTr3Xfw"
                alt="Profile"
              />
              {(!isCollapsedDesktop || isOpenMobile) && (
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-[#064e3b] tracking-wide truncate">Varun</p>
                  <p className="text-[9px] text-emerald-700 uppercase tracking-widest mt-0.5">Constituency Admin</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
