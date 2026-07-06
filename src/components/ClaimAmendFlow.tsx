import React, { useEffect, useRef, useState } from 'react';
import NonRemittanceClaimViewPage from './NonRemittanceClaimViewPage';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper from './ClaimStepper';

const font = "'Dubai', sans-serif";

const AMEND_STEPS: { id: string; label: string }[] = [
  { id: 'declarations', label: 'Declaration Details' },
  { id: 'documents',    label: 'Upload Documents' },
  { id: 'payment',      label: 'Payment Details' },
  { id: 'review',       label: 'Review & Submit' },
];

const CLAIM_TITLE = 'Amend - Non Remittance Claim - 2420390';

const AMEND_REASONS = ['Add/Update Documents', 'Correction in Claim Details', 'Other'];

/* Declarations the user selected when raising the claim — read-only here. */
const CLAIM_DECLARATIONS = [
  { declNo: '305-08812345-24', date: '11/12/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/12/2025', exportExpiry: '06/12/2025' },
  { declNo: '305-08812346-24', date: '11/14/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/14/2025', exportExpiry: '06/14/2025' },
  { declNo: '305-08812347-24', date: '11/20/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/20/2025', exportExpiry: '06/20/2025' },
];

type UploadedDoc = { name: string; type: string; size: string; date: string };

const INITIAL_DOCS: UploadedDoc[] = [
  { name: 'Invoice 12124.PDF',  type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 898486.xls', type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'BOL123.pdf',         type: 'AWB/BOL',  size: '50 MB', date: '08-12-2024' },
];

// ── shared helpers (mirrors ClaimCancelFlow) ─────────────────────────────────

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[12px]" style={{ minWidth: 240, flex: '0 0 280px' }}>
      <span className="text-[16px]" style={{ fontFamily: font, color: '#455174', whiteSpace: 'nowrap' }}>{label}</span>
      <span className="text-[18px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>{value || '—'}</span>
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[28px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0e1b3d' }}>
      {children}
    </h1>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[20px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>
      {children}
    </p>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-[8px] overflow-hidden ${className}`}
      style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}
    >
      {children}
    </div>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[48px] px-[20px] rounded-[4px] flex items-center justify-center text-[16px] hover:bg-[#f0f4ff] transition-colors"
      style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[48px] px-[40px] rounded-[4px] flex items-center justify-center text-[16px] text-white hover:opacity-90 transition-opacity"
      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function BottomNav({ onBack, onProceed, proceedLabel = 'Next', extraBtn }: {
  onBack: () => void;
  onProceed?: () => void;
  proceedLabel?: string;
  extraBtn?: React.ReactNode;
}) {
  return (
    <div
      className="flex-shrink-0 bg-white flex items-center justify-between px-[40px] h-[88px]"
      style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}
    >
      <OutlineBtn onClick={onBack}>Back</OutlineBtn>
      <div className="flex items-center gap-[12px]">
        {extraBtn}
        {onProceed && <PrimaryBtn onClick={onProceed}>{proceedLabel}</PrimaryBtn>}
      </div>
    </div>
  );
}

function Breadcrumb({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Refund &amp; Claims</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Amend Claim</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-9106286 — SW Logistics LLC</span>
      </div>
    </div>
  );
}

function StepShell({ onBack, stepIndex, children, bottom }: {
  onBack: () => void; stepIndex: number; children: React.ReactNode; bottom: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <div className="mb-[8px]">
          <PageTitle>{CLAIM_TITLE}</PageTitle>
        </div>
        <div className="mb-[20px]">
          <ClaimStepper activeIndex={stepIndex} steps={AMEND_STEPS} />
        </div>
        <div className="flex flex-col gap-[24px]">
          {children}
        </div>
      </div>
      {bottom}
    </div>
  );
}

/* DTSelect-style dropdown with a fixed-position menu. */
function FlySelect({ value, onChange, options, placeholder, required, width = 390 }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; required?: boolean; width?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
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
        className="bg-white rounded-[4px] flex items-center px-[16px] gap-[8px] text-left transition-colors"
        style={{ width, maxWidth: '100%', height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px] whitespace-nowrap" style={{ color: value ? '#0e1b3d' : '#697498' }}>
          {required && <span style={{ color: '#ea2428' }}>*&nbsp;&nbsp;</span>}
          {value || placeholder}
        </span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
            overflow: 'hidden', fontFamily: font }}>
          {options.map(o => {
            const isSel = o === value;
            return (
              <button key={o} type="button" role="option" aria-selected={isSel}
                onMouseDown={e => { e.preventDefault(); onChange(o); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                style={{ background: isSel ? '#e2ebf9' : 'transparent', color: isSel ? '#1360d2' : '#0e1b3d', fontWeight: isSel ? 500 : 400, fontFamily: font }}>
                {o}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Step 1: Declaration Details (read-only) ──────────────────────────────────

function Step1({ onBack, onProceed, onViewClaim }: { onBack: () => void; onProceed: () => void; onViewClaim: () => void }) {
  return (
    <StepShell onBack={onBack} stepIndex={0} bottom={<BottomNav onBack={onBack} onProceed={onProceed} />}>
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between">
          <SectionLabel>Declaration Details</SectionLabel>
          <OutlineBtn onClick={onViewClaim}>
            <span className="whitespace-nowrap">View Claim</span>
          </OutlineBtn>
        </div>
        <Card className="p-[20px]">
          <p className="text-[16px] text-[#455174] mb-[16px]" style={{ fontFamily: font }}>
            Declarations included in this claim. Declarations cannot be added or removed during amendment.
          </p>
          <div className="overflow-x-auto">
            <table className="dt-table dt-table--lined" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th className="text-[16px]">Declaration No.</th>
                  <th className="text-[16px]">Declaration Date</th>
                  <th className="text-[16px]">Declaration Category</th>
                  <th className="text-[16px]">Owner Code</th>
                  <th className="text-[16px]">Claim Expiry</th>
                  <th className="text-[16px]">Export Expiry</th>
                </tr>
              </thead>
              <tbody>
                {CLAIM_DECLARATIONS.map(d => (
                  <tr key={d.declNo}>
                    <td className="text-[16px]" style={{ color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>{d.declNo}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.date}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.category}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.ownerCode}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.claimExpiry}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.exportExpiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </StepShell>
  );
}

// ── Step 2: Document Upload + Remarks ─────────────────────────────────────────

function Step2({ onBack, onProceed, docs, setDocs, remarks, setRemarks }: {
  onBack: () => void; onProceed: () => void;
  docs: UploadedDoc[]; setDocs: (d: UploadedDoc[]) => void;
  remarks: string; setRemarks: (v: string) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <StepShell onBack={onBack} stepIndex={1} bottom={<BottomNav onBack={onBack} onProceed={onProceed} />}>
      {/* Upload card */}
      <Card className="p-[24px]">
        <div className="flex gap-[24px] flex-wrap">
          <div className="flex-1" style={{ minWidth: 280 }}>
            <p className="text-[24px] mb-[8px]" style={{ fontFamily: font, fontWeight: 500, color: '#060c28' }}>Upload Documents</p>
            <p className="text-[18px] mb-[20px]" style={{ fontFamily: font, color: '#323c64' }}>
              Upload any additional documents for this claim, we will share the documents with authorities
            </p>
            <label className="flex items-center gap-[17px] cursor-pointer select-none">
              <div className="flex-shrink-0 size-[18px] rounded-full border-[2px] flex items-center justify-center" style={{ borderColor: '#1360d2' }}>
                <div className="size-[9px] rounded-full bg-[#1360d2]" />
              </div>
              <span className="text-[18px]" style={{ fontFamily: font, color: '#060c28' }}>Supporting Documents</span>
            </label>
          </div>

          <div className="bg-white rounded-[8px] overflow-hidden p-[20px] flex flex-col gap-[12px]" style={{ width: 516, maxWidth: '100%', border: '1px solid #f0f0f5' }}>
            <p className="text-[20px]" style={{ fontFamily: font, fontWeight: 500, color: '#060c28' }}>Upload File</p>
            <p className="text-[16px]" style={{ fontFamily: font, color: '#323c64' }}>
              *Supported file type of .pdf, .jpg etc, max file size up to 50MB
            </p>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); }}
              className="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-[12px] rounded-[4px] transition-colors"
              style={{
                background: dragging ? '#e2ebf9' : '#f8fafd',
                border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}`,
              }}
            >
              <div className="size-[60px] rounded-full bg-[#dfe5e9] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-[16px]" style={{ fontFamily: font, color: '#6d707e' }}>Drag and drop or</p>
              <button
                className="h-[48px] px-[20px] rounded-[4px] text-[16px] hover:bg-[#f0f4ff] transition-colors"
                style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font }}
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Remarks */}
      <Card className="p-[20px]">
        <p className="text-[20px] mb-[12px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>Remarks</p>
        <textarea
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          rows={3}
          className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
          style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white', maxWidth: 700 }}
          placeholder="Enter remarks (optional)"
        />
      </Card>

      {/* Documents uploaded table — rows can be deleted */}
      <Card className="p-[20px]">
        <p className="text-[24px] mb-[16px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>Documents Uploaded</p>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
            <thead>
              <tr>
                {['', 'Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'].map((h, i) => (
                  <th
                    key={h + i}
                    style={{
                      background: '#a6c2e9', padding: '10px 12px', textAlign: 'left',
                      fontWeight: 500, fontSize: 14, color: '#696f83',
                      borderRadius: i === 0 ? '8px 0 0 8px' : i === 5 ? '0 8px 8px 0' : 0,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px 12px', fontSize: 16, color: '#697498', textAlign: 'center' }}>No documents uploaded.</td>
                </tr>
              ) : docs.map((doc, i) => (
                <tr key={doc.name}>
                  <td style={{ padding: '12px', fontSize: 16, color: '#051937', textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.name}</td>
                  <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.type}</td>
                  <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.size}</td>
                  <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.date}</td>
                  <td style={{ padding: '12px' }}>
                    <div className="flex items-center gap-[16px]">
                      <button
                        onClick={() => setDocs(docs.filter((_, j) => j !== i))}
                        className="text-[#dc3545] hover:opacity-70 transition-opacity" aria-label="Delete">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                      <button className="text-[#1360d2] hover:opacity-70 transition-opacity" aria-label="Download">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </StepShell>
  );
}

// ── Step 3: Payment ───────────────────────────────────────────────────────────

const PAYMENT_MODES = ['Credit/Debit Account', 'Cash', 'Cheque'];
const PAYMENT_REFS  = ['Standard Guarantee', 'Account Number', 'Transaction ID'];

function PaySelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
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
        className="w-full bg-white rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 48, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px]" style={{ color: '#0e1b3d' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
            overflow: 'hidden', fontFamily: font }}>
          {options.map(o => {
            const isSel = o === value;
            return (
              <button key={o} type="button" role="option" aria-selected={isSel}
                onMouseDown={e => { e.preventDefault(); onChange(o); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                style={{ background: isSel ? '#e2ebf9' : 'transparent', color: isSel ? '#1360d2' : '#0e1b3d', fontWeight: isSel ? 500 : 400, fontFamily: font }}>
                {o}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

function Step3({ onBack, onProceed, onViewClaim }: { onBack: () => void; onProceed: () => void; onViewClaim: () => void }) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef, setPaymentRef]   = useState('Standard Guarantee');

  return (
    <StepShell onBack={onBack} stepIndex={2} bottom={<BottomNav onBack={onBack} onProceed={onProceed} proceedLabel="Proceed" />}>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <SectionLabel>Payment Details</SectionLabel>
          <OutlineBtn onClick={onViewClaim}>
            <span className="whitespace-nowrap">View Claim</span>
          </OutlineBtn>
        </div>
        <Card className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {['Charges', 'Amount', 'Payment Mode', 'Payment Reference'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 8px', textAlign: 'left', fontSize: 16, fontWeight: 500, color: '#051937',
                      borderRadius: i === 0 ? '5px 0 0 5px' : i === 3 ? '0 5px 5px 0' : 0,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '16px 8px', fontSize: 18, fontWeight: 500, color: '#051937' }}>
                  Claim Amendment Charge:
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <div className="flex items-center gap-[12px]">
                    <span className="text-[18px]" style={{ fontFamily: font, color: '#051937' }}>AED 50.00</span>
                    <span
                      className="text-[16px] px-[12px] py-[4px] rounded-[4px]"
                      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
                    >
                      Collect
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ width: 260 }}>
                    <PaySelect value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} />
                  </div>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ width: 260 }}>
                    <PaySelect value={paymentRef} onChange={setPaymentRef} options={PAYMENT_REFS} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* Claimant and Broker Detail — same as Raise New Claim */}
      <ClaimantBrokerDetail />
    </StepShell>
  );
}

// ── Step 4: Amendment Details + Review / Submit ───────────────────────────────

function Step4({ onBack, onSubmit, onViewClaim, reason, setReason, reasonDesc, setReasonDesc }: {
  onBack: () => void; onSubmit: () => void; onViewClaim: () => void;
  reason: string; setReason: (v: string) => void;
  reasonDesc: string; setReasonDesc: (v: string) => void;
}) {
  const [declared, setDeclared] = useState(false);
  const canSubmit = declared && !!reason;

  return (
    <StepShell onBack={onBack} stepIndex={3} bottom={
      <BottomNav
        onBack={onBack}
        onProceed={canSubmit ? onSubmit : undefined}
        proceedLabel="Submit"
        extraBtn={
          <>
            <OutlineBtn onClick={onViewClaim}>View Claim</OutlineBtn>
            {!canSubmit && (
              <button
                disabled
                className="h-[48px] px-[40px] rounded-[4px] flex items-center justify-center text-[16px] text-white"
                style={{ background: '#a7c3eb', fontFamily: font, fontWeight: 500, cursor: 'not-allowed' }}
              >
                Submit
              </button>
            )}
          </>
        }
      />
    }>
      {/* Amendment Detail — first card */}
      <Card className="p-[20px]">
        <p className="text-[20px] mb-[20px]" style={{ fontFamily: font, fontWeight: 500 }}>Amendment Detail</p>
        <div className="flex flex-col gap-[20px]">
          <FlySelect value={reason} onChange={setReason} options={AMEND_REASONS} placeholder="Amendment Reason" required />
          {reason === 'Other' && (
            <div className="relative" style={{ width: '50%', minWidth: 300 }}>
              <p className="text-[14px] mb-[6px]" style={{ fontFamily: font, color: '#697498' }}>Amendment Reason Description</p>
              <textarea
                value={reasonDesc}
                onChange={e => setReasonDesc(e.target.value)}
                rows={2}
                className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
                style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white' }}
                placeholder='Enter reason if "other" option is selected'
              />
            </div>
          )}
        </div>
      </Card>

      {/* Claimant Details */}
      <div className="flex flex-col gap-[8px]">
        <SectionLabel>Claimant Details</SectionLabel>
        <Card className="px-[20px] py-[32px]">
          <div className="flex flex-wrap gap-[20px]">
            <InfoCard label="Claimant Type" value="Business" />
            <InfoCard label="Claimant Code" value="AE-9106286" />
            <InfoCard label="Claimant Name" value="SW Logistics LLC" />
          </div>
        </Card>
      </div>

      {/* Request Details */}
      <div className="flex flex-col gap-[8px]">
        <SectionLabel>Request Details</SectionLabel>
        <Card className="px-[20px] py-[32px]">
          <div className="flex flex-wrap gap-[20px]">
            <InfoCard label="Request No." value="2588017" />
            <InfoCard label="Claim Type" value="Non Remittance Claim" />
            <InfoCard label="Total No. of Sub Claims in the Claim" value="1" />
          </div>
        </Card>
      </div>

      {/* Declaration checkbox */}
      <Card className="px-[20px] py-[16px]">
        <label className="flex items-start gap-[16px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={declared}
            onChange={e => setDeclared(e.target.checked)}
            className="size-[20px] rounded cursor-pointer flex-shrink-0 mt-[2px]"
            style={{ accentColor: '#1360d2' }}
          />
          <span className="text-[16px]" style={{ fontFamily: font, color: '#0e1b3d' }}>
            I, hereby, declare that all the information entered and stated in the Request is true and correct and shall bear full responsibility for entering incorrect statement and all the consequences arising thereof.
          </span>
        </label>
      </Card>
    </StepShell>
  );
}

// ── Success Popup ─────────────────────────────────────────────────────────────

function SuccessPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-[8px] flex flex-col items-center justify-center gap-[16px] px-[60px] py-[60px]"
        style={{ minWidth: 520, maxWidth: 600, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
      >
        <div
          className="size-[100px] rounded-full flex items-center justify-center"
          style={{ background: '#27ae60' }}
        >
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-[24px] text-center" style={{ fontFamily: font, fontWeight: 500, color: '#111838' }}>
          Claim Amendment Request Submitted Successfully
        </p>

        <div className="text-center flex flex-col gap-[8px]">
          <p className="text-[18px]" style={{ fontFamily: font, color: '#455174' }}>
            Your request has been sent for approval.
          </p>
          <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] inline-flex items-center gap-[6px]" style={{ fontFamily: font }}>
            <span className="text-[16px] text-[#696f83]">Request Number:</span>
            <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>REQ123457</span>
          </div>
          <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] inline-flex items-center gap-[6px]" style={{ fontFamily: font }}>
            <span className="text-[16px] text-[#696f83]">Claim Number:</span>
            <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>2420390</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-[48px] px-[24px] rounded-[3px] text-[16px] text-white capitalize hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back to Listing
        </button>
      </div>
    </div>
  );
}

// ── Main flow ─────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

type Props = { onBack: () => void };

export default function ClaimAmendFlow({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showViewClaim, setShowViewClaim] = useState(false);
  const [docs, setDocs] = useState<UploadedDoc[]>(INITIAL_DOCS);
  const [remarks, setRemarks] = useState('');
  const [reason, setReason] = useState('');
  const [reasonDesc, setReasonDesc] = useState('');

  const handleSuccess  = () => setShowSuccess(true);
  const handleClose    = () => { setShowSuccess(false); onBack(); };
  const openViewClaim  = () => setShowViewClaim(true);
  const closeViewClaim = () => setShowViewClaim(false);

  if (showViewClaim) {
    return (
      <div className="flex flex-col h-full">
        <NonRemittanceClaimViewPage selectedRows={[]} uploadedDocs={[]} onBack={closeViewClaim} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {step === 1 && <Step1 onBack={onBack}           onProceed={() => setStep(2)} onViewClaim={openViewClaim} />}
        {step === 2 && (
          <Step2 onBack={() => setStep(1)} onProceed={() => setStep(3)}
            docs={docs} setDocs={setDocs} remarks={remarks} setRemarks={setRemarks} />
        )}
        {step === 3 && <Step3 onBack={() => setStep(2)} onProceed={() => setStep(4)} onViewClaim={openViewClaim} />}
        {step === 4 && (
          <Step4 onBack={() => setStep(3)} onSubmit={handleSuccess} onViewClaim={openViewClaim}
            reason={reason} setReason={setReason} reasonDesc={reasonDesc} setReasonDesc={setReasonDesc} />
        )}
      </div>

      {showSuccess && <SuccessPopup onClose={handleClose} />}
    </>
  );
}
