import React from 'react';
import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

type Row = {
  requestNumber: string;
  requestDate: string;
  requestType: string;
  status: string;
};

function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

function statusBadgeClass(status: string) {
  if (status === 'Payment Pending' || status === 'VAT Payment Pending') return 'dc-badge--pending';
  if (status === 'Closed') return 'dc-badge--success';
  if (status === 'Declined' || status === 'Cancelled') return 'dc-badge--draft';
  return 'dc-badge--draft';
}

export default function CWLViewPage({
  onBack,
  row,
}: {
  onBack: () => void;
  row: Row;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item">
            <button className="dc-breadcrumb__link" onClick={onBack}>Home</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Custom Warehouse License</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <span className="dc-breadcrumb__current">View Request</span>
          </span>
        </nav>

        {/* Page title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7" /></svg>
          </button>
          <h2 className="dc-info-header__title">Custom Warehouse License</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Card 1 — Request Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <div className="dc-success-alert">
                <div className="dc-success-alert__left">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#276749', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="dc-success-alert__title">Request is under process</div>
                </div>
              </div>

              <div className="dc-success-grid">
                <SField label="Request Number" value={row.requestNumber} />
                <SField label="Request Status" value={<span className={`dc-badge ${statusBadgeClass(row.status)}`}>{row.status}</span>} />
                <SField label="Request Type" value={row.requestType} />
                <SField label="Request Date" value={row.requestDate} />
                <SField label="Service" value="Custom Warehouse License" />
                <SField label="Importer Code" value="C0021 - CONSOLIDATED SHIPPING SERVICES L.L.C" />
                <SField label="Credit Account" value="12522" />
                <SField label="Applicant Name" value="rowmahs" />
                <SField label="Designation" value="manager" />
                <SField label="Phone No." value="971507483292" />
                <SField label="Email" value="dubaitradetechnicalsupport@dubaitrade.ae" />
                <SField label="Warehouse Name" value="Dubai South Warehouse" />
              </div>
            </div>
          </div>

          {/* Card 2 — Charges Summary */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Charges Summary</h4>
              <div className="dc-success-grid" style={{ marginBottom: 20 }}>
                <SField label="Payment Mode" value="Duty Account" />
                <SField label="Payment Status" value="Pending" />
                <SField label="Receipt No." value="—" />
                <SField label="Payment Reference No." value="—" />
              </div>
              <hr className="dc-success-divider" />
              <table className="dc-charges__table">
                <thead><tr><th>Charge</th><th>Amount</th></tr></thead>
                <tbody>
                  <tr><td>Custom Warehouse License Fee</td><td>AED 25,000.00</td></tr>
                  <tr><td>Processing Fee</td><td>AED 500.00</td></tr>
                </tbody>
                <tfoot>
                  <tr><td><strong>Total</strong></td><td><strong>AED 25,500.00</strong></td></tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Card 3 — Transaction History */}
          <div className="dc-form-card">
            <div className="dc-result-txn-card">
              <div className="dc-result-txn-card__header">Transaction History</div>
              <div className="dc-result-txn-card__body">
                <div className="dc-success-grid">
                  <SField label="Initiated By" value="AE-1019056" />
                  <SField label="Request No." value={row.requestNumber} />
                  <SField label="Amount" value="25,500.00" />
                  <SField label="Transaction Status" value="Pending" />
                  <SField label="DEG Transaction No" value="590000237140228" />
                  <SField label="Transaction Date" value={row.requestDate} />
                  <SField label="Payment Status" value="Pending" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 12H5m7-7-7 7 7 7" />
          </svg>
          Back to Listing
        </button>
        <button type="button" className="dc-btn dc-btn--outline" onClick={() => window.print()}>
          Print
        </button>
      </div>
    </div>
  );
}
