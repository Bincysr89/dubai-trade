import { useState, useRef, useEffect } from 'react';
import Header from './Header';
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

// ─── Types ────────────────────────────────────────────────────────────────────
export type ServiceTypeOption = {
  name: string;
  fees: string;
  description: string;
  requirements: string;
};

export type GenericServiceConfig = {
  serviceName: string;
  serviceDescription: string;
  charges: string;
  requirements: string;
  breadcrumbLabel: string;
  serviceTypes: ServiceTypeOption[];
};

// ─── Float Dropdown ───────────────────────────────────────────────────────────
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
    <div ref={ref} className={`dc-float-dropdown ${open ? 'dc-float-dropdown--open' : ''} ${value ? 'dc-float-dropdown--has-value' : ''} ${className ?? ''}`}>
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
              <div key={opt} className={`dc-float-dropdown__option ${value === opt ? 'dc-float-dropdown__option--selected' : ''}`}
                onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}>{opt}</div>
            )) : <div className="dc-float-dropdown__no-results">No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── File Upload Row ──────────────────────────────────────────────────────────
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

// ─── Success View ─────────────────────────────────────────────────────────────
function SuccessView({
  config, serviceType, name, company, email, subject, onBack,
}: {
  config: GenericServiceConfig;
  serviceType: string; name: string; company: string; email: string; subject: string;
  onBack: () => void;
}) {
  const [bannerOpen, setBannerOpen] = useState(true);
  const REF = 'R00723-513234';
  const selectedType = config.serviceTypes.find(t => t.name === serviceType);

  function SField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="dc-success-field">
        <span className="dc-success-field__label">{label}</span>
        <span className="dc-success-field__value">{value}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Card 1 — Request Details */}
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
            <SField label="Request Number" value={REF} />
            <SField label="Request Status" value={<span className="dc-badge dc-badge--draft">Under Process</span>} />
            <SField label="Service" value={config.serviceName} />
            <SField label="Service Type" value={serviceType} />
            <SField label="Name" value={name || 'Testname'} />
            <SField label="Company" value={company || 'Testcompany'} />
            <SField label="Email" value={email || 'clasherschenmad@gmail.com'} />
            <SField label="Subject" value={subject || 'Test'} />
          </div>
        </div>
      </div>

      {/* Card 2 — Charges Summary */}
      <div className="dc-form-card">
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Charges Summary</h4>
          <div className="dc-success-grid" style={{ marginBottom: 20 }}>
            <SField label="Payment Mode" value="Credit Card" />
            <SField label="Payment Status" value="Success" />
            <SField label="Receipt No." value="Z-12323" />
            <SField label="Payment Reference No." value="5900080808" />
          </div>
          <hr className="dc-success-divider" />
          <table className="dc-charges__table">
            <thead><tr><th>Charge</th><th>Amount</th></tr></thead>
            <tbody>
              <tr>
                <td>{serviceType || config.serviceName} Fee</td>
                <td>AED {selectedType?.fees ?? config.charges}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Amount</strong></td>
                <td><strong>AED {selectedType?.fees ?? config.charges}</strong></td>
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
              <SField label="Initiated By" value="AE-1019056" />
              <SField label="Request No." value={REF} />
              <SField label="Amount" value={`${selectedType?.fees ?? config.charges}`} />
              <SField label="Transaction Status" value="Success" />
              <SField label="DEG Transaction No" value="590000237140228" />
              <SField label="Transaction Date" value="Fri May 15 00:00:00 GST 2026" />
              <SField label="Payment Status" value="Success" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, padding: '8px 0 20px' }}>
        <button className="dc-btn dc-btn--outline" onClick={onBack}>Back to Listing</button>
        <button className="dc-btn dc-btn--outline" onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
}

// ─── Main Form Page ───────────────────────────────────────────────────────────
export default function GenericServiceFormPage({
  config, onBack,
}: {
  config: GenericServiceConfig;
  onBack: () => void;
}) {
  // Service type
  const [serviceType, setServiceType] = useState('');
  const selectedType = config.serviceTypes.find(t => t.name === serviceType) ?? null;

  // Contact Information
  const [name,          setName]          = useState(AUTOFILL_USER.name);
  const [company,       setCompany]       = useState(AUTOFILL_USER.company);
  const [contactPerson, setContactPerson] = useState(AUTOFILL_USER.contactPerson);
  const [email,         setEmail]         = useState(AUTOFILL_USER.email);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phone,         setPhone]         = useState(AUTOFILL_USER.phone);
  const [mobile,        setMobile]        = useState(AUTOFILL_USER.mobile);

  // Request Information
  const [subject, setSubject] = useState('');
  const [desc,    setDesc]    = useState('');

  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    setServiceType(''); setName(AUTOFILL_USER.name); setCompany(AUTOFILL_USER.company);
    setContactPerson(AUTOFILL_USER.contactPerson); setEmail(AUTOFILL_USER.email);
    setEmailVerified(true); setPhone(AUTOFILL_USER.phone); setMobile(AUTOFILL_USER.mobile);
    setSubject(''); setDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

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
            <button className="dc-breadcrumb__link" onClick={onBack}>{config.breadcrumbLabel}</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">{submitted ? 'Request Submitted' : 'New Request'}</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h2 className="dc-info-header__title">{config.breadcrumbLabel}</h2>
        </div>

        {/* ── Submitted View ── */}
        {submitted ? (
          <SuccessView
            config={config} serviceType={serviceType} name={name}
            company={company} email={email} subject={subject} onBack={onBack}
          />
        ) : (
          <div className="dc-form-card">

            {/* ── Section 1: Service Details ── */}
            <div className="dc-form-section dc-basic-info-section">
              <div className="dc-basic-info-header">
                <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Details</h4>
              </div>
              <div className="dc-basic-info-cards">
                {/* Row 1: Service Name + Charges */}
                <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Name</span>
                      <span className="dc-basic-info-card__value">{config.serviceName}</span>
                    </div>
                  </div>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Charges</span>
                      <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">AED {config.charges}</span>
                    </div>
                  </div>
                </div>
                {/* Row 2: Description + Requirements */}
                <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Description</span>
                      <span className="dc-basic-info-card__value">{config.serviceDescription}</span>
                    </div>
                  </div>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Requirements</span>
                      <span className="dc-basic-info-card__value">{config.requirements}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Service Type Details ── */}
            <div className="dc-form-section dc-basic-info-section">
              <div className="dc-basic-info-header">
                <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
              </div>
              <div className="dc-basic-info-cards">
                {/* Row 1: Dropdown + Charges */}
                <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 'calc(50% - 6px)' }}>
                    <FloatDropdown label="Service Type" required value={serviceType}
                      onChange={v => setServiceType(v)}
                      options={config.serviceTypes.map(t => t.name)} />
                  </div>
                  {selectedType && (
                    <div className="dc-basic-info-card" style={{ flex: 1, height: 56, alignItems: 'center' }}>
                      <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      </div>
                      <div className="dc-basic-info-card__body">
                        <span className="dc-basic-info-card__label">Charges</span>
                        <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">AED {selectedType.fees}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Row 2: Description + Requirements */}
                {selectedType && (
                  <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                    <div className="dc-basic-info-card" style={{ flex: 1 }}>
                      <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div className="dc-basic-info-card__body">
                        <span className="dc-basic-info-card__label">Service Type Description</span>
                        <span className="dc-basic-info-card__value">{selectedType.description}</span>
                      </div>
                    </div>
                    {selectedType.requirements && (
                      <div className="dc-basic-info-card" style={{ flex: 1 }}>
                        <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                        </div>
                        <div className="dc-basic-info-card__body">
                          <span className="dc-basic-info-card__label">Requirements</span>
                          <span className="dc-basic-info-card__value">{selectedType.requirements}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 3: Contact Information ── */}
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Contact Information</h4>

              {/* Row 1: Name + Company */}
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

              {/* Row 2: Contact Person + Email */}
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
                    <span className="dc-verified-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Phone + Mobile */}
              <div className="dc-form-row">
                <div className="dc-float-wrapper dc-field--half">
                  <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                    <input className="dc-float-input" placeholder=" " value={phone} readOnly
                      style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                    <label className="dc-float-label">Phone</label>
                  </div>
                </div>
                <div className="dc-float-wrapper dc-field--half">
                  <div className="dc-float-field" style={{ background: '#f5f7fa' }}>
                    <input className="dc-float-input" placeholder=" " value={mobile} readOnly
                      style={{ background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }} />
                    <label className="dc-float-label">Mobile</label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4: Request Information ── */}
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Request Information</h4>

              {/* Subject */}
              <div className="dc-form-row">
                <div className="dc-float-wrapper dc-field--half">
                  <div className="dc-float-field">
                    <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                    <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                  </div>
                </div>
              </div>

              {/* Description textarea */}
              <div className="dc-float-field" style={{ width: '100%' }}>
                <textarea
                  className="dc-float-input"
                  placeholder=" "
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={4}
                  style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }}
                />
                <label className="dc-float-label">Description <span className="dc-req">*</span></label>
              </div>
            </div>

            {/* ── Section 5: Attachments ── */}
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

          </div>
        )}
      </div>

      {/* ── Floating Bottom Bar ── */}
      {!submitted && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 40px',
        }}>
          <button type="button" onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 44, padding: '0 20px', borderRadius: 6,
              border: '1.5px solid #d5ddfb', background: '#fff',
              fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7"/>
            </svg>
            Back to Listing
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="dc-btn dc-btn--outline" style={{ height: 44, padding: '0 24px' }} onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 32px' }} onClick={() => setSubmitted(true)}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
