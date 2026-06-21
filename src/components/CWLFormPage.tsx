import React, { useState, useRef } from 'react';
import Header from './Header';
import Dh from './Dh';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

// ─── Mock data ────────────────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { id: 'ACT001', desc: 'Storage of goods' },
  { id: 'ACT002', desc: 'Distribution of goods' },
  { id: 'ACT003', desc: 'Consolidation of goods' },
  { id: 'ACT004', desc: 'Deconsolidation of goods' },
  { id: 'ACT005', desc: 'Cross docking' },
  { id: 'ACT006', desc: 'Value added services' },
  { id: 'ACT007', desc: 'Bonded warehousing' },
  { id: 'ACT008', desc: 'Cold storage' },
];

const HS_DATA = [
  { code: '10059010', desc: 'Golden corn, excluding seed.' },
  { code: '10059090', desc: 'Maize (corn (other than golden, white & brown corn)), excluding seed.' },
  { code: '12149090', desc: 'Swedes, mangolds, fodder roots, hay, clover, sainfoin, forage kale & similar forage products.' },
  { code: '28431000', desc: 'Colloidal precious metals (for example, gold, platinum, silver).' },
  { code: '28433000', desc: 'Gold compounds.' },
  { code: '42060000', desc: 'Articles of gut (other than silk-worm gut), of goldbeaters skin, of bladders or of tendons.' },
  { code: '71069190', desc: 'Unwrought silver (including silver plated with gold or platinum), excluding ingots.' },
  { code: '71069200', desc: 'Semi-manufactured silver (including silver plated with gold or platinum).' },
  { code: '71081100', desc: 'Non-monetary gold in powder form.' },
  { code: '71081210', desc: 'Ingots of gold, non-monetary in unwrought forms.' },
];

const BUILDING_TYPES = [
  'Multi Storey Warehouse',
  'Single Storey Warehouse',
  'Cold Storage Warehouse',
  'Bonded Warehouse',
  'Open Yard',
];

const SECURITY_TYPES = ['Physical Security', 'Civil Defense', 'Fire and Safety'];

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({ step }: { step: number }) {
  const steps = ['Company Information', 'Warehouse', 'Upload Documents'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0 28px', gap: 0 }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const completed = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: completed ? '#276749' : active ? '#1360D2' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none',
              }}>
                {completed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <span style={{ color: active ? '#fff' : '#697498', fontSize: 13, fontWeight: 600 }}>{idx}</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1360D2' : completed ? '#276749' : '#697498', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: completed ? '#276749' : '#e2e8f0', margin: '0 8px', marginBottom: 22 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── File Upload Row ──────────────────────────────────────────────────────────
function FileUploadRow() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const add = (fl: FileList) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);
  const rm = (i: number) => setFiles(p => p.filter((_, j) => j !== i));
  return (
    <div>
      {files.length > 0 && (
        <div className="dc-file-grid" style={{ marginBottom: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="dc-file-input-wrap">
              <svg className="dc-file-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="dc-file-input-text">{f}</span>
              <div className="dc-file-input-trail">
                <button className="dc-file-tag__remove" type="button" onClick={() => rm(i)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        className={`dc-dropzone${dragging ? ' dc-dropzone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}
      >
        <div className="dc-dropzone__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
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

// ─── Shared field helper ──────────────────────────────────────────────────────
function FloatField({ label, required, value, onChange, readOnly, style }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; readOnly?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div className="dc-float-wrapper dc-field--half" style={style}>
      <div className="dc-float-field">
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          style={readOnly ? { background: '#f5f7fa', cursor: 'default', color: '#697498' } : undefined}
        />
        <label className="dc-float-label">{label}{required && <span className="dc-req"> *</span>}</label>
      </div>
    </div>
  );
}

// ─── Float Select (custom dropdown matching FloatField design) ────────────────
function FloatSelect({ label, required, value, onChange, options, style }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const hasValue = !!value;
  const active = hasValue || open;
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ ...style, position: 'relative' }}>
      <div
        className="dc-float-field"
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        tabIndex={0}
        style={{ cursor: 'pointer', outline: 'none', borderColor: open ? '#1360D2' : undefined, boxShadow: open ? '0 0 0 2px rgba(19,96,210,0.10)' : undefined }}
      >
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', fontSize: 16, fontFamily: font, color: hasValue ? '#0e1b3d' : 'transparent', paddingLeft: 14, paddingRight: 36, boxSizing: 'border-box' as const }}>
          {value || ' '}
        </div>
        <label className="dc-float-label" style={active ? { pointerEvents: 'none', top: 0, transform: 'translateY(-50%)', fontSize: '12px', color: open ? '#1360D2' : '#697498', fontWeight: 500, background: '#fff', padding: '0 4px' } : { pointerEvents: 'none' }}>
          {label}{required && <span className="dc-req"> *</span>}
        </label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
            <path d={open ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'} stroke="#697498" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300, background: '#fff', border: '1px solid #d5ddfb', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
          {options.map(opt => (
            <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 16, fontFamily: font, color: '#0e1b3d', borderBottom: '1px solid #f0f4ff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Field with autocomplete ──────────────────────────────────────────
function SearchField({ label, required, value, onChange, suggestions, onSelect }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  suggestions: { id: string; desc: string }[]; onSelect: (id: string, desc: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const filtered = value
    ? suggestions.filter(s =>
        s.id.toLowerCase().includes(value.toLowerCase()) ||
        s.desc.toLowerCase().includes(value.toLowerCase())
      )
    : suggestions.slice(0, 5);
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ position: 'relative' }}>
      <div className="dc-float-field" style={{ position: 'relative' }}>
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          style={{ paddingRight: 36 }}
        />
        <label className="dc-float-label">{label}{required && <span className="dc-req"> *</span>}</label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" /><path d="M17 17l4 4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300,
          background: '#fff', border: '1px solid #d5ddfb', borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto',
        }}>
          {filtered.map(s => (
            <div
              key={s.id}
              onMouseDown={() => { onSelect(s.id, s.desc); setOpen(false); }}
              style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f4ff', display: 'flex', gap: 10, alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <span style={{ color: '#1360D2', fontWeight: 600, fontSize: 16, minWidth: 80 }}>{s.id}</span>
              <span style={{ color: '#697498', fontSize: 16 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delete icon ──────────────────────────────────────────────────────────────
function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#697498', padding: 4 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </svg>
    </button>
  );
}

// ─── Add button (same height as input fields = 56px) ─────────────────────────
function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      background: '#1360D2', color: '#fff', border: 'none', borderRadius: 8,
      height: 56, padding: '0 20px', cursor: 'pointer', fontSize: 15, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add
    </button>
  );
}

// ─── Three-dot flyout menu ───────────────────────────────────────────────────
function ThreeDotMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: '50%' }}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 30, zIndex: 200,
          background: '#fff', border: '1px solid #f0f0f5', borderRadius: 8,
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)', width: 120, overflow: 'hidden',
        }}>
          {[{ label: 'Edit', action: () => setOpen(false) }, { label: 'Delete', action: onDelete }].map(item => (
            <button
              key={item.label}
              type="button"
              onMouseDown={() => { item.action(); setOpen(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 15, color: '#111838', fontFamily: font }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Table head row ───────────────────────────────────────────────────────────
function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ background: '#a6c2e9' }}>
        {cols.map((c, i) => (
          <th key={i} style={{ padding: '10px 12px', textAlign: i === cols.length - 1 && c === 'Action' ? 'center' : 'left', fontWeight: 500, width: c === 'Action' ? 70 : undefined }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Success field ────────────────────────────────────────────────────────────
function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CWLFormPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1); // 1, 2, 3
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Company Information
  const [importerCode, setImporterCode] = useState('C0021 - CONSOLIDATED SHIPPING SERVICES L.L.C');
  const [creditAccount, setCreditAccount] = useState('12522');
  const [applicantName, setApplicantName] = useState('rowmahs');
  const [designation, setDesignation] = useState('manager');
  const [phoneNo, setPhoneNo] = useState('971507483292');
  const [mobileNo, setMobileNo] = useState('971507483292');
  const [faxNo, setFaxNo] = useState('0422222');
  const [applicantEmail, setApplicantEmail] = useState('dubaitradetechnicalsupport@dubaitrade.ae');
  const [accredited, setAccredited] = useState(false);

  // Step 2 — Warehouse Details
  const [warehouseNo, setWarehouseNo] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [address, setAddress] = useState('');
  const [warehousePhone, setWarehousePhone] = useState('');
  const [faxNoW, setFaxNoW] = useState('');
  const [buildingType, setBuildingType] = useState('Multi Storey Warehouse');
  const [totalArea, setTotalArea] = useState('');

  // Warehouse list (saved warehouses)
  const [savedWarehouses, setSavedWarehouses] = useState<{ no: string; name: string; location: string; building: string; area: string }[]>([]);
  const [warehouseListMode, setWarehouseListMode] = useState(false);

  // Types of Activities
  const [activityId, setActivityId] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activities, setActivities] = useState([{ id: '19-11-2025', desc: 'Debit Account' }]);

  // Commodities
  const [hsCode, setHsCode] = useState('');
  const [commodityDesc, setCommodityDesc] = useState('');
  const [commodities, setCommodities] = useState([{ code: '19-11-2025', desc: 'Debit Account' }]);

  // Security
  const [securityType, setSecurityType] = useState('');
  const [securityList, setSecurityList] = useState([{ type: '19-11-2025' }]);

  // Contact Details
  const [contactName, setContactName] = useState('');
  const [contactDesig, setContactDesig] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contacts, setContacts] = useState([{ name: '19-11-2025', desig: 'Debit Account', mobile: 'Debit Account' }]);

  // Banner
  const [bannerOpen, setBannerOpen] = useState(true);

  // Breadcrumb segment per step
  const stepSegments: Record<number, string> = {
    1: 'Company Information',
    2: 'Warehouse',
    3: 'Upload Documents',
  };
  const currentSegment = submitted ? 'Request Submitted' : stepSegments[step];

  // ── Add handlers ─────────────────────────────────────────────────────────────
  const addActivity = () => {
    if (!activityId && !activityDesc) return;
    setActivities(p => [...p, { id: activityId || '—', desc: activityDesc || '—' }]);
    setActivityId(''); setActivityDesc('');
  };

  const addCommodity = () => {
    if (!hsCode && !commodityDesc) return;
    setCommodities(p => [...p, { code: hsCode || '—', desc: commodityDesc || '—' }]);
    setHsCode(''); setCommodityDesc('');
  };

  const addSecurity = () => {
    if (!securityType) return;
    setSecurityList(p => [...p, { type: securityType }]);
    setSecurityType('');
  };

  const addContact = () => {
    if (!contactName && !contactDesig && !contactMobile) return;
    setContacts(p => [...p, { name: contactName || '—', desig: contactDesig || '—', mobile: contactMobile || '—' }]);
    setContactName(''); setContactDesig(''); setContactMobile('');
  };

  // ── Service Details card (step 1 only) ───────────────────────────────────────
  const ServiceDetailsCard = () => (
    <div className="dc-form-section dc-basic-info-section">
      <div className="dc-basic-info-header">
        <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Details</h4>
      </div>
      <div className="dc-basic-info-cards">
        <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Service Name</span>
              <span className="dc-basic-info-card__value">Custom Warehouse License</span>
            </div>
          </div>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
              <Dh style={{ width: 18, height: 18 }} />
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Charges</span>
              <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">AED 25000.00</span>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Service Description</span>
              <span className="dc-basic-info-card__value">This service allows clients to submit a request for enrollment in Dubai Customs Client Accreditation Program.</span>
            </div>
          </div>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Requirements</span>
              <span className="dc-basic-info-card__value">Copy of trade license</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Step 1 content ────────────────────────────────────────────────────────────
  const Step1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dc-form-card">
        <ServiceDetailsCard />

        {/* Company Information */}
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Company Information</h4>
          <div className="dc-form-row">
            <FloatField label="Importer Code" value={importerCode} onChange={setImporterCode} />
            <FloatField label="Credit Account Number" value={creditAccount} onChange={setCreditAccount} />
          </div>
        </div>

        {/* Particulars of Applicant */}
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Particulars of Applicant</h4>
          <div className="dc-form-row">
            <FloatField label="Name" required value={applicantName} onChange={setApplicantName} style={{ minWidth: 0 }} />
            <FloatField label="Designation" required value={designation} onChange={setDesignation} style={{ minWidth: 0 }} />
            <FloatField label="Phone No." required value={phoneNo} onChange={setPhoneNo} style={{ minWidth: 0 }} />
            <FloatField label="Mobile No." required value={mobileNo} onChange={setMobileNo} style={{ minWidth: 0 }} />
          </div>
          <div className="dc-form-row">
            <FloatField label="Fax No." required value={faxNo} onChange={setFaxNo} style={{ minWidth: 0 }} />
            <FloatField label="Email" required value={applicantEmail} onChange={setApplicantEmail} style={{ minWidth: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <input type="checkbox" checked={accredited} onChange={e => setAccredited(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1360D2' }} />
            <span style={{ fontSize: 16, color: '#0E1B3D' }}>Are you an accredited client of customs</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Add warehouse handler ─────────────────────────────────────────────────────
  const handleAddWarehouse = () => {
    setSavedWarehouses(prev => [...prev, {
      no: warehouseNo || '—',
      name: warehouseName || '—',
      location: warehouseLocation || '—',
      building: buildingType || '—',
      area: totalArea || '—',
    }]);
    setWarehouseListMode(true);
  };

  const handleAddNewWarehouse = () => {
    setWarehouseNo(''); setWarehouseName(''); setWarehouseLocation('');
    setAddress(''); setWarehousePhone(''); setFaxNoW('');
    setBuildingType('Multi Storey Warehouse'); setTotalArea('');
    setActivities([{ id: '19-11-2025', desc: 'Debit Account' }]);
    setCommodities([{ code: '19-11-2025', desc: 'Debit Account' }]);
    setSecurityList([{ type: '19-11-2025' }]);
    setContacts([{ name: '19-11-2025', desig: 'Debit Account', mobile: 'Debit Account' }]);
    setWarehouseListMode(false);
  };

  // ── Step 2 content ────────────────────────────────────────────────────────────
  const Step2 = () => {
    if (warehouseListMode) {
      return (
        <div className="dc-form-card">
          <div className="dc-form-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Warehouses</h4>
              <button
                type="button"
                className="dc-btn dc-btn--blue"
                style={{ fontSize: 14, padding: '7px 18px' }}
                onClick={handleAddNewWarehouse}
              >
                + Add New Warehouse
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Warehouse No.', 'Warehouse Name', 'Location', 'Action']} />
              <tbody>
                {savedWarehouses.map((w, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px' }}>{w.no}</td>
                    <td style={{ padding: '10px 12px' }}>{w.name}</td>
                    <td style={{ padding: '10px 12px' }}>{w.location}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setSavedWarehouses(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Warehouse Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Warehouse Details</h4>
            <div className="dc-form-row">
              <FloatField label="Warehouse No." required value={warehouseNo} onChange={setWarehouseNo} style={{ minWidth: 0 }} />
              <FloatField label="Warehouse Name" required value={warehouseName} onChange={setWarehouseName} style={{ minWidth: 0 }} />
              <FloatField label="Warehouse Location" required value={warehouseLocation} onChange={setWarehouseLocation} style={{ minWidth: 0 }} />
              <FloatField label="Address" required value={address} onChange={setAddress} style={{ minWidth: 0 }} />
            </div>
            <div className="dc-form-row">
              <FloatField label="Phone No." required value={warehousePhone} onChange={setWarehousePhone} style={{ minWidth: 0 }} />
              <FloatField label="Fax No." required value={faxNoW} onChange={setFaxNoW} style={{ minWidth: 0 }} />
              <FloatSelect label="Building Type" required value={buildingType} onChange={setBuildingType} options={BUILDING_TYPES} style={{ minWidth: 0 }} />
              <FloatField label="Total Area (in sq ft.)" value={totalArea} onChange={setTotalArea} style={{ minWidth: 0 }} />
            </div>
          </div>
        </div>

        {/* Types of Activities */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Types of Activities</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <SearchField
                label="Activity ID"
                required
                value={activityId}
                onChange={v => { setActivityId(v); setActivityDesc(''); }}
                suggestions={ACTIVITY_DATA}
                onSelect={(id, desc) => { setActivityId(id); setActivityDesc(desc); }}
              />
              <FloatField label="Activity Description" value={activityDesc} onChange={setActivityDesc} readOnly />
              <AddBtn onClick={addActivity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Activity ID', 'Activity Description', 'Action']} />
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{a.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{a.desc}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setActivities(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodities */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Commodities</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <SearchField
                label="HS Code"
                required
                value={hsCode}
                onChange={v => { setHsCode(v); setCommodityDesc(''); }}
                suggestions={HS_DATA.map(h => ({ id: h.code, desc: h.desc }))}
                onSelect={(id, desc) => { setHsCode(id); setCommodityDesc(desc); }}
              />
              <FloatField label="Description" value={commodityDesc} onChange={setCommodityDesc} readOnly />
              <AddBtn onClick={addCommodity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['HS Code', 'Description', 'Action']} />
              <tbody>
                {commodities.map((c, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.code}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.desc}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setCommodities(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Safety Information */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Security &amp; Safety Information</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <FloatSelect
                label="Type of Security"
                required
                value={securityType}
                onChange={setSecurityType}
                options={SECURITY_TYPES}
                style={{ maxWidth: '48%', minWidth: 0 }}
              />
              <AddBtn onClick={addSecurity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Type of Security', 'Action']} />
              <tbody>
                {securityList.map((s, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{s.type}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setSecurityList(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Contact Details</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <FloatField label="Name" required value={contactName} onChange={setContactName} style={{ minWidth: 0 }} />
              <FloatField label="Designation" required value={contactDesig} onChange={setContactDesig} style={{ minWidth: 0 }} />
              <FloatField label="Mobile No." required value={contactMobile} onChange={setContactMobile} style={{ minWidth: 0 }} />
              <AddBtn onClick={addContact} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Name', 'Designation', 'Mobile No.', 'Action']} />
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.desig}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.mobile}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setContacts(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Step 3 content ────────────────────────────────────────────────────────────
  const Step3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dc-form-card">
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Attachments</h4>
          <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
          </div>
          <FileUploadRow />
        </div>
      </div>
    </div>
  );

  // ── Success state (Figma node 186-7781) ──────────────────────────────────────
  const SuccessView = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 40px', textAlign: 'center',
      fontFamily: font,
    }}>
      {/* Green checkmark circle */}
      <div style={{
        width: 84, height: 84, borderRadius: '50%', background: '#27AE60',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ color: '#27AE60', fontSize: 22, fontWeight: 700, marginBottom: 32, fontFamily: font }}>
        Customs warehouse License Request submitted Successfully
      </h2>

      {/* Info card */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '32px 48px',
        maxWidth: 640, width: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        marginBottom: 40,
      }}>
        <p style={{ color: '#697498', fontSize: 15, marginBottom: 12, fontFamily: font }}>
          Dear Customer Thank You For Using&nbsp; Service Request Web Application.
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: font }}>
          Your Request For Customs Warehouse License Will Be Sent For Approval.
        </p>
        <p style={{ color: '#697498', fontSize: 15, marginBottom: 24, fontFamily: font }}>
          Please Find Below Details For Future Reference
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 16, fontWeight: 700, fontFamily: font }}>
          Request Number: 560010545
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 20 }}>
        <button
          type="button"
          className="dc-btn dc-btn--outline"
          style={{ minWidth: 140 }}
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          type="button"
          className="dc-btn dc-btn--outline"
          style={{ minWidth: 140, color: '#1360D2', borderColor: '#1360D2', fontWeight: 700 }}
        >
          View Request
        </button>
      </div>
    </div>
  );

  // ── Bottom bars ───────────────────────────────────────────────────────────────
  const BottomBar = () => {
    if (submitted) {
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center',
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
          <button type="button" className="dc-btn dc-btn--outline">Clear</button>
          <div style={{ flex: 1 }} />
          <button type="button" className="dc-btn dc-btn--blue" onClick={() => setStep(2)}>Proceed</button>
        </div>
      );
    }
    if (step === 2) {
      if (warehouseListMode) {
        return (
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
            <button type="button" className="dc-btn dc-btn--blue" onClick={() => setStep(3)}>Proceed</button>
          </div>
        );
      }
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
          <button type="button" className="dc-btn dc-btn--outline">Reset</button>
          <div style={{ flex: 1 }} />
          <button type="button" className="dc-btn dc-btn--blue" onClick={handleAddWarehouse}>Add Warehouse</button>
        </div>
      );
    }
    // step === 3
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 40px',
      }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 12H5m7-7-7 7 7 7" />
          </svg>
          Back to Listing
        </button>
        <button type="button" className="dc-btn dc-btn--outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={() => setStep(2)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 12H5m7-7-7 7 7 7" />
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="dc-btn dc-btn--blue" onClick={() => setSubmitted(true)}>Submit</button>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Custom Warehouse License</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <span className="dc-breadcrumb__current">{currentSegment}</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <button className="dc-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7" /></svg>
          </button>
          <h2 className="dc-info-header__title">Custom Warehouse License</h2>
        </div>

        {/* Stepper card */}
        {!submitted && (
          <div className="dc-form-card" style={{ marginBottom: 12 }}>
            <div className="dc-form-section" style={{ padding: '0 16px' }}>
              <Stepper step={step} />
            </div>
          </div>
        )}

        {/* Step content */}
        {submitted ? (
          <SuccessView />
        ) : step === 1 ? (
          <Step1 />
        ) : step === 2 ? (
          <Step2 />
        ) : (
          <Step3 />
        )}
      </div>

      {/* Floating bottom bar */}
      <BottomBar />
    </div>
  );
}
