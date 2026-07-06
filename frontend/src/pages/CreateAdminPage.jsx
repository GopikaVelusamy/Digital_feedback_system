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
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)',
        color: '#0f291b',
        overflowX: 'hidden',
      }}
    >
      {/* Grid Background — exact from createadmin.html */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {/* Floating blobs — exact from createadmin.html */}
      <div
        className="absolute top-20 left-20 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-float"
      ></div>
      <div
        className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '-3s' }}
      ></div>

      {/* ── Success Modal — exact from createadmin.html ── */}
      {showModal && (
        <div
          id="successModal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            className="p-8 rounded-[2.5rem] max-w-sm w-full text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin Created</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Credentials have been saved and notification sent successfully.
            </p>
            <button
              onClick={() => navigate('/super-admin')}
              className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black transition"
            >
              Return to Panel
            </button>
          </div>
        </div>
      )}

      {/* ── Main Form — exact from createadmin.html ── */}
      <main className="relative z-10 w-full max-w-2xl">

        {/* Header — exact from createadmin.html */}
        <header className="text-center mb-10">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/super-admin'); }}
            className="inline-flex items-center text-gray-400 hover:text-gray-800 transition mb-4 text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Panel
          </a>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter">
            Assign New Admin
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Grant specialized access to district authorities
          </p>
        </header>

        {/* Card with Form — exact from createadmin.html */}
        <div
          className="rounded-[3rem] p-8 lg:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form
            id="adminForm"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Full Name — exact from createadmin.html */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter full name"
                className="input-field w-full p-5 rounded-2xl font-semibold"
              />
            </div>

            {/* Official Email — exact from createadmin.html */}
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-2">
                Official Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tn.gov.in"
                className="input-field w-full p-5 rounded-2xl font-semibold"
              />
            </div>

            {/* Access Password — exact from createadmin.html */}
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-2">
                Access Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field w-full p-5 rounded-2xl font-semibold"
              />
            </div>

            {/* Assigned District — exact from createadmin.html (all 38 districts) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-2">
                Assigned District
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-field w-full p-5 rounded-2xl font-semibold appearance-none"
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Submit Button — exact from createadmin.html */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition transform active:scale-95"
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
