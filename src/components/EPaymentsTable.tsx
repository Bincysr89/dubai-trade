import React, { useRef, useState } from 'react';
import Pagination from './Pagination';

const font = "'Dubai', sans-serif";

type EPayStatus = 'Pending' | 'Completed' | 'Failed';

const STATUS_STYLE: Record<EPayStatus, { bg: string; color: string }> = {
  'Pending':   { bg: 'rgba(255,169,26,0.18)', color: '#b45309' },
  'Completed': { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Failed':    { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
};

type EPayRow = {
  reqDate: string;
  declNo: string;
  approvalDate: string;
  reqNo: string;
  reqType: string;
  clientDecRef: string;
  amount: string;
  status: EPayStatus;
};

const ROWS: EPayRow[] = [
  { reqDate: '05-Feb-26', declNo: '1080000003626', approvalDate: '2026-02-05T14:15:48', reqNo: '1101545031', reqType: 'New Declaration', clientDecRef: 'sreevani',    amount: '93.00',  status: 'Pending'   },
  { reqDate: '05-Feb-26', declNo: '1080000003526', approvalDate: '2026-02-05T14:12:17', reqNo: '1101545029', reqType: 'New Declaration', clientDecRef: 'SREEVANI',    amount: '93.00',  status: 'Pending'   },
  { reqDate: '04-Feb-26', declNo: '1080000003412', approvalDate: '2026-02-04T09:30:00', reqNo: '1101544987', reqType: 'Amendment',       clientDecRef: 'JOB-20240205', amount: '115.00', status: 'Completed' },
  { reqDate: '03-Feb-26', declNo: '1080000003301', approvalDate: '2026-02-03T11:45:22', reqNo: '1101544856', reqType: 'New Declaration', clientDecRef: 'REF-450123',  amount: '93.00',  status: 'Failed'    },
  { reqDate: '03-Feb-26', declNo: '1080000003298', approvalDate: '2026-02-03T08:20:11', reqNo: '1101544812', reqType: 'Amendment',       clientDecRef: 'PGH-658916',  amount: '78.00',  status: 'Pending'   },
  { reqDate: '02-Feb-26', declNo: '1080000003201', approvalDate: '2026-02-02T10:05:33', reqNo: '1101544750', reqType: 'VCC Request',     clientDecRef: '25365',       amount: '155.00', status: 'Pending'   },
];

const COLUMNS = [
  { label: 'Request Date',       w: 130 },
  { label: 'Declaration No',     w: 160 },
  { label: 'Dec. Approval Date', w: 200 },
  { label: 'Request No',         w: 130 },
  { label: 'Request Type',       w: 160 },
  { label: 'Client Dec. Ref No', w: 160 },
  { label: 'Amount (AED)',       w: 120 },
  { label: 'Status',             w: 120 },
  { label: 'Actions',            w: 80  },
];

export default function EPaymentsTable({ filterReqNo }: { filterReqNo?: string }) {
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(8);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const visibleRows = filterReqNo
    ? ROWS.filter((r) => r.clientDecRef === filterReqNo)
    : ROWS;
  const paginated = visibleRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="overflow-x-auto pb-[20px]">
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: font,
          minWidth: 1180,
        }}
      >
        {/* ── HEADER ── */}
        <thead>
          <tr>
            {COLUMNS.map((col, i) => (
              <th
                key={col.label}
                style={{
                  background: '#a6c2e9',
                  padding: '10px 12px',
                  textAlign: 'left',
                  fontWeight: 500,
                  width: col.w,
                  minWidth: col.w,
                  borderTopLeftRadius:  i === 0 ? 8 : 0,
                  borderBottomLeftRadius: i === 0 ? 8 : 0,
                  borderTopRightRadius:  i === COLUMNS.length - 1 ? 8 : 0,
                  borderBottomRightRadius: i === COLUMNS.length - 1 ? 8 : 0,
                  paddingLeft: i === 0 ? 16 : 12,
                }}
              >
                <span className="text-[16px] font-medium text-[#051937]">{col.label}</span>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── BODY ── */}
        <tbody>
          {paginated.map((row, i) => {
            const st = STATUS_STYLE[row.status];
            const cell = (content: React.ReactNode, w?: number, extra?: React.CSSProperties) => (
              <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f0f4ff', ...extra }}>
                {content}
              </td>
            );
            const txt = (v: string) => (
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>
            );

            return (
              <tr key={i}>
                {cell(txt(row.reqDate),      130, { paddingLeft: 16 })}
                {cell(txt(row.declNo),       160)}
                {cell(txt(row.approvalDate), 200)}
                {cell(txt(row.reqNo),        130)}
                {cell(txt(row.reqType),      160)}
                {cell(txt(row.clientDecRef), 160)}
                {cell(txt(row.amount),       120)}
                {/* Status */}
                <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 120, borderBottom: '1px solid #f0f4ff' }}>
                  <span
                    className="inline-flex items-center justify-center px-[10px] py-[3px] rounded-[4px] text-[14px] font-medium whitespace-nowrap"
                    style={{ background: st.bg, color: st.color, fontFamily: font }}
                  >
                    {row.status}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 80, borderBottom: '1px solid #f0f4ff', textAlign: 'center' }}>
                  <div className="relative inline-block" ref={openFlyout === i ? flyoutRef : undefined}>
                    <button
                      onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                      className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors"
                    >
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                        <circle cx="10" cy="4"  r="1.7" />
                        <circle cx="10" cy="10" r="1.7" />
                        <circle cx="10" cy="16" r="1.7" />
                      </svg>
                    </button>

                    {openFlyout === i && (
                      <div
                        className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                        style={{ top: 36, width: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                      >
                        {(row.reqType === 'VCC Request' ? [
                          { label: 'Make ePayment',    icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/></svg> },
                          { label: 'ePayment History', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2"/></svg> },
                        ] : [
                          { label: 'View',          icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></svg> },
                          { label: 'Make ePayment', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/></svg> },
                          { label: 'Download',      icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10"/><path d="M5 9l5 5 5-5"/><path d="M3 17h14"/></svg> },
                        ]).map((item) => (
                          <button
                            key={item.label}
                            className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => setOpenFlyout(null)}
                          >
                            <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0">{item.icon}</span>
                            <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item.label}</span>
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

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(visibleRows.length / pageSize))}
        pageSize={pageSize}
        totalItems={visibleRows.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
