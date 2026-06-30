import React, { useRef, useState } from 'react';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';
import Dh from './Dh';

const font = "'Dubai', 'Segoe UI', sans-serif";

const PAYMENT_MODES = ['Credit/Debit Account', 'E-Payment'];
const ACCOUNT_OPTIONS = ['1223193-SW LOGISTICS LLC', '1060423-SONY GULF UAE'];

type ChargeState = { mode: string; account: string; modeOpen: boolean; accountOpen: boolean };

function FlyoutDropdown({
  value, options, open, onToggle, onSelect, placeholder,
}: {
  value: string; options: string[]; open: boolean;
  onToggle: () => void; onSelect: (v: string) => void; placeholder: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 200, flex: '1 1 200px' }}>
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

const CHARGES = [
  { key: 'reg',  label: 'Claim Registration Charge',  sub: 'Registration Fee',        amount: '100.00', total: '100.00' },
  { key: 'ki',   label: 'Knowledge-Innovation Dirham', sub: 'Knowledge & Innovation Fee', amount: '20.00', total: '20.00' },
];

export default function NonRemittanceChargesPage({ onBack, onContinue }: Props) {
  const [charges, setCharges] = useState<Record<string, ChargeState>>(
    Object.fromEntries(CHARGES.map((c) => [c.key, { mode: '', account: '', modeOpen: false, accountOpen: false }]))
  );

  const update = (key: string, patch: Partial<ChargeState>) =>
    setCharges((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const closeAll = (except?: string, field?: 'modeOpen' | 'accountOpen') =>
    setCharges((prev) => {
      const next = { ...prev };
      CHARGES.forEach((c) => {
        if (c.key !== except) {
          next[c.key] = { ...next[c.key], modeOpen: false, accountOpen: false };
        } else if (field) {
          next[c.key] = { ...next[c.key], modeOpen: field === 'modeOpen' ? !prev[c.key].modeOpen : false, accountOpen: field === 'accountOpen' ? !prev[c.key].accountOpen : false };
        }
      });
      return next;
    });

  const canProceed = CHARGES.every((c) => charges[c.key].mode !== '');
  const firstMode = charges[CHARGES[0].key].mode;
  const firstAccount = charges[CHARGES[0].key].account;

  // Declaration checkbox
  const [declared, setDeclared] = useState(false);

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
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={2} steps={NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Important Update banner */}
          <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px]" style={{ background: '#fffbf0', border: '1px solid #fff2d1' }}>
            <div className="flex items-center gap-[8px]">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#cc9200" strokeWidth="1.8" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="#cc9200" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill="#cc9200" />
              </svg>
              <span className="text-[16px] text-[#cc9200]" style={{ fontWeight: 500 }}>Important Update</span>
            </div>
            <p className="text-[16px] text-[#455174]" style={{ lineHeight: 1.4 }}>
              Declaration and claim submissions, via Dubai Trade, may currently be authenticated using either a Digital Certificate or UAE Pass login. Digital Certificate based authentication is available for a temporary period only and will be discontinued at a later date, to be announced by Dubai Customs in due course.
            </p>
          </div>

          {/* Payment Details card */}
          <div className="bg-white rounded-[8px] overflow-visible" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Payment Details</p>
            </div>
            <div className="px-[16px] py-[16px] overflow-visible">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#000', width: '34%' }}>Charges</th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#000', width: '12%' }}>{/* Amount — no heading */}</th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#000', width: '27%' }}>Payment Mode</th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#000', width: '27%' }}>Payment Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {CHARGES.map((charge, idx) => {
                    const cs = charges[charge.key];
                    const isEPayment = cs.mode === 'E-Payment';
                    return (
                      <tr key={charge.key} style={{ borderBottom: idx < CHARGES.length - 1 ? '1px solid #f0f3fa' : 'none', background: '#fff' }}>
                        {/* Charge label */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[16px]" style={{ color: '#0e1b3d', fontWeight: 500 }}>{charge.label}</span>
                        </td>
                        {/* Amount — separate column, no heading */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#0e1b3d', fontWeight: 700 }}>
                            <Dh style={{ fontSize: 15 }} /> {charge.total}
                          </span>
                        </td>
                        {/* Payment Mode */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <FlyoutDropdown
                            value={cs.mode}
                            options={PAYMENT_MODES}
                            open={cs.modeOpen}
                            onToggle={() => closeAll(charge.key, 'modeOpen')}
                            onSelect={(v) => { update(charge.key, { mode: v, account: v === 'Credit/Debit Account' ? ACCOUNT_OPTIONS[0] : '', modeOpen: false }); }}
                            placeholder="Select Payment Mode"
                          />
                        </td>
                        {/* Payment Reference — greyed out for E-Payment */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <div style={{ opacity: isEPayment ? 0.45 : 1, pointerEvents: isEPayment ? 'none' : 'auto' }}>
                            <FlyoutDropdown
                              value={cs.account}
                              options={ACCOUNT_OPTIONS}
                              open={cs.accountOpen}
                              onToggle={() => closeAll(charge.key, 'accountOpen')}
                              onSelect={(v) => update(charge.key, { account: v, accountOpen: false })}
                              placeholder="Account Number"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Declaration checkbox */}
            <div className="px-[24px] pb-[20px]">
              <div
                className="flex items-start gap-[14px] rounded-[8px] px-[20px] py-[16px] cursor-pointer"
                style={{ background: '#fff', border: `1.5px solid ${declared ? '#1360d2' : '#d5ddfb'}` }}
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
                  We, the undersigned hereby declare that the particulars given on this request are true and complete and that all the particulars have been provided and agree with the original documents. We accept full responsibility for any errors or omissions. We further undertake to comply with all regulations and laws that are in force in the country. Any misrepresentation may lead to legal action being taken against us.
                </p>
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
        <button
          disabled={!canProceed}
          onClick={() => { if (canProceed) onContinue(firstMode, firstAccount); }}
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
  );
}
