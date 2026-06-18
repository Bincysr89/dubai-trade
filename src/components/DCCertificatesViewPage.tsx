import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

type Row = {
  requestNumber: string;
  requestType: string;
  submittedOn: string;
  declarationNumber: string;
  status: string;
};

function SuccessField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

function statusBadgeClass(status: string): string {
  if (status === 'Payment Pending') return 'dc-badge--pending';
  if (status === 'Success') return 'dc-badge--success';
  return 'dc-badge--draft'; // 'Submitted' and default
}

export default function DCCertificatesViewPage({ onBack, row }: { onBack: () => void; row: Row }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-8">
        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item">
            <button className="dc-breadcrumb__link" onClick={onBack}>Home</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Certificates</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">View Request</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h2 className="dc-info-header__title">DC - Certificates</h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Card 1 — Request Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              {/* Green success alert banner */}
              <div className="dc-success-alert">
                <div className="dc-success-alert__left">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#276749', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="dc-success-alert__title">Request is under process</div>
                </div>
              </div>

              {/* 4-column grid */}
              <div className="dc-success-grid">
                <SuccessField label="Request Number" value={row.requestNumber} />
                <SuccessField
                  label="Request Status"
                  value={
                    <span className={`dc-badge ${statusBadgeClass(row.status)}`}>Under Process</span>
                  }
                />
                <SuccessField label="Service" value="DC - Certificates" />
                <SuccessField label="Service Type" value={row.requestType} />
                <SuccessField label="Consignee Type" value="AE-1019056" />
                <SuccessField label="Consignee Code" value="Dubai Customs - Test LLC" />
                <SuccessField label="Declaration Number" value={row.declarationNumber} />
                <SuccessField label="Submitted On" value={row.submittedOn} />
              </div>
            </div>
          </div>

          {/* Card 2 — Charges Summary */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Charges Summary</h4>
              <div className="dc-success-grid" style={{ marginBottom: 20 }}>
                <SuccessField label="Payment Mode" value="Duty Account" />
                <SuccessField label="Payment Status" value="Success" />
                <SuccessField label="Receipt No." value="Z-12323" />
                <SuccessField label="Payment Reference No." value="5900080808" />
              </div>
              <hr className="dc-success-divider" />
              <table className="dc-charges__table">
                <thead>
                  <tr>
                    <th>Charge</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Landing Certificate Fee</td>
                    <td>AED 100.0</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total Amount</td>
                    <td>AED 100.0</td>
                  </tr>
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
                  <SuccessField label="Initiated By" value="AE-1019056" />
                  <SuccessField label="Request No." value={row.requestNumber} />
                  <SuccessField label="Amount" value="100.00" />
                  <SuccessField label="Transaction Status" value="Success" />
                  <SuccessField label="DEG Transaction No" value="590000237140228" />
                  <SuccessField label="Transaction Date" value="Fri May 15 00:00:00 GST 2026" />
                  <SuccessField label="Payment Status" value="Success" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom action row */}
        <div className="dc-form-actions" style={{ justifyContent: 'flex-start', gap: 12, padding: '16px 0' }}>
          <button className="dc-btn dc-btn--outline" onClick={onBack}>Back to Listing</button>
          <button className="dc-btn dc-btn--outline" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </div>
  );
}
