import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const font = "'Dubai', sans-serif";

type HistoryStatus = 'Suspended' | 'Cleared';

const STATUS_STYLE: Record<HistoryStatus, { bg: string; color: string }> = {
  Suspended: { bg: 'rgba(220,53,69,0.10)', color: '#dc3545' },
  Cleared:   { bg: 'rgba(40,167,69,0.08)',  color: '#28a745' },
};

type HistoryRow = {
  requestDate: string;
  requestNo: string;
  requestType: string;
  transferorCode: string;
  transfereeCode: string;
  remarks: string;
  assignedDate: string;
  status: HistoryStatus;
};

const ROWS: HistoryRow[] = [
  { requestDate: '24/02/24, 09:30', requestNo: '123456', requestType: 'Cancel',    transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Suspended' },
  { requestDate: '24/02/24, 09:30', requestNo: '597897', requestType: 'Amendment', transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Cleared' },
  { requestDate: '24/02/24, 09:30', requestNo: '748979', requestType: 'New',       transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Cleared' },
  { requestDate: '24/02/24, 09:30', requestNo: '748979', requestType: 'New',       transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Suspended' },
];

type FlyoutItemId = 'viewRequest' | 'amend' | 'cancel' | 'suspensionResponse' | 'print' | 'suspensionHistory';

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" /><circle cx="10" cy="10" r="2.5" />
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
      <path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" /><path d="M10 6v4l2.5 2" />
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

const FLYOUT_ITEMS: { id: FlyoutItemId; label: string; Icon: React.FC }[] = [
  { id: 'viewRequest',        label: 'View Request',       Icon: EyeIcon },
  { id: 'amend',              label: 'Amend',              Icon: EditIcon },
  { id: 'cancel',             label: 'Cancel',             Icon: CancelIcon },
  { id: 'suspensionResponse', label: 'Suspension Response',Icon: HistoryIcon },
  { id: 'print',              label: 'Print Cargo Transfer', Icon: PrintIcon },
  { id: 'suspensionHistory',  label: 'Suspension History', Icon: HistoryIcon },
];

function SortIcon() {
  return (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
    </svg>
  );
}

type Props = {
  onBack: () => void;
  onSuspensionHistory: () => void;
  onSuspensionResponse: () => void;
  onViewRequest?: () => void;
  onAmend?: () => void;
  onCancel?: () => void;
};

export default function CargoTransferHistoryPage({ onBack, onSuspensionHistory, onSuspensionResponse, onViewRequest, onAmend, onCancel }: Props) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; right: number } | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const handleOpenFlyout = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const flyoutHeight = FLYOUT_ITEMS.length * 42 + 8;
    const top = rect.bottom + flyoutHeight > window.innerHeight
      ? rect.top - flyoutHeight
      : rect.top;
    setFlyoutPos({ top, right: window.innerWidth - rect.left + 6 });
    setOpenFlyout(openFlyout === i ? null : i);
  };

  const headers: { label: string; w: number }[] = [
    { label: 'Request Date',          w: 140 },
    { label: 'Request No.',           w: 120 },
    { label: 'Request Type',          w: 120 },
    { label: 'Transferor Code & Name',w: 210 },
    { label: 'Transferee Code & Name',w: 210 },
    { label: 'Remarks',               w: 180 },
    { label: 'Assigned Date',         w: 150 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Header */}
      <div className="px-4 sm:px-10 pt-[28px] pb-[20px] flex-shrink-0">
        <h1 className="text-[32px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
          Cargo Transfer History
        </h1>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="overflow-x-auto">
          <table style={{ minWidth: 1400, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {headers.map((col) => (
                  <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500 }}>
                    <div className="flex items-center gap-[4px]">
                      <span className="text-[14px] text-[#000] whitespace-nowrap">{col.label}</span>
                      <SortIcon />
                    </div>
                  </th>
                ))}
                {/* Sticky: Status */}
                <th style={{ position: 'sticky', right: 66, width: 120, minWidth: 120, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[14px] text-[#455174] whitespace-nowrap">Status</span>
                    <SortIcon />
                  </div>
                </th>
                {/* Sticky: Actions */}
                <th style={{ position: 'sticky', right: 0, width: 66, minWidth: 66, background: '#a7c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2 }}>
                  <span className="text-[14px] text-[#455174]">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const st = STATUS_STYLE[row.status];
                const cell = (content: React.ReactNode, w: number) => (
                  <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8' }}>{content}</td>
                );
                const txt = (v: string) => (
                  <span className="text-[14px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
                );
                return (
                  <tr key={i}>
                    {cell(txt(row.requestDate), 140)}
                    {cell(txt(row.requestNo), 120)}
                    {cell(txt(row.requestType), 120)}
                    {cell(txt(row.transferorCode), 210)}
                    {cell(txt(row.transfereeCode), 210)}
                    {cell(txt(row.remarks), 180)}
                    {cell(txt(row.assignedDate), 150)}

                    {/* Sticky: Status */}
                    <td style={{ position: 'sticky', right: 66, background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 120, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: 1 }}>
                      <span className="text-[14px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontFamily: font }}>
                        {row.status}
                      </span>
                    </td>

                    {/* Sticky: Actions */}
                    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 66, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: 1 }}>
                      <div className="relative inline-block">
                        <button
                          className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                          aria-label="More actions"
                          onClick={(e) => handleOpenFlyout(i, e)}
                        >
                          <svg viewBox="0 0 4 18" width="4" height="18" fill="#697498">
                            <circle cx="2" cy="2" r="2" /><circle cx="2" cy="9" r="2" /><circle cx="2" cy="16" r="2" />
                          </svg>
                        </button>

                        {openFlyout === i && flyoutPos && ReactDOM.createPortal(
                          <div
                            ref={flyoutRef}
                            className="bg-white rounded-[8px] py-[4px] overflow-hidden"
                            style={{ position: 'fixed', top: flyoutPos.top, right: flyoutPos.right, width: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', zIndex: 99999 }}
                          >
                            {FLYOUT_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                className="group flex items-center gap-[10px] w-full px-[14px] h-[42px] text-left hover:bg-[#f4f7fd] transition-colors"
                                style={item.id === 'viewRequest' ? { background: '#fff' } : undefined}
                                onClick={() => {
                                  setOpenFlyout(null);
                                  if (item.id === 'viewRequest')        onViewRequest?.();
                                  if (item.id === 'amend')              onAmend?.();
                                  if (item.id === 'cancel')             onCancel?.();
                                  if (item.id === 'suspensionHistory')  onSuspensionHistory();
                                  if (item.id === 'suspensionResponse') onSuspensionResponse();
                                  if (item.id === 'print')              window.print();
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
                        , document.body)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
