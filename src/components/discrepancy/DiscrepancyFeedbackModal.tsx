import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DiscrepancyRow } from './discrepancyData';

const font = "'Dubai', sans-serif";
const MAX_COMMENT = 255;
const MAX_ATTACHMENTS = 15;
const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_EXT = ['txt', 'png', 'pptx', 'doc', 'docx', 'xls', 'jpg', 'ppt', 'bmp', 'pdf', 'xlsx'];

type Attachment = { id: string; name: string; sizeKb: string };

function extOf(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

/* ── Attachment uploader ─────────────────────────────────────────────── */
function AttachmentUploader({ attachments, onAdd, onRemove }: {
  attachments: Attachment[];
  onAdd: (a: Attachment) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handlePick = (file: File | undefined) => {
    setError('');
    if (!file) { setPending(null); return; }
    if (!ALLOWED_EXT.includes(extOf(file.name))) {
      setError(`File type not allowed. Allowed types: ${ALLOWED_EXT.join(' / ')}`);
      setPending(null);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('File exceeds the maximum size of 1 MB.');
      setPending(null);
      return;
    }
    setPending(file);
  };

  const handleUpload = () => {
    if (!pending) return;
    if (attachments.length >= MAX_ATTACHMENTS) {
      setError(`Maximum of ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }
    onAdd({ id: `att-${Date.now()}-${attachments.length}`, name: pending.name, sizeKb: (pending.size / 1024).toFixed(1) });
    setPending(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700, letterSpacing: '0.3px' }}>
        ADD ATTACHMENTS
      </p>

      <div className="rounded-[8px] px-[18px] py-[14px]" style={{ background: '#e2ebf9', border: '1px solid #c7d9f7' }}>
        <p className="text-[14px] text-[#1360d2] mb-[6px]" style={{ fontFamily: font, fontWeight: 600 }}>Information:</p>
        <ul className="text-[14px] text-[#455174] flex flex-col gap-[3px]" style={{ fontFamily: font }}>
          <li>• Allowed Attachment Type : <b style={{ color: '#0e1b3d' }}>{ALLOWED_EXT.join(' / ')}</b></li>
          <li>• Maximum size of each attachment : <b style={{ color: '#0e1b3d' }}>1 MB</b></li>
          <li>• No. of Attachments allowed : <b style={{ color: '#0e1b3d' }}>{MAX_ATTACHMENTS}</b></li>
          <li>• No. of Attachments : <b style={{ color: '#0e1b3d' }}>{attachments.length}</b></li>
        </ul>
      </div>

      <div className="flex items-center gap-[10px] flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={attachments.length >= MAX_ATTACHMENTS}
          className="h-[42px] px-[16px] rounded-[4px] text-[15px] border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: font, borderColor: '#0e1b3d', color: '#0e1b3d', background: '#fff' }}
        >
          Choose File
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={e => handlePick(e.target.files?.[0])} />
        <span className="text-[14px] text-[#697498] flex-1 min-w-[120px] truncate" style={{ fontFamily: font }}>
          {pending ? pending.name : 'No file chosen'}
        </span>
        <button
          type="button"
          onClick={handleUpload}
          disabled={!pending}
          className="h-[42px] px-[18px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[6px] transition-colors disabled:cursor-not-allowed"
          style={{ fontFamily: font, fontWeight: 500, background: pending ? '#0e1b3d' : '#a7b0c4' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Upload
        </button>
      </div>

      {error && <p className="text-[13px] text-[#dc3545]" style={{ fontFamily: font }}>{error}</p>}

      {attachments.length > 0 && (
        <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
          {attachments.map(a => (
            <div key={a.id} className="flex items-center justify-between px-[14px] py-[9px]" style={{ borderTop: '1px solid #f0f4ff' }}>
              <span className="text-[14px] text-[#0e1b3d] truncate" style={{ fontFamily: font }}>{a.name} <span className="text-[#8f94ae]">({a.sizeKb} KB)</span></span>
              <button type="button" onClick={() => onRemove(a.id)} className="text-[#c0392b] hover:opacity-70 flex-shrink-0 ml-[10px]">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Discrepancy details compact table ───────────────────────────────── */
function DetailsTable({ rows }: { rows: DiscrepancyRow[] }) {
  const cols = [
    { key: 'rotationNo', label: 'Rotation No.' },
    { key: 'dischargeListContainer', label: 'Discharge List Container No.' },
    { key: 'inboundManifestContainer', label: 'Inbound Manifest Container No.' },
    { key: 'bolNo', label: 'Inbound Manifest BOL No.' },
    { key: 'mrn', label: 'Inbound Manifest MRN' },
    { key: 'attribute', label: 'Discrepancy Attribute' },
    { key: 'description', label: 'Discrepancy Value/Details' },
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
                <td key={c.key} className="px-[14px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap" style={{ maxWidth: c.key === 'description' ? 260 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                  {r[c.key as keyof DiscrepancyRow] as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main modal ───────────────────────────────────────────────────────── */
type Props = {
  mode: 'multi' | 'single';
  rows: DiscrepancyRow[];
  onClose: () => void;
  onSubmit: (rowIds: string[], comment: string, attachmentNames: string[]) => void;
};

export default function DiscrepancyFeedbackModal({ mode, rows, onClose, onSubmit }: Props) {
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

  const body = submitted ? (
    <div className="flex flex-col items-center gap-[16px] py-[48px] px-[24px]">
      <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#e6f9ee' }}>
        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" fill="#28a745" />
          <path d="M10 18l6 6 10-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-center flex flex-col gap-[6px]">
        <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Feedback Submitted</p>
        <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>
          Your feedback has been recorded for {rows.length} discrepanc{rows.length === 1 ? 'y' : 'ies'}.
        </p>
      </div>
      <button onClick={onClose}
        className="h-[46px] px-[28px] rounded-[4px] text-white text-[16px] transition-colors"
        style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
        Close
      </button>
    </div>
  ) : (
    <>
      <div className="flex-1 overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[20px]">
        <div>
          <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Discrepancy Details</p>
          <DetailsTable rows={rows} />
        </div>

        {mode === 'multi' && (
          <div className="rounded-[8px] px-[16px] py-[12px] flex items-start gap-[10px]" style={{ background: '#fff8e6', border: '1px solid #ffe6a8' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#b45309" strokeWidth="2" className="flex-shrink-0 mt-[2px]">
              <circle cx="12" cy="12" r="9.5" /><path d="M12 8v.01M12 11v5" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] text-[#8a5a10]" style={{ fontFamily: font }}>
              The comment below will be applied to all <b>{rows.length} selected records</b>.
            </p>
          </div>
        )}

        {mode === 'single' && single && single.conversation.length > 0 && (
          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Conversation History</p>
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

        <div className="flex flex-col gap-[8px]">
          <label className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
            Comments <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <textarea
            value={comment}
            maxLength={MAX_COMMENT}
            onChange={e => setComment(e.target.value)}
            placeholder="Enter your feedback or additional information..."
            rows={4}
            className="w-full rounded-[4px] px-[14px] py-[10px] text-[15px] text-[#0e1b3d] focus:outline-none resize-none"
            style={{ border: '1px solid #d5ddfb', fontFamily: font }}
          />
          <span className="text-[13px] text-[#8f94ae] self-end" style={{ fontFamily: font }}>
            {remaining} characters remaining
          </span>
        </div>

        <AttachmentUploader
          attachments={attachments}
          onAdd={a => setAttachments(p => [...p, a])}
          onRemove={id => setAttachments(p => p.filter(a => a.id !== id))}
        />
      </div>

      <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #eef1f6' }}>
        <button onClick={onClose}
          className="h-[46px] px-[24px] rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
          Close
        </button>
        <button onClick={handleSubmit} disabled={!canSubmit}
          className="h-[46px] px-[28px] rounded-[4px] text-white text-[16px] transition-colors disabled:cursor-not-allowed"
          style={{ background: canSubmit ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500 }}>
          Submit Feedback
        </button>
      </div>
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px] py-[24px]" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: 'rgba(14, 27, 61, 0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(880px, 100%)', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px] flex-shrink-0">
          <div>
            <p className="text-[20px] text-[#f8fafd]" style={{ fontFamily: font, fontWeight: 500 }}>Provide Discrepancy Feedback</p>
            <p className="text-[14px] text-[#a9b6d9]" style={{ fontFamily: font }}>
              {mode === 'multi' ? `${rows.length} discrepancies selected` : `Rotation No.: ${single?.rotationNo}`}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {body}
      </div>
    </div>,
    document.body,
  );
}
