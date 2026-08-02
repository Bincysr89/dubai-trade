import React, { useState } from 'react';
import ClaimStepper, { VALIDITY_EXT_STEPS } from './ClaimStepper';
import Dh from './Dh';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const EXTENSION_ROWS: Row[] = [
  { declarationNo: '105-01426431-24', declarationDate: '09/10/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Import for Re Export', depositAmount: 'Dh 1,000', depositMethod: 'Standing Guarantee', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-100234' },
  { declarationNo: '404-09988123-24', declarationDate: '07/02/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Temporary Admission',  depositAmount: 'Dh 5,000', depositMethod: 'Standing Guarantee', claimExpiry: '07/01/2025', exportExpiry: '05/15/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-100567' },
  { declarationNo: '112-06617204-24', declarationDate: '09/29/2024', depositType: 'Anti Dumping Deposit',     declarationCategory: 'Import for Re Export', depositAmount: 'Dh 2,600', depositMethod: 'Standing Guarantee', claimExpiry: '05/10/2025', exportExpiry: '04/12/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-101390' },
  { declarationNo: '116-07721390-24', declarationDate: '10/02/2024', depositType: 'Safeguard Deposit',        declarationCategory: 'Import for Re Export', depositAmount: 'Dh 3,400', depositMethod: 'Standing Guarantee', claimExpiry: '05/22/2025', exportExpiry: '04/25/2025', remarks: '—', kind: 'requestExt', importerCode: 'A350', accountNumber: 'ACC-101422' },
  { declarationNo: '108-05512790-24', declarationDate: '11/02/2024', depositType: 'Duty Deposit',             declarationCategory: 'Import',               depositAmount: 'Dh 3,200', depositMethod: 'Standing Guarantee', claimExpiry: '05/01/2025', exportExpiry: '04/01/2025', remarks: '—', kind: 'requestExt', importerCode: 'A350', accountNumber: 'ACC-101045' },
];

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: (row: Row) => void;
};

export default function ValidityExtensionEligiblePage({ onBack, onBackToListing, onProceed }: Props) {
  const [selected, setSelected] = useState<string>('');
  const selectedRow = EXTENSION_ROWS.find(r => r.declarationNo === selected) ?? null;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      <div className="flex items-start px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim — Validity Extension</h1>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={0} steps={VALIDITY_EXT_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] pt-[20px] pb-[12px] border-b border-[#eef1f6] flex items-center justify-between flex-wrap gap-[8px]">
              <div>
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Eligible Declarations</p>
                <p className="text-[14px] text-[#697498] mt-[4px]">Select one declaration to extend its claim / export validity.</p>
              </div>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>Available: {EXTENSION_ROWS.length}</span>
            </div>

            <div className="overflow-x-auto px-[16px] py-[16px]">
              <table style={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
                <thead>
                  <tr>
                    {[
                      { label: '',                    w: 48  },
                      { label: 'Declaration Number',   w: 190 },
                      { label: 'Declaration Date',     w: 150 },
                      { label: 'Charge Type',          w: 210 },
                      { label: 'Amount',                w: 140 },
                      { label: 'Claim Expiry',          w: 150 },
                      { label: 'Export Expiry',         w: 150 },
                    ].map((h, i) => (
                      <th key={h.label || 'sel'} style={{ width: h.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#0e1b3d', whiteSpace: 'nowrap', borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0 }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EXTENSION_ROWS.map(row => {
                    const active = selected === row.declarationNo;
                    return (
                      <tr key={row.declarationNo} onClick={() => setSelected(row.declarationNo)} style={{ cursor: 'pointer' }}>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 48 }}>
                          <span className="size-[18px] rounded-full inline-flex items-center justify-center flex-shrink-0"
                            style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                            {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                          </span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 190 }}>
                          <span className="text-[16px] whitespace-nowrap" style={{ color: '#1360d2', fontWeight: 500 }}>{row.declarationNo}</span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 150 }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.declarationDate}</span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 210 }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.depositType}</span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 140 }}>
                          <span className="inline-flex items-center gap-[4px] text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                            <Dh style={{ fontSize: 14 }} />{row.depositAmount.replace('Dh ', '')}
                          </span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 150 }}>
                          <span className="text-[16px] whitespace-nowrap" style={{ color: '#dc3545' }}>{row.claimExpiry}</span>
                        </td>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 150 }}>
                          <span className="text-[16px] whitespace-nowrap" style={{ color: '#dc3545' }}>{row.exportExpiry}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button
          onClick={onBackToListing}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back To Listing
        </button>
        <button
          onClick={() => selectedRow && onProceed(selectedRow)}
          disabled={!selectedRow}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
          style={{ background: selectedRow ? '#1360d2' : '#a7c3eb', cursor: selectedRow ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500, boxShadow: selectedRow ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
