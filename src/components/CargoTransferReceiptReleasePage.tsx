import React, { useState } from 'react';
import { ColumnFilter } from './ColumnFilter';

const font = "'Dubai', sans-serif";

type Props = {
  onBack: () => void;
};

const ROWS = [
  {
    ctNo:        '6020000194926',
    date:        '03-06-2026',
    inboundDoc:  'VIKRAM0306202601',
    clientRef:   'CT1 VIK 2026 01',
    transferor:  'AE-1000143-Al Cargo',
    releaseStatus: 'Not Released',
    receiptStatus: 'Received',
    receiptDate: '03-06-2026',
  },
  {
    ctNo:        '6020000194927',
    date:        '03-06-2026',
    inboundDoc:  'VIKRAM0306202602',
    clientRef:   'CT2 VIK 2026 01',
    transferor:  'AE-1000144-Al Cargo',
    releaseStatus: 'Released',
    receiptStatus: 'Not Received',
    receiptDate: '-',
  },
  {
    ctNo:        '6020000194928',
    date:        '02-06-2026',
    inboundDoc:  'VIKRAM0306202603',
    clientRef:   'CT3 VIK 2026 01',
    transferor:  'AE-1000145-Al Cargo',
    releaseStatus: 'Not Released',
    receiptStatus: 'Received',
    receiptDate: '02-06-2026',
  },
];

const COLS = [
  { key: 'ctNo',          label: 'Cargo Transfer No.',            w: 180 },
  { key: 'date',          label: 'Date',                          w: 120 },
  { key: 'inboundDoc',    label: 'Inbound Master Transfer Doc.No.', w: 220 },
  { key: 'clientRef',     label: "Client's Dec. Ref. No",         w: 160 },
  { key: 'transferor',    label: 'Transferor Buss.Code-Name',     w: 200 },
  { key: 'releaseStatus', label: 'Release Status',                w: 140 },
  { key: 'receiptStatus', label: 'Receipt Status',                w: 140 },
  { key: 'receiptDate',   label: 'Receipt Date',                  w: 130 },
];

function releaseStatusStyle(val: string) {
  if (val === 'Released')     return { bg: 'rgba(26,172,114,0.12)', color: '#1aac72' };
  if (val === 'Not Released') return { bg: 'rgba(220,53,69,0.10)',  color: '#dc3545' };
  return { bg: 'rgba(180,83,9,0.10)', color: '#b45309' };
}

function receiptStatusStyle(val: string) {
  if (val === 'Received')     return { bg: 'rgba(26,172,114,0.12)', color: '#1aac72' };
  if (val === 'Not Received') return { bg: 'rgba(220,53,69,0.10)',  color: '#dc3545' };
  return { bg: 'rgba(180,83,9,0.10)', color: '#b45309' };
}

export default function CargoTransferReceiptReleasePage({ onBack }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleRow = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const canConfirm = selected.size > 0;

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb — sticky */}
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Cargo Transfer</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>CT Release / Receipt</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 8 }}>
          CT Release / Receipt
        </h1>

        <div className="overflow-x-auto">
          <table style={{ minWidth: 1300, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {/* Checkbox col */}
                <th style={{ width: 48, background: '#a6c2e9', padding: '10px 8px 10px 16px', textAlign: 'left', borderRadius: '8px 0 0 8px' }} />
                {COLS.map((col, ci) => (
                  <th
                    key={col.key}
                    style={{
                      width: col.w,
                      background: '#a6c2e9',
                      padding: '10px 8px',
                      textAlign: 'left',
                      borderRadius: ci === COLS.length - 1 ? '0 8px 8px 0' : 0,
                    }}
                  >
                    <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const isSelected = selected.has(i);
                return (
                  <tr
                    key={i}
                    onClick={() => toggleRow(i)}
                    className="cursor-pointer"
                    style={{ background: isSelected ? '#e8f0fe' : '#fff', borderRadius: 8 }}
                  >
                    <td style={{ padding: '14px 8px 14px 16px', verticalAlign: 'middle', borderRadius: '8px 0 0 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <div
                        className="size-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
                        style={{ borderColor: isSelected ? '#1360d2' : '#c0c8e0', background: isSelected ? '#1360d2' : '#fff' }}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* CT No — clickable link style */}
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <button className="text-[16px] text-[#1360d2] underline hover:opacity-80" style={{ fontFamily: font }}>{row.ctNo}</button>
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <span className="text-[16px] text-[#051937]">{row.date}</span>
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <span className="text-[16px] text-[#051937]">{row.inboundDoc}</span>
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <span className="text-[16px] text-[#051937]">{row.clientRef}</span>
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <span className="text-[16px] text-[#051937]">{row.transferor}</span>
                    </td>

                    {/* Release Status badge */}
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      {(() => { const s = releaseStatusStyle(row.releaseStatus); return (
                        <span className="text-[16px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap"
                          style={{ background: s.bg, color: s.color, fontFamily: font }}>
                          {row.releaseStatus}
                        </span>
                      ); })()}
                    </td>

                    {/* Receipt Status badge */}
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      {(() => { const s = receiptStatusStyle(row.receiptStatus); return (
                        <span className="text-[16px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap"
                          style={{ background: s.bg, color: s.color, fontFamily: font }}>
                          {row.receiptStatus}
                        </span>
                      ); })()}
                    </td>

                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', borderRadius: '0 8px 8px 0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <span className="text-[16px] text-[#051937]">{row.receiptDate}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky bottom nav */}
      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center gap-[12px] px-[40px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font, fontWeight: 500 }}
          >
            Back
          </button>
          <button
            disabled={!canConfirm}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{
              background: canConfirm ? '#1360d2' : '#a7c3eb',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontFamily: font,
              fontWeight: 500,
              boxShadow: canConfirm ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
            }}
          >
            Confirm Receipt
          </button>
          <button
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors flex items-center gap-[8px]"
            style={{ fontFamily: font, fontWeight: 500 }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="6" /><path d="M15 15l3 3" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
