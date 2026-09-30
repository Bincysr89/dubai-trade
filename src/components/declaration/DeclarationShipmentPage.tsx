import React, { useState } from 'react';
import Pagination from '../Pagination';
import { ColumnFilter } from '../ColumnFilter';
import {
  Field, JourneyStepper, PartyInformation, SectionCard, SectionTitle, TabBar, editSrc, font,
} from './DeclarationUI';

export const SHIPMENT_TABS = ['General Shipping Details', 'Package Details', 'Container Details'] as const;
export type ShipmentTab = (typeof SHIPMENT_TABS)[number];

type Props = {
  tab: ShipmentTab;
  onTabChange: (t: ShipmentTab) => void;
  /** Container row edit — opens the shipping-details popup. */
  onEditContainer?: (containerNo: string) => void;
};

/**
 * Shipment Details step — Figma 2650:46169 (General Shipping Details),
 * 2650:47573 (Package Details) and 2650:48087 (Container Details).
 */
export default function DeclarationShipmentPage({ tab, onTabChange, onEditContainer }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={1} />
      <TabBar tabs={SHIPMENT_TABS} active={tab} onChange={onTabChange} />

      {tab === 'General Shipping Details' && <GeneralShippingDetails />}
      {tab === 'Package Details' && <PackageDetails />}
      {tab === 'Container Details' && <ContainerDetails onEdit={onEditContainer} />}

      <PartyInformation />
    </div>
  );
}

function GeneralShippingDetails() {
  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Inbound - Shipping Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Carrier Registration No." valueRequired disabled trailing="edit"
              label="Carrier Registration Number" labelRequired />
            <Field value="20/12/2024" label="Scheduled Date" labelRequired disabled trailing="today" />
            <Field value="B87654" label="MAWB/BOL" labelRequired disabled trailing="edit" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Port Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Original Load Port" valueRequired trailing="search" trailingLabel="Search Original Load Port" />
            <Field value="Port of Load" valueRequired trailing="search" trailingLabel="Search Port of Load" />
            <Field value="Port of Discharge" valueRequired trailing="search" trailingLabel="Search Port of Discharge" />
            <Field value="Custom's Exit Point" valueRequired trailing="chevron" />
            <Field value="Destination Country" valueRequired />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Cargo Weight/Volume/Type</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="10000" label="Net Weight" labelRequired disabled unit="KG" />
            <Field value="10000" label="Gross Weight" labelRequired disabled unit="KG" />
            <Field value="LCL" label="Cargo Type" labelRequired disabled />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>IHC Response Type Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Response Type" valueRequired trailing="chevron" />
          </div>
        </SectionCard>
      </div>
    </>
  );
}

/* ── Package Details — Figma 2650:47573 ── */
function PackageDetails() {
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(8);
  const rows = Array.from({ length: 7 }, () => ['1000 Packaged Goods', 'Based on BOL no. from Manifest Data']);

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Package Details</SectionTitle>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700, fontFamily: font }}>
            <thead>
              <tr style={{ background: '#dce7f7' }}>
                <th className="text-left" style={{ padding: '12px 20px', fontWeight: 500, width: '50%' }}>
                  <ColumnFilter label="Number of Packages" labelClass="text-[15px] font-medium text-[#051937]" />
                </th>
                <th className="text-left" style={{ padding: '12px 20px', fontWeight: 500 }}>
                  <ColumnFilter label="Shipping Marks" labelClass="text-[15px] font-medium text-[#051937]" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eef1f6' }}>
                  {r.map((cell, j) => (
                    <td key={j} className="text-[15px] text-[#0e1b3d]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-[20px] py-[16px]">
          <Pagination
            page={page}
            totalPages={7}
            pageSize={pageSize}
            pageSizeOptions={[8, 16, 32]}
            totalItems={56}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Container Details — Figma 2650:48087 ── */
const CONTAINER_ROWS = [
  { no: 'LILI1303120', seal: 'NA', size: '--', type: '--' },
  { no: 'LILI1303130', seal: 'NA', size: '20', type: 'Reefer' },
  { no: 'LILI1303140', seal: 'NA', size: '--', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '40', type: 'Reefer' },
  { no: 'LILI1303120', seal: 'NA', size: '40', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '20', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '--', type: 'Reefer' },
];

function ContainerDetails({ onEdit }: { onEdit?: (containerNo: string) => void }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Container Details</SectionTitle>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 800, fontFamily: font }}>
            <thead>
              <tr style={{ background: '#dce7f7' }}>
                {['Container No', 'Seal No', 'Container Size', 'Container Type'].map((c) => (
                  <th key={c} className="text-left" style={{ padding: '12px 20px', fontWeight: 500 }}>
                    <ColumnFilter label={c} labelClass="text-[15px] font-medium text-[#051937]" />
                  </th>
                ))}
                <th className="text-left text-[15px] text-[#051937]" style={{ padding: '12px 20px', fontWeight: 500, width: 90 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {CONTAINER_ROWS.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eef1f6' }}>
                  <td className="text-[15px] text-[#0e1b3d]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r.no}</td>
                  <td className="text-[15px] text-[#0e1b3d]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r.seal}</td>
                  <td className="text-[15px] text-[#0e1b3d]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r.size}</td>
                  <td className="text-[15px] text-[#0e1b3d]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r.type}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit?.(r.no)}
                      aria-label={`Edit container ${r.no}`}
                      className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <img src={editSrc} alt="" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
