import React from 'react';

const font = "'Dubai', sans-serif";

type SuspRow = {
  suspensionDate: string;
  cdmComments: string;
  responseDate: string;
  customerResponse: string;
};

const ROWS: SuspRow[] = [
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Please upload required documents', responseDate: '24/02/24, 09:30', customerResponse: 'Please upload required documents' },
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Document Uploaded',                responseDate: '24/02/24, 09:30', customerResponse: 'Document Uploaded' },
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Charges Paid',                     responseDate: '24/02/24, 09:30', customerResponse: 'Charges Paid' },
];

function SortIcon() {
  return (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
    </svg>
  );
}

type Props = {
  onBack: () => void;
  onView: () => void;
};

export default function SuspensionHistoryPage({ onBack, onView }: Props) {
  const headers: { label: string; w: number }[] = [
    { label: 'Suspension Date',   w: 160 },
    { label: 'CDM Comments',      w: 352 },
    { label: 'Response Date',     w: 200 },
    { label: 'Customer Response', w: 362 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Header */}
      <div className="px-4 sm:px-10 pt-[28px] pb-[20px] flex-shrink-0">
        <h1 className="text-[28px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
          Suspension History
        </h1>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="overflow-x-auto">
          <table style={{ minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {headers.map((col) => (
                  <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500 }}>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[12px] font-semibold text-[#051937] whitespace-nowrap" style={{ letterSpacing: '0.06px' }}>{col.label}</span>
                      <SortIcon />
                    </div>
                  </th>
                ))}
                <th style={{ width: 210, minWidth: 210, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500 }}>
                  <span className="text-[12px] font-semibold text-[#051937]">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const cell = (content: React.ReactNode, w: number) => (
                  <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8' }}>{content}</td>
                );
                return (
                  <tr key={i}>
                    {cell(<span className="text-[14px] text-[#051937] whitespace-nowrap">{row.suspensionDate}</span>, 160)}
                    {cell(<span className="text-[12px] font-medium text-[#051937] whitespace-nowrap">{row.cdmComments}</span>, 352)}
                    {cell(<span className="text-[14px] text-[#051937] whitespace-nowrap">{row.responseDate}</span>, 200)}
                    {cell(<span className="text-[12px] font-medium text-[#051937] whitespace-nowrap">{row.customerResponse}</span>, 362)}
                    <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 210, borderBottom: '1px solid #f8f8f8' }}>
                      <button
                        onClick={onView}
                        className="text-[14px] font-medium underline"
                        style={{ color: '#1360d2', fontFamily: font, letterSpacing: '0.07px' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-10" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center px-[40px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
