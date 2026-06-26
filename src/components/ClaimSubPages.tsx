import React, { useEffect, useRef, useState } from 'react';
import BackToListingBar from './BackToListingBar';
import FloatingField from './FloatingField';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper from './ClaimStepper';
import DTSelect from './DTSelect';
import Dh, { DhAmount } from './Dh';
import { DateInput } from './DatePicker';

/* ───────── Shared types ───────── */
export type RefundType = 'full' | 'partial' | 'no' | 'fullImport' | 'partialImport';
export type DepositMethod = 'standing' | 'cash' | 'epayment';

const DEPOSIT_METHOD_LABEL: Record<DepositMethod, string> = {
  standing: 'Standing Guarantee',
  cash: 'Cash',
  epayment: 'e-Payment',
};

const ALL_REFUND_OPTIONS: { id: RefundType; title: string; sub: string }[] = [
  { id: 'full',         title: 'Full Export',    sub: 'All goods have been re-exported.' },
  { id: 'partial',      title: 'Partial Export', sub: 'Some goods have been re-exported.' },
  { id: 'no',           title: 'No Export',      sub: 'Goods have not been exported.' },
  { id: 'fullImport',   title: 'Full Import',    sub: 'All goods have been fully imported.' },
  { id: 'partialImport',title: 'Partial Import', sub: 'Some goods have been imported.' },
];

export const REFUND_TYPE_LABEL: Record<RefundType, string> = {
  full:         'Full Export',
  partial:      'Partial Export',
  no:           'No Export',
  fullImport:   'Full Import',
  partialImport:'Partial Import',
};

/* ───────── Common DT page shell ───────── */
const PageShell: React.FC<{
  title: string;
  children: React.ReactNode;
  /** Returns to the previous step. Renders the "Back" button when supplied. */
  onBack?: () => void;
  /** Returns to the main claims listing. Renders "Back to Listing" when supplied (only on first sub-step). */
  onBackToListing?: () => void;
  rightContent: React.ReactNode;
  activeIndex?: number;
}> = ({ title, children, onBack, onBackToListing, rightContent, activeIndex = 0 }) => (
  <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
    {/* Sticky breadcrumb / agent banner — content below scrolls under it. */}
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

    {/* Title + stepper + body all scroll together below the breadcrumb. */}
    <div className="flex-1 overflow-y-auto">
      <h1 className="px-4 sm:px-10 text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>{title}</h1>

      <div className="px-4 sm:px-10">
        <ClaimStepper activeIndex={activeIndex} />
      </div>

      <div className="px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]">
        {children}
        <ClaimantBrokerDetail />
      </div>
    </div>

    <BackToListingBar onBack={onBack} onBackToListing={onBackToListing} rightContent={rightContent} />
  </div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-[12px]">
    <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{children}</p>
  </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
    {children}
  </div>
);

const PrimaryBtn = (
  { children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }
) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
    style={{
      background: disabled ? '#a7c3eb' : '#1360d2',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 500,
      boxShadow: disabled ? 'none' : '0px 0px 8px rgba(28,72,191,0.16)',
    }}
  >
    {children}
  </button>
);

/* ───────── Sample outbound declarations (inline picker) ───────── */
type OutboundRow = {
  id: string;
  declarationNo: string;
  exportType: string;
  exitPoint: string;
  reExportTo: string;
  reExportFlag: string;
  departureDate: string;
  weight: string;
  statQty: string;
  customsAuthority: string;
};

const SAMPLE_OUTBOUND: OutboundRow[] = [
  { id: 'ob1', declarationNo: 'E: 2080004915824', exportType: 'Re-Export', exitPoint: 'Jebel Ali Port', reExportTo: 'Saudi Arabia', reExportFlag: '🌍', departureDate: '15 Jan 2025', weight: '1,250 Kg', statQty: '50',  customsAuthority: 'Dubai Customs' },
  { id: 'ob2', declarationNo: 'E: 2080004915825', exportType: 'Re-Export', exitPoint: 'Port Rashid',    reExportTo: 'Oman',         reExportFlag: '🌍', departureDate: '22 Jan 2025', weight: '880 Kg',   statQty: '32', customsAuthority: 'Dubai Customs' },
];

/* ───────── Refund Type page (with inline Partial Invoice picker) ───────── */
export function RefundTypePage({
  onBack, onBackToListing, onContinue, declaration, onViewDeclaration, allowedTypes,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (type: RefundType, partial?: PartialExportSelection) => void;
  declaration?: { claimType: string; declarationNo: string; depositType: string; declarationCategory?: string | null };
  onViewDeclaration?: () => void;
  allowedTypes?: RefundType[];
}) {
  const [selected, setSelected] = useState<RefundType | null>(null);
  type CustomsAuthority = 'dubai' | 'other' | 'gcc';
  const [customsAuthority, setCustomsAuthority] = useState<CustomsAuthority | ''>('');
  const [outboundRows, setOutboundRows] = useState<OutboundRow[]>([]);
  const [outboundSearch, setOutboundSearch] = useState('');
  const [outboundSearched, setOutboundSearched] = useState(false);
  type ManualOutbound = { declarationNo: string; exportType: string; exitPoint: string; reExportTo: string; departureDate: string; weight: string; statQty: string };
  const blankManual: ManualOutbound = { declarationNo: '', exportType: '', exitPoint: '', reExportTo: '', departureDate: '', weight: '', statQty: '' };
  const [manualOutbound, setManualOutbound] = useState<ManualOutbound>(blankManual);
  const [invoiceFilter, setInvoiceFilter] = useState<string>(SAMPLE_INVOICES[0]?.id ?? '');
  const [hsModalOpen, setHsModalOpen] = useState(false);
  type AllocationMethod = 'multiple' | 'single';
  type HsEntry = { invoiceId: string; code: string; description: string; weight: string; statQty: string; suppQty: string; importPrice: string; allocation: AllocationMethod; exportValue: string; claimAmount: string };
  const [hsEntries, setHsEntries] = useState<HsEntry[]>([]);
  const [draftEntry, setDraftEntry] = useState<HsEntry>({ invoiceId: SAMPLE_INVOICES[0]?.id ?? '', code: '', description: '', weight: '', statQty: '', suppQty: '', importPrice: '', allocation: 'single', exportValue: '', claimAmount: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hsSearch, setHsSearch] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedInvoices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedInvoices(next);
    if (!expanded.has(id) && next.has(id)) { const e = new Set(expanded); e.add(id); setExpanded(e); }
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

  const refundOptions = allowedTypes
    ? allowedTypes.map((id) => ALL_REFUND_OPTIONS.find((o) => o.id === id)!).filter(Boolean)
    : ALL_REFUND_OPTIONS.filter((o) => o.id === 'full' || o.id === 'partial' || o.id === 'no');

  const partialValid = selectedHs.size > 0;
  const needsOutbound = selected === 'full' || selected === 'partial';
  const outboundValid = !needsOutbound || outboundRows.length > 0;
  const valid = selected !== null && outboundValid && (selected !== 'partial' || partialValid);

  // Auto-populate eligible HS codes (intersection of inbound invoices + outbound)
  // when an outbound row is added for a partial-export claim.
  useEffect(() => {
    if (selected !== 'partial' || outboundRows.length === 0) return;
    if (hsEntries.length > 0) return;
    const eligible: HsEntry[] = [];
    SAMPLE_INVOICES.forEach((inv) => {
      inv.hsCodes.slice(0, 3).forEach((hs, hsIdx) => {
        const importPrice = 50;
        const statQty = 10;
        const exportValue = importPrice * statQty;
        const claimAmount = Math.round(exportValue * 0.05);
        eligible.push({
          invoiceId: inv.id,
          code: hs.code,
          description: hs.description,
          weight: '100',
          statQty: String(statQty),
          suppQty: '10',
          importPrice: String(importPrice),
          allocation: hsIdx === 0 ? 'multiple' : 'single',
          exportValue: exportValue.toLocaleString(),
          claimAmount: claimAmount.toLocaleString(),
        });
      });
    });
    setHsEntries(eligible);
    setSelectedHs(new Set(eligible.map((e) => `${e.invoiceId}::${e.code}`)));
  }, [selected, outboundRows.length]);

  return (
    <PageShell
      title="Select Refund Type"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={
        <PrimaryBtn
          disabled={!valid}
          onClick={() => {
            if (!selected) return;
            if (selected === 'partial') {
              const chosen = hsEntries.filter((e) => selectedHs.has(`${e.invoiceId}::${e.code}`));
              onContinue(selected, {
                invoiceIds: Array.from(new Set(chosen.map((e) => e.invoiceId))),
                hsCodes: chosen.map((e) => ({ invoiceId: e.invoiceId, code: e.code })),
              });
            } else {
              onContinue(selected);
            }
          }}
        >
          Continue
        </PrimaryBtn>
      }
    >
      {declaration && (
        <>
          <SectionHeader>Declaration Details</SectionHeader>
          <Card>
            <div
              className="grid items-start"
              style={{ gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
            >
              {[
                { k: 'Declaration Number',   v: declaration.declarationNo, accent: true },
                { k: 'Declaration Date',     v: '12-May-24' },
                { k: 'Deposit Type',         v: declaration.depositType },
                ...(declaration.declarationCategory ? [{ k: 'Declaration Category', v: declaration.declarationCategory }] : []),
                { k: 'Deposit Amount',       v: <DhAmount value="1,000" /> },
                { k: 'Deposit Method',       v: 'Cash (ePayment)' },
                { k: 'Claim Expiry',         v: '04-Mar-25' },
                { k: 'Export Expiry',        v: '15-Apr-25' },
              ].map((f) => (
                <div key={f.k} className="flex flex-col gap-[4px] min-w-0">
                  <span className="text-[12px] text-[#697498]">{f.k}</span>
                  <span className="text-[16px] truncate" style={{ color: f.accent ? '#1360d2' : '#0e1b3d', fontWeight: 500 }}>{f.v}</span>
                </div>
              ))}
            </div>
            {onViewDeclaration && (
              <div className="mt-[20px]">
                <button
                  onClick={onViewDeclaration}
                  className="h-[40px] px-[18px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] hover:bg-[#1360d2] hover:text-white transition-colors inline-flex items-center gap-[8px]"
                  style={{ fontWeight: 500 }}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                    <circle cx="10" cy="10" r="2.5" />
                  </svg>
                  View Declaration
                </button>
              </div>
            )}
          </Card>
        </>
      )}

      <SectionHeader>Refund Type</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[16px]">Please choose the refund type to begin your claim.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {refundOptions.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="flex items-start gap-[14px] px-[18px] py-[18px] rounded-[10px] text-left transition-colors h-full"
                style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
              >
                <span className="size-[22px] rounded-full inline-flex items-center justify-center flex-shrink-0 mt-[2px]" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                  {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                </span>
                <span className="flex flex-col gap-[6px]">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                  <span className="text-[16px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {(selected === 'full' || selected === 'partial') && (() => {
        const q = outboundSearch.trim().toLowerCase();
        const alreadyAdded = (no: string) => outboundRows.some((r) => r.declarationNo === no);
        const suggestions = SAMPLE_OUTBOUND.filter((r) => r.declarationNo.toLowerCase().includes(q) && !alreadyAdded(r.declarationNo));
        const showSuggestions = customsAuthority === 'dubai' && q !== '';
        const manualValid = manualOutbound.declarationNo.trim() !== '' && manualOutbound.exportType.trim() !== '' && manualOutbound.exitPoint.trim() !== '' && manualOutbound.reExportTo.trim() !== '' && manualOutbound.departureDate.trim() !== '' && manualOutbound.weight.trim() !== '' && manualOutbound.statQty.trim() !== '';
        const authorityLabel: Record<CustomsAuthority, string> = { dubai: 'Dubai Customs', other: 'Other Emirates', gcc: 'GCC' };
        const addManualRow = () => {
          if (!manualValid || !customsAuthority) return;
          setOutboundRows([
            ...outboundRows,
            {
              id: `m-${Date.now()}`,
              declarationNo: manualOutbound.declarationNo.trim(),
              exportType: manualOutbound.exportType.trim(),
              exitPoint: manualOutbound.exitPoint.trim(),
              reExportTo: manualOutbound.reExportTo.trim(),
              reExportFlag: '🌍',
              departureDate: manualOutbound.departureDate.trim(),
              weight: manualOutbound.weight.trim(),
              statQty: manualOutbound.statQty.trim(),
              customsAuthority: authorityLabel[customsAuthority as CustomsAuthority],
            },
          ]);
          setManualOutbound(blankManual);
        };
        return (
        <>
          <SectionHeader>Outbound Declaration</SectionHeader>
          <Card>
            {/* Customs Authority + (Dubai search) OR (manual fields) — single grid, 4 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[12px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
              {/* Customs Authority dropdown */}
              <DTSelect
                label="Customs Authority"
                required
                value={customsAuthority}
                onChange={(v) => { setCustomsAuthority(v as CustomsAuthority | ''); setOutboundSearch(''); setManualOutbound(blankManual); }}
                options={[
                  { value: 'dubai', label: 'Dubai Customs' },
                  { value: 'other', label: 'Other Emirates' },
                  { value: 'gcc', label: 'GCC' },
                ]}
              />

              {customsAuthority === 'dubai' && (
                <div className="relative">
                  <FloatingField
                    label="Outbound Declaration Number"
                    required
                    placeholder="e.g. 2080004915824"
                    value={outboundSearch}
                    onChange={setOutboundSearch}
                    trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>}
                  />
                  {showSuggestions && (
                    <div className="absolute left-0 right-0 mt-[4px] bg-white border border-[#d5ddfb] rounded-[4px] z-10 max-h-[260px] overflow-auto" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.08)' }}>
                      {suggestions.length === 0 ? (
                        <div className="px-[16px] py-[12px] text-[16px] text-[#697498]">No matches.</div>
                      ) : suggestions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => { setOutboundRows([...outboundRows, { ...r, customsAuthority: 'Dubai Customs' }]); setOutboundSearch(''); }}
                          className="block w-full text-left px-[16px] py-[10px] hover:bg-[#f4f7fc]"
                        >
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{r.declarationNo}</span>
                          <span className="text-[12px] text-[#697498] ml-[8px]">{r.exportType} · {r.exitPoint} → {r.reExportTo} · {r.departureDate}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(customsAuthority === 'other' || customsAuthority === 'gcc') && (['declarationNo', 'exportType', 'exitPoint', 'reExportTo', 'departureDate', 'weight', 'statQty'] as const).map((key) => {
                const labels: Record<typeof key, string> = {
                  declarationNo: 'Outbound Declaration No.',
                  exportType: 'Export Declaration Type',
                  exitPoint: 'Exit Point',
                  reExportTo: 'Re-Export To',
                  departureDate: 'Actual Departure Date',
                  weight: 'Weight (Kg)',
                  statQty: 'Statistical Quantity',
                };
                return (
                  <FloatingField
                    key={key}
                    label={labels[key]}
                    required
                    placeholder={`Enter ${labels[key]}`}
                    value={manualOutbound[key]}
                    onChange={(val) => setManualOutbound({ ...manualOutbound, [key]: val })}
                    type={key === 'departureDate' ? 'date' : (key === 'weight' || key === 'statQty') ? 'number' : 'text'}
                  />
                );
              })}
            </div>

            {(customsAuthority === 'other' || customsAuthority === 'gcc') && (
              <div className="flex justify-end mb-[20px]">
                <button
                  onClick={addManualRow}
                  disabled={!manualValid}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[8px]"
                  style={{ background: manualValid ? '#1360d2' : '#a7c3eb', cursor: manualValid ? 'pointer' : 'not-allowed', fontWeight: 500 }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                  Add to Table
                </button>
              </div>
            )}

            {customsAuthority === 'dubai' && (
              <p className="text-[16px] text-[#697498] mb-[20px]">Search the outbound declaration number — system will fetch and add the details automatically.</p>
            )}
            {(customsAuthority === 'other' || customsAuthority === 'gcc') && (
              <p className="text-[16px] text-[#697498] mb-[20px] hidden">Manual entry copy.</p>
            )}

            {outboundRows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="dt-table" style={{ minWidth: 1100 }}>
                  <thead>
                    <tr>
                      <th className="text-[16px]">Outbound Declaration No.</th>
                      <th className="text-[16px]">Export Declaration Type</th>
                      <th className="text-[16px]">Exit Point</th>
                      <th className="text-[16px]">Re-Export To</th>
                      <th className="text-[16px]">Actual Departure Date</th>
                      <th className="text-[16px]">Weight</th>
                      <th className="text-[16px]">Statistical Quantity</th>
                      <th className="text-[16px]">Customs Authority</th>
                      <th style={{ width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {outboundRows.map((r, idx) => (
                      <tr key={r.id}>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.declarationNo}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.exportType}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.exitPoint}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.reExportTo}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.departureDate}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.weight}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.statQty}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.customsAuthority}</td>
                        <td>
                          <button
                            onClick={() => setOutboundRows(outboundRows.filter((_, i) => i !== idx))}
                            aria-label="Remove"
                            className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#fef2f2]"
                            style={{ color: '#dc3545' }}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
        );
      })()}

      {selected === 'partial' && (
        <>
          <SectionHeader>Invoices &amp; HS Codes</SectionHeader>
          <Card>
            <div className="flex items-start justify-between gap-[16px] mb-[16px] flex-wrap">
              <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px] flex-1 min-w-[280px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '18px' }}>
                  Eligible HS codes are auto-populated by matching the inbound declaration with the outbound declaration. Select the HS codes you want to include in this claim — you can edit any line-item details.
                  {hsEntries.length > 0 && (
                    <> &nbsp;<span style={{ fontWeight: 500 }}>{selectedHs.size}</span> of <span style={{ fontWeight: 500 }}>{hsEntries.length}</span> selected.</>
                  )}
                </p>
              </div>
            </div>

            {hsEntries.length === 0 ? (
              <div className="border border-dashed border-[#d5ddfb] rounded-[8px] py-[40px] flex flex-col items-center gap-[8px]">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#a7c3eb" strokeWidth="1.5"><path d="M3 6h18M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="text-[16px] text-[#697498]">No eligible HS codes yet</p>
                <p className="text-[16px] text-[#a7abb2]">Add an outbound declaration above to auto-populate the eligible HS codes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="dt-table" style={{ minWidth: 1300 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 44 }}>
                        <button
                          aria-label="Select all"
                          onClick={() => {
                            if (selectedHs.size === hsEntries.length) setSelectedHs(new Set());
                            else setSelectedHs(new Set(hsEntries.map((e) => `${e.invoiceId}::${e.code}`)));
                          }}
                          className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
                          style={{ border: `2px solid ${selectedHs.size > 0 ? '#1360d2' : '#a7abb2'}`, background: selectedHs.size === hsEntries.length && hsEntries.length > 0 ? '#1360d2' : '#fff' }}
                        >
                          {selectedHs.size === hsEntries.length && hsEntries.length > 0 && (
                            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
                          )}
                          {selectedHs.size > 0 && selectedHs.size < hsEntries.length && (
                            <span className="block w-[10px] h-[2px] bg-[#1360d2]" />
                          )}
                        </button>
                      </th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Invoice</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>HS Code</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500 }}>Goods Description</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Weight (Kg)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Stat./Exported Qty</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Supp. Qty</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Import Unit Price (Dh)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Allocation Method</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Export Value (Dh)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Claim Amount (Dh)</th>
                      <th style={{ padding: '12px', width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {hsEntries.map((e, idx) => {
                      const inv = SAMPLE_INVOICES.find((i) => i.id === e.invoiceId);
                      const key = `${e.invoiceId}::${e.code}`;
                      const isSelected = selectedHs.has(key);
                      return (
                        <tr key={idx} className={isSelected ? 'is-selected' : ''}>
                          <td>
                            <button
                              onClick={() => {
                                const next = new Set(selectedHs);
                                if (next.has(key)) next.delete(key); else next.add(key);
                                setSelectedHs(next);
                              }}
                              aria-label="Toggle"
                              className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
                              style={{ border: `2px solid ${isSelected ? '#1360d2' : '#a7abb2'}`, background: isSelected ? '#1360d2' : '#fff' }}
                            >
                              {isSelected && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                            </button>
                          </td>
                          <td className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{inv?.invoiceNo}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{e.code}</td>
                          <td className="text-[16px] text-[#051937]">{e.description}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.weight}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.statQty}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.suppQty}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.importPrice}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <span
                              className="inline-flex items-center px-[10px] py-[3px] rounded-[12px] text-[12px]"
                              style={{
                                background: e.allocation === 'multiple' ? 'rgba(19,96,210,0.10)' : 'rgba(40,167,69,0.10)',
                                color: e.allocation === 'multiple' ? '#1360d2' : '#1b6c3a',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                              }}
                            >
                              {e.allocation}
                            </span>
                          </td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap', fontWeight: 500 }}><DhAmount value={e.exportValue} /></td>
                          <td className="text-[16px] text-[#1360d2]" style={{ whiteSpace: 'nowrap', fontWeight: 600 }}><DhAmount value={e.claimAmount} /></td>
                          <td>
                            <button
                              onClick={() => { setEditingIndex(idx); setDraftEntry(e); setHsSearch(''); setHsModalOpen(true); }}
                              aria-label="Edit"
                              className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#e2ebf9]"
                              style={{ color: '#1360d2' }}
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4l11-11-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 6l4 4" strokeLinecap="round" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
      {hsModalOpen && (() => {
        const activeInvoice = SAMPLE_INVOICES.find((i) => i.id === draftEntry.invoiceId) ?? SAMPLE_INVOICES[0];
        const q = hsSearch.trim().toLowerCase();
        const matches = activeInvoice.hsCodes.filter((hs) => q === '' || hs.code.toLowerCase().includes(q) || hs.description.toLowerCase().includes(q));
        const formValid = !!draftEntry.code && !!draftEntry.weight.trim() && !!draftEntry.statQty.trim() && !!draftEntry.suppQty.trim() && !!draftEntry.importPrice.trim();
        const numField = (label: string, key: 'weight' | 'statQty' | 'suppQty' | 'importPrice', placeholder: string) => (
          <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div className="bg-white rounded-[4px] flex items-center px-[16px]" style={{ border: '1px solid #d5ddfb', height: 56 }}>
              <input
                type="number"
                value={draftEntry[key]}
                onChange={(e) => setDraftEntry({ ...draftEntry, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
              />
            </div>
            <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
              <span style={{ color: '#dc3545' }}>*</span> {label}
            </label>
          </div>
        );

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px]" style={{ background: 'rgba(11,21,52,0.45)' }} onClick={() => setHsModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[10px] w-full max-w-[820px] max-h-[88vh] flex flex-col" style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)' }}>
              <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-[#eef1f6]">
                <div>
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{editingIndex !== null ? 'Edit HS Code Details' : 'Add HS Code Details'}</p>
                  <p className="text-[16px] text-[#697498]">Pick an invoice, search the HS code, and enter the line-item details.</p>
                </div>
                <button onClick={() => setHsModalOpen(false)} aria-label="Close" className="size-[32px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#f4f7fc] text-[#697498]">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-auto px-[24px] py-[24px] flex flex-col gap-[20px]">
                {/* Invoice Number dropdown */}
                <DTSelect
                  label="Invoice Number"
                  required
                  value={draftEntry.invoiceId}
                  onChange={(v) => setDraftEntry({ ...draftEntry, invoiceId: v, code: '', description: '' })}
                  options={SAMPLE_INVOICES.map((inv) => ({ value: inv.id, label: `${inv.invoiceNo} — ${inv.lineItemsCount} items` }))}
                />

                {/* HS Code search */}
                <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
                  <div className="bg-white rounded-[4px] flex items-center px-[16px]" style={{ border: '1px solid #d5ddfb', height: 56 }}>
                    <input
                      value={draftEntry.code || hsSearch}
                      onChange={(e) => { setHsSearch(e.target.value); setDraftEntry({ ...draftEntry, code: '', description: '' }); }}
                      placeholder="Enter HS code or goods description"
                      className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                    />
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
                  </div>
                  <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
                    <span style={{ color: '#dc3545' }}>*</span> HS Code
                  </label>

                  {!draftEntry.code && hsSearch.trim() !== '' && (
                    <div className="absolute left-0 right-0 mt-[4px] bg-white border border-[#d5ddfb] rounded-[4px] z-10 max-h-[220px] overflow-auto" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.08)' }}>
                      {matches.length === 0 ? (
                        <div className="px-[16px] py-[12px] text-[16px] text-[#697498]">No matches.</div>
                      ) : matches.map((hs) => (
                        <button
                          key={hs.code}
                          onClick={() => { setDraftEntry({ ...draftEntry, code: hs.code, description: hs.description }); setHsSearch(''); }}
                          className="block w-full text-left px-[16px] py-[10px] hover:bg-[#f4f7fc]"
                        >
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{hs.code}</span>
                          <span className="text-[16px] text-[#697498] ml-[8px]">{hs.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goods description chip */}
                {draftEntry.description && (
                  <div className="bg-[#e2ebf9] rounded-[4px] px-[12px] py-[8px]">
                    <p className="text-[12px] text-[#697498] mb-[2px]">Goods Description</p>
                    <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '20px' }}>{draftEntry.description}</p>
                  </div>
                )}

                {/* Numeric form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {numField('Weight (Kg)', 'weight', 'Enter weight')}
                  {numField('Stat. / Exported Qty', 'statQty', 'Enter quantity')}
                  {numField('Supp. Qty', 'suppQty', 'Enter quantity')}
                  {numField('Import Unit Price (Dh)', 'importPrice', 'Enter price')}
                  {/* Allocation Method dropdown */}
                  <DTSelect
                    label="Allocation Method"
                    required
                    value={draftEntry.allocation}
                    onChange={(v) => setDraftEntry({ ...draftEntry, allocation: v as AllocationMethod })}
                    options={[
                      { value: 'single', label: 'Single' },
                      { value: 'multiple', label: 'Multiple' },
                    ]}
                  />
                </div>

                <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[12px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                  <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '18px' }}>Export Value and Claim Amount will be auto-calculated from unit price × exported qty × duty rate.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[#eef1f6]">
                <button
                  onClick={() => setHsModalOpen(false)}
                  className="h-[40px] px-[20px] rounded-[4px] border text-[16px] text-[#1360d2] bg-white"
                  style={{ borderColor: '#1360d2', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const price = parseFloat(draftEntry.importPrice) || 0;
                    const qty = parseFloat(draftEntry.statQty) || 0;
                    const exportVal = price * qty;
                    const claim = Math.round(exportVal * 0.05);
                    const computed: HsEntry = {
                      ...draftEntry,
                      exportValue: exportVal.toLocaleString(),
                      claimAmount: claim.toLocaleString(),
                    };
                    if (editingIndex !== null) {
                      const next = [...hsEntries];
                      next[editingIndex] = computed;
                      setHsEntries(next);
                    } else {
                      setHsEntries([...hsEntries, computed]);
                    }
                    setHsModalOpen(false);
                    setEditingIndex(null);
                  }}
                  disabled={!formValid}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] text-white"
                  style={{ background: !formValid ? '#a7c3eb' : '#1360d2', cursor: !formValid ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                >
                  {editingIndex !== null ? 'Update Line Item' : 'Add Line Item'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </PageShell>
  );
}

/* ───────── Outbound Declaration page (Full Export) ───────── */
export type OutboundDetails = {
  outboundDeclNumber: string;
  outboundDate: string;
  portOfDischarge: string;
  totalQuantity: string;
  weight: string;
  remarks: string;
};

export function OutboundDeclarationPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (d: OutboundDetails) => void;
}) {
  const [v, setV] = useState<OutboundDetails>({ outboundDeclNumber: '', outboundDate: '', portOfDischarge: '', totalQuantity: '', weight: '', remarks: '' });
  const set = <K extends keyof OutboundDetails>(k: K, val: string) => setV((s) => ({ ...s, [k]: val }));
  const valid = !!v.outboundDeclNumber.trim() && !!v.outboundDate.trim();

  return (
    <PageShell
      title="Outbound Declaration Details"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn disabled={!valid} onClick={() => onContinue(v)}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Outbound Declaration</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[20px]">For a full re-export refund, provide the outbound declaration number and supporting details so the claim can be matched to the export shipment.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Outbound Declaration Number" required placeholder="Enter Declaration Number" value={v.outboundDeclNumber} onChange={(val) => set('outboundDeclNumber', val)} searchable />
          <DateInput label="Outbound Declaration Date" required value={v.outboundDate} onChange={(val) => set('outboundDate', val)} />
          <FloatingField label="Port of Discharge" placeholder="Choose Port" value={v.portOfDischarge} onChange={(val) => set('portOfDischarge', val)} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Total Quantity" placeholder="Enter Quantity" value={v.totalQuantity} onChange={(val) => set('totalQuantity', val)} />
          <FloatingField label="Weight (Kg)" placeholder="Enter Weight" value={v.weight} onChange={(val) => set('weight', val)} />
          <div className="md:col-span-2 lg:col-span-3">
            <FloatingField label="Remarks" placeholder="Enter Remarks" value={v.remarks} onChange={(val) => set('remarks', val)} height={88} />
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

/* ───────── Partial Export — Invoice / HS-code page ───────── */
type HsRow = {
  code: string;
  description: string;
  condition: string;
  countryOfOrigin: string;
  weight: string;
  valueOfGoods: string;
  statisticalQty: string;
  supplementaryQty: string;
  itemQty: string;
  itemVolume: string;
  classification: string;
  exemptionType: string;
  exemptionRef: string;
  declarationNo: string;
  manufacturer: string;
  antiDumping: string;
};

type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  termsOfDelivery: string;
  lineItemsCount: number;
  invoiceValue: string;
  hsCodes: HsRow[];
};

const makeHs = (code: string): HsRow => ({
  code,
  description: 'Spare parts',
  condition: 'New',
  countryOfOrigin: 'India',
  weight: '100 kg',
  valueOfGoods: 'Dh 1500',
  statisticalQty: '100 - Unit',
  supplementaryQty: '100',
  itemQty: '100 - Unit',
  itemVolume: '100 Unit',
  classification: 'Quantity',
  exemptionType: 'Quantity',
  exemptionRef: 'EX-887621',
  declarationNo: 'DN-554301',
  manufacturer: 'OV12132',
  antiDumping: 'Yes',
});

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv1', invoiceNo: 'TD 2403', date: '09/11/2024', termsOfDelivery: 'Cost & Fright', lineItemsCount: 100, invoiceValue: 'USD 6400.00',
    hsCodes: ['AX1234567','BX1234567','CX1234567','DX1234567','EX1234567','FX1234567','GX1234567','HX1234567'].map(makeHs),
  },
  {
    id: 'inv2', invoiceNo: 'TD 2404', date: '10/11/2024', termsOfDelivery: 'FOB', lineItemsCount: 60, invoiceValue: 'USD 3120.00',
    hsCodes: ['IX1234567','JX1234567','KX1234567','LX1234567','MX1234567','NX1234567'].map(makeHs),
  },
];

const HS_COLUMNS: { key: keyof HsRow; label: string; width: number }[] = [
  { key: 'code',             label: 'HS Code',                       width: 130 },
  { key: 'description',      label: 'Goods Description',             width: 150 },
  { key: 'condition',        label: 'Condition',                     width: 110 },
  { key: 'countryOfOrigin',  label: 'Country of origin',             width: 140 },
  { key: 'weight',           label: 'Weight',                        width: 110 },
  { key: 'valueOfGoods',     label: 'Value of Goods',                width: 140 },
  { key: 'statisticalQty',   label: 'Statistical Quantity - Unit',   width: 170 },
  { key: 'supplementaryQty', label: 'Supplementary Quantity/Units',  width: 200 },
  { key: 'itemQty',          label: 'Item Quantity - Unit',          width: 160 },
  { key: 'itemVolume',       label: 'Item Volume - Units',           width: 160 },
  { key: 'classification',   label: 'Classification of Goods',       width: 180 },
  { key: 'exemptionType',    label: 'Exemption Type',                width: 160 },
  { key: 'exemptionRef',     label: 'Exemption Reference Number',    width: 210 },
  { key: 'declarationNo',    label: 'Declaration Number',            width: 170 },
  { key: 'manufacturer',     label: 'Manufacturer/Exporter',         width: 180 },
  { key: 'antiDumping',      label: 'Anti dumping Applicability',    width: 200 },
];

export type PartialExportSelection = { invoiceIds: string[]; hsCodes: { invoiceId: string; code: string }[] };

export function PartialExportPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (s: PartialExportSelection) => void;
}) {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedInvoices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedInvoices(next);
    if (!expanded.has(id) && next.has(id)) { const e = new Set(expanded); e.add(id); setExpanded(e); }
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

  return (
    <PageShell
      title="Partial Export — Select Invoices &amp; HS Codes"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn disabled={!valid} onClick={() => onContinue({ invoiceIds: Array.from(selectedInvoices), hsCodes: Array.from(selectedHs).map((k) => { const [invoiceId, code] = k.split('::'); return { invoiceId, code }; }) })}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Invoices &amp; HS Codes</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[16px]">Choose the invoices that contain the partially exported goods, then select the HS codes within each invoice that were re-exported.</p>
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
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>HS Code</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Description</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Quantity</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Value</th>
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
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.value}</td>
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
      </Card>
    </PageShell>
  );
}

/* ───────── Missing Document Deposit — Refund Details page ───────── */
/* ───────── Document Upload page ───────── */
export type UploadedDoc = { id: string; fileName: string; sizeMb: string; uploadedOn: string; docType: string; authority: string };

const REQUIRED_DOC_TYPES: { id: string; label: string; required?: boolean; authority: string }[] = [
  { id: 'bill-of-entry',   label: 'Bill of Entry',                  required: true, authority: 'Dubai Customs' },
  { id: 'bill-of-lading',  label: 'Bill of Lading / AWB / Manifest',                authority: 'Dubai Customs' },
  { id: 'packing-list',    label: 'Packing List',                                   authority: 'Dubai Customs' },
  { id: 'invoice',         label: 'Invoice',                                        authority: 'Dubai Customs' },
  { id: 'cert-of-origin',  label: 'Certificate of Origin',                          authority: 'Dubai Customs' },
];

export function DocumentUploadPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (docs: UploadedDoc[]) => void;
}) {
  const [selectedDocType, setSelectedDocType] = useState<string>(REQUIRED_DOC_TYPES[0].id);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeType = REQUIRED_DOC_TYPES.find((t) => t.id === selectedDocType) ?? REQUIRED_DOC_TYPES[0];
  const countByType = (id: string) => docs.filter((d) => d.docType === id).length;
  const requiredMet = docs.length > 0;

  const today = new Date();
  const today_dd_mm_yyyy = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: UploadedDoc[] = [];
    Array.from(files).forEach((f, i) => {
      next.push({
        id: `${Date.now()}-${i}`,
        fileName: f.name,
        sizeMb: `${Math.max(1, Math.round((f.size / (1024 * 1024)) * 10) / 10)} MB`,
        uploadedOn: today_dd_mm_yyyy,
        docType: activeType.label,
        authority: activeType.authority,
      });
    });
    setDocs((prev) => [...prev, ...next]);
  };

  return (
    <PageShell
      title="Upload Documents"
      activeIndex={2}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn disabled={!requiredMet} onClick={() => onContinue(docs)}>Continue</PrimaryBtn>}
    >
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
          {/* Left — doc type selection */}
          <div className="flex flex-col gap-[16px]">
            <p className="text-[20px] text-[#060c28]" style={{ fontWeight: 500 }}>Upload Documents</p>
            <p className="text-[16px] text-[#455174]">Select the document type and upload the file. We will share the documents with the relevant authorities.</p>

            <p className="text-[16px] text-[#060c28] mt-[8px]" style={{ fontWeight: 500 }}>Dubai Customs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[14px]">
              {REQUIRED_DOC_TYPES.map((t) => {
                const active = selectedDocType === t.id;
                const cnt = countByType(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedDocType(t.id)}
                    className="flex items-center gap-[10px] text-left"
                  >
                    <span className="size-[18px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                      {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                    </span>
                    <span className="text-[16px] text-[#060c28]">
                      {t.required && <span style={{ color: '#dc3545' }}>*</span>}
                      {t.label}
                    </span>
                    {cnt > 0 && (
                      <span className="inline-flex items-center justify-center text-[12px] text-[#060c28] rounded-[4px] px-[8px] h-[20px]" style={{ background: '#c8f4d2', fontWeight: 500 }}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — upload zone */}
          <div className="rounded-[8px] p-[20px]" style={{ background: '#fff', border: '1px solid #eef1f6' }}>
            <p className="text-[20px] text-[#060c28] mb-[12px]" style={{ fontWeight: 500 }}>Upload File</p>
            <p className="text-[16px] text-[#455174] mb-[4px]">*Supported file type: .pdf, .jpg etc, max file size 50 MB</p>
            <p className="text-[16px] text-[#455174] mb-[16px]">*Only 5 files allowed per document type</p>
            <div className="text-[16px] text-[#455174] mb-[16px] inline-flex items-center gap-[8px]">
              *Number in <span className="inline-block size-[16px] rounded-[4px]" style={{ background: '#c8f4d2' }} /> indicates the number of documents uploaded
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              className="rounded-[4px] flex flex-col items-center justify-center gap-[12px] py-[28px]"
              style={{ background: '#f8fafd', border: `1px dashed ${dragActive ? '#1360d2' : '#8f94ae'}` }}
            >
              <div className="size-[60px] rounded-full inline-flex items-center justify-center" style={{ background: '#dfe5e9' }}>
                <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#697498" strokeWidth="1.6"><path d="M9 22a5 5 0 110-10 7 7 0 0113.65 1.5A5 5 0 0123 22" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 14v9M12 18l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="text-[16px] text-[#6d707e]" style={{ fontWeight: 500 }}>Drag and drop or</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-[44px] px-[20px] rounded-[4px] border text-[16px] text-[#1360d2] bg-white"
                style={{ borderColor: '#1360d2', fontWeight: 500 }}
              >
                Choose File
              </button>
              <p className="text-[12px] text-[#697498]">Uploading as: <span style={{ color: '#0e1b3d', fontWeight: 500 }}>{activeType.label}</span></p>
            </div>
          </div>
        </div>
      </Card>

      <SectionHeader>Documents Uploaded</SectionHeader>
      <Card>
        {docs.length === 0 ? (
          <p className="text-[16px] text-[#697498] text-center py-[24px]">No documents uploaded yet.</p>
        ) : (
          <div className="border border-[#d5ddfb] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Document Name</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Authority Name</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Document Type</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Uploaded Size</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Uploaded On</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap', width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px' }}>{d.fileName}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.authority}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.docType}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.sizeMb}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.uploadedOn}</td>
                    <td style={{ padding: '12px' }}>
                      <div className="inline-flex items-center gap-[12px]">
                        <button
                          onClick={() => setDocs(docs.filter((x) => x.id !== d.id))}
                          aria-label="Delete"
                          className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#fef2f2]"
                          style={{ color: '#dc3545' }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button
                          aria-label="Download"
                          className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#e2ebf9]"
                          style={{ color: '#1360d2' }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

/* ───────── Payment Details page ───────── */
export type ClaimSummary = {
  declarationNo: string;
  depositType: string;
  depositAmount: string;
  depositMethod: string;
  refundType: string;
  hsCount: number;
  outboundDeclarationNo: string;
  totalRefundAmount: string;
};

export type PaymentDetails = { mode: string; accountNo: string };

export function PaymentDetailsPage({
  summary, onBack, onBackToListing, onContinue,
}: {
  summary: ClaimSummary;
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (p: PaymentDetails) => void;
}) {
  const [mode, setMode] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [depositMethodChoice, setDepositMethodChoice] = useState('');
  const valid = !!mode.trim() && !!accountNo.trim() && !!depositMethodChoice;

  const depositMethodField = (
    <div className="max-w-[240px]">
      <DTSelect
        label="Deposit Method"
        required
        value={depositMethodChoice}
        onChange={setDepositMethodChoice}
        options={[
          { value: 'standing', label: 'Standing Guarantee' },
          { value: 'epayment', label: 'e-Payment' },
        ]}
        height={44}
      />
    </div>
  );

  const fields: { k: string; v: React.ReactNode }[] = [
    { k: 'Declaration No.',       v: summary.declarationNo },
    { k: 'Deposit Type',          v: summary.depositType },
    { k: 'Deposit Amount',        v: <span className="inline-flex items-baseline gap-[4px]"><Dh /> {String(summary.depositAmount).replace(/^Dh\s*/, '')}</span> },
    { k: 'Deposit Method',        v: depositMethodField },
    { k: 'Refund Type',           v: <span>{summary.refundType}{summary.refundType.toLowerCase().includes('partial') && <span className="text-[16px] text-[#696f83] ml-[8px]">No. of HS Codes — {summary.hsCount}</span>}</span> },
    { k: 'Outbound Declaration',  v: summary.outboundDeclarationNo },
    { k: 'Total Refund Amount',   v: <span className="inline-flex items-baseline gap-[4px]" style={{ color: '#1360d2', fontWeight: 600 }}><Dh /> {String(summary.totalRefundAmount).replace(/^Dh\s*/, '')}</span> },
  ];

  return (
    <PageShell
      title="Claim Payment Details"
      activeIndex={3}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn disabled={!valid} onClick={() => onContinue({ mode, accountNo })}>Submit Claim</PrimaryBtn>}
    >
      <SectionHeader>Claim Summary</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[20px]">
          {fields.map((f) => (
            <div key={f.k} className="flex flex-col gap-[6px]">
              <span className="text-[16px] text-[#696f83]">{f.k}</span>
              <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.v}</span>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeader>Claim Payment Details</SectionHeader>
      <Card>
        <div className="overflow-hidden rounded-[8px]">
          <div className="grid" style={{ gridTemplateColumns: 'minmax(360px, 1fr) minmax(220px, 1fr) minmax(240px, 1fr)', background: '#a6c2e9' }}>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 20px', fontWeight: 500 }}>Charges</div>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 16px', fontWeight: 500 }}>Payment Mode</div>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 16px', fontWeight: 500 }}>Credit / Debit Account No.</div>
          </div>
          <div className="grid items-start" style={{ gridTemplateColumns: 'minmax(360px, 1fr) minmax(220px, 1fr) minmax(240px, 1fr)', gap: 20, padding: 20, background: '#fff', boxShadow: '1px 2px 12px 0 rgba(0,0,0,0.06)' }}>
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[12px]" style={{ background: '#eff2f7', height: 49, padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Total Charges</span>
                <span className="text-[20px]" style={{ color: '#051937', fontWeight: 700 }}><DhAmount value="70" /></span>
              </div>
              <div className="flex items-start gap-[12px]" style={{ padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Claim Registration Charge</span>
                <span className="text-[16px]" style={{ color: '#051937', fontWeight: 700, minWidth: 80 }}><DhAmount value="50" /></span>
              </div>
              <div className="flex items-start gap-[12px]" style={{ padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Knowledge-Innovation Dirham</span>
                <span className="text-[16px]" style={{ color: '#051937', fontWeight: 700, minWidth: 80 }}><DhAmount value="20" /></span>
              </div>
            </div>
            <div>
              <DTSelect
                label="Payment Mode"
                required
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'credit-card', label: 'Credit Card' },
                  { value: 'debit-card', label: 'Debit Card' },
                  { value: 'epayment', label: 'e-Payment' },
                  { value: 'standing-guarantee', label: 'Standing Guarantee' },
                ]}
              />
            </div>
            <div>
              <FloatingField
                label="Account Number"
                required
                placeholder="Enter Account Number"
                value={accountNo}
                onChange={setAccountNo}
              />
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

export type MissingDocDetails = { refundAmount: string; currency: string; depositMethod: DepositMethod; remarks: string };

export function MissingDocDepositPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (d: MissingDocDetails) => void;
}) {
  // Refund Amount is auto-calculated by the system based on the declaration.
  const [refundAmount] = useState('1,000');
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

  return (
    <PageShell
      title="Refund Details"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn disabled={!valid} onClick={() => valid && onContinue({ refundAmount, currency, depositMethod: depositMethod as DepositMethod, remarks })}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Refund &amp; Deposit Method</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[20px]">Provide the refund amount and the original deposit method used for this declaration.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div
              className="h-[56px] rounded-[4px] flex items-center px-[16px]"
              style={{ border: '1px solid #d5ddfb', background: '#f5f6f8' }}
            >
              <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{refundAmount}</span>
              <span className="text-[12px] text-[#697498] ml-[8px]">Auto</span>
            </div>
            <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
              Refund Amount
            </label>
          </div>
          <FloatingField label="Currency" placeholder="AED" value={currency} onChange={setCurrency} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />

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
            <span className="absolute pointer-events-none" style={{
              left: 10, top: -9, background: '#fff', padding: '0 4px',
              fontSize: 12, color: open2 ? '#1360d2' : '#0e1b3d',
              fontFamily: "'Dubai', sans-serif",
            }}>
              <span style={{ color: '#dc3545' }}>*</span>Deposit Method
            </span>
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
            <FloatingField label="Remarks" placeholder="Enter Remarks" value={remarks} onChange={setRemarks} height={88} />
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
