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
       Invoice/HS Code and Outbound Declaration sections have real content. ─── */
type DeclLine = {
  declarationNo: string; declarationType: string; chargeType: string;
  depositMethod: string; accountNumber: string; claimAmount: string; remarks: string;
};
const DECL_LINES: DeclLine[] = [
  { declarationNo: '105-01426431-24', declarationType: 'Import for Re Export', chargeType: 'Alternative Duty Deposit', depositMethod: 'Standing Guarantee', accountNumber: 'ACC-100234', claimAmount: '1,000.00', remarks: '—' },
];

type InvoiceLine = {
  declarationNo: string; invoiceNo: string; hsCode: string; description: string;
  statQty: string; weight: string; outboundCount: number;
};
const INVOICE_LINES: InvoiceLine[] = [
  { declarationNo: '105-01426431-24', invoiceNo: 'INV-2024-001', hsCode: '39269050', description: 'Plastic Components & Fittings',       statQty: '100 PCS', weight: '45.5 kg', outboundCount: 1 },
  { declarationNo: '105-01426431-24', invoiceNo: 'INV-2024-001', hsCode: '84713000', description: 'Electronic Data Processing Machines', statQty: '5 NOS',   weight: '22.0 kg', outboundCount: 1 },
];

type OutboundEntry = {
  id: string; declarationNo: string; hsCode: string;
  customsAuthority: string; obDeclarationNo: string; obDeclarationType: string;
  exitPoint: string; actualDepartureDate: string; reExportTo: string;
  statQty: string; suppQty: string; weight: string;
};
const OUTBOUND_ENTRIES: OutboundEntry[] = [
  { id: 'ob1', declarationNo: '105-01426431-24', hsCode: '39269050', customsAuthority: 'Dubai Customs', obDeclarationNo: 'EX-20800049-24', obDeclarationType: 'Re-Export', exitPoint: 'Jebel Ali Port', actualDepartureDate: '15/01/2025', reExportTo: 'Saudi Arabia', statQty: '50', suppQty: '50', weight: '1250' },
  { id: 'ob2', declarationNo: '105-01426431-24', hsCode: '84713000', customsAuthority: 'Dubai Customs', obDeclarationNo: 'EX-20800061-24', obDeclarationType: 'Export',    exitPoint: 'Port Rashid',    actualDepartureDate: '22/02/2025', reExportTo: 'Oman',         statQty: '32', suppQty: '30', weight: '880'  },
];

const DEFAULT_DOCS = [
  { id: 'vd-1', declNo: '105-01426431-24', docType: 'Standing Guarantee Letter', fileName: 'Guarantee-105-24.pdf', uploadedOn: '15/07/2025', remarks: '' },
  { id: 'vd-2', declNo: '105-01426431-24', docType: 'Outbound Declaration Copy', fileName: 'Outbound-EX20800049.pdf', uploadedOn: '15/07/2025', remarks: '' },
];

const versionRows = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', status: 'Completed', isCurrentlyViewing: true },
];

/* ─── Outbound Declaration Details — read-only accordion ─── */
function OutboundAccordionItem({ entry, index, open, onToggle }: { entry: OutboundEntry; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderTop: index > 0 ? '1px solid #f0f3fa' : 'none' }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-[10px] px-[16px] py-[12px] text-left transition-colors"
        style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}
      >
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{entry.declarationNo}</span>
        <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
          HS {entry.hsCode}
        </span>
        <span className="text-[14px] text-[#697498] ml-auto flex-shrink-0" style={{ fontFamily: font }}>{open ? 'Collapse' : 'Expand'}</span>
      </button>
      {open && (
        <div className="px-[16px] pb-[16px] pt-[4px]">
          <div className="rounded-[6px] p-[16px] mb-[10px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
            <p className="text-[14px] text-[#455174] mb-[10px]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: font }}>Declaration Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px 20px' }}>
              <FieldItem label="Customs Authority" value={entry.customsAuthority} />
              <FieldItem label="Outbound Declaration No." value={entry.obDeclarationNo} />
              <FieldItem label="Declaration Type" value={entry.obDeclarationType} />
              <FieldItem label="Exit Point" value={entry.exitPoint} />
            </div>
          </div>
          <div className="rounded-[6px] p-[16px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
            <p className="text-[14px] text-[#455174] mb-[10px]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: font }}>Shipment Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px 20px' }}>
              <FieldItem label="Actual Departure Date" value={entry.actualDepartureDate} />
              <FieldItem label="Re-Export To" value={entry.reExportTo} />
              <FieldItem label="Statistical Qty" value={entry.statQty} />
              <FieldItem label="Supplementary Qty" value={entry.suppQty} />
              <FieldItem label="Weight (kg)" value={entry.weight} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Props = { onBack: () => void; claimType?: string };

export default function RefundDepositsClaimViewPage({ onBack, claimType = 'Refund of Deposits' }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([OUTBOUND_ENTRIES[0]?.id].filter(Boolean) as string[]));
  const toggle = (id: string) => setOpenIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

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

          {/* Declaration Details */}
          <Section title="Declaration Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 900 }}>
                <thead>
                  <tr>
                    {['S.No', 'Declaration No.', 'Declaration Type', 'Charge Type', 'Deposit Method', 'Account Number', 'Claim Amount (AED)', 'Remarks'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DECL_LINES.map((row, i) => (
                    <tr key={row.declarationNo} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{row.declarationNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.declarationType}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.chargeType}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.depositMethod}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.accountNumber}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}><Dh style={{ fontSize: 15 }} />{row.claimAmount}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>{row.remarks}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Invoice & HS Code Details */}
          <Section title="Invoice &amp; HS Code Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 900 }}>
                <thead>
                  <tr>
                    {['S.No', 'Declaration No.', 'Invoice Number', 'HS Code', 'Goods Description', 'Statistical Qty', 'Weight', 'Outbound Declaration(s)'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INVOICE_LINES.map((row, i) => (
                    <tr key={row.declarationNo + row.hsCode} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{row.declarationNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.invoiceNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{row.hsCode}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.description}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.statQty}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.weight}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="text-[16px] font-medium inline-flex items-center justify-center" style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, fontFamily: font }}>
                          {row.outboundCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Outbound Declaration Details — read-only accordion */}
          <Section title="Outbound Declaration Details" badge={`${OUTBOUND_ENTRIES.length} declaration${OUTBOUND_ENTRIES.length !== 1 ? 's' : ''}`}>
            {OUTBOUND_ENTRIES.map((entry, i) => (
              <OutboundAccordionItem key={entry.id} entry={entry} index={i} open={openIds.has(entry.id)} onToggle={() => toggle(entry.id)} />
            ))}
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
