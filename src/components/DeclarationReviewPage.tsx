import React from 'react';

const editSrc = new URL('../assets/declaration/fi-edit.svg', import.meta.url).href;
const searchSrc = new URL('../assets/declaration/search-24px.svg', import.meta.url).href;
const chevronSrc = new URL('../assets/declaration/keyboard-arrow-down.svg', import.meta.url).href;
const helpSrc = new URL('../assets/declaration/help-outline.svg', import.meta.url).href;
const stepDoneSrc = new URL('../assets/declaration/step-check.svg', import.meta.url).href;
const stepTodoSrc = new URL('../assets/declaration/step-inactive.svg', import.meta.url).href;

const font = "'Dubai', sans-serif";

const JOURNEY_STEPS = [
  'General Information',
  'Shipment Details',
  'Invoice Details',
  'Document Upload',
  'Payment Details',
];

/** Floating label sitting on the field border, with the design's red required marker. */
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <span
      className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
      style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}
    >
      {required && <span style={{ color: '#ea2428' }}>*</span>}
      {text}
    </span>
  );
}

type FieldProps = {
  /** Shown inside the field — these are read-back values on the review screen. */
  value: string;
  label?: string;
  labelRequired?: boolean;
  /** Required marker rendered inline with the value, as in the Person/Parties fields. */
  valueRequired?: boolean;
  disabled?: boolean;
  trailing?: 'chevron' | 'search' | 'edit' | null;
  onTrailingClick?: () => void;
  trailingLabel?: string;
  /** Blue read-back chip under the field (resolved party name). */
  chips?: string[];
  className?: string;
};

function Field({
  value, label, labelRequired, valueRequired, disabled, trailing = null,
  onTrailingClick, trailingLabel, chips, className = '',
}: FieldProps) {
  const icon = trailing === 'chevron' ? chevronSrc : trailing === 'search' ? searchSrc : trailing === 'edit' ? editSrc : null;
  const iconSize = trailing === 'edit' ? 20 : 24;
  return (
    <div className={`flex flex-col gap-[5px] ${className}`} style={{ fontFamily: font }}>
      <div className="relative">
        <div
          className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] px-[16px]"
          style={{ background: disabled ? '#f4f4f4' : '#ffffff' }}
        >
          <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate" style={{ lineHeight: '24px' }}>
            {valueRequired && <span style={{ color: '#dc3545' }}>*</span>}
            {value}
          </span>
          {icon && (
            onTrailingClick ? (
              <button
                type="button"
                onClick={onTrailingClick}
                aria-label={trailingLabel}
                className="flex-shrink-0 inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors"
                style={{ width: 40, height: 40 }}
              >
                <img src={icon} alt="" width={iconSize} height={iconSize} />
              </button>
            ) : (
              <img src={icon} alt="" width={iconSize} height={iconSize} className="flex-shrink-0" />
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

/** Read-back label over value, as used across Party Information. */
function Readout({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]" style={{ fontFamily: font }}>
      <span className="text-[14px] text-[#697498]">{label}</span>
      {value && <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{value}</span>}
      {children}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-[8px] px-[20px] py-[32px]"
      style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}
    >
      {children}
    </div>
  );
}

type Props = {
  /** Opens the lookup popups hung off the Person/Parties search icons. */
  onLookup?: (field: 'exporter' | 'notifyParty' | 'cargoHandler' | 'agent') => void;
  onAddOverseasCustomer?: () => void;
};

/**
 * "Custom Declaration" review screen — the General Information step the filing popup
 * hands over to. Figma 2650:43684.
 */
export default function DeclarationReviewPage({ onLookup, onAddOverseasCustomer }: Props) {
  const [mraAeo, setMraAeo] = React.useState(false);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      {/* Journey stepper — General Information is done, the trail after it is the active one */}
      <div className="bg-white rounded-[8px] px-[20px] py-[20px] overflow-x-auto" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-center gap-[8px]" style={{ minWidth: 'max-content' }}>
          {JOURNEY_STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className="flex-shrink-0 flex items-center" style={{ width: 88, height: 32 }}>
                  <div style={{ width: '100%', height: 2, background: i === 1 ? '#0162dd' : '#a1aebe' }} />
                </div>
              )}
              <div className="flex items-start gap-[4px] py-[4px] flex-shrink-0">
                <img src={i === 0 ? stepDoneSrc : stepTodoSrc} alt="" width={24} height={24} className="flex-shrink-0" />
                <span
                  className="text-[14px] text-center whitespace-nowrap"
                  style={{ color: i === 0 ? '#219653' : '#697498', fontWeight: i === 0 ? 700 : 500 }}
                >
                  {label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Declaration Header ── */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500 }}>Declaration Header</p>
          <button
            data-secondary-btn
            type="button"
            className="flex items-center gap-[10px] h-[48px] px-[20px] rounded-[4px] border bg-white transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >
            <img src={helpSrc} alt="" width={20} height={20} />
            <span className="text-[16px] capitalize">Go to Declaration Assistant</span>
          </button>
        </div>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Regime Type" label="Regime Type" labelRequired disabled trailing="chevron" />
            <Field value="Declaration Type" label="Declaration Type" labelRequired disabled trailing="chevron" />
            <Field value="Sea" label="Cargo Channel" labelRequired disabled trailing="chevron" />
            <Field value="DO1321312453" label="Client Decl. Ref. No" labelRequired />
          </div>
        </SectionCard>
      </div>

      {/* ── Person/Parties ── */}
      <div className="flex flex-col gap-[20px]">
        <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500 }}>Person/Parties</p>
        <SectionCard>
          <div className="flex flex-wrap gap-x-[20px] gap-y-[35px] items-start">
            <Field
              className="w-full sm:w-[315px]"
              value="Importers Code" valueRequired disabled trailing="edit"
              chips={['SONY GULF FZE']}
            />

            {/* Exporters Code pairs with the overseas-customer route */}
            <div className="flex flex-wrap gap-[8px] items-start">
              <Field
                className="w-full sm:w-[312px]"
                value="Exporters Code" trailing="search"
                trailingLabel="Search Exporters Code"
                onTrailingClick={() => onLookup?.('exporter')}
                chips={['Maersk Shipping']}
              />
              <div className="flex items-center gap-[8px]">
                <span className="text-[16px] text-[#1e1e1e]" style={{ fontWeight: 500 }}>OR</span>
                <div className="flex flex-col gap-[8px] items-start">
                  <button
                    data-secondary-btn
                    type="button"
                    onClick={onAddOverseasCustomer}
                    className="flex items-center justify-center h-[48px] px-[20px] rounded-[4px] border bg-white transition-colors"
                    style={{ width: 185, borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
                  >
                    <span className="text-[16px] capitalize">Add Overseas Customer</span>
                  </button>
                  <label className="flex items-center gap-[8px] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mraAeo}
                      onChange={(e) => setMraAeo(e.target.checked)}
                      className="size-[18px] rounded-[2px]"
                      style={{ accentColor: '#1360d2' }}
                    />
                    <span className="text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>MRA AEO</span>
                  </label>
                </div>
              </div>
            </div>

            <Field
              className="w-full sm:w-[315px]"
              value="Notify Party Code" trailing="search"
              trailingLabel="Search Notify Party Code"
              onTrailingClick={() => onLookup?.('notifyParty')}
              chips={['SONY GULF FZE']}
            />
            <Field
              className="w-full sm:w-[315px]"
              value="Cargo Handlers Code" valueRequired trailing="search"
              trailingLabel="Search Cargo Handlers Code"
              onTrailingClick={() => onLookup?.('cargoHandler')}
              chips={['SONY GULF FZE']}
            />
            <Field
              className="w-full sm:w-[315px]"
              value="Agent’s Code" valueRequired trailing="search"
              trailingLabel="Search Agent’s Code"
              onTrailingClick={() => onLookup?.('agent')}
              chips={['SONY GULF FZE', 'Maersk Shipping']}
            />
            <Field className="w-full sm:w-[315px]" value="Customs Broker" disabled />
            <Field className="w-full sm:w-[315px]" value="E-Commerce" label="Trade Type" trailing="chevron" />
          </div>
        </SectionCard>
      </div>

      {/* ── Party Information — read-back of the parties resolved above ── */}
      <div className="flex flex-col gap-[20px]">
        <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500 }}>Party Information</p>

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
    </div>
  );
}
