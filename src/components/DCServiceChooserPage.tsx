import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Dh from './Dh';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

const AUTOFILL_USER = {
  name: 'Ahmed Al Mansoori',
  company: 'Dubai Trade LLC',
  contactPerson: 'Ahmed Al Mansoori',
  email: 'ahmed.almansoori@dubaitrade.ae',
  phone: '42123456',
  mobile: '551234567',
};

/* ═══════════════════════════════════════════════════════════════════════════
   Shared micro-components
═══════════════════════════════════════════════════════════════════════════ */

/** Identical to GenericServiceFormPage's FloatDropdown */
function FloatDropdown({ label, required, value, onChange, options, className }: {
  label?: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; className?: string;
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
    <div ref={ref} className={`dc-float-dropdown${open ? ' dc-float-dropdown--open' : ''}${value ? ' dc-float-dropdown--has-value' : ''}${className ? ' ' + className : ''}`}>
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

/** Identical to GenericServiceFormPage's FileUploadRow */
function FileUploadRow() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const add = (fl: FileList) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);
  const rm  = (i: number)    => setFiles(p => p.filter((_, j) => j !== i));
  return (
    <div>
      {files.length > 0 && (
        <div className="dc-file-grid" style={{ marginBottom: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="dc-file-input-wrap">
              <svg className="dc-file-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="dc-file-input-text">{f}</span>
              <div className="dc-file-input-trail">
                <button className="dc-file-tag__remove" type="button" onClick={() => rm(i)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={`dc-dropzone${dragging ? ' dc-dropzone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}>
        <div className="dc-dropzone__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <span className="dc-dropzone__text">Drag and drop files here</span>
        <span className="dc-dropzone__or">-Or-</span>
        <button className="dc-dropzone__browse" type="button" onClick={() => ref.current?.click()}>Browse File</button>
        <input ref={ref} type="file" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) { add(e.target.files); e.target.value = ''; } }} />
      </div>
    </div>
  );
}

function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

function InfoCard({ iconColor, icon, label, value, style }: {
  iconColor: string; icon: React.ReactNode; label: string; value: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div className="dc-basic-info-card" style={{ flex: 1, ...style }}>
      <div className={`dc-basic-info-card__icon dc-basic-info-card__icon--${iconColor}`}>{icon}</div>
      <div className="dc-basic-info-card__body">
        <span className="dc-basic-info-card__label">{label}</span>
        <span className="dc-basic-info-card__value">{value}</span>
      </div>
    </div>
  );
}

const COUNTRY_CODES = [
  { code: '+971', flag: '🇦🇪' },
  { code: '+1',   flag: '🇺🇸' },
  { code: '+44',  flag: '🇬🇧' },
  { code: '+91',  flag: '🇮🇳' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+61',  flag: '🇦🇺' },
  { code: '+33',  flag: '🇫🇷' },
  { code: '+49',  flag: '🇩🇪' },
];

function PhoneField({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [cc, setCc]           = useState('+971');
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;

  return (
    <div className="dc-float-wrapper dc-field--half">
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'stretch',
        height: 56, width: '100%',
        border: `1px solid ${disabled ? '#e5e7eb' : focused ? '#1360D2' : '#D5DDFB'}`,
        borderRadius: 8, background: disabled ? '#f5f7fa' : '#fff',
        transition: 'border-color 150ms',
      }}>
        {/* Country code select */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <select
            value={cc}
            disabled={disabled}
            onChange={e => !disabled && setCc(e.target.value)}
            style={{
              height: '100%', border: 'none',
              borderRight: `1px solid ${disabled ? '#e5e7eb' : '#D5DDFB'}`,
              background: '#edf0f5',
              borderTopLeftRadius: 7, borderBottomLeftRadius: 7,
              paddingLeft: 10, paddingRight: 26,
              fontFamily: font, fontSize: 14, color: disabled ? '#9ca3af' : '#0e1b3d',
              cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none',
              WebkitAppearance: 'none', appearance: 'none',
            }}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2"
            style={{ position: 'absolute', right: 6, pointerEvents: 'none' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        {/* Number input */}
        <input
          placeholder=" "
          value={value}
          readOnly={disabled}
          onChange={e => !disabled && onChange(e.target.value)}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, height: '100%', border: 'none', outline: 'none',
            paddingLeft: 12, paddingRight: 16,
            paddingTop: floated ? 14 : 0,
            fontSize: 16, color: disabled ? '#9ca3af' : '#0e1b3d',
            fontFamily: font, background: 'transparent',
            cursor: disabled ? 'not-allowed' : undefined,
          }}
        />
        {/* Label: sits inside the input section; floats up within that same section */}
        <label style={{
          position: 'absolute',
          left: 106,
          top: floated ? 0 : '50%',
          transform: 'translateY(-50%)',
          fontSize: floated ? 12 : 16,
          color: floated ? (disabled ? '#9ca3af' : '#1360D2') : (disabled ? '#9ca3af' : '#000'),
          fontWeight: floated ? 500 : 400,
          background: floated ? (disabled ? '#f5f7fa' : '#fff') : 'transparent',
          padding: floated ? '0 4px' : '0',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 150ms ease',
        }}>{label}</label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Service config data
═══════════════════════════════════════════════════════════════════════════ */

const SERVICE_NAMES = [
  'Request Certificate',
  'Join Client Accreditation',
  'Request Customs Transaction Reports',
  'Submit Voluntary Disclosure',
];

const CERT_TYPES = [
  { name: 'NOC for Customs Broker License - New',             fees: '700.00', description: 'This service provides customers to obtain No Objection Certificate for Customs Broker to Issue New License', requirements: '1. Initial approval for the trade name & activity from DED' },
  { name: 'NOC for Customs Broker License - New Branch',      fees: '300.00', description: 'Obtain a No Objection Certificate to open a new branch for an existing Customs Broker License', requirements: 'Existing broker license, Branch address proof, Emirates ID copy, Trade license' },
  { name: 'NOC for Customs Broker License - Change of Owner', fees: '400.00', description: 'Obtain a No Objection Certificate to transfer ownership of a Customs Broker License', requirements: 'Current license copy, New owner Emirates ID, MOU or transfer agreement, Trade license' },
  { name: 'NOC for Customs Broker License - Add New Partner', fees: '350.00', description: 'Obtain a No Objection Certificate to add a new partner to an existing Customs Broker License', requirements: 'Existing license copy, New partner Emirates ID, Partnership agreement, Trade license' },
  { name: 'Landing Certificate',                               fees: '100.00', description: 'Official certificate confirming that goods have been landed and received at the destination port', requirements: 'Bill of lading, Commercial invoice, Packing list, Declaration number' },
  { name: 'Vehicle Clearance Certificate(VCC)',                fees: '200.00', description: 'Certificate confirming that a vehicle has been cleared through Dubai Customs with all duties paid', requirements: 'Vehicle chassis number, Customs declaration, Invoice, Importer trade license' },
  { name: 'Clearance Letter',                                  fees: '100.00', description: 'This service provides customers to obtain:\n- Clearance Certificate - Termination\n- Clearance Certificate - For company records\n- Clearance Certificate - Change ownership\n- Clearance Certificate - Add Partner\n- Clearance Certificate - Business Code Cancellation', requirements: '1. Passport copy of the owner or authorized person\n2. Letter from the company with authorized person details\n3. If not available: Power of Attorney or Share Certificate' },
  { name: 'VAT Registration Letter',                           fees: '100.00', description: 'Official letter confirming VAT registration status issued by Dubai Customs', requirements: 'TRN, Trade license, Emirates ID, Application form' },
  { name: 'Authorization to Issue Invoice in FZ',              fees: '250.00', description: 'Authorization certificate for Free Zone businesses to issue customs invoices', requirements: 'Free Zone license, Emirates ID, Authorized signatory details' },
  { name: 'No Objection from Special Tasks Department',        fees: '300.00', description: 'No Objection Certificate issued by the Special Tasks Department', requirements: 'Trade license, Emirates ID, Description of goods/activity' },
];

const CERT_DOCUMENT_TYPES  = ['Bill Number', 'Airway Bill Number'];
const CERT_PAYMENT_OPTIONS  = ['543755', '46328', '78941', '23156'];

const CTR_TYPES = [
  { name: 'Statistical Report',    fees: '100.00', description: 'Provides aggregate statistical data on customs transactions over a specified period.', requirements: 'Business code, Date range, Trade license' },
  { name: 'Declaration Report',    fees: '200.00', description: 'Provides detailed information on individual customs declarations within the requested period.', requirements: 'Declaration numbers, Date range, Business code' },
  { name: 'Summary Transactions',  fees: '150.00', description: 'A summarized overview of all customs transactions grouped by category or type.', requirements: 'Business code, Date range' },
  { name: 'Detailed Transactions', fees: '300.00', description: 'A full line-by-line breakdown of each customs transaction including duties, taxes, and fees.', requirements: 'Business code, Date range, Authorization letter' },
];


const DISCLOSURE_TYPES = ['Incorrect Declaration of Value', 'Incorrect Declaration of Origin', 'Incorrect HS Code', 'Under-Declaration of Goods', 'Prohibited Goods Declaration', 'Other'];

const SERVICE_META: Record<string, { description: string; baseCharges: string; requirements: string }> = {
  'Request Certificate':                 { description: 'This service allows clients to request various official customs certificates for their trade activities.', baseCharges: '100.00', requirements: 'Valid trade license, Original customs documents, Emirates ID' },
  'Join Client Accreditation':           { description: 'This service allows clients to submit a request for enrollment in Dubai Customs Client Accreditation Program.', baseCharges: '200.00', requirements: 'Copy of trade license' },
  'Request Customs Transaction Reports': { description: 'This service allows customers to request a comprehensive transactions report from Dubai Customs.', baseCharges: '200.00', requirements: 'Trade license, Emirates ID, Customs file number, Date range' },
  'Submit Voluntary Disclosure':         { description: 'This service allows clients to voluntarily disclose incorrect or incomplete customs declarations to Dubai Customs.', baseCharges: '0.00', requirements: 'Original declaration documents, Correction justification letter' },
};

const REQ_NUMBERS: Record<string, string> = {
  'Request Certificate':                 'R00723-513234',
  'Join Client Accreditation':           'R00724-513235',
  'Request Customs Transaction Reports': 'R00725-513236',
  'Submit Voluntary Disclosure':         'R00726-513237',
};

/* ═══════════════════════════════════════════════════════════════════════════
   Breadcrumb + Title shell (reused across all stages)
═══════════════════════════════════════════════════════════════════════════ */

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
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Service Request</button>
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

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 2 — Payment Pending
═══════════════════════════════════════════════════════════════════════════ */

function PaymentPendingView({ service, serviceType, name, company, charges, reqNo, onBack, onPay }: {
  service: string; serviceType: string; name: string; company: string;
  charges: string; reqNo: string; onBack: () => void; onPay: () => void;
}) {
  const isFree = charges === '0.00';

  return (
    <PageShell onBack={onBack} title={service} crumb="Payment Pending">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Status alert banner */}
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
            {isFree
              ? 'No payment required for this service. Click Submit Request to finalise.'
              : 'Your request has been submitted. Payment is pending — please complete payment to proceed.'}
          </div>
        </div>

        {/* Card 1 — Request Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Request Details</h4>
            <div className="dc-success-grid">
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--amber">Payment Pending</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
              <SField label="Applicant Name" value={name || '—'} />
              <SField label="Company" value={company || '—'} />
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
                {isFree
                  ? <tr><td>{service}</td><td>No Charge</td></tr>
                  : <tr><td>{service}{serviceType ? ` — ${serviceType}` : ''}</td><td>{charges}</td></tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total Payable</strong></td>
                  <td><strong>{isFree ? 'No Charge' : `AED ${charges}`}</strong></td>
                </tr>
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
          {isFree ? 'Submit Request' : 'Make Payment'}
        </button>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 3 — Make Payment form
═══════════════════════════════════════════════════════════════════════════ */

function MakePaymentView({ service, serviceType, charges, reqNo, onBack, onComplete }: {
  service: string; serviceType: string; charges: string;
  reqNo: string; onBack: () => void; onComplete: (mode: string) => void;
}) {
  const [paymentMode, setPaymentMode] = useState('Credit Card');
  const [bankRef, setBankRef]         = useState('');
  const [remarks, setRemarks]         = useState('');

  return (
    <PageShell onBack={onBack} title="Make Payment" crumb="Make Payment">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Card 1 — Request Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Request Details</h4>
            <div className="dc-success-grid">
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--amber">Payment Pending</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
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
                <tr>
                  <td>{service}{serviceType ? ` — ${serviceType}` : ''}</td>
                  <td>{charges}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr><td><strong>Total Payable</strong></td><td><strong>AED {charges}</strong></td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Card 3 — Payment Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Payment Details</h4>

            <div className="dc-form-row">
              {/* Total Amount — read-only */}
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={`AED ${charges}`} readOnly
                    style={{ background: '#f5f7fa', cursor: 'default', color: '#697498' }} />
                  <label className="dc-float-label">Total Amount</label>
                </div>
              </div>
              {/* Payment Mode */}
              <div style={{ width: 'calc(50% - 6px)' }}>
                <FloatDropdown label="Payment Mode" required value={paymentMode} onChange={setPaymentMode}
                  options={['Credit Card', 'Duty Account', 'Online Banking', 'Cash Deposit']} />
              </div>
            </div>

            <div className="dc-form-row">
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={bankRef} onChange={e => setBankRef(e.target.value)} />
                  <label className="dc-float-label">Bank Reference No.</label>
                </div>
              </div>
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={remarks} onChange={e => setRemarks(e.target.value)} />
                  <label className="dc-float-label">Remarks</label>
                </div>
              </div>
            </div>

            {/* Payment summary box — identical to CWLPaymentPage */}
            <div style={{
              background: '#f0f5ff', border: '1px solid #d5ddfb', borderRadius: 10,
              padding: '20px 24px', marginTop: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Total Amount Payable</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>AED {charges}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Payment Mode</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1360D2', fontFamily: font }}>{paymentMode}</div>
              </div>
            </div>
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
          Back
        </button>
        <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 36px' }}
          onClick={() => onComplete(paymentMode)}>
          Complete Payment
        </button>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 4 — Request in Process (success / final)
═══════════════════════════════════════════════════════════════════════════ */

function RequestInProcessView({ service, serviceType, name, company, email, subject, charges, reqNo, paymentMode, onBack }: {
  service: string; serviceType: string; name: string; company: string;
  email: string; subject: string; charges: string; reqNo: string;
  paymentMode: string; onBack: () => void;
}) {
  const [bannerOpen, setBannerOpen] = useState(true);
  const isFree = charges === '0.00';

  return (
    <PageShell onBack={onBack} title={service} crumb="Request Submitted">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Card 1 — Request Details with success banner */}
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
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--draft">Under Process</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
              <SField label="Name" value={name || 'Testname'} />
              <SField label="Company" value={company || 'Testcompany'} />
              <SField label="Email" value={email || 'user@example.com'} />
              {subject && <SField label="Subject" value={subject} />}
            </div>
          </div>
        </div>

        {/* Card 2 — Charges Summary */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            {!isFree && (
              <div className="dc-success-grid" style={{ marginBottom: 20 }}>
                <SField label="Payment Mode" value={paymentMode} />
                <SField label="Payment Status" value="Success" />
                <SField label="Receipt No." value="Z-12323" />
                <SField label="Payment Reference No." value="5900080808" />
              </div>
            )}
            <hr className="dc-success-divider" />
            <table className="dc-charges__table">
              <thead><tr><th>Charge</th><th>Amount</th></tr></thead>
              <tbody>
                <tr>
                  <td>{service}{serviceType ? ` — ${serviceType}` : ''}</td>
                  <td>{isFree ? 'No Charge' : `AED ${charges}`}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total Amount</strong></td>
                  <td><strong>{isFree ? 'No Charge' : `AED ${charges}`}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Card 3 — Transaction History (only when payment was made) */}
        {!isFree && (
          <div className="dc-form-card">
            <div className="dc-result-txn-card">
              <div className="dc-result-txn-card__header">Transaction History</div>
              <div className="dc-result-txn-card__body">
                <div className="dc-success-grid">
                  <SField label="Initiated By" value="AE-1019056" />
                  <SField label="Request No." value={reqNo} />
                  <SField label="Amount" value={`AED ${charges}`} />
                  <SField label="Transaction Status" value="Success" />
                  <SField label="DEG Transaction No" value="590000237140228" />
                  <SField label="Transaction Date" value="Fri May 15 00:00:00 GST 2026" />
                  <SField label="Payment Status" value="Success" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, padding: '8px 0 20px' }}>
          <button className="dc-btn dc-btn--outline" onClick={onBack}>Back to Listing</button>
          <button className="dc-btn dc-btn--outline" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main component — Stage 1 (form) + stage routing
═══════════════════════════════════════════════════════════════════════════ */

type Stage = 'form' | 'pending' | 'payment' | 'complete';

export default function DCServiceChooserPage({ onBack }: {
  onBack: () => void;
  onSelect?: (service: string) => void;
}) {
  /* ── Stage ── */
  const [stage, setStage]             = useState<Stage>('form');
  const [paymentMode, setPaymentMode] = useState('Credit Card');

  /* ── Service selection ── */
  const [service,     setService]     = useState('');
  const [serviceType, setServiceType] = useState('');

  /* ── Contact fields ── */
  const [name,          setName]          = useState(AUTOFILL_USER.name);
  const [company,       setCompany]       = useState(AUTOFILL_USER.company);
  const [contactPerson, setContactPerson] = useState(AUTOFILL_USER.contactPerson);
  const [email,         setEmail]         = useState(AUTOFILL_USER.email);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phone,         setPhone]         = useState(AUTOFILL_USER.phone);
  const [mobile,        setMobile]        = useState(AUTOFILL_USER.mobile);
  const [fax,           setFax]           = useState('');

  /* ── Request Info ── */
  const [subject, setSubject] = useState('');
  const [desc,    setDesc]    = useState('');

  /* ── Certificate-specific ── */
  const [purpose,       setPurpose]       = useState('');
  const [certDocType,   setCertDocType]   = useState('');
  const [certDocNo,     setCertDocNo]     = useState('');
  const [certHouseBill, setCertHouseBill] = useState('');
  const [certBillInfo,  setCertBillInfo]  = useState(false);
  const [certGoodDesc,  setCertGoodDesc]  = useState('');
  const [certPayAcct,   setCertPayAcct]   = useState('');
  // auto-populated read-only for Landing Cert
  const CONSIGNEE_TYPE = 'AE-1019056';
  const CONSIGNEE_CODE = 'Dubai Customs - Test LLC';

  /* ── CTR-specific ── */
  const [dateFrom,  setDateFrom]  = useState('');
  const [dateTo,    setDateTo]    = useState('');
  const [ctrFormat, setCtrFormat] = useState('');

  /* ── Disclosure-specific ── */
  const [declNo,    setDeclNo]    = useState('');
  const [disclDate, setDisclDate] = useState('');
  const [reason,    setReason]    = useState('');

  /* ── Derived ── */
  const meta     = service ? SERVICE_META[service] : null;
  const certType = CERT_TYPES.find(t => t.name === serviceType) ?? null;
  const ctrType  = CTR_TYPES.find(t => t.name === serviceType) ?? null;

  const chargeAmount = (() => {
    if (service === 'Request Certificate' && certType) return certType.fees;
    if (service === 'Request Customs Transaction Reports' && ctrType) return ctrType.fees;
    return meta?.baseCharges ?? '100.00';
  })();

  const reqNo = service ? (REQ_NUMBERS[service] ?? 'R00723-513234') : 'R00723-513234';

  const handleServiceChange = (svc: string) => { setService(svc); setServiceType(''); };
  const handleReset = () => {
    setService(''); setServiceType('');
    setName(AUTOFILL_USER.name); setCompany(AUTOFILL_USER.company); setContactPerson(AUTOFILL_USER.contactPerson);
    setEmail(AUTOFILL_USER.email); setEmailVerified(true);
    setPhone(AUTOFILL_USER.phone); setMobile(AUTOFILL_USER.mobile); setFax(''); setSubject(''); setDesc('');
    setPurpose('');
    setCertDocType(''); setCertDocNo(''); setCertHouseBill(''); setCertBillInfo(false);
    setCertGoodDesc(''); setCertPayAcct('');
    setDateFrom(''); setDateTo(''); setCtrFormat('');
    setDeclNo(''); setDisclDate(''); setReason('');
  };

  /* ── Stage routing ── */

  if (stage === 'pending') {
    return (
      <PaymentPendingView
        service={service} serviceType={serviceType} name={name}
        company={company} charges={chargeAmount} reqNo={reqNo}
        onBack={onBack}
        onPay={() => chargeAmount === '0.00' ? setStage('complete') : setStage('payment')}
      />
    );
  }

  if (stage === 'payment') {
    return (
      <MakePaymentView
        service={service} serviceType={serviceType}
        charges={chargeAmount} reqNo={reqNo}
        onBack={() => setStage('pending')}
        onComplete={(mode) => { setPaymentMode(mode); setStage('complete'); }}
      />
    );
  }

  if (stage === 'complete') {
    return (
      <RequestInProcessView
        service={service} serviceType={serviceType} name={name} company={company}
        email={email} subject={subject} charges={chargeAmount} reqNo={reqNo}
        paymentMode={paymentMode} onBack={onBack}
      />
    );
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
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Service Request</button>
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
          <h2 className="dc-info-header__title">{service || 'New Service Request'}</h2>
        </div>

        {/* ── Single card — all sections ── */}
        <div className="dc-form-card">

          {/* §0 — Service Name selector */}
          <div className="dc-form-section dc-basic-info-section">
            <div className="dc-basic-info-header">
              <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Select Service</h4>
            </div>
            {/* Dropdown row: Service Name (left) + Charges tile (right, once selected — hidden for Request Certificate) */}
            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 'calc(50% - 6px)', flexShrink: 0 }}>
                <FloatDropdown label="Service Name" required value={service} onChange={handleServiceChange} options={SERVICE_NAMES} />
              </div>
              {meta && service !== 'Request Certificate' && (
                <InfoCard iconColor="green" label="Charges"
                  value={<span className="dc-basic-info-card__value--charge">{meta.baseCharges === '0.00' ? 'No Charge' : `AED ${meta.baseCharges}`}</span>}
                  icon={<Dh style={{ width: 18, height: 18 }} />}
                  style={{ height: 56 }}
                />
              )}
            </div>
            {/* Description tile (always) + Requirements tile (hidden for Request Certificate) */}
            {meta && (
              <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 12 }}>
                <InfoCard iconColor="indigo" label="Service Description" value={meta.description}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                />
                {service !== 'Request Certificate' && (
                  <InfoCard iconColor="teal" label="Requirements" value={meta.requirements}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                  />
                )}
              </div>
            )}
          </div>

          {service && meta && (
            <>
              {/* ════════════════════════════════════════════════════════
                  REQUEST CERTIFICATE — exact match of DCCertificatesFormPage
              ════════════════════════════════════════════════════════ */}
              {service === 'Request Certificate' ? (<>

                {/* §2-CERT — Service Type Details */}
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType}
                          onChange={v => { setServiceType(v); setCertBillInfo(false); setCertDocType(''); setCertDocNo(''); setCertHouseBill(''); }}
                          options={CERT_TYPES.map(t => t.name)} />
                      </div>
                      {certType && serviceType !== 'Landing Certificate' && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">AED {certType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56 }}
                        />
                      )}
                    </div>
                    {certType && serviceType !== 'Landing Certificate' && (
                      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                        <InfoCard iconColor="indigo" label="Service Type Description"
                          value={<span style={{ whiteSpace: 'pre-line' }}>{certType.description}</span>}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                        />
                        {certType.requirements && (
                          <InfoCard iconColor="teal" label="Requirements"
                            value={<span style={{ whiteSpace: 'pre-line' }}>{certType.requirements}</span>}
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* §3-CERT — Non-landing cert: Contact Info + Request Info + Attachments */}
                {certType && serviceType !== 'Landing Certificate' && (<>

                  {/* Contact Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Contact Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                          <input className="dc-float-input" placeholder=" " value={name} readOnly
                            style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                          <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                          <input className="dc-float-input" placeholder=" " value={company} readOnly
                            style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                          <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                          <input className="dc-float-input" placeholder=" " value={contactPerson} readOnly
                            style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                          <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                          <input className="dc-float-input" placeholder=" " value={email} readOnly
                            style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed', paddingRight: 100 }} />
                          <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                          <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <PhoneField label="Phone" value={phone} onChange={setPhone} disabled />
                      <PhoneField label="Mobile" value={mobile} onChange={setMobile} disabled />
                    </div>
                  </div>

                  {/* Request Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Request Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                          <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-float-field" style={{ width: '100%' }}>
                      <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                        rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                      <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Attachments</h4>
                    <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                          stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
                    </div>
                    <FileUploadRow />
                  </div>

                </>)}

                {/* §4-CERT — Landing Certificate specific sections */}
                {serviceType === 'Landing Certificate' && (<>

                  {/* Basic Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Basic Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={CONSIGNEE_TYPE} readOnly
                            style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                          <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Type</label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={CONSIGNEE_CODE} readOnly
                            style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                          <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Code</label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <FloatDropdown label="Document Type" value={certDocType} onChange={setCertDocType} options={CERT_DOCUMENT_TYPES} />
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={certDocNo} onChange={e => setCertDocNo(e.target.value)} />
                          <label className="dc-float-label">Document Number <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div className="dc-float-wrapper dc-field--half" style={{ flex: '0 0 calc(50% - 8px)', maxWidth: 'calc(50% - 8px)' }}>
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={certHouseBill} onChange={e => setCertHouseBill(e.target.value)} />
                          <label className="dc-float-label">House Bill No.</label>
                        </div>
                      </div>
                      <button type="button" className="dc-btn dc-btn--blue"
                        style={{ height: 56, paddingLeft: 28, paddingRight: 28, marginTop: 0 }}
                        onClick={() => setCertBillInfo(true)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Bill Information (post-Search) */}
                  {certBillInfo && (
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
                            <input className="dc-float-input" placeholder=" " value={certGoodDesc} onChange={e => setCertGoodDesc(e.target.value)} />
                            <label className="dc-float-label">Good Description</label>
                          </div>
                        </div>
                        <div className="dc-float-wrapper dc-field--half">
                          <div className="dc-float-field">
                            <input className="dc-float-input" placeholder=" " value={purpose} onChange={e => setPurpose(e.target.value)} />
                            <label className="dc-float-label">Purpose<span className="dc-req"> *</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Payment</h4>
                    <div style={{ width: 'calc(50% - 8px)' }}>
                      <FloatDropdown label="Payment Account" value={certPayAcct} onChange={setCertPayAcct} options={CERT_PAYMENT_OPTIONS} />
                    </div>
                  </div>

                </>)}

              </>) : (<>

              {/* ════════════════════════════════════════════════════════
                  ALL OTHER SERVICES — generic layout
              ════════════════════════════════════════════════════════ */}

              {/* §2b — CTR Report Type */}
              {service === 'Request Customs Transaction Reports' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Report Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    {ctrType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">AED {ctrType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56 }}
                        />
                      </div>
                    )}
                    {ctrType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Report Description" value={ctrType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={ctrType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 20 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <FloatDropdown label="Report Type" required value={serviceType} onChange={setServiceType} options={CTR_TYPES.map(t => t.name)} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <FloatDropdown label="Format" required value={ctrFormat} onChange={setCtrFormat} options={['PDF', 'Excel', 'CSV']} />
                    </div>
                  </div>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                        <label className="dc-float-label">Date From <span className="dc-req">*</span></label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={dateTo} onChange={e => setDateTo(e.target.value)} />
                        <label className="dc-float-label">Date To <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* §2c — VD Contact Information + Request Information */}
              {service === 'Submit Voluntary Disclosure' && (<>
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Contact Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                        <input className="dc-float-input" placeholder=" " value={name} readOnly
                          style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                        <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                        <input className="dc-float-input" placeholder=" " value={company} readOnly
                          style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                        <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                        <input className="dc-float-input" placeholder=" " value={contactPerson} readOnly
                          style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                        <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                        <input className="dc-float-input" placeholder=" " value={email} readOnly
                          style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed', paddingRight: 100 }} />
                        <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                        <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="dc-form-row">
                    <PhoneField label="Phone" value={phone} onChange={setPhone} disabled />
                    <PhoneField label="Mobile" value={mobile} onChange={setMobile} disabled />
                  </div>
                </div>
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Request Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                        <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-float-field" style={{ width: '100%' }}>
                    <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                      rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                    <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                  </div>
                </div>
              </>)}

              {/* §3 — Contact Information (hidden for VD which has its own Basic Information section) */}
              {service !== 'Submit Voluntary Disclosure' && <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Contact Information</h4>
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                      <input className="dc-float-input" placeholder=" " value={name} readOnly
                        style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                      <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                      <input className="dc-float-input" placeholder=" " value={company} readOnly
                        style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                      <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                    </div>
                  </div>
                </div>
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                      <input className="dc-float-input" placeholder=" " value={contactPerson} readOnly
                        style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                      <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                      <input className="dc-float-input" placeholder=" " value={email} readOnly
                        style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed', paddingRight: 100 }} />
                      <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                      <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                    </div>
                  </div>
                </div>
                <div className="dc-form-row">
                  <PhoneField label="Phone" value={phone} onChange={setPhone} disabled />
                  <PhoneField label="Mobile" value={mobile} onChange={setMobile} disabled />
                </div>
              </div>}

              {/* §4 — Request Information (skip for Voluntary Disclosure which has its own combined section) */}
              {service !== 'Submit Voluntary Disclosure' && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Request Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                        <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-float-field" style={{ width: '100%' }}>
                    <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                      rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                    <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                  </div>
                </div>
              )}

              {/* §5 — Attachments */}
              <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Attachments</h4>
                {service === 'Submit Voluntary Disclosure' && (
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: '#697498', fontWeight: 600, fontFamily: font }}>NOTES:-</span>
                    <div style={{ marginTop: 6 }}>
                      <a href="#" onClick={e => e.preventDefault()}
                        style={{ fontSize: 14, color: '#1360d2', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                        Download Voluntary Disclosure Form
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
                <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                      stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
                </div>
                <FileUploadRow />
              </div>

            </>)}
            {/* end ternary */}
          </>
        )}
        </div>{/* end dc-form-card */}
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
        {service && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="dc-btn dc-btn--outline" style={{ height: 44, padding: '0 24px' }} onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 32px' }}
              onClick={() => setStage('pending')}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
