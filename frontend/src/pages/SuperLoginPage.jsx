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

  // Unified Database Login with Local Fail-Safe Verification
  async function login(e) {
    e.preventDefault();
    const e_val = email.trim();
    const p_val = password.trim();
    const e_lower = e_val.toLowerCase();

    setBtnText('VERIFYING ENCRYPTED KEY...');

    function performLogin(userObj) {
      if (userObj.role === 'admin') {
        localStorage.setItem('super_verified', 'true');
        localStorage.setItem('VERIFIED_VARUN', 'YES');
      } else {
        localStorage.removeItem('super_verified');
        localStorage.removeItem('VERIFIED_VARUN');
      }
      localStorage.setItem('userRole', userObj.role || 'admin');
      localStorage.setItem('role', userObj.role || 'admin');
      localStorage.setItem('currentUser', JSON.stringify(userObj));

      setTimeout(() => {
        if (userObj.role === 'department_admin' || userObj.role === 'constituency_admin') {
          navigate('/critical-issues');
        } else {
          navigate('/dashboard');
        }
      }, 600);
    }

    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e_val, password: p_val })
      });
      const data = await res.json();

      if (res.ok && data.message === 'Login success') {
        performLogin({
          email: data.email || e_val,
          name: data.name || 'Admin',
          role: data.role || 'admin',
          district: data.district || 'Salem',
          assigned_department: data.assigned_department || '',
          assigned_constituency: data.assigned_constituency || data.constituency || ''
        });
        return;
      }
    } catch (err) {
      console.error("Backend API fetch error, executing fail-safe verification:", err);
    }

    // ── LOCAL FAIL-SAFE VERIFICATION ──
    const localDeptAdmins = JSON.parse(localStorage.getItem('local_dept_admins') || '[]');
    const localConstAdmins = JSON.parse(localStorage.getItem('local_constituency_admins') || '[]');

    const matchedDept = localDeptAdmins.find(a => a.email.toLowerCase() === e_lower && a.password === p_val);
    if (matchedDept) {
      performLogin({
        email: matchedDept.email,
        name: matchedDept.name || 'Department Admin',
        role: 'department_admin',
        district: 'Salem',
        assigned_department: matchedDept.assigned_department || 'Infrastructure & Public Works'
      });
      return;
    }

    const matchedConst = localConstAdmins.find(a => a.email.toLowerCase() === e_lower && a.password === p_val);
    if (matchedConst) {
      performLogin({
        email: matchedConst.email,
        name: matchedConst.name || 'Constituency Admin',
        role: 'constituency_admin',
        district: 'Salem',
        assigned_constituency: matchedConst.assigned_constituency || 'Salem South'
      });
      return;
    }

    if ((e_lower === 'varunthanwar@gmail.com' && p_val === '181818') || (e_lower === 'admin@admk.org' && p_val === 'admin123')) {
      performLogin({
        email: e_val,
        name: e_lower === 'admin@admk.org' ? 'Super Admin' : 'Varun Thanwar',
        role: 'admin',
        district: 'Salem'
      });
      return;
    }

    if (e_lower === 'karthick@admk.org' && (p_val === 'Karthick123' || p_val === '123' || p_val === 'admin123')) {
      performLogin({
        email: 'karthick@admk.org',
        name: 'Karthick',
        role: 'department_admin',
        district: 'Salem',
        assigned_department: 'Infrastructure & Public Works'
      });
      return;
    }

    if ((e_lower === 'constituency@admk.org' || e_lower === 'salemsouth@admk.org') && (p_val === 'admin123' || p_val === '123')) {
      performLogin({
        email: e_lower,
        name: 'Salem South Constituency Admin',
        role: 'constituency_admin',
        district: 'Salem',
        assigned_constituency: 'Salem South'
      });
      return;
    }

    setBtnText('SUPER ADMIN');
    alert(language === 'English' ? '⚠️ Access Denied: Invalid Email or Password' : '⚠️ அணுகல் மறுக்கப்பட்டது: தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்');
  }

  return (
    // ─── super-login.html body structure — exact ───────────────
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
      }}
    >
      {/* ── Rich Golden/Green Animated Background Blobs ── */}
      <div
        className="blob"
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
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
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
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

      {/* ── Green Glass Card ── */}
      <div className="glass-card" style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '2.5rem',
        padding: '3.5rem 3rem',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 20px 40px rgba(22, 163, 74, 0.04)'
      }}>
        {/* Floating Language Selector inside Card */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#064e3b',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="English" className="bg-white text-emerald-950">English</option>
            <option value="Tamil" className="bg-white text-emerald-950">தமிழ்</option>
          </select>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          {/* Green top bar */}
          <div
            style={{
              width: '80px',
              height: '6px',
              background: '#10b981',
              margin: '0 auto 2rem',
              borderRadius: '9999px',
            }}
          ></div>

          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#064e3b',
              letterSpacing: '-0.05em',
            }}
          >
            {language === 'English' ? 'Super Admin' : 'முதன்மை நிர்வாகி'}
          </h2>
          <p
            className="text-emerald-700"
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

        {/* Form */}
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
                color: '#064e3b',
                textAlign: 'center',
                background: '#ffffff',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)';
                e.target.style.background = '#ffffff';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#ffffff';
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
                color: '#064e3b',
                textAlign: 'center',
                background: '#ffffff',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)';
                e.target.style.background = '#ffffff';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#ffffff';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          {/* Master Session Button */}
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
              e.target.style.boxShadow = '0 15px 30px rgba(22, 101, 52, 0.2)';
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

        {/* Footer text */}
        <p
          style={{
            marginTop: '3rem',
            fontSize: '10px',
            color: '#047857',
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
