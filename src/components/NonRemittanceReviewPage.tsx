import React, { useState } from 'react';
import Dh from './Dh';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBack: () => void;
  onSubmit: () => void;
  onSaveAndPreview?: () => void;
  onViewClaim?: () => void;
  selectedRows: Row[];
  paymentMode?: string;
  accountNo?: string;
};

export default function NonRemittanceReviewPage({ onBack, onSubmit, onSaveAndPreview, onViewClaim, selectedRows, paymentMode = 'Credit/Debit Account', accountNo = '1223193-SW LOGISTICS LLC' }: Props) {
  const [declared, setDeclared] = useState(false);

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
            <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim - Non Remittance</h1>
          </div>
          <button
            onClick={() => onViewClaim?.()}
            className="h-[40px] px-[20px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            View Claim
          </button>
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
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
                { label: 'Claim Type',                          value: 'Non Remittance Claim' },
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
            disabled={!declared}
            onClick={() => { if (declared) onSubmit(); }}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{
              background: declared ? '#1360d2' : '#a7c3eb',
              cursor: declared ? 'pointer' : 'not-allowed',
              fontFamily: font,
              fontWeight: 500,
              boxShadow: declared ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
