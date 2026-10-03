// ============================================================
// SurveyLocationPage.jsx — Step 1: Location Selection
// Cascading dropdowns: State → District → Constituency →
// Local Body → Ward → Area/Street
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import constituencyData from '../utils/TN_Assembly_Constituencies_FULL.json';

const LABELS = {
  en: {
    title: 'Select Location',
    step: 'Step 1 of 3',
    state: 'State',
    district: 'District',
    constituency: 'Constituency',
    local_body: 'Local Body',
    local_body_ph: 'e.g. Municipality / Panchayat',
    ward: 'Ward No.',
    ward_ph: 'e.g. Ward 23',
    area: 'Area / Street',
    area_ph: 'e.g. Anna Nagar Main Road',
    next: 'Next →',
    select: '-- Select --',
    logout: 'Logout',
    welcome: 'Welcome',
  },
  ta: {
    title: 'இடம் தேர்ந்தெடுக்கவும்',
    step: 'படி 1 / 3',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    constituency: 'தொகுதி',
    local_body: 'உள்ளாட்சி அமைப்பு',
    local_body_ph: 'எ.கா. நகராட்சி / பஞ்சாயத்து',
    ward: 'வார்டு எண்',
    ward_ph: 'எ.கா. வார்டு 23',
    area: 'பகுதி / தெரு',
    area_ph: 'எ.கா. அண்ணா நகர் மெயின் ரோடு',
    next: 'அடுத்து →',
    select: '-- தேர்ந்தெடுங்கள் --',
    logout: 'வெளியேறு',
    welcome: 'வணக்கம்',
  }
};

export default function SurveyLocationPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ta');
  const L = LABELS[lang];

  // Session guard
  const surveyorRaw = localStorage.getItem('surveyor');
  const surveyor = surveyorRaw ? JSON.parse(surveyorRaw) : null;
  useEffect(() => {
    if (!surveyor) navigate('/surveyor-login');
  }, []);

  // Location state
  const [district, setDistrict] = useState('');
  const [constituency, setConstituency] = useState('');
  const [localBody, setLocalBody] = useState('');
  const [ward, setWard] = useState('');
  const [area, setArea] = useState('');

  // Build district list from JSON
  const districts = Object.keys(constituencyData || {}).sort();
  const constituencies = district
    ? (constituencyData[district] || []).sort()
    : [];

  function handleNext(e) {
    e.preventDefault();
    if (!district || !constituency) return;
    // Save location to session storage for the form page
    sessionStorage.setItem('survey_location', JSON.stringify({
      state: 'Tamil Nadu',
      district,
      constituency,
      local_body: localBody,
      ward,
      area_street: area
    }));
    navigate('/survey/form');
  }

  function handleLogout() {
    localStorage.removeItem('surveyor');
    navigate('/surveyor-login');
  }

  return (
    <div style={styles.bg}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <span style={styles.stepBadge}>{L.step}</span>
          <span style={styles.topTitle}>{L.title}</span>
        </div>
        <div style={styles.topRight}>
          <div style={styles.langRow}>
            <button style={{ ...styles.langBtn, ...(lang === 'ta' ? styles.langActive : {}) }} onClick={() => setLang('ta')}>தமிழ்</button>
            <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }} onClick={() => setLang('en')}>EN</button>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>{L.logout}</button>
        </div>
      </div>

      {/* Surveyor badge */}
      <div style={styles.surveyorBadge}>
        <span>👤 {L.welcome}, <strong>{surveyor?.name || 'Surveyor'}</strong></span>
      </div>

      {/* Form card */}
      <div style={styles.card}>
        <form onSubmit={handleNext} style={styles.form}>

          {/* State (fixed) */}
          <div style={styles.field}>
            <label style={styles.label}>{L.state}</label>
            <div style={styles.staticValue}>🗺️ Tamil Nadu</div>
          </div>

          {/* District */}
          <div style={styles.field}>
            <label style={styles.label}>{L.district} <span style={styles.req}>*</span></label>
            <select
              id="loc-district"
              required
              value={district}
              onChange={e => { setDistrict(e.target.value); setConstituency(''); }}
              style={styles.select}
            >
              <option value="">{L.select}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Constituency */}
          <div style={styles.field}>
            <label style={styles.label}>{L.constituency} <span style={styles.req}>*</span></label>
            <select
              id="loc-constituency"
              required
              value={constituency}
              onChange={e => setConstituency(e.target.value)}
              disabled={!district}
              style={{ ...styles.select, opacity: district ? 1 : 0.5 }}
            >
              <option value="">{L.select}</option>
              {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Local Body */}
          <div style={styles.field}>
            <label style={styles.label}>{L.local_body}</label>
            <input
              id="loc-localbody"
              type="text"
              value={localBody}
              onChange={e => setLocalBody(e.target.value)}
              placeholder={L.local_body_ph}
              style={styles.input}
            />
          </div>

          {/* Ward */}
          <div style={styles.field}>
            <label style={styles.label}>{L.ward}</label>
            <input
              id="loc-ward"
              type="text"
              value={ward}
              onChange={e => setWard(e.target.value)}
              placeholder={L.ward_ph}
              style={styles.input}
            />
          </div>

          {/* Area / Street */}
          <div style={styles.field}>
            <label style={styles.label}>{L.area}</label>
            <input
              id="loc-area"
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder={L.area_ph}
              style={styles.input}
            />
          </div>

          <button id="loc-next-btn" type="submit" style={styles.nextBtn}>
            {L.next}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0faf5 0%, #e8f5ee 100%)',
    fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif",
    paddingBottom: '40px',
  },
  topBar: {
    background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 3px 12px rgba(15,76,53,0.3)',
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  stepBadge: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
  },
  topTitle: { color: '#fff', fontWeight: '700', fontSize: '15px' },
  topRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  langRow: { display: 'flex', gap: '4px' },
  langBtn: {
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1.5px solid rgba(255,255,255,0.5)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  langActive: {
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    borderColor: '#fff',
  },
  logoutBtn: {
    padding: '5px 14px',
    background: 'rgba(255,255,255,0.15)',
    border: '1.5px solid rgba(255,255,255,0.5)',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  surveyorBadge: {
    background: '#e6f7ef',
    border: '1px solid #b2dfc5',
    borderRadius: '0',
    padding: '10px 20px',
    fontSize: '13px',
    color: '#1a5c3a',
    fontWeight: '600',
  },
  card: {
    margin: '20px auto',
    maxWidth: '480px',
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    marginLeft: '16px',
    marginRight: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#1a4a2e' },
  req: { color: '#dc2626' },
  staticValue: {
    padding: '12px 14px',
    background: '#f0faf5',
    border: '2px solid #c8e6d4',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a5c3a',
    fontWeight: '600',
  },
  select: {
    padding: '12px 14px',
    background: '#f8fffe',
    border: '2px solid #c8e6d4',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a2e24',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  input: {
    padding: '12px 14px',
    background: '#f8fffe',
    border: '2px solid #c8e6d4',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a2e24',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  nextBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #1a7a52, #0f4c35)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(15,76,53,0.3)',
    marginTop: '8px',
  },
};
