import React, { useState } from 'react';
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

function FloatField({ label, value, onChange, readOnly }: {
  label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean;
}) {
  return (
    <div className="dc-float-wrapper dc-field--half">
      <div className="dc-float-field">
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          style={readOnly ? { background: '#f5f7fa', cursor: 'default', color: '#697498' } : undefined}
        />
        <label className="dc-float-label">{label}</label>
      </div>
    </div>
  );
}

function FloatSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="dc-float-wrapper dc-field--half">
      <div className="dc-float-field" style={{ position: 'relative' }}>
        <select
          className="dc-float-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 32 }}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <label className="dc-float-label" style={{ pointerEvents: 'none', top: 0, transform: 'translateY(-50%)', fontSize: '12px', color: '#1360D2', fontWeight: 500, background: '#fff' }}>
          {label}
        </label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
            <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function CWLPaymentPage({
  onBack,
  row,
}: {
  onBack: () => void;
  row: Row;
}) {
  const [paymentMode, setPaymentMode] = useState('Duty Account');
  const [bankRef, setBankRef] = useState('');
  const [remarks, setRemarks] = useState('');

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
            <span className="dc-breadcrumb__current">Make Payment</span>
          </span>
        </nav>

        {/* Page title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7" /></svg>
          </button>
          <h2 className="dc-info-header__title">Make Payment</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Card 1 — Request Summary (limited details) */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Request Details</h4>
              <div className="dc-success-grid">
                <SField label="Request Number" value={row.requestNumber} />
                <SField label="Request Type" value={row.requestType} />
                <SField label="Request Date" value={row.requestDate} />
                <SField label="Service" value="Custom Warehouse License" />
                <SField label="Importer Code" value="C0021 - CONSOLIDATED SHIPPING SERVICES L.L.C" />
                <SField label="Applicant Name" value="rowmahs" />
              </div>
            </div>
          </div>

          {/* Card 2 — Charges */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Charges Summary</h4>
              <table className="dc-charges__table" style={{ marginBottom: 0 }}>
                <thead><tr><th>Charge Description</th><th>Amount (AED)</th></tr></thead>
                <tbody>
                  <tr><td>Custom Warehouse License Fee</td><td>25,000.00</td></tr>
                  <tr><td>Processing Fee</td><td>500.00</td></tr>
                </tbody>
                <tfoot>
                  <tr><td><strong>Total Payable</strong></td><td><strong>25,500.00</strong></td></tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Card 3 — Payment Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Payment Details</h4>
              <div className="dc-form-row">
                <FloatField label="Total Amount (AED)" value="25,500.00" readOnly />
                <FloatSelect
                  label="Payment Mode"
                  value={paymentMode}
                  onChange={setPaymentMode}
                  options={['Duty Account', 'Credit Card', 'Online Banking', 'Cash Deposit']}
                />
              </div>
              <div className="dc-form-row">
                <FloatField label="Bank Reference No." value={bankRef} onChange={setBankRef} />
                <FloatField label="Remarks" value={remarks} onChange={setRemarks} />
              </div>

              {/* Payment amount summary box */}
              <div style={{
                background: '#f0f5ff', border: '1px solid #d5ddfb', borderRadius: 10,
                padding: '20px 24px', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Total Amount Payable</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>AED 25,500.00</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Payment Mode</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1360D2', fontFamily: font }}>{paymentMode}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating bottom bar */}
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
          Back
        </button>
        <button
          type="button"
          className="dc-btn dc-btn--blue"
          style={{ minWidth: 180 }}
          onClick={() => alert('Payment processing...')}
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
