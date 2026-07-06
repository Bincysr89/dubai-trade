import React, { useRef, useState } from 'react';
import SaveExitModal from './SaveExitModal';
import BackToListingBar from './BackToListingBar';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MAX_SIZE_MB = 50;
const cloudUploadIcon = 'https://www.figma.com/api/mcp/asset/9e722d4d-9a2d-4d15-bb37-70e5aba612d5';

const MANDATORY_DOCS = [
  { docName: 'Export Bill',              docNature: 'Copy',                 mandatory: true },
  { docName: 'Bill of Entry',            docNature: 'Consignee Claim Copy', mandatory: true },
  { docName: 'Export Declaration',       docNature: 'Copy',                 mandatory: true },
  { docName: 'Exit / Entry Certificate', docNature: 'Original',             mandatory: true },
  { docName: 'Export Manifest',          docNature: 'Copy',                 mandatory: false },
  { docName: 'Other Documents',          docNature: 'Any',                  mandatory: false },
];

export type UploadedDoc = {
  id: string;
  declNo: string;
  docType: string;
  fileName: string;
  fileSize: number;
  uploadedOn: string;
  remarks: string;
};

type Props = {
  rows: Row[];
  onBack: () => void;
  onContinue: () => void;
  onBackToListing: () => void;
  onUploadedDocsChange?: (docs: UploadedDoc[]) => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DeclDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" style={{ minWidth: 240 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-[12px] bg-white rounded-[4px]"
        style={{ height: 44, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: FONT }}>
        <span className="text-[15px]" style={{ color: value ? '#051937' : '#697498' }}>
          {value || 'Select Declaration Number'}
        </span>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#697498" strokeWidth="2"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 48, boxShadow: '0px 4px 16px rgba(0,0,0,0.13)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[14px] py-[10px] text-[15px] cursor-pointer hover:bg-[#e8f0ff] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: FONT }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NonRemittanceDocumentsPage({ rows, onBack, onContinue, onBackToListing, onUploadedDocsChange }: Props) {
  const [selectedDecl, setSelectedDecl] = useState<string>(rows[0]?.declarationNo ?? '');
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const updateDocs = (fn: (prev: UploadedDoc[]) => UploadedDoc[]) => {
    setUploadedDocs(prev => { const next = fn(prev); onUploadedDocsChange?.(next); return next; });
  };
  const [dragging, setDragging] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let docCounter = 0;

  const today = new Date().toLocaleDateString('en-GB');

  const handleFile = (f: File) => {
    if (!selectedDecl || !selectedDocType) return;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return;
    docCounter += 1;
    updateDocs(prev => [...prev, {
      id: `${f.name}-${f.size}-${docCounter}`,
      declNo: selectedDecl,
      docType: selectedDocType,
      fileName: f.name,
      fileSize: f.size,
      uploadedOn: today,
      remarks: remarks.trim(),
    }]);
    setRemarks('');
  };

  const removeDoc = (id: string) => updateDocs(prev => prev.filter(d => d.id !== id));

  const canUpload = !!selectedDecl && !!selectedDocType;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 flex items-center gap-[16px] flex-wrap mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim - Non Remittance</h1>
          <span className="text-[16px] px-[10px] py-[3px] rounded-[4px]"
            style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Non Remittance
          </span>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={1} steps={NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">

          {/* Claimant & Broker Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: FONT, fontWeight: 500 }}>Claimant &amp; Broker Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
              {[
                { label: 'Claimant Type',   value: 'Business' },
                { label: 'Claimant Code',   value: 'AE-9106286' },
                { label: 'Claimant Name',   value: 'SW Logistics LLC' },
                { label: 'Beneficiary',     value: 'SW Logistics LLC (Business - AE-9106286)' },
                { label: 'Broker Code',     value: 'AE-9106286' },
                { label: 'Broker Name',     value: 'SW Logistics LLC' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-[4px]">
                  <span className="text-[16px] text-[#697498]" style={{ fontFamily: FONT }}>{f.label}</span>
                  <span className="text-[16px] text-[#051937]" style={{ fontFamily: FONT, fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two cards side by side */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

            {/* Left card — Declaration + Doc type + Remarks */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
              style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[16px] text-[#697498]">Select the declaration number, choose the document type and upload the supporting file.</p>
              </div>

              {/* Declaration dropdown + Remarks — one row */}
              <div className="flex gap-[16px] flex-wrap sm:flex-nowrap">
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Declaration Number</label>
                  <DeclDropdown
                    value={selectedDecl}
                    options={rows.map(r => r.declarationNo)}
                    onChange={(v) => { setSelectedDecl(v); setSelectedDocType(''); setRemarks(''); }}
                  />
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                    Remarks <span style={{ color: '#697498', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter remarks for this document…"
                    rows={3}
                    className="w-full rounded-[4px] text-[16px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[12px] py-[10px] resize-y focus:outline-none focus:border-[#1360d2] transition-colors"
                    style={{ border: '1px solid #d5ddfb', fontFamily: FONT, lineHeight: '22px' }}
                  />
                </div>
              </div>

              {/* Document types — shown after declaration selected */}
              {selectedDecl ? (
                <>
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Document Type</p>
                    <div className="grid grid-cols-2 gap-x-[12px] gap-y-[8px]">
                      {MANDATORY_DOCS.map(doc => {
                        const active = selectedDocType === doc.docName;
                        const uploaded = uploadedDocs.filter(u => u.declNo === selectedDecl && u.docType === doc.docName).length;
                        return (
                          <label
                            key={doc.docName}
                            onClick={() => setSelectedDocType(doc.docName)}
                            className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                            style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}
                          >
                            <span className="size-[17px] rounded-full flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                              style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                              {active && <span className="size-[7px] rounded-full" style={{ background: '#1360d2' }} />}
                            </span>
                            <input type="radio" className="sr-only" name="doc-type" value={doc.docName}
                              checked={active} onChange={() => setSelectedDocType(doc.docName)} />
                            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-[5px]">
                                <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                                  {doc.mandatory && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}
                                  {doc.docName}
                                </span>
                                <span className="text-[14px] px-[6px] py-[1px] rounded-[4px]"
                                  style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500, whiteSpace: 'nowrap' as const }}>
                                  {doc.docNature}
                                </span>
                              </div>
                            </div>
                            {uploaded > 0 && (
                              <span className="text-[11px] px-[6px] py-[1px] rounded-[10px] flex-shrink-0"
                                style={{ background: 'rgba(26,172,114,0.12)', color: '#1aac72', fontWeight: 600 }}>
                                {uploaded}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </>
              ) : (
                <p className="text-[16px] text-[#b0b8d0]">Select a declaration number to view required documents.</p>
              )}
            </div>

            {/* Right card — File uploader */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
              </div>

              {!canUpload && (
                <p className="text-[16px] text-[#b45309] px-[12px] py-[8px] rounded-[4px]"
                  style={{ background: '#fff8e6', border: '1px solid #f5d67a' }}>
                  {!selectedDecl ? 'Select a declaration first' : 'Select a document type to upload'}
                </p>
              )}

              <div
                onDragOver={e => { e.preventDefault(); if (canUpload) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault(); setDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f && canUpload) handleFile(f);
                }}
                className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors flex-1"
                style={{
                  border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`,
                  background: dragging ? '#edf3ff' : '#f8fafd',
                  cursor: canUpload ? 'default' : 'not-allowed',
                  opacity: canUpload ? 1 : 0.6,
                }}
              >
                <div className="size-[56px] rounded-full inline-flex items-center justify-center"
                  style={{ background: dragging ? '#d8e8ff' : '#e2ebf9' }}>
                  <img src={cloudUploadIcon} alt="" style={{ width: 26, height: 24 }} />
                </div>
                <p className="text-[16px] text-[#697498] text-center" style={{ lineHeight: 1.5 }}>Drag and drop or</p>
                <button type="button" disabled={!canUpload}
                  onClick={() => canUpload && fileInputRef.current?.click()}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                  style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: FONT, fontWeight: 500, background: '#fff', cursor: canUpload ? 'pointer' : 'not-allowed' }}>
                  Choose File
                </button>
              </div>

              <input ref={fileInputRef} type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,application/pdf,image/jpeg,image/png"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* Uploaded documents table */}
          {uploadedDocs.length > 0 && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[24px] py-[14px] border-b border-[#eef1f6]">
                <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      {['Declaration No.', 'Document Type', 'File Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedDocs.map(doc => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{doc.declNo}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{doc.docType}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-[8px]">
                            <div className="size-[28px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center" style={{ background: '#e8f0ff' }}>
                              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M5 2h7l3 3v12H5z" /><path d="M12 2v3h3" />
                              </svg>
                            </div>
                            <div className="flex flex-col gap-[1px]">
                              <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{doc.fileName}</span>
                              <span className="text-[11px] text-[#697498]">{formatBytes(doc.fileSize)}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#697498]">{doc.uploadedOn}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle', maxWidth: 180 }}>
                          <span className="text-[16px] text-[#455174]">{doc.remarks || '—'}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-[4px]">
                            <button type="button" onClick={() => {}}
                              title="Download"
                              className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#e8f0ff] transition-colors"
                              style={{ color: '#1360d2' }}>
                              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 3v10M5 12l5 5 5-5" /><path d="M3 17h14" />
                              </svg>
                            </button>
                            <button type="button" onClick={() => removeDoc(doc.id)}
                              title="Delete"
                              className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors"
                              style={{ color: '#dc3545' }}>
                              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <div className="flex items-center gap-[12px]">
            <button onClick={() => setShowSaveModal(true)}
              className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: FONT, fontWeight: 500 }}>
              Save &amp; Exit
            </button>
            <button onClick={onContinue}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', fontFamily: FONT, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Next
            </button>
          </div>
        }
      />
      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing} />}
    </div>
  );
}
