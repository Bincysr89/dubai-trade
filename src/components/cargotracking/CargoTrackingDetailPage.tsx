import Header from '../Header';
import ClaimStepper from '../ClaimStepper';
import BackToListingBar from '../BackToListingBar';
import { JOURNEY_STAGES, type CargoSearchResult } from './cargoTrackingData';

const font = "'Dubai', sans-serif";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Cleared:   { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  Cancelled: { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

const JOURNEY_STEPS = JOURNEY_STAGES.map((stage, i) => ({ id: `stage-${i}`, label: stage }));

type Props = {
  result: CargoSearchResult;
  onBack: () => void;
  onBackToListing: () => void;
};

/* ── Detail card: numbered header + 2-column zebra-striped field grid ───── */
function DetailCard({ number, title, fields }: { number: number; title: string; fields: { label: string; value: string }[] }) {
  const rows: { label: string; value: string }[][] = [];
  for (let i = 0; i < fields.length; i += 2) rows.push(fields.slice(i, i + 2));

  return (
    <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
      <div className="flex items-center gap-[10px] px-[20px] py-[14px]">
        <span
          className="size-[22px] rounded-full flex items-center justify-center flex-shrink-0 text-[12px] text-white"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 700 }}
        >
          {number}
        </span>
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{title}</span>
      </div>
      <div>
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-1 sm:grid-cols-2" style={{ background: ri % 2 === 0 ? '#f8fafd' : '#fff' }}>
            {row.map((f, ci) => (
              <div key={ci} className="flex items-center gap-[6px] px-[20px] py-[11px] flex-wrap" style={{ borderTop: '1px solid #eef1f6' }}>
                <span className="text-[14px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>{f.label} :</span>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
            {row.length === 1 && <div className="hidden sm:block" style={{ borderTop: '1px solid #eef1f6' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CargoTrackingDetailPage({ result, onBack, onBackToListing }: Props) {
  const st = STATUS_STYLE[result.status];
  const d = result.detail;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBackToListing} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[16px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBackToListing}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Cargo Tracking</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        {/* Cargo summary header */}
        <div className="bg-white rounded-[8px] p-[24px] mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center gap-[14px] flex-wrap mb-[10px]">
            <div className="size-[44px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" /><path d="M12 7v11M8 12H5a7 7 0 007 7 7 7 0 007-7h-3" />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>{result.transportDocNo}</h1>
            <span className="px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium" style={{ background: '#e2ebf9', color: '#1360d2', fontFamily: font }}>
              {result.channel} {result.movement}
            </span>
            <span className="inline-flex items-center gap-[5px] px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium" style={{ background: st.bg, color: st.color, fontFamily: font }}>
              <span className="size-[6px] rounded-full flex-shrink-0" style={{ background: st.color }} />
              {result.status}
            </span>
          </div>
          <div className="flex items-center gap-[20px] flex-wrap text-[14px] text-[#697498] mb-[14px]" style={{ fontFamily: font, paddingLeft: 58 }}>
            <span>Declaration: <b style={{ color: '#0e1b3d' }}>{result.declarationNo}</b></span>
            <span>Submitted: <b style={{ color: '#0e1b3d' }}>{result.submissionDate}</b></span>
            <span>Cleared: <b style={{ color: '#0e1b3d' }}>{result.clearanceDate}</b></span>
          </div>
          <div className="flex items-center gap-[8px] pt-[14px]" style={{ borderTop: '1px solid #eef1f6' }}>
            <span className="size-[8px] rounded-full flex-shrink-0" style={{ background: '#1360d2' }} />
            <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>
              Current stage: <b style={{ color: '#0e1b3d' }}>{JOURNEY_STAGES[d.currentStageIndex]}</b>
            </span>
          </div>
        </div>

        <div className="mb-[24px]">
          <ClaimStepper activeIndex={d.currentStageIndex} steps={JOURNEY_STEPS} />
        </div>

        {/* Detail sections */}
        <div className="flex flex-col gap-[16px]">
          <DetailCard number={1} title="Vessel Details" fields={[
            { label: 'Rotation Number', value: d.vessel.rotationNumber },
            { label: 'Expected Time Of Arrival', value: d.vessel.eta },
            { label: 'Actual Time of Arrival', value: d.vessel.ata },
          ]} />
          <DetailCard number={2} title="Manifest Details" fields={[
            { label: 'BOL Number', value: d.manifest.bolNumber },
            { label: 'BOL Submission Agent', value: d.manifest.submissionAgent },
            { label: 'BOL Submission Date', value: d.manifest.submissionDate },
          ]} />
          <DetailCard number={3} title="Discharge List Details" fields={[
            { label: 'Container Category Status', value: d.discharge.containerCategoryStatus },
            { label: 'No. Of Containers', value: d.discharge.noOfContainers },
          ]} />
          <DetailCard number={4} title="Delivery Order Details" fields={[
            { label: 'Issue Date', value: d.delivery.issueDate },
            { label: 'Consignee', value: d.delivery.consignee },
            { label: 'Expiry Date', value: d.delivery.expiryDate },
          ]} />
        </div>
      </div>

      <BackToListingBar onBack={onBack} onBackToListing={onBackToListing} />
    </div>
  );
}
