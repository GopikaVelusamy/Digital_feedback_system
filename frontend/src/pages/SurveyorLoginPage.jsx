// ============================================================
// SurveyorLoginPage.jsx — Field Surveyor Login
// Mobile-first, Tamil/English, connects to /api/login
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

const LABELS = {
  en: {
    title: 'Public Survey',
    subtitle: 'Field Surveyor Portal',
    userid: 'User ID (Email)',
    password: 'Password',
    login: 'Login',
    logging: 'Verifying...',
    wrong: 'Invalid email or password. Please try again.',
    not_surveyor: 'Access denied. This portal is for surveyors only.',
    server_err: 'Server error. Please check your internet connection.',
  },
  ta: {
    title: 'பொது கணக்கெடுப்பு',
    subtitle: 'கள ஆய்வாளர் நுழைவு',
    userid: 'பயனர் ID (மின்னஞ்சல்)',
    password: 'கடவுச்சொல்',
    login: 'உள்நுழைய',
    logging: 'சரிபார்க்கிறது...',
    wrong: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.',
    not_surveyor: 'அணுகல் மறுக்கப்பட்டது. இந்த போர்டல் ஆய்வாளர்களுக்கு மட்டுமே.',
    server_err: 'சர்வர் பிழை. இணைய இணைப்பை சரிபார்க்கவும்.',
  }
};

export default function SurveyorLoginPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ta');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const L = LABELS[lang];

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      const data = await res.json();

      if (data.message === 'Login success') {
        if (data.role !== 'surveyor') {
          setError(L.not_surveyor);
          setLoading(false);
          return;
        }
        // Save surveyor session
        localStorage.setItem('surveyor', JSON.stringify({
          email: data.email || email.trim(),
          name: data.name || 'Surveyor',
          role: 'surveyor',
          constituency: data.constituency || '',
          district: data.district || 'Salem'
        }));
        navigate('/survey/location');
      } else {
        setError(L.wrong);
      }
    } catch (err) {
      setError(L.server_err);
    }
    setLoading(false);
  }

  return (
    <div style={styles.bg}>
      {/* Language Toggle */}
      <div style={styles.langRow}>
        <button
          style={{ ...styles.langBtn, ...(lang === 'ta' ? styles.langActive : {}) }}
          onClick={() => setLang('ta')}
        >தமிழ்</button>
        <button
          style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }}
          onClick={() => setLang('en')}
        >English</button>
      </div>

      {/* Card */}
      <div style={styles.card}>
        {/* Logo area */}
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>
            <span style={styles.logoIcon}>📋</span>
          </div>
          <h1 style={styles.title}>{L.title}</h1>
          <p style={styles.subtitle}>{L.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{L.userid}</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>👤</span>
              <input
                id="surveyor-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="surveyor@admk.org"
                style={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{L.password}</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                id="surveyor-password"
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {/* Error */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Submit */}
          <button
            id="surveyor-login-btn"
            type="submit"
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
          >
            {loading ? L.logging : L.login}
          </button>
        </form>

        <p style={styles.footer}>InsightFlow • ADMK Survey Portal</p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a52 40%, #0d3b2a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif",
  },
  langRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  langBtn: {
    padding: '6px 18px',
    borderRadius: '20px',
    border: '2px solid rgba(255,255,255,0.4)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  langActive: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    borderColor: '#fff',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '20px',
    padding: '36px 32px 28px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoCircle: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #1a7a52, #0f4c35)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
    boxShadow: '0 6px 20px rgba(26,122,82,0.4)',
  },
  logoIcon: { fontSize: '32px' },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f4c35',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#5a7a6a',
    margin: 0,
    fontWeight: '500',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#1a4a2e' },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #c8e6d4',
    borderRadius: '10px',
    background: '#f4faf7',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  inputIcon: {
    padding: '0 10px 0 12px',
    fontSize: '16px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '13px 8px',
    fontSize: '15px',
    outline: 'none',
    color: '#1a2e24',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    padding: '0 12px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #1a7a52, #0f4c35)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    boxShadow: '0 6px 20px rgba(15,76,53,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  footer: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#9ab5a5',
    marginTop: '20px',
    marginBottom: 0,
  }
};
