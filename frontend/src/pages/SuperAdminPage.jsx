// ============================================================
// SuperAdminPage.jsx — Exact React conversion of superadmin.html
// Admin list, pending resolutions, WhatsApp notify, modal
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageIntelCard from '../components/ImageIntelCard';
import { translationData, getLanguage, setLanguage } from '../utils/translations';
import { API } from '../config';

export default function SuperAdminPage() {
  const navigate = useNavigate();

  // Language state
  const [language, setLanguageState] = useState(getLanguage());
  const t = translationData[language];

  useEffect(() => {
    const handleLangChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const [admins, setAdmins] = useState([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalScale, setModalScale] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function fetchAdmins() {
    try {
      const res = await fetch(`${API}/api/admins`);
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  }

  async function fetchResolutions() {
    try {
      const res = await fetch(`${API}/api/feedbacks`);
      const feedbacks = await res.json();
      const pending = feedbacks.filter((f) => f.status !== 'Solved');
      setPendingFeedbacks(pending);
    } catch (err) {
      console.error('Resolution fetch error:', err);
    }
  }

  async function markSolved(id) {
    if (
      !window.confirm(
        "Are you sure? This will send the official 'Issue Resolved' WhatsApp notification to the citizen."
      )
    )
      return;

    try {
      const res = await fetch(`${API}/api/update-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Solved' }),
      });
      if (res.ok) {
        showSuccessModal();
        fetchResolutions();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ─── showSuccessModal — exact mirror from superadmin.html ───
  function showSuccessModal() {
    setModalVisible(true);
    setTimeout(() => setModalScale(true), 10);
  }

  // ─── closeModal — exact mirror from superadmin.html ─────────
  function closeModal() {
    setModalScale(false);
    setTimeout(() => setModalVisible(false), 300);
  }

  // ─── logout — exact mirror from superadmin.html ─────────────
  function logout() {
    localStorage.removeItem('VERIFIED_VARUN');
    navigate('/super-login');
  }

  useEffect(() => {
    fetchAdmins();
    fetchResolutions();
  }, []);

  return (
    // ─── superadmin.html body structure — exact ──────────────────
    <div
      className="bg-background-light min-h-screen relative font-body text-[#6B7280]"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)',
        color: '#0f291b',
      }}
    >
      {/* Grid background — exact from superadmin.html */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {/* ── Notify Modal — exact from superadmin.html ── */}
      {modalVisible && (
        <div
          id="notifyModal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          style={{ opacity: modalScale ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            id="modalContent"
            className="glass-card p-8 rounded-[2.5rem] max-w-sm w-full text-center"
            style={{
              transform: modalScale ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Issue Resolved</h3>
            <p id="notifyMsg" className="text-gray-500 mb-6 text-sm">
              WhatsApp notification has been sent to the citizen successfully.
            </p>
            <button
              onClick={closeModal}
              className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Great!
            </button>
          </div>
        </div>
      )}

      {/* ── Super Admin UI — exact from superadmin.html ── */}
      <div
        id="superAdminUI"
        className="flex min-w-[1200px] h-screen overflow-x-auto relative z-10"
      >
        <aside style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '320px',
          zIndex: 999,
          overflow: 'hidden',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-340px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 253, 244, 0.85) 100%)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(22, 163, 74, 0.16)',
          boxShadow: '15px 0 45px rgba(22, 163, 74, 0.04)',
          borderRadius: '0px 30px 30px 0px',
          display: 'flex',
          flexDirection: 'column',
          padding: '36px 24px',
        }}>
          {/* Sidebar Header */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', borderBottom:'1px solid rgba(16, 185, 129, 0.15)', paddingBottom:'24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '2px solid #15803d',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img src="/irratai_ellai.png" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#ffffff', fontFamily: 'serif', lineHeight: '1.2' }}>
                <span style={{ color: '#ff4d4d', marginRight: '3px' }}>அனைத்திந்திய</span>
                <span style={{ color: '#ffffff', marginRight: '3px' }}>அண்ணா திராவிட</span>
                <span style={{ color: '#10b981' }}>முன்னேற்றக் கழகம்</span>
              </div>
              <span style={{ 
                fontSize: '9px', 
                color: '#cbd5e1', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em', 
                marginTop: '2px'
              }}>
                All India Anna Dravida Munnetra Kazhagam
              </span>
            </div>
          </div>

          {/* Slogan / Motto */}
          <div style={{
            padding: '10px 14px',
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.01) 100%)',
            borderRadius: '12px',
            border: '1px dashed rgba(22, 163, 74, 0.18)',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
              Peace · Prosperity · Progress
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#4b6b58', opacity: 0.9, fontFamily: 'sans-serif' }}>
              அமைதி · வளம் · வளர்ச்சி
            </div>
          </div>

          {/* Language Selector Capsule */}
          <div style={{
            display: 'flex',
            background: 'rgba(22, 163, 74, 0.05)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(22, 163, 74, 0.12)',
            marginBottom: '20px',
            gap: '4px'
          }}>
            {['English', 'Tamil'].map((lang) => {
              const isSelected = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: isSelected ? '#166534' : 'transparent',
                    color: isSelected ? '#ffffff' : '#4b6b58',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 4px 10px rgba(22, 163, 74, 0.2)' : 'none',
                  }}
                >
                  {lang === 'English' ? 'English' : 'தமிழ்'}
                </button>
              );
            })}
          </div>

          {/* Navigation links */}
          <nav style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[
              { path:'/dashboard',       icon:'dashboard',            label: t.dashboard,       active: location.pathname === '/dashboard', badge: <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span> },
              { path:'/critical-issues', icon:'warning',              label: t.criticalIssues, active: location.pathname === '/critical-issues', badge: <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}>2</span> },
              { path:'/super-admin',     icon:'admin_panel_settings', label: t.superAdmin,     active: location.pathname === '/super-admin' },
            ].map(({ path, icon, label, active, badge }) => (
              <a key={path} href="#"
                onClick={e => { e.preventDefault(); navigate(path); }}
                className={`nav-link-item${active ? ' active' : ''}`}
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:'14px',
                  padding:'14px 18px',
                  borderRadius:'14px',
                  textDecoration:'none',
                  fontSize:'14px',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid transparent',
                  background: active ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  color: active ? '#166534' : '#4b6b58',
                  boxShadow: active ? '0 4px 12px rgba(22, 163, 74, 0.05)' : 'none',
                  transition: 'all 0.2s ease',
                  borderLeft: active ? '4px solid #166534' : '4px solid transparent',
                  paddingLeft: active ? '14px' : '18px'
                }}>
                <span className="material-symbols-outlined" style={{ fontSize:'22px', color: active ? '#166534' : '#4b6b58' }}>{icon}</span>
                <span style={{ letterSpacing: '0.01em' }}>{label}</span>
                {badge && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>{badge}</div>}
                {!badge && active && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', marginLeft: 'auto', color: '#166534' }}>
                    chevron_right
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Live System Health Widget */}
          <div style={{
            margin: '24px 0',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 253, 244, 0.3) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(22, 163, 74, 0.12)',
            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#166534' }}>analytics</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f291b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.systemHealth}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#4b6b58', fontWeight: 500 }}>{t.liveFeed}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
                  {t.active}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#4b6b58', fontWeight: 500 }}>{t.unresolved}</span>
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 800 }}>{t.issuesCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#4b6b58', fontWeight: 500 }}>{t.lastSync}</span>
                <span style={{ fontSize: '12px', color: '#4b6b58', fontWeight: 700 }}>{t.justNow}</span>
              </div>
            </div>
          </div>

          {/* Profile bottom block */}
          <div style={{ marginTop:'auto', padding:'16px', background:'rgba(255, 255, 255, 0.8)',
            borderRadius:'16px', border:'1px solid rgba(22, 163, 74, 0.15)',
            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.05)',
            display:'flex', alignItems:'center', justifyContent: 'space-between', gap:'10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #15803d 0%, #0d5c2c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
                border: '2px solid rgba(22, 163, 74, 0.25)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }}>
                VS
              </div>
              <div style={{ overflow:'hidden' }}>
                <div style={{ fontSize:'12px', fontWeight:800, color:'#0f291b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Varun S.</div>
                <div style={{ fontSize:'10px', color:'#4b6b58', fontWeight: 600, opacity:0.8 }}>Master Admin</div>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4b6b58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4b6b58'; e.currentTarget.style.background = 'none'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            </button>
          </div>
        </aside>

        {/* Main — exact from superadmin.html */}
        <main className="flex-1 overflow-y-auto p-8 min-w-[900px]" style={{
          marginLeft: sidebarOpen ? '320px' : '0px',
          transition: 'margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header — exact from superadmin.html */}
          <header className="flex items-center justify-between mb-10">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ fontSize: '44px', fontWeight: 900, color: '#0f291b', letterSpacing: '-0.04em', margin: 0 }}>
                {t.systemControlPanel}
              </h2>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/create-admin'); }}
                className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg"
              >
                <span className="material-symbols-outlined">person_add</span>
                {t.assignNewAdmin}
              </a>
            </div>
          </header>

          {/* Grid Content — exact from superadmin.html */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Active Admin Accounts — exact from superadmin.html */}
            <section className="xl:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">key</span>
                  {t.activeAdminAccounts}
                </h3>
                <div id="adminList" className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">{language === 'English' ? 'Loading admins...' : 'நிர்வாகிகள் ஏற்றப்படுகிறது...'}</p>
                  ) : (
                    admins.map((a, idx) => (
                      // Each admin card — exact HTML from superadmin.html
                      <div
                        key={idx}
                        className="p-4 bg-white/40 rounded-xl border border-white/60"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800 text-sm">{a.name}</span>
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                            {a.district || 'All'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2">{a.email}</p>
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded text-[10px] font-mono border border-gray-200">
                          <span className="material-symbols-outlined text-xs">lock</span>
                          Pass:{' '}
                          <span className="font-black text-gray-800">{a.password}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Pending Resolutions — exact from superadmin.html */}
            <section className="xl:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">campaign</span>
                  Pending Resolutions
                </h3>
                <div id="resolverList" className="space-y-4">
                  {pendingFeedbacks.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No pending resolutions. All caught up! ✅
                    </p>
                  ) : (
                    pendingFeedbacks.map((f, idx) => {
                      const validation = f.image_validation;
                      const risk       = validation?.overall_risk || 0;
                      const riskColor  = risk >= 65 ? '#EF4444' : risk >= 35 ? '#F59E0B' : '#10B981';
                      return (
                        <div key={idx}
                          className="p-5 glass-card rounded-xl flex items-center justify-between resolver-item"
                          style={{ borderLeft: `4px solid ${validation ? riskColor : '#f97316'}` }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">
                                {f.feedback?.type || f.type_of_feedback || 'General'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold tracking-widest">
                                {f.location?.district || f.district || ''}
                              </span>
                              {validation && <ImageIntelCard validation={validation} compact />}
                            </div>
                            <p className="text-xs font-bold text-gray-700 mb-2 italic">
                              "{(f.feedback?.original_text || f.feedback_text || 'No text').substring(0, 75)}..."
                            </p>
                            <div className="flex gap-4 text-[10px] font-semibold text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">alternate_email</span>
                                {f.user?.email || f.email || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">call</span>
                                {f.user?.mobile_masked || f.booth_no || 'No Phone'}
                              </span>
                              {validation?.layers?.exif_geofence?.lat && (
                                <span className="flex items-center gap-1" style={{ color:'#10B981' }}>
                                  <span className="material-symbols-outlined text-xs">location_on</span>
                                  {validation.layers.exif_geofence.lat.toFixed(3)}, {validation.layers.exif_geofence.lon.toFixed(3)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => markSolved(f._id)}
                            className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase hover:bg-green-700 transition active:scale-95 flex items-center gap-2 ml-4"
                          >
                            <span className="material-symbols-outlined text-sm">notifications_active</span>
                            RESOLVE & NOTIFY
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
