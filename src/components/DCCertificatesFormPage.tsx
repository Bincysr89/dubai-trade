import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

// ─── Certificate Service Types ────────────────────────────────────────────────
const CERT_SERVICE_TYPES = [
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

const DOCUMENT_TYPES  = ['Bill Number', 'Airway Bill Number'];
const PAYMENT_OPTIONS = ['543755', '46328', '78941', '23156'];

// ─── Float Dropdown ────────────────────────────────────────────────────────────
function FloatDropdown({ label, required, value, onChange, options, className, readOnly }: {
  label?: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; className?: string; readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref  = useRef<HTMLDivElement>(null);
  const iRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => iRef.current?.focus(), 50); } }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className={`dc-float-dropdown ${open ? 'dc-float-dropdown--open' : ''} ${value ? 'dc-float-dropdown--has-value' : ''} ${readOnly ? 'dc-float-dropdown--disabled' : ''} ${className ?? ''}`}>
      {open && !readOnly ? (
        <div className="dc-float-dropdown__trigger dc-float-dropdown__trigger--search">
          <input ref={iRef} className="dc-float-dropdown__inline-search" placeholder={value || 'Select…'} value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      ) : (
        <button type="button" className="dc-float-dropdown__trigger" onClick={() => !readOnly && setOpen(true)} disabled={readOnly}>
          {value || <span className="dc-float-dropdown__placeholder"> </span>}
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}
      {label && <label className="dc-float-dropdown__label">{label}{required && <span className="dc-req"> *</span>}</label>}
      {open && !readOnly && (
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
  const rm  = (i: number) => setFiles(p => p.filter((_, j) => j !== i));
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

// ─── Success / Submitted view (Figma 187-7865) ───────────────────────────────
function SubmittedView({ onBack, consigneeType, consigneeCode }: {
  onBack: () => void; consigneeType: string; consigneeCode: string;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '52px 40px', fontFamily: font,
    }}>
      {/* Green checkmark circle */}
      <div style={{
        width: 84, height: 84, borderRadius: '50%', background: '#27AE60',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ color: '#27AE60', fontSize: 22, fontWeight: 700, marginBottom: 28, fontFamily: font }}>
        Landing Certificate Request submitted Successfully
      </h2>

      {/* Info card */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 40px 24px',
        maxWidth: 860, width: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        marginBottom: 36,
      }}>
        {/* Message text */}
        <p style={{ color: '#697498', fontSize: 14, marginBottom: 10, fontFamily: font }}>
          Dear Customer Thank You For Using&nbsp; Service Request Web Application.
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 14, fontWeight: 700, marginBottom: 10, fontFamily: font }}>
          Your Request ForLanding Certificate Request Will Be Sent For Approval.
        </p>
        <p style={{ color: '#697498', fontSize: 14, marginBottom: 24, fontFamily: font }}>
          Please Find Below Details For Future Reference
        </p>

        {/* 4-column detail row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px', textAlign: 'left', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Request No.</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>R00723-513232</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Document No.</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>R00723-513232</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Consignee Type</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>{consigneeType || 'Testname'}</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Consignee Code</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>{consigneeCode || 'Testcompany'}</p>
          </div>
        </div>

        {/* Note */}
        <p style={{ fontSize: 13, color: '#697498', lineHeight: 1.6, fontFamily: font, textAlign: 'center' }}>
          Note: Please Take The Printout Of The Submission Form To The Customs Location Of Landing The Cargo For
          Obtaining The Landing Certificate The Landing Certificate Fee Of AED10 Will Be Collected From Your CDR
          Account On Issuance Of The Certificate
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 16 }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack} style={{ minWidth: 148 }}>
          Back To Listing
        </button>
        <button type="button" className="dc-btn dc-btn--outline" onClick={() => window.print()} style={{ minWidth: 120 }}>
          Print
        </button>
        <button type="button" className="dc-btn dc-btn--outline" style={{ minWidth: 148, color: '#1360D2', borderColor: '#1360D2', fontWeight: 700 }}>
          View Request
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DCCertificatesFormPage({ onBack }: { onBack: () => void }) {
  const [certServiceType, setCertServiceType] = useState('');
  const isLandingCert = certServiceType === 'Landing Certificate';

  // Basic Information (Landing Certificate)
  const consigneeType = 'AE-1019056';    // auto-populated
  const consigneeCode = 'Dubai Customs - Test LLC'; // auto-populated
  const [documentType,   setDocumentType]   = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [houseBillNo,    setHouseBillNo]    = useState('');
  const [showBillInfo,   setShowBillInfo]   = useState(false);
  const [goodDesc,       setGoodDesc]       = useState('');
  const [purpose,        setPurpose]        = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const selectedCert = CERT_SERVICE_TYPES.find(t => t.name === certServiceType) ?? null;

  const handleReset = () => {
    setCertServiceType(''); setDocumentType(''); setDocumentNumber('');
    setHouseBillNo(''); setShowBillInfo(false); setGoodDesc(''); setPurpose(''); setPaymentAccount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">
        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
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
            <span className="dc-breadcrumb__current">{submitted ? 'Request Submitted' : 'New Request'}</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h2 className="dc-info-header__title">DC - Certificates</h2>
        </div>

        {/* ── Submitted state ── */}
        {submitted ? (
          <SubmittedView onBack={onBack} consigneeType={consigneeType} consigneeCode={consigneeCode} />
        ) : (
          <div className="dc-form-card">

            {/* ── Section 1: Service Details ── */}
            <div className="dc-form-section dc-basic-info-section">
              <div className="dc-basic-info-header">
                <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Details</h4>
              </div>
              <div className="dc-basic-info-cards">
                <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Name</span>
                      <span className="dc-basic-info-card__value">DC - Certificates</span>
                    </div>
                  </div>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Description</span>
                      <span className="dc-basic-info-card__value">
                        This service allows customers to request various types of certificates and official documents from Dubai Customs, including NOCs, landing certificates, clearance letters, and other regulatory documents.
                      </span>
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
                <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 'calc(50% - 6px)' }}>
                    <FloatDropdown label="Service Type" required value={certServiceType}
                      onChange={v => { setCertServiceType(v); setShowBillInfo(false); setDocumentType(''); setDocumentNumber(''); setHouseBillNo(''); }}
                      options={CERT_SERVICE_TYPES.map(t => t.name)} />
                  </div>
                  {selectedCert && !isLandingCert && (
                    <div className="dc-basic-info-card" style={{ flex: 1, height: 56, alignItems: 'center' }}>
                      <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      </div>
                      <div className="dc-basic-info-card__body">
                        <span className="dc-basic-info-card__label">Charges</span>
                        <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">AED {selectedCert.fees}</span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedCert && !isLandingCert && (
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
                        <span className="dc-basic-info-card__value" style={{ whiteSpace: 'pre-line' }}>{selectedCert.description}</span>
                      </div>
                    </div>
                    {selectedCert.requirements && (
                      <div className="dc-basic-info-card" style={{ flex: 1 }}>
                        <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                        </div>
                        <div className="dc-basic-info-card__body">
                          <span className="dc-basic-info-card__label">Requirements</span>
                          <span className="dc-basic-info-card__value" style={{ whiteSpace: 'pre-line' }}>{selectedCert.requirements}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Landing Certificate sections ── */}
            {isLandingCert && (<>

              {/* ── Basic Information ── */}
              <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Basic Information</h4>

                {/* Row 1: Consignee Type (auto) + Consignee Code (auto) */}
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={consigneeType} readOnly
                        style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                      <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Type</label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={consigneeCode} readOnly
                        style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                      <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Code</label>
                    </div>
                  </div>
                </div>

                {/* Row 2: Document Type + Document Number */}
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <FloatDropdown label="Document Type" value={documentType} onChange={setDocumentType} options={DOCUMENT_TYPES} />
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} />
                      <label className="dc-float-label">Document Number <span className="dc-req">*</span></label>
                    </div>
                  </div>
                </div>

                {/* Row 3: House Bill No. + Search */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div className="dc-float-wrapper dc-field--half" style={{ flex: '0 0 calc(50% - 8px)', maxWidth: 'calc(50% - 8px)' }}>
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={houseBillNo} onChange={e => setHouseBillNo(e.target.value)} />
                      <label className="dc-float-label">House Bill No.</label>
                    </div>
                  </div>
                  <button type="button" className="dc-btn dc-btn--blue"
                    style={{ height: 56, paddingLeft: 28, paddingRight: 28, marginTop: 0 }}
                    onClick={() => setShowBillInfo(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              {/* ── Bill Information (post-Search) ── */}
              {showBillInfo && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Bill Information</h4>

                  {/* 5-column read-only row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 20 }}>
                    <div><p className="dc-bill-field__label">Bill of Entry No.</p><p className="dc-bill-field__value">1013245459</p></div>
                    <div><p className="dc-bill-field__label">Bill Date</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                    <div><p className="dc-bill-field__label">Bill of Lading No.</p><p className="dc-bill-field__value">BOL1211324</p></div>
                    <div><p className="dc-bill-field__label">Vessel</p><p className="dc-bill-field__value">Testname</p></div>
                    <div><p className="dc-bill-field__label">Voyage</p><p className="dc-bill-field__value">324422</p></div>
                  </div>

                  {/* Second read-only row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 24 }}>
                    <div><p className="dc-bill-field__label">Arrived From</p><p className="dc-bill-field__value">China</p></div>
                    <div><p className="dc-bill-field__label">Arrived On</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                    <div><p className="dc-bill-field__label">Marks &amp; Numbers</p><p className="dc-bill-field__value">N/A</p></div>
                  </div>

                  {/* Editable: Good Description + Purpose in one row */}
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
                        <label className="dc-float-label">Purpose<span className="dc-req"> *</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Payment ── */}
              <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Payment</h4>
                <div style={{ width: 'calc(50% - 8px)' }}>
                  <FloatDropdown label="Payment Account" value={paymentAccount} onChange={setPaymentAccount} options={PAYMENT_OPTIONS} />
                </div>
              </div>

            </>)}

          </div>
        )}
      </div>

      {/* ── Floating bottom bar ── */}
      {!submitted && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 40px',
        }}>
          {/* Left: back to listing */}
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

          {/* Right: Reset + Submit */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="dc-btn dc-btn--outline"
              style={{ height: 44, padding: '0 24px' }}
              onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="dc-btn dc-btn--blue"
              style={{ height: 44, padding: '0 32px' }}
              onClick={() => setSubmitted(true)}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
