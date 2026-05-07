import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';

// Reuse Figma badge assets (valid 7 days from generation)
const wlpLogoSrc = 'https://www.figma.com/api/mcp/asset/09b98e1a-ea9f-41ca-97a4-31b56c097b09';
const aeoLogoSrc = 'https://www.figma.com/api/mcp/asset/5de21541-f817-4a23-bf16-0ba8c4300be7';

type BadgeType = 'both' | 'aeo' | 'wlp' | 'none';
type VccStatus = 'Cleared' | 'Submitted' | 'Payment Pending';

const VCC_STATUS_STYLE: Record<VccStatus, { bg: string; color: string }> = {
  'Cleared':         { bg: 'rgba(40,167,69,0.08)',  color: '#28a745' },
  'Submitted':       { bg: 'rgba(19,96,210,0.08)',  color: '#1360d2' },
  'Payment Pending': { bg: 'rgba(255,169,26,0.16)', color: '#fbb500' },
};

type FlyoutAction = 'amend' | 'view' | 'download' | 'audit';

const FLYOUT_ITEMS: { id: FlyoutAction; label: string; icon: React.ReactNode }[] = [
  {
    id: 'view',
    label: 'View Request',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
        <circle cx="10" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'download',
    label: "Download All VCC's",
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3v10" />
        <path d="M5 9l5 5 5-5" />
        <path d="M3 17h14" />
      </svg>
    ),
  },
  {
    id: 'audit',
    label: 'Audit History',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6v4l2.5 2" />
      </svg>
    ),
  },
];

export type VccRow = {
  reqNo: string;
  declNo: string;
  badge: BadgeType;
  reqDate: string;
  requestedFor: string;
  requestType: string;
  subType: string;
  vccCount: number;
  remarks: string;
  declType: string;
  declOwner: string;
  status: VccStatus;
};

// Source: Figma node 152:40881 — VCC Request List
const VCC_REQUESTS: VccRow[] = [
  { reqNo: '25345', declNo: '1012132132', badge: 'both', reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 3, remarks: '', declType: 'Export from Local',                              declOwner: 'code + name', status: 'Cleared' },
  { reqNo: '25345', declNo: '1012132132', badge: 'aeo',  reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export Statistical',                             declOwner: 'code + name', status: 'Submitted' },
  { reqNo: '25345', declNo: '1012132132', badge: 'wlp',  reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 2, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Submitted' },
  { reqNo: '25345', declNo: '1012132132', badge: 'wlp',  reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 4, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Payment Pending' },
];

type Props = {
  onView?: () => void;
  onAmend?: () => void;
  onDownload?: () => void;
  onAudit?: () => void;
  onDeclarationOpen?: (declNo: string) => void;
  onVccCountOpen?: (row: VccRow) => void;
};

export default function VccTable({ onView, onAmend, onDownload, onAudit, onDeclarationOpen, onVccCountOpen }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<VccStatus | null>(null);
  const VCC_STATUS_COLOR: Record<VccStatus, string> = {
    'Cleared': '#28a745', 'Submitted': '#1360d2', 'Payment Pending': '#cc9200',
  };
  const filteredRows = useMemo(() => statusFilter ? VCC_REQUESTS.filter((r) => r.status === statusFilter) : VCC_REQUESTS, [statusFilter]);

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const headers: { label: string; w: number }[] = [
    { label: 'Request No.',       w: 110 },
    { label: 'No. of Vehicles',   w: 130 },
    { label: 'Declaration No.',   w: 170 },
    { label: 'Request Date',      w: 130 },
    { label: 'Requested For',     w: 300 },
  ];

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table
        style={{
          minWidth: 1200,
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: "'Dubai', sans-serif",
        }}
        className="w-full"
      >
        <thead>
          <tr>
            {headers.map((col) => (
              <th
                key={col.label}
                style={{ width: col.w, minWidth: col.w, background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500 }}
              >
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] text-[#455174] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>{col.label}</span>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 4h10M5 8h6M7 12h2" />
                  </svg>
                </div>
              </th>
            ))}
            {/* STICKY: Request Status */}
            <th style={{
              position: 'sticky', right: 79, width: 163, minWidth: 163,
              background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
              boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
            }}>
              <StatusFilterHeader
                label="Request Status"
                options={Object.keys(VCC_STATUS_STYLE)}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as VccStatus | null)}
                colorMap={VCC_STATUS_COLOR}
              />
            </th>
            {/* STICKY: Actions */}
            <th style={{
              position: 'sticky', right: 0, width: 79, minWidth: 79,
              background: '#e2ebf9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2,
              borderTopRightRadius: 8, borderBottomRightRadius: 8,
            }}>
              <span className="text-[14px] text-[#455174]" style={{ letterSpacing: '0.07px' }}>Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((row, i) => {
            const st = VCC_STATUS_STYLE[row.status];
            const txt = (v: React.ReactNode) => <span className="text-[14px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            const cell = (content: React.ReactNode, w: number) => (
              <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w }}>{content}</td>
            );
            return (
              <tr key={i}>
                {cell(txt(row.reqNo), 110)}
                {/* No. of Vehicles — clickable, opens VCC Details popup */}
                <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 130, textAlign: 'center' }}>
                  <button
                    onClick={() => onVccCountOpen?.(row)}
                    className="text-[14px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline' }}
                    aria-label="View VCC details"
                  >
                    {row.vccCount}
                  </button>
                </td>
                {/* Declaration No. — hyperlink to Customs Declaration page */}
                <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 170 }}>
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-[6px] flex-shrink-0" style={{ minWidth: 58 }}>
                      {(row.badge === 'both' || row.badge === 'wlp') && (
                        <img src={wlpLogoSrc} alt="WLP" style={{ height: 8, width: 22 }} />
                      )}
                      {(row.badge === 'both' || row.badge === 'aeo') && (
                        <img src={aeoLogoSrc} alt="AEO" style={{ height: 7, width: 30 }} />
                      )}
                    </div>
                    <button
                      onClick={() => onDeclarationOpen?.(row.declNo)}
                      className="text-[14px] text-[#1360d2] whitespace-nowrap hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      {row.declNo}
                    </button>
                  </div>
                </td>
                {cell(txt(row.reqDate),      130)}
                {cell(txt(row.requestedFor), 300)}

                {/* STICKY: Request Status */}
                <td style={{
                  position: 'sticky', right: 79, background: '#fff',
                  padding: '0 8px', height: 54, verticalAlign: 'middle', width: 163,
                  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                  borderBottom: '1px solid #f8f8f8',
                  zIndex: openFlyout === i ? 49 : 1,
                }}>
                  <span
                    className="text-[14px] font-medium whitespace-nowrap inline-flex items-center justify-center"
                    style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}
                  >
                    {row.status}
                  </span>
                </td>

                {/* STICKY: Actions (kebab + flyout) */}
                <td style={{
                  position: 'sticky', right: 0, background: '#fff',
                  padding: '0 12px', height: 54, verticalAlign: 'middle', width: 79,
                  textAlign: 'center',
                  borderBottom: '1px solid #f8f8f8',
                  zIndex: openFlyout === i ? 50 : 1,
                }}>
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
                        style={{
                          right: '100%',
                          top: 0,
                          marginRight: 6,
                          width: 220,
                          boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
                          border: '1px solid #f0f0f5',
                        }}
                      >
                        {FLYOUT_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => {
                              setOpenFlyout(null);
                              if (item.id === 'view')     onView?.();
                              if (item.id === 'amend')    onAmend?.();
                              if (item.id === 'download') onDownload?.();
                              if (item.id === 'audit')    onAudit?.();
                            }}
                          >
                            <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                              {item.icon}
                            </span>
                            <span className="text-[14px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
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
        <Pagination
          page={page}
          totalPages={5}
          pageSize={pageSize}
          totalItems={5 * pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
