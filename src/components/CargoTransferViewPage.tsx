import React from 'react';

const font = "'Dubai', sans-serif";

// ── helpers ──────────────────────────────────────────────────────────────────

function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[15px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h2
        className="text-[16px] px-[4px]"
        style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d', letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        {title}
      </h2>
      <div
        className="bg-white rounded-[8px] overflow-hidden"
        style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}
      >
        {children}
      </div>
    </div>
  );
}

// ── data ─────────────────────────────────────────────────────────────────────

const containerRows = [
  { no: '12345678901', seal: '' },
  { no: '12378578902', seal: '' },
];

const packageRows = [
  { type: 'BUNDLES', count: '10', marks: '' },
];

const paymentRows = [
  { charge: 'Registration fee', amount: '40', mode: 'Credit/Debit Account', ref: '1222308 - TIG International', receipt: '', transaction: '' },
];

// ── page ─────────────────────────────────────────────────────────────────────

type Props = { onBack: () => void; onSubmit?: () => void };

export default function CargoTransferViewPage({ onBack }: Props) {
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
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-10 pt-[8px] pb-[20px] flex items-center justify-between flex-shrink-0">
        <h1 className="text-[32px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
          Cargo Transfer <span style={{ color: '#455174', fontWeight: 400, fontSize: 24 }}>(Version 1)</span>
        </h1>
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => window.print()}
            className="h-[36px] px-[20px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors flex items-center gap-[6px]"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 7V2h10v5" /><rect x="2" y="7" width="16" height="8" rx="1" /><path d="M5 15v3h10v-3" />
              <circle cx="15" cy="11" r="1" fill="currentColor" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <div className="flex flex-col gap-[24px]">

          {/* GENERAL INFORMATION */}
          <Section title="General Information">
            {/* Row 1 */}
            <div className="flex flex-wrap">
              <FieldItem label="Transfer Type" value="Cargo Transfer from CTO to CH (Same Location)" />
              <FieldItem label="Transfer No." value="" />
              <FieldItem label="Request No." value="1102232755" />
              <FieldItem label="Created Date" value="18/05/2026" />
            </div>
            <Divider />
            {/* Row 2 */}
            <div className="flex flex-wrap">
              <FieldItem label="Transfer Date" value="" />
              <FieldItem label="Transfer Status" value="Draft" />
              <FieldItem label="Transferor" value="AE-1000138-Al Raffiq Trading" />
              <FieldItem label="Transferor Premises" value="PR-01582-Jebel Ali" />
            </div>
            <Divider />
            {/* Row 3 */}
            <div className="flex flex-wrap">
              <FieldItem label="Transferee" value="AE-1000143-Al Cargo" />
              <FieldItem label="Transferee Premises" value="PR-00085-VIKRAM" />
              <FieldItem label="Broker" value="AE-1048909 - Vikram companies amended PLANET TRAVEL TOURS AND CARGO LLC" />
              <FieldItem label="Client's Dec. Ref. No." value="test" />
            </div>
            <Divider />
            {/* Row 4 */}
            <div className="flex flex-wrap">
              <FieldItem label="Goods Location" value="JEBEL ALI" />
            </div>
          </Section>

          {/* INBOUND DETAILS */}
          <Section title="Inbound Details">
            {/* Row 1 */}
            <div className="flex flex-wrap">
              <FieldItem label="Cargo Channel" value="Sea" />
              <FieldItem label="Carrier" value="101010 - fdgfdgdfg" />
              <FieldItem label="Arrival Date" value="19/02/2034" />
              <FieldItem label="Master Transport Document No." value="MAWBTEST12345" />
            </div>
            <Divider />
            {/* Row 2 */}
            <div className="flex flex-wrap">
              <FieldItem label="Port Of Loading" value="Jebel Ali" />
              <FieldItem label="Manifest Registration No." value="" />
            </div>
          </Section>

          {/* CARGO DETAILS */}
          <Section title="Cargo Details">
            {/* Row 1 */}
            <div className="flex flex-wrap">
              <FieldItem label="Cargo Type" value="FCL" />
              <FieldItem label="Gross Weight" value="1000 (kg)" />
              <FieldItem label="Customs Seal No." value="" />
              <FieldItem label="Preceding Clearance No." value="" />
            </div>
            <Divider />
            {/* Row 2 */}
            <div className="flex flex-wrap">
              <FieldItem label="Cargo Release Date" value="" />
            </div>
          </Section>

          {/* OUTBOUND DETAILS */}
          <Section title="Outbound Details">
            <div className="flex flex-wrap">
              <FieldItem label="Cargo Channel" value="" />
              <FieldItem label="Carrier No" value="" />
            </div>
          </Section>

          {/* CONTAINER DETAILS */}
          <Section title="Container Details">
            <div className="px-[16px] py-[12px]">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {['Container Number', 'Customs Seal Number'].map(h => (
                      <th key={h} style={{ background: '#f4f7fd', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[12px]" style={{ color: '#455174', fontFamily: font, fontWeight: 600, letterSpacing: '0.04em' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {containerRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.no}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.seal || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* PACKAGE DETAILS */}
          <Section title="Package Details">
            <div className="px-[16px] py-[12px]">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {['Package Type', 'Number Of Packages', 'Shipping Marks'].map(h => (
                      <th key={h} style={{ background: '#f4f7fd', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[12px]" style={{ color: '#455174', fontFamily: font, fontWeight: 600, letterSpacing: '0.04em' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {packageRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.count}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.marks || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* PAYMENT DETAILS */}
          <Section title="Payment Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 800 }}>
                <thead>
                  <tr>
                    {['Charge Type', 'Charge Amount', 'Payment Mode', 'Payment Reference Number', 'Collection Receipt Number', 'Transaction Number'].map(h => (
                      <th key={h} style={{ background: '#f4f7fd', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[12px]" style={{ color: '#455174', fontFamily: font, fontWeight: 600, letterSpacing: '0.04em' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.charge}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.amount}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.mode}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.ref}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt || '—'}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.transaction || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center"
        style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}
      >
        <button
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back to Listing
        </button>
      </div>

    </div>
  );
}
