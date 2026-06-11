import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

type PaymentMode = 'creditDebit' | 'epayment' | '';

type Props = {
  onBackToListing: () => void;
  onSubmit: (mode: 'creditDebit' | 'epayment') => void;
  requestNumber?: string;
  totalCharges?: number;
};

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
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[48px] rounded-[4px] border border-[#d5ddfb] px-[12px] pr-[36px] text-[16px] appearance-none bg-white focus:outline-none focus:border-[#1360d2] cursor-pointer"
        style={{ fontFamily: font, color: value ? '#0e1b3d' : '#aaa' }}
      >
        <option value="" disabled>{placeholder || 'Select'}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function VccUpdatePaymentModePage({
  onBackToListing,
  onSubmit,
  requestNumber = '25365',
  totalCharges = 30,
}: Props) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('');
  const [creditAccount, setCreditAccount] = useState('');

  const canSubmit = paymentMode === 'epayment' || (paymentMode === 'creditDebit' && !!creditAccount);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>VCC</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
            Update Payment Mode
          </span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[24px]" style={{ fontFamily: font, fontWeight: 500 }}>
          Update Payment Mode - {requestNumber}
        </h1>

        {/* Card */}
        <div
          className="bg-white rounded-[8px] p-[32px] max-w-[560px]"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
        >
          {/* Summary */}
          <div className="mb-[24px] flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>Request Number</span>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>{requestNumber}</span>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: '1px solid #f0f4ff', paddingTop: 12 }}>
              <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>Total Charges</span>
              <span className="text-[18px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 700 }}>AED {totalCharges}</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="mb-[16px]">
            <label className="block text-[16px] text-[#455174] mb-[6px]" style={{ fontFamily: font }}>Payment Mode</label>
            <StyledDropdown
              value={paymentMode}
              onChange={(v) => { setPaymentMode(v as PaymentMode); if (v !== 'creditDebit') setCreditAccount(''); }}
              options={PAYMENT_MODES}
              placeholder="Select payment mode"
            />
          </div>

          {paymentMode === 'creditDebit' && (
            <div className="mb-[16px]">
              <label className="block text-[16px] text-[#455174] mb-[6px]" style={{ fontFamily: font }}>Credit Account Number</label>
              <StyledDropdown
                value={creditAccount}
                onChange={setCreditAccount}
                options={CREDIT_ACCOUNTS}
                placeholder="Select account number"
              />
            </div>
          )}

          {/* Info note */}
          <div
            className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[12px] mb-[24px]"
            style={{ background: 'rgba(19,96,210,0.06)', border: '1px solid rgba(19,96,210,0.15)' }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-[2px]">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 9v5M10 7h.01" />
            </svg>
            <span className="text-[14px] text-[#1360d2]" style={{ fontFamily: font, lineHeight: 1.5 }}>
              Changing the payment mode will not affect your vehicle selection. You will proceed directly to payment after submitting.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-[12px]">
            <button
              onClick={onBackToListing}
              className="flex-1 h-[48px] rounded-[4px] border border-[#1360d2] text-[#1360d2] text-[16px] hover:bg-[#f0f5ff] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!canSubmit) return;
                onSubmit(paymentMode as 'creditDebit' | 'epayment');
              }}
              disabled={!canSubmit}
              className="flex-1 h-[48px] rounded-[4px] text-white text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: canSubmit ? '0px 0px 8px rgba(28,72,191,0.16)' : undefined }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBackToListing} />
    </div>
  );
}
