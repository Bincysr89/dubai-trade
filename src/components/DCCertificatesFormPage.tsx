import { useState, useRef, useEffect } from 'react';
import Header from './Header';

const font = "'Dubai', sans-serif";

type Props = { onBack: () => void };

/* ── Certificate service types (mirroring localhost:5174) ─────────────── */
const CERT_SERVICE_TYPES = [
  {
    name: 'NOC for Customs Broker License - New',
    description: 'This service provides customers to obtain No Objection Certificate for Customs Broker to Issue New License.',
    requirements: '1. Initial approval for the trade name & activity from DED',
    fees: '700.00',
  },
  {
    name: 'NOC for Customs Broker License - New Branch',
    description: 'Obtain a No Objection Certificate to open a new branch for an existing Customs Broker License.',
    requirements: 'Existing broker license, Branch address proof, Emirates ID copy, Trade license',
    fees: '300.00',
  },
  {
    name: 'NOC for Customs Broker License - Change of Owner',
    description: 'Obtain a No Objection Certificate to transfer ownership of a Customs Broker License.',
    requirements: 'Current license copy, New owner Emirates ID, MOU or transfer agreement, Trade license',
    fees: '400.00',
  },
  {
    name: 'NOC for Customs Broker License - Add New Partner',
    description: 'Obtain a No Objection Certificate to add a new partner to an existing Customs Broker License.',
    requirements: 'Existing license copy, New partner Emirates ID, Partnership agreement, Trade license',
    fees: '350.00',
  },
  {
    name: 'Landing Certificate',
    description: 'Official certificate confirming that goods have been landed and received at the destination port.',
    requirements: 'Bill of lading, Commercial invoice, Packing list, Declaration number',
    fees: '100.00',
  },
  {
    name: 'Vehicle Clearance Certificate (VCC)',
    description: 'Certificate confirming that a vehicle has been cleared through Dubai Customs with all duties paid.',
    requirements: 'Vehicle chassis number, Customs declaration, Invoice, Importer trade license',
    fees: '200.00',
  },
  {
    name: 'Clearance Letter',
    description: 'This service provides customers to obtain Clearance Certificate for Termination, company records, Change ownership, Add Partner, or Business Code Cancellation.',
    requirements: '1. Passport copy of the owner or authorized person and visa copy\n2. Letter from the company with business code and authorized person\n3. If license owner is not available: Power of Attorney, Share Certificate, or Letter from License Authority',
    fees: '100.00',
  },
  {
    name: 'VAT Registration Letter',
    description: 'Official letter confirming VAT registration status issued by Dubai Customs for trade purposes.',
    requirements: 'TRN (Tax Registration Number), Trade license, Emirates ID, Application form',
    fees: '100.00',
  },
  {
    name: 'Authorization to Issue Invoice in FZ',
    description: 'Authorization certificate allowing businesses in Free Zones to issue invoices for customs purposes.',
    requirements: 'Free Zone license, Emirates ID, Authorized signatory details, Application form',
    fees: '250.00',
  },
  {
    name: 'No Objection from Special Tasks Department',
    description: 'No Objection Certificate issued by the Special Tasks Department for regulated goods or activities.',
    requirements: 'Trade license, Emirates ID, Description of goods/activity, Supporting approvals if any',
    fees: '300.00',
  },
];

/* ── Float label dropdown ─────────────────────────────────────────────── */
function FloatDropdown({ label, required, value, onChange, options }: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative w-full" style={{ minHeight: 52 }}>
      <div
        className="relative w-full rounded-[6px] border cursor-pointer"
        style={{ border: open ? '1.5px solid #1360d2' : '1.5px solid #d5ddfb', background: 'white', minHeight: 52 }}
      >
        {open ? (
          <input
            ref={inputRef}
            className="w-full h-[52px] px-[14px] pt-[18px] text-[15px] bg-transparent focus:outline-none"
            style={{ fontFamily: font, color: '#0e1b3d' }}
            placeholder={value || 'Please select service type'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        ) : (
          <button
            type="button"
            className="w-full h-[52px] px-[14px] pt-[18px] text-left text-[15px] bg-transparent"
            style={{ fontFamily: font, color: value ? '#0e1b3d' : '#8f94ae' }}
            onClick={() => setOpen(true)}
          >
            {value || ''}
          </button>
        )}
        <label
          className="absolute left-[14px] text-[11px] font-medium pointer-events-none"
          style={{ top: 8, color: open ? '#1360d2' : '#8f94ae', fontFamily: font, transition: 'color 0.15s' }}
        >
          {label}{required && <span style={{ color: '#dc3545' }}> *</span>}
        </label>
        <svg className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8f94ae" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <div className="absolute z-50 w-full bg-white rounded-[6px] mt-[2px] overflow-y-auto"
          style={{ maxHeight: 240, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #e0e8f5' }}>
          {filtered.length > 0 ? filtered.map(opt => (
            <div key={opt}
              className="px-[14px] py-[10px] text-[15px] cursor-pointer hover:bg-[#eef4ff] transition-colors"
              style={{ fontFamily: font, color: value === opt ? '#1360d2' : '#0e1b3d', background: value === opt ? '#f0f5ff' : undefined }}
              onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
            >
              {opt}
            </div>
          )) : (
            <div className="px-[14px] py-[10px] text-[15px] text-[#8f94ae]" style={{ fontFamily: font }}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Float text input ─────────────────────────────────────────────────── */
function FloatInput({ label, required, value, onChange, type = 'text' }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;
  return (
    <div className="relative w-full" style={{ minHeight: 52 }}>
      <div className="relative rounded-[6px]" style={{ border: `1.5px solid ${focused ? '#1360d2' : '#d5ddfb'}`, background: 'white', minHeight: 52 }}>
        <input
          type={type}
          className="w-full h-[52px] px-[14px] bg-transparent focus:outline-none text-[15px]"
          style={{ fontFamily: font, color: '#0e1b3d', paddingTop: floated ? 18 : 0, transition: 'padding 0.15s' }}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={floated ? '' : label}
        />
        {floated && (
          <label className="absolute left-[14px] text-[11px] font-medium pointer-events-none"
            style={{ top: 8, color: focused ? '#1360d2' : '#8f94ae', fontFamily: font }}>
            {label}{required && <span style={{ color: '#dc3545' }}> *</span>}
          </label>
        )}
      </div>
    </div>
  );
}

/* ── Info card ─────────────────────────────────────────────────────────── */
function InfoCard({ iconColor, icon, label, value }: {
  iconColor: string; icon: React.ReactNode; label: string; value: React.ReactNode;
}) {
  return (
    <div className="flex gap-[12px] rounded-[8px] p-[14px]" style={{ border: '1px solid #e0e8f5', background: '#fafcff', flex: 1 }}>
      <div className="size-[36px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: iconColor }}>
        {icon}
      </div>
      <div className="flex flex-col gap-[2px] min-w-0">
        <span className="text-[12px] text-[#8f94ae] font-medium" style={{ fontFamily: font }}>{label}</span>
        <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font, whiteSpace: 'pre-line' }}>{value}</span>
      </div>
    </div>
  );
}

/* ── File upload ───────────────────────────────────────────────────────── */
function FileUpload() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-[8px] mb-[10px]">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-[8px] px-[10px] py-[6px] rounded-[6px]" style={{ border: '1px solid #d5ddfb', background: '#f5f8ff' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1360d2" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="text-[13px] text-[#0e1b3d]" style={{ fontFamily: font }}>{f}</span>
              <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-[#dc3545] hover:opacity-70 ml-[2px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        className={`flex flex-col items-center justify-center gap-[8px] rounded-[8px] p-[24px] transition-colors cursor-pointer`}
        style={{ border: `2px dashed ${dragging ? '#1360d2' : '#d5ddfb'}`, background: dragging ? '#eef4ff' : '#fafcff' }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files).map(f => f.name)]); }}
        onClick={() => ref.current?.click()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f94ae" strokeWidth="1.8">
          <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
        <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>Drag and drop files here</span>
        <span className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>— Or —</span>
        <button
          type="button"
          className="px-[16px] py-[7px] rounded-[4px] text-[14px] text-[#1360d2] font-medium"
          style={{ border: '1px solid #1360d2', background: 'white', fontFamily: font }}
          onClick={e => { e.stopPropagation(); ref.current?.click(); }}
        >
          Browse File
        </button>
        <input ref={ref} type="file" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) { setFiles(prev => [...prev, ...Array.from(e.target.files!).map(f => f.name)]); e.target.value = ''; } }} />
      </div>
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────────────────── */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-[10px] pb-[14px] mb-[18px]" style={{ borderBottom: '1px solid #e0e8f5' }}>
      <div className="w-[4px] h-[20px] rounded-full" style={{ background: '#1360d2' }} />
      <h3 className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{title}</h3>
    </div>
  );
}

/* ── Main form page ─────────────────────────────────────────────────────── */
export default function DCCertificatesFormPage({ onBack }: Props) {
  const [certServiceType, setCertServiceType] = useState('');
  const [name, setName]               = useState('');
  const [company, setCompany]         = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [remarks, setRemarks]         = useState('');
  const [submitted, setSubmitted]     = useState(false);

  const selectedCert = CERT_SERVICE_TYPES.find(t => t.name === certServiceType) ?? null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-[20px] px-10">
          <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="text-[24px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Request Submitted Successfully</h2>
          <p className="text-[16px] text-[#697498] text-center max-w-[480px]" style={{ fontFamily: font }}>
            Thank you! Your DC Certificates request has been submitted. Use your reference number for tracking.
          </p>
          <div className="px-[20px] py-[12px] rounded-[8px] text-[15px] font-semibold text-[#1360d2]" style={{ background: '#eef4ff', border: '1px solid #b3caff', fontFamily: font }}>
            Ref: DCC-{Math.floor(10000 + Math.random() * 90000)}
          </div>
          <button
            onClick={onBack}
            className="mt-[8px] px-[28px] py-[10px] rounded-[6px] text-[15px] text-white font-medium hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font }}
          >
            Back to Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[4px] text-[14px] mt-[16px] mb-[8px]" style={{ fontFamily: font }}>
          <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBack}>Home</span>
          <span className="text-[#dc3545] px-[4px]">/</span>
          <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBack}>Service Catalog</span>
          <span className="text-[#dc3545] px-[4px]">/</span>
          <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onBack}>DC - Certificates</span>
          <span className="text-[#dc3545] px-[4px]">/</span>
          <span className="text-[#111838] font-medium">New Request</span>
        </div>

        {/* Title row */}
        <div className="flex items-center gap-[12px] mb-[24px]">
          <button onClick={onBack} className="size-[36px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors" style={{ border: '1px solid #d5ddfb' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e1b3d" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <h1 className="text-[26px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>DC - Certificates</h1>
        </div>

        {/* Form tabs */}
        <div className="flex gap-[0px] mb-[24px] rounded-[6px] overflow-hidden" style={{ border: '1px solid #d5ddfb', width: 'fit-content' }}>
          {['New', 'Amend', 'Cancel', 'Enquiry'].map((tab, i) => (
            <button key={tab}
              className="px-[20px] py-[10px] text-[15px] font-medium transition-colors"
              style={{ fontFamily: font, background: i === 0 ? '#1360d2' : 'white', color: i === 0 ? 'white' : '#697498', borderRight: i < 3 ? '1px solid #d5ddfb' : 'none' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-[20px]">

          {/* ── Section 1: Service Details ─────────────────────────────── */}
          <div className="rounded-[10px] p-[24px]" style={{ background: 'white', border: '1px solid #e0e8f5', boxShadow: '0 2px 8px rgba(19,96,210,0.06)' }}>
            <SectionHeading title="Service Details" />
            <div className="flex gap-[12px]">
              <InfoCard
                iconColor="rgba(19,96,210,0.10)"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360d2" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
                label="Service Name"
                value="DC - Certificates"
              />
              <InfoCard
                iconColor="rgba(99,102,241,0.10)"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                label="Service Description"
                value="Request official certificates and No Objection Certificates issued by Dubai Customs for various trade and customs-related purposes."
              />
            </div>
          </div>

          {/* ── Section 2: Service Type Details ───────────────────────── */}
          <div className="rounded-[10px] p-[24px]" style={{ background: 'white', border: '1px solid #e0e8f5', boxShadow: '0 2px 8px rgba(19,96,210,0.06)' }}>
            <SectionHeading title="Service Type Details" />
            <div className="flex flex-col gap-[14px]">
              {/* Dropdown row */}
              <div className="flex items-center gap-[12px]">
                <div style={{ width: 'calc(50% - 6px)' }}>
                  <FloatDropdown
                    label="Service Type"
                    required
                    value={certServiceType}
                    onChange={setCertServiceType}
                    options={CERT_SERVICE_TYPES.map(t => t.name)}
                  />
                </div>
                {selectedCert && (
                  <InfoCard
                    iconColor="rgba(34,197,94,0.10)"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v4l3 3"/></svg>}
                    label="Charges"
                    value={<span className="text-[#16a34a] font-bold text-[15px]">AED {selectedCert.fees}</span>}
                  />
                )}
              </div>
              {/* Description + Requirements */}
              {selectedCert && (
                <div className="flex gap-[12px]">
                  <InfoCard
                    iconColor="rgba(99,102,241,0.10)"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                    label="Service Type Description"
                    value={selectedCert.description}
                  />
                  <InfoCard
                    iconColor="rgba(20,184,166,0.10)"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                    label="Requirements"
                    value={selectedCert.requirements}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Section 3: Contact Information ────────────────────────── */}
          <div className="rounded-[10px] p-[24px]" style={{ background: 'white', border: '1px solid #e0e8f5', boxShadow: '0 2px 8px rgba(19,96,210,0.06)' }}>
            <SectionHeading title="Contact Information" />
            <div className="flex flex-col gap-[14px]">
              <div className="flex gap-[12px]">
                <FloatInput label="Name" required value={name} onChange={setName} />
                <FloatInput label="Company" required value={company} onChange={setCompany} />
              </div>
              <div className="flex gap-[12px]">
                <FloatInput label="Contact Person" required value={contactPerson} onChange={setContactPerson} />
                <FloatInput label="Email Address" required value={email} onChange={setEmail} type="email" />
              </div>
              <div className="flex gap-[12px]">
                <div style={{ flex: 1 }}>
                  <FloatInput label="Phone Number" value={phone} onChange={setPhone} type="tel" />
                </div>
                <div style={{ flex: 1 }} />
              </div>
            </div>
          </div>

          {/* ── Section 4: Remarks ────────────────────────────────────── */}
          <div className="rounded-[10px] p-[24px]" style={{ background: 'white', border: '1px solid #e0e8f5', boxShadow: '0 2px 8px rgba(19,96,210,0.06)' }}>
            <SectionHeading title="Additional Remarks" />
            <div className="relative rounded-[6px]" style={{ border: '1.5px solid #d5ddfb' }}>
              <textarea
                rows={4}
                className="w-full px-[14px] pt-[20px] pb-[10px] text-[15px] bg-transparent focus:outline-none resize-none"
                style={{ fontFamily: font, color: '#0e1b3d' }}
                placeholder="Enter any additional remarks..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
              <label className="absolute left-[14px] top-[8px] text-[11px] font-medium pointer-events-none text-[#8f94ae]" style={{ fontFamily: font }}>
                Remarks
              </label>
            </div>
          </div>

          {/* ── Section 5: Attachments ────────────────────────────────── */}
          <div className="rounded-[10px] p-[24px]" style={{ background: 'white', border: '1px solid #e0e8f5', boxShadow: '0 2px 8px rgba(19,96,210,0.06)' }}>
            <SectionHeading title="Attachments" />
            <p className="text-[13px] text-[#8f94ae] mb-[14px]" style={{ fontFamily: font }}>
              Upload required documents. Accepted formats: PDF, JPG, PNG, DOCX (max 10 MB each)
            </p>
            <FileUpload />
          </div>

          {/* ── Action buttons ─────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-[12px] pt-[4px] pb-[20px]">
            <button
              onClick={onBack}
              className="px-[28px] py-[11px] rounded-[6px] text-[15px] font-medium transition-colors"
              style={{ border: '1.5px solid #d5ddfb', background: 'white', color: '#697498', fontFamily: font }}
            >
              Cancel
            </button>
            <button
              className="px-[28px] py-[11px] rounded-[6px] text-[15px] font-medium transition-opacity hover:opacity-90"
              style={{ border: '1.5px solid #d5ddfb', background: 'white', color: '#0e1b3d', fontFamily: font }}
            >
              Save as Draft
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className="px-[32px] py-[11px] rounded-[6px] text-[15px] text-white font-medium transition-opacity hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
