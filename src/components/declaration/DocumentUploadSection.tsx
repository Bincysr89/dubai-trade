import React, { useRef, useState } from 'react';
import { JourneyTable, JourneyTd, JourneyThead, font } from './DeclarationUI';

const MAX_SIZE_MB = 50;

export type DocTypeOption = {
  label: string;
  /** "Copy", "Original", … — shown as a badge next to the name, as in Refund & Claims. */
  nature?: string;
  required?: boolean;
};

export type UploadedDocRow = {
  id: string;
  docType: string;
  authority: string;
  fileName: string;
  fileSize: number;
  uploadedOn: string;
  remarks: string;
  /** Rows created from one file share this id, so the table can merge them back. */
  batchId: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** One physical file is one row, with its document types listed together. */
function mergeByBatch(docs: UploadedDocRow[]): UploadedDocRow[] {
  const order: string[] = [];
  const groups = new Map<string, UploadedDocRow[]>();
  docs.forEach((d) => {
    if (!groups.has(d.batchId)) { order.push(d.batchId); groups.set(d.batchId, []); }
    groups.get(d.batchId)!.push(d);
  });
  return order.map((k) => {
    const g = groups.get(k)!;
    return { ...g[0], docType: g.map((x) => x.docType).join(', ') };
  });
}

type Props = {
  /** Heading on the left card. */
  title?: string;
  description?: string;
  /** Authority the files are filed against — shown in the uploaded table. */
  authority?: string;
  docTypes: DocTypeOption[];
  /** Pre-seeded rows, e.g. when returning to the step. */
  initialDocs?: UploadedDocRow[];
};

/**
 * Upload Documents — the two-card layout used by the Refund & Claims document step
 * (NonRemittanceDocumentsPage): document types on the left, the drop zone on the right,
 * and the uploaded files listed underneath.
 */
export default function DocumentUploadSection({
  title = 'Upload Documents',
  description = 'Select the document type and upload the supporting file — we will share the documents with the authorities.',
  authority = 'Dubai Customs',
  docTypes,
  initialDocs,
}: Props) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [remarks, setRemarks] = useState('');
  const [docs, setDocs] = useState<UploadedDocRow[]>(initialDocs ?? []);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const today = new Date().toLocaleDateString('en-GB');
  const canUpload = selectedTypes.size > 0;

  const toggleType = (label: string) => setSelectedTypes((prev) => {
    const next = new Set(prev);
    next.has(label) ? next.delete(label) : next.add(label);
    return next;
  });

  const handleFile = (f: File) => {
    if (!canUpload || f.size > MAX_SIZE_MB * 1024 * 1024) return;
    counter.current += 1;
    const batchId = `${f.name}-${f.size}-${counter.current}`;
    const rows = Array.from(selectedTypes).map((docType) => ({
      id: `${batchId}-${docType}`, docType, authority,
      fileName: f.name, fileSize: f.size, uploadedOn: today, remarks: remarks.trim(), batchId,
    }));
    setDocs((prev) => [...prev, ...rows]);
    setRemarks('');
  };

  /* Deleting a merged row drops every document-type entry uploaded with that file. */
  const removeDoc = (batchId: string) => setDocs((prev) => prev.filter((d) => d.batchId !== batchId));

  const merged = mergeByBatch(docs);

  return (
    <div className="flex flex-col gap-[20px]" style={{ fontFamily: font }}>
      <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

        {/* Left card — document types + remarks */}
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
          style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{title}</p>
            <p className="text-[16px] text-[#697498]">{description}</p>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
              Select Document Type <span style={{ color: '#697498', fontWeight: 400 }}>(select all that apply)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[8px]">
              {docTypes.map((doc) => {
                const active = selectedTypes.has(doc.label);
                const uploaded = docs.filter((d) => d.docType === doc.label).length;
                return (
                  <label
                    key={doc.label}
                    onClick={() => toggleType(doc.label)}
                    className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                    style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}
                  >
                    <span className="size-[17px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                      style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: active ? '#1360d2' : '#fff' }}>
                      {active && <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                    </span>
                    <input type="checkbox" className="sr-only" name="doc-type" value={doc.label}
                      checked={active} onChange={() => toggleType(doc.label)} />
                    <div className="flex items-center flex-wrap gap-[5px] flex-1 min-w-0">
                      <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                        {doc.required && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}
                        {doc.label}
                      </span>
                      {doc.nature && (
                        <span className="text-[14px] px-[6px] py-[1px] rounded-[4px] whitespace-nowrap"
                          style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500 }}>
                          {doc.nature}
                        </span>
                      )}
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

          <div className="flex flex-col gap-[6px]">
            <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
              Remarks <span style={{ color: '#697498', fontWeight: 400 }}>(Optional)</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks for this document…"
              rows={2}
              className="w-full rounded-[4px] text-[16px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[12px] py-[10px] resize-y focus:outline-none focus:border-[#1360d2] transition-colors"
              style={{ border: '1px solid #d5ddfb', fontFamily: font, lineHeight: '22px' }}
            />
          </div>
        </div>

        {/* Right card — uploader */}
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
          style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
            <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to {MAX_SIZE_MB} MB</p>
          </div>

          {!canUpload && (
            <p className="text-[16px] text-[#b45309] px-[12px] py-[8px] rounded-[4px]"
              style={{ background: '#fff8e6', border: '1px solid #f5d67a' }}>
              Select a document type to upload
            </p>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); if (canUpload) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
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
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[16px] text-[#697498] text-center">Drag and drop or</p>
            <button type="button" data-secondary-btn disabled={!canUpload}
              onClick={() => canUpload && fileInputRef.current?.click()}
              className="h-[40px] px-[20px] rounded-[4px] text-[16px] bg-white transition-colors"
              style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, cursor: canUpload ? 'pointer' : 'not-allowed' }}>
              Choose File
            </button>
          </div>

          <input ref={fileInputRef} type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      </div>

      {/* Uploaded files */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[10px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]"
            style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500 }}>
            {merged.length} file{merged.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {merged.length === 0 ? (
            <p className="text-[16px] text-[#697498] text-center" style={{ padding: '32px 16px' }}>No files uploaded yet.</p>
          ) : (
            <JourneyTable minWidth={900}>
              <JourneyThead columns={[
                { label: 'Document Type' }, { label: 'Authority Name' }, { label: 'File Name' },
                { label: 'Uploaded On' }, { label: 'Remarks' }, { label: 'Action', w: 110, filter: false },
              ]} />
              <tbody>
                {merged.map((d) => (
                  <tr key={d.id}>
                    <JourneyTd first>{d.docType}</JourneyTd>
                    <JourneyTd>{d.authority}</JourneyTd>
                    <JourneyTd>
                      <span className="flex flex-col">
                        <span className="text-[16px] text-[#051937]">{d.fileName}</span>
                        <span className="text-[13px] text-[#697498]">{formatBytes(d.fileSize)}</span>
                      </span>
                    </JourneyTd>
                    <JourneyTd>{d.uploadedOn}</JourneyTd>
                    <JourneyTd>
                      <span className="text-[16px] text-[#697498]">{d.remarks || '—'}</span>
                    </JourneyTd>
                    <JourneyTd>
                      <span className="flex items-center gap-[8px]">
                        <button type="button" title="Download" aria-label={`Download ${d.fileName}`}
                          className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                          style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                          </svg>
                        </button>
                        <button type="button" title="Delete" aria-label={`Delete ${d.fileName}`}
                          onClick={() => removeDoc(d.batchId)}
                          className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#fef2f2] transition-colors"
                          style={{ border: '1px solid #f3d0d3', color: '#dc3545' }}>
                          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                          </svg>
                        </button>
                      </span>
                    </JourneyTd>
                  </tr>
                ))}
              </tbody>
            </JourneyTable>
          )}
        </div>
      </div>
    </div>
  );
}
