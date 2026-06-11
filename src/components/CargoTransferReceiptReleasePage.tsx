import React, { useRef, useEffect, useState } from 'react';
import { ColumnFilter } from './ColumnFilter';
import CargoTransferViewPage from './CargoTransferViewPage';

const font = "'Dubai', sans-serif";

// ── Types ─────────────────────────────────────────────────────────────────────
type Row = {
  ctNo: string;
  date: string;
  inboundDoc: string;
  clientRef: string;
  transferor: string;
  releaseStatus: string;
  receiptStatus: string;
  receiptDate: string;
  releaseDate: string;
};

type Props = { onBack: () => void };

// ── Data ──────────────────────────────────────────────────────────────────────
const INITIAL_ROWS: Row[] = [
  { ctNo: '6020000194926', date: '03-06-2026', inboundDoc: 'VIKRAM0306202601', clientRef: 'CT1 VIK 2026 01', transferor: 'AE-1000143-Al Cargo', releaseStatus: 'Not Released', receiptStatus: 'Received',     receiptDate: '03-06-2026', releaseDate: '' },
  { ctNo: '6020000194927', date: '03-06-2026', inboundDoc: 'VIKRAM0306202602', clientRef: 'CT2 VIK 2026 01', transferor: 'AE-1000144-Al Cargo', releaseStatus: 'Released',     receiptStatus: 'Not Received', receiptDate: '',           releaseDate: '03-06-2026' },
  { ctNo: '6020000194928', date: '02-06-2026', inboundDoc: 'VIKRAM0306202603', clientRef: 'CT3 VIK 2026 01', transferor: 'AE-1000145-Al Cargo', releaseStatus: 'Not Released', receiptStatus: 'Received',     receiptDate: '02-06-2026', releaseDate: '' },
  { ctNo: '6020000194929', date: '01-06-2026', inboundDoc: 'VIKRAM0306202604', clientRef: 'CT4 VIK 2026 02', transferor: 'AE-1000146-Al Cargo', releaseStatus: 'Not Released', receiptStatus: 'Not Received', receiptDate: '',           releaseDate: '' },
];

const RELEASE_STATUS_OPTS = ['All', 'Released', 'Not Released'];
const RECEIPT_STATUS_OPTS = ['All', 'Received', 'Not Received'];

// ── Exact floatLabel helper matching the listing page pattern ─────────────────
function floatLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute',
    left: 12,
    top: active ? 0 : '50%',
    transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: focused ? '#1360d2' : (active ? '#697498' : '#0e1b3d'),
    background: active ? 'white' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none',
    transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease, background 0.15s ease',
    fontFamily: font,
    whiteSpace: 'nowrap',
    zIndex: 1,
  };
}

function statusStyle(val: string) {
  if (val === 'Released' || val === 'Received')         return { bg: 'rgba(26,172,114,0.12)',  color: '#1aac72' };
  if (val === 'Not Released' || val === 'Not Received') return { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' };
  return { bg: 'rgba(255,169,26,0.16)', color: '#b45309' };
}

// ── Floating text input ────────────────────────────────────────────────────────
function FloatInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white transition-colors"
        style={{
          fontFamily: font,
          paddingTop: active ? 18 : 0,
          border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
        }}
      />
      <span style={floatLabel(active, focused)}>{label}</span>
    </div>
  );
}

// ── Floating date input — always floated (browser always shows date text) ──────
function FloatDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white transition-colors"
        style={{
          fontFamily: font,
          border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
          colorScheme: 'light',
        }}
      />
      {/* Always floated so label never overlaps the date text */}
      <span style={floatLabel(true, focused)}>{label}</span>
    </div>
  );
}

// ── Floating dropdown (Release / Receipt Status) ───────────────────────────────
function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = open || focused || value !== 'All';
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setFocused(true); }}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d] focus:outline-none bg-white text-left transition-colors"
        style={{
          fontFamily: font,
          paddingTop: active ? 18 : 0,
          border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`,
        }}
      >
        <span className="flex-1 truncate">{value !== 'All' ? value : ''}</span>
        <svg viewBox="0 0 24 24" className={`size-[20px] text-[#697498] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={floatLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); setFocused(false); }}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === value ? 500 : 400 }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Success Popup ─────────────────────────────────────────────────────────────
function SuccessPopup({ type, count, onClose }: { type: 'receipt' | 'release'; count: number; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const msg = type === 'receipt'
    ? `You have successfully confirmed the receipt of ${count} cargo transfer request${count !== 1 ? 's' : ''}.`
    : `You have successfully confirmed the release of ${count} cargo release request${count !== 1 ? 's' : ''}.`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-white rounded-[16px] p-[40px] flex flex-col items-center gap-[20px]" style={{ width: 440, maxWidth: '90vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        {/* Green tick */}
        <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: 'rgba(26,172,114,0.12)' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#1aac72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M7 12l3.5 3.5L17 8.5" />
          </svg>
        </div>
        <p className="text-[18px] font-medium text-[#0e1b3d] text-center" style={{ fontFamily: font, lineHeight: 1.6 }}>{msg}</p>
        <button
          onClick={onClose}
          className="h-[44px] px-[32px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity mt-[4px]"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ── Confirm Popup — Figma style (dark navy header) ────────────────────────────
function ConfirmPopup({ type, onConfirm, onClose }: {
  type: 'receipt' | 'release';
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const title = type === 'receipt' ? 'Confirm Receipt' : 'Confirm Release';
  const text  = type === 'receipt'
    ? 'I / we hereby acknowledge the receipt of the cargo as described in the selected declarations.'
    : 'I / we hereby acknowledge the release of the cargo as described in the selected declarations.';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.50)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] overflow-hidden flex flex-col"
        style={{ width: 560, maxWidth: '92vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.22)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Dark navy header ── */}
        <div
          className="flex items-center justify-between px-[28px] py-[18px]"
          style={{ background: '#0e1b3d' }}
        >
          <span className="text-[18px] font-medium text-white" style={{ fontFamily: font }}>{title}</span>
          <button
            onClick={onClose}
            className="size-[28px] flex items-center justify-center rounded-full transition-colors"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 3l14 14M17 3L3 17" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-[40px] py-[40px]">
          <p
            className="text-[16px] text-[#0e1b3d] text-center"
            style={{ fontFamily: font, lineHeight: 1.8 }}
          >
            {text}
          </p>
        </div>

        {/* ── Footer — Cancel + Confirm centred ── */}
        <div className="flex items-center justify-center gap-[12px] px-[28px] pb-[28px]">
          <button
            onClick={onClose}
            className="h-[44px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font, fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="h-[44px] px-[28px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CargoTransferReceiptReleasePage({ onBack }: Props) {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmType, setConfirmType] = useState<'receipt' | 'release' | null>(null);
  const [successType, setSuccessType] = useState<'receipt' | 'release' | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [viewCtNo, setViewCtNo] = useState<string | null>(null);
  // Track which rows have had their dates confirmed (locked to read-only)
  const [confirmedReceiptRows, setConfirmedReceiptRows] = useState<Set<number>>(new Set());
  const [confirmedReleaseRows, setConfirmedReleaseRows] = useState<Set<number>>(new Set());

  // Controls state
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Advanced filter state
  const [filterMasterDoc, setFilterMasterDoc] = useState('');
  const [filterClientRef, setFilterClientRef] = useState('');
  const [filterCarrierReg, setFilterCarrierReg] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterReleaseStatus, setFilterReleaseStatus] = useState('All');
  const [filterReceiptStatus, setFilterReceiptStatus] = useState('All');

  const toggleRow = (i: number) => setSelected(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((_, i) => i)));

  const updateDate = (rowIdx: number, field: 'receiptDate' | 'releaseDate', val: string) => {
    setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [field]: val } : r));
  };

  const canConfirm = selected.size > 0;

  const handleConfirm = (type: 'receipt' | 'release') => {
    const count = selected.size;
    // Lock confirmed date fields to read-only
    if (type === 'receipt') {
      setConfirmedReceiptRows(prev => new Set([...prev, ...selected]));
    } else {
      setConfirmedReleaseRows(prev => new Set([...prev, ...selected]));
    }
    setSuccessType(type);
    setSuccessCount(count);
    setSelected(new Set());
  };

  const COLS = [
    { key: 'ctNo',          label: 'Cargo Transfer No.',             w: 170 },
    { key: 'date',          label: 'Date',                           w: 120 },
    { key: 'inboundDoc',    label: 'Inbound Master Transfer Doc.No.', w: 210 },
    { key: 'clientRef',     label: "Client's Dec. Ref. No",          w: 160 },
    { key: 'transferor',    label: 'Transferor Buss.Code-Name',      w: 200 },
    { key: 'releaseStatus', label: 'Release Status',                 w: 140 },
    { key: 'receiptStatus', label: 'Receipt Status',                 w: 140 },
    { key: 'receiptDate',   label: 'Receipt Date',                   w: 150 },
    { key: 'releaseDate',   label: 'Release Date',                   w: 150 },
  ];

  // Show view page when a CT number is clicked
  if (viewCtNo !== null) {
    return (
      <CargoTransferViewPage
        transferNumber={viewCtNo}
        onBack={() => setViewCtNo(null)}
      />
    );
  }

  return (
    <>
      {confirmType && (
        <ConfirmPopup
          type={confirmType}
          onConfirm={() => handleConfirm(confirmType)}
          onClose={() => setConfirmType(null)}
        />
      )}
      {successType && (
        <SuccessPopup
          type={successType}
          count={successCount}
          onClose={() => setSuccessType(null)}
        />
      )}

      <div className="flex flex-col h-full bg-[#f8fafd]">
        {/* ── Breadcrumb — sticky ── */}
        <div className="flex-shrink-0 bg-[#f8fafd]">
          <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
            <div className="flex items-center gap-[6px]">
              <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
              <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
              <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
              <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
              <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Cargo Transfer</span>
              <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
              <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>CT Release / Receipt</span>
            </div>
            <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
            </div>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">

          {/* ── Page title ── */}
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 14, marginTop: 0 }}>
            CT Release / Receipt
          </h1>

          {/* ── Controls row: filters + search + action buttons ── */}
          <div className="flex items-center gap-[12px] mb-[12px] flex-wrap">
            {/* Advance Filters toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#000]'}`}
              style={{ fontFamily: font }}
            >
              <span>Advance Filters</span>
              <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
              </svg>
            </button>

            {/* CT No. search */}
            <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[160px] max-w-[320px] px-[12px] gap-[8px]">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Cargo Transfer No."
                className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                style={{ fontFamily: font }}
              />
              {searchValue && (
                <button type="button" onClick={() => setSearchValue('')} className="flex-shrink-0 size-[22px] inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l10 10M15 5l-10 10" /></svg>
                </button>
              )}
              <button type="button" className="flex-shrink-0">
                <svg viewBox="0 0 24 24" className="size-[22px] text-[#455174]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
            </div>

            {/* Push action buttons to the right */}
            <div className="flex-1" />

            {/* Confirm Receipt */}
            <button
              disabled={!canConfirm}
              onClick={() => canConfirm && setConfirmType('receipt')}
              className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-opacity"
              style={{ background: canConfirm ? '#1360d2' : '#a7c3eb', cursor: canConfirm ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500, boxShadow: canConfirm ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
            >
              Confirm Receipt
            </button>

            {/* Confirm Release */}
            <button
              disabled={!canConfirm}
              onClick={() => canConfirm && setConfirmType('release')}
              className="h-[48px] px-[22px] rounded-[4px] text-[16px] flex-shrink-0 transition-colors"
              style={{
                border: `1px solid ${canConfirm ? '#1360d2' : '#a7c3eb'}`,
                color: canConfirm ? '#1360d2' : '#a7c3eb',
                cursor: canConfirm ? 'pointer' : 'not-allowed',
                background: 'white',
                fontFamily: font, fontWeight: 500,
              }}
            >
              Confirm Release
            </button>
          </div>

          {/* ── Status As On — centred below controls row ── */}
          <div className="flex justify-center mb-[14px]">
            <div
              className="bg-white border border-[#d5ddfb] rounded-[8px] h-[44px] px-[16px] flex items-center gap-[12px]"
              style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}
            >
              <span className="text-[16px] text-[#4c4c4c] whitespace-nowrap" style={{ fontFamily: font }}>
                Status As On 01-Jun-26 To 10-Jun-26
              </span>
              <div className="flex items-center gap-[6px] cursor-pointer">
                <span className="text-[16px] text-[#1360d2] font-medium" style={{ fontFamily: font }}>Modify</span>
                <svg viewBox="0 0 18 18" className="size-[16px]" fill="none" stroke="#1360d2" strokeWidth="1.8">
                  <path d="M12 3l3 3-9 9H3v-3L12 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Advance Filters Panel ── */}
          {showFilters && (
            <div className="bg-white rounded-[8px] mb-[12px] p-[20px]" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
              <div className="flex items-center justify-between mb-[20px]">
                <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advance Filters</span>
                <button onClick={() => setShowFilters(false)} className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"><path d="M3 3l14 14M17 3L3 17" /></svg>
                </button>
              </div>

              {/* Row 1 — 4 equal text fields */}
              <div className="grid grid-cols-4 gap-x-5 gap-y-5">
                <FloatInput label="Master Transfer Doc. No." value={filterMasterDoc} onChange={setFilterMasterDoc} />
                <FloatInput label="Client's Dec. Ref. No"   value={filterClientRef} onChange={setFilterClientRef} />
                <FloatInput label="Carrier Registration No." value={filterCarrierReg} onChange={setFilterCarrierReg} />
                {/* 4th column: empty placeholder so the grid is full */}
                <div />
              </div>

              {/* Row 2 — dates + status dropdowns */}
              <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-[20px]">
                <FloatDate label="Date From" value={filterFromDate} onChange={setFilterFromDate} />
                <FloatDate label="Date To"   value={filterToDate}   onChange={setFilterToDate}   />
                <FilterDropdown label="Release Status" value={filterReleaseStatus} options={RELEASE_STATUS_OPTS} onChange={setFilterReleaseStatus} />
                <FilterDropdown label="Receipt Status" value={filterReceiptStatus} options={RECEIPT_STATUS_OPTS} onChange={setFilterReceiptStatus} />
              </div>

              <div className="flex justify-end gap-[12px] mt-[20px]">
                <button
                  onClick={() => { setFilterMasterDoc(''); setFilterClientRef(''); setFilterCarrierReg(''); setFilterFromDate(''); setFilterToDate(''); setFilterReleaseStatus('All'); setFilterReceiptStatus('All'); }}
                  className="h-[44px] px-[24px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
                  style={{ fontFamily: font, fontWeight: 500 }}
                >Reset</button>
                <button className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Apply</button>
              </div>
            </div>
          )}

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table style={{ minWidth: 1400, borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }} className="w-full">
              <thead>
                <tr>
                  <th style={{ width: 48, background: '#a6c2e9', padding: '10px 8px 10px 16px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>
                    <div
                      onClick={toggleAll}
                      className="size-[18px] rounded-[4px] border-2 flex items-center justify-center cursor-pointer transition-colors"
                      style={{ borderColor: allSelected ? '#1360d2' : '#6b84ab', background: allSelected ? '#1360d2' : 'transparent' }}
                    >
                      {allSelected && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </th>
                  {COLS.map((col, ci) => (
                    <th key={col.key} style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: ci === COLS.length - 1 ? '0 8px 0 0' : 0 }}>
                      <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const isSel = selected.has(i);
                  const cellBg = isSel ? '#eef4ff' : '#fff';
                  const cs: React.CSSProperties = { background: cellBg, padding: '0 8px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' };
                  const txt = (v: string) => <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>;

                  return (
                    <tr key={i} onClick={() => toggleRow(i)} className="cursor-pointer">
                      <td style={{ ...cs, padding: '0 8px 0 16px' }}>
                        <div className="size-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors" style={{ borderColor: isSel ? '#1360d2' : '#c0c8e0', background: isSel ? '#1360d2' : '#fff' }}>
                          {isSel && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                      </td>
                      <td style={cs}><button className="text-[16px] text-[#1360d2] underline hover:opacity-80 whitespace-nowrap" style={{ fontFamily: font }} onClick={e => { e.stopPropagation(); setViewCtNo(row.ctNo); }}>{row.ctNo}</button></td>
                      <td style={cs}>{txt(row.date)}</td>
                      <td style={cs}>{txt(row.inboundDoc)}</td>
                      <td style={cs}>{txt(row.clientRef)}</td>
                      <td style={cs}>{txt(row.transferor)}</td>
                      <td style={cs}>{(() => { const s = statusStyle(row.releaseStatus); return <span className="text-[16px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap" style={{ background: s.bg, color: s.color, fontFamily: font }}>{row.releaseStatus}</span>; })()}</td>
                      <td style={cs}>{(() => { const s = statusStyle(row.receiptStatus); return <span className="text-[16px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap" style={{ background: s.bg, color: s.color, fontFamily: font }}>{row.receiptStatus}</span>; })()}</td>

                      {/* Receipt Date — editable until confirmed, then read-only */}
                      <td style={cs} onClick={e => e.stopPropagation()}>
                        {confirmedReceiptRows.has(i) ? (
                          <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>
                            {row.receiptDate || '—'}
                          </span>
                        ) : (
                          <input type="date"
                            value={row.receiptDate ? row.receiptDate.split('-').reverse().join('-') : ''}
                            onChange={e => updateDate(i, 'receiptDate', e.target.value ? e.target.value.split('-').reverse().join('-') : '')}
                            className="h-[36px] px-[8px] text-[15px] text-[#051937] rounded-[4px] border border-[#d5ddfb] focus:outline-none focus:border-[#1360d2] bg-white w-full"
                            style={{ fontFamily: font, minWidth: 130 }}
                          />
                        )}
                      </td>

                      {/* Release Date — editable until confirmed, then read-only */}
                      <td style={cs} onClick={e => e.stopPropagation()}>
                        {confirmedReleaseRows.has(i) ? (
                          <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>
                            {row.releaseDate || '—'}
                          </span>
                        ) : (
                          <input type="date"
                            value={row.releaseDate ? row.releaseDate.split('-').reverse().join('-') : ''}
                            onChange={e => updateDate(i, 'releaseDate', e.target.value ? e.target.value.split('-').reverse().join('-') : '')}
                            className="h-[36px] px-[8px] text-[15px] text-[#051937] rounded-[4px] border border-[#d5ddfb] focus:outline-none focus:border-[#1360d2] bg-white w-full"
                            style={{ fontFamily: font, minWidth: 130 }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Sticky bottom nav — Back only ── */}
        <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 80 }}>
          <div className="h-full flex items-center px-[40px]">
            <button
              onClick={onBack}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
