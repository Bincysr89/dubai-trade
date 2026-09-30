import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Pagination from '../Pagination';
import { JourneyStepper, SectionCard, font } from './DeclarationUI';

const filterSrc = new URL('../../assets/declaration/filter-list.svg', import.meta.url).href;

/* ── Table chrome, matching Figma 2650:48769 (header cell) ── */
function Th({ label, width }: { label: string; width?: number }) {
  return (
    <th style={{ background: '#e2ebf9', padding: 12, textAlign: 'left', whiteSpace: 'nowrap', width }}>
      <span className="inline-flex items-center gap-[4px]">
        <span className="text-[14px]" style={{ color: '#455174', fontWeight: 500, letterSpacing: '0.07px', lineHeight: '18px' }}>{label}</span>
        <img src={filterSrc} alt="" width={16} height={16} />
      </span>
    </th>
  );
}

function Td({ children, width }: { children?: React.ReactNode; width?: number }) {
  return (
    <td className="text-[14px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap', width }}>{children}</td>
  );
}

const MoreIcon = () => (
  <svg viewBox="0 0 4 18" width="4" height="18" fill="#697498"><circle cx="2" cy="2" r="2" /><circle cx="2" cy="9" r="2" /><circle cx="2" cy="16" r="2" /></svg>
);

const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round"
    style={{ transform: up ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" /></svg>
);

/** Row flyout — rendered as a fixed portal so the table's scroll box can't clip it. */
function Flyout({ items, at, onPick, onClose }: {
  items: { label: string; icon: React.ReactNode }[];
  at: { top: number; left: number };
  onPick: (label: string) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const h = () => onClose();
    document.addEventListener('mousedown', h);
    window.addEventListener('scroll', h, true);
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('scroll', h, true); };
  }, [onClose]);
  return createPortal(
    <div
      className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden"
      style={{ top: at.top, left: at.left, width: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', fontFamily: font }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => { onPick(it.label); onClose(); }}
          className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
        >
          <span className="text-[#697498] group-hover:text-white flex-shrink-0">{it.icon}</span>
          <span className="text-[15px] text-[#111838] group-hover:text-white">{it.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}

const eyeIcon = <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>;
const carIcon = <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 12h14v3H3zM5 12l1.5-4h7L15 12" /><circle cx="6.5" cy="15.5" r="1.2" /><circle cx="13.5" cy="15.5" r="1.2" /></svg>;
const docIcon = <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3M7 10h6M7 13h4" /></svg>;

const LINE_ITEM_COLUMNS = [
  'HS Code', 'Goods Description', 'Condition', 'Country of origin', 'Weight', 'Value of Goods',
  'Statistical Quantity - Units', 'Supplementary Quantity - Units', 'Item Quantity - Units',
];
const LINE_ITEMS = ['AX1234567', 'BX1234567', 'CX1234567', 'DX1234567', 'EX1234567', 'EX1234567'].map((hs) => ({
  hs, desc: 'Spare parts', condition: 'New', origin: 'India', weight: '100 kg',
  value: 'AED 1500', statQty: '100 unit', suppQty: '100 unit', itemQty: '100 unit',
}));

const VEHICLE_COLUMNS = [
  'Vehicle Type', 'Value Brand', 'Model', 'Condition', 'Chassis Number', 'Specification std.',
  'Color', 'Drive', 'Year Build', 'Engine Capacity', 'Declaration Number', 'Manufacturer/Exporter',
  'Anti dumping Applicability',
];
const VEHICLE_ROWS = [
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '4 Ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Civix', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '6 ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
];

const INVOICES = [
  { id: 1, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
  { id: 2, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
  { id: 3, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
];

const invoiceIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.7">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 13h4M7 16h8" />
  </svg>
);

type Props = {
  /** "View Details" on an invoice or line-item row opens the invoice view page. */
  onViewDetails?: () => void;
};

/** Invoice Details step — Figma 2650:48551. */
export default function DeclarationInvoiceDetailsPage({ onViewDetails }: Props) {
  const [openInvoice, setOpenInvoice] = useState<number | null>(1);
  const [openLineItem, setOpenLineItem] = useState<string | null>('AX1234567');
  const [flyout, setFlyout] = useState<{ kind: 'invoice' | 'line' | 'vehicle'; at: { top: number; left: number } } | null>(null);
  const [linePage, setLinePage] = useState(4);
  const [linePageSize, setLinePageSize] = useState(8);
  const [vehPage, setVehPage] = useState(4);
  const [vehPageSize, setVehPageSize] = useState(8);

  const openFlyout = (kind: 'invoice' | 'line' | 'vehicle') => (e: React.MouseEvent) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const height = kind === 'invoice' ? 52 : kind === 'line' ? 52 : 148;
    setFlyout({ kind, at: { top: Math.min(r.bottom + 4, window.innerHeight - height - 8), left: Math.max(8, r.left - 170) } });
  };

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={2} />

      <div className="flex items-center justify-between gap-[16px] flex-wrap">
        <div className="flex items-center gap-[40px] flex-wrap">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>03 Invoices Added</span>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Grand Total: AED 25,000.00</span>
        </div>
        <button data-secondary-btn type="button"
          className="h-[44px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Edit Details</button>
      </div>

      {INVOICES.map((inv) => {
        const expanded = openInvoice === inv.id;
        return (
          <SectionCard key={inv.id} className="!py-[20px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              {invoiceIcon}
              <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Invoice {inv.id}</span>
            </div>

            <div className="flex items-start justify-between gap-[20px] flex-wrap">
              <div className="flex flex-wrap gap-x-[56px] gap-y-[16px]">
                {[['Invoice Number', inv.number], ['Invoice Date', inv.date], ['Terms of Delivery', inv.terms],
                  ['No. of Line Items', inv.lineItems], ['Invoice Value', inv.value]].map(([l, v]) => (
                  <div key={l} className="flex flex-col gap-[6px]">
                    <span className="text-[14px] text-[#697498]">{l}</span>
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[12px] flex-shrink-0">
                <button onClick={openFlyout('invoice')} aria-label={`Invoice ${inv.id} actions`}
                  className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                <button onClick={() => setOpenInvoice(expanded ? null : inv.id)} aria-label={expanded ? 'Collapse invoice' : 'Expand invoice'}
                  className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><Chevron up={expanded} /></button>
              </div>
            </div>

            {expanded && (
              <div className="mt-[24px] flex flex-col gap-[8px]">
                <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Line Items</span>
                <span className="text-[14px] text-[#697498] mb-[8px]">100 Items Available</span>

                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1235 }}>
                    <thead>
                      <tr>
                        {LINE_ITEM_COLUMNS.map((c) => <Th key={c} label={c} />)}
                        <th style={{ background: '#e2ebf9', padding: 12, textAlign: 'left', width: 90 }}>
                          <span className="text-[14px]" style={{ color: '#455174', fontWeight: 500 }}>Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {LINE_ITEMS.map((li, i) => {
                        const open = openLineItem === li.hs && i === 0;
                        return (
                          <React.Fragment key={`${li.hs}-${i}`}>
                            <tr style={{ borderBottom: '1px solid #eef1f6' }}>
                              <Td>{li.hs}</Td><Td>{li.desc}</Td><Td>{li.condition}</Td><Td>{li.origin}</Td>
                              <Td>{li.weight}</Td><Td>{li.value}</Td><Td>{li.statQty}</Td><Td>{li.suppQty}</Td><Td>{li.itemQty}</Td>
                              <Td>
                                <span className="flex items-center gap-[10px]">
                                  <button onClick={openFlyout('line')} aria-label="Line item actions"
                                    className="size-[24px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                                  <button onClick={() => setOpenLineItem(open ? null : li.hs)} aria-label={open ? 'Collapse line item' : 'Expand line item'}
                                    className="size-[24px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><Chevron up={open} /></button>
                                </span>
                              </Td>
                            </tr>
                            {open && (
                              <tr>
                                <td colSpan={LINE_ITEM_COLUMNS.length + 1} style={{ padding: 0, background: '#f8fafd' }}>
                                  <div className="px-[16px] py-[20px] flex flex-col gap-[12px]">
                                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Vehicle Details</span>
                                    <div className="overflow-x-auto">
                                      <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1500 }}>
                                        <thead>
                                          <tr>
                                            {VEHICLE_COLUMNS.map((c) => <Th key={c} label={c} />)}
                                            <th style={{ background: '#e2ebf9', padding: 12, textAlign: 'left', width: 70 }}>
                                              <span className="text-[14px]" style={{ color: '#455174', fontWeight: 500 }}>Action</span>
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {VEHICLE_ROWS.map((r, ri) => (
                                            <tr key={ri} style={{ borderBottom: '1px solid #eef1f6', background: '#fff' }}>
                                              {r.map((cell, ci) => <Td key={ci}>{cell}</Td>)}
                                              <Td>
                                                <button onClick={openFlyout('vehicle')} aria-label="Vehicle actions"
                                                  className="size-[24px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                                              </Td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <Pagination
                                      page={vehPage} totalPages={7} pageSize={vehPageSize} pageSizeOptions={[8, 16, 32]}
                                      totalItems={56} onPageChange={setVehPage}
                                      onPageSizeChange={(s) => { setVehPageSize(s); setVehPage(1); }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-[8px]">
                  <Pagination
                    page={linePage} totalPages={7} pageSize={linePageSize} pageSizeOptions={[8, 16, 32]}
                    totalItems={56} onPageChange={setLinePage}
                    onPageSizeChange={(s) => { setLinePageSize(s); setLinePage(1); }}
                  />
                </div>
              </div>
            )}
          </SectionCard>
        );
      })}

      {flyout && (
        <Flyout
          at={flyout.at}
          onClose={() => setFlyout(null)}
          onPick={(label) => { if (label === 'View Details') onViewDetails?.(); }}
          items={
            flyout.kind === 'vehicle'
              ? [
                  { label: 'View Details', icon: eyeIcon },
                  { label: 'Vehicle Details', icon: carIcon },
                  { label: 'Permit Details', icon: docIcon },
                ]
              : [{ label: 'View Details', icon: eyeIcon }]
          }
        />
      )}
    </div>
  );
}
