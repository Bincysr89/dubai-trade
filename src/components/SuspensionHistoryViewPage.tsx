import React from 'react';

const font = "'Dubai', sans-serif";

function SortIcon() {
  return (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[12px] py-[12px] px-[12px]" style={{ width: 307, minWidth: 200 }}>
      <span className="text-[14px]" style={{ color: '#696f83', fontFamily: font }}>{label}</span>
      <span className="text-[16px] font-semibold" style={{ color: '#051937', fontFamily: font }}>{value}</span>
    </div>
  );
}

const DOC_ROWS = [
  { name: 'Invoice 12124.PDF',   type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 898486.xls',  type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 189777.xls',  type: 'Invoice',               size: '50 MB', date: '08-12-2024' },
  { name: 'Invoice.xls',         type: 'Invoice',               size: '50 MB', date: '08-12-2024' },
];

type Props = {
  onBack: () => void;
};

export default function SuspensionHistoryViewPage({ onBack }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Header */}
      <div className="px-4 sm:px-10 pt-[28px] pb-[4px] flex-shrink-0">
        <h1 className="text-[28px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
          Suspension History - View
        </h1>
      </div>
      <div className="px-4 sm:px-10 pt-[8px] pb-[16px] flex-shrink-0">
        <p className="text-[24px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>
          Cargo Transfer Request No: 123456
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="flex flex-col gap-[24px]">

          {/* Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[18px] font-semibold text-[#051937]" style={{ fontFamily: font }}>Request Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="To" value="AE123 Companies" />
                <InfoCard label="CDM Comments" value="Please upload Documents" />
                <InfoCard label="Customer Response" value="Lorum Ispum" />
              </div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="bg-white rounded-[8px] px-[14px] pt-[24px] pb-[20px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="text-[24px] font-medium text-[#051937] mb-[20px]" style={{ fontFamily: font }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ width: 60, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '8px 0 0 0' }} />
                    {[
                      { label: 'Document Name',   w: 255 },
                      { label: 'Document Type',   w: 296 },
                      { label: 'Uploaded size',   w: 240 },
                      { label: 'Uploaded on',     w: 312 },
                    ].map((col) => (
                      <th key={col.label} style={{ width: col.w, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left' }}>
                        <div className="flex items-center gap-[4px]">
                          <span className="text-[14px] text-[#696f83] whitespace-nowrap">{col.label}</span>
                          <SortIcon />
                        </div>
                      </th>
                    ))}
                    <th style={{ width: 169, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>
                      <span className="text-[14px] text-[#696f83]">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOC_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#051937]">{i + 1}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.name}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.type}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.size}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.date}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <button className="hover:opacity-70 transition-opacity"><DownloadIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[18px] font-semibold text-[#051937]" style={{ fontFamily: font }}>Payment Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-[12px] px-[12px] mb-[12px]">
                <div className="size-[18px] rounded-sm flex items-center justify-center" style={{ background: '#e2ebf9', opacity: 0.7 }}>
                  <svg viewBox="0 0 14 14" width="12" height="12" fill="#1360d2"><polyline points="2,7 6,11 12,3" strokeWidth="2" stroke="#1360d2" fill="none" strokeLinecap="round" /></svg>
                </div>
                <span className="text-[16px] font-semibold text-[#051937] opacity-50" style={{ fontFamily: font }}>I disagree to Pay</span>
              </div>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="CDM Demanded Deposit" value="AED 500" />
                <InfoCard label="Reason" value="Pending Customs Decision" />
                <InfoCard label="Payment Mode" value="e-Payment" />
                <InfoCard label="Payment Reference" value="Payment Reference" />
              </div>
            </div>
          </div>

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
