import React, { useState } from 'react';
import Dh from './Dh';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* ─── Shared presentational helpers — mirror NonRemittanceClaimViewPage's look ─── */
function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}
function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}
function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[10px] px-[4px]">
        <h2 className="text-[20px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
        {badge && (
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>{badge}</span>
        )}
      </div>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Mock claim data — a Refund of Deposits claim with export linkage, so the
       Declaration Details accordion has real Invoice/HS/Outbound content. ─── */
type OutboundEntry = {
  id: string; customsAuthority: string; obDeclarationNo: string; obDeclarationType: string;
  exitPoint: string; actualDepartureDate: string; reExportTo: string;
  statQty: string; suppQty: string; weight: string;
};
const OB1: OutboundEntry = { id: 'ob1', customsAuthority: 'Dubai Customs', obDeclarationNo: 'EX-20800049-24', obDeclarationType: 'Re-Export', exitPoint: 'Jebel Ali Port', actualDepartureDate: '15/01/2025', reExportTo: 'Saudi Arabia', statQty: '50', suppQty: '50', weight: '1250' };
const OB2: OutboundEntry = { id: 'ob2', customsAuthority: 'Dubai Customs', obDeclarationNo: 'EX-20800061-24', obDeclarationType: 'Export',    exitPoint: 'Port Rashid',    actualDepartureDate: '22/02/2025', reExportTo: 'Oman',         statQty: '32', suppQty: '30', weight: '880'  };

type HsLine = {
  id: string; lineItemNo: number; hsCode: string; description: string;
  statQty: string; suppQty: string; weight: string; unit: string; outbound: OutboundEntry[];
};
type InvoiceGroup = { invoiceNo: string; hsLines: HsLine[] };

type DeclLine = {
  declarationNo: string; declarationType: string; chargeType: string;
  depositMethod: string; accountNumber: string; depositAmount: string;
  refundType: string; claimAmount: string; invoices: InvoiceGroup[];
};
const DECL_LINES: DeclLine[] = [
  {
    declarationNo: '105-01426431-24', declarationType: 'Import for Re Export', chargeType: 'Alternative Duty Deposit',
    depositMethod: 'Standing Guarantee', accountNumber: 'ACC-100234', depositAmount: '1,000.00',
    refundType: 'Full Export', claimAmount: '1,000.00',
    invoices: [
      { invoiceNo: 'INV-2024-001', hsLines: [
        { id: 'h1', lineItemNo: 1, hsCode: '39269050', description: 'Plastic Components & Fittings',       statQty: '100', suppQty: '100', weight: '45.5', unit: 'PCS', outbound: [OB1] },
        { id: 'h2', lineItemNo: 2, hsCode: '84713000', description: 'Electronic Data Processing Machines', statQty: '5',   suppQty: '5',   weight: '22.0', unit: 'NOS', outbound: [OB2] },
      ]},
    ],
  },
];

const DEFAULT_DOCS = [
  { id: 'vd-1', declNo: '105-01426431-24', docType: 'Standing Guarantee Letter', fileName: 'Guarantee-105-24.pdf', uploadedOn: '15/07/2025', remarks: '' },
  { id: 'vd-2', declNo: '105-01426431-24', docType: 'Outbound Declaration Copy', fileName: 'Outbound-EX20800049.pdf', uploadedOn: '15/07/2025', remarks: '' },
];

const versionRows = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', status: 'Completed', isCurrentlyViewing: true },
];

/* ─── Outbound Declaration — read-only view popup ─── */
const OB_FIELDS: { label: string; get: (ob: OutboundEntry) => string }[] = [
  { label: 'Customs Authority',     get: ob => ob.customsAuthority },
  { label: 'Outbound Declaration No.', get: ob => ob.obDeclarationNo },
  { label: 'Declaration Type',      get: ob => ob.obDeclarationType },
  { label: 'Exit Point',            get: ob => ob.exitPoint },
  { label: 'Actual Departure Date', get: ob => ob.actualDepartureDate },
  { label: 'Re-Export To',          get: ob => ob.reExportTo },
  { label: 'Statistical Qty',       get: ob => ob.statQty },
  { label: 'Supplementary Qty',     get: ob => ob.suppQty },
  { label: 'Weight (kg)',           get: ob => ob.weight },
];
function OutboundViewPopup({ obs, onClose }: { obs: OutboundEntry[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: 1100, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-[12px] flex-wrap">
            <h2 className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0, fontFamily: font }}>Outbound Declaration Details</h2>
            <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: 'rgba(255,255,255,0.14)', color: '#f8fafd', fontWeight: 500, fontFamily: font }}>
              {obs.length} declaration{obs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1000, fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, width: 44 }}>#</th>
                  {OB_FIELDS.map(c => (
                    <th key={c.label} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {obs.map((ob, i) => (
                  <tr key={ob.id} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                    {OB_FIELDS.map(c => (
                      <td key={c.label} className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{c.get(ob) || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eef1f6' }}>
          <button onClick={onClose}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500, cursor: 'pointer', boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Declaration Details — one card per declaration, expandable to a read-only
       Outbound Declaration Details accordion with the Invoice/HS Code table,
       mirroring the Refund Details step of the create/amend claim flow. ─── */
function DeclarationCard({ d, idx, open, onToggle, onViewOb }: {
  d: DeclLine; idx: number; open: boolean; onToggle: () => void; onViewOb: (obs: OutboundEntry[]) => void;
}) {
  const allHs = d.invoices.flatMap(inv => inv.hsLines.map(hs => ({ inv, hs })));

  return (
    <div className="bg-white rounded-[8px]" style={{ border: `1.5px solid ${open ? '#1360d2' : 'transparent'}`, borderTop: idx > 0 ? '1px solid #eef1f6' : undefined }}>
      {/* Declaration summary row */}
      <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px] px-[16px] py-[14px]">
        <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{idx + 1}</span>
        <FieldItem label="Declaration No." value={d.declarationNo} />
        <FieldItem label="Declaration Type" value={d.declarationType} />
        <FieldItem label="Charge Type" value={d.chargeType} />
        <FieldItem label="Deposit Method" value={d.depositMethod} />
        <FieldItem label="Account Number" value={d.accountNumber} />
        <FieldItem label="Refund Type" value={d.refundType} />
        <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 160px', minWidth: 140 }}>
          <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>Claim Amount (AED)</span>
          <span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}><Dh style={{ fontSize: 15 }} />{d.claimAmount}</span>
        </div>
        <button type="button" onClick={onToggle} aria-label={open ? 'Collapse outbound details' : 'Expand outbound details'}
          className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors ml-auto"
          style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Outbound Declaration Details — read-only accordion toggle bar + HS code table */}
      <div style={{ borderTop: '1px solid #eef1f6' }}>
        <button type="button" onClick={onToggle}
          className={`w-full flex items-center gap-[10px] px-[20px] py-[12px] text-left transition-colors ${open ? '' : 'hover:bg-[#f8fafd]'}`}
          style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}>
          <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
            style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
            <path d="M5 3l4 4-4 4"/>
          </svg>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Outbound Declaration Details</span>
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
            {allHs.length} HS Code{allHs.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>

      {open && (
        <div className="px-[20px] pb-[16px] pt-[16px]" style={{ borderTop: '1px solid #f5f7fc' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 1000 }}>
              <thead>
                <tr>
                  {['Invoice Number', 'Invoice Line Item No.', 'HS Code', 'Goods Description', 'Outbound Declaration No.', 'Statistical Qty', 'Supplementary Qty', 'Weight'].map(h => (
                    <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                      <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allHs.map(({ inv, hs }) => (
                  <tr key={hs.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#455174', fontFamily: font }}>{inv.invoiceNo}</span></td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{hs.lineItemNo}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{hs.hsCode}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.description}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      {hs.outbound.length > 0 ? (
                        hs.outbound.length === 1 ? (
                          <button type="button" onClick={() => onViewOb(hs.outbound)}
                            className="text-[16px] hover:underline text-left"
                            style={{ color: '#1360d2', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: font, padding: 0, whiteSpace: 'nowrap' }}>
                            {hs.outbound[0].obDeclarationNo}
                          </button>
                        ) : (
                          <button type="button" title={`${hs.outbound.length} outbound declarations`} onClick={() => onViewOb(hs.outbound)}
                            className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline', border: 'none', cursor: 'pointer', fontFamily: font }}>
                            {hs.outbound.length}
                          </button>
                        )
                      ) : (
                        <span className="text-[16px]" style={{ color: '#c0c8d8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.statQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></span></td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.suppQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></span></td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.weight} <span className="text-[14px] text-[#697498]">kg</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

type Props = { onBack: () => void; claimType?: string };

export default function RefundDepositsClaimViewPage({ onBack, claimType = 'Refund of Deposits' }: Props) {
  const [openDeclIds, setOpenDeclIds] = useState<Set<string>>(() => new Set([DECL_LINES[0]?.declarationNo].filter(Boolean) as string[]));
  const toggleDecl = (declarationNo: string) => setOpenDeclIds(prev => {
    const next = new Set(prev);
    next.has(declarationNo) ? next.delete(declarationNo) : next.add(declarationNo);
    return next;
  });
  const [viewOb, setViewOb] = useState<OutboundEntry[] | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056-CONSOLIDATED SHIPPING SERVICES L.L.C</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[28px] text-[#111838] mb-[20px] mt-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>
          View Claim
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details */}
          <Section title="Claim Header Details">
            <div className="flex flex-wrap">
              <FieldItem label="Claim No. & Version" value="3842063-1" />
              <FieldItem label="Claim Type" value={claimType} />
              <FieldItem label="Claim Registration Date" value="29/06/2026" />
              <FieldItem label="Claim Status" value="Completed" />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Claimant" value="CONSOLIDATED SHIPPING SERVICES L.L.C (Business - AE-1019056)" />
              <FieldItem label="Beneficiary" value="CONSOLIDATED SHIPPING SERVICES L.L.C (Business - AE-1019056)" />
            </div>
          </Section>

          {/* Charges And Payment Details */}
          <Section title="Charges And Payment Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Charge Type', 'Amount (AED)', 'Payment Mode', 'Receipt No.', 'Payment Reference Details'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Claim Registration Charge', amt: '50.00', receipt: 'A-100650705' },
                    { type: 'Knowledge & Innovation Dirham', amt: '20.00', receipt: 'A-100650706' },
                  ].map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font }}><Dh style={{ fontSize: 15 }} />{row.amt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>Credit/Debit Account</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 CONSOLIDATED SHIPPING SERVICES L.L.C</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}><Dh style={{ fontSize: 15 }} />70.00</span></td>
                    <td colSpan={3} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Declaration Details — merged with Invoice/HS Code + Outbound Declaration
              Details into one read-only accordion per declaration (mirrors the
              Refund Details step of the create/amend claim flow). */}
          <Section title="Declaration Details" badge={`${DECL_LINES.length} declaration${DECL_LINES.length !== 1 ? 's' : ''}`}>
            <div className="flex flex-col">
              {DECL_LINES.map((d, i) => (
                <DeclarationCard key={d.declarationNo} d={d} idx={i} open={openDeclIds.has(d.declarationNo)} onToggle={() => toggleDecl(d.declarationNo)} onViewOb={setViewOb} />
              ))}
            </div>
          </Section>

          {/* Uploaded Documents */}
          <Section title="Uploaded Documents">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['S.No', 'Declaration No.', 'Document Type', 'File Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEFAULT_DOCS.map((doc, i) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>{doc.declNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.docType}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.fileName}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.uploadedOn}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>{doc.remarks || '—'}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          title="Download"
                          onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = doc.fileName; a.click(); }}
                          className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                          style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}
                        >
                          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Claim Request Versions */}
          <Section title="Claim Request Versions">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 600 }}>
                <thead>
                  <tr>
                    {['Version', 'Submitted Date', 'Status', 'Currently Viewing'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {versionRows.map((row) => (
                    <tr key={row.version} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="text-[16px] underline" style={{ color: '#1360d2', cursor: 'pointer', fontFamily: font }}>{row.version}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.submittedDate}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[16px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {row.isCurrentlyViewing
                          ? <span className="text-[16px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 500 }}>✓ Currently Viewing</span>
                          : <span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>

      {viewOb && <OutboundViewPopup obs={viewOb} onClose={() => setViewOb(null)} />}

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center gap-[12px]" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)' }}>
        <button
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
