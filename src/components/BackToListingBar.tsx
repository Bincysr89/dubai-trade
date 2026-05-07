import React from 'react';

type Props = {
  onBack: () => void;
  label?: string;
  rightContent?: React.ReactNode;
};

/**
 * Sticky bottom action bar. Reference: Figma node 71:123333.
 * Used on Create / View / Amend Request screens to return to the listing.
 */
export default function BackToListingBar({ onBack, label = 'Back to Listing', rightContent }: Props) {
  return (
    <div
      className="bg-white px-[40px] py-[16px] flex items-center justify-between flex-shrink-0"
      style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}
    >
      <button
        onClick={onBack}
        className="h-[48px] px-[20px] py-[10px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors"
        style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, textTransform: 'capitalize' }}
      >
        {label}
      </button>
      {rightContent}
    </div>
  );
}
