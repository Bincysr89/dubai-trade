import React, { useState } from 'react';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[14px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text-[20px] px-[4px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

const versionRows = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', status: 'Under Processing', isCurrentlyViewing: true },
];

type Props = { onBack: () => void; selectedRows: Row[] };

export default function NonRemittanceClaimViewPage({ onBack, selectedRows }: Props) {
  const [expandedDecls, setExpandedDecls] = useState<Set<string>>(new Set());

  const displayRows = selectedRows.length > 0 ? selectedRows : [
    { declarationNo: '3030004738426', declarationDate: '01/01/2026', depositType: 'Non Remittance Claim', declarationCategory: null, depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '', exportExpiry: '', remarks: 'Sample remark', kind: 'request' as const },
  ];

  const allExpanded = expandedDecls.size === displayRows.length;

  function toggleAll() {
    if (allExpanded) {
      setExpandedDecls(new Set());
    } else {
      setExpandedDecls(new Set(displayRows.map((r) => r.declarationNo)));
    }
  }

  function toggleDecl(no: string) {
    setExpandedDecls((prev) => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no);
      else next.add(no);
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[28px] text-[#111838] mb-[20px] mt-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>
          View Claim
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details */}
          <Section title="Claim Header Details">
            <div className="flex flex-wrap">
              <FieldItem label="Claim No. & Version" value="2420390-1 (Under Processing)" />
              <FieldItem label="Claim Type" value="Non Remittance Claim" />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Claimant" value="SW Logistics LLC (Business - AE-9106286)" />
              <FieldItem label="Beneficiary" value="SW Logistics LLC (Business - AE-9106286)" />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Claim Registration Date" value="29/06/2026" />
              <FieldItem label="Claim Status" value="Under Processing" />
            </div>
          </Section>

          {/* Charges And Payment Details */}
          <Section title="Charges And Payment Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Charge Type', 'Amount (AED)', 'Payment Mode', 'Receipt No.', 'Payment Reference Details'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Claim Registration Charge', amt: '50.00', receipt: 'A-100650705' },
                    { type: 'Knowledge-Innovation Dirham', amt: '20.00', receipt: 'A-100650706' },
                  ].map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.amt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>Credit/Debit Account</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 SW LOGISTICS LLC</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>70.00</span></td>
                    <td colSpan={3} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Declaration Details */}
          <Section title="Declaration Details">
            <div className="px-[16px] py-[12px]">
              <div className="flex justify-end mb-[12px]">
                <button
                  onClick={toggleAll}
                  className="text-[14px] underline"
                  style={{ color: '#1360d2', fontFamily: font, background: 'none' }}
                >
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>
              <div className="flex flex-col gap-[10px]">
                {displayRows.map((row) => {
                  const isExpanded = expandedDecls.has(row.declarationNo);
                  return (
                    <div key={row.declarationNo} className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #e0e6ef' }}>
                      <button
                        onClick={() => toggleDecl(row.declarationNo)}
                        className="w-full flex items-center justify-between px-[16px] py-[12px] text-left"
                        style={{ background: isExpanded ? '#f0f6ff' : '#f8fafd', fontFamily: font }}
                      >
                        <span className="text-[16px]" style={{ color: '#0e1b3d', fontWeight: 500 }}>{row.declarationNo}</span>
                        <svg
                          viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#455174" strokeWidth="2"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="px-[16px] py-[16px] border-t border-[#e0e6ef]" style={{ background: '#fff' }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[16px]">
                            {[
                              { label: 'Declaration No.', value: row.declarationNo },
                              { label: 'Claim Type', value: 'Non Remittance Claim' },
                              { label: 'Remarks', value: row.remarks || '—' },
                            ].map((f) => (
                              <div key={f.label} className="flex flex-col gap-[4px]">
                                <span className="text-[13px]" style={{ color: '#697498', fontFamily: font }}>{f.label}</span>
                                <span className="text-[15px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{f.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-[12px] pt-[12px]" style={{ borderTop: '1px solid #f0f3fa' }}>
                            <span className="text-[13px]" style={{ color: '#697498', fontFamily: font }}>Attached Document</span>
                            <p className="text-[15px] text-[#455174] mt-[2px]" style={{ fontFamily: font }}>
                              No document uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Claim Request Versions */}
          <Section title="Claim Request Versions">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 600 }}>
                <thead>
                  <tr>
                    {['Version', 'Submitted Date', 'Status', 'Currently Viewing'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {versionRows.map((row) => (
                    <tr key={row.version} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="text-[15px] underline" style={{ color: '#1360d2', cursor: 'pointer', fontFamily: font }}>{row.version}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[15px]" style={{ color: '#051937', fontFamily: font }}>{row.submittedDate}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[13px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {row.isCurrentlyViewing
                          ? <span className="text-[14px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 500 }}>✓ Currently Viewing</span>
                          : <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)' }}>
        <button
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Close
        </button>
        <button
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          View Doc. Submission Status
        </button>
      </div>
    </div>
  );
}
