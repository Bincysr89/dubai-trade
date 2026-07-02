import React from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBack: () => void;
  onViewAck: () => void;
  onViewClaim: () => void;
};

export default function NonRemittanceSuccessPage({ onBack, onViewAck, onViewClaim }: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <h1 className="text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>

        {/* Success card */}
        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[32px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {/* Green checkmark */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27-29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontWeight: 500 }}>
            Non Remittance Claim Submitted Successfully
          </p>

          <p className="text-[16px] text-[#696f83] text-center max-w-[640px]" style={{ lineHeight: 1.5 }}>
            Your Non Remittance Claim has been submitted successfully and is currently under processing. Please click on View Claim button for the details.
          </p>

          {/* Reference chips */}
          <div className="flex flex-col sm:flex-row items-center gap-[12px]">
            <div className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[16px] text-[#696f83]">Claim Request Number:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>2588017</span>
            </div>
            <div className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[16px] text-[#696f83]">Claim No. &amp; Version:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>2420390-1 (Under Processing)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-[14px]">
            <button
              onClick={onBack}
              className="h-[52px] px-[28px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Back to Listing
            </button>
            <button
              onClick={onViewAck}
              className="h-[52px] px-[28px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Print Claim Acknowledgement Receipt
            </button>
            <button
              onClick={onViewClaim}
              className="h-[52px] px-[32px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              View Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
