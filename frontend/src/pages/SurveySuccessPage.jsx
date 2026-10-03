// ============================================================
// SurveySuccessPage.jsx — Step 3: Survey Submitted Successfully
// Options: Add Next Respondent | View My Surveys | Logout
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../config';

const LABELS = {
  en: {
    success: 'Survey Submitted!',
    offline: 'Saved Offline',
    success_msg: 'The survey response has been recorded successfully.',
    offline_msg: 'No internet connection. Response saved locally and will sync automatically when online.',
    add_next: 'Add Next Respondent',
    view_my: 'View My Surveys',
    logout: 'Logout',
    syncing: 'Syncing offline data...',
    synced: 'All offline data synced!',
  },
  ta: {
    success: 'கணக்கெடுப்பு சமர்ப்பிக்கப்பட்டது!',
    offline: 'ஆஃப்லைனில் சேமிக்கப்பட்டது',
    success_msg: 'கணக்கெடுப்பு பதில் வெற்றிகரமாக பதிவு செய்யப்பட்டது.',
    offline_msg: 'இணைய இணைப்பு இல்லை. பதில் உள்ளூரில் சேமிக்கப்பட்டது, ஆன்லைனில் தானாக ஒத்திசைக்கப்படும்.',
    add_next: 'அடுத்த நபரை சேர்க்கவும்',
    view_my: 'எனது கணக்கெடுப்புகள்',
    logout: 'வெளியேறு',
    syncing: 'ஆஃப்லைன் தரவை ஒத்திசைக்கிறது...',
    synced: 'அனைத்து தரவும் ஒத்திசைக்கப்பட்டது!',
  }
};

export default function SurveySuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOffline = searchParams.get('offline') === '1';
  const [lang, setLang] = useState('ta');
  const [syncMsg, setSyncMsg] = useState('');
  const L = LABELS[lang];

  const surveyorRaw = localStorage.getItem('surveyor');
  const surveyor = surveyorRaw ? JSON.parse(surveyorRaw) : null;

  // Try to sync offline queue
  useEffect(() => {
    syncOfflineQueue();
  }, []);

  async function syncOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem('offline_survey_queue') || '[]');
    if (queue.length === 0) return;
    setSyncMsg(L.syncing);
    const remaining = [];
    for (const payload of queue) {
      try {
        const res = await fetch(`${API}/api/survey-responses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) remaining.push(payload);
      } catch {
        remaining.push(payload);
      }
    }
    localStorage.setItem('offline_survey_queue', JSON.stringify(remaining));
    if (remaining.length === 0) setSyncMsg(L.synced);
    else setSyncMsg('');
  }

  function handleNextRespondent() {
    // Keep same location, go back to form
    navigate('/survey/form');
  }

  function handleLogout() {
    localStorage.removeItem('surveyor');
    sessionStorage.removeItem('survey_location');
    navigate('/surveyor-login');
  }

  return (
    <div style={styles.bg}>
      {/* Language toggle */}
      <div style={styles.langRow}>
        <button style={{ ...styles.langBtn, ...(lang === 'ta' ? styles.langActive : {}) }} onClick={() => setLang('ta')}>தமிழ்</button>
        <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }} onClick={() => setLang('en')}>English</button>
      </div>

      <div style={styles.card}>
        {/* Icon */}
        <div style={{ ...styles.iconCircle, background: isOffline ? '#f59e0b' : '#16a34a' }}>
          <span style={styles.icon}>{isOffline ? '📶' : '✅'}</span>
        </div>

        <h2 style={{ ...styles.title, color: isOffline ? '#92400e' : '#14532d' }}>
          {isOffline ? L.offline : L.success}
        </h2>
        <p style={styles.msg}>
          {isOffline ? L.offline_msg : L.success_msg}
        </p>

        {syncMsg && (
          <div style={styles.syncBadge}>{syncMsg}</div>
        )}

        {/* Surveyor info */}
        {surveyor && (
          <div style={styles.surveyorInfo}>
            <span>👤 {surveyor.name}</span>
            {surveyor.constituency && <span>📍 {surveyor.constituency}</span>}
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button
            id="add-next-respondent-btn"
            onClick={handleNextRespondent}
            style={styles.primaryBtn}
          >
            {L.add_next}
          </button>

          <button
            id="logout-survey-btn"
            onClick={handleLogout}
            style={styles.outlineBtn}
          >
            {L.logout}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif",
  },
  langRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  langBtn: {
    padding: '5px 16px',
    borderRadius: '16px',
    border: '1.5px solid rgba(255,255,255,0.5)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
  },
  langActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: '#fff' },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '36px 28px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  icon: { fontSize: '38px' },
  title: { fontSize: '22px', fontWeight: '800', margin: '0 0 10px' },
  msg: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' },
  syncBadge: {
    background: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12px',
    color: '#92400e',
    fontWeight: '700',
    marginBottom: '16px',
  },
  surveyorInfo: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
    background: '#f0faf5',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '24px',
    fontSize: '13px',
    color: '#1a5c3a',
    fontWeight: '700',
    flexWrap: 'wrap',
  },
  actions: { display: 'flex', flexDirection: 'column', gap: '12px' },
  primaryBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #1a7a52, #0f4c35)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(15,76,53,0.35)',
  },
  outlineBtn: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: '#0f4c35',
    border: '2px solid #0f4c35',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
