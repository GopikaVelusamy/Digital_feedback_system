// ============================================================
// SuperAdminPage.jsx — Complete Super Admin Hub
// Admin Management, News Curation, Media Gallery Upload & Legacy
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ImageIntelCard from '../components/ImageIntelCard';
import Sidebar from '../components/Sidebar';
import { translationData, getLanguage } from '../utils/translations';
import { API } from '../config';

export default function SuperAdminPage() {
  const navigate = useNavigate();

  // Language state
  const [language, setLanguageState] = useState(getLanguage());
  const t = translationData[language] || translationData.English;

  useEffect(() => {
    const handleLangChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  // Super Admin Navigation Tab State
  const [activeTab, setActiveTab] = useState('admins'); // 'admins' | 'news' | 'gallery' | 'legacy'

  // Admin List & Resolutions States
  const [admins, setAdmins] = useState([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalScale, setModalScale] = useState(false);

  // ─── NEWS CURATION STATES ───
  const [newsInbox, setNewsInbox] = useState([]);
  const [newsInboxLoading, setNewsInboxLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [pressReleases, setPressReleases] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedInboxNews, setSelectedInboxNews] = useState(null);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleTa, setEditTitleTa] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescTa, setEditDescTa] = useState('');
  const [editTagEn, setEditTagEn] = useState('Press Release');
  const [editTagTa, setEditTagTa] = useState('செய்தி வெளியீடு');
  const [editIcon, setEditIcon] = useState('📰');
  const [editLink, setEditLink] = useState('');

  // ─── GALLERY STATES ───
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [uploadTitleEn, setUploadTitleEn] = useState('');
  const [uploadTitleTa, setUploadTitleTa] = useState('');
  const [uploadCategoryEn, setUploadCategoryEn] = useState('Campaigns');
  const [uploadCategoryTa, setUploadCategoryTa] = useState('பிரச்சாரம்');
  const [uploadImageFile, setUploadImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // ─── LEGACY STATES ───
  const [legacyMilestones, setLegacyMilestones] = useState([]);
  const [uploadMilestoneYear, setUploadMilestoneYear] = useState('');
  const [uploadMilestoneTitleEn, setUploadMilestoneTitleEn] = useState('');
  const [uploadMilestoneTitleTa, setUploadMilestoneTitleTa] = useState('');
  const [uploadMilestoneDescEn, setUploadMilestoneDescEn] = useState('');
  const [uploadMilestoneDescTa, setUploadMilestoneDescTa] = useState('');
  const [uploadMilestoneCategoryEn, setUploadMilestoneCategoryEn] = useState('Infrastructure & Elections');
  const [uploadMilestoneCategoryTa, setUploadMilestoneCategoryTa] = useState('சட்டமன்றம் & தேர்தல்');
  const [uploadMilestoneLoading, setUploadMilestoneLoading] = useState(false);

  // ─── FETCHERS ───
  async function fetchAdmins() {
    try {
      const res = await fetch(`${API}/api/admins`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setAdmins(data);
        setBackendError(null);
        return;
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    }

    // Fail-safe fallback if backend is unreachable or returns HTML
    const localAdmins = JSON.parse(localStorage.getItem('local_dept_admins') || '[]');
    const defaultAdmins = [
      { email: 'admin@admk.org', name: 'Super Admin (Salem Master)', role: 'admin', district: 'Salem', constituency: 'All' },
      { email: 'karthick@admk.org', name: 'Karthick', role: 'department_admin', assigned_department: 'Infrastructure & Public Works Department', district: 'Salem' },
      { email: 'rahul@admk.org', name: 'Rahul', role: 'department_admin', assigned_department: 'Education & Youth Affairs Department', district: 'Salem' }
    ];
    const combined = [...defaultAdmins];
    localAdmins.forEach(la => {
      if (!combined.some(a => a.email.toLowerCase() === la.email.toLowerCase())) {
        combined.push(la);
      }
    });
    setAdmins(combined);
  }

  async function fetchResolutions() {
    try {
      const res = await fetch(`${API}/api/feedbacks`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const feedbacks = await res.json();
        const pending = feedbacks.filter((f) => f.status !== 'Solved' && f.status !== 'Resolved');
        setPendingFeedbacks(pending);
        return;
      }
    } catch (err) {
      console.error('Resolution fetch error:', err);
    }
  }

  const fetchNewsInbox = async () => {
    try {
      setNewsInboxLoading(true);
      setNewsError(null);
      const res = await fetch(API + '/api/news-inbox');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setNewsInbox(data);
        return;
      }
    } catch (err) {
      console.error("Error fetching news inbox:", err);
      setNewsInbox([]);
    } finally {
      setNewsInboxLoading(false);
    }
  };

  const fetchPressReleases = async () => {
    try {
      const res = await fetch(API + '/api/press-releases');
      if (res.ok) {
        const data = await res.json();
        setPressReleases(data);
      }
    } catch (err) {
      console.error("Error fetching press releases:", err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(API + '/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGalleryPhotos(data);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  const fetchLegacy = async () => {
    try {
      const res = await fetch(API + '/api/legacy');
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a, b) => a.year - b.year);
        setLegacyMilestones(sorted);
      }
    } catch (err) {
      console.error("Error fetching legacy milestones:", err);
    }
  };

  // ─── ACTION HANDLERS ───
  async function markSolved(id) {
    const confirm = await Swal.fire({
      title: language === 'English' ? 'Resolve & Notify?' : 'தீர்வு காணவா?',
      text: language === 'English' ? "This will send the official 'Issue Resolved' notification to the citizen." : "இது புகாரளித்த குடிமகனுக்கு தீர்வு அறிவிப்பை அனுப்பும்.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: language === 'English' ? 'Yes, Resolve & Notify' : 'ஆம், தீர்வு காண்'
    });

    if (!confirm.isConfirmed) return;

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

  const handleApproveNews = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title_en: editTitleEn,
        title_ta: editTitleTa,
        desc_en: editDescEn,
        desc_ta: editDescTa,
        tag_en: editTagEn,
        tag_ta: editTagTa,
        icon: editIcon,
        source_link: editLink,
        date: selectedInboxNews ? selectedInboxNews.date : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const res = await fetch(API + '/api/press-releases/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          title: language === 'English' ? 'Published Live!' : 'வெளியிடப்பட்டது!',
          text: language === 'English' ? 'News article posted live to Public Pulse portal.' : 'செய்தி பொதுத் தளத்தில் வெளியிடப்பட்டது.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        if (selectedInboxNews) {
          setNewsInbox(prev => prev.filter(item => item.source_link !== selectedInboxNews.source_link));
        }

        setShowApproveModal(false);
        fetchPressReleases();
      } else {
        Swal.fire('Error', 'Failed to approve news release', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Network error approving news release', 'error');
    }
  };

  const handleDeletePressRelease = async (id) => {
    const confirm = await Swal.fire({
      title: language === 'English' ? 'Are you sure?' : 'நிச்சயமாகவா?',
      text: language === 'English' ? 'This news article will be deleted.' : 'இந்த செய்தி நீக்கப்படும்.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: language === 'English' ? 'Yes, delete!' : 'ஆம், நீக்கு!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(API + `/api/press-releases/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          Swal.fire('Deleted!', 'News release removed.', 'success');
          fetchPressReleases();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!uploadImageFile) {
      Swal.fire('Error', 'Please select an image file to upload', 'error');
      return;
    }
    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('title_en', uploadTitleEn);
      formData.append('title_ta', uploadTitleTa);
      formData.append('category_en', uploadCategoryEn);
      formData.append('category_ta', uploadCategoryTa);
      formData.append('image', uploadImageFile);

      const res = await fetch(API + '/api/gallery', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        Swal.fire({
          title: language === 'English' ? 'Photo Live!' : 'படம் வெளியிடப்பட்டது!',
          text: language === 'English' ? 'Campaign photo added to public Media Gallery.' : 'புகைப்படம் பொது கேலரியில் சேர்க்கப்பட்டது.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setUploadTitleEn('');
        setUploadTitleTa('');
        setUploadImageFile(null);
        const fileInput = document.getElementById('super-gallery-file-input');
        if (fileInput) fileInput.value = '';
        fetchGallery();
      } else {
        Swal.fire('Error', 'Failed to upload photo', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Network error uploading photo', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    const confirm = await Swal.fire({
      title: language === 'English' ? 'Delete Photo?' : 'படத்தை நீக்கவா?',
      text: language === 'English' ? 'This photo will be removed from the public gallery.' : 'இந்தப் படம் கேலரியில் இருந்து நீக்கப்படும்.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: language === 'English' ? 'Yes, delete!' : 'ஆம், நீக்கு!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(API + `/api/gallery/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          Swal.fire('Deleted!', 'Photo removed from gallery.', 'success');
          fetchGallery();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUploadLegacyMilestone = async (e) => {
    e.preventDefault();
    if (!uploadMilestoneYear || !uploadMilestoneTitleTa || !uploadMilestoneDescTa) {
      Swal.fire('Error', 'Please fill in required fields (Year, Title TA, Desc TA)', 'error');
      return;
    }
    try {
      setUploadMilestoneLoading(true);
      const payload = {
        year: parseInt(uploadMilestoneYear),
        title_en: uploadMilestoneTitleEn,
        title_ta: uploadMilestoneTitleTa,
        desc_en: uploadMilestoneDescEn,
        desc_ta: uploadMilestoneDescTa,
        category_en: uploadMilestoneCategoryEn,
        category_ta: uploadMilestoneCategoryTa
      };

      const res = await fetch(API + '/api/legacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire('Published!', 'Milestone added successfully.', 'success');
        setUploadMilestoneYear('');
        setUploadMilestoneTitleEn('');
        setUploadMilestoneTitleTa('');
        setUploadMilestoneDescEn('');
        setUploadMilestoneDescTa('');
        fetchLegacy();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadMilestoneLoading(false);
    }
  };

  const handleDeleteLegacyMilestone = async (id) => {
    const confirm = await Swal.fire({
      title: language === 'English' ? 'Delete Milestone?' : 'சாதனையை நீக்கவா?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: language === 'English' ? 'Delete' : 'நீக்கு'
    });
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(API + `/api/legacy/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchLegacy();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  function showSuccessModal() {
    setModalVisible(true);
    setTimeout(() => setModalScale(true), 10);
  }

  function closeModal() {
    setModalScale(false);
    setTimeout(() => setModalVisible(false), 300);
  }

  useEffect(() => {
    fetchAdmins();
    fetchResolutions();
    fetchNewsInbox();
    fetchPressReleases();
    fetchGallery();
    fetchLegacy();
  }, []);

  return (
    <div
      className="min-h-screen relative font-body text-[#064e3b] flex flex-col lg:flex-row"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #ebf8f1 0%, #d6f0dc 45%, #bde7c4 100%)',
      }}
    >
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {backendError && (
        <div className="fixed top-4 left-1/2 z-[120] -translate-x-1/2 max-w-3xl px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl px-5 py-4 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl">error</span>
              <div>
                <div className="font-black uppercase text-[10px] tracking-[.25em]">Backend Connection Issue</div>
                <div className="mt-1 text-xs leading-relaxed">{backendError}</div>
                <div className="mt-2 text-[10px] text-slate-500">Make sure the FastAPI backend is running on {API} and that MongoDB is available.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notify Modal */}
      {modalVisible && (
        <div
          id="notifyModal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          style={{ opacity: modalScale ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
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
            <p className="text-[#047857] mb-6 text-sm font-semibold">
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

      {/* Edit & Approve News Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">📰</span>
                <div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                    {language === 'English' ? 'Edit & Post Online News' : 'செய்தித் திருத்தம் & பதிவேற்றம்'}
                  </h3>
                  <p className="text-3xs text-slate-400 font-bold">{selectedInboxNews?.source || 'Live RSS'}</p>
                </div>
              </div>
              <button onClick={() => setShowApproveModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold">✕</button>
            </div>

            <form onSubmit={handleApproveNews} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Headline (English)</label>
                  <input
                    type="text"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    placeholder="Enter English Title..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">தலைப்பு (Tamil)</label>
                  <input
                    type="text"
                    value={editTitleTa}
                    onChange={(e) => setEditTitleTa(e.target.value)}
                    placeholder="தமிழில் செய்தித் தலைப்பு..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Summary (English)</label>
                  <textarea
                    rows="3"
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    placeholder="English description..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">சுருக்கம் (Tamil)</label>
                  <textarea
                    rows="3"
                    value={editDescTa}
                    onChange={(e) => setEditDescTa(e.target.value)}
                    placeholder="தமிழ் விளக்கம்..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Source URL</label>
                <input
                  type="url"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-3xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowApproveModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold uppercase text-3xs">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-3xs shadow-md">Publish Live 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Sidebar variant="superadmin" />

      {/* Main UI Content */}
      <div id="superAdminUI" className="flex-1 min-h-screen overflow-x-hidden relative z-10 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 min-w-0">
          <style>{`
            .glass-card {
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(24px);
              border: 1px solid rgba(16, 185, 129, 0.2);
              box-shadow: 0 8px 32px rgba(22, 163, 74, 0.05);
            }
          `}</style>

          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#064e3b] tracking-tight">
                {t.systemControlPanel || 'Super Admin Control Center'}
              </h2>
              <p className="text-xs font-bold text-emerald-800 mt-1">
                Central Headquarters Command & Content Management System
              </p>
            </div>
            <button
              onClick={() => navigate('/create-admin')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-sm font-bold">person_add</span>
              {t.assignNewAdmin || 'Assign New Admin'}
            </button>
          </header>

          {/* SUPER ADMIN MASTER NAVIGATION TABS */}
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-emerald-900/10 p-2 rounded-2xl border border-emerald-700/20 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'admins' ? 'bg-emerald-700 text-white shadow-md scale-[1.02]' : 'text-emerald-900 hover:bg-emerald-100/50'}`}
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>Admins & Resolutions</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'news' ? 'bg-emerald-700 text-white shadow-md scale-[1.02]' : 'text-emerald-900 hover:bg-emerald-100/50'}`}
            >
              <span className="material-symbols-outlined text-sm">newspaper</span>
              <span>Public Pulse News</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-emerald-700 text-white shadow-md scale-[1.02]' : 'text-emerald-900 hover:bg-emerald-100/50'}`}
            >
              <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
              <span>Upload Gallery Photos</span>
            </button>

            <button
              onClick={() => setActiveTab('legacy')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'legacy' ? 'bg-emerald-700 text-white shadow-md scale-[1.02]' : 'text-emerald-900 hover:bg-emerald-100/50'}`}
            >
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span>Legacy Milestones</span>
            </button>
          </div>

          {/* TAB 1: ADMIN ACCOUNTS & RESOLUTIONS */}
          {activeTab === 'admins' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fadeIn">
              {/* Active Admin Accounts */}
              <section className="xl:col-span-1 space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <h3 className="font-bold text-[#064e3b] mb-6 flex items-center gap-2 text-base">
                    <span className="material-symbols-outlined text-[#10b981]">key</span>
                    {t.activeAdminAccounts || 'Active District Leaders'}
                  </h3>
                  <div id="adminList" className="space-y-4">
                    {admins.length === 0 ? (
                      <p className="text-sm text-[#047857] text-center py-4 font-semibold">Loading admins...</p>
                    ) : (
                      admins.map((a, idx) => (
                        <div key={idx} className="p-4 bg-emerald-50/70 border border-emerald-200/50 rounded-2xl text-[#064e3b] shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-extrabold text-[#064e3b] text-sm">{a.name}</span>
                            <span className="text-[9px] font-black bg-white text-[#10b981] border border-emerald-300 px-2 py-0.5 rounded uppercase">
                              {a.district || 'All'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#047857] mb-2 font-semibold">{a.email}</p>
                          <div className="flex items-center gap-2 bg-white p-2 rounded-xl text-[10px] font-mono border border-emerald-200 text-[#047857]">
                            <span className="material-symbols-outlined text-xs">lock</span>
                            Pass: <span className="font-black text-emerald-950">{a.password}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* Pending Resolutions */}
              <section className="xl:col-span-2 space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-emerald-100/60 pb-4">
                    <h3 className="font-bold text-[#064e3b] flex items-center gap-2 text-base">
                      <span className="material-symbols-outlined text-[#10b981]">campaign</span>
                      Pending Resolutions & WhatsApp Dispatch
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Filter Category:</span>
                      <select
                        value={adminCategoryFilter}
                        onChange={(e) => setAdminCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-950 outline-none shadow-sm cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {[...new Set(pendingFeedbacks.map(f => f.type_of_feedback || f.category || f.feedback?.type || f.ai?.category).filter(Boolean))].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div id="resolverList" className="space-y-4">
                    {pendingFeedbacks.filter(f => {
                      if (adminCategoryFilter === 'All') return true;
                      const cat = f.type_of_feedback || f.category || f.feedback?.type || f.ai?.category || 'General';
                      return cat.toLowerCase().trim() === adminCategoryFilter.toLowerCase().trim();
                    }).length === 0 ? (
                      <p className="text-sm text-[#047857] text-center py-6 font-semibold">
                        No pending resolutions matching selected category filter. ✅
                      </p>
                    ) : (
                      pendingFeedbacks.filter(f => {
                        if (adminCategoryFilter === 'All') return true;
                        const cat = f.type_of_feedback || f.category || f.feedback?.type || f.ai?.category || 'General';
                        return cat.toLowerCase().trim() === adminCategoryFilter.toLowerCase().trim();
                      }).map((f, idx) => {
                        const validation = f.image_validation;
                        const risk = validation?.overall_risk || 0;
                        const riskColor = risk >= 65 ? '#EF4444' : risk >= 35 ? '#F59E0B' : '#10B981';
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white/90 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
                            style={{ borderLeft: `4px solid ${validation ? riskColor : '#10b981'}` }}
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black bg-emerald-50 text-[#10b981] border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase">
                                  {f.feedback?.type || f.type_of_feedback || 'General'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase">
                                  📍 {f.location?.district || f.district || 'Coimbatore'}
                                </span>
                                {validation && <ImageIntelCard validation={validation} compact />}
                              </div>
                              <p className="text-xs font-bold text-[#064e3b] leading-relaxed">
                                "{(f.feedback?.original_text || f.feedback_text || 'Grievance text').substring(0, 90)}..."
                              </p>
                              <div className="flex gap-4 text-[10px] font-semibold text-slate-500 flex-wrap">
                                <span>📧 {f.user?.email || f.email || 'gopikavelusamy3@gmail.com'}</span>
                                <span>📞 {f.user?.mobile_masked || f.booth_no || '+91 9384155076'}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => markSolved(f._id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition active:scale-95 flex items-center gap-2 shadow-md whitespace-nowrap self-end md:self-center"
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
          )}

          {/* TAB 2: PUBLIC PULSE NEWS CURATION */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
              <div className="glass-card rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#064e3b] flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600">newspaper</span>
                      Public Pulse News Moderation Inbox
                    </h3>
                    <p className="text-2xs text-slate-550 mt-1">
                      Scrapes online news channels in real-time. Edit, translate, and approve which articles appear live for the public.
                    </p>
                  </div>
                  <button
                    onClick={fetchNewsInbox}
                    disabled={newsInboxLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-700 transition flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Refresh Feed
                  </button>
                </div>

                {newsInboxLoading ? (
                  <div className="text-center py-16 text-slate-500 font-bold">Scanning online news sources...</div>
                ) : newsError ? (
                  <div className="text-center py-16 text-amber-700 bg-amber-50 rounded-3xl border border-amber-200 font-bold">
                    {newsError}
                  </div>
                ) : newsInbox.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 font-bold">No new articles in current search inbox.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {newsInbox.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between text-3xs font-extrabold text-slate-400 mb-2">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">{item.source}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                          <p className="text-3xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <a href={item.source_link} target="_blank" rel="noopener noreferrer" className="text-3xs font-black text-blue-600 hover:underline">READ SOURCE ↗</a>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setNewsInbox(prev => prev.filter(n => n.source_link !== item.source_link))}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[10px] font-bold uppercase"
                            >
                              Discard
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInboxNews(item);
                                setEditTitleEn(item.title);
                                setEditDescEn(item.desc);
                                setEditLink(item.source_link);
                                setShowApproveModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase shadow-sm"
                            >
                              Approve & Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Published Releases Catalog */}
              <div className="glass-card rounded-3xl p-6">
                <h4 className="text-base font-black text-[#064e3b] mb-4">Published Live News Releases ({pressReleases.length})</h4>
                <div className="space-y-3">
                  {pressReleases.map((pr) => (
                    <div key={pr._id || pr.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase">{pr.tag_en || pr.tag_ta}</span>
                        <h5 className="text-xs font-bold text-slate-800 mt-1">{language === 'English' ? pr.title_en : (pr.title_ta || pr.title_en)}</h5>
                        <p className="text-3xs text-slate-400 font-medium">{pr.date}</p>
                      </div>
                      <button
                        onClick={() => handleDeletePressRelease(pr._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA GALLERY PHOTO UPLOAD */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-black text-[#064e3b] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">add_photo_alternate</span>
                  Upload New Campaign Photo to Public Media Gallery
                </h3>
                <form onSubmit={handleUploadGallery} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Caption (English)</label>
                      <input
                        type="text"
                        value={uploadTitleEn}
                        onChange={(e) => setUploadTitleEn(e.target.value)}
                        placeholder="Enter photo title in English..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">தலைப்பு (Tamil)</label>
                      <input
                        type="text"
                        required
                        value={uploadTitleTa}
                        onChange={(e) => setUploadTitleTa(e.target.value)}
                        placeholder="தமிழில் புகைப்படத் தலைப்பு..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Category</label>
                      <select
                        value={uploadCategoryEn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUploadCategoryEn(val);
                          if (val === 'Campaigns') setUploadCategoryTa('பிரச்சாரம்');
                          else if (val === 'Public Meetings') setUploadCategoryTa('பொது மக்கள் சந்திப்பு');
                          else if (val === 'Welfare Ceremonies') setUploadCategoryTa('மக்கள் நல உதவிகள்');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none font-bold"
                      >
                        <option value="Campaigns">📢 Campaigns</option>
                        <option value="Public Meetings">🤝 Public Meetings</option>
                        <option value="Welfare Ceremonies">🎓 Welfare Ceremonies</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Select Image File</label>
                      <input
                        id="super-gallery-file-input"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setUploadImageFile(e.target.files[0])}
                        className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-emerald-100 file:text-emerald-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={uploadLoading}
                      className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase text-xs shadow-md disabled:opacity-50"
                    >
                      {uploadLoading ? 'Uploading...' : 'Upload Photo Live 🚀'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Gallery Catalog */}
              <div className="glass-card rounded-3xl p-6">
                <h4 className="text-base font-black text-[#064e3b] mb-4">Active Public Media Gallery Catalog ({galleryPhotos.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryPhotos.map((photo) => {
                    const src = photo.image_url.startsWith('/uploads') ? (API + photo.image_url) : photo.image_url;
                    return (
                      <div key={photo._id || photo.id} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col group h-44 shadow-sm">
                        <img src={src} className="w-full h-28 object-cover" alt="gallery catalog" />
                        <div className="p-2 flex-1 flex flex-col justify-between">
                          <span className="text-[8px] font-black uppercase text-emerald-700">{photo.category_en}</span>
                          <h5 className="text-[10px] font-bold text-slate-800 truncate">{photo.title_en || photo.title_ta}</h5>
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(photo._id)}
                          className="absolute right-2 top-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Delete Photo"
                        >
                          <span className="material-symbols-outlined text-xs font-bold">delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGACY MILESTONES */}
          {activeTab === 'legacy' && (
            <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-black text-[#064e3b] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">history_edu</span>
                  Add Historical Legacy Milestone
                </h3>
                <form onSubmit={handleUploadLegacyMilestone} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Year</label>
                      <input
                        type="number"
                        required
                        value={uploadMilestoneYear}
                        onChange={(e) => setUploadMilestoneYear(e.target.value)}
                        placeholder="e.g. 1982"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={uploadMilestoneTitleEn}
                        onChange={(e) => setUploadMilestoneTitleEn(e.target.value)}
                        placeholder="Milestone title..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">தலைப்பு (Tamil)</label>
                      <input
                        type="text"
                        required
                        value={uploadMilestoneTitleTa}
                        onChange={(e) => setUploadMilestoneTitleTa(e.target.value)}
                        placeholder="தமிழில் தலைப்பு..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Description (English)</label>
                      <textarea
                        rows="2"
                        value={uploadMilestoneDescEn}
                        onChange={(e) => setUploadMilestoneDescEn(e.target.value)}
                        placeholder="Description..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">விளக்கம் (Tamil)</label>
                      <textarea
                        rows="2"
                        required
                        value={uploadMilestoneDescTa}
                        onChange={(e) => setUploadMilestoneDescTa(e.target.value)}
                        placeholder="தமிழில் விளக்கம்..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={uploadMilestoneLoading}
                      className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-black uppercase text-xs shadow-md"
                    >
                      Publish Milestone 🚀
                    </button>
                  </div>
                </form>
              </div>

              {/* Milestones List */}
              <div className="glass-card rounded-3xl p-6">
                <h4 className="text-base font-black text-[#064e3b] mb-4">Historical Milestones Catalog ({legacyMilestones.length})</h4>
                <div className="space-y-3">
                  {legacyMilestones.map((m) => (
                    <div key={m._id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black font-mono text-emerald-700">{m.year}</span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">{m.title_en || m.title_ta}</h5>
                          <p className="text-3xs text-slate-500">{m.desc_en || m.desc_ta}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLegacyMilestone(m._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
