// ============================================================
// CreateAdminPage.jsx — Exact React conversion of createadmin.html
// All districts, success modal, form submit logic preserved
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

// All 38 Tamil Nadu districts — exact from createadmin.html
const TN_DISTRICTS = [
  'Chennai','Ariyalur','Chengalpattu','Coimbatore','Cuddalore',
  'Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram',
  'Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam',
  'Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram',
  'Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni',
  'Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur',
  'Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore',
  'Viluppuram','Virudhunagar',
];

export default function CreateAdminPage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [btnText, setBtnText] = useState('CONFIRM ASSIGNMENT');
  const [showModal, setShowModal] = useState(false);

  // ─── handleSubmit — exact mirror from createadmin.html ──────
  async function handleSubmit(e) {
    e.preventDefault();
    setBtnText('PROCESSING...');

    const adminData = {
      name,
      email,
      password,
      district,
      role: 'admin',
    };

    try {
      const res = await fetch(`${API}/api/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });

      if (res.ok) {
        // Show success modal — exact behavior from createadmin.html
        setShowModal(true);
      } else {
        alert('Error creating admin. Email might already exist.');
        setBtnText('CONFIRM ASSIGNMENT');
      }
    } catch (err) {
      console.error(err);
      alert('Server Error');
      setBtnText('CONFIRM ASSIGNMENT');
    }
  }

  return (
    // ─── createadmin.html body structure — exact ─────────────────
    <div
      className="min-h-screen relative flex items-center justify-center p-4 text-[#064e3b]"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {/* Floating blobs */}
      <div
        className="absolute top-20 left-20 w-32 h-32 bg-emerald-800/8 rounded-full blur-3xl animate-float"
      ></div>
      <div
        className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-800/8 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '-3s' }}
      ></div>

      {/* ── Success Modal ── */}
      {showModal && (
        <div
          id="successModal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            className="p-8 rounded-[2.5rem] max-w-sm w-full text-center border border-emerald-250/20 bg-white text-[#064e3b]"
            style={{
              boxShadow: '0 25px 50px -12px rgba(22, 163, 74, 0.04)',
            }}
          >
            <div className="w-20 h-20 bg-emerald-100 text-[#10b981] border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <h3 className="text-2xl font-bold text-[#064e3b] mb-2">Admin Created</h3>
            <p className="text-[#047857] mb-6 text-sm font-semibold">
              Credentials have been saved and notification sent successfully.
            </p>
            <button
              onClick={() => navigate('/super-admin')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Return to Panel
            </button>
          </div>
        </div>
      )}

      {/* ── Main Form ── */}
      <main className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <header className="text-center mb-10">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/super-admin'); }}
            className="inline-flex items-center text-[#047857] hover:text-[#064e3b] transition mb-4 text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Panel
          </a>
          <h1 className="text-5xl font-extrabold text-[#064e3b] tracking-tighter">
            Assign New Admin
          </h1>
          <p className="text-[#047857] mt-2 font-medium">
            Grant specialized access to district authorities
          </p>
        </header>

        {/* Card with Form */}
        <div
          className="rounded-[3rem] p-8 lg:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(22, 163, 74, 0.04)',
          }}
        >
          <form
            id="adminForm"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter full name"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  outline: 'none',
                  fontWeight: 600,
                  color: '#064e3b',
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

            {/* Official Email */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Official Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tn.gov.in"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  outline: 'none',
                  fontWeight: 600,
                  color: '#064e3b',
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

            {/* Access Password */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Access Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  outline: 'none',
                  fontWeight: 600,
                  color: '#064e3b',
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

            {/* Assigned District */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Assigned District
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  outline: 'none',
                  fontWeight: 600,
                  color: '#064e3b',
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
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-white text-emerald-950">{d}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg transition transform active:scale-95"
              >
                {btnText}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
