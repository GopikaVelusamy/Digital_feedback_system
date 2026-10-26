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
  const [subTab, setSubTab] = useState('analytics'); // 'analytics' | 'summary' | 'builder' | 'responses'

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

  // Summary & Numerical Averages States
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);

  // Question Form States
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    await Promise.all([fetchAnalytics(), fetchQuestions(), fetchResponses()]);
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

  function calculateClientSummary(responsesList, questionsList) {
    const total = responsesList.length;
    if (total === 0) {
      return {
        total_responses: 0,
        overall_average_rating: 0,
        average_age: 0,
        min_age: 0,
        max_age: 0,
        question_averages: [],
        constituency_averages: []
      };
    }

    const ages = [];
    responsesList.forEach(r => {
      const a = parseFloat(r.respondent_age);
      if (!isNaN(a) && a >= 1 && a <= 120) ages.push(a);
    });
    const avg_age = ages.length > 0 ? (ages.reduce((s, x) => s + x, 0) / ages.length).toFixed(1) : 0;
    const min_age = ages.length > 0 ? Math.min(...ages) : 0;
    const max_age = ages.length > 0 ? Math.max(...ages) : 0;

    const qMap = {};
    (questionsList || []).forEach(q => {
      qMap[q._id] = {
        question_id: q._id,
        question_text: q.question_text,
        question_text_ta: q.question_text_ta,
        type: q.type,
        numeric_values: [],
        all_answers: [],
        by_constituency: {}
      };
    });

    const allRatings = [];
    const constMap = {};

    responsesList.forEach(r => {
      const c = r.constituency || 'Salem General';
      if (!constMap[c]) {
        constMap[c] = { name: c, count: 0, ratings: [], ages: [] };
      }
      constMap[c].count++;
      const a = parseFloat(r.respondent_age);
      if (!isNaN(a) && a >= 1 && a <= 120) constMap[c].ages.push(a);

      (r.answers || []).forEach(ans => {
        const qid = ans.question_id || ans.question_text;
        if (!qMap[qid]) {
          qMap[qid] = {
            question_id: qid,
            question_text: ans.question_text,
            type: 'unknown',
            numeric_values: [],
            all_answers: [],
            by_constituency: {}
          };
        }
        qMap[qid].all_answers.push(ans.answer);

        const num = parseFloat(ans.answer);
        if (!isNaN(num)) {
          qMap[qid].numeric_values.push(num);
          if (num >= 1 && num <= 10) {
            allRatings.push(num);
            constMap[c].ratings.push(num);
          }
          if (!qMap[qid].by_constituency[c]) qMap[qid].by_constituency[c] = [];
          qMap[qid].by_constituency[c].push(num);
        }
      });
    });

    const question_averages = Object.values(qMap).map(q => {
      const nums = q.numeric_values;
      const is_numeric = nums.length > 0 && nums.length >= (q.all_answers.length * 0.3);
      const avg = nums.length > 0 ? (nums.reduce((s, v) => s + v, 0) / nums.length).toFixed(2) : null;
      const min = nums.length > 0 ? Math.min(...nums) : null;
      const max = nums.length > 0 ? Math.max(...nums) : null;

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      nums.forEach(n => {
        const rounded = Math.round(n);
        if (distribution[rounded] !== undefined) distribution[rounded]++;
      });

      const breakdown = {};
      q.all_answers.forEach(ans => {
        const str = String(ans).trim();
        breakdown[str] = (breakdown[str] || 0) + 1;
      });

      return {
        question_id: q.question_id,
        question_text: q.question_text,
        question_text_ta: q.question_text_ta,
        type: q.type,
        total_responses: q.all_answers.length,
        is_numeric,
        average: avg,
        min,
        max,
        distribution,
        breakdown,
        by_constituency: q.by_constituency
      };
    });

    const overall_average_rating = allRatings.length > 0
      ? (allRatings.reduce((s, v) => s + v, 0) / allRatings.length).toFixed(2)
      : 0;

    const constituency_averages = Object.values(constMap).map(c => ({
      constituency: c.name,
      total_responses: c.count,
      average_rating: c.ratings.length > 0 ? (c.ratings.reduce((s, v) => s + v, 0) / c.ratings.length).toFixed(2) : null,
      average_age: c.ages.length > 0 ? (c.ages.reduce((s, v) => s + v, 0) / c.ages.length).toFixed(1) : null
    })).sort((a, b) => (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0));

    return {
      total_responses: total,
      overall_average_rating,
      average_age: avg_age,
      min_age,
      max_age,
      question_averages,
      constituency_averages
    };
  }

  async function fetchSummary(constituency = 'All') {
    setLoadingSummary(true);
    try {
      const url = constituency && constituency !== 'All'
        ? `${API}/api/survey-summary?constituency=${encodeURIComponent(constituency)}`
        : `${API}/api/survey-summary`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
        setLoadingSummary(false);
        return;
      }
    } catch (e) {
      console.warn("Backend summary fetch error, using local computation:", e);
    }

    const filtered = (constituency && constituency !== 'All')
      ? responses.filter(r => (r.constituency || '').toLowerCase() === constituency.toLowerCase())
      : responses;
    const computed = calculateClientSummary(filtered, questions);
    setSummaryData(computed);
    setLoadingSummary(false);
  }

  function handleFilterConstituencyChange(c) {
    setFilterConstituency(c);
    fetchResponses(c);
    if (subTab === 'summary') {
      fetchSummary(c);
    }
  }

  // Handle MCQ options
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

    // Build headers
    const headers = [
      'Submitted At',
      'Surveyor Name',
      'Surveyor Email',
      'District',
      'Constituency',
      'Local Body',
      'Ward',
      'Street / Area',
      'Citizen Name',
      'Citizen Age',
      'Citizen Gender',
      'Survey Answers'
    ];

    const rows = responses.map(r => {
      const answersSummary = (r.answers || [])
        .map(a => `[${a.question_text || 'Q'}]: ${a.answer}`)
        .join(' | ');

      return [
        `"${r.submitted_at || ''}"`,
        `"${r.surveyor_name || ''}"`,
        `"${r.surveyor_email || ''}"`,
        `"${r.district || ''}"`,
        `"${r.constituency || ''}"`,
        `"${r.local_body || ''}"`,
        `"${r.ward || ''}"`,
        `"${r.area_street || ''}"`,
        `"${r.respondent_name || 'Anonymous'}"`,
        `"${r.respondent_age || ''}"`,
        `"${r.respondent_gender || ''}"`,
        `"${answersSummary.replace(/"/g, '""')}"`
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

  function handleCopySummaryReport() {
    if (!summaryData) return;
    const lines = [
      "=====================================================",
      "SALEM PUBLIC SURVEY - RESPONSES SUMMARY & AVERAGES",
      `Generated: ${new Date().toLocaleString()}`,
      `Constituency Scope: ${filterConstituency || 'All Constituencies'}`,
      "=====================================================",
      `Total Responses Evaluated: ${summaryData.total_responses}`,
      `Overall Average Rating   : ${summaryData.overall_average_rating} / 5.0 (${Math.round(((parseFloat(summaryData.overall_average_rating) || 0) / 5) * 100)}%)`,
      `Average Respondent Age   : ${summaryData.average_age} yrs (Range: ${summaryData.min_age || 0} - ${summaryData.max_age || 0} yrs)`,
      "\n--- QUESTION-BY-QUESTION NUMERICAL AVERAGES ---",
      ...(summaryData.question_averages || []).map((q, idx) => {
        if (q.is_numeric && q.average !== null) {
          return `${idx + 1}. [AVERAGE RATING] ${q.question_text}: ${q.average} / 5.0 (Samples: ${q.total_responses})`;
        } else {
          return `${idx + 1}. ${q.question_text}: ${q.total_responses} responses recorded`;
        }
      }),
      "\n--- CONSTITUENCY SCORES & AVERAGES ---",
      ...(summaryData.constituency_averages || []).map(c =>
        `• ${c.constituency}: Avg Rating: ${c.average_rating || 'N/A'} / 5.0 | Avg Age: ${c.average_age || 'N/A'} yrs | Surveys: ${c.total_responses}`
      ),
      "====================================================="
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2500);
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
              ? 'கள ஆய்வாளர்கள், வினாப்பட்டியல் மற்றும் பொதுமக்களின் பதில்களை நிர்வகிக்கவும்'
              : 'Oversee field surveyors, configure bilingual questionnaire, and analyze citizen sentiment.'}
          </p>

          {/* Quick Action Button for Responses Summary & Averages */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSubTab('summary');
                fetchSummary(filterConstituency);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md active:scale-95"
            >
              <span>📈</span>
              <span>{isTa ? 'பதில்கள் சுருக்கம் & சராசரிகள் காண்க' : 'View Responses Summary & Averages'}</span>
              <span className="text-3xs opacity-90 bg-white/20 px-1.5 py-0.5 rounded font-mono">NEW</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner">
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
            onClick={() => {
              setSubTab('summary');
              fetchSummary(filterConstituency);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              subTab === 'summary'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            <span>📈</span>
            <span>{isTa ? 'சுருக்கம் & சராசரி' : 'Summary & Averages'}</span>
          </button>
          <button
            onClick={() => setSubTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              subTab === 'builder'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            ✍️ {isTa ? 'வினாப்பட்டியல்' : 'Question Builder'} ({questions.length})
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
      {/* SUB-TAB 1: ANALYTICS & STATS */}
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
              <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Active Questions</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-700 mt-2 font-mono">
                {analytics.total_questions || questions.length}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Bilingual survey questions live</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border-l-4 border-l-blue-600 flex flex-col justify-between">
              <div>
                <span className="text-3xs font-black uppercase tracking-widest text-slate-500">Constituencies Active</span>
                <div className="text-3xl sm:text-4xl font-black text-blue-800 mt-2 font-mono">
                  {analytics.by_constituency ? analytics.by_constituency.length : 0}
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2 px-3 rounded-xl bg-teal-700 text-white font-black text-[11px] uppercase tracking-wider hover:bg-teal-800 transition flex items-center justify-center gap-1.5 shadow"
                >
                  📥 Download CSV Data
                </button>
              </div>
            </div>
          </div>

          {/* Breakdown Section: Constituencies & Surveyors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Constituency Distribution */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-base font-black uppercase text-[#064e3b] tracking-tight flex items-center gap-2">
                  <span>🗳️</span> Constituency Response Breakdown
                </h4>
                <span className="text-xs font-bold text-slate-500">Salem District</span>
              </div>

              {(!analytics.by_constituency || analytics.by_constituency.length === 0) ? (
                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-xl block mb-1">📍</span>
                  <p className="text-xs font-bold text-slate-500">No constituency responses recorded yet.</p>
                  <p className="text-3xs text-slate-400 mt-1">Surveys submitted by field officers will show here automatically.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.by_constituency.map((item, idx) => {
                    const pct = analytics.total_responses > 0
                      ? Math.round((item.count / analytics.total_responses) * 100)
                      : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800">{item._id || 'Unknown Constituency'}</span>
                          <span className="font-mono text-teal-800 font-black">{item.count} surveys ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Field Surveyor Activity Leaderboard */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-base font-black uppercase text-[#064e3b] tracking-tight flex items-center gap-2">
                  <span>🏆</span> Surveyor Performance Leaderboard
                </h4>
                <a
                  href="/create-surveyor"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 transition"
                >
                  + Add Surveyor →
                </a>
              </div>

              {(!analytics.by_surveyor || analytics.by_surveyor.length === 0) ? (
                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-xl block mb-1">📋</span>
                  <p className="text-xs font-bold text-slate-500">No surveyor survey submissions yet.</p>
                  <p className="text-3xs text-slate-400 mt-1">Share the login portal with field surveyors to begin collecting.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.by_surveyor.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white/90 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {idx === 0 ? '🥇' : `#${idx + 1}`}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{s.name || s._id}</div>
                          <div className="font-mono text-3xs text-slate-500">{s._id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-sm text-teal-800">{s.count}</span>
                        <span className="text-[10px] text-slate-500 block font-semibold">surveys</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: QUESTION BUILDER */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'builder' && (
        <div className="space-y-8">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card rounded-3xl p-6">
            <div>
              <h4 className="text-lg font-black uppercase text-[#064e3b] tracking-tight">
                Active Survey Questionnaire ({questions.length} Questions)
              </h4>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Questions configured here are dynamically rendered in the Surveyor Mobile App in real-time.
              </p>
            </div>
            <button
              onClick={handleSeedQuestions}
              disabled={seeding}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow hover:from-amber-600 hover:to-amber-700 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <span>⚡</span>
              <span>{seeding ? 'Loading Defaults...' : 'Load Recommended Questions'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create New Question Form */}
            <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="font-black uppercase text-[#064e3b] text-base tracking-tight flex items-center gap-2">
                  <span>➕</span> Add New Survey Question
                </h4>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Bilingual English & Tamil support with auto-translation fallback
                </p>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Question Text (English) *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={qTextEn}
                    onChange={(e) => setQTextEn(e.target.value)}
                    placeholder="e.g. How is the drinking water supply in your area?"
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
                  {savingQuestion ? 'Publishing Question...' : '✓ Add Question to Survey Form'}
                </button>
              </form>
            </div>

            {/* Current Active Questions List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-black uppercase text-[#064e3b] text-base tracking-tight mb-2">
                Live Questions Preview
              </h4>

              {questions.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <span className="text-3xl block mb-2">📋</span>
                  <h5 className="font-bold text-slate-700">No questions currently in the survey</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Use the form on the left or tap "Load Recommended Questions" above to quickly start.
                  </p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q._id || idx}
                    className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-teal-500/40 transition shadow-sm space-y-3"
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
                          <span className="material-symbols-outlined text-sm">delete</span>
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
      {/* SUB-TAB 3: SURVEY RESPONSES CATALOG */}
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

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setSubTab('summary');
                  fetchSummary(filterConstituency);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow active:scale-95"
              >
                <span>📈</span>
                <span>{isTa ? 'சராசரி & சுருக்கம் காண்க' : 'View Summary & Averages'}</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
              >
                <span>📥 Export CSV</span>
              </button>
            </div>
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

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 4: RESPONSES SUMMARY & NUMERICAL AVERAGES */}
      {/* ─────────────────────────────────────────────────────────── */}
      {subTab === 'summary' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Controls Bar: Filter, Recalculate, Copy Report */}
          <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-teal-500/20 bg-gradient-to-r from-emerald-900/5 via-teal-800/5 to-emerald-900/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                📍 {isTa ? 'தொகுதி வாரியாக சராசரி:' : 'Average by Constituency:'}
              </span>
              <select
                value={filterConstituency}
                onChange={(e) => handleFilterConstituencyChange(e.target.value)}
                className="px-4 py-2 bg-white border border-teal-300 rounded-xl text-xs font-black text-teal-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SALEM_CONSTITUENCIES.map(c => (
                  <option key={c} value={c}>{c === 'All' ? (isTa ? 'அனைத்து தொகுதிகள் (சேலம் மாவட்டம்)' : 'All Constituencies (Salem Full)') : c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => fetchSummary(filterConstituency)}
                disabled={loadingSummary}
                className="px-4 py-2.5 rounded-xl border border-teal-300 text-teal-800 bg-white/80 hover:bg-teal-50 font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <span>🔄</span>
                <span>{loadingSummary ? (isTa ? 'கணக்கிடுகிறது...' : 'Recalculating...') : (isTa ? 'மீண்டும் கணக்கிடு' : 'Recalculate Averages')}</span>
              </button>

              <button
                onClick={handleCopySummaryReport}
                disabled={!summaryData || summaryData.total_responses === 0}
                className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-40"
              >
                <span>{summaryCopied ? '✅' : '📋'}</span>
                <span>{summaryCopied ? (isTa ? 'அறிக்கை நகலெடுக்கப்பட்டது!' : 'Report Copied!') : (isTa ? 'அறிக்கையை நகலெடு' : 'Copy Summary Report')}</span>
              </button>
            </div>
          </div>

          {loadingSummary ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="inline-block animate-spin text-4xl mb-3">⚙️</div>
              <h5 className="font-black text-slate-800 text-base">
                {isTa ? 'பதில்களின் சராசரிகள் கணக்கிடப்படுகின்றன...' : 'Computing Mathematical Averages & Summary...'}
              </h5>
              <p className="text-xs text-slate-500 mt-1">Aggregating citizen ratings, age demographics, and civic scores...</p>
            </div>
          ) : !summaryData || summaryData.total_responses === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center space-y-3">
              <span className="text-5xl block">📊</span>
              <h5 className="font-black text-slate-800 text-lg">
                {isTa ? 'கணக்கெடுப்பு பதில்கள் இன்னும் பதிவாகவில்லை' : 'No Survey Responses Available to Average'}
              </h5>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {isTa
                  ? 'கள ஆய்வாளர்கள் போர்ட்டல் (/survey/form) வழியாக கருத்துக்களை பதிவு செய்தவுடன், மதிப்பீடுகளின் சராசரிகள் இங்கு தானாக கணக்கிடப்படும்.'
                  : 'Once field surveyors submit surveys via the mobile survey form (/survey/form), numerical averages for road satisfaction, infrastructure ratings, and citizen demographics will appear here automatically.'}
              </p>
              <div className="pt-2">
                <a
                  href="/surveyor-login"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-black uppercase tracking-wider hover:bg-teal-800 transition shadow"
                >
                  🚀 {isTa ? 'ஆய்வாளர் போர்ட்டலை சோதிக்கவும்' : 'Open Surveyor Portal to Submit Test Response'}
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* 4 Hero KPI Cards with Numerical Averages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Overall Satisfaction Index Average */}
                <div className="glass-card rounded-3xl p-6 border-l-4 border-l-emerald-600 bg-gradient-to-br from-white via-white to-emerald-50/40 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black uppercase tracking-widest text-slate-500">
                      Overall Civic Rating
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-black uppercase bg-emerald-100 text-emerald-800">
                      {parseFloat(summaryData.overall_average_rating) >= 4.0 ? 'EXCELLENT' : parseFloat(summaryData.overall_average_rating) >= 3.0 ? 'MODERATE' : 'CRITICAL'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-emerald-800 font-mono tracking-tight">
                      {summaryData.overall_average_rating}
                    </span>
                    <span className="text-sm font-black text-slate-400">/ 5.0</span>
                  </div>

                  {/* Stars visual */}
                  <div className="text-amber-500 text-sm mt-1 tracking-widest">
                    {'★'.repeat(Math.min(5, Math.max(1, Math.round(parseFloat(summaryData.overall_average_rating) || 0))))}
                    {'☆'.repeat(5 - Math.min(5, Math.max(1, Math.round(parseFloat(summaryData.overall_average_rating) || 0))))}
                    <span className="text-3xs text-slate-500 font-bold ml-2">
                      ({Math.round(((parseFloat(summaryData.overall_average_rating) || 0) / 5) * 100)}% satisfaction)
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-slate-500 mt-2">
                    Calculated average across all numerical survey questions
                  </p>
                </div>

                {/* 2. Citizen Age Average */}
                <div className="glass-card rounded-3xl p-6 border-l-4 border-l-teal-600 bg-gradient-to-br from-white via-white to-teal-50/40 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black uppercase tracking-widest text-slate-500">
                      Average Citizen Age
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-black uppercase bg-teal-100 text-teal-800">
                      DEMOGRAPHICS
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-teal-800 font-mono tracking-tight">
                      {summaryData.average_age}
                    </span>
                    <span className="text-sm font-black text-slate-400">years</span>
                  </div>

                  <div className="text-xs font-bold text-teal-900 mt-1">
                    Youngest: {summaryData.min_age || '—'} yrs • Oldest: {summaryData.max_age || '—'} yrs
                  </div>

                  <p className="text-[10px] font-bold text-slate-500 mt-2">
                    Mean age of polled citizen respondents
                  </p>
                </div>

                {/* 3. Numeric Metrics Count */}
                <div className="glass-card rounded-3xl p-6 border-l-4 border-l-amber-500 bg-gradient-to-br from-white via-white to-amber-50/40 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black uppercase tracking-widest text-slate-500">
                      Evaluated Questions
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-black uppercase bg-amber-100 text-amber-800">
                      METRICS
                    </span>
                  </div>

                  <div className="text-4xl font-black text-amber-800 mt-2 font-mono tracking-tight">
                    {(summaryData.question_averages || []).filter(q => q.is_numeric).length || (summaryData.question_averages || []).length}
                  </div>

                  <div className="text-xs font-bold text-amber-900 mt-1">
                    Civic infrastructure & welfare dimensions
                  </div>

                  <p className="text-[10px] font-bold text-slate-500 mt-2">
                    Active questions contributing to quantitative averages
                  </p>
                </div>

                {/* 4. Total Survey Sample Size */}
                <div className="glass-card rounded-3xl p-6 border-l-4 border-l-blue-600 bg-gradient-to-br from-white via-white to-blue-50/40 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black uppercase tracking-widest text-slate-500">
                      Total Sample Size
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-black uppercase bg-blue-100 text-blue-800">
                      VERIFIED
                    </span>
                  </div>

                  <div className="text-4xl font-black text-blue-800 mt-2 font-mono tracking-tight">
                    {summaryData.total_responses}
                  </div>

                  <div className="text-xs font-bold text-blue-900 mt-1">
                    Scope: {filterConstituency === 'All' ? 'Salem District (All)' : filterConstituency}
                  </div>

                  <p className="text-[10px] font-bold text-slate-500 mt-2">
                    Total recorded citizen surveys in this sample
                  </p>
                </div>
              </div>

              {/* Question-By-Question Numerical Averages Section */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h4 className="text-lg font-black uppercase text-[#064e3b] tracking-tight flex items-center gap-2">
                      <span>📊</span> Question-by-Question Numerical Averages
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Detailed mean scores, star ratings, and citizen choice distributions for each surveyed question.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                    Total Evaluated Questions: {(summaryData.question_averages || []).length}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(summaryData.question_averages || []).map((q, idx) => {
                    const avgNum = parseFloat(q.average);
                    const hasAvg = q.is_numeric && !isNaN(avgNum);
                    const pct = hasAvg ? Math.round((avgNum / 5) * 100) : null;

                    return (
                      <div
                        key={q.question_id || idx}
                        className="p-5 bg-white/90 rounded-2xl border border-slate-200/90 shadow-sm hover:border-teal-500/40 transition space-y-4"
                      >
                        {/* Question Title & Tag */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-mono font-black text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <h5 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                                {q.question_text}
                              </h5>
                              {q.question_text_ta && (
                                <p className="text-3xs font-semibold text-emerald-800 mt-0.5">
                                  {q.question_text_ta}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase shrink-0 ${
                            hasAvg ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {hasAvg ? '⭐ Numerical Rating' : '🔘 Choice / Text'}
                          </span>
                        </div>

                        {/* If question has numerical average */}
                        {hasAvg ? (
                          <div className="space-y-3 pt-1">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-2xl font-black font-mono text-emerald-800 tracking-tight">
                                  {q.average}
                                </span>
                                <span className="text-xs font-bold text-slate-400 ml-1">/ 5.0 Average</span>
                              </div>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                                {pct}% Satisfaction
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  avgNum >= 4.0
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                                    : avgNum >= 3.0
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                    : 'bg-gradient-to-r from-rose-500 to-red-600'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                              />
                            </div>

                            {/* 1-5 Star Rating Distribution Breakdown */}
                            {q.distribution && (
                              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                <span className="text-3xs font-black uppercase tracking-wider text-slate-400 block">
                                  Score Rating Distribution (1 to 5 Stars):
                                </span>
                                <div className="grid grid-cols-5 gap-1.5 text-center">
                                  {[5, 4, 3, 2, 1].map((star) => {
                                    const cnt = q.distribution[star] || 0;
                                    const starPct = q.total_responses > 0 ? Math.round((cnt / q.total_responses) * 100) : 0;
                                    return (
                                      <div key={star} className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="text-3xs font-black text-amber-600">{star} ★</div>
                                        <div className="font-mono font-bold text-xs text-slate-800">{cnt}</div>
                                        <div className="text-3xs text-slate-400">{starPct}%</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-3xs font-bold text-slate-400 pt-1">
                              <span>Min Score: {q.min} ★</span>
                              <span>Max Score: {q.max} ★</span>
                              <span>Evaluated: {q.total_responses} citizens</span>
                            </div>
                          </div>
                        ) : (
                          /* Non-numerical: show option breakdowns */
                          <div className="space-y-2 pt-1">
                            <span className="text-3xs font-black uppercase tracking-wider text-slate-400 block">
                              Citizen Responses Breakdown:
                            </span>
                            <div className="space-y-1.5">
                              {Object.entries(q.breakdown || {}).slice(0, 4).map(([opt, cnt], i) => {
                                const optPct = q.total_responses > 0 ? Math.round((cnt / q.total_responses) * 100) : 0;
                                return (
                                  <div key={i} className="text-xs p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span className="font-semibold text-slate-700 truncate pr-2">{opt}</span>
                                    <span className="font-mono font-bold text-teal-800 shrink-0">
                                      {cnt} ({optPct}%)
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-right text-3xs font-bold text-slate-400">
                              Total: {q.total_responses} responses
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Constituency-wise Averages Scorecard Table */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h4 className="text-lg font-black uppercase text-[#064e3b] tracking-tight flex items-center gap-2">
                      <span>🏆</span> Constituency-Wise Averages & Comparison Scorecard
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Comparing overall citizen rating averages and citizen age across all Salem constituencies.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                  >
                    Export Full CSV Data
                  </button>
                </div>

                {(!summaryData.constituency_averages || summaryData.constituency_averages.length === 0) ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-bold">
                    No constituency averages computed yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-3xs font-black uppercase text-slate-400 tracking-wider">
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Constituency</th>
                          <th className="py-3 px-4 text-center">Sample Surveys</th>
                          <th className="py-3 px-4 text-center">Avg Rating Score</th>
                          <th className="py-3 px-4 text-center">Average Age</th>
                          <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {summaryData.constituency_averages.map((c, idx) => {
                          const rNum = parseFloat(c.average_rating);
                          const hasRating = !isNaN(rNum);
                          return (
                            <tr key={idx} className="hover:bg-teal-50/40 transition">
                              <td className="py-3.5 px-4 font-mono font-black text-slate-500">
                                {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-800">
                                {c.constituency}
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                                {c.total_responses}
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono font-black text-sm">
                                {hasRating ? (
                                  <span className={`inline-block px-2.5 py-1 rounded-lg ${
                                    rNum >= 4.0 ? 'bg-emerald-100 text-emerald-800' : rNum >= 3.0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    ★ {c.average_rating} / 5.0
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal text-xs">—</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                                {c.average_age ? `${c.average_age} yrs` : '—'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {hasRating ? (
                                  <span className={`px-2.5 py-1 rounded-full text-3xs font-black uppercase ${
                                    rNum >= 4.0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : rNum >= 3.0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                                  }`}>
                                    {rNum >= 4.0 ? 'Optimal' : rNum >= 3.0 ? 'Satisfactory' : 'Needs Focus'}
                                  </span>
                                ) : (
                                  <span className="text-3xs text-slate-400">Qualitative</span>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
