import React, { useEffect, useRef, useState } from 'react';
import Dh from './Dh';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

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
        className="bg-white rounded-[4px] flex items-center px-[16px] gap-[8px] text-left transition-colors"
        style={{ width: 390, maxWidth: '100%', height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px] whitespace-nowrap" style={{ color: value ? '#0e1b3d' : '#697498' }}>
          <span style={{ color: '#ea2428' }}>*&nbsp;&nbsp;</span>{value || 'Amendment Reason'}
        </span>
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
};

export default function NonRemittanceReviewPage({ onBack, onSubmit, onSaveAndPreview, onViewClaim, selectedRows, paymentMode = 'Credit/Debit Account', accountNo = '1223193-SW LOGISTICS LLC', title, steps, activeIndex = 3, claimType = 'Non Remittance Claim', showAmendment = false }: Props) {
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
