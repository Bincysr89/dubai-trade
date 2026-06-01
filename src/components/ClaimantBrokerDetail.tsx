import React from 'react';

type Props = {
  claimantCode?: string;
  claimantName?: string;
  claimantType?: string;
  brokerCode?: string;
  brokerName?: string;
  brokerType?: string;
};

/**
 * "Claimant and Broker Detail" footer section shown across the Refund & Claims flow.
 * Matches the Cargo Transfer "Outbound Details" pattern:
 *   - section title above the card
 *   - white card with shadow holding two key/value blocks
 */
export default function ClaimantBrokerDetail({
  claimantCode = 'AE-9106286',
  claimantName = 'SW Logistics LLC',
  claimantType = 'Business',
  brokerCode = 'AE-9106286',
  brokerName = 'SW Logistics LLC',
  brokerType = 'Business',
}: Props) {
  const Field = ({ k, v }: { k: string; v: string }) => (
    <div className="flex flex-col gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <span className="text-[16px] text-[#696f83]">{k}</span>
      <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{v}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claimant and Broker Detail</p>
      <div
        className="bg-white rounded-[8px] px-[24px] py-[20px] flex flex-col gap-[20px]"
        style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}
      >
        <div className="flex flex-col gap-[12px]">
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claimant Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[12px]">
            <Field k="Claimant Code" v={claimantCode} />
            <Field k="Claimant Name" v={claimantName} />
            <Field k="Type" v={claimantType} />
          </div>
        </div>
        <div className="h-px" style={{ background: '#eef1f6' }} />
        <div className="flex flex-col gap-[12px]">
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Broker Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[12px]">
            <Field k="Broker Code" v={brokerCode} />
            <Field k="Broker Name" v={brokerName} />
            <Field k="Type" v={brokerType} />
          </div>
        </div>
      </div>
    </div>
  );
}
