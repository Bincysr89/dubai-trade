import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SaveExitModal from './SaveExitModal';
import BackToListingBar from './BackToListingBar';
import ClaimStepper, { REFUND_DEPOSIT_STEPS, REFUND_DEPOSIT_STEPS_NO_DOCS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* ─── Column grid definition — serial no. + 7 equal columns + action ─────── */
const COLS    = '56px repeat(7, minmax(160px, 1fr)) 104px';
const TBL_MIN = 1280;

/* ─── Domain types ──────────────────────────────────────────────── */
type RefundType = 'full' | 'fullImport' | 'partial' | 'partialImport' | 'no' | 'refund' | 'noRefund' | '';

/* Charge types with no export linkage — plain Refund / No Refund only,
   and the flow skips the document upload step entirely. */
export const MISSING_DOC_CHARGE_TYPES = ['Missing Document Deposit', 'Document Deposit'];
export const isMissingDocCharge = (ct: string) => MISSING_DOC_CHARGE_TYPES.includes(ct);

/* Only Alternative Duty Deposit supports the full Export/Import refund options
   (and the outbound-declaration linkage that comes with them). Every other
   charge type — including Missing/Document Deposit — is a simple Refund / No Refund. */
export const hasFullRefundOptions = (ct: string) => ct === 'Alternative Duty Deposit';

/* Refund of Duty — the "Duty" charge type gets Full/Partial/No Export (and the
   outbound-declaration linkage that comes with them); the other two Refund of
   Duty charge types (Declaration Amendment / Cancellation) are Refund / No Refund. */
export const hasDutyRefundOptions = (ct: string) => ct === 'Duty';

export type ChargeDetail = {
  declarationNo: string;
  chargeType: string;
  depositAmount: string;
  depositMethod: string;
  refundType: RefundType;
  outboundDeclNo: string;
  claimAmount: string;
};

export type OutboundDetail = {
  id: string;
  customsAuthority: string;
  declarationNo: string;
  declarationType: string;
  exitPoint: string;
  actualDepartureDate: string;
  statQty: string;
  suppQty: string;
  weight: string;
  reExportTo: string;
};

type HSCodeEntry = {
  id: string;
  lineItemNo: number;
  hsCode: string;
  description: string;
  statQty: number;
  suppQty: number;
  weight: number;
  unit: string;
  allocationMethod: 'single' | 'multiple' | '';
  unitPrice: string;
  currency: string;
};

type InvoiceEntry  = { id: string; invoiceNo: string; invoiceDate: string; hsCodes: HSCodeEntry[] };
type DrawerCtx     = { declNo: string; invoiceNo: string; invoiceId: string; hsId: string; hsCode: string; description: string; editId?: string };
type OutboundState = Record<string, OutboundDetail[]>;

export type RDFlowResult = { details: ChargeDetail[]; outbounds: OutboundState };

/* ─── Mock data ─────────────────────────────────────────────────── */
const MOCK_INVOICES: Record<string, InvoiceEntry[]> = {
  '105-01426431-24': [
    { id: 'i1a', invoiceNo: 'INV-2024-001', invoiceDate: '15 Jan 2024', hsCodes: [
      { id: 'h1', lineItemNo: 1, hsCode: '39269050', description: 'Plastic Components & Fittings',       statQty: 100, suppQty: 100, weight: 45.5,  unit: 'PCS', allocationMethod: '', unitPrice: '12.50',  currency: 'AED' },
      { id: 'h2', lineItemNo: 2, hsCode: '84713000', description: 'Electronic Data Processing Machines', statQty: 5,   suppQty: 5,   weight: 22.0,  unit: 'NOS', allocationMethod: '', unitPrice: '850.00', currency: 'AED' },
    ]},
    { id: 'i1b', invoiceNo: 'INV-2024-002', invoiceDate: '20 Jan 2024', hsCodes: [
      { id: 'h3', lineItemNo: 1, hsCode: '73181500', description: 'Steel Bolts & Fasteners',             statQty: 500, suppQty: 480, weight: 125.0, unit: 'KG',  allocationMethod: '', unitPrice: '3.20',   currency: 'AED' },
    ]},
  ],
  '404-09988123-24': [
    { id: 'i2a', invoiceNo: 'INV-2024-003', invoiceDate: '05 Feb 2024', hsCodes: [
      { id: 'h4', lineItemNo: 1, hsCode: '85176200', description: 'Machines for Reception of Voice/Data',  statQty: 10,  suppQty: 10,  weight: 38.0, unit: 'NOS', allocationMethod: '', unitPrice: '1200.00', currency: 'USD' },
      { id: 'h5', lineItemNo: 2, hsCode: '39232100', description: 'Sacks & Bags of Polymers of Ethylene',  statQty: 200, suppQty: 200, weight: 15.5, unit: 'PCS', allocationMethod: '', unitPrice: '2.80',   currency: 'AED' },
    ]},
    { id: 'i2b', invoiceNo: 'INV-2024-004', invoiceDate: '10 Feb 2024', hsCodes: [
      { id: 'h6', lineItemNo: 1, hsCode: '94036000', description: 'Wooden Furniture for Domestic Purposes', statQty: 8,   suppQty: 8,   weight: 210.0, unit: 'NOS', allocationMethod: '', unitPrice: '4500.00', currency: 'AED' },
    ]},
  ],
  '201-07612301-24': [
    { id: 'i3a', invoiceNo: 'INV-2024-005', invoiceDate: '15 Feb 2024', hsCodes: [
      { id: 'h7', lineItemNo: 1, hsCode: '48191000', description: 'Cartons, Boxes & Cases of Paper',          statQty: 1000, suppQty: 1000, weight: 320.0, unit: 'PCS', allocationMethod: '', unitPrice: '0.85',  currency: 'AED' },
      { id: 'h8', lineItemNo: 2, hsCode: '84818000', description: 'Taps, Cocks, Valves & Similar Appliances', statQty: 25,   suppQty: 25,   weight: 55.0,  unit: 'NOS', allocationMethod: '', unitPrice: '180.00', currency: 'AED' },
    ]},
  ],
};

const DECL_META: Record<string, { declarationType: string; depositMethod: string }> = {
  '105-01426431-24': { declarationType: 'Import for Re-Export', depositMethod: 'Alternative Duty' },
  '404-09988123-24': { declarationType: 'Temporary Admission',  depositMethod: 'Alternative Duty' },
  '201-07612301-24': { declarationType: 'Transit (ROW to ROW)', depositMethod: 'Alternative Duty' },
};

function getInvoices(declNo: string): InvoiceEntry[] {
  return MOCK_INVOICES[declNo] ?? [{
    id: `inv-${declNo}`, invoiceNo: 'INV-DEFAULT', invoiceDate: '01 Jan 2024', hsCodes: [
      { id: `h-${declNo}`, lineItemNo: 1, hsCode: '99999999', description: 'General Merchandise', statQty: 1, suppQty: 1, weight: 1.0, unit: 'PCS', allocationMethod: '', unitPrice: '0', currency: 'AED' },
    ],
  }];
}

/* ─── Helpers ───────────────────────────────────────────────────── */
const REFUND_OPTIONS: { value: RefundType; label: string }[] = [
  { value: 'full',          label: 'Full Export'    },
  { value: 'fullImport',    label: 'Full Import'    },
  { value: 'partial',       label: 'Partial Export' },
  { value: 'partialImport', label: 'Partial Import' },
  { value: 'no',            label: 'No Export'      },
];

/* Refund of Duty — "Duty" charge type: Full/Partial/No Export only (no Import legs). */
const REFUND_OPTIONS_DUTY: { value: RefundType; label: string }[] = [
  { value: 'full',    label: 'Full Export'    },
  { value: 'partial', label: 'Partial Export' },
  { value: 'no',      label: 'No Export'      },
];

/* Every other charge type (Alternative Duty Deposit and Duty excepted) — plain Refund / No Refund. */
const MISSING_DOC_REFUND_OPTIONS: { value: RefundType; label: string }[] = [
  { value: 'refund',   label: 'Refund'    },
  { value: 'noRefund', label: 'No Refund' },
];

const ALLOCATION_OPTIONS = ['single', 'multiple'];
const CUSTOMS_AUTHORITIES = ['Abu Dhabi Customs', 'AJMAN Customs', 'Dubai Customs', 'Dubai Customs (Manifest)', 'FUJAIRAH Customs', 'RAK Customs', 'Sharjah Customs', 'UMM AL QUWAIN Customs'];
const DECLARATION_TYPES   = ['Export', 'Re-Export', 'Transit'];
const EXIT_POINTS         = ['Jebel Ali Port', 'Dubai International Airport', 'Port Rashid', 'Al Maktoum Airport', 'Hamriyah Port'];
const RE_EXPORT_DESTS     = ['India', 'China', 'United States', 'United Kingdom', 'Germany', 'Saudi Arabia', 'Kuwait', 'Oman', 'Pakistan', 'Egypt'];

/* Dubai Customs declarations — picking one autofills the remaining fields. */
const DUBAI_DECLARATIONS: Omit<OutboundDetail, 'id' | 'customsAuthority'>[] = [
  { declarationNo: 'EX-20800049-24', declarationType: 'Re-Export', exitPoint: 'Jebel Ali Port',      actualDepartureDate: '2025-01-15', statQty: '50',  suppQty: '50',  weight: '1250', reExportTo: 'Saudi Arabia' },
  { declarationNo: 'EX-20800061-24', declarationType: 'Export',    exitPoint: 'Port Rashid',         actualDepartureDate: '2025-02-22', statQty: '32',  suppQty: '30',  weight: '880',  reExportTo: 'Oman' },
  { declarationNo: 'EX-20800075-24', declarationType: 'Transit',   exitPoint: 'Al Maktoum Airport',  actualDepartureDate: '2025-03-05', statQty: '120', suppQty: '120', weight: '2400', reExportTo: 'India' },
];

function needsOutbound(rt: RefundType) { return rt === 'full' || rt === 'fullImport' || rt === 'partial' || rt === 'partialImport'; }
function parseAED(s: string)           { return parseFloat(s.replace(/[^0-9.]/g, '')) || 0; }
function autoAmount(rt: RefundType, dep: string) {
  if (rt === 'no' || rt === 'noRefund') return '0';
  if (rt === 'full' || rt === 'fullImport' || rt === 'refund') return String(parseAED(dep));
  return '';
}
function obKey(d: string, h: string) { return `${d}::${h}`; }

/* ─── Shared flyout menu — DTSelect look (white card, soft shadow,
       blue-tinted hover/selected), fixed-position so it escapes
       overflow/scroll containers like the table and modal body. ─── */
type MenuPos = { top: number; left: number; width: number };
function FlyoutMenu({ pos, options, value, onSelect }: {
  pos: MenuPos; options: { value: string; label: string }[]; value: string; onSelect: (v: string) => void;
}) {
  // Portaled to <body> — a sticky/z-indexed ancestor (e.g. the Action column) would
  // otherwise trap this fixed-position menu inside its own stacking context, painting
  // it behind a later row's sticky cell instead of on top of the whole page.
  return createPortal(
    <div className="py-[4px]"
      style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
        background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
        overflow: 'hidden', fontFamily: font }}
      role="listbox">
      {options.map(o => {
        const isSel = o.value === value;
        return (
          <button key={o.value} type="button" role="option" aria-selected={isSel}
            onMouseDown={e => { e.preventDefault(); onSelect(o.value); }}
            className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
            style={{ background: isSel ? '#e2ebf9' : 'transparent', color: isSel ? '#1360d2' : '#0e1b3d', fontWeight: isSel ? 500 : 400, fontFamily: font }}>
            {o.label}
          </button>
        );
      })}
    </div>,
    document.body
  );
}

/* ─── Refund Type dropdown (fixed-position) ─────────────────────── */
function RefundSelect({ value, onChange, options = REFUND_OPTIONS }: {
  value: RefundType; onChange: (v: RefundType) => void; options?: { value: RefundType; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const opt             = options.find(o => o.value === value);

  const openMenu = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: r.width });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <>
      <button ref={btnRef} type="button" onClick={openMenu}
        className="bg-white w-full flex items-center px-[16px] text-left rounded-[4px] transition-colors"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, position: 'relative' }}>
        <span className="absolute pointer-events-none transition-all"
          style={{ left: open || value ? 10 : 16, top: open || value ? -9 : '50%', transform: open || value ? 'none' : 'translateY(-50%)',
            background: open || value ? '#fff' : 'transparent', padding: open || value ? '0 4px' : 0,
            fontSize: open || value ? 12 : 16, color: open ? '#1360d2' : open || value ? '#000' : '#697498',
            fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>
          Refund Type
        </span>
        <span className="flex-1 text-[16px]" style={{ color: opt ? '#0e1b3d' : 'transparent', fontFamily: font }}>
          {opt?.label ?? ''}
        </span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && pos && (
        <FlyoutMenu pos={pos} options={options.map(o => ({ value: o.value, label: o.label }))} value={value}
          onSelect={v => { onChange(v as RefundType); setOpen(false); }} />
      )}
    </>
  );
}

/* ─── Inline select (Allocation Method in table) — DTSelect-styled ─── */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function InlineSelect({ value, onChange, options, placeholder = 'Select' }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<MenuPos | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
        className="w-full bg-white rounded-[4px] flex items-center px-[10px] text-left transition-colors"
        style={{ height: 44, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, minWidth: 110, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : '#697498' }}>
          {value ? capitalize(value) : placeholder}
        </span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <FlyoutMenu pos={pos} options={options.map(o => ({ value: o, label: capitalize(o) }))} value={value}
          onSelect={v => { onChange(v); setOpen(false); }} />
      )}
    </>
  );
}

/* ─── Outbound Declaration View Popup — every outbound added to the line item, one
       row per declaration so it stays legible even with 10+ entries. ── */
const OB_VIEW_COLS: { label: string; get: (ob: OutboundDetail) => string }[] = [
  { label: 'Customs Authority',     get: ob => ob.customsAuthority },
  { label: 'Declaration No.',       get: ob => ob.declarationNo },
  { label: 'Declaration Type',      get: ob => ob.declarationType },
  { label: 'Exit Point',            get: ob => ob.exitPoint },
  { label: 'Actual Departure Date', get: ob => ob.actualDepartureDate },
  { label: 'Re-Export To',          get: ob => ob.reExportTo },
  { label: 'Statistical Qty',       get: ob => ob.statQty },
  { label: 'Supplementary Qty',     get: ob => ob.suppQty },
  { label: 'Weight (kg)',           get: ob => ob.weight },
];

function OutboundViewPopup({ obs, onClose }: { obs: OutboundDetail[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: 1200, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        {/* Header — dark blue, matches other popups */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-[12px] flex-wrap">
            <h2 className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0, fontFamily: font }}>Outbound Declaration Details</h2>
            <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: 'rgba(255,255,255,0.14)', color: '#f8fafd', fontWeight: 500, fontFamily: font }}>
              {obs.length} declaration{obs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>

        {/* Body — one row per outbound declaration, fields as columns */}
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1100, fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, width: 44 }}>#</th>
                  {OB_VIEW_COLS.map(c => (
                    <th key={c.label} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {obs.map((ob, i) => (
                  <tr key={ob.id} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                    {OB_VIEW_COLS.map(c => (
                      <td key={c.label} className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{c.get(ob) || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eef1f6' }}>
          <button onClick={onClose}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500, cursor: 'pointer', boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add/Edit Outbound Declaration Modal ───────────────────────── */
const BLANK_OB = (): OutboundDetail => ({
  id: `ob-${Date.now()}`, customsAuthority: 'Dubai Customs',
  declarationNo: '', declarationType: '', exitPoint: '',
  actualDepartureDate: '', statQty: '', suppQty: '', weight: '', reExportTo: '',
});

/* Floating-label text input — matches FloatingField.tsx's convention used across the app. */
function FInput({ label, value, onChange, type = 'text', placeholder = '', req }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; req?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  // Native date inputs always render their own "mm/dd/yyyy" placeholder, which fights a
  // centered resting label — render as text until focused/filled, same trick as FloatingField.
  const isDate = type === 'date';
  const effectiveType = isDate ? (floated ? 'date' : 'text') : type;
  return (
    <div className="relative">
      <input type={effectiveType} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        className="w-full bg-white rounded-[4px] text-[16px]"
        style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: '0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: floated ? (focused ? '#1360d2' : '#0e1b3d') : '#697498',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

/* Floating-label select — same visual convention as FInput/RefundSelect. */
function FSelect({ label, value, onChange, options, req }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<MenuPos | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const floated          = open || value.length > 0;

  const toggle = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative">
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
        className="w-full bg-white rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 48, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>
          {value || ' '}
        </span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: floated ? (open ? '#1360d2' : '#0e1b3d') : '#697498',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && pos && (
        <FlyoutMenu pos={pos} options={options.map(o => ({ value: o, label: o }))} value={value}
          onSelect={v => { onChange(v); setOpen(false); }} />
      )}
    </div>
  );
}

function OutboundModal({ ctx, existing, targetCount, previousOutbounds = [], onSave, onSaveAnother, onClose }: {
  ctx: DrawerCtx; existing?: OutboundDetail; targetCount: number; previousOutbounds?: OutboundDetail[];
  onSave: (d: OutboundDetail) => void; onSaveAnother: (d: OutboundDetail) => void; onClose: () => void;
}) {
  const [form, setForm]       = useState<OutboundDetail>(existing ?? BLANK_OB());
  const [touched, setTouched] = useState(false);
  const [prefillFrom, setPrefillFrom] = useState('');
  useEffect(() => { setForm(existing ?? BLANK_OB()); setTouched(false); setPrefillFrom(''); }, [ctx.hsId, ctx.editId]);

  /* Add mode only — prefill the form from an outbound declaration already added elsewhere in this claim. */
  const applyPrefill = (declarationNo: string) => {
    setPrefillFrom(declarationNo);
    const source = previousOutbounds.find(o => o.declarationNo === declarationNo);
    if (source) setForm(f => ({ ...source, id: f.id }));
  };

  const set = (k: keyof OutboundDetail, v: string) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.declarationNo.trim() && form.declarationType && form.exitPoint && form.actualDepartureDate && form.statQty.trim() && form.weight.trim() && form.reExportTo;

  /* Dubai Customs — searching the declaration number autofills the rest. */
  const isDubai = form.customsAuthority === 'Dubai Customs';
  const [declSearchOpen, setDeclSearchOpen] = useState(false);
  const [declFocused, setDeclFocused] = useState(false);
  const declRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!declSearchOpen) return;
    const close = (e: MouseEvent) => { if (declRef.current && !declRef.current.contains(e.target as Node)) setDeclSearchOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [declSearchOpen]);
  const declQuery   = form.declarationNo.trim().toLowerCase();
  const declMatches = DUBAI_DECLARATIONS.filter(s => declQuery === '' || s.declarationNo.toLowerCase().includes(declQuery));
  const pickDeclaration = (s: typeof DUBAI_DECLARATIONS[number]) => {
    setForm(f => ({ ...f, ...s }));
    setDeclSearchOpen(false);
  };

  const handleSave        = () => { setTouched(true); if (isValid) onSave(form); };
  const handleSaveAnother = () => { setTouched(true); if (isValid) { onSaveAnother(form); setForm(BLANK_OB()); setTouched(false); } };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(14,27,61,0.45)', padding: 24 }}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: 920, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>

        {/* Header — dark blue, matches other popups */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, fontFamily: font, margin: 0 }}>
            {ctx.editId ? 'Edit' : 'Add'} Outbound Declaration
          </p>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="flex items-center gap-[8px] flex-wrap">
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 12, background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>{ctx.declNo}</span>
            {targetCount > 1 ? (
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>
                Applies to <span style={{ color: '#1360d2', fontWeight: 600 }}>{targetCount} selected line items</span>
              </span>
            ) : (
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>HS {ctx.hsCode} · {ctx.description}</span>
            )}
          </div>

          {!ctx.editId && previousOutbounds.length > 0 && (
            <div className="rounded-[6px] p-[14px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <FSelect label="Prefill from Previous Outbound"
                value={prefillFrom ? (previousOutbounds.find(o => o.declarationNo === prefillFrom)?.declarationNo ?? '') : ''}
                onChange={applyPrefill}
                options={previousOutbounds.map(o => o.declarationNo)} />
              <p className="text-[12px] text-[#697498]" style={{ margin: '6px 0 0', fontFamily: font }}>Choose a declaration already added to this claim to prefill the fields below.</p>
            </div>
          )}

          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, fontFamily: font, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Declaration Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <FSelect label="Customs Authority" value={form.customsAuthority} onChange={v => set('customsAuthority', v)} options={CUSTOMS_AUTHORITIES} req />
              <div ref={declRef} style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <input value={form.declarationNo}
                    onChange={e => { set('declarationNo', e.target.value); if (isDubai) setDeclSearchOpen(true); }}
                    onFocus={() => { setDeclFocused(true); if (isDubai) setDeclSearchOpen(true); }}
                    onBlur={() => setDeclFocused(false)}
                    placeholder={declFocused ? (isDubai ? 'Search Declaration Number' : 'e.g. EX-12345678-24') : ''}
                    className="w-full bg-white rounded-[4px] text-[16px]"
                    style={{ height: 48, border: `1px solid ${declFocused ? '#1360d2' : '#d5ddfb'}`, padding: '0 40px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', transition: 'border-color 120ms' }} />
                  <span className="absolute pointer-events-none transition-all" style={(() => {
                    const floated = declFocused || form.declarationNo.length > 0;
                    return {
                      left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
                      background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
                      fontSize: floated ? 12 : 16, color: floated ? (declFocused ? '#1360d2' : '#0e1b3d') : '#697498',
                      transitionDuration: '120ms', fontFamily: font,
                    };
                  })()}>
                    <span style={{ color: '#dc3545' }}>*</span>Declaration No.
                  </span>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" strokeLinecap="round"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="9" cy="9" r="5.5"/><path d="M14 14l4 4"/>
                  </svg>
                </div>
                {isDubai && declSearchOpen && (
                  <div className="absolute left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-auto"
                    style={{ top: 'calc(100% + 4px)', zIndex: 20, maxHeight: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                    {declMatches.length === 0 ? (
                      <div className="px-[14px] py-[10px] text-[16px] text-[#697498]" style={{ fontFamily: font }}>No matches.</div>
                    ) : declMatches.map(s => (
                      <button key={s.declarationNo} type="button"
                        onMouseDown={e => { e.preventDefault(); pickDeclaration(s); }}
                        className="block w-full text-left px-[14px] py-[10px] hover:bg-[#e2ebf9] transition-colors">
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{s.declarationNo}</span>
                        <span className="text-[14px] text-[#697498] ml-[8px]" style={{ fontFamily: font }}>{s.declarationType} · {s.exitPoint} → {s.reExportTo}</span>
                      </button>
                    ))}
                  </div>
                )}
                {isDubai && (
                  <p className="text-[12px] text-[#697498]" style={{ margin: '4px 0 0', fontFamily: font }}>Pick a declaration — the remaining fields will be filled automatically.</p>
                )}
                {touched && !form.declarationNo.trim() && <p style={{ fontSize: 12, color: '#dc3545', margin: '4px 0 0' }}>Required</p>}
              </div>
              <FSelect label="Declaration Type" value={form.declarationType} onChange={v => set('declarationType', v)} options={DECLARATION_TYPES} req />
            </div>
          </div>

          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, fontFamily: font, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Shipment Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <FSelect label="Exit Point" value={form.exitPoint} onChange={v => set('exitPoint', v)} options={EXIT_POINTS} req />
              <FInput label="Actual Departure Date" value={form.actualDepartureDate} onChange={v => set('actualDepartureDate', v)} type="date" req />
              <FSelect label="Re-Export To" value={form.reExportTo} onChange={v => set('reExportTo', v)} options={RE_EXPORT_DESTS} req />
            </div>
          </div>

          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, fontFamily: font, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Quantity Details</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <FInput label="Statistical Qty" value={form.statQty} onChange={v => set('statQty', v)} type="number" placeholder="0" req />
              <FInput label="Supplementary Qty" value={form.suppQty} onChange={v => set('suppQty', v)} type="number" placeholder="0" />
              <FInput label="Weight (kg)" value={form.weight} onChange={v => set('weight', v)} type="number" placeholder="0.000" req />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, borderTop: '1px solid #eef1f6', padding: '14px 24px', display: 'flex', gap: 10 }}>
          <button onClick={onClose}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] bg-white hover:bg-[#f0f4ff]"
            style={{ border: '1.5px solid #d5ddfb', color: '#455174', fontFamily: font, fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={handleSaveAnother}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] bg-white hover:bg-[#f0f4ff]"
            style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, cursor: 'pointer' }}>
            Save &amp; Add Another
          </button>
          <button onClick={handleSave}
            className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white"
            style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500,
              boxShadow: '0px 0px 8px rgba(28,72,191,0.16)', cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HS Code row in invoice table ──────────────────────────────── */
function HSRow({ hs, inv, declNo, rt, obs, edit, selected, onToggleSelect, onPatchHs, onAdd, onEdit, onViewOb }: {
  hs: HSCodeEntry; inv: InvoiceEntry; declNo: string; rt: RefundType; obs: OutboundState;
  edit: { allocationMethod?: string };
  selected: boolean;
  onToggleSelect: () => void;
  onPatchHs: (hsId: string, patch: { allocationMethod?: string }) => void;
  onAdd: (ctx: DrawerCtx, hsIds: string[]) => void;
  onEdit: (ctx: DrawerCtx, ob: OutboundDetail) => void;
  onViewOb: (obs: OutboundDetail[]) => void;
}) {
  const key     = obKey(declNo, hs.id);
  const list    = obs[key] ?? [];
  const needsOb = needsOutbound(rt);
  const alloc   = edit.allocationMethod ?? hs.allocationMethod;

  /* Action column — 3-dot flyout: Add new outbound / View outbound details */
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos,  setMenuPos]  = useState<MenuPos | null>(null);
  const menuBtnRef              = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => { if (menuBtnRef.current && !menuBtnRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);
  const openMenu = () => {
    if (menuBtnRef.current) {
      const r = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.right - 210, width: 210 });
    }
    setMenuOpen(true);
  };
  const actionOptions = [
    { value: 'add', label: 'Add new outbound' },
    ...(list.length > 0 ? [{ value: 'view', label: 'View outbound details' }] : []),
  ];

  return (
    <tr className={selected ? 'is-selected' : ''}>
      {/* Select checkbox */}
      <td style={{ width: 44 }}>
        <button type="button" role="checkbox" aria-checked={selected} onClick={onToggleSelect}
          className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
          style={{ border: `2px solid ${selected ? '#1360d2' : '#a7abb2'}`, background: selected ? '#1360d2' : '#fff', cursor: 'pointer' }}>
          {selected && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
        </button>
      </td>
      {/* Invoice Number */}
      <td className="text-[16px] text-[#455174]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{inv.invoiceNo}</td>
      {/* Invoice Line Item No */}
      <td className="text-[16px] text-[#455174]" style={{ whiteSpace: 'nowrap', fontFamily: font, textAlign: 'center' }}>{hs.lineItemNo}</td>
      {/* HS Code */}
      <td className="text-[16px]" style={{ color: '#051937', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>{hs.hsCode}</td>
      {/* Goods Description */}
      <td className="text-[16px] text-[#0e1b3d]" style={{ minWidth: 180 }}>{hs.description}</td>
      {/* Outbound Declaration No — a single declaration is a plain link; multiple show a
          count badge that opens the view-all popup so the total is legible at a glance. */}
      <td style={{ minWidth: 170 }}>
        {list.length > 0 ? (
          list.length === 1 ? (
            <button type="button"
              onClick={() => onViewOb(list)}
              className="text-[16px] hover:underline text-left"
              style={{ color: '#1360d2', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: font, padding: 0, whiteSpace: 'nowrap' }}>
              {list[0].declarationNo || 'Outbound #1'}
            </button>
          ) : (
            <button type="button" title={`${list.length} outbound declarations`}
              onClick={() => onViewOb(list)}
              aria-label="View outbound declarations"
              className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline', border: 'none', cursor: 'pointer', fontFamily: font }}>
              {list.length}
            </button>
          )
        ) : (
          <span className="text-[16px]" style={{ color: '#c0c8d8' }}>—</span>
        )}
      </td>
      {/* Statistical Qty */}
      <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', textAlign: 'right', fontFamily: font }}>{hs.statQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></td>
      {/* Supplementary Qty */}
      <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', textAlign: 'right', fontFamily: font }}>{hs.suppQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></td>
      {/* Weight */}
      <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', textAlign: 'right', fontFamily: font }}>{hs.weight} <span className="text-[14px] text-[#697498]">kg</span></td>
      {/* Allocation Method / Unit Price / Currency — only apply to Partial Export */}
      {rt === 'partial' && (
        <>
          <td style={{ minWidth: 120 }}>
            <InlineSelect value={alloc} onChange={v => onPatchHs(hs.id, { allocationMethod: v })} options={ALLOCATION_OPTIONS} placeholder="Select" />
          </td>
          <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', textAlign: 'right', fontFamily: font }}>{hs.unitPrice}</td>
          <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{hs.currency}</td>
        </>
      )}
      {/* Action — sticky so it stays visible while the rest scrolls */}
      <td style={{ whiteSpace: 'nowrap', position: 'sticky', right: 0, zIndex: 1, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
        {needsOb ? (
          <>
            <button ref={menuBtnRef} type="button" onClick={openMenu} aria-label="Row actions" aria-haspopup="menu" aria-expanded={menuOpen}
              className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors"
              style={{ border: '1px solid #d5ddfb', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#455174"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
            </button>
            {menuOpen && menuPos && (
              <FlyoutMenu pos={menuPos} value="" options={actionOptions}
                onSelect={v => {
                  setMenuOpen(false);
                  const ctx: DrawerCtx = { declNo, invoiceNo: inv.invoiceNo, invoiceId: inv.id, hsId: hs.id, hsCode: hs.hsCode, description: hs.description };
                  if (v === 'add') onAdd(ctx, [hs.id]);
                  else if (v === 'view' && list.length > 0) onViewOb(list);
                }} />
            )}
          </>
        ) : (
          <span className="text-[16px]" style={{ color: '#c0c8d8' }}>—</span>
        )}
      </td>
    </tr>
  );
}

/* ─── Declaration row card ──────────────────────────────────────── */
function DeclRow({ d, idx, obs, invOpen, hsEdits, onPatchHs, onRefund, onAmount, onToggleInv, onAdd, onEdit, onViewOb, onDelete }: {
  d: ChargeDetail; idx: number; obs: OutboundState; invOpen: boolean;
  hsEdits: Record<string, { allocationMethod?: string; currency?: string }>;
  onPatchHs: (hsId: string, patch: { allocationMethod?: string; currency?: string }) => void;
  onRefund: (i: number, rt: RefundType) => void;
  onAmount: (i: number, v: string) => void;
  onToggleInv: (i: number) => void;
  onAdd: (ctx: DrawerCtx, hsIds: string[], onApplied?: () => void) => void;
  onEdit: (ctx: DrawerCtx, ob: OutboundDetail) => void;
  onViewOb: (obs: OutboundDetail[]) => void;
  onDelete: (i: number) => void;
}) {
  const invoices = getInvoices(d.declarationNo);
  const needsOb  = needsOutbound(d.refundType);
  const isAuto   = d.refundType === 'no' || d.refundType === 'full' || d.refundType === 'fullImport' || d.refundType === 'refund' || d.refundType === 'noRefund';
  const meta     = DECL_META[d.declarationNo] ?? { declarationType: 'Import for Re-Export', depositMethod: 'Alternative Duty' };

  /* Search above the invoice table — combined type-dropdown + input, as on the first stepper */
  const [searchType, setSearchType]         = useState<'Invoice Number' | 'HS Code'>('Invoice Number');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchText, setSearchText]         = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!searchTypeOpen) return;
    const close = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchTypeOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [searchTypeOpen]);

  const allItems = invoices.flatMap(inv => inv.hsCodes.map(hs => ({ inv, hs })));
  const q = searchText.trim().toLowerCase();
  const filteredItems = q
    ? allItems.filter(({ inv, hs }) => searchType === 'Invoice Number' ? inv.invoiceNo.toLowerCase().includes(q) : hs.hsCode.toLowerCase().includes(q))
    : allItems;

  /* Row selection — bulk-apply one outbound declaration to all selected line items */
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set());
  const toggleHs = (hsId: string) => setSelectedHs(p => {
    const next = new Set(p);
    if (next.has(hsId)) next.delete(hsId); else next.add(hsId);
    return next;
  });
  const allFilteredSelected = filteredItems.length > 0 && filteredItems.every(({ hs }) => selectedHs.has(hs.id));
  const toggleAll = () => setSelectedHs(allFilteredSelected ? new Set() : new Set(filteredItems.map(({ hs }) => hs.id)));

  const bulkAdd = () => {
    const chosen = allItems.filter(({ hs }) => selectedHs.has(hs.id));
    if (chosen.length === 0) return;
    const first = chosen[0];
    onAdd(
      { declNo: d.declarationNo, invoiceNo: first.inv.invoiceNo, invoiceId: first.inv.id, hsId: first.hs.id, hsCode: first.hs.hsCode, description: first.hs.description },
      chosen.map(({ hs }) => hs.id),
      () => setSelectedHs(new Set()),
    );
  };

  return (
    <div className="bg-white rounded-[8px] transition-colors"
      style={{ boxShadow: invOpen ? '0px 5px 32px rgba(19,96,210,0.18)' : '0px 5px 32px rgba(143,155,186,0.16)',
        border: `1.5px solid ${invOpen ? '#1360d2' : 'transparent'}` }}>
      {/* Main data row */}
      <div style={{ display: 'grid', gridTemplateColumns: COLS, minWidth: TBL_MIN,
        padding: '14px 16px', alignItems: 'center', gap: 0 }}>

        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{idx + 1}</span>
        </div>

        <div style={{ paddingRight: 8 }}>
          <p className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {d.declarationNo}
          </p>
        </div>

        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>
            {meta.declarationType}
          </span>
        </div>

        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>
            {d.depositMethod}
          </span>
        </div>

        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>
            {d.chargeType}
          </span>
        </div>

        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
            {d.depositAmount === 'N/A' ? '—' : d.depositAmount.replace(/^Dh\s*/, '')}
          </span>
        </div>

        <div style={{ paddingRight: 8 }}>
          <RefundSelect value={d.refundType} onChange={rt => onRefund(idx, rt)}
            options={hasFullRefundOptions(d.chargeType) ? REFUND_OPTIONS
              : hasDutyRefundOptions(d.chargeType) ? REFUND_OPTIONS_DUTY
              : MISSING_DOC_REFUND_OPTIONS} />
        </div>

        <div style={{ paddingRight: 8 }}>
          <input type="number" min={0} value={d.claimAmount} onChange={e => onAmount(idx, e.target.value)}
            placeholder="Enter amount" readOnly={isAuto}
            className="w-full bg-white rounded-[4px] text-[16px]"
            style={{ height: 56, border: `1px solid ${d.refundType && !d.claimAmount.trim() && d.refundType !== 'no' ? '#dc3545' : '#d5ddfb'}`,
              padding: '0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none',
              background: isAuto ? '#f8fafd' : '#fff' }} />
        </div>

        <div className="flex items-center justify-center gap-[6px]">
          <button type="button" onClick={() => onDelete(idx)} aria-label="Delete"
            className="size-[36px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors" style={{ color: '#dc3545' }}>
            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
            </svg>
          </button>
          {needsOb && (
            <button type="button" onClick={() => onToggleInv(idx)} aria-label={invOpen ? 'Collapse outbound details' : 'Expand outbound details'}
              className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors"
              style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transition: 'transform 0.15s', transform: invOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Invoices toggle bar + content */}
      {needsOb && d.refundType && (
        <>
          <div style={{ borderTop: '1px solid #eef1f6' }}>
            <button type="button" onClick={() => onToggleInv(idx)}
              className={`w-full flex items-center gap-[10px] px-[20px] py-[12px] text-left transition-colors ${invOpen ? '' : 'hover:bg-[#f8fafd]'}`}
              style={{ border: 'none', background: invOpen ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font, minWidth: TBL_MIN }}>
              <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
                style={{ transition: 'transform 0.15s', transform: invOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                <path d="M5 3l4 4-4 4"/>
              </svg>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Outbound Declaration Details</span>
              <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: invOpen ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
                {allItems.length} HS Code{allItems.length !== 1 ? 's' : ''}
              </span>

              <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>
                {invOpen ? 'Collapse' : 'Expand'}
              </span>
            </button>
          </div>

          {invOpen && (
            <div className="px-[20px] pb-[16px] pt-[16px]" style={{ borderTop: '1px solid #f5f7fc' }}>
              {/* Info — bulk apply hint */}
              <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px] mb-[12px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '20px', fontFamily: font }}>
                  Select multiple HS codes using the checkboxes to apply the same outbound declaration details to all of them at once.
                </p>
              </div>

              {/* Search (left) + bulk Add Outbound (right) */}
              <div className="flex items-start justify-between gap-[12px] mb-[12px] flex-wrap">
              {/* Combined search — type dropdown + input, as on the first stepper */}
              <div ref={searchRef} className="relative" style={{ minWidth: 320, maxWidth: 520, flex: '1 1 320px' }}>
                <div className="flex items-center bg-white rounded-[4px] h-[48px]"
                  style={{ border: `1px solid ${searchTypeOpen ? '#1360d2' : '#d5ddfb'}` }}>
                  <button type="button" onClick={() => setSearchTypeOpen(o => !o)}
                    className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full flex-shrink-0 hover:bg-[#f7faff] transition-colors rounded-l-[4px]">
                    <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{searchType}</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.5"
                      style={{ flexShrink: 0, transform: searchTypeOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <input
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder={`Search ${searchType}`}
                    className="flex-1 px-[10px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                    style={{ fontFamily: font }}
                  />
                  {searchText && (
                    <button type="button" onClick={() => setSearchText('')}
                      className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                    </button>
                  )}
                  <span className="pr-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
                  </span>
                </div>
                {searchTypeOpen && (
                  <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                    style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                    {(['Invoice Number', 'HS Code'] as const).map(opt => (
                      <button key={opt} type="button"
                        onClick={() => { setSearchType(opt); setSearchTypeOpen(false); setSearchText(''); }}
                        className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                        style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === searchType ? 500 : 400 }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bulk add — secondary button, greyed until rows are selected */}
              {(() => {
                const hasSelection = selectedHs.size > 0;
                return (
                  <button type="button" onClick={bulkAdd} disabled={!hasSelection}
                    className="h-[48px] px-[20px] rounded-[4px] text-[16px] bg-white inline-flex items-center gap-[8px] flex-shrink-0 transition-colors"
                    style={{ border: `1.5px solid ${hasSelection ? '#1360d2' : '#d5ddfb'}`, color: hasSelection ? '#1360d2' : '#a7abb2',
                      fontFamily: font, fontWeight: 500, cursor: hasSelection ? 'pointer' : 'not-allowed' }}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M7 2v10M2 7h10"/>
                    </svg>
                    Add Outbound to Selected
                    {hasSelection && (
                      <span className="text-[12px] px-[8px] py-[1px] rounded-[10px]" style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2' }}>{selectedHs.size}</span>
                    )}
                  </button>
                );
              })()}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="dt-table dt-table--lined" style={{ minWidth: 1360 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 44 }}>
                        <button type="button" aria-label="Select all" onClick={toggleAll}
                          className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
                          style={{ border: `2px solid ${selectedHs.size > 0 ? '#1360d2' : '#697498'}`, background: allFilteredSelected ? '#1360d2' : '#fff', cursor: 'pointer' }}>
                          {allFilteredSelected && (
                            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
                          )}
                          {selectedHs.size > 0 && !allFilteredSelected && (
                            <span className="block w-[10px] h-[2px] bg-[#1360d2]" />
                          )}
                        </button>
                      </th>
                      <th className="text-[16px]">Invoice Number</th>
                      <th className="text-[16px]" style={{ textAlign: 'center' }}>Invoice Line Item No.</th>
                      <th className="text-[16px]">HS Code</th>
                      <th className="text-[16px]">Goods Description</th>
                      <th className="text-[16px]">Outbound Declaration No.</th>
                      <th className="text-[16px]" style={{ textAlign: 'right' }}>Statistical Quantity</th>
                      <th className="text-[16px]" style={{ textAlign: 'right' }}>Supplementary Quantity</th>
                      <th className="text-[16px]" style={{ textAlign: 'right' }}>Weight</th>
                      {/* Allocation Method / Unit Price / Currency only apply to Partial Export */}
                      {d.refundType === 'partial' && (
                        <>
                          <th className="text-[16px]">Allocation Method</th>
                          <th className="text-[16px]" style={{ textAlign: 'right' }}>Unit Price</th>
                          <th className="text-[16px]">Currency</th>
                        </>
                      )}
                      <th className="text-[16px]" style={{ position: 'sticky', right: 0, zIndex: 2, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={d.refundType === 'partial' ? 13 : 10} className="text-[16px] text-[#697498]" style={{ textAlign: 'center', padding: '20px 12px', fontFamily: font }}>
                          No line items match “{searchText}”.
                        </td>
                      </tr>
                    ) : filteredItems.map(({ inv, hs }) => (
                      <HSRow key={hs.id} hs={hs} inv={inv} declNo={d.declarationNo} rt={d.refundType} obs={obs}
                        edit={hsEdits[hs.id] ?? {}} onPatchHs={onPatchHs}
                        selected={selectedHs.has(hs.id)} onToggleSelect={() => toggleHs(hs.id)}
                        onAdd={onAdd} onEdit={onEdit} onViewOb={onViewOb} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export function RDChargeFlowPage({ rows, onBack, onBackToListing, onContinue, title = 'Raise New Claim — Refund of Deposits', breadcrumbLast = 'Raise New Claim', prefill = false, hideSaveExit = false, steps }: {
  rows: Row[]; onBack: () => void; onBackToListing?: () => void;
  onContinue: (r: RDFlowResult) => void;
  /** Overrides for reuse in the amend flow. */
  title?: string; breadcrumbLast?: string;
  /** Amend mode: pre-fill refund type, claim amount, allocation and outbound declarations. */
  prefill?: boolean;
  /** Amend flow: hide the Save & Exit button. */
  hideSaveExit?: boolean;
  /** Override the stepper steps (e.g. amend flow without payment). */
  steps?: { id: string; label: string }[];
}) {
  const [details, setDetails] = useState<ChargeDetail[]>(() =>
    rows.map(r => {
      const chargeType = r.depositType ?? 'Alternative Duty Deposit';
      const depositAmount = r.depositAmount ?? '0';
      const depositMethod = r.depositMethod && r.depositMethod !== 'N/A'
        ? r.depositMethod
        : (DECL_META[r.declarationNo]?.depositMethod ?? 'Alternative Duty');
      const refundType: RefundType = prefill
        ? ((hasFullRefundOptions(chargeType) || hasDutyRefundOptions(chargeType)) ? 'full' : 'refund')
        : '';
      return {
        declarationNo: r.declarationNo, chargeType, depositAmount, depositMethod,
        refundType,
        outboundDeclNo: '', claimAmount: prefill ? autoAmount(refundType, depositAmount) : '',
      };
    })
  );
  // Pre-fill outbound declarations + allocation for every HS line item when amending.
  const buildPrefill = () => {
    const obs0: OutboundState = {};
    const hs0: Record<string, { allocationMethod?: string }> = {};
    rows.forEach(r => {
      if (isMissingDocCharge(r.depositType ?? '')) return;
      const sample = DUBAI_DECLARATIONS[0];
      getInvoices(r.declarationNo).forEach(inv => inv.hsCodes.forEach(hs => {
        obs0[obKey(r.declarationNo, hs.id)] = [{ id: `pf-${r.declarationNo}-${hs.id}`, customsAuthority: 'Dubai Customs', ...sample }];
        hs0[hs.id] = { allocationMethod: 'single' };
      }));
    });
    return { obs0, hs0 };
  };
  const prefilled = prefill ? buildPrefill() : { obs0: {}, hs0: {} };
  const [obs,       setObs]       = useState<OutboundState>(prefilled.obs0);
  const [invOpen,   setInvOpen]   = useState<Record<number, boolean>>({});
  const [hsEdits,   setHsEdits]   = useState<Record<string, { allocationMethod?: string }>>(prefilled.hs0);
  const [modal,     setModal]     = useState<{ ctx: DrawerCtx; hsIds: string[]; onApplied?: () => void; existing?: OutboundDetail } | null>(null);
  const [viewOb,    setViewOb]    = useState<OutboundDetail[] | null>(null);
  const [saveModal, setSaveModal] = useState(false);

  const patchHs = (hsId: string, patch: { allocationMethod?: string }) =>
    setHsEdits(p => ({ ...p, [hsId]: { ...p[hsId], ...patch } }));

  const patchRefund = (i: number, rt: RefundType) => {
    setDetails(p => p.map((d, j) => j !== i ? d : { ...d, refundType: rt, claimAmount: autoAmount(rt, d.depositAmount) }));
    if (needsOutbound(rt)) setInvOpen(p => ({ ...p, [i]: p[i] !== false }));
  };
  const patchAmount  = (i: number, v: string) => setDetails(p => p.map((d, j) => j !== i ? d : { ...d, claimAmount: v }));
  const toggleInv    = (i: number)            => setInvOpen(p => ({ ...p, [i]: !p[i] }));

  /* Delete a declaration row from the claim, with confirmation. */
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const confirmDeleteRow = () => {
    if (deleteIdx === null) return;
    const declNo = details[deleteIdx]?.declarationNo;
    setDetails(p => p.filter((_, j) => j !== deleteIdx));
    setObs(p => {
      const next = { ...p };
      Object.keys(next).forEach(k => { if (k.startsWith(`${declNo}::`)) delete next[k]; });
      return next;
    });
    setInvOpen({});
    setDeleteIdx(null);
  };

  /* Write the outbound declaration to every selected line item — the same
     declaration number can cover multiple invoices/line items. */
  const applyOb = (ctx: DrawerCtx, ob: OutboundDetail, hsIds: string[]) => {
    setObs(p => {
      const next = { ...p };
      hsIds.forEach(hsId => {
        const k = obKey(ctx.declNo, hsId);
        const list = next[k] ?? [];
        if (ctx.editId && hsId === ctx.hsId) next[k] = list.map(x => x.id === ctx.editId ? { ...ob, id: ctx.editId } : x);
        else if (!list.some(x => x.declarationNo === ob.declarationNo)) next[k] = [...list, ob];
      });
      return next;
    });
  };
  const saveOb = (ob: OutboundDetail) => {
    if (!modal) return;
    applyOb(modal.ctx, ob, modal.hsIds);
    modal.onApplied?.();
    setModal(null);
  };
  const saveObAnother = (ob: OutboundDetail) => {
    if (!modal) return;
    applyOb(modal.ctx, ob, modal.hsIds);
    setModal(m => m ? { ...m, ctx: { ...m.ctx, editId: undefined }, existing: undefined } : null);
  };
  const totalClaim = details.reduce((s, d) => s + parseAED(d.claimAmount), 0);

  /* Missing/Document Deposit claims skip the document upload step. */
  const allMissingDoc = details.length > 0 && details.every(d => isMissingDocCharge(d.chargeType));

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0 flex-wrap">
        {['Home', 'Refund & Claims', breadcrumbLast].map((l, i, arr) => (
          <React.Fragment key={l}>
            <span className="text-[16px]" style={{ color: i === arr.length - 1 ? '#111838' : '#8f94ae', fontWeight: i === arr.length - 1 ? 500 : 400 }}>{l}</span>
            {i < arr.length - 1 && <span className="text-[16px] text-[#dc3545]">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Title */}
      <div className="px-4 sm:px-10 mb-[8px] flex-shrink-0">
        <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title}</h1>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-10 pb-[20px] flex-shrink-0">
        <ClaimStepper activeIndex={1} steps={steps ?? (allMissingDoc ? REFUND_DEPOSIT_STEPS_NO_DOCS : REFUND_DEPOSIT_STEPS)} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[24px]">
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: TBL_MIN, display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* Table header card */}
            <div style={{ display: 'grid', gridTemplateColumns: COLS, background: '#a7c2e9',
              borderRadius: 8, padding: '10px 16px', gap: 0 }}>
              {['S. No.', 'Claim Declaration No.', 'Declaration Type', 'Deposit Method', 'Charge Type', 'Amount (AED)', 'Refund Type', 'Claim Amount (AED)', 'Action'].map(h => (
                <div key={h} className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap', paddingRight: 8, fontFamily: font }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Declaration row cards */}
            {details.map((d, i) => (
              <DeclRow key={d.declarationNo} d={d} idx={i} obs={obs}
                invOpen={invOpen[i] !== false && needsOutbound(d.refundType) && !!d.refundType}
                hsEdits={hsEdits} onPatchHs={patchHs}
                onRefund={patchRefund} onAmount={patchAmount} onToggleInv={toggleInv}
                onAdd={(ctx, hsIds, onApplied) => setModal({ ctx, hsIds, onApplied })}
                onEdit={(ctx, ob) => setModal({ ctx: { ...ctx, editId: ob.id }, hsIds: [ctx.hsId], existing: ob })}
                onViewOb={obs => setViewOb(obs)}
                onDelete={setDeleteIdx} />
            ))}
          </div>
        </div>

        {/* Total */}
        {details.some(d => d.claimAmount !== '') && (
          <div className="flex justify-end mt-[16px]">
            <div className="bg-white rounded-[8px] px-[24px] py-[16px] flex items-center gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>Total Claim Amount (AED)</span>
              <span className="text-[24px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>
                {totalClaim.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing ?? (() => {})}
        rightContent={
          <div className="flex gap-[12px] items-center">
            {!hideSaveExit && (
              <button onClick={() => setSaveModal(true)}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] bg-white hover:bg-[#f0f4ff]"
                style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, cursor: 'pointer' }}>
                Save &amp; Exit
              </button>
            )}
            <button onClick={() => onContinue({ details, outbounds: obs })}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white"
              style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Proceed
            </button>
          </div>
        }
      />

      {/* Add/Edit outbound modal */}
      {modal && (
        <OutboundModal ctx={modal.ctx} existing={modal.existing} targetCount={modal.hsIds.length}
          previousOutbounds={Array.from(new Map(Object.values(obs).flat().filter(o => o.declarationNo).map(o => [o.declarationNo, o])).values())}
          onSave={saveOb}
          onSaveAnother={saveObAnother}
          onClose={() => setModal(null)} />
      )}

      {/* View outbound popup */}
      {viewOb && <OutboundViewPopup obs={viewOb} onClose={() => setViewOb(null)} />}

      {saveModal && <SaveExitModal onCancel={() => setSaveModal(false)} onBackToListing={onBackToListing ?? (() => {})} />}

      {/* Delete confirmation dialog */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => setDeleteIdx(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#fff8e6' }}>
              <svg viewBox="0 0 96 96" fill="none" width="34" height="34">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#FFC020" strokeWidth="7" />
                <rect x="44.5" y="22" width="7" height="32" rx="3.5" fill="#FFC020" />
                <circle cx="48" cy="68" r="4.5" fill="#FFC020" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[8px]">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure to delete?</p>
              <p className="text-[16px] text-[#697498]" style={{ lineHeight: 1.4 }}>This declaration record will be removed from the claim.</p>
            </div>
            <div className="flex gap-[12px]">
              <button onClick={() => setDeleteIdx(null)}
                className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
                No
              </button>
              <button onClick={confirmDeleteRow}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
