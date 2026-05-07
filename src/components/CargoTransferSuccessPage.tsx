import React from 'react';

type Props = { onBack: () => void; requestNumber?: string; mode?: 'create' | 'amend' };

export default function CargoTransferSuccessPage({ onBack, requestNumber = '12345678', mode = 'create' }: Props) {
  const headline = mode === 'amend' ? 'Amendment Submitted Successfully' : 'Request Submitted Successfully';
  const body = mode === 'amend'
    ? 'Your Cargo Transfer Amendment has been successfully submitted.'
    : 'Your Cargo Request has been successfully submitted.';
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      <div className="flex items-start justify-between px-[40px] pt-[24px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <h1 className="px-[40px] pt-[8px] text-[32px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
        New Cargo Transfer Request
      </h1>

      <div className="flex-1 overflow-y-auto px-[40px] py-[24px]">
        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[40px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27 -29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
            {headline}
          </p>

          <div className="text-center text-[16px] text-[#696f83] max-w-[776px]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: 1.3 }}>
            <p>
              {body} Please click here to <a className="text-[#1360d2] underline" href="#">view</a> the Declaration Details.
            </p>
            <p>The Details can also be viewed from Track Request Service</p>
          </div>

          <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] flex items-center gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <span className="text-[14px] text-[#696f83]">Request Number is:</span>
            <span className="text-[14px] text-[#1360d2]" style={{ fontWeight: 500 }}>{requestNumber}</span>
          </div>

          <button
            onClick={onBack}
            className="h-[52px] px-[40px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, textTransform: 'capitalize' }}
          >
            Back to Listing
          </button>
        </div>
      </div>
    </div>
  );
}
