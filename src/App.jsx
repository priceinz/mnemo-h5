import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F0E2CB",
  warm: "#EDE5D8",
  brown: "#736356",
  lbrown: "#BFB1A8",
  dark: "#261201",
  olive: "#8B8C6A",
  teal: "#2B6E6E",
  orange: "#D4722A",
  gold: "#C8A060",
  wood: "#8B6B4A",
  woodDk: "#5C4433",
  cream: "#F5EDE0",
  metal: "#B8B4AC",
  metalLt: "#C8C4BC",
  metalDk: "#9A968E",
};

/* ================================================================
   SPEAKER GRILLE
   ================================================================ */
const Grille = ({ size = 260, on = false }) => {
  const holes = [];
  const mid = size / 2;
  const R = size / 2 - 8;
  const hr = 4.2;
  const ringSp = 21;
  const addHole = (px, py, del) => {
    if (on) {
      holes.push(<circle key={`${px.toFixed(1)}_${py.toFixed(1)}`} cx={px} cy={py} r={hr * 0.75} fill="#5A5550" opacity=".5" style={{ animation: `gp 1.4s ease-in-out ${del}s infinite alternate` }} />);
    } else {
      holes.push(<g key={`${px.toFixed(1)}_${py.toFixed(1)}`}><circle cx={px + 0.8} cy={py + 1} r={hr + 0.3} fill="rgba(0,0,0,0.08)" /><circle cx={px} cy={py} r={hr} fill="#444" /></g>);
    }
  };
  addHole(mid, mid, 0);
  for (let ring = 1; ring * ringSp <= R; ring++) {
    const ringR = ring * ringSp;
    const count = Math.round((2 * Math.PI * ringR) / (ringSp * 0.95));
    const step = (2 * Math.PI) / count;
    const off = ring % 2 === 0 ? step / 2 : 0;
    for (let i = 0; i < count; i++) {
      const a = i * step + off;
      addHole(mid + ringR * Math.cos(a), mid + ringR * Math.sin(a), (ringR / R) * 0.7);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <style>{`@keyframes gp{0%{r:${hr * 0.75};opacity:.5}100%{r:${hr};opacity:.2}}`}</style>
      {holes}
    </svg>
  );
};

/* ================================================================
   RED BUTTON — TEAC A-3340
   ================================================================ */
const RedButton = ({ active, onClick }) => {
  const s = 88, cx = s / 2, cy = s / 2, knurls = 36;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ cursor: "pointer", display: "block", transition: "transform 0.1s", transform: active ? "scale(0.95)" : "scale(1)" }} onClick={onClick}>
      <defs>
        <radialGradient id="b_shadow" cx="50%" cy="52%" r="50%"><stop offset="65%" stopColor="rgba(50,40,30,0.3)" /><stop offset="100%" stopColor="rgba(50,40,30,0)" /></radialGradient>
        <linearGradient id="b_ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C0BBB2" /><stop offset="40%" stopColor="#AAA59C" /><stop offset="100%" stopColor="#8A8580" /></linearGradient>
        <radialGradient id="b_body" cx="42%" cy="38%" r="60%"><stop offset="0%" stopColor="#CC3030" /><stop offset="40%" stopColor="#B82525" /><stop offset="75%" stopColor="#9A1C1C" /><stop offset="100%" stopColor="#781616" /></radialGradient>
        <radialGradient id="b_press" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8A1818" /><stop offset="100%" stopColor="#581010" /></radialGradient>
        <radialGradient id="b_concave" cx="55%" cy="58%" r="55%"><stop offset="0%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.15)" /></radialGradient>
      </defs>
      <circle cx={cx} cy={cy + 3} r={40} fill="url(#b_shadow)" />
      <circle cx={cx} cy={cy} r={37} fill="url(#b_ring)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      {Array.from({ length: knurls }).map((_, i) => { const a = (i / knurls) * Math.PI * 2; return <line key={i} x1={cx + 33 * Math.cos(a)} y1={cy + 33 * Math.sin(a)} x2={cx + 37 * Math.cos(a)} y2={cy + 37 * Math.sin(a)} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />; })}
      <path d={`M ${cx - 32} ${cy - 18} A 37 37 0 0 1 ${cx + 32} ${cy - 18}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={30} fill="#333028" />
      <circle cx={cx} cy={cy} r={30} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" />
      <circle cx={cx} cy={cy - (active ? 0 : 0.8)} r={27} fill={active ? "url(#b_press)" : "url(#b_body)"} />
      {!active && <circle cx={cx} cy={cy - 0.8} r={27} fill="url(#b_concave)" />}
      <circle cx={cx} cy={cy - (active ? 0 : 0.8)} r={27} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
      <line x1={cx - 8} y1={cy - (active ? 0 : 0.8)} x2={cx + 8} y2={cy - (active ? 0 : 0.8)} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx} y1={cy - 8 - (active ? 0 : 0.8)} x2={cx} y2={cy + 8 - (active ? 0 : 0.8)} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
      {!active && <path d={`M ${cx - 16} ${cy - 18} A 20 18 0 0 1 ${cx + 10} ${cy - 20}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />}
      {!active && <circle cx={cx - 7} cy={cy - 13} r={3} fill="rgba(255,255,255,0.15)" />}
      {active && <rect x={cx - 5} y={cy - 5} width={10} height={10} rx={1.5} fill="rgba(255,255,255,0.8)" />}
    </svg>
  );
};

/* ================================================================
   TP-22 BOTTOM BAR — 4 tabs
   ================================================================ */
const TP22Bar = ({ activeTab, onTab, onHelp }) => {
  const tabs = [
    { key: "diary", label: "日记" },
    { key: "todo", label: "待办" },
    { key: "idea", label: "灵感" },
    { key: "meeting", label: "会议" },
  ];
  return (
    <div style={{ height: 72, flexShrink: 0, background: `linear-gradient(180deg, ${C.metalLt}, ${C.metal}, ${C.metalDk})`, borderTop: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}>
      {tabs.map(t => {
        const isOn = activeTab === t.key;
        return (
          <button key={t.key} onClick={() => onTab(t.key)} style={{ width: 72, height: 42, borderRadius: 3, border: "none", cursor: "pointer", outline: "none", background: isOn ? "linear-gradient(180deg, #A09C94, #AAA69E, #B4B0A8)" : "linear-gradient(180deg, #C4C0B8, #BAB6AE, #B0ACA4)", boxShadow: isOn ? "inset 0 2px 5px rgba(0,0,0,0.25)" : "0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)", transform: isOn ? "translateY(1px)" : "translateY(0)", transition: "all 0.1s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: isOn ? "#2A2420" : "#4A4640", letterSpacing: "0.05em" }}>{t.label}</span>
          </button>
        );
      })}
      <button onClick={onHelp} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>
        <span style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 700, color: "#6A6460" }}>?</span>
      </button>
    </div>
  );
};

/* ================================================================
   REALISTIC CASSETTE TAPE — translucent case, visible reels, label
   ================================================================ */
const CassetteTape = ({ month, yearLabel, color, onClick, coverImg, onDoubleClick, labelPos, labelShape, labelFont }) => {
  const isBook = !!coverImg;
  const cases = {
    clear: { body: "linear-gradient(175deg, rgba(235,230,220,0.9), rgba(210,205,195,0.9))", shadow: "rgba(0,0,0,0.06)", reel: "rgba(0,0,0,0.08)", window: "rgba(0,0,0,0.04)", labelBg: "#FFFBF2", edge: "rgba(255,255,255,0.5)" },
    smoke: { body: "linear-gradient(175deg, rgba(120,115,108,0.88), rgba(85,82,76,0.9))", shadow: "rgba(0,0,0,0.12)", reel: "rgba(255,255,255,0.06)", window: "rgba(0,0,0,0.1)", labelBg: "#F0ECE4", edge: "rgba(255,255,255,0.12)" },
    amber: { body: "linear-gradient(175deg, rgba(180,155,110,0.88), rgba(145,120,80,0.9))", shadow: "rgba(0,0,0,0.1)", reel: "rgba(0,0,0,0.06)", window: "rgba(0,0,0,0.06)", labelBg: "#FFF8E8", edge: "rgba(255,255,255,0.2)" },
    olive: { body: "linear-gradient(175deg, rgba(135,140,105,0.88), rgba(100,105,75,0.9))", shadow: "rgba(0,0,0,0.08)", reel: "rgba(0,0,0,0.06)", window: "rgba(0,0,0,0.05)", labelBg: "#F5F2E8", edge: "rgba(255,255,255,0.15)" },
    dark: { body: "linear-gradient(175deg, rgba(68,62,55,0.92), rgba(45,40,36,0.92))", shadow: "rgba(0,0,0,0.15)", reel: "rgba(255,255,255,0.05)", window: "rgba(0,0,0,0.12)", labelBg: "#EDE8E0", edge: "rgba(255,255,255,0.08)" },
  };
  const tc = cases[color] || cases.clear;
  const rb = tc.reel === "rgba(255,255,255,0.06)" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const lastTap = useRef(0);
  const handleClick = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 350) { e.stopPropagation(); onDoubleClick?.(); lastTap.current = 0; }
    else { lastTap.current = now; setTimeout(() => { if (lastTap.current !== 0) { onClick?.(); lastTap.current = 0; } }, 360); }
  };

  // === BOOK MODE — clean cover + spine + pages + month label ===
  if (isBook) return (
    <button onClick={handleClick} style={{ width: 72, height: 110, padding: 0, border: "none", cursor: "pointer", flexShrink: 0, position: "relative", borderRadius: "2px 5px 5px 2px", overflow: "hidden", boxShadow: "3px 3px 12px rgba(0,0,0,0.22)", transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s", background: "#ddd" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-16px) rotate(-1.5deg)"; e.currentTarget.style.boxShadow = "5px 10px 25px rgba(0,0,0,0.28)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) rotate(0deg)"; e.currentTarget.style.boxShadow = "3px 3px 12px rgba(0,0,0,0.22)"; }}>
      <img src={coverImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* Book spine */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0.08), rgba(255,255,255,0.08))", zIndex: 2 }} />
      {/* Page edges */}
      <div style={{ position: "absolute", right: 0, top: 3, bottom: 3, width: 3, background: "repeating-linear-gradient(180deg, #f5f0e8 0px, #f5f0e8 1px, #e8e2d8 1px, #e8e2d8 2px)", borderRadius: "0 2px 2px 0", zIndex: 2 }} />
      {/* Bottom shadow */}
      <div style={{ position: "absolute", bottom: 0, left: 6, right: 3, height: 2, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.12))", zIndex: 2 }} />
      {/* Gloss */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.04) 100%)", zIndex: 3, pointerEvents: "none" }} />
      {/* Month label — fixed bottom center, matching tape style */}
      <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, zIndex: 4, textAlign: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 11, color: "rgba(255,255,255,0.9)", textShadow: "0 1px 3px rgba(0,0,0,0.6)", lineHeight: 1 }}>{month}</span>
        <br/>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 20, fontWeight: 600, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.7)", lineHeight: 1 }}>{yearLabel}</span>
      </div>
    </button>
  );

  // === TAPE MODE — default cassette ===
  return (
    <button onClick={handleClick} style={{ width: 72, height: 110, borderRadius: 3, padding: 0, background: tc.body, border: "none", cursor: "pointer", flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: `2px 3px 10px ${tc.shadow}, inset 0 1px 0 ${tc.edge}`, transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-16px) rotate(-1.5deg)"; e.currentTarget.style.boxShadow = "4px 8px 20px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) rotate(0deg)"; e.currentTarget.style.boxShadow = `2px 3px 10px ${tc.shadow}, inset 0 1px 0 ${tc.edge}`; }}>
      <div style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1.5, background: tc.edge, borderRadius: 1 }} />
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, height: 24, borderRadius: 3, background: tc.window, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, border: "0.5px solid rgba(0,0,0,0.06)" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${rb}`, position: "relative" }}><div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: tc.reel }} /></div>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${rb}`, position: "relative" }}><div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: tc.reel }} /></div>
        <div style={{ position: "absolute", top: "50%", left: 16, right: 16, height: 1, background: tc.reel }} />
      </div>
      <div style={{ position: "absolute", top: 38, left: 8, right: 8, bottom: 14, background: tc.labelBg, borderRadius: 2, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 10, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", top: 20, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", top: 30, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 11, color: C.brown, lineHeight: 1, marginBottom: 2 }}>{month}</span>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 20, fontWeight: 600, color: C.dark, lineHeight: 1 }}>{yearLabel}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.06))", borderRadius: "0 0 3px 3px" }} />
      <div style={{ position: "absolute", top: 5, left: 5, width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.06)" }} />
      <div style={{ position: "absolute", top: 5, right: 5, width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.06)" }} />
    </button>
  );
};
const ShelfRow = ({ year, tapes, onTap, tapCovers, onDoubleTap }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown, letterSpacing: "0.2em", marginBottom: 4, paddingLeft: 8 }}>— {year} —</div>
    <div style={{ display: "flex", gap: 6, padding: "8px 8px 0", alignItems: "flex-end", overflowX: "auto" }}>{tapes.map((t, i) => {
      const key = `${year}-${t.month}`;
      const cover = tapCovers?.[key];
      return <CassetteTape key={i} month={t.month} yearLabel={t.label} color={t.color}
        coverImg={cover?.img || cover?.drawing}
        labelPos={cover?.labelPos} labelShape={cover?.labelShape} labelFont={cover?.labelFont}
        onClick={() => onTap(t)}
        onDoubleClick={() => onDoubleTap?.({ year, month: t.month, label: t.label, color: t.color, key })}
      />;
    })}</div>
    <div style={{ position: "relative" }}>
      <div style={{ height: 10, borderRadius: "0 0 4px 4px", background: `linear-gradient(180deg, #A07850, ${C.wood}, ${C.woodDk})`, boxShadow: "0 4px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: 14, top: 10, width: 4, height: 12, background: "linear-gradient(180deg, #C0B8A8, #A09888)", borderRadius: "0 0 2px 2px", boxShadow: "1px 1px 2px rgba(0,0,0,0.12)" }} />
      <div style={{ position: "absolute", right: 14, top: 10, width: 4, height: 12, background: "linear-gradient(180deg, #C0B8A8, #A09888)", borderRadius: "0 0 2px 2px", boxShadow: "1px 1px 2px rgba(0,0,0,0.12)" }} />
    </div>
  </div>
);

/* ================================================================
   TAPE COVER MODAL — template switcher + stickers + hand draw
   ================================================================ */

/* ================================================================
   7 COVER TEMPLATES — CSS-drawn, rendered to canvas
   ================================================================ */
const COVER_TEMPLATES = [
  { id: "tape", name: "磁带", desc: "默认" },
  { id: "pink_note", name: "粉色便签" },
  { id: "dark_edit", name: "暗色编辑" },
  { id: "collage", name: "复古拼贴" },
  { id: "bauhaus", name: "包豪斯" },
  { id: "matchbox", name: "火柴盒" },
  { id: "dark_amber", name: "暗夜琥珀" },
  { id: "magazine", name: "杂志云图" },
];

const LABEL_SHAPES = [
  { id: "default", name: "默认" },
  { id: "pill", name: "胶囊" },
  { id: "circle", name: "圆形" },
  { id: "banner", name: "横幅" },
  { id: "tag", name: "标签" },
];

// Generate template cover image on canvas
const renderTemplate = (templateId, month, year, w = 300, h = 400) => {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (templateId === 'pink_note') {
    ctx.fillStyle = '#D4727A'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
    ctx.font = 'bold 18px Courier New'; ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.textAlign = 'center';
    ctx.fillText('MNEMO', w/2, 30);
    ctx.beginPath(); ctx.moveTo(20, 38); ctx.lineTo(w-20, 38); ctx.stroke();
    ctx.font = '10px Courier New'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillText('to:', 22, 55); ctx.fillText('date:', w-65, 55);
    ctx.beginPath(); ctx.moveTo(20, 62); ctx.lineTo(w-20, 62); ctx.stroke();
    ctx.fillText('note:', 22, 78);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 0.5;
    for (let y = 90; y < h - 20; y += 22) { ctx.beginPath(); ctx.moveTo(22, y); ctx.lineTo(w-22, y); ctx.stroke(); }
  } else if (templateId === 'dark_edit') {
    ctx.fillStyle = '#3A3D45'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(200,180,140,0.15)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(20, 25); ctx.lineTo(w-20, 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, h-25); ctx.lineTo(w-20, h-25); ctx.stroke();
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(16, 15); ctx.lineTo(16, h-15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w-16, 15); ctx.lineTo(w-16, h-15); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(210,195,160,0.4)'; ctx.font = '12px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('VOL.' + (parseInt(month) || 1), w/2, h - 40);
    ctx.strokeStyle = 'rgba(210,195,160,0.2)'; ctx.beginPath(); ctx.moveTo(w/2-30, h/2+30); ctx.lineTo(w/2+30, h/2+30); ctx.stroke();
  } else if (templateId === 'collage') {
    ctx.fillStyle = '#E8DCC8'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#F5EEE0'; ctx.fillRect(20, 10, w-40, 30);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 0.5; ctx.strokeRect(20, 10, w-40, 30);
    ctx.save(); ctx.translate(50, 70); ctx.rotate(-0.04);
    ctx.fillStyle = '#D4C8B0'; ctx.fillRect(0, 0, 90, 120); ctx.restore();
    ctx.save(); ctx.translate(80, 90); ctx.rotate(0.03);
    ctx.fillStyle = '#C8B898'; ctx.fillRect(0, 0, 120, 100); ctx.restore();
    ctx.save(); ctx.translate(180, 110);
    ctx.fillStyle = '#BEB0A0'; ctx.fillRect(0, 0, 80, 70); ctx.restore();
    ctx.fillStyle = '#F0E8D8';
    ctx.beginPath(); ctx.moveTo(40, 220); ctx.lineTo(60, 240); ctx.lineTo(100, 220); ctx.lineTo(140, 245); ctx.lineTo(180, 220); ctx.lineTo(220, 240); ctx.lineTo(260, 220); ctx.lineTo(260, 250); ctx.lineTo(40, 250); ctx.fill();
  } else if (templateId === 'bauhaus') {
    ctx.fillStyle = '#F0EBE0'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth = 0.5;
    for (let x = 20; x < w; x += 18) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 140); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(w, 140); ctx.stroke();
    ctx.fillStyle = '#D85A30'; ctx.fillRect(20, 155, 110, 95);
    ctx.fillStyle = '#4A9BAA'; ctx.fillRect(140, 155, 140, 95);
    ctx.fillStyle = '#2A7A5A'; ctx.fillRect(20, 260, 150, 70);
    ctx.fillStyle = '#C84A6A'; ctx.fillRect(220, 260, 60, 70);
    ctx.fillStyle = '#E8C840'; ctx.fillRect(180, 260, 35, 70);
  } else if (templateId === 'matchbox') {
    ctx.fillStyle = '#4A8A50'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 0.5;
    for (let y = 0; y < h; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('MNEMO', w/2, 30);
    ctx.fillStyle = '#F0EBE0';
    ctx.beginPath(); ctx.ellipse(w/2, h/2-20, 60, 50, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#4A8A50';
    ctx.beginPath(); ctx.ellipse(w/2-15, h/2-25, 18, 14, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w/2+20, h/2-10, 14, 10, -0.2, 0, Math.PI*2); ctx.fill();
  } else if (templateId === 'dark_amber') {
    ctx.fillStyle = '#2A1510'; ctx.fillRect(0, 0, w, h);
    const grad = ctx.createRadialGradient(w/2, h*0.55, 10, w/2, h*0.55, w*0.6);
    grad.addColorStop(0, 'rgba(180,100,40,0.2)'); grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(200,170,120,0.3)'; ctx.fillRect(w/2-15, 0, 30, 5);
    ctx.fillStyle = 'rgba(200,170,120,0.5)'; ctx.font = 'bold 14px Georgia'; ctx.textAlign = 'center';
    ctx.fillText('MNEMO', w/2, 28);
    ctx.fillStyle = 'rgba(200,170,120,0.3)'; ctx.font = 'italic 11px Georgia';
    ctx.fillText('voice diary', w/2, h - 16);
  } else if (templateId === 'magazine') {
    ctx.fillStyle = '#E8E4DE'; ctx.fillRect(0, 0, w, h);
    const skyGrad = ctx.createLinearGradient(0, 60, 0, h-40);
    skyGrad.addColorStop(0, '#8AACBE'); skyGrad.addColorStop(1, '#A0C0D0');
    ctx.fillStyle = skyGrad; ctx.fillRect(20, 60, w-30, h-100);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(w*0.6, h-100, 80, 40, 0, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w*0.35, h-110, 60, 30, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(w*0.75, h-120, 50, 25, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#261201'; ctx.font = 'bold 9px Courier New'; ctx.textAlign = 'left';
    ctx.fillText('MNEMO', 22, h - 10);
    ctx.save(); ctx.translate(10, h/2); ctx.rotate(-Math.PI/2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.font = '9px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('VOICE DIARY', 0, 0); ctx.restore();
  }
  return canvas.toDataURL('image/png');
};

// Render month label shape
const LABEL_FONTS = [
  { id: "caveat", name: "手写", family: "'Caveat',cursive" },
  { id: "georgia", name: "衬线", family: "Georgia,'Songti SC',serif" },
  { id: "mono", name: "等宽", family: "'Courier New',monospace" },
  { id: "playfair", name: "标题", family: "'Playfair Display',serif" },
  { id: "sans", name: "无衬线", family: "system-ui,sans-serif" },
];

const MonthLabel = ({ month, year, shape, font, style: outerStyle, dark }) => {
  const textC = dark ? "rgba(255,255,255,0.85)" : C.dark;
  const subC = dark ? "rgba(255,255,255,0.4)" : C.brown;
  const ff = font || "'Caveat',cursive";
  const base = { fontFamily: ff, textAlign: "center", pointerEvents: "none", ...outerStyle };

  if (shape === "pill") return (
    <div style={{ ...base, background: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)", padding: "4px 14px", borderRadius: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: textC }}>{month}</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: subC }}>{year}</div>
    </div>
  );
  if (shape === "circle") return (
    <div style={{ ...base, width: 44, height: 44, borderRadius: "50%", background: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: textC, lineHeight: 1 }}>{month}</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 7, color: subC }}>{year}</div>
    </div>
  );
  if (shape === "banner") return (
    <div style={{ ...base, background: dark ? "rgba(200,160,96,0.6)" : C.gold, padding: "3px 18px", position: "relative" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#fff" : "#fff" }}>{month}</div>
      <div style={{ position: "absolute", left: -6, top: 0, bottom: 0, width: 6, background: dark ? "rgba(160,120,60,0.6)" : "#A08050", clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }} />
      <div style={{ position: "absolute", right: -6, top: 0, bottom: 0, width: 6, background: dark ? "rgba(160,120,60,0.6)" : "#A08050", clipPath: "polygon(0 0, 0 100%, 100% 50%)" }} />
    </div>
  );
  if (shape === "tag") return (
    <div style={{ ...base, background: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)", padding: "4px 12px 4px 16px", borderRadius: "0 4px 4px 0", borderLeft: `3px solid ${C.gold}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: textC }}>{month}</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 7, color: subC }}>{year}</div>
    </div>
  );
  // default
  return (
    <div style={{ ...base }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: textC, textShadow: dark ? "0 1px 4px rgba(0,0,0,0.5)" : "none" }}>{month}</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: subC }}>{year}</div>
    </div>
  );
};

const STICKERS = [
  "📔","📕","📗","📘","📙","📓","📖","🎵","🎶","☕","🌸","🌿","🍂","❄️","🌙","⭐","🔥","💡","🎨","🖋️",
  "✈️","🏠","🎂","🎁","💌","📷","🎧","🌈","🦋","🐾","🍀","🌻","🍁","💎","⏰","🗺️","🎯","🏆","🧸","💫"
];

const TapeCoverModal = ({ tapeInfo, coverImg, drawingImg, onClose, onSetCover, onSaveDrawing, labelPos, labelShape, labelFont, onUpdateLabel }) => {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [tab, setTab] = useState("template");
  const [drawMode, setDrawMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#261201");
  const [brushSize, setBrushSize] = useState(3);
  const [stickerMode, setStickerMode] = useState(false);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [selTemplate, setSelTemplate] = useState(null);
  const [lPos, setLPos] = useState(labelPos || { x: 50, y: 85 });
  const [lShape, setLShape] = useState(labelShape || "default");
  const [lFont, setLFont] = useState(labelFont || "'Caveat',cursive");
  const [dragging, setDragging] = useState(false);
  const isDown = useRef(false);
  const lastPos = useRef(null);
  const fileRef = useRef(null);

  const isDark = selTemplate && ["dark_edit", "dark_amber", "matchbox"].includes(selTemplate);
  const brushColors = ["#261201","#736356","#C8A060","#D4722A","#2B6E6E","#8B8C6A","#9A1C1C","#1a1a6e","#fff"];

  useEffect(() => {
    if (tab !== "draw" || !drawMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 300; canvas.height = 400;
    ctx.clearRect(0, 0, 300, 400);
    if (drawingImg) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, 300, 400); img.src = drawingImg; }
  }, [drawMode, drawingImg, tab]);

  const getPos = (e) => {
    const r = (canvasRef.current || previewRef.current).getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    return { x: ((touch.clientX - r.left) / r.width) * 100, y: ((touch.clientY - r.top) / r.height) * 100 };
  };
  const getCanvasPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    return { x: (touch.clientX - r.left) * (300 / r.width), y: (touch.clientY - r.top) * (400 / r.height) };
  };

  const startDraw = (e) => { if (stickerMode) return; e.preventDefault(); isDown.current = true; lastPos.current = getCanvasPos(e); };
  const moveDraw = (e) => {
    if (stickerMode || !isDown.current) return; e.preventDefault();
    const ctx = canvasRef.current.getContext('2d'); const pos = getCanvasPos(e);
    ctx.strokeStyle = brushColor; ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    lastPos.current = pos;
  };
  const endDraw = () => { isDown.current = false; };
  const clearCanvas = () => { canvasRef.current?.getContext('2d')?.clearRect(0, 0, 300, 400); setPlacedStickers([]); };
  const handleCanvasTap = (e) => { if (!stickerMode) return; const p = getCanvasPos(e); setPlacedStickers(prev => [...prev, { emoji: brushColor, x: p.x, y: p.y }]); };
  const saveCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    placedStickers.forEach(s => { ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.fillText(s.emoji, s.x, s.y + 10); });
    onSaveDrawing(canvasRef.current.toDataURL('image/png')); setDrawMode(false); setPlacedStickers([]);
  };
  const handleFile = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onSetCover(r.result); r.readAsDataURL(f); };

  // Drag label position on preview
  const onPreviewTap = (e) => {
    if (tab === "draw" && drawMode) return;
    const r = previewRef.current?.getBoundingClientRect();
    if (!r) return;
    const touch = e.touches?.[0] || e;
    const x = Math.max(10, Math.min(90, ((touch.clientX - r.left) / r.width) * 100));
    const y = Math.max(8, Math.min(95, ((touch.clientY - r.top) / r.height) * 100));
    setLPos({ x, y });
    onUpdateLabel?.({ x, y }, lShape, lFont);
  };

  const applyTemplate = (tid) => {
    setSelTemplate(tid);
    if (tid === "tape") { onSetCover(null); onSaveDrawing(null); onUpdateLabel?.({ x: 50, y: 85 }, "default", "'Caveat',cursive"); return; }
    const img = renderTemplate(tid, tapeInfo.month, tapeInfo.year);
    onSetCover(img);
    onUpdateLabel?.(lPos, lShape, lFont);
  };

  const updateShape = (s) => {
    setLShape(s);
    onUpdateLabel?.(lPos, s, lFont);
  };
  const updateFont = (f) => {
    setLFont(f);
    onUpdateLabel?.(lPos, lShape, f);
  };

  if (!tapeInfo) return null;
  const tabs = [{ k: "template", l: "模板" }, { k: "photo", l: "相册" }, { k: "draw", l: "手绘" }];
  const previewImg = coverImg || (selTemplate && selTemplate !== "tape" ? renderTemplate(selTemplate, tapeInfo.month, tapeInfo.year) : null);
  const showLabel = tab !== "draw" || !drawMode;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: 320, background: C.warm, borderRadius: 16, padding: 16, position: "relative", maxHeight: "92vh", overflow: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.dark }}>{tapeInfo.month} 封面</div>
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: 3, marginBottom: 12 }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => { setTab(t.k); setDrawMode(false); setStickerMode(false); }}
              style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer",
                background: tab === t.k ? "#fff" : "transparent", boxShadow: tab === t.k ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600,
                color: tab === t.k ? C.dark : C.lbrown, transition: "all 0.2s" }}>{t.l}</button>
          ))}
        </div>

        {/* ===== PREVIEW (shared across template + photo tabs) ===== */}
        {(tab === "template" || tab === "photo") && (
          <div ref={previewRef} onClick={onPreviewTap} onTouchEnd={onPreviewTap}
            style={{ width: 160, height: 210, margin: "0 auto 10px", borderRadius: "2px 6px 6px 2px", overflow: "hidden", position: "relative",
              background: previewImg ? "#ddd" : C.cream, boxShadow: "4px 4px 16px rgba(0,0,0,0.25)", cursor: "crosshair" }}>
            {previewImg && <img src={previewImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
            {!previewImg && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Caveat',cursive", fontSize: 24, color: C.lbrown }}>{tapeInfo.month}</span>
              </div>
            )}
            {/* Spine + pages */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 7, background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.08), rgba(255,255,255,0.06))", zIndex: 3 }} />
            <div style={{ position: "absolute", right: 0, top: 3, bottom: 3, width: 3, background: "repeating-linear-gradient(180deg, #f5f0e8 0px, #f5f0e8 1px, #e8e2d8 1px, #e8e2d8 2px)", zIndex: 3 }} />
            {/* Draggable month label */}
            {previewImg && showLabel && (
              <div style={{ position: "absolute", left: `${lPos.x}%`, top: `${lPos.y}%`, transform: "translate(-50%, -50%)", zIndex: 4 }}>
                <MonthLabel month={tapeInfo.month} year={tapeInfo.year} shape={lShape} font={lFont} dark={isDark || (tab === "photo")} />
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)", zIndex: 5, pointerEvents: "none" }} />
          </div>
        )}
        {(tab === "template" || tab === "photo") && previewImg && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.lbrown }}>点击预览图可拖动月份位置</span>
          </div>
        )}

        {/* Label shape selector */}
        {(tab === "template" || tab === "photo") && previewImg && (
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
            {LABEL_SHAPES.map(s => (
              <button key={s.id} onClick={() => updateShape(s.id)}
                style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer",
                  background: lShape === s.id ? C.gold : "rgba(0,0,0,0.04)",
                  color: lShape === s.id ? "#fff" : C.brown,
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 600 }}>{s.name}</button>
            ))}
          </div>
        )}
        {/* Label font selector */}
        {(tab === "template" || tab === "photo") && previewImg && (
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
            {LABEL_FONTS.map(f => (
              <button key={f.id} onClick={() => updateFont(f.family)}
                style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer",
                  background: lFont === f.family ? C.teal : "rgba(0,0,0,0.04)",
                  color: lFont === f.family ? "#fff" : C.brown,
                  fontFamily: f.family, fontSize: 10, fontWeight: 600 }}>{f.name}</button>
            ))}
          </div>
        )}

        {/* ===== TAB: TEMPLATE ===== */}
        {tab === "template" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
              {COVER_TEMPLATES.map(t => {
                const thumbSrc = t.id !== "tape" ? renderTemplate(t.id, tapeInfo.month, tapeInfo.year, 90, 120) : null;
                return (
                <button key={t.id} onClick={() => applyTemplate(t.id)}
                  style={{ padding: 0, border: selTemplate === t.id ? `2px solid ${C.gold}` : "2px solid transparent", borderRadius: 4, cursor: "pointer", background: "none", overflow: "hidden" }}>
                  <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 2, overflow: "hidden", position: "relative", background: C.cream }}>
                    {thumbSrc ? (
                      <img src={thumbSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 16 }}>🎵</span>
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.brown, padding: "3px 0", textAlign: "center" }}>{t.name}</div>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== TAB: PHOTO ===== */}
        {tab === "photo" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>选择图片</button>
            {coverImg && <button onClick={() => onSetCover(null)} style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.08)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>移除</button>}
          </div>
        )}

        {/* ===== TAB: DRAW ===== */}
        {tab === "draw" && (
          <div>
            <div style={{ position: "relative", width: "100%", height: 360, borderRadius: 8, overflow: "hidden", background: C.cream, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 10 }}>
              {drawMode ? (<>
                <canvas ref={canvasRef} width={300} height={400}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", cursor: stickerMode ? "copy" : "crosshair" }}
                  onMouseDown={stickerMode ? handleCanvasTap : startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={stickerMode ? handleCanvasTap : startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} />
                {placedStickers.map((s, i) => (
                  <div key={i} style={{ position: "absolute", left: `${(s.x/300)*100}%`, top: `${(s.y/400)*100}%`, fontSize: 24, transform: "translate(-50%, -50%)", pointerEvents: "none" }}>{s.emoji}</div>
                ))}
              </>) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {drawingImg ? <img src={drawingImg} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : (
                    <>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={C.lbrown} strokeWidth="1.5"/></svg>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.lbrown }}>开始创作</span>
                    </>
                  )}
                </div>
              )}
            </div>
            {drawMode ? (<>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button onClick={() => setStickerMode(false)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", cursor: "pointer", background: !stickerMode ? C.teal : "rgba(0,0,0,0.04)", color: !stickerMode ? "#fff" : C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600 }}>画笔</button>
                <button onClick={() => setStickerMode(true)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", cursor: "pointer", background: stickerMode ? C.orange : "rgba(0,0,0,0.04)", color: stickerMode ? "#fff" : C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600 }}>贴纸</button>
              </div>
              {!stickerMode ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                  {brushColors.map(c => <button key={c} onClick={() => setBrushColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", border: brushColor === c ? `2px solid ${C.gold}` : "2px solid transparent", background: c, cursor: "pointer", boxShadow: c === "#fff" ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "none" }} />)}
                  <input type="range" min="1" max="12" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} style={{ width: 50, marginLeft: 4 }} />
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10, maxHeight: 90, overflow: "auto", padding: 4, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                  {STICKERS.map((s, i) => <button key={i} onClick={() => setBrushColor(s)} style={{ width: 30, height: 30, borderRadius: 6, border: brushColor === s ? `2px solid ${C.orange}` : "2px solid transparent", background: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{s}</button>)}
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={saveCanvas} style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>保存</button>
                <button onClick={clearCanvas} style={{ padding: "10px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>清除</button>
                <button onClick={() => { setDrawMode(false); setStickerMode(false); setPlacedStickers([]); }} style={{ padding: "10px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>取消</button>
              </div>
            </>) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDrawMode(true)} style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: C.teal, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>{drawingImg ? "继续创作" : "开始手绘"}</button>
                {drawingImg && <button onClick={() => onSaveDrawing(null)} style={{ padding: "10px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.08)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>移除</button>}
              </div>
            )}
          </div>
        )}

        {/* Reset */}
        {(coverImg || drawingImg) && tab !== "draw" && (
          <button onClick={() => { onSetCover(null); onSaveDrawing(null); onUpdateLabel?.({ x: 50, y: 85 }, "default", "'Caveat',cursive"); }}
            style={{ width: "100%", marginTop: 10, padding: 8, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.04)", color: C.lbrown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>
            恢复为磁带样式
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>
    </div>
  );
};
const BookIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 4h4l4 2 4-2h4v16h-4l-4 2-4-2H4V4z" stroke={c} strokeWidth="1.8" /><line x1="12" y1="6" x2="12" y2="22" stroke={c} strokeWidth="1.5" /></svg>;
const CheckIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="1.8" /><path d="M8 12l3 3 5-5" stroke={c} strokeWidth="2" /></svg>;
const BulbIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 21h6M12 3a6 6 0 00-3.5 10.9V17h7v-3.1A6 6 0 0012 3z" stroke={c} strokeWidth="1.8" /></svg>;
const MeetIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M17 20H7a2 2 0 01-2-2V6a2 2 0 012-2h6l6 6v8a2 2 0 01-2 2z" stroke={c} strokeWidth="1.8" /><path d="M9 13h6M9 17h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>;
const AIIcon = ({ s = 16, c = C.orange }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>;

/* ================================================================
   STICKY NOTE (with selection support)
   ================================================================ */
const PAPER_STYLES = [
  { bg: "#F5F0E4", clip: "polygon(2% 0%,8% 1%,15% 0%,22% 2%,30% 0%,38% 1%,45% 0%,52% 2%,60% 0%,68% 1%,75% 0%,82% 1%,90% 0%,95% 1%,100% 0%,100% 100%,95% 99%,88% 100%,80% 98%,72% 100%,65% 99%,58% 100%,50% 98%,42% 100%,35% 99%,28% 100%,20% 98%,12% 100%,5% 99%,0% 100%,0% 0%)", textC: "#4A3A28", dateC: "#A09080" },
  { bg: "#EDE4DA", clip: "polygon(0% 2%,5% 0%,12% 1%,20% 0%,28% 2%,35% 0%,42% 1%,50% 0%,58% 2%,65% 0%,72% 1%,80% 0%,88% 1%,95% 0%,100% 2%,100% 97%,96% 100%,90% 98%,82% 100%,75% 99%,68% 100%,60% 98%,52% 100%,45% 99%,38% 100%,30% 98%,22% 100%,15% 99%,8% 100%,0% 98%)", textC: "#4A3A28", dateC: "#A09080" },
  { bg: "#E2E4C8", clip: "polygon(3% 0%,10% 2%,18% 0%,25% 1%,33% 0%,40% 2%,48% 0%,55% 1%,63% 0%,70% 2%,78% 0%,85% 1%,92% 0%,100% 1%,100% 100%,97% 98%,90% 100%,83% 99%,76% 100%,68% 98%,60% 100%,53% 99%,46% 100%,38% 98%,30% 100%,23% 99%,15% 100%,8% 98%,0% 100%,0% 1%)", textC: "#3A3A28", dateC: "#6A6A50" },
  { bg: "#D8D4CC", clip: "polygon(0% 1%,6% 0%,13% 2%,20% 0%,27% 1%,34% 0%,41% 2%,48% 0%,55% 1%,62% 0%,69% 2%,76% 0%,83% 1%,90% 0%,97% 1%,100% 0%,100% 100%,94% 99%,87% 100%,80% 98%,73% 100%,66% 99%,59% 100%,52% 98%,45% 100%,38% 99%,31% 100%,24% 98%,17% 100%,10% 99%,3% 100%,0% 99%)", textC: "#3A3628", dateC: "#7A7668" },
  { bg: "#C4B198", clip: "polygon(1% 0%,7% 2%,14% 0%,21% 1%,29% 0%,36% 2%,44% 0%,51% 1%,59% 0%,66% 2%,74% 0%,81% 1%,89% 0%,96% 2%,100% 0%,100% 100%,94% 98%,87% 100%,79% 99%,72% 100%,64% 98%,57% 100%,49% 99%,42% 100%,34% 98%,27% 100%,19% 99%,12% 100%,4% 98%,0% 100%,0% 0%)", textC: "#F5EDE0", dateC: "rgba(255,255,255,0.5)" },
  { bg: "#FAFAF6", clip: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)", textC: "#3A3628", dateC: "#BFB1A8" },
];
const TAPE_CONFIGS = [
  [{ w: 42, top: -4, left: 12, right: "auto", angle: -25, tapeC: "rgba(240,225,180,0.7)" }, { w: 36, top: -2, left: "auto", right: 8, angle: 15, tapeC: "rgba(240,225,180,0.7)" }],
  [{ w: 48, top: -5, left: "50%", right: "auto", angle: 2, tapeC: "rgba(240,225,180,0.75)", center: true }],
  [{ w: 38, top: -3, left: 16, right: "auto", angle: -18, tapeC: "rgba(245,242,235,0.75)" }],
  [{ w: 44, top: -4, left: "50%", right: "auto", angle: -3, tapeC: "rgba(200,198,190,0.7)", center: true }],
  [{ w: 36, top: -3, left: 8, right: "auto", angle: -30, tapeC: "rgba(240,225,180,0.7)" }, { w: 32, top: "auto", bottom: -3, left: "auto", right: 8, angle: 25, tapeC: "rgba(240,225,180,0.7)" }],
  [{ w: 40, top: -4, left: "auto", right: 14, angle: 8, tapeC: "rgba(240,225,180,0.75)" }],
];

const Sticky = ({ text, date, color, rotation, selectable, selected, onSelect, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const save = () => { if (editText.trim() && onEdit) { onEdit(editText.trim()); } setEditing(false); };

  const colorIdx = { "#FFF9C4": 0, "#FFE0B2": 1, "#C8E6C9": 2, "#BBDEFB": 3, "#F8BBD0": 4, "#E1BEE7": 5, "#B2DFDB": 2, "#FFCCBC": 1 };
  const pi = colorIdx[color] ?? Math.abs(text.length % 6);
  const paper = PAPER_STYLES[pi];
  const tapes = TAPE_CONFIGS[pi];
  const rot = selected ? 0 : (rotation || 0) * 0.4;

  return (
    <div onClick={selectable ? onSelect : undefined} style={{
      width: "calc(50% - 8px)", minHeight: 120, padding: "22px 14px 12px",
      background: paper.bg, clipPath: paper.clip,
      boxShadow: selected ? `0 0 0 2px ${C.orange}, 2px 3px 10px rgba(0,0,0,0.15)` : "2px 3px 10px rgba(60,40,20,0.1)",
      transform: `rotate(${rot}deg)${selected ? " scale(1.03)" : ""}`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      transition: "all 0.25s", cursor: selectable ? "pointer" : "default", position: "relative",
    }}
      onMouseEnter={e => { if (!selectable) e.currentTarget.style.transform = "rotate(0deg) scale(1.02)"; }}
      onMouseLeave={e => { if (!selectable && !selected) e.currentTarget.style.transform = `rotate(${rot}deg) scale(1)`; }}>

      {/* Tape strips */}
      {tapes.map((t, i) => (
        <div key={i} style={{
          position: "absolute", height: 14, width: t.w, borderRadius: 1,
          background: `linear-gradient(90deg, ${t.tapeC}, ${t.tapeC.replace('0.7', '0.85').replace('0.75', '0.9')}, ${t.tapeC})`,
          top: t.top !== "auto" ? t.top : undefined, bottom: t.bottom || undefined,
          left: t.center ? "50%" : (t.left !== "auto" ? t.left : undefined),
          right: t.right !== "auto" ? t.right : undefined,
          transform: `${t.center ? "translateX(-50%) " : ""}rotate(${t.angle}deg)`,
          zIndex: 3, opacity: 0.85,
        }} />
      ))}

      {/* AI mode checkbox */}
      {selectable && (
        <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 3, zIndex: 4,
          border: `2px solid ${selected ? C.orange : "rgba(0,0,0,0.12)"}`,
          background: selected ? C.orange : "rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {selected && <svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" fill="none" /></svg>}
        </div>
      )}

      {/* Edit / Delete buttons */}
      {!selectable && (onEdit || onDelete) && (
        <div style={{ position: "absolute", top: 5, right: 5, display: "flex", gap: 2, zIndex: 4 }}>
          {onEdit && <button onClick={e => { e.stopPropagation(); setEditText(text); setEditing(true); }}
            style={{ background: "rgba(255,255,255,0.5)", border: "none", borderRadius: 3, width: 20, height: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="#6A5A48" strokeWidth="2"/></svg>
          </button>}
          {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ background: "rgba(255,255,255,0.5)", border: "none", borderRadius: 3, width: 20, height: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#6A5A48" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>}
        </div>
      )}

      {/* Content */}
      {editing ? (
        <textarea value={editText} onChange={e => setEditText(e.target.value)} onBlur={save} autoFocus
          style={{ fontFamily: "Georgia,'Songti SC',serif", fontSize: 13, fontStyle: "italic", color: paper.textC, lineHeight: 1.55, margin: 0, background: "rgba(255,255,255,0.25)", border: "none", outline: "none", resize: "none", minHeight: 60, borderRadius: 2, padding: 4, position: "relative", zIndex: 2 }} />
      ) : (
        <p style={{ fontFamily: "Georgia,'Songti SC',serif", fontSize: 13, fontStyle: "italic", color: paper.textC, lineHeight: 1.55, margin: 0, position: "relative", zIndex: 1 }}>{text}</p>
      )}
      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: paper.dateC, alignSelf: "flex-end", marginTop: 10, position: "relative", zIndex: 1 }}>{date}</span>
    </div>
  );
};

const TodoRow = ({ text, done, time, date, onToggle, onDelete, onEdit, onCalendar }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const save = () => { if (editText.trim() && onEdit) { onEdit(editText.trim()); } setEditing(false); };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: done ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.5)", borderRadius: 6, marginBottom: 6, border: editing ? `1px solid ${C.gold}` : "1px solid rgba(0,0,0,0.04)" }}>
      <div onClick={onToggle} style={{ width: 22, height: 22, borderRadius: 4, flexShrink: 0, border: `2px solid ${done ? C.olive : C.brown}`, background: done ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        {done && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>}
      </div>
      {editing ? (
        <input value={editText} onChange={e => setEditText(e.target.value)} onBlur={save} onKeyDown={e => { if (e.key === 'Enter') save(); }}
          autoFocus style={{ flex: 1, border: "none", background: "none", outline: "none", fontFamily: "'Lora',serif", fontSize: 15, color: C.dark, padding: 0 }} />
      ) : (
        <div onClick={onToggle} style={{ flex: 1, cursor: "pointer" }}>
          <span style={{ fontFamily: "'Lora',serif", fontSize: 15, color: done ? C.lbrown : C.dark, textDecoration: done ? "line-through" : "none" }}>{text}</span>
          {time && /^\d{1,2}:\d{2}$/.test(time) && <span style={{ marginLeft: 8, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.gold, background: "rgba(200,160,96,0.1)", padding: "1px 6px", borderRadius: 3 }}>⏰ {time}</span>}
        </div>
      )}
      {/* Calendar export — only for items with time, not done */}
      {!done && time && /^\d{1,2}:\d{2}$/.test(time) && onCalendar && (
        <button onClick={e => { e.stopPropagation(); onCalendar(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", opacity: 0.3, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke={C.teal} strokeWidth="1.8"/><path d="M3 9h18M8 2v4M16 2v4" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      )}
      {/* Edit button */}
      {!editing && onEdit && <button onClick={e => { e.stopPropagation(); setEditText(text); setEditing(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", opacity: 0.3, transition: "opacity 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={C.brown} strokeWidth="1.8"/></svg>
      </button>}
      {/* Delete button */}
      {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", opacity: 0.3, transition: "opacity 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
      </button>}
    </div>
  );
};

/* ================================================================
   CALENDAR MONTH VIEW — grid layout, no sidebar
   ================================================================ */
const CalendarMonth = ({ year, month, monthLabel, entries, onBack, onDayClick, onPrev, onNext }) => {
  const yr = parseInt(year);
  const mo = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"].indexOf(month);
  const enNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const weeks = [];
  let cw = [];
  for (let i = 0; i < firstDay; i++) cw.push(null);
  for (let d = 1; d <= daysInMonth; d++) { cw.push(d); if (cw.length === 7) { weeks.push(cw); cw = []; } }
  if (cw.length > 0) { while (cw.length < 7) cw.push(null); weeks.push(cw); }
  const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === yr && today.getMonth() === mo;
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  // Swipe handling
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (diff > 60) onPrev?.(); // swipe right → prev month
    else if (diff < -60) onNext?.(); // swipe left → next month
    touchStart.current = null;
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "0 4px" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Back + Month header with arrows */}
      <div style={{ display: "flex", alignItems: "center", padding: "2px 8px 6px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "4px 0" }}>← 书架</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button onClick={onPrev} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, fontStyle: "italic", color: C.dark }}>{enNames[mo] || month}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, marginLeft: 8 }}>{year}</span>
          </div>
          <button onClick={onNext} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "22px repeat(7, 1fr)", flexShrink: 0, padding: "0 2px 4px" }}>
        <div />
        {weekdays.map(d => <div key={d} style={{ fontFamily: "'Playfair Display',serif", fontSize: 10, fontStyle: "italic", color: C.brown, textAlign: "center" }}>{d}</div>)}
      </div>

      {/* Week rows */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 2px 6px", overflow: "auto" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ flex: 1, minHeight: 82, display: "grid", gridTemplateColumns: "22px repeat(7, 1fr)", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", textOrientation: "mixed" }}>
              <span style={{ fontFamily: "'Caveat',cursive", fontSize: 9, color: C.lbrown, transform: "rotate(180deg)" }}>Week {String(wi + 1).padStart(2, "0")}</span>
            </div>
            {week.map((day, di) => {
              const key = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const entry = day ? entries[key] : null;
              const isToday = day === todayDate;
              return (
                <div key={di} onClick={() => { if (day) onDayClick(day, key); }}
                  style={{
                    borderRadius: 4,
                    background: day ? (entry ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)") : "transparent",
                    border: isToday ? `1.5px solid ${C.gold}` : day ? "1px solid rgba(0,0,0,0.04)" : "none",
                    cursor: day ? "pointer" : "default",
                    padding: "3px 3px", display: "flex", flexDirection: "column",
                    transition: "all 0.15s ease", position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => { if (day) e.currentTarget.style.background = "rgba(255,255,255,0.65)"; }}
                  onMouseLeave={e => { if (day) e.currentTarget.style.background = entry ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)"; }}>
                  {day && (<>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: isToday ? 12 : 10, fontWeight: isToday ? 700 : 400, color: isToday ? C.gold : C.dark, textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.1)", lineHeight: 1 }}>{day}</span>
                    {entry && (
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1, marginTop: 2 }}>
                        {entry.img && <div style={{ fontSize: 15, lineHeight: 1 }}>{entry.img}</div>}
                        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 8, color: C.brown, lineHeight: 1.2, textAlign: "center", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{entry.title}</span>
                      </div>
                    )}
                    {entry && !entry.img && <div style={{ position: "absolute", bottom: 3, right: 3, width: 4, height: 4, borderRadius: "50%", background: C.gold }} />}
                  </>)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   DIARY DETAIL VIEW — view / edit / add images
   ================================================================ */
const DiaryDetail = ({ dayNum, dateKey, monthLabel, entry, onBack, onUpdate, onDelete, imgInputRef, onImageUpload }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.text || "");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const entryTitle = entry?.title || "";
  const entryText = entry?.text || "";
  if (!editingTitle && title !== entryTitle) setTitle(entryTitle);
  if (!editingText && text !== entryText) setText(entryText);

  const saveTitle = () => { onUpdate({ ...entry, title }); setEditingTitle(false); };
  const saveText = () => { onUpdate({ ...entry, text }); setEditingText(false); };

  const togglePlay = () => {
    if (!entry?.audio) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(entry.audio);
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "8px 0", textAlign: "left" }}>← 返回月历</button>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{dayNum}</span>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 16, color: C.brown }}>{monthLabel}</span>
      </div>
      {/* Audio playback bar */}
      {entry?.audio && (
        <button onClick={togglePlay} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 10, borderRadius: 6, border: "none", cursor: "pointer", background: playing ? "rgba(200,160,96,0.15)" : "rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: playing ? C.gold : C.brown, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, color: playing ? C.gold : C.brown }}>{playing ? "播放中..." : "回听录音"}</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.lbrown }}>语音原声</div>
          </div>
        </button>
      )}
      {entry ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Title — click to edit */}
          {editingTitle ? (
            <input value={title} onChange={e => setTitle(e.target.value)} autoFocus
              onBlur={saveTitle} onKeyDown={e => { if (e.key === 'Enter') saveTitle(); }}
              style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, background: "rgba(255,255,255,0.5)", border: "none", borderBottom: `2px solid ${C.gold}`, borderRadius: 0, padding: "6px 2px", outline: "none" }} />
          ) : (
            <h3 onClick={() => setEditingTitle(true)} style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, margin: 0, cursor: "pointer", padding: "6px 2px", borderBottom: "1px dashed rgba(0,0,0,0.08)", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.08)"}>
              {entry.title || <span style={{ color: C.lbrown, fontWeight: 400, fontStyle: "italic" }}>点击添加标题...</span>}
            </h3>
          )}
          {/* Image */}
          {entry.img && (
            <div style={{ width: "100%", height: 160, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
              {entry.img.startsWith('data:') ? (
                <img src={entry.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.warm}, ${C.cream})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>{entry.img}</div>
              )}
            </div>
          )}
          {/* Text — click to edit */}
          {editingText ? (
            <textarea value={text} onChange={e => setText(e.target.value)} autoFocus
              onBlur={saveText}
              style={{ fontFamily: "'Lora',serif", fontSize: 14, color: C.dark, lineHeight: 1.7, background: "rgba(255,255,255,0.5)", border: "none", borderLeft: `2px solid ${C.gold}`, borderRadius: 0, padding: "8px 10px", outline: "none", flex: 1, resize: "none", minHeight: 120 }} />
          ) : (
            <div onClick={() => setEditingText(true)} style={{ fontFamily: "'Lora',serif", fontSize: 14, color: C.dark, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", cursor: "pointer", padding: "8px 10px", borderLeft: "2px solid transparent", minHeight: 80, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderLeftColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderLeftColor = "transparent"}>
              {entry.text || <span style={{ color: C.lbrown, fontStyle: "italic" }}>点击开始写日记...</span>}
            </div>
          )}
          {/* Bottom buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingBottom: 8 }}>
            {/* Export Word */}
            <button onClick={() => exportToWord(`日记 — ${entry.title}`, `日期：${dateKey}\n标题：${entry.title}\n\n${entry.text}`, `日记_${dateKey}`)}
              style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>导出
            </button>
            {/* Add image */}
            <button onClick={() => imgInputRef?.current?.click()} style={{ padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={C.brown} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>添加图片
            </button>
            {/* Delete */}
            {onDelete && <button onClick={() => { if (confirm("确定删除这篇日记？")) { onDelete(); onBack(); } }} style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.08)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#A03030" strokeWidth="1.8" strokeLinecap="round"/></svg>删除
            </button>}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>这一天还没有日记</div>
          <button onClick={() => onUpdate({ title: "", text: "", img: null })} style={{ padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, boxShadow: "0 3px 10px rgba(200,160,96,0.3)" }}>开始写日记</button>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   EXPORT TO WORD — generates .doc from HTML (Word opens it natively)
   ================================================================ */
const exportToWord = (title, content, filename) => {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${title}</title>
    <style>
      body { font-family: 'Songti SC', 'SimSun', serif; font-size: 14px; color: #261201; line-height: 1.8; padding: 40px; }
      h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
      h2 { font-size: 18px; font-weight: bold; color: #736356; margin-top: 20px; }
      .meta { font-size: 12px; color: #BFB1A8; margin-bottom: 20px; }
      .content { white-space: pre-wrap; }
      .divider { border: none; border-top: 1px solid #EDE5D8; margin: 16px 0; }
      .footer { font-size: 10px; color: #BFB1A8; margin-top: 30px; text-align: center; }
    </style></head>
    <body>
      <h1>${title}</h1>
      <div class="meta">MNEMO · ${new Date().toLocaleDateString('zh-CN')} 导出</div>
      <hr class="divider" />
      <div class="content">${content.replace(/\n/g, '<br/>')}</div>
      <hr class="divider" />
      <div class="footer">Generated by MNEMO Voice Diary</div>
    </body></html>
  `;
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ================================================================
   MAIN APP
   ================================================================ */
export default function App() {
  const [tab, setTab] = useState("record");
  const [showGuide, setShowGuide] = useState(false);
  const [rec, setRec] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [t, setT] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [dv, setDv] = useState("today"); // "today" | "shelf" | "month" | "detail"
  const [sm, setSm] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const iv = useRef(null);

  // === localStorage helpers ===
  const lsGet = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
  const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('Storage error:', e); } };

  // === Sample data (only used on first ever load) ===
  const sampleDiary = {
    "2026-03-22": { title: "春天来了", text: "今天阳光很好，出去散了步。", img: null },
    "2026-03-18": { title: "项目进展", text: "完成了第一版设计稿，反馈积极。", img: null },
    "2026-01-01": { title: "新年第一天", text: "新的开始，希望一切顺利。", img: null },
  };
  const sampleTodos = [
    { text: "完成语音日记 App 设计稿", done: false, date: "2026-03-24", time: "" },
    { text: "买咖啡豆", done: true, date: "2026-03-22", time: "" },
  ];
  const sampleIdeas = [
    { text: "做一个复古风格的音乐播放器", date: "03.22", month: "2026-03", color: "#FFF9C4", rotation: -2 },
    { text: "咖啡馆里听到的旋律很美", date: "03.20", month: "2026-03", color: "#FFE0B2", rotation: 1.5 },
    { text: "用声音记录梦境", date: "03.18", month: "2026-03", color: "#C8E6C9", rotation: -1 },
    { text: "Braun T3 设计语言", date: "02.12", month: "2026-02", color: "#F8BBD0", rotation: -1.5 },
  ];
  const sampleMeetings = [
    { id: 1, title: "Q1 项目复盘会", date: "03.22", duration: "45:20", hasMinutes: true, minutes: "1. 确认下阶段目标和排期\n2. 设计方案需周五前定稿", transcript: "" },
    { id: 2, title: "团队周会", date: "03.15", duration: "28:40", hasMinutes: false, minutes: "", transcript: "" },
  ];

  // === State from localStorage ===
  const [diaryEntries, setDiaryEntries] = useState(() => lsGet('mnemo_diary', sampleDiary));
  const [todos, setTodos] = useState(() => lsGet('mnemo_todos', sampleTodos));
  const [allIdeas, setAllIdeas] = useState(() => lsGet('mnemo_ideas', sampleIdeas));
  const [meetings, setMeetings] = useState(() => lsGet('mnemo_meetings', sampleMeetings));
  const [trash, setTrash] = useState(() => lsGet('mnemo_trash', []));
  const [tapCovers, setTapCovers] = useState(() => lsGet('mnemo_tape_covers', {})); // { "2026-三月": { img: "data:...", drawing: "data:..." } }
  const [tapeModal, setTapeModal] = useState(null); // { year, month, label, color, key }

  // === Auto-save to localStorage on any change ===
  useEffect(() => { lsSet('mnemo_diary', diaryEntries); }, [diaryEntries]);
  useEffect(() => { lsSet('mnemo_todos', todos); }, [todos]);
  useEffect(() => { lsSet('mnemo_ideas', allIdeas); }, [allIdeas]);
  useEffect(() => { lsSet('mnemo_meetings', meetings); }, [meetings]);
  useEffect(() => { lsSet('mnemo_trash', trash); }, [trash]);
  useEffect(() => { lsSet('mnemo_tape_covers', tapCovers); }, [tapCovers]);

  // === Recycle bin: auto-cleanup items older than 30 days ===
  useEffect(() => {
    const now = Date.now();
    const cleaned = trash.filter(item => now - item.deletedAt < 30 * 24 * 60 * 60 * 1000);
    if (cleaned.length !== trash.length) setTrash(cleaned);
  }, []);

  // === Trash helper: move to recycle bin ===
  const moveToTrash = (type, data) => {
    setTrash(prev => [...prev, { type, data, deletedAt: Date.now(), id: Date.now() + Math.random() }]);
  };

  const [todoView, setTodoView] = useState("list");
  const [todoCalMonth, setTodoCalMonth] = useState(new Date().getMonth());
  const [todoCalYear, setTodoCalYear] = useState(new Date().getFullYear());
  const [todoSelDay, setTodoSelDay] = useState(null);
  const [newTodoText, setNewTodoText] = useState("");

  const [ideaSelected, setIdeaSelected] = useState([]);
  const [ideaAIMode, setIdeaAIMode] = useState(false);
  const [ideaAIPrompt, setIdeaAIPrompt] = useState("");
  const [ideaAIResult, setIdeaAIResult] = useState("");
  const [newIdeaText, setNewIdeaText] = useState("");

  const [meetingDetail, setMeetingDetail] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Search states
  const [searchDiary, setSearchDiary] = useState("");
  const [searchTodo, setSearchTodo] = useState("");
  const [searchIdea, setSearchIdea] = useState("");
  const [searchMeeting, setSearchMeeting] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (rec) iv.current = setInterval(() => setT(v => v + 1), 1000);
    else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [rec]);

  const fm = s => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Pure MediaRecorder + DashScope — no browser speech recognition
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const lastAudioData = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' });
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      mr.start(1000);
      mediaRecorder.current = mr;
      setRec(true); setT(0); setTranscript("");
    } catch (e) {
      alert("无法访问麦克风，请允许录音权限后重试");
    }
  };

  const onRed = () => {
    if (!rec && !paused && !showSave && !transcribing) { startRecording(); }
    else if (rec) {
      try { mediaRecorder.current?.pause(); } catch(e) {}
      setRec(false); setPaused(true);
    }
  };

  const onResume = () => {
    try { mediaRecorder.current?.resume(); } catch(e) {}
    setPaused(false); setRec(true);
  };

  const onFinish = async () => {
    setPaused(false);
    setRec(false);
    setTranscript("正在识别...");
    setTranscribing(true);

    // Stop MediaRecorder
    const mr = mediaRecorder.current;
    if (mr && mr.state !== 'inactive') {
      await new Promise(resolve => { mr.onstop = resolve; mr.stop(); });
    }
    if (mr?.stream) { mr.stream.getTracks().forEach(tk => tk.stop()); }
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    mediaRecorder.current = null;

    // Save audio for diary playback
    if (audioBlob.size > 1000) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => { lastAudioData.current = reader.result; };
        reader.readAsDataURL(audioBlob);
      } catch(e) { lastAudioData.current = null; }
    } else { lastAudioData.current = null; }

    // Too short
    if (audioBlob.size < 1000) {
      setTranscript("");
      setTranscribing(false);
      setShowSave(true);
      return;
    }

    // Send to DashScope
    const isLong = t >= 300;
    let finalText = "";

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      if (isLong) {
        // Long recording → async submit + poll
        setTranscript("会议录音识别中...");
        try {
          const submitRes = await fetch('/api/asr-long', { method: 'POST', body: formData });
          const submitData = await submitRes.json();
          if (submitData.task_id) {
            for (let i = 0; i < 120; i++) {
              await new Promise(r => setTimeout(r, 5000));
              try {
                const pollRes = await fetch('/api/asr-long', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'poll', task_id: submitData.task_id }),
                });
                const pollData = await pollRes.json();
                if (pollData.status === 'completed' && pollData.text) { finalText = pollData.text; break; }
                if (pollData.status === 'failed') break;
              } catch(e) { break; }
              setTranscript(`⏳ 会议录音识别中... (${Math.floor((i*5)/60)}分${(i*5)%60}秒)`);
            }
          }
        } catch(e) {}
      } else {
        // Short recording → submit to DashScope, poll for result
        setTranscript("正在识别...");
        try {
          const res = await fetch('/api/asr-short', { method: 'POST', body: formData });
          const data = await res.json();

          if (data.text && data.text.trim()) {
            // Synchronous result (unlikely with new Worker but handle it)
            finalText = data.text.trim();
          } else if (data.task_id) {
            // Async mode: poll every 2 seconds
            for (let i = 0; i < 30; i++) {
              await new Promise(r => setTimeout(r, 2000));
              try {
                const pollRes = await fetch('/api/asr-short', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ task_id: data.task_id }),
                });
                const pollData = await pollRes.json();
                if (pollData.status === 'done' && pollData.text) { finalText = pollData.text; break; }
                if (pollData.status === 'failed') {
                  setTranscript(`识别失败: ${pollData.error || '未知错误'}\n\n可手动输入内容`);
                  setTranscribing(false); setShowSave(true); return;
                }
              } catch(e) { break; }
              setTranscript(`正在识别... (${(i+1)*2}秒)`);
            }
          } else if (data.error) {
            setTranscript(`识别失败: ${data.error}\n${data.detail || ''}\n\n可手动输入内容`);
            setTranscribing(false); setShowSave(true); return;
          }
        } catch(e) {
          setTranscript(`网络错误: ${e.message}\n\n可手动输入内容`);
          setTranscribing(false); setShowSave(true); return;
        }
      }
    } catch(e) {}

    setTranscript(finalText || "");
    setTranscribing(false);
    setShowSave(true);
  };

  // === PWA Service Worker + Reminder system ===
  const swRef = useRef(null);
  const reminderTimers = useRef([]);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        swRef.current = reg;
        console.log('SW registered');
        // Schedule all today's reminders via SW
        if (reg.active) {
          reg.active.postMessage({ type: 'SCHEDULE_ALL', data: { todos } });
        }
      }).catch(e => console.log('SW registration failed:', e));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Fallback: schedule reminders in-app too
    const today = new Date().toISOString().slice(0, 10);
    todos.filter(t => !t.done && t.date === today && t.time).forEach(t => {
      scheduleReminder(t.text, t.time, t.date);
    });
    return () => { reminderTimers.current.forEach(id => clearTimeout(id)); };
  }, []);

  // Re-sync reminders to SW whenever todos change
  useEffect(() => {
    if (swRef.current?.active) {
      swRef.current.active.postMessage({ type: 'SCHEDULE_ALL', data: { todos } });
    }
  }, [todos]);

  const scheduleReminder = (text, time, date) => {
    if (!time || !time.match(/^\d{1,2}:\d{2}$/)) return;
    const [h, m] = time.split(':').map(Number);
    const target = new Date(date + 'T00:00:00');
    target.setHours(h, m, 0, 0);
    // Remind 15 minutes early
    const remindAt = target.getTime() - 15 * 60 * 1000;
    const delay = remindAt - Date.now();
    if (delay <= 0) return;

    // Also send to Service Worker for background notification
    if (swRef.current?.active) {
      swRef.current.active.postMessage({
        type: 'SCHEDULE_REMINDER',
        data: { id: `${text}-${time}`, text, time, date },
      });
    }

    // In-app fallback timer (works when page is open)
    const timerId = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MNEMO 待办提醒', {
          body: `⏰ 15分钟后：${text}（${time}）`,
          tag: 'mnemo-reminder-' + time,
        });
      }
      alert(`⏰ 待办提醒\n\n${text}\n\n将在 15 分钟后开始（${time}）`);
    }, delay);

    reminderTimers.current.push(timerId);
  };

  // Generate .ics calendar file and trigger download for iOS calendar
  const downloadICS = (todos) => {
    const items = todos.filter(t => t.time && /^\d{1,2}:\d{2}$/.test(t.time));
    if (items.length === 0) return;

    const pad = (n) => String(n).padStart(2, '0');
    const toICSDate = (date, time) => {
      const [h, m] = time.split(':').map(Number);
      const d = new Date(date + 'T00:00:00');
      d.setHours(h, m, 0, 0);
      return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };
    const toICSEnd = (date, time) => {
      const [h, m] = time.split(':').map(Number);
      const d = new Date(date + 'T00:00:00');
      d.setHours(h, m + 30, 0, 0); // default 30 min duration
      return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MNEMO//Voice Diary//CN\r\nCALSCALE:GREGORIAN\r\n';
    items.forEach((t, i) => {
      ics += 'BEGIN:VEVENT\r\n';
      ics += `DTSTART:${toICSDate(t.date, t.time)}\r\n`;
      ics += `DTEND:${toICSEnd(t.date, t.time)}\r\n`;
      ics += `SUMMARY:${t.text}\r\n`;
      ics += `DESCRIPTION:MNEMO待办提醒\r\n`;
      ics += `BEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:${t.text} (${t.time})\r\nEND:VALARM\r\n`;
      ics += `UID:mnemo-${Date.now()}-${i}@mnemo-h5.pages.dev\r\n`;
      ics += 'END:VEVENT\r\n';
    });
    ics += 'END:VCALENDAR\r\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mnemo-todo-${items[0].date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const doSave = async (x) => {
    const now = new Date().toISOString().slice(0, 10);
    if (x === "diary" && transcript.trim()) {
      setDiaryEntries(prev => ({ ...prev, [now]: { title: transcript.trim().slice(0, 20), text: transcript.trim(), img: null, audio: lastAudioData.current } }));
    } else if (x === "todo" && transcript.trim()) {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'todo_parse',
            content: { text: transcript.trim() },
            prompt: `你是语音待办助手。用户用语音说了一段话，请提取出真正的待办事项。

规则：
1. 过滤掉所有语气词（嗯、emm、额、那个、然后、就是等）
2. 如果用户反复说同一件事（比如犹豫、纠正），只保留最终版本
3. 合并重复内容，去重
4. 每条待办精简到核心内容
5. 如果提到时间（如3点、下午5点、明天上午），用"HH:MM"格式标注
6. 输出格式：每行一条，格式为 "待办内容 | HH:MM"（没时间就不加 | 和时间）

示例输入："emm 今天3点 今天下午3点有个会 emmm 还有就是 下午5点 下午5点有个会"
示例输出：
下午会议 | 15:00
下午会议 | 17:00

用户语音：${transcript.trim()}`
          }),
        });
        const data = await res.json();
        if (data.result) {
          const items = data.result.split('\n').map(s => s.trim()).filter(s => s && s.length > 1);
          const newTodos = items.map(line => {
            const parts = line.split('|').map(s => s.trim());
            const text = parts[0].replace(/^[\d.、\-\s]+/, '');
            const time = parts[1] || "";
            return { text: text || line, done: false, date: now, time };
          });
          setTodos(prev => [...newTodos, ...prev]);
          newTodos.forEach(todo => {
            if (todo.time && todo.time.match(/^\d{1,2}:\d{2}$/)) {
              scheduleReminder(todo.text, todo.time, now);
            }
          });
          // Auto-export to iOS calendar
          downloadICS(newTodos);
        } else {
          setTodos(prev => [{ text: transcript.trim(), done: false, date: now, time: "" }, ...prev]);
        }
      } catch {
        setTodos(prev => [{ text: transcript.trim(), done: false, date: now, time: "" }, ...prev]);
      }
    } else if (x === "idea" && transcript.trim()) {
      const colors = ["#FFF9C4", "#FFE0B2", "#C8E6C9", "#BBDEFB", "#F8BBD0", "#E1BEE7", "#B2DFDB", "#FFCCBC"];
      const rots = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5];
      const idx = allIdeas.length % colors.length;
      const mm = now.slice(5, 7);
      setAllIdeas(prev => [{ text: transcript.trim(), date: now.slice(5).replace('-', '.'), month: now.slice(0, 7), color: colors[idx], rotation: rots[idx] }, ...prev]);
    } else if (x === "meeting" && transcript.trim()) {
      const newId = Date.now();
      setMeetings(prev => [{ id: newId, title: transcript.trim().slice(0, 15) + "...", date: now.slice(5).replace('-', '.'), duration: fm(t), hasMinutes: false, minutes: "", transcript: transcript.trim() }, ...prev]);
    }
    setShowSave(false); setT(0); setTranscript(""); setTab(x);
  };
  const rst = () => { setRec(false); setPaused(false); setShowSave(false); setT(0); setTranscript(""); setTranscribing(false); if (mediaRecorder.current) { try { mediaRecorder.current.stop(); mediaRecorder.current.stream?.getTracks().forEach(t => t.stop()); } catch(e){} mediaRecorder.current = null; } audioChunks.current = []; lastAudioData.current = null; };
  const handleTab = (key) => setTab(key);
  const goHome = () => { setTab("record"); rst(); setDv("today"); setSm(null); setSelectedDay(null); setSelectedDateKey(null); };
  const GS = 250;

  const SubHeader = ({ title, search, setSearch }) => {
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const toggle = () => {
      if (open && search) { setSearch(""); }
      setOpen(!open);
      if (!open) setTimeout(() => inputRef.current?.focus(), 100);
    };
    return (
      <div style={{ margin: "4px 0 10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <button onClick={goHome} style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#DD2020", boxShadow: "0 1px 3px rgba(150,15,15,0.3)" }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown }}>REC</span>
          </button>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: C.dark, margin: 0 }}>{title}</h2>
          {/* Search icon */}
          <button onClick={toggle} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", background: open ? "rgba(0,0,0,0.06)" : "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {open
                ? <path d="M18 6L6 18M6 6l12 12" stroke={C.brown} strokeWidth="2" strokeLinecap="round" />
                : <><circle cx="11" cy="11" r="7" stroke={C.brown} strokeWidth="2" /><path d="M16.5 16.5L21 21" stroke={C.brown} strokeWidth="2" strokeLinecap="round" /></>
              }
            </svg>
          </button>
        </div>
        {/* Search bar — slides open */}
        <div style={{
          overflow: "hidden", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          maxHeight: open ? 48 : 0, opacity: open ? 1 : 0,
          marginTop: open ? 8 : 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.6)", borderRadius: 8,
            padding: "8px 12px", border: "1px solid rgba(0,0,0,0.06)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={C.lbrown} strokeWidth="2" /><path d="M16.5 16.5L21 21" stroke={C.lbrown} strokeWidth="2" strokeLinecap="round" /></svg>
            <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索关键字..."
              style={{
                flex: 1, border: "none", background: "none", outline: "none",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.dark,
              }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.08)" /><path d="M15 9l-6 6M9 9l6 6" stroke={C.brown} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ===== RECORD PAGE ===== */
  const pgRecord = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Marcellus',serif", fontSize: 38, fontWeight: 400, color: C.dark, margin: 0, letterSpacing: "0.18em" }}>MNEMO</h1>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.lbrown, letterSpacing: "0.3em", marginTop: 2 }}>VOICE · AI · MEMORY</div>
      </div>
      <div style={{ flex: "1 1 16px" }} />
      <div style={{ position: "relative", width: GS, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Grille size={GS} on={rec} />
        <div style={{ marginTop: 18, position: "relative", zIndex: 2 }}><RedButton active={rec} onClick={onRed} /></div>
        {rec && <div style={{ position: "absolute", top: 6, right: 14, zIndex: 3, width: 10, height: 10, borderRadius: "50%", background: "#DD2020", boxShadow: "0 0 6px rgba(180,20,20,0.5)", animation: "blink 1s infinite" }} />}
      </div>
      {(rec || paused) && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 18, color: C.brown, letterSpacing: "0.1em", marginTop: 14 }}>{fm(t)}</div>}
      {paused && !showSave && (
        <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
          <button onClick={onResume} style={{ padding: "12px 22px", borderRadius: 4, border: "none", cursor: "pointer", background: "linear-gradient(180deg, #C4C0B8, #B0ACA4)", boxShadow: "0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: "#2A2420" }}>继续录音</button>
          <button onClick={onFinish} style={{ padding: "12px 22px", borderRadius: 4, border: "none", cursor: "pointer", background: "linear-gradient(180deg, #D03030, #A01A1A)", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: "#fff" }}>结束录音</button>
        </div>
      )}
      <div style={{ flex: "1 1 16px" }} />
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 20 }}>{rec ? "Recording" : paused ? "Paused" : transcribing ? "Transcribing..." : showSave ? "" : "Record"}</div>

      {/* Transcribing loading */}
      {transcribing && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, animation: "blink 1s infinite" }}>语音识别中...</div>
        </div>
      )}

      {showSave && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.warm, borderRadius: "20px 20px 0 0", padding: "28px 18px 24px", boxShadow: "0 -8px 30px rgba(0,0,0,0.12)", animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 10 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, marginBottom: 4, textAlign: "center" }}>保存到</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.brown, marginBottom: 10, textAlign: "center" }}>{fm(t)}</div>
          {/* Transcript — editable textarea */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.gold, fontWeight: 600, marginBottom: 4 }}>语音转写（可编辑）</div>
            <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
              placeholder="语音识别结果将显示在这里，也可以直接手动输入..."
              style={{ width: "100%", minHeight: 60, maxHeight: 100, padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)", fontFamily: "'Lora',serif", fontSize: 12, color: C.dark, lineHeight: 1.5, resize: "vertical", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[{ icon: <BookIcon s={24} c="white" />, l: "日记", k: "diary", bg: C.brown }, { icon: <CheckIcon s={24} c="white" />, l: "待办", k: "todo", bg: C.teal }, { icon: <BulbIcon s={24} c="white" />, l: "灵感", k: "idea", bg: C.orange }, { icon: <MeetIcon s={24} c="white" />, l: "会议", k: "meeting", bg: "#6B5B73" }].map(x =>
              <button key={x.k} onClick={() => doSave(x.k)} style={{ width: 74, height: 78, borderRadius: 12, border: "none", background: x.bg, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                {x.icon}<span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "white", fontWeight: 600 }}>{x.l}</span>
              </button>
            )}
          </div>
          <button onClick={rst} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.lbrown }}>取消</button>
        </div>
      )}
    </div>
  );

  /* ===== DIARY ===== */
  const imgInputRef = useRef(null);

  const handleImageUpload = (e, dateKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDiaryEntries(prev => ({
        ...prev,
        [dateKey]: { ...prev[dateKey], img: reader.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const pgDiary = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayEntry = diaryEntries[todayKey];
    const monthNames = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

    // Level: Day detail (from calendar click)
    if (dv === "detail" && selectedDay && sm) {
      return <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DiaryDetail dayNum={selectedDay} dateKey={selectedDateKey} monthLabel={`${sm.month} ${sm.year}`}
          entry={diaryEntries[selectedDateKey]}
          onBack={() => { setDv("month"); setSelectedDay(null); setSelectedDateKey(null); }}
          onUpdate={(updated) => { setDiaryEntries(prev => ({ ...prev, [selectedDateKey]: updated })); }}
          onDelete={() => { moveToTrash('diary', { key: selectedDateKey, ...diaryEntries[selectedDateKey] }); setDiaryEntries(prev => { const n = { ...prev }; delete n[selectedDateKey]; return n; }); }}
          imgInputRef={imgInputRef}
          onImageUpload={(e) => handleImageUpload(e, selectedDateKey)}
        />
        <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e, selectedDateKey)} />
      </div>;
    }

    // Level: Calendar month
    if (dv === "month" && sm) {
      const zhMonths = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
      const goMonth = (dir) => {
        const mi = zhMonths.indexOf(sm.month);
        let newMi = mi + dir;
        let newYr = parseInt(sm.year);
        if (newMi < 0) { newMi = 11; newYr--; }
        if (newMi > 11) { newMi = 0; newYr++; }
        setSm({ year: String(newYr), month: zhMonths[newMi] });
      };
      return <CalendarMonth year={sm.year} month={sm.month} monthLabel={`${sm.year}年${sm.month}`}
        entries={diaryEntries}
        onBack={() => { setDv("shelf"); setSm(null); }}
        onDayClick={(day, key) => { setSelectedDay(day); setSelectedDateKey(key); setDv("detail"); }}
        onPrev={() => goMonth(-1)}
        onNext={() => goMonth(1)}
      />;
    }

    // Level: Shelf
    if (dv === "shelf") {
      const zhMonths = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
      const enLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const tapeColors = ["clear","smoke","amber","olive","dark","clear","smoke","amber","olive","dark","clear","smoke"];
      // Only show months that have diary entries
      const entryMonths = new Set();
      Object.keys(diaryEntries).forEach(key => {
        if (diaryEntries[key]?.title || diaryEntries[key]?.text) {
          entryMonths.add(key.slice(0, 7)); // "YYYY-MM"
        }
      });
      // Also add current month so user can always access it
      const now = new Date();
      entryMonths.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
      const shelfMap = {};
      Array.from(entryMonths).sort().reverse().forEach(ym => {
        const [y, m] = ym.split('-');
        const mi = parseInt(m) - 1;
        if (!shelfMap[y]) shelfMap[y] = [];
        shelfMap[y].push({ label: enLabels[mi], month: zhMonths[mi], color: tapeColors[mi] });
      });
      const shelves = Object.keys(shelfMap).sort((a, b) => b - a).map(y => ({ y, t: shelfMap[y] }));
      const q = searchDiary.toLowerCase();
      const filtered = q ? shelves.map(s => ({ ...s, t: s.t.filter(t => t.month.includes(q) || t.label.toLowerCase().includes(q) || s.y.includes(q)) })).filter(s => s.t.length > 0) : shelves;
      return <div style={{ flex: 1, padding: "0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 8px 14px" }}>
          <button onClick={() => setDv("today")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown }}>← 今日</button>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: C.dark, margin: 0 }}>日记书架</h2>
          <div style={{ width: 40 }} />
        </div>
        {filtered.length === 0 && q && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Lora',serif", fontSize: 14, color: C.lbrown }}>没有找到相关日记</div>}
        {filtered.map((s, i) => <ShelfRow key={i} year={s.y} tapes={s.t} tapCovers={tapCovers}
          onTap={x => { setDv("month"); setSm({ year: s.y, month: x.month }); }}
          onDoubleTap={info => setTapeModal(info)}
        />)}
        {/* Tape cover modal */}
        {tapeModal && <TapeCoverModal
          tapeInfo={tapeModal}
          coverImg={tapCovers[tapeModal.key]?.img}
          drawingImg={tapCovers[tapeModal.key]?.drawing}
          labelPos={tapCovers[tapeModal.key]?.labelPos}
          labelShape={tapCovers[tapeModal.key]?.labelShape}
          labelFont={tapCovers[tapeModal.key]?.labelFont}
          onClose={() => setTapeModal(null)}
          onSetCover={(img) => setTapCovers(prev => ({ ...prev, [tapeModal.key]: { ...(prev[tapeModal.key] || {}), img } }))}
          onSaveDrawing={(drawing) => setTapCovers(prev => ({ ...prev, [tapeModal.key]: { ...(prev[tapeModal.key] || {}), drawing } }))}
          onUpdateLabel={(pos, shape, font) => setTapCovers(prev => ({ ...prev, [tapeModal.key]: { ...(prev[tapeModal.key] || {}), labelPos: pos, labelShape: shape, labelFont: font } }))}
        />}
      </div>;
    }

    // Level: TODAY (default) — show today's diary with quick edit
    const todayDate = new Date();
    const dayNum = todayDate.getDate();
    const monthLabel = monthNames[todayDate.getMonth()];

    return <div style={{ flex: 1, padding: "0 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 14px" }}>
        <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#DD2020", boxShadow: "0 1px 3px rgba(150,15,15,0.3)" }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown }}>REC</span>
        </button>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: C.dark, margin: 0 }}>今日日记</h2>
        <button onClick={() => setDv("shelf")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.gold, fontWeight: 600 }}>书架 ›</button>
      </div>

      {/* Date display */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{dayNum}</span>
        <span style={{ fontFamily: "'Lora',serif", fontSize: 16, color: C.brown }}>{monthLabel} {todayDate.getFullYear()}</span>
      </div>

      {todayEntry ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Audio playback */}
          {todayEntry.audio && (
            <button onClick={() => {
              const aud = document.getElementById('today-audio');
              if (aud) { if (aud.paused) aud.play(); else aud.pause(); }
              else { const a = new Audio(todayEntry.audio); a.id = 'today-audio-el'; a.play(); }
            }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.04)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.brown, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, color: C.brown }}>回听录音</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.lbrown }}>语音原声</div>
              </div>
            </button>
          )}
          {/* Click title or text to go to detail page for editing */}
          <h3 onClick={() => { setSelectedDay(dayNum); setSelectedDateKey(todayKey); setDv("detail"); const m = monthNames[todayDate.getMonth()]; setSm({ year: String(todayDate.getFullYear()), month: m }); }}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, margin: 0, cursor: "pointer" }}>
            {todayEntry.title || <span style={{ color: C.lbrown, fontWeight: 400, fontStyle: "italic" }}>点击添加标题...</span>}
          </h3>
          {todayEntry.img && (
            <div style={{ width: "100%", height: 160, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
              <img src={todayEntry.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <p onClick={() => { setSelectedDay(dayNum); setSelectedDateKey(todayKey); setDv("detail"); const m = monthNames[todayDate.getMonth()]; setSm({ year: String(todayDate.getFullYear()), month: m }); }}
            style={{ fontFamily: "'Lora',serif", fontSize: 14, color: C.dark, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", cursor: "pointer", minHeight: 60 }}>
            {todayEntry.text || <span style={{ color: C.lbrown, fontStyle: "italic" }}>点击开始写日记...</span>}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => exportToWord(`日记 — ${todayEntry.title}`, `日期：${todayKey}\n标题：${todayEntry.title}\n\n${todayEntry.text}`, `日记_${todayKey}`)}
              style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>导出
            </button>
            <button onClick={() => imgInputRef.current?.click()}
              style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={C.brown} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>添加图片
            </button>
            <button onClick={() => { if (confirm("确定删除今日日记？")) { setDiaryEntries(prev => { const n = { ...prev }; delete n[todayKey]; return n; }); } }}
              style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.08)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#A03030" strokeWidth="1.8" strokeLinecap="round"/></svg>删除
            </button>
          </div>
          <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e, todayKey)} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 15, color: C.lbrown, marginBottom: 14 }}>今天还没有写日记</div>
          <button onClick={() => {
            setDiaryEntries(prev => ({ ...prev, [todayKey]: { title: "", text: "", img: null } }));
            setSelectedDay(dayNum); setSelectedDateKey(todayKey); setDv("detail");
            const m = monthNames[todayDate.getMonth()]; setSm({ year: String(todayDate.getFullYear()), month: m });
          }}
            style={{ padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, boxShadow: "0 3px 10px rgba(200,160,96,0.3)" }}>
            开始写日记
          </button>
        </div>
      )}
    </div>;
  };

  /* ===== TODO — Level 1: List, Level 2: Heatmap Calendar ===== */
  const pgTodo = () => {
    const q = searchTodo.toLowerCase();
    const todoByDate = {};
    todos.forEach(t => { if (!todoByDate[t.date]) todoByDate[t.date] = []; todoByDate[t.date].push(t); });

    // Search mode
    if (q) {
      const results = todos.filter(t => t.text.toLowerCase().includes(q));
      return <div style={{ flex: 1, padding: "0 16px" }}>
        <SubHeader title="待办事项" search={searchTodo} setSearch={setSearchTodo} />
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.brown, letterSpacing: "0.1em", marginBottom: 10 }}>找到 {results.length} 条结果</div>
        {results.length === 0 && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>没有找到「{searchTodo}」相关的待办</div>}
        {results.map((x, i) => <TodoRow key={i} text={x.text} done={x.done} time={x.time} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: !x.done }; setTodos(n); }} onEdit={(newText) => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, text: newText }; setTodos(n); }} onDelete={() => { moveToTrash('todo', x); setTodos(todos.filter(t => t !== x)); }} onCalendar={() => downloadICS([x])} />)}
      </div>;
    }

    // Level 2b: Day detail from calendar
    if (todoView === "day" && todoSelDay) {
      const dayItems = todoByDate[todoSelDay] || [];
      const d = new Date(todoSelDay + "T00:00:00");
      const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
      return <div style={{ flex: 1, padding: "0 16px" }}>
        <SubHeader title="待办事项" search={searchTodo} setSearch={setSearchTodo} />
        <button onClick={() => { setTodoView("calendar"); setTodoSelDay(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "0 0 8px" }}>← 返回月历</button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{d.getDate()}</span>
          <span style={{ fontFamily: "'Caveat',cursive", fontSize: 15, color: C.brown }}>{monthNames[d.getMonth()]} {d.getFullYear()}</span>
        </div>
        {dayItems.length === 0 && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>这一天没有待办</div>}
        {dayItems.filter(x => !x.done).length > 0 && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.brown, letterSpacing: "0.15em", marginBottom: 8 }}>待完成</div>}
        {dayItems.filter(x => !x.done).map((x, i) => <TodoRow key={i} text={x.text} done={false} time={x.time} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: true }; setTodos(n); }} onEdit={(newText) => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, text: newText }; setTodos(n); }} onDelete={() => { moveToTrash('todo', x); setTodos(todos.filter(t => t !== x)); }} onCalendar={() => downloadICS([x])} />)}
        {dayItems.filter(x => x.done).length > 0 && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, letterSpacing: "0.15em", marginBottom: 8, marginTop: 12 }}>已完成</div>}
        {dayItems.filter(x => x.done).map((x, i) => <TodoRow key={i} text={x.text} done={true} time={x.time} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: false }; setTodos(n); }} onEdit={(newText) => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, text: newText }; setTodos(n); }} onDelete={() => { moveToTrash('todo', x); setTodos(todos.filter(t => t !== x)); }} onCalendar={() => downloadICS([x])} />)}
      </div>;
    }

    // Level 2: Heatmap Calendar
    if (todoView === "calendar") {
      const yr = todoCalYear, mo = todoCalMonth;
      const firstDay = new Date(yr, mo, 1).getDay();
      const daysInMonth = new Date(yr, mo + 1, 0).getDate();
      const weeks = []; let cw = [];
      for (let i = 0; i < firstDay; i++) cw.push(null);
      for (let d = 1; d <= daysInMonth; d++) { cw.push(d); if (cw.length === 7) { weeks.push(cw); cw = []; } }
      if (cw.length) { while (cw.length < 7) cw.push(null); weeks.push(cw); }
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const wkdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
      const moKey = `${yr}-${String(mo + 1).padStart(2, "0")}`;
      const moTodos = todos.filter(t => t.date.startsWith(moKey));
      const today = new Date(); const isCurrentMonth = today.getFullYear() === yr && today.getMonth() === mo;
      const todayDate = isCurrentMonth ? today.getDate() : -1;

      const getDayInfo = (d) => {
        const key = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const items = todoByDate[key] || [];
        if (!items.length) return { items: [], total: 0, done: 0, pct: 0 };
        const done = items.filter(x => x.done).length;
        return { items, total: items.length, done, pct: done / items.length };
      };

      const prevMonth = () => { if (mo === 0) { setTodoCalMonth(11); setTodoCalYear(yr - 1); } else setTodoCalMonth(mo - 1); };
      const nextMonth = () => { if (mo === 11) { setTodoCalMonth(0); setTodoCalYear(yr + 1); } else setTodoCalMonth(mo + 1); };

      return <div style={{ flex: 1, padding: "0 8px", display: "flex", flexDirection: "column" }}>
        <SubHeader title="待办事项" search={searchTodo} setSearch={setSearchTodo} />
        <button onClick={() => setTodoView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "0 8px 6px", textAlign: "left" }}>← 返回列表</button>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 0 8px" }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, color: C.lbrown, padding: 4 }}>‹</button>
          <div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, fontStyle: "italic", color: C.dark }}>{monthNames[mo]}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, marginLeft: 8 }}>{yr}</span>
          </div>
          <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, color: C.lbrown, padding: 4 }}>›</button>
        </div>

        {/* Summary */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 8, padding: "8px 12px", background: "rgba(255,255,255,0.4)", borderRadius: 8 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.dark }}>{moTodos.length}</div><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.brown }}>总计</div></div>
          <div style={{ width: 1, background: C.lbrown, opacity: 0.3 }} />
          <div style={{ textAlign: "center" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.olive }}>{moTodos.filter(x => x.done).length}</div><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.brown }}>完成</div></div>
          <div style={{ width: 1, background: C.lbrown, opacity: 0.3 }} />
          <div style={{ textAlign: "center" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.orange }}>{moTodos.filter(x => !x.done).length}</div><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.brown }}>待办</div></div>
        </div>

        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, padding: "0 2px 4px" }}>
          {wkdays.map(d => <div key={d} style={{ fontFamily: "'Playfair Display',serif", fontSize: 10, fontStyle: "italic", color: C.brown, textAlign: "center" }}>{d}</div>)}
        </div>

        {/* Heatmap grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, padding: "0 2px", overflow: "auto" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ flex: 1, minHeight: 68, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
              {week.map((day, di) => {
                const info = day ? getDayInfo(day) : null;
                const isToday = day === todayDate;
                const hue = info && info.total > 0
                  ? `rgba(${info.pct > 0.5 ? "139,140,106" : "212,114,42"}, ${0.08 + info.total * 0.08})`
                  : "rgba(255,255,255,0.2)";
                return (
                  <div key={di} onClick={() => { if (day) { const key = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; setTodoSelDay(key); setTodoView("day"); } }}
                    style={{
                      borderRadius: 5, padding: "4px 3px",
                      background: day ? (info && info.total > 0 ? hue : "rgba(255,255,255,0.2)") : "transparent",
                      border: isToday ? `1.5px solid ${C.gold}` : day ? "1px solid rgba(0,0,0,0.04)" : "none",
                      cursor: day ? "pointer" : "default",
                      display: "flex", flexDirection: "column", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (day) e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { if (day) e.currentTarget.style.transform = "scale(1)"; }}>
                    {day && (<>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: isToday ? 12 : 10, fontWeight: isToday ? 700 : 400, color: isToday ? C.gold : C.dark }}>{day}</span>
                      {info && info.total > 0 && (
                        <div style={{ marginTop: "auto" }}>
                          <div style={{ height: 3, borderRadius: 2, background: "rgba(0,0,0,0.06)", marginTop: 4 }}>
                            <div style={{ height: "100%", borderRadius: 2, width: `${info.pct * 100}%`, background: info.pct === 1 ? C.olive : C.orange }} />
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 6, color: C.brown, textAlign: "center", marginTop: 2 }}>{info.done}/{info.total}</div>
                        </div>
                      )}
                    </>)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>;
    }

    // Level 1: Todo list directly
    return <div style={{ flex: 1, padding: "0 16px" }}>
      <SubHeader title="待办事项" search={searchTodo} setSearch={setSearchTodo} />

      {/* Calendar entry button */}
      <button onClick={() => setTodoView("calendar")} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        padding: "10px 14px", marginBottom: 14, borderRadius: 8, border: "none", cursor: "pointer",
        background: "rgba(255,255,255,0.45)", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.45)"}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke={C.brown} strokeWidth="1.8"/><path d="M3 10h18M8 2v4M16 2v4" stroke={C.brown} strokeWidth="1.8" strokeLinecap="round"/></svg>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.brown, fontWeight: 600 }}>按日期查看</span>
        <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.lbrown }}>›</span>
      </button>

      {/* New todo input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <input value={newTodoText} onChange={e => setNewTodoText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && newTodoText.trim()) { setTodos([{ text: newTodoText.trim(), done: false, date: new Date().toISOString().slice(0, 10) }, ...todos]); setNewTodoText(""); } }}
          placeholder="添加新待办..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)", outline: "none", fontFamily: "'Lora',serif", fontSize: 13, color: C.dark }} />
        <button onClick={() => { if (newTodoText.trim()) { setTodos([{ text: newTodoText.trim(), done: false, date: new Date().toISOString().slice(0, 10) }, ...todos]); setNewTodoText(""); } }}
          style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: C.teal, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>+</button>
      </div>

      {/* Pending */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.brown, letterSpacing: "0.15em", marginBottom: 8 }}>待完成 ({todos.filter(x => !x.done).length})</div>
        {todos.filter(x => !x.done).map((x, i) => <TodoRow key={i} text={x.text} done={false} time={x.time} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: true }; setTodos(n); }} onEdit={(newText) => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, text: newText }; setTodos(n); }} onDelete={() => { moveToTrash('todo', x); setTodos(todos.filter(t => t !== x)); }} onCalendar={() => downloadICS([x])} />)}
      </div>

      {/* Done */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, letterSpacing: "0.15em", marginBottom: 8 }}>已完成 ({todos.filter(x => x.done).length})</div>
        {todos.filter(x => x.done).map((x, i) => <TodoRow key={i} text={x.text} done={true} time={x.time} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: false }; setTodos(n); }} onEdit={(newText) => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, text: newText }; setTodos(n); }} onDelete={() => { moveToTrash('todo', x); setTodos(todos.filter(t => t !== x)); }} onCalendar={() => downloadICS([x])} />)}
      </div>
    </div>;
  };

  /* ===== IDEA — Sticky notes by month + AI ===== */
  const pgIdea = () => {
    const q = searchIdea.toLowerCase();
    const filteredIdeas = q ? allIdeas.filter(i => i.text.toLowerCase().includes(q)) : allIdeas;
    const grouped = {};
    filteredIdeas.forEach(idea => { if (!grouped[idea.month]) grouped[idea.month] = []; grouped[idea.month].push(idea); });
    const monthLabels = { "2026-03": "三月 2026", "2026-02": "二月 2026", "2026-01": "一月 2026" };
    const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    const toggleSelect = (idx) => setIdeaSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    const simulateAI = async () => {
      setAiGenerating(true);
      try {
        const ideas = ideaSelected.map(i => allIdeas[i].text);
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'idea_synthesis', content: { ideas }, prompt: ideaAIPrompt }),
        });
        const data = await res.json();
        setIdeaAIResult(data.result || '生成失败，请重试');
      } catch (e) {
        setIdeaAIResult('网络错误，请检查连接后重试');
      }
      setAiGenerating(false);
    };

    return <div style={{ flex: 1, padding: "0 16px" }}>
      <SubHeader title="灵感墙" search={searchIdea} setSearch={setSearchIdea} />
      {q && filteredIdeas.length === 0 && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>没有找到「{searchIdea}」相关的灵感</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={() => { setIdeaAIMode(!ideaAIMode); setIdeaSelected([]); setIdeaAIResult(""); setIdeaAIPrompt(""); }}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: ideaAIMode ? C.orange : "rgba(0,0,0,0.06)", color: ideaAIMode ? "#fff" : C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, transition: "all 0.2s" }}>
          <AIIcon s={12} c={ideaAIMode ? "#fff" : C.orange} />{ideaAIMode ? "退出 AI" : "AI 合成"}
        </button>
      </div>
      {/* Add new idea */}
      {!ideaAIMode && (
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          <input value={newIdeaText} onChange={e => setNewIdeaText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newIdeaText.trim()) {
                const now = new Date();
                const colors = ["#FFF9C4","#FFE0B2","#C8E6C9","#BBDEFB","#F8BBD0","#E1BEE7","#B2DFDB","#FFCCBC"];
                const rots = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5];
                const idx = allIdeas.length % colors.length;
                const dateStr = `${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
                const monthStr = now.toISOString().slice(0, 7);
                setAllIdeas(prev => [{ text: newIdeaText.trim(), date: dateStr, month: monthStr, color: colors[idx], rotation: rots[idx] }, ...prev]);
                setNewIdeaText("");
              }
            }}
            placeholder="记录一个灵感..."
            style={{ flex: 1, padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)", outline: "none", fontFamily: "Georgia,'Songti SC',serif", fontSize: 13, fontStyle: "italic", color: C.dark }} />
          <button onClick={() => {
            if (newIdeaText.trim()) {
              const now = new Date();
              const colors = ["#FFF9C4","#FFE0B2","#C8E6C9","#BBDEFB","#F8BBD0","#E1BEE7","#B2DFDB","#FFCCBC"];
              const rots = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5];
              const idx = allIdeas.length % colors.length;
              const dateStr = `${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
              const monthStr = now.toISOString().slice(0, 7);
              setAllIdeas(prev => [{ text: newIdeaText.trim(), date: dateStr, month: monthStr, color: colors[idx], rotation: rots[idx] }, ...prev]);
              setNewIdeaText("");
            }
          }}
            style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: C.orange, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>+</button>
        </div>
      )}
      {sortedMonths.map(month => (
        <div key={month} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {/* Wax seal dot */}
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #C83030, #8B2020)", boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 -1px 1px rgba(0,0,0,0.15)", flexShrink: 0 }} />
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.brown}40, transparent)` }} />
            <span style={{ fontFamily: "Georgia,'Songti SC',serif", fontSize: 11, color: "#8A7A60", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.05em" }}>{monthLabels[month] || month}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingLeft: 18 }}>
            {grouped[month].map((idea, i) => {
              const gIdx = allIdeas.indexOf(idea);
              return <Sticky key={i} {...idea} selectable={ideaAIMode} selected={ideaSelected.includes(gIdx)} onSelect={() => toggleSelect(gIdx)}
                onEdit={(newText) => { const updated = [...allIdeas]; updated[gIdx] = { ...updated[gIdx], text: newText }; setAllIdeas(updated); }}
                onDelete={() => { moveToTrash('idea', allIdeas[gIdx]); setAllIdeas(prev => prev.filter((_, idx) => idx !== gIdx)); }}
              />;
            })}
          </div>
        </div>
      ))}
      {ideaAIMode && ideaSelected.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 14, border: "1px solid rgba(212,114,42,0.2)", marginTop: 4 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.orange, fontWeight: 600, marginBottom: 8 }}>已选 {ideaSelected.length} 条灵感</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {ideaSelected.map(idx => <span key={idx} style={{ padding: "3px 8px", borderRadius: 2, fontSize: 10, fontFamily: "Georgia,serif", fontStyle: "italic", background: "rgba(228,216,192,0.8)", color: "#3A2A18", boxShadow: "1px 1px 3px rgba(60,40,20,0.1)", borderBottom: "2px solid #A08060" }}>{allIdeas[idx].text.slice(0, 10)}...</span>)}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(212,114,42,0.06)", borderRadius: 6, border: "1px solid rgba(212,114,42,0.15)" }}>
              <AIIcon s={12} c={C.orange} />
              <input value={ideaAIPrompt} onChange={e => setIdeaAIPrompt(e.target.value)} placeholder="输入指令..." style={{ flex: 1, border: "none", background: "none", outline: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.dark }} />
            </div>
            <button onClick={simulateAI} disabled={aiGenerating} style={{ padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: aiGenerating ? C.lbrown : C.orange, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, opacity: aiGenerating ? 0.6 : 1 }}>{aiGenerating ? "..." : "发送"}</button>
          </div>
          {ideaAIResult && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(212,114,42,0.04)", borderRadius: 6, borderLeft: `3px solid ${C.orange}` }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: C.orange, fontWeight: 600, marginBottom: 6 }}>AI 输出</div>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 13, color: C.dark, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{ideaAIResult}</div>
              {/* Export button */}
              <button onClick={() => {
                const ideasText = ideaSelected.map(i => `• ${allIdeas[i].text}`).join('\n');
                exportToWord('灵感 AI 合成', `选中的灵感：\n${ideasText}\n\n${ideaAIPrompt ? `指令：${ideaAIPrompt}\n\n` : ''}${'—'.repeat(20)}\n\nAI 分析结果：\n${ideaAIResult}`, `灵感合成_${new Date().toISOString().slice(0,10)}`);
              }}
                style={{ marginTop: 10, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: C.orange, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                导出 Word
              </button>
            </div>
          )}
        </div>
      )}
    </div>;
  };

  /* ===== MEETING ===== */
  const pgMeeting = () => {
    const q = searchMeeting.toLowerCase();
    if (meetingDetail) {
      const m = meetings.find(x => x.id === meetingDetail);
      const gen = async () => {
        setAiGenerating(true);
        try {
          const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'meeting_minutes', content: { title: m.title, transcript: m.transcript || '' } }),
          });
          const data = await res.json();
          setMeetings(prev => prev.map(x => x.id === meetingDetail ? { ...x, hasMinutes: true, minutes: data.result || '生成失败' } : x));
        } catch (e) {
          setMeetings(prev => prev.map(x => x.id === meetingDetail ? { ...x, hasMinutes: true, minutes: '网络错误，请重试' } : x));
        }
        setAiGenerating(false);
      };
      return <div style={{ flex: 1, padding: "0 16px" }}>
        <SubHeader title="会议录音" search={searchMeeting} setSearch={setSearchMeeting} />
        <button onClick={() => setMeetingDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: C.brown, padding: "0 0 10px" }}>← 返回列表</button>
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 18, border: "1px solid rgba(0,0,0,0.04)", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>{m.title}</h3>
          <div style={{ display: "flex", gap: 12, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.brown, marginBottom: 14 }}><span>{m.date}</span><span>·</span><span>{m.duration}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 36, padding: "0 4px" }}>
            {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ flex: 1, borderRadius: 2, height: `${20 + Math.sin(i * 0.6) * 14 + Math.random() * 8}%`, background: `linear-gradient(180deg, ${C.teal}88, ${C.teal})` }} />)}
          </div>
        </div>
        {m.hasMinutes ? (
          <div style={{ background: "rgba(43,110,110,0.06)", borderRadius: 12, padding: 16, borderLeft: `4px solid ${C.teal}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><AIIcon s={14} c={C.teal} /><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.teal, fontWeight: 600 }}>AI 会议纪要</span></div>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 15, color: C.dark, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.minutes}</div>
            {/* Export button */}
            <button onClick={() => exportToWord(`会议纪要 — ${m.title}`, `会议主题：${m.title}\n日期：${m.date}\n时长：${m.duration}\n\n${'—'.repeat(20)}\n\n${m.minutes}`, `会议纪要_${m.title}_${m.date}`)}
              style={{ marginTop: 12, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: C.teal, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              导出 Word
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 20 }}>
            <button onClick={gen} disabled={aiGenerating} style={{ padding: "14px 28px", borderRadius: 8, border: "none", cursor: "pointer", background: aiGenerating ? C.lbrown : `linear-gradient(180deg, ${C.teal}, #1E5858)`, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, boxShadow: aiGenerating ? "none" : "0 4px 12px rgba(43,110,110,0.3)", display: "flex", alignItems: "center", gap: 8, margin: "0 auto" }}>
              <AIIcon s={14} c="#fff" />{aiGenerating ? "AI 正在生成..." : "生成 AI 会议纪要"}
            </button>
          </div>
        )}
        {/* Delete meeting */}
        <button onClick={() => { if (confirm("确定删除此会议录音？")) { const m = meetings.find(x => x.id === meetingDetail); moveToTrash('meeting', m); setMeetings(prev => prev.filter(x => x.id !== meetingDetail)); setMeetingDetail(null); } }}
          style={{ marginTop: 16, padding: "10px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.06)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#A03030" strokeWidth="1.8" strokeLinecap="round"/></svg>删除会议
        </button>
      </div>;
    }
    const filteredMeetings = q ? meetings.filter(m => m.title.toLowerCase().includes(q) || m.minutes.toLowerCase().includes(q) || m.date.includes(q)) : meetings;
    return <div style={{ flex: 1, padding: "0 16px" }}>
      <SubHeader title="会议录音" search={searchMeeting} setSearch={setSearchMeeting} />
      {q && filteredMeetings.length === 0 && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>没有找到「{searchMeeting}」相关的会议</div>}
      {filteredMeetings.map(m => (
        <div key={m.id} onClick={() => setMeetingDetail(m.id)} style={{ background: "rgba(255,255,255,0.5)", borderRadius: 10, padding: 16, marginBottom: 10, border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: m.hasMinutes ? C.teal : C.lbrown, display: "flex", alignItems: "center", justifyContent: "center" }}><MeetIcon s={22} c="white" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: C.dark, marginBottom: 3 }}>{m.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown }}>{m.date} · {m.duration}</span>
              {m.hasMinutes && <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, fontWeight: 600, color: C.teal, background: "rgba(43,110,110,0.1)", padding: "2px 6px", borderRadius: 3 }}>AI 纪要</span>}
            </div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: C.lbrown }}>›</div>
        </div>
      ))}
    </div>;
  };

  return (
    <div style={{ width: 375, height: 740, margin: "20px auto", background: C.bg, borderRadius: 40, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Caveat:wght@400;600&family=Marcellus&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.12}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{-webkit-font-smoothing:antialiased;box-sizing:border-box}
        ::-webkit-scrollbar{display:none}
      `}</style>
      <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 120, height: 28, background: C.dark, borderRadius: 14 }} /></div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: 6 }}>
        {tab === "record" && pgRecord()}
        {tab === "diary" && pgDiary()}
        {tab === "todo" && pgTodo()}
        {tab === "idea" && pgIdea()}
        {tab === "meeting" && pgMeeting()}
      </div>
      <TP22Bar activeTab={tab} onTab={handleTab} onHelp={() => setShowGuide(true)} />
      {/* Guide overlay */}
      {showGuide && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s" }}
          onClick={e => { if (e.target === e.currentTarget) setShowGuide(false); }}>
          <div style={{ width: "100%", maxWidth: 430, maxHeight: "85vh", background: C.warm, borderRadius: "20px 20px 0 0", padding: "20px 20px 30px", overflowY: "auto", animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.dark, margin: 0 }}>MNEMO 使用指南</h2>
              <button onClick={() => setShowGuide(false)} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {[
              { icon: "🎙️", title: "录音", items: [
                "点击中央红色按钮开始录音",
                "录音时实时显示语音转写预览",
                "录完后通义 AI 高精度识别替换",
                "识别结果可手动编辑修改",
                "选择保存到：日记 / 待办 / 灵感 / 会议",
              ]},
              { icon: "📖", title: "日记", items: [
                "首页显示今日日记，点击标题或正文跳转编辑",
                "有录音的日记可点击「回听录音」播放原声",
                "书架 → 只显示有日记的月份（磁带样式）",
                "双击磁带 → 自定义封面（模板/图片/手绘）",
                "月历左右滑动切换月份",
                "支持导出 Word 文档",
              ]},
              { icon: "✅", title: "待办", items: [
                "语音添加自动提取多条待办和时间",
                "有时间的待办自动导出 .ics 日历文件",
                "iOS 日历提前 15 分钟推送提醒（锁屏可收到）",
                "点击 ✏️ 编辑，✕ 删除，📅 手动导出日历",
                "按日期查看 → 月热力图日历",
              ]},
              { icon: "💡", title: "灵感", items: [
                "便签墙按月分组，撕纸+胶带复古风格",
                "顶部输入框可直接手动添加灵感",
                "点击 AI 合成 → 多选便签 → 智谱 AI 整合分析",
                "每条便签可编辑和删除",
              ]},
              { icon: "🎤", title: "会议", items: [
                "≥5 分钟自动使用长录音识别（支持 2 小时）",
                "支持说话人分离（自动区分说话人 1、2...）",
                "智谱 AI 一键生成会议纪要",
                "纪要可导出 Word 文档",
              ]},
              { icon: "⚙️", title: "其他", items: [
                "所有数据存储在手机本地（localStorage）",
                "添加到主屏幕可作为独立 App 使用",
              ]},
            ].map((sec, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{sec.icon}</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: C.dark }}>{sec.title}</span>
                </div>
                {sec.items.map((item, j) => (
                  <div key={j} style={{ fontFamily: "'Lora',serif", fontSize: 12, color: C.brown, lineHeight: 1.6, paddingLeft: 24, position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, color: C.gold }}>·</span>{item}
                  </div>
                ))}
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: 12, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.lbrown }}>
              MNEMO v1.0 · 复古语音日记
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
