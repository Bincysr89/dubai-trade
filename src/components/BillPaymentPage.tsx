import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Pagination from './Pagination';

const font = "'Dubai', sans-serif";

/* ── Status styles ──────────────────────────────────────────────────────────── */
const INV_STATUS: Record<string, { bg: string; color: string }> = {
  'Payment Pending':   { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Settled':           { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Partially Settled': { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Initiated':         { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Cancelled':         { bg: 'rgba(105,116,152,0.10)',color: '#697498' },
};
const PAY_STATUS: Record<string, { bg: string; color: string }> = {
  'SUCCESS':   { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'INITIATED': { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'FAILED':    { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
};

/* ── Dummy data ─────────────────────────────────────────────────────────────── */
const INVOICE_ROWS = [
  { type: 'Case Management Demand Notice',                    number: '70003764',   date: '05-Jun-26', amount: '5,520.00', settled: '0.00',     balance: '5520.00',  status: 'Payment Pending'   },
  { type: 'Case Management Demand Notice',                    number: '70003765',   date: '06-Jun-26', amount: '1,000.00', settled: '1,000.00', balance: '0.00',     status: 'Settled'           },
  { type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', number: '1000004567', date: '07-Jun-26', amount: '520.00',   settled: '0.00',     balance: '520.00',   status: 'Payment Pending'   },
  { type: 'Case Management Demand Notice',                    number: '70003820',   date: '08-Jun-26', amount: '5,490.00', settled: '2,000.00', balance: '3490.00',  status: 'Partially Settled' },
  { type: 'Case Management Demand Notice',                    number: '70003819',   date: '08-Jun-26', amount: '1,000.00', settled: '0.00',     balance: '1000.00',  status: 'Initiated'         },
  { type: 'Case Management Demand Notice',                    number: '70003816',   date: '09-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Cancelled'         },
  { type: 'Case Management Demand Notice',                    number: '70003817',   date: '09-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Payment Pending'   },
];

const PAYMENT_ROWS = [
  { type: 'Case Management Demand Notice', txNo: '13136', txDate: '10-06-2026 11:57:00', invoiceNo: '70003787', status: 'SUCCESS',   amount: '200.00',   txDateFull: '10-06-2026', degTx: '590000237262582', ePayTx: '20021737', initiatedDate: '10-06-2026 11:58:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003786', amount: '5,520.00', receiptNo: 'Z-12645', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003786', status: 'SUCCESS' }] },
  { type: 'Multiple Bill Settlement',      txNo: '13133', txDate: '10-06-2026 11:48:00', invoiceNo: '',          status: 'SUCCESS',   amount: '5,540.00', txDateFull: '10-06-2026', degTx: '590000237262583', ePayTx: '20021738', initiatedDate: '10-06-2026 11:48:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003786', amount: '5,520.00', receiptNo: 'Z-12645', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003786', status: 'SUCCESS' }, { type: 'Case Management Demand Notice', invoiceNo: '70003787', amount: '20.00', receiptNo: 'Z-12646', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003787', status: 'SUCCESS' }] },
  { type: 'Case Management Demand Notice', txNo: '13132', txDate: '10-06-2026 10:18:00', invoiceNo: '70003820', status: 'SUCCESS',   amount: '5,490.00', txDateFull: '10-06-2026', degTx: '590000237262584', ePayTx: '20021739', initiatedDate: '10-06-2026 10:18:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '5,490.00', receiptNo: 'Z-12647', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'SUCCESS' }] },
  { type: 'Case Management Demand Notice', txNo: '13131', txDate: '10-06-2026 10:11:00', invoiceNo: '70003819', status: 'SUCCESS',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262585', ePayTx: '20021740', initiatedDate: '10-06-2026 10:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003819', amount: '1,000.00', receiptNo: 'Z-12648', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003819', status: 'SUCCESS' }] },
  { type: 'Case Management Demand Notice', txNo: '13129', txDate: '10-06-2026 10:08:00', invoiceNo: '70003819', status: 'INITIATED', amount: '220.00',   txDateFull: '14-05-2026', degTx: '590000237132364', ePayTx: '20021566', initiatedDate: '14-05-2026 09:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: Transaction cancelled due to user did not complete the payment process', colMsg: 'Collection Status Remarks: DEG - Transaction cancelled due to user did not complete the payment process', details: [{ type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', invoiceNo: '1000004567', amount: '520.00', receiptNo: '', remarks: '', status: 'FAILED' }] },
  { type: 'Case Management Demand Notice', txNo: '13128', txDate: '10-06-2026 10:00:00', invoiceNo: '70003816', status: 'SUCCESS',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262586', ePayTx: '20021741', initiatedDate: '10-06-2026 10:00:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003816', amount: '1,000.00', receiptNo: 'Z-12649', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003816', status: 'SUCCESS' }] },
  { type: 'Case Management Demand Notice', txNo: '13127', txDate: '10-06-2026 09:55:00', invoiceNo: '70003817', status: 'INITIATED', amount: '220.00',   txDateFull: '10-06-2026', degTx: '590000237262587', ePayTx: '20021742', initiatedDate: '10-06-2026 09:55:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: INITIATED', colMsg: '', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003817', amount: '220.00', receiptNo: '', remarks: '', status: 'INITIATED' }] },
];

/* ── Account data ───────────────────────────────────────────────────────────── */
const ACCOUNTS = [
  { type: 'Credit Account', account: '1222683 - AEOUAT1', limit: '9,999,993,357.00' },
  { type: 'Credit Account', account: '1222685 - AEOUAT1', limit: '984,993,490.00'   },
  { type: 'Credit Account', account: '1222839 - AEOUAT1', limit: '8,569,807,166.00' },
  { type: 'Credit Account', account: '1222840 - AEOUAT1', limit: '8,956,840,412.00' },
  { type: 'Credit Account', account: '1222843 - AEOUAT1', limit: '896,583,514.00'   },
  { type: 'Credit Account', account: '1222844 - AEOUAT1', limit: '8,956,805,437.00' },
  { type: 'Credit Account', account: '1222889 - AEOUAT1', limit: '31,219,290.62'    },
  { type: 'Credit Account', account: '1222890 - AEOUAT1', limit: '3,456,971.00'     },
  { type: 'Credit Account', account: '1222964 - AEOUAT1', limit: '79,951.00'        },
  { type: 'Credit Account', account: '1222966 - AEOUAT1', limit: '250,860.00'       },
];

const DEBIT_ACCOUNTS = [
  { type: 'Debit Account', account: '9001234 - AEOUAT1', limit: '14,539.00' },
  { type: 'Debit Account', account: '9001235 - AEOUAT1', limit: '8,250.00'  },
  { type: 'Debit Account', account: '9001236 - AEOUAT1', limit: '22,100.00' },
];

/* ── Pre-computed dashboard stats ──────────────────────────────────────────── */
const creditTotal  = ACCOUNTS.reduce((s, a) => s + parseFloat(a.limit.replace(/,/g, '')), 0);
const debitTotal   = DEBIT_ACCOUNTS.reduce((s, a) => s + parseFloat(a.limit.replace(/,/g, '')), 0);
const pendingInv   = INVOICE_ROWS.filter(r => r.status === 'Payment Pending').length;
const initiatedPay = PAYMENT_ROWS.filter(r => r.status === 'INITIATED').length;
const recheckPay   = PAYMENT_ROWS.filter(r => r.details.some(d => d.status === 'FAILED')).length;

const fmtBalance = (n: number) =>
  'AED ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ACC_PAGE_SIZE = 8;
const YEARS  = ['2024', '2025', '2026'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type Menu    = 'Dashboard' | 'Accounts' | 'Invoices' | 'Payments';
type InvStep = 'list' | 'pay' | 'success' | 'receipt';
type AccStep = 'main' | 'list';

/* ── Sidebar icons ──────────────────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const AccountsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 20c0-3.5 3.5-6.5 8-6.5s8 3 8 6.5" strokeLinecap="round" />
  </svg>
);
const InvoicesIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
  </svg>
);
const PaymentsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M2 10h20" strokeLinecap="round" />
    <circle cx="7" cy="14.5" r="1.5" fill="#1360d2" stroke="none" />
  </svg>
);

const MENU_ITEMS: { label: Menu; Icon: () => JSX.Element }[] = [
  { label: 'Dashboard', Icon: DashboardIcon },
  { label: 'Accounts',  Icon: AccountsIcon  },
  { label: 'Invoices',  Icon: InvoicesIcon  },
  { label: 'Payments',  Icon: PaymentsIcon  },
];

/* ── Shared breadcrumb ──────────────────────────────────────────────────────── */
function Breadcrumb({ onBack, extra }: { onBack: () => void; extra?: string }) {
  return (
    <div className="flex items-center justify-between mt-[16px] mb-[8px]">
      <div className="flex items-center gap-[4px] text-[14px]" style={{ fontFamily: font }}>
        <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
        <span className="text-[#dc3545] px-[4px]">/</span>
        <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Service Catalog</span>
        <span className="text-[#dc3545] px-[4px]">/</span>
        {extra ? (
          <>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Bill Payment</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">{extra}</span>
          </>
        ) : (
          <span className="text-[#111838] font-medium">Bill Payment</span>
        )}
      </div>
      <div className="px-[16px] py-[5px] rounded-[4px] text-[14px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
        AE-1019056- Dubai Customs - Test LLC
      </div>
    </div>
  );
}

/* ── Receipt modal (Bill Payment Settlement Receipt) ──────────────────────── */
function ReceiptModal({ onClose, rows }: { onClose: () => void; rows: typeof PAYMENT_ROWS[0]['details'] }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[780px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#4a4f60' }}>
          <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Bill Payment Settlement Receipt</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {/* Business Details */}
          <p className="text-[#dc3545] text-[16px] font-bold mb-3" style={{ fontFamily: font }}>Business Details</p>
          <div className="bg-[#f5f7fa] rounded p-4 mb-4 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Name</span>
              <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>crnuser01</p>
            </div>
            <div>
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Business Code</span>
              <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1051144</p>
            </div>
          </div>
          {/* Payment table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }} className="mb-4">
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e8f5' }}>
                {['Payment Type', 'Invoice / Account No.', 'Receipt No.', 'Amount (AED)', 'Status', 'Remarks'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[14px] font-semibold text-[#051937]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.type}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.invoiceNo}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.receiptNo}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">AED {r.amount}</td>
                  <td className="py-3 px-3 text-[14px] text-[#28a745] font-medium">{r.status}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Settlement Details */}
          <p className="text-[#dc3545] text-[16px] font-bold mb-3" style={{ fontFamily: font }}>Settlement Details</p>
          <div className="bg-[#f5f7fa] rounded p-4 grid grid-cols-2 gap-3">
            {[
              ['Payment Method', 'Credit Card'],
              ['Transaction No.', '13133'],
              ['Transaction Date', '10-06-2026'],
              ['E-Payment Transaction No.', '20021737'],
              ['Amount', 'AED 5,540.00'],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
                <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-[#697498] mt-4 text-center italic" style={{ fontFamily: font }}>
            This Receipt is generated by the system and therefore does not require a signature
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Transaction Details modal (Recheck) ────────────────────────────── */
function TransactionModal({ row, onClose }: { row: typeof PAYMENT_ROWS[0]; onClose: () => void }) {
  const isSuccess = row.status === 'SUCCESS';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[780px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#4a4f60' }}>
          <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Payment Transaction Details</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {/* Transaction Details */}
          <p className="text-[#dc3545] text-[16px] font-bold mb-4" style={{ fontFamily: font }}>Payment Transaction Details</p>
          <div className="bg-[#f5f7fa] rounded p-4 mb-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Transaction No.',          row.txNo,            'Transaction Date',     row.txDateFull],
                ['DEG Transaction No.',      row.degTx,           'DEG Transaction Date', row.txDate],
                ['EPayment Transaction No',  row.ePayTx,          'Initiated Date',       row.initiatedDate],
                ['Initiated By',             row.initiatedBy,     'Status',               row.status],
                ['Payment Mode',             row.mode,            '',                     ''],
              ].map(([l1, v1, l2, v2], i) => (
                <div key={i} className="contents">
                  <div>
                    <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{l1}</span>
                    <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{v1}</p>
                  </div>
                  <div>
                    {l2 && <><span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{l2}</span>
                    <p className={`text-[15px] font-semibold ${l2 === 'Status' ? (isSuccess ? 'text-[#28a745]' : 'text-[#dc3545]') : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{v2}</p></>}
                  </div>
                </div>
              ))}
            </div>
            {/* Message */}
            <div className="mt-3">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Message</span>
              <p className="text-[14px] text-[#1360d2] mt-1" style={{ fontFamily: font }}>{row.payMsg}</p>
              {row.colMsg && <p className="text-[14px] text-[#dc3545] mt-1 font-medium" style={{ fontFamily: font }}>{row.colMsg}</p>}
            </div>
          </div>

          {/* Payment Details */}
          <p className="text-[#dc3545] text-[16px] font-bold mb-3" style={{ fontFamily: font }}>Payment Details</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e8f5' }}>
                {['Payment Type', 'Invoice / Account No.', 'Amount (AED)', 'Receipt No.', 'Remarks', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[14px] font-semibold text-[#051937]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.details.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.type}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.invoiceNo}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">AED {d.amount}</td>
                  <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.receiptNo}</td>
                  <td className="py-3 px-3 text-[14px] text-[#697498]">{d.remarks}</td>
                  <td className="py-3 px-3 text-[14px]">
                    <span className={`font-medium ${d.status === 'SUCCESS' ? 'text-[#28a745]' : d.status === 'FAILED' ? 'text-[#dc3545]' : 'text-[#1360d2]'}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-5">
            <button
              onClick={onClose}
              className="px-8 py-2 rounded text-[15px] text-white"
              style={{ background: '#4a4f60', fontFamily: font }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function BillPaymentPage({ onBack }: { onBack: () => void }) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu]         = useState<Menu>('Dashboard');
  const [step, setStep]                     = useState<InvStep>('list');
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedRows, setSelectedRows]     = useState<Set<number>>(new Set());
  const [openFlyout, setOpenFlyout]         = useState<number | null>(null);
  const [recheckOpen, setRecheckOpen]       = useState(false);
  const [recheckIdx, setRecheckIdx]         = useState(0);
  const [paymentMethod, setPaymentMethod]   = useState<'epayment' | 'debit'>('epayment');
  const [showReceipt, setShowReceipt]       = useState(false);
  const [searchType, setSearchType]         = useState('Invoice Number');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchValue, setSearchValue]       = useState('');
  const [invPage, setInvPage]               = useState(1);
  const [payPage, setPayPage]               = useState(1);
  const PAGE_SIZE = 8;

  /* Account statement state */
  const [accStep, setAccStep]           = useState<AccStep>('main');
  const [accPage, setAccPage]           = useState(1);
  const [selectedAcc, setSelectedAcc]   = useState<number | null>(null);
  const [stmtType, setStmtType]         = useState<'summary' | 'detailed' | 'transaction'>('summary');
  const [stmtYear, setStmtYear]         = useState('2026');
  const [stmtMonth, setStmtMonth]       = useState('May');
  const [stmtFromDate, setStmtFromDate] = useState('09-06-2026');
  const [stmtToDate, setStmtToDate]     = useState('10-06-2026');
  const [downloadFmt, setDownloadFmt]   = useState('');

  /* Advanced filter fields */
  const [fFromDate,  setFFromDate]  = useState('');
  const [fToDate,    setFToDate]    = useState('');
  const [fInvType,   setFInvType]   = useState('');
  const [fStatus,    setFStatus]    = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [payStatusFilter, setPayStatusFilter] = useState('');
  const [payStatusOpen,   setPayStatusOpen]   = useState(false);
  const [payFromDate, setPayFromDate] = useState('09-06-2026');
  const [payToDate,   setPayToDate]   = useState('10-06-2026');

  const flyoutRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openFlyout === null) return;
    const h = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [openFlyout]);

  const selectedList = Array.from(selectedRows).map(i => INVOICE_ROWS[i]).filter(Boolean);
  const totalAmt     = selectedList.reduce((s, r) => s + parseFloat(r.balance.replace(',', '')), 0);

  const toggleRow = (i: number) => setSelectedRows(prev => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  const toggleAll = () => setSelectedRows(
    selectedRows.size === INVOICE_ROWS.length ? new Set() : new Set(INVOICE_ROWS.map((_, i) => i))
  );

  /* ── Pay screen ──────────────────────────────────────────────────────────── */
  if (step === 'pay') {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 overflow-y-auto px-10 pb-8">
          <Breadcrumb onBack={onBack} extra="Pay" />
          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Pay</h1>

          {/* Selected invoices table */}
          <div className="bg-white rounded-[8px] border border-[#e0e8f5] overflow-hidden mb-5">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
              <thead>
                <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #e0e8f5' }}>
                  <th className="text-left px-4 py-3 text-[14px] font-semibold text-[#051937]">Payment Type</th>
                  <th className="text-center px-4 py-3 text-[14px] font-semibold text-[#051937]">Invoice No.</th>
                  <th className="text-center px-4 py-3 text-[14px] font-semibold text-[#051937]">Invoice Amount (AED)</th>
                  <th className="text-center px-4 py-3 text-[14px] font-semibold text-[#051937]">Settled Amount (AED)</th>
                  <th className="text-right px-4 py-3 text-[14px] font-semibold text-[#051937]">Amount (AED)</th>
                </tr>
              </thead>
              <tbody>
                {selectedList.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                    <td className="px-4 py-3 text-[14px] text-[#0e1b3d]">{row.type}</td>
                    <td className="text-center px-4 py-3 text-[14px] text-[#0e1b3d]">{row.number}</td>
                    <td className="text-center px-4 py-3 text-[14px] text-[#0e1b3d]">AED {row.amount}</td>
                    <td className="text-center px-4 py-3 text-[14px] text-[#0e1b3d]">AED {row.settled}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[14px] text-[#697498]">AED</span>
                        <input
                          defaultValue={row.balance}
                          className="w-[110px] text-right px-2 py-1 border border-[#d5ddfb] rounded-[4px] text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                          style={{ fontFamily: font }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Total */}
            <div className="px-4 py-3 border-t border-[#e0e8f5] text-[14px] text-[#0e1b3d]" style={{ background: '#f5f7fa', fontFamily: font }}>
              Total Selected Transactions: {selectedList.length} &nbsp;&nbsp; Total AED {totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-[8px] border border-[#e0e8f5] p-5 mb-6">
            <p className="text-[15px] font-medium text-[#0e1b3d] mb-1" style={{ fontFamily: font }}>Payment Method</p>
            <p className="text-[13px] text-[#697498] mb-4" style={{ fontFamily: font }}>
              Note* Card payment has maximum limit of AED 1,000,000.00
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pm" checked={paymentMethod === 'epayment'} onChange={() => setPaymentMethod('epayment')} className="size-4 accent-[#1360d2]" />
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>E-Payment</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pm" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} className="size-4 accent-[#1360d2]" />
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>Debit A/C</span>
              </label>
              {paymentMethod === 'debit' && (
                <select
                  className="border border-[#d5ddfb] rounded-[4px] px-3 py-2 text-[14px] text-[#0e1b3d] focus:outline-none"
                  style={{ fontFamily: font, minWidth: 340 }}
                >
                  <option>1050084 - XCRN BUSINESS NEW01 (BAL. AED 14539.00)</option>
                </select>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setStep('list')}
              className="h-[44px] px-8 rounded-[4px] border border-[#0e1b3d] text-[16px] text-[#0e1b3d] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              ‹ Previous
            </button>
            <button
              onClick={() => setStep('success')}
              className="h-[44px] px-8 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success / Transaction Details screen ───────────────────────────────── */
  if (step === 'success') {
    const tx = PAYMENT_ROWS[1]; // simulate a successful multiple-invoice payment
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 overflow-y-auto px-10 pb-8">
          <Breadcrumb onBack={onBack} extra="Payment Confirmation" />
          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Payment Confirmation</h1>

          <div className="bg-white rounded-[10px] border border-[#e0e8f5] overflow-hidden">
            {/* Panel title bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e8f5]" style={{ background: '#f5f7fa' }}>
              <span className="text-[17px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Payment Transaction Details</span>
            </div>
            <div className="p-6">
              {/* Transaction header */}
              <p className="text-[#dc3545] text-[16px] font-bold mb-4" style={{ fontFamily: font }}>Payment Transaction Details</p>
              <div className="bg-[#f5f7fa] rounded p-4 mb-5">
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-3">
                  {[
                    ['Transaction No.',          '13133',              'Transaction Date',     '10-06-2026'],
                    ['DEG Transaction No.',      '590000237262582',    'DEG Transaction Date', '10-06-2026 11:47:57'],
                    ['EPayment Transaction No',  '20021737',           'Initiated Date',       '10-06-2026 11:48:00'],
                    ['Initiated By',             'crnuser01',          'Status',               'SUCCESS'],
                    ['Payment Mode',             'Credit Card',        '',                     ''],
                  ].map(([l1, v1, l2, v2], idx) => (
                    <div key={idx} className="contents">
                      <div>
                        <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{l1}</span>
                        <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{v1}</p>
                      </div>
                      <div>
                        {l2 && (
                          <>
                            <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{l2}</span>
                            <p className={`text-[15px] font-semibold ${l2 === 'Status' ? 'text-[#28a745]' : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{v2}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Message</span>
                  <p className="text-[14px] text-[#1360d2] mt-1" style={{ fontFamily: font }}>Payment Status Remarks: SUCCESS</p>
                  <p className="text-[14px] text-[#dc3545] mt-1 font-medium" style={{ fontFamily: font }}>
                    Collection Status Remarks : Transaction has been processed successfully.
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <p className="text-[#dc3545] text-[16px] font-bold mb-3" style={{ fontFamily: font }}>Payment Details</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }} className="mb-6">
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e8f5' }}>
                    {['Payment Type', 'Invoice / Account No.', 'Amount (AED)', 'Receipt No.', 'Remarks', 'Status'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-[14px] font-semibold text-[#051937]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedList.length > 0
                    ? selectedList.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.type}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{r.number}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">AED {r.balance}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">Z-{12645 + i}</td>
                          <td className="py-3 px-3 text-[13px] text-[#697498]">M1CS 1927055; BPS Transaction for ECM-{r.number}</td>
                          <td className="py-3 px-3 text-[14px] font-medium text-[#28a745]">SUCCESS</td>
                        </tr>
                      ))
                    : tx.details.map((d, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.type}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.invoiceNo}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">AED {d.amount}</td>
                          <td className="py-3 px-3 text-[14px] text-[#0e1b3d]">{d.receiptNo}</td>
                          <td className="py-3 px-3 text-[13px] text-[#697498]">{d.remarks}</td>
                          <td className="py-3 px-3 text-[14px] font-medium text-[#28a745]">{d.status}</td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => window.print()}
                  className="h-[44px] px-6 rounded-[4px] border border-[#0e1b3d] text-[15px] text-[#0e1b3d] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
                  style={{ fontFamily: font }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" rx="1" />
                  </svg>
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="h-[44px] px-6 rounded-[4px] text-[15px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                  style={{ background: '#1360d2', fontFamily: font }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View Receipt
                </button>
                <button
                  onClick={() => { setStep('list'); setSelectedRows(new Set()); }}
                  className="h-[44px] px-6 rounded-[4px] border border-[#d5ddfb] text-[15px] text-[#0e1b3d] bg-white hover:bg-[#f0f4ff] transition-colors"
                  style={{ fontFamily: font }}
                >
                  Back to Listing
                </button>
              </div>
            </div>
          </div>
        </div>
        {showReceipt && (
          <ReceiptModal
            onClose={() => setShowReceipt(false)}
            rows={selectedList.length > 0
              ? selectedList.map((r, i) => ({ type: r.type, invoiceNo: r.number, amount: r.balance, receiptNo: `Z-${12645 + i}`, remarks: `M1CS 1927055; BPS Transaction for ECM-${r.number}`, status: 'SUCCESS' }))
              : tx.details
            }
          />
        )}
      </div>
    );
  }

  /* ── Invoices content ───────────────────────────────────────────────────── */
  const paginatedInv = INVOICE_ROWS.slice((invPage - 1) * PAGE_SIZE, invPage * PAGE_SIZE);

  const InvoicesContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toolbar */}
      <div className="flex items-center gap-[10px] mb-[12px] flex-wrap">
        {/* Advance Filters */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
            showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
          }`}
          style={{ fontFamily: font }}
        >
          Advance Filters
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden flex-1 min-w-[260px] max-w-[420px] relative">
          <button
            type="button"
            onClick={() => setSearchTypeOpen(o => !o)}
            className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer hover:bg-[#f7faff] transition-colors flex-shrink-0"
          >
            <span className="text-[15px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{searchType}</span>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {searchTypeOpen && (
            <div className="absolute z-20 top-[48px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[180px] py-1">
              {['Invoice Type', 'Invoice Number'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[15px] text-[#0e1b3d] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}
                  onClick={() => { setSearchType(opt); setSearchTypeOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center px-[12px] gap-[8px] flex-1">
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={searchType === 'Invoice Type' ? 'Search invoice type…' : 'Invoice number…'}
              className="flex-1 text-[15px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none"
              style={{ fontFamily: font }}
            />
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#8f94ae" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            {fStatus || 'Status'}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {statusOpen && (
            <div className="absolute z-20 top-[52px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[180px] py-1">
              {['All', ...Object.keys(INV_STATUS)].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[15px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setFStatus(opt === 'All' ? '' : opt); setStatusOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Proceed to Pay */}
        <button
          disabled={selectedRows.size === 0}
          onClick={() => setStep('pay')}
          className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white transition-opacity"
          style={{
            background: selectedRows.size > 0 ? '#1360d2' : '#a6c2e9',
            fontFamily: font,
            cursor: selectedRows.size > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Proceed to Pay {selectedRows.size > 0 && `(${selectedRows.size})`}
        </button>
      </div>

      {/* Advanced Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* From Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>From Date</label>
              <div className="relative">
                <input type="date" value={fFromDate} onChange={e => setFFromDate(e.target.value)}
                  className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                  style={{ fontFamily: font }} />
              </div>
            </div>
            {/* To Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>To Date</label>
              <input type="date" value={fToDate} onChange={e => setFToDate(e.target.value)}
                className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                style={{ fontFamily: font }} />
            </div>
            {/* Invoice Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Invoice Type</label>
              <select value={fInvType} onChange={e => setFInvType(e.target.value)}
                className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                style={{ fontFamily: font }}>
                <option value="">All</option>
                <option>Case Management Demand Notice</option>
                <option>CRN SEA Discrepancy Export Manifest Fine Invoice</option>
              </select>
            </div>
            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Status</label>
              <select value={fStatus} onChange={e => setFStatus(e.target.value)}
                className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                style={{ fontFamily: font }}>
                <option value="">All</option>
                {Object.keys(INV_STATUS).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="h-[40px] px-6 rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontFamily: font }}>
              Search
            </button>
            <button onClick={() => { setFFromDate(''); setFToDate(''); setFInvType(''); setFStatus(''); }}
              className="h-[40px] px-6 rounded-[4px] border border-[#d5ddfb] text-[15px] text-[#0e1b3d] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {/* Checkbox header */}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', width: 44, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingLeft: 16 }}>
                <input type="checkbox" checked={selectedRows.size === INVOICE_ROWS.length} onChange={toggleAll}
                  className="size-4 accent-[#1360d2] cursor-pointer" />
              </th>
              {['Invoice Type', 'Invoice Number', 'Invoice Date', 'Amount (AED)', 'Settled Amount (AED)', 'Balance Amount (AED)'].map((h, i) => (
                <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <span className="text-[15px] font-medium text-[#051937]">{h}</span>
                </th>
              ))}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, minWidth: 160 }}>
                <span className="text-[15px] font-medium text-[#051937]">Status</span>
              </th>
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 80, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                <span className="text-[15px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedInv.map((row, i) => {
              const absIdx = (invPage - 1) * PAGE_SIZE + i;
              const isSelected = selectedRows.has(absIdx);
              const st = INV_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              return (
                <tr key={i} style={{ boxShadow: isSelected ? '0 0 0 2px #1360d2' : undefined }}>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: '1px solid #f0f4ff' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(absIdx)} className="size-4 accent-[#1360d2] cursor-pointer" />
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', maxWidth: 280 }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.type}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <a className="text-[15px] text-[#1360d2] underline cursor-pointer whitespace-nowrap">{row.number}</a>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">{row.date}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">AED {row.amount}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">AED {row.settled}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">AED {row.balance}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                      {row.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center' }}>
                    <div className="relative inline-block" ref={openFlyout === absIdx ? flyoutRef : undefined}>
                      <button onClick={() => setOpenFlyout(openFlyout === absIdx ? null : absIdx)}
                        className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                        </svg>
                      </button>
                      {openFlyout === absIdx && (
                        <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                          style={{ top: 36, width: 140, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                          {['View', 'Pay'].map(item => (
                            <button key={item} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); if (item === 'Pay') { setSelectedRows(new Set([absIdx])); setStep('pay'); } }}>
                              <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item}</span>
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
          page={invPage}
          totalPages={Math.max(1, Math.ceil(INVOICE_ROWS.length / PAGE_SIZE))}
          pageSize={PAGE_SIZE}
          totalItems={INVOICE_ROWS.length}
          onPageChange={setInvPage}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );

  /* ── Payments content ───────────────────────────────────────────────────── */
  const filteredPayments = payStatusFilter ? PAYMENT_ROWS.filter(r => r.status === payStatusFilter) : PAYMENT_ROWS;
  const paginatedPay = filteredPayments.slice((payPage - 1) * PAGE_SIZE, payPage * PAGE_SIZE);

  const PaymentsContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Date search bar */}
      <div className="bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-4">
        <p className="text-[15px] font-semibold text-[#dc3545] mb-4" style={{ fontFamily: font }}>Payment History Search</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>From Date *</label>
            <div className="relative">
              <input type="text" value={payFromDate} onChange={e => setPayFromDate(e.target.value)}
                className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-10 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                style={{ fontFamily: font }} />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.6">
                <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>To Date *</label>
            <div className="relative">
              <input type="text" value={payToDate} onChange={e => setPayToDate(e.target.value)}
                className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-10 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                style={{ fontFamily: font }} />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.6">
                <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[40px] px-6 rounded-[4px] text-[15px] text-white flex items-center gap-2" style={{ background: '#1360d2', fontFamily: font }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
            </svg>
            Search
          </button>
          <button className="h-[40px] px-6 rounded-[4px] border border-[#d5ddfb] text-[15px] text-[#0e1b3d] bg-white hover:bg-[#f0f4ff] flex items-center gap-2" style={{ fontFamily: font }}
            onClick={() => { setPayFromDate(''); setPayToDate(''); setPayStatusFilter(''); }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Status filter + table label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[15px] font-semibold text-[#dc3545]" style={{ fontFamily: font }}>Search Results</p>
        {/* Status filter */}
        <div className="relative">
          <button onClick={() => setPayStatusOpen(o => !o)}
            className="h-[40px] px-4 flex items-center gap-2 rounded-[4px] border border-[#d5ddfb] bg-white text-[14px] text-[#0e1b3d] hover:bg-[#f0f4ff]"
            style={{ fontFamily: font }}>
            {payStatusFilter || 'Filter by Status'}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {payStatusOpen && (
            <div className="absolute z-20 top-[44px] right-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[160px] py-1">
              {['All', 'SUCCESS', 'INITIATED', 'FAILED'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[14px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setPayStatusFilter(opt === 'All' ? '' : opt); setPayStatusOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payments table */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {[
                ['Payment Type', 220],
                ['Transaction No.', 130],
                ['Transaction Date', 170],
                ['Invoice / Account No.', 170],
              ].map(([label, w], i) => (
                <th key={label as string} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, width: w as number, minWidth: w as number, borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0, paddingLeft: i === 0 ? 16 : 12 }}>
                  <span className="text-[15px] font-medium text-[#051937] whitespace-nowrap">{label}</span>
                </th>
              ))}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, minWidth: 120 }}>
                <span className="text-[15px] font-medium text-[#051937]">Status</span>
              </th>
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'right', fontWeight: 500, minWidth: 130 }}>
                <span className="text-[15px] font-medium text-[#051937]">Amount (AED)</span>
              </th>
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 80, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                <span className="text-[15px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPay.map((row, i) => {
              const absIdx = (payPage - 1) * PAGE_SIZE + i;
              const st = PAY_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              return (
                <tr key={i}>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.type}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <a className="text-[15px] text-[#1360d2] underline cursor-pointer whitespace-nowrap">{row.txNo}</a>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">{row.txDate}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">{row.invoiceNo || '—'}</span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap">AED {row.amount}</span>
                  </td>
                  {/* Actions */}
                  <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center' }}>
                    <div className="relative inline-block" ref={openFlyout === absIdx + 100 ? flyoutRef : undefined}>
                      <button onClick={() => setOpenFlyout(openFlyout === absIdx + 100 ? null : absIdx + 100)}
                        className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                        </svg>
                      </button>
                      {openFlyout === absIdx + 100 && (
                        <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                          style={{ top: 36, width: 130, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                          <button className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => { setOpenFlyout(null); setRecheckIdx(filteredPayments.indexOf(row)); setRecheckOpen(true); }}>
                            <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>Recheck</span>
                          </button>
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
          page={payPage}
          totalPages={Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE))}
          pageSize={PAGE_SIZE}
          totalItems={filteredPayments.length}
          onPageChange={setPayPage}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );

  /* ── Accounts content ───────────────────────────────────────────────────── */
  const paginatedAcc = ACCOUNTS.slice((accPage - 1) * ACC_PAGE_SIZE, accPage * ACC_PAGE_SIZE);

  const AccountsContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {accStep === 'main' ? (
        /* ─ Landing: show Account Statement button ─ */
        <div className="flex flex-col gap-4">
          <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>
            Select an option below to manage your accounts.
          </p>
          <button
            onClick={() => { setAccStep('list'); setSelectedAcc(null); setStmtType('summary'); setDownloadFmt(''); }}
            className="w-fit h-[48px] px-[24px] flex items-center gap-[10px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
            </svg>
            Account Statement
          </button>
        </div>
      ) : (
        /* ─ Account list + statement form ─ */
        <div className="flex flex-col gap-0">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[16px] font-semibold text-[#dc3545]" style={{ fontFamily: font }}>Account Statement</p>
            <button
              onClick={() => { setAccStep('main'); setSelectedAcc(null); }}
              className="h-[36px] px-4 flex items-center gap-2 rounded-[4px] border border-[#d5ddfb] bg-white text-[14px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font }}
            >
              ‹ Back
            </button>
          </div>

          {/* Accounts table */}
          <div className="bg-white rounded-[8px] border border-[#e0e8f5] overflow-hidden mb-0">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e8f5' }}>
                  <th className="text-left px-4 py-3 text-[14px] font-semibold text-[#051937] w-[80px]">Select</th>
                  <th className="text-left px-4 py-3 text-[14px] font-semibold text-[#051937]">Account Type</th>
                  <th className="text-left px-4 py-3 text-[14px] font-semibold text-[#051937]">Account</th>
                  <th className="text-right px-4 py-3 text-[14px] font-semibold text-[#051937]">Available Limit (AED)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAcc.map((row, i) => {
                  const absIdx = (accPage - 1) * ACC_PAGE_SIZE + i;
                  const isSelected = selectedAcc === absIdx;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedAcc(absIdx)}
                      className="cursor-pointer hover:bg-[#f7faff] transition-colors"
                      style={{
                        borderBottom: '1px solid #f0f4ff',
                        background: isSelected ? '#eef4ff' : undefined,
                      }}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name="acc-select"
                          checked={isSelected}
                          onChange={() => setSelectedAcc(absIdx)}
                          className="size-4 accent-[#1360d2] cursor-pointer"
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#0e1b3d]">{row.type}</td>
                      <td className="px-4 py-3">
                        <a className="text-[14px] text-[#1360d2] underline cursor-pointer">{row.account}</a>
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#0e1b3d] text-right whitespace-nowrap">
                        AED {row.limit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination row inside table card */}
            <div className="flex items-center justify-end px-4 py-3 border-t border-[#e0e8f5]">
              <div className="flex items-center gap-1">
                <button onClick={() => setAccPage(1)} disabled={accPage === 1}
                  className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb] disabled:opacity-40 hover:bg-[#e2ebf9] transition-colors text-[#0e1b3d] text-[12px]">«</button>
                <button onClick={() => setAccPage(p => Math.max(1, p - 1))} disabled={accPage === 1}
                  className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb] disabled:opacity-40 hover:bg-[#e2ebf9] transition-colors text-[#0e1b3d] text-[12px]">‹</button>
                <span className="px-3 text-[13px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                  {accPage} of {Math.ceil(ACCOUNTS.length / ACC_PAGE_SIZE)}
                </span>
                <button onClick={() => setAccPage(p => Math.min(Math.ceil(ACCOUNTS.length / ACC_PAGE_SIZE), p + 1))} disabled={accPage >= Math.ceil(ACCOUNTS.length / ACC_PAGE_SIZE)}
                  className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb] disabled:opacity-40 hover:bg-[#e2ebf9] transition-colors text-[#0e1b3d] text-[12px]">›</button>
                <button onClick={() => setAccPage(Math.ceil(ACCOUNTS.length / ACC_PAGE_SIZE))} disabled={accPage >= Math.ceil(ACCOUNTS.length / ACC_PAGE_SIZE)}
                  className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb] disabled:opacity-40 hover:bg-[#e2ebf9] transition-colors text-[#0e1b3d] text-[12px]">»</button>
              </div>
            </div>
          </div>

          {/* Statement requirements — shown only when an account is selected */}
          {selectedAcc !== null && (
            <div className="bg-white rounded-[8px] border border-[#e0e8f5] p-5 mt-4">
              {/* Statement type radios */}
              <div className="flex items-center gap-6 mb-5 flex-wrap">
                {([
                  ['summary',     'Monthly Statement (Summary)'],
                  ['detailed',    'Monthly Statement (Detailed)'],
                  ['transaction', 'Transaction List'],
                ] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stmt-type"
                      checked={stmtType === val}
                      onChange={() => { setStmtType(val); setDownloadFmt(''); }}
                      className="size-4 accent-[#1360d2]"
                    />
                    <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font }}>{label}</span>
                  </label>
                ))}
              </div>

              {/* Transaction List note */}
              {stmtType === 'transaction' && (
                <p className="text-[13px] text-[#0e1b3d] mb-4 p-3 bg-[#fff8e6] rounded border border-[#fcd7a0]" style={{ fontFamily: font }}>
                  <strong>Note*</strong> Kindly note that the report is available for 30 days only. If you need more than 30 days, please extract the report in batches or use monthly option
                </p>
              )}

              {/* Form fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {stmtType !== 'transaction' ? (
                  <>
                    {/* Year */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Year *</label>
                      <div className="relative">
                        <select
                          value={stmtYear}
                          onChange={e => setStmtYear(e.target.value)}
                          className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-8 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white appearance-none"
                          style={{ fontFamily: font }}
                        >
                          {YEARS.map(y => <option key={y}>{y}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="14" height="14" fill="none">
                          <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    {/* Month */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Month *</label>
                      <div className="relative">
                        <select
                          value={stmtMonth}
                          onChange={e => setStmtMonth(e.target.value)}
                          className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-8 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white appearance-none"
                          style={{ fontFamily: font }}
                        >
                          {MONTHS.map(m => <option key={m}>{m}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="14" height="14" fill="none">
                          <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* From Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>From Date *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={stmtFromDate}
                          onChange={e => setStmtFromDate(e.target.value)}
                          placeholder="dd-mm-yyyy"
                          className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-10 text-[14px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none focus:border-[#1360d2]"
                          style={{ fontFamily: font }}
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#697498" strokeWidth="1.6">
                          <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
                        </svg>
                      </div>
                    </div>
                    {/* To Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>To Date *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={stmtToDate}
                          onChange={e => setStmtToDate(e.target.value)}
                          placeholder="dd-mm-yyyy"
                          className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-10 text-[14px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none focus:border-[#1360d2]"
                          style={{ fontFamily: font }}
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#697498" strokeWidth="1.6">
                          <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Download Format + Download button */}
              <div className="flex items-end gap-4 flex-wrap">
                <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-[320px]">
                  <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Download Format *</label>
                  <div className="relative">
                    <select
                      value={downloadFmt}
                      onChange={e => setDownloadFmt(e.target.value)}
                      className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 pr-8 text-[14px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white appearance-none"
                      style={{ fontFamily: font, color: downloadFmt ? '#0e1b3d' : '#8f94ae' }}
                    >
                      <option value="" disabled>Please Select</option>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="14" height="14" fill="none">
                      <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <button
                  disabled={!downloadFmt}
                  className="h-[42px] px-6 rounded-[4px] text-[15px] text-white flex items-center gap-2 transition-opacity"
                  style={{ background: downloadFmt ? '#4a4f60' : '#a0a5b8', fontFamily: font, cursor: downloadFmt ? 'pointer' : 'not-allowed' }}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 3v10M6 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 15h14" strokeLinecap="round" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  /* ── Main render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-4 md:px-10">
          <Breadcrumb onBack={onBack} />
          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font }}>Bill Payment</h1>
        </div>

        {/* Main layout: left sidebar + content */}
        <div className="flex flex-1 px-4 md:px-10 pb-[20px] pt-[4px] gap-[12px] min-h-0">

          {/* Left sidebar */}
          <div
            className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300"
            style={{
              width: panelCollapsed ? 64 : 176,
              background: '#e4efff',
              border: '1px solid #a6c2e9',
              alignSelf: 'flex-start',
            }}
          >
            {/* Collapse toggle */}
            <button
              onClick={() => setPanelCollapsed(c => !c)}
              className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] hover:bg-[#dde2f0] transition-colors w-full flex-shrink-0"
              title={panelCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg viewBox="0 0 20 20" className="size-[17px] transition-transform duration-300" style={{ transform: panelCollapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#0e1b3d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 15l-5-5 5-5" /><path d="M8 15l-5-5 5-5" />
              </svg>
            </button>

            {MENU_ITEMS.map((item, i) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveMenu(item.label)}
                  className="flex items-center w-full text-left transition-all hover:opacity-80"
                  style={{
                    gap: panelCollapsed ? 0 : 10,
                    padding: panelCollapsed ? '12px 12px' : '12px 14px',
                    justifyContent: panelCollapsed ? 'center' : 'flex-start',
                    ...(isActive
                      ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                      : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
                  }}
                  title={panelCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center justify-center flex-shrink-0 rounded-[8px]"
                    style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <item.Icon />
                  </div>
                  {!panelCollapsed && (
                    <span className="text-[15px] text-[#0e1b3d] leading-tight whitespace-nowrap overflow-hidden"
                      style={{ fontFamily: font, fontWeight: isActive ? 700 : 400 }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right content */}
          {activeMenu === 'Dashboard' && (
            <div className="flex-1 flex flex-col gap-[20px] min-w-0">

              {/* ── Account Overview ───────────────────────────────────────── */}
              <div>
                <p className="text-[16px] font-semibold text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font }}>
                  Account Overview
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                  {/* Credit Accounts card */}
                  <div className="bg-white rounded-[12px] border border-[#d5ddfb] p-[20px] flex flex-col gap-[14px]"
                    style={{ boxShadow: '0 2px 12px rgba(19,96,210,0.07)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(19,96,210,0.10)' }}>
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8">
                            <rect x="2" y="6" width="20" height="13" rx="2" />
                            <path d="M2 10h20" strokeLinecap="round" />
                            <path d="M6 14h4" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>
                          Credit Accounts
                        </p>
                      </div>
                      <span className="px-[10px] py-[3px] rounded-full text-[13px] font-semibold"
                        style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontFamily: font }}>
                        {ACCOUNTS.length} accounts
                      </span>
                    </div>
                    <div className="border-t border-[#f0f4ff] pt-[12px] flex items-end justify-between">
                      <div>
                        <p className="text-[12px] text-[#697498] mb-[2px]" style={{ fontFamily: font }}>Total Available Balance</p>
                        <p className="text-[22px] font-bold text-[#1360d2]" style={{ fontFamily: font }}>
                          {fmtBalance(creditTotal)}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveMenu('Accounts')}
                        className="text-[13px] text-[#1360d2] hover:underline flex items-center gap-1"
                        style={{ fontFamily: font }}
                      >
                        View all
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.8">
                          <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Debit Accounts card */}
                  <div className="bg-white rounded-[12px] border border-[#d5ddfb] p-[20px] flex flex-col gap-[14px]"
                    style={{ boxShadow: '0 2px 12px rgba(19,96,210,0.07)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(105,116,152,0.10)' }}>
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#697498" strokeWidth="1.8">
                            <rect x="2" y="6" width="20" height="13" rx="2" />
                            <path d="M2 10h20" strokeLinecap="round" />
                            <path d="M6 14h4" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>
                          Debit Accounts
                        </p>
                      </div>
                      <span className="px-[10px] py-[3px] rounded-full text-[13px] font-semibold"
                        style={{ background: 'rgba(105,116,152,0.10)', color: '#697498', fontFamily: font }}>
                        {DEBIT_ACCOUNTS.length} accounts
                      </span>
                    </div>
                    <div className="border-t border-[#f0f4ff] pt-[12px] flex items-end justify-between">
                      <div>
                        <p className="text-[12px] text-[#697498] mb-[2px]" style={{ fontFamily: font }}>Total Available Balance</p>
                        <p className="text-[22px] font-bold text-[#697498]" style={{ fontFamily: font }}>
                          {fmtBalance(debitTotal)}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveMenu('Accounts')}
                        className="text-[13px] text-[#1360d2] hover:underline flex items-center gap-1"
                        style={{ fontFamily: font }}
                      >
                        View all
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.8">
                          <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Invoice & Payment Summary ───────────────────────────────── */}
              <div>
                <p className="text-[16px] font-semibold text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font }}>
                  Invoice &amp; Payment Summary
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
                  {/* Pending invoices */}
                  <button
                    onClick={() => setActiveMenu('Invoices')}
                    className="bg-white rounded-[12px] border border-[#fcd7a0] p-[20px] text-left flex flex-col gap-[10px] hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 12px rgba(255,169,26,0.08)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-[40px] rounded-[10px] flex items-center justify-center"
                        style={{ background: 'rgba(255,169,26,0.12)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#b45309" strokeWidth="1.8">
                          <rect x="4" y="3" width="16" height="18" rx="2" />
                          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
                          <circle cx="19" cy="19" r="4" fill="#b45309" stroke="none" />
                          <path d="M19 17v2l1 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </div>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#b45309" strokeWidth="1.8">
                        <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[36px] font-bold leading-none mb-[4px]"
                        style={{ color: '#b45309', fontFamily: font }}>{pendingInv}</p>
                      <p className="text-[14px] font-medium text-[#0e1b3d]" style={{ fontFamily: font }}>
                        Invoices Pending Payment
                      </p>
                      <p className="text-[12px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>
                        Click to view pending invoices
                      </p>
                    </div>
                  </button>

                  {/* Initiated payments */}
                  <button
                    onClick={() => setActiveMenu('Payments')}
                    className="bg-white rounded-[12px] border border-[#b3caff] p-[20px] text-left flex flex-col gap-[10px] hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 12px rgba(19,96,210,0.08)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-[40px] rounded-[10px] flex items-center justify-center"
                        style={{ background: 'rgba(19,96,210,0.10)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
                          <rect x="2" y="6" width="20" height="13" rx="2" />
                          <path d="M2 10h20" strokeLinecap="round" />
                          <path d="M12 13v3M10 14l2-1 2 1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.8">
                        <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[36px] font-bold leading-none mb-[4px]"
                        style={{ color: '#1360d2', fontFamily: font }}>{initiatedPay}</p>
                      <p className="text-[14px] font-medium text-[#0e1b3d]" style={{ fontFamily: font }}>
                        Initiated Payments
                      </p>
                      <p className="text-[12px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>
                        Payments in progress
                      </p>
                    </div>
                  </button>

                  {/* For recheck */}
                  <button
                    onClick={() => setActiveMenu('Payments')}
                    className="bg-white rounded-[12px] border border-[#f5b8b8] p-[20px] text-left flex flex-col gap-[10px] hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 12px rgba(192,57,43,0.06)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-[40px] rounded-[10px] flex items-center justify-center"
                        style={{ background: 'rgba(192,57,43,0.08)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#c0392b" strokeWidth="1.8">
                          <path d="M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                          <path d="M4.93 4.93l14.14 14.14" strokeLinecap="round" />
                          <path d="M12 8v5" strokeLinecap="round" />
                          <circle cx="12" cy="16" r="0.8" fill="#c0392b" />
                        </svg>
                      </div>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#c0392b" strokeWidth="1.8">
                        <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[36px] font-bold leading-none mb-[4px]"
                        style={{ color: '#c0392b', fontFamily: font }}>{recheckPay}</p>
                      <p className="text-[14px] font-medium text-[#0e1b3d]" style={{ fontFamily: font }}>
                        Payments for Recheck
                      </p>
                      <p className="text-[12px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>
                        Failed transactions needing review
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeMenu === 'Invoices'  && <InvoicesContent />}
          {activeMenu === 'Payments'  && <PaymentsContent />}
          {activeMenu === 'Accounts'  && <AccountsContent />}
        </div>
      </div>

      {/* Recheck modal */}
      {recheckOpen && (
        <TransactionModal
          row={PAYMENT_ROWS[recheckIdx] ?? PAYMENT_ROWS[0]}
          onClose={() => setRecheckOpen(false)}
        />
      )}
    </div>
  );
}
