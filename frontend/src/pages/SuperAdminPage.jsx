// ============================================================
// SuperAdminPage.jsx — Exact React conversion of superadmin.html
// Admin list, pending resolutions, WhatsApp notify, modal
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageIntelCard from '../components/ImageIntelCard';
import Sidebar from '../components/Sidebar';
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
    // ─── superadmin.html body structure ──────────────────
    <div
      className="min-h-screen relative font-body text-[#064e3b] flex flex-col lg:flex-row"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
      }}
    >
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {/* ── Notify Modal ── */}
      {modalVisible && (
        <div
          id="notifyModal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          style={{ opacity: modalScale ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            id="modalContent"
            className="p-8 rounded-[2.5rem] max-w-sm w-full text-center border border-emerald-250/20 bg-white text-[#064e3b]"
            style={{
              transform: modalScale ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="w-20 h-20 bg-emerald-100 text-[#10b981] border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-[#064e3b] mb-2">Issue Resolved</h3>
            <p id="notifyMsg" className="text-[#047857] mb-6 text-sm font-semibold">
              WhatsApp notification has been sent to the citizen successfully.
            </p>
            <button
              onClick={closeModal}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Great!
            </button>
          </div>
        </div>
      )}

      <Sidebar variant="superadmin" />

      {/* ── Super Admin UI ── */}
      <div
        id="superAdminUI"
        className="flex-1 min-h-screen overflow-x-hidden relative z-10 flex flex-col"
      >
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-8 min-w-0">
          <style>{`
            .glass-card {
              background: rgba(255, 255, 255, 0.75);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border: 1px solid rgba(16, 185, 129, 0.2);
              box-shadow: 0 8px 32px rgba(22, 163, 74, 0.04);
            }
            .admin-item {
              background: rgba(16, 185, 129, 0.08);
              border: 1px solid rgba(16, 185, 129, 0.15);
            }
            .resolver-item {
              background: rgba(255, 255, 255, 0.8);
              border: 1px solid rgba(16, 185, 129, 0.15);
              transition: all 0.2s ease;
            }
            .resolver-item:hover {
              background: rgba(16, 185, 129, 0.08);
              border-color: rgba(16, 185, 129, 0.3);
            }
          `}</style>

          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#064e3b', letterSpacing: '-0.04em', margin: 0 }}>
                {t.systemControlPanel}
              </h2>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/create-admin'); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
              >
                <span className="material-symbols-outlined">person_add</span>
                {t.assignNewAdmin}
              </a>
            </div>
          </header>

          {/* Grid Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Active Admin Accounts */}
            <section className="xl:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#064e3b] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981]">key</span>
                  {t.activeAdminAccounts}
                </h3>
                <div id="adminList" className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="text-sm text-[#047857] text-center py-4 font-semibold">{language === 'English' ? 'Loading admins...' : 'நிர்வாகிகள் ஏற்றப்படுகிறது...'}</p>
                  ) : (
                    admins.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-4 admin-item rounded-xl text-[#064e3b]"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-[#064e3b] text-sm">{a.name}</span>
                          <span className="text-[9px] font-bold bg-white text-[#10b981] border border-emerald-200 px-2 py-0.5 rounded uppercase">
                            {a.district || 'All'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#047857] mb-2 font-semibold">{a.email}</p>
                        <div className="flex items-center gap-2 bg-white p-2 rounded text-[10px] font-mono border border-emerald-100 text-[#047857]">
                          <span className="material-symbols-outlined text-xs">lock</span>
                          Pass:{' '}
                          <span className="font-black text-emerald-950">{a.password}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Pending Resolutions */}
            <section className="xl:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#064e3b] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981]">campaign</span>
                  Pending Resolutions
                </h3>
                <div id="resolverList" className="space-y-4">
                  {pendingFeedbacks.length === 0 ? (
                    <p className="text-sm text-[#047857] text-center py-4 font-semibold">
                      No pending resolutions. All caught up! ✅
                    </p>
                  ) : (
                    pendingFeedbacks.map((f, idx) => {
                      const validation = f.image_validation;
                      const risk       = validation?.overall_risk || 0;
                      const riskColor  = risk >= 65 ? '#EF4444' : risk >= 35 ? '#F59E0B' : '#10B981';
                      return (
                        <div key={idx}
                          className="p-5 rounded-xl flex items-center justify-between resolver-item"
                          style={{ borderLeft: `4px solid ${validation ? riskColor : '#f97316'}` }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold bg-emerald-50 text-[#10b981] border border-emerald-200 px-2 py-0.5 rounded uppercase">
                                {f.feedback?.type || f.type_of_feedback || 'General'}
                              </span>
                              <span className="text-[10px] text-[#047857] font-bold tracking-widest">
                                {f.location?.district || f.district || ''}
                              </span>
                              {validation && <ImageIntelCard validation={validation} compact />}
                            </div>
                            <p className="text-xs font-bold text-[#064e3b] mb-2 italic">
                              "{(f.feedback?.original_text || f.feedback_text || 'No text').substring(0, 75)}..."
                            </p>
                            <div className="flex gap-4 text-[10px] font-semibold text-[#047857] flex-wrap">
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
                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase hover:bg-emerald-700 transition active:scale-95 flex items-center gap-2 ml-4 shadow-md"
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
