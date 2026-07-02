import React, { useRef, useState } from 'react';
import BackToListingBar from './BackToListingBar';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MAX_SIZE_MB = 50;
const cloudUploadIcon = 'https://www.figma.com/api/mcp/asset/9e722d4d-9a2d-4d15-bb37-70e5aba612d5';

type UploadedDoc = {
  id: string;
  declNo: string;
  fileName: string;
  fileSize: number;
  uploadedOn: string;
};

type Props = {
  rows: Row[];
  onBack: () => void;
  onContinue: () => void;
  onBackToListing: () => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NonRemittanceDocumentsPage({ rows, onBack, onContinue, onBackToListing }: Props) {
  const [selectedDecl, setSelectedDecl] = useState<string>(rows[0]?.declarationNo ?? '');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [declRemarks, setDeclRemarks] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let docCounter = 0;

  const today = new Date().toLocaleDateString('en-GB');

  const handleFile = (f: File) => {
    if (!selectedDecl) return;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return;
    docCounter += 1;
    const doc: UploadedDoc = {
      id: `${f.name}-${f.size}-${docCounter}`,
      declNo: selectedDecl,
      fileName: f.name,
      fileSize: f.size,
      uploadedOn: today,
    };
    setUploadedDocs((prev) => [...prev, doc]);
  };

  const removeDoc = (id: string) => setUploadedDocs((prev) => prev.filter((d) => d.id !== id));

  const downloadDoc = (doc: UploadedDoc) => {
    const a = document.createElement('a');
    a.href = '#';
    a.download = doc.fileName;
    a.click();
  };

  const countForDecl = (declNo: string) => uploadedDocs.filter((d) => d.declNo === declNo).length;
  const allDeclsHaveDocs = rows.every((r) => uploadedDocs.some((d) => d.declNo === r.declarationNo));

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
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={1} steps={NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Top cards row */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

            {/* Left card — Declaration selection */}
            <div
              className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(66% - 8px)', minWidth: 260, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[14px] text-[#697498]" style={{ lineHeight: 1.5 }}>
                  Select the declaration number and upload the supporting file. Supported: .pdf, .jpg, .png, .xlsx — max 50 MB each.
                </p>
                <p className="text-[14px] text-[#697498]">Dubai Customs</p>
              </div>

              {/* Two-column grid for radio buttons (5 per column) */}
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: rows.length > 5 ? '1fr 1fr' : '1fr' }}>
                {rows.map((row) => {
                  const active = selectedDecl === row.declarationNo;
                  const count = countForDecl(row.declarationNo);
                  return (
                    <label
                      key={row.declarationNo}
                      className="flex items-center gap-[12px] px-[14px] py-[12px] rounded-[6px] cursor-pointer transition-colors"
                      style={{ background: active ? '#f0f5ff' : 'transparent', border: `1px solid ${active ? '#1360d2' : 'transparent'}` }}
                    >
                      {/* Radio */}
                      <span
                        className="size-[18px] rounded-full flex-shrink-0 inline-flex items-center justify-center"
                        style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}
                      >
                        {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                      </span>
                      <input
                        type="radio"
                        className="sr-only"
                        name="decl-select"
                        value={row.declarationNo}
                        checked={active}
                        onChange={() => setSelectedDecl(row.declarationNo)}
                      />
                      <span className="text-[15px] flex-1" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400, fontFamily: FONT }}>
                        {row.declarationNo}
                      </span>
                      {count > 0 && (
                        <span
                          className="text-[12px] px-[8px] py-[2px] rounded-[10px]"
                          style={{ background: 'rgba(26,172,114,0.12)', color: '#1aac72', fontWeight: 600, fontFamily: FONT }}
                        >
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Per-declaration remarks */}
              {rows.map((row) => (
                <div key={`remarks-${row.declarationNo}`} className="flex flex-col gap-[6px]">
                  <label className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                    Remarks (Optional) — {row.declarationNo}
                  </label>
                  <textarea
                    value={declRemarks[row.declarationNo] ?? ''}
                    onChange={(e) => setDeclRemarks(prev => ({ ...prev, [row.declarationNo]: e.target.value }))}
                    placeholder="Enter remarks for this declaration…"
                    rows={2}
                    className="w-full rounded-[4px] text-[14px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[12px] py-[8px] resize-none focus:outline-none focus:border-[#1360d2] transition-colors"
                    style={{ border: '1px solid #d5ddfb', fontFamily: FONT, lineHeight: '20px' }}
                  />
                </div>
              ))}
            </div>

            {/* Right card — Upload File */}
            <div
              className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(28% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[13px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
              </div>

              {/* Drag & drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors"
                style={{
                  border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`,
                  background: dragging ? '#edf3ff' : '#f8fafd',
                  cursor: selectedDecl ? 'default' : 'not-allowed',
                  opacity: selectedDecl ? 1 : 0.6,
                }}
              >
                {/* Cloud icon */}
                <div
                  className="size-[56px] rounded-full inline-flex items-center justify-center"
                  style={{ background: dragging ? '#d8e8ff' : '#e2ebf9' }}
                >
                  <img src={cloudUploadIcon} alt="" style={{ width: 26, height: 24 }} />
                </div>

                <p className="text-[14px] text-[#697498] text-center" style={{ fontFamily: FONT, lineHeight: 1.5 }}>
                  Drag and drop or
                </p>

                <button
                  type="button"
                  disabled={!selectedDecl}
                  onClick={() => selectedDecl && fileInputRef.current?.click()}
                  className="h-[40px] px-[20px] rounded-[4px] text-[15px] transition-colors"
                  style={{
                    border: '1.5px solid #1360d2',
                    color: '#1360d2',
                    fontFamily: FONT,
                    fontWeight: 500,
                    background: '#fff',
                    cursor: selectedDecl ? 'pointer' : 'not-allowed',
                  }}
                >
                  Choose File
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,application/pdf,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* Documents Uploaded table */}
          {uploadedDocs.length > 0 && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[20px] py-[14px] border-b border-[#eef1f6]">
                <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      {['Declaration Number', 'Document Name', 'Uploaded On', 'Action'].map((h, i) => (
                        <th
                          key={h}
                          style={{ padding: '11px 16px', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#000', whiteSpace: 'nowrap', width: i === 3 ? 120 : undefined }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedDocs.map((doc) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: FONT }}>{doc.declNo}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-[8px]">
                            {/* File icon */}
                            <div className="size-[30px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center" style={{ background: '#e8f0ff' }}>
                              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M5 2h7l3 3v12H5z" /><path d="M12 2v3h3" />
                              </svg>
                            </div>
                            <div className="flex flex-col gap-[1px]">
                              <span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: FONT }}>{doc.fileName}</span>
                              <span className="text-[12px] text-[#697498]" style={{ fontFamily: FONT }}>{formatBytes(doc.fileSize)}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[14px] text-[#697498]" style={{ fontFamily: FONT }}>{doc.uploadedOn}</span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-[6px]">
                            {/* Download */}
                            <button
                              type="button"
                              onClick={() => downloadDoc(doc)}
                              title="Download"
                              className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#e8f0ff] transition-colors"
                              style={{ color: '#1360d2' }}
                            >
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 3v10M5 12l5 5 5-5" /><path d="M3 17h14" />
                              </svg>
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => removeDoc(doc.id)}
                              title="Delete"
                              className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors"
                              style={{ color: '#dc3545' }}
                            >
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
          <>
            <button
              onClick={onBack}
              className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: FONT, fontWeight: 500 }}
            >
              Save &amp; Exit
            </button>
            <button
              onClick={onContinue}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{
                background: '#1360d2',
                fontFamily: FONT,
                fontWeight: 500,
                boxShadow: '0px 0px 8px rgba(28,72,191,0.16)',
              }}
            >
              Next
            </button>
          </>
        }
      />
    </div>
  );
}
