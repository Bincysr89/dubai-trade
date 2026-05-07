import React from 'react';
import BackToListingBar from './BackToListingBar';

type Props = { onBack: () => void; requestNumber?: string };

type Row = {
  actionDate: string;
  actionType: string;
  actionReason: string;
};

const ROWS: Row[] = [
  { actionDate: '04-May-2026', actionType: 'Printed/Downloaded', actionReason: '' },
  { actionDate: '04-May-2026', actionType: 'Generated',          actionReason: 'VCC Generated' },
];

const EVENT_STYLE: Record<string, { bg: string; color: string }> = {
  'Generated':          { bg: 'rgba(40,167,69,0.08)', color: '#28a745' },
  'Printed/Downloaded': { bg: 'rgba(19,96,210,0.08)', color: '#1360d2' },
};

export default function VccAuditHistoryPage({ onBack, requestNumber = '25365' }: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-[40px] pt-[24px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Integrated Clearance</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[14px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Audit History</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <h1 className="px-[40px] pt-[8px] text-[32px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
        Audit History
      </h1>
      <p className="px-[40px] text-[14px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif" }}>
        Activity log for Request #{requestNumber}
      </p>

      <div className="flex-1 overflow-y-auto px-[40px] py-[24px]">
        <div className="bg-white rounded-[8px] overflow-hidden border border-[#d5ddfb]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
              <thead>
                <tr>
                  {[
                    { label: 'Action Date',   w: 220 },
                    { label: 'Action Type',   w: 260 },
                    { label: 'Action Reason', w: 'auto' },
                  ].map((c, i, arr) => (
                    <th
                      key={c.label}
                      style={{
                        background: '#e2ebf9', padding: '14px 16px', textAlign: 'left', fontWeight: 500,
                        color: '#0e1b3d', fontSize: 14, letterSpacing: '0.07px',
                        width: c.w, minWidth: typeof c.w === 'number' ? c.w : undefined,
                      }}
                    >
                      <div className="flex items-center gap-[6px]">
                        <span>{c.label}</span>
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M3 4h10M5 8h6M7 12h2" />
                        </svg>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => {
                  const ev = EVENT_STYLE[row.actionType] || { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                  return (
                    <tr key={i}>
                      <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}>
                        <span className="text-[14px] text-[#0e1b3d] whitespace-nowrap">{row.actionDate}</span>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}>
                        <span
                          className="text-[14px] inline-flex items-center justify-center whitespace-nowrap"
                          style={{ background: ev.bg, color: ev.color, padding: '4px 12px', borderRadius: 4, fontWeight: 500, lineHeight: '20px' }}
                        >
                          {row.actionType}
                        </span>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}>
                        {row.actionReason
                          ? <span className="text-[14px] text-[#0e1b3d]">{row.actionReason}</span>
                          : <span className="text-[14px] text-[#8f94ae]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBack} />
    </div>
  );
}
