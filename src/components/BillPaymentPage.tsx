import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Pagination from './Pagination';

const font = "'Dubai', sans-serif";

/* ── Dirham icon ─────────────────────────────────────────────────────────────── */
function DirhamIcon({ size = 14, color = '#0e1b3d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 17 / 20)} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <g clipPath="url(#drhm)">
        <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="drhm"><rect width="20" height="17" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

/* ── Status styles ──────────────────────────────────────────────────────────── */
const INV_STATUS: Record<string, { bg: string; color: string }> = {
  'Unpaid':         { bg: 'rgba(255,169,26,0.16)',   color: '#b45309' },
  'Paid':           { bg: '#e6f4ec',                 color: '#1b6c3a' },
  'Initiated':      { bg: '#e8f0ff',                 color: '#1360d2' },
  'Partially Paid': { bg: 'rgba(249,115,22,0.10)',   color: '#ea580c' },
};
const PAY_STATUS: Record<string, { bg: string; color: string }> = {
  'Success':   { bg: '#e6f4ec',               color: '#1b6c3a' },
  'Initiated': { bg: '#e8f0ff',               color: '#1360d2' },
  'Unpaid':    { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

/* ── Dummy data ─────────────────────────────────────────────────────────────── */
const INVOICE_ROWS = [
  { type: 'Case Management Demand Notice',                    number: '70003764',   date: '05-Jun-26', amount: '5,520.00', settled: '0.00',     balance: '5520.00',  status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003765',   date: '06-Jun-26', amount: '1,000.00', settled: '1,000.00', balance: '0.00',     status: 'Paid',      txNo: '13133', txDate: '10-06-2026', source: 'SGRCS', payMode: 'E-Payment' },
  { type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', number: '1000004567', date: '07-Jun-26', amount: '520.00',   settled: '0.00',     balance: '520.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'SAS',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003820',   date: '08-Jun-26', amount: '5,490.00', settled: '2,000.00', balance: '3490.00',  status: 'Partially Paid', txNo: '13132', txDate: '10-06-2026', source: 'CDR', payMode: 'Debit A/C' },
  { type: 'Case Management Demand Notice',                    number: '70003819',   date: '08-Jun-26', amount: '1,000.00', settled: '0.00',     balance: '1000.00',  status: 'Initiated', txNo: '13131', txDate: '10-06-2026', source: 'CRNS',  payMode: 'E-Payment' },
  { type: 'Case Management Demand Notice',                    number: '70003816',   date: '09-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003817',   date: '09-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'SGRCS', payMode: '—'         },
];

const PAYMENT_ROWS = [
  { type: 'Case Management Demand Notice', txNo: '13136', txDate: '10-06-2026 11:57:00', invoiceNo: '70003787', status: 'Success',   amount: '200.00',   txDateFull: '10-06-2026', degTx: '590000237262582', ePayTx: '20021737', initiatedDate: '10-06-2026 11:58:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003786', amount: '5,520.00', receiptNo: 'Z-12645', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003786', status: 'Success' }] },
  { type: 'Multiple Bill Settlement',      txNo: '13133', txDate: '10-06-2026 11:48:00', invoiceNo: '',          status: 'Success',   amount: '5,540.00', txDateFull: '10-06-2026', degTx: '590000237262583', ePayTx: '20021738', initiatedDate: '10-06-2026 11:48:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '5,490.00', receiptNo: 'Z-12647', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'Success' }, { type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', invoiceNo: '1000004567', amount: '50.00', receiptNo: 'Z-12648', remarks: 'M1CS 1927055; BPS Transaction for CRN-1000004567', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13132', txDate: '10-06-2026 10:18:00', invoiceNo: '70003820', status: 'Success',   amount: '5,490.00', txDateFull: '10-06-2026', degTx: '590000237262584', ePayTx: '20021739', initiatedDate: '10-06-2026 10:18:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '5,490.00', receiptNo: 'Z-12647', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13131', txDate: '10-06-2026 10:11:00', invoiceNo: '70003819', status: 'Success',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262585', ePayTx: '20021740', initiatedDate: '10-06-2026 10:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003819', amount: '1,000.00', receiptNo: 'Z-12648', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003819', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13129', txDate: '10-06-2026 10:08:00', invoiceNo: '70003819', status: 'Initiated', amount: '220.00',   txDateFull: '14-05-2026', degTx: '590000237132364', ePayTx: '20021566', initiatedDate: '14-05-2026 09:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: Transaction cancelled due to user did not complete the payment process', colMsg: 'Collection Status Remarks: DEG - Transaction cancelled due to user did not complete the payment process', details: [{ type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', invoiceNo: '1000004567', amount: '520.00', receiptNo: '', remarks: '', status: 'Unpaid' }] },
  { type: 'Case Management Demand Notice', txNo: '13128', txDate: '10-06-2026 10:00:00', invoiceNo: '70003816', status: 'Success',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262586', ePayTx: '20021741', initiatedDate: '10-06-2026 10:00:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003816', amount: '1,000.00', receiptNo: 'Z-12649', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003816', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13127', txDate: '10-06-2026 09:55:00', invoiceNo: '70003817', status: 'Initiated', amount: '220.00',   txDateFull: '10-06-2026', degTx: '590000237262587', ePayTx: '20021742', initiatedDate: '10-06-2026 09:55:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: INITIATED', colMsg: '', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003817', amount: '220.00', receiptNo: '', remarks: '', status: 'Initiated' }] },
];

/* ── Account data ───────────────────────────────────────────────────────────── */
const ACCOUNTS = [
  { type: 'Credit Account', account: '1222683 - AEOUAT1', totalLimit: '10,000,000,000.00', amountDue: '6,643.00',    currentLimit: '9,999,993,357.00', availableLimit: '9,999,993,357.00' },
  { type: 'Credit Account', account: '1222685 - AEOUAT1', totalLimit: '985,000,000.00',    amountDue: '6,510.00',    currentLimit: '984,993,490.00',   availableLimit: '984,993,490.00'   },
  { type: 'Credit Account', account: '1222839 - AEOUAT1', totalLimit: '8,570,000,000.00',  amountDue: '192,834.00',  currentLimit: '8,569,807,166.00', availableLimit: '8,569,807,166.00' },
  { type: 'Credit Account', account: '1222840 - AEOUAT1', totalLimit: '8,957,000,000.00',  amountDue: '159,588.00',  currentLimit: '8,956,840,412.00', availableLimit: '8,956,840,412.00' },
  { type: 'Credit Account', account: '1222843 - AEOUAT1', totalLimit: '897,000,000.00',    amountDue: '416,486.00',  currentLimit: '896,583,514.00',   availableLimit: '896,583,514.00'   },
  { type: 'Credit Account', account: '1222844 - AEOUAT1', totalLimit: '8,957,000,000.00',  amountDue: '194,563.00',  currentLimit: '8,956,805,437.00', availableLimit: '8,956,805,437.00' },
  { type: 'Credit Account', account: '1222889 - AEOUAT1', totalLimit: '31,500,000.00',     amountDue: '280,709.38',  currentLimit: '31,219,290.62',    availableLimit: '31,219,290.62'    },
  { type: 'Credit Account', account: '1222890 - AEOUAT1', totalLimit: '3,500,000.00',      amountDue: '43,029.00',   currentLimit: '3,456,971.00',     availableLimit: '3,456,971.00'     },
  { type: 'Credit Account', account: '1222964 - AEOUAT1', totalLimit: '100,000.00',        amountDue: '20,049.00',   currentLimit: '79,951.00',        availableLimit: '79,951.00'        },
  { type: 'Credit Account', account: '1222966 - AEOUAT1', totalLimit: '300,000.00',        amountDue: '49,140.00',   currentLimit: '250,860.00',       availableLimit: '250,860.00'       },
];

const DEBIT_ACCOUNTS = [
  { type: 'Debit Account', account: '9001234 - AEOUAT1', totalLimit: '20,000.00', amountDue: '5,461.00', currentLimit: '14,539.00', availableLimit: '14,539.00' },
  { type: 'Debit Account', account: '9001235 - AEOUAT1', totalLimit: '10,000.00', amountDue: '1,750.00', currentLimit: '8,250.00',  availableLimit: '8,250.00'  },
  { type: 'Debit Account', account: '9001236 - AEOUAT1', totalLimit: '25,000.00', amountDue: '2,900.00', currentLimit: '22,100.00', availableLimit: '22,100.00' },
];

const DEBIT_PAY_OPTIONS = [
  { value: '1050089', label: '1050089 - AEOUAT1',            balance: 99987596.50 },
  { value: '1050084', label: '1050084 - XCRN BUSINESS NEW01', balance: 14539.00   },
];

/* ── Pre-computed dashboard stats ──────────────────────────────────────────── */
const creditTotal    = ACCOUNTS.reduce((s, a) => s + parseFloat(a.availableLimit.replace(/,/g, '')), 0);
const debitTotal     = DEBIT_ACCOUNTS.reduce((s, a) => s + parseFloat(a.availableLimit.replace(/,/g, '')), 0);
const pendingInv     = INVOICE_ROWS.filter(r => r.status === 'Unpaid').length;
const pendingInvAmt  = INVOICE_ROWS.filter(r => r.status === 'Unpaid').reduce((s, r) => s + parseFloat(r.balance.replace(/,/g, '')), 0);
const initiatedPay   = PAYMENT_ROWS.filter(r => r.status === 'Initiated').length;
const recheckPay     = PAYMENT_ROWS.filter(r => r.details.some(d => d.status === 'Unpaid')).length;
const pendingPay     = PAYMENT_ROWS.filter(r => r.status !== 'Success').length;
const paidPayAmt     = PAYMENT_ROWS.filter(r => r.status === 'Success').reduce((s, r) => s + parseFloat(r.amount.replace(/,/g, '')), 0);
const recentPayments = PAYMENT_ROWS.slice(0, 5);

const fmtBalance = (n: number) =>
  'AED ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* All accounts combined — debit accounts interspersed so they appear on page 1 */
const ALL_ACCOUNTS = [
  ACCOUNTS[0],
  ACCOUNTS[1],
  ACCOUNTS[2],
  DEBIT_ACCOUNTS[0],
  ACCOUNTS[3],
  ACCOUNTS[4],
  DEBIT_ACCOUNTS[1],
  ACCOUNTS[5],
  ACCOUNTS[6],
  DEBIT_ACCOUNTS[2],
  ACCOUNTS[7],
  ACCOUNTS[8],
  ACCOUNTS[9],
];

const ACC_PAGE_SIZE = 8;
const YEARS  = ['2024', '2025', '2026'];
const INVOICE_TYPES = [
  'Auction Receivable',
  'Berthing/Loading Fee Statement',
  'Case Management Demand Notice',
  'CRN SEA Discrepancy Export Manifest Fine Invoice',
  'CRN SEA Export Late Manifest Fine Invoice',
  'CRN SEA Export Manifest Service Charges Invoice',
  'CRN SEA Import Manifest Discrepancy Fine Invoice',
  'DA Deposit Forfeiture Demand Notice',
  'Declaration - Short Collection Demand Notice',
  'Departure Permit Invoice',
  'Deposit Claim Receivable - Cash',
  'Deposit Claim Receivable - DA',
  'Deposit Claim Receivable - SG',
  'Deposit Forfeiture Demand Notice',
  'Deposit Receivable Invoice (DIPS)',
  'Document Submission Invoice',
  'Duty Claim Receivable - Cash',
  'Freezone NR Claim Registration Charges Invoice',
  'General Charge Invoice',
];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type Menu     = 'Overview' | 'Accounts' | 'Invoices' | 'Payments';
type InvStep  = 'list' | 'pay' | 'success' | 'receipt';
type AccStep  = 'main' | 'list';
type AccView  = 'list' | 'pay' | 'success';

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
  { label: 'Overview',  Icon: DashboardIcon },
  { label: 'Accounts',  Icon: AccountsIcon  },
  { label: 'Invoices',  Icon: InvoicesIcon  },
  { label: 'Payments',  Icon: PaymentsIcon  },
];

/* ── Shared breadcrumb ──────────────────────────────────────────────────────── */
function Breadcrumb({ onBack, extra }: { onBack: () => void; extra?: string }) {
  return (
    <div className="flex items-center justify-between mt-[16px] mb-[8px]">
      <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
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
      <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
        AE-1019056- Dubai Customs - Test LLC
      </div>
    </div>
  );
}

/* ── Receipt modal (Bill Payment Settlement Receipt) ──────────────────────── */
function ReceiptModal({ onClose, rows }: { onClose: () => void; rows: typeof PAYMENT_ROWS[0]['details'] }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[12px] overflow-hidden w-[1100px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0e1b3d' }}>
          <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Bill Payment Settlement Receipt</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Business Details */}
          <div className="bg-[#f5f8ff] rounded-[8px] border border-[#e0e8f5] p-4 grid grid-cols-4 gap-4">
            {[
              ['Business Name', 'crnuser01'],
              ['Business Code', 'AE-1051144'],
              ['Date', '10-06-2026'],
              ['Receipt No.', 'Z-12645'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Bill Details */}
          <div>
            <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Bill Details</p>
            <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Payment Type', 'Invoice / Account No.', 'Receipt No.', 'Amount', 'Status', 'Remarks'].map((h, i) => (
                      <th key={h} style={{
                        background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500,
                        paddingLeft: i === 0 ? 20 : 12,
                      }}>
                        <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '13px 12px', paddingLeft: 20, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.invoiceNo}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.receiptNo || '—'}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{r.amount}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[16px] font-semibold whitespace-nowrap"
                          style={{ background: r.status === 'Success' ? 'rgba(40,167,69,0.12)' : 'rgba(192,57,43,0.10)', color: r.status === 'Success' ? '#28a745' : '#c0392b' }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle', maxWidth: 260 }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.remarks || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Details */}
          <div>
            <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Settlement Details</p>
            <div className="rounded-[12px] border border-[#e0e8f5] p-5" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
              <div className="grid grid-cols-5 gap-x-6 gap-y-5">
                {[
                  ['Payment Method',            'Credit Card'],
                  ['Transaction No.',           '13133'],
                  ['Transaction Date',          '10-06-2026'],
                  ['E-Payment Transaction No.', '20021737'],
                  ['Amount',                    '5,540.00'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                    <p className="text-[16px] font-semibold text-[#0e1b3d] flex items-center gap-[3px]" style={{ fontFamily: font }}>
                      {label === 'Amount' && <DirhamIcon size={13} color="#0e1b3d" />}{value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[13px] text-[#697498] text-center italic" style={{ fontFamily: font }}>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Transaction Details modal ──────────────────────────────────────── */
function TransactionModal({ row, onClose }: { row: typeof PAYMENT_ROWS[0]; onClose: () => void }) {
  const isSuccess = row.status === 'Success';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[8px] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl" style={{ width: 1100 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6" style={{ background: '#0e1b3d', height: 65 }}>
          <span className="text-white text-[20px] font-semibold" style={{ fontFamily: font }}>Payment Transaction Details</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {/* Transaction Details Card */}
          <div className="rounded-[8px] border border-[#d5ddfb] p-5 mb-5" style={{ background: 'white' }}>
            <div className="grid grid-cols-4 gap-x-8 gap-y-4">
              {[
                ['Transaction No.',         row.txNo,          'Transaction Date',     row.txDateFull],
                ['DEG Transaction No.',     row.degTx,         'DEG Transaction Date', row.txDate],
                ['EPayment Transaction No', row.ePayTx,        'Initiated Date',       row.initiatedDate],
                ['Initiated By',            row.initiatedBy,   'Status',               row.status],
                ['Payment Mode',            row.mode,          '',                     ''],
              ].flatMap(([l1, v1, l2, v2]) => [
                <div key={l1}>
                  <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{l1}</span>
                  <p className="text-[16px] font-semibold text-[#0e1b3d] mt-[2px]" style={{ fontFamily: font }}>{v1}</p>
                </div>,
                <div key={l2 || '_empty'}>
                  {l2 && <>
                    <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{l2}</span>
                    <p className={`text-[16px] font-semibold mt-[2px] ${l2 === 'Status' ? (isSuccess ? 'text-[#28a745]' : 'text-[#dc3545]') : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{v2}</p>
                  </>}
                </div>,
              ])}
            </div>
            {/* Message */}
            <div className="mt-4 pt-4 border-t border-[#d5ddfb]">
              <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Message</span>
              <p className="text-[16px] text-[#1360d2] mt-1" style={{ fontFamily: font }}>{row.payMsg}</p>
              {row.colMsg && <p className="text-[16px] text-[#dc3545] mt-1 font-medium" style={{ fontFamily: font }}>{row.colMsg}</p>}
            </div>
          </div>

          {/* Payment Details Table */}
          <p className="text-[#0e1b3d] text-[20px] font-bold mb-3" style={{ fontFamily: font }}>Payment Details</p>
          <div className="rounded-[8px] border border-[#d5ddfb] overflow-hidden">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
              <thead>
                <tr>
                  {['Payment Type', 'Invoice / Account No.', 'Amount (AED)', 'Receipt No.', 'Remarks', 'Status'].map((h, i, arr) => (
                    <th key={h} style={{
                      background: '#a6c2e9', padding: '11px 14px', textAlign: 'left', fontWeight: 500,
                      borderTopLeftRadius: i === 0 ? 8 : 0,
                      borderTopRightRadius: i === arr.length - 1 ? 8 : 0,
                    }}>
                      <span className="text-[15px] font-medium text-[#051937]">{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row.details.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e8eef8' }}>
                    <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.type}</td>
                    <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.invoiceNo}</td>
                    <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={13} color="#0e1b3d" />&nbsp;{d.amount}</td>
                    <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.receiptNo}</td>
                    <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.remarks}</td>
                    <td className="py-3 px-[14px] text-[16px]">
                      <span className={`font-medium ${d.status === 'Success' ? 'text-[#28a745]' : d.status === 'Unpaid' ? 'text-[#dc3545]' : 'text-[#1360d2]'}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => window.print()}
              className="px-8 py-2 rounded text-[16px] text-white"
              style={{ background: '#1360d2', fontFamily: font, minWidth: 140 }}
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 rounded text-[16px]"
              style={{ border: '1px solid #1360d2', color: '#1360d2', background: 'white', fontFamily: font, minWidth: 140 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Floating-label helpers (matches Cargo Transfer module) ─────────────── */
function floatLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute',
    left: 12,
    top: active ? 0 : '50%',
    transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: '#0e1b3d',
    background: active ? 'white' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none',
    transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
    fontFamily: font,
    whiteSpace: 'nowrap',
    zIndex: 1,
  };
}

function FloatInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }}
      />
      <span style={floatLabel(active, focused)}>{label}</span>
    </div>
  );
}

function FloatDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, colorScheme: 'light' }}
      />
      <span style={floatLabel(true, focused)}>{label}</span>
    </div>
  );
}

function FloatDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = open || focused || value !== '';
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setFocused(true); }}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d] focus:outline-none bg-white text-left"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}
      >
        <span className="flex-1 truncate">{value}</span>
        <svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={floatLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          <button onClick={() => { onChange(''); setOpen(false); setFocused(false); }}
            className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
            style={{ color: value === '' ? '#1360d2' : '#697498', fontFamily: font }}>All</button>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); setFocused(false); }}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === value ? 500 : 400 }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── E-Payment confirmation popup (Figma 2650:42899) ─────────────────────── */
function EPayConfirmModal({ amount, count, onConfirm, onClose }: { amount: string; count: number; onConfirm: () => void; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.50)' }} onClick={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col" style={{ width: 868, maxWidth: '94vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.22)' }} onClick={e => e.stopPropagation()}>
        {/* Dark navy header */}
        <div className="flex items-center px-[20px]" style={{ background: '#0e1b3d', height: 65 }}>
          <span className="text-[20px] font-medium text-white" style={{ fontFamily: font }}>Bill Payment Confirmation</span>
        </div>
        {/* Body */}
        <div className="px-[40px] py-[48px]">
          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: font, lineHeight: 1.55 }}>
            By clicking the confirm button, you are authorizing us to redirect your request for payment of{' '}
            <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>{count} account(s)</span>
            {' '}of total{' '}
            <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>AED {amount}</span>
            {' '}through Dubai E-Government payment site
          </p>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-center gap-[12px] pb-[32px]">
          <button
            onClick={onClose}
            className="h-[48px] px-[20px] rounded-[3px] border text-[16px] flex items-center justify-center"
            style={{ background: 'white', border: '1px solid #1360d2', color: '#1360d2', fontFamily: font, width: 163 }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onConfirm(); }}
            className="h-[48px] px-[20px] rounded-[3px] text-[16px] text-white flex items-center justify-center hover:opacity-90"
            style={{ background: '#1360d2', fontFamily: font, width: 163 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Date Filter Card (above every table, matching Integrated Clearance) ─── */
function DateFilterCard({ from, to }: { from?: string; to?: string }) {
  return (
    <div className="flex items-center mb-[14px]">
      <div
        className="inline-flex items-center gap-[8px] h-[38px] px-[16px] rounded-[8px] border border-[#d5ddfb] bg-white text-[13px] text-[#0e1b3d]"
        style={{ fontFamily: "'Dubai', sans-serif" }}
      >
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.6">
          <rect x="3" y="4" width="14" height="13" rx="2" />
          <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
        <span>Status as {from || '01-Jan-26'} to {to || '14-Jun-26'}</span>
        <button className="text-[#1360d2] font-medium hover:opacity-70 ml-[2px]">Modify</button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function BillPaymentPage({ onBack }: { onBack: () => void }) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu]         = useState<Menu>('Overview');
  const [step, setStep]                     = useState<InvStep>('list');
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedRows, setSelectedRows]     = useState<Set<number>>(new Set());
  const [openFlyout, setOpenFlyout]         = useState<number | null>(null);
  const [recheckOpen, setRecheckOpen]       = useState(false);
  const [recheckIdx, setRecheckIdx]         = useState(0);
  const [paymentMethod, setPaymentMethod]   = useState<'epayment' | 'debit'>('epayment');
  const [showReceipt, setShowReceipt]             = useState(false);
  const [showAccReceipt, setShowAccReceipt]       = useState(false);
  const [showEPayConfirm, setShowEPayConfirm]     = useState(false);
  const [showAccEPayConfirm, setShowAccEPayConfirm] = useState(false);
  const [searchType, setSearchType]         = useState('Invoice Number');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchValue, setSearchValue]       = useState('');
  const [invPage, setInvPage]               = useState(1);
  const [payPage, setPayPage]               = useState(1);
  const PAGE_SIZE = 8;

  /* Account list / pay / success state */
  const [accView, setAccView]           = useState<AccView>('list');
  const [accPage, setAccPage]           = useState(1);
  const [selectedAccs, setSelectedAccs] = useState<Set<number>>(new Set());
  const [accPayAmounts, setAccPayAmounts] = useState<Record<number, string>>({});
  const [accPayMethod, setAccPayMethod] = useState<'epayment' | 'debit'>('epayment');
  const [accDebitAcc,  setAccDebitAcc]  = useState('');
  const [accDebitOpen, setAccDebitOpen] = useState(false);
  const [showAccInsufficient, setShowAccInsufficient] = useState(false);
  const accDebitRef = useRef<HTMLDivElement>(null);

  /* Account statement form state */
  const [accStep, setAccStep]           = useState<AccStep>('main');
  const [stmtType, setStmtType]         = useState<'summary' | 'detailed' | 'transaction'>('summary');
  const [stmtYear, setStmtYear]         = useState('2026');
  const [stmtMonth, setStmtMonth]       = useState('May');
  const [stmtFromDate, setStmtFromDate] = useState('09-06-2026');
  const [stmtToDate, setStmtToDate]     = useState('10-06-2026');
  const [downloadFmt, setDownloadFmt]   = useState('');

  /* Advanced filter fields */
  const [fFromDate,  setFFromDate]  = useState('');
  const [fToDate,    setFToDate]    = useState('');
  const [fSource,    setFSource]    = useState('');
  const [fInvType,   setFInvType]   = useState('');
  const [fStatus,    setFStatus]    = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [payStatusFilter, setPayStatusFilter] = useState('');

  /* Account & Payment bottom-bar search */
  const [accSearchType, setAccSearchType]         = useState('Account Number');
  const [accSearchTypeOpen, setAccSearchTypeOpen] = useState(false);
  const [accSearchValue, setAccSearchValue]       = useState('');
  const [accTypeFilter, setAccTypeFilter]         = useState('All');
  const [paySearchType, setPaySearchType]         = useState('Transaction No.');
  const [paySearchTypeOpen, setPaySearchTypeOpen] = useState(false);
  const [paySearchValue, setPaySearchValue]       = useState('');
  const [bottomStDateOpen, setBottomStDateOpen]   = useState(false);
  const [showStmtModal, setShowStmtModal]     = useState(false);
  const [payAdvFilters, setPayAdvFilters]     = useState(false);
  const [accAdvFilters, setAccAdvFilters]     = useState(false);
  const [accTypeOpen, setAccTypeOpen]         = useState(false);

  const [payStatusOpen,   setPayStatusOpen]   = useState(false);
  const [invPayDetails,   setInvPayDetails]   = useState<typeof PAYMENT_ROWS[0] | null>(null);
  const [payFromDate, setPayFromDate] = useState('09-06-2026');
  const [payToDate,   setPayToDate]   = useState('10-06-2026');
  const [expandedPayRow, setExpandedPayRow] = useState<number | null>(null);


  const flyoutRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openFlyout === null) return;
    const h = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [openFlyout]);

  useEffect(() => {
    if (!accDebitOpen) return;
    const h = (e: MouseEvent) => {
      if (accDebitRef.current && !accDebitRef.current.contains(e.target as Node)) setAccDebitOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [accDebitOpen]);

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
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra={selectedList.length === 1 ? `Pay - ${selectedList[0].number}` : 'Pay - Multiple Invoices'} />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>
              {selectedList.length === 1 ? `Pay - ${selectedList[0].number}` : 'Pay - Multiple Invoices'}
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10" style={{ paddingBottom: 80 }}>

            {/* Selected invoices card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]" style={{ background: '#f5f8ff' }}>
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Details</span>
                <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                  {selectedList.length} invoice{selectedList.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Payment Type</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Invoice No.</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Invoice Amount (AED)</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Settled Amount (AED)</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Amount (AED)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedList.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{row.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{row.number}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.settled}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>AED</span>
                          <input
                            defaultValue={row.balance}
                            className="w-[120px] text-right px-3 py-2 border border-[#d5ddfb] rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                            style={{ fontFamily: font }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-[#e0e8f5] flex items-center justify-between" style={{ background: '#f5f8ff', fontFamily: font }}>
                <span className="text-[16px] text-[#697498]">Total Selected Transactions: {selectedList.length}</span>
                <span className="text-[16px] font-bold text-[#0e1b3d] flex items-center gap-[4px]">Total <DirhamIcon size={14} color="#0e1b3d" /> {totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment Method card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] p-6 mb-4"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <p className="text-[16px] font-semibold text-[#0e1b3d] mb-1" style={{ fontFamily: font }}>Payment Method</p>
              <p className="text-[16px] text-[#697498] mb-5" style={{ fontFamily: font }}>
                Note* Card payment has maximum limit of AED 1,000,000.00
              </p>
              <div className="flex items-center gap-8 flex-wrap">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="pm" checked={paymentMethod === 'epayment'} onChange={() => setPaymentMethod('epayment')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>E-Payment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="pm" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Debit A/C</span>
                </label>
                {paymentMethod === 'debit' && (
                  <select
                    className="border border-[#d5ddfb] rounded-[4px] px-4 py-2 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                    style={{ fontFamily: font, minWidth: 360 }}
                  >
                    <option>1050084 - XCRN BUSINESS NEW01 (BAL. AED 14539.00)</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Bottom floating bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 border-t border-[#d5ddfb] bg-white"
            style={{ height: 68, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setStep('list')}
              className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
              Back
            </button>
            <button
              onClick={() => setShowEPayConfirm(true)}
              className="h-[44px] px-10 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
              </svg>
              Proceed to Pay
            </button>
          </div>
        </div>
        {showEPayConfirm && (
          <EPayConfirmModal
            amount={totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            count={selectedRows.size}
            onConfirm={() => setStep('success')}
            onClose={() => setShowEPayConfirm(false)}
          />
        )}
      </div>
    );
  }

  /* ── Success / Transaction Details screen ───────────────────────────────── */
  if (step === 'success') {
    const tx = PAYMENT_ROWS[1];
    const detailRows = selectedList.length > 0
      ? selectedList.map((r, i) => ({ type: r.type, invoiceNo: r.number, amount: r.balance, receiptNo: `Z-${12645 + i}`, remarks: `M1CS 1927055; BPS Transaction for ECM-${r.number}`, status: 'Success' }))
      : tx.details;

    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Payment Confirmation" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Payment Confirmation</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10 pb-10">

            {/* Merged card — green tick + transaction details */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              {/* Green tick + success text */}
              <div className="flex flex-col items-center py-8 border-b border-[#e0e8f5]">
                <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full mb-4"
                  style={{ background: '#34a853' }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[24px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                  Invoice payment has been processed successfully.
                </p>
              </div>

              {/* Detail grid */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-5 gap-x-4 gap-y-6">
                  {[
                    ['Transaction No.',          '13133'],
                    ['Transaction Date',         '10-06-2026'],
                    ['DEG Transaction No.',      '590000237262582'],
                    ['DEG Transaction Date',     '10-06-2026 11:47:57'],
                    ['EPayment Transaction No.', '20021737'],
                    ['Initiated Date',           '10-06-2026 11:48:00'],
                    ['Initiated By',             'crnuser01'],
                    ['Payment Mode',             'Credit Card'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[4px]" style={{ fontFamily: font }}>{label}</p>
                      <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Message row */}
                <div className="mt-6 pt-5 border-t border-[#f0f4ff]">
                  <p className="text-[16px] text-[#697498] mb-[6px]" style={{ fontFamily: font }}>Message</p>
                  <p className="text-[16px] text-[#1360d2] mb-1" style={{ fontFamily: font }}>
                    Payment Status Remarks: Paid
                  </p>
                  <p className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>
                    Collection Status Remarks: Transaction has been processed successfully.
                  </p>
                </div>
              </div>
            </div>

            {/* Center-aligned action buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setInvPayDetails(tx)}
                className="h-[44px] px-8 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                View Payment Details
              </button>
              <button
                onClick={() => setShowReceipt(true)}
                className="h-[44px] px-8 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                View &amp; Print Receipt
              </button>
              <button
                onClick={() => { setStep('list'); setSelectedRows(new Set()); }}
                className="h-[44px] px-8 rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff] transition-colors"
                style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font }}
              >
                Back to Listing
              </button>
            </div>
          </div>
        </div>

        {showReceipt && (
          <ReceiptModal
            onClose={() => setShowReceipt(false)}
            rows={detailRows}
          />
        )}
        {invPayDetails && <TransactionModal row={invPayDetails} onClose={() => setInvPayDetails(null)} />}
      </div>
    );
  }

  /* ── Account Pay screen ─────────────────────────────────────────────────── */
  const selectedAccsList = Array.from(selectedAccs).sort((a, b) => a - b).map(idx => ({ idx, acc: ALL_ACCOUNTS[idx] }));
  const firstSelAcc = selectedAccsList.length > 0 ? selectedAccsList[0].idx : null;
  const selAccRow = firstSelAcc !== null ? ALL_ACCOUNTS[firstSelAcc] : null;
  const totalAccPayAmount = selectedAccsList.reduce((s, { idx }) => s + parseFloat(accPayAmounts[idx] || '0'), 0);
  /* ── Accounts Pay screen ────────────────────────────────────────────────── */
  if (activeMenu === 'Accounts' && accView === 'pay' && selAccRow) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Pay - Accounts" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Pay - Accounts</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10" style={{ paddingBottom: 80 }}>

            {/* Payment Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]" style={{ background: '#f5f8ff' }}>
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Details</span>
                <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{selectedAccsList.length} account{selectedAccsList.length !== 1 ? 's' : ''} selected</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Payment Type</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Account Number</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Amount Due (AED)</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Pay Amount (AED)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccsList.map(({ idx, acc }) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{acc.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{acc.account}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#dc3545] flex items-center gap-[4px]" style={{ fontFamily: font }}>
                          <DirhamIcon size={13} color="#dc3545" />{acc.amountDue}
                        </span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div className="flex items-center justify-end gap-2">
                          <DirhamIcon size={14} color="#697498" />
                          <input
                            value={accPayAmounts[idx] ?? ''}
                            onChange={e => setAccPayAmounts(prev => ({ ...prev, [idx]: e.target.value }))}
                            placeholder="0.00"
                            className="w-[130px] text-right px-3 py-2 border border-[#d5ddfb] rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                            style={{ fontFamily: font }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-[#e0e8f5] flex items-center justify-between" style={{ background: '#f5f8ff', fontFamily: font }}>
                <span className="text-[16px] text-[#697498]">Total Selected Accounts: {selectedAccsList.length}</span>
                <span className="text-[16px] font-bold text-[#0e1b3d] flex items-center gap-[4px]">Total <DirhamIcon size={14} color="#0e1b3d" /> {totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment Method card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] p-6 mb-4"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <p className="text-[16px] font-semibold text-[#0e1b3d] mb-1" style={{ fontFamily: font }}>Payment Method</p>
              <p className="text-[16px] text-[#697498] mb-5" style={{ fontFamily: font }}>
                Note* Card payment has maximum limit of AED 1,000,000.00
              </p>
              <div className="flex items-center gap-8 flex-wrap">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="acc-pm" checked={accPayMethod === 'epayment'} onChange={() => setAccPayMethod('epayment')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>E-Payment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="acc-pm" checked={accPayMethod === 'debit'} onChange={() => setAccPayMethod('debit')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Debit A/C</span>
                </label>
                {accPayMethod === 'debit' && (
                  <div ref={accDebitRef} className="relative" style={{ minWidth: 380 }}>
                    <button type="button" onClick={() => setAccDebitOpen(o => !o)}
                      className="flex items-center justify-between w-full bg-white border rounded-[4px] px-[14px] cursor-pointer hover:border-[#1360d2] transition-colors"
                      style={{ height: 44, borderColor: accDebitOpen ? '#1360d2' : '#d5ddfb' }}>
                      <span className="text-[16px] font-medium whitespace-nowrap truncate" style={{ color: accDebitAcc ? '#0e1b3d' : '#697498', fontFamily: font }}>
                        {accDebitAcc
                          ? (() => { const o = DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc); return o ? `${o.label} (BAL. AED ${o.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})` : accDebitAcc; })()
                          : 'Select Debit Account'}
                      </span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2"
                        style={{ flexShrink: 0, transform: accDebitOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {accDebitOpen && (
                      <div className="absolute left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden z-[80]"
                        style={{ top: 48, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {DEBIT_PAY_OPTIONS.map(opt => (
                          <button key={opt.value} type="button"
                            onClick={() => { setAccDebitAcc(opt.value); setAccDebitOpen(false); }}
                            className="w-full px-[14px] py-[11px] text-left hover:bg-[#f0f4ff] transition-colors flex items-center justify-between"
                            style={{ background: accDebitAcc === opt.value ? '#e8f0ff' : undefined }}>
                            <span className="text-[15px]" style={{ fontFamily: font, color: accDebitAcc === opt.value ? '#1360d2' : '#0e1b3d', fontWeight: accDebitAcc === opt.value ? 500 : 400 }}>
                              {opt.label}
                            </span>
                            <span className="text-[13px] text-[#697498] whitespace-nowrap ml-4" style={{ fontFamily: font }}>
                              BAL. AED {opt.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom floating bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 border-t border-[#d5ddfb] bg-white"
            style={{ height: 68, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setAccView('list')}
              className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
              Back
            </button>
            <button
              onClick={() => {
                if (accPayMethod === 'debit') {
                  const opt = DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc);
                  if (!opt || opt.balance < totalAccPayAmount) { setShowAccInsufficient(true); return; }
                }
                setShowAccEPayConfirm(true);
              }}
              className="h-[44px] px-8 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
              </svg>
              Proceed to Pay
            </button>
          </div>
        </div>
        {showAccEPayConfirm && (
          <EPayConfirmModal
            amount={totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            count={selectedAccsList.length}
            onConfirm={() => setAccView('success')}
            onClose={() => setShowAccEPayConfirm(false)}
          />
        )}
        {showAccInsufficient && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.45)' }}>
            <div className="bg-white rounded-[12px] shadow-xl p-[32px] w-full max-w-[420px] flex flex-col items-center gap-[20px]">
              <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: 'rgba(220,53,69,0.10)' }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#dc3545" strokeWidth="1.8">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinejoin="round" />
                  <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[20px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Insufficient Balance</p>
              <p className="text-[15px] text-[#455174] text-center" style={{ fontFamily: font }}>
                The selected account <strong>{DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc)?.label ?? accDebitAcc}</strong> does not have sufficient balance to complete this payment of <strong>AED {totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
              </p>
              <div className="flex gap-[12px] w-full">
                <button onClick={() => setShowAccInsufficient(false)}
                  className="flex-1 h-[44px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                  style={{ fontFamily: font }}>Go Back</button>
                <button onClick={() => setShowAccInsufficient(false)}
                  className="flex-1 h-[44px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#1360d2', fontFamily: font }}>Top Up Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Accounts Payment Confirmation screen ────────────────────────────────── */
  if (activeMenu === 'Accounts' && accView === 'success' && selAccRow) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Payment Confirmation" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Payment Confirmation</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10" style={{ paddingBottom: 80 }}>

            {/* Green success banner card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] flex flex-col items-center py-8 mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full mb-4"
                style={{ background: '#34a853' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[24px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                Payment has been processed successfully.
              </p>
            </div>

            {/* Payment Transaction Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]">
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Transaction Details</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-[16px] font-semibold"
                  style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745', fontFamily: font }}>
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#28a745" strokeWidth="2">
                    <circle cx="10" cy="10" r="8" /><path d="M6 10l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Success
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  {[
                    ['Transaction No.',          '13137'],
                    ['Transaction Date',         '10-06-2026'],
                    ['Status',                   'Success'],
                    ['DEG Transaction No.',      '590000237262664'],
                    ['DEG Transaction Date',     '10-06-2026 12:00:02'],
                    ['EPayment Transaction No.', '20021739'],
                    ['Initiated Date',           '10-06-2026 12:00:00'],
                    ['Initiated By',             'crnuser01'],
                    ['Payment Mode',             'Credit Card'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[4px]" style={{ fontFamily: font }}>{label}</p>
                      <p className={`text-[16px] font-semibold ${label === 'Status' ? 'text-[#28a745]' : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#f0f4ff]">
                  <p className="text-[16px] text-[#697498] mb-[6px]" style={{ fontFamily: font }}>Message</p>
                  <p className="text-[16px] text-[#1360d2] mb-1" style={{ fontFamily: font }}>Payment Status Remarks: Success</p>
                  <p className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>
                    Collection Status Remarks: Transaction has been processed successfully.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="px-6 py-4 border-b border-[#e0e8f5]">
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Details</span>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                  <thead>
                    <tr>
                      {['Payment Type', 'Account No.', 'Amount', 'Receipt No.', 'Remarks', 'Status'].map((h, i) => (
                        <th key={h} style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500, paddingLeft: i === 0 ? 24 : 12 }}>
                          <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccsList.map(({ idx, acc }, i) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f4ff' }}>
                        <td style={{ background: '#fff', padding: '14px 16px', paddingLeft: 24, verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{acc.type}</span>
                        </td>
                        <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{acc.account}</span>
                        </td>
                        <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{accPayAmounts[idx] || '0.00'}</span>
                        </td>
                        <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d]">Z-{12648 + i}</span>
                        </td>
                        <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle', maxWidth: 260 }}>
                          <span className="text-[16px] text-[#697498]">M1CS 1927058; BPS Transaction for DDR-{acc.account.split(' - ')[0]}</span>
                        </td>
                        <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-semibold whitespace-nowrap"
                            style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745' }}>Success</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom floating bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 border-t border-[#d5ddfb] bg-white"
            style={{ height: 68, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => { setAccView('list'); setSelectedAccs(new Set()); setAccPayAmounts({}); }}
              className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
              Back to Listing
            </button>
            <button
              onClick={() => setShowAccReceipt(true)}
              className="h-[44px] px-6 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              View &amp; Print Receipt
            </button>
          </div>
        </div>

        {/* Account Receipt Modal */}
        {showAccReceipt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
            <div className="bg-white rounded-[12px] overflow-hidden w-[1100px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0e1b3d' }}>
                <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Bill Payment Settlement Receipt</span>
                <button onClick={() => setShowAccReceipt(false)} className="text-white hover:opacity-70 transition-opacity">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">

                {/* Business Details — 4-column grid */}
                <div className="bg-[#f5f8ff] rounded-[8px] border border-[#e0e8f5] p-4 grid grid-cols-4 gap-4">
                  {[
                    ['Name',          'crnuser01'],
                    ['Business Code', 'AE-1051144'],
                    ['Date',          '10-06-2026'],
                    ['Receipt No.',   'Z-12648'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                      <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Bill Details — IC-style table */}
                <div>
                  <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Bill Details</p>
                  <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                      <thead>
                        <tr>
                          {['Payment Type', 'Invoice / Account No.', 'Receipt No.', 'Amount', 'Status', 'Remarks'].map((h, i) => (
                            <th key={h} style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500, paddingLeft: i === 0 ? 20 : 12 }}>
                              <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAccsList.map(({ idx, acc }, i) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f0f4ff' }}>
                            <td style={{ background: '#fff', padding: '13px 12px', paddingLeft: 20, verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">{acc.type}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">{acc.account}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">Z-{12648 + i}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{accPayAmounts[idx] || '0.00'}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[16px] font-semibold"
                                style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745' }}>Success</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle', maxWidth: 260 }}>
                              <span className="text-[16px] text-[#0e1b3d]">M1CS 1927058; BPS Transaction for DDR-{acc.account.split(' - ')[0]}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Settlement Details — white card, 4 per row */}
                <div>
                  <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Settlement Details</p>
                  <div className="rounded-[12px] border border-[#e0e8f5] p-5" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
                    <div className="grid grid-cols-5 gap-x-6 gap-y-5">
                      {[
                        ['Payment Method',            accPayMethod === 'debit' ? 'Debit A/C' : 'Credit Card'],
                        ['Transaction No.',           '13137'],
                        ['Transaction Date',          '10-06-2026'],
                        ['E-Payment Transaction No.', '20021739'],
                        ['Amount',                    totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                          <p className="text-[16px] font-semibold text-[#0e1b3d] flex items-center gap-[3px]" style={{ fontFamily: font }}>
                            {label === 'Amount' && <DirhamIcon size={13} color="#0e1b3d" />}{value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[13px] text-[#697498] text-center italic" style={{ fontFamily: font }}>
                </p>

                {/* Footer buttons */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="h-[44px] px-8 rounded-[4px] text-[16px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', fontFamily: font }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" />
                      <rect x="6" y="14" width="12" height="8" rx="1" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => setShowAccReceipt(false)}
                    className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors flex items-center gap-2"
                    style={{ fontFamily: font }}
                  >
                    ✕ Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  /* ── Invoices content ───────────────────────────────────────────────────── */
  const paginatedInv = INVOICE_ROWS.slice((invPage - 1) * PAGE_SIZE, invPage * PAGE_SIZE);

  const InvoicesContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        {/* Advance Filters */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
            showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
          }`}
          style={{ fontFamily: font }}
        >
          Advance Filters
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Quick search */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden relative" style={{ minWidth: 260 }}>
          <button
            type="button"
            onClick={() => setSearchTypeOpen(o => !o)}
            className="flex items-center gap-[5px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer hover:bg-[#f7faff] transition-colors flex-shrink-0"
          >
            <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{searchType}</span>
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {searchTypeOpen && (
            <div className="absolute z-[200] top-[50px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[170px] py-1">
              {['Invoice Type', 'Invoice Number'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setSearchType(opt); setSearchTypeOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
          {searchType === 'Invoice Type' ? (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <select
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="flex-1 text-[16px] text-[#0e1b3d] bg-transparent focus:outline-none min-w-0 border-none appearance-none cursor-pointer"
                style={{ fontFamily: font }}
              >
                <option value="">All types…</option>
                {INVOICE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          ) : (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Invoice no…"
                className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
                style={{ fontFamily: font }}
              />
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#8f94ae" strokeWidth="1.8">
                <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setStatusOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#1360d2] font-medium hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            {fStatus || 'Status'}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {statusOpen && (
            <div className="absolute z-20 top-[52px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[180px] py-1">
              {['All', ...Object.keys(INV_STATUS)].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setFStatus(opt === 'All' ? '' : opt); setStatusOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Proceed to Pay */}
        <button
          disabled={selectedRows.size === 0}
          onClick={() => setStep('pay')}
          className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: selectedRows.size > 0 ? '#1360d2' : '#a6c2e9', fontFamily: font, cursor: selectedRows.size > 0 ? 'pointer' : 'not-allowed' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
          </svg>
          Proceed to Pay{selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
        </button>
      </div>

      {/* Advanced Filters panel */}
      {showFilters && (
        <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[10px]"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 4px 4px 30px 0px' }}>
          {/* Close button */}
          <button onClick={() => setShowFilters(false)}
            className="absolute top-3 right-3 z-10 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <FloatDate label="From Date" value={fFromDate} onChange={setFFromDate} />
            <FloatDate label="To Date"   value={fToDate}   onChange={setFToDate}   />
            <FloatDropdown
              label="Source"
              value={fSource}
              options={['CDR', 'SGRCS', 'SAS', 'CRNS']}
              onChange={setFSource}
            />
            <FloatDropdown
              label="Invoice Type"
              value={fInvType}
              options={INVOICE_TYPES}
              onChange={setFInvType}
            />
          </div>
          <div className="flex items-center gap-4">
            <div style={{ width: 'calc(25% - 12px)' }}>
              <FloatDropdown
                label="Status"
                value={fStatus}
                options={Object.keys(INV_STATUS)}
                onChange={setFStatus}
              />
            </div>
            <button className="h-[56px] px-6 rounded-[4px] text-[16px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font }}>Search</button>
            <button onClick={() => { setFFromDate(''); setFToDate(''); setFSource(''); setFInvType(''); setFStatus(''); }}
              className="h-[56px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] flex-shrink-0" style={{ fontFamily: font }}>Reset</button>
          </div>
        </div>
      )}

      {/* Row 2 — Status As On badge */}
      <div className="flex justify-center mb-[10px]">
        <div className="inline-flex items-center gap-[8px] h-[40px] px-[20px] rounded-[8px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>
          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.6">
            <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
          </svg>
          <span>Status As On 01-Jan-26 To 14-Jun-26</span>
          <button className="text-[#1360d2] font-medium hover:opacity-70 flex items-center gap-1">
            Modify
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.6">
              <path d="M14 3l3 3-10 10H4v-3L14 3z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ position: 'relative' }}>
        <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {/* Checkbox header */}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', width: 44, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingLeft: 16 }}>
                <input type="checkbox" checked={selectedRows.size === INVOICE_ROWS.length} onChange={toggleAll}
                  className="size-4 accent-[#1360d2] cursor-pointer" />
              </th>
              {['Invoice Type', 'Invoice Number', 'Invoice Date', 'Amount (AED)', 'Settled Amount (AED)', 'Balance Amount (AED)', 'Source', 'Payment Mode'].map((h) => (
                <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <span className="text-[16px] font-medium text-[#051937]">{h}</span>
                </th>
              ))}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, minWidth: 160, position: 'sticky', right: 80, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937]">Status</span>
              </th>
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 80, borderTopRightRadius: 8, borderBottomRightRadius: 8, position: 'sticky', right: 0, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedInv.map((row, i) => {
              const absIdx = (invPage - 1) * PAGE_SIZE + i;
              const isSelected = selectedRows.has(absIdx);
              const st = INV_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              const payRow = row.txNo !== '—' ? PAYMENT_ROWS.find(r => r.txNo === row.txNo) : undefined;
              return (
                <tr key={i} className={isSelected ? 'bg-[#dce8f8]' : 'bg-white hover:bg-[#dce8f8]'}>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: '1px solid #f0f4ff' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(absIdx)} className="size-4 accent-[#1360d2] cursor-pointer" />
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', maxWidth: 280 }}>
                    <span className="text-[16px] text-[#0e1b3d]">{row.type}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.number}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.date}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.settled}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.balance}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.source}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.payMode}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', position: 'sticky', right: 80, zIndex: 1, background: isSelected ? '#dce8f8' : 'white' }}>
                    <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                      {row.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right: 0, zIndex: 1, background: isSelected ? '#dce8f8' : 'white' }}>
                    <div className="relative inline-block" ref={openFlyout === absIdx ? flyoutRef : undefined}>
                      <button onClick={() => setOpenFlyout(openFlyout === absIdx ? null : absIdx)}
                        className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                        </svg>
                      </button>
                      {openFlyout === absIdx && (
                        <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                          style={{ ...(i >= paginatedInv.length - 2 ? { bottom: 36 } : { top: 36 }), width: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                          {[
                            'View Payment Details',
                            'Download Invoice',
                            'Initiate Payment',
                            'Recheck',
                            'Payment History',
                            'View & Print Receipt',
                          ].map(item => {
                            const disabled = item === 'View Payment Details' && !payRow;
                            return (
                              <button key={item} disabled={disabled}
                                className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors disabled:opacity-40 disabled:cursor-default"
                                onClick={() => {
                                  if (disabled) return;
                                  setOpenFlyout(null);
                                  if (item === 'Initiate Payment') { setSelectedRows(new Set([absIdx])); setStep('pay'); }
                                  else if (item === 'View Payment Details' && payRow) { setInvPayDetails(payRow); }
                                }}>
                                <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item}</span>
                              </button>
                            );
                          })}
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
      {invPayDetails && <TransactionModal row={invPayDetails} onClose={() => setInvPayDetails(null)} />}
    </div>
  );

  /* ── Payments content ───────────────────────────────────────────────────── */
  const filteredPayments = payStatusFilter ? PAYMENT_ROWS.filter(r => r.status === payStatusFilter) : PAYMENT_ROWS;
  const paginatedPay = filteredPayments.slice((payPage - 1) * PAGE_SIZE, payPage * PAGE_SIZE);

  const PaymentsContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        {/* Advance Filters */}
        <button
          onClick={() => setPayAdvFilters(f => !f)}
          className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
            payAdvFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
          }`}
          style={{ fontFamily: font }}
        >
          Advance Filters
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Quick search */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden relative" style={{ minWidth: 260 }}>
          <button
            type="button"
            onClick={() => setPaySearchTypeOpen(o => !o)}
            className="flex items-center gap-[5px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer hover:bg-[#f7faff] transition-colors flex-shrink-0"
          >
            <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{paySearchType}</span>
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {paySearchTypeOpen && (
            <div className="absolute z-[200] top-[50px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[180px] py-1">
              {['Transaction No.', 'Payment Type'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setPaySearchType(opt); setPaySearchValue(''); setPaySearchTypeOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
          {paySearchType === 'Payment Type' ? (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <select
                value={paySearchValue}
                onChange={e => setPaySearchValue(e.target.value)}
                className="flex-1 text-[16px] text-[#0e1b3d] bg-transparent focus:outline-none min-w-0 border-none appearance-none cursor-pointer"
                style={{ fontFamily: font }}
              >
                <option value="">All types…</option>
                <option>Case Management Demand Notice</option>
                <option>Multiple Bill Settlement</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <input
                type="text"
                value={paySearchValue}
                onChange={e => setPaySearchValue(e.target.value)}
                placeholder="Transaction no…"
                className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
                style={{ fontFamily: font }}
              />
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#8f94ae" strokeWidth="1.8">
                <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative flex-shrink-0">
          <button onClick={() => setPayStatusOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#1360d2] font-medium hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}>
            {payStatusFilter || 'Status'}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {payStatusOpen && (
            <div className="absolute z-20 top-[52px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[160px] py-1">
              {['All', 'Success', 'Initiated'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setPayStatusFilter(opt === 'All' ? '' : opt); setPayStatusOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />
      </div>

      {/* Advance Filters panel */}
      {payAdvFilters && (
        <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[10px]"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 4px 4px 30px 0px' }}>
          {/* Close button */}
          <button onClick={() => setPayAdvFilters(false)}
            className="absolute top-3 right-3 z-10 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          {/* Row 1: 4 fields */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <FloatDropdown
              label="Payment Type"
              value={paySearchType === 'Payment Type' ? paySearchValue : ''}
              options={['Case Management Demand Notice', 'Multiple Bill Settlement']}
              onChange={v => { setPaySearchType('Payment Type'); setPaySearchValue(v); }}
            />
            <FloatInput
              label="Invoice / Account No."
              value={paySearchType === 'Transaction No.' ? paySearchValue : ''}
              onChange={v => { setPaySearchType('Transaction No.'); setPaySearchValue(v); }}
            />
            <FloatDate label="From Date" value={payFromDate} onChange={setPayFromDate} />
            <FloatDate label="To Date"   value={payToDate}   onChange={setPayToDate}   />
          </div>
          {/* Row 2: 1 field + buttons */}
          <div className="flex items-center gap-4">
            <div style={{ width: 'calc(25% - 12px)' }}>
              <FloatDropdown
                label="Status"
                value={payStatusFilter}
                options={['Success', 'Initiated']}
                onChange={setPayStatusFilter}
              />
            </div>
            <button className="h-[56px] px-6 rounded-[4px] text-[16px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font }}>Search</button>
            <button onClick={() => { setPayFromDate('09-06-2026'); setPayToDate('10-06-2026'); setPayStatusFilter(''); setPaySearchValue(''); }}
              className="h-[56px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] flex-shrink-0" style={{ fontFamily: font }}>Reset</button>
          </div>
        </div>
      )}

      {/* Row 2 — Status As On badge */}
      <div className="flex justify-center mb-[10px]">
        <div className="inline-flex items-center gap-[8px] h-[40px] px-[20px] rounded-[8px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>
          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.6">
            <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
          </svg>
          <span>Status As On {payFromDate} To {payToDate}</span>
          <button className="text-[#1360d2] font-medium hover:opacity-70 flex items-center gap-1">
            Modify
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.6">
              <path d="M14 3l3 3-10 10H4v-3L14 3z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Payments table */}
      <div className="overflow-x-auto" style={{ position: 'relative' }}>
        <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {[
                ['Payment Type',          'left'  ],
                ['Transaction No.',       'left'  ],
                ['Transaction Date',      'left'  ],
                ['Invoice / Account No.', 'left'  ],
                ['Amount (AED)',          'left'  ],
              ].map(([label, align], i) => (
                <th key={label as string} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: align as 'left' | 'right', fontWeight: 500, borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0, paddingLeft: i === 0 ? 16 : 12 }}>
                  <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{label}</span>
                </th>
              ))}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, minWidth: 140, position: 'sticky', right: 100, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">Status</span>
              </th>
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 100, borderTopRightRadius: 8, borderBottomRightRadius: 8, position: 'sticky', right: 0, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPay.map((row, i) => {
              const absIdx = (payPage - 1) * PAGE_SIZE + i;
              const st = PAY_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              const isMultiple = row.type === 'Multiple Bill Settlement';
              const isExpanded = expandedPayRow === absIdx;
              return (
                <React.Fragment key={i}>
                  {/* Parent row — click anywhere except actions to expand */}
                  <tr
                    className={isExpanded ? 'bg-[#dce8f8]' : 'bg-white hover:bg-[#dce8f8]'}
                    style={{ cursor: isMultiple ? 'pointer' : 'default', outline: openFlyout === absIdx + 100 ? '2px solid #93c5fd' : 'none', outlineOffset: '-2px' }}
                    onClick={isMultiple ? () => setExpandedPayRow(isExpanded ? null : absIdx) : undefined}
                  >
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.type}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.txNo}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.txDate}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.invoiceNo || '—'}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff', position: 'sticky', right: 100, zIndex: 1, background: isExpanded ? '#dce8f8' : 'white' }}>
                      <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color }}>
                        {row.status}
                      </span>
                    </td>
                    {/* Actions: expand chevron (Multiple only) + three-dot menu */}
                    <td style={{ padding: '0 8px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right: 0, zIndex: 1, background: isExpanded ? '#dce8f8' : 'white' }} onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-[2px]">
                        {/* Three-dot menu */}
                        <div className="relative inline-block" ref={openFlyout === absIdx + 100 ? flyoutRef : undefined}>
                          <button onClick={() => setOpenFlyout(openFlyout === absIdx + 100 ? null : absIdx + 100)}
                            className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                              <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                            </svg>
                          </button>
                          {openFlyout === absIdx + 100 && (
                            <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                              style={{ ...(i >= paginatedPay.length - 2 ? { bottom: 36 } : { top: 36 }), width: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                              {['View Payment Details', 'View & Download Receipt', 'Make Payment', 'Recheck', 'Payment History'].map(item => (
                                <button key={item} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                  onClick={() => {
                                    setOpenFlyout(null);
                                    if (item === 'View Payment Details') { setInvPayDetails(row); }
                                    else if (item === 'Make Payment') { setActiveMenu('Invoices'); }
                                    else if (item === 'Recheck') { setRecheckIdx(absIdx); setRecheckOpen(true); }
                                    else if (item === 'Payment History') { setActiveMenu('Payments'); }
                                  }}>
                                  <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Expand/collapse chevron — only for Multiple Bill Settlement, placed after three-dot */}
                        {isMultiple && (
                          <button
                            onClick={() => setExpandedPayRow(isExpanded ? null : absIdx)}
                            className="flex items-center justify-center transition-colors"
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            {/* Figma u_angle-right icon — rotates 180° when expanded */}
                            <svg width="28" height="28" viewBox="0 0 49 49" fill="none"
                              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.10))' }}>
                              <rect width="24" height="24" rx="12" transform="matrix(-4.37114e-08 1 1 4.37114e-08 12.18 12.19)" fill="white"/>
                              <path d="M23.47 27.02L19.23 22.78a1.87 1.87 0 010-2.85c.38-.38.89-.59 1.41-.59s1.03.21 1.41.59l3.54 3.54 3.54-3.54c.38-.38.89-.59 1.41-.59s1.03.21 1.41.59c.19.19.33.41.43.65.1.24.15.49.15.74s-.05.5-.15.73c-.1.24-.24.46-.43.65l-4.24 4.24a1.87 1.87 0 01-2.83 0z" fill="#8F94AE"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Inner rows — rendered as sibling <tr>s in the same tbody, aligned to parent columns */}
                  {isMultiple && isExpanded && row.details.map((d, di) => {
                    const dst = PAY_STATUS[d.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                    const innerFlyoutKey = absIdx * 1000 + di + 5000;
                    const isLastDetail = di === row.details.length - 1;
                    return (
                      <tr key={`detail-${di}`} style={{ background: '#dce8f8' }}>
                        {/* Col 1: Serial no. + Invoice Type (indented) */}
                        <td style={{ padding: '0 12px 0 32px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <div className="flex items-center gap-[10px]">
                            <span className="inline-flex items-center justify-center size-[22px] rounded-full text-[12px] font-bold flex-shrink-0" style={{ background: '#1360d2', color: '#fff', fontFamily: font }}>{di + 1}</span>
                            <span className="text-[16px] text-[#0e1b3d]">{d.type}</span>
                          </div>
                        </td>
                        {/* Col 2: Transaction No. — blank (no tx column in inner rows) */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#697498]">—</span>
                        </td>
                        {/* Col 3: Transaction Date */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.txDate}</span>
                        </td>
                        {/* Col 4: Invoice No. */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{d.invoiceNo}</span>
                        </td>
                        {/* Col 5: Amount */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{d.amount}</span>
                        </td>
                        {/* Col 6: Status */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: dst.bg, color: dst.color }}>{d.status}</span>
                        </td>
                        {/* Col 7: Actions — three dots for download */}
                        <td style={{ padding: '0 8px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8', textAlign: 'center' }}>
                          <div className="flex items-center justify-center">
                            <div className="relative inline-block" ref={openFlyout === innerFlyoutKey ? flyoutRef : undefined}>
                              <button onClick={() => setOpenFlyout(openFlyout === innerFlyoutKey ? null : innerFlyoutKey)}
                                className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#dce8f8] transition-colors">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                                  <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                                </svg>
                              </button>
                              {openFlyout === innerFlyoutKey && (
                                <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                                  style={{ top: 36, width: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                                  {['View Details', 'Download Receipt'].map(item => (
                                    <button key={item} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                      onClick={() => {
                                        setOpenFlyout(null);
                                        if (item === 'View Details') { setInvPayDetails(row); }
                                      }}>
                                      <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
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
  const filteredAccounts = accTypeFilter === 'All' ? ALL_ACCOUNTS : ALL_ACCOUNTS.filter(a => a.type === accTypeFilter);
  const totalAccPages    = Math.ceil(filteredAccounts.length / ACC_PAGE_SIZE);
  const paginatedAcc     = filteredAccounts.slice((accPage - 1) * ACC_PAGE_SIZE, accPage * ACC_PAGE_SIZE);

  const AccountsContent = () => (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        {/* Account Type dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setAccTypeOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font, minWidth: 170 }}
          >
            <span className="flex-1 text-left">{accTypeFilter === 'All' ? 'Account Type' : accTypeFilter}</span>
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {accTypeOpen && (
            <div className="absolute z-[110] left-0 bg-white rounded-[8px] py-[4px] mt-1 overflow-hidden"
              style={{ top: '100%', minWidth: 170, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
              {['All', 'Credit Account', 'Debit Account'].map(opt => (
                <button key={opt}
                  className={`w-full px-[14px] py-[10px] text-left text-[15px] hover:bg-[#e2ebf9] transition-colors ${accTypeFilter === opt ? 'text-[#1360d2] font-medium' : 'text-[#111838]'}`}
                  style={{ fontFamily: font }}
                  onClick={() => { setAccTypeFilter(opt); setAccTypeOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Simple search — account number only */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden" style={{ minWidth: 280 }}>
          <div className="flex items-center px-[12px] gap-[8px] flex-1">
            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#8f94ae" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={accSearchValue}
              onChange={e => setAccSearchValue(e.target.value)}
              placeholder="Search by account number…"
              className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
              style={{ fontFamily: font }}
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Account Statement */}
        <button
          onClick={() => setShowStmtModal(true)}
          className="h-[48px] px-[16px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors flex-shrink-0"
          style={{ fontFamily: font }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
          </svg>
          Account Statement
        </button>

        {/* Proceed to Pay */}
        <button
          disabled={selectedAccs.size === 0}
          onClick={() => { setAccPayAmounts({}); setAccView('pay'); }}
          className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: selectedAccs.size > 0 ? '#1360d2' : '#a6c2e9', fontFamily: font, cursor: selectedAccs.size > 0 ? 'pointer' : 'not-allowed' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
          </svg>
          Proceed to Pay
        </button>
      </div>

      {/* Limit calculation info panel */}
      <div className="rounded-[8px] border border-[#b3caff] mb-[12px] overflow-hidden" style={{ background: 'linear-gradient(135deg,#eef4ff,#f5f8ff)' }}>
        <div className="flex items-center gap-[8px] px-[16px] py-[10px] border-b border-[#d5ddfb]">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6">
            <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 7v.5" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] font-semibold text-[#1360d2]" style={{ fontFamily: font }}>How are the limits calculated?</span>
        </div>
        <div className="px-[16px] py-[10px] flex items-center gap-[32px] flex-wrap">
          {[
            { label: 'Total Limit', formula: 'Maximum credit/debit ceiling assigned to the account' },
            { label: 'Amount Due to Pay', formula: 'Sum of all outstanding invoices pending settlement' },
            { label: 'Current Limit', formula: 'Total Limit − Amount Due to Pay' },
            { label: 'Available Limit', formula: 'Current Limit (funds available for new transactions)' },
          ].map(({ label, formula }) => (
            <div key={label} className="flex items-start gap-[6px] min-w-[180px]">
              <div className="w-[8px] h-[8px] rounded-full mt-[6px] flex-shrink-0" style={{ background: '#0e1b3d' }} />
              <div>
                <p className="text-[14px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{label}</p>
                <p className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{formula}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accounts table */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {/* Checkbox */}
              <th style={{ background: '#a6c2e9', padding: '10px 16px', width: 44, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                <span />
              </th>
              {(['Account Type', 'Account Number', 'Total Limit (AED)', 'Amount Due to Pay (AED)', 'Current Limit (AED)', 'Available Limit (AED)'] as const).map((h) => (
                <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>
                  <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                </th>
              ))}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 120, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAcc.map((acc, i) => {
              const absIdx = (accPage - 1) * ACC_PAGE_SIZE + i;
              const isSelected = selectedAccs.has(absIdx);
              const isDebit = acc.type === 'Debit Account';
              return (
                <tr key={i} onClick={() => setSelectedAccs(prev => { const n = new Set(prev); n.has(absIdx) ? n.delete(absIdx) : n.add(absIdx); return n; })}
                  className={isSelected ? 'bg-[#dce8f8] cursor-pointer' : 'bg-white hover:bg-[#dce8f8] cursor-pointer'}>
                  <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <input type="checkbox" readOnly checked={isSelected} className="size-4 accent-[#1360d2]" />
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[16px] text-[#0e1b3d]">{acc.type}</span>
                      {isDebit && (
                        <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-[4px] text-[13px] font-semibold"
                          style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2' }}>
                          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2">
                            <rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16" strokeLinecap="round"/><circle cx="6" cy="13" r="1.2" fill="#1360d2" stroke="none"/>
                          </svg>
                          Wallet
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <a href="#" onClick={e => e.preventDefault()} className="text-[16px] text-[#1360d2] underline hover:opacity-75 transition-opacity whitespace-nowrap">{acc.account}</a>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap flex items-center gap-[4px]">
                      <DirhamIcon size={14} color="#0e1b3d" /> {acc.totalLimit}
                    </span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] whitespace-nowrap flex items-center gap-[4px]" style={{ color: '#dc3545' }}>
                      <DirhamIcon size={14} color="#dc3545" /> {acc.amountDue}
                    </span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap flex items-center gap-[4px]">
                      <DirhamIcon size={14} color="#0e1b3d" /> {acc.currentLimit}
                    </span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] font-medium whitespace-nowrap flex items-center gap-[4px]">
                      <DirhamIcon size={14} color="#0e1b3d" /> {acc.availableLimit}
                    </span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setShowStmtModal(true)}
                      title="Download Account Statement"
                      className="size-[34px] flex items-center justify-center rounded-[4px] border border-[#d5ddfb] bg-white text-[#1360d2] hover:bg-[#f0f4ff] transition-colors mx-auto"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 3v12M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          page={accPage}
          totalPages={Math.max(1, totalAccPages)}
          pageSize={ACC_PAGE_SIZE}
          totalItems={filteredAccounts.length}
          onPageChange={setAccPage}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );

  /* ── Main render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-10 flex-shrink-0">
          <Breadcrumb onBack={onBack} />
          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font }}>Bill Payment</h1>
        </div>

        {/* Main layout: left sidebar + content */}
        <div className="flex flex-1 overflow-hidden px-4 md:px-10 pt-[4px] gap-[12px]">

          {/* Left sidebar */}
          <div
            className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300"
            style={{
              width: panelCollapsed ? 64 : 176,
              background: '#e4efff',
              border: '1px solid #a6c2e9',
              alignSelf: 'stretch',
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
                    <span className="text-[16px] text-[#0e1b3d] leading-tight whitespace-nowrap overflow-hidden"
                      style={{ fontFamily: font, fontWeight: isActive ? 700 : 400 }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto pb-4">
          {activeMenu === 'Overview' && (
            <div className="flex flex-col gap-[16px] w-full">

              {/* ── ROW 1: KPI stat cards ─────────────────────────────────── */}
              <div className="grid grid-cols-4 gap-[14px]">
                {[
                  { label: 'Invoices Pending', value: `AED ${pendingInvAmt.toLocaleString('en-US', {minimumFractionDigits:2})}`, sub: `${pendingInv} invoice${pendingInv !== 1 ? 's' : ''} overdue`, color: '#e8690d', bg: 'linear-gradient(135deg,#fff7ec,#fffaf4)', border: '#fcd7a0', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e8690d" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round"/></svg>, onClick: () => setActiveMenu('Invoices') },
                  { label: 'Initiated Payments', value: initiatedPay, sub: 'Currently processing', color: '#1360d2', bg: 'linear-gradient(135deg,#eef4ff,#f5f8ff)', border: '#b3caff', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M12 13v3M10 14l2-1 2 1" strokeLinecap="round"/></svg>, onClick: () => setActiveMenu('Payments') },
                  { label: 'Pending Payments', value: pendingPay, sub: 'Awaiting confirmation', color: '#d97706', bg: 'linear-gradient(135deg,#fffbeb,#fef9f0)', border: '#fcd34d', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#d97706" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>, onClick: () => setActiveMenu('Payments') },
                  { label: 'Payment Failed', value: recheckPay, sub: 'Requires attention', color: '#c0392b', bg: 'linear-gradient(135deg,#fff0f0,#fff8f8)', border: '#f5b8b8', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c0392b" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5" strokeLinecap="round"/><circle cx="12" cy="16.5" r="0.9" fill="#c0392b"/></svg>, onClick: () => setActiveMenu('Payments') },
                ].map(({ label, value, sub, color, bg, border, icon, onClick }) => (
                  <button key={label} onClick={onClick}
                    className="rounded-[14px] p-[16px] text-left flex items-center gap-[14px] relative overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ background: bg, border: `1.5px solid ${border}` }}>
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[14px]" style={{ background: color }} />
                    <div className="size-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0 ml-[4px]" style={{ background: `${color}1a` }}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[30px] font-extrabold leading-none mb-[2px]" style={{ color, fontFamily: font, letterSpacing: '-1px' }}>{value}</p>
                      <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{label}</p>
                      <p className="text-[16px] text-[#697498] mt-[1px]" style={{ fontFamily: font }}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* ── ROW 2: Accounts + Recent Transactions ─────────────────── */}
              <div className="flex gap-[16px] items-start">

                {/* Account Balances */}
                <div className="flex flex-col gap-[12px]" style={{ width: '38%', flexShrink: 0 }}>
                  <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Account Balances</p>

                  {/* Credit card */}
                  <div className="rounded-[14px] p-[18px] flex flex-col gap-[12px] relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#dce9ff,#edf4ff)', border: '1.5px solid #b3caff', boxShadow: '0 4px 18px rgba(19,96,210,0.10)' }}>
                    <div className="absolute -right-4 -top-4 size-[70px] rounded-full opacity-10" style={{ background: '#1360d2' }} />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[38px] rounded-[9px] flex items-center justify-center" style={{ background: 'rgba(19,96,210,0.14)' }}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 14h4" strokeLinecap="round"/></svg>
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Credit Accounts</p>
                          <span className="inline-flex items-center px-[8px] py-[2px] rounded-full text-[13px] font-semibold mt-[2px]" style={{ background: 'rgba(19,96,210,0.12)', color: '#1360d2', fontFamily: font }}>{ACCOUNTS.length} accounts</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[16px] text-[#697498] mb-[1px]" style={{ fontFamily: font }}>Total Available Balance</p>
                      <p className="text-[22px] font-extrabold text-[#1360d2] leading-tight" style={{ fontFamily: font, letterSpacing: '-0.5px' }}>{fmtBalance(creditTotal)}</p>
                    </div>
                    <div className="flex items-center justify-between relative z-10 pt-[8px] border-t border-[rgba(19,96,210,0.15)]">
                      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Updated today</span>
                      <button onClick={() => setActiveMenu('Accounts')} className="text-[16px] text-[#1360d2] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: font }}>
                        View all <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Debit card */}
                  <div className="rounded-[14px] p-[18px] flex flex-col gap-[12px] relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#e8f0fe,#f0f5ff)', border: '1.5px solid #93b4f7', boxShadow: '0 4px 18px rgba(30,64,175,0.09)' }}>
                    <div className="absolute -right-4 -top-4 size-[70px] rounded-full opacity-10" style={{ background: '#1e40af' }} />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[38px] rounded-[9px] flex items-center justify-center" style={{ background: 'rgba(30,64,175,0.12)' }}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1e40af" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 14h4" strokeLinecap="round"/></svg>
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Debit Accounts</p>
                          <span className="inline-flex items-center px-[8px] py-[2px] rounded-full text-[13px] font-semibold mt-[2px]" style={{ background: 'rgba(30,64,175,0.12)', color: '#1e40af', fontFamily: font }}>{DEBIT_ACCOUNTS.length} accounts</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[16px] text-[#697498] mb-[1px]" style={{ fontFamily: font }}>Total Available Balance</p>
                      <p className="text-[22px] font-extrabold text-[#1e40af] leading-tight" style={{ fontFamily: font, letterSpacing: '-0.5px' }}>{fmtBalance(debitTotal)}</p>
                    </div>
                    <div className="flex items-center justify-between relative z-10 pt-[8px] border-t border-[rgba(30,64,175,0.15)]">
                      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Updated today</span>
                      <button onClick={() => setActiveMenu('Accounts')} className="text-[16px] text-[#1360d2] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: font }}>
                        View all <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Recent Transactions */}
                <div className="flex-1 flex flex-col gap-[12px] min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Recent Transactions</p>
                    <button onClick={() => setActiveMenu('Payments')} className="text-[16px] text-[#1360d2] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: font }}>
                      View all <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  <div className="rounded-[14px] overflow-hidden" style={{ border: '1.5px solid #e0e8f5', boxShadow: '0 2px 12px rgba(19,96,210,0.06)' }}>
                    {recentPayments.map((tx, i) => {
                      const st = PAY_STATUS[tx.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                      return (
                        <div key={i} className="flex items-center gap-[12px] px-[16px] py-[13px]" style={{ borderBottom: i < recentPayments.length - 1 ? '1px solid #f0f4ff' : 'none', background: i % 2 === 0 ? 'white' : '#fafbff' }}>
                          <div className="size-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: tx.status === 'Success' ? 'rgba(34,197,94,0.10)' : 'rgba(19,96,210,0.10)' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={tx.status === 'Success' ? '#16a34a' : '#1360d2'} strokeWidth="1.8">
                              <rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-semibold text-[#0e1b3d] truncate" style={{ fontFamily: font }}>{tx.type}</p>
                            <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Tx #{tx.txNo} · {tx.txDate}</p>
                          </div>
                          <div className="flex flex-col items-end gap-[3px] flex-shrink-0">
                            <p className="text-[16px] font-bold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}><DirhamIcon size={12} color="#0e1b3d" /> {tx.amount}</p>
                            <span className="inline-flex items-center px-[7px] py-[1px] rounded-[4px] text-[16px] font-medium" style={{ background: st.bg, color: st.color }}>{tx.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          )}
            {activeMenu === 'Invoices' && <InvoicesContent />}
            {activeMenu === 'Payments' && <PaymentsContent />}
            {activeMenu === 'Accounts' && <AccountsContent />}
            </div>{/* end scrollable */}
          </div>{/* end right content wrapper */}
        </div>
      </div>

      {/* Account Statement Modal */}
      {showStmtModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.45)' }}>
          <div className="bg-white rounded-[16px] w-full max-w-[560px] mx-4 shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]">
              <div>
                <h3 className="text-[20px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Account Statement</h3>
                <p className="text-[13px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>Select statement type and date range</p>
              </div>
              <button onClick={() => setShowStmtModal(false)}
                className="size-[36px] rounded-full flex items-center justify-center hover:bg-[#f0f4ff] transition-colors">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <div className="px-6 py-5">
              {/* Statement type radios */}
              <p className="text-[13px] font-semibold text-[#697498] mb-3 uppercase tracking-wide" style={{ fontFamily: font }}>Statement Type</p>
              <div className="flex flex-col gap-3 mb-5">
                {([
                  ['summary',     'Monthly Statement (Summary)'],
                  ['detailed',    'Monthly Statement (Detailed)'],
                  ['transaction', 'Transaction List'],
                ] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer p-3 rounded-[8px] border transition-colors"
                    style={{ borderColor: stmtType === val ? '#1360d2' : '#e0e8f5', background: stmtType === val ? '#f0f6ff' : 'white' }}>
                    <input type="radio" name="stmt-type-modal" checked={stmtType === val}
                      onChange={() => { setStmtType(val); setDownloadFmt(''); }}
                      className="size-4 accent-[#1360d2]" />
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: stmtType === val ? 600 : 400 }}>{label}</span>
                  </label>
                ))}
              </div>
              {stmtType === 'transaction' && (
                <p className="text-[13px] text-[#0e1b3d] mb-4 p-3 bg-[#fff8e6] rounded border border-[#fcd7a0]" style={{ fontFamily: font }}>
                  <strong>Note*</strong> Report available for 30 days only. For more, extract in batches or use monthly option.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {stmtType !== 'transaction' ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Year *</label>
                      <select value={stmtYear} onChange={e => setStmtYear(e.target.value)}
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                        style={{ fontFamily: font }}>
                        {YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Month *</label>
                      <select value={stmtMonth} onChange={e => setStmtMonth(e.target.value)}
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                        style={{ fontFamily: font }}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>From Date *</label>
                      <input type="text" value={stmtFromDate} onChange={e => setStmtFromDate(e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none focus:border-[#1360d2]"
                        style={{ fontFamily: font }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>To Date *</label>
                      <input type="text" value={stmtToDate} onChange={e => setStmtToDate(e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none focus:border-[#1360d2]"
                        style={{ fontFamily: font }} />
                    </div>
                  </>
                )}
              </div>
              {/* Download format */}
              <p className="text-[13px] font-semibold text-[#697498] mb-3 uppercase tracking-wide" style={{ fontFamily: font }}>Download Format</p>
              <div className="flex gap-3 mb-6">
                {(['PDF', 'Excel'] as const).map(fmt => (
                  <button key={fmt} onClick={() => setDownloadFmt(fmt)}
                    className="flex-1 h-[44px] rounded-[8px] border text-[16px] font-medium transition-colors"
                    style={{ borderColor: downloadFmt === fmt ? '#1360d2' : '#d5ddfb', background: downloadFmt === fmt ? '#1360d2' : 'white', color: downloadFmt === fmt ? 'white' : '#0e1b3d', fontFamily: font }}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e0e8f5] bg-[#f8fafd]">
              <button onClick={() => setShowStmtModal(false)}
                className="h-[44px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>
                Cancel
              </button>
              <button
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
                onClick={() => setShowStmtModal(false)}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 3v10M5 9l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Statement
              </button>
            </div>
          </div>
        </div>
      )}

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
