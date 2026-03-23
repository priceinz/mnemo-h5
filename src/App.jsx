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
const TP22Bar = ({ activeTab, onTab }) => {
  const tabs = [
    { key: "diary", label: "日记" },
    { key: "todo", label: "待办" },
    { key: "idea", label: "灵感" },
    { key: "meeting", label: "会议" },
  ];
  return (
    <div style={{ height: 72, flexShrink: 0, background: `linear-gradient(180deg, ${C.metalLt}, ${C.metal}, ${C.metalDk})`, borderTop: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 18px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}>
      {tabs.map(t => {
        const isOn = activeTab === t.key;
        return (
          <button key={t.key} onClick={() => onTab(t.key)} style={{ width: 72, height: 42, borderRadius: 3, border: "none", cursor: "pointer", outline: "none", background: isOn ? "linear-gradient(180deg, #A09C94, #AAA69E, #B4B0A8)" : "linear-gradient(180deg, #C4C0B8, #BAB6AE, #B0ACA4)", boxShadow: isOn ? "inset 0 2px 5px rgba(0,0,0,0.25)" : "0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)", transform: isOn ? "translateY(1px)" : "translateY(0)", transition: "all 0.1s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: isOn ? "#2A2420" : "#4A4640", letterSpacing: "0.05em" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ================================================================
   REALISTIC CASSETTE TAPE — translucent case, visible reels, label
   ================================================================ */
const CassetteTape = ({ month, yearLabel, color, onClick }) => {
  const cases = {
    clear: { body: "linear-gradient(175deg, rgba(235,230,220,0.9), rgba(210,205,195,0.9))", shadow: "rgba(0,0,0,0.06)", reel: "rgba(0,0,0,0.08)", window: "rgba(0,0,0,0.04)", labelBg: "#FFFBF2", edge: "rgba(255,255,255,0.5)" },
    smoke: { body: "linear-gradient(175deg, rgba(120,115,108,0.88), rgba(85,82,76,0.9))", shadow: "rgba(0,0,0,0.12)", reel: "rgba(255,255,255,0.06)", window: "rgba(0,0,0,0.1)", labelBg: "#F0ECE4", edge: "rgba(255,255,255,0.12)" },
    amber: { body: "linear-gradient(175deg, rgba(180,155,110,0.88), rgba(145,120,80,0.9))", shadow: "rgba(0,0,0,0.1)", reel: "rgba(0,0,0,0.06)", window: "rgba(0,0,0,0.06)", labelBg: "#FFF8E8", edge: "rgba(255,255,255,0.2)" },
    olive: { body: "linear-gradient(175deg, rgba(135,140,105,0.88), rgba(100,105,75,0.9))", shadow: "rgba(0,0,0,0.08)", reel: "rgba(0,0,0,0.06)", window: "rgba(0,0,0,0.05)", labelBg: "#F5F2E8", edge: "rgba(255,255,255,0.15)" },
    dark: { body: "linear-gradient(175deg, rgba(68,62,55,0.92), rgba(45,40,36,0.92))", shadow: "rgba(0,0,0,0.15)", reel: "rgba(255,255,255,0.05)", window: "rgba(0,0,0,0.12)", labelBg: "#EDE8E0", edge: "rgba(255,255,255,0.08)" },
  };
  const tc = cases[color] || cases.clear;
  const rb = tc.reel === "rgba(255,255,255,0.06)" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  return (
    <button onClick={onClick} style={{ width: 72, height: 110, borderRadius: 3, padding: 0, background: tc.body, border: "none", cursor: "pointer", flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: `2px 3px 10px ${tc.shadow}, inset 0 1px 0 ${tc.edge}`, transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-16px) rotate(-1.5deg)"; e.currentTarget.style.boxShadow = "4px 8px 20px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) rotate(0deg)"; e.currentTarget.style.boxShadow = `2px 3px 10px ${tc.shadow}, inset 0 1px 0 ${tc.edge}`; }}>
      <div style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1.5, background: tc.edge, borderRadius: 1 }} />
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, height: 24, borderRadius: 3, background: tc.window, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, border: "0.5px solid rgba(0,0,0,0.06)" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${rb}`, position: "relative" }}><div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: tc.reel }} /></div>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${rb}`, position: "relative" }}><div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: tc.reel }} /></div>
        <div style={{ position: "absolute", top: "50%", left: 16, right: 16, height: 1, background: tc.reel }} />
      </div>
      <div style={{ position: "absolute", top: 40, left: 8, right: 8, bottom: 18, background: tc.labelBg, borderRadius: 2, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 10, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", top: 20, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <div style={{ position: "absolute", top: 30, left: 6, right: 6, height: 0.5, background: "rgba(0,0,0,0.05)" }} />
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 12, color: C.brown, lineHeight: 1, marginBottom: 1 }}>{month}</span>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 22, fontWeight: 600, color: C.dark, lineHeight: 1 }}>{yearLabel}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.06))", borderRadius: "0 0 3px 3px" }} />
      <div style={{ position: "absolute", top: 5, left: 5, width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.06)" }} />
      <div style={{ position: "absolute", top: 5, right: 5, width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.06)" }} />
    </button>
  );
};
const ShelfRow = ({ year, tapes, onTap }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown, letterSpacing: "0.2em", marginBottom: 4, paddingLeft: 8 }}>— {year} —</div>
    <div style={{ display: "flex", gap: 6, padding: "8px 8px 0", alignItems: "flex-end", overflowX: "auto" }}>{tapes.map((t, i) => <CassetteTape key={i} month={t.month} yearLabel={t.label} color={t.color} onClick={() => onTap(t)} />)}</div>
    <div style={{ position: "relative" }}>
      <div style={{ height: 10, borderRadius: "0 0 4px 4px", background: `linear-gradient(180deg, #A07850, ${C.wood}, ${C.woodDk})`, boxShadow: "0 4px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: 14, top: 10, width: 4, height: 12, background: "linear-gradient(180deg, #C0B8A8, #A09888)", borderRadius: "0 0 2px 2px", boxShadow: "1px 1px 2px rgba(0,0,0,0.12)" }} />
      <div style={{ position: "absolute", right: 14, top: 10, width: 4, height: 12, background: "linear-gradient(180deg, #C0B8A8, #A09888)", borderRadius: "0 0 2px 2px", boxShadow: "1px 1px 2px rgba(0,0,0,0.12)" }} />
    </div>
  </div>
);

/* ================================================================
   ICONS
   ================================================================ */
const BookIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 4h4l4 2 4-2h4v16h-4l-4 2-4-2H4V4z" stroke={c} strokeWidth="1.8" /><line x1="12" y1="6" x2="12" y2="22" stroke={c} strokeWidth="1.5" /></svg>;
const CheckIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="1.8" /><path d="M8 12l3 3 5-5" stroke={c} strokeWidth="2" /></svg>;
const BulbIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 21h6M12 3a6 6 0 00-3.5 10.9V17h7v-3.1A6 6 0 0012 3z" stroke={c} strokeWidth="1.8" /></svg>;
const MeetIcon = ({ s = 22, c = C.dark }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M17 20H7a2 2 0 01-2-2V6a2 2 0 012-2h6l6 6v8a2 2 0 01-2 2z" stroke={c} strokeWidth="1.8" /><path d="M9 13h6M9 17h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>;
const AIIcon = ({ s = 16, c = C.orange }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>;

/* ================================================================
   STICKY NOTE (with selection support)
   ================================================================ */
const Sticky = ({ text, date, color, rotation, selectable, selected, onSelect }) => (
  <div onClick={selectable ? onSelect : undefined} style={{
    width: "calc(50% - 8px)", minHeight: 105, padding: 12, background: color, borderRadius: 2,
    boxShadow: selected ? `0 0 0 2px ${C.orange}, 2px 3px 8px rgba(0,0,0,0.15)` : "2px 3px 8px rgba(0,0,0,0.1)",
    transform: `rotate(${selected ? 0 : rotation}deg)${selected ? " scale(1.03)" : ""}`,
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    transition: "all 0.2s", cursor: selectable ? "pointer" : "default", position: "relative",
  }}
    onMouseEnter={e => { if (!selectable) e.currentTarget.style.transform = "rotate(0deg) scale(1.04)"; }}
    onMouseLeave={e => { if (!selectable && !selected) e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`; }}>
    {selectable && (
      <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 3, border: `2px solid ${selected ? C.orange : "rgba(0,0,0,0.15)"}`, background: selected ? C.orange : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected && <svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" fill="none" /></svg>}
      </div>
    )}
    <p style={{ fontFamily: "'Caveat',cursive", fontSize: 14, color: C.dark, lineHeight: 1.4, margin: 0 }}>{text}</p>
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.brown, alignSelf: "flex-end", marginTop: 6 }}>{date}</span>
  </div>
);

const TodoRow = ({ text, done, onToggle, onDelete }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: done ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.5)", borderRadius: 6, marginBottom: 6, border: "1px solid rgba(0,0,0,0.04)" }}>
    <div onClick={onToggle} style={{ width: 22, height: 22, borderRadius: 4, flexShrink: 0, border: `2px solid ${done ? C.olive : C.brown}`, background: done ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      {done && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>}
    </div>
    <span onClick={onToggle} style={{ fontFamily: "'Lora',serif", fontSize: 15, color: done ? C.lbrown : C.dark, textDecoration: done ? "line-through" : "none", flex: 1, cursor: "pointer" }}>{text}</span>
    {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", opacity: 0.4, transition: "opacity 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.4}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>
    </button>}
  </div>
);

/* ================================================================
   CALENDAR MONTH VIEW — grid layout, no sidebar
   ================================================================ */
const CalendarMonth = ({ year, month, monthLabel, entries, onBack, onDayClick }) => {
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

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "0 4px" }}>
      {/* Back + Month header */}
      <div style={{ display: "flex", alignItems: "center", padding: "2px 8px 6px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "4px 0" }}>← 书架</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, fontStyle: "italic", color: C.dark }}>{enNames[mo] || month}</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, marginLeft: 8 }}>{year}</span>
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
const DiaryDetail = ({ dayNum, dateKey, monthLabel, entry, onBack, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.text || "");

  // sync if entry changes
  const entryTitle = entry?.title || "";
  const entryText = entry?.text || "";
  if (!editing && title !== entryTitle) setTitle(entryTitle);
  if (!editing && text !== entryText) setText(entryText);

  return (
    <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: C.brown, padding: "8px 0", textAlign: "left" }}>← 返回月历</button>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{dayNum}</span>
        <span style={{ fontFamily: "'Caveat',cursive", fontSize: 16, color: C.brown }}>{monthLabel}</span>
      </div>
      {entry ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {editing ? (
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, background: "rgba(255,255,255,0.5)", border: `1px solid ${C.gold}`, borderRadius: 6, padding: "8px 10px", outline: "none" }} />
          ) : (
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: C.dark, margin: 0 }}>{entry.title}</h3>
          )}
          {entry.img && (
            <div style={{ width: "100%", height: 140, borderRadius: 8, overflow: "hidden", background: `linear-gradient(135deg, ${C.warm}, ${C.cream})`, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 48 }}>{entry.img}</div>
            </div>
          )}
          {editing ? (
            <textarea value={text} onChange={e => setText(e.target.value)} style={{ fontFamily: "'Lora',serif", fontSize: 14, color: C.dark, lineHeight: 1.7, background: "rgba(255,255,255,0.5)", border: `1px solid ${C.gold}`, borderRadius: 6, padding: 10, outline: "none", flex: 1, resize: "none", minHeight: 120 }} />
          ) : (
            <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: C.dark, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{entry.text}</p>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingBottom: 8 }}>
            {editing ? (<>
              <button onClick={() => { onUpdate({ ...entry, title, text }); setEditing(false); }} style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600 }}>保存</button>
              <button onClick={() => { setTitle(entry.title); setText(entry.text); setEditing(false); }} style={{ padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.06)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>取消</button>
            </>) : (<>
              <button onClick={() => setEditing(true)} style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={C.brown} strokeWidth="2"/></svg>编辑
              </button>
              <button style={{ padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(0,0,0,0.05)", color: C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={C.brown} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={C.brown} strokeWidth="2" strokeLinecap="round"/></svg>添加图片
              </button>
              {onDelete && <button onClick={() => { if (confirm("确定删除这篇日记？")) { onDelete(); onBack(); } }} style={{ padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(180,40,40,0.08)", color: "#A03030", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#A03030" strokeWidth="1.8" strokeLinecap="round"/></svg>删除
              </button>}
            </>)}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>这一天还没有日记</div>
          <button onClick={() => onUpdate({ title: "新的一天", text: "", img: null })} style={{ padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.gold, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, boxShadow: "0 3px 10px rgba(200,160,96,0.3)" }}>开始写日记</button>
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
  const [rec, setRec] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [t, setT] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRec = useRef(null);
  const audioChunks = useRef([]);
  const [dv, setDv] = useState("shelf");
  const [sm, setSm] = useState(null); // { year, month } for calendar
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const iv = useRef(null);

  // Diary entries keyed by "YYYY-MM-DD"
  const [diaryEntries, setDiaryEntries] = useState({
    "2026-03-22": { title: "春天来了", text: "今天阳光很好，出去散了步。", img: "🌸" },
    "2026-03-18": { title: "项目进展", text: "完成了第一版设计稿，反馈积极。", img: "💻" },
    "2026-03-12": { title: "周末野餐", text: "和朋友去了公园，带了三明治和咖啡。", img: "🌳" },
    "2026-02-14": { title: "情人节", text: "收到了意外的惊喜。", img: "💝" },
    "2026-02-05": { title: "读完了一本书", text: "关于设计思维的书，收获很多。", img: "📖" },
    "2026-01-25": { title: "生日快乐", text: "收到了很多祝福，蛋糕是提拉米苏。", img: "🎂" },
    "2026-01-18": { title: "项目启动", text: "新项目正式开始了，很期待。", img: null },
    "2026-01-05": { title: "年度计划", text: "定下了今年的目标和计划。", img: "📋" },
    "2026-01-01": { title: "新年第一天", text: "新的开始，希望一切顺利。", img: "🎆" },
    "2025-12-25": { title: "圣诞节", text: "和家人一起度过了温暖的一天。", img: "🎄" },
    "2025-11-20": { title: "秋日记录", text: "落叶很美，拍了很多照片。", img: "🍂" },
  });

  const [todos, setTodos] = useState([
    { text: "完成语音日记 App 设计稿", done: false, date: "2026-03-23" },
    { text: "提交产品文档", done: false, date: "2026-03-23" },
    { text: "买咖啡豆", done: true, date: "2026-03-22" },
    { text: "回复客户邮件", done: true, date: "2026-03-22" },
    { text: "整理会议录音", done: false, date: "2026-03-22" },
    { text: "周五前提交报告", done: false, date: "2026-03-20" },
    { text: "预约牙医", done: true, date: "2026-03-20" },
    { text: "给妈妈打电话", done: true, date: "2026-03-18" },
    { text: "更新项目排期", done: false, date: "2026-03-18" },
    { text: "写周报", done: true, date: "2026-03-15" },
    { text: "整理书桌", done: true, date: "2026-03-12" },
    { text: "买生日礼物", done: true, date: "2026-03-10" },
    { text: "准备演示 PPT", done: false, date: "2026-03-08" },
    { text: "修复登录 Bug", done: true, date: "2026-03-08" },
    { text: "健身一小时", done: true, date: "2026-03-05" },
    { text: "读完设计书第三章", done: false, date: "2026-03-03" },
    { text: "确认合同细节", done: true, date: "2026-03-01" },
    { text: "更新简历", done: true, date: "2026-02-20" },
    { text: "准备年会材料", done: false, date: "2026-02-15" },
    { text: "年度计划制定", done: true, date: "2026-01-05" },
  ]);
  const [todoView, setTodoView] = useState("list"); // list | calendar | day
  const [todoCalMonth, setTodoCalMonth] = useState(2); // 0-indexed, default March
  const [todoCalYear, setTodoCalYear] = useState(2026);
  const [todoSelDay, setTodoSelDay] = useState(null); // "YYYY-MM-DD"
  const [newTodoText, setNewTodoText] = useState("");

  const allIdeas = [
    { text: "做一个复古风格的音乐播放器", date: "03.22", month: "2026-03", color: "#FFF9C4", rotation: -2 },
    { text: "咖啡馆里听到的旋律很美", date: "03.20", month: "2026-03", color: "#FFE0B2", rotation: 1.5 },
    { text: "用声音记录梦境", date: "03.18", month: "2026-03", color: "#C8E6C9", rotation: -1 },
    { text: "播客idea：声音工作者", date: "03.15", month: "2026-03", color: "#BBDEFB", rotation: 2 },
    { text: "Braun T3 设计语言", date: "02.12", month: "2026-02", color: "#F8BBD0", rotation: -1.5 },
    { text: "AI整理语音笔记", date: "02.10", month: "2026-02", color: "#E1BEE7", rotation: 1 },
    { text: "开一个设计播客", date: "01.20", month: "2026-01", color: "#B2DFDB", rotation: -2 },
    { text: "复古家具改造计划", date: "01.08", month: "2026-01", color: "#FFCCBC", rotation: 1.5 },
  ];
  const [ideaSelected, setIdeaSelected] = useState([]);
  const [ideaAIMode, setIdeaAIMode] = useState(false);
  const [ideaAIPrompt, setIdeaAIPrompt] = useState("");
  const [ideaAIResult, setIdeaAIResult] = useState("");

  const [meetings, setMeetings] = useState([
    { id: 1, title: "Q1 项目复盘会", date: "03.22", duration: "45:20", hasMinutes: true, minutes: "1. 确认下阶段目标和排期\n2. 设计方案需周五前定稿\n3. 待办：@张三 完成用户调研\n4. 技术栈选型讨论延期到下周" },
    { id: 2, title: "产品需求评审", date: "03.18", duration: "32:15", hasMinutes: true, minutes: "1. V2.0 新增会议录音功能\n2. 灵感模块接入 AI 合成\n3. 优先级：P0 录音核心流程" },
    { id: 3, title: "团队周会", date: "03.15", duration: "28:40", hasMinutes: false, minutes: "" },
  ]);
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

  // Start real browser recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect Safari for compatibility
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      // Safari only supports audio/mp4, other browsers support webm
      let mimeType = 'audio/webm';
      if (isSafari || !MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          mimeType = 'audio/aac';
        } else {
          // Fallback to default (browser will choose)
          mimeType = '';
        }
      }

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      audioChunks.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      mr.start(1000);
      mediaRec.current = mr;
      setRec(true); setT(0); setTranscript("");
    } catch (e) {
      console.error('Recording error:', e);
      alert("无法访问麦克风，请允许录音权限");
    }
  };

  const onRed = () => {
    if (!rec && !paused && !showSave) { startRecording(); }
    else if (rec) { mediaRec.current?.pause(); setRec(false); setPaused(true); }
  };
  const onResume = () => { mediaRec.current?.resume(); setPaused(false); setRec(true); };

  const onFinish = async () => {
    setPaused(false);
    // Stop recording and get audio blob
    if (mediaRec.current && mediaRec.current.state !== 'inactive') {
      mediaRec.current.stop();
      mediaRec.current.stream?.getTracks().forEach(t => t.stop());
    }
    setTranscribing(true);
    // Wait a tick for final data
    await new Promise(r => setTimeout(r, 300));

    // Detect Safari and use appropriate mime type
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const mimeType = isSafari ? 'audio/mp4' : 'audio/webm';
    const blob = new Blob(audioChunks.current, { type: mimeType });

    // Try Web Speech API first (works in Safari with fallback)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true;
        recognition.interimResults = false;

        let transcriptText = '';
        recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcriptText += event.results[i][0].transcript;
          }
        };

        recognition.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
          // Fall through to backend ASR or manual input
        };

        recognition.onend = () => {
          if (transcriptText) {
            setTranscript(transcriptText);
          } else {
            setTranscript("（语音识别未返回结果，可手动输入）");
          }
          setTranscribing(false);
          setShowSave(true);
        };

        // Start recognition - note: this requires microphone permission again
        // For recorded audio, we need to use backend ASR
        // So we'll skip this and use backend ASR or manual fallback
        recognition.start();
        return;
      } catch (e) {
        console.log('Web Speech API failed:', e);
      }
    }

    // Backend ASR fallback
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Check if ASR endpoint is available
      const res = await fetch('/api/asr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, format: isSafari ? 'mp4' : 'webm' }),
      });

      if (!res.ok) {
        throw new Error(`ASR endpoint returned ${res.status}`);
      }

      const data = await res.json();
      setTranscript(data.text || "（未识别到语音内容）");
    } catch (e) {
      console.error('ASR error:', e);
      // Graceful fallback - allow manual entry
      setTranscript("");
    }
    setTranscribing(false);
    setShowSave(true);
  };

  const doSave = x => {
    // Save transcript to the target module
    const now = new Date().toISOString().slice(0, 10);
    if (x === "diary" && transcript) {
      setDiaryEntries(prev => ({ ...prev, [now]: { title: transcript.slice(0, 20) + "...", text: transcript, img: null } }));
    } else if (x === "todo" && transcript) {
      setTodos(prev => [{ text: transcript, done: false, date: now }, ...prev]);
    } else if (x === "meeting" && transcript) {
      const newId = Date.now();
      setMeetings(prev => [{ id: newId, title: transcript.slice(0, 15) + "...", date: now.slice(5).replace('-', '.'), duration: fm(t), hasMinutes: false, minutes: "", transcript }, ...prev]);
    }
    setShowSave(false); setT(0); setTranscript(""); setTab(x);
  };
  const rst = () => { setRec(false); setPaused(false); setShowSave(false); setT(0); setTranscript(""); setTranscribing(false); if (mediaRec.current?.state !== 'inactive') { try { mediaRec.current?.stop(); mediaRec.current?.stream?.getTracks().forEach(t => t.stop()); } catch(e){} } };
  const handleTab = (key) => setTab(key);
  const goHome = () => { setTab("record"); rst(); setDv("shelf"); setSm(null); setSelectedDay(null); setSelectedDateKey(null); };
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
          {/* Transcript preview / edit */}
          <div style={{ padding: "8px 12px", marginBottom: 14, borderRadius: 6, background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.gold, fontWeight: 600, marginBottom: 4 }}>{transcribing ? "识别中..." : (transcript ? "语音转写" : "手动输入")}</div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder={transcribing ? "语音识别中..." : "可在此编辑或输入内容..."}
              disabled={transcribing}
              style={{
                width: "100%",
                minHeight: 60,
                maxHeight: 120,
                border: "none",
                background: "transparent",
                resize: "vertical",
                fontFamily: "'Lora',serif",
                fontSize: 12,
                color: C.dark,
                lineHeight: 1.5,
                outline: "none"
              }}
            />
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
  const pgDiary = () => {
    // Level 4: Day detail
    if (dv === "detail" && selectedDay && sm) {
      return <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DiaryDetail dayNum={selectedDay} dateKey={selectedDateKey} monthLabel={`${sm.month} ${sm.year}`}
          entry={diaryEntries[selectedDateKey]}
          onBack={() => { setDv("month"); setSelectedDay(null); setSelectedDateKey(null); }}
          onUpdate={(updated) => { setDiaryEntries(prev => ({ ...prev, [selectedDateKey]: updated })); }}
          onDelete={() => { setDiaryEntries(prev => { const n = { ...prev }; delete n[selectedDateKey]; return n; }); }}
        />
      </div>;
    }
    // Level 3: Calendar month
    if (dv === "month" && sm) {
      return <CalendarMonth year={sm.year} month={sm.month} monthLabel={`${sm.year}年${sm.month}`}
        entries={diaryEntries}
        onBack={() => { setDv("shelf"); setSm(null); }}
        onDayClick={(day, key) => { setSelectedDay(day); setSelectedDateKey(key); setDv("detail"); }}
      />;
    }
    // Level 1-2: Shelf
    const shelves = [
      { y: "2026", t: [{ label: "Mar", month: "三月", color: "clear" }, { label: "Feb", month: "二月", color: "smoke" }, { label: "Jan", month: "一月", color: "amber" }] },
      { y: "2025", t: [{ label: "Dec", month: "十二月", color: "dark" }, { label: "Nov", month: "十一月", color: "olive" }, { label: "Oct", month: "十月", color: "clear" }, { label: "Sep", month: "九月", color: "smoke" }, { label: "Aug", month: "八月", color: "amber" }] },
    ];
    const q = searchDiary.toLowerCase();
    const filtered = q ? shelves.map(s => ({ ...s, t: s.t.filter(t => t.month.includes(q) || t.label.toLowerCase().includes(q) || s.y.includes(q)) })).filter(s => s.t.length > 0) : shelves;
    return <div style={{ flex: 1, padding: "0 12px" }}>
      <SubHeader title="日记书架" search={searchDiary} setSearch={setSearchDiary} />
      {filtered.length === 0 && q && <div style={{ textAlign: "center", padding: 30, fontFamily: "'Caveat',cursive", fontSize: 16, color: C.lbrown }}>没有找到「{searchDiary}」相关的日记</div>}
      {filtered.map((s, i) => <ShelfRow key={i} year={s.y} tapes={s.t} onTap={x => { setDv("month"); setSm({ year: s.y, month: x.month }); }} />)}
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
        {results.map((x, i) => <TodoRow key={i} text={x.text} done={x.done} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: !x.done }; setTodos(n); }} onDelete={() => setTodos(todos.filter(t => t !== x))} />)}
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
        {dayItems.filter(x => !x.done).map((x, i) => <TodoRow key={i} text={x.text} done={false} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: true }; setTodos(n); }} onDelete={() => setTodos(todos.filter(t => t !== x))} />)}
        {dayItems.filter(x => x.done).length > 0 && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, letterSpacing: "0.15em", marginBottom: 8, marginTop: 12 }}>已完成</div>}
        {dayItems.filter(x => x.done).map((x, i) => <TodoRow key={i} text={x.text} done={true} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: false }; setTodos(n); }} onDelete={() => setTodos(todos.filter(t => t !== x))} />)}
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
        {todos.filter(x => !x.done).map((x, i) => <TodoRow key={i} text={x.text} done={false} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: true }; setTodos(n); }} onDelete={() => setTodos(todos.filter(t => t !== x))} />)}
      </div>

      {/* Done */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.lbrown, letterSpacing: "0.15em", marginBottom: 8 }}>已完成 ({todos.filter(x => x.done).length})</div>
        {todos.filter(x => x.done).map((x, i) => <TodoRow key={i} text={x.text} done={true} onToggle={() => { const idx = todos.indexOf(x); const n = [...todos]; n[idx] = { ...x, done: false }; setTodos(n); }} onDelete={() => setTodos(todos.filter(t => t !== x))} />)}
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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button onClick={() => { setIdeaAIMode(!ideaAIMode); setIdeaSelected([]); setIdeaAIResult(""); setIdeaAIPrompt(""); }}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: ideaAIMode ? C.orange : "rgba(0,0,0,0.06)", color: ideaAIMode ? "#fff" : C.brown, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, transition: "all 0.2s" }}>
          <AIIcon s={12} c={ideaAIMode ? "#fff" : C.orange} />{ideaAIMode ? "退出 AI" : "AI 合成"}
        </button>
      </div>
      {sortedMonths.map(month => (
        <div key={month} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.gold, boxShadow: "0 0 0 3px rgba(200,160,96,0.2)" }} />
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: "0.1em" }}>{monthLabels[month] || month}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingLeft: 18 }}>
            {grouped[month].map((idea, i) => {
              const gIdx = allIdeas.indexOf(idea);
              return <Sticky key={i} {...idea} selectable={ideaAIMode} selected={ideaSelected.includes(gIdx)} onSelect={() => toggleSelect(gIdx)} />;
            })}
          </div>
        </div>
      ))}
      {ideaAIMode && ideaSelected.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 14, border: "1px solid rgba(212,114,42,0.2)", marginTop: 4 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: C.orange, fontWeight: 600, marginBottom: 8 }}>已选 {ideaSelected.length} 条灵感</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {ideaSelected.map(idx => <span key={idx} style={{ padding: "3px 8px", borderRadius: 3, fontSize: 10, fontFamily: "'Caveat',cursive", background: allIdeas[idx].color, color: C.dark, boxShadow: "1px 1px 2px rgba(0,0,0,0.08)" }}>{allIdeas[idx].text.slice(0, 10)}...</span>)}
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
        <button onClick={() => { if (confirm("确定删除此会议录音？")) { setMeetings(prev => prev.filter(x => x.id !== meetingDetail)); setMeetingDetail(null); } }}
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
      <TP22Bar activeTab={tab} onTab={handleTab} />
    </div>
  );
}
