import { useRef, useState } from 'react';
import Header from '../Header';
import BackToListingBar from '../BackToListingBar';
import { columnLabelsFor, type DiscrepancyRow } from './discrepancyData';

const font = "'Dubai', sans-serif";
const MAX_COMMENT = 255;
const MAX_ATTACHMENTS = 15;
const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_EXT = ['txt', 'png', 'pptx', 'doc', 'docx', 'xls', 'jpg', 'ppt', 'bmp', 'pdf', 'xlsx'];

type Attachment = { id: string; name: string; sizeKb: string };

function extOf(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ── Attachments — dropzone + rules notice (left) and a flat filename list (no table) ── */
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
    onAdd({ id: `att-${Date.now()}-${attachments.length}`, name: file.name, sizeKb: (file.size / 1024).toFixed(1) });
  };

  return (
    <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      <p className="text-[18px] text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font, fontWeight: 700 }}>Upload File</p>

      <div className="rounded-[8px] px-[18px] py-[14px] mb-[16px]" style={{ background: '#e2ebf9', border: '1px solid #c7d9f7' }}>
        <ul className="text-[14px] text-[#455174] flex flex-col gap-[3px]" style={{ fontFamily: font }}>
          <li>Allowed Attachment Type : <b style={{ color: '#0e1b3d' }}>{ALLOWED_EXT.join(' / ')}</b></li>
          <li>Maximum size of each attachment : <b style={{ color: '#0e1b3d' }}>1 MB</b></li>
          <li>No. of Attachments allowed : <b style={{ color: '#0e1b3d' }}>{MAX_ATTACHMENTS}</b></li>
          <li>No. of Attachments : <b style={{ color: '#0e1b3d' }}>{attachments.length}</b></li>
        </ul>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); tryAdd(e.dataTransfer.files?.[0]); }}
        className="rounded-[8px] flex flex-col items-center justify-center gap-[10px] py-[40px] transition-colors"
        style={{ border: `1.5px dashed ${dragOver ? '#1360d2' : '#d5ddfb'}`, background: dragOver ? '#f0f4ff' : '#fff' }}
      >
        <div className="size-[40px] rounded-full flex items-center justify-center" style={{ background: '#e2ebf9' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4M8 8l4-4 4 4" /><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
          </svg>
        </div>
        <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>Drag and drop or</p>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={attachments.length >= MAX_ATTACHMENTS}
          className="h-[42px] px-[18px] rounded-[4px] text-[15px] border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: font, fontWeight: 500, borderColor: '#1360d2', color: '#1360d2', background: '#fff' }}>
          Choose File
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={e => { tryAdd(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      {error && <p className="text-[13px] text-[#dc3545] mt-[10px]" style={{ fontFamily: font }}>{error}</p>}

      <p className="text-[16px] text-[#0e1b3d] mt-[24px] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Attachments</p>
      {attachments.length === 0 ? (
        <p className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>No attachments added yet.</p>
      ) : (
        <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
          {attachments.map((a, i) => (
            <div key={a.id} className="flex items-center justify-between px-[14px] py-[9px]" style={{ borderTop: i === 0 ? 'none' : '1px solid #f0f4ff' }}>
              <span className="text-[14px] text-[#0e1b3d] truncate" style={{ fontFamily: font }}>
                {a.name} <span className="text-[#8f94ae]">({a.sizeKb} KB)</span>
              </span>
              <button type="button" onClick={() => onRemove(a.id)} className="text-[#c0392b] hover:opacity-70 flex-shrink-0 ml-[10px]" aria-label="Delete">
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Discrepancy details compact table — Rotation No. + the 3 dynamically-labeled reference
     columns + Discrepancy Attribute + Discrepancy Description (same shape for both types). ── */
function DetailsTable({ rows }: { rows: DiscrepancyRow[] }) {
  const labels = columnLabelsFor(rows[0]?.type ?? 'Import');
  const cols = [
    { key: 'rotationNo', label: 'Rotation No.' },
    { key: 'dischargeListContainer', label: labels.loaded },
    { key: 'inboundManifestContainer', label: labels.manifest },
    { key: 'bolNo', label: labels.bol },
    { key: 'attribute', label: 'Discrepancy Attribute' },
    { key: 'description', label: 'Discrepancy Description' },
  ] as const;

  return (
    <div className="rounded-[6px] overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
      <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontFamily: font }}>
        <thead>
          <tr style={{ background: '#e2ebf9' }}>
            {cols.map(c => (
              <th key={c.key} className="text-left px-[14px] py-[10px] text-[13px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{ borderTop: '1px solid #f0f4ff' }}>
              {cols.map(c => (
                <td key={c.key} className="px-[14px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ maxWidth: c.key === 'description' ? 260 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                  {(r[c.key as keyof DiscrepancyRow] as string) || ''}
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

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-[8px] p-[40px] flex flex-col items-center gap-[16px] text-center" style={{ maxWidth: 480, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#e6f9ee' }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="#28a745" />
                <path d="M10 18l6 6 10-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Feedback Submitted Successfully</p>
            <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>
              Your feedback has been recorded for {rows.length} discrepanc{rows.length === 1 ? 'y' : 'ies'}.
            </p>
            <button onClick={onBack} className="h-[46px] px-[28px] rounded-[4px] text-white text-[16px] transition-colors" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Back to Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[16px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px] flex-wrap" style={{ fontFamily: font }}>
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
          {single ? `Rotation No.: ${single.rotationNo}` : `${rows.length} discrepancies selected`}
        </p>

        <div className="flex flex-col gap-[20px]">
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <p className="text-[18px] text-[#0e1b3d] mb-[14px]" style={{ fontFamily: font, fontWeight: 700 }}>Discrepancy Details</p>
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
            <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[18px] text-[#0e1b3d] mb-[14px]" style={{ fontFamily: font, fontWeight: 700 }}>Conversation History</p>
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                  <thead>
                    <tr style={{ background: '#f8fafd' }}>
                      <th className="text-left px-[16px] py-[9px] text-[12px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>CREATED BY</th>
                      <th className="text-left px-[16px] py-[9px] text-[12px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>CREATED DATE</th>
                      <th className="text-left px-[16px] py-[9px] text-[12px] text-[#8f94ae]" style={{ fontWeight: 500, letterSpacing: '0.3px' }}>COMMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {single.conversation.map((c, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 600 }}>{c.createdBy}</td>
                        <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap">{c.createdDate}</td>
                        <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{c.comment}</td>
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
      </div>

      <BackToListingBar
        onBackToListing={onBack}
        rightContent={
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:cursor-not-allowed"
            style={{ background: canSubmit ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500, boxShadow: canSubmit ? '0px 0px 8px 0px rgba(28,72,191,0.16)' : 'none' }}
          >
            Submit Feedback
          </button>
        }
      />
    </div>
  );
}
