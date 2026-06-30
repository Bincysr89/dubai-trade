import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

type Status = 'Under Processing' | 'Completed' | 'Suspended' | 'Draft' | 'Submitted';
type FlyoutId = 'view' | 'amend' | 'cancel' | 'print' | 'viewDocs' | 'history' | 'uploadDoc' | 'printReceipt' | 'continue';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Suspended':        { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Draft':            { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
};

const ICONS: Record<FlyoutId, React.ReactNode> = {
  view:         <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  amend:        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" /></svg>,
  cancel:       <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg>,
  print:        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" /></svg>,
  viewDocs:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3M7 10h6M7 13h6" /></svg>,
  history:      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 2" /></svg>,
  uploadDoc:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10M5 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" /></svg>,
  printReceipt: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h12v14l-2-1-2 1-2-1-2 1-2-1-2 1V3z" /><path d="M7 7h6M7 10h6M7 13h4" /></svg>,
  continue:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const LABELS: Record<FlyoutId, string> = {
  view:         'View Claim',
  amend:        'Amend Claim',
  cancel:       'Cancel Claim',
  print:        'Print Acknowledgement',
  viewDocs:     'View Document Required Details',
  history:      'Audit History',
  uploadDoc:    'Upload Document',
  printReceipt: 'Print Claim Submission Receipt',
  continue:     'Continue',
};

function getFlyoutItems(status: Status, isDraft: boolean): FlyoutId[] {
  if (isDraft) return ['continue'];
  if (status === 'Completed') return ['viewDocs', 'history'];
  if (status === 'Submitted') return ['view', 'uploadDoc', 'printReceipt', 'history'];
  return ['view', 'amend', 'cancel'];
}

type DeclDetail = {
  declNo: string;
  date: string;
  category: string;
  ownerCode: string;
  claimExpiry: string;
  exportExpiry: string;
};

type ClaimRow = {
  reqNo: string;
  claimNo: string;
  ver: string;
  claimType: string;
  declarations: DeclDetail[];
  depositType: string;
  claimantName: string;
  claimantCode: string;
  submissionDate: string;
  status: Status;
  remark: string;
};

const CLAIM_ROWS: ClaimRow[] = [
  {
    reqNo: '2588017', claimNo: '2420390', ver: '1', claimType: 'Non Remittance',
    declarations: [
      { declNo: '305-08812345-24', date: '11/12/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/12/2025', exportExpiry: '06/12/2025' },
      { declNo: '305-08812346-24', date: '11/14/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/14/2025', exportExpiry: '06/14/2025' },
      { declNo: '305-08812347-24', date: '11/20/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/20/2025', exportExpiry: '06/20/2025' },
    ],
    depositType: 'Non Remittance Claim', claimantName: 'SW Logistics LLC', claimantCode: 'AE-9106286', submissionDate: '29/06/2026', status: 'Submitted', remark: '—',
  },
  {
    reqNo: '4701751', claimNo: '3842003', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '302-09977250-24', date: '11/02/2024', category: 'Cargo Transfer from CTO to CH', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '06/01/2025', exportExpiry: 'N/A' },
      { declNo: '302-09977251-24', date: '11/08/2024', category: 'Cargo Transfer from CH to CH',  ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '06/08/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'Missing Document Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/04/2024', status: 'Under Processing', remark: '1 sub claim Settled / Approved',
  },
  {
    reqNo: '4701740', claimNo: '3842063', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '101-09977250-24', date: '09/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025' },
    ],
    depositType: 'Deposit Alternative Duty Rate', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/01/2024', status: 'Completed', remark: '1 sub claim Settled / Approved',
  },
  {
    reqNo: '4701770', claimNo: '3842073', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '401-09977250-24', date: '07/02/2024', category: 'Temporary Admission', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '07/01/2025', exportExpiry: '05/15/2025' },
      { declNo: '401-09977251-24', date: '08/05/2024', category: 'Temporary Admission', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '08/05/2025', exportExpiry: '07/05/2025' },
      { declNo: '401-09977252-24', date: '09/10/2024', category: 'Import',              ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '09/10/2025', exportExpiry: 'N/A'         },
    ],
    depositType: 'Anti Dumping Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/02/2024', status: 'Suspended', remark: '1 sub claim Settled / Approved',
  },
];

const DRAFT_ROWS: ClaimRow[] = [
  {
    reqNo: '4701770', claimNo: '—', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '105-09977250-24', date: '09/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025' },
      { declNo: '105-09977251-24', date: '09/15/2024', category: 'Import',               ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '05/15/2025', exportExpiry: 'N/A'         },
    ],
    depositType: 'Deposit Alternative Duty Rate', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '—', status: 'Draft', remark: '—',
  },
];

function DeclarationsModal({ declarations, onClose }: { declarations: DeclDetail[]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[1000px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        {/* Dark navy header — same as VccListPopup */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px]">
          <div>
            <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>Declaration Details</p>
            <p className="text-[12px] text-[#a7c3eb]">{declarations.length} declaration{declarations.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Bordered inner table — same as VccListPopup */}
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 860, fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['#', 'Declaration No.', 'Date', 'Category', 'Owner Code', 'Claim Expiry', 'Export Expiry'].map((h, i) => (
                    <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap', width: i === 0 ? 44 : undefined }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {declarations.map((d, i) => (
                  <tr key={d.declNo} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                    <td className="text-[16px] text-[#1360d2]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{d.declNo}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.date}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'normal', lineHeight: 1.3 }}>{d.category}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.ownerCode}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.claimExpiry}</td>
                    <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.exportExpiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-[24px] py-[16px]" style={{ borderTop: '1px solid #e2ebf9' }}>
          <button
            onClick={onClose}
            className="h-[44px] px-[22px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors"
            style={{ fontWeight: 500, fontSize: 14, fontFamily: font }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  onView?: () => void;
  onAmend?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
  onViewDocs?: () => void;
  onHistory?: () => void;
  showDrafts?: boolean;
  showColModal?: boolean;
  onCloseColModal?: () => void;
};

export default function ClaimsTable({ onView, onAmend, onCancel, onPrint, onViewDocs, onHistory, showDrafts = false, showColModal, onCloseColModal }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [declModal, setDeclModal] = useState<DeclDetail[] | null>(null);

  const STATUS_COLOR: Record<Status, string> = {
    'Under Processing': '#b45309', 'Completed': '#28a745', 'Suspended': '#dc3545', 'Draft': '#697498', 'Submitted': '#1360d2',
  };

  useEffect(() => {
    setPage(1);
    setStatusFilter(null);
    setOpenFlyout(null);
  }, [showDrafts]);

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const rows = useMemo(() => {
    const base = showDrafts ? DRAFT_ROWS : CLAIM_ROWS;
    return statusFilter ? base.filter((r) => r.status === statusFilter) : base;
  }, [showDrafts, statusFilter]);

  const CLAIMS_COL_DEFS: (ColDef & { w: number; draftsOnly?: boolean; claimsOnly?: boolean })[] = [
    { key: 'reqNo',           label: 'Claim Request No.',     w: 150 },
    { key: 'claimNo',         label: 'Claim No.',             w: 120, claimsOnly: true },
    { key: 'ver',             label: 'Ver.',                  w: 70  },
    { key: 'claimType',       label: 'Claim Type',            w: 160 },
    { key: 'declarations',    label: 'No. of Declarations',   w: 150 },
    { key: 'depositType',     label: 'Deposit Type',          w: 220 },
    { key: 'claimant',        label: 'Claimant',              w: 280 },
    { key: 'submissionDate',  label: 'Claim Submission Date', w: 170 },
    { key: 'remark',          label: 'Remark',                w: 200 },
  ];

  const applicableDefs = CLAIMS_COL_DEFS.filter((c) => showDrafts ? !c.claimsOnly : !c.draftsOnly);
  const [visibleCols, setVisibleCols] = useState<string[]>(CLAIMS_COL_DEFS.map((c) => c.key));
  const vis = (key: string) => visibleCols.includes(key);
  const visibleHeaders = visibleCols
    .map((k) => applicableDefs.find((c) => c.key === k)!)
    .filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const cell = (content: React.ReactNode, colKey: string, w: number, extra?: React.CSSProperties) => (
    <td data-col-key={colKey} style={{ background: getTdBg(colKey) ?? '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w, ...extra }}>{content}</td>
  );

  const txt = (v: React.ReactNode) => (
    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
  );

  const declLink = (declarations: DeclDetail[]) => (
    <button
      onClick={() => setDeclModal(declarations)}
      className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline', fontFamily: font }}
      aria-label="View declarations"
    >
      {declarations.length}
    </button>
  );

  const renderFlyout = (i: number, status: Status) => (
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
        <div className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ right: '100%', top: 0, marginRight: 6, width: 272, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {getFlyoutItems(status, showDrafts).map((id) => (
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
              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: font }}>{LABELS[id]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatusCell = (status: Status, i: number) => {
    const st = STATUS_STYLE[status];
    return (
      <td style={{ position: 'sticky', right: 79, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 160, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
        <span className="text-[16px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500, fontFamily: font }}>
          {status}
        </span>
      </td>
    );
  };

  const renderActionCell = (i: number, status: Status) => (
    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 79, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
      {renderFlyout(i, status)}
    </td>
  );

  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + 239;

  return (
    <>
    {showColModal && (
      <ManageColumnsModal
        columns={applicableDefs}
        visible={visibleCols.filter((k) => applicableDefs.some((c) => c.key === k))}
        lockedColumns={[{ key: '_status', label: 'Claim Status' }, { key: '_action', label: 'Action' }]}
        onSave={setVisibleCols}
        onClose={() => onCloseColModal?.()}
      />
    )}
    <div style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={239} />
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
        {resizeIndicatorLeft !== null && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
        )}
        <table
          ref={tableRef}
          onMouseMove={handleTableMouseMove}
          onMouseLeave={handleTableMouseLeave}
          onMouseDown={handleTableMouseDown}
          style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined }}
          className="w-full"
        >
          <thead>
            <tr>
              {visibleHeaders.map((col, idx) => (
                <th
                  key={col.label}
                  data-col-key={col.key}
                  style={{ position: 'relative', width: getW(col.key, col.w), minWidth: getW(col.key, col.w), padding: '18px 12px 10px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 12, ...getThStyle(col.key) }}
                  onDragOver={(e) => onDragOver(col.key, e)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(col.key, e, visibleCols, setVisibleCols)}
                >
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(col.key, e)}
                    onDragEnd={onDragEnd}
                    style={{
                      display: hoveredColKey === col.key ? 'flex' : 'none',
                      position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                      cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                    }}
                  >
                    <DragDots />
                  </div>
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
              <th style={{ position: 'sticky', right: 0, width: 79, minWidth: 79, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8 }}>
                <span className="text-[16px] text-[#051937]">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {vis('reqNo') && cell(txt(row.reqNo), 'reqNo', 150, { paddingLeft: 16 })}
                {!showDrafts && vis('claimNo') && cell(txt(row.claimNo), 'claimNo', 120)}
                {vis('ver') && cell(txt(row.ver), 'ver', 70)}
                {vis('claimType') && cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.claimType}</span>, 'claimType', 160)}
                {vis('declarations') && cell(declLink(row.declarations), 'declarations', 150)}
                {vis('depositType') && cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.depositType}</span>, 'depositType', 220)}
                {vis('claimant') && cell(
                  <div className="flex flex-col" style={{ lineHeight: 1.3 }}>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{row.claimantName}</span>
                    <span className="text-[12px] text-[#697498]" style={{ fontFamily: font }}>{row.claimantCode}</span>
                  </div>,
                  'claimant',
                  280,
                )}
                {vis('submissionDate') && cell(txt(row.submissionDate), 'submissionDate', 170)}
                {vis('remark') && cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.remark}</span>, 'remark', 200)}
                {renderStatusCell(row.status, i)}
                {renderActionCell(i, row.status)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pt-[16px]">
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(rows.length / pageSize))} pageSize={pageSize} totalItems={rows.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
    {declModal && <DeclarationsModal declarations={declModal} onClose={() => setDeclModal(null)} />}
    </>
  );
}
