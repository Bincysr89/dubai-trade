import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';

type Status = 'Cleared' | 'Submitted' | 'Payment Pending' | 'Declined' | 'Cancelled' | 'Clearance Inspection';
type DraftStatus = 'Draft';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Cleared':               { bg: 'rgba(40,167,69,0.08)',    color: '#28a745' },
  'Submitted':             { bg: 'rgba(19,96,210,0.08)',    color: '#1360d2' },
  'Payment Pending':       { bg: 'rgba(255,169,26,0.16)',   color: '#fbb500' },
  'Declined':              { bg: 'rgba(220,53,69,0.08)',    color: '#dc3545' },
  'Cancelled':             { bg: 'rgba(220,53,69,0.08)',    color: '#dc3545' },
  'Clearance Inspection':  { bg: 'rgba(40,167,69,0.08)',    color: '#28a745' },
};

const DRAFT_STYLE: Record<DraftStatus, { bg: string; color: string }> = {
  'Draft': { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

// ── Flyout items ──────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" />
    </svg>
  );
}
function CancelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" />
      <path d="M10 6v4l2.5 2" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7V2h10v5" /><rect x="2" y="7" width="16" height="8" rx="1" />
      <path d="M5 15v3h10v-3" /><circle cx="15" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

type FlyoutItemId = 'view' | 'amend' | 'cancel' | 'history' | 'suspensionResponse' | 'suspensionHistory' | 'print';

const FLYOUT_ITEMS: { id: FlyoutItemId; label: string; Icon: React.FC }[] = [
  { id: 'view',               label: 'View Request',           Icon: EyeIcon },
  { id: 'amend',              label: 'Amend',                  Icon: EditIcon },
  { id: 'cancel',             label: 'Cancel',                 Icon: CancelIcon },
  { id: 'history',            label: 'Cargo Transfer History', Icon: HistoryIcon },
  { id: 'suspensionResponse', label: 'Suspension Response',    Icon: HistoryIcon },
  { id: 'suspensionHistory',  label: 'Suspension History',     Icon: HistoryIcon },
  { id: 'print',              label: 'Print Request',          Icon: PrintIcon },
];

// ── Row data ──────────────────────────────────────────────────────────────────

type Row = {
  reqNo: string;
  cargoTransferNo: string;
  cargoTransferType: string;
  submittedDate: string;
  transferee: string;
  cargoChannel: string;
  requestType: string;
  clientRef: string;
  carrierReg: string;
  mawb: string;
  transferer: string;
  broker: string;
  createdBy: string;
  statusDate: string;
  status: Status;
  showInfo?: boolean;
};

type DraftRow = Omit<Row, 'status'> & { status: DraftStatus };

const ROWS: Row[] = [
  { reqNo: '34521', cargoTransferNo: 'CT-1029384', cargoTransferType: 'CTO → CH (Same Location)',       submittedDate: '04-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'JOB213354578',   carrierReg: 'JOB213354578',   mawb: 'MAWB/MBOL', transferer: 'code + name A', broker: 'code + name. S', createdBy: 'Username', statusDate: '05-May-2026', status: 'Cleared' },
  { reqNo: '34520', cargoTransferNo: 'CT-1029383', cargoTransferType: 'CTO → CH (Different Location)',  submittedDate: '03-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'PGH658916794',   carrierReg: 'PGH658916794',   mawb: 'MAWB/MBOL', transferer: 'code + name B', broker: 'code + name. S', createdBy: 'Username', statusDate: '04-May-2026', status: 'Submitted' },
  { reqNo: '34519', cargoTransferNo: 'CT-1029382', cargoTransferType: 'CH → CH (Same Location)',        submittedDate: '03-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'GJF4589789487',  carrierReg: 'GJF4589789487',  mawb: 'MAWB/MBOL', transferer: 'code + name C', broker: 'code + name. S', createdBy: 'Username', statusDate: '03-May-2026', status: 'Submitted' },
  { reqNo: '34518', cargoTransferNo: 'CT-1029381', cargoTransferType: 'CTO → CTO (Different Location)', submittedDate: '02-May-2026', transferee: 'code + name', cargoChannel: 'Air', requestType: 'New', clientRef: 'VNF215648748',   carrierReg: 'VNF215648748',   mawb: 'MAWB/MBOL', transferer: 'code + name D', broker: 'code + name. S', createdBy: 'Username', statusDate: '02-May-2026', status: 'Payment Pending' },
  { reqNo: '34517', cargoTransferNo: 'CT-1029380', cargoTransferType: 'CH → CH (Different Location)',   submittedDate: '02-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'TYT4897879487',  carrierReg: 'TYT4897879487',  mawb: 'MAWB/MBOL', transferer: 'code + name E', broker: 'code + name. S', createdBy: 'Username', statusDate: '02-May-2026', status: 'Payment Pending' },
  { reqNo: '34516', cargoTransferNo: 'CT-1029379', cargoTransferType: 'CTO → CH (Same Location)',       submittedDate: '01-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'TYT4897879487',  carrierReg: 'TYT4897879487',  mawb: 'MAWB/MBOL', transferer: 'code + name F', broker: 'code + name. S', createdBy: 'Username', statusDate: '01-May-2026', status: 'Declined', showInfo: true },
  { reqNo: '34515', cargoTransferNo: 'CT-1029378', cargoTransferType: 'CH → CH (Same Location)',        submittedDate: '01-May-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: '24/02/24, 09:30', carrierReg: '24/02/24, 09:30', mawb: 'MAWB/MBOL', transferer: 'code + name G', broker: 'code + name. S', createdBy: 'Username', statusDate: '01-May-2026', status: 'Cancelled' },
  { reqNo: '34514', cargoTransferNo: 'CT-1029377', cargoTransferType: 'CTO → CH (Different Location)',  submittedDate: '30-Apr-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: '24/02/24, 09:30', carrierReg: '24/02/24, 09:30', mawb: 'MAWB/MBOL', transferer: 'code + name H', broker: 'code + name. S', createdBy: 'Username', statusDate: '30-Apr-2026', status: 'Clearance Inspection' },
];

const DRAFT_ROWS: DraftRow[] = [
  { reqNo: '34510', cargoTransferNo: 'CT-1029370', cargoTransferType: 'CTO → CH (Same Location)',       submittedDate: '28-Apr-2026', transferee: 'code + name', cargoChannel: 'Sea', requestType: 'New', clientRef: 'DFT001', carrierReg: 'DFT001', mawb: 'MAWB/MBOL', transferer: 'code + name X', broker: 'code + name. S', createdBy: 'Username', statusDate: '28-Apr-2026', status: 'Draft' },
  { reqNo: '34509', cargoTransferNo: 'CT-1029369', cargoTransferType: 'CH → CH (Different Location)',   submittedDate: '27-Apr-2026', transferee: 'code + name', cargoChannel: 'Air', requestType: 'New', clientRef: 'DFT002', carrierReg: 'DFT002', mawb: 'MAWB/MBOL', transferer: 'code + name Y', broker: 'code + name. S', createdBy: 'Username', statusDate: '27-Apr-2026', status: 'Draft' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  showDrafts?: boolean;
  onViewRequest?: () => void;
  onAmend?: () => void;
  onCancel?: () => void;
};

export default function CargoTransferTable({ showDrafts = false, onViewRequest, onAmend, onCancel }: Props) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  const STATUS_COLOR: Record<Status, string> = {
    'Cleared': '#28a745', 'Submitted': '#1360d2', 'Payment Pending': '#fbb500',
    'Declined': '#dc3545', 'Cancelled': '#dc3545', 'Clearance Inspection': '#28a745',
  };

  const activeRows: (Row | DraftRow)[] = useMemo(() => {
    if (showDrafts) return DRAFT_ROWS;
    return statusFilter ? ROWS.filter((r) => r.status === statusFilter) : ROWS;
  }, [showDrafts, statusFilter]);

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const headers: { label: string; w: number }[] = [
    { label: 'Cargo Transfer No.', w: 150 },
    { label: 'Cargo Transfer Type', w: 240 },
    { label: 'Submitted Date',      w: 120 },
    { label: 'Transferee (Owner)',   w: 140 },
    { label: 'Transferer',          w: 140 },
    { label: 'Cargo Channel',       w: 110 },
    { label: 'Request No.',         w: 110 },
    { label: 'Request Type',        w: 105 },
    { label: 'Client Ref. No.',     w: 140 },
    { label: 'Carrier Reg No.',     w: 140 },
    { label: 'MAWB/MBOL',          w: 110 },
    { label: 'Broker',              w: 120 },
    { label: 'Created By',          w: 110 },
    { label: 'Status Date',         w: 110 },
  ];

  const font = "'Dubai', sans-serif";

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table style={{ minWidth: 2100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
        <thead>
          <tr>
            {headers.map((col) => (
              <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500 }}>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[16px] text-[#455174] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>{col.label}</span>
                  <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
                    <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
                  </svg>
                </div>
              </th>
            ))}
            {/* Sticky: Status */}
            {!showDrafts ? (
              <th style={{ position: 'sticky', right: 76, width: 190, minWidth: 190, background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                <StatusFilterHeader
                  label="Cargo Transfer Status"
                  options={Object.keys(STATUS_STYLE)}
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as Status | null)}
                  colorMap={STATUS_COLOR}
                />
              </th>
            ) : (
              <th style={{ position: 'sticky', right: 76, width: 190, minWidth: 190, background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                <span className="text-[16px] text-[#455174]" style={{ letterSpacing: '0.07px' }}>Cargo Transfer Status</span>
              </th>
            )}
            {/* Sticky: Actions */}
            <th style={{ position: 'sticky', right: 0, width: 76, minWidth: 76, background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2 }}>
              <span className="text-[16px] text-[#455174]" style={{ letterSpacing: '0.07px' }}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {activeRows.map((row, i) => {
            const isDraft = row.status === 'Draft';
            const st = isDraft
              ? DRAFT_STYLE['Draft']
              : STATUS_STYLE[row.status as Status];

            const cell = (content: React.ReactNode, w: number) => (
              <td style={{ background: '#fff', padding: '0 8px', height: 46, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8' }}>{content}</td>
            );
            const txt = (v: React.ReactNode) => (
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
            );

            return (
              <tr key={i}>
                {cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap font-medium" style={{ fontFamily: font }}>{row.cargoTransferNo}</span>, 150)}
                {cell(txt(row.cargoTransferType), 240)}
                {cell(txt(row.submittedDate), 120)}
                {cell(txt(row.transferee), 140)}
                {cell(txt(row.transferer), 140)}
                {cell(txt(row.cargoChannel), 110)}
                {cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap font-medium" style={{ fontFamily: font }}>{row.reqNo}</span>, 110)}
                {cell(txt(row.requestType), 105)}
                {cell(txt(row.clientRef), 140)}
                {cell(txt(row.carrierReg), 140)}
                {cell(txt(row.mawb), 110)}
                {cell(txt(row.broker), 120)}
                {cell(txt(row.createdBy), 110)}
                {cell(txt(row.statusDate), 110)}

                {/* Sticky: Status badge */}
                <td style={{ position: 'sticky', right: 76, background: '#fff', padding: '0 8px', height: 46, verticalAlign: 'middle', width: 190, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontFamily: font }}>
                      {row.status}
                    </span>
                    {'showInfo' in row && row.showInfo && (
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M10 9v5M10 7h.01" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </td>

                {/* Sticky: Actions (three dots) */}
                <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 8px', height: 46, verticalAlign: 'middle', width: 76, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
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
                      <div
                        className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                        style={{ right: '100%', top: 0, marginRight: 6, width: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                      >
                        {FLYOUT_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            className="group flex items-center gap-[10px] w-full px-[14px] h-[42px] text-left hover:bg-[#f4f7fd] transition-colors"
                            onClick={() => {
                              setOpenFlyout(null);
                              if (item.id === 'view')   onViewRequest?.();
                              if (item.id === 'amend')  onAmend?.();
                              if (item.id === 'cancel') onCancel?.();
                            }}
                          >
                            <span className="text-[#697498] flex-shrink-0 inline-flex items-center justify-center">
                              <item.Icon />
                            </span>
                            <span className="text-[16px] text-[#111838] leading-[20px] whitespace-nowrap" style={{ fontFamily: font }}>
                              {item.label}
                            </span>
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
