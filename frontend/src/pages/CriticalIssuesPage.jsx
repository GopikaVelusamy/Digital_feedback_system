// ============================================================
// CriticalIssuesPage.jsx — Complete Layout Redesign
//
// NEW LAYOUT (above-the-fold, no heavy scrolling):
//   ┌─────────────────────────────────────────────────────┐
//   │ Header: Title + Live badge + filters + refresh      │
//   ├────────────────┬────────────────────────────────────┤
//   │ LEFT col 35%   │ RIGHT col 65%                      │
//   │  ─ Dept ranks  │  ─ Feed cards (compact, paginated) │
//   │  ─ Urgency idx │    each card expandable on click   │
//   │  ─ Quick stats │                                    │
//   └────────────────┴────────────────────────────────────┘
//
// Cards: compact by default, "See More" expands full detail
// Sidebar: slides with cubic-bezier, ☰ beside title, same
//          cloud dancer palette as Dashboard
// Colors: exact same glass/taupe as original (no dark theme)
// ============================================================
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translationData, getLanguage, setLanguage } from '../utils/translations';
import ImageIntelCard from '../components/ImageIntelCard';
import Sidebar from '../components/Sidebar';

import { API } from '../config';

// ── Dept icon map ─────────────────────────────────────────────
const DEPT_ICONS = {
  road: 'road', water: 'water_drop', electricity: 'bolt',
  sanitation: 'delete', security: 'security', general: 'report',
  'roads & infrastructure': 'road', 'electricity & power': 'bolt',
  'water supply': 'water_drop', 'public security': 'security',
  education: 'school',
  health: 'medical_services',
  safety: 'security',
  transport: 'directions_bus',
  
  // fallback for any other categories
  other: 'bubble_chart',
  general: 'inventory_2'
};

// ── Risk color helpers ────────────────────────────────────────
function riskMeta(score) {
  if (score >= 65) return { color:'#EF4444', bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.25)', label:'HIGH' };
  if (score >= 35) return { color:'#F59E0B', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', label:'MOD' };
  return            { color:'#10B981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)', label:'OK' };
}

function layerColor(val) {
  if (!val) return '#9CA3AF';
  if (['pass','authentic','unique','verified'].includes(val)) return '#10B981';
  if (['warning','similar','suspicious','no_gps'].includes(val)) return '#F59E0B';
  return '#EF4444';
}

// ── Compact feedback card with accordion expand ───────────────
function FeedbackCard({ item, idx, navigate }) {
  const [expanded, setExpanded] = useState(false);

  const rating       = item.feedback?.rating || item.rating || 5;
  const district     = item.location?.district || item.district || 'TN';
  const constituency = item.location?.constituency || item.constituency || '';
  const text         = item.feedback?.original_text || item.feedback_text || '';
  const category     = item.ai?.category || item.feedback?.type || item.type_of_feedback || 'General';
  const email        = item.user?.email || item.email || '';
  const rawImg       = item.feedback?.image || item.image;
  const imgUrl       = rawImg ? `${API}/${rawImg}` : null;
  const validation   = item.image_validation;
  const risk         = validation?.overall_risk || 0;
  const rm           = riskMeta(risk);
  const isCritical   = rating <= 2;

  return (
    <div style={{
      background: 'rgba(240, 253, 244, 0.65)',
    backdropFilter: 'blur(50px)',
    border: `1px solid ${validation ? rm.border : isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(22, 163, 74, 0.25)'}`,
    borderRadius: 18,
    overflow: 'hidden',
    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)'}
    >
      {/* ── Compact top row (always visible) ── */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', cursor:'pointer' }}
        onClick={() => setExpanded(o => !o)}>

        {/* Rank number */}
        <div style={{
          width:28, height:28, borderRadius:'50%', flexShrink:0,
          background: isCritical ? 'rgba(239,68,68,0.12)' : 'rgba(107,114,128,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:11, fontWeight:900,
          color: isCritical ? '#EF4444' : '#6B7280',
          border: isCritical ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.4)',
        }}>
          {idx + 1}
        </div>

        {/* Thumbnail */}
        {imgUrl ? (
          <div style={{ width:46, height:46, borderRadius:10, overflow:'hidden', flexShrink:0, position:'relative' }}>
            <img src={imgUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            {validation && (
              <div style={{
                position:'absolute', inset:0,
                background:`${rm.color}22`,
                border:`1px solid ${rm.color}55`,
                borderRadius:10,
              }}/>
            )}
          </div>
        ) : (
          <div style={{ width:46, height:46, borderRadius:10, background:'rgba(107,114,128,0.08)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize:20, color:'#CBD5E1' }}>image_not_supported</span>
          </div>
        )}

        {/* Main info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{
              fontSize:11, fontWeight:900, color:'#0f291b', textTransform:'capitalize',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{category}</span>
            {isCritical && (
              <span style={{ fontSize:8, fontWeight:900, padding:'2px 7px', borderRadius:999, background:'rgba(239,68,68,0.1)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.2)', letterSpacing:'0.06em' }}>CRITICAL</span>
            )}
            {validation && (
              <span style={{ fontSize:8, fontWeight:900, padding:'2px 7px', borderRadius:999, background:rm.bg, color:rm.color, border:`1px solid ${rm.border}`, letterSpacing:'0.06em' }}>
                {rm.label} {risk}
              </span>
            )}
          </div>
          <div style={{ fontSize:11, color:'#4b6b58', fontWeight:600 }}>
            {district}{constituency ? ` · ${constituency}` : ''} &nbsp;·&nbsp;
            {'★'.repeat(Math.max(0, 5 - rating))}<span style={{ color:'#D1D5DB' }}>{'★'.repeat(rating)}</span>
            {' '}<span style={{ fontSize:10 }}>{rating}/5</span>
          </div>
        </div>

        {/* Layer pills (tiny, always visible) */}
        {validation && (
          <div style={{ display:'flex', gap:3, flexShrink:0 }}>
            {[
              { k:'E', v: validation.layers?.exif_geofence?.status },
              { k:'S', v: validation.layers?.semantic_alignment?.status },
              { k:'D', v: validation.layers?.phash_dedup?.status },
              { k:'A', v: validation.layers?.ela_authenticity?.status },
            ].map(({ k, v }) => (
              <div key={k} style={{
                width:18, height:18, borderRadius:4,
                background: `${layerColor(v)}18`,
                border: `1px solid ${layerColor(v)}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:8, fontWeight:900, color: layerColor(v),
              }}>{k}</div>
            ))}
          </div>
        )}

        {/* Chevron */}
        <span className="material-symbols-outlined" style={{
          fontSize:18, color:'#9CA3AF', flexShrink:0,
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}>expand_more</span>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.4)',
          animation: 'ciExpand 0.35s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {/* Image + text side by side */}
          <div style={{ display:'flex', gap:16, padding:'16px 16px 0' }}>
            {imgUrl && (
              <div style={{ width:200, height:130, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                <img src={imgUrl} alt={category} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            )}
            <div style={{ flex:1 }}>
              {text && (
                <p style={{ fontSize:12, color:'#0f291b', lineHeight:1.7, fontStyle:'italic', marginBottom:10 }}>
                  "{text}"
                </p>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { icon:'person', val: item.user?.name || item.name || 'Anonymous' },
                  { icon:'mail',   val: email || 'N/A' },
                  { icon:'calendar_today', val: item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'}) : 'N/A' },
                  { icon:'call',   val: item.user?.mobile_masked || item.booth_no || 'N/A' },
                ].map(({ icon, val }) => (
                  <div key={icon} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:12, color:'#4b6b58' }}>{icon}</span>
                    <span style={{ fontSize:11, color:'#4b6b58', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{val}</span>
                  </div>
                ))}
              </div>
              {/* GPS */}
              {validation?.layers?.exif_geofence?.lat && (
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:12, color:'#10B981' }}>location_on</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#10B981', fontFamily:'monospace' }}>
                    {validation.layers.exif_geofence.lat.toFixed(5)}, {validation.layers.exif_geofence.lon.toFixed(5)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation intel strip */}
          {validation && (
            <div style={{ margin:'12px 16px 0', padding:'10px 14px', borderRadius:10, background:'rgba(15,23,42,0.04)', border:'1px solid rgba(255,255,255,0.35)', display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:9, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase' }}>AI:</span>
              {[
                { label:'EXIF', val: validation.layers?.exif_geofence?.status },
                { label:'Content', val: validation.layers?.semantic_alignment?.status },
                { label:'Dedup', val: validation.layers?.phash_dedup?.status },
                { label:'ELA', val: validation.layers?.ela_authenticity?.status },
              ].map(({ label, val }) => {
                const c = layerColor(val);
                return (
                  <div key={label} style={{ padding:'2px 9px', borderRadius:5, background:`${c}15`, border:`1px solid ${c}33`, fontSize:9, fontWeight:800, color:c, display:'flex', alignItems:'center', gap:3 }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:c, display:'inline-block' }}/>
                    {label}: {val || '—'}
                  </div>
                );
              })}
              <span style={{ marginLeft:'auto', fontSize:11, fontWeight:900, color:rm.color }}>{risk}/100 risk</span>
            </div>
          )}

          {/* Action row */}
          <div style={{ display:'flex', gap:10, padding:'14px 16px' }}>
            <button onClick={() => navigate(`/feedback-detail?id=${item._id}`)}
              style={{
                flex:1, padding:'11px 0', borderRadius:12, fontSize:11, fontWeight:900,
                border:'none', cursor:'pointer', fontFamily:'Manrope,sans-serif',
                textTransform:'uppercase', letterSpacing:'0.07em', transition:'all 0.25s',
                background:'#15803d', color:'#fff',
                boxShadow:'0 4px 14px rgba(22, 101, 52, 0.25)',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#166534';e.currentTarget.style.boxShadow='0 4px 18px rgba(22, 101, 52, 0.4)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#15803d';e.currentTarget.style.boxShadow='0 4px 14px rgba(22, 101, 52, 0.25)';}}>
              <span className="material-symbols-outlined" style={{ fontSize:14, verticalAlign:'middle', marginRight:5 }}>manage_search</span>
              Investigate
            </button>
            <button onClick={() => setExpanded(false)}
              style={{
                padding:'11px 18px', borderRadius:12, fontSize:11, fontWeight:700,
                border:'1px solid rgba(255,255,255,0.5)', cursor:'pointer',
                background:'rgba(255,255,255,0.3)', color:'#6B7280', fontFamily:'Manrope,sans-serif',
                transition:'all 0.2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.5)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.3)'}>
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function CriticalIssuesPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

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

  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [allFeedbacks,     setAllFeedbacks]     = useState([]);
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [priorityFeedbacks,setPriorityFeedbacks]= useState([]);
  const [urgencyScore,     setUrgencyScore]     = useState('0.0');
  const [urgencyWidth,     setUrgencyWidth]     = useState('0%');
  const [filter,           setFilter]           = useState('all'); // all | critical | verified | flagged
  const [districtFilter,   setDistrictFilter]   = useState('');
  const [loading,          setLoading]          = useState(true);
  const [page,             setPage]             = useState(0);
  const PER_PAGE = 8;

  function renderDepartmentRankings(feedbacks) {
    const counts = {};
    feedbacks.filter(f => f.status !== 'Solved').forEach(f => {
      const cat = f.ai?.category || f.type_of_feedback || f.feedback?.type || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    setDepartmentCounts(Object.entries(counts).sort((a,b) => b[1]-a[1]));
  }

  function renderPriorityFeedbacks(feedbacks) {
    const sorted = [...feedbacks].sort((a,b) => {
      const aImg = a.feedback?.image || a.image;
      const bImg = b.feedback?.image || b.image;
      if (aImg && !bImg) return -1;
      if (!aImg && bImg) return 1;
      return (a.feedback?.rating || a.rating || 5) - (b.feedback?.rating || b.rating || 5);
    });
    setPriorityFeedbacks(sorted);
  }

  function updateUrgencyStats(feedbacks) {
    const total    = feedbacks.length;
    const critical = feedbacks.filter(f => (f.feedback?.rating || f.rating || 5) <= 2).length;
    const urgency  = total > 0 ? ((critical / total) * 10).toFixed(1) : '0.0';
    setUrgencyScore(urgency);
    setUrgencyWidth(`${urgency * 10}%`);
  }

  const loadCriticalData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/feedbacks`);
      const data = await res.json();
      setAllFeedbacks(data);
      renderDepartmentRankings(data);
      renderPriorityFeedbacks(data);
      updateUrgencyStats(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCriticalData(); }, [loadCriticalData]);

  // ── Filtered feed ─────────────────────────────────────────
  const filteredFeed = priorityFeedbacks.filter(f => {
    const dist = f.location?.district || f.district || '';
    if (districtFilter && dist !== districtFilter) return false;
    if (filter === 'critical') return (f.feedback?.rating || f.rating || 5) <= 2;
    if (filter === 'flagged')  return (f.image_validation?.overall_risk || 0) >= 65;
    if (filter === 'verified') return f.image_validation?.overall_status === 'verified';
    return true;
  });

  const totalPages = Math.ceil(filteredFeed.length / PER_PAGE);
  const pageFeed = filteredFeed.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div 
      className="min-h-screen text-[#064e3b] flex flex-col lg:flex-row relative"
      style={{
        fontFamily:"'Manrope',sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
        backgroundAttachment:'fixed',
      }}
    >
      <Sidebar variant="admin" />
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope...');

  .glass-symbol {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.25);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .glass-symbol::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, var(--dept-color) 0%, transparent 70%);
    opacity: 0.2;
    z-index: -1;
  }
        @keyframes ciExpand { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .glass-ci {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 8px 32px rgba(22, 163, 74, 0.04);
        }
        .filter-tab { padding:7px 16px; border-radius:999px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid rgba(16, 185, 129, 0.2); background: rgba(255, 255, 255, 0.8); transition:all 0.25s; letter-spacing:0.04em; font-family:Manrope,sans-serif; color: #047857; }
        .filter-tab-active { background:#16a34a!important; color:#fff!important; border-color:#16a34a!important; box-shadow:0 4px 12px rgba(16, 185, 129, 0.15); }
        .dept-bar { height:5px; border-radius:999px; transition:width 0.9s cubic-bezier(0.22,1,0.36,1); }
        .pagination-btn { padding:7px 14px; border-radius:8px; border:1px solid rgba(16,185,129,0.2); background:rgba(255,255,255,0.8); font-size:12px; font-weight:700; cursor:pointer; font-family:Manrope,sans-serif; color:#047857; transition:all 0.2s; }
        .pagination-btn:hover { background:rgba(16,185,129,0.15); color: #064e3b; }
        .pagination-btn-active { background:#16a34a!important; color:#fff!important; border-color:#16a34a!important; }
        .pagination-btn:disabled { opacity:0.35; cursor:default; }
      `}
      </style>
      
      <main id="mainContent" className="flex-1 min-h-screen p-6 md:p-10 box-sizing-border-box overflow-x-hidden min-w-0">

        <header style={{ display:'flex', alignItems:'center', justify: 'space-between', gap:16, marginBottom:24, flexWrap:'wrap', animation:'fadeInUp 0.5s both' }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#EF4444', display:'inline-block', boxShadow:'0 0 0 0 rgba(239,68,68,0.4)', animation:'pulse 2s infinite' }}/>
                <span style={{ fontSize:10, fontWeight:700, color:'#047857', letterSpacing:'0.12em', textTransform:'uppercase' }}>{t.liveMonitoringSystem}</span>
              </div>
              <h2 style={{ fontSize:40, fontWeight:900, color:'#064e3b', letterSpacing:'-0.04em', margin:0 }}>{t.criticalIssuesTitle}</h2>
            </div>
          </div>

          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap: 'wrap' }}>
            <div className="glass-ci" style={{ borderRadius:12, padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:15, color:'#10b981' }}>translate</span>
              <select value={language} onChange={e=>setLanguageState(e.target.value)}
                style={{ background:'transparent', border:'none', outline:'none', fontSize:12, fontWeight:700, color:'#064e3b', fontFamily:'Manrope,sans-serif', width:100 }}>
                <option value="English" className="bg-white text-[#064e3b]">English</option>
                <option value="Tamil" className="bg-white text-[#064e3b]">தமிழ்</option>
              </select>
            </div>
            <div className="glass-ci" style={{ borderRadius:12, padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:15, color:'#10b981' }}>location_on</span>
              <select value={districtFilter} onChange={e=>{setDistrictFilter(e.target.value);setPage(0);}}
                style={{ background:'transparent', border:'none', outline:'none', fontSize:12, fontWeight:700, color:'#064e3b', fontFamily:'Manrope,sans-serif', width:130 }}>
                <option value="" className="bg-white text-[#047857]">{t.allDistricts}</option>
                {districts.map(d=><option key={d} value={d} className="bg-white text-[#064e3b]">{d}</option>)}
              </select>
            </div>
            <button onClick={()=>{loadCriticalData();setPage(0);}}
              className="glass-ci" style={{ borderRadius:12, padding:'8px 14px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'#064e3b', fontFamily:'Manrope,sans-serif', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(16,185,129,0.15)'}
              onMouseLeave={e=>e.currentTarget.style.background=''}>
              <span className="material-symbols-outlined" style={{ fontSize:16, animation: loading ? 'spin 1s linear infinite' : 'none', color: '#16a34a' }}>refresh</span>
              {t.refresh}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6" style={{ animation:'fadeInUp 0.5s 0.05s both' }}>
          {[
            { label: t.totalReports, val:allFeedbacks.length,     badgeColor:'#064e3b', icon:'inbox',          bgCard:'linear-gradient(135deg, #e8fbf0 0%, #dcfce7 100%)', textC: '#064e3b', labelC: '#047857' },
            { label: t.pending,       val:allFeedbacks.filter(f => f.status === 'Pending').length,   badgeColor:'#78350f', icon:'pending',        bgCard:'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', textC: '#78350f', labelC: '#92400e' },
            { label: t.resolved,      val:allFeedbacks.filter(f => f.status === 'Solved').length,    badgeColor:'#065f46', icon:'check_circle',   bgCard:'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', textC: '#065f46', labelC: '#047857' },
            { label: t.critical,      val:allFeedbacks.filter(f => (f.feedback?.rating||f.rating||5) <= 2).length, badgeColor:'#ffffff', icon:'priority_high',  bgCard:'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', textC: '#ffffff', labelC: '#fecaca' },
            { label: t.aiFlagged,    val:allFeedbacks.filter(f => (f.image_validation?.overall_risk||0) >= 65).length,   badgeColor:'#ffffff', icon:'smart_toy',       bgCard:'linear-gradient(135deg, #0f766e 0%, #0d5c56 100%)', textC: '#ffffff', labelC: '#a7f3d0' },
          ].map(({ label, val, badgeColor, icon, bgCard, textC, labelC }) => (
            <div key={label} className="glass-ci" style={{ borderRadius:16, padding:'16px 18px', display:'flex', alignItems:'center', gap:12, transition:'all 0.3s', background: bgCard, border:'1px solid rgba(16,185,129,0.2)' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(0,0,0,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span className="material-symbols-outlined" style={{ fontSize:18, color:textC }}>{icon}</span>
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:900, color:textC, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:9, fontWeight:700, color:labelC, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TWO-COLUMN BODY ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── LEFT PANEL: dept ranks + urgency ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16, animation:'fadeInUp 0.5s 0.1s both' }}>

            {/* Dept Rankings */}
            <div className="glass-ci" style={{ borderRadius:18, padding:'18px 20px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#047857', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
                {t.deptRankings}
              </div>
              {departmentCounts.length === 0 && (
                <div style={{ fontSize:12, color:'#064e3b', textAlign:'center', padding:'12px 0' }}>Loading...</div>
              )}
              {departmentCounts.map(([cat, count], i) => {
                const maxCount = departmentCounts[0]?.[1] || 1;
                const pct = (count / maxCount) * 100;
                const ic = DEPT_ICONS[cat.toLowerCase()] || 'report';
                const isHot = count > 5;
                const deptColor = isHot ? '#EF4444' : '#10b981';

                return (
                  <div key={cat} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div 
                          className="glass-symbol" 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            '--dept-color': deptColor 
                          }}
                        >
                          <span 
                            className="material-symbols-outlined" 
                            style={{ 
                              fontSize: '18px', 
                              color: deptColor,
                              fontVariationSettings: "'FILL' 1, 'wght' 400"
                            }}
                          >
                            {ic}
                          </span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#064e3b', textTransform: 'capitalize' }}>
                          {cat.length > 14 ? cat.slice(0, 13) + '…' : cat}
                        </span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 900, color: deptColor }}>{count}</span>
                    </div>

                    <div style={{ height: 6, borderRadius: 999, background: 'rgba(16,185,129,0.08)', overflow: 'hidden' }}>
                      <div 
                        className="dept-bar" 
                        style={{ 
                          width: `${pct}%`, 
                          height: '100%',
                          background: isHot 
                            ? 'linear-gradient(90deg, #EF4444, #F87171)' 
                            : 'linear-gradient(90deg, #10b981, #34d399)',
                          boxShadow: isHot ? '0 0 10px rgba(239, 68, 68, 0.2)' : '0 0 10px rgba(16,185,129,0.1)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Urgency Gauge */}
            <div className="glass-ci" style={{ borderRadius:18, padding:'18px 20px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#047857', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
                {t.urgencyIndex}
              </div>
              <div style={{ fontSize:36, fontWeight:900, color:'#064e3b', lineHeight:1, marginBottom:6 }}>
                {urgencyScore}<span style={{ fontSize:14, color:'#047857', fontWeight:400 }}>/10</span>
              </div>
              <div style={{ height:8, borderRadius:999, background:'rgba(16,185,129,0.08)', overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:urgencyWidth, background:'linear-gradient(90deg,#FBBF24,#EF4444)', borderRadius:999, transition:'width 1.2s cubic-bezier(0.22,1,0.36,1)', boxShadow:'0 0 8px rgba(239,68,68,0.2)' }}/>
              </div>
              <div style={{ fontSize:10, color:'#047857', fontWeight:600 }}>
                {language === 'English' ? `${critCount} critical of ${total} total` : `${total}-இல் ${critCount} அவசரமானவை`}
              </div>
            </div>

            {/* Filter by risk */}
            <div className="glass-ci" style={{ borderRadius:18, padding:'18px 20px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#047857', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
                {t.filterFeed}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { key:'all',      label: t.allReports,      icon:'list', count:priorityFeedbacks.length },
                  { key:'critical', label: language === 'English' ? 'Critical Only' : 'அவசரமானவை மட்டும்',    icon:'priority_high', count:critCount },
                  { key:'flagged',  label: t.aiFlagged,       icon:'smart_toy', count:flagged },
                  { key:'verified', label: language === 'English' ? 'Verified Safe' : 'சரிபார்க்கப்பட்டவை',    icon:'verified', count: allFeedbacks.filter(f=>f.image_validation?.overall_status==='verified').length },
                ].map(({ key, label, icon, count }) => (
                  <button key={key} onClick={()=>{setFilter(key);setPage(0);}}
                    style={{
                      display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                      borderRadius:10, border:'1px solid transparent', cursor:'pointer',
                      fontFamily:'Manrope,sans-serif', fontSize:12, fontWeight:600,
                      textAlign:'left', transition:'all 0.2s',
                      background: filter===key ? '#16a34a' : 'rgba(255, 255, 255, 0.8)',
                      color: filter===key ? '#fff' : '#047857',
                      borderColor: filter===key ? '#16a34a' : 'rgba(16, 185, 129, 0.15)',
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize:16 }}>{icon}</span>
                    <span style={{ flex:1 }}>{label}</span>
                    <span style={{
                      fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:999,
                      background: filter===key ? 'rgba(255,255,255,0.15)' : 'rgba(16, 185, 129, 0.08)',
                      color: filter===key ? '#fff' : '#047857',
                    }}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: feed cards ── */}
          <div style={{ animation:'fadeInUp 0.5s 0.15s both' }}>

            {/* Feed header */}
            <div style={{ display:'flex', alignItems:'center', justify: 'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span className="material-symbols-outlined" style={{ fontSize:18, color:'#10b981' }}>priority_high</span>
                <span style={{ fontSize:14, fontWeight:700, color:'#064e3b' }}>{t.livePriorityFeed}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 10px', borderRadius:999, background:'rgba(239,68,68,0.12)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.2)' }}>
                  {filteredFeed.length} {t.reportsCountSuffix}
                </span>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <button className="pagination-btn" disabled={page===0} onClick={()=>setPage(p=>p-1)}>‹</button>
                  {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                    const p = totalPages <= 5 ? i : Math.max(0, Math.min(totalPages-5, page-2)) + i;
                    return (
                      <button key={p} className={`pagination-btn${page===p?' pagination-btn-active':''}`} onClick={()=>setPage(p)}>
                        {p+1}
                      </button>
                    );
                  })}
                  <button className="pagination-btn" disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>›</button>
                </div>
              )}
            </div>

            {/* Loading state */}
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} className="glass-ci" style={{ borderRadius:18, height:76, opacity:0.4, animation:`fadeInUp 0.4s ${i*0.05}s both` }}/>
                ))}
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="glass-ci" style={{ borderRadius:18, padding:'40px', textAlign:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:40, color:'#10b981', display:'block', marginBottom:12 }}>check_circle</span>
                <div style={{ fontSize:14, fontWeight:700, color:'#a7f3d0' }}>No issues match this filter</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {pageFeed.map((item, idx) => (
                  <div key={item._id || idx} style={{ animation:`fadeInUp 0.35s ${idx*0.04}s both` }}>
                    <FeedbackCard item={item} idx={page*PER_PAGE+idx} navigate={navigate} />
                  </div>
                ))}
              </div>
            )}

            {/* Bottom pagination */}
            {totalPages > 1 && !loading && (
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20, alignItems:'center' }}>
                <button className="pagination-btn" disabled={page===0} onClick={()=>setPage(p=>p-1)}>‹ Prev</button>
                <span style={{ fontSize:11, color:'#a7f3d0', fontWeight:600 }}>Page {page+1} of {totalPages}</span>
                <button className="pagination-btn" disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>Next ›</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
