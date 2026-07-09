// ============================================================
// LoginPage.jsx — Redesigned High-Fidelity AIADMK Homepage & Login
// Matches the visual aesthetics of the official AIADMK site
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { translationData, getLanguage, setLanguage } from '../utils/translations';

import { API } from '../config';

function notify(title, text, icon) {
  Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    backdrop: `rgba(0,0,0,0.4) blur(10px)`,
    customClass: { popup: 'glass-popup' },
  });
}

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Language state
  const [language, setLanguageState] = useState(getLanguage());
  const t = translationData[language];

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Authentication Modal overlay state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Quick Help state
  const [isHelpOpen, setIsHelpOpen] = useState(false);



  useEffect(() => {
    const handleLangChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    
    // Listen for custom popup Google select callbacks
    window.onGoogleSelect = async (email, name, role) => {
      Swal.fire({
        title: language === 'English' ? 'Signing in...' : 'உள்நுழைக்கிறது...',
        html: language === 'English' ? `Authenticating as <b>${email}</b>` : `<b>${email}</b> ஆக அங்கீகரிக்கிறது`,
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });
      
      try {
        const res = await fetch(API + '/api/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role }),
        });
        const data = await res.json();
        
        if (data.message === 'Login success') {
          localStorage.setItem('user', email);
          localStorage.setItem('role', data.role);
          notify(
            language === 'English' ? 'Access Granted' : 'அணுகல் அனுமதிக்கப்பட்டது',
            language === 'English' ? 'Redirecting to workspace...' : 'பணி இடத்திற்கு திருப்பிவிடப்படுகிறது...',
            'success'
          );
          setTimeout(() => {
            if (data.role === 'admin') {
              navigate('/dashboard');
            } else {
              navigate('/feedback');
            }
          }, 1800);
        } else {
          notify(
            language === 'English' ? 'Registration Required' : 'பதிவு தேவை',
            language === 'English' ? 'Account not registered. Please signup first.' : 'கணக்கு பதிவு செய்யப்படவில்லை. முதலில் பதிவு செய்யவும்.',
            'warning'
          );
        }
      } catch (error) {
        console.error('Google Auth Error:', error);
        notify('Server Error', 'Google session validation failed.', 'error');
      }
    };

    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      window.onGoogleSelect = null;
    };
  }, [language, navigate]);

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // ─── LOGIN LOGIC ──────────────────────────────────────────
  async function login(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      notify('Missing Fields', 'Please fill in all details.', 'warning');
      return;
    }
    try {
      const res = await fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.message === 'Login success') {
        localStorage.setItem('user', loginEmail);
        localStorage.setItem('role', data.role);
        notify('Access Granted', 'Redirecting to workspace...', 'success');
        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/feedback');
          }
        }, 2000);
      } else {
        notify('Login Failed', data.message, 'error');
      }
    } catch (error) {
      console.error('Login Error:', error);
      notify('Server Error', 'Connection failed. Check backend.', 'error');
    }
  }

  // ─── SIGNUP LOGIC ─────────────────────────────────────────
  async function signup(e) {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      notify('Input Error', 'All fields are mandatory.', 'warning');
      return;
    }
    try {
      const res = await fetch(API + '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (data.message === 'Signup success') {
        notify('Account Created', 'Welcome! Redirecting to login...', 'success');
        setTimeout(() => setActiveTab('login'), 2200);
      } else {
        notify('Signup Failed', data.message, 'error');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      notify('Server Error', 'Registration failed.', 'error');
    }
  }

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "",
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );

    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sign in - Google Accounts</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
          <style>
            body {
              background-color: #202124;
              color: #e8eaed;
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              box-sizing: border-box;
            }
            .container {
              width: 100%;
              max-width: 450px;
              height: 100%;
              background-color: #202124;
              padding: 40px 30px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            .header {
              margin-bottom: 24px;
            }
            .google-title-bar {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #e8eaed;
              margin-bottom: 30px;
              font-weight: 500;
            }
            .google-logo {
              width: 20px;
              height: 20px;
            }
            h1 {
              font-size: 24px;
              font-weight: 400;
              margin: 0 0 8px 0;
              color: #e8eaed;
            }
            .subtitle {
              font-size: 14px;
              color: #9cb3a5;
              margin: 0;
            }
            .subtitle-app {
              font-weight: 500;
              color: #34d399;
            }
            .account-list {
              border-top: 1px solid #3c4043;
              border-bottom: 1px solid #3c4043;
              margin-bottom: 30px;
            }
            .account-item {
              display: flex;
              align-items: center;
              width: 100%;
              padding: 14px 16px;
              border: none;
              background: none;
              cursor: pointer;
              text-align: left;
              color: inherit;
              font-family: inherit;
              border-top: 1px solid #3c4043;
              transition: background 0.15s;
            }
            .account-item:first-child {
              border-top: none;
            }
            .account-item:hover {
              background-color: #303134;
            }
            .avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              margin-right: 12px;
              color: white;
            }
            .name {
              font-size: 14px;
              font-weight: 500;
              color: #e8eaed;
            }
            .email {
              font-size: 12px;
              color: #9aa0a6;
              margin-top: 2px;
            }
            .another-account {
              color: #8ab4f8;
              font-size: 14px;
              font-weight: 500;
            }
            .another-avatar {
              background-color: #303134;
              color: #8ab4f8;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .footer {
              font-size: 11px;
              color: #9aa0a6;
              line-height: 1.5;
              margin-top: auto;
            }
            .input-overlay {
              display: none;
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.85);
              z-index: 1000;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            .input-card {
              background: #2d2e30;
              border: 1px solid #3c4043;
              border-radius: 8px;
              padding: 24px;
              width: 100%;
              max-width: 320px;
            }
            .input-card h3 {
              margin-top: 0;
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            .input-card input {
              width: 100%;
              padding: 10px;
              border: 1px solid #3c4043;
              background: #202124;
              color: white;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              margin-bottom: 16px;
              font-size: 14px;
            }
            .input-card input:focus {
              border-color: #8ab4f8;
            }
            .input-buttons {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
            }
            .input-buttons button {
              padding: 8px 16px;
              border: none;
              background: none;
              color: #8ab4f8;
              cursor: pointer;
              font-weight: 500;
              border-radius: 4px;
            }
            .input-buttons button.submit {
              background: #8ab4f8;
              color: #202124;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="google-title-bar">
              <svg class="google-logo" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M21.35,11.1H12V13.8H18.7C18.4,15.6 15.2,19.3 12,19.3C8.4,19.3 5,16.3 5,12C5,7.9 8.2,4.7 12,4.7C15.3,4.7 17.1,6.7 17.1,6.7L19,4.7C19,4.7 16.6,2 12.1,2C6.4,2 2,6.8 2,12C2,17.2 6.4,22 12.1,22C17.6,22 21.5,18.3 21.5,12.9C21.5,11.8 21.3,11.1 21.3,11.1Z"/>
              </svg>
              <span>\${language === 'English' ? 'Sign in - Google Accounts' : 'உள்நுழைக - கூகுள் கணக்குகள்'}</span>
            </div>

            <div class="header">
              <h1>\${language === 'English' ? 'Choose an account' : 'கணக்கைத் தேர்ந்தெடுக்கவும்'}</h1>
              <p class="subtitle">\${language === 'English' ? 'to continue to' : 'தொடர'} <span class="subtitle-app">ADMK Grievance Portal</span></p>
            </div>

            <div class="account-list">
              <button class="account-item" onclick="selectAcc('gopikavelusamy3@gmail.com', 'Gopika Velusamy', 'user')">
                <div class="avatar" style="background-color: #ab47bc;">G</div>
                <div>
                  <div class="name">Gopika Velusamy</div>
                  <div class="email">gopikavelusamy3@gmail.com</div>
                </div>
              </button>

              <button class="account-item" onclick="selectAcc('kavithagopika14@gmail.com', 'Kavitha B', 'admin')">
                <div class="avatar" style="background-color: #0f9d58;">K</div>
                <div>
                  <div class="name">Kavitha B</div>
                  <div class="email">kavithagopika14@gmail.com</div>
                </div>
              </button>

              <button class="account-item" onclick="selectAcc('gopikav255@gmail.com', 'V Gopika', 'user')">
                <div class="avatar" style="background-color: #4285f4;">V</div>
                <div>
                  <div class="name">V Gopika</div>
                  <div class="email">gopikav255@gmail.com</div>
                </div>
              </button>

              <button class="account-item" onclick="selectAcc('amritavelusamy@gmail.com', 'Amrita', 'user')">
                <div class="avatar" style="background-color: #e67c73;">A</div>
                <div>
                  <div class="name">Amrita</div>
                  <div class="email">amritavelusamy@gmail.com</div>
                </div>
              </button>

              <button class="account-item" onclick="showCustomInput()">
                <div class="avatar another-avatar">
                  <span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">person_add</span>
                </div>
                <div>
                  <div class="name another-account">\${language === 'English' ? 'Use another account' : 'வேறு கணக்கைப் பயன்படுத்தவும்'}</div>
                </div>
              </button>
            </div>

            <p class="footer">
              \${language === 'English' 
                ? 'To continue, Google will share your name, email address, profile picture, and language preference with ADMK Feedback. Before using this app, you can review its privacy policy and terms of service.' 
                : 'தொடர, கூகுள் உங்கள் பெயர், மின்னஞ்சல் முகவரி, சுயவிவரப் படம் மற்றும் மொழி விருப்பங்களை ADMK Feedback உடன் பகிரும். இந்த செயலியைப் பயன்படுத்துவதற்கு முன், அதன் தனியுரிமைக் கொள்கை மற்றும் சேவை விதிமுறைகளை நீங்கள் மதிப்பாய்வு செய்யலாம்.'}
            </p>
          </div>

          <div id="overlay" class="input-overlay">
            <div class="input-card">
              <h3>\${language === 'English' ? 'Enter Google email' : 'மின்னஞ்சலை உள்ளிடவும்'}</h3>
              <input type="email" id="custom-email" placeholder="name@gmail.com">
              <div class="input-buttons">
                <button onclick="hideCustomInput()">\${language === 'English' ? 'Cancel' : 'ரத்துசெய்'}</button>
                <button class="submit" onclick="submitCustomEmail()">\${language === 'English' ? 'Next' : 'அடுத்து'}</button>
              </div>
            </div>
          </div>

          <script>
            function selectAcc(email, name, role) {
              if (window.opener && !window.opener.closed) {
                window.opener.onGoogleSelect(email, name, role);
              }
              window.close();
            }

            function showCustomInput() {
              document.getElementById('overlay').style.display = 'flex';
              document.getElementById('custom-email').focus();
            }

            function hideCustomInput() {
              document.getElementById('overlay').style.display = 'none';
            }

            function submitCustomEmail() {
              const email = document.getElementById('custom-email').value.trim();
              if (email) {
                selectAcc(email, 'Google Citizen', 'user');
              }
            }
          </script>
        </body>
        </html>
      `);
      popup.document.close();
    }
  };



  return (
    <div className="relative min-h-screen text-[#064e3b] flex flex-col font-manrope selection:bg-emerald-200 selection:text-[#064e3b] overflow-x-hidden">
      {/* Background ambient light effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f0fdf4] via-[#e8fbf0] to-[#dcfce7] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#c0392b]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 border-b border-emerald-200/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-lg">
        {/* Brand Identity / Logo & Tamil Text */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <div className="w-11 h-11 sm:w-14 md:w-20 md:h-20 bg-white rounded-full border border-[#15803d] shadow-md flex items-center justify-center overflow-hidden hover:scale-105 duration-300 transition-transform">
            <img src="/irratai_ellai.png" className="w-full h-full object-contain p-0.5" alt="ADMK Logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[10px] sm:text-sm md:text-xl font-extrabold tracking-tight text-[#064e3b] select-none leading-tight font-serif">
              <span className="text-[#c0392b] block md:inline mr-1">அனைத்திந்திய</span>
              <span className="text-emerald-800 block md:inline mr-1">அண்ணா திராவிட</span>
              <span className="text-[#15803d] block md:inline">முன்னேற்றக் கழகம்</span>
            </h1>
            <p className="text-[7px] sm:text-[9px] md:text-xs text-[#064e3b]/70 tracking-wide uppercase select-none mt-0.5">
              All India Anna Dravida Munnetra Kazhagam
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Language Selector */}
          <div className="relative hidden md:block">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none rounded-xl h-10 pl-4 pr-10 bg-white border border-emerald-200 text-emerald-800 font-bold text-sm focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none cursor-pointer shadow-sm"
            >
              <option value="English" className="bg-white text-emerald-800">English</option>
              <option value="Tamil" className="bg-white text-emerald-800">தமிழ்</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <span className="material-symbols-outlined text-emerald-600 text-lg">expand_more</span>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[#c0392b] font-bold text-2xl md:text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* ─── SIDE DRAWER ─── */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsDrawerOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <aside 
          className={`absolute top-0 right-0 h-full w-full sm:w-[320px] bg-white border-l border-emerald-200 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white rounded-full border border-[#15803d] flex items-center justify-center overflow-hidden">
                  <img src="/irratai_ellai.png" className="w-full h-full object-contain p-0.5" alt="Logo" />
                </div>
                <span className="font-bold text-[#064e3b] tracking-wide">ADMK Portal</span>
              </div>
              <a 
                href="#"
                role="button"
                onClick={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}
                className="close-btn w-8 h-8 rounded-full bg-emerald-100 hover:bg-[#c0392b]/10 text-emerald-800 hover:text-[#c0392b] border border-emerald-200 flex items-center justify-center transition-colors focus:outline-none"
                style={{ width: '32px', height: '32px' }}
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </a>
            </div>

            {/* Language Selection inside drawer */}
            <div className="mt-6 md:hidden">
              <label className="block text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-widest">
                Language / மொழி
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none rounded-xl h-12 pl-4 pr-10 bg-white border border-emerald-200 text-emerald-800 font-bold text-sm focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none cursor-pointer shadow-sm"
                >
                  <option value="English" className="bg-white text-emerald-800">English</option>
                  <option value="Tamil" className="bg-white text-emerald-800">தமிழ்</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">expand_more</span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="mt-8 flex flex-col gap-3">
              <a 
                href="#home"
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 hover:bg-emerald-100/50 hover:border-emerald-300 text-emerald-800 hover:text-emerald-950 transition-all"
              >
                <span className="material-symbols-outlined text-emerald-600">home</span>
                <span className="font-semibold text-sm">Home Page</span>
              </a>
              <button
                onClick={() => { setIsDrawerOpen(false); setActiveTab('login'); setIsAuthModalOpen(true); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 hover:bg-emerald-100/50 hover:border-emerald-300 text-emerald-800 hover:text-emerald-950 transition-all"
              >
                <span className="material-symbols-outlined text-emerald-600">login</span>
                <span className="font-semibold text-sm">{language === 'English' ? 'Citizen Sign In' : 'பொதுமக்கள் உள்நுழைவு'}</span>
              </button>
              <button
                onClick={() => { setIsDrawerOpen(false); setActiveTab('signup'); setIsAuthModalOpen(true); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 hover:bg-emerald-100/50 hover:border-emerald-300 text-emerald-800 hover:text-emerald-950 transition-all"
              >
                <span className="material-symbols-outlined text-emerald-600">person_add</span>
                <span className="font-semibold text-sm">{language === 'English' ? 'Citizen Registration' : 'கருத்து போர்டல் பதிவு'}</span>
              </button>
              <button
                onClick={() => { setIsDrawerOpen(false); navigate('/super-login'); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#c0392b]/5 border border-[#c0392b]/10 hover:bg-[#c0392b]/10 hover:border-[#c0392b]/25 text-emerald-800 hover:text-[#c0392b] transition-all"
              >
                <span className="material-symbols-outlined text-[#c0392b]">admin_panel_settings</span>
                <span className="font-semibold text-sm">{t.superAdminLogin}</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-emerald-100 text-center">
            <p className="text-xs text-emerald-700/80 font-bold">
              © {new Date().getFullYear()} ADMK Feedback Portal
            </p>
            <p className="text-[10px] text-emerald-600/70 mt-1">
              Developed for Constituency Grievance Redressal
            </p>
          </div>
        </aside>
      </div>

      {/* ─── MAIN HERO CONTENT AREA ─── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN */}
        <section className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left" data-purpose="branding-banner">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/60 border border-emerald-200 rounded-full w-fit mb-6 shadow-sm backdrop-blur-sm transition-transform hover:scale-105 duration-300 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
              {language === 'English' ? 'Grievance Redressal Portal' : 'மக்கள் குறை தீர்ப்பு போர்டல்'}
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight text-[#064e3b] select-none font-serif mt-2 text-center lg:text-left w-full">
            <span className="block overflow-hidden py-1">
              <span className="animate-reveal-up animate-text-shimmer-red text-glow-red hover-grow-text cursor-default">நம்மில் ஒருவர்</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="animate-reveal-up anim-delay-200 animate-text-shimmer-green text-glow-emerald hover-grow-text cursor-default">நமக்கான தலைவர்</span>
            </span>
          </h2>
          
          <div className="overflow-hidden mt-6 w-full">
            <p className="text-sm md:text-lg text-emerald-900/90 leading-relaxed max-w-xl mx-auto lg:mx-0 select-none font-semibold animate-fade-in-up anim-delay-300">
              {language === 'English'
                ? 'Welcome to the AIADMK assembly constituency feedback platform. Directly connect with your representative, submit constituency grievances, and track resolution progress on public utilities.'
                : 'அதிமுக சட்டமன்ற தொகுதி மக்கள் குறை தீர்க்கும் போர்டல். உங்கள் கருத்துக்கள் மற்றும் குறைகளை சமர்ப்பித்து தொகுதி மேம்பாட்டிற்கு உதவுங்கள்.'}
            </p>
          </div>
 
          {/* Dynamic CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up anim-delay-400 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('login'); setIsAuthModalOpen(true); }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-2xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm focus:outline-none"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>{language === 'English' ? 'Get Started / Sign In' : 'தொடங்கு / உள்நுழை'}</span>
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-[#064e3b] font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm focus:outline-none shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
              <span>{language === 'English' ? 'Explore Menu' : 'முதன்மை பட்டி'}</span>
            </button>
          </div>
        </section>
 
        {/* RIGHT COLUMN */}
        <section className="lg:col-span-5 flex flex-col justify-center items-center w-full animate-fade-in-right anim-delay-200" data-purpose="leaders-container">
          <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-emerald-300 shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-none tilt-card animate-premium-float hover:shadow-emerald-300/40 cursor-pointer">
            <img
              src="/leaders.jpg"
              alt="AIADMK Leaders"
              className="w-full h-auto object-contain select-none"
              onError={(e) => {
                e.target.src = '/cloud-bg1.png';
              }}
            />
          </div>
        </section>
      </main>

      {/* ─── AUTHENTICATION MODAL POPUP ─── */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setIsAuthModalOpen(false)} />
          
          <div className="w-full max-w-md bg-white border border-emerald-200 rounded-[2rem] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-y-auto max-h-[90vh] z-20 animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <a 
              href="#"
              role="button"
              onClick={(e) => { e.preventDefault(); setIsAuthModalOpen(false); }}
              className="close-btn absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-100 hover:bg-[#c0392b] border border-emerald-200 hover:border-transparent flex items-center justify-center text-emerald-800 hover:text-white transition-colors focus:outline-none z-30 cursor-pointer"
              style={{ width: '32px', height: '32px' }}
              aria-label="Close Login Modal"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </a>

            {/* Background shimmer */}
            <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-emerald-100/50 rounded-full blur-[80px] pointer-events-none" />

            {/* Welcome banner inside card */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-block bg-[#15803d]/10 border border-[#15803d]/20 rounded-2xl px-3 py-1 mb-3">
                <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
                  {language === 'English' ? 'Citizen Feedback' : 'கருத்து போர்டல்'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#064e3b]">
                {activeTab === 'login' 
                  ? (language === 'English' ? 'Welcome Back!' : 'மீண்டும் வருக!')
                  : (language === 'English' ? 'Register Now' : 'பதிவு செய்க')
                }
              </h2>
              <p className="text-xs text-emerald-900/80 mt-2 max-w-xs mx-auto">
                {language === 'English'
                  ? 'Sign in to submit or track constituency grievances and insights.'
                  : 'தொகுதியின் குறைகளை சமர்ப்பிக்க மற்றும் கண்காணிக்க உள்நுழையவும்.'
                }
              </p>
            </div>

            {/* Form Toggle Header */}
            <div className="flex items-center gap-6 mb-8 border-b border-emerald-100 pb-2 relative z-10" data-purpose="form-toggles">
              <button
                className={`text-lg font-bold pb-2 transition-all focus:outline-none ${
                  activeTab === 'login'
                    ? 'text-[#064e3b] border-b-2 border-[#15803d]'
                    : 'text-emerald-700/60 hover:text-[#064e3b]'
                }`}
                onClick={() => setActiveTab('login')}
              >
                {language === 'English' ? 'Login' : 'உள்நுழைவு'}
              </button>
              <button
                className={`text-lg font-bold pb-2 transition-all focus:outline-none ${
                  activeTab === 'signup'
                    ? 'text-[#064e3b] border-b-2 border-[#15803d]'
                    : 'text-emerald-700/60 hover:text-[#064e3b]'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                {language === 'English' ? 'Sign Up' : 'பதிவு செய்ய'}
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="space-y-5 relative z-10" onSubmit={login}>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">
                    {language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">mail</span>
                    <input
                      id="loginEmail"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-[#064e3b] placeholder:text-emerald-600/40 focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all outline-none text-sm shadow-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">
                    {language === 'English' ? 'Password' : 'கடவுச்சொல்'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">lock</span>
                    <input
                      id="loginPassword"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-[#064e3b] placeholder:text-emerald-600/40 focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all outline-none text-sm shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold bg-[#15803d] hover:bg-[#166534] text-white shadow-md transform active:scale-95 transition-all text-sm mt-2 focus:outline-none"
                >
                  {language === 'English' ? 'Sign In' : 'உள்நுழைக'}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form className="space-y-4 relative z-10" onSubmit={signup}>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                    {language === 'English' ? 'Full Name' : 'முழு பெயர்'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">person</span>
                    <input
                      id="signupName"
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-[#064e3b] placeholder:text-emerald-600/40 focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all outline-none text-sm shadow-sm"
                      placeholder={language === 'English' ? 'Enter your name' : 'உங்கள் பெயர்'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                    {language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">mail</span>
                    <input
                      id="signupEmail"
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-[#064e3b] placeholder:text-emerald-600/40 focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all outline-none text-sm shadow-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                    {language === 'English' ? 'Create Password' : 'புதிய கடவுச்சொல்'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">lock</span>
                    <input
                      id="signupPassword"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-[#064e3b] placeholder:text-emerald-600/40 focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all outline-none text-sm shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold bg-[#15803d] hover:bg-[#166534] text-white shadow-md transform active:scale-95 transition-all text-sm mt-3 focus:outline-none"
                >
                  {language === 'English' ? 'Create Account' : 'கணக்கை உருவாக்கு'}
                </button>
              </form>
            )}

            {/* Social Authentication / Google Login */}
            <div className="mt-8 relative z-10" data-purpose="social-auth">
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-emerald-100 w-full absolute"></div>
                <span className="relative bg-white px-4 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  {language === 'English' ? 'Or continue with' : 'அல்லது இதனுடன் தொடரவும்'}
                </span>
              </div>
              <div className="w-full flex justify-center">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-[#064e3b] font-bold transition-all active:scale-[0.98] text-sm focus:outline-none shadow-sm"
                >
                  <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24">
                    <path
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="text-sm font-bold">{language === 'English' ? 'Google Account' : 'கூகுள் கணக்கு'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING QUICK HELP WIDGET */}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end">
        {/* Help panel popup */}
        {isHelpOpen && (
          <div className="mb-4 w-[calc(100vw-3rem)] sm:w-[400px] max-w-[400px] bg-white/95 border border-emerald-200 rounded-[2rem] p-6 shadow-2xl backdrop-blur-md animate-fade-in-up opacity-0" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between items-center pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 font-bold">help_center</span>
                <span className="font-extrabold text-[#064e3b] text-base">
                  {language === 'English' ? 'Quick Help Desk' : 'உதவி மையம்'}
                </span>
              </div>
              <a 
                href="#"
                role="button"
                onClick={(e) => { e.preventDefault(); setIsHelpOpen(false); }}
                className="close-btn w-7 h-7 rounded-full bg-emerald-50 hover:bg-[#c0392b]/10 text-emerald-800 hover:text-[#c0392b] flex items-center justify-center transition-colors focus:outline-none"
                style={{ width: '28px', height: '28px' }}
                aria-label="Close Help Desk"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </a>
            </div>

            {/* Content - FAQ Accordions */}
            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {/* FAQ 1 */}
              <FAQItem 
                question={language === 'English' ? 'How to submit a grievance?' : 'குறையை எவ்வாறு சமர்ப்பிப்பது?'}
                answer={language === 'English' 
                  ? 'Click "Get Started / Sign In" to log in with Google or a registered email. Once signed in, fill the feedback form, select the issue category, set local details, and hit Submit.'
                  : 'Google அல்லது மின்னஞ்சல் மூலம் உள்நுழைந்து, குறை தீர்க்கும் படிவத்தை நிரப்பி சமர்ப்பிக்கவும்.'}
              />
              {/* FAQ 2 */}
              <FAQItem 
                question={language === 'English' ? 'Who views my grievance?' : 'எனது குறையை யார் பார்ப்பார்கள்?'}
                answer={language === 'English'
                  ? 'Verified constituency administrators receive your grievance instantly. They will review, assign local resources, and update the resolution status in real-time.'
                  : 'சரிபார்க்கப்பட்ட தொகுதி நிர்வாகி உங்கள் குறையை உடனடியாகப் பெற்று அதைத் தீர்ப்பார்.'}
              />
              {/* FAQ 3 */}
              <FAQItem 
                question={language === 'English' ? 'Is registration free?' : 'பதிவு செய்ய கட்டணம் உள்ளதா?'}
                answer={language === 'English'
                  ? 'Yes, registration and submission of grievances is absolutely free and open to all citizens within our assembly constituencies.'
                  : 'ஆம், பதிவு செய்வதும் குறைகளைச் சமர்ப்பிப்பதும் முற்றிலும் இலவசம்.'}
              />

              {/* Quick Metrics / Stats inside popup - using flex instead of grid to prevent global layout overrides */}
              <div className="mt-4 pt-4 border-t border-emerald-100 flex items-stretch gap-2 text-center">
                <div className="flex-1 p-2 bg-emerald-50 rounded-xl flex flex-col justify-center">
                  <div className="text-xs sm:text-sm font-black text-emerald-800">12k+</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Received</div>
                </div>
                <div className="flex-1 p-2 bg-amber-50 rounded-xl flex flex-col justify-center">
                  <div className="text-xs sm:text-sm font-black text-amber-800">92%</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-amber-600 uppercase tracking-tight">Resolved</div>
                </div>
                <div className="flex-1 p-2 bg-[#c0392b]/5 rounded-xl flex flex-col justify-center">
                  <div className="text-xs sm:text-sm font-black text-[#c0392b]">24h</div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-[#c0392b]/70 uppercase tracking-tight">Avg Response</div>
                </div>
              </div>
            </div>

            {/* Contact/Support button */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex justify-between items-center text-xs">
              <span className="text-emerald-700/80 font-bold">{language === 'English' ? 'Need Direct Support?' : 'நேரடி உதவி வேண்டுமா?'}</span>
              <a href="mailto:support@admkfeedback.in" className="px-3 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-lg transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">mail</span>
                Email Support
              </a>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <a
          href="#"
          role="button"
          onClick={(e) => { e.preventDefault(); setIsHelpOpen(!isHelpOpen); }}
          className="w-14 h-14 bg-[#15803d] hover:bg-[#166534] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all focus:outline-none relative group"
          style={{ width: '56px', height: '56px' }}
          aria-label="Toggle Quick Guide"
        >
          <span className="material-symbols-outlined text-2xl animate-pulse">support_agent</span>
          {/* Tooltip badge */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-[#064e3b] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all shadow-md">
            {language === 'English' ? 'Quick Help Desk' : 'உதவி மையம்'}
          </span>
        </a>
      </div>
      
      {/* ─── BOTTOM PORTAL FOOTER ─── */}
      <footer className="w-full py-8 mt-12 bg-white/70 border-t border-emerald-100 relative z-10 text-center px-4">
        <div className="flex justify-center gap-6 mb-4">
          <img src="/irratai_ellai.png" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" alt="Twin Leaves" />
        </div>
        <p className="text-sm font-semibold text-emerald-800">
          அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் — மக்கள் குறை தீர்ப்பு போர்டல்
        </p>
        <p className="text-xs text-emerald-800/80 max-w-md mx-auto mt-2 leading-relaxed">
          This portal allows citizens of Tamil Nadu Assembly Constituencies to directly submit suggestions, insights, and report local grievances. Verified admins will handle resolutions efficiently.
        </p>
        <p className="text-[10px] text-emerald-600/70 mt-4 uppercase tracking-widest font-semibold">
          InsightFlow Corporate Feedback &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-emerald-100 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-bold text-xs text-emerald-950 hover:bg-emerald-50/50 transition-colors"
      >
        <span>{question}</span>
        <span className={`material-symbols-outlined text-sm transition-transform ${isOpen ? 'rotate-180 text-[#c0392b]' : 'text-emerald-600'}`}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="p-3 bg-emerald-50/20 text-[11px] text-emerald-800 leading-relaxed border-t border-emerald-50 animate-fade-in opacity-0" style={{ animationDelay: '0ms' }}>
          {answer}
        </div>
      )}
    </div>
  );
}
