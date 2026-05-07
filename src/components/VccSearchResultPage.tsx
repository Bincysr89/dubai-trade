import React, { useEffect, useRef, useState } from 'react';
import Pagination from './Pagination';
import BackToListingBar from './BackToListingBar';

type Props = {
  onBack: () => void;
  onSubmit?: () => void;
  /** When set, prefill selected vehicles (used by Amend Request) */
  initialSelected?: string[];
  /** Header label & sticky action when in amend mode */
  mode?: 'create' | 'amend';
};

type Vehicle = {
  id: string;
  bhassis: string;
  chassis: string;
  make: string;
  brand: string;
  engineNumber: string;
  model: string; // year
  color: string;
};

const SAMPLE_BRANDS  = ['Aston Martin', 'Ferrari', 'Porsche', 'Bentley', 'Lamborghini', 'McLaren', 'Maserati', 'Bugatti'];
const SAMPLE_COLORS  = ['Red', 'Black', 'White', 'Silver', 'Blue', 'Green', 'Grey', 'Yellow'];
const SAMPLE_YEARS   = ['2010', '2012', '2022', '2018', '2020', '2024', '2015', '2023'];
const SAMPLE_ENGINES = ['EN-9381472', 'EN-2284917', 'EN-7190334', 'EN-5572819', 'EN-3098471', 'EN-6411238', 'EN-8823746', 'EN-1107592'];

const VEHICLES: Vehicle[] = Array.from({ length: 8 }, (_, i) => ({
  id: `v${i}`,
  bhassis: `BHASSIS0${i + 1}`,
  chassis: `BHASSIS0${i + 1}`,
  make: 'ACURAATEISLDFGDLLLDFDLSDFDKKKD',
  brand: SAMPLE_BRANDS[i],
  engineNumber: SAMPLE_ENGINES[i],
  model: SAMPLE_YEARS[i],
  color: SAMPLE_COLORS[i],
}));

const VCC_PER_VEHICLE = 50;     // AED
const KNOWLEDGE_FEES = 5;       // AED, applied once per request when count > 0

const SummaryRow = ({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) => (
  <div className="flex items-center justify-between py-[10px]" style={{ borderBottom: highlight ? 'none' : '1px dashed #e2ebf9' }}>
    <span className="text-[14px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif" }}>{label}</span>
    <span
      className={`text-[14px] ${highlight ? 'text-[#0e1b3d]' : 'text-[#0e1b3d]'} whitespace-nowrap`}
      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: highlight ? 700 : 500, fontSize: highlight ? 16 : 14 }}
    >
      {value}
    </span>
  </div>
);

const FilterIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 4h10M5 8h6M7 12h2" />
  </svg>
);

export default function VccSearchResultPage({ onBack, onSubmit, initialSelected, mode = 'create' }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialSelected ?? []));
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(8);
  const [paymentMode, setPaymentMode] = useState('');
  const [creditAccount, setCreditAccount] = useState('');

  const allChecked = selected.size === VEHICLES.length;
  const someChecked = selected.size > 0 && !allChecked;

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(VEHICLES.map((v) => v.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const count = selected.size;
  const vccCharges = count * VCC_PER_VEHICLE;
  const knowledgeFees = count > 0 ? KNOWLEDGE_FEES : 0;
  const total = vccCharges + knowledgeFees;
  const fmt = (n: number) => `Dh ${n.toLocaleString()}`;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-[40px] pt-[24px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <h1 className="px-[40px] pt-[8px] text-[32px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
        {mode === 'amend' ? 'Amend VCC Request' : 'Request VCC'}
      </h1>
      {mode === 'amend' && (
        <div className="px-[40px] pt-[8px]">
          <div className="bg-[#e2ebf9] border border-[#b7cff3] rounded-[6px] px-[16px] py-[10px] flex items-start gap-[10px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.7" className="flex-shrink-0 mt-[2px]">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v5M10 14h.01" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                You are amending request <strong>25345</strong>. The originally selected vehicles are pre-checked below.
              </p>
              <p className="text-[14px] text-[#455174] mt-[2px]">Add more vehicles or uncheck any to remove them, then click <strong>Submit Amendment</strong>.</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-column body */}
      <div className="flex-1 overflow-y-auto px-[40px] py-[24px]">
        <div className="grid gap-[24px] items-start grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="flex flex-col gap-[24px] min-w-0">
            {/* Declaration Details summary card */}
            <div className="bg-white rounded-[8px] px-[24px] py-[16px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <p className="text-[20px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
                Declaration Details
              </p>
              <div className="flex flex-wrap items-start gap-x-[28px] gap-y-[12px] divide-x divide-[#e2ebf9]">
                <Field label="Declaration Number" value="103-00011064425-3" />
                <Field label="Declaration Date"   value="09/11/2024" />
                <Field label="Declaration Type"   value="IM3 - Import to Local from CW" />
                <Field label="Declaration Owner"  value="AE-8123187 VIKRAM SINGH CTO GULF DENIM LIMITED (LLC)" wide />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-[8px] px-[24px] py-[20px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
                Vehicle Details
              </p>
              <p className="text-[14px] text-[#455174] mt-[4px] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Choose the vehicle details which is required to apply certificate
              </p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
                  <thead>
                    <tr>
                      {[
                        { label: '', w: 48, checkbox: true },
                        { label: 'Chassis Number', w: 140 },
                        { label: 'Vehicle Make',   w: 240 },
                        { label: 'Vehicle Brand',  w: 140 },
                        { label: 'Engine Number',  w: 150 },
                        { label: 'Vehicle Model',  w: 110 },
                        { label: 'Vehicle Color',  w: 110 },
                      ].map((c, i) => (
                        <th
                          key={i}
                          style={{
                            background: '#e2ebf9',
                            padding: '12px 12px',
                            textAlign: 'left',
                            fontWeight: 500,
                            width: c.w,
                            minWidth: c.w,
                            borderTopLeftRadius:  i === 0 ? 6 : 0,
                            borderTopRightRadius: i === 6 ? 6 : 0,
                          }}
                        >
                          {c.checkbox ? (
                            <Checkbox
                              checked={allChecked}
                              indeterminate={someChecked}
                              onChange={toggleAll}
                            />
                          ) : (
                            <div className="flex items-center gap-[6px]">
                              <span className="text-[14px] text-[#455174]" style={{ letterSpacing: '0.07px' }}>{c.label}</span>
                              <FilterIcon />
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {VEHICLES.slice(0, pageSize).map((v) => {
                      const checked = selected.has(v.id);
                      return (
                        <tr key={v.id} style={{ background: checked ? '#f7faff' : '#fff' }}>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <Checkbox checked={checked} onChange={() => toggleOne(v.id)} />
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <span className="text-[14px] text-[#455174] inline-flex items-center justify-center px-[8px] py-[3px] rounded-[4px] bg-[#e2ebf9]" style={{ minWidth: 86 }}>{v.bhassis}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa', maxWidth: 240 }}>
                            <span className="text-[14px] text-[#0e1b3d]" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.make}>{v.make}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <span className="text-[14px] text-[#0e1b3d]">{v.brand}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <span className="text-[14px] text-[#0e1b3d] font-mono">{v.engineNumber}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <span className="text-[14px] text-[#0e1b3d]">{v.model}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}>
                            <span className="text-[14px] text-[#0e1b3d]">{v.color}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pt-[16px]">
                <Pagination
                  page={page}
                  totalPages={7}
                  pageSize={pageSize}
                  totalItems={7 * pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Payment Summary */}
          <div className="bg-white rounded-[8px] px-[20px] py-[16px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div>
              <p className="text-[18px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
                Payment Summary
              </p>
              <SummaryRow label="No. of Vehicles Selected" value={count} />
              <SummaryRow label="VCC Charges"     value={fmt(vccCharges)} />
              <SummaryRow label="Knowledge Fees"  value={fmt(knowledgeFees)} />
              <div className="flex items-center justify-between py-[14px] mt-[6px]" style={{ borderTop: '1px solid #e2ebf9' }}>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>Total Amount</span>
                <span className="text-[18px] text-[#1360d2]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>{fmt(total)}</span>
              </div>

              <div className="mt-[10px]">
                <label className="block text-[14px] text-[#455174] mb-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>Payment Mode</label>
                <StyledDropdown
                  value={paymentMode}
                  onChange={(v) => { setPaymentMode(v); if (v !== 'creditDebit') setCreditAccount(''); }}
                  options={PAYMENT_MODES}
                  placeholder="Select payment mode"
                />
              </div>

              {paymentMode === 'creditDebit' && (
                <div className="mt-[12px]">
                  <label className="block text-[14px] text-[#455174] mb-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>Credit Account Number</label>
                  <StyledDropdown
                    value={creditAccount}
                    onChange={setCreditAccount}
                    options={CREDIT_ACCOUNTS}
                    placeholder="Select account number"
                  />
                </div>
              )}

              <button
                onClick={() => { if (count > 0 && paymentMode && (paymentMode !== 'creditDebit' || creditAccount)) onSubmit?.(); }}
                disabled={count === 0 || !paymentMode || (paymentMode === 'creditDebit' && !creditAccount)}
                className="mt-[16px] w-full h-[48px] rounded-[4px] text-[16px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
              >
                {mode === 'amend' ? 'Submit Amendment' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBack} />

    </div>
  );
}

const PAYMENT_MODES = [
  { value: 'creditDebit', label: 'Credit/Debit Account' },
  { value: 'epayment',    label: 'ePayment' },
];

const CREDIT_ACCOUNTS = [
  { value: '1011146', label: '1011146' },
  { value: '102343',  label: '102343' },
];

function StyledDropdown({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selected = options.find((m) => m.value === value);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full h-[44px] bg-white border border-[#d5ddfb] rounded-[4px] px-[14px] cursor-pointer hover:border-[#1360d2] transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className="text-[14px] font-medium whitespace-nowrap"
          style={{ fontFamily: "'Dubai', sans-serif", color: selected ? '#1360d2' : '#697498' }}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          className={`text-[#1360d2] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-[80] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ top: 48, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
          role="listbox"
        >
          {options.map((m) => {
            const active  = m.value === value;
            const isHover = hovered === m.value;
            const bg     = active || isHover ? '#e2ebf9' : 'transparent';
            const color  = active || isHover ? '#1360d2' : '#0e1b3d';
            const weight = active || isHover ? 500 : 400;
            return (
              <button
                key={m.value}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setHovered(m.value)}
                onMouseLeave={() => setHovered((h) => (h === m.value ? null : h))}
                onClick={() => { onChange(m.value); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[14px] transition-colors"
                style={{ background: bg, color, fontFamily: "'Dubai', sans-serif", fontWeight: weight }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div
      className="flex flex-col gap-[2px] min-w-0 first:pl-0 [&:not(:first-child)]:pl-[28px]"
      style={wide ? { flex: '1 1 280px' } : { flex: '0 0 auto' }}
    >
      <span className="text-[14px] text-[#8f94ae] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>{label}</span>
      <span
        className="text-[14px] text-[#0e1b3d]"
        style={{
          fontFamily: "'Dubai', sans-serif",
          fontWeight: 500,
          whiteSpace: wide ? 'normal' : 'nowrap',
        }}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="size-[20px] rounded-[4px] flex items-center justify-center transition-colors"
      style={{ border: '2px solid ' + (checked || indeterminate ? '#1360d2' : '#a7abb2'), background: checked || indeterminate ? '#1360d2' : '#fff' }}
    >
      {checked && (
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8l3 3 7-7" />
        </svg>
      )}
      {!checked && indeterminate && (
        <span style={{ display: 'block', width: 10, height: 2, background: '#fff', borderRadius: 1 }} />
      )}
    </button>
  );
}

