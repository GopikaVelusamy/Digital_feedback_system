// ============================================================
// DashboardPage.jsx — YOUR EXACT CODE + TN MAP ADDED
// Zero modifications to any existing logic.
// Only 4 additions (clearly marked with "ADDITION"):
//   1. TNDistrictMap inline component (before DashboardPage export)
//   2. districtCounts state variable
//   3. loadStatuses() counts districts from feedbacks list
//   4. Bar chart section wrapped in flex row: [map panel | bars]
// ============================================================

import React, {
  useEffect, useRef, useState, useCallback
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { translationData, getLanguage, setLanguage } from '../utils/translations';

import { API } from '../config';
const BAR_H = 320;

const DISTRICT_DATA = {
  Chennai:['Harbour','R.K. Nagar','Perambur','Kolathur','Villivakkam','Thiru-Vi-Ka-Nagar','Egmore','Royapuram','Chepauk-Thiruvallikeni','Thousand Lights','Anna Nagar','Virugampakkam','Saidapet','T. Nagar','Mylapore','Velachery'],
  Coimbatore:['Mettupalayam','Sulur','Kavundampalayam','Coimbatore North','Thondamuthur','Coimbatore South','Singanallur','Kinathukadavu','Pollachi','Valparai'],
  Madurai:['Melur','Madurai East','Madurai West','Madurai North','Madurai South','Madurai Central','Thirupparankundram','Tirumangalam','Usilampatti'],
  Salem:['Edappadi','Mettur','Omalur','Salem North','Salem South','Salem West','Veerapandi','Yercaud'],
  Tiruchirappalli:['Srirangam','Tiruchirappalli West','Tiruchirappalli East','Thiruverumbur','Lalgudi','Manachanallur','Musiri','Thuraiyur'],
  Thanjavur:['Orathanadu','Papanasam','Thiruvaiyaru','Thanjavur','Pattukkottai','Peravurani'],
  Erode:['Erode East','Erode West','Modakkurichi','Perundurai','Bhavani','Anthiyur','Gobichettipalayam'],
  Vellore:['Gudiyatham','Katpadi','Vellore','Anaikattu','Kilvaithinankuppam'],
  Tirunelveli:['Tirunelveli','Palayamkottai','Ambasamudram','Nanguneri','Radhapuram'],
  Dindigul:['Palani','Oddanchatram','Athoor','Nilakkottai','Natham','Dindigul'],
  Namakkal:['Rasipuram','Senthamangalam','Namakkal','Paramathi Velur','Tiruchengode','Kumarapalayam'],
  Krishnagiri:['Krishnagiri','Bargur','Hosur','Thalli','Uthangarai'],
  Dharmapuri:['Dharmapuri','Pennagaram','Palacode','Pappireddippatti'],
  Thoothukudi:['Thoothukudi','Tiruchendur','Srivaikuntam','Ottapidaram','Vilathikulam'],
  Virudhunagar:['Rajapalayam','Srivilliputhur','Sattur','Sivakasi','Virudhunagar','Aruppukkottai'],
  Cuddalore:['Panruti','Kurinjipadi','Bhuvanagiri','Chidambaram','Kattumannarkoil','Cuddalore','Neyveli'],
  Nagapattinam:['Kilvelur','Nagapattinam','Vedaranyam'],
  Karur:['Karur','Krishnarayapuram','Aravakurichi','Kulithalai'],
  Theni:['Bodinayakanur','Cumbum','Andipatti','Periyakulam'],
  Nilgiris:['Ooty','Coonoor','Gudalur'],
  Tenkasi:['Tenkasi','Alangulam','Kadayanallur','Sankarankovil','Vasudevanallur'],
  Sivagangai:['Sivaganga','Karaikudi','Tirupattur','Manamadurai'],
  Ramanathapuram:['Paramakudi','Tiruvadanai','Ramanathapuram','Mudhukulathur'],
  Ariyalur:['Ariyalur','Jayankondam'],
  Perambalur:['Perambalur','Kunnam'],
};

const DEPTS = [
  { key:'sanitation', label:'Sanitation', apiKey:'sanitation' },
  { key:'road',       label:'Road',       apiKey:'roads & infrastructure' },
  { key:'power',      label:'Power',      apiKey:'electricity & power' },
  { key:'water',      label:'Water',      apiKey:'water supply' },
  { key:'security',   label:'Security',   apiKey:'public security' },
];

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!target) { setVal(0); return; }
    let t0 = null;
    const from = 0;
    function tick(now) {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + ease * (target - from)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

function BarColumn({ label, negPx, neuPx, posPx, negV, neuV, posV, visible }) {
  const heightScale = 0.85;
  const animNeg = visible ? negPx * heightScale : 0;
  const animNeu = visible ? neuPx * heightScale : 0;
  const animPos = visible ? posPx * heightScale : 0;

  const glassLayer = {
    left: 0, right: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '11px',
    transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: 'inset 0 10px 15px rgba(255,255,255,0.4)',
  };

  return (
    <div className="bar-block-3d" style={{
      flex: '0 0 60px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', perspective: '1000px',
    }}>
      <div className="bar-stack-container-3d" style={{
        width: '40px',
        height: (BAR_H * heightScale) + 'px',
        position: 'relative', borderRadius: '14px',
        overflow: 'hidden', background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        transformStyle: 'preserve-3d', transition: 'all 0.4s ease',
      }}>
        <div className="glass-shimmer"></div>

        <div style={{
          ...glassLayer, position: 'absolute',
          bottom: (animPos + animNeu) + 'px', height: animNeg + 'px',
          background: 'linear-gradient(180deg, rgba(255,59,48,0.5), rgba(255,59,48,0.8))',
          color: '#fff',
        }}>{animNeg > 20 ? negV : ''}</div>

        <div style={{
          ...glassLayer, position: 'absolute',
          bottom: animPos + 'px', height: animNeu + 'px',
          background: 'linear-gradient(180deg, rgba(255,204,0,0.5), rgba(255,204,0,0.8))',
          color: '#422006', transitionDelay: '0.1s',
        }}>{animNeu > 20 ? neuV : ''}</div>

        <div style={{
          ...glassLayer, position: 'absolute',
          bottom: 0, height: animPos + 'px',
          background: 'linear-gradient(180deg, rgba(52,199,89,0.5), rgba(52,199,89,0.8))',
          color: '#fff', transitionDelay: '0.2s',
        }}>{animPos > 20 ? posV : ''}</div>
      </div>

      <span style={{ fontSize:'10px', fontWeight:800, color:'#64748b', marginTop:'12px', textTransform:'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

function calcPx(d) {
  const tot = (d?.pos || 0) + (d?.neu || 0) + (d?.neg || 0);
  if (tot === 0) return { posPx: 0, neuPx: 0, negPx: 0 };
  const fill = BAR_H * 0.92;
  return {
    posPx: Math.round((d.pos / tot) * fill),
    neuPx: Math.round((d.neu / tot) * fill),
    negPx: Math.round((d.neg / tot) * fill),
  };
}

// ═══════════════════════════════════════════════════════════════
// ADDITION 1 — TNDistrictMap with real D3 + TopoJSON geographic map
// Replaces the hand-drawn SVG path version entirely.
// Same props interface: allCounts = { [districtName]: count }
// ═══════════════════════════════════════════════════════════════
function TNDistrictMap({ allCounts }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  // Normalise district names for fuzzy matching
  const norm = (s = '') =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  useEffect(() => {
    let cancelled = false;

    // Dynamically load D3 + TopoJSON from CDN if not already present
    function loadScript(src) {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
      });
    }

    async function draw() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js');

      // Wait until globals are available
      await new Promise(resolve => {
        const t = setInterval(() => {
          if (window.d3 && window.topojson) { clearInterval(t); resolve(); }
        }, 50);
      });

      if (cancelled || !svgRef.current) return;

      const W = 180, H = 310;
      const d3 = window.d3;
      const topojson = window.topojson;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      // Fetch TN district boundaries from india-atlas (jsDelivr CDN)
      // Fetch ONLY Tamil Nadu district boundaries (Fast & Lightweight)
// ✅ INTHA NEW FIXED CODE BLOCK-AH APDIYE PASTE PANNUNGA:
let topo;
try {
  // 1. Direct-ah clear lightweight TN map data fetch aaguthu
  topo = await d3.json(
    'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@master/topojson/states/tamilnadu.json'
  );
} catch (e) {
  console.error("Map fetch tracking error:", e);
  svg.append('text')
    .attr('x', W / 2).attr('y', H / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px').attr('fill', '#9CA3AF')
    .text('Map unavailable');
  return;
}

if (cancelled) return;

// 2. Object key reference mapping-ah change panrom
const firstKey = topo.objects ? Object.keys(topo.objects)[0] : null;
const geojson = topojson.feature(topo, topo.objects[firstKey]);

// 3. Already pre-filtered array thaan, so direct assignment (No filter loops)
const tnFeatures = geojson.features;

if (!tnFeatures.length) {
  svg.append('text')
    .attr('x', W / 2).attr('y', H / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px').attr('fill', '#9CA3AF')
    .text('No TN data found');
  return;
}

// 4. Counts mapping tracker system build panrom
const countMap = {};
Object.entries(allCounts || {}).forEach(([k, v]) => {
  countMap[norm(k)] = v;
});

// 5. New schema geometry rules-ku lowercase district name property property track panrom
tnFeatures.forEach(f => {
  const rawName =
    f.properties.district || 
    f.properties.DISTRICT ||
    f.properties.name     || '';
  f._displayName = rawName;
  f._count = countMap[norm(rawName)] || 0;
});

      // Rank top-5 by count
      const sorted = [...tnFeatures].sort((a, b) => b._count - a._count);
      const top5 = sorted.slice(0, 5);
      const top5NormNames = new Set(top5.map(f => norm(f._displayName)));

      // D3 projection fitted to panel size
      const projection = d3.geoMercator()
        .fitSize([W, H], { type: 'FeatureCollection', features: tnFeatures });
      const pathGen = d3.geoPath().projection(projection);

      // ── Defs ──
      const defs = svg.append('defs');

      defs.append('filter').attr('id', 'tnGlow2')
        .call(f => {
          f.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
          const m = f.append('feMerge');
          m.append('feMergeNode').attr('in', 'blur');
          m.append('feMergeNode').attr('in', 'SourceGraphic');
        });

      defs.append('linearGradient').attr('id', 'tnDistFill2')
        .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%')
        .call(g => {
          g.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.22)');
          g.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(198,183,166,0.08)');
        });

      // Pulse keyframe animations injected into SVG
      svg.append('style').text(`
        @keyframes tnRing1Real { 0%{r:5;opacity:.85} 70%{r:14;opacity:0} 100%{r:5;opacity:0} }
        @keyframes tnRing2Real { 0%{r:5;opacity:.45} 70%{r:20;opacity:0} 100%{r:5;opacity:0} }
        @keyframes tnCoreReal  { 0%,100%{opacity:1}  50%{opacity:.75} }
        .tnr1r { animation: tnRing1Real 2s ease-out infinite; }
        .tnr2r { animation: tnRing2Real 2s ease-out .35s infinite; }
        .tncr  { animation: tnCoreReal  2s ease-in-out infinite; }
      `);

      // ── Draw all district polygons ──
      svg.append('g')
        .selectAll('path')
        .data(tnFeatures)
        .join('path')
        .attr('d', pathGen)
        .attr('fill', d =>
          top5NormNames.has(norm(d._displayName))
            ? 'rgba(239,68,68,0.10)'
            : 'url(#tnDistFill2)'
        )
        .attr('stroke', d =>
          top5NormNames.has(norm(d._displayName))
            ? 'rgba(239,68,68,0.55)'
            : 'rgba(168,154,139,0.55)'
        )
        .attr('stroke-width', d =>
          top5NormNames.has(norm(d._displayName)) ? 1.2 : 0.8
        )
        .attr('stroke-linejoin', 'round')
        .style('cursor', d => d._count > 0 ? 'pointer' : 'default')
        .on('mouseenter', function (event, d) {
          if (!d._count) return;
          const [px, py] = d3.pointer(event, svgRef.current);
          setTooltip({ px, py, name: d._displayName, count: d._count });
        })
        .on('mouseleave', () => setTooltip(null));

      // Crystal shimmer overlay on state boundary
      svg.append('path')
        .datum({ type: 'FeatureCollection', features: tnFeatures })
        .attr('d', pathGen)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.45)')
        .attr('stroke-width', '0.6')
        .attr('stroke-dasharray', '2.5 4')
        .attr('opacity', '0.7');

      // ── Non-top-5 tiny dots at centroid ──
      tnFeatures.forEach(f => {
        if (top5NormNames.has(norm(f._displayName))) return;
        const c = pathGen.centroid(f);
        if (!c || isNaN(c[0])) return;
        svg.append('circle')
          .attr('cx', c[0]).attr('cy', c[1]).attr('r', 1.4)
          .attr('fill', 'rgba(148,163,184,0.45)')
          .attr('stroke', 'rgba(255,255,255,0.5)')
          .attr('stroke-width', '0.5');
      });

      // ── Top-5 animated blinking dots ──
      top5.forEach((f, rank) => {
        const c = pathGen.centroid(f);
        if (!c || isNaN(c[0])) return;
        const [cx, cy] = c;
        const delay = rank * 0.28;
        const coreR = 4.5 - rank * 0.35;

        const g = svg.append('g')
          .style('cursor', 'pointer')
          .on('mouseenter', () =>
            setTooltip({ px: cx, py: cy, name: f._displayName, count: f._count })
          )
          .on('mouseleave', () => setTooltip(null));

        // Outer slow ring
        g.append('circle')
          .attr('class', 'tnr2r')
          .attr('cx', cx).attr('cy', cy).attr('r', 5)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(239,68,68,0.35)')
          .attr('stroke-width', '1')
          .style('animation-delay', delay + 's');

        // Inner fast ring
        g.append('circle')
          .attr('class', 'tnr1r')
          .attr('cx', cx).attr('cy', cy).attr('r', 5)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(239,68,68,0.65)')
          .attr('stroke-width', '1.4')
          .style('animation-delay', (delay + 0.12) + 's');

        // Core dot
        g.append('circle')
          .attr('class', 'tncr')
          .attr('cx', cx).attr('cy', cy).attr('r', coreR)
          .attr('fill', '#EF4444')
          .attr('stroke', 'rgba(255,255,255,0.85)')
          .attr('stroke-width', '1.2')
          .attr('filter', 'url(#tnGlow2)')
          .style('animation-delay', (delay * 0.5) + 's');

        // Rank number
        g.append('text')
          .attr('x', cx).attr('y', cy)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-size', '3.2')
          .attr('font-weight', '900')
          .attr('fill', '#fff')
          .attr('pointer-events', 'none')
          .attr('font-family', 'Manrope,sans-serif')
          .text(rank + 1);
      });

      // TN watermark
      svg.append('text')
        .attr('x', W / 2).attr('y', H / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8')
        .attr('fill', 'rgba(198,183,166,0.28)')
        .attr('font-weight', '800')
        .attr('font-family', 'Manrope,sans-serif')
        .attr('letter-spacing', '3')
        .text('TN');
    }

    draw().catch(console.error);
    return () => { cancelled = true; };
  }, [allCounts]);

  // Top-3 name pills — identical to original
  const top3 = Object.entries(allCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.px + 14 + 'px',
          top: tooltip.py - 20 + 'px',
          background: 'rgba(15,23,42,0.93)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '8px 14px',
          pointerEvents: 'none',
          zIndex: 200,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          fontFamily: 'Manrope,sans-serif',
        }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '12px' }}>{tooltip.name}</div>
          <div style={{ color: '#FCA5A5', fontWeight: 600, fontSize: '11px', marginTop: '3px' }}>
            {tooltip.count} feedbacks
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 180 310"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      />

      {/* Bottom district name pills — identical to original */}
      <div style={{
        position: 'absolute', bottom: '2px', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap',
      }}>
        {top3.map(([name, count], i) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '8px', fontWeight: 700, color: '#6B7280',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '6px', padding: '2px 6px',
            border: '1px solid rgba(255,255,255,0.6)',
            fontFamily: 'Manrope,sans-serif',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#EF4444',
              display: 'inline-block', boxShadow: '0 0 4px rgba(239,68,68,0.6)',
            }} />
            #{i + 1} {name.length > 9 ? name.slice(0, 8) + '…' : name}
          </div>
        ))}
      </div>
    </div>
  );
}
// ── End ADDITION 1 ─────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate   = useNavigate();
  const location   = useLocation();

  const chartRef   = useRef(null);
  const chartInst  = useRef(null);
  const fpRef      = useRef(null);
  const barRef     = useRef(null);
  const sidebarRef = useRef(null);

  const distRef    = useRef('');
  const constiRef  = useRef('');
  const drRef      = useRef('');

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

  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [district,       setDistrict]       = useState('');
  const [constituency,   setConstituency]   = useState('');
  const [constituencies, setConstituencies] = useState([]);
  const [dateRange,      setDateRange]      = useState('');
  const [barVisible,     setBarVisible]     = useState(false);

  const [totalRaw,  setTotalRaw]  = useState(0);
  const [solved,    setSolved]    = useState(0);
  const [pending,   setPending]   = useState(0);
  const [solving,   setSolving]   = useState(0);
  const [sentPos,   setSentPos]   = useState(0);
  const [sentNeu,   setSentNeu]   = useState(0);
  const [sentNeg,   setSentNeg]   = useState(0);
  const [sentPct,   setSentPct]   = useState('0%');
  const [deptData,  setDeptData]  = useState({});

  // ADDITION 2 — district counts for TN map
  const [districtCounts, setDistrictCounts] = useState({});

  const totalAnim   = useCountUp(totalRaw);
  const solvedAnim  = useCountUp(solved);
  const pendingAnim = useCountUp(pending);

  useEffect(() => {
    if (!barRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(barRef.current);
    return () => obs.disconnect();
  }, [deptData]);

  const initChart = useCallback(() => {
    if (!window.ApexCharts) { setTimeout(initChart, 300); return; }
    if (chartInst.current || !chartRef.current) return;
    chartInst.current = new window.ApexCharts(chartRef.current, {
      series: [1, 1, 1],
      chart: {
        type: 'donut', height: 360, toolbar: { show: false },
        background: 'transparent',
        animations: { enabled: true, speed: 1000, dynamicAnimation: { enabled: true, speed: 800 } },
      },
      labels: ['Positive', 'Neutral', 'Negative'],
      colors: ['#10B981', '#FBBF24', '#EF4444'],
      legend: { show: false },
      dataLabels: {
        enabled: true,
        formatter: (val) => Math.round(val) + '%',
        dropShadow: { enabled: false },
        style: { fontSize:'11px', fontFamily:'Manrope,sans-serif', fontWeight:700, colors:['#fff'] },
      },
      plotOptions: {
        pie: { expandOnClick: true, donut: { size:'72%', labels:{ show:false } } },
      },
      stroke: { width:2, colors:['rgba(255,255,255,0.3)'] },
      states: { hover: { filter: { type:'darken', value:0.8 } } },
      tooltip: { theme:'light', style:{ fontFamily:'Manrope,sans-serif' } },
    });
    chartInst.current.render();
  }, []);

  const loadDashboard = useCallback(async (dist, consti, dr) => {
    try {
      const url = new URL(`${API}/api/dashboard`);
      if (dist)   url.searchParams.set('district',     dist);
      if (consti) url.searchParams.set('constituency', consti);
      if (dr)     url.searchParams.set('dateRange',    dr);
      const res  = await fetch(url.toString());
      const data = await res.json();
      const tot  = parseInt(data.total_feedbacks) || 0;
      setTotalRaw(tot);
      const pos = data.sentiment?.positive || 0;
      const neu = data.sentiment?.neutral  || 0;
      const neg = data.sentiment?.negative || 0;
      const ts  = pos + neu + neg;
      setSentPos(pos); setSentNeu(neu); setSentNeg(neg);
      setSentPct(ts > 0 ? Math.round((pos / ts) * 100) + '%' : '0%');
      if (chartInst.current) {
        chartInst.current.updateSeries(ts > 0 ? [pos, neu, neg] : [1, 1, 1]);
      }
      if (data.departments) {
        setBarVisible(false);
        const nd = {};
        DEPTS.forEach(({ key, apiKey }) => {
          const d = data.departments[apiKey] || { pos: 0, neu: 0, neg: 0 };
          nd[key] = { ...d, ...calcPx(d) };
        });
        setDeptData(nd);
        setTimeout(() => {
          if (barRef.current) {
            const rect = barRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight) setBarVisible(true);
          }
        }, 100);
      }
    } catch (e) { console.error('Dashboard error:', e); }
  }, []);

  // ADDITION 3 — loadStatuses now also counts district feedbacks for TN map
  const loadStatuses = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/api/feedbacks`);
      const list = await res.json();
      setSolved(list.filter(f => f.status === 'Solved').length);
      setPending(list.filter(f => f.status === 'Pending').length);
      setSolving(list.filter(f => f.status === 'In Progress').length);
      // Count per-district — supports both flat (f.district) and nested (f.location.district)
      const counts = {};
      list.forEach(f => {
        const d = f.location?.district || f.district || '';
        if (d) counts[d] = (counts[d] || 0) + 1;
      });
      setDistrictCounts(counts);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    initChart();
    function tryFP() {
      if (!window.flatpickr) { setTimeout(tryFP, 300); return; }
      fpRef.current = window.flatpickr('#fpDateRange', {
        mode: 'range', dateFormat: 'Y-m-d',
        onClose: (dates, str) => {
          if (dates.length === 2) {
            drRef.current = str; setDateRange(str);
            loadDashboard(distRef.current, constiRef.current, str);
            loadStatuses();
          }
        },
      });
    }
    tryFP();
    loadDashboard('', '', '');
    loadStatuses();
    return () => { if (fpRef.current?.destroy) fpRef.current.destroy(); };
  }, [initChart, loadDashboard, loadStatuses]);

  const toggleSidebar = () => setSidebarOpen(o => !o);

  function onDistrict(v) {
    distRef.current = v; setDistrict(v); setConstituency(''); constiRef.current = '';
    setConstituencies(DISTRICT_DATA[v] || []);
    loadDashboard(v, '', drRef.current); loadStatuses();
  }
  function onConstituency(v) {
    constiRef.current = v; setConstituency(v);
    loadDashboard(distRef.current, v, drRef.current); loadStatuses();
  }
  function clearDates() {
    drRef.current = ''; setDateRange('');
    if (fpRef.current?.clear) fpRef.current.clear();
    loadDashboard(distRef.current, constiRef.current, ''); loadStatuses();
  }

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
        .bar-block:hover .bar-stack-container {
          transform: scale(1.04) translateY(-6px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
          border: 1px solid rgba(16,185,129,0.3) !important;
        }
        .bar-block-3d:hover .bar-stack-container-3d {
          transform: scale(1.06) translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .glass-card-dash {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 25px 60px rgba(22, 163, 74, 0.05);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          border-radius: 24px;
        }
        .glass-card-dash:hover { transform: translateY(-3px); box-shadow: 0 30px 60px rgba(22, 163, 74, 0.1); }
        .stat-card-dash {
          background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(24px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 25px 60px rgba(22, 163, 74, 0.05);
          border-radius: 20px; padding: 24px;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .stat-card-dash:hover { transform: translateY(-4px); box-shadow: 0 30px 60px rgba(22, 163, 74, 0.1); }
        .filter-pill {
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(24px);
          border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px;
          padding: 8px 14px; display: flex; align-items: center; gap: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .filter-pill select, .filter-pill input {
          background: transparent !important; border: none; outline: none;
          font-family: 'Manrope',sans-serif; font-size: 13px; font-weight: 600; color: #064e3b;
        }
        .filter-pill select option {
          background-color: #ffffff !important; color: #064e3b !important;
        }
        #sentimentChart3D .apexcharts-canvas { margin: 0 auto; }
        .time-btn { color: #064e3b !important; }
        .time-btn:hover { background: rgba(16,185,129,0.05) !important; transform: translateY(-1px); }
        .glass-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%);
          pointer-events: none; border-radius: 14px;
        }
        @keyframes fadeInUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .fade-in-up   { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in-up-1 { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .fade-in-up-2 { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .fade-in-up-3 { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .fade-in-up-4 { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .fade-in-up-5 { animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
      `}</style>

      {/* MAIN CONTENT */}
      <main id="mainContent" className="flex-1 px-4 py-6 sm:px-10 sm:py-8 pt-20 sm:pt-8" style={{
        minHeight:'100vh',
        maxWidth: '1280px',
        boxSizing:'border-box', width: 'auto',
        overflowX: 'hidden',
      }}>

        {/* HEADER */}
        <header className="fade-in-up" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:'16px', marginBottom:'32px', flexWrap:'wrap',
        }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#064e3b] tracking-tight leading-none my-0">
              {t.feedbackAnalytics}
            </h2>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
            <div className="filter-pill">
              <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'#10b981' }}>translate</span>
              <select value={language} onChange={e=>setLanguage(e.target.value)} style={{ width:'100px' }}>
                <option value="English">English</option>
                <option value="Tamil">தமிழ்</option>
              </select>
            </div>
            <div className="filter-pill">
              <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'#10b981' }}>location_on</span>
              <select value={district} onChange={e=>onDistrict(e.target.value)} style={{ width:'140px' }}>
                <option value="">{t.allDistricts}</option>
                {Object.keys(DISTRICT_DATA).map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="filter-pill">
              <select value={constituency} onChange={e=>onConstituency(e.target.value)} style={{ width:'160px' }}>
                <option value="">{t.allConstituencies}</option>
                {constituencies.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-pill">
              <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'#10b981' }}>calendar_month</span>
              <input id="fpDateRange" readOnly placeholder={t.selectDates} style={{ width:'140px', cursor:'pointer' }} />
              {dateRange && (
                <a href="#" role="button" onClick={(e) => { e.preventDefault(); clearDates(); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#047857', fontSize:'13px', fontWeight:700, padding:'0 2px', display:'inline-block' }}
                  onMouseEnter={e=>e.target.style.color='#EF4444'}
                  onMouseLeave={e=>e.target.style.color='#047857'}>✕</a>
              )}
            </div>
          </div>
        </header>

        {/* TOP 3 STAT CARDS */}
        <div className="fade-in-up-1 grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[
            { label: t.totalReceived,       val:totalAnim,  icon: 'inbox',    bg: 'rgba(21, 128, 61, 0.1)', color: '#10b981', badge: '+12%', bColor: '#047857', borderLeft: '5px solid #10b981', trendIcon: 'trending_up' },
            { label: t.totalResolved,       val:solvedAnim, icon: 'task_alt', bg: 'rgba(16, 185, 129, 0.1)', color: '#16a34a', badge: '+8%',  bColor: '#16a34a', borderLeft: '5px solid #16a34a', trendIcon: 'trending_up' },
            { label: t.avgResolutionTime,   val: '0',        icon: 'timer',    bg: 'rgba(15, 118, 110, 0.1)', color: '#0d9488', badge: '-5%',  bColor: '#0d9488', borderLeft: '5px solid #0d9488', trendIcon: 'trending_down' },
          ].map(({ label, val, icon, bg, color, badge, bColor, borderLeft, trendIcon }, i) => (
            <div key={i} className="stat-card-dash" style={{
              borderLeft: borderLeft,
              padding: '20px 24px',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
                <div style={{ width:46, height:46, borderRadius:'12px', background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ color, fontSize:'22px' }}>{icon}</span>
                </div>
                <span style={{ color:bColor, fontSize:'12px', fontWeight:700, display:'flex', alignItems:'center', gap:'2px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>{trendIcon}</span>{badge}
                </span>
              </div>
              <div style={{ color:'#047857', fontSize:'12px', fontWeight:700, marginBottom:'4px' }}>{label}</div>
              <div style={{ fontSize:'28px', fontWeight:900, color:'#064e3b' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* DONUT CHART */}
        <div id="sentimentCard" className="glass-card-dash fade-in-up-2" style={{ padding:'40px', marginBottom:'24px' }}>
          <h4 style={{ textAlign:'center', fontSize:'20px', fontWeight:800, color:'#064e3b', marginBottom:'0px', letterSpacing:'-0.01em' }}>
            {t.overallSentiment}
          </h4>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'360px' }}>
            <div id="sentimentChart3D" ref={chartRef} style={{ width:'100%', maxWidth:'500px' }}></div>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:10 }}>
              <span style={{ fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.25em', fontWeight:700, color:'#047857' }}>TOTAL</span>
              <span style={{ fontSize:'52px', fontWeight:900, color:'#064e3b', lineHeight:1.1 }}>{sentPct}</span>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'48px', marginTop:'8px' }}>
            {[
              { dot:'#10B981', label:'Positive', val:sentPos },
              { dot:'#FBBF24', label:'Neutral',  val:sentNeu },
              { dot:'#EF4444', label:'Negative', val:sentNeg },
            ].map(({ dot, label, val }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:dot, margin:'0 auto 6px' }}></div>
                <div style={{ fontSize:'10px', textTransform:'uppercase', color:'#047857', fontWeight:750, letterSpacing:'0.08em' }}>{label}</div>
                <div style={{ fontSize:'16px', fontWeight:700, color:dot, marginTop:'2px' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART CARD */}
        <div id="barCard" className="glass-card-dash fade-in-up-3" style={{ padding:'36px', marginBottom:'24px' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent: 'space-between', marginBottom:'20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ fontSize:'17px', fontWeight:850, color:'#064e3b', margin:0 }}>{language === 'English' ? 'Department Feedback Analytics' : 'துறை கருத்து பகுப்பாய்வு'}</h4>
              <p style={{ fontSize:'11px', fontWeight:700, color:'#047857', textTransform:'uppercase', letterSpacing:'0.08em', margin:'4px 0 0' }}>
                {language === 'English' ? 'Resolve Rate vs. Volume' : 'தீர்வு விகிதம் மற்றும் அளவு'}
              </p>
            </div>
            <div style={{ background:'rgba(16, 185, 129, 0.08)', backdropFilter:'blur(10px)', border:'1px solid rgba(16, 185, 129, 0.15)', borderRadius:'999px', padding:'4px', display:'flex', gap:'2px' }}>
              {['Weekly','Monthly','Yearly'].map((timeLabel, i) => (
                <button key={timeLabel} className="time-btn font-bold" style={{
                  padding:'8px 18px', borderRadius:'999px', fontSize:'12px',
                  border:'none', cursor:'pointer',
                  background: i===1 ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: '#064e3b',
                  boxShadow: i===1 ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition:'all 0.2s ease',
                }}>{language === 'English' ? timeLabel : (timeLabel === 'Weekly' ? 'வாரம்' : (timeLabel === 'Monthly' ? 'மாதம்' : 'ஆண்டு'))}</button>
              ))}
            </div>
          </div>

          {/* Stat mini strip */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-5 gap-3"
            style={{
              borderTop:'1px solid rgba(16, 185, 129, 0.15)', borderBottom:'1px solid rgba(16, 185, 129, 0.15)',
              padding:'16px 0', marginBottom:'32px',
            }}
          >
            <div>
              <div style={{ fontSize:'10px', fontWeight:700, color:'#047857', textTransform:'uppercase', letterSpacing:'0.08em' }}>{language === 'English' ? 'Feedback Total' : 'மொத்த கருத்துக்கள்'}</div>
              <div style={{ fontSize:'26px', fontWeight:950, color:'#064e3b', marginTop:'4px' }}>{totalAnim}</div>
            </div>
            {[
              { id:'solvedStat', val:solved,   color:'#16a34a', label: language === 'English' ? 'Solved' : 'தீர்க்கப்பட்டது' },
              { id:'pendStat',   val:pending,  color:'#EF4444', label: language === 'English' ? 'Pending' : 'நிலுவையில்' },
              { id:'solvStat',   val:solving,  color:'#D97706', label: language === 'English' ? 'Solving' : 'செயல்முறை' },
              { id:'usersStat',  val:totalRaw, color:'#047857', label: language === 'English' ? 'Users Send' : 'அனுப்பியவர்கள்' },
            ].map(({ id, val, color, label }) => (
              <div key={id} style={{ textAlign:'center', padding:'10px', background:'rgba(255, 255, 255, 0.8)', borderRadius:'14px', border:'1px solid rgba(16, 185, 129, 0.15)' }}>
                <div style={{ fontSize:'20px', fontWeight:850, color }}>{val}</div>
                <div style={{ fontSize:'11px', color:'#047857', marginTop:'2px', fontWeight:600 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* flex row wrapping [TN map | bars] */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* TN MAP PANEL */}
            <div style={{
              width:'200px', flexShrink:0,
              background:'rgba(255, 255, 255, 0.75)', backdropFilter:'blur(24px)',
              border:'1px solid rgba(16, 185, 129, 0.2)', borderRadius:'20px',
              padding:'14px 10px 36px', position:'relative',
              boxShadow:'0 8px 32px rgba(16, 185, 129, 0.03)',
              alignSelf: 'center',
            }}>
              <div style={{ textAlign:'center', marginBottom:'6px' }}>
                <div style={{ fontSize:'9px', fontWeight:900, color:'#064e3b', textTransform:'uppercase', letterSpacing:'0.14em', fontFamily:'Manrope,sans-serif' }}>
                  {language === 'English' ? 'Live Feedback Map' : 'நேரடி கருத்து வரைபடம்'}
                </div>
                <div style={{ fontSize:'8px', color:'#047857', fontWeight:700, marginTop:'2px', fontFamily:'Manrope,sans-serif' }}>
                  {language === 'English' ? 'Top 5 districts · hover to see' : 'முதல் 5 மாவட்டங்கள் · பார்க்க நகர்த்தவும்'}
                </div>
              </div>
              <div style={{ width:'100%', height:'330px', position:'relative' }}>
                <TNDistrictMap allCounts={districtCounts} />
              </div>
              <div style={{ position:'absolute', bottom:'10px', left:0, right:0, display:'flex', justifyContent:'center', alignItems:'center', gap:'5px' }}>
                <span style={{
                  width:6, height:6, borderRadius:'50%', background:'#22c55e',
                  display:'inline-block', boxShadow: '0 0 6px #22c55e',
                }}/>
                <span style={{ fontSize:'8px', fontWeight:750, color:'#047857', fontFamily:'Manrope,sans-serif', letterSpacing:'0.06em' }}>
                  High feedback zone
                </span>
              </div>
            </div>

            {/* BARS */}
            <div className="flex-1 w-full flex flex-col overflow-x-auto">
              <div ref={barRef} style={{
                display:'flex', alignItems:'flex-end',
                gap:'20px', padding:'0 8px',
                height: BAR_H + 50 + 'px',
                minWidth: '320px',
              }}>
                {DEPTS.map(({ key, label }) => {
                  const d = deptData[key] || { pos:0, neu:0, neg:0, posPx:0, neuPx:0, negPx:0 };
                  return (
                    <BarColumn key={key} label={label}
                      negPx={d.negPx} neuPx={d.neuPx} posPx={d.posPx}
                      negV={d.neg}    neuV={d.neu}    posV={d.pos}
                      visible={barVisible} />
                  );
                })}
              </div>

              {/* Bar legend */}
              <div style={{ display:'flex', gap:'24px', justifyContent:'center', marginTop:'20px', flexWrap: 'wrap' }}>
                {[['#10B981','Positive'],['#FBBF24','Neutral'],['#EF4444','Negative']].map(([c,l]) => (
                  <span key={l} style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'12px', fontWeight:850, color:'#047857' }}>
                    <span style={{ width:10, height:10, borderRadius:'50%', background:c, display:'inline-block' }}></span>{l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM 4 STAT CARDS */}
        <div className="fade-in-up-4 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom:'32px' }}>
          {[
            { label:'SOLVED',      val:solved,   color:'#10B981' },
            { label:'PENDING',     val:pending,  color:'#EF4444' },
            { label:'IN PROGRESS', val:solving,  color:'#FBBF24' },
            { label:'TOTAL VOLUME',val:totalRaw, color:'#10b981' },
          ].map(({ label, val, color }) => (
            <div key={label} className="stat-card-dash" style={{ textAlign:'center' }}>
              <div style={{ fontSize:'10px', fontWeight:900, color:'#a7f3d0', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>{label}</div>
              <div style={{ fontSize:'36px', fontWeight:900, color }}>{val}</div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
