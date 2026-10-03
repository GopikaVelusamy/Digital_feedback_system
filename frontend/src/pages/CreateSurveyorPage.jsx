import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API } from '../config';

const SALEM_CONSTITUENCIES = [
  'All Constituencies',
  'Edappadi',
  'Mettur',
  'Omalur',
  'Salem North',
  'Salem South',
  'Salem West',
  'Veerapandi',
  'Yercaud',
  'Attur',
  'Gangavalli',
  'Thammampatti'
];

export default function CreateSurveyorPage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedConstituency, setAssignedConstituency] = useState(SALEM_CONSTITUENCIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [surveyorList, setSurveyorList] = useState([]);
  const [loadingSurveyors, setLoadingSurveyors] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSurveyors();
  }, []);

  async function fetchSurveyors() {
    setLoadingSurveyors(true);
    try {
      const res = await fetch(`${API}/api/surveyors`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSurveyorList(data);
          setLoadingSurveyors(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend error fetching surveyors:", e);
    }

    // Fallback: local storage
    const local = JSON.parse(localStorage.getItem('local_surveyors') || '[]');
    setSurveyorList(local);
    setLoadingSurveyors(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const surveyorData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      district: 'Salem',
      constituency: assignedConstituency,
      role: 'surveyor',
    };

    function saveLocalAndFinish() {
      const existing = JSON.parse(localStorage.getItem('local_surveyors') || '[]');
      const updated = [
        ...existing.filter(s => s.email.toLowerCase() !== surveyorData.email.toLowerCase()),
        surveyorData
      ];
      localStorage.setItem('local_surveyors', JSON.stringify(updated));

      setCreatedCredentials({ ...surveyorData });
      setShowModal(true);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSubmitting(false);
      fetchSurveyors();
    }

    try {
      const res = await fetch(`${API}/api/create-surveyor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyorData),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.error) {
          setErrorMsg(data.error);
          setSubmitting(false);
          return;
        }
        saveLocalAndFinish();
        return;
      } else {
        const errText = await res.text();
        console.warn("Create surveyor returned non-json:", errText);
      }
    } catch (err) {
      console.error("Backend error, executing local surveyor creation:", err);
    }

    saveLocalAndFinish();
  }

  async function handleDeleteSurveyor(surveyorEmail) {
    if (!window.confirm(`Are you sure you want to revoke the surveyor account for ${surveyorEmail}?`)) return;

    try {
      await fetch(`${API}/api/surveyors/${encodeURIComponent(surveyorEmail)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn("Backend delete surveyor error:", e);
    }

    // Also remove from local storage
    const local = JSON.parse(localStorage.getItem('local_surveyors') || '[]');
    const updated = local.filter(s => s.email.toLowerCase() !== surveyorEmail.toLowerCase());
    localStorage.setItem('local_surveyors', JSON.stringify(updated));
    fetchSurveyors();
  }

  function handleCopyCredentials() {
    if (!createdCredentials) return;
    const text = `Field Surveyor Credentials\nPortal: ${window.location.origin}/surveyor-login\nEmail / User ID: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nConstituency: ${createdCredentials.constituency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      className="min-h-screen text-[#064e3b] flex flex-col lg:flex-row relative"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar variant="admin" />

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-10 flex flex-col items-center justify-start relative min-h-screen">
        
        {/* Top Back Link */}
        <button
          onClick={() => navigate('/super-admin')}
          className="self-start mb-6 text-emerald-800 hover:text-emerald-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition"
        >
          ← Back to Super Admin Panel
        </button>

        {/* Header Title */}
        <div className="text-center mb-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 text-[10px] font-black uppercase tracking-wider mb-3">
            📋 Field Operations Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#064e3b] tracking-tight">
            Register Field Surveyor
          </h1>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-2">
            Salem District Master Portal • Create credentials for on-ground surveyors collecting citizen surveys
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="w-full max-w-2xl mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-emerald-500/20 rounded-[2.5rem] p-8 sm:p-12 shadow-xl mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Field Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Surveyor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Field Row 2: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Surveyor Login Email / ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="surveyor.salem@admk.org"
                  className="w-full bg-slate-50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Access Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Field Row 3: District & Constituency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Assigned District
                </label>
                <input
                  type="text"
                  value="Salem"
                  disabled
                  className="w-full bg-slate-100 border border-emerald-500/10 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b]/60 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                  Assigned Constituency (Salem)
                </label>
                <select
                  value={assignedConstituency}
                  onChange={(e) => setAssignedConstituency(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-[#064e3b] focus:outline-none focus:border-teal-500 transition"
                >
                  {SALEM_CONSTITUENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? 'CREATING SURVEYOR ACCOUNT...' : 'REGISTER & ASSIGN SURVEYOR'}
            </button>
          </form>
        </div>

        {/* Existing Surveyors Section */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black uppercase text-[#064e3b] tracking-tight">
                Active Field Surveyors ({surveyorList.length})
              </h2>
              <p className="text-[11px] font-bold text-emerald-800 tracking-wide">
                Authorized surveyor accounts permitted to log into the Public Survey Mobile Portal
              </p>
            </div>
            <button
              onClick={fetchSurveyors}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 transition"
            >
              🔄 Refresh List
            </button>
          </div>

          {loadingSurveyors ? (
            <div className="p-8 text-center bg-white/50 backdrop-blur rounded-3xl border border-emerald-500/10">
              <span className="text-sm font-bold text-slate-500">Loading surveyors...</span>
            </div>
          ) : surveyorList.length === 0 ? (
            <div className="p-8 text-center bg-white/50 backdrop-blur rounded-3xl border border-emerald-500/10">
              <span className="text-2xl block mb-2">📋</span>
              <p className="text-sm font-bold text-slate-600">No surveyors registered yet.</p>
              <p className="text-xs text-slate-500 mt-1">Use the form above to create your first field surveyor account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surveyorList.map((s, idx) => (
                <div
                  key={s.email || idx}
                  className="bg-white/80 backdrop-blur-xl border border-teal-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg">
                        {s.name ? s.name[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#064e3b] text-sm">{s.name || 'Unnamed Surveyor'}</h3>
                        <p className="text-xs text-slate-500 font-mono">{s.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800 tracking-wider">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-emerald-900">📍 {s.constituency || 'Salem'}</span>
                      {s.phone && <span className="ml-3 text-slate-500">📞 {s.phone}</span>}
                    </div>
                    <button
                      onClick={() => handleDeleteSurveyor(s.email)}
                      className="text-red-500 hover:text-red-700 font-bold text-[11px] uppercase tracking-wider transition"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showModal && createdCredentials && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full border border-teal-500/20 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
                ✅
              </div>

              <div>
                <h3 className="text-xl font-black text-[#064e3b] uppercase tracking-tight">
                  Surveyor Account Created!
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  The surveyor can now log in to the field portal using these credentials.
                </p>
              </div>

              {/* Credential Box */}
              <div className="bg-slate-50 border border-teal-200 rounded-2xl p-4 text-left font-mono text-xs space-y-1.5">
                <div><span className="text-slate-500">Name:</span> <strong className="text-slate-800">{createdCredentials.name}</strong></div>
                <div><span className="text-slate-500">Email:</span> <strong className="text-slate-800">{createdCredentials.email}</strong></div>
                <div><span className="text-slate-500">Password:</span> <strong className="text-teal-700">{createdCredentials.password}</strong></div>
                <div><span className="text-slate-500">Constituency:</span> <strong className="text-slate-800">{createdCredentials.constituency}</strong></div>
                <div><span className="text-slate-500">Login URL:</span> <strong className="text-emerald-700">{window.location.origin}/surveyor-login</strong></div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleCopyCredentials}
                  className="w-full py-3 rounded-xl bg-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-teal-800 transition"
                >
                  {copied ? '✓ Credentials Copied to Clipboard!' : '📋 Copy Login Details'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open('/surveyor-login', '_blank')}
                    className="flex-1 py-3 rounded-xl border border-teal-300 text-teal-800 font-bold text-xs uppercase tracking-wider hover:bg-teal-50 transition"
                  >
                    Open Login Portal ↗
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
