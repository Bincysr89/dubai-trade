import React from 'react';

type Props = {
  onBack: () => void;
  onCreateAnother?: () => void;
  onShare?: () => void;
  claimRequestNo?: string;
  claimNo?: string;
};

export default function ClaimSubmittedSuccessPage({
  onBack,
  onCreateAnother,
  onShare,
  claimRequestNo = '4701751',
  claimNo = '3842003',
}: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <h1 className="px-4 sm:px-10 pt-[8px] text-2xl sm:text-3xl lg:text-[32px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
        Raise Claim Request
      </h1>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[32px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27 -29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
            Claim Submitted Successfully
          </p>

          <p className="text-center text-[16px] text-[#696f83]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: 1.3 }}>
            Your claim is registered and now under processing.
          </p>

          <div className="border border-[#ebebeb] rounded-[5px] px-[16px] py-[10px] flex items-center gap-[12px] flex-wrap justify-center" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div className="flex items-center gap-[6px]">
              <span className="text-[16px] text-[#696f83]">Claim Request No:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{claimRequestNo}</span>
            </div>
            <span className="text-[16px] text-[#d5ddfb]">|</span>
            <div className="flex items-center gap-[6px]">
              <span className="text-[16px] text-[#696f83]">Claim No:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{claimNo}</span>
            </div>
          </div>

          <div className="flex items-center gap-[8px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" />
            </svg>
            <span className="text-[16px] text-[#455174]">Processing time 3–5 business days.</span>
          </div>

          <div className="flex items-center gap-[12px] flex-wrap justify-center pt-[8px]">
            <button
              onClick={onBack}
              className="h-[48px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
            >
              Back to Listing
            </button>
            <button
              onClick={onCreateAnother ?? onBack}
              className="h-[48px] px-[24px] rounded-[4px] bg-[#1360d2] text-[16px] text-white hover:bg-[#0f4fab] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
            >
              Create Another Claim
            </button>
            <button
              onClick={onShare}
              className="h-[48px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors flex items-center gap-[8px]"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
