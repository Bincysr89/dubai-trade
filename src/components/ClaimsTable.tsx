import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';

type Status = 'Under Processing' | 'Completed' | 'Suspended' | 'Draft';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Under Processing': { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Suspended':        { bg: 'rgba(220,53,69,0.10)',  color: '#dc3545' },
  'Draft':            { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

type FlyoutId = 'view' | 'amend' | 'cancel' | 'print' | 'viewDocs' | 'history';

const ICONS: Record<FlyoutId, React.ReactNode> = {
  view:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  amend:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" /></svg>,
  cancel:   <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg>,
  print:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" /></svg>,
  viewDocs: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3M7 10h6M7 13h6" /></svg>,
  history:  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 2" /></svg>,
};

const LABELS: Record<FlyoutId, string> = {
  view: 'View Claim',
  amend: 'Amend Claim',
  cancel: 'Cancel Claim',
  print: 'Print Acknowledgement',
  viewDocs: 'View Document Required Details',
  history: 'History',
};

function getFlyoutItems(status: Status): FlyoutId[] {
  if (status === 'Completed') {
    return ['print', 'viewDocs', 'history'];
  }
  return ['view', 'amend', 'cancel'];
}

type Row = {
  reqNo: string;
  claimNo: string;
  ver: string;
  claimType: string;
  declarationNo: string;
  depositType: string;
  claimantName: string;
  claimantCode: string;
  submissionDate: string;
  status: Status;
  remark: string;
};

const ROWS: Row[] = [
  { reqNo: '4701751', claimNo: '3842003', ver: '1', claimType: 'Refund of Deposits', declarationNo: '302-09977250-24', depositType: 'Missing Document Deposit',     claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/04/2024', status: 'Under Processing', remark: '1 sub claim Settled / Approved' },
  { reqNo: '4701740', claimNo: '3842063', ver: '1', claimType: 'Refund of Deposits', declarationNo: '101-09977250-24', depositType: 'Deposit Alternative Duty Rate', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/01/2024', status: 'Completed',        remark: '1 sub claim Settled / Approved' },
  { reqNo: '4701770', claimNo: '3842073', ver: '1', claimType: 'Refund of Deposits', declarationNo: '401-09977250-24', depositType: 'Anti Dumping Deposit',          claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/02/2024', status: 'Suspended',        remark: '1 sub claim Settled / Approved' },
  { reqNo: '4701770', claimNo: '—',       ver: '1', claimType: 'Refund of Deposits', declarationNo: '105-09977250-24', depositType: 'Deposit Alternative Duty Rate', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '—',          status: 'Draft',            remark: '—' },
];

type Props = {
  onView?: () => void;
  onAmend?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
  onViewDocs?: () => void;
  onHistory?: () => void;
  showDrafts?: boolean;
};

export default function ClaimsTable({ onView, onAmend, onCancel, onPrint, onViewDocs, onHistory, showDrafts = false }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const filteredRows = useMemo(() => {
    const base = showDrafts ? ROWS.filter((r) => r.status === 'Draft') : ROWS.filter((r) => r.status !== 'Draft');
    return statusFilter ? base.filter((r) => r.status === statusFilter) : base;
  }, [statusFilter, showDrafts]);
  const STATUS_COLOR: Record<Status, string> = {
    'Under Processing': '#b45309', 'Completed': '#28a745', 'Suspended': '#dc3545', 'Draft': '#697498',
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
    { label: 'Claim Request No.',     w: 150 },
    { label: 'Claim No.',             w: 120 },
    { label: 'Ver.',                  w: 70  },
    { label: 'Claim Type',            w: 160 },
    { label: 'Declaration No.',       w: 170 },
    { label: 'Deposit Type',          w: 220 },
    { label: 'Claimant',              w: 280 },
    { label: 'Claim Submission Date', w: 170 },
    { label: 'Remark',                w: 200 },
  ];

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table style={{ minWidth: 1700, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: "'Dubai', sans-serif" }} className="w-full">
        <thead>
          <tr>
            {headers.map((col, idx) => (
              <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 12 }}>
                <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
              </th>
            ))}
            <th style={{ position: 'sticky', right: 79, width: 160, minWidth: 160, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
              <StatusFilterHeader
                label="Claim Status"
                options={Object.keys(STATUS_STYLE)}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as Status | null)}
                colorMap={STATUS_COLOR}
              />
            </th>
            <th style={{ position: 'sticky', right: 0, width: 79, minWidth: 79, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
              <span className="text-[16px] text-[#051937]" style={{ letterSpacing: '0.07px' }}>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, i) => {
            const st = STATUS_STYLE[row.status];
            const cell = (content: React.ReactNode, w: number, extra?: React.CSSProperties) => (
              <td style={{ background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w, ...extra }}>{content}</td>
            );
            const txt = (v: React.ReactNode) => <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            return (
              <tr key={i}>
                {cell(<a href="#" className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>{row.reqNo}</a>, 150, { paddingLeft: 16 })}
                {cell(txt(row.claimNo), 120)}
                {cell(txt(row.ver), 70)}
                {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.claimType}</span>, 160)}
                {cell(txt(row.declarationNo), 170)}
                {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.depositType}</span>, 220)}
                {cell(
                  <div className="flex flex-col" style={{ lineHeight: 1.3 }}>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{row.claimantName}</span>
                    <span className="text-[12px] text-[#697498]">{row.claimantCode}</span>
                  </div>, 280
                )}
                {cell(txt(row.submissionDate), 170)}
                {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.remark}</span>, 200)}
                <td style={{ position: 'sticky', right: 79, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 160, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
                  <span className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 79, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
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
                      <div className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ right: '100%', top: 0, marginRight: 6, width: 240, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {getFlyoutItems(row.status).map((id) => (
                          <button
                            key={id}
                            className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => {
                              setOpenFlyout(null);
                              if (id === 'view')     onView?.();
                              if (id === 'amend')    onAmend?.();
                              if (id === 'cancel')   onCancel?.();
                              if (id === 'print')    onPrint?.();
                              if (id === 'viewDocs') onViewDocs?.();
                              if (id === 'history')  onHistory?.();
                            }}
                          >
                            <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">{ICONS[id]}</span>
                            <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>{LABELS[id]}</span>
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
        <Pagination page={page} totalPages={1} pageSize={pageSize} totalItems={ROWS.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
  );
}
