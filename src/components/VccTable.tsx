import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';

// Inline data URIs — no external dependency
const wlpLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAICAYAAAD9aA/QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAg5JREFUeAF9kUFoE0EUht+bnd2ERjezAUniKkStFcVDqKAgovWgN6GQiooXrVBQUYp4yMWzIkhPggc9SEGsKXpViojiwSBiUUqUiklBhdCSrNX0sJuZ8U1qKwHpW5Zl3r753vv/h+B5yR25q1Xbjnknjg8E924PbanVagFQ5PMgnj3AGWTxnsOFdTubTXtRSon1en0pl8snz128W50ovRCUA8uyQEqttYp+fJq7tYvBGjE9DcG2ven80bPX8OSZpxXPH/0mspc/C5FL/qvSwBhThcGDDWIDIPZAQyDvRiG9iXgq1eu6bpu1Wom4559+F7YdlyE9jAGzLOy+wkBGYTB248h2v684ixTgNWF1YhIB3OLu8IX7Fb93ZG74fKk6WhyvcM6zCBKVUp0a0KqLqylPNogrxalZbjleJuOjB95fMBoFAFEUscnHL0UYKTH55JVQUgtEjYb339DmHpoPe13+mkqnfTrqJUSm+TKXZpIKJkrPQdIEts0hDEN4+GiKzqSEW6tGmTCbZYu/lYFms5tAKWma0PBR/WP55p5G48uvruW1CR6LOXqoMBA4jqMNlIwFkmcWBBmCZDduhg12Is7W24mVVhaz4NCBvp8f3lzvn5+fqRstHJr0e+tygYEOHtv//c7Yqf6RS+Pvy29rftSWHbkrE1MDd/e+YsViaPJJ47mmBVJfECJqLSxAx7g/Hi/Gz6+U/BcAAAAASUVORK5CYII=';
const aeoLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAHCAYAAAAf6f3xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAs9JREFUeAElUltIVF0U/tbeR8+oUxrq/zc2DQZTUlB0oRvR/SmiogcDzXqIkO49REQUPhTdiS4PRZQmRFAIPXShoIKgokgt6iEpI6OZ0KmEzImZM+fsvVrHXs4+e+39fev7vrXpfWTS5RLSrRNyPZ0ATBwoeRSZuJ+ZO5u8Tw+6AR9JuGie1wAU9aLz6Ut0wMhdFYvFZhDsFrDVIGVIFfchuTCnkjP6U63tt2pr/6hgc8dGkNlN1iag1UcLHPt2/fRtR4PXFYDHS4CuJ8I2Ttgt0SoH8AaBhwgb71tSjV/5wyA/g6ZNS9HRNix1oqLSCI2bPJa0ewdzG10a/V8daVVmmT+g/pUxs/btAgcHtcUVQ2QUY7UCLsWb9rpOqJzAJEwk//gxsgpcanLIqKkpxVB+f1hVrMZTX2qpqcc9cU20/UZMBXYZXDqlWXna59eBYk5fm921fP33il4O9gjNSeMgoyzWMsOTfQUxtzgseJLPqLBJqCJceUQElwMWB2qnqRytJPg7qwp7houD8S3Rxefe9nRMSWEEIIgCPzBsWJKC9QtZ9FdO/Dy6K4rhn2Ms2xfk81RWaoBha4gpL6NJiinKSOOZaeBuM2blzpd71al8Ia6J0t319bbYK8SrzLZ2JyhfIapKmfSC7PDvQ0gmm2FD0YGjyK2Lljo53xvSqiTCiMXyff6YoTgPZhzFK4NRFcfo99AEsdFPyv7P0APUG6nb5IPPivabBNUn76tBhJioN7B8+tlnVW42e0Vb9eXfICQGxVGxuUxbXsNElUxok4TecZgOqfCGoG17qmX+tcTx7gY2/kUxd1vcvlNMiyzxnCIn0kgrAPdMSXIVsdqKkAj8vLKMjlT/jP5IHL3QaC1n7YXt95XKjIwiXVbmJDZcbbC6aDDwTE+xtmtEkyOE/0YVhkD6+9e29e1wXU5sbF3MBjtguVYOexjOmfSbE11/AVP+QMCmcxkpAAAAAElFTkSuQmCC';

type BadgeType = 'both' | 'aeo' | 'wlp' | 'none';
type VccStatus = 'Submitted' | 'Under Processing' | 'Completed' | 'Rejected' | 'Draft' | 'Payment Pending';

const VCC_STATUS_STYLE: Record<VccStatus, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.08)',   color: '#1360d2' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.08)',   color: '#28a745' },
  'Rejected':         { bg: 'rgba(192,57,43,0.08)',   color: '#c0392b' },
  'Draft':            { bg: 'rgba(108,117,125,0.12)', color: '#6c757d' },
  'Payment Pending':  { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
};

type FlyoutAction = 'amend' | 'view' | 'download' | 'audit' | 'recheck';

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
  { reqNo: '25345', declNo: '1012132132', badge: 'both', reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 3, remarks: '', declType: 'Export from Local',                              declOwner: 'code + name', status: 'Completed' },
  { reqNo: '25346', declNo: '1012132133', badge: 'aeo',  reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export Statistical',                             declOwner: 'code + name', status: 'Submitted' },
  { reqNo: '25347', declNo: '1012132134', badge: 'wlp',  reqDate: '04-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 2, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Under Processing' },
  { reqNo: '25348', declNo: '1012132135', badge: 'wlp',  reqDate: '03-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 4, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Rejected' },
  { reqNo: '25365', declNo: '1012132136', badge: 'none', reqDate: '02-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056', requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export from Local', declOwner: 'code + name', status: 'Payment Pending' },
  { reqNo: '-', declNo: '-', badge: 'none', reqDate: '02-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 2, remarks: '', declType: 'Export from Local',                              declOwner: 'code + name', status: 'Draft' },
  { reqNo: '-', declNo: '-', badge: 'none', reqDate: '01-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export Statistical',                             declOwner: 'code + name', status: 'Draft' },
];

type Props = {
  onView?: (status?: string) => void;
  onAmend?: () => void;
  onDownload?: () => void;
  onAudit?: () => void;
  onDeclarationOpen?: (declNo: string) => void;
  onVccCountOpen?: (row: VccRow) => void;
  /** Optional status filter driven from the parent toolbar. When provided, takes precedence over the column-header filter. */
  externalStatus?: string | null;
  /** When true, only show rows with Draft status */
  showDrafts?: boolean;
  onMakePayment?: () => void;
  onChangePaymentMode?: () => void;
  onRetry?: () => void;
  onRecheckStatus?: () => void;
};

export default function VccTable({ onView, onAmend, onDownload, onAudit, onDeclarationOpen, onVccCountOpen, externalStatus, showDrafts, onMakePayment, onChangePaymentMode, onRetry, onRecheckStatus }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<VccStatus | null>(null);
  const VCC_STATUS_COLOR: Record<VccStatus, string> = {
    'Submitted': '#1360d2', 'Under Processing': '#b45309', 'Completed': '#28a745', 'Rejected': '#c0392b', 'Draft': '#6c757d', 'Payment Pending': '#b45309',
  };
  const effectiveStatus = showDrafts ? 'Draft' : ((externalStatus as VccStatus | null | undefined) ?? statusFilter);
  const filteredRows = useMemo(
    () => {
      const base = showDrafts ? VCC_REQUESTS : VCC_REQUESTS.filter((r) => r.status !== 'Draft');
      return effectiveStatus && effectiveStatus !== 'Draft' ? base.filter((r) => r.status === effectiveStatus) : base;
    },
    [effectiveStatus, showDrafts],
  );

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
    { label: 'Requested For',     w: 280 },
    { label: 'Remarks',           w: 320 },
  ];

  /** Status-driven default remark — overrides the row's stored remarks. */
  const remarkFor = (status: VccStatus): string => {
    if (status === 'Completed')        return 'Your Request VCCs have been processed and downloaded.';
    if (status === 'Under Processing') return 'Request is being reviewed. Please check back shortly.';
    if (status === 'Rejected')         return 'Request has been rejected. Please contact support for details.';
    return 'Request submitted. Awaiting processing.';
  };

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table
        style={{
          minWidth: 1500,
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: "'Dubai', sans-serif",
        }}
        className="w-full"
      >
        <thead>
          <tr>
            {headers.map((col, idx) => (
              <th
                key={col.label}
                style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 8 }}
              >
                <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
              </th>
            ))}
            {/* STICKY: Request Status */}
            <th style={{
              position: 'sticky', right: 79, width: 163, minWidth: 163,
              background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
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
              background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2,
              borderTopRightRadius: 8, borderBottomRightRadius: 8,
            }}>
              <span className="text-[16px] text-[#051937]" style={{ letterSpacing: '0.07px' }}>Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((row, i) => {
            const st = VCC_STATUS_STYLE[row.status];
            const txt = (v: React.ReactNode) => <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            const cell = (content: React.ReactNode, w: number, extra?: React.CSSProperties) => (
              <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w, ...extra }}>{content}</td>
            );
            return (
              <tr key={i}>
                {cell(txt(row.reqNo), 110, { paddingLeft: 16 })}
                {/* No. of Vehicles — clickable unless Draft */}
                <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 130, textAlign: 'center' }}>
                  {row.status === 'Draft' ? (
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>-</span>
                  ) : (
                    <button
                      onClick={() => onVccCountOpen?.(row)}
                      className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline' }}
                      aria-label="View VCC details"
                    >
                      {row.vccCount}
                    </button>
                  )}
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
                      className="text-[16px] text-[#1360d2] whitespace-nowrap hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      {row.declNo}
                    </button>
                  </div>
                </td>
                {cell(txt(row.reqDate),      130)}
                {cell(txt(row.requestedFor), 280)}
                {cell(
                  <span
                    className="text-[16px] text-[#0e1b3d]"
                    style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}
                  >
                    {remarkFor(row.status)}
                  </span>,
                  320,
                )}

                {/* STICKY: Request Status */}
                <td style={{
                  position: 'sticky', right: 79, background: '#fff',
                  padding: '0 8px', height: 54, verticalAlign: 'middle', width: 163,
                  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                  borderBottom: '1px solid #f8f8f8',
                  zIndex: openFlyout === i ? 49 : 1,
                }}>
                  <span
                    className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center"
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
                        {row.status === 'Rejected' ? (
                          <>
                            {/* View Request */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onView?.(row.status); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                                  <circle cx="10" cy="10" r="2.5" />
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                View Request
                              </span>
                            </button>
                            {/* Retry */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onRetry?.(); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 4a7 7 0 1 1 0 12" />
                                  <path d="M1 4h3v3" />
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Retry
                              </span>
                            </button>
                          </>
                        ) : row.status === 'Payment Pending' ? (
                          <>
                            {/* View Request */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onView?.(row.status); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                                  <circle cx="10" cy="10" r="2.5" />
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                View Request
                              </span>
                            </button>
                            {/* Make ePayment */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onMakePayment?.(); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="5" width="16" height="12" rx="2"/>
                                  <path d="M2 9h16"/>
                                  <path d="M6 13h2"/>
                                  <path d="M10 13h4"/>
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Make ePayment
                              </span>
                            </button>
                            {/* Change Payment Mode */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onChangePaymentMode?.(); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 8l3-3-3-3"/>
                                  <path d="M7 5H3a1 1 0 000 0"/>
                                  <path d="M16 12l-3 3 3 3"/>
                                  <path d="M13 15h4"/>
                                  <path d="M3 12h10a3 3 0 003-3V8"/>
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Change Payment Mode
                              </span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Recheck Payment Status — only for Under Processing rows */}
                            {row.status === 'Under Processing' && (
                              <button
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => { setOpenFlyout(null); onRecheckStatus?.(); }}
                              >
                                <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4a7 7 0 1 1 0 12" />
                                    <path d="M1 4h3v3" />
                                  </svg>
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                  Recheck Payment Status
                                </span>
                              </button>
                            )}
                            {FLYOUT_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => {
                                  setOpenFlyout(null);
                                  if (item.id === 'view')     onView?.(row.status);
                                  if (item.id === 'amend')    onAmend?.();
                                  if (item.id === 'download') onDownload?.();
                                  if (item.id === 'audit')    onAudit?.();
                                }}
                              >
                                <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  {item.icon}
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </>
                        )}
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
