import { useRef, useState } from 'react';
import Header from '../Header';
import BackToListingBar from '../BackToListingBar';
import type { DiscrepancyRow } from './discrepancyData';

const font = "'Dubai', sans-serif";
const MAX_COMMENT = 255;
const MAX_ATTACHMENTS = 15;
const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_EXT = ['txt', 'png', 'pptx', 'doc', 'docx', 'xls', 'jpg', 'ppt', 'bmp', 'pdf', 'xlsx'];

type Attachment = { id: string; name: string; sizeKb: string; uploadedOn: string };

function extOf(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

const CloudUploadIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 20v-8M12 16l4-4 4 4" />
    <path d="M8 24a6 6 0 0 1-2-11.6A8 8 0 0 1 22 8a6 6 0 0 1 2 11.6" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 17v3h16v-3" /></svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
);

/* ── Attachments — drag-and-drop zone (left) + rules panel (right) + uploaded-files table ── */
function AttachmentsSection({ attachments, onAdd, onRemove }: {
  attachments: Attachment[];
  onAdd: (a: Attachment) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const tryAdd = (file: File | undefined) => {
    setError('');
    if (!file) return;
    if (!ALLOWED_EXT.includes(extOf(file.name))) {
      setError(`File type not allowed. Allowed types: ${ALLOWED_EXT.join(' / ')}`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('File exceeds the maximum size of 1 MB.');
      return;
    }
    if (attachments.length >= MAX_ATTACHMENTS) {
      setError(`Maximum of ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }
    const now = new Date();
    const p2 = (n: number) => String(n).padStart(2, '0');
    onAdd({
      id: `att-${Date.now()}-${attachments.length}`,
      name: file.name,
      sizeKb: (file.size / 1024).toFixed(1),
      uploadedOn: `${p2(now.getDate())}/${p2(now.getMonth() + 1)}/${now.getFullYear()}`,
    });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Upload File card — full width; only the dropzone itself is constrained */}
      <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px] w-full" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Upload File</p>

        {/* Information — blue notice box, same convention as the rest of the app */}
        <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[2px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Allowed Attachment Type : <b>{ALLOWED_EXT.join(' / ')}</b></p>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Maximum size of each attachment : <b>1 MB</b></p>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>No. of Attachments allowed : <b>{MAX_ATTACHMENTS}</b></p>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>No. of Attachments : <b>{attachments.length}</b></p>
          </div>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); tryAdd(e.dataTransfer.files?.[0]); }}
          className="flex flex-col items-center justify-center gap-[10px] rounded-[8px] py-[32px] px-[16px] w-full lg:w-1/2 transition-colors"
          style={{ border: `1.5px dashed ${dragOver ? '#1360d2' : '#b5c8e8'}`, background: dragOver ? '#eef4ff' : '#f8fafd' }}
        >
          <div className="size-[52px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
            <CloudUploadIcon />
          </div>
          <p className="text-[16px] text-[#697498] text-center" style={{ fontFamily: font }}>Drag and drop or</p>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={attachments.length >= MAX_ATTACHMENTS}
            className="h-[44px] px-[20px] rounded-[4px] text-[16px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
            Choose File
          </button>
          <input ref={inputRef} type="file" className="hidden" onChange={e => tryAdd(e.target.files?.[0])} />
        </div>
        {error && <p className="text-[14px] text-[#dc3545]" style={{ fontFamily: font }}>{error}</p>}
      </div>

      {/* Attachments table */}
      <div className="bg-white rounded-[8px] px-[14px] pt-[20px] pb-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <p className="text-[18px] text-[#051937] mb-[14px] px-[6px]" style={{ fontFamily: font, fontWeight: 500 }}>Attachments</p>
        {attachments.length === 0 ? (
          <p className="text-[16px] text-[#8f94ae] text-center py-[24px]" style={{ fontFamily: font }}>No attachments added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
              <thead>
                <tr>
                  <th style={{ width: 50, background: '#a6c2e9', padding: '10px 8px', borderRadius: '8px 0 0 0' }} />
                  <th style={{ background: '#a6c2e9', padding: '10px 8px', textAlign: 'left' }}><span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>Document Name</span></th>
                  <th style={{ width: 140, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left' }}><span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>Size</span></th>
                  <th style={{ width: 160, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left' }}><span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>Uploaded On</span></th>
                  <th style={{ width: 110, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '0 8px 0 0' }}><span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>Action</span></th>
                </tr>
              </thead>
              <tbody>
                {attachments.map((a, i) => (
                  <tr key={a.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '14px 8px', textAlign: 'center' }}><span className="text-[16px] text-[#051937]">{i + 1}</span></td>
                    <td style={{ padding: '14px 8px' }}><span className="text-[16px] text-[#051937] truncate" style={{ display: 'block', maxWidth: 320 }}>{a.name}</span></td>
                    <td style={{ padding: '14px 8px' }}><span className="text-[16px] text-[#051937]">{a.sizeKb} KB</span></td>
                    <td style={{ padding: '14px 8px' }}><span className="text-[16px] text-[#051937]">{a.uploadedOn}</span></td>
                    <td style={{ padding: '14px 8px' }}>
                      <div className="flex items-center gap-[14px]">
                        <button type="button" onClick={() => onRemove(a.id)} className="hover:opacity-70 transition-opacity" aria-label="Delete"><DeleteIcon /></button>
                        <button type="button" className="hover:opacity-70 transition-opacity" aria-label="Download"><DownloadIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Discrepancy details compact table — columns depend on the row type ── */
function DetailsTable({ rows }: { rows: DiscrepancyRow[] }) {
  const isDischarge = rows[0]?.type === 'discharge';
  const cols = isDischarge ? ([
    { key: 'rotationNo', label: 'Rotation No.' },
    { key: 'dischargeListContainerNo', label: 'Discharge List Container No.' },
    { key: 'inboundManifestContainerNo', label: 'Inbound Manifest Container No.' },
    { key: 'inboundManifestBolNo', label: 'Inbound Manifest BOL No.' },
    { key: 'inboundManifestMrn', label: 'Inbound Manifest MRN' },
    { key: 'attribute', label: 'Discrepancy Attribute' },
    { key: 'description', label: 'Discrepancy Description' },
  ] as const) : ([
    { key: 'rotationNo', label: 'Rotation No.' },
    { key: 'loadedInfoContainerNo', label: 'Loaded Information Container No.' },
    { key: 'exportManifestContainerNo', label: 'Export Manifest Container No.' },
    { key: 'exportManifestBolNo', label: 'Export Manifest BOL No.' },
    { key: 'attribute', label: 'Discrepancy Attribute' },
    { key: 'description', label: 'Discrepancy Description' },
  ] as const);

  return (
    <div className="rounded-[6px] overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
      <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontFamily: font }}>
        <thead>
          <tr style={{ background: '#a6c2e9' }}>
            {cols.map(c => (
              <th key={c.key} className="text-left px-[14px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{ borderTop: '1px solid #f0f4ff' }}>
              {cols.map(c => (
                <td key={c.key} className="px-[14px] py-[10px] text-[16px] text-[#0e1b3d]" style={{ maxWidth: c.key === 'description' ? 260 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                  {(r[c.key as keyof DiscrepancyRow] as string) || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────── */
type Props = {
  mode: 'multi' | 'single';
  rows: DiscrepancyRow[];
  onBack: () => void;
  onSubmit: (rowIds: string[], comment: string, attachmentNames: string[]) => void;
};

export default function DiscrepancyFeedbackFormPage({ mode, rows, onBack, onSubmit }: Props) {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const remaining = MAX_COMMENT - comment.length;
  const canSubmit = comment.trim().length > 0;
  const single = mode === 'single' ? rows[0] : null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(rows.map(r => r.id), comment.trim(), attachments.map(a => a.name));
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-8">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[8px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Cargo Reconciliation</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Provide Feedback</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[4px]" style={{ fontFamily: font }}>
          Provide Discrepancy Feedback
        </h1>
        <p className="text-[16px] text-[#697498] mb-[20px]" style={{ fontFamily: font }}>
          {mode === 'multi' ? `${rows.length} discrepancies selected` : `Rotation No.: ${single?.rotationNo}`}
        </p>

        {submitted ? (
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[64px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#e6f9ee' }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="#28a745" />
                <path d="M10 18l6 6 10-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[6px]">
              <p className="text-[24px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Feedback Submitted</p>
              <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                Your feedback has been recorded for {rows.length} discrepanc{rows.length === 1 ? 'y' : 'ies'}.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[20px]">
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
              <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Discrepancy Details</p>
              <DetailsTable rows={rows} />
            </div>

            {mode === 'multi' && (
              <div className="rounded-[8px] px-[16px] py-[12px] flex items-start gap-[10px]" style={{ background: '#fff8e6', border: '1px solid #ffe6a8' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#b45309" strokeWidth="2" className="flex-shrink-0 mt-[2px]">
                  <circle cx="12" cy="12" r="9.5" /><path d="M12 8v.01M12 11v5" strokeLinecap="round" />
                </svg>
                <p className="text-[16px] text-[#8a5a10]" style={{ fontFamily: font }}>
                  The comment below will be applied to all <b>{rows.length} selected records</b>.
                </p>
              </div>
            )}

            {mode === 'single' && single && single.conversation.length > 0 && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
                <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Conversation History</p>
                <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                    <thead>
                      <tr style={{ background: '#f8fafd' }}>
                        <th className="text-left px-[16px] py-[9px] text-[14px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>CREATED BY</th>
                        <th className="text-left px-[16px] py-[9px] text-[14px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>CREATED DATE</th>
                        <th className="text-left px-[16px] py-[9px] text-[14px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>COMMENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {single.conversation.map((c, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 600 }}>{c.createdBy}</td>
                          <td className="px-[16px] py-[10px] text-[16px] text-[#0e1b3d] whitespace-nowrap">{c.createdDate}</td>
                          <td className="px-[16px] py-[10px] text-[16px] text-[#0e1b3d]">{c.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
              <label className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                Comments <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                value={comment}
                maxLength={MAX_COMMENT}
                onChange={e => setComment(e.target.value)}
                placeholder="Enter your feedback or additional information..."
                rows={4}
                className="w-full rounded-[4px] px-[14px] py-[10px] text-[16px] text-[#0e1b3d] focus:outline-none resize-none"
                style={{ border: '1px solid #d5ddfb', fontFamily: font, maxWidth: 720 }}
              />
              <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>
                {remaining} characters remaining
              </span>
            </div>

            <AttachmentsSection
              attachments={attachments}
              onAdd={a => setAttachments(p => [...p, a])}
              onRemove={id => setAttachments(p => p.filter(a => a.id !== id))}
            />
          </div>
        )}
      </div>

      <BackToListingBar
        onBackToListing={onBack}
        rightContent={!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:cursor-not-allowed"
            style={{ background: canSubmit ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500, boxShadow: canSubmit ? '0px 0px 8px 0px rgba(28,72,191,0.16)' : 'none' }}
          >
            Submit Feedback
          </button>
        ) : undefined}
      />
    </div>
  );
}
