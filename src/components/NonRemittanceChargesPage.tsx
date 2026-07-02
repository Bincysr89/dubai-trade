import React, { useRef, useState } from 'react';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const PAYMENT_MODES = ['E-Payment', 'Standing Guarantee', 'Credit/Debit Account'];
const ACCOUNT_OPTIONS = ['1223193-SW LOGISTICS LLC', '1060423-SONY GULF UAE'];

function FlyoutDropdown({
  value, options, open, onToggle, onSelect, placeholder,
}: {
  value: string; options: string[]; open: boolean;
  onToggle: () => void; onSelect: (v: string) => void; placeholder: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 200 }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-[12px] h-[48px] rounded-[4px] bg-white transition-colors text-left"
        style={{ border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font }}
      >
        <span className="text-[16px] flex-1 truncate" style={{ color: value ? '#051937' : '#697498' }}>
          {value || placeholder}
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#455174" strokeWidth="2" style={{ flexShrink: 0, marginLeft: 6, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-50 bg-white rounded-[8px] overflow-hidden"
          style={{ top: '100%', left: 0, right: 0, marginTop: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.14)', border: '1px solid #e0e6ef' }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className="group w-full flex items-center gap-[10px] px-[14px] py-[11px] text-left hover:bg-[#1360d2] transition-colors"
            >
              <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{opt}</span>
              {value === opt && (
                <svg className="ml-auto group-hover:stroke-white" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = { onBack: () => void; onContinue: (paymentMode: string, accountNo: string) => void; selectedRows: Row[] };

export default function NonRemittanceChargesPage({ onBack, onContinue }: Props) {
  const [mode, setMode] = useState('');
  const [modeOpen, setModeOpen] = useState(false);
  const [account, setAccount] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);

  const showAccount = mode === 'Credit/Debit Account';
  const canProceed = !!mode && (mode !== 'Credit/Debit Account' || !!account);

  const TOTAL_AED = 100;
  const REG_FEE = 80;
  const KI_FEE = 20;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
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
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={2} steps={NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Payment Details card */}
          <div className="bg-white rounded-[8px] overflow-visible" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Payment Details</p>
            </div>

            {/* Figma layout: header row */}
            <div className="px-[16px] pt-[16px] pb-[0px] overflow-visible">
              <div className="grid gap-[16px] items-center" style={{ gridTemplateColumns: '1fr 220px 220px' }}>
                {/* Column headers */}
                <div className="px-[16px] py-[10px] rounded-t-[4px]" style={{ background: '#a6c2e9' }}>
                  <span className="text-[16px] text-[#000]" style={{ fontWeight: 600 }}>Charges</span>
                </div>
                <div className="px-[16px] py-[10px] rounded-t-[4px]" style={{ background: '#a6c2e9' }}>
                  <span className="text-[16px] text-[#000]" style={{ fontWeight: 600 }}>Payment Mode</span>
                </div>
                <div className="px-[16px] py-[10px] rounded-t-[4px]" style={{ background: '#a6c2e9' }}>
                  <span className="text-[16px] text-[#000]" style={{ fontWeight: 600 }}>Account Number</span>
                </div>
              </div>

              {/* Data row */}
              <div className="grid gap-[16px] items-center py-[16px]" style={{ gridTemplateColumns: '1fr 220px 220px' }}>
                {/* Left: charge summary */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Total Charges AED {TOTAL_AED}</span>
                  </div>
                  <div className="flex flex-col gap-[4px] pl-[4px]">
                    <span className="text-[14px] text-[#455174]">Registration Fee AED {REG_FEE}</span>
                    <span className="text-[14px] text-[#455174]">Knowledge-Innovation Dirham Charge AED {KI_FEE}</span>
                  </div>
                </div>

                {/* Middle: Payment Mode */}
                <div className="relative">
                  <FlyoutDropdown
                    value={mode}
                    options={PAYMENT_MODES}
                    open={modeOpen}
                    onToggle={() => { setModeOpen(o => !o); setAccountOpen(false); }}
                    onSelect={(v) => { setMode(v); setModeOpen(false); if (v !== 'Credit/Debit Account') setAccount(''); }}
                    placeholder="Select Payment Mode"
                  />
                </div>

                {/* Right: Account Number — only shown for Credit/Debit */}
                <div className="relative">
                  {showAccount ? (
                    <FlyoutDropdown
                      value={account}
                      options={ACCOUNT_OPTIONS}
                      open={accountOpen}
                      onToggle={() => { setAccountOpen(o => !o); setModeOpen(false); }}
                      onSelect={(v) => { setAccount(v); setAccountOpen(false); }}
                      placeholder="Account Number"
                    />
                  ) : (
                    <span className="text-[16px] text-[#697498] px-[12px]">{mode ? '—' : ''}</span>
                  )}
                </div>
              </div>
            </div>
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
          Back
        </button>
        <div className="flex items-center gap-[12px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] hover:bg-[#f0f4ff] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            Save &amp; Exit
          </button>
          <button
            disabled={!canProceed}
            onClick={() => { if (canProceed) onContinue(mode, account); }}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{
              background: canProceed ? '#1360d2' : '#a7c3eb',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              fontFamily: font,
              fontWeight: 500,
              boxShadow: canProceed ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
