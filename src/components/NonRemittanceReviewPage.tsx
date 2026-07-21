import React, { useEffect, useRef, useState } from 'react';
import Dh from './Dh';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';
import { needsOutbound, type ChargeDetail, type OutboundDetail, type OutboundState } from './RDChargeFlowPage';
import { UploadedDocsByDeclaration, type UploadedDoc } from './NonRemittanceDocumentsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const REFUND_TYPE_LABELS: Record<string, string> = {
  full: 'Full Export', fullImport: 'Full Import', partial: 'Partial Export', partialImport: 'Partial Import',
  no: 'No Export', refund: 'Refund', noRefund: 'No Refund',
};

/* All outbound declarations added for a claim declaration, deduplicated across its HS line items —
   the same outbound declaration number can cover several lines. */
function outboundsForDeclaration(outbounds: OutboundState | undefined, declNo: string): OutboundDetail[] {
  if (!outbounds) return [];
  const seen = new Set<string>();
  return Object.entries(outbounds)
    .filter(([k]) => k.startsWith(`${declNo}::`))
    .flatMap(([, list]) => list)
    .filter(ob => {
      if (seen.has(ob.declarationNo)) return false;
      seen.add(ob.declarationNo);
      return true;
    });
}

const OB_FIELDS: { label: string; get: (ob: OutboundDetail) => string }[] = [
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

/* Declaration + Outbound Details — read-only accordion, mirrors RDChargeFlowPage's DeclRow cards
   but with no editable fields, add buttons, or dropdowns; used only to review what was entered. */
function DeclarationOutboundReview({ chargeDetails, outbounds }: { chargeDetails: ChargeDetail[]; outbounds?: OutboundState }) {
  const [openDecl, setOpenDecl] = useState<Set<string>>(new Set());
  const toggle = (declNo: string) => setOpenDecl(prev => {
    const next = new Set(prev);
    if (next.has(declNo)) next.delete(declNo); else next.add(declNo);
    return next;
  });

  return (
    <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
        <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Declaration &amp; Outbound Details</p>
      </div>
      <div className="flex flex-col gap-[10px] px-[24px] py-[16px]">
        {chargeDetails.map(d => {
          const obList = needsOutbound(d.refundType) ? outboundsForDeclaration(outbounds, d.declarationNo) : [];
          const expandable = obList.length > 0;
          const isOpen = expandable && openDecl.has(d.declarationNo);
          const Header = (
            <div className="flex flex-wrap items-center justify-between gap-[16px] px-[16px] py-[14px] rounded-[6px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[8px]">
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] text-[#697498]">Declaration No.</span>
                  <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{d.declarationNo}</span>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] text-[#697498]">Charge Type</span>
                  <span className="text-[16px] text-[#0e1b3d]">{d.chargeType}</span>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] text-[#697498]">Deposit Amount</span>
                  <span className="text-[16px] text-[#0e1b3d]">{d.depositAmount === 'N/A' ? '—' : d.depositAmount.replace(/^Dh\s*/, '')}</span>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] text-[#697498]">Refund Type</span>
                  <span className="text-[16px] text-[#0e1b3d]">{REFUND_TYPE_LABELS[d.refundType] ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] text-[#697498]">Claim Amount (AED)</span>
                  <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>{d.claimAmount || '—'}</span>
                </div>
              </div>
              {expandable && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2"
                  style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
          return (
            <div key={d.declarationNo}>
              {expandable ? (
                <button type="button" onClick={() => toggle(d.declarationNo)} className="w-full text-left">{Header}</button>
              ) : Header}
              {isOpen && (
                <div className="mt-[8px] border border-[#eef1f6] rounded-[8px] overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 900, fontFamily: font }}>
                    <thead>
                      <tr style={{ background: '#a6c2e9' }}>
                        {OB_FIELDS.map(c => (
                          <th key={c.label} className="text-left text-[14px] text-[#000]" style={{ padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {obList.map(ob => (
                        <tr key={ob.id} style={{ borderTop: '1px solid #eef1f6' }}>
                          {OB_FIELDS.map(c => (
                            <td key={c.label} className="text-[15px] text-[#0e1b3d]" style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{c.get(ob) || '—'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const AMEND_REASONS = ['Wrong Details Entered', 'Other'];

/* DTSelect-style dropdown with a fixed-position menu (amendment reason). */
function AmendReasonSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    if (btnRef.current) { const r = btnRef.current.getBoundingClientRect(); setPos({ top: r.bottom + 2, left: r.left, width: r.width }); }
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
        className="bg-white rounded-[4px] flex items-center px-[16px] gap-[8px] text-left transition-colors relative"
        style={{ width: 390, maxWidth: '100%', height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="absolute pointer-events-none transition-all"
          style={{ left: (open || value) ? 10 : 16, top: (open || value) ? -9 : '50%', transform: (open || value) ? 'none' : 'translateY(-50%)',
            background: (open || value) ? '#fff' : 'transparent', padding: (open || value) ? '0 4px' : 0,
            fontSize: (open || value) ? 12 : 16, color: open ? '#1360d2' : '#697498', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>
          <span style={{ color: '#ea2428' }}>* </span>Amendment Reason
        </span>
        <span className="flex-1 text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', overflow: 'hidden', fontFamily: font }}>
          {AMEND_REASONS.map(o => {
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

type Props = {
  onBack: () => void;
  onSubmit: () => void;
  onSaveAndPreview?: () => void;
  onViewClaim?: () => void;
  selectedRows: Row[];
  paymentMode?: string;
  accountNo?: string;
  /** Overrides for reuse outside the NR flow (e.g. missing-doc refund of deposits). */
  title?: string;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
  claimType?: string;
  /** Amend mode: show an editable Amendment Detail card at the top. */
  showAmendment?: boolean;
  /** Refund of Deposits flow: declaration + outbound details entered on the Charge Details step, shown read-only. */
  chargeDetails?: ChargeDetail[];
  outbounds?: OutboundState;
  /** Documents uploaded on the Upload Documents step, shown read-only grouped by declaration. */
  uploadedDocs?: UploadedDoc[];
};

export default function NonRemittanceReviewPage({ onBack, onSubmit, onSaveAndPreview, onViewClaim, selectedRows, paymentMode = 'Credit/Debit Account', accountNo = '1223193-SW LOGISTICS LLC', title, steps, activeIndex = 3, claimType = 'Non Remittance Claim', showAmendment = false, chargeDetails, outbounds, uploadedDocs }: Props) {
  const [declared, setDeclared] = useState(false);
  const [amendReason, setAmendReason] = useState('');
  const [amendReasonDesc, setAmendReasonDesc] = useState('');

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 mb-[8px] flex items-center justify-between flex-wrap gap-[12px]">
          <div className="flex items-center gap-[16px] flex-wrap">
            <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Non Remittance'}</h1>
          </div>
          <button
            onClick={() => onViewClaim?.()}
            className="h-[40px] px-[20px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            View Claim
          </button>
        </div>

        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Amendment Detail — amend mode only */}
          {showAmendment && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Amendment Detail</p>
              </div>
              <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">
                <AmendReasonSelect value={amendReason} onChange={setAmendReason} />
                {amendReason === 'Other' && (
                  <div className="relative" style={{ width: '50%', minWidth: 300 }}>
                    <p className="text-[14px] mb-[6px]" style={{ color: '#697498' }}>Amendment Reason Description</p>
                    <textarea
                      value={amendReasonDesc}
                      onChange={e => setAmendReasonDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
                      style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white' }}
                      placeholder='Enter reason if "Other" option is selected'
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claimant Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claimant Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
              {[
                { label: 'Claimant Type',  value: 'Business' },
                { label: 'Claimant Code',  value: 'AE-9106286' },
                { label: 'Claimant Name',  value: 'SW Logistics LLC' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-[4px]">
                  <span className="text-[16px] text-[#697498]">{f.label}</span>
                  <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Request Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
              {[
                { label: 'Request No.',                         value: '2588017' },
                { label: 'Claim Type',                          value: claimType },
                { label: 'Total No. of Sub Claims in the Claim', value: String(selectedRows.length || 1) },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-[4px]">
                  <span className="text-[16px] text-[#697498]">{f.label}</span>
                  <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charge & Payment Summary */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Charges &amp; Payment</p>
            </div>
            <div className="px-[24px] py-[16px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    {['Charge Type', 'Amount (AED)', 'Payment Mode', 'Payment Reference'].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Claim Registration Charge', amt: '50.00' },
                    { type: 'Knowledge-Innovation Dirham', amt: '20.00' },
                  ].map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #eef1f6' }}>
                      <td style={{ padding: '12px 14px', fontSize: 16, color: '#0e1b3d' }}>{row.type}</td>
                      <td style={{ padding: '12px 14px', fontSize: 16, color: '#0e1b3d' }}><span className="inline-flex items-baseline gap-[3px]"><Dh style={{ fontSize: 15 }} />{row.amt}</span></td>
                      <td style={{ padding: '12px 14px', fontSize: 16, color: '#0e1b3d' }}>{paymentMode}</td>
                      <td style={{ padding: '12px 14px', fontSize: 16, color: '#0e1b3d' }}>{paymentMode === 'Credit/Debit Account' ? accountNo : '—'}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '12px 14px', fontSize: 16, color: '#051937', fontWeight: 700 }}>Total</td>
                    <td style={{ padding: '12px 14px', fontSize: 16, color: '#051937', fontWeight: 700 }}><span className="inline-flex items-baseline gap-[3px]"><Dh style={{ fontSize: 15 }} />70.00</span></td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Declaration & Outbound Details — read-only recap of the Charge Details step */}
          {chargeDetails && chargeDetails.length > 0 && (
            <DeclarationOutboundReview chargeDetails={chargeDetails} outbounds={outbounds} />
          )}

          {/* Document Details — read-only recap of the Upload Documents step, grouped by declaration */}
          {uploadedDocs && uploadedDocs.length > 0 && (
            <UploadedDocsByDeclaration docs={uploadedDocs} declOrder={selectedRows.map(r => r.declarationNo)} />
          )}

          {/* Declaration checkbox */}
          <div
            className="flex items-start gap-[14px] rounded-[8px] px-[20px] py-[16px]"
            style={{ background: '#fff', border: `1.5px solid ${declared ? '#1360d2' : '#d5ddfb'}`, boxShadow: '0px 2px 8px rgba(143,155,186,0.10)', cursor: 'pointer' }}
            onClick={() => setDeclared((v) => !v)}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={declared}
              onClick={(e) => { e.stopPropagation(); setDeclared((v) => !v); }}
              className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
              style={{ border: `2px solid ${declared ? '#1360d2' : '#a7abb2'}`, background: declared ? '#1360d2' : '#fff' }}
            >
              {declared && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
            </button>
            <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: 1.5 }}>
              I, hereby, declare that all the information entered and stated in the Request is true and correct and shall bear full responsibility for entering incorrect statement and all the consequences arising thereof.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Previous
        </button>
        <div className="flex items-center gap-[12px]">
          <button
            onClick={onSubmit}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{
              background: '#1360d2',
              cursor: 'pointer',
              fontFamily: font,
              fontWeight: 500,
              boxShadow: '0px 0px 8px rgba(28,72,191,0.16)',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
