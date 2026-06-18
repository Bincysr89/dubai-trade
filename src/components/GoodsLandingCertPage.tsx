import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

const SERVICE_NAME  = 'Goods Landing Certificate';
const SERVICE_TYPE  = 'Landing Certificate';
const CHARGES       = '100.00';
const REQ_NO        = 'R00723-513240';
const CONSIGNEE_TYPE = 'AE-1019056';
const CONSIGNEE_CODE = 'Dubai Customs - Test LLC';
const DOCUMENT_TYPES  = ['Bill Number', 'Airway Bill Number'];
const PAYMENT_OPTIONS = ['543755', '46328', '78941', '23156'];

/* ── FloatDropdown ─────────────────────────────────────────────────── */
function FloatDropdown({ label, required, value, onChange, options }: {
  label?: string; required?: boolean; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref  = useRef<HTMLDivElement>(null);
  const iRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => iRef.current?.focus(), 50); } }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className={`dc-float-dropdown${open ? ' dc-float-dropdown--open' : ''}${value ? ' dc-float-dropdown--has-value' : ''}`}>
      {open ? (
        <div className="dc-float-dropdown__trigger dc-float-dropdown__trigger--search">
          <input ref={iRef} className="dc-float-dropdown__inline-search" placeholder={value || 'Select…'}
            value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      ) : (
        <button type="button" className="dc-float-dropdown__trigger" onClick={() => setOpen(true)}>
          {value || <span className="dc-float-dropdown__placeholder"> </span>}
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}
      {label && <label className="dc-float-dropdown__label">{label}{required && <span className="dc-req"> *</span>}</label>}
      {open && (
        <div className="dc-float-dropdown__menu">
          <div className="dc-float-dropdown__options">
            {filtered.length > 0 ? filtered.map(opt => (
              <div key={opt} className={`dc-float-dropdown__option${value === opt ? ' dc-float-dropdown__option--selected' : ''}`}
                onMouseDown={() => { onChange(opt); setOpen(false); setSearch(''); }}>{opt}</div>
            )) : <div className="dc-float-dropdown__no-results">No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SField (read-only label/value pair) ────────────────────────────── */
function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

/* ── InfoCard (tile) ─────────────────────────────────────────────────── */
function InfoCard({ iconColor, icon, label, value }: {
  iconColor: string; icon: React.ReactNode; label: string; value: React.ReactNode;
}) {
  return (
    <div className="dc-basic-info-card" style={{ flex: 1 }}>
      <div className={`dc-basic-info-card__icon dc-basic-info-card__icon--${iconColor}`}>{icon}</div>
      <div className="dc-basic-info-card__body">
        <span className="dc-basic-info-card__label">{label}</span>
        <span className="dc-basic-info-card__value">{value}</span>
      </div>
    </div>
  );
}

/* ── PageShell (breadcrumb + header reused across stages) ───────────── */
function PageShell({ onBack, title, crumb, children }: {
  onBack: () => void; title: string; crumb: string; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Goods Landing Certificate</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">{crumb}</span>
          </span>
        </nav>
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h2 className="dc-info-header__title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Stage 2 — Payment Pending ──────────────────────────────────────── */
function PaymentPendingView({ onBack, onPay }: { onBack: () => void; onPay: () => void }) {
  return (
    <PageShell onBack={onBack} title={SERVICE_NAME} crumb="Payment Pending">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Status banner */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10,
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div style={{ fontFamily: font, fontSize: 15, color: '#92400e', fontWeight: 600 }}>
            Your request has been submitted. Payment is pending — please complete payment to proceed.
          </div>
        </div>

        {/* Request Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Request Details</h4>
            <div className="dc-success-grid dc-success-grid--5">
              <SField label="Request Number"     value={REQ_NO} />
              <SField label="Request Date"       value="21-01-2026" />
              <SField label="Request Status"     value={
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '3px 10px', borderRadius: 4, fontSize: 14, fontWeight: 500,
                  background: 'rgba(255,169,26,0.16)', color: '#b45309', whiteSpace: 'nowrap',
                }}>Payment Pending</span>
              } />
              <SField label="Bill of Entry No."  value="101221323445" />
              <SField label="Bill Date"          value="12-01-2026" />
              <SField label="Bill of Lading No." value="BOL12133244" />
            </div>
          </div>
        </div>

        {/* Charges Summary */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            <table className="dc-charges__table" style={{ marginBottom: 0 }}>
              <thead><tr><th>Charge Description</th><th>Amount (AED)</th></tr></thead>
              <tbody>
                <tr><td>{SERVICE_NAME} — {SERVICE_TYPE}</td><td>{CHARGES}</td></tr>
              </tbody>
              <tfoot>
                <tr><td><strong>Total Payable</strong></td><td><strong>AED {CHARGES}</strong></td></tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

      {/* Floating bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 44, padding: '0 20px', borderRadius: 6,
          border: '1.5px solid #d5ddfb', background: '#fff',
          fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          Back to Listing
        </button>
        <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 36px' }} onClick={onPay}>
          Make Payment
        </button>
      </div>
    </PageShell>
  );
}

/* ── Stage 3 — Request in Process ───────────────────────────────────── */
function RequestInProcessView({ paymentMode, onBack }: { paymentMode: string; onBack: () => void }) {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <PageShell onBack={onBack} title={SERVICE_NAME} crumb="Request Submitted">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Request Details with success banner */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            {bannerOpen && (
              <div className="dc-success-alert">
                <div className="dc-success-alert__left">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#276749', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="dc-success-alert__title">Request is under process</div>
                </div>
                <button type="button" className="dc-success-alert__close" onClick={() => setBannerOpen(false)}>×</button>
              </div>
            )}
            <div className="dc-success-grid">
              <SField label="Request Number" value={REQ_NO} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--draft">Under Process</span>} />
              <SField label="Service" value={SERVICE_NAME} />
              <SField label="Service Type" value={SERVICE_TYPE} />
              <SField label="Consignee Type" value={CONSIGNEE_TYPE} />
              <SField label="Consignee Code" value={CONSIGNEE_CODE} />
            </div>
          </div>
        </div>

        {/* Charges Summary */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            <div className="dc-success-grid" style={{ marginBottom: 20 }}>
              <SField label="Payment Mode" value={paymentMode} />
              <SField label="Payment Status" value="Success" />
              <SField label="Receipt No." value="Z-12323" />
              <SField label="Payment Reference No." value="5900080808" />
            </div>
            <hr className="dc-success-divider" />
            <table className="dc-charges__table">
              <thead><tr><th>Charge</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td>{SERVICE_NAME} — {SERVICE_TYPE}</td><td>AED {CHARGES}</td></tr>
              </tbody>
              <tfoot>
                <tr><td><strong>Total Amount</strong></td><td><strong>AED {CHARGES}</strong></td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        <div className="dc-form-card">
          <div className="dc-result-txn-card">
            <div className="dc-result-txn-card__header">Transaction History</div>
            <div className="dc-result-txn-card__body">
              <div className="dc-success-grid">
                <SField label="Initiated By" value="AE-1019056" />
                <SField label="Request No." value={REQ_NO} />
                <SField label="Amount" value={`AED ${CHARGES}`} />
                <SField label="Transaction Status" value="Success" />
                <SField label="DEG Transaction No" value="590000237140228" />
                <SField label="Transaction Date" value="Fri May 15 00:00:00 GST 2026" />
                <SField label="Payment Status" value="Success" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '8px 0 20px' }}>
          <button className="dc-btn dc-btn--outline" onClick={onBack}>Back to Listing</button>
          <button className="dc-btn dc-btn--outline" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main export — Stage 1 (form) + stage routing
═══════════════════════════════════════════════════════════════════════════ */

type Stage = 'form' | 'pending' | 'complete';

export default function GoodsLandingCertPage({ onBack }: { onBack: () => void }) {
  const [stage, setStage]           = useState<Stage>('form');
  const [paymentMode, setPaymentMode] = useState('Credit Card');

  /* Form fields */
  const [documentType,   setDocumentType]   = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [houseBillNo,    setHouseBillNo]    = useState('');
  const [showBillInfo,   setShowBillInfo]   = useState(false);
  const [goodDesc,       setGoodDesc]       = useState('');
  const [purpose,        setPurpose]        = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');

  const handleReset = () => {
    setDocumentType(''); setDocumentNumber(''); setHouseBillNo('');
    setShowBillInfo(false); setGoodDesc(''); setPurpose(''); setPaymentAccount('');
  };

  /* ── Stage routing ── */
  if (stage === 'pending') {
    return <PaymentPendingView onBack={onBack} onPay={() => setStage('complete')} />;
  }
  if (stage === 'complete') {
    return <RequestInProcessView paymentMode={paymentMode} onBack={onBack} />;
  }

  /* ── Stage: form ── */
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Goods Landing Certificate</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">New Request</span>
          </span>
        </nav>

        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h2 className="dc-info-header__title">{SERVICE_NAME}</h2>
        </div>

        <div className="dc-form-card">

          {/* §3 — Basic Information */}
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Basic Information</h4>

            {/* Row 1 (4 fields): Consignee Type | Consignee Code & Name | Document Type | Document Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              {/* Consignee Type — readOnly */}
              <div className="dc-float-field">
                <input className="dc-float-input" placeholder=" " value={CONSIGNEE_TYPE} readOnly
                  style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Type</label>
              </div>
              {/* Consignee Code & Name — merged, readOnly */}
              <div className="dc-float-field">
                <input className="dc-float-input" placeholder=" " value={`${CONSIGNEE_TYPE} - ${CONSIGNEE_CODE}`} readOnly
                  style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Code &amp; Name</label>
              </div>
              {/* Document Type */}
              <FloatDropdown label="Document Type" value={documentType} onChange={setDocumentType} options={DOCUMENT_TYPES} />
              {/* Document Number */}
              <div className="dc-float-field">
                <input className="dc-float-input" placeholder=" " value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} />
                <label className="dc-float-label">Document Number <span className="dc-req">*</span></label>
              </div>
            </div>

            {/* Row 2: House Bill No. */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              <div className="dc-float-field">
                <input className="dc-float-input" placeholder=" " value={houseBillNo} onChange={e => setHouseBillNo(e.target.value)} />
                <label className="dc-float-label">House Bill No.</label>
              </div>
            </div>

            {/* Search button below */}
            <div>
              <button type="button" className="dc-btn dc-btn--blue"
                style={{ height: 44, paddingLeft: 24, paddingRight: 24 }}
                onClick={() => setShowBillInfo(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* §4 — Bill Information (after Search) */}
          {showBillInfo && (
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Bill Information</h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 20 }}>
                <div><p className="dc-bill-field__label">Bill of Entry No.</p><p className="dc-bill-field__value">1013245459</p></div>
                <div><p className="dc-bill-field__label">Bill Date</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                <div><p className="dc-bill-field__label">Bill of Lading No.</p><p className="dc-bill-field__value">BOL1211324</p></div>
                <div><p className="dc-bill-field__label">Vessel</p><p className="dc-bill-field__value">Testname</p></div>
                <div><p className="dc-bill-field__label">Voyage</p><p className="dc-bill-field__value">324422</p></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 24 }}>
                <div><p className="dc-bill-field__label">Arrived From</p><p className="dc-bill-field__value">China</p></div>
                <div><p className="dc-bill-field__label">Arrived On</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                <div><p className="dc-bill-field__label">Marks &amp; Numbers</p><p className="dc-bill-field__value">N/A</p></div>
              </div>

              <div className="dc-form-row" style={{ marginBottom: 0 }}>
                <div className="dc-float-wrapper dc-field--half">
                  <div className="dc-float-field">
                    <input className="dc-float-input" placeholder=" " value={goodDesc} onChange={e => setGoodDesc(e.target.value)} />
                    <label className="dc-float-label">Good Description</label>
                  </div>
                </div>
                <div className="dc-float-wrapper dc-field--half">
                  <div className="dc-float-field">
                    <input className="dc-float-input" placeholder=" " value={purpose} onChange={e => setPurpose(e.target.value)} />
                    <label className="dc-float-label">Purpose <span className="dc-req">*</span></label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* §5 — Payment */}
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Payment</h4>
            <div style={{ width: 'calc(50% - 8px)' }}>
              <FloatDropdown label="Payment Account" value={paymentAccount} onChange={setPaymentAccount} options={PAYMENT_OPTIONS} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 44, padding: '0 20px', borderRadius: 6,
          border: '1.5px solid #d5ddfb', background: '#fff',
          fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          Back to Listing
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="dc-btn dc-btn--outline" style={{ height: 44, padding: '0 24px' }} onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 32px' }}
            onClick={() => setStage('pending')}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
