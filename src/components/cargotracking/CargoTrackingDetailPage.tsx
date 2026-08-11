import Header from '../Header';
import { JOURNEY_STAGES, type CargoSearchResult } from './cargoTrackingData';

const font = "'Dubai', sans-serif";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Cleared:   { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  Cancelled: { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

type Props = {
  result: CargoSearchResult;
  onBack: () => void;
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

const EditIcon = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z" />
  </svg>
);

/* ── Horizontal journey timeline ─────────────────────────────────────── */
function JourneyTimeline({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="bg-white rounded-[8px] px-[20px] py-[18px] mb-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      <div className="overflow-x-auto pb-[6px]">
        <div className="flex items-center w-max" style={{ minWidth: '100%' }}>
          {JOURNEY_STAGES.map((stage, i) => {
            const done = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={stage} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center" style={{ width: 128 }}>
                  <div
                    className="size-[36px] rounded-full flex items-center justify-center flex-shrink-0 relative"
                    style={{
                      border: `2px solid ${done ? '#28a745' : isCurrent ? '#1360d2' : '#d5ddfb'}`,
                      background: isCurrent ? '#1360d2' : done ? '#fff' : '#fff',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(19,96,210,0.14)' : 'none',
                    }}
                  >
                    {isCurrent ? (
                      <EditIcon />
                    ) : done ? (
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#28a745" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8" /></svg>
                    ) : (
                      <span className="text-[13px]" style={{ fontFamily: font, fontWeight: 700, color: '#b0b8d0' }}>{i + 1}</span>
                    )}
                  </div>
                  <span
                    className="text-[12px] text-center mt-[8px] leading-[15px]"
                    style={{ fontFamily: font, color: done ? '#28a745' : isCurrent ? '#1360d2' : '#8f94ae', fontWeight: isCurrent ? 600 : 400 }}
                  >
                    {stage}
                  </span>
                </div>
                {i < JOURNEY_STAGES.length - 1 && (
                  <div className="h-[2px] flex-shrink-0" style={{ width: 40, marginBottom: 28, background: i < currentIndex ? '#28a745' : '#e0e6f5' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CargoTrackingDetailPage({ result, onBack }: Props) {
  const st = STATUS_STYLE[result.status];
  const d = result.detail;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[16px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Cargo Tracking</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-[6px] text-[15px] text-[#1360d2] hover:opacity-80 mb-[16px]"
          style={{ fontFamily: font, fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
        >
          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6" /></svg>
          Back to Search Results
        </button>

        {/* Cargo summary header */}
        <div className="bg-white rounded-[8px] p-[24px] mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-start justify-between gap-[16px] flex-wrap mb-[10px]">
            <div className="flex items-center gap-[14px] flex-wrap">
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
            <span className="flex items-center gap-[4px] text-[13px] text-[#8f94ae] flex-shrink-0" style={{ fontFamily: font }}>
              Scroll to view full status
              <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4l6 6-6 6" /></svg>
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

        <JourneyTimeline currentIndex={d.currentStageIndex} />

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
    </div>
  );
}
