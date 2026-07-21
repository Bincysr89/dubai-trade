import React, { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';
import { fmtDateTime } from './DatePicker';

const font = "'Dubai', sans-serif";

/* ─── Floating-label helpers ─── */
function FInput({ label, value, onChange, req, placeholder, disabled, trailing, textarea }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean; trailing?: React.ReactNode; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Tag value={value} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: textarea ? 84 : 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: trailing ? '0 44px 0 12px' : (textarea ? '10px 12px' : '0 12px'), fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms', resize: 'none' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : (textarea ? 14 : '50%'), transform: floated ? 'none' : (textarea ? 'none' : 'translateY(-50%)'),
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {trailing && <div style={{ position: 'absolute', right: 8, top: textarea ? 14 : '50%', transform: textarea ? 'none' : 'translateY(-50%)' }}>{trailing}</div>}
    </div>
  );
}

function FSelect({ label, value, onChange, options, req, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: disabled ? 'default' : 'pointer', background: disabled ? '#f0f3fa' : '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        {!disabled && (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: open ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && !disabled && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="5.5" /><path d="M14 14l4 4" /></svg>
);

/* ─── Modal shell (kept only for the full Flight Search popup) ─── */
function ModalShell({ title, subtitle, width = 760, onClose, children, footer }: {
  title: string; subtitle?: string; width?: number; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: width, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div>
            <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0 }}>{title}</p>
            {subtitle && <p className="text-[13px] text-[#a7c3eb]" style={{ margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {children}
        </div>
        {footer && <div style={{ flexShrink: 0, borderTop: '1px solid #eef1f6', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Flight data + smart-search combo ─────────────────────────── */
type FlightHit = { flightNo: string; arrDep: string; scheduleDate: string };
// scheduleDate uses the "YYYY-MM-DD HH:mm" format DateInput/fmtDateTime expect.
const FLIGHT_HITS: FlightHit[] = [
  { flightNo: 'EK1234', arrDep: 'Arrival',   scheduleDate: '2025-08-01 08:00' },
  { flightNo: 'EK0055', arrDep: 'Departure', scheduleDate: '2025-08-01 11:40' },
  { flightNo: 'QR0815', arrDep: 'Arrival',   scheduleDate: '2025-08-02 14:10' },
  { flightNo: 'EY0171', arrDep: 'Arrival',   scheduleDate: '2025-08-02 19:25' },
];

function FlightSearchPopup({ onSelect, onClose }: { onSelect: (f: FlightHit) => void; onClose: () => void }) {
  const [flightNo, setFlightNo] = useState('');
  const [arrDep, setArrDep] = useState('All');
  const results = FLIGHT_HITS.filter(f =>
    (!flightNo.trim() || f.flightNo.toLowerCase().includes(flightNo.trim().toLowerCase())) &&
    (arrDep === 'All' || f.arrDep === arrDep));
  return (
    <ModalShell title="Search Flight" onClose={onClose}>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Criteria</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <FInput label="Flight Number" value={flightNo} onChange={setFlightNo} />
          <FSelect label="Arrival/Departure" value={arrDep} onChange={setArrDep} options={['All', 'Arrival', 'Departure']} />
        </div>
        <div className="flex gap-[10px] mt-[14px]">
          <button type="button" onClick={() => { setFlightNo(''); setArrDep('All'); }}
            className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Reset</button>
        </div>
      </div>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Results</p>
        <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {['Flight Number', 'Arrival/Departure', 'Flight Schedule Date', 'Action'].map(h => (
                  <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={4} className="text-[16px] text-[#697498]" style={{ padding: 20, textAlign: 'center' }}>No flights found.</td></tr>
              ) : results.map(f => (
                <tr key={f.flightNo} style={{ borderTop: '1px solid #eef1f6' }}>
                  <td className="text-[16px] text-[#1360d2]" style={{ padding: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{f.flightNo}</td>
                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap' }}>{f.arrDep}</td>
                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap' }}>{fmtDateTime(f.scheduleDate)}</td>
                  <td style={{ padding: 12 }}>
                    <button type="button" onClick={() => onSelect(f)} aria-label={`Select ${f.flightNo}`}
                      className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#e8f0ff] transition-colors" style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalShell>
  );
}

function FlightNumberCombo({ value, onSelect, onOpenPopup, locked }: {
  value: string; onSelect: (f: FlightHit) => void; onOpenPopup: () => void; locked: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const matches = FLIGHT_HITS.filter(f => !q || f.flightNo.toLowerCase().includes(q));

  return (
    <div className="relative">
      <input
        value={locked ? value : query}
        onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true); }}
        onFocus={() => !locked && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        readOnly={locked}
        placeholder="e.g. EK1234"
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, padding: '0 52px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: locked ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font }}>
        <span style={{ color: '#dc3545' }}>*</span>Flight Number
      </span>
      <button type="button" onClick={onOpenPopup} tabIndex={-1}
        className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
        <SearchIcon />
      </button>
      {!locked && open && matches.length > 0 && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {matches.map(f => (
            <button key={f.flightNo} type="button" onMouseDown={() => { onSelect(f); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}>
              <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{f.flightNo}</span>
              <span style={{ color: '#697498' }}> — {f.arrDep} — {fmtDateTime(f.scheduleDate)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Airport smart-search combo — single field, code + name shown together ─── */
type AirportHit = { code: string; name: string };
const AIRPORT_NAMES: Record<string, string> = {
  DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport', LHR: 'London Heathrow Airport',
  JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport', MAA: 'Chennai (ex Madras)',
};

function AirportCombo({ label, code, name, onSelect, req, disabled }: {
  label: string; code: string; name: string; onSelect: (a: AirportHit) => void; req?: boolean; disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selected = !!code;
  const q = query.trim().toLowerCase();
  const matches = Object.entries(AIRPORT_NAMES).filter(([c, n]) =>
    !q || c.toLowerCase().includes(q) || n.toLowerCase().includes(q));
  const displayValue = selected && !open ? `${code} — ${name}` : query;

  return (
    <div className="relative">
      <input
        value={displayValue}
        onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true); }}
        onFocus={() => { if (!disabled) { setOpen(true); if (selected) setQuery(''); } }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        disabled={disabled}
        placeholder="e.g. MAA"
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, padding: '0 52px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {!disabled && (
        <button type="button" onClick={() => setOpen(o => !o)} tabIndex={-1}
          className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
          <SearchIcon />
        </button>
      )}
      {!disabled && open && matches.length > 0 && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {matches.map(([c, n]) => (
            <button key={c} type="button" onMouseDown={() => { onSelect({ code: c, name: n }); setQuery(''); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}>
              <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{c}</span>
              <span style={{ color: '#697498' }}> — {n}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Types for the unloading-airport + AWB flow ────────────────── */
export type AwbLine = {
  id: string; awbNo: string; goodsDescription: string; weight: string; weightUnit: string;
  shipperName: string; pieces: string; shipmentDescCode: string; consigneeName: string;
  originCode: string; originName: string; destCode: string; destName: string;
};
const BLANK_AWB: Omit<AwbLine, 'id'> = {
  awbNo: '', goodsDescription: '', weight: '', weightUnit: 'KG', shipperName: '', pieces: '',
  shipmentDescCode: 'Total Consignment', consigneeName: '', originCode: '', originName: '', destCode: '', destName: '',
};
export type UnloadingAirportRow = { id: string; airportCode: string; airportName: string; nilCargo: string; lines: AwbLine[] };

/* ─── Add Airport of Unloading — full page (not a modal) ────────── */
function AddUnloadingPage({ existing, onBack, onSave }: {
  existing: UnloadingAirportRow | null; onBack: () => void; onSave: (row: UnloadingAirportRow) => void;
}) {
  const [airportCode, setAirportCode] = useState(existing?.airportCode ?? '');
  const [airportName, setAirportName] = useState(existing?.airportName ?? '');
  const [nilCargo, setNilCargo] = useState(existing?.nilCargo ?? 'No');
  const [lines, setLines] = useState<AwbLine[]>(existing?.lines ?? []);
  const [awb, setAwb] = useState<Omit<AwbLine, 'id'>>(BLANK_AWB);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);

  const setF = <K extends keyof typeof BLANK_AWB>(k: K, v: typeof BLANK_AWB[K]) => setAwb(a => ({ ...a, [k]: v }));
  const canAddLine = awb.awbNo.trim() && awb.weight.trim() && awb.pieces.trim();

  const addOrUpdateLine = () => {
    if (!canAddLine) return;
    if (editingLineId) {
      setLines(p => p.map(l => l.id === editingLineId ? { ...awb, id: editingLineId } : l));
      setEditingLineId(null);
    } else {
      setLines(p => [...p, { ...awb, id: `awb-${p.length}-${Date.now().toString(36)}` }]);
    }
    setAwb(BLANK_AWB);
  };
  const editLine = (l: AwbLine) => { setAwb(l); setEditingLineId(l.id); };
  const removeLine = (id: string) => { setLines(p => p.filter(l => l.id !== id)); if (editingLineId === id) { setEditingLineId(null); setAwb(BLANK_AWB); } };

  const canSave = airportCode.trim() && (nilCargo === 'Yes' || lines.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Flight Manifest</span>
      </div>
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Add Airport Of Unloading</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <AirportCombo label="Airport of Unloading" req code={airportCode} name={airportName}
            onSelect={a => { setAirportCode(a.code); setAirportName(a.name); }} />
          <FSelect label="Nil Cargo" value={nilCargo} onChange={setNilCargo} options={['No', 'Yes']} req />
        </div>

        {nilCargo === 'No' && (
          <>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Add Airway Bill</p>
              <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <FInput label="Airway Bill No." value={awb.awbNo} onChange={v => setF('awbNo', v)} req />
                  <FInput label="Goods Description" value={awb.goodsDescription} onChange={v => setF('goodsDescription', v)} req />
                  <FInput label="Weight" value={awb.weight} onChange={v => setF('weight', v)} req />
                  <FSelect label="Weight Unit" value={awb.weightUnit} onChange={v => setF('weightUnit', v)} options={['KG', 'LB']} req />
                  <FInput label="Shipper Name" value={awb.shipperName} onChange={v => setF('shipperName', v)} req />
                  <FInput label="Number of Pieces" value={awb.pieces} onChange={v => setF('pieces', v)} req />
                  <FSelect label="Shipment Description Code" value={awb.shipmentDescCode} onChange={v => setF('shipmentDescCode', v)} options={['Total Consignment', 'Part Consignment']} />
                  <FInput label="Consignee Name" value={awb.consigneeName} onChange={v => setF('consigneeName', v)} req />
                  <AirportCombo label="Airport/City of Origin" req code={awb.originCode} name={awb.originName}
                    onSelect={a => setAwb(x => ({ ...x, originCode: a.code, originName: a.name }))} />
                  <AirportCombo label="Airport/City of Destination" req code={awb.destCode} name={awb.destName}
                    onSelect={a => setAwb(x => ({ ...x, destCode: a.code, destName: a.name }))} />
                </div>
                <div className="flex gap-[10px]">
                  <button type="button" onClick={() => { setAwb(BLANK_AWB); setEditingLineId(null); }}
                    className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Reset</button>
                  <button type="button" onClick={addOrUpdateLine} disabled={!canAddLine}
                    className="h-[44px] px-[20px] rounded-[4px] text-[16px] text-white" style={{ background: canAddLine ? '#1360d2' : '#a7c3eb', cursor: canAddLine ? 'pointer' : 'not-allowed', fontWeight: 500, fontFamily: font }}>
                    {editingLineId ? 'Update' : '+ Add'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                List of Airway Bill of Airport of Unloading {airportCode ? `${airportCode}${airportName ? ` (${airportName})` : ''}` : ''}
              </p>
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 820 }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['Airway Bill No.', 'Origin', 'Destination', 'Weight', 'No. of Pcs', 'Shipper', 'Consignee', 'Actions'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No airway bills added yet.</td></tr>
                      ) : lines.map(l => (
                        <tr key={l.id} style={{ borderTop: '1px solid #f0f4ff', background: editingLineId === l.id ? '#f0f6ff' : undefined }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{l.awbNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.originCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.destCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.weight} {l.weightUnit}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.pieces}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.shipperName || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.consigneeName || '—'}</td>
                          <td className="px-[16px] py-[10px]">
                            <div className="flex items-center gap-[8px]">
                              <button type="button" onClick={() => editLine(l)} aria-label={`Edit ${l.awbNo}`} className="text-[#1360d2] hover:opacity-70">
                                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l4 4-9 9H5v-4z" /></svg>
                              </button>
                              <button type="button" onClick={() => removeLine(l.id)} aria-label={`Remove ${l.awbNo}`} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <button onClick={() => onSave({ id: existing?.id ?? `ua-${Date.now().toString(36)}`, airportCode, airportName, nilCargo, lines })}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Save
          </button>
        }
      />
    </div>
  );
}

/* ─── Upload manifest file (inline tab within the wizard) ───────── */
type ManifestFile = { id: string; name: string; sizeKb: string };
function formatSizeKb(bytes: number) { return `${Math.max(0.1, bytes / 1024).toFixed(1)}`; }
const MANIFEST_TYPES = ['Inbound Manifest', 'FFM', 'FWB'];

/* ─── Main page ─────────────────────────────────────────────────── */
type Step = 'flightDetails' | 'manifest' | 'addUnloading' | 'success';
type SubTab = 'manual' | 'upload';

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
};

export default function FlightManifestNewRequestPage({ onBack, onBackToListing }: Props) {
  const [step, setStep] = useState<Step>('flightDetails');
  const [subTab, setSubTab] = useState<SubTab>('manual');

  const [flightNo, setFlightNo] = useState('');
  const [arrDepType, setArrDepType] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [flightLocked, setFlightLocked] = useState(false);
  const [showFlightSearch, setShowFlightSearch] = useState(false);

  const [airportLoadingCode, setAirportLoadingCode] = useState('');
  const [airportLoadingName, setAirportLoadingName] = useState('');
  const [unloadingRows, setUnloadingRows] = useState<UnloadingAirportRow[]>([]);
  const [editingUnloadingId, setEditingUnloadingId] = useState<string | null>(null);

  const [manifestTypeUpload, setManifestTypeUpload] = useState('FFM');
  const [uploadFiles, setUploadFiles] = useState<ManifestFile[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectFlight = (f: FlightHit) => { setFlightNo(f.flightNo); setArrDepType(f.arrDep); setScheduleDate(f.scheduleDate); setFlightLocked(true); setShowFlightSearch(false); };

  const step1Valid = flightLocked;
  const canSubmitManual = airportLoadingCode.trim() && unloadingRows.length > 0;
  const canSubmitUpload = manifestTypeUpload && uploadFiles.length > 0;

  const addUploadFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 20 - uploadFiles.length).map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name, sizeKb: formatSizeKb(f.size) }));
    setUploadFiles(p => [...p, ...next]);
  };
  const removeUploadFile = (id: string) => setUploadFiles(p => p.filter(f => f.id !== id));

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Service Catalog</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Submit Cargo Information</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (step === 'addUnloading') {
    const existing = unloadingRows.find(r => r.id === editingUnloadingId) ?? null;
    return (
      <AddUnloadingPage
        existing={existing}
        onBack={() => { setStep('manifest'); setEditingUnloadingId(null); }}
        onSave={row => {
          setUnloadingRows(p => existing ? p.map(r => r.id === row.id ? row : r) : [...p, row]);
          setStep('manifest'); setEditingUnloadingId(null);
        }}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New Flight Manifest</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[56px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>Flight Manifest Request Submitted Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[16px] flex flex-col items-center gap-[6px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Dear Customer Thank You For Using Flight Manifest Request Web Application.</p>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Please Find Below Details For Future Reference</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Flight Number: {flightNo}</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Type: {subTab === 'manual' ? 'Inbound Manifest' : manifestTypeUpload}</p>
            </div>
            <div className="flex gap-[12px]">
              <button className="h-[48px] px-[24px] rounded-[4px] border text-[16px] inline-flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Download <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" /></svg>
              </button>
              <button className="h-[48px] px-[24px] rounded-[4px] border text-[16px] inline-flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Share <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="15" cy="4" r="2" /><circle cx="5" cy="10" r="2" /><circle cx="15" cy="16" r="2" /><path d="M6.7 9l6.6-3.3M6.7 11l6.6 3.3" /></svg>
              </button>
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New Flight Manifest Courier</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        {/* Flight Details — always visible; becomes read-only once a flight is selected */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Flight Details</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FlightNumberCombo value={flightNo} onSelect={selectFlight} onOpenPopup={() => setShowFlightSearch(true)} locked={flightLocked} />
            <FSelect label="Arrival/Departure" value={arrDepType} onChange={() => {}} options={['Arrival', 'Departure']} req disabled />
            <FInput label="Scheduled Date" value={scheduleDate ? fmtDateTime(scheduleDate) : ''} onChange={() => {}} disabled />
          </div>
          {step === 'flightDetails' && (
            <div>
              <button onClick={() => setStep('manifest')}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                Proceed
              </button>
            </div>
          )}
        </div>

        {step === 'manifest' && (
          <>
            {/* Add Manually / Upload Manifest File tabs — same pill pattern as Refund & Claims */}
            <div className="flex items-center gap-[8px] bg-white rounded-[6px] p-[4px] w-max" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.16)', border: '1px solid #eef1f6' }}>
              {(['manual', 'upload'] as const).map(t => (
                <button key={t} type="button" onClick={() => setSubTab(t)}
                  className="text-[15px] px-[18px] py-[9px] rounded-[4px] transition-colors"
                  style={subTab === t
                    ? { background: '#1360d2', color: '#fff', fontWeight: 500, fontFamily: font }
                    : { color: '#5a6282', fontFamily: font }}>
                  {t === 'manual' ? 'Add Manually' : 'Upload Manifest File'}
                </button>
              ))}
            </div>

            {subTab === 'manual' ? (
              <>
                <div className="flex flex-col gap-[16px]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Details</p>
                  <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                    <FSelect label="Manifest Type" value="Inbound Manifest" onChange={() => {}} options={MANIFEST_TYPES} req disabled />
                  </div>
                </div>

                <div className="flex flex-col gap-[16px]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Port Details</p>
                  <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                    <AirportCombo label="Airport of Loading" req code={airportLoadingCode} name={airportLoadingName}
                      onSelect={a => { setAirportLoadingCode(a.code); setAirportLoadingName(a.name); }} />
                  </div>
                </div>

                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between flex-wrap gap-[8px]">
                    <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Airport of Unloading</p>
                    <button onClick={() => { setEditingUnloadingId(null); setStep('addUnloading'); }}
                      className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[8px]"
                      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                      <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 2v10M2 7h10" /></svg>
                      Add Unloading Details
                    </button>
                  </div>
                  <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#a6c2e9' }}>
                          {['Airport of Unloading', 'Nil Cargo', "No. of AWB's", 'Actions'].map(h => (
                            <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {unloadingRows.length === 0 ? (
                          <tr><td colSpan={4} className="text-[16px] text-[#697498]" style={{ padding: '32px 16px', textAlign: 'center' }}>No airports of unloading added yet.</td></tr>
                        ) : unloadingRows.map(r => (
                          <tr key={r.id} style={{ borderTop: '1px solid #f0f3fa' }}>
                            <td className="text-[16px] text-[#1360d2]" style={{ padding: '14px 16px', fontWeight: 500 }}>{r.airportCode}{r.airportName ? ` (${r.airportName})` : ''}</td>
                            <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 16px' }}>{r.nilCargo}</td>
                            <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 16px' }}>{r.lines.length}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div className="flex items-center gap-[8px]">
                                <button type="button" onClick={() => { setEditingUnloadingId(r.id); setStep('addUnloading'); }}
                                  className="h-[32px] px-[12px] rounded-[4px] text-[14px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                                  Add AWB&apos;s
                                </button>
                                <button type="button" onClick={() => setUnloadingRows(p => p.filter(x => x.id !== r.id))} aria-label={`Remove ${r.airportCode}`}
                                  className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#fef2f2] transition-colors flex-shrink-0" style={{ color: '#dc3545' }}>
                                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-[16px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest File Details</p>
                <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <FSelect label="Manifest Type" value={manifestTypeUpload} onChange={setManifestTypeUpload} options={MANIFEST_TYPES} req />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-[8px]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Upload Manifest File</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="h-[42px] px-[18px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[6px]"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                    <span>+</span>Add
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept=".txt" className="hidden" onChange={e => addUploadFiles(e.target.files)} />
                </div>
                <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <p className="text-[15px] text-[#697498] mb-[12px]" style={{ fontFamily: font }}>No Of Files Added : <b style={{ color: '#0e1b3d' }}>{uploadFiles.length}</b></p>
                  <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                    <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#e2ebf9' }}>
                          {['File Name', 'File Size (KB)', 'Action'].map(h => (
                            <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadFiles.length === 0 ? (
                          <tr><td colSpan={3} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No files added yet. Click &quot;Add&quot; to select a .txt file.</td></tr>
                        ) : uploadFiles.map(f => (
                          <tr key={f.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.name}</td>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.sizeKb}</td>
                            <td className="px-[16px] py-[10px]">
                              <button onClick={() => removeUploadFile(f.id)} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {step === 'manifest' && (
        <BackToListingBar
          onBack={() => setStep('flightDetails')}
          rightContent={
            <div className="flex items-center gap-[12px]">
              <button className="h-[48px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Save As Draft
              </button>
              <button
                onClick={() => { const ok = subTab === 'manual' ? canSubmitManual : canSubmitUpload; if (ok) setStep('success'); }}
                disabled={subTab === 'manual' ? !canSubmitManual : !canSubmitUpload}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? '#1360d2' : '#a7c3eb', cursor: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500, boxShadow: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}>
                Submit
              </button>
            </div>
          }
        />
      )}
      {step === 'flightDetails' && <BackToListingBar onBackToListing={onBackToListing} />}

      {showFlightSearch && (
        <FlightSearchPopup onSelect={selectFlight} onClose={() => setShowFlightSearch(false)} />
      )}
    </div>
  );
}
