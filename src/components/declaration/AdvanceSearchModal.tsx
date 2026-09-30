import React from 'react';
import DeclarationModal from './DeclarationModal';
import { chevronSrc, font } from './DeclarationUI';

type Props = { onClose: () => void; onApply?: () => void };

function Labelled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
      <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
      <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
    </div>
  );
}

/** Advance Search — Figma 2650:59245. */
export default function AdvanceSearchModal({ onClose, onApply }: Props) {
  return (
    <DeclarationModal title="Advance Search" onClose={onClose} maxWidth={920}>
      <p className="text-[18px] text-[#0e1b3d] mb-[24px]" style={{ fontWeight: 600 }}>Select Search Criteria</p>

      <div className="max-w-[300px] mb-[32px]">
        <Labelled label="Search By" required><SelectBox value="ID Document Details" /></Labelled>
      </div>

      <p className="text-[18px] text-[#0e1b3d] mb-[24px]" style={{ fontWeight: 600 }}>ID Document Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[32px]">
        <SelectBox value="*ID Document Type" />
        <SelectBox value="*ID Document Issuing Country" />
        <Labelled label="" required>
          <input
            placeholder="ID Document No."
            className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
            style={{ fontFamily: font }}
          />
        </Labelled>
      </div>

      <div className="flex justify-end gap-[16px] mt-[36px]">
        <button data-secondary-btn type="button" onClick={onClose}
          className="h-[48px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button type="button" onClick={() => { onApply?.(); onClose(); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Apply</button>
      </div>
    </DeclarationModal>
  );
}
