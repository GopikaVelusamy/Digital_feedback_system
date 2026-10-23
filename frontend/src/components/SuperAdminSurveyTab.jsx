import React, { useState, useEffect } from 'react';
import { API } from '../config';

const SALEM_CONSTITUENCIES = [
  'All',
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

export default function SuperAdminSurveyTab({ language = 'English' }) {
  const isTa = language === 'Tamil';
  const [subTab, setSubTab] = useState('wardForms'); // 'analytics' | 'wardForms' | 'builder' | 'responses'

  // Data states
  const [analytics, setAnalytics] = useState({
    total_responses: 0,
    total_surveyors: 0,
    total_questions: 0,
    by_constituency: [],
    by_surveyor: []
  });
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Question Form States
  const [qTextEn, setQTextEn] = useState('');
  const [qTextTa, setQTextTa] = useState('');
  const [qType, setQType] = useState('mcq'); // 'mcq' | 'rating' | 'yesno' | 'text'
  const [qOptionsEn, setQOptionsEn] = useState(['', '']);
  const [qOptionsTa, setQOptionsTa] = useState(['', '']);
  const [qRequired, setQRequired] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [expandedResponseId, setExpandedResponseId] = useState(null);
  const [filterConstituency, setFilterConstituency] = useState('All');

  // ─── WARD-SPECIFIC SURVEY FORMS STATES (1 Form Per Ward) ───────
  const [configuredWardForms, setConfiguredWardForms] = useState([]);
  const [wardConstituency, setWardConstituency] = useState('Edappadi');
  const [wardNumber, setWardNumber] = useState('13');
  const [currentWardForm, setCurrentWardForm] = useState(null);
  const [loadingWardForm, setLoadingWardForm] = useState(false);
  const [savingWardForm, setSavingWardForm] = useState(false);
  const [wardFormTitleEn, setWardFormTitleEn] = useState('');
  const [wardFormTitleTa, setWardFormTitleTa] = useState('');
  const [wardQuestions, setWardQuestions] = useState([]);

  // Ward Question Builder inputs
  const [wardQTextEn, setWardQTextEn] = useState('');
  const [wardQTextTa, setWardQTextTa] = useState('');
  const [wardQType, setWardQType] = useState('mcq');
  const [wardQOptionsEn, setWardQOptionsEn] = useState(['', '']);
  const [wardQOptionsTa, setWardQOptionsTa] = useState(['', '']);
  const [wardQRequired, setWardQRequired] = useState(true);
  const [filterWardConstituency, setFilterWardConstituency] = useState('All');

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    await Promise.all([
      fetchAnalytics(),
      fetchQuestions(),
      fetchResponses(),
      fetchConfiguredWardForms(),
      fetchWardForm('Salem', 'Edappadi', '13')
    ]);
    setLoading(false);
  }

  async function fetchAnalytics() {
    try {
      const res = await fetch(`${API}/api/survey-analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.warn("Analytics fetch error:", e);
    }
  }

  async function fetchQuestions() {
    try {
      const res = await fetch(`${API}/api/survey-questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Questions fetch error:", e);
    }
  }

  async function fetchResponses(constituency = 'All') {
    try {
      const url = constituency && constituency !== 'All'
        ? `${API}/api/survey-responses?constituency=${encodeURIComponent(constituency)}`
        : `${API}/api/survey-responses`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setResponses(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Responses fetch error:", e);
    }
  }

  function handleFilterConstituencyChange(c) {
    setFilterConstituency(c);
    fetchResponses(c);
  }

  // ─── WARD FORMS LOGIC ──────────────────────────────────────────
  async function fetchConfiguredWardForms(constituency = 'All') {
    try {
      const url = constituency && constituency !== 'All'
        ? `${API}/api/ward-survey-forms?district=Salem&constituency=${encodeURIComponent(constituency)}`
        : `${API}/api/ward-survey-forms?district=Salem`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setConfiguredWardForms(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Ward forms fetch error:", e);
    }
  }

  async function fetchWardForm(district, constituency, ward) {
    if (!constituency || !ward) return;
    setLoadingWardForm(true);
    try {
      const res = await fetch(`${API}/api/ward-survey-form?district=${encodeURIComponent(district)}&constituency=${encodeURIComponent(constituency)}&ward=${encodeURIComponent(ward)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentWardForm(data);
        setWardFormTitleEn(data.title || `${constituency} - Ward ${ward} Survey`);
        setWardFormTitleTa(data.title_ta || `${constituency} - வார்டு ${ward} பொதுமக்கள் கணக்கெடுப்பு`);
        setWardQuestions(Array.isArray(data.questions) ? data.questions : []);
      }
    } catch (e) {
      console.warn("Fetch ward form error:", e);
    } finally {
      setLoadingWardForm(false);
    }
  }

  function handleSelectWardToEdit(constituency, ward) {
    setWardConstituency(constituency);
    setWardNumber(ward);
    fetchWardForm('Salem', constituency, ward);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  async function handleSaveWardForm() {
    if (!wardConstituency || !wardNumber.trim()) {
      alert("Please specify Constituency and Ward Number.");
      return;
    }
    if (wardQuestions.length === 0) {
      alert("Please add at least one question to the ward survey form.");
      return;
    }

    setSavingWardForm(true);
    const payload = {
      district: 'Salem',
      constituency: wardConstituency,
      ward: wardNumber.trim(),
      title: wardFormTitleEn.trim() || `${wardConstituency} - Ward ${wardNumber} Survey`,
      title_ta: wardFormTitleTa.trim() || `${wardConstituency} - வார்டு ${wardNumber} கணக்கெடுப்பு`,
      questions: wardQuestions
    };

    try {
      const res = await fetch(`${API}/api/ward-survey-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        setCurrentWardForm(result.form);
        fetchConfiguredWardForms(filterWardConstituency);
        alert(result.message || `Survey form for Ward ${wardNumber} saved successfully!`);
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to save ward survey form.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving ward survey form.");
    } finally {
      setSavingWardForm(false);
    }
  }

  async function handleDeleteWardForm(formId) {
    if (!window.confirm("Are you sure you want to reset this ward? It will revert to using the default questions.")) return;
    try {
      const res = await fetch(`${API}/api/ward-survey-form/${formId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchConfiguredWardForms(filterWardConstituency);
        fetchWardForm('Salem', wardConstituency, wardNumber);
        alert("Custom ward form removed; ward now uses default questions.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleCloneDefaultQuestions() {
    if (questions.length === 0) {
      alert("No default questions found to clone.");
      return;
    }
    if (window.confirm("Clone all default questions into this ward's form? Any unsaved changes in this ward form will be replaced.")) {
      setWardQuestions(JSON.parse(JSON.stringify(questions)));
    }
  }

  function handleAddQuestionToWard(e) {
    e.preventDefault();
    if (!wardQTextEn.trim() && !wardQTextTa.trim()) {
      alert("Please provide question title in English or Tamil.");
      return;
    }

    const newQ = {
      _id: 'wq_' + Date.now(),
      question_text: wardQTextEn.trim() || wardQTextTa.trim(),
      question_text_ta: wardQTextTa.trim() || wardQTextEn.trim(),
      type: wardQType,
      options: wardQType === 'mcq' ? wardQOptionsEn.filter(o => o.trim()) : [],
      options_ta: wardQType === 'mcq' ? wardQOptionsTa.filter(o => o.trim()) : [],
      required: wardQRequired,
      order: wardQuestions.length + 1
    };

    setWardQuestions([...wardQuestions, newQ]);
    setWardQTextEn('');
    setWardQTextTa('');
    setWardQOptionsEn(['', '']);
    setWardQOptionsTa(['', '']);
  }

  function handleRemoveWardQuestion(idx) {
    setWardQuestions(wardQuestions.filter((_, i) => i !== idx));
  }

  function handleMoveWardQuestion(idx, direction) {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= wardQuestions.length) return;
    const copy = [...wardQuestions];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setWardQuestions(copy);
  }

  function handleAddWardOption() {
    setWardQOptionsEn([...wardQOptionsEn, '']);
    setWardQOptionsTa([...wardQOptionsTa, '']);
  }

  function handleRemoveWardOption(idx) {
    if (wardQOptionsEn.length <= 2) return;
    setWardQOptionsEn(wardQOptionsEn.filter((_, i) => i !== idx));
    setWardQOptionsTa(wardQOptionsTa.filter((_, i) => i !== idx));
  }

  function handleWardOptionChange(idx, val, lang) {
    if (lang === 'en') {
      const next = [...wardQOptionsEn];
      next[idx] = val;
      setWardQOptionsEn(next);
    } else {
      const next = [...wardQOptionsTa];
      next[idx] = val;
      setWardQOptionsTa(next);
    }
  }

  // ─── GLOBAL QUESTION BUILDER HANDLERS ─────────────────────────
  function handleAddOption() {
    setQOptionsEn([...qOptionsEn, '']);
    setQOptionsTa([...qOptionsTa, '']);
  }

  function handleRemoveOption(idx) {
    if (qOptionsEn.length <= 2) return;
    setQOptionsEn(qOptionsEn.filter((_, i) => i !== idx));
    setQOptionsTa(qOptionsTa.filter((_, i) => i !== idx));
  }

  function handleOptionChange(idx, val, lang) {
    if (lang === 'en') {
      const next = [...qOptionsEn];
      next[idx] = val;
      setQOptionsEn(next);
    } else {
      const next = [...qOptionsTa];
      next[idx] = val;
      setQOptionsTa(next);
    }
  }

  async function handleCreateQuestion(e) {
    e.preventDefault();
    if (!qTextEn.trim() && !qTextTa.trim()) {
      alert("Please provide at least one title for the question.");
      return;
    }

    setSavingQuestion(true);
    const doc = {
      question_text: qTextEn.trim() || qTextTa.trim(),
      question_text_ta: qTextTa.trim() || qTextEn.trim(),
      type: qType,
      options: qType === 'mcq' ? qOptionsEn.filter(o => o.trim()) : [],
      options_ta: qType === 'mcq' ? qOptionsTa.filter(o => o.trim()) : [],
      required: qRequired,
      order: questions.length + 1
    };

    try {
      const res = await fetch(`${API}/api/survey-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      if (res.ok) {
        setQTextEn('');
        setQTextTa('');
        setQOptionsEn(['', '']);
        setQOptionsTa(['', '']);
        fetchQuestions();
        fetchAnalytics();
      } else {
        alert("Failed to save question. Check server connection.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving question.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function handleDeleteQuestion(id) {
    if (!window.confirm("Are you sure you want to remove this question from active surveys?")) return;
    try {
      const res = await fetch(`${API}/api/survey-questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchQuestions();
        fetchAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSeedQuestions() {
    if (!window.confirm("Load recommended bilingual civic feedback questions into database?")) return;
    setSeeding(true);
    try {
      const res = await fetch(`${API}/api/survey-questions/seed?force=true`, { method: 'POST' });
      if (res.ok) {
        await fetchQuestions();
        await fetchAnalytics();
        alert("Recommended questions successfully loaded!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to seed questions.");
    } finally {
      setSeeding(false);
    }
  }

  // Export CSV
  function handleExportCSV() {
    if (responses.length === 0) {
      alert("No responses available to export.");
      return;
    }

    const headers = [
      'Submitted At',
      'Constituency',
      'Ward',
      'Street/Area',
      'Local Body',
      'Respondent Name',
      'Age',
      'Gender',
      'Surveyor Name',
      'Surveyor Email',
      'Form Title',
      'Answers'
    ];

    const rows = responses.map(r => {
      const ansFormatted = (r.answers || [])
        .map(a => `[Q: ${a.question_text} => A: ${a.answer}]`)
        .join(' | ');

      return [
        `"${r.submitted_at || ''}"`,
        `"${r.constituency || ''}"`,
        `"${r.ward || ''}"`,
        `"${r.area_street || ''}"`,
        `"${r.local_body || ''}"`,
        `"${r.respondent_name || 'Anonymous'}"`,
        `"${r.respondent_age || ''}"`,
        `"${r.respondent_gender || ''}"`,
        `"${r.surveyor_name || ''}"`,
        `"${r.surveyor_email || ''}"`,
        `"${r.form_title || ''}"`,
        `"${ansFormatted.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Salem_Public_Survey_Responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Sub-Tabs Navigation */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-teal-500/20 bg-gradient-to-r from-teal-900/10 via-emerald-800/5 to-teal-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 text-[10px] font-black uppercase tracking-wider mb-2">
            🗳️ Public Survey Management • Salem District
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#064e3b] tracking-tight">
            {isTa ? 'பொது கணக்கெடுப்பு கட்டுப்பாட்டு மையம்' : 'Field Survey Control Center'}
          </h3>
          <p className="text-xs font-bold text-emerald-800 mt-1">
            {isTa
              ? 'வார்டு வாரியான வினாப்பட்டியல்கள், கள ஆய்வாளர்கள் மற்றும் பதில்களை நிர்வகிக்கவும்'
              : 'Configure dedicated 1-to-1 survey forms per ward, manage questions, and analyze responses.'}
          </p>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setSubTab('wardForms')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              subTab === 'wardForms'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            🏘️ {isTa ? 'வார்டு வினாப்பட்டியல்கள்' : 'Ward Survey Forms'} ({configuredWardForms.length})
          </button>
          <button
            onClick={() => setSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              subTab === 'analytics'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            📊 {isTa ? 'புள்ளிவிவரங்கள்' : 'Analytics & Stats'}
          </button>
          <button
            onClick={() => setSubTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              subTab === 'builder'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            📋 {isTa ? 'பொது வினாப்பட்டியல்' : 'Default Questions'} ({questions.length})
          </button>
          <button
            onClick={() => setSubTab('responses')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              subTab === 'responses'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            📥 {isTa ? 'பதில்கள்' : 'Responses'} ({responses.length})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB: WARD-SPECIFIC SURVEY FORMS (1 FORM PER WARD)     */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'wardForms' && (
        <div className="space-y-8">

          {/* Top Ward Selection Card */}
          <div className="glass-card rounded-[2rem] p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-900/5 to-teal-900/10 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  🎯 1 Ward = 1 Survey Form
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#064e3b] mt-2">
                  {isTa ? 'வார்டு வினாப்பட்டியல் அமைப்பாளர்' : 'Ward Survey Form Builder'}
                </h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {isTa
                    ? 'தொகுதி மற்றும் வார்டைத் தேர்ந்தெடுத்து அந்த வார்டுக்குரிய வினாப்பட்டியலை தனிப்பயனாக்குங்கள்.'
                    : 'Select a Constituency and Ward to customize the exact survey questionnaire for that specific area.'}
                </p>
              </div>

              {/* Selector Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Constituency</label>
                  <select
                    value={wardConstituency}
                    onChange={(e) => {
                      setWardConstituency(e.target.value);
                      fetchWardForm('Salem', e.target.value, wardNumber);
                    }}
                    className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm"
                  >
                    {SALEM_CONSTITUENCIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Ward Number</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">Ward</span>
                    <input
                      type="text"
                      value={wardNumber}
                      onChange={(e) => setWardNumber(e.target.value)}
                      placeholder="e.g. 13"
                      className="w-20 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => fetchWardForm('Salem', wardConstituency, wardNumber)}
                      className="px-3.5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black uppercase transition active:scale-95 shadow"
                    >
                      {isTa ? 'ஏற்று' : 'Load'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Ward Status Pill */}
            <div className="mt-6 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-700">
                  Active for: <strong className="text-emerald-900">{wardConstituency} › Ward {wardNumber}</strong>
                </span>

                {loadingWardForm ? (
                  <span className="text-xs text-slate-500 italic">Loading ward form...</span>
                ) : currentWardForm?.is_custom ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                    🎯 Dedicated Ward Form Active ({wardQuestions.length} Questions)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-black">
                    📋 Currently using General / Default Questions ({wardQuestions.length} Questions)
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloneDefaultQuestions}
                  className="px-3.5 py-1.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition flex items-center gap-1"
                  title="Copy all default questions into this ward form"
                >
                  📋 Clone Default Questions
                </button>
                {currentWardForm?.is_custom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteWardForm(currentWardForm._id)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center gap-1"
                    title="Remove custom form and revert this ward to default questions"
                  >
                    ↺ Reset to Default
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Meta Editor & Questions Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Form Details & Add Question */}
            <div className="lg:col-span-5 space-y-6">

              {/* Form Title Card */}
              <div className="glass-card rounded-3xl p-6 border-slate-200/80 shadow-sm space-y-4">
                <h5 className="font-black text-[#064e3b] text-sm uppercase tracking-wider">
                  📝 Form Title & Identity
                </h5>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Form Title (English)
                  </label>
                  <input
                    type="text"
                    value={wardFormTitleEn}
                    onChange={(e) => setWardFormTitleEn(e.target.value)}
                    placeholder="e.g. Edappadi Ward 13 Water & Sanitation Survey"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    படிவத்தின் தலைப்பு (Tamil Title)
                  </label>
                  <input
                    type="text"
                    value={wardFormTitleTa}
                    onChange={(e) => setWardFormTitleTa(e.target.value)}
                    placeholder="எ.கா. எடப்பாடி வார்டு 13 குடிநீர் மற்றும் சுகாதார கணக்கெடுப்பு"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Add New Question to Ward Form */}
              <div className="glass-card rounded-3xl p-6 border-slate-200/80 shadow-sm space-y-4">
                <h5 className="font-black text-[#064e3b] text-sm uppercase tracking-wider">
                  ➕ Add Question for Ward {wardNumber}
                </h5>

                <form onSubmit={handleAddQuestionToWard} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Question Text (English)
                    </label>
                    <textarea
                      rows="2"
                      required
                      value={wardQTextEn}
                      onChange={(e) => setWardQTextEn(e.target.value)}
                      placeholder="e.g. Is drinking water supplied regularly in Ward 13?"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      வினா தலைப்பு (Tamil)
                    </label>
                    <textarea
                      rows="2"
                      value={wardQTextTa}
                      onChange={(e) => setWardQTextTa(e.target.value)}
                      placeholder="எ.கா. வார்டு 13-ல் குடிநீர் விநியோகம் சீராக உள்ளதா?"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Question Type
                    </label>
                    <select
                      value={wardQType}
                      onChange={(e) => setWardQType(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-sm"
                    >
                      <option value="mcq">🔘 Multiple Choice (Options)</option>
                      <option value="rating">⭐ 1 to 5 Star Rating</option>
                      <option value="yesno">✔️ Yes / No Choice</option>
                      <option value="text">📝 Free Text / Open Feedback</option>
                    </select>
                  </div>

                  {/* MCQ choices */}
                  {wardQType === 'mcq' && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                          Options ({wardQOptionsEn.length})
                        </label>
                        <button
                          type="button"
                          onClick={handleAddWardOption}
                          className="text-[11px] font-bold text-teal-700 hover:text-teal-900"
                        >
                          + Add Option
                        </button>
                      </div>

                      {wardQOptionsEn.map((opt, idx) => (
                        <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Choice #{idx + 1}</span>
                            {wardQOptionsEn.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveWardOption(idx)}
                                className="text-red-500 hover:text-red-700 text-3xs font-bold uppercase"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleWardOptionChange(idx, e.target.value, 'en')}
                            placeholder={`Option ${idx + 1} (English)`}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={wardQOptionsTa[idx] || ''}
                            onChange={(e) => handleWardOptionChange(idx, e.target.value, 'ta')}
                            placeholder={`விருப்பம் ${idx + 1} (Tamil)`}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="wardQReq"
                      checked={wardQRequired}
                      onChange={(e) => setWardQRequired(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <label htmlFor="wardQReq" className="text-xs font-bold text-slate-700">
                      Mandatory Question (Surveyor cannot skip)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow active:scale-95"
                  >
                    + Add to Ward Questionnaire
                  </button>
                </form>
              </div>

              {/* SAVE FORM BUTTON */}
              <button
                type="button"
                onClick={handleSaveWardForm}
                disabled={savingWardForm || wardQuestions.length === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-black uppercase text-sm tracking-wider rounded-2xl shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>{savingWardForm ? 'Saving Form...' : `Save Survey Form for Ward ${wardNumber}`}</span>
              </button>
            </div>

            {/* Right Column: Live Questions for this Ward */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-black text-[#064e3b] text-base">
                    📋 Active Questions for Ward {wardNumber} ({wardQuestions.length})
                  </h5>
                  <p className="text-xs font-semibold text-slate-500">
                    Field surveyors at {wardConstituency} › Ward {wardNumber} will see these exact questions.
                  </p>
                </div>
              </div>

              {wardQuestions.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border-dashed border-2 border-slate-300">
                  <span className="text-4xl block mb-2">❓</span>
                  <h6 className="font-bold text-slate-700">No questions in this ward form</h6>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Clone Default Questions" above to pre-populate with recommended civic questions, or add custom questions using the form on the left.
                  </p>
                  <button
                    onClick={handleCloneDefaultQuestions}
                    className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold shadow hover:bg-teal-800 transition"
                  >
                    📋 Pre-fill with Default Questions
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wardQuestions.map((q, idx) => (
                    <div
                      key={q._id || idx}
                      className="glass-card rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition space-y-3 bg-white/80"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h6 className="font-black text-slate-800 text-sm">{q.question_text}</h6>
                            {q.question_text_ta && (
                              <p className="text-xs font-semibold text-emerald-800 mt-0.5">{q.question_text_ta}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Reorder Buttons */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveWardQuestion(idx, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === wardQuestions.length - 1}
                            onClick={() => handleMoveWardQuestion(idx, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Down"
                          >
                            ▼
                          </button>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {q.type === 'mcq' ? '🔘 MCQ' : q.type === 'rating' ? '⭐ Rating' : q.type === 'yesno' ? '✔️ Yes/No' : '📝 Text'}
                          </span>
                          {q.required && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-100 text-red-700">
                              Req
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveWardQuestion(idx)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition ml-1"
                            title="Remove Question"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Preview MCQ options if any */}
                      {q.type === 'mcq' && q.options && q.options.length > 0 && (
                        <div className="pl-10 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, i) => (
                            <div key={i} className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                              <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                              <span>{opt}</span>
                              {q.options_ta && q.options_ta[i] && (
                                <span className="block text-[10px] text-emerald-700 mt-0.5">{q.options_ta[i]}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CATALOG OF ALL CONFIGURED WARD FORMS                    */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="glass-card rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-black text-[#064e3b]">
                  🗺️ Configured Ward Survey Forms Catalog
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Overview of all wards that have a customized 1-to-1 survey form.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-slate-500">Filter Constituency:</span>
                <select
                  value={filterWardConstituency}
                  onChange={(e) => {
                    setFilterWardConstituency(e.target.value);
                    fetchConfiguredWardForms(e.target.value);
                  }}
                  className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                >
                  {SALEM_CONSTITUENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {configuredWardForms.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No custom ward forms configured yet for this constituency. All wards currently use the default questions.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Constituency</th>
                      <th className="py-3 px-4">Ward</th>
                      <th className="py-3 px-4">Form Title</th>
                      <th className="py-3 px-4 text-center">Questions</th>
                      <th className="py-3 px-4 text-center">Submissions</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {configuredWardForms.map((f) => (
                      <tr key={f._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-black text-teal-900">{f.constituency}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-black text-xs">
                            Ward {f.ward}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate">
                          <div className="font-bold text-slate-800">{f.title}</div>
                          {f.title_ta && <div className="text-[11px] text-emerald-800">{f.title_ta}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold">{f.questions_count || 0}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            {f.responses_count || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {f.updated_at ? new Date(f.updated_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectWardToEdit(f.constituency, f.ward)}
                              className="px-3 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 rounded-lg text-xs font-bold transition"
                            >
                              ✏️ Edit Form
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteWardForm(f._id)}
                              className="px-2.5 py-1 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition"
                              title="Delete custom form and revert to default"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB: ANALYTICS & STATS                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'analytics' && (
        <div className="space-y-8">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-teal-600">
              <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Total Survey Submissions</span>
              <div className="text-3xl sm:text-4xl font-black text-teal-800 mt-2 font-mono">
                {analytics.total_responses}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Door-to-door citizen surveys verified</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-emerald-600">
              <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Active Field Surveyors</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-2 font-mono">
                {analytics.total_surveyors}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Authorized surveyor accounts</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-amber-500">
              <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Default Questions</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-700 mt-2 font-mono">
                {analytics.total_questions || questions.length}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Bilingual base survey questions</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-blue-600 flex flex-col justify-between">
              <div>
                <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Customized Ward Forms</span>
                <div className="text-3xl sm:text-4xl font-black text-blue-800 mt-2 font-mono">
                  {configuredWardForms.length}
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-1">Wards with custom question sets</p>
              </div>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* By Constituency */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[#064e3b] text-base">
                  📍 Responses by Assembly Constituency
                </h4>
                <span className="text-xs font-bold text-slate-400">Salem District</span>
              </div>

              {(!analytics.by_constituency || analytics.by_constituency.length === 0) ? (
                <p className="text-xs text-slate-500 py-6 text-center">No submissions by constituency yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.by_constituency.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <span className="font-black text-slate-800 text-xs">{c._id || 'Unknown Area'}</span>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-mono font-black text-xs">
                          {c.count} surveys
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By Surveyor */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[#064e3b] text-base">
                  👷 Top Active Field Surveyors
                </h4>
                <span className="text-xs font-bold text-slate-400">Live Tracker</span>
              </div>

              {(!analytics.by_surveyor || analytics.by_surveyor.length === 0) ? (
                <p className="text-xs text-slate-500 py-6 text-center">No surveyor submissions recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.by_surveyor.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <div>
                        <div className="font-black text-slate-800 text-xs">{s.name || s._id}</div>
                        <div className="text-[10px] text-slate-400">{s._id}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-black text-xs">
                        {s.count} surveys
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB: DEFAULT QUESTION BUILDER (FALLBACK QUESTIONNAIRE)  */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'builder' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create New Default Question Form */}
            <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-[#064e3b]">
                  {isTa ? 'புதிய பொது வினாவைச் சேர்க்க' : 'Add Default Question'}
                </h4>
                <button
                  onClick={handleSeedQuestions}
                  disabled={seeding}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
                >
                  {seeding ? 'Loading...' : '⚡ Seed Recommended'}
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Question Text (English)
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={qTextEn}
                    onChange={(e) => setQTextEn(e.target.value)}
                    placeholder="e.g. How is the regular drinking water supply in your ward?"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    வினா தலைப்பு (Tamil Translation)
                  </label>
                  <textarea
                    rows="2"
                    value={qTextTa}
                    onChange={(e) => setQTextTa(e.target.value)}
                    placeholder="எ.கா. உங்கள் பகுதியில் குடிநீர் விநியோகம் எவ்வாறு உள்ளது?"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Answer Format / Question Type
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 transition"
                  >
                    <option value="mcq">🔘 Multiple Choice (Options)</option>
                    <option value="rating">⭐ 1 to 5 Star Rating</option>
                    <option value="yesno">✔️ Yes / No Choice</option>
                    <option value="text">📝 Free Text / Open Feedback</option>
                  </select>
                </div>

                {/* MCQ Options Builder */}
                {qType === 'mcq' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                        Answer Options ({qOptionsEn.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900"
                      >
                        + Add Choice
                      </button>
                    </div>

                    {qOptionsEn.map((opt, idx) => (
                      <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Choice #{idx + 1}</span>
                          {qOptionsEn.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="text-red-500 hover:text-red-700 text-3xs font-bold uppercase"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value, 'en')}
                          placeholder={`Option ${idx + 1} (English)`}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={qOptionsTa[idx] || ''}
                          onChange={(e) => handleOptionChange(idx, e.target.value, 'ta')}
                          placeholder={`விருப்பம் ${idx + 1} (Tamil)`}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="qRequiredCheck"
                    checked={qRequired}
                    onChange={(e) => setQRequired(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="qRequiredCheck" className="text-xs font-bold text-slate-700">
                    Mandatory Question (Surveyor cannot skip)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-black uppercase text-xs tracking-wider rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  {savingQuestion ? 'Publishing Question...' : '✓ Add Question to Default Survey'}
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-[#064e3b]">
                  {isTa ? 'செயலில் உள்ள பொது வினாக்கள்' : 'Default Civic Questionnaire'} ({questions.length})
                </h4>
                <span className="text-xs font-bold text-slate-500">Used as base fallback</span>
              </div>

              {questions.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <span className="text-4xl block mb-2">📋</span>
                  <h5 className="font-bold text-slate-700">No questions configured yet</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Use the form on the left or click "Seed Recommended" to add recommended bilingual civic questions.
                  </p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q._id || idx}
                    className="glass-card rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="font-black text-slate-800 text-sm">{q.question_text}</h5>
                          {q.question_text_ta && (
                            <p className="text-xs font-semibold text-emerald-800 mt-0.5">{q.question_text_ta}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {q.type === 'mcq' ? '🔘 MCQ' : q.type === 'rating' ? '⭐ Rating' : q.type === 'yesno' ? '✔️ Yes/No' : '📝 Text'}
                        </span>
                        {q.required && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-100 text-red-700">
                            Required
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Delete Question"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Preview of options if MCQ */}
                    {q.type === 'mcq' && q.options && q.options.length > 0 && (
                      <div className="pl-10 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, i) => (
                          <div key={i} className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                            <span>{opt}</span>
                            {q.options_ta && q.options_ta[i] && (
                              <span className="block text-[10px] text-emerald-700 mt-0.5">{q.options_ta[i]}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB: SURVEY RESPONSES CATALOG                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'responses' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Filter by Constituency:</span>
              <select
                value={filterConstituency}
                onChange={(e) => handleFilterConstituencyChange(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
              >
                {SALEM_CONSTITUENCIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
            >
              <span>📥 Export CSV</span>
            </button>
          </div>

          {responses.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <span className="text-4xl block mb-2">📥</span>
              <h5 className="font-bold text-slate-700">No survey responses received yet</h5>
              <p className="text-xs text-slate-500 mt-1">
                Responses recorded by surveyors using the field app will display here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((r) => {
                const isExpanded = expandedResponseId === r._id;
                return (
                  <div
                    key={r._id}
                    className="glass-card rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#064e3b]">
                            {r.respondent_name || 'Anonymous Citizen'}
                          </span>
                          {(r.respondent_age || r.respondent_gender) && (
                            <span className="text-xs text-slate-500 font-semibold">
                              ({r.respondent_age ? `${r.respondent_age} yrs` : ''} {r.respondent_gender})
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800">
                            {r.constituency}
                          </span>
                          {r.form_title && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              📋 {r.form_title}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          📍 {r.ward ? `Ward: ${r.ward}, ` : ''}{r.area_street || ''} {r.local_body ? `(${r.local_body})` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-3xs font-bold text-slate-400 uppercase block">Surveyor</span>
                          <span className="font-bold text-slate-700">{r.surveyor_name || r.surveyor_email}</span>
                          <span className="text-3xs text-slate-400 block font-mono">
                            {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedResponseId(isExpanded ? null : r._id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-teal-800 font-bold hover:bg-teal-50 transition text-xs"
                        >
                          {isExpanded ? 'Hide Answers ▲' : 'View Answers ▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable answers */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2.5 animate-fadeIn">
                        <h6 className="text-[11px] font-black uppercase tracking-wider text-teal-900">
                          Citizen Survey Responses:
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(r.answers || []).map((ans, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                              <span className="text-3xs font-black uppercase text-slate-400 block">Question {i + 1}</span>
                              <p className="text-xs font-bold text-slate-800">{ans.question_text}</p>
                              <div className="mt-1 inline-block px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 font-bold text-xs">
                                💬 {String(ans.answer)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
