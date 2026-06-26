import React, { useState, useRef, useEffect } from 'react';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const p2 = (n: number) => String(n).padStart(2, '0');

/** Format YYYY-MM-DD → "05-Jun-26" */
export function fmtDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${p2(d)}-${MS[m - 1]}-${String(y).slice(2)}`;
}

/* ── Calendar picker ──────────────────────────────────────────────────────── */
export function DateTimePicker({
  value,
  onConfirm,
}: {
  value: string;
  onConfirm: (v: string) => void;
}) {
  const today = new Date();
  const init = value ? new Date(value + 'T00:00') : today;
  const safe = isNaN(init.getTime()) ? today : init;

  const [viewYear,  setViewYear]  = useState(safe.getFullYear());
  const [viewMonth, setViewMonth] = useState(safe.getMonth());
  const [selDay,    setSelDay]    = useState<number | null>(value ? safe.getDate() : null);
  const [mode,      setMode]      = useState<'day' | 'month' | 'year'>('day');
  const [yrStart,   setYrStart]   = useState(safe.getFullYear() - 10);

  const daysInMo   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow   = new Date(viewYear, viewMonth, 1).getDay();
  const prevMoDays = new Date(viewYear, viewMonth, 0).getDate();
  const cells: { day: number; t: 'p' | 'c' | 'n' }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMoDays - i, t: 'p' });
  for (let d = 1; d <= daysInMo; d++)     cells.push({ day: d, t: 'c' });
  for (let nd = 1; cells.length < 42; nd++) cells.push({ day: nd, t: 'n' });

  const navMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
  };

  const ChevSvg = ({ dir }: { dir: 'l' | 'r' }) => (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
      <path d={dir === 'l' ? 'M13 4l-6 6 6 6' : 'M7 4l6 6-6 6'} stroke="#0e1b3d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const TriUp = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="5,2 9,8 1,8" /></svg>
  );
  const TriDown = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="1,2 9,2 5,8" /></svg>
  );
  const NavBtn = ({ onClick, ch }: { onClick: () => void; ch: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
               border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4, flexShrink: 0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {ch}
    </button>
  );

  const pillBtn = (label: string | number, isActive: boolean, activeBg: string, onClick: () => void) => (
    <button type="button" onClick={onClick}
      style={{
        padding: '10px 0', borderRadius: 20, border: 'none', width: '100%',
        background: isActive ? activeBg : 'transparent',
        color: isActive ? '#fff' : '#0e1b3d',
        fontWeight: isActive ? 700 : 400,
        fontSize: 14, cursor: 'pointer', transition: 'background 0.1s', fontFamily: FONT,
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#e8f0ff'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {label}
    </button>
  );

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : navMonth(-1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'month' ? 'day' : 'month')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'month' ? '#e8ecf4' : 'transparent' }}>
          {MS[viewMonth]}{mode === 'month' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : navMonth(1)} ch={<ChevSvg dir="r" />} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : setViewYear(y => y - 1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'year' ? 'day' : 'year')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'year' ? '#e8ecf4' : 'transparent' }}>
          {viewYear}{mode === 'year' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : setViewYear(y => y + 1)} ch={<ChevSvg dir="r" />} />
      </div>
    </div>
  );

  const monthGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 12px' }}>
      {MS.map((m, i) => pillBtn(m, i === viewMonth, '#3a4a6b', () => { setViewMonth(i); setMode('day'); }))}
    </div>
  );

  const years = Array.from({ length: 21 }, (_, i) => yrStart + i);
  const yearGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px 8px' }}>
      {years.map(y => pillBtn(y, y === viewYear, '#5b7de8', () => { setViewYear(y); setMode('day'); }))}
    </div>
  );

  const dayGrid = (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#697498', paddingBottom: 6 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map((cell, i) => {
          const isCur = cell.t === 'c';
          const isSel = isCur && selDay === cell.day;
          return (
            <button key={i} type="button"
              onClick={() => { if (isCur) setSelDay(cell.day); }}
              style={{
                height: 36, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, borderRadius: '50%', border: 'none',
                background: isSel ? '#1360d2' : 'transparent',
                color: isSel ? '#fff' : isCur ? '#0e1b3d' : '#c8d0e0',
                fontWeight: isSel ? 700 : 400,
                cursor: isCur ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (isCur && !isSel) e.currentTarget.style.background = '#e8f0ff'; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div style={{ width: 300, fontFamily: FONT }}>
      {header}
      {mode === 'month' ? monthGrid : mode === 'year' ? yearGrid : dayGrid}
      <button type="button"
        onClick={() => {
          if (!selDay) return;
          onConfirm(`${viewYear}-${p2(viewMonth + 1)}-${p2(selDay)}`);
        }}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 8, marginTop: 16,
          fontSize: 15, fontWeight: 600, color: 'white', border: 'none',
          background: selDay ? '#3a5fd9' : '#a6c2e9',
          cursor: selDay ? 'pointer' : 'not-allowed',
          fontFamily: FONT,
        }}>
        Confirm
      </button>
    </div>
  );
}

/* ── Reusable DateInput field ─────────────────────────────────────────────── */

const CalIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/**
 * DateInput — floating-label style date field that opens the custom calendar.
 * value / onChange use ISO YYYY-MM-DD format.
 */
export function DateInput({
  label,
  value,
  onChange,
  required,
  style,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const hasVal = !!value;

  /* floating label style — always floated when value set or open */
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: 12,
    top: hasVal || open ? 8 : '50%',
    transform: hasVal || open ? 'none' : 'translateY(-50%)',
    fontSize: hasVal || open ? 11 : 16,
    color: open ? '#1360d2' : hasVal ? '#697498' : '#b0b8d0',
    pointerEvents: 'none',
    transition: 'all 0.15s',
    fontFamily: FONT,
    fontWeight: hasVal || open ? 500 : 400,
    lineHeight: 1,
  };

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} style={style}>
      {/* Trigger field */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          height: 56, border: `1.5px solid ${open ? '#1360d2' : '#d5ddfb'}`,
          borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'flex-end',
          paddingLeft: 12, paddingRight: 12, paddingBottom: 8, cursor: 'pointer',
          justifyContent: 'space-between', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}>
        <span style={{ fontSize: 16, color: hasVal ? '#0e1b3d' : 'transparent', fontFamily: FONT, lineHeight: 1 }}>
          {hasVal ? fmtDate(value) : 'placeholder'}
        </span>
        <CalIcon />
      </div>
      {/* Floating label */}
      <span style={labelStyle}>
        {required && <span style={{ color: '#e8212e' }}>*</span>}{label}
      </span>
      {/* Calendar popup */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 600,
          background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5',
          padding: 20, minWidth: 340,
          boxShadow: '0 8px 32px rgba(14,27,61,0.16)',
        }}>
          <DateTimePicker
            value={value}
            onConfirm={v => { onChange(v); setOpen(false); }}
          />
          {hasVal && (
            <button type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                marginTop: 8, width: '100%', background: 'none', border: 'none',
                color: '#1360d2', fontSize: 13, cursor: 'pointer', fontFamily: FONT,
              }}>
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DateInputOutlined — outlined-at-top label style (label sits on the border line).
 * Matches the CargoTransfer / inline-bordered pattern.
 */
export function DateInputOutlined({
  label,
  value,
  onChange,
  style,
  className,
  labelColor,
  font: fontOverride,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  className?: string;
  labelColor?: string;
  font?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const f = fontOverride ?? FONT;

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} style={style}>
      <div style={{
        height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`,
        borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center',
        paddingLeft: 16, paddingRight: 0, cursor: 'pointer', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}
        onClick={() => setOpen(o => !o)}>
        <span style={{ flex: 1, fontSize: 16, color: value ? '#051937' : '#b0b8d0', fontFamily: f }}>
          {value ? fmtDate(value) : ''}
        </span>
        <div style={{ width: 48, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CalIcon />
        </div>
      </div>
      <label style={{
        position: 'absolute', left: 13, top: -8, background: '#fff', padding: '0 4px',
        fontSize: 12, color: labelColor ?? '#060c28', fontFamily: f, pointerEvents: 'none',
      }}>
        {label}
      </label>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 600,
          background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5',
          padding: 20, minWidth: 340,
          boxShadow: '0 8px 32px rgba(14,27,61,0.16)',
        }}>
          <DateTimePicker
            value={value}
            onConfirm={v => { onChange(v); setOpen(false); }}
          />
          {value && (
            <button type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                marginTop: 8, width: '100%', background: 'none', border: 'none',
                color: '#1360d2', fontSize: 13, cursor: 'pointer', fontFamily: f,
              }}>
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
