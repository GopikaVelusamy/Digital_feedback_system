// ============================================================
// Sidebar.jsx — Premium Glassmorphic Shared Sidebar
// Cohesive Theme: Emerald, Crimson, and Gold accents on Dark Forest
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLanguage, setLanguage } from '../utils/translations';
import { API } from '../config';

export default function Sidebar({ variant = 'admin' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
  const [language, setLanguageState] = useState(getLanguage());
  const [pendingCount, setPendingCount] = useState(0);

  const isDashboard = location.pathname === '/dashboard';
  const isCritical = location.pathname === '/critical-issues';
  const isSuperAdmin = location.pathname === '/super-admin';

  useEffect(() => {
    const handleLangChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const res = await fetch(`${API}/api/feedbacks`);
        if (res.ok) {
          const data = await res.json();
          const pending = data.filter(f => f.status !== 'Solved').length;
          setPendingCount(pending);
        }
      } catch (err) {
        console.error('Error fetching unresolved count:', err);
      }
    }
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileSidebar = () => setIsOpenMobile(prev => !prev);
  const toggleDesktopCollapse = () => setIsCollapsedDesktop(prev => !prev);

  const handleLogoutSuper = () => {
    localStorage.removeItem('VERIFIED_VARUN');
    localStorage.removeItem('super_verified');
    navigate('/super-login');
  };

  const isSuperUser = localStorage.getItem('VERIFIED_VARUN') === 'YES';
  const effectiveVariant = isSuperUser ? 'superadmin' : variant;

  const menuItemsSuper = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', active: isDashboard },
    { path: '/critical-issues', icon: 'warning', label: 'Critical Issues', active: isCritical },
    { path: '/super-admin', icon: 'admin_panel_settings', label: 'Super Admin', active: isSuperAdmin },
  ];

  const menuItemsAdmin = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', active: isDashboard },
    { path: '/critical-issues', icon: 'warning', label: 'Critical Issues', active: isCritical },
    { path: '/super-login', icon: 'admin_panel_settings', label: 'Super Admin', active: location.pathname === '/super-login' || location.pathname === '/super_login' },
  ];

  const menuItems = effectiveVariant === 'superadmin' ? menuItemsSuper : menuItemsAdmin;

  return (
    <>
      {/* ── MOBILE NAVBAR/MENU BUTTON ── */}
      {!isOpenMobile && (
        <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="p-3 bg-emerald-950/90 border border-emerald-800/40 rounded-xl text-emerald-400 hover:text-white transition shadow-lg backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      )}

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
        <div className="pb-4 mb-4 border-b border-emerald-200/50">
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center flex-shrink-0 p-0.5 shadow-md shadow-emerald-700/10">
                <img src="/irratai_ellai.png" className="w-full h-full object-contain" alt="Logo" />
              </div>
              {!isCollapsedDesktop && (
                <div className="flex flex-col transition-all duration-300 flex-1">
                  <h1 className="font-black text-[10px] text-[#064e3b] leading-tight" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
                    அனைத்திந்திய அண்ணா<br />திராவிட முன்னேற்ற<br />கழகம்
                  </h1>
                  <p className="text-[7px] font-extrabold text-emerald-800 uppercase tracking-tighter mt-1 leading-none">
                    ALL INDIA ANNA DRAVIDA MUNNETRA KAZHAGAM
                  </p>
                </div>
              )}
            </div>
            
            {/* Mobile close button on the right side of the drawer */}
            {isOpenMobile && (
              <button
                onClick={toggleMobileSidebar}
                className="lg:hidden p-2 rounded-xl bg-emerald-50 hover:bg-red-50 text-emerald-800 hover:text-red-600 transition border border-emerald-100 flex-shrink-0"
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">close</span>
              </button>
            )}
          </div>
          {!isCollapsedDesktop && (
            <div className="mt-3 bg-emerald-50/50 border border-emerald-100/50 rounded-lg p-2 text-center">
              <p className="text-[8px] font-black text-emerald-800 tracking-wider my-0.5 leading-none">
                PEACE · PROSPERITY · PROGRESS
              </p>
              <p className="text-[8px] font-bold text-emerald-700 tracking-wider my-0.5 leading-none" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                அமைதி · வளம் · வளர்ச்சி
              </p>
            </div>
          )}
        </div>

        {/* Language Selection Toggle */}
        {!isCollapsedDesktop && (
          <div className="flex gap-2 mb-4 bg-emerald-50/30 p-1 rounded-xl border border-emerald-100/30">
            <button
              onClick={() => {
                setLanguage('English');
                setLanguageState('English');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
                language === 'English'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('Tamil');
                setLanguageState('Tamil');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
                language === 'Tamil'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50'
              }`}
            >
              தமிழ்
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item, idx) => {
            const isActive = item.active;
            const isCriticalItem = item.path === '/critical-issues';
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
                  <span className="text-sm tracking-wide flex-1">{item.label}</span>
                )}
                {isCriticalItem && pendingCount > 0 && (!isCollapsedDesktop || isOpenMobile) && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-5 h-5 shadow-sm">
                    {pendingCount}
                  </span>
                )}

                {/* Collapsed tooltip for desktop */}
                {isCollapsedDesktop && !isOpenMobile && (
                  <div className="absolute left-16 bg-white border border-emerald-200/80 text-emerald-800 text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.label} {isCriticalItem && pendingCount > 0 ? `(${pendingCount})` : ''}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* System Health Card */}
        {(!isCollapsedDesktop || isOpenMobile) && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/30">
            <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-emerald-600">dns</span>
              System Health
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">Live Feed</span>
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">Unresolved</span>
                <span className="text-red-600 font-black">
                  {pendingCount} {pendingCount === 1 ? 'Issue' : 'Issues'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">Last Sync</span>
                <span className="text-emerald-800 font-bold">Just Now</span>
              </div>
            </div>
          </div>
        )}

        {/* User profile / Logout footer */}
        <div className="pt-6 border-t border-emerald-200/50">
          {effectiveVariant === 'superadmin' ? (
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
