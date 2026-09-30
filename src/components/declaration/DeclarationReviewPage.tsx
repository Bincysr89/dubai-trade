import React, { useState } from 'react';
import {
  Field, JourneyStepper, PartyInformation, SectionCard, SectionTitle, helpSrc, font,
} from './DeclarationUI';

export type PartyLookup = 'exporter' | 'notifyParty' | 'cargoHandler' | 'agent';

type Props = {
  /** Opens the lookup popups hung off the Person/Parties search icons. */
  onLookup?: (field: PartyLookup) => void;
  onAddOverseasCustomer?: () => void;
};

/**
 * "Custom Declaration" General Information step — what the filing popup hands over to.
 * Figma 2650:43684.
 */
export default function DeclarationReviewPage({ onLookup, onAddOverseasCustomer }: Props) {
  const [mraAeo, setMraAeo] = useState(false);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={0} />

      {/* ── Declaration Header ── */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <SectionTitle>Declaration Header</SectionTitle>
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
        <SectionTitle>Person/Parties</SectionTitle>
        <SectionCard>
          <div className="flex flex-wrap gap-x-[20px] gap-y-[35px] items-start">
            <Field
              className="w-full sm:w-[315px]"
              value="Importers Code" valueRequired disabled trailing="edit"
              chips={['SONY GULF FZE']}
            />

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

      <PartyInformation />
    </div>
  );
}
