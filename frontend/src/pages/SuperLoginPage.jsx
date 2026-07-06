// ============================================================
// SuperLoginPage.jsx — Exact React conversion of super-login.html
// Gold glass design, all animations and logic preserved
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translationData, getLanguage, setLanguage } from '../utils/translations';

export default function SuperLoginPage() {
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnText, setBtnText] = useState('Super Admin');

  // Exact mirror of login() function in super-login.html
  function login(e) {
    e.preventDefault();
    const e_val = email.trim();
    const p_val = password.trim();

    setBtnText('VERIFYING ENCRYPTED KEY...');

    // Varun's Credentials — exact from original
    if (e_val === 'varunthanwar@gmail.com' && p_val === '181818') {
      localStorage.setItem('super_verified', 'true');
      localStorage.setItem('VERIFIED_VARUN', 'YES');
      setTimeout(() => {
        navigate('/super-admin');
      }, 1000);
    } else {
      setTimeout(() => {
        setBtnText('INITIALIZE SESSION');
        alert(language === 'English' ? '⚠️ Access Denied: Invalid Master Credentials' : '⚠️ அணுகல் மறுக்கப்பட்டது: தவறான முதன்மை சான்றுகள்');
      }, 600);
    }
  }

  return (
    // ─── super-login.html body structure — exact ───────────────
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)',
      }}
    >
      {/* ── Rich Golden/Green Animated Background Blobs ── */}
      <div
        className="blob"
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
          animation: 'move 15s infinite alternate',
          top: '-100px',
          left: '-100px',
        }}
      ></div>
      <div
        className="blob"
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
          animation: 'move 15s infinite alternate',
          animationDelay: '-7s',
          bottom: '-100px',
          right: '-100px',
        }}
      ></div>

      {/* ── Inline animation keyframe for blob movement ── */}
      <style>{`
        @keyframes move {
          from { transform: translate(-20%, -20%); }
          to { transform: translate(20%, 20%); }
        }
      `}</style>

      {/* ── Green Glass Card — styled in green combo ── */}
      <div className="glass-card" style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(240, 253, 244, 0.65)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        borderRadius: '2.5rem',
        padding: '3.5rem 3rem',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Floating Language Selector inside Card */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#0f291b',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="English">English</option>
            <option value="Tamil">தமிழ்</option>
          </select>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          {/* Green top bar */}
          <div
            style={{
              width: '80px',
              height: '6px',
              background: '#15803d',
              margin: '0 auto 2rem',
              borderRadius: '9999px',
            }}
          ></div>

          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#0f291b',
              letterSpacing: '-0.05em',
            }}
          >
            {language === 'English' ? 'Super Admin' : 'முதன்மை நிர்வாகி'}
          </h2>
          <p
            className="text-[#15803d]"
            style={{
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
            }}
          >
            {language === 'English' ? 'ADMK • Feedback' : 'கட்சியின் • கருத்துக்கள்'}
          </p>
        </div>

        {/* Form — exact from super-login.html */}
        <form onSubmit={login} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
              style={{
                width: '100%',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                outline: 'none',
                fontWeight: 700,
                color: '#0f291b',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#15803d';
                e.target.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.15)';
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 163, 74, 0.25)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'English' ? 'Password' : 'கடவுச்சொல்'}
              style={{
                width: '100%',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                outline: 'none',
                fontWeight: 700,
                color: '#0f291b',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#15803d';
                e.target.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.15)';
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(22, 163, 74, 0.25)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          {/* Master Session Button — styled in green combo */}
          <button
            type="submit"
            id="loginBtn"
            style={{
              width: '100%',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              fontWeight: 900,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginTop: '1.5rem',
              color: '#fff',
              border: 'none',
              background: '#15803d',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 15px 30px rgba(22, 163, 74, 0.3)';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.background = '#166534';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = '#15803d';
            }}
          >
            {btnText === 'Super Admin'
              ? (language === 'English' ? 'Super Admin' : 'முதன்மை நிர்வாகி')
              : (btnText === 'INITIALIZE SESSION'
                  ? (language === 'English' ? 'INITIALIZE SESSION' : 'அமர்வைத் தொடங்கு')
                  : (language === 'English' ? 'VERIFYING ENCRYPTED KEY...' : 'விசையை சரிபார்க்கிறது...'))}
          </button>
        </form>

        {/* Footer text — exact from super-login.html */}
        <p
          style={{
            marginTop: '3rem',
            fontSize: '10px',
            color: '#9ca3af',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.6,
          }}
        >
          {language === 'English'
            ? 'Encrypted connection active. Unauthorized access is logged.'
            : 'குறியாக்கப்பட்ட இணைப்பு செயலில் உள்ளது. அனுமதியற்ற அணுகல் பதிவு செய்யப்படுகிறது.'}
        </p>
      </div>
    </div>
  );
}
