import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import ServiceCatalogueModal from '../components/ServiceCatalogueModal';
import IntegratedClearanceModal from '../components/IntegratedClearanceModal';
import DeclarationListPage from '../components/DeclarationListPage';
import DdoFlow from '../components/ddo/DdoFlow';
import DdoRecordsPage, { type DdoRecordStatus } from '../components/ddo/DdoRecordsPage';
import {
  TradePlusIcon,
  IntegratedClearanceIcon,
  PaymentsIcon,
  BerthBookingIcon,
  EdiIcon,
  ManifestIcon,
  BookingExecutionIcon,
  TraderIcon,
  ShippingAgentIcon,
  AirlineAgentIcon,
  OtherAgentIcon,
} from '../components/AgentIcons';
import bannerSrc from '../assets/banner.png';
import seaIconSrc from '../assets/icon-sea.svg';
import airIconSrc from '../assets/icon-air.svg';
import eclipseSrc from '../assets/Ellipse 3244.png';
import bgSrc from '../assets/background.jpg';

type Agent = 'trader' | 'shipping-agent' | 'airline-agent' | 'other-agent';

type JourneyCard = {
  step: number;
  title: string;
  icon: React.ReactNode;
};

const FAVOURITE_SERVICES = [
  'Trade +',
  'Integrated Clearance',
  'Montaji+',
  'Cargo Waves',
  'DP World Payments',
  'dnata',
  'Emirates',
  'Correct Discharge List',
];

const ICON = 40;

const JOURNEYS: Record<Agent, { title: string; cards: JourneyCard[]; airOnly?: boolean }> = {
  trader: {
    title: 'Proposed Profile Journey - Trader',
    cards: [
      { step: 1, title: 'Trade +', icon: <TradePlusIcon size={ICON} /> },
      { step: 2, title: 'Integrated Clearance', icon: <IntegratedClearanceIcon size={ICON} /> },
      { step: 3, title: 'Payments', icon: <PaymentsIcon size={ICON} /> },
      { step: 4, title: 'Cargo Waves', icon: <ManifestIcon size={ICON} /> },
    ],
  },
  'shipping-agent': {
    title: 'Proposed Profile Journey - Shipping Agent',
    cards: [
      { step: 1, title: 'Berth Booking', icon: <BerthBookingIcon size={ICON} /> },
      { step: 2, title: 'EDI Management', icon: <EdiIcon size={ICON} /> },
      { step: 3, title: 'Manifest', icon: <ManifestIcon size={ICON} /> },
      { step: 4, title: 'Trade+', icon: <TradePlusIcon size={ICON} /> },
    ],
  },
  'airline-agent': {
    title: 'Proposed Profile Journey - Airline Agent',
    airOnly: true,
    cards: [
      { step: 1, title: 'Booking & Execution', icon: <BookingExecutionIcon size={ICON} /> },
      { step: 2, title: 'Integrated Clearance', icon: <IntegratedClearanceIcon size={ICON} /> },
    ],
  },
  'other-agent': {
    title: 'Proposed Profile Journey - Other Agent',
    cards: [
      { step: 1, title: 'Trade +', icon: <TradePlusIcon size={ICON} /> },
      { step: 2, title: 'Integrated Clearance', icon: <IntegratedClearanceIcon size={ICON} /> },
      { step: 3, title: 'Payments', icon: <PaymentsIcon size={ICON} /> },
      { step: 4, title: 'Cargo Waves', icon: <ManifestIcon size={ICON} /> },
    ],
  },
};

const LABELS: Record<Agent, string> = {
  trader: 'Trader',
  'shipping-agent': 'Shipping Agent',
  'airline-agent': 'Airline Agent',
  'other-agent': 'Other Agent',
};

const AGENT_TYPE_OPTIONS: { id: Agent; label: string; icon: React.ReactNode; route: string }[] = [
  { id: 'trader', label: 'Trader', icon: <TraderIcon size={72} />, route: '/landing/trader' },
  { id: 'shipping-agent', label: 'Shipping Agent', icon: <ShippingAgentIcon size={72} />, route: '/landing/shipping-agent' },
  { id: 'airline-agent', label: 'Airline Agent', icon: <AirlineAgentIcon size={72} />, route: '/landing/airline-agent' },
  { id: 'other-agent', label: 'Other Agent Type', icon: <OtherAgentIcon size={72} />, route: '/other-agent-type' },
];

export default function LandingPage() {
  const params = useParams<{ agent: Agent }>();
  const navigate = useNavigate();
  const agent = (params.agent ?? 'trader') as Agent;
  const config = JOURNEYS[agent] ?? JOURNEYS.trader;
  const [mode, setMode] = useState<'sea' | 'air'>(config.airOnly ? 'air' : 'sea');
  const [tradeMode, setTradeMode] = useState<'import' | 'export'>('import');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showServiceCatalogue, setShowServiceCatalogue] = useState(false);
  const [showIntegratedClearance, setShowIntegratedClearance] = useState(false);
  const [showDeclarationList, setShowDeclarationList] = useState(false);
  const [showDdoFlow, setShowDdoFlow] = useState(false);
  const [showDdoRecords, setShowDdoRecords] = useState(false);
  const [ddoRecordStatus, setDdoRecordStatus] = useState<DdoRecordStatus>('nearing-expiry');

  const openDdoRecords = (status: DdoRecordStatus) => {
    setDdoRecordStatus(status);
    setShowDdoRecords(true);
  };

  // Air tab always shows airline agent journey cards
  const activeCards = mode === 'air' ? JOURNEYS['airline-agent'].cards : config.cards;
  const isAirMode = mode === 'air';

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Header onServiceCatalogue={() => setShowServiceCatalogue(true)} />

      <div className="w-full px-4 sm:px-8 lg:px-[60px] pt-10">
        <div className="flex flex-col sm:flex-row gap-[30px] mb-10 items-stretch">
          {/* Profile card */}
          <div className="bg-white border border-[#ddd] rounded w-full sm:w-[305px] relative overflow-hidden flex flex-col">
            {/* Eclipse dome image */}
            <img src={eclipseSrc} alt="" className="absolute top-0 left-0 w-full object-cover object-top pointer-events-none" />
            {/* JS circle — center aligned with eclipse bottom edge */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[30px] bg-white border-[5px] border-[#f8fafd] rounded-full size-[80px] flex items-center justify-center shadow-md z-10">
              <span className="text-[#0e1b3d] font-bold text-[26px]">JS</span>
            </div>
            <div className="relative flex flex-col items-center px-6 gap-3 flex-1 pb-5" style={{ paddingTop: 'calc(30px + 80px + 14px)' }}>
              <div className="text-center">
                <p className="text-[#697498] text-[12px] font-medium">Welcome to Dubai Trade</p>
                <p className="text-[#0e1b3d] text-[16px] font-medium">Rashed</p>
              </div>
              <button
                onClick={() => setShowAgentModal(true)}
                className="border border-[#8a9099] rounded h-[36px] w-full text-[#0e1b3d] text-[18px] font-medium capitalize hover:border-[#1360d2] hover:text-[#1360d2] transition-colors"
              >
                {LABELS[agent]}
              </button>
              <button className="bg-[#1360d2] text-white h-[35px] w-full rounded flex items-center justify-center gap-1 font-medium text-[16px] capitalize">
                <svg viewBox="0 0 14 14" className="size-[14px]" fill="currentColor"><rect x="1" y="1" width="5" height="5" /><rect x="8" y="1" width="5" height="5" /><rect x="1" y="8" width="5" height="5" /><rect x="8" y="8" width="5" height="5" /></svg>
                My Dashboard
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="flex-1 rounded overflow-hidden relative">
            <img src={bannerSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-[30px] items-start pb-12">
          {/* Favourite services */}
          <div className="w-full sm:w-[305px] flex flex-col gap-6">
            <div>
              <h3 className="text-[#051937] text-[24px] font-medium">Favourite Services</h3>
              <div className="w-[32px] h-[3px] bg-[#ea2428] mt-1" />
            </div>
            <div className="bg-white border border-[#ddd] rounded p-2 flex flex-col gap-2 max-h-[414px] overflow-y-auto">
              {FAVOURITE_SERVICES.map((s, i) => (
                <button
                  key={s}
                  className={`flex items-center gap-2 px-2 py-3 rounded text-[16px] text-[#060c28] text-left ${
                    i === 0 ? 'bg-[rgba(17,24,56,0.07)] rounded-lg' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-[24px] flex-shrink-0" fill="#f5b400">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.6 2.4 7.4L12 16.8l-6.2 4.6 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span className="flex-1">{s}</span>
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <button className="bg-[rgba(14,27,61,0.8)] text-white h-[35px] rounded font-medium text-[16px] capitalize">
              Load More
            </button>

            {/* DDO Trade+ Widget */}
            <div className="bg-white border border-[#ddd] rounded p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[#051937] text-[16px] font-medium">Trade +</span>
                <button
                  onClick={() => setShowDdoFlow(true)}
                  className="flex items-center gap-1 text-[#1360d2] text-[16px] font-semibold hover:opacity-70 transition-opacity"
                >
                  REQUEST DDO
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {([
                  { status: 'nearing-expiry' as DdoRecordStatus, count: 5,  label: 'Nearing Expiry', color: '#d67e74' },
                  { status: 'submitted'      as DdoRecordStatus, count: 12, label: 'Submitted',      color: '#6a7bc7' },
                  { status: 'pending'        as DdoRecordStatus, count: 3,  label: 'Pending',        color: '#d3ab40' },
                  { status: 'completed'      as DdoRecordStatus, count: 5,  label: 'Completed',      color: '#5cb78f' },
                ]).map(item => (
                  <button
                    key={item.status}
                    onClick={() => openDdoRecords(item.status)}
                    className="bg-white border border-[#eee] rounded-[10px] flex flex-col items-center gap-1 py-3 px-1 hover:border-[#1360d2] hover:shadow-sm transition-all"
                  >
                    <span className="text-[#27314b] font-bold text-[18px] leading-none">{item.count}</span>
                    <span className="font-semibold text-[9px] text-center leading-tight" style={{ color: item.color }}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Journey */}
          <div className="flex-1">
            <h3 className="text-[#051937] text-[24px] font-medium mb-2">{config.title}</h3>
            <div className="w-[40px] h-[3px] bg-[#ea2428] mb-6" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-12">
                <button
                  onClick={() => !config.airOnly && setMode('sea')}
                  disabled={config.airOnly}
                  className={`flex items-center gap-2 text-[#051937] text-[20px] ${mode === 'sea' ? '' : 'opacity-40'}`}
                >
                  <img src={seaIconSrc} alt="" className="w-[28px] h-[28px]" />
                  Sea
                </button>
                <button
                  onClick={() => setMode('air')}
                  className={`flex items-center gap-2 text-[#051937] text-[20px] ${mode === 'air' ? '' : 'opacity-40'}`}
                >
                  <img src={airIconSrc} alt="" className="w-[28px] h-[28px]" />
                  Air
                </button>
              </div>

              {isAirMode ? (
                <div className="bg-[#0e1b3d] text-white rounded h-[40px] w-[78px] flex items-center justify-center text-[16px]">
                  Export
                </div>
              ) : (
                <div className="bg-white border border-[#ddd] rounded flex w-[153px] h-[40px] p-[3px]">
                  <button
                    onClick={() => setTradeMode('import')}
                    className={`flex-1 rounded text-[16px] ${
                      tradeMode === 'import' ? 'bg-[#0e1b3d] text-white' : 'text-[#0e1b3d]'
                    }`}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setTradeMode('export')}
                    className={`flex-1 rounded text-[16px] ${
                      tradeMode === 'export' ? 'bg-[#0e1b3d] text-white' : 'text-[#0e1b3d]'
                    }`}
                  >
                    Export
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-[#ddd] mb-8" />

            {/* Journey cards */}
            <div className="relative flex flex-wrap sm:flex-nowrap justify-between items-start w-full gap-4 sm:gap-0">
              {/* Dashed line: from centre of first circle to centre of last circle */}
              {activeCards.length > 1 && (
                <div className="absolute top-[27px] left-[100px] right-[100px] z-0 pointer-events-none hidden sm:block" style={{ height: '1.5px', backgroundImage: 'repeating-linear-gradient(to right, #0e1b3d 0px, #0e1b3d 10px, transparent 10px, transparent 20px)' }} />
              )}

              {activeCards.map((card, idx) => (
                <div
                  key={card.step}
                  className="group flex flex-col items-center w-full sm:w-[200px] cursor-pointer"
                  onClick={() => card.title === 'Integrated Clearance' && setShowIntegratedClearance(true)}
                >

                  {/* Step circle — z-20 so it stays above the rising card */}
                  <div className="relative z-20 size-[55px] rounded-full border-2 flex items-center justify-center font-medium text-[20px] flex-shrink-0 select-none transition-all duration-300
                    bg-white text-[#0e1b3d] border-[#ddd]
                    group-hover:bg-[#3e4964] group-hover:text-white group-hover:border-[#3e4964]">
                    {card.step}
                  </div>

                  {/* Fixed 12px gap */}
                  <div className="h-3 flex-shrink-0" />

                  {/* Card — rises upward on hover */}
                  <div className="relative w-full z-10 rounded-[4px] overflow-hidden transition-all duration-300 ease-in-out
                    h-[160px] bg-white border border-[#ddd]
                    group-hover:-translate-y-[85px] group-hover:h-[265px]
                    group-hover:bg-white group-hover:border-[rgba(234,36,40,0.6)]
                    group-hover:shadow-[0_8px_32px_-4px_rgba(14,27,61,0.15)]">

                    {/* Content — padding-top grows on hover to sit below the enclosed circle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-start transition-all duration-300
                      pt-[30px] group-hover:pt-[95px]">
                      <div className="mb-4">{card.icon}</div>
                      <p className="font-medium text-[16px] group-hover:text-[18px] text-[#0e1b3d] text-center px-3 leading-tight transition-all duration-300">{card.title}</p>
                      <div className="w-[28px] h-[2px] mt-2 transition-colors duration-300 bg-[#0e1b3d] group-hover:bg-[#ea2428]" />
                    </div>

                    {/* Red bottom arc — SVG smile curve */}
                    <svg
                      className="absolute bottom-0 left-0 w-full pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      height="36"
                      viewBox="0 0 200 36"
                      preserveAspectRatio="none"
                    >
                      <path d="M 0 0 Q 100 36 200 0" fill="none" stroke="rgba(234,36,40,0.65)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDdoFlow && <DdoFlow onClose={() => setShowDdoFlow(false)} />}
      {showDdoRecords && (
        <DdoRecordsPage status={ddoRecordStatus} onClose={() => setShowDdoRecords(false)} />
      )}

      {showServiceCatalogue && <ServiceCatalogueModal onClose={() => setShowServiceCatalogue(false)} />}

      {showDeclarationList && (
        <DeclarationListPage
          onClose={() => setShowDeclarationList(false)}
          onServiceCatalogue={() => { setShowDeclarationList(false); setShowServiceCatalogue(true); }}
        />
      )}

      {showIntegratedClearance && !showDeclarationList && (
        <IntegratedClearanceModal
          onClose={() => setShowIntegratedClearance(false)}
          onCargoClearance={() => { setShowIntegratedClearance(false); setShowDeclarationList(true); }}
        />
      )}

      {/* Agent type selection modal */}
      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAgentModal(false)}>
          <div className="bg-white w-full max-w-[1100px] rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0e1b3d] px-6 py-5 flex items-center justify-between">
              <h2 className="text-[#f8fafd] font-medium text-[20px]">Customer Type</h2>
              <button onClick={() => setShowAgentModal(false)} className="text-white text-[24px] hover:opacity-80">✕</button>
            </div>
            <div className="px-20 pt-12 pb-[150px]">
              <h3 className="text-[#0e1b3d] text-[24px] font-normal text-center mb-12">
                Hi User, Select Your Customer Type to Access the Services
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
                {AGENT_TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setShowAgentModal(false); navigate(opt.route); }}
                    className={`relative bg-white rounded-[12px] w-full max-w-[230px] h-[220px] flex flex-col items-start justify-between overflow-hidden transition-all
                      ${agent === opt.id
                        ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]'
                        : 'border-2 border-[#ddd] hover:border-[#1360d2] hover:shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]'}`}
                  >
                    <div className="absolute top-0 right-0 w-[90px] h-[90px] overflow-hidden pointer-events-none">
                      <div className="absolute -top-[45px] -right-[45px] w-[90px] h-[90px] rounded-full border-2 border-[#ea2428]" />
                    </div>
                    <div className="flex-1 flex items-center justify-center w-full pt-[20px]">{opt.icon}</div>
                    <div className="w-full bg-[#f9f9f9] flex items-center justify-center p-[10px] text-[#0e1b3d] font-medium text-[18px] leading-[20px] text-center capitalize">
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
