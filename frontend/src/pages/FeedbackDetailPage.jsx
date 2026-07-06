// ============================================================
// FeedbackDetailPage.jsx — Investigation Deep-Dive
// Theme: Cloud dancer / taupe glass — EXACTLY matching Dashboard
//        and CriticalIssues palette. NO dark backgrounds.
// Font:  Manrope (same as all other pages)
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ImageIntelCard from '../components/ImageIntelCard';

import { API } from '../config';

// ── Same glass style used across the whole app ───────────────
const glass = {
  background:    'rgba(255,255,255,0.28)',
  backdropFilter:'blur(50px)',
  WebkitBackdropFilter:'blur(50px)',
  border:        '1px solid rgba(255,255,255,0.55)',
  boxShadow:     '0 8px 32px rgba(0,0,0,0.05)',
};

function getRisk(score) {
  if (score >= 65) return { color:'#EF4444', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.2)',  label:'HIGH RISK',  dot:'#EF4444' };
  if (score >= 35) return { color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.2)', label:'MODERATE',   dot:'#F59E0B' };
  return            { color:'#10B981', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.2)',  label:'VERIFIED',   dot:'#10B981' };
}

function layerColor(val) {
  if (!val) return '#9CA3AF';
  if (['pass','authentic','unique','verified'].includes(val)) return '#10B981';
  if (['warning','similar','suspicious','no_gps'].includes(val)) return '#F59E0B';
  return '#EF4444';
}

export default function FeedbackDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const feedbackId = searchParams.get('id');

  const [f,                    setF]                    = useState(null);
  const [investigationStarted, setInvestigationStarted] = useState(false);
  const [imgLoaded,            setImgLoaded]            = useState(false);

  async function loadFeedback() {
    window.scrollTo(0, 0);
    try {
      const res  = await fetch(`${API}/api/feedback/${feedbackId}`);
      const data = await res.json();
      setF(data);
    } catch (e) { console.error(e); }
  }

  function startResolution() {
    Swal.fire({ title:'Investigation Started!', text:'You have successfully taken up this feedback.', icon:'info', confirmButtonColor:'#15803d' });
    setInvestigationStarted(true);
    updateStatus('In Progress', false);
  }

  async function updateStatus(newStatus, showPopup = true) {
    try {
      await fetch(`${API}/api/update-status/${feedbackId}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ status: newStatus }),
      });
      if (showPopup && newStatus === 'Solved') {
        Swal.fire({ title:'Excellent Work!', text:'Issue resolved. Notifying the resident...', icon:'success', timer:2500, showConfirmButton:false, iconColor:'#10B981', willClose:()=>navigate('/critical-issues') });
      }
      if (newStatus !== 'Solved') setF(p => p ? {...p, status:newStatus} : p);
    } catch { Swal.fire('Error','Could not update status','error'); }
  }

  useEffect(() => { if (feedbackId) loadFeedback(); }, [feedbackId]);

  const isSolved   = f?.status === 'Solved';
  const validation = f?.image_validation;
  const risk       = validation ? getRisk(validation.overall_risk || 0) : null;
  const imageSrc   = f?.image ? `${API}/${f.image}` : null;
  const rating     = f?.rating || f?.feedback?.rating || 0;
  const isCritical = rating > 0 && rating <= 2;

  return (
    <div className="sidebar-page" style={{
      minHeight:'100vh', fontFamily:"'Manrope',sans-serif", overflowX:'hidden',
      background:`
        radial-gradient(circle at 20% 30%,rgba(22, 163, 74, 0.12) 0%,transparent 40%),
        radial-gradient(circle at 80% 70%,rgba(16, 185, 129, 0.12) 0%,transparent 40%),
        linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)
      `,
      backgroundAttachment:'fixed',
      color:'#0f291b',
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(300%)} }
        .fup  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .fup1 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
        .fup2 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .fup3 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
        .fup4 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
        .fd-action-btn {
          width:100%; padding:14px 20px; border:none; border-radius:14px;
          font-family:'Manrope',sans-serif; font-size:13px; font-weight:800;
          letter-spacing:0.04em; cursor:pointer; transition:all 0.3s ease;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .fd-action-btn:hover { transform:translateY(-2px); filter:brightness(1.06); }
        .fd-action-btn:active { transform:scale(0.97); }
        .fd-glass-hover {
          transition:all 0.3s ease;
        }
        .fd-glass-hover:hover {
          transform:translateY(-2px);
          box-shadow:0 16px 48px rgba(0,0,0,0.08)!important;
          border-color:rgba(255,255,255,0.7)!important;
        }
        .fd-chip {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:999px;
          font-size:10px; font-weight:800; letter-spacing:0.07em; text-transform:uppercase;
        }
        .fd-meta-label {
          font-size:9px; font-weight:700; color:#4b6b58;
          letter-spacing:0.12em; text-transform:uppercase; margin-bottom:4px;
        }
        .fd-meta-value {
          font-size:13px; font-weight:700; color:#0f291b;
        }
        .fd-layer-row {
          display:flex; align-items:center; gap:10px; padding:10px 14px;
          border-radius:12px; border:1px solid rgba(255,255,255,0.5);
          background:rgba(255,255,255,0.2); transition:all 0.2s;
          cursor:default;
        }
        .fd-layer-row:hover {
          background:rgba(255,255,255,0.4);
          border-color:rgba(255,255,255,0.7);
        }
      `}</style>

      {/* ── TOP NAV BAR ─────────────────────────────────────── */}
      <nav style={{
        ...glass,
        margin:'16px 24px 0',
        borderRadius:16,
        padding:'12px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:16, zIndex:50,
      }}>
        {/* Back */}
        <button onClick={() => navigate('/critical-issues')}
          style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:700, color:'#6B7280', fontFamily:'Manrope,sans-serif', padding:'6px 12px', borderRadius:10, transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.4)';e.currentTarget.style.color='#1F2937';}}
          onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='#6B7280';}}>
          <span className="material-symbols-outlined" style={{ fontSize:18 }}>arrow_back</span>
          Critical Issues
        </button>

        {/* Breadcrumb */}
        <div style={{ fontSize:11, color:'#4b6b58', fontWeight:600, letterSpacing:'0.06em' }}>
          Critical Issues &rsaquo; <span style={{ color:'#0f291b', fontWeight:800 }}>#{feedbackId?.slice(-8).toUpperCase()}</span>
        </div>

        {/* Status chips */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {risk && (
            <span className="fd-chip" style={{ background:risk.bg, border:`1px solid ${risk.border}`, color:risk.color }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:risk.dot, display:'inline-block', boxShadow:`0 0 5px ${risk.dot}` }}/>
              {risk.label}
            </span>
          )}
          <span className="fd-chip" style={{
            background: isSolved ? 'rgba(16,185,129,0.1)' : investigationStarted ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.08)',
            border:     `1px solid ${isSolved ? 'rgba(16,185,129,0.3)' : investigationStarted ? 'rgba(59,130,246,0.3)' : 'rgba(239,68,68,0.2)'}`,
            color:       isSolved ? '#10B981' : investigationStarted ? '#3B82F6' : '#EF4444',
          }}>
            {isSolved ? '✓ Resolved' : investigationStarted ? '◉ In Progress' : '⊘ Pending'}
          </span>
        </div>
      </nav>

      {/* ── PAGE CONTENT ───────────────────────────────────── */}
      <div style={{ maxWidth:1360, margin:'0 auto', padding:'24px 24px 40px', display:'grid', gridTemplateColumns:'1fr 360px', gap:24, alignItems:'start' }}>

        {/* ════════════════════════════════════════════════════
            LEFT COLUMN
            ════════════════════════════════════════════════════ */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* ── Page heading ── */}
          <div className="fup">
            <p style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:6 }}>
              Investigation Deep-Dive
            </p>
            <h1 style={{ fontSize:30, fontWeight:900, color:'#0f291b', letterSpacing:'-0.03em', margin:0, lineHeight:1.1, textTransform:'capitalize' }}>
              {f?.type_of_feedback || f?.feedback?.type || (
                <span style={{ color:'#D1D5DB' }}>Loading...</span>
              )}
            </h1>
          </div>

          {/* ── Visual evidence card ── */}
          <div className="fup1 fd-glass-hover" style={{ ...glass, borderRadius:20, overflow:'hidden' }}>
            {/* Card header */}
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="material-symbols-outlined" style={{ fontSize:16, color:'#9CA3AF' }}>photo_camera</span>
                <span style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.12em', textTransform:'uppercase' }}>Visual Evidence</span>
              </div>
              {validation && (
                <span className="fd-chip" style={{ background:risk?.bg, border:`1px solid ${risk?.border}`, color:risk?.color, fontSize:9 }}>
                  {validation.overall_flag}
                </span>
              )}
              {!imageSrc && (
                <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>No image submitted</span>
              )}
            </div>

            {/* Image area */}
            {imageSrc ? (
              <div style={{ position:'relative', background:'#EAE6DF' }}>
                {/* Loading spinner */}
                {!imgLoaded && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2, minHeight:220 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid rgba(107,114,128,0.2)', borderTopColor:'#6B7280', animation:'spin 0.8s linear infinite' }}/>
                  </div>
                )}
                <img src={imageSrc} alt="Evidence"
                  style={{ width:'100%', maxHeight:420, objectFit:'cover', display:imgLoaded?'block':'none', transition:'opacity 0.4s' }}
                  onLoad={() => setImgLoaded(true)} />

                {/* Overlay chips on image */}
                {imgLoaded && (
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px', background:'linear-gradient(transparent,rgba(0,0,0,0.6))', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {validation?.layers?.exif_geofence?.lat && (
                        <span style={{ padding:'4px 10px', borderRadius:8, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.15)', fontSize:10, color:'#fff', fontFamily:'monospace', fontWeight:600 }}>
                          📍 {validation.layers.exif_geofence.lat.toFixed(4)}, {validation.layers.exif_geofence.lon.toFixed(4)}
                        </span>
                      )}
                      {validation?.layers?.ela_authenticity?.ela_score != null && (
                        <span style={{ padding:'4px 10px', borderRadius:8, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.15)', fontSize:10, color:'#fff', fontWeight:700 }}>
                          ELA {validation.layers.ela_authenticity.ela_score}/100
                        </span>
                      )}
                    </div>
                    {risk && (
                      <span className="fd-chip" style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(10px)', border:`1px solid ${risk.border}`, color:risk.color, fontSize:9 }}>
                        {risk.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding:'48px 20px', textAlign:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:48, color:'#D1D5DB', display:'block', marginBottom:12 }}>image_not_supported</span>
                <p style={{ fontSize:13, color:'#9CA3AF', fontWeight:600, margin:0 }}>No image was uploaded with this feedback</p>
              </div>
            )}
          </div>

          {/* ── Citizen report card ── */}
          <div className="fup2 fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'24px 28px' }}>
            <p className="fd-meta-label" style={{ marginBottom:14 }}>Citizen Report</p>

            {/* Feedback text */}
            <p style={{
              fontSize:15, color:'#0f291b', lineHeight:1.8, margin:'0 0 24px',
              borderLeft:'3px solid rgba(22, 128, 61, 0.25)', paddingLeft:16,
              fontStyle: (f?.feedback_text || f?.feedback?.original_text) ? 'normal' : 'italic',
            }}>
              {f?.feedback_text || f?.feedback?.original_text || 'No description provided.'}
            </p>

            {/* 3-col meta grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.6)' }}>
              {[
                { label:'Reporter',     value: f?.name || f?.user?.name || 'Anonymous',               icon:'person' },
                { label:'Email',        value: f?.email || f?.user?.email || 'Confidential',            icon:'mail' },
                { label:'District',     value: f?.district || f?.location?.district || 'N/A',           icon:'location_on' },
                { label:'Constituency', value: f?.constituency || f?.location?.constituency || 'N/A',   icon:'apartment' },
                { label:'Category',     value: f?.type_of_feedback || f?.feedback?.type || 'General',  icon:'category' },
                { label:'Filed',        value: f?.created_at ? new Date(f.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'N/A', icon:'calendar_today' },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:12, color:'#C6B7A6' }}>{icon}</span>
                    <span className="fd-meta-label" style={{ marginBottom:0 }}>{label}</span>
                  </div>
                  <div className="fd-meta-value" style={{ wordBreak:'break-all', color: value==='N/A'||value==='Confidential'||value==='Anonymous' ? '#4b6b58' : '#0f291b' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Star rating */}
            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:12 }}>
              <span className="fd-meta-label" style={{ marginBottom:0 }}>Severity</span>
              <div style={{ display:'flex', gap:3 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize:20, color: s <= rating ? '#F59E0B' : '#E5E7EB', lineHeight:1 }}>★</span>
                ))}
              </div>
              <span style={{ fontSize:12, color:'#9CA3AF', fontWeight:600 }}>{rating}/5</span>
              {isCritical && (
                <span className="fd-chip" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444', fontSize:9 }}>
                  CRITICAL
                </span>
              )}
            </div>
          </div>

          {/* ── 4-Layer AI Intelligence Panel ── */}
          {validation && (
            <div className="fup3">
              <p className="fd-meta-label" style={{ marginBottom:12 }}>AI Image Intelligence · 4-Layer Analysis</p>
              {/* Override ImageIntelCard dark bg with light wrapper */}
              <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.55)', boxShadow:'0 8px 32px rgba(0,0,0,0.05)' }}>
                <ImageIntelCard validation={validation} />
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════
            RIGHT COLUMN — sticky sidebar
            ════════════════════════════════════════════════════ */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:88 }}>

          {/* ── Status card ── */}
          <div className="fup fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'20px 22px' }}>
            <p className="fd-meta-label" style={{ marginBottom:12 }}>Current Status</p>
            <div style={{
              padding:'12px 16px', borderRadius:12, textAlign:'center', fontWeight:800, fontSize:13,
              background: isSolved ? 'rgba(16,185,129,0.1)' : investigationStarted ? 'rgba(59,130,246,0.08)' : 'rgba(239,68,68,0.07)',
              border:     `1px solid ${isSolved ? 'rgba(16,185,129,0.3)' : investigationStarted ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.2)'}`,
              color:       isSolved ? '#10B981' : investigationStarted ? '#3B82F6' : '#EF4444',
            }}>
              {isSolved ? '✓ Officially Resolved' : investigationStarted ? '◉ Investigation In Progress' : '⊘ Awaiting Action'}
            </div>
          </div>

          {/* ── Actions card ── */}
          <div className="fup1 fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'20px 22px' }}>
            <p className="fd-meta-label" style={{ marginBottom:14 }}>Actions</p>
            {isSolved ? (
              <div style={{ padding:'14px', borderRadius:12, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', textAlign:'center', color:'#10B981', fontWeight:700, fontSize:13 }}>
                ✓ Issue archived & resolved
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {!investigationStarted ? (
                  <button className="fd-action-btn" onClick={startResolution}
                    style={{ background:'#15803d', color:'#fff', boxShadow:'0 8px 24px rgba(22, 101, 52, 0.25)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:18 }}>handshake</span>
                    Acknowledge & Investigate
                  </button>
                ) : (
                  <>
                    <div style={{ padding:'12px', borderRadius:12, background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.2)', color:'#3B82F6', fontSize:12, fontWeight:700, textAlign:'center' }}>
                      ◉ Investigation in progress
                    </div>
                    <button className="fd-action-btn" onClick={() => updateStatus('Solved')}
                      style={{ background:'linear-gradient(135deg,#10B981,#059669)', color:'#fff', boxShadow:'0 8px 24px rgba(16,185,129,0.3)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize:18 }}>check_circle</span>
                      Mark as Resolved
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Reporter card ── */}
          <div className="fup2 fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'20px 22px' }}>
            <p className="fd-meta-label" style={{ marginBottom:14 }}>Reporter Info</p>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {[
                { icon:'person',      val: f?.name || f?.user?.name || 'Anonymous Citizen' },
                { icon:'mail',        val: f?.email || f?.user?.email || 'Confidential' },
                { icon:'call',        val: f?.booth_no || f?.user?.mobile_masked ? `+91 ${f?.booth_no || f?.user?.mobile_masked}` : 'Not provided' },
                { icon:'location_on', val: [f?.district || f?.location?.district, f?.constituency || f?.location?.constituency].filter(Boolean).join(' › ') || 'N/A' },
              ].map(({ icon, val }) => (
                <div key={icon} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:15, color:'#C6B7A6', marginTop:1, flexShrink:0 }}>{icon}</span>
                  <span style={{ fontSize:12, color:'#6B7280', fontWeight:600, wordBreak:'break-all', lineHeight:1.5 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Intelligence summary card ── */}
          {validation && (
            <div className="fup3 fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'20px 22px', border:`1px solid ${risk?.border}` }}>
              <p className="fd-meta-label" style={{ marginBottom:14 }}>Intelligence Summary</p>

              {/* 4 layer tiles */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                {[
                  { label:'EXIF',     val:validation.layers?.exif_geofence?.status,     icon:'location_on' },
                  { label:'Semantic', val:validation.layers?.semantic_alignment?.status, icon:'image_search' },
                  { label:'Dedup',    val:validation.layers?.phash_dedup?.status,        icon:'fingerprint' },
                  { label:'ELA',      val:validation.layers?.ela_authenticity?.status,   icon:'smart_toy' },
                ].map(({ label, val, icon }) => {
                  const c = layerColor(val);
                  return (
                    <div key={label} style={{ padding:'10px 12px', borderRadius:12, background:`${c}0D`, border:`1px solid ${c}33` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:12, color:c }}>{icon}</span>
                        <span style={{ fontSize:9, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.1em' }}>{label}</span>
                      </div>
                      <div style={{ fontSize:11, fontWeight:900, color:c, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                        {val || '—'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* GPS */}
              {validation.layers?.exif_geofence?.lat && (
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10, padding:'8px 12px', borderRadius:10, background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:14, color:'#10B981' }}>location_on</span>
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase' }}>GPS Coordinates</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#10B981', fontFamily:'monospace' }}>
                      {validation.layers.exif_geofence.lat.toFixed(5)}, {validation.layers.exif_geofence.lon.toFixed(5)}
                    </div>
                  </div>
                </div>
              )}

              {/* Risk bar */}
              <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.5)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'#6B7280' }}>Composite Risk Score</span>
                  <span style={{ fontSize:16, fontWeight:900, color:risk?.color }}>{validation.overall_risk}/100</span>
                </div>
                <div style={{ height:6, borderRadius:999, background:'rgba(0,0,0,0.06)', overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:999,
                    width:`${validation.overall_risk}%`,
                    background:`linear-gradient(90deg,${risk?.dot},${risk?.dot}aa)`,
                    transition:'width 1.2s cubic-bezier(0.22,1,0.36,1)',
                    boxShadow:`0 0 8px ${risk?.dot}55`,
                  }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                  <span style={{ fontSize:8, color:'rgba(16,185,129,0.7)', fontWeight:600 }}>0 SAFE</span>
                  <span style={{ fontSize:8, color:'rgba(245,158,11,0.7)', fontWeight:600 }}>35 MOD</span>
                  <span style={{ fontSize:8, color:'rgba(239,68,68,0.7)', fontWeight:600 }}>65 HIGH</span>
                </div>
              </div>
            </div>
          )}

          {/* No validation notice */}
          {!validation && f && (
            <div className="fup3 fd-glass-hover" style={{ ...glass, borderRadius:20, padding:'24px', textAlign:'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize:36, color:'#D1D5DB', display:'block', marginBottom:10 }}>image_not_supported</span>
              <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:600, lineHeight:1.5 }}>
                No image was uploaded.<br/>AI validation not available.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
