import { useState } from 'react';
import Header from './Header';
// @ts-ignore
import shipIconSrc from '../assets/Ship (12).svg';
import catalogueBg from '../assets/catalogue background.jpg';

type Props = { onClose: () => void };

const SEA_COLUMNS: { title: string; items: string[] }[] = [
  {
    title: 'Carrier Management',
    items: [
      'Berth Booking', 'Tanker Berth Booking', 'Rotation Enquiry',
      'Shipping Service Schedule', 'Vessel Line Change',
      'Vessel Registration Request', 'Water Reading',
    ],
  },
  {
    title: 'Cargo Management',
    items: [
      'Bill of Lading', 'Container Request', 'DDO', 'Discharge /Load List',
      'DNOC', 'Export Manifest', 'Manage DDO/DNOC', 'Manifest',
      'NOC Linking', 'Trade +', 'Voyage', 'Voyage NOC',
      'CT Miscellaneous Services', 'Agent Event Notification',
      'Container Cleaning', 'Container Enquiry', 'Container Hold/Release',
      'Container Line Change', 'Delivery Order', 'Dit Hub Container',
      'EDI Management', 'Empty / Load Containers', 'Gang Crane',
      'GC Cargo Nomination', 'GC E-payment', 'GC Gate Advice',
      'GC Load List', 'GC Miscellaneous Services', 'GC Rollover',
      'GC Services', 'GC Transshipment', 'GC Vehicle List',
      'Haulier Nomination', 'HUB Services', 'Manifest Services',
      'MECRC Services', 'OTO Services', 'Purchase Order', 'Sea Air Cargo',
      'Standing Instruction', 'Stowage plan', 'Stuffing Tally Sheet',
      'VOR Report', 'Voyage Management', 'DMA',
    ],
  },
  {
    title: 'Gate Management',
    items: [
      'Cargo Waves', 'E-Gate Pass', 'EGP Services', 'LGP Services',
      'Other Emirates Bill', 'Request', 'Token Services',
      'Truck Registration', 'VGM Certificate', 'Visitor Gate Pass - PCFC',
    ],
  },
  {
    title: 'Cargo Clearance',
    items: [
      'Integrated Clearance', 'DC - landing Certificate', 'DC - Letter & Certificates', 'DM Permits',
      'DP World Work Permits', 'e-Certificates', 'IMDG NOC Management',
      'Marine NOC', 'Master Declaration', 'DC - Cargo Reconcilation',
      'DC - Cargo Tracking', 'DC - Export Manifest', 'DC - Inspection Services',
      'DC - Smart Workspace', 'Declaration Services', 'Digital Certificate',
      'Cargo Transfer Services', 'M1- Bill Clearance', 'VCC Services',
    ],
  },
  {
    title: 'Payments',
    items: [
      'Advance Deposit', 'Claim Services', 'Centralized Payments',
      'DC - Account Services', 'DP World Payments', 'e-Payment',
      'Invoice Payment', 'Prepaid Card', 'Refund Services',
      'Deposit Refund', 'TLUC Payment',
    ],
  },
  {
    title: 'Registration',
    items: [
      'AEO Program', 'Client Accreditation', 'DC - Manage Services',
      'Case Registration', 'Register shipping line', 'Shipping Line Master',
    ],
  },
  {
    title: 'Reports',
    items: [
      'Container Reports', 'Declaration Statement',
      'Discharge Load Operations', 'M1- Bill Clearance', 'Vessel reports',
    ],
  },
];

export default function SeaDetailModal({ onClose }: Props) {
  const [search, setSearch] = useState('');

  const filtered = SEA_COLUMNS.map(col => ({
    ...col,
    items: search
      ? col.items.filter(i => i.toLowerCase().includes(search.toLowerCase()))
      : col.items,
  })).filter(col => !search || col.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Full-page catalogue background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${catalogueBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Navigation header */}
      <div className="relative z-10 flex-shrink-0">
        <Header onServiceCatalogue={onClose} />
      </div>

      {/* Close button — top right below header */}
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[96px] z-20 size-[36px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-[24px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Spacer above the SEA section */}
      <div className="relative z-10 flex-shrink-0 h-[60px]" />

      {/* Sub-nav + title area */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative flex items-center justify-center px-10 py-5">
          {/* Left: AIR navigation */}
          <a className="absolute left-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Air
            </span>
          </a>

          {/* Center: icon + SEA + subtitle */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#0e1b3d] border border-white flex items-center justify-center flex-shrink-0 rounded-[10px]"
                style={{ width: 40, height: 40, padding: 4 }}
              >
                <img src={shipIconSrc} alt="Sea" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
              </div>
              <span
                className="text-[#0a1852] text-[24px] uppercase font-bold"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Sea
              </span>
            </div>
            <p
              className="text-[#060c28] text-[20px] text-center mt-1"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, letterSpacing: '0.2px' }}
            >
              Explore extensive services offered for all of modes.
            </p>
          </div>

          {/* Right: FREEZONES navigation */}
          <a className="absolute right-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Freezones
            </span>
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Search bar */}
        <div className="flex justify-center pb-5">
          <div className="relative w-full sm:w-[440px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Services"
              className="w-full h-[48px] border border-[#d0d5e8] rounded-[8px] pl-4 pr-12 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-white focus:outline-none focus:border-[#0e1b3d]"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute right-4 top-1/2 -translate-y-1/2 size-[20px] text-[#8f94ae]"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {/* Service columns — whole card scrolls */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-10 lg:px-[60px] pt-6 pb-6">
        {/* Gradient border wrapper */}
        <div
          className="rounded-[14px] p-[3px]"
          style={{
            background: 'linear-gradient(135deg, rgba(19,96,210,1) 0%, rgba(255,255,255,1) 50%, rgba(232,44,42,1) 100%)',
          }}
        >
          <div
            className="bg-white rounded-[12px] overflow-x-auto"
            style={{ boxShadow: '0 4px 15.5px rgba(0,0,0,0.08)' }}
          >
            <div className="flex divide-x divide-[#e8eaf0] w-full">
              {filtered.map(col => (
                <div key={col.title} className="flex-1 flex flex-col px-3 pt-6 pb-4">
                  {/* Column header */}
                  <div className="mb-5">
                    <p
                      className="text-[#0e1b3d] text-[16px] font-medium leading-6 whitespace-nowrap"
                      style={{ fontFamily: "'Dubai', sans-serif", letterSpacing: '0.18px' }}
                    >
                      {col.title}
                    </p>
                    <div className="w-6 h-[2px] bg-[#e8212e] mt-1" />
                  </div>
                  {/* Items — blue only on hover, no individual scroll */}
                  <div className="flex flex-col gap-[8px]">
                    {col.items.map(item => (
                      <button
                        key={item}
                        className="text-left h-[40px] px-[10px] rounded-[4px] text-[16px] text-[#0e1b3d] bg-[#f7faff] hover:bg-[#d6e6ff] transition-colors"
                        style={{
                          fontFamily: "'Dubai', sans-serif",
                          letterSpacing: '0.14px',
                          lineHeight: '24px',
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
