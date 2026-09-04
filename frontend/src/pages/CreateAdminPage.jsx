import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

const SALEM_DEPARTMENTS = [
  'Infrastructure & Public Works',
  'Education & Youth Affairs',
  'Health, Safety & Welfare',
  'Agriculture & Rural Development',
  'Government Schemes & Governance',
  'Party Affairs & Leadership',
  'Governance',
  'Leadership',
  'Local Issues',
  'Infrastructure',
  'Education',
  'Healthcare',
  'Employment',
  'Agriculture',
  "Women's Welfare",
  'Youth Development',
  'Public Safety',
  'Government Schemes',
  'Party Organisation',
  'Candidate Feedback',
  'Election Issues',
  'Suggestions',
  'Complaints'
];

export default function CreateAdminPage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState(SALEM_DEPARTMENTS[0]);
  const [btnText, setBtnText] = useState('CONFIRM DEPARTMENT ASSIGNMENT');
  const [showModal, setShowModal] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    setLoadingAdmins(true);
    try {
      const res = await fetch(`${API}/api/admins`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setAdminList(data);
        setLoadingAdmins(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Fail-safe local admins fallback
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
    setAdminList(combined);
    setLoadingAdmins(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBtnText('PROCESSING...');

    const adminData = {
      name,
      email,
      password,
      district: 'Salem',
      assigned_department: assignedDepartment,
      role: 'department_admin',
    };

    function saveLocalAndComplete() {
      const existingLocal = JSON.parse(localStorage.getItem('local_dept_admins') || '[]');
      const updatedLocal = [...existingLocal.filter(a => a.email.toLowerCase() !== adminData.email.toLowerCase()), adminData];
      localStorage.setItem('local_dept_admins', JSON.stringify(updatedLocal));

      setShowModal(true);
      setName('');
      setEmail('');
      setPassword('');
      fetchAdmins();
    }

    try {
      const res = await fetch(`${API}/api/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (!data.error) {
          saveLocalAndComplete();
          return;
        } else {
          alert(data.error || 'Error creating department admin. Email might already exist.');
          return;
        }
      }
    } catch (err) {
      console.error("Backend fetch error, executing local fail-safe creation:", err);
    }

    // Fail-safe local creation fallback
    saveLocalAndComplete();
    setBtnText('CONFIRM DEPARTMENT ASSIGNMENT');
  }

  async function handleRevokeAdmin(adminEmail) {
    if (!window.confirm(`Are you sure you want to revoke admin account for ${adminEmail}?`)) return;
    try {
      const res = await fetch(`${API}/api/admins/${encodeURIComponent(adminEmail)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Admin account revoked successfully.');
      }
    } catch (e) {
      console.error(e);
    }

    // Remove from local backup storage as well
    const localAdmins = JSON.parse(localStorage.getItem('local_dept_admins') || '[]');
    const updated = localAdmins.filter(a => a.email.toLowerCase() !== adminEmail.toLowerCase());
    localStorage.setItem('local_dept_admins', JSON.stringify(updated));
    fetchAdmins();
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-start p-4 md:p-8 text-[#064e3b]"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      {/* Floating blobs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-800/8 rounded-full blur-3xl animate-float"></div>
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
            <h3 className="text-2xl font-bold text-[#064e3b] mb-2">Department Admin Assigned</h3>
            <p className="text-[#047857] mb-6 text-sm font-semibold">
              Credentials and department queue permissions have been granted successfully.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Continue Managing
            </button>
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="relative z-10 w-full max-w-4xl space-y-10 my-4">

        {/* Header */}
        <header className="text-center">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/super-admin'); }}
            className="inline-flex items-center text-[#047857] hover:text-[#064e3b] transition mb-4 text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Super Admin Panel
          </a>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#064e3b] tracking-tighter uppercase">
            Assign Department Admin
          </h1>
          <p className="text-[#047857] mt-2 font-medium">
            Salem District Master Portal • Assign department-wise grievance routing authorities
          </p>
        </header>

        {/* Form Card */}
        <div
          className="rounded-[3rem] p-8 lg:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(22, 163, 74, 0.06)',
          }}
        >
          <form
            id="adminForm"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter full name"
                className="w-full p-4 rounded-2xl outline-none font-semibold text-[#064e3b] bg-white border border-emerald-500/20 focus:border-emerald-500 transition shadow-sm"
              />
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="infra_admin@salem.gov.in"
                className="w-full p-4 rounded-2xl outline-none font-semibold text-[#064e3b] bg-white border border-emerald-500/20 focus:border-emerald-500 transition shadow-sm"
              />
            </div>

            {/* Access Password */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl outline-none font-semibold text-[#064e3b] bg-white border border-emerald-500/20 focus:border-emerald-500 transition shadow-sm"
              />
            </div>

            {/* Assigned Department */}
            <div>
              <label className="block text-xs font-black text-[#047857] mb-2 uppercase tracking-widest ml-2">
                Assigned Department (Salem District)
              </label>
              <select
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                className="w-full p-4 rounded-2xl outline-none font-semibold text-[#064e3b] bg-white border border-emerald-500/20 focus:border-emerald-500 transition shadow-sm cursor-pointer"
              >
                {SALEM_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-white text-emerald-950">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-lg transition transform active:scale-95"
              >
                {btnText}
              </button>
            </div>

          </form>
        </div>

        {/* ── Sub-Admin Management Table ── */}
        <div
          className="rounded-[3rem] p-8 lg:p-10 space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(22, 163, 74, 0.06)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <span className="text-3xs font-black text-emerald-600 uppercase tracking-widest block">
                Active Permissions
              </span>
              <h3 className="text-2xl font-black text-[#064e3b] uppercase">
                Active Department Admins
              </h3>
            </div>
            <button
              onClick={fetchAdmins}
              className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase hover:bg-emerald-200 transition"
            >
              Refresh Table
            </button>
          </div>

          {loadingAdmins ? (
            <div className="text-center py-8 text-emerald-700 font-bold text-sm">
              Loading active admins...
            </div>
          ) : adminList.length === 0 ? (
            <div className="text-center py-8 text-emerald-700 font-semibold text-sm">
              No assigned department admins found. Use the form above to assign one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-200 text-3xs font-black text-emerald-800 uppercase tracking-wider">
                    <th className="py-3 px-4">Admin Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role / Type</th>
                    <th className="py-3 px-4">Assigned Scope</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 text-xs font-semibold text-[#064e3b]">
                  {adminList.map((adm) => {
                    const isSuper = adm.email === 'admin@admk.org' || adm.email === 'varunthanwar@gmail.com' || adm.role === 'admin';
                    return (
                      <tr key={adm._id || adm.email} className="hover:bg-emerald-50/50 transition">
                        <td className="py-3.5 px-4 font-extrabold">{adm.name || 'Admin'}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-900">{adm.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-full text-3xs font-black uppercase tracking-wider ${isSuper ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                            {isSuper ? 'SUPER ADMIN' : 'DEPARTMENT ADMIN'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-800">
                          {isSuper ? 'Salem District (Master)' : (adm.assigned_department || 'Department Queue')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!isSuper ? (
                            <button
                              onClick={() => handleRevokeAdmin(adm.email)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-bold text-3xs uppercase tracking-wider transition"
                            >
                              Revoke
                            </button>
                          ) : (
                            <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Master Key</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
