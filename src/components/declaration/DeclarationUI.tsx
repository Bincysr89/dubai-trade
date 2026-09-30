import React from 'react';

export const editSrc = new URL('../../assets/declaration/fi-edit.svg', import.meta.url).href;
export const searchSrc = new URL('../../assets/declaration/search-24px.svg', import.meta.url).href;
export const chevronSrc = new URL('../../assets/declaration/keyboard-arrow-down.svg', import.meta.url).href;
export const helpSrc = new URL('../../assets/declaration/help-outline.svg', import.meta.url).href;
export const todaySrc = new URL('../../assets/declaration/today-24px.svg', import.meta.url).href;
const stepDoneSrc = new URL('../../assets/declaration/step-check.svg', import.meta.url).href;
const stepTodoSrc = new URL('../../assets/declaration/step-inactive.svg', import.meta.url).href;

export const font = "'Dubai', sans-serif";

export const JOURNEY_STEPS = [
  'General Information',
  'Shipment Details',
  'Invoice Details',
  'Document Upload',
  'Payment Details',
];

/**
 * Journey stepper. Steps up to and including `active` are green checks; the trail leaving
 * the active step is blue (the step being worked on next), earlier trails green, later grey.
 */
export function JourneyStepper({ active }: { active: number }) {
  return (
    <div className="bg-white rounded-[8px] px-[20px] py-[20px] overflow-x-auto" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-center gap-[8px]" style={{ minWidth: 'max-content' }}>
        {JOURNEY_STEPS.map((label, i) => {
          const done = i <= active;
          return (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className="flex-shrink-0 flex items-center" style={{ width: 88, height: 32 }}>
                  <div style={{ width: '100%', height: 2, background: i <= active ? '#28a745' : i === active + 1 ? '#0162dd' : '#a1aebe' }} />
                </div>
              )}
              <div className="flex items-start gap-[4px] py-[4px] flex-shrink-0">
                <img src={done ? stepDoneSrc : stepTodoSrc} alt="" width={24} height={24} className="flex-shrink-0" />
                <span
                  className="text-[14px] text-center whitespace-nowrap"
                  style={{ color: done ? '#219653' : '#697498', fontWeight: done ? 700 : 500 }}
                >
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <span
      className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
      style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}
    >
      {required && <span style={{ color: '#dc3545' }}>*</span>}
      {text}
    </span>
  );
}

export type Trailing = 'chevron' | 'search' | 'edit' | 'today' | null;

export type FieldProps = {
  value: string;
  label?: string;
  labelRequired?: boolean;
  valueRequired?: boolean;
  disabled?: boolean;
  trailing?: Trailing;
  onTrailingClick?: () => void;
  trailingLabel?: string;
  /** Blue read-back chips rendered beneath the field. */
  chips?: string[];
  /** Trailing unit selector, e.g. the KG dropdown on the weight fields. */
  unit?: string;
  className?: string;
};

export function Field({
  value, label, labelRequired, valueRequired, disabled, trailing = null,
  onTrailingClick, trailingLabel, chips, unit, className = '',
}: FieldProps) {
  const icon = trailing === 'chevron' ? chevronSrc
    : trailing === 'search' ? searchSrc
    : trailing === 'edit' ? editSrc
    : trailing === 'today' ? todaySrc
    : null;
  const iconSize = trailing === 'edit' ? 20 : 24;
  return (
    <div className={`flex flex-col gap-[5px] ${className}`} style={{ fontFamily: font }}>
      <div className="relative">
        <div
          className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] overflow-hidden"
          style={{ background: disabled ? '#f4f4f4' : '#ffffff' }}
        >
          <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate pl-[16px]" style={{ lineHeight: '24px' }}>
            {valueRequired && <span style={{ color: '#dc3545' }}>*</span>}
            {value}
          </span>
          {unit && (
            <span
              className="flex items-center gap-[8px] flex-shrink-0 h-full px-[8px]"
              style={{ borderLeft: '1px solid #d5ddfb' }}
            >
              <span className="text-[16px] text-[#0e1b3d]">{unit}</span>
              <img src={chevronSrc} alt="" width={24} height={24} />
            </span>
          )}
          {icon && !unit && (
            onTrailingClick ? (
              <button
                type="button"
                onClick={onTrailingClick}
                aria-label={trailingLabel}
                className="flex-shrink-0 inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors mr-[8px]"
                style={{ width: 40, height: 40 }}
              >
                <img src={icon} alt="" width={iconSize} height={iconSize} />
              </button>
            ) : (
              <img src={icon} alt="" width={iconSize} height={iconSize} className="flex-shrink-0 mr-[16px]" />
            )
          )}
        </div>
        {label && <FieldLabel text={label} required={labelRequired} />}
      </div>
      {chips?.map((c) => (
        <div key={c} className="flex items-center px-[16px] py-[5px]" style={{ background: '#e8ecff' }}>
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, lineHeight: '16px' }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

export function Readout({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]" style={{ fontFamily: font }}>
      <span className="text-[14px] text-[#697498]">{label}</span>
      {value && <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{value}</span>}
      {children}
    </div>
  );
}

export function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[8px] px-[20px] py-[32px] ${className}`} style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500, fontFamily: font }}>{children}</p>;
}

/** Party Information read-back — repeated verbatim across the declaration steps. */
export function PartyInformation() {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Party Information</SectionTitle>
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-wrap gap-[20px] items-stretch">
          <SectionCard>
            <div className="flex items-center h-full" style={{ minWidth: 240 }}>
              <Readout label="Exporter Name" value="Shaheer" />
            </div>
          </SectionCard>
          <SectionCard>
            <div className="flex flex-wrap gap-x-[48px] gap-y-[20px] items-start">
              <Readout label="Importer Name" value="Shaheer" />
              <Readout label="Importer License Expires on" value="13-03-2024">
                <div className="rounded-[4px] px-[12px] py-[10px] max-w-[320px]" style={{ background: '#fdecee' }}>
                  <p className="text-[14px]" style={{ color: '#dc3545', lineHeight: 1.45 }}>
                    (Business Registration Code is Expired. Declaration submission will not be allowed
                    after the grace period of 60 days from expiry date)
                  </p>
                </div>
              </Readout>
              <Readout label="VAT TRN" value="V1425625265" />
            </div>
          </SectionCard>
        </div>
        <div className="flex flex-wrap gap-[20px] items-stretch">
          <SectionCard>
            <div className="flex flex-wrap gap-x-[48px] gap-y-[20px] items-start">
              <Readout label="Broker Name" value="SWBR001 M&M Private L.L.C" />
              <Readout label="Broker License Expires on" value="13-03-2024" />
            </div>
          </SectionCard>
          <SectionCard><Readout label="Notify Party Name" value="SINOTRAN S Middle East FZ" /></SectionCard>
          <SectionCard><Readout label="Cargo Handler Name" value="DPW" /></SectionCard>
          <SectionCard><Readout label="Agent Name" value="Maersk Shipping" /></SectionCard>
        </div>
      </div>
    </div>
  );
}

/** Pill tab row used by the Shipment Details step. */
export function TabBar<T extends string>({ tabs, active, onChange }: { tabs: readonly T[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className="bg-white rounded-[6px] inline-flex items-center gap-[12px] p-[4px]" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)', fontFamily: font }}>
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`h-[40px] px-[16px] rounded-[4px] text-[16px] transition-colors ${
            t === active ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
          }`}
          style={{ fontWeight: 500 }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
