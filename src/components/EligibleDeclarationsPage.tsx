import React, { useEffect, useMemo, useRef, useState } from 'react';
import SaveExitModal from './SaveExitModal';
import Pagination from './Pagination';
import BackToListingBar from './BackToListingBar';
import FloatingField from './FloatingField';
import type { ClaimType } from './ClaimTypeSelectionPage';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper, { NR_CLAIM_STEPS, REFUND_DEPOSIT_STEPS } from './ClaimStepper';
import Dh from './Dh';
import { DateInput } from './DatePicker';

export type RefundType = 'full' | 'partial' | 'no';

const REFUND_OPTIONS: { id: RefundType; title: string; sub: string }[] = [
  { id: 'full',    title: 'Full Export',    sub: 'All goods have been re-exported.' },
  { id: 'partial', title: 'Partial Export', sub: 'Some goods have been re-exported.' },
  { id: 'no',      title: 'No Export',      sub: 'Goods have not been exported.' },
];

export type OutboundDetails = {
  outboundDeclNumber: string;
  outboundDate: string;
  portOfDischarge: string;
  totalQuantity: string;
  weight: string;
  remarks: string;
};

function OutboundDeclarationModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: OutboundDetails) => void;
}) {
  const [v, setV] = useState<OutboundDetails>({
    outboundDeclNumber: '',
    outboundDate: '',
    portOfDischarge: '',
    totalQuantity: '',
    weight: '',
    remarks: '',
  });
  const set = <K extends keyof OutboundDetails>(k: K, val: string) => setV((s) => ({ ...s, [k]: val }));
  const valid = v.outboundDeclNumber.trim() && v.outboundDate.trim();

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-[20px]"
      style={{ background: 'rgba(14,27,61,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col" style={{ width: 'min(960px, 100%)', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>Outbound Declaration Details</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="px-[28px] py-[24px] flex flex-col gap-[20px] overflow-y-auto">
          <p className="text-[16px] text-[#455174]">
            For a full re-export refund, please provide the outbound declaration number and supporting details so the claim can be matched to the export shipment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <FloatingField
              label="Outbound Declaration Number"
              required
              placeholder="Enter Declaration Number"
              value={v.outboundDeclNumber}
              onChange={(val) => set('outboundDeclNumber', val)}
              searchable
            />
            <DateInput
              label="Outbound Declaration Date"
              required
              value={v.outboundDate}
              onChange={(val) => set('outboundDate', val)}
            />
            <FloatingField
              label="Port of Discharge"
              placeholder="Choose Port"
              value={v.portOfDischarge}
              onChange={(val) => set('portOfDischarge', val)}
              trailingIcon={
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
              }
            />
            <FloatingField
              label="Total Quantity"
              placeholder="Enter Quantity"
              value={v.totalQuantity}
              onChange={(val) => set('totalQuantity', val)}
            />
            <FloatingField
              label="Weight (Kg)"
              placeholder="Enter Weight"
              value={v.weight}
              onChange={(val) => set('weight', val)}
            />
            <div className="md:col-span-2 lg:col-span-3">
              <FloatingField
                label="Remarks"
                placeholder="Enter Remarks"
                value={v.remarks}
                onChange={(val) => set('remarks', val)}
                height={80}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#eef1f6] px-[28px] py-[16px] flex items-center justify-end gap-[12px]">
          <button
            onClick={onClose}
            className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onSubmit(v)}
            className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: valid ? '#1360d2' : '#a7c3eb', cursor: valid ? 'pointer' : 'not-allowed', fontWeight: 500, boxShadow: valid ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Missing Document Deposit modal ─────
 * Refund details + Deposit Method dropdown (Standing Guarantee / Cash / e-Payment).
 */
export type DepositMethod = 'standing' | 'cash' | 'epayment';
export type MissingDocDetails = {
  refundAmount: string;
  currency: string;
  depositMethod: DepositMethod;
  remarks: string;
};

const DEPOSIT_METHOD_LABEL: Record<DepositMethod, string> = {
  standing: 'Standing Guarantee',
  cash: 'Cash',
  epayment: 'e-Payment',
};

function MissingDocDepositModal({
  open, onClose, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: MissingDocDetails) => void;
}) {
  const [refundAmount, setRefundAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [depositMethod, setDepositMethod] = useState<DepositMethod | ''>('');
  const [remarks, setRemarks] = useState('');
  const [open2, setOpen2] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open2) return;
    const onDoc = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen2(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open2]);

  const valid = refundAmount.trim() && depositMethod;
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-[20px]"
      style={{ background: 'rgba(14,27,61,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(900px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>Refund Details</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="px-[28px] py-[24px] flex flex-col gap-[20px]">
          <p className="text-[16px] text-[#455174]">Provide the refund amount and the original deposit method used for this declaration.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <FloatingField label="Refund Amount" required placeholder="Enter Amount" value={refundAmount} onChange={setRefundAmount} />
            <FloatingField label="Currency" placeholder="AED" value={currency} onChange={setCurrency} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />

            {/* Deposit Method dropdown */}
            <div className="relative" ref={dropRef}>
              <div
                tabIndex={0}
                onClick={() => setOpen2(!open2)}
                className={`h-[56px] border rounded-[4px] flex items-center px-[14px] cursor-pointer transition-colors bg-white ${open2 ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
              >
                <span className="text-[16px] flex-1" style={{ color: depositMethod ? '#0e1b3d' : '#697498' }}>
                  {depositMethod ? DEPOSIT_METHOD_LABEL[depositMethod] : 'Select'}
                </span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </div>
              {(() => {
                const floated = !!depositMethod || open2;
                return (
                  <span className="absolute pointer-events-none transition-all" style={{
                    left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
                    background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
                    fontSize: floated ? 12 : 14, color: floated ? (open2 ? '#1360d2' : '#0e1b3d') : '#455174',
                    transitionDuration: '120ms',
                  }}>
                    <span style={{ color: '#dc3545' }}>*</span>Deposit Method
                  </span>
                );
              })()}
              {open2 && (
                <div className="absolute z-[10] left-0 right-0 mt-[6px] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {(['standing', 'cash', 'epayment'] as DepositMethod[]).map((m) => (
                    <button
                      key={m}
                      className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                      onClick={() => { setDepositMethod(m); setOpen2(false); }}
                    >
                      <span className="text-[#1360d2] group-hover:text-white">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          {m === 'cash'     && <><rect x="3" y="6" width="14" height="9" rx="1.5" /><circle cx="10" cy="10.5" r="2" /></>}
                          {m === 'standing' && <><path d="M4 8l6-4 6 4v5a6 6 0 01-6 6 6 6 0 01-6-6V8z" /><path d="M7 11l2 2 4-4" /></>}
                          {m === 'epayment' && <><rect x="3" y="6" width="14" height="9" rx="1.5" /><path d="M3 10h14" /><path d="M6 13h3" /></>}
                        </svg>
                      </span>
                      <span className="text-[16px] text-[#111838] group-hover:text-white">{DEPOSIT_METHOD_LABEL[m]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <FloatingField label="Remarks" placeholder="Enter Remarks" value={remarks} onChange={setRemarks} height={80} />
            </div>
          </div>
        </div>
        <div className="border-t border-[#eef1f6] px-[28px] py-[16px] flex items-center justify-end gap-[12px]">
          <button onClick={onClose} className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff]" style={{ fontWeight: 500 }}>Cancel</button>
          <button
            disabled={!valid}
            onClick={() => valid && onSubmit({ refundAmount, currency, depositMethod: depositMethod as DepositMethod, remarks })}
            className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white"
            style={{ background: valid ? '#1360d2' : '#a7c3eb', cursor: valid ? 'pointer' : 'not-allowed', fontWeight: 500, boxShadow: valid ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Partial Export — Invoice / HS code selection ───── */
type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  hsCodes: { code: string; description: string; quantity: string; value: string }[];
};

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv1', invoiceNo: 'INV-2024-09812', date: '12/05/2024',
    hsCodes: [
      { code: '8471.30.0010', description: 'Portable computers', quantity: '50', value: 'Dh 250,000' },
      { code: '8517.12.0000', description: 'Mobile phones',       quantity: '120', value: 'Dh 480,000' },
    ],
  },
  {
    id: 'inv2', invoiceNo: 'INV-2024-09813', date: '12/05/2024',
    hsCodes: [
      { code: '8528.72.0000', description: 'Television receivers', quantity: '30',  value: 'Dh 90,000'  },
      { code: '8504.40.0000', description: 'Static converters',    quantity: '200', value: 'Dh 35,000'  },
    ],
  },
];

export type PartialExportSelection = {
  invoiceIds: string[];
  hsCodes: { invoiceId: string; code: string }[];
};

function PartialExportInvoiceModal({
  open, onClose, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (s: PartialExportSelection) => void;
}) {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set()); // key = `${invId}::${code}`
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedInvoices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedInvoices(next);
    if (!expanded.has(id) && next.has(id)) {
      const e = new Set(expanded); e.add(id); setExpanded(e);
    }
  };
  const toggleHs = (invId: string, code: string) => {
    const key = `${invId}::${code}`;
    const next = new Set(selectedHs);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelectedHs(next);
  };
  const toggleExpanded = (id: string) => {
    const e = new Set(expanded);
    if (e.has(id)) e.delete(id); else e.add(id);
    setExpanded(e);
  };

  const valid = selectedInvoices.size > 0 && selectedHs.size > 0;
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-[20px]"
      style={{ background: 'rgba(14,27,61,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col" style={{ width: 'min(960px, 100%)', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>Partial Export — Select Invoices &amp; HS Codes</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="px-[28px] py-[24px] flex flex-col gap-[16px] overflow-y-auto">
          <p className="text-[16px] text-[#455174]">Choose the invoices that contain the partially exported goods, then select the HS codes within each invoice that were re-exported.</p>
          <div className="flex flex-col gap-[12px]">
            {SAMPLE_INVOICES.map((inv) => {
              const invSelected = selectedInvoices.has(inv.id);
              const isExpanded  = expanded.has(inv.id);
              return (
                <div key={inv.id} className="border rounded-[8px]" style={{ borderColor: invSelected ? '#1360d2' : '#e0e6ef', background: invSelected ? '#f6f9fe' : '#fff' }}>
                  <div className="flex items-center gap-[12px] px-[16px] py-[14px] cursor-pointer" onClick={() => toggleExpanded(inv.id)}>
                    <button
                      role="checkbox"
                      aria-checked={invSelected}
                      onClick={(e) => { e.stopPropagation(); toggleInvoice(inv.id); }}
                      className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center"
                      style={{ border: `2px solid ${invSelected ? '#1360d2' : '#a7abb2'}`, background: invSelected ? '#1360d2' : '#fff' }}
                    >
                      {invSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                    </button>
                    <div className="flex-1 flex items-center gap-[16px]">
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{inv.invoiceNo}</span>
                      <span className="text-[16px] text-[#697498]">Date: {inv.date}</span>
                      <span className="text-[16px] text-[#697498]">{inv.hsCodes.length} HS code{inv.hsCodes.length !== 1 ? 's' : ''}</span>
                    </div>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="px-[16px] pb-[14px]">
                      <div className="overflow-x-auto rounded-[6px] border border-[#eef1f6]">
                        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f4f7fc' }}>
                              <th style={{ padding: '8px 12px', width: 36 }} />
                              <th className="text-left text-[16px] text-[#000]" style={{ padding: '8px 12px', fontWeight: 600 }}>HS Code</th>
                              <th className="text-left text-[16px] text-[#000]" style={{ padding: '8px 12px', fontWeight: 600 }}>Description</th>
                              <th className="text-left text-[16px] text-[#000]" style={{ padding: '8px 12px', fontWeight: 600 }}>Quantity</th>
                              <th className="text-left text-[16px] text-[#000]" style={{ padding: '8px 12px', fontWeight: 600 }}>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inv.hsCodes.map((hs) => {
                              const key = `${inv.id}::${hs.code}`;
                              const hsSelected = selectedHs.has(key);
                              return (
                                <tr key={hs.code} style={{ background: hsSelected ? '#f6f9fe' : '#fff' }}>
                                  <td style={{ padding: '8px 12px' }}>
                                    <button
                                      role="checkbox"
                                      aria-checked={hsSelected}
                                      onClick={() => toggleHs(inv.id, hs.code)}
                                      disabled={!invSelected}
                                      className="size-[18px] rounded-[3px] flex-shrink-0 inline-flex items-center justify-center"
                                      style={{ border: `2px solid ${hsSelected ? '#1360d2' : '#a7abb2'}`, background: hsSelected ? '#1360d2' : '#fff', cursor: invSelected ? 'pointer' : 'not-allowed', opacity: invSelected ? 1 : 0.5 }}
                                    >
                                      {hsSelected && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                                    </button>
                                  </td>
                                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px', fontWeight: 500 }}>{hs.code}</td>
                                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.description}</td>
                                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.quantity}</td>
                                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>
                                    <span className="inline-flex items-baseline gap-[4px]"><Dh /> {String(hs.value).replace(/^Dh\s*/, '')}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[#eef1f6] px-[28px] py-[16px] flex items-center justify-end gap-[12px]">
          <button onClick={onClose} className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff]" style={{ fontWeight: 500 }}>Cancel</button>
          <button
            disabled={!valid}
            onClick={() => {
              if (!valid) return;
              onSubmit({
                invoiceIds: Array.from(selectedInvoices),
                hsCodes: Array.from(selectedHs).map((k) => { const [invoiceId, code] = k.split('::'); return { invoiceId, code }; }),
              });
            }}
            className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white"
            style={{ background: valid ? '#1360d2' : '#a7c3eb', cursor: valid ? 'pointer' : 'not-allowed', fontWeight: 500, boxShadow: valid ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function RefundTypeModal({ open, onClose, onContinue }: { open: boolean; onClose: () => void; onContinue: (type: RefundType) => void }) {
  const [selected, setSelected] = useState<RefundType | null>(null);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-[20px]"
      style={{ background: 'rgba(14,27,61,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(680px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>Select Refund Type</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="px-[28px] py-[24px] flex flex-col gap-[14px]">
          <p className="text-[16px] text-[#455174]">Please choose the refund type to begin your claim.</p>
          <div className="flex flex-col gap-[12px]">
            {REFUND_OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className="flex items-center gap-[14px] px-[16px] py-[14px] rounded-[7px] text-left transition-colors"
                  style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#ddd'}` }}
                >
                  <span className="size-[20px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                    {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                  </span>
                  <span className="flex flex-col gap-[4px]">
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                    <span className="text-[16px] text-[#696f83]">{opt.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[8px]">
            <button onClick={onClose} className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors" style={{ fontWeight: 500 }}>Cancel</button>
            <button
              disabled={!selected}
              onClick={() => selected && onContinue(selected)}
              className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: selected ? '#1360d2' : '#a7c3eb', cursor: selected ? 'pointer' : 'not-allowed', fontWeight: 500, boxShadow: selected ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type RowKind = 'request' | 'requestExt' | 'expired';

export type Row = {
  declarationNo: string;
  declarationDate: string;
  depositType: string;
  declarationCategory: string | null;
  depositAmount: string;     // 'Dh 1,000' or 'N/A'
  depositMethod: string;     // 'Cash' / 'Standing Guarantee' / 'N/A'
  claimExpiry: string;
  exportExpiry: string;
  remarks: string;
  kind: RowKind;
  importerCode?: string;     // for Non Remittance filtering
};

const ROWS: Row[] = [
  // ── Refund of Deposits ─────────────────────────────────────────────────────
  // Alternative Duty Deposit
  { declarationNo: '105-01426431-24', declarationDate: '09/10/2024', depositType: 'Alternative Duty Deposit',          declarationCategory: 'Import for Re Export',          depositAmount: 'Dh 1,000', depositMethod: 'Standing Guarantee', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025', remarks: '—', kind: 'requestExt' },
  { declarationNo: '404-09988123-24', declarationDate: '07/02/2024', depositType: 'Alternative Duty Deposit',          declarationCategory: 'Temporary Admission',           depositAmount: 'Dh 5,000', depositMethod: 'Standing Guarantee', claimExpiry: '07/01/2025', exportExpiry: '05/15/2025', remarks: '—', kind: 'requestExt' },
  { declarationNo: '201-07612301-24', declarationDate: '08/14/2024', depositType: 'Alternative Duty Deposit',          declarationCategory: 'Transit (ROW to ROW)',          depositAmount: 'Dh 2,200', depositMethod: 'Cash',               claimExpiry: '06/15/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  { declarationNo: '209-03312099-24', declarationDate: '10/05/2024', depositType: 'Alternative Duty Deposit',          declarationCategory: 'FZ Export',                    depositAmount: 'Dh 3,800', depositMethod: 'Cash',               claimExpiry: '05/01/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  // Cargo Transfer Deposit
  { declarationNo: '301-08821001-24', declarationDate: '10/21/2024', depositType: 'Cargo Transfer Deposit',            declarationCategory: 'Cargo Transfer from CTO to CH', depositAmount: 'Dh 1,500', depositMethod: 'Cash',               claimExpiry: '07/12/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  { declarationNo: '302-04490111-24', declarationDate: '11/02/2024', depositType: 'Cargo Transfer Deposit',            declarationCategory: 'Cargo Transfer from CH to CH',  depositAmount: 'Dh 2,000', depositMethod: 'Cash',               claimExpiry: '06/01/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  { declarationNo: '303-07731209-24', declarationDate: '09/18/2024', depositType: 'Cargo Transfer Deposit',            declarationCategory: 'Bonded Movement',              depositAmount: 'Dh 800',   depositMethod: 'Standing Guarantee', claimExpiry: '05/20/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  // Duty Deposit (Refund of Deposit context — direct)
  { declarationNo: '108-05512790-24', declarationDate: '11/02/2024', depositType: 'Duty Deposit',                      declarationCategory: 'Import',                       depositAmount: 'Dh 3,200', depositMethod: 'Standing Guarantee', claimExpiry: '05/01/2025', exportExpiry: '04/01/2025', remarks: '—', kind: 'requestExt' },
  // Document Deposit
  { declarationNo: '101-04498436-24', declarationDate: '12/05/2024', depositType: 'Document Deposit',                  declarationCategory: null,                           depositAmount: 'Dh 1,000', depositMethod: 'Cash',               claimExpiry: '04/03/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  // CDM Deposit
  { declarationNo: '202-08812205-24', declarationDate: '08/14/2024', depositType: 'CDM Deposit',                       declarationCategory: null,                           depositAmount: 'Dh 2,500', depositMethod: 'Cash',               claimExpiry: '06/15/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  // Declaration Amendment - Deposit
  { declarationNo: '410-09912044-24', declarationDate: '07/15/2024', depositType: 'Declaration Amendment - Deposit',   declarationCategory: null,                           depositAmount: 'Dh 1,200', depositMethod: 'Cash',               claimExpiry: '07/01/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },
  // Declaration Cancellation - Deposit
  { declarationNo: '510-03318821-24', declarationDate: '06/22/2024', depositType: 'Declaration Cancellation - Deposit',declarationCategory: null,                           depositAmount: 'Dh 4,000', depositMethod: 'Cash',               claimExpiry: '06/30/2025', exportExpiry: 'N/A',        remarks: '—', kind: 'request' },

  // ── Refund of Duty ─────────────────────────────────────────────────────────
  // Duty Deposit + Import (needs refund type selection)
  { declarationNo: '506-02100934-24', declarationDate: '09/18/2024', depositType: 'Duty Deposit',                               declarationCategory: 'Import',              depositAmount: 'Dh 1,800', depositMethod: 'Cash', claimExpiry: '05/20/2025', exportExpiry: 'N/A', remarks: '—', kind: 'request' },
  // Declaration Amendment - Duty / Charges (direct)
  { declarationNo: '507-03219875-24', declarationDate: '08/03/2024', depositType: 'Declaration Amendment - Duty / Charges',     declarationCategory: 'Import',              depositAmount: 'Dh 6,200', depositMethod: 'Cash', claimExpiry: '06/05/2025', exportExpiry: 'N/A', remarks: '—', kind: 'request' },
  { declarationNo: '511-04412309-24', declarationDate: '07/15/2024', depositType: 'Declaration Amendment - Duty / Charges',     declarationCategory: 'Import For Re-Export',depositAmount: 'Dh 2,400', depositMethod: 'Cash', claimExpiry: '07/01/2025', exportExpiry: 'N/A', remarks: '—', kind: 'request' },
  // Declaration Cancellation Refund - Duty / Charges (direct)
  { declarationNo: '512-05501201-24', declarationDate: '10/10/2024', depositType: 'Declaration Cancellation Refund - Duty / Charges', declarationCategory: 'Import For Re-Export', depositAmount: 'Dh 3,000', depositMethod: 'Cash', claimExpiry: '05/15/2025', exportExpiry: 'N/A', remarks: '—', kind: 'request' },

  // ── Non Remittance ─────────────────────────────────────────────────────────
  { declarationNo: '303-02655456-24', declarationDate: '10/21/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '12/19/2024', exportExpiry: '11/19/2024', remarks: '—', kind: 'expired',  importerCode: 'A180' },
  { declarationNo: '305-08812345-24', declarationDate: '11/12/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '07/12/2025', exportExpiry: '06/12/2025', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '306-09923411-24', declarationDate: '11/25/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '08/01/2025', exportExpiry: '07/01/2025', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '307-01134522-25', declarationDate: '01/08/2025', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '09/15/2025', exportExpiry: '08/15/2025', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '308-02245633-25', declarationDate: '02/14/2025', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '10/20/2025', exportExpiry: '09/20/2025', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '401-05567890-24', declarationDate: '09/30/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '07/30/2025', exportExpiry: '06/30/2025', remarks: '—', kind: 'request', importerCode: 'A220' },
  { declarationNo: '402-06678901-24', declarationDate: '10/15/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '08/10/2025', exportExpiry: '07/10/2025', remarks: '—', kind: 'request', importerCode: 'A220' },
  { declarationNo: '403-07789012-24', declarationDate: '11/03/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '09/01/2025', exportExpiry: '08/01/2025', remarks: '—', kind: 'request', importerCode: 'A350' },
];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
  initialClaimType?: ClaimType | null;
  onProceed?: (rows: Row[], claimType: ClaimType) => void;
  onDeclarationOpen?: (declNo: string) => void;
};

const CLAIM_TYPE_OPTIONS: { id: ClaimType; title: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'refundDeposit',
    title: 'Refund of Deposits',
    sub: 'Duty deposit, Missing document deposit, Exemption deposits — any deposit labeled by Dubai Customs.',
    icon: (
      <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="9" width="22" height="15" rx="2" />
        <circle cx="16" cy="16.5" r="3.5" />
        <path d="M9 13h.01M23 20h.01" />
      </svg>
    ),
  },
  {
    id: 'refundDuty',
    title: 'Refund of Duty',
    sub: 'Cancelled or amended declarations and duty-exempted goods.',
    icon: (
      <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5h13l5 5v17H8z" />
        <path d="M21 5v5h5" />
        <path d="M13 16h6M13 20h6M13 12h3" />
      </svg>
    ),
  },
  {
    id: 'nonRemittance',
    title: 'Non Remittance',
    sub: 'Applicable for Free Zone exports without any deposit.',
    icon: (
      <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M11 16h10M16 11v10" />
      </svg>
    ),
  },
];

const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  refundDeposit: 'Refund of Deposits',
  refundDuty:    'Refund of Duty',
  nonRemittance: 'Non Remittance',
};

/**
 * Map each claim type to the deposit-types eligible for that claim.
 *
 * - Refund of Deposits: any deposit-labeled item (Duty deposit, Missing
 *   Document, Exemption deposit, Anti-Dumping, Alternative Duty Rate, etc.).
 * - Refund of Duty: cancelled/amended declarations + duty-exempted goods —
 *   surfaced in mock data as "Duty Exempted" / "Cancelled/Amended" rows.
 * - Non Remittance: Free Zone exports without any deposit — surfaced as
 *   "Non Remittance Claim" rows.
 */
const CLAIM_TYPE_DEPOSITS: Record<ClaimType, string[]> = {
  refundDeposit: [
    'Alternative Duty Deposit',
    'Cargo Transfer Deposit',
    'Duty Deposit',
    'Document Deposit',
    'CDM Deposit',
    'Declaration Amendment - Deposit',
    'Declaration Cancellation - Deposit',
  ],
  refundDuty: [
    'Duty Deposit',
    'Declaration Amendment - Duty / Charges',
    'Declaration Cancellation Refund - Duty / Charges',
  ],
  nonRemittance: [
    'Non Remittance Claim',
  ],
};

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};
const codeWithName = (code: string) =>
  IMPORTER_CODE_NAMES[code] ? `${code} - ${IMPORTER_CODE_NAMES[code]}` : code;

export default function EligibleDeclarationsPage({ onBack, onBackToListing, initialClaimType, onProceed, onDeclarationOpen }: Props) {
  const [claimType, setClaimType] = useState<ClaimType | null>(initialClaimType ?? null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchType, setSearchType] = useState<'Declaration Number' | 'Owner Code'>('Declaration Number');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [ownerCodeFilter, setOwnerCodeFilter] = useState('');
  const [ownerCodeSearchOpen, setOwnerCodeSearchOpen] = useState(false);
  const ownerSearchRef = useRef<HTMLDivElement>(null);

  // Refund of Deposits — Deposit Method filter
  const [depositMethodFilter, setDepositMethodFilter] = useState('');
  const [depositMethodOpen, setDepositMethodOpen] = useState(false);
  const [depositMethodSearch, setDepositMethodSearch] = useState('');
  const depositMethodRef = useRef<HTMLDivElement>(null);

  // Refund of Deposits — Charge Type filter
  const [chargeTypeFilter, setChargeTypeFilter] = useState('');
  const [chargeTypeOpen, setChargeTypeOpen] = useState(false);
  const [chargeTypeSearch, setChargeTypeSearch] = useState('');
  const chargeTypeRef = useRef<HTMLDivElement>(null);
  // derive legacy query from combined field
  const query = searchType === 'Declaration Number' ? searchText : '';
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedDecls, setSelectedDecls] = useState<Set<string>>(new Set());
  const [overLimitError, setOverLimitError] = useState(false);
  const claimTypePreset = initialClaimType != null;

  // First filter by claim type, then by search query, then by importer code
  const claimTypeFiltered = useMemo(() => {
    if (!claimType) return ROWS;
    const allowed = new Set(CLAIM_TYPE_DEPOSITS[claimType]);
    return ROWS.filter((r) => allowed.has(r.depositType));
  }, [claimType]);

  // Distinct importer codes for the dropdown (Non Remittance only)
  const importerCodes = useMemo(() => {
    const codes = new Set<string>();
    claimTypeFiltered.forEach((r) => { if (r.importerCode) codes.add(r.importerCode); });
    return Array.from(codes).sort();
  }, [claimTypeFiltered]);

  const filteredOwnerCodes = useMemo(
    () => importerCodes.filter((c) => !searchText || codeWithName(c).toLowerCase().includes(searchText.toLowerCase())),
    [importerCodes, searchText]
  );

  const filtered = useMemo(() => {
    let rows = claimTypeFiltered.filter((r) => r.kind !== 'expired');
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.declarationNo.toLowerCase().includes(q));
    if (ownerCodeFilter) rows = rows.filter((r) => r.importerCode === ownerCodeFilter);
    if (depositMethodFilter) rows = rows.filter((r) => r.depositMethod === depositMethodFilter);
    if (chargeTypeFilter) rows = rows.filter((r) => r.depositType === chargeTypeFilter);
    return rows;
  }, [query, ownerCodeFilter, depositMethodFilter, chargeTypeFilter, claimTypeFiltered]);

  const isNonRemittance = claimType === 'nonRemittance';

  // Close search dropdowns when clicking outside
  useEffect(() => {
    if (!ownerCodeSearchOpen && !searchTypeOpen && !depositMethodOpen && !chargeTypeOpen) return;
    const handler = (e: MouseEvent) => {
      if (ownerSearchRef.current && !ownerSearchRef.current.contains(e.target as Node)) {
        setOwnerCodeSearchOpen(false);
        setSearchTypeOpen(false);
      }
      if (depositMethodRef.current && !depositMethodRef.current.contains(e.target as Node)) {
        setDepositMethodOpen(false);
      }
      if (chargeTypeRef.current && !chargeTypeRef.current.contains(e.target as Node)) {
        setChargeTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ownerCodeSearchOpen, searchTypeOpen, depositMethodOpen, chargeTypeOpen]);

  // Returns true if adding this row would exceed 10 selections for its importer code
  const wouldExceedLimit = (row: Row, currentSelected: Set<string>) => {
    if (!isNonRemittance || !row.importerCode) return false;
    const countForCode = Array.from(currentSelected).filter(
      (no) => ROWS.find((r) => r.declarationNo === no)?.importerCode === row.importerCode
    ).length;
    return countForCode >= 10;
  };
  const headers: { label: string; w: number }[] = isNonRemittance
    ? [
        { label: 'Declaration No.',              w: 170 },
        { label: 'Declaration Clearance Date',   w: 180 },
        { label: 'Declaration Type',             w: 180 },
        { label: 'Owner Code',                   w: 260 },
        { label: 'Claim Expiry',                 w: 130 },
        { label: 'Export Expiry',                w: 130 },
        { label: 'Remarks',                      w: 110 },
      ]
    : [
        { label: 'Declaration No.',              w: 170 },
        { label: 'Declaration Clearance Date',   w: 180 },
        { label: 'Charge Type',                  w: 200 },
        { label: 'Declaration Type',             w: 190 },
        { label: 'Deposit Amount',               w: 150 },
        { label: 'Deposit Method',               w: 160 },
        { label: 'Remarks',                      w: 110 },
      ];
  const tableMinWidth = headers.reduce((s, h) => s + h.w, 0) + 48 + 130;

  const STATUS_STYLE = {
    Active:  { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
    Expired: { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  } as const;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          {claimType === 'refundDeposit' ? 'Raise New Claim - Refund of Deposits' : claimType === 'nonRemittance' ? 'Raise New Claim - Non Remittance' : 'Raise New Claim'}
        </h1>

        <div>
          <ClaimStepper activeIndex={0} steps={claimType === 'nonRemittance' ? NR_CLAIM_STEPS : claimType === 'refundDeposit' ? REFUND_DEPOSIT_STEPS : undefined} />
        </div>
        {/* Claim Type selection card — hidden if type already chosen via ClaimTypeEntryPage */}
        {!claimTypePreset && (
          <div className="bg-white rounded-[8px] flex flex-col gap-[18px] px-[24px] py-[22px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex items-center gap-[12px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Claim Type</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
              {CLAIM_TYPE_OPTIONS.map((opt) => {
                const active = claimType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setClaimType(opt.id); setSearchText(''); setOwnerCodeFilter(''); setPage(1); setSelectedDecls(new Set()); setDepositMethodFilter(''); setChargeTypeFilter(''); }}
                    className="flex items-start gap-[14px] px-[16px] py-[16px] rounded-[10px] text-left transition-colors h-full"
                    style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
                  >
                    <div className="size-[48px] rounded-[8px] inline-flex items-center justify-center flex-shrink-0" style={{ background: active ? '#e8f0ff' : '#f4f7fc' }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                      <div className="flex items-center justify-between gap-[10px]">
                        <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                        <span className="size-[20px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                          {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {/* Title bar */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#eef1f6] flex-wrap gap-[12px]">
            <div className="flex items-center gap-[12px] flex-wrap">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Eligible Declarations</p>
              {claimType && (
                <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[12px]" style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500, fontFamily: "'Dubai', sans-serif" }}>
                  {CLAIM_TYPE_LABEL[claimType]}
                </span>
              )}
            </div>
          </div>

          {/* Empty state when no claim type chosen */}
          {!claimType && (
            <div className="flex flex-col items-center justify-center gap-[10px] py-[60px] px-[24px] text-center">
              <div className="size-[64px] rounded-full inline-flex items-center justify-center" style={{ background: '#f4f7fc' }}>
                <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="9" /><path d="M21 21l5 5" /></svg>
              </div>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select a claim type to view eligible declarations</p>
              <p className="text-[16px] text-[#697498]">Choose Refund of Deposits, Refund of Duty, or Non Remittance above to see your eligible declarations.</p>
            </div>
          )}

          {/* Search + filters — only shown after claim type is selected */}
          {claimType && (
            <div className="px-[24px] pt-[20px] pb-[8px] flex flex-col gap-[12px]">
              <div className="flex flex-wrap gap-[12px] items-start">
                {/* Combined search field — type dropdown + input */}
                <div ref={ownerSearchRef} className="relative" style={{ minWidth: 320, flex: '1 1 320px', maxWidth: 520 }}>
                  <div
                    className="flex items-center bg-white rounded-[4px] h-[48px]"
                    style={{ border: `1px solid ${ownerCodeSearchOpen || searchTypeOpen ? '#1360d2' : '#d5ddfb'}` }}
                  >
                    {/* Type dropdown button */}
                    <button
                      type="button"
                      onClick={() => { setSearchTypeOpen(o => !o); setOwnerCodeSearchOpen(false); }}
                      className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full flex-shrink-0 hover:bg-[#f7faff] transition-colors rounded-l-[4px]"
                    >
                      <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>{searchType}</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.5" style={{ flexShrink: 0, transform: searchTypeOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {/* Search icon */}
                    <span className="pl-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
                    </span>
                    {/* Input */}
                    <input
                      value={searchType === 'Owner Code' && ownerCodeFilter ? codeWithName(ownerCodeFilter) : searchText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchText(val);
                        setOwnerCodeFilter('');
                        setPage(1);
                        if (searchType === 'Owner Code') setOwnerCodeSearchOpen(true);
                      }}
                      onFocus={() => { if (searchType === 'Owner Code') setOwnerCodeSearchOpen(true); }}
                      placeholder={searchType === 'Declaration Number' ? 'Search Declaration Number' : 'Search Owner Code'}
                      className="flex-1 px-[10px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    {/* Clear */}
                    {(searchText || ownerCodeFilter) && (
                      <button
                        type="button"
                        onClick={() => { setSearchText(''); setOwnerCodeFilter(''); setPage(1); setSelectedDecls(new Set()); }}
                        className="mr-[8px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0"
                      >
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                      </button>
                    )}
                  </div>

                  {/* Search type options */}
                  {searchTypeOpen && (
                    <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                      {(['Declaration Number', ...(isNonRemittance ? ['Owner Code'] : [])] as ('Declaration Number' | 'Owner Code')[]).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => { setSearchType(opt); setSearchTypeOpen(false); setSearchText(''); setOwnerCodeFilter(''); setOwnerCodeSearchOpen(false); setPage(1); }}
                          className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                          style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === searchType ? 500 : 400 }}
                        >{opt}</button>
                      ))}
                    </div>
                  )}

                  {/* Owner code suggestions */}
                  {searchType === 'Owner Code' && ownerCodeSearchOpen && (
                    <div className="absolute z-50 bg-white rounded-[8px] overflow-y-auto" style={{ top: '100%', left: 0, right: 0, marginTop: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.14)', border: '1px solid #e0e6ef', maxHeight: 240 }}>
                      {filteredOwnerCodes.length === 0 ? (
                        <div className="px-[14px] py-[11px]"><span className="text-[16px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>No matching codes</span></div>
                      ) : (
                        <>
                          <button type="button" onClick={() => { setOwnerCodeFilter(''); setSearchText(''); setPage(1); setSelectedDecls(new Set()); setOwnerCodeSearchOpen(false); }} className="group w-full flex items-center gap-[10px] px-[14px] py-[11px] text-left hover:bg-[#1360d2] transition-colors">
                            <span className="text-[16px] text-[#697498] group-hover:text-white" style={{ fontFamily: "'Dubai', sans-serif" }}>All Owner Codes</span>
                          </button>
                          {filteredOwnerCodes.map((code) => (
                            <button key={code} type="button" onClick={() => { setOwnerCodeFilter(code); setSearchText(codeWithName(code)); setOwnerCodeSearchOpen(false); setPage(1); setSelectedDecls(new Set()); }} className="group w-full flex items-center gap-[10px] px-[14px] py-[11px] text-left hover:bg-[#1360d2] transition-colors">
                              <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: "'Dubai', sans-serif" }}>{codeWithName(code)}</span>
                              {ownerCodeFilter === code && <svg className="ml-auto group-hover:stroke-white" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Deposit Method — floating-label combobox, Refund of Deposits only */}
                {claimType === 'refundDeposit' && (() => {
                  const DM_OPTIONS = ['Standing Guarantee', 'Cash', 'Debit Account'];
                  const filtered_dm = DM_OPTIONS.filter(o => o.toLowerCase().includes(depositMethodSearch.toLowerCase()));
                  const dmFloated = depositMethodOpen || !!depositMethodFilter;
                  return (
                    <div ref={depositMethodRef} className="relative flex-shrink-0" style={{ minWidth: 200 }}>
                      <div
                        className="bg-white rounded-[4px] flex items-center px-[16px] h-[48px] transition-colors"
                        style={{ border: `1px solid ${depositMethodOpen ? '#1360d2' : '#d5ddfb'}` }}
                      >
                        <input
                          value={depositMethodOpen ? depositMethodSearch : depositMethodFilter}
                          onChange={e => { setDepositMethodSearch(e.target.value); }}
                          onFocus={() => { setDepositMethodOpen(true); setDepositMethodSearch(''); }}
                          placeholder=""
                          className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent"
                          style={{ fontFamily: "'Dubai', sans-serif" }}
                        />
                        {depositMethodFilter && !depositMethodOpen
                          ? <button type="button" onMouseDown={e => { e.preventDefault(); setDepositMethodFilter(''); setPage(1); }} className="flex-shrink-0 size-[20px] inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff]">
                              <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#697498" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                            </button>
                          : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0, transition: 'transform 0.15s', transform: depositMethodOpen ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6" /></svg>
                        }
                      </div>
                      <span
                        className="absolute pointer-events-none transition-all"
                        style={{
                          left: dmFloated ? 10 : 16, top: dmFloated ? -9 : '50%',
                          transform: dmFloated ? 'none' : 'translateY(-50%)',
                          background: dmFloated ? '#fff' : 'transparent',
                          padding: dmFloated ? '0 4px' : 0,
                          fontSize: dmFloated ? 12 : 16,
                          color: dmFloated ? (depositMethodOpen ? '#1360d2' : '#000') : '#000',
                          transitionDuration: '120ms', transitionProperty: 'top,left,font-size,transform,padding,background,color',
                          fontFamily: "'Dubai', sans-serif",
                        }}
                      >Deposit Method</span>
                      {depositMethodOpen && (
                        <div className="absolute z-[80] left-0 right-0 bg-white rounded-[8px] py-[4px]" style={{ top: 'calc(100% + 4px)', boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', maxHeight: 220, overflowY: 'auto' }}>
                          {filtered_dm.length === 0
                            ? <p className="px-[14px] py-[10px] text-[14px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>No results</p>
                            : filtered_dm.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onMouseDown={e => { e.preventDefault(); setDepositMethodFilter(opt === depositMethodFilter ? '' : opt); setDepositMethodOpen(false); setDepositMethodSearch(''); setPage(1); }}
                                className="group flex items-center justify-between w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              >
                                <span className={`text-[16px] group-hover:text-white ${opt === depositMethodFilter ? 'text-[#1360d2]' : 'text-[#111838]'}`} style={{ fontFamily: "'Dubai', sans-serif", fontWeight: opt === depositMethodFilter ? 500 : 400 }}>{opt}</span>
                                {opt === depositMethodFilter && <svg className="group-hover:stroke-white" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Charge Type — floating-label combobox, Refund of Deposits only */}
                {claimType === 'refundDeposit' && (() => {
                  const CT_OPTIONS = [
                    { label: 'Alternative Duty Deposit',          value: 'Alternative Duty Deposit' },
                    { label: 'Cargo Transfer Deposit',            value: 'Cargo Transfer Deposit' },
                    { label: 'Duty Deposit',                      value: 'Duty Deposit' },
                    { label: 'Document Deposit',                  value: 'Document Deposit' },
                    { label: 'CDM Deposit',                       value: 'CDM Deposit' },
                    { label: 'Declaration Amendment - Deposit',   value: 'Declaration Amendment - Deposit' },
                    { label: 'Declaration Cancellation - Deposit',value: 'Declaration Cancellation - Deposit' },
                  ];
                  const filtered_ct = CT_OPTIONS.filter(o => o.label.toLowerCase().includes(chargeTypeSearch.toLowerCase()));
                  const selectedLabel = CT_OPTIONS.find(o => o.value === chargeTypeFilter)?.label ?? '';
                  const ctFloated = chargeTypeOpen || !!chargeTypeFilter;
                  return (
                    <div ref={chargeTypeRef} className="relative flex-shrink-0" style={{ minWidth: 230 }}>
                      <div
                        className="bg-white rounded-[4px] flex items-center px-[16px] h-[48px] transition-colors"
                        style={{ border: `1px solid ${chargeTypeOpen ? '#1360d2' : '#d5ddfb'}` }}
                      >
                        <input
                          value={chargeTypeOpen ? chargeTypeSearch : selectedLabel}
                          onChange={e => { setChargeTypeSearch(e.target.value); }}
                          onFocus={() => { setChargeTypeOpen(true); setChargeTypeSearch(''); }}
                          placeholder=""
                          className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent"
                          style={{ fontFamily: "'Dubai', sans-serif" }}
                        />
                        {chargeTypeFilter && !chargeTypeOpen
                          ? <button type="button" onMouseDown={e => { e.preventDefault(); setChargeTypeFilter(''); setPage(1); }} className="flex-shrink-0 size-[20px] inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff]">
                              <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#697498" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                            </button>
                          : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0, transition: 'transform 0.15s', transform: chargeTypeOpen ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6" /></svg>
                        }
                      </div>
                      <span
                        className="absolute pointer-events-none transition-all"
                        style={{
                          left: ctFloated ? 10 : 16, top: ctFloated ? -9 : '50%',
                          transform: ctFloated ? 'none' : 'translateY(-50%)',
                          background: ctFloated ? '#fff' : 'transparent',
                          padding: ctFloated ? '0 4px' : 0,
                          fontSize: ctFloated ? 12 : 16,
                          color: ctFloated ? (chargeTypeOpen ? '#1360d2' : '#000') : '#000',
                          transitionDuration: '120ms', transitionProperty: 'top,left,font-size,transform,padding,background,color',
                          fontFamily: "'Dubai', sans-serif",
                        }}
                      >Charge Type</span>
                      {chargeTypeOpen && (
                        <div className="absolute z-[80] left-0 right-0 bg-white rounded-[8px] py-[4px]" style={{ top: 'calc(100% + 4px)', boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', maxHeight: 260, overflowY: 'auto' }}>
                          {filtered_ct.length === 0
                            ? <p className="px-[14px] py-[10px] text-[14px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>No results</p>
                            : filtered_ct.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onMouseDown={e => { e.preventDefault(); setChargeTypeFilter(opt.value === chargeTypeFilter ? '' : opt.value); setChargeTypeOpen(false); setChargeTypeSearch(''); setPage(1); }}
                                className="group flex items-center justify-between w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              >
                                <span className={`text-[16px] group-hover:text-white ${opt.value === chargeTypeFilter ? 'text-[#1360d2]' : 'text-[#111838]'}`} style={{ fontFamily: "'Dubai', sans-serif", fontWeight: opt.value === chargeTypeFilter ? 500 : 400 }}>{opt.label}</span>
                                {opt.value === chargeTypeFilter && <svg className="group-hover:stroke-white" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Info bar */}
              {claimType && (
                <div className="flex flex-col gap-[8px]">
                  {isNonRemittance && (
                    <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[2px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                      <p className="text-[16px] text-[#0e1b3d]">
                        Max 10 records per importer. Only one importer can be selected at a time.
                      </p>
                    </div>
                  )}
                  {/* Available / Selected — always below the info card */}
                  <div className="flex items-center gap-[16px]">
                    <span className="text-[16px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                      Available: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{filtered.filter((r) => r.kind !== 'expired').length}</span>
                    </span>
                    {selectedDecls.size > 0 && (
                      <span className="text-[16px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                        Selected: <span style={{ color: '#1360d2', fontWeight: 600 }}>{selectedDecls.size}</span>
                      </span>
                    )}
                  </div>
                  {/* Over-limit error */}
                  {overLimitError && (
                    <div className="flex items-center gap-[8px] rounded-[6px] px-[14px] py-[8px]" style={{ background: '#fff4f4', border: '1px solid #f5c6cb' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" strokeLinecap="round" /></svg>
                      <p className="text-[16px] text-[#dc3545]">Only 10 declarations can be selected per importer at a time.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Table — only shown after claim type is selected */}
          {claimType && (
          <>
          <div className="overflow-x-auto px-[16px] pt-[8px] pb-[16px]">
            <table style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: "'Dubai', sans-serif" }} className="w-full eligible-table">
              <thead>
                <tr>
                  <th style={{ width: 48, minWidth: 48, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                    {(() => {
                      const selectableRows = filtered.filter((r) => r.kind !== 'expired');
                      const allSelected = selectableRows.length > 0 && selectableRows.every((r) => selectedDecls.has(r.declarationNo));
                      const someSelected = !allSelected && selectableRows.some((r) => selectedDecls.has(r.declarationNo));
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            if (allSelected) {
                              setSelectedDecls(new Set());
                            } else {
                              // For Non Remittance: respect 10-per-importer-code limit
                              if (isNonRemittance) {
                                const byCode: Record<string, string[]> = {};
                                selectableRows.forEach((r) => {
                                  const code = r.importerCode ?? '__none__';
                                  byCode[code] = byCode[code] ?? [];
                                  byCode[code].push(r.declarationNo);
                                });
                                const next = new Set<string>();
                                Object.values(byCode).forEach((nos) => nos.slice(0, 10).forEach((no) => next.add(no)));
                                setSelectedDecls(next);
                              } else {
                                setSelectedDecls(new Set(selectableRows.map((r) => r.declarationNo)));
                              }
                            }
                          }}
                          className="size-[20px] rounded-[4px] inline-flex items-center justify-center"
                          style={{ border: `2px solid ${allSelected || someSelected ? '#1360d2' : '#a7abb2'}`, background: allSelected ? '#1360d2' : '#fff', cursor: 'pointer' }}
                          aria-label="Select all"
                        >
                          {allSelected && (
                            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>
                          )}
                          {someSelected && (
                            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2.5" strokeLinecap="round"><path d="M4 8h8" /></svg>
                          )}
                        </button>
                      );
                    })()}
                  </th>
                  {headers.map((col) => (
                    <th key={col.label} style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <div className="flex items-center gap-[4px]">
                        <span className="text-[16px] text-[#000] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>{col.label}</span>
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M5 8h6M7 12h2" /></svg>
                      </div>
                    </th>
                  ))}
                  <th style={{ position: 'sticky', right: 0, width: 130, minWidth: 130, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                    <div className="flex items-center gap-[4px]">
                      <span className="text-[16px] text-[#455174] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>Status</span>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#8f94ae" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M5 8h6M7 12h2" /></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 2} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                      <span className="text-[16px] text-[#697498]">No matching declarations found.</span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => {
                    const expired = row.kind === 'expired';
                    const isSelected = selectedDecls.has(row.declarationNo);
                    const atLimit = selectedDecls.size >= 10 && !isSelected;
                    const toggleRow = () => {
                      if (expired || atLimit) return;
                      setSelectedDecls((prev) => {
                        const next = new Set(prev);
                        if (next.has(row.declarationNo)) {
                          next.delete(row.declarationNo);
                          setOverLimitError(false);
                        } else {
                          if (!wouldExceedLimit(row, next)) {
                            next.add(row.declarationNo);
                            setOverLimitError(false);
                          } else {
                            setOverLimitError(true);
                          }
                        }
                        return next;
                      });
                    };
                    const cell = (content: React.ReactNode, w: number) => (
                      <td style={{ background: isSelected ? '#f6f9fe' : '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w, opacity: expired ? 0.55 : 1 }}>{content}</td>
                    );
                    const txt = (v: React.ReactNode) => <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
                    return (
                      <tr key={i} className={`${expired ? 'is-disabled' : ''} ${isSelected ? 'is-selected' : ''}`.trim()} onClick={toggleRow} style={{ cursor: expired || atLimit ? 'default' : 'pointer' }}>
                        <td style={{ background: isSelected ? '#f6f9fe' : '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 48 }}>
                          <button
                            type="button"
                            disabled={expired || atLimit}
                            onClick={(e) => { e.stopPropagation(); toggleRow(); }}
                            role="checkbox"
                            aria-checked={isSelected}
                            className="size-[20px] rounded-[4px] inline-flex items-center justify-center"
                            style={{ border: `2px solid ${isSelected ? '#1360d2' : '#a7abb2'}`, opacity: (expired || atLimit) ? 0.4 : 1, cursor: (expired || atLimit) ? 'not-allowed' : 'pointer', background: isSelected ? '#1360d2' : '#fff' }}
                          >
                            {isSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                          </button>
                        </td>
                        {cell(
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeclarationOpen?.(row.declarationNo); }}
                            className="text-[16px] text-[#1360d2] hover:underline whitespace-nowrap"
                            style={{ fontWeight: 500 }}
                          >{row.declarationNo}</a>,
                          170
                        )}
                        {cell(txt(row.declarationDate), 140)}
                        {isNonRemittance ? (
                          <>
                            {cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.declarationCategory ?? 'Freezone Export'}</span>, 180)}
                            {cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.importerCode ? codeWithName(row.importerCode) : '—'}</span>, 140)}
                            {cell(<span className="text-[16px] whitespace-nowrap" style={{ color: '#dc3545', fontWeight: 500 }}>{row.claimExpiry}</span>, 130)}
                            {cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.exportExpiry}</span>, 130)}
                          </>
                        ) : (
                          <>
                            {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.depositType}</span>, 200)}
                            {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.declarationCategory ?? '—'}</span>, 190)}
                            {cell(
                              <span className="text-[16px] whitespace-nowrap inline-flex items-baseline gap-[4px]" style={{ color: row.depositAmount === 'N/A' ? '#697498' : '#0e1b3d', fontWeight: row.depositAmount === 'N/A' ? 400 : 500 }}>
                                {row.depositAmount === 'N/A' ? row.depositAmount : (<><Dh /> {row.depositAmount.replace(/^Dh\s*/, '')}</>)}
                              </span>,
                              150
                            )}
                            {cell(<span className="text-[16px]" style={{ color: row.depositMethod === 'N/A' ? '#697498' : '#0e1b3d' }}>{row.depositMethod}</span>, 160)}
                          </>
                        )}
                        {cell(<span className="text-[16px] text-[#697498]">{row.remarks}</span>, 110)}
                        <td style={{ position: 'sticky', right: 0, background: isSelected ? '#f6f9fe' : '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 130, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8' }}>
                          {(() => {
                            const st = expired ? STATUS_STYLE.Expired : STATUS_STYLE.Active;
                            const label = expired ? 'Expired' : 'Cleared';
                            return (
                              <span className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontFamily: "'Dubai', sans-serif" }}>
                                {label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[12px] pb-[16px]">
            <Pagination page={page} totalPages={1} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
          </div>
          </>
          )}
        </div>

        <ClaimantBrokerDetail />
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={(() => {
          const picked = filtered.filter((r) => selectedDecls.has(r.declarationNo));
          // Prototype: allow proceeding without a selection by defaulting to the first row.
          const selectedRows = picked.length > 0 ? picked : filtered.slice(0, 1);
          const enabled = picked.length > 0;
          return (
            <div className="flex items-center gap-[12px]">
              {enabled && (
                <span className="text-[16px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                  {selectedRows.length} declaration{selectedRows.length !== 1 ? 's' : ''} selected
                </span>
              )}
              <button
                onClick={() => setShowSaveModal(true)}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] bg-white transition-colors hover:bg-[#f0f4ff]"
                style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, fontFamily: "'Dubai', sans-serif" }}
              >
                Save &amp; Exit
              </button>
              <button
                onClick={() => { if (claimType) onProceed?.(selectedRows, claimType); }}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{
                  background: '#1360d2',
                  cursor: 'pointer',
                  fontFamily: "'Dubai', sans-serif",
                  fontWeight: 500,
                  boxShadow: '0px 0px 8px rgba(28,72,191,0.16)',
                }}
              >
                Next
              </button>
            </div>
          );
        })()}
      />
      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing ?? onBack} />}
    </div>
  );
}
