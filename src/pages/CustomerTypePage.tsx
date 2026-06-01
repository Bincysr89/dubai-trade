import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TraderIcon, ShippingAgentIcon, AirlineAgentIcon, OtherAgentIcon } from '../components/AgentIcons';
import bannerBg from '../assets/banner.png';

type CardProps = {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
};

function CustomerCard({ label, icon, selected, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white rounded-[12px] w-full max-w-[230px] h-[220px] flex flex-col items-start justify-between overflow-hidden transition-all
        ${selected ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]' : 'border-2 border-[#ddd] hover:border-[#0e1b3d]'}`}
    >
      <div className="absolute top-0 right-0 w-[64px] h-[64px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[32px] -right-[32px] w-[64px] h-[64px] rounded-full border-[3px] border-[#ea2428]" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full pt-[20px]">
        {icon}
      </div>
      <div className="w-full bg-[#f9f9f9] flex items-center justify-center p-[10px] text-[#0e1b3d] font-medium text-[18px] leading-[20px] text-center capitalize">
        {label}
      </div>
    </button>
  );
}

export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('trader');

  const select = (id: string, target: string) => {
    setSelected(id);
    setTimeout(() => navigate(target), 150);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <div className="bg-white w-full max-w-[1280px] rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-[#0e1b3d] px-6 py-5">
          <h2 className="text-[#f8fafd] font-medium text-[20px]">Customer Type</h2>
        </div>
        <div className="px-12 py-14">
          <h3 className="text-[#0e1b3d] text-[24px] font-semibold text-center mb-12">
            Hi User, Select Your Customer Type to Access the Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-[1080px] mx-auto place-items-center">
            <CustomerCard
              label="Trader"
              selected={selected === 'trader'}
              onClick={() => select('trader', '/landing/trader')}
              icon={<TraderIcon size={72} />}
            />
            <CustomerCard
              label="Shipping Agent"
              selected={selected === 'shipping'}
              onClick={() => select('shipping', '/landing/shipping-agent')}
              icon={<ShippingAgentIcon size={72} />}
            />
            <CustomerCard
              label="Airline Agent"
              selected={selected === 'airline'}
              onClick={() => select('airline', '/landing/airline-agent')}
              icon={<AirlineAgentIcon size={72} />}
            />
            <CustomerCard
              label="Other Agent Type"
              selected={selected === 'other'}
              onClick={() => select('other', '/other-agent-type')}
              icon={<OtherAgentIcon size={72} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
