import Header from './Header';
import BackToListingBar from './BackToListingBar';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

export type FlightManifestViewRow = Record<string, string | boolean | undefined> & { flightNo: string };

type Awb = {
  awbNo: string; source: string; origin: string; destination: string;
  weightKg: string; pcs: string; shipper: string; consignee: string;
  originName: string; destinationName: string; descCode: string; goodsDesc: string;
};

const AIRPORT_NAMES: Record<string, string> = {
  MAA: 'Chennai (ex Madras)', DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport',
  LHR: 'London Heathrow Airport', JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport',
};

const AWBS: Awb[] = [
  { awbNo: '12341110914813', source: 'AE-1051144', origin: 'MAA', destination: 'DXB', weightKg: '100', pcs: '160', shipper: '—', consignee: '—', originName: 'Chennai (ex Madras)', destinationName: 'DUBAI CARGO VILLAGE', descCode: 'Total Consignment', goodsDesc: 'TELEVISION SETS' },
  { awbNo: '12341110914814', source: 'AE-1051144', origin: 'MAA', destination: 'DXB', weightKg: '100', pcs: '160', shipper: '—', consignee: '—', originName: 'Chennai (ex Madras)', destinationName: 'DUBAI CARGO VILLAGE', descCode: 'Total Consignment', goodsDesc: 'TELEVISION SETS' },
];

const str = (v: string | boolean | undefined) => typeof v === 'string' ? v : '';

type Props = { row: FlightManifestViewRow; onBack: () => void; onBackToListing: () => void };

export default function FlightManifestViewPage({ row, onBack, onBackToListing }: Props) {
  const flightNo = str(row.flightNo);
  const airportLoading = str(row.airportLoading) || 'DXB';
  const scheduleDate = str(row.scheduleDate) || '—';
  const airportUnloading = 'DXB';
  const PCS_W = 110;
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();

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

        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Airport of Unloading</p>
          <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex items-center justify-between flex-wrap gap-[8px] px-[4px]">
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                Airport of Unloading : {airportUnloading} ( {AIRPORT_NAMES[airportUnloading]} )
              </span>
              <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>No. of AWBs : <b style={{ color: '#0e1b3d' }}>{AWBS.length}</b></span>
            </div>

            <div style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={PCS_W} />
              <div ref={scrollRef} onScroll={handleScroll} className="rounded-[6px] overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                <table style={{ fontFamily: font, borderCollapse: 'collapse', width: 'max-content', minWidth: '100%' }}>
                  <thead>
                    <tr style={{ background: '#e2ebf9' }}>
                      {['Airway Bill No', 'Source', 'Origin', 'Destination', 'Weight in Kgs', 'Shipper', 'Consignee', 'Airport / City of Origin', 'Airport / City of Destination', 'Shipment Description Code', 'Goods Description'].map(h => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                      <th className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap', position: 'sticky', right: 0, width: PCS_W, minWidth: PCS_W, background: '#e2ebf9', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>No. of Pcs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AWBS.map(a => (
                      <tr key={a.awbNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#1360d2] font-medium" style={{ whiteSpace: 'nowrap' }}>{a.awbNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.source}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.origin}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.destination}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.weightKg}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.shipper}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.consignee}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.originName}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.destinationName}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.descCode}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{a.goodsDesc}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', position: 'sticky', right: 0, width: PCS_W, minWidth: PCS_W, background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>{a.pcs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
