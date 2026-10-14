// ============================================================
// SurveyorDashboardPage.jsx — Field Surveyor Personal Dashboard
// Shows metrics, recent submissions, offline queue, and answer viewer
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

const LABELS = {
  en: {
    dashboard: 'My Dashboard',
    hi: 'Hi',
    online: 'Online',
    offline: 'Offline',
    start: '+ Start New Survey',
    logout: 'Logout',
    total: 'Total Surveys',
    today: "Today's Surveys",
    wards: 'Wards Covered',
    queue: 'Offline Queue',
    sync: 'Sync Now',
    syncing: 'Syncing…',
    synced: '✓ All Synced',
    loading: 'Loading your surveys…',
    no_data: 'No surveys submitted yet. Start your first survey!',
    recent: 'Recent Submissions',
    filter_today: 'Today',
    filter_all: 'All Time',
    view: 'View Answers',
    close: 'Close',
    search_ph: 'Search by ward or respondent…',
    anonymous: 'Anonymous',
  },
  ta: {
    dashboard: 'என் டாஷ்போர்டு',
    hi: 'வணக்கம்',
    online: 'இணையத்தில்',
    offline: 'ஆஃப்லைன்',
    start: '+ புதிய கணக்கெடுப்பு',
    logout: 'வெளியேறு',
    total: 'மொத்த கணக்கெடுப்புகள்',
    today: 'இன்றைய கணக்கெடுப்புகள்',
    wards: 'கவரப்பட்ட வார்டுகள்',
    queue: 'ஆஃப்லைன் வரிசை',
    sync: 'இப்போது ஒத்திசை',
    syncing: 'ஒத்திசைக்கிறது…',
    synced: '✓ அனைத்தும் ஒத்திசைந்தது',
    loading: 'உங்கள் கணக்கெடுப்புகளை ஏற்றுகிறது…',
    no_data: 'இன்னும் கணக்கெடுப்புகள் இல்லை. முதல் கணக்கெடுப்பை தொடங்குங்கள்!',
    recent: 'சமீபத்திய சமர்ப்பிப்புகள்',
    filter_today: 'இன்று',
    filter_all: 'அனைத்து நேரமும்',
    view: 'பதில்களைப் பார்',
    close: 'மூடு',
    search_ph: 'வார்டு அல்லது பெயர் தேடுங்கள்…',
    anonymous: 'அநாமதேய',
  }
};

function formatDate(iso, lang) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return iso; }
}

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

export default function SurveyorDashboardPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ta');
  const L = LABELS[lang];

  const surveyorRaw = localStorage.getItem('surveyor');
  const surveyor = surveyorRaw ? JSON.parse(surveyorRaw) : null;

  useEffect(() => {
    if (!surveyor) navigate('/surveyor-login');
  }, [surveyor, navigate]);

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [syncMsg, setSyncMsg] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem('offline_survey_queue') || '[]');
    setOfflineQueue(q);
  }, []);

  const loadResponses = useCallback(async () => {
    if (!surveyor?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/survey-responses?surveyor_email=${encodeURIComponent(surveyor.email)}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setResponses(Array.isArray(data) ? data : []);
    } catch {
      setResponses([]);
    }
    setLoading(false);
  }, [surveyor?.email]);

  useEffect(() => { loadResponses(); }, [loadResponses]);

  async function syncOffline() {
    const queue = JSON.parse(localStorage.getItem('offline_survey_queue') || '[]');
    if (queue.length === 0) { setSyncMsg(L.synced); return; }
    setSyncMsg(L.syncing);
    const remaining = [];
    for (const payload of queue) {
      try {
        const res = await fetch(`${API}/api/survey-responses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) remaining.push(payload);
      } catch { remaining.push(payload); }
    }
    localStorage.setItem('offline_survey_queue', JSON.stringify(remaining));
    setOfflineQueue(remaining);
    setSyncMsg(remaining.length === 0 ? L.synced : '');
    if (remaining.length === 0) loadResponses();
  }

  function handleLogout() {
    localStorage.removeItem('surveyor');
    sessionStorage.removeItem('survey_location');
    navigate('/surveyor-login');
  }

  const totalCount = responses.length;
  const todayCount = responses.filter(r => isToday(r.submitted_at)).length;
  const wardsSet = new Set(responses.map(r => r.ward).filter(Boolean));
  const wardsCount = wardsSet.size;
  const offlineCount = offlineQueue.length;

  const filtered = responses
    .filter(r => filter === 'today' ? isToday(r.submitted_at) : true)
    .filter(r => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        (r.ward || '').toLowerCase().includes(s) ||
        (r.area_street || '').toLowerCase().includes(s) ||
        (r.respondent_name || '').toLowerCase().includes(s) ||
        (r.constituency || '').toLowerCase().includes(s)
      );
    });

  return (
    <div style={S.bg}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        #start-new-survey-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(22,163,74,0.5) !important; }
        .resp-card:hover { background: rgba(255,255,255,0.07) !important; }
        .view-ans-btn:hover { background: rgba(74,222,128,0.22) !important; }
      `}</style>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.navBrand}>
            <span style={{fontSize:'22px'}}>📋</span>
            <div>
              <div style={S.navTitle}>{L.dashboard}</div>
              <div style={S.navSub}>{L.hi}, {surveyor?.name || 'Surveyor'}</div>
            </div>
          </div>
          <div style={S.navRight}>
            <span style={{...S.netBadge, background: isOnline ? '#15803d' : '#b45309'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:isOnline?'#4ade80':'#fbbf24',display:'inline-block',animation:isOnline?'pulse 2s infinite':'none'}} />
              {isOnline ? L.online : L.offline}
            </span>
            <div style={S.langGroup}>
              <button style={{...S.langBtn,...(lang==='ta'?S.langActive:{})}} onClick={()=>setLang('ta')}>தமிழ்</button>
              <button style={{...S.langBtn,...(lang==='en'?S.langActive:{})}} onClick={()=>setLang('en')}>EN</button>
            </div>
            <button onClick={handleLogout} style={S.logoutBtn}>{L.logout}</button>
          </div>
        </div>
      </nav>

      {/* PROFILE STRIP */}
      <div style={S.profileStrip}>
        <div style={S.profileStripInner}>
          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={S.avatar}>{(surveyor?.name||'S').charAt(0).toUpperCase()}</div>
            <div>
              <div style={S.profileName}>{surveyor?.name || 'Surveyor'}</div>
              <div style={S.profileMeta}>
                {surveyor?.email}
                {surveyor?.constituency && surveyor.constituency !== 'All Constituencies' ? ` · 📍 ${surveyor.constituency}` : ''}
              </div>
            </div>
          </div>
          <button id="start-new-survey-btn" onClick={()=>navigate('/survey/location')} style={S.startBtn}>{L.start}</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* METRICS */}
        <div style={S.metricsGrid}>
          {[
            {icon:'📊', val:totalCount, label:L.total, bg:'linear-gradient(135deg,#064e3b,#065f46)', glow:'#10b981', border:'rgba(16,185,129,0.3)'},
            {icon:'🗓️', val:todayCount, label:L.today, bg:'linear-gradient(135deg,#1e3a5f,#1e40af)', glow:'#60a5fa', border:'rgba(96,165,250,0.3)'},
            {icon:'📍', val:wardsCount, label:L.wards, bg:'linear-gradient(135deg,#4c1d95,#5b21b6)', glow:'#a78bfa', border:'rgba(167,139,250,0.3)'},
          ].map(m => (
            <div key={m.label} style={{...S.metricCard, background:m.bg, border:`1.5px solid ${m.border}`}}>
              <div style={{position:'absolute',top:'-16px',right:'-16px',width:'70px',height:'70px',borderRadius:'50%',background:m.glow,opacity:0.15,filter:'blur(16px)'}} />
              <div style={{fontSize:'26px',marginBottom:'6px'}}>{m.icon}</div>
              <div style={S.metricVal}>{m.val}</div>
              <div style={S.metricLbl}>{m.label}</div>
            </div>
          ))}
          {/* Offline card */}
          <div style={{...S.metricCard, background:'linear-gradient(135deg,#78350f,#92400e)', border:'1.5px solid rgba(245,158,11,0.3)'}}>
            <div style={{position:'absolute',top:'-16px',right:'-16px',width:'70px',height:'70px',borderRadius:'50%',background:'#f59e0b',opacity:0.15,filter:'blur(16px)'}} />
            <div style={{fontSize:'26px',marginBottom:'6px'}}>⏳</div>
            <div style={S.metricVal}>{offlineCount}</div>
            <div style={S.metricLbl}>{L.queue}</div>
            {offlineCount > 0 && (
              <button onClick={syncOffline} disabled={!isOnline} style={{...S.syncBtn,opacity:isOnline?1:0.5}}>
                {syncMsg || L.sync}
              </button>
            )}
          </div>
        </div>

        {/* SUBMISSIONS */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <h2 style={S.sectionTitle}>{L.recent}</h2>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
              <input
                type="text"
                placeholder={L.search_ph}
                value={search}
                onChange={e=>setSearch(e.target.value)}
                style={S.searchInput}
              />
              <div style={{display:'flex',gap:'6px'}}>
                <button onClick={()=>setFilter('today')} style={{...S.pill,...(filter==='today'?S.pillActive:{})}}>{L.filter_today}</button>
                <button onClick={()=>setFilter('all')} style={{...S.pill,...(filter==='all'?S.pillActive:{})}}>{L.filter_all}</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={S.empty}>
              <div style={{width:'36px',height:'36px',border:'3px solid rgba(74,222,128,0.15)',borderTop:'3px solid #4ade80',borderRadius:'50%',animation:'spin 0.9s linear infinite'}} />
              <p style={S.emptyTxt}>{L.loading}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={S.empty}>
              <span style={{fontSize:'48px'}}>📭</span>
              <p style={S.emptyTxt}>{L.no_data}</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {filtered.map((r, i) => (
                <div key={r._id||i} className="resp-card" style={S.respCard}>
                  <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                    <div style={S.respIdx}>#{totalCount - responses.indexOf(r)}</div>
                    <div>
                      <div style={S.respLoc}>📍 {r.constituency}{r.ward ? ` · Ward ${r.ward}` : ''}{r.area_street ? ` · ${r.area_street}` : ''}</div>
                      <div style={S.respMeta}>
                        <span>👤 {r.respondent_name || L.anonymous}</span>
                        {r.respondent_age && <span> · {r.respondent_age} yrs</span>}
                        {r.respondent_gender && <span> · {r.respondent_gender}</span>}
                      </div>
                      <div style={S.respDate}>🕐 {formatDate(r.submitted_at, lang)}</div>
                    </div>
                  </div>
                  <button className="view-ans-btn" onClick={()=>setSelectedResponse(r)} style={S.viewBtn}>{L.view}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedResponse && (
        <div style={S.overlay} onClick={()=>setSelectedResponse(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.modalHead}>
              <div>
                <div style={S.modalTitle}>📍 {selectedResponse.constituency}{selectedResponse.ward ? ` · Ward ${selectedResponse.ward}` : ''}</div>
                <div style={S.modalSub}>{formatDate(selectedResponse.submitted_at,lang)}{selectedResponse.respondent_name ? ` · 👤 ${selectedResponse.respondent_name}` : ''}</div>
              </div>
              <button onClick={()=>setSelectedResponse(null)} style={S.closeBtn}>✕</button>
            </div>
            <div style={S.modalBody}>
              {(selectedResponse.answers||[]).length===0 ? (
                <p style={{color:'#6b7280',textAlign:'center',padding:'24px 0'}}>No answers recorded.</p>
              ) : selectedResponse.answers.map((a,i)=>(
                <div key={i} style={S.answerRow}>
                  <div style={S.ansQ}>Q{i+1}. {a.question_text}</div>
                  <div style={S.ansA}>{a.answer || <em style={{color:'#9ca3af'}}>—</em>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  bg:{minHeight:'100vh',background:'linear-gradient(160deg,#071a10 0%,#0a2617 40%,#0f3622 100%)',fontFamily:"'Noto Sans Tamil','Manrope','Inter',sans-serif",color:'#f0fdf4'},
  nav:{background:'rgba(15,76,53,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(255,255,255,0.08)',padding:'0 20px',position:'sticky',top:0,zIndex:100},
  navInner:{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px'},
  navBrand:{display:'flex',alignItems:'center',gap:'10px'},
  navTitle:{fontSize:'15px',fontWeight:700,color:'#bbf7d0',letterSpacing:'-0.3px'},
  navSub:{fontSize:'11px',color:'rgba(255,255,255,0.5)',marginTop:'1px'},
  navRight:{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'},
  netBadge:{display:'flex',alignItems:'center',gap:'5px',fontSize:'11px',fontWeight:600,padding:'4px 10px',borderRadius:'20px',color:'#fff'},
  langGroup:{display:'flex',background:'rgba(255,255,255,0.08)',borderRadius:'8px',overflow:'hidden'},
  langBtn:{background:'transparent',border:'none',color:'rgba(255,255,255,0.6)',padding:'5px 10px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'},
  langActive:{background:'rgba(255,255,255,0.18)',color:'#fff',fontWeight:700},
  logoutBtn:{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'5px 12px',borderRadius:'8px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'},

  profileStrip:{background:'linear-gradient(135deg,rgba(22,101,52,0.5),rgba(15,76,53,0.3))',borderBottom:'1px solid rgba(74,222,128,0.1)',padding:'20px'},
  profileStripInner:{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'},
  avatar:{width:'48px',height:'48px',borderRadius:'50%',background:'linear-gradient(135deg,#16a34a,#4ade80)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:800,color:'#fff',flexShrink:0,boxShadow:'0 0 0 3px rgba(74,222,128,0.2)'},
  profileName:{fontSize:'17px',fontWeight:700,color:'#dcfce7'},
  profileMeta:{fontSize:'12px',color:'rgba(255,255,255,0.5)',marginTop:'2px'},
  startBtn:{background:'linear-gradient(135deg,#16a34a,#15803d)',color:'#fff',border:'none',padding:'12px 22px',borderRadius:'12px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 18px rgba(22,163,74,0.4)',transition:'transform 0.15s,box-shadow 0.15s',whiteSpace:'nowrap'},

  main:{maxWidth:'900px',margin:'0 auto',padding:'28px 16px 60px'},
  metricsGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px',marginBottom:'28px'},
  metricCard:{borderRadius:'16px',padding:'20px 18px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',gap:'2px'},
  metricVal:{fontSize:'32px',fontWeight:800,color:'#fff',lineHeight:1},
  metricLbl:{fontSize:'12px',color:'rgba(255,255,255,0.6)',fontWeight:500,marginTop:'4px'},
  syncBtn:{marginTop:'10px',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',padding:'5px 12px',borderRadius:'8px',fontSize:'11px',fontWeight:600,cursor:'pointer',fontFamily:'inherit',alignSelf:'flex-start'},

  section:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px',padding:'24px'},
  sectionHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',marginBottom:'20px'},
  sectionTitle:{fontSize:'16px',fontWeight:700,color:'#bbf7d0',margin:0},
  searchInput:{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',color:'#e2e8f0',padding:'7px 12px',fontSize:'13px',outline:'none',fontFamily:'inherit',width:'200px'},
  pill:{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.55)',padding:'5px 12px',borderRadius:'20px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'},
  pillActive:{background:'rgba(74,222,128,0.14)',border:'1px solid rgba(74,222,128,0.35)',color:'#4ade80',fontWeight:700},

  empty:{display:'flex',flexDirection:'column',alignItems:'center',gap:'14px',padding:'48px 0'},
  emptyTxt:{color:'rgba(255,255,255,0.4)',fontSize:'14px',margin:0,textAlign:'center'},

  respCard:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',transition:'background 0.2s',cursor:'default'},
  respIdx:{fontSize:'11px',fontWeight:700,color:'rgba(74,222,128,0.7)',background:'rgba(74,222,128,0.08)',padding:'2px 7px',borderRadius:'8px',whiteSpace:'nowrap',marginTop:'2px'},
  respLoc:{fontSize:'13px',fontWeight:600,color:'#dcfce7',marginBottom:'3px'},
  respMeta:{fontSize:'12px',color:'rgba(255,255,255,0.5)'},
  respDate:{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'3px'},
  viewBtn:{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.28)',color:'#4ade80',padding:'7px 14px',borderRadius:'10px',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',transition:'all 0.2s',flexShrink:0},

  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'},
  modal:{background:'linear-gradient(160deg,#0f2d1d,#162d23)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:'20px',width:'100%',maxWidth:'560px',maxHeight:'80vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.5)'},
  modalHead:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'20px 22px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'},
  modalTitle:{fontSize:'15px',fontWeight:700,color:'#bbf7d0'},
  modalSub:{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginTop:'3px'},
  closeBtn:{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'#94a3b8',width:'30px',height:'30px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'13px',flexShrink:0,fontFamily:'inherit'},
  modalBody:{overflowY:'auto',padding:'16px 22px 24px',display:'flex',flexDirection:'column',gap:'12px'},
  answerRow:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'12px 14px'},
  ansQ:{fontSize:'11px',color:'rgba(255,255,255,0.45)',fontWeight:600,marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.4px'},
  ansA:{fontSize:'14px',color:'#dcfce7',fontWeight:500},
};
