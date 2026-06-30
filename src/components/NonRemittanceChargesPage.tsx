import React, { useState } from 'react';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = { onBack: () => void; onContinue: (paymentMode: string, accountNo: string) => void; selectedRows: Row[] };

export default function NonRemittanceChargesPage({ onBack, onContinue, selectedRows }: Props) {
  const [paymentMode, setPaymentMode] = useState('');
  const [accountNo, setAccountNo]   = useState('1223193-SW LOGISTICS LLC');
  const canProceed = paymentMode !== '' && paymentMode !== 'Please Select';

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

          {/* Charge Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Charge Details</p>
            </div>
            <div className="px-[24px] py-[16px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font, border: '1px solid #d5ddfb', borderRadius: 6 }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#0e1b3d' }}>Charges</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 16, fontWeight: 600, color: '#0e1b3d', whiteSpace: 'nowrap' }}>Amount (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e8edf5' }}>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#0e1b3d' }}>Claim Registration Charge</td>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#0e1b3d', textAlign: 'right' }}>50.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e8edf5' }}>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#0e1b3d' }}>Knowledge-Innovation Dirham</td>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#0e1b3d', textAlign: 'right' }}>20.00</td>
                  </tr>
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#051937', fontWeight: 600 }}>Total</td>
                    <td style={{ padding: '14px 16px', fontSize: 16, color: '#051937', fontWeight: 600, textAlign: 'right' }}>70.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Mode Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Payment Mode Details</p>
            </div>
            <div className="px-[24px] py-[20px]">
              <div className="flex flex-wrap gap-[20px] items-start">
                {/* Payment Mode */}
                <div className="flex flex-col gap-[6px]" style={{ minWidth: 240, flex: '1 1 240px', maxWidth: 320 }}>
                  <label className="text-[14px] text-[#455174]" style={{ fontWeight: 500 }}>
                    <span style={{ color: '#dc3545' }}>*</span> Payment Mode
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="appearance-none w-full h-[48px] pl-[12px] pr-[36px] rounded-[4px] text-[16px] bg-white focus:outline-none focus:border-[#1360d2]"
                      style={{ border: '1px solid #d5ddfb', color: paymentMode ? '#051937' : '#697498', fontFamily: font }}
                    >
                      <option value="">Please Select</option>
                      <option value="Credit/Debit Account">Credit/Debit Account</option>
                      <option value="E-Payment">E-Payment</option>
                    </select>
                    <svg className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#455174" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Credit/Debit Account No. — only when Credit/Debit selected */}
                {paymentMode === 'Credit/Debit Account' && (
                  <div className="flex flex-col gap-[6px]" style={{ minWidth: 240, flex: '1 1 240px', maxWidth: 340 }}>
                    <label className="text-[14px] text-[#455174]" style={{ fontWeight: 500 }}>
                      <span style={{ color: '#dc3545' }}>*</span> Credit/Debit Account No.
                    </label>
                    <div className="relative">
                      <select
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                        className="appearance-none w-full h-[48px] pl-[12px] pr-[36px] rounded-[4px] text-[16px] text-[#051937] bg-white focus:outline-none focus:border-[#1360d2]"
                        style={{ border: '1px solid #d5ddfb', fontFamily: font }}
                      >
                        <option value="1223193-SW LOGISTICS LLC">1223193-SW LOGISTICS LLC</option>
                        <option value="1060423-SONY GULF UAE">1060423-SONY GULF UAE</option>
                      </select>
                      <svg className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="#455174" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* E-Payment note */}
                {paymentMode === 'E-Payment' && (
                  <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[12px] self-end" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb', flex: '1 1 240px' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                    <p className="text-[15px] text-[#0e1b3d]">You will be redirected to the e-Payment portal to complete payment.</p>
                  </div>
                )}
              </div>

              {/* Selected declarations summary */}
              {selectedRows.length > 0 && (
                <div className="mt-[20px] pt-[20px] border-t border-[#eef1f6]">
                  <p className="text-[14px] text-[#697498] mb-[8px]">
                    {selectedRows.length} declaration{selectedRows.length !== 1 ? 's' : ''} included in this claim
                  </p>
                  <div className="flex flex-wrap gap-[8px]">
                    {selectedRows.map((r) => (
                      <span key={r.declarationNo} className="inline-flex items-center px-[10px] py-[4px] rounded-[4px] text-[14px]" style={{ background: '#e8f0ff', color: '#1360d2', fontWeight: 500 }}>
                        {r.declarationNo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
          onClick={() => { if (canProceed) onContinue(paymentMode, accountNo); }}
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
