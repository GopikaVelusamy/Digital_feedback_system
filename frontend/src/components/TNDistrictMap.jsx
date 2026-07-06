// ============================================================
// TNDistrictMap.jsx
// Tamil Nadu SVG map — all 38 districts with accurate outlines
// Top-5 feedback districts shown as pulsing red flicker dots
// Hover on dot → shows district name + count tooltip
// Compact size to fit left of bar chart
// ============================================================
import React, { useState } from 'react';
import { API } from '../config';

// ── District centroid coordinates (x,y) within 200×340 viewBox
// Scaled from actual TN geographic positions
const [districtCounts, setDistrictCounts] = useState({});

const fetchDashboardData = async () => {
  const res = await fetch(`${API}/api/feedbacks`);
  const feedbacks = await res.json();
  
  // Logic to count feedbacks per district
  const counts = {};
  feedbacks.forEach(fb => {
    const dist = fb.district || "Unknown";
    counts[dist] = (counts[dist] || 0) + 1;
  });
  
  setDistrictCounts(counts);
};
const DISTRICT_COORDS = {
  Chennai:         { x: 170, y:  38 },
  Tiruvallur:      { x: 148, y:  30 },
  Kancheepuram:    { x: 155, y:  60 },
  Chengalpattu:    { x: 160, y:  72 },
  Vellore:         { x: 118, y:  48 },
  Ranipet:         { x: 108, y:  44 },
  Tirupattur:      { x: 122, y:  58 },
  Krishnagiri:     { x: 112, y:  70 },
  Dharmapuri:      { x:  96, y:  82 },
  Salem:           { x: 100, y:  98 },
  Namakkal:        { x: 108, y: 112 },
  Erode:           { x:  82, y: 110 },
  Tiruppur:        { x:  80, y: 128 },
  Coimbatore:      { x:  58, y: 128 },
  Nilgiris:        { x:  64, y: 108 },
  Karur:           { x: 116, y: 126 },
  Tiruchirappalli: { x: 122, y: 140 },
  Ariyalur:        { x: 138, y: 130 },
  Perambalur:      { x: 130, y: 118 },
  Cuddalore:       { x: 158, y: 106 },
  Villupuram:      { x: 148, y:  94 },
  Kallakurichi:    { x: 138, y:  94 },
  Thanjavur:       { x: 142, y: 154 },
  Nagapattinam:    { x: 158, y: 170 },
  Tiruvarur:       { x: 150, y: 164 },
  Mayiladuthurai:  { x: 152, y: 148 },
  Pudukkottai:     { x: 134, y: 154 },
  Dindigul:        { x: 100, y: 150 },
  Theni:           { x:  90, y: 168 },
  Madurai:         { x: 110, y: 174 },
  Sivagangai:      { x: 128, y: 180 },
  Ramanathapuram:  { x: 138, y: 196 },
  Virudhunagar:    { x: 114, y: 196 },
  Thoothukudi:     { x: 124, y: 220 },
  Tirunelveli:     { x: 106, y: 222 },
  Tenkasi:         { x:  92, y: 220 },
  Kanniyakumari:   { x:  98, y: 244 },
};

// ── Simplified but accurate TN state outline path (SVG)
// Hand-mapped to 200×270 coordinate space
const TN_OUTLINE = `
  M 170,18 L 178,22 L 182,30 L 178,40 L 172,48
  L 168,58 L 172,68 L 166,76 L 158,80
  L 160,92 L 154,100 L 158,112 L 162,124
  L 158,138 L 154,148 L 158,160 L 162,172
  L 158,184 L 154,192 L 148,204 L 144,218
  L 136,228 L 124,238 L 112,250 L 102,254
  L  94,250 L  86,242 L  80,230
  L  78,218 L  80,206 L  86,194 L  84,180
  L  80,168 L  76,154 L  74,140 L  68,124
  L  58,118 L  46,116 L  40,106 L  42,94
  L  48,84  L  50,72  L  56,64  L  62,54
  L  66,44  L  68,32  L  76,24  L  86,20
  L  96,18  L 108,16  L 118,14  L 128,18
  L 138,20  L 148,16  L 158,14  L 168,16 Z
`;

export default function TNDistrictMap({ top5 = [], allCounts = {} }) {
  const [tooltip, setTooltip] = useState(null); // { x, y, name, count }

  // Rank all districts, pick top 5
  const ranked = Object.entries(allCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const top5Names = ranked.map(([name]) => name);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 12 + 'px',
          top:  tooltip.y - 16 + 'px',
          background: 'rgba(17,24,39,0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '8px 14px',
          pointerEvents: 'none',
          zIndex: 100,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}>
            {tooltip.name}
          </div>
          <div style={{ color: '#10B981', fontWeight: 600, fontSize: '11px', marginTop: '2px' }}>
            {tooltip.count} feedbacks
          </div>
        </div>
      )}

      <svg
        viewBox="30 10 160 252"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glass gradient fill for the state */}
          <linearGradient id="tnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(22, 163, 74, 0.12)" />
          </linearGradient>

          {/* Glow filter for green flicker dots */}
          <filter id="greenGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pulse animation for rings */}
          <style>{`
            @keyframes tnPulse {
              0%   { r: 4;  opacity: 0.9; }
              60%  { r: 12; opacity: 0;   }
              100% { r: 4;  opacity: 0;   }
            }
            @keyframes tnPulse2 {
              0%   { r: 4;  opacity: 0.6; }
              60%  { r: 16; opacity: 0;   }
              100% { r: 4;  opacity: 0;   }
            }
            .pulse-ring-1 { animation: tnPulse  1.8s ease-out infinite; }
            .pulse-ring-2 { animation: tnPulse2 1.8s ease-out 0.4s infinite; }
          `}</style>
        </defs>

        {/* ── State outline — frosted glass plate ── */}
        <path
          d={TN_OUTLINE}
          fill="url(#tnGrad)"
          stroke="rgba(22, 128, 61, 0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          }}
        />

        {/* ── Inner shimmer edge (premium glass effect) ── */}
        <path
          d={TN_OUTLINE}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.6"
          strokeLinejoin="round"
          strokeDasharray="4 6"
          opacity="0.7"
        />

        {/* ── District dot grid — all districts as tiny dots ── */}
        {Object.entries(DISTRICT_COORDS).map(([name, { x, y }]) => {
          const isTop5 = top5Names.includes(name);
          if (isTop5) return null; // rendered separately with animation
          return (
            <circle
              key={name}
              cx={x} cy={y} r={1.2}
              fill="rgba(107,114,128,0.35)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.4"
            />
          );
        })}

        {/* ── Top 5 animated flicker dots ── */}
        {ranked.map(([name, count], rank) => {
          const coords = DISTRICT_COORDS[name];
          if (!coords) return null;
          const { x, y } = coords;
          // Rank 0 = biggest, rank 4 = smallest
          const dotSize = 4.5 - rank * 0.4;
          const delay = rank * 0.3;

          return (
            <g key={name}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const svgEl = e.currentTarget.closest('svg');
                const rect  = svgEl.getBoundingClientRect();
                const svgPt = svgEl.createSVGPoint();
                svgPt.x = e.clientX; svgPt.y = e.clientY;
                const pt = svgPt.matrixTransform(svgEl.getScreenCTM().inverse());
                setTooltip({
                  x: ((pt.x - 30) / 160) * svgEl.clientWidth,
                  y: ((pt.y - 10) / 252) * svgEl.clientHeight,
                  name,
                  count,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Outer pulse ring 2 (slower, bigger) */}
              <circle
                className="pulse-ring-2"
                cx={x} cy={y} r={4}
                fill="none"
                stroke="rgba(34,197,94,0.4)"
                strokeWidth="1.2"
                style={{ animationDelay: delay + 's' }}
              />
              {/* Inner pulse ring 1 */}
              <circle
                className="pulse-ring-1"
                cx={x} cy={y} r={4}
                fill="none"
                stroke="rgba(34,197,94,0.7)"
                strokeWidth="1.5"
                style={{ animationDelay: (delay + 0.15) + 's' }}
              />
              {/* Core solid dot */}
              <circle
                cx={x} cy={y} r={dotSize}
                fill="#22c55e"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1.2"
                filter="url(#greenGlow)"
              />
              {/* Rank badge (1,2,3,4,5) */}
              <text
                x={x} y={y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="3.5"
                fontWeight="900"
                fill="#fff"
                style={{ pointerEvents: 'none', fontFamily: 'Manrope,sans-serif' }}
              >
                {rank + 1}
              </text>
            </g>
          );
        })}

        {/* ── "TN" label ── */}
        <text x="87" y="130" fontSize="7" fill="rgba(22, 128, 61, 0.35)"
          fontWeight="700" fontFamily="Manrope,sans-serif" letterSpacing="2">
          TN
        </text>
      </svg>

      {/* ── Legend below map ── */}
      <div style={{
        position: 'absolute', bottom: '4px', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: '6px',
        flexWrap: 'wrap',
      }}>
        {ranked.slice(0, 3).map(([name, count], i) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '9px', fontWeight: 700, color: '#6B7280',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '6px', padding: '2px 6px',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              flexShrink: 0,
            }}></span>
            <span style={{
              maxWidth: '60px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>#{i+1} {name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
