// ============================================================
// ImageIntelCard.jsx — Premium Image Intelligence Panel
// Shows all 4 validation layers with real-time color coding
// Used in: FeedbackDetailPage, CriticalIssuesPage, SuperAdminPage
// ============================================================
import React, { useState, useEffect, useRef } from 'react';

// ── Risk color system ─────────────────────────────────────────
function getRiskColors(score) {
  if (score >= 65) return {
    bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',
    text: '#EF4444', glow: 'rgba(239,68,68,0.3)', label: 'HIGH RISK', dot: '#EF4444',
  };
  if (score >= 35) return {
    bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)',
    text: '#F59E0B', glow: 'rgba(245,158,11,0.3)', label: 'MODERATE', dot: '#F59E0B',
  };
  return {
    bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)',
    text: '#10B981', glow: 'rgba(16,185,129,0.3)', label: 'VERIFIED', dot: '#10B981',
  };
}

function getStatusColors(status) {
  const map = {
    pass:       { color:'#10B981', bg:'rgba(16,185,129,0.1)',   icon:'verified',       label:'PASS' },
    authentic:  { color:'#10B981', bg:'rgba(16,185,129,0.1)',   icon:'photo_camera',   label:'AUTHENTIC' },
    unique:     { color:'#10B981', bg:'rgba(16,185,129,0.1)',   icon:'fingerprint',    label:'UNIQUE' },
    verified:   { color:'#10B981', bg:'rgba(16,185,129,0.1)',   icon:'shield',         label:'VERIFIED' },
    warning:    { color:'#F59E0B', bg:'rgba(245,158,11,0.1)',   icon:'warning',        label:'WARNING' },
    similar:    { color:'#F59E0B', bg:'rgba(245,158,11,0.1)',   icon:'content_copy',   label:'SIMILAR' },
    suspicious: { color:'#F59E0B', bg:'rgba(245,158,11,0.1)',   icon:'search',         label:'SUSPICIOUS' },
    mismatch:   { color:'#EF4444', bg:'rgba(239,68,68,0.1)',    icon:'block',          label:'MISMATCH' },
    duplicate:  { color:'#EF4444', bg:'rgba(239,68,68,0.1)',    icon:'layers',         label:'DUPLICATE' },
    likely_ai:  { color:'#EF4444', bg:'rgba(239,68,68,0.1)',    icon:'smart_toy',      label:'AI DETECTED' },
    outside_district: { color:'#EF4444', bg:'rgba(239,68,68,0.1)', icon:'wrong_location', label:'WRONG LOCATION' },
    outside_tn: { color:'#EF4444', bg:'rgba(239,68,68,0.1)',    icon:'public_off',     label:'OUTSIDE TN' },
    no_gps:     { color:'#F59E0B', bg:'rgba(245,158,11,0.1)',   icon:'location_off',   label:'NO GPS' },
    skipped:    { color:'#9CA3AF', bg:'rgba(156,163,175,0.1)',  icon:'skip_next',      label:'SKIPPED' },
    error:      { color:'#9CA3AF', bg:'rgba(156,163,175,0.1)',  icon:'error',          label:'ERROR' },
  };
  return map[status] || { color:'#9CA3AF', bg:'rgba(156,163,175,0.1)', icon:'help', label: (status||'').toUpperCase() };
}

// ── Animated radial gauge ─────────────────────────────────────
function RiskGauge({ score }) {
  const [animated, setAnimated] = useState(0);
  const colors = getRiskColors(score);
  useEffect(() => {
    let start = null;
    const dur = 1200;
    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [score]);

  const r = 36; const circ = 2 * Math.PI * r;
  const dash = circ * (animated / 100);

  return (
    <div style={{ position:'relative', width:96, height:96, flexShrink:0 }}>
      <svg width="96" height="96" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none"
          stroke={colors.dot} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition:'stroke-dasharray 0.05s', filter:`drop-shadow(0 0 6px ${colors.glow})` }} />
      </svg>
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{ fontSize:'18px', fontWeight:900, color:colors.text, lineHeight:1 }}>{animated}</div>
        <div style={{ fontSize:'8px', fontWeight:700, color:'#9CA3AF', letterSpacing:'0.08em' }}>RISK</div>
      </div>
    </div>
  );
}

// ── Single layer row ──────────────────────────────────────────
function LayerRow({ number, title, subtitle, status, note, extra }) {
  const [open, setOpen] = useState(false);
  const sc = getStatusColors(status);
  return (
    <div style={{
      borderRadius:14, overflow:'hidden',
      border:`1px solid ${sc.bg.replace('0.1','0.25')}`,
      transition:'all 0.3s ease',
      marginBottom:8,
    }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width:'100%', display:'flex', alignItems:'center', gap:12,
          padding:'12px 14px', background:'rgba(255,255,255,0.04)',
          border:'none', cursor:'pointer', textAlign:'left',
        }}>
        {/* Layer number */}
        <div style={{
          width:22, height:22, borderRadius:'50%', flexShrink:0,
          background:sc.bg, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:10, fontWeight:900, color:sc.color,
        }}>{number}</div>

        {/* Icon */}
        <span className="material-symbols-outlined" style={{ fontSize:18, color:sc.color, flexShrink:0 }}>
          {sc.icon}
        </span>

        {/* Labels */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#E2E8F0', letterSpacing:'0.02em' }}>{title}</div>
          <div style={{ fontSize:10, color:'#64748B', marginTop:1 }}>{subtitle}</div>
        </div>

        {/* Status pill */}
        <div style={{
          padding:'3px 10px', borderRadius:999,
          background:sc.bg, border:`1px solid ${sc.color}33`,
          fontSize:9, fontWeight:800, color:sc.color,
          letterSpacing:'0.08em', flexShrink:0,
        }}>{sc.label}</div>

        {/* Chevron */}
        <span className="material-symbols-outlined" style={{
          fontSize:16, color:'#475569', flexShrink:0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition:'transform 0.3s',
        }}>expand_more</span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{
          padding:'0 14px 14px 14px',
          background:'rgba(0,0,0,0.15)',
          borderTop:'1px solid rgba(255,255,255,0.05)',
          animation:'fadeInUp 0.25s ease both',
        }}>
          <p style={{ fontSize:11, color:'#94A3B8', lineHeight:1.6, marginTop:10 }}>{note}</p>
          {extra && (
            <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:6 }}>
              {Object.entries(extra).map(([k, v]) => v != null && (
                <div key={k} style={{
                  padding:'3px 10px', borderRadius:8,
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  fontSize:10, color:'#CBD5E1', fontFamily:'monospace',
                }}>
                  <span style={{ color:'#64748B' }}>{k}: </span>{String(v)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ImageIntelCard({ validation, compact = false }) {
  if (!validation) return null;

  const { overall_status, overall_flag, overall_risk = 0, layers = {} } = validation;
  const risk   = getRiskColors(overall_risk);
  const exif   = layers.exif_geofence       || {};
  const sem    = layers.semantic_alignment   || {};
  const phash  = layers.phash_dedup          || {};
  const ela    = layers.ela_authenticity     || {};

  // compact mode = small badge only (for list views)
  if (compact) {
    return (
      <div style={{
        display:'inline-flex', alignItems:'center', gap:6,
        padding:'4px 12px', borderRadius:999,
        background:risk.bg, border:`1px solid ${risk.border}`,
        fontSize:10, fontWeight:800, color:risk.text,
        letterSpacing:'0.07em',
      }}>
        <span style={{
          width:6, height:6, borderRadius:'50%', background:risk.dot,
          boxShadow:`0 0 6px ${risk.glow}`,
          display:'inline-block',
          animation: overall_risk >= 65 ? 'pulse 1.4s ease-out infinite' : 'none',
        }}/>
        {risk.label} · {overall_risk}
      </div>
    );
  }

  return (
    <div style={{
      borderRadius:20,
      background:'linear-gradient(135deg,rgba(15,23,42,0.95),rgba(15,23,42,0.85))',
      backdropFilter:'blur(40px)',
      border:`1px solid ${risk.border}`,
      boxShadow:`0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
      overflow:'hidden',
      fontFamily:"'Manrope',sans-serif",
    }}>
      <style>{`
        @keyframes shimmerSlide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(400%); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(1.3); }
        }
      `}</style>

      {/* Header bar with shimmer */}
      <div style={{
        padding:'16px 20px',
        background:`linear-gradient(90deg,${risk.bg},rgba(255,255,255,0.02))`,
        borderBottom:`1px solid ${risk.border}`,
        display:'flex', alignItems:'center', gap:14,
        position:'relative', overflow:'hidden',
      }}>
        {/* Shimmer sweep */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, bottom:0,
          background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)',
          animation:'shimmerSlide 3s linear infinite',
          pointerEvents:'none',
        }}/>

        <RiskGauge score={overall_risk} />

        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#64748B', letterSpacing:'0.12em', textTransform:'uppercase' }}>
            Image Intelligence Report
          </div>
          <div style={{ fontSize:16, fontWeight:900, color:risk.text, marginTop:3, letterSpacing:'-0.01em' }}>
            {overall_flag || '—'}
          </div>
          <div style={{ fontSize:10, color:'#475569', marginTop:2 }}>
            Composite risk score · 4 layers analysed
          </div>
        </div>

        {/* GPS coords if available */}
        {exif.lat && (
          <div style={{
            padding:'8px 12px', borderRadius:10,
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)',
            textAlign:'right',
          }}>
            <div style={{ fontSize:9, color:'#64748B', fontWeight:600, letterSpacing:'0.1em' }}>GPS</div>
            <div style={{ fontSize:11, color:'#94A3B8', fontFamily:'monospace', fontWeight:700 }}>
              {exif.lat.toFixed(4)}
            </div>
            <div style={{ fontSize:11, color:'#94A3B8', fontFamily:'monospace', fontWeight:700 }}>
              {exif.lon.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {/* Layer rows */}
      <div style={{ padding:'14px 16px 16px' }}>
        <div style={{ fontSize:9, fontWeight:700, color:'#334155', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>
          Layer Analysis · tap to expand
        </div>

        <LayerRow number="1" title="EXIF Geofencing"
          subtitle="GPS coordinates vs claimed district"
          status={exif.status}
          note={exif.note || '—'}
          extra={exif.lat ? { lat: exif.lat, lon: exif.lon } : null} />

        <LayerRow number="2" title="Semantic Alignment"
          subtitle="Image content vs feedback category"
          status={sem.status}
          note={sem.note || '—'}
          extra={{ confidence: sem.confidence != null ? sem.confidence + '%' : null,
                   hints: sem.detected_hints?.join(', ') || null }} />

        <LayerRow number="3" title="Perceptual Hash"
          subtitle="Duplicate / viral photo detection"
          status={phash.status}
          note={phash.note || '—'}
          extra={{ phash: phash.phash ? phash.phash.slice(0,12)+'…' : null,
                   seen: phash.duplicate_count > 0 ? phash.duplicate_count + 'x' : null }} />

        <LayerRow number="4" title="ELA Authenticity"
          subtitle="AI-generated / Photoshop detector"
          status={ela.status}
          note={ela.note || '—'}
          extra={{ ela_score: ela.ela_score != null ? ela.ela_score+'/100' : null,
                   mean: ela.mean_ela != null ? ela.mean_ela : null,
                   peak: ela.max_ela != null ? ela.max_ela : null }} />
      </div>

      {/* Footer risk bar */}
      <div style={{ padding:'0 16px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            Composite Risk
          </span>
          <span style={{ fontSize:9, fontWeight:700, color:risk.text }}>{overall_risk}/100</span>
        </div>
        <div style={{ height:4, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${overall_risk}%`,
            background:`linear-gradient(90deg,${risk.dot},${risk.dot}aa)`,
            borderRadius:999,
            boxShadow:`0 0 8px ${risk.glow}`,
            transition:'width 1.2s cubic-bezier(0.22,1,0.36,1)',
          }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
          <span style={{ fontSize:8, color:'rgba(16,185,129,0.6)', fontWeight:600 }}>0 · SAFE</span>
          <span style={{ fontSize:8, color:'rgba(245,158,11,0.6)', fontWeight:600 }}>35 · MODERATE</span>
          <span style={{ fontSize:8, color:'rgba(239,68,68,0.6)', fontWeight:600 }}>65 · HIGH</span>
        </div>
      </div>
    </div>
  );
}
