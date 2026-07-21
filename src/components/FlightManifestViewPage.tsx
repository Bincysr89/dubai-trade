import { Fragment } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

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

            <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
              <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e2ebf9' }}>
                    {['Airway Bill No', 'Source', 'Origin', 'Destination', 'Weight in Kgs', 'No. of Pcs', 'Shipper', 'Consignee'].map(h => (
                      <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AWBS.map(a => (
                    <Fragment key={a.awbNo}>
                      <tr style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#1360d2] font-medium">{a.awbNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.source}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.origin}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.destination}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.weightKg}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.pcs}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.shipper}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{a.consignee}</td>
                      </tr>
                      <tr style={{ background: '#f8fafd' }}>
                        <td colSpan={8} className="px-[16px] py-[12px]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[4px]">
                            <p className="text-[14px]" style={{ fontFamily: font }}><span style={{ color: '#697498' }}>Airport / City of Origin: </span><span style={{ color: '#0e1b3d', fontWeight: 500 }}>{a.originName}</span></p>
                            <p className="text-[14px]" style={{ fontFamily: font }}><span style={{ color: '#697498' }}>Airport / City of Destination: </span><span style={{ color: '#0e1b3d', fontWeight: 500 }}>{a.destinationName}</span></p>
                            <p className="text-[14px]" style={{ fontFamily: font }}><span style={{ color: '#697498' }}>Shipment Description Code: </span><span style={{ color: '#0e1b3d', fontWeight: 500 }}>{a.descCode}</span></p>
                            <p className="text-[14px]" style={{ fontFamily: font }}><span style={{ color: '#697498' }}>Goods Description: </span><span style={{ color: '#0e1b3d', fontWeight: 500 }}>{a.goodsDesc}</span></p>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
