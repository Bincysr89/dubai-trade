import React, { useState } from 'react';
import type { ClaimType } from './ClaimTypeSelectionPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Tab = 'information' | 'tutorials' | 'faqs' | 'updates' | 'downloads';

const HELP_TABS: { id: Tab; label: string }[] = [
  { id: 'information', label: 'Information' },
  { id: 'tutorials',   label: 'Tutorials' },
  { id: 'faqs',        label: "Common FAQ's" },
  { id: 'updates',     label: 'Updates' },
  { id: 'downloads',   label: 'Downloads' },
];

const SERVICE_STEPS = [
  { num: '1', title: 'Select Claim Type & Declarations', desc: 'Choose the claim type (Refund of Deposits, Refund of Duty, or Non Remittance) and select the eligible declarations.' },
  { num: '2', title: 'Upload Supporting Documents',       desc: 'Add remarks and upload supporting documents for each selected declaration.' },
  { num: '3', title: 'Payment & Submit',                  desc: 'Review charge details, select payment mode, and submit your claim for processing.' },
];

const CLAIM_OPTIONS: { id: ClaimType; title: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'refundDeposit',
    title: 'Refund of Deposits',
    sub: 'Duty deposit, Missing document deposit, Exemption deposits — any deposit labeled by Dubai Customs.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="9" width="22" height="15" rx="2" />
        <circle cx="16" cy="16.5" r="3.5" />
        <path d="M9 13h.01M23 20h.01" />
      </svg>
    ),
  },
  {
    id: 'refundDuty',
    title: 'Refund of Duty',
    sub: 'Cancelled or amended declarations and duty-exempted goods.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5h13l5 5v17H8z" />
        <path d="M21 5v5h5" />
        <path d="M13 16h6M13 20h6M13 12h3" />
      </svg>
    ),
  },
  {
    id: 'nonRemittance',
    title: 'Non Remittance',
    sub: 'Applicable for Free Zone exports without any deposit.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M11 16h10M16 11v10" />
      </svg>
    ),
  },
];

type Props = { onBack: () => void; onContinue: (claimType: ClaimType) => void };

export default function ClaimTypeEntryPage({ onBack, onContinue }: Props) {
  const [selected, setSelected] = useState<ClaimType | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('information');

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[24px]">
        <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim</h1>

        {/* Claim Type Selection */}
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[18px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Claim Type</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
            {CLAIM_OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className="flex items-start gap-[14px] px-[16px] py-[16px] rounded-[10px] text-left transition-colors h-full"
                  style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
                >
                  <div className="size-[48px] rounded-[8px] inline-flex items-center justify-center flex-shrink-0" style={{ background: active ? '#e8f0ff' : '#f4f7fc' }}>
                    {opt.icon}
                  </div>
                  <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                    <div className="flex items-center justify-between gap-[10px]">
                      <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                      <span className="size-[20px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                        {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Help & Guides */}
        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {/* Tab bar */}
          <div className="flex items-center border-b border-[#eef1f6] px-[24px] gap-[4px] overflow-x-auto">
            {HELP_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-[8px] px-[16px] py-[16px] text-[16px] whitespace-nowrap transition-colors flex-shrink-0"
                  style={{
                    color: active ? '#1360d2' : '#697498',
                    borderBottom: active ? '2.5px solid #1360d2' : '2.5px solid transparent',
                    fontWeight: active ? 600 : 400,
                    background: 'none',
                    fontFamily: font,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="px-[24px] py-[24px]">
            {activeTab === 'information' && (
              <div className="flex flex-col gap-[24px]">
                {/* How it works */}
                <div>
                  <p className="text-[18px] text-[#0e1b3d] mb-[20px]" style={{ fontWeight: 500 }}>How It Works</p>
                  <div className="flex flex-col md:flex-row gap-[0px]">
                    {SERVICE_STEPS.map((step, idx) => (
                      <div key={step.num} className="flex md:flex-col items-start md:items-center gap-[12px] md:gap-[12px] flex-1">
                        <div className="flex md:flex-col items-center gap-[12px] flex-1 w-full">
                          <div className="flex flex-col md:flex-row items-center gap-[0px] flex-1 w-full">
                            <div className="size-[48px] rounded-full inline-flex items-center justify-center flex-shrink-0 text-[18px] text-white" style={{ background: '#1360d2', fontWeight: 700 }}>
                              {step.num}
                            </div>
                            {idx < SERVICE_STEPS.length - 1 && (
                              <div className="hidden md:block h-[2px] flex-1" style={{ background: '#d5ddfb' }} />
                            )}
                          </div>
                          <div className="flex flex-col gap-[6px] md:text-center px-[8px]">
                            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{step.title}</p>
                            <p className="text-[14px] text-[#697498]" style={{ lineHeight: 1.5 }}>{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                  {[
                    { title: 'Service Details', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round"/></svg>, text: 'Submit claims for refund of deposits, duty, or non-remittance for eligible Free Zone export declarations.' },
                    { title: 'Service Fee',     icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 14h.01" strokeLinecap="round"/></svg>, text: 'Claim Registration Charge: AED 50.00 | Knowledge-Innovation Dirham: AED 20.00 | Total: AED 70.00' },
                    { title: 'Required Documents', icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" strokeLinecap="round"/><path d="M14 2v6h6M9 13h6M9 17h4" strokeLinecap="round"/></svg>, text: 'Supporting documents in PDF or TXT format, max 2 MB per file. One attachment per declaration.' },
                  ].map((card) => (
                    <div key={card.title} className="rounded-[8px] p-[16px] flex flex-col gap-[10px]" style={{ border: '1px solid #e0e6ef', background: '#f8fafd' }}>
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[40px] rounded-[8px] inline-flex items-center justify-center flex-shrink-0" style={{ background: '#e8f0ff' }}>{card.icon}</div>
                        <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{card.title}</p>
                      </div>
                      <p className="text-[14px] text-[#697498]" style={{ lineHeight: 1.55 }}>{card.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab !== 'information' && (
              <div className="flex flex-col items-center py-[48px] gap-[12px]">
                <div className="size-[60px] rounded-full inline-flex items-center justify-center" style={{ background: '#f4f7fc' }}>
                  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#a7c3eb" strokeWidth="1.6"><rect x="4" y="8" width="24" height="16" rx="2"/><path d="M10 12h12M10 16h8" strokeLinecap="round"/></svg>
                </div>
                <p className="text-[16px] text-[#697498]">No content available for this section yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back
        </button>
        <button
          disabled={!selected}
          onClick={() => { if (selected) onContinue(selected); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
          style={{
            background: selected ? '#1360d2' : '#a7c3eb',
            cursor: selected ? 'pointer' : 'not-allowed',
            fontFamily: font,
            fontWeight: 500,
            boxShadow: selected ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
