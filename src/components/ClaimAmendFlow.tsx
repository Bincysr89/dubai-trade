import React, { useEffect, useRef, useState } from 'react';
import NonRemittanceClaimViewPage from './NonRemittanceClaimViewPage';
import NonRemittanceDocumentsPage, { UploadedDoc as NRUploadedDoc } from './NonRemittanceDocumentsPage';
import NonRemittanceChargesPage from './NonRemittanceChargesPage';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', sans-serif";

const AMEND_STEPS: { id: string; label: string }[] = [
  { id: 'declarations', label: 'Declaration Details' },
  { id: 'documents',    label: 'Upload Documents' },
  { id: 'payment',      label: 'Payment Details' },
  { id: 'review',       label: 'Review & Submit' },
];

const CLAIM_TITLE = 'Amend - Non Remittance Claim - 2420390';

const AMEND_REASONS = ['Wrong Details Entered', 'Other'];

/* Declarations the user selected when raising the claim — read-only here. */
const CLAIM_DECLARATIONS = [
  { declNo: '305-08812345-24', date: '11/12/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/12/2025', exportExpiry: '06/12/2025' },
  { declNo: '305-08812346-24', date: '11/14/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/14/2025', exportExpiry: '06/14/2025' },
  { declNo: '305-08812347-24', date: '11/20/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/20/2025', exportExpiry: '06/20/2025' },
];

/* Same declarations as Row objects for the shared documents page. */
const AMEND_ROWS: Row[] = CLAIM_DECLARATIONS.map(d => ({
  declarationNo: d.declNo,
  declarationDate: d.date,
  depositType: 'Non Remittance Claim',
  declarationCategory: d.category,
  depositAmount: 'N/A',
  depositMethod: 'N/A',
  claimExpiry: d.claimExpiry,
  exportExpiry: d.exportExpiry,
  remarks: '—',
  kind: 'request',
  importerCode: 'A180',
}));

/* Documents already uploaded on the claim — shown by default when amending. */
const AMEND_INITIAL_DOCS: NRUploadedDoc[] = [
  { id: 'am-1', declNo: '305-08812345-24', docType: 'Export Bill',              fileName: 'Invoice 12124.PDF',  fileSize: 2_400_000, uploadedOn: '12/12/2024', remarks: '' },
  { id: 'am-2', declNo: '305-08812346-24', docType: 'Bill of Entry',            fileName: 'Invoice 898486.xls', fileSize: 1_100_000, uploadedOn: '12/12/2024', remarks: '' },
  { id: 'am-3', declNo: '305-08812347-24', docType: 'Exit / Entry Certificate', fileName: 'BOL123.pdf',         fileSize: 3_200_000, uploadedOn: '08/12/2024', remarks: '' },
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

      {/* Claimant and Broker Detail — same as the other claim steps */}
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

  return (
    <StepShell onBack={onBack} stepIndex={3} bottom={
      <BottomNav
        onBack={onBack}
        onProceed={onSubmit}
        proceedLabel="Submit"
        extraBtn={<OutlineBtn onClick={onViewClaim}>View Claim</OutlineBtn>}
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

// ── Success Page (full page, like the Cargo Transfer amend flow) ──────────────

function SuccessPage({ onBackToListing, onViewClaim }: { onBackToListing: () => void; onViewClaim: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBackToListing} />
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <div className="mb-[8px]">
          <PageTitle>{CLAIM_TITLE}</PageTitle>
        </div>

        {/* Important Update banner */}
        <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] mb-[24px]"
          style={{ background: '#fffbf0', border: '1px solid #fff2d1' }}>
          <div className="flex items-center gap-[8px]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#cc9200" strokeWidth="1.8" />
              <line x1="12" y1="8" x2="12" y2="13" stroke="#cc9200" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="#cc9200" />
            </svg>
            <span className="text-[16px] text-[#cc9200]" style={{ fontFamily: font, fontWeight: 500 }}>Important Update</span>
          </div>
          <p className="text-[16px] text-[#455174]" style={{ fontFamily: font, lineHeight: 1.32 }}>
            Declaration and claim submissions, via Dubai Trade, may currently be authenticated using Digital Certificate based
            authentication is available for a temporary period only and will be discontinued at later date, to be announced
            by Dubai Customs in due course
          </p>
        </div>

        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[40px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27 -29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 500 }}>
            Claim Amendment Request Submitted Successfully
          </p>

          <div className="text-center text-[16px] text-[#696f83] max-w-[776px]" style={{ fontFamily: font, lineHeight: 1.3 }}>
            <p>Your claim amendment request has been submitted successfully and sent for approval.</p>
          </div>

          <div className="flex flex-col items-center gap-[8px]">
            <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] flex items-center gap-[6px]" style={{ fontFamily: font }}>
              <span className="text-[16px] text-[#696f83]">Request Number:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>REQ123457</span>
            </div>
            <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] flex items-center gap-[6px]" style={{ fontFamily: font }}>
              <span className="text-[16px] text-[#696f83]">Claim Number:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>2420390</span>
            </div>
          </div>

          <div className="flex items-center gap-[16px]">
            <button
              onClick={onBackToListing}
              className="h-[52px] px-[40px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}
            >
              Back to Listing
            </button>
            <button
              onClick={onViewClaim}
              className="h-[52px] px-[40px] rounded-[4px] bg-[#1360d2] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}
            >
              View Claim
            </button>
          </div>
        </div>
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
  const [reason, setReason] = useState('');
  const [reasonDesc, setReasonDesc] = useState('');

  const handleSuccess  = () => setShowSuccess(true);
  const openViewClaim  = () => setShowViewClaim(true);
  const closeViewClaim = () => setShowViewClaim(false);

  if (showViewClaim) {
    return (
      <div className="flex flex-col h-full">
        <NonRemittanceClaimViewPage selectedRows={[]} uploadedDocs={[]} onBack={closeViewClaim} />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col h-full">
        <SuccessPage onBackToListing={onBack} onViewClaim={openViewClaim} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {step === 1 && <Step1 onBack={onBack}           onProceed={() => setStep(2)} onViewClaim={openViewClaim} />}
      {step === 2 && (
        <NonRemittanceDocumentsPage
          rows={AMEND_ROWS}
          title={CLAIM_TITLE}
          steps={AMEND_STEPS}
          activeIndex={1}
          initialDocs={AMEND_INITIAL_DOCS}
          hideSaveExit
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
          onBackToListing={onBack}
        />
      )}
      {step === 3 && (
        /* Payment step uses the same design as the NR / new claim flow. */
        <NonRemittanceChargesPage
          selectedRows={AMEND_ROWS}
          title={CLAIM_TITLE}
          steps={AMEND_STEPS}
          activeIndex={2}
          hideSaveExit
          chargesNote="Charges not applicable for NR Claim"
          onBack={() => setStep(2)}
          onBackToListing={onBack}
          onContinue={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <Step4 onBack={() => setStep(3)} onSubmit={handleSuccess} onViewClaim={openViewClaim}
          reason={reason} setReason={setReason} reasonDesc={reasonDesc} setReasonDesc={setReasonDesc} />
      )}
    </div>
  );
}
