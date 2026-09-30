import React from 'react';
import { Readout, SectionCard, SectionTitle, font } from './DeclarationUI';

const filterSrc = new URL('../../assets/declaration/filter-list.svg', import.meta.url).href;

/** A band of read-out pairs, separated by the hairline rules used on the Customs Bill card. */
function Band({ pairs, cols = 5, last }: { pairs: [string, React.ReactNode][]; cols?: number; last?: boolean }) {
  return (
    <div
      className={`grid gap-x-[24px] gap-y-[24px] py-[24px] px-[24px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols === 4 ? '4' : '5'}`}
      style={{ borderBottom: last ? undefined : '1px solid #eef1f6' }}
    >
      {pairs.map(([l, v]) => (
        <Readout key={l} label={l} value={typeof v === 'string' ? v : undefined}>
          {typeof v === 'string' ? undefined : v}
        </Readout>
      ))}
    </div>
  );
}

function DocCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  );
}

const UPLOADED = [
  ['Invoice 12124.PDF', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Invoice 898486.xls', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Invoice 189777.pdf', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['BOL123.pdf', 'Dubai Customs', 'AWB/BOL', '50 MB', '08-12-2024'],
  ['Cert. of Origin1213.pdf', 'Dubai Customs', 'Cert. of Origin', '50 MB', '08-12-2024'],
  ['Laboratory 123234.pdf', 'Dubai Municipality', 'Laboratory Results', '50 MB', '08-12-2024'],
];

/** View Declaration — Figma 2835:102541. A long read-only record of the submitted declaration. */
export default function ViewDeclarationPage() {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      {/* ── Customs Bill ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Customs Bill</SectionTitle>
        <DocCard>
          <Band pairs={[
            ['Regime Type', 'Import'], ['Trade Type', 'Non E-commerce'],
            ['Transaction Type', 'New Declaration Request'], ['Total No. of Consolidated HAWs', '--'],
          ]} cols={4} />
          <Band pairs={[
            ['Cargo Channel', 'Sea'], ['Declaration Type', '101-Import to local from ROW'],
            ['Declaration Date', '20/Dec/2024'], ['Request No.', '636354321'],
            ['Declaration/Customs Clearance No.', '--'],
          ]} />
          <Band pairs={[
            ['Consignee/Importer/Buyer/Transferee', 'UATReport.LLC AE-1049640'],
            ['Consignor/Exporter/Seller/Transferor', 'shaheer 36933'],
          ]} cols={4} />
          <Band pairs={[['Cargo Ownership', 'NA'], ['Associated Owner', 'NA']]} cols={4} />
          <Band pairs={[
            ['Importer VAT TRN', '1011234567890'],
            ['Broker', 'Consolidated Shipping Services LLC-102923746'],
            ['Passenger', 'NA'], ['Agent', 'Maersk Shipping AE-1000087'], ['Notify Party', 'NA'],
          ]} />
          <Band pairs={[
            ['MAWB/MBOL', 'LKUB8233031'], ['HAWB/HBOL', 'NA'], ['Carrier Registration No.', 'NA'],
            ['Carrier Name', 'MAERSK ALABAMA'], ['Schedule Date', '24/Jun/2024'],
          ]} />
          <Band pairs={[
            ['Original Load Port', 'INCOK, Cochin'], ['Port of Load', 'INCOK, Cochin'],
            ['Load Port Country', 'India'], ['Port of Discharge', 'AEJEA, Jebel Ali'],
            ['Port of Discharge Country', 'United Arab Emirates'],
          ]} />
          <Band pairs={[['Destination Country', 'United Arab Emirates'], ['Response Type', '--']]} cols={5} last />
        </DocCard>
      </div>

      {/* ── Goods/Package Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Goods/Package Details</SectionTitle>
        <DocCard>
          <Band pairs={[
            ['Package Details', '1000 Packaged Goods'],
            ['Marks & Numbers', 'Based on BOL no. from Manifest Data'],
          ]} cols={4} last />
        </DocCard>
      </div>

      {/* ── Container Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Container Details</SectionTitle>
        <DocCard>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['Container No', 'Seal No', 'Container Size', 'Container Type'].map((c) => (
                    <th key={c} className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[['LILI1303120', 'NA', '--', '--'], ['LILI1303130', 'NA', '20', 'Reefer'], ['LILI1303140', 'NA', '--', '--']].map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    {r.map((cell, j) => <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 20px' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocCard>
      </div>

      {/* ── Invoice Details ── */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[40px] flex-wrap">
          <SectionTitle>Invoice Details</SectionTitle>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>03 Invoices Added</span>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Grand Total: AED 25,000.00</span>
        </div>
        <DocCard>
          <div className="px-[24px] pt-[20px]">
            <span className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Invoice 1</span>
          </div>
          <Band pairs={[
            ['Invoice Number', 'TD 2403'], ['Invoice Date', '09/11/2024'], ['Terms of Delivery', 'Cost & Fright'],
            ['No. of Line Items', '1 Line Item'], ['Invoice Value', 'USD 6400.00'],
          ]} />
          <Band pairs={[
            ['Payment Method', 'Bank transfer'], ['Attested with Mofaic', 'Yes'],
            ['EDAS Attestation Number', '12345678'],
          ]} cols={5} last />
        </DocCard>
      </div>

      {/* ── Document Availability ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Document Availability</SectionTitle>
        <DocCard>
          <Band pairs={[
            ['Invoice', 'Available in Electronics'], ['AWB/BOL', 'Available in Electronics'],
            ['Packaging list', 'Available in Electronics'], ['Certificate of Origin', 'Not Required'],
            ['Reason for not required', 'Reason'],
          ]} last />
        </DocCard>
      </div>

      {/* ── Custom Charge Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Custom Charge Details</SectionTitle>
        <DocCard>
          <Band pairs={[
            ['Duty & Tax', 'AED 1000.00'], ['Deposit', 'AED 2850.00'],
            ['Additional Duty', 'AED 607.00'], ['Other charges', 'AED 607.00'],
            ['Total Payable amount', 'AED 4,457.00'],
          ]} last />
        </DocCard>
      </div>

      {/* ── Transit Details / Other Remarks ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Transit Details / Other Remarks</SectionTitle>
        <DocCard><Band pairs={[['Remarks', '--']]} cols={4} last /></DocCard>
      </div>

      {/* ── Anti Dumping Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Anti Dumping Details</SectionTitle>
        <DocCard>
          <Band pairs={[
            ['Manufacturer/Exporter', 'Exporter Name'], ['Anti Dumping Applicability', 'Not Applicable'],
            ['Reason for Not Applicable', 'Not Applicable'],
          ]} last />
        </DocCard>
      </div>

      {/* ── Declaration Versions ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Declaration Versions</SectionTitle>
        <DocCard>
          <div className="flex flex-wrap gap-[12px] px-[24px] py-[24px]">
            {['Version 1', 'Version 2', 'Version 3', 'Version 4', 'Version 5', 'Version 6'].map((v) => (
              <button key={v} data-secondary-btn type="button"
                className="h-[42px] px-[22px] rounded-[4px] border bg-white text-[15px] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>{v}</button>
            ))}
          </div>
        </DocCard>
      </div>

      {/* ── Documents Uploaded ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Documents Uploaded</SectionTitle>
        <DocCard>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['Document Name', 'Authority Name', 'Document Type', 'Uploaded size', 'Uploaded on'].map((c) => (
                    <th key={c} style={{ padding: '14px 20px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <span className="inline-flex items-center gap-[4px]">
                        <span className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{c}</span>
                        <img src={filterSrc} alt="" width={16} height={16} />
                      </span>
                    </th>
                  ))}
                  <th className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, width: 100 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {UPLOADED.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    {r.map((cell, j) => <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{cell}</td>)}
                    <td style={{ padding: '16px 20px' }}>
                      <button type="button" className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocCard>
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <p className="text-[14px] text-[#455174]">
            Please contact Customer care if declaration number is not displayed within 30 minutes of declaration submission
          </p>
          <button data-secondary-btn type="button"
            className="h-[44px] px-[24px] rounded-[4px] border bg-white text-[15px] inline-flex items-center gap-[8px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
