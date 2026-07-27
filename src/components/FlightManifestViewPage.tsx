import { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

export type FlightManifestViewRow = Record<string, string | boolean | undefined> & { flightNo: string };

/* Same shape as the New Manifest flow's AwbLine — this page mirrors that flow's
   "List of Airway Bill of Unloading" card + table design, just read-only. */
type Awb = {
  awbNo: string; originCode: string; destCode: string;
  weight: string; weightUnit: string; pieces: string; shipperName: string; consigneeName: string;
};

const AIRPORT_NAMES: Record<string, string> = {
  MAA: 'Chennai (ex Madras)', DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport',
  LHR: 'London Heathrow Airport', JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport',
};

const AWBS: Awb[] = [
  { awbNo: '12341110914813', originCode: 'MAA', destCode: 'DXB', weight: '100', weightUnit: 'KG', pieces: '160', shipperName: '—', consigneeName: '—' },
  { awbNo: '12341110914814', originCode: 'MAA', destCode: 'DXB', weight: '100', weightUnit: 'KG', pieces: '160', shipperName: '—', consigneeName: '—' },
];

const str = (v: string | boolean | undefined) => typeof v === 'string' ? v : '';

type Props = { row: FlightManifestViewRow; onBack: () => void; onBackToListing: () => void };

export default function FlightManifestViewPage({ row, onBack, onBackToListing }: Props) {
  const flightNo = str(row.flightNo);
  const airportLoading = str(row.airportLoading) || 'DXB';
  const scheduleDate = str(row.scheduleDate) || '—';
  const airportUnloading = 'DXB';
  const [isOpen, setIsOpen] = useState(true);
  const [viewingAwb, setViewingAwb] = useState<Awb | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Flight Manifest</span>
      </div>
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>View Flight Manifest Courier</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Details</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Flight Number</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{flightNo}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Scheduled Date</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{scheduleDate}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Airport of Loading / Departure</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{airportLoading} ( {AIRPORT_NAMES[airportLoading] ?? airportLoading} )</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Flight Manifest Type</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Inbound Manifest</span>
            </div>
          </div>
        </div>

        {/* List of Airport of Unloading — same accordion card + AWB table design as the
            New Manifest flow's "List of Airport of Unloading" step, just read-only. */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Airport of Unloading</p>
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: isOpen ? '0px 5px 32px rgba(19,96,210,0.18)' : '0px 5px 32px rgba(143,155,186,0.16)', border: `1.5px solid ${isOpen ? '#1360d2' : 'transparent'}` }}>
            <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[8px] px-[16px] py-[14px]">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Airport of Unloading</span>
                <span className="text-[16px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>{airportUnloading} ({AIRPORT_NAMES[airportUnloading]})</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>No. of AWB&apos;s</span>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{AWBS.length}</span>
              </div>
              <button type="button" onClick={() => setIsOpen(o => !o)} aria-label={isOpen ? 'Collapse AWB list' : 'Expand AWB list'}
                className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors flex-shrink-0 ml-auto"
                style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div style={{ borderTop: '1px solid #eef1f6' }}>
              <button type="button" onClick={() => setIsOpen(o => !o)}
                className={`w-full flex items-center gap-[10px] px-[20px] py-[12px] text-left transition-colors ${isOpen ? '' : 'hover:bg-[#f8fafd]'}`}
                style={{ border: 'none', background: isOpen ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}>
                <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
                  style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                  <path d="M5 3l4 4-4 4" />
                </svg>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>List of Airway Bill of Unloading</span>
                <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: isOpen ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
                  {AWBS.length} AWB{AWBS.length !== 1 ? 's' : ''}
                </span>
                <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{isOpen ? 'Collapse' : 'Expand'}</span>
              </button>
            </div>

            {isOpen && (
              <div className="px-[20px] pb-[16px] pt-[16px]" style={{ borderTop: '1px solid #f5f7fc' }}>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 860 }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['Airway Bill No.', 'Origin', 'Destination', 'Weight', 'No. of Pcs', 'Shipper', 'Consignee', 'Actions'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {AWBS.map(a => (
                        <tr key={a.awbNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{a.awbNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.originCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.destCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.weight} {a.weightUnit}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.pieces}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.shipperName || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.consigneeName || '—'}</td>
                          <td className="px-[16px] py-[10px]">
                            <button type="button" onClick={() => setViewingAwb(a)} aria-label={`View ${a.awbNo}`} className="text-[#455174] hover:opacity-70">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingAwb && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ width: '100%', maxWidth: 520, boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>View Airway Bill</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              {[
                ['Airway Bill No.', viewingAwb.awbNo], ['Weight', `${viewingAwb.weight} ${viewingAwb.weightUnit}`],
                ['Number of Pieces', viewingAwb.pieces], ['Shipper Name', viewingAwb.shipperName],
                ['Consignee Name', viewingAwb.consigneeName],
                ['Airport/City of Origin', `${viewingAwb.originCode} — ${AIRPORT_NAMES[viewingAwb.originCode] ?? ''}`],
                ['Airport/City of Destination', `${viewingAwb.destCode} — ${AIRPORT_NAMES[viewingAwb.destCode] ?? ''}`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-[4px]">
                  <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setViewingAwb(null)}
                className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white hover:bg-[#f0f4ff]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
