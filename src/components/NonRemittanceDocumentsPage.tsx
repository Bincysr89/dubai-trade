import React, { useRef, useState } from 'react';
import BackToListingBar from './BackToListingBar';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MAX_SIZE_MB = 2;
const ALLOWED_MIME = ['application/pdf', 'text/plain'];
const ALLOWED_EXT_LABEL = '.pdf, .txt';

type DeclDoc = {
  remarks: string;
  file: File | null;
  error: string;
};

type Props = {
  rows: Row[];
  onBack: () => void;
  onContinue: () => void;
  onBackToListing: () => void;
};

function FileUploadCell({
  declNo,
  doc,
  onChange,
}: {
  declNo: string;
  doc: DeclDoc;
  onChange: (d: Partial<DeclDoc>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const validate = (file: File): string => {
    if (!ALLOWED_MIME.includes(file.type) && !file.name.match(/\.(pdf|txt)$/i)) {
      return `Only ${ALLOWED_EXT_LABEL} files are allowed.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must not exceed ${MAX_SIZE_MB} MB.`;
    }
    return '';
  };

  const handleFile = (f: File) => {
    const error = validate(f);
    onChange({ file: error ? null : f, error });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className="flex flex-col gap-[8px]">
      {!doc.file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className="rounded-[6px] flex flex-col items-center justify-center gap-[8px] py-[20px] px-[16px] cursor-pointer"
          style={{
            background: drag ? '#eef4ff' : '#f8fafd',
            border: `1.5px dashed ${drag ? '#1360d2' : '#b0b8d0'}`,
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div
            className="size-[40px] rounded-full inline-flex items-center justify-center"
            style={{ background: '#dfe5e9' }}
          >
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="#697498" strokeWidth="1.8"><path d="M9 22a5 5 0 110-10 7 7 0 0113.65 1.5A5 5 0 0123 22" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 14v9M12 18l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-[14px] text-[#697498]" style={{ fontFamily: FONT }}>
            Drag & drop or <span style={{ color: '#1360d2', fontWeight: 500 }}>choose file</span>
          </p>
          <p className="text-[12px] text-[#a0a7be]" style={{ fontFamily: FONT }}>
            {ALLOWED_EXT_LABEL} · max {MAX_SIZE_MB} MB · 1 file per declaration
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      ) : (
        <div
          className="rounded-[6px] flex items-center gap-[12px] px-[14px] py-[12px]"
          style={{ background: '#f0f7ff', border: '1px solid #c3d9f8' }}
        >
          <div
            className="size-[36px] rounded-[6px] inline-flex items-center justify-center flex-shrink-0"
            style={{ background: '#dbeafe' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6M9 13h6M9 17h4" strokeLinecap="round" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#0e1b3d] truncate" style={{ fontFamily: FONT, fontWeight: 500 }}>{doc.file.name}</p>
            <p className="text-[12px] text-[#697498]" style={{ fontFamily: FONT }}>
              {(doc.file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => onChange({ file: null, error: '' })}
            aria-label="Remove file"
            className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#fef2f2] flex-shrink-0"
            style={{ color: '#dc3545' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
      {doc.error && (
        <p className="text-[13px] text-[#dc3545]" style={{ fontFamily: FONT }}>{doc.error}</p>
      )}
    </div>
  );
}

export default function NonRemittanceDocumentsPage({ rows, onBack, onContinue, onBackToListing }: Props) {
  const [docs, setDocs] = useState<Record<string, DeclDoc>>(() =>
    Object.fromEntries(rows.map((r) => [r.declarationNo, { remarks: '', file: null, error: '' }]))
  );

  const update = (declNo: string, partial: Partial<DeclDoc>) => {
    setDocs((prev) => ({ ...prev, [declNo]: { ...prev[declNo], ...partial } }));
  };

  const allFilesUploaded = rows.every((r) => docs[r.declarationNo]?.file !== null);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
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
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>
          Raise New Claim
        </h1>
        <div className="px-4 sm:px-10">
          <ClaimStepper activeIndex={2} />
        </div>

        <div className="px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]">
          {/* Section header */}
          <div className="flex items-center gap-[12px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
              Remarks &amp; Document Upload
            </p>
            <span
              className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[12px]"
              style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}
            >
              Non Remittance
            </span>
          </div>

          {/* Info note */}
          <div
            className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px]"
            style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
            <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '20px' }}>
              Please add remarks and attach one supporting document for each selected declaration.
              Accepted formats: <span style={{ fontWeight: 500 }}>.pdf, .txt</span> — max{' '}
              <span style={{ fontWeight: 500 }}>{MAX_SIZE_MB} MB</span> per file.
            </p>
          </div>

          {/* Per-declaration cards */}
          {rows.map((row, idx) => {
            const doc = docs[row.declarationNo] ?? { remarks: '', file: null, error: '' };
            return (
              <div
                key={row.declarationNo}
                className="bg-white rounded-[8px] overflow-hidden"
                style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-[12px] px-[24px] py-[14px] border-b border-[#eef1f6]"
                  style={{ background: '#f6f9fe' }}
                >
                  <div
                    className="size-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 text-[14px] text-white"
                    style={{ background: '#1360d2', fontWeight: 600 }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[4px]">
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>
                      {row.declarationNo}
                    </span>
                    {row.declarationDate && (
                      <span className="text-[14px] text-[#697498]">Date: {row.declarationDate}</span>
                    )}
                    {row.declarationCategory && (
                      <span className="text-[14px] text-[#697498]">Category: {row.declarationCategory}</span>
                    )}
                    {row.claimExpiry && (
                      <span className="text-[14px]" style={{ color: '#dc3545' }}>
                        Claim Expiry: {row.claimExpiry}
                      </span>
                    )}
                  </div>
                  {doc.file && (
                    <span
                      className="ml-auto inline-flex items-center gap-[6px] text-[13px]"
                      style={{ color: '#28a745', fontWeight: 500 }}
                    >
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Document attached
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="px-[24px] py-[20px] grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
                  {/* Remarks */}
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[14px] text-[#455174]" style={{ fontWeight: 500 }}>
                      Remarks <span className="text-[#697498]" style={{ fontWeight: 400 }}>(optional)</span>
                    </label>
                    <textarea
                      value={doc.remarks}
                      onChange={(e) => update(row.declarationNo, { remarks: e.target.value })}
                      placeholder="Enter any remarks for this declaration…"
                      rows={4}
                      className="rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[14px] py-[10px] resize-none focus:outline-none focus:border-[#1360d2]"
                      style={{ fontFamily: FONT, lineHeight: '22px' }}
                    />
                  </div>

                  {/* File upload */}
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[14px] text-[#455174]" style={{ fontWeight: 500 }}>
                      Attachment <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <FileUploadCell
                      declNo={row.declarationNo}
                      doc={doc}
                      onChange={(partial) => update(row.declarationNo, partial)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <ClaimantBrokerDetail />
        </div>
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <div className="flex items-center gap-[16px]">
            {!allFilesUploaded && (
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: FONT }}>
                Upload a document for each declaration to continue.
              </span>
            )}
            <button
              disabled={!allFilesUploaded}
              onClick={() => { if (allFilesUploaded) onContinue(); }}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{
                background: allFilesUploaded ? '#1360d2' : '#a7c3eb',
                cursor: allFilesUploaded ? 'pointer' : 'not-allowed',
                fontFamily: FONT,
                fontWeight: 500,
                boxShadow: allFilesUploaded ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
              }}
            >
              Submit Claim
            </button>
          </div>
        }
      />
    </div>
  );
}
