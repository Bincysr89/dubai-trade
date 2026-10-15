import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Dh from './Dh';
import MoreIcon from './MoreIcon';
import ActionPage from './declaration/ActionPage';
import { JourneyTable, JourneyTd, JourneyThead, StatusChip, font } from './declaration/DeclarationUI';

export type PaymentHistoryAction = 'viewDetails' | 'viewReceipt' | 'downloadReceipt' | 'recheck';

export type PaymentHistoryRow = {
  txDate: string;
  txNo: string;
  receiptNo: string;
  invoiceType: string;
  invoiceNo: string;
  mode: string;
  amount: string;
  initiatedBy: string;
  status: string;
};

const MENU: { id: PaymentHistoryAction; label: string; icon: React.ReactNode }[] = [
  { id: 'viewDetails', label: 'View Payment Details', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg> },
  { id: 'viewReceipt', label: 'View & Print Receipt', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" /></svg> },
  { id: 'downloadReceipt', label: 'Download Receipt', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10M5 9l5 5 5-5M3 17h14" /></svg> },
  { id: 'recheck', label: 'Recheck Status', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" /></svg> },
];

type Props = {
  /** What the history is for — an invoice number, or a transaction. */
  subject?: string;
  rows: PaymentHistoryRow[];
  onHome?: () => void;
  onBack?: () => void;
  onAction?: (action: PaymentHistoryAction, row: PaymentHistoryRow) => void;
};

/**
 * Payment History — every payment attempt against the invoice, in the same read-only
 * table the Declaration History uses, with the columns the payments listing carries.
 */
export default function PaymentHistoryPage({ subject, rows, onHome, onBack, onAction }: Props) {
  /* The menu is taller than the table's scroll box, so it is portalled to the body
     and positioned from the button rather than clipped inside the card. */
  const [menu, setMenu] = useState<{ row: number; top: number; left: number } | null>(null);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('scroll', close, true); };
  }, [menu]);

  const openMenu = (row: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const height = MENU.length * 44 + 8;
    setMenu({
      row,
      top: Math.min(r.bottom + 4, window.innerHeight - height - 8),
      left: Math.max(8, r.right - 240),
    });
  };

  return (
    <ActionPage title="Payment History" crumb="Bill Payment" onHome={onHome} onBack={onBack}
      subtitle={subject ? `Invoice No: ${subject}` : undefined}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)', fontFamily: font }}>
        {rows.length === 0 ? (
          <p className="text-[16px] text-[#697498] text-center" style={{ padding: '32px 16px' }}>No payments recorded yet.</p>
        ) : (
          <JourneyTable minWidth={1200}>
            <JourneyThead columns={[
              { label: 'Transaction Date' }, { label: 'Transaction No.' }, { label: 'Receipt No.' },
              { label: 'Invoice Type' }, { label: 'Invoice No.' }, { label: 'Payment Mode' },
              { label: 'Amount (AED)' }, { label: 'Initiated By' }, { label: 'Status' },
              { label: 'Actions', w: 90, filter: false },
            ]} />
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.txNo}-${i}`}>
                  <JourneyTd first>{r.txDate}</JourneyTd>
                  <JourneyTd>{r.txNo}</JourneyTd>
                  <JourneyTd>{r.receiptNo || '—'}</JourneyTd>
                  <JourneyTd>{r.invoiceType}</JourneyTd>
                  <JourneyTd>{r.invoiceNo || '—'}</JourneyTd>
                  <JourneyTd>{r.mode}</JourneyTd>
                  <JourneyTd>
                    <span className="inline-flex items-baseline gap-[3px] whitespace-nowrap"><Dh style={{ fontSize: 15 }} />{r.amount}</span>
                  </JourneyTd>
                  <JourneyTd>{r.initiatedBy}</JourneyTd>
                  <JourneyTd><StatusChip status={r.status} /></JourneyTd>
                  <JourneyTd width={90}>
                    <button type="button" aria-label={`Transaction ${r.txNo} actions`}
                      onClick={openMenu(i)}
                      className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                      <MoreIcon />
                    </button>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        )}
      </div>

      {menu && createPortal(
        <div
          className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ top: menu.top, left: menu.left, width: 240, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', fontFamily: font }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {MENU.map((m) => (
            <button key={m.id} type="button"
              onClick={() => { const row = rows[menu.row]; setMenu(null); onAction?.(m.id, row); }}
              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors">
              <span className="text-[#697498] group-hover:text-white flex-shrink-0">{m.icon}</span>
              <span className="text-[16px] text-[#111838] group-hover:text-white">{m.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </ActionPage>
  );
}
