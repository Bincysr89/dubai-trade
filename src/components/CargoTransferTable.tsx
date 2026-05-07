import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';

type Status = 'Requested' | 'Assigned' | 'Completed' | 'Suspended' | 'Declined' | 'Withdrawn' | 'Amended' | 'Draft Submitted';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Requested':       { bg: 'rgba(19,96,210,0.08)', color: '#1360d2' },
  'Assigned':        { bg: 'rgba(255,169,26,0.16)', color: '#fbb500' },
  'Completed':       { bg: 'rgba(40,167,69,0.08)', color: '#28a745' },
  'Suspended':       { bg: 'rgba(220,53,69,0.08)', color: '#dc3545' },
  'Declined':        { bg: 'rgba(220,53,69,0.08)', color: '#dc3545' },
  'Withdrawn':       { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Amended':         { bg: 'rgba(19,96,210,0.08)', color: '#1360d2' },
  'Draft Submitted': { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

const FLYOUT_ITEMS: { id: 'amend' | 'cancel' | 'audit'; label: string; icon: React.ReactNode }[] = [
  { id: 'amend',  label: 'Amend Request',  icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" /></svg> },
  { id: 'cancel', label: 'Cancel Request', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg> },
  { id: 'audit',  label: 'Audit History',  icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 2" /></svg> },
];

type Row = {
  reqNo: string;
  cargoNo: string;
  txType: string;
  status: Status;
  createdDate: string;
  remarks: string;
  result: string;
};

const ROWS: Row[] = [
  { reqNo: '34521', cargoNo: 'CT-1029384', txType: 'CTO → CH (Same Location)',     status: 'Completed',       createdDate: '04-May-2026', remarks: 'Submitted on time',   result: 'Cleared' },
  { reqNo: '34520', cargoNo: 'CT-1029383', txType: 'CTO → CH (Different Location)', status: 'Assigned',        createdDate: '03-May-2026', remarks: 'Awaiting inspection', result: 'In Progress' },
  { reqNo: '34519', cargoNo: 'CT-1029382', txType: 'CH → CH (Same Location)',      status: 'Requested',       createdDate: '03-May-2026', remarks: '—',                   result: 'Pending Assign' },
  { reqNo: '34518', cargoNo: 'CT-1029381', txType: 'CTO → CTO (Different Location)', status: 'Suspended',     createdDate: '02-May-2026', remarks: 'Hold by customs',     result: 'Hold' },
  { reqNo: '34517', cargoNo: 'CT-1029380', txType: 'CH → CH (Different Location)', status: 'Draft Submitted', createdDate: '02-May-2026', remarks: 'Saved as draft',      result: '—' },
];

type Props = { onAmend?: () => void; onCancel?: () => void; onAudit?: () => void };

export default function CargoTransferTable({ onAmend, onCancel, onAudit }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const filteredRows = useMemo(() => statusFilter ? ROWS.filter((r) => r.status === statusFilter) : ROWS, [statusFilter]);
  const STATUS_COLOR: Record<Status, string> = {
    Requested: '#1360d2', Assigned: '#fbb500', Completed: '#28a745',
    Suspended: '#dc3545', Declined: '#dc3545', Withdrawn: '#697498',
    Amended: '#1360d2', 'Draft Submitted': '#697498',
  };

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const headers: { label: string; w: number }[] = [
    { label: 'Request Number',    w: 130 },
    { label: 'Cargo Transfer No.', w: 160 },
    { label: 'Transaction Type',   w: 260 },
    { label: 'Created Date',       w: 130 },
    { label: 'Remarks',            w: 240 },
  ];

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table style={{ minWidth: 1500, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: "'Dubai', sans-serif" }} className="w-full">
        <thead>
          <tr>
            {headers.map((col) => (
              <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#e2ebf9', padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] text-[#455174] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>{col.label}</span>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M5 8h6M7 12h2" /></svg>
                </div>
              </th>
            ))}
            <th style={{ position: 'sticky', right: 79, width: 170, minWidth: 170, background: '#e2ebf9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
              <StatusFilterHeader
                label="Request Status"
                options={Object.keys(STATUS_STYLE)}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as Status | null)}
                colorMap={STATUS_COLOR}
              />
            </th>
            <th style={{ position: 'sticky', right: 0, width: 79, minWidth: 79, background: '#e2ebf9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
              <span className="text-[14px] text-[#455174]" style={{ letterSpacing: '0.07px' }}>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, i) => {
            const st = STATUS_STYLE[row.status];
            const cell = (content: React.ReactNode, w: number) => (
              <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: w }}>{content}</td>
            );
            const txt = (v: React.ReactNode) => <span className="text-[14px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            return (
              <tr key={i}>
                {cell(<a href="#" className="text-[14px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>{row.reqNo}</a>, 130)}
                {cell(txt(row.cargoNo), 160)}
                {cell(txt(row.txType), 260)}
                {cell(txt(row.createdDate), 130)}
                {cell(<span className="text-[14px] text-[#455174]" title={row.remarks} style={{ display: 'block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.remarks}</span>, 240)}
                <td style={{ position: 'sticky', right: 79, background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 170, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
                  <span className="text-[14px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 79, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
                  <div className="relative inline-block" ref={openFlyout === i ? flyoutRef : undefined}>
                    <button
                      className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                      aria-label="More actions"
                      onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                    >
                      <svg viewBox="0 0 4 18" width="4" height="18" fill="#697498">
                        <circle cx="2" cy="2" r="2" /><circle cx="2" cy="9" r="2" /><circle cx="2" cy="16" r="2" />
                      </svg>
                    </button>
                    {openFlyout === i && (
                      <div className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ right: '100%', top: 0, marginRight: 6, width: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {FLYOUT_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => {
                              setOpenFlyout(null);
                              if (item.id === 'amend')  onAmend?.();
                              if (item.id === 'cancel') onCancel?.();
                              if (item.id === 'audit')  onAudit?.();
                            }}
                          >
                            <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">{item.icon}</span>
                            <span className="text-[14px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pt-[16px]">
        <Pagination page={page} totalPages={4} pageSize={pageSize} totalItems={4 * pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
  );
}
