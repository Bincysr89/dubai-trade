import React, { useState, useRef } from 'react';

const font = "'Dubai', sans-serif";

function DirhamIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Stepper — icon+label inline, no numbers
   ──────────────────────────────────────────────────────────── */
const CREATE_STEPS = [
  'Shipping Details',
  'Container / Package Details',
  'Documents',
  'Payment Details',
];

const AMEND_STEPS = [
  'Shipping Details',
  'Container / Package Details',
  'Documents',
  'Amendment Details',
  'Payment Details',
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7 5.5 10.5 12 3.5" />
    </svg>
  );
}

function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="bg-white rounded-[8px] px-4 sm:px-8 py-[16px] flex items-center flex-shrink-0 overflow-x-auto"
      style={{ boxShadow: '0px 2px 8px rgba(143,155,186,0.16)' }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const circleStyle = done
          ? { background: '#219653', border: 'none' }
          : active
            ? { background: '#fff', border: '2px solid #1360d2' }
            : { background: '#fff', border: '2px solid #a1aebe' };
        const labelColor = done ? '#219653' : active ? '#1360d2' : '#a1aebe';
        const trailColor = i < current ? '#219653' : '#d5ddfb';
        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[24px] rounded-full flex items-center justify-center flex-shrink-0" style={circleStyle}>
                <CheckIcon color={done ? '#fff' : active ? '#1360d2' : '#a1aebe'} />
              </div>
              <span className="text-[16px] whitespace-nowrap hidden sm:inline" style={{ fontFamily: font, fontWeight: 600, color: labelColor }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-[12px]" style={{ minWidth: 16, background: trailColor }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Shared UI helpers
   ──────────────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>{children}</h2>
  );
}

function GrossWeightInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div style={{
        height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
        borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'stretch', overflow: 'hidden',
      }}>
        <input
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          type="number" min="0" placeholder=""
          className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent px-[12px]"
          style={{ fontFamily: font }}
        />
        <div style={{
          width: 64, background: '#eaeaea', borderLeft: '1px solid #eaeaea',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: font, fontSize: 14, color: '#051a37', fontWeight: 400 }}>KG</span>
        </div>
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        <span style={{ color: '#dc3545' }}>*</span>{' '}Gross Weight
      </label>
    </div>
  );
}

function FloatInput({ label, required, value, onChange, readOnly }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: readOnly ? '#f4f7fd' : '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
        <input value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          readOnly={readOnly}
          placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? (readOnly ? '#f4f7fd' : '#fff') : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
    </div>
  );
}

function FloatSelect({ label, required, value, onChange, options }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center px-[12px] bg-white"
        style={{ height: 48, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: value ? '#051937' : 'transparent' }}>{value || '_'}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: font }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DateInput({ label, required, value, onChange }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = true; // date inputs always show dd/mm/yyyy so label must always float
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <div style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent"
          style={{ fontFamily: font, colorScheme: 'light' }}
        />
        <button type="button" onClick={() => (inputRef.current as any)?.showPicker?.()} className="flex-shrink-0 size-[22px] flex items-center justify-center ml-[4px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
    </div>
  );
}

function SearchInput({ label, required, value, onChange }: {
  label: string; required?: boolean; value: string; onChange?: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
        <input value={value} onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
        <button type="button" className="flex-shrink-0 size-[22px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" />
          </svg>
        </button>
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
    </div>
  );
}

const BIZ_SUGGESTIONS = [
  { code: 'AE1006', name: 'Sony Gulf FZE' },
  { code: 'AE1007', name: 'Emirates Trading LLC' },
  { code: 'AE1008', name: 'Dubai Cargo Co.' },
  { code: 'AE-1019056', name: 'Dubai Trading Co. A' },
  { code: 'AE-1019057', name: 'Dubai Trading Co. B' },
  { code: 'AE-1019058', name: 'Dubai Trading Co. C' },
  { code: 'AE-9106286', name: 'SW Logistics LLC' },
];

const PREM_SUGGESTIONS = [
  { code: 'PR-00017', name: 'Raffiq premises' },
  { code: 'PR-00074', name: 'Al rafffiq' },
  { code: 'PR-00088', name: 'ALTHAFF' },
  { code: 'PR-00094', name: 'Arun Trades' },
  { code: 'PR-01522', name: 'dwc' },
  { code: 'PR-01525', name: 'freight8' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE' },
  { code: 'PR-01582', name: 'Jebel Ali' },
];

const CARRIER_SUGGESTIONS = [
  { code: '623595', name: 'STK 1026' },
  { code: '623600', name: 'STK 1026 B' },
  { code: '623575', name: 'APL QINGDAO' },
  { code: '623608', name: 'MOL ASANTE' },
  { code: '623512', name: 'MSC DIANA' },
  { code: '623490', name: 'EVER GIVEN' },
  { code: '623455', name: 'MAERSK KENTUCKY' },
];

const PORT_SUGGESTIONS = [
  { code: 'AEDXB', name: 'Dubai International Airport' },
  { code: 'AEAUH', name: 'Abu Dhabi Airport' },
  { code: 'AESHJ', name: 'Sharjah Airport' },
  { code: 'AEJEA', name: 'Jebel Ali Port' },
  { code: 'AEKHF', name: 'Khalifa Port' },
  { code: 'SGSIN', name: 'Singapore Port' },
  { code: 'CNSHA', name: 'Shanghai Port' },
  { code: 'GBFXT', name: 'Felixstowe Port' },
];

function SearchWithNameInput({ label, required, value, onChange, suggestions, onModalOpen }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  suggestions: { code: string; name: string }[];
  onModalOpen?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const floated = focused || value.length > 0;

  const selectedItem = suggestions.find(s => s.code === value);
  const filtered = value.length > 0 && !selectedItem
    ? suggestions.filter(s =>
        s.code.toLowerCase().includes(value.toLowerCase()) ||
        s.name.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-[4px]">
      <div className="relative">
        <div style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <input value={value}
            onChange={e => { onChange(e.target.value); setShowDropdown(true); }}
            onFocus={() => { setFocused(true); if (!selectedItem) setShowDropdown(true); }}
            onBlur={() => { setTimeout(() => { setFocused(false); setShowDropdown(false); }, 150); }}
            placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
          <button type="button" onClick={() => onModalOpen?.()} className="flex-shrink-0 size-[22px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" />
            </svg>
          </button>
        </div>
        <label className="absolute pointer-events-none transition-all" style={{
          left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
          fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
          transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
        }}>
          {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
        </label>
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
            style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {filtered.map(item => (
              <li key={item.code}
                onMouseDown={() => { onChange(item.code); setShowDropdown(false); }}
                className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
                style={{ fontFamily: font }}>
                <span style={{ color: '#051937', fontWeight: 600 }}>{item.code}</span>
                <span style={{ color: '#697498' }}> — {item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedItem && (
        <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
          <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 600 }}>
            {selectedItem.name}
          </span>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Search Modals
   ──────────────────────────────────────────────────────────── */
const BIZ_ROWS_MODAL = Array.from({ length: 8 }, (_, i) => ({
  code: `AE-${String(1019056 + i).padStart(7, '0')}`,
  name: `Dubai Trading Co. ${String.fromCharCode(65 + i)}`,
  type: 'Customs Agent',
  location: 'Jebel Ali',
}));
BIZ_ROWS_MODAL.unshift({ code: 'AE1006', name: 'Sony Gulf FZE', type: 'Trader', location: 'Dubai Airport' });
BIZ_ROWS_MODAL.unshift({ code: 'AE-9106286', name: 'SW Logistics LLC', type: 'Shipping Agent', location: 'Jebel Ali' });

const PREM_ROWS_MODAL = [
  { code: 'PR-00017', name: 'Raffiq premises',             location: 'DUBAI AIRPORT (CARGO VILLAGE)',   bizName: 'Al Raffiq Trading' },
  { code: 'PR-00074', name: 'Al rafffiq',                  location: 'DXB INTL AIRPORT PAX TERMINAL1',  bizName: 'Al Raffiq Trading' },
  { code: 'PR-00088', name: 'ALTHAFF',                     location: 'DXB INTL AIRPORT PAX TERMINAL1',  bizName: 'Al Raffiq Trading' },
  { code: 'PR-00094', name: 'Arun Trades',                 location: 'JEBEL ALI',                       bizName: 'Al Raffiq Trading' },
  { code: 'PR-01522', name: 'dwc',                         location: 'LOGISTICS DISTRICT',              bizName: 'Al Raffiq Trading' },
  { code: 'PR-01525', name: 'freight8',                    location: 'DWC AlMaktoum Cargo Terminal',    bizName: 'Al Raffiq Trading' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE', location: 'Dubai Intl. Airport (FG 5)',      bizName: 'Al Raffiq Trading' },
  { code: 'PR-01582', name: 'Jebel Ali',                   location: 'JEBEL ALI',                      bizName: 'Al Raffiq Trading' },
];

const CARRIER_ROWS_MODAL = [
  { vesselName: 'STK 1026',        rotationNumber: '623595', date: '20/11/2024' },
  { vesselName: 'STK 1026',        rotationNumber: '623600', date: '20/10/2024' },
  { vesselName: 'APL QINGDAO',     rotationNumber: '623575', date: '10/10/2024' },
  { vesselName: 'MOL ASANTE',      rotationNumber: '623608', date: '10/09/2024' },
  { vesselName: 'MSC DIANA',       rotationNumber: '623512', date: '05/09/2024' },
  { vesselName: 'EVER GIVEN',      rotationNumber: '623490', date: '01/09/2024' },
  { vesselName: 'MAERSK KENTUCKY', rotationNumber: '623455', date: '25/08/2024' },
];

const PORT_ROWS_MODAL = [
  { code: 'AEDXB', name: 'Dubai International Airport', country: 'UAE',  type: 'Airport' },
  { code: 'AEAUH', name: 'Abu Dhabi Airport',           country: 'UAE',  type: 'Airport' },
  { code: 'AESHJ', name: 'Sharjah Airport',             country: 'UAE',  type: 'Airport' },
  { code: 'AEJEA', name: 'Jebel Ali Port',              country: 'UAE',  type: 'Seaport' },
  { code: 'AEKHF', name: 'Khalifa Port',                country: 'UAE',  type: 'Seaport' },
  { code: 'SGSIN', name: 'Singapore Port',              country: 'SGP',  type: 'Seaport' },
  { code: 'CNSHA', name: 'Shanghai Port',               country: 'CHN',  type: 'Seaport' },
  { code: 'GBFXT', name: 'Felixstowe Port',             country: 'GBR',  type: 'Seaport' },
];

function SearchModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] p-[24px] flex flex-col gap-[24px] overflow-hidden"
        style={{ width: 'min(820px,100%)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BizSearchModal({ open, title, onClose, onSelect }: { open: boolean; title: string; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? BIZ_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : BIZ_ROWS_MODAL;
  const cols = ['Business Code', 'Business Name', 'Business Type', 'Location', 'Action'];
  const thS: React.CSSProperties = { background: '#a7c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#0e1b3d', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title={title} onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.type, row.location].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

function PremSearchModal({ open, title, onClose, onSelect }: { open: boolean; title: string; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? PREM_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : PREM_ROWS_MODAL;
  const cols = ['Premises Code', 'Premises Name', 'Customs Location', 'Business Name', 'Action'];
  const thS: React.CSSProperties = { background: '#a7c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#0e1b3d', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title={title} onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.location, row.bizName].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

const CALLING_PORTS = ['Jebel Ali Port', 'Dubai International Airport', 'Abu Dhabi Airport', 'Sharjah Airport', 'Khalifa Port'];

function CarrierSearchModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (rotationNumber: string, vesselName: string) => void }) {
  const [vesselName, setVesselName] = useState('');
  const [callingPort, setCallingPort] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [portOpen, setPortOpen] = useState(false);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const filtered = CARRIER_ROWS_MODAL.filter(r =>
    (!vesselName || r.vesselName.toLowerCase().includes(vesselName.toLowerCase())) &&
    (!callingPort || true)
  );

  const handleReset = () => { setVesselName(''); setCallingPort(''); setFromDate(''); setToDate(''); };

  if (!open) return null;
  const thS: React.CSSProperties = { background: '#e2ebf9', padding: '12px 18px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#455174', whiteSpace: 'nowrap' };
  const tdS: React.CSSProperties = { padding: '0 18px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 15, color: '#0e1b3d' };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(1080px,96vw)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Dark header */}
        <div className="flex items-center justify-between px-[20px] py-[20px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <p className="text-[20px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Search Vessel</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Filters */}
        <div className="px-[20px] pt-[20px] pb-[8px] flex-shrink-0">
          <div className="flex flex-wrap gap-[20px] items-end">
            {/* Vessel Name */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="Enter Vessel Name"
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>Vessel Name</label>
            </div>
            {/* Calling Port dropdown */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <button type="button" onClick={() => setPortOpen(o => !o)}
                className="w-full flex items-center px-[16px] bg-white"
                style={{ height: 56, border: `1px solid ${portOpen ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font }}>
                <span className="flex-1 text-left text-[16px]" style={{ color: callingPort ? '#051937' : '#051937', opacity: callingPort ? 1 : 0.7 }}>{callingPort || 'Select Calling Port'}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${portOpen ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" /></svg>
              </button>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>Calling Port</label>
              {portOpen && (
                <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
                  style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {CALLING_PORTS.map(p => (
                    <li key={p} onMouseDown={() => { setCallingPort(p); setPortOpen(false); }}
                      className="px-[16px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9]"
                      style={{ color: p === callingPort ? '#1360d2' : '#051937', fontFamily: font }}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* From Date */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                <input ref={fromRef} type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font, colorScheme: 'light' }} />
                <button type="button" onClick={() => (fromRef.current as any)?.showPicker?.()} className="size-[48px] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </button>
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>From Date (one month)</label>
            </div>
            {/* To Date */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                <input ref={toRef} type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font, colorScheme: 'light' }} />
                <button type="button" onClick={() => (toRef.current as any)?.showPicker?.()} className="size-[48px] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </button>
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>To Date</label>
            </div>
            {/* Buttons */}
            <div className="flex gap-[20px] items-center">
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, border: '1px solid #1360d2', borderRadius: 3, background: '#fff', color: '#1360d2', fontFamily: font, fontWeight: 700, fontSize: 16, minWidth: 92 }}>
                Reset
              </button>
              <button type="button"
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, borderRadius: 3, background: '#1360d2', color: '#fff', fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 134 }}>
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-[20px] pb-[30px]">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
            <thead>
              <tr>
                <th style={thS}>Vessel Name</th>
                <th style={thS}>Rotation Number</th>
                <th style={thS}>Date</th>
                <th style={{ ...thS, borderRadius: '0 8px 8px 0' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={tdS}>{row.vesselName}</td>
                  <td style={tdS}>{row.rotationNumber}</td>
                  <td style={tdS}>{row.date}</td>
                  <td style={{ ...tdS, paddingLeft: 18 }}>
                    <button onClick={() => { onSelect(row.rotationNumber, row.vesselName); onClose(); }}
                      className="text-[16px] hover:underline" style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PortSearchModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? PORT_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : PORT_ROWS_MODAL;
  const cols = ['Port Code', 'Port Name', 'Country', 'Type', 'Action'];
  const thS: React.CSSProperties = { background: '#a7c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#0e1b3d', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title="Search Port of Loading" onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.country, row.type].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

function NavBar({ onBack, backLabel = 'Back', onNext, nextLabel = 'Next', centerLabel, onCenter }: {
  onBack?: () => void; backLabel?: string;
  onNext?: () => void; nextLabel?: string;
  centerLabel?: string; onCenter?: () => void;
}) {
  return (
    <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]"
      style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
      <button onClick={onBack}
        className="h-[48px] px-[28px] rounded-[4px] text-[16px] border hover:bg-[#f0f4ff] transition-colors"
        style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
        {backLabel}
      </button>
      <div className="flex items-center gap-[12px]">
        {centerLabel && (
          <button onClick={onCenter}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] border hover:bg-[#f0f4ff] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
            {centerLabel}
          </button>
        )}
        <button onClick={onNext}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Modals
   ──────────────────────────────────────────────────────────── */
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(5,25,55,0.45)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function AddPackageModal({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState('');
  const [pkgType, setPkgType] = useState('');
  const [marks, setMarks] = useState('');
  const PKG_TYPES = ['Boxes', 'Pallets', 'Bags', 'Drums', 'Rolls', 'Bundles'];
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[95vw] sm:w-[520px]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Add / Edit Package</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 gap-[16px]">
            <FloatInput label="No. of Packages" required value={count} onChange={setCount} />
            <FloatSelect label="Package Type" required value={pkgType} onChange={setPkgType} options={PKG_TYPES} />
          </div>
          <div className="relative">
            <textarea
              value={marks} onChange={e => setMarks(e.target.value)}
              rows={3}
              placeholder=""
              className="w-full text-[16px] text-[#051937] outline-none resize-none px-[12px] pt-[20px] pb-[8px] rounded-[4px]"
              style={{ fontFamily: font, border: '1px solid #d5ddfb', background: '#fff' }}
            />
            <label className="absolute pointer-events-none text-[12px]" style={{
              left: 12, top: 8, color: '#697498', fontFamily: font,
            }}>Shipping Marks</label>
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Reset
            </button>
            <button
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function AddContainerModal({ onClose }: { onClose: () => void }) {
  const [containerNo, setContainerNo] = useState('');
  const [sealNo, setSealNo] = useState('');
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[95vw] sm:w-[560px]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Add / Edit Container</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 gap-[16px]">
            <FloatInput label="Container Number" required value={containerNo} onChange={setContainerNo} readOnly />
            <FloatInput label="Seal Number" value={sealNo} onChange={setSealNo} readOnly />
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Reset
            </button>
            <button
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 1 — General Information
   ──────────────────────────────────────────────────────────── */
function Step1({ onBack, onNext, initTransferType = '', initTransferorBiz = '', initTransferorPrem = '', initTransfereeBiz = '', initTransfereePrem = '', initClientRef = '' }: {
  onBack: () => void; onNext: () => void;
  initTransferType?: string; initTransferorBiz?: string; initTransferorPrem?: string;
  initTransfereeBiz?: string; initTransfereePrem?: string; initClientRef?: string;
}) {
  const [transferType, setTransferType] = useState(initTransferType);
  const [transferorBiz, setTransferorBiz] = useState(initTransferorBiz);
  const [transferorPrem, setTransferorPrem] = useState(initTransferorPrem);
  const [transfereeBiz, setTransfereeBiz] = useState(initTransfereeBiz);
  const [transfereePrem, setTransfereePrem] = useState(initTransfereePrem);
  const [clientRef, setClientRef] = useState(initClientRef);
  const [bizModal, setBizModal] = useState<null | 'transferor' | 'transferee'>(null);
  const [premModal, setPremModal] = useState<null | 'transferor' | 'transferee'>(null);

  const TYPES = [
    'From CTO to CH - Same Location', 'From CTO to CH - Different Location',
    'From CH to CH - Same Location', 'From CH to CH - Different Location',
    'From CTO to CTO - Different Location',
  ];

  return (
    <div className="flex flex-col h-full">
      <BizSearchModal open={bizModal !== null} title={`Search ${bizModal === 'transferor' ? 'Transferor' : 'Transferee'} Business Code`} onClose={() => setBizModal(null)} onSelect={code => { if (bizModal === 'transferor') setTransferorBiz(code); else setTransfereeBiz(code); }} />
      <PremSearchModal open={premModal !== null} title={`Search ${premModal === 'transferor' ? 'Transferor' : 'Transferee'} Premises Code`} onClose={() => setPremModal(null)} onSelect={code => { if (premModal === 'transferor') setTransferorPrem(code); else setTransfereePrem(code); }} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[24px]">

          {/* Cargo Transfer Type */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <SectionHeading>Cargo Transfer Type</SectionHeading>
            <div className="mt-[16px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
              <FloatSelect label="Cargo Transfer Type" required value={transferType} onChange={setTransferType} options={TYPES} />
            </div>
          </div>

          {/* Transferor/Transferee Details */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <SectionHeading>Transferor/Transferee Details</SectionHeading>
            <div className="mt-[16px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
              <SearchWithNameInput label="Transferor Business Code" required value={transferorBiz} onChange={setTransferorBiz} suggestions={BIZ_SUGGESTIONS} onModalOpen={() => setBizModal('transferor')} />
              <SearchWithNameInput label="Transferor Premises Code" required value={transferorPrem} onChange={setTransferorPrem} suggestions={PREM_SUGGESTIONS} onModalOpen={() => setPremModal('transferor')} />
              <SearchWithNameInput label="Transferee Business Code" required value={transfereeBiz} onChange={setTransfereeBiz} suggestions={BIZ_SUGGESTIONS} onModalOpen={() => setBizModal('transferee')} />
              <SearchWithNameInput label="Transferee Premises Code" required value={transfereePrem} onChange={setTransfereePrem} suggestions={PREM_SUGGESTIONS} onModalOpen={() => setPremModal('transferee')} />
              <FloatInput label="Client's Dec. Ref. No." required value={clientRef} onChange={setClientRef} />
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 2 — Shipping Details
   ──────────────────────────────────────────────────────────── */
function Step2({ onBack, onNext, initCargoChannel = '', initCarrierReg = '', initMasterDoc = '' }: {
  onBack: () => void; onNext: () => void;
  initCargoChannel?: string; initCarrierReg?: string; initMasterDoc?: string;
}) {
  const [inCargoChannel, setInCargoChannel] = useState(initCargoChannel);
  const [carrierReg, setCarrierReg] = useState(initCarrierReg);
  const [carrierName, setCarrierName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [masterDoc, setMasterDoc] = useState(initMasterDoc);
  const [portOfLoading, setPortOfLoading] = useState('');
  const [manifestReg, setManifestReg] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [customsSealNo, setCustomsSealNo] = useState('');
  const [outCargoChannel, setOutCargoChannel] = useState('Land');
  const [carrierNo, setCarrierNo] = useState('');
  const [courierRampTransfer, setCourierRampTransfer] = useState('');
  const [precedingClearanceNo, setPrecedingClearanceNo] = useState('');
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [showPortModal, setShowPortModal] = useState(false);

  const CHANNELS = ['Sea', 'Air', 'Land'];
  const CARGO_TYPES = ['FCL', 'LCL'];

  return (
    <div className="flex flex-col h-full">
      <CarrierSearchModal open={showCarrierModal} onClose={() => setShowCarrierModal(false)} onSelect={(rotNum, vesselName) => { setCarrierReg(rotNum); setCarrierName(vesselName); setShowCarrierModal(false); }} />
      <PortSearchModal open={showPortModal} onClose={() => setShowPortModal(false)} onSelect={code => { setPortOfLoading(code); setShowPortModal(false); }} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[24px]">

          {/* Inbound Details */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <SectionHeading>Inbound Details</SectionHeading>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
              <FloatSelect label="Cargo Channel" required value={inCargoChannel} onChange={setInCargoChannel} options={CHANNELS} />
              <SearchWithNameInput label="Carrier Registration No" required value={carrierReg} onChange={setCarrierReg} suggestions={CARRIER_SUGGESTIONS} onModalOpen={() => setShowCarrierModal(true)} />
              {inCargoChannel !== 'Air' && (
                <FloatInput label="Carrier Name" value={carrierName} onChange={setCarrierName} />
              )}
              <DateInput label="Arrival Date" required value={arrivalDate} onChange={setArrivalDate} />
              <FloatInput label="Master Transport Document No" required value={masterDoc} onChange={setMasterDoc} />
              <SearchWithNameInput label="Port of Loading" required value={portOfLoading} onChange={setPortOfLoading} suggestions={PORT_SUGGESTIONS} onModalOpen={() => setShowPortModal(true)} />
              <FloatInput label="Manifest Registration No" value={manifestReg} onChange={setManifestReg} />
              <FloatInput label="Preceding Clearance No." value={precedingClearanceNo} onChange={setPrecedingClearanceNo} />
            </div>
          </div>

          {/* Cargo Details */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <SectionHeading>Cargo Details</SectionHeading>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
              <FloatSelect label="Cargo Type" required value={cargoType} onChange={setCargoType} options={CARGO_TYPES} />
              <GrossWeightInput value={grossWeight} onChange={setGrossWeight} />
              <FloatInput label="Customs Seal No." value={customsSealNo} onChange={setCustomsSealNo} />
            </div>
          </div>

          {/* Outbound Details */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <SectionHeading>Outbound Details</SectionHeading>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
              <FloatSelect label="Cargo Channel" required value={outCargoChannel} onChange={setOutCargoChannel} options={CHANNELS} />
              <FloatInput label="Carrier No." value={carrierNo} onChange={setCarrierNo} />
              <FloatSelect label="Courier Cargo Ramp Transfer" value={courierRampTransfer} onChange={setCourierRampTransfer} options={['Yes', 'No']} />
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 3 — Container / Package Details
   ──────────────────────────────────────────────────────────── */
const PACKAGE_ROWS = Array.from({ length: 7 }, () => ({
  packages: '1000 Packaged Goods',
  marks: 'Based on BOL no. from Manifest Data',
}));

const CONTAINER_ROWS = [
  { no: 'LILI1303120', seal: 'NA', size: '--',  type: '--' },
  { no: 'LILI1303130', seal: 'NA', size: '20',  type: 'Reefer' },
  { no: 'LILI1303140', seal: 'NA', size: '--',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '40',  type: 'Reefer' },
  { no: 'LILI1303120', seal: 'NA', size: '40',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '20',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '--',  type: 'Reefer' },
];

const PARTY_CARDS = [
  {
    title: 'Transferor Details',
    rows: [
      { label: 'Transferor Business Name', value: 'Al Raffiq Trading' },
      { label: 'Transferor Premises Name', value: 'Raffiq premises' },
    ],
  },
  {
    title: 'Transferee Details',
    rows: [
      { label: 'Transferee Business Name', value: 'Al Raffiq Trading' },
      { label: 'License Expires on', value: '20-11-2036' },
      { label: 'VAT TRN', value: '20-11-2036' },
    ],
  },
  {
    title: 'Broker Details',
    rows: [
      { label: 'Broker Business Code', value: 'AE-9106286' },
      { label: 'Broker Business Name', value: 'SW Logistics LLC' },
      { label: 'License Expires on', value: '15-11-2029' },
    ],
  },
];

function PartyInfoSection() {
  return (
    <div className="flex flex-col md:flex-row gap-[16px]">
      {PARTY_CARDS.map(card => (
        <div key={card.title} className="flex-1 bg-white rounded-[8px] p-[20px]"
          style={{ border: '1px solid #e8edf5', boxShadow: '0px 1px 8px rgba(0,0,0,0.06)' }}>
          <h3 className="text-[15px] text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font, fontWeight: 700 }}>{card.title}</h3>
          <div className="flex flex-col gap-[12px]">
            {card.rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-[16px]">
                <span className="text-[16px] text-[#696f83]" style={{ fontFamily: font }}>{r.label}</span>
                <span className="text-[16px] text-[#051937]" style={{ fontFamily: font, fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BulkUploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[95vw] sm:w-[520px]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Bulk Upload</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[16px]">
          <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
            Upload a file (.xlsx, .csv) to auto-fill the table. Download the template to see the required format.
          </p>
          <button className="self-start text-[16px] text-[#1360d2] underline hover:opacity-80" style={{ fontFamily: font }}>
            Download Template
          </button>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f.name); }}
            className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[40px] transition-colors"
            style={{ background: dragging ? '#e2ebf9' : '#f8fafd', border: `2px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}
          >
            <div className="size-[52px] rounded-full bg-[#e2ebf9] flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{file || 'Drag and drop your file here or'}</p>
            {!file ? (
              <label className="border border-[#1360d2] rounded-[4px] px-[20px] py-[8px] text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors cursor-pointer" style={{ fontFamily: font }}>
                Choose File
                <input type="file" accept=".xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f.name); }} />
              </label>
            ) : (
              <button onClick={() => setFile('')} className="text-[16px] text-[#dc3545] hover:underline" style={{ fontFamily: font }}>Remove</button>
            )}
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px] hover:bg-[#f0f4ff]"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Cancel
            </button>
            <button onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Upload &amp; Fill
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function Step3({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [activeTab, setActiveTab] = useState<'package' | 'container'>('package');
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [draggingUpload, setDraggingUpload] = useState(false);

  const thStyle = { background: '#e2ebf9', padding: '10px 12px', textAlign: 'left' as const, fontWeight: 500 };
  const tdStyle = { background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' };
  const SortIcon = () => (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full">
      {showAddPackage && <AddPackageModal onClose={() => setShowAddPackage(false)} />}
      {showAddContainer && <AddContainerModal onClose={() => setShowAddContainer(false)} />}
      {showBulkUpload && <BulkUploadModal onClose={() => setShowBulkUpload(false)} />}

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[24px]">

          {/* Tab switcher */}
          <div className="bg-white rounded-[8px] p-[16px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between">
              <div className="flex gap-[12px]">
                {(['package', 'container'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="h-[40px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                    style={{
                      fontFamily: font, fontWeight: 500,
                      background: activeTab === tab ? '#1360d2' : '#f7faff',
                      color: activeTab === tab ? '#fff' : '#696f83',
                      border: `1px solid ${activeTab === tab ? '#1360d2' : '#e5efff'}`,
                    }}>
                    {tab === 'package' ? 'Package Details' : 'Container Details'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-[8px]">
                <button onClick={() => setShowBulkUpload(true)}
                  className="h-[36px] px-[14px] rounded-[4px] text-[16px] flex items-center gap-[6px] hover:bg-[#f0f4ff] transition-colors"
                  style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 4 17 16 17 16 14" /><polyline points="7 8 10 5 13 8" /><line x1="10" y1="5" x2="10" y2="13" />
                  </svg>
                  Bulk Upload
                </button>
                {activeTab === 'package' ? (
                  <button onClick={() => setShowAddPackage(true)}
                    className="h-[36px] px-[16px] rounded-[4px] text-[16px] flex items-center gap-[6px] hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', color: '#fff', fontFamily: font, fontWeight: 500 }}>
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                    Add Package
                  </button>
                ) : (
                  <button onClick={() => setShowAddContainer(true)}
                    className="h-[36px] px-[16px] rounded-[4px] text-[16px] flex items-center gap-[6px] hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', color: '#fff', fontFamily: font, fontWeight: 500 }}>
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                    Add Container
                  </button>
                )}
              </div>
            </div>

            <div className="mt-[20px]">
              {activeTab === 'package' ? (
                <>
                  <SectionHeading>Package Details</SectionHeading>
                  <div className="mt-[16px] overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                      <thead>
                        <tr>
                          {['Number of Packages', 'Shipping Marks'].map(col => (
                            <th key={col} style={thStyle}>
                              <div className="flex items-center gap-[4px]">
                                <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                                <SortIcon />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PACKAGE_ROWS.map((row, i) => (
                          <tr key={i}>
                            <td style={tdStyle}><span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.packages}</span></td>
                            <td style={tdStyle}><span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.marks}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <SectionHeading>Container Details</SectionHeading>
                  <div className="mt-[16px] overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                      <thead>
                        <tr>
                          {['Container No', 'Seal No', 'Action'].map(col => (
                            <th key={col} style={thStyle}>
                              <div className="flex items-center gap-[4px]">
                                <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                                {col !== 'Action' && <SortIcon />}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {CONTAINER_ROWS.map((row, i) => (
                          <tr key={i}>
                            {[row.no, row.seal].map((v, j) => (
                              <td key={j} style={tdStyle}><span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{v}</span></td>
                            ))}
                            <td style={tdStyle}>
                              <button onClick={() => setShowAddContainer(true)} className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[18px] text-[#051937] mb-[12px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Container / Package File</h2>
            <p className="text-[16px] text-[#323c64] mb-[16px]" style={{ fontFamily: font }}>*Supported file types: .xlsx, .csv, .pdf — max file size 50MB</p>
            <div
              onDragOver={e => { e.preventDefault(); setDraggingUpload(true); }}
              onDragLeave={() => setDraggingUpload(false)}
              onDrop={e => { e.preventDefault(); setDraggingUpload(false); const f = e.dataTransfer.files[0]; if (f) setUploadedFile(f.name); }}
              className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[40px] transition-colors"
              style={{ background: draggingUpload ? '#e2ebf9' : '#f8fafd', border: `2px dashed ${draggingUpload ? '#1360d2' : '#8f94ae'}` }}
            >
              <div className="size-[52px] rounded-full bg-[#e2ebf9] flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                {uploadedFile ? uploadedFile : 'Drag and drop or'}
              </p>
              {!uploadedFile && (
                <label className="border border-[#1360d2] rounded-[4px] px-[20px] py-[8px] text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors cursor-pointer" style={{ fontFamily: font }}>
                  Choose File
                  <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f.name); }} />
                </label>
              )}
              {uploadedFile && (
                <button onClick={() => setUploadedFile('')} className="text-[16px] text-[#dc3545] hover:underline" style={{ fontFamily: font }}>Remove</button>
              )}
            </div>
          </div>

          <PartyInfoSection />
        </div>
      </div>
      <NavBar onBack={onBack}
        centerLabel={activeTab === 'package' ? 'Proceed to Container Details' : undefined}
        onCenter={() => setActiveTab('container')}
        onNext={onNext} nextLabel="Proceed to Documents" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 4 — Documents
   ──────────────────────────────────────────────────────────── */
const DOC_TYPES = [
  { label: 'Other Documents', count: 0 },
];

const UPLOADED_ROWS = [
  { name: 'Passport Copy',                        type: 'Invoice Consumption Requ..', size: '50 MB', date: '08-12-2024' },
  { name: 'Trade License copy',                   type: 'Trade License Copy',         size: '50 MB', date: '08-12-2024' },
  { name: 'Certificate Of Origin...',             type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Organizational Structure/Profile Copy',type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Invoice Consumption Request Letter',   type: 'Cert. of Origin',            size: '50 MB', date: '08-12-2024' },
  { name: 'Laboratory 123234.pdf',                type: 'Laboratory Results',         size: '50 MB', date: '08-12-2024' },
];

function Step4({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [dragging, setDragging] = useState(false);
  const TABLE_COLS = ['Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[24px]">

          <div className="flex flex-col lg:flex-row gap-[24px]">
            {/* Document Types — 66% */}
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] w-full lg:w-[66%]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div>
                <h2 className="text-[20px] text-[#060c28] mb-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Documents</h2>
                <p className="text-[16px] text-[#323c64]" style={{ fontFamily: font }}>
                  Select the document type and upload the file, we will share the documents with authorities.
                </p>
              </div>
              <p className="text-[15px] text-[#051937]" style={{ fontFamily: font, fontWeight: 600 }}>Dubai Customs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
                {DOC_TYPES.map((d, i) => (
                  <label key={i} className="flex items-center gap-[10px] cursor-pointer">
                    <div onClick={() => setSelectedDoc(i)} className="flex-shrink-0 size-[18px] rounded-full border-[2px] flex items-center justify-center"
                      style={{ borderColor: selectedDoc === i ? '#1360d2' : '#d5ddfb' }}>
                      {selectedDoc === i && <div className="size-[8px] rounded-full bg-[#1360d2]" />}
                    </div>
                    <span className="text-[16px] text-[#060c28] flex-1 flex items-center gap-[6px]" style={{ fontFamily: font }}>
                      <span>{i === 0 && <span style={{ color: '#dc3545' }}>*</span>}{d.label}</span>
                      {d.count > 0 && <span className="text-[11px] px-[6px] py-[1px] rounded-full flex-shrink-0" style={{ background: '#c8f4d2', color: '#219653', fontFamily: font, fontWeight: 600 }}>{d.count}</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload File — 30% */}
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[12px] w-full lg:w-[28%]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <h2 className="text-[20px] text-[#060c28]" style={{ fontFamily: font, fontWeight: 500 }}>Upload File</h2>
              <p className="text-[12px] text-[#323c64]" style={{ fontFamily: font }}>*Supported file type of .pdf, .jpg etc, max file size up to 50MB</p>
              <p className="text-[12px] text-[#323c64]" style={{ fontFamily: font }}>*Only 05 number of files are allowed</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className="flex-1 flex flex-col items-center justify-center gap-[12px] rounded-[4px] py-[32px]"
                style={{ background: '#f8fafd', border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}>
                <div className="size-[60px] rounded-full bg-[#dfe5e9] flex items-center justify-center flex-shrink-0">
                  <img src="https://www.figma.com/api/mcp/asset/9b3444cd-50cf-433e-8a19-fe7a4183e5f5" alt="" style={{ width: 32, height: 30 }} />
                </div>
                <p className="text-[16px] text-[#6d707e]" style={{ fontFamily: font }}>Drag and drop or</p>
                <button className="bg-white border border-[#1360d2] rounded-[4px] text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] capitalize"
                  style={{ width: 120, height: 48, fontFamily: font, fontWeight: 500 }}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: font, fontWeight: 500 }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {TABLE_COLS.map(col => (
                      <th key={col} style={{ background: '#e2ebf9', padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>
                        <div className="flex items-center gap-[4px]">
                          <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                          {col !== 'Action' && (
                            <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
                              <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
                            </svg>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UPLOADED_ROWS.map((row, i) => (
                    <tr key={i}>
                      {[row.name, row.type, row.size, row.date].map((val, j) => (
                        <td key={j} style={{ background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                          <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{val}</span>
                        </td>
                      ))}
                      <td style={{ background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                        <div className="flex gap-[4px]">
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#fdf2f3]" title="Delete">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                            </svg>
                          </button>
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#f0f4ff]" title="Download">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v13M7 11l5 5 5-5" /><path d="M3 20h18" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} centerLabel="Skip" onCenter={onNext} onNext={onNext} nextLabel="Proceed" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 5 — Payment Details
   ──────────────────────────────────────────────────────────── */
function Step5({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef, setPaymentRef] = useState('Account Number');
  const [depositMode, setDepositMode] = useState('Credit/Debit Account');
  const [depositRef, setDepositRef] = useState('Account Number');
  const [declared, setDeclared] = useState(false);

  const CHARGES = [
    { label: 'Registration Fee', amount: 100 },
    { label: 'Knowledge & Innovation Fee', amount: 20 },
  ];
  const PAYMENT_MODES = ['Credit/Debit Account', 'Standard Guarantee', 'Cash', 'Bank Transfer'];
  const PAYMENT_REFS = ['Account Number', 'Reference No'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[24px]">

          {/* Payment table */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: font, fontWeight: 500 }}>Payments Details</h2>

            {/* Single table */}
            <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #c4d8f5' }}>
              {/* Single header */}
              <div className="flex" style={{ background: '#a7c2e9' }}>
                <div className="h-[44px] flex items-center pl-[20px]" style={{ flex: '0 0 50%' }}>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Charges</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Mode</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Reference</span>
                </div>
              </div>

              {/* Deposit row */}
              <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <div className="flex flex-col gap-[10px] w-full lg:w-[calc(50%-10px)]">
                  <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600, width: 200 }}>Deposit</span>
                    <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                      <DirhamIcon size={16} color="#051937" />10,000
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <FloatSelect label="Payment Mode" value={depositMode} onChange={setDepositMode} options={PAYMENT_MODES} />
                </div>
                <div className="flex-1">
                  <FloatSelect label="Payment Reference" value={depositRef} onChange={setDepositRef} options={PAYMENT_REFS} />
                </div>
              </div>

              {/* Other Charges row */}
              <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white">
                <div className="flex flex-col gap-[10px] w-full lg:w-[calc(50%-10px)]">
                  <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600, width: 200 }}>Other Charges</span>
                    <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                      <DirhamIcon size={16} color="#051937" />120
                    </span>
                  </div>
                  {CHARGES.map((c, i) => (
                    <div key={i} className="flex items-start gap-[12px] px-[12px]">
                      <span className="text-[16px] text-[#696f83]" style={{ fontFamily: font, fontWeight: 500, width: 200 }}>{c.label}</span>
                      <span className="flex items-center gap-[4px] text-[16px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                        <DirhamIcon size={13} color="#051937" />{c.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <FloatSelect label="Payment Mode" value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} />
                </div>
                <div className="flex-1">
                  <FloatSelect label="Payment Reference" value={paymentRef} onChange={setPaymentRef} options={PAYMENT_REFS} />
                </div>
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <label className="flex items-start gap-[12px] cursor-pointer">
              <button type="button" onClick={() => setDeclared(d => !d)}
                className="flex-shrink-0 size-[20px] rounded-[3px] flex items-center justify-center mt-[2px] transition-colors"
                style={{ background: declared ? '#1360d2' : '#fff', border: `2px solid ${declared ? '#1360d2' : '#d5ddfb'}` }}>
                {declared && (
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </button>
              <div className="flex flex-col gap-[8px]">
                <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>
                  We, the undersigned hereby declare that the particulars given on this request are true and complete and that all the particulars have been provided and agree with the original documents. We accept full responsibility for any errors or omissions.
                </p>
                <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>
                  We further undertake to comply with all regulations and laws that are in force in the country. Any misrepresentation may lead to legal action being taken against us.
                </p>
              </div>
            </label>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onSubmit} nextLabel="Proceed" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 5A — Amendment Details (amend flow only)
   ──────────────────────────────────────────────────────────── */
const AMENDMENT_REASONS = ['Incorrect Declaration', 'Cargo Change', 'Party Information Change', 'Other'];
const CARGO_STATUSES = ['Arrived', 'In Transit', 'Delivered', 'Held'];

const AMENDED_SUMMARY_ROWS: { attribute: string; oldValue: string; newValue: string }[] = [];

const CHARGE_ROWS = [
  { charge: 'Registration Fee', oldAmount: '40.00', newAmount: '40.00' },
  { charge: 'Declaration Amendment Charges', oldAmount: '', newAmount: '25.00' },
];

function StepAmendment({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [amendReason, setAmendReason] = useState('');
  const [cargoStatus, setCargoStatus] = useState('');
  const [fileName, setFileName] = useState('');

  const thStyle: React.CSSProperties = { background: '#a7c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#0e1b3d', fontFamily: font };
  const tdStyle: React.CSSProperties = { background: '#fff', padding: '0 12px', height: 54, borderBottom: '1px solid #f0f4ff', fontSize: 15, color: '#0e1b3d', fontFamily: font };
  const tdAltStyle: React.CSSProperties = { ...tdStyle, background: '#f5f5f5' };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="flex flex-col gap-[32px]">

          {/* Amendment Details card */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Amendment Details</h2>
            <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                <FloatSelect label="Amendment Reason" required value={amendReason} onChange={setAmendReason} options={AMENDMENT_REASONS} />
                <FloatSelect label="Cargo Status" required value={cargoStatus} onChange={setCargoStatus} options={CARGO_STATUSES} />

                {/* Attachment field */}
                <div className="relative flex items-center justify-between px-[16px] py-[8px] bg-white rounded-[4px]"
                  style={{ border: '1px solid #d5ddfb', minHeight: 56 }}>
                  <span className="text-[16px] flex-1 truncate" style={{ fontFamily: font, color: fileName ? '#0e1b3d' : 'rgba(14,27,61,0.5)' }}>
                    {fileName || 'No files Selected'}
                  </span>
                  <label className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[4px] cursor-pointer flex-shrink-0"
                    style={{ border: '1px solid #1360d2', boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15V3M8 7l4-4 4 4" /><path d="M3 20h18" />
                    </svg>
                    <span className="text-[16px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>Upload</span>
                    <input type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
                  </label>
                  <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28]"
                    style={{ fontFamily: font, left: 11, top: -9 }}>Attachment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amended Summary */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Amended Summary</h2>
            <div className="rounded-[8px] overflow-x-auto bg-[#f8fafd]">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Amended Attribute', 'Old Value', 'New Value'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AMENDED_SUMMARY_ROWS.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#8f94ae', height: 54 }}>—</td>
                    </tr>
                  ) : AMENDED_SUMMARY_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{row.attribute}</td>
                      <td style={tdStyle}>{row.oldValue}</td>
                      <td style={tdStyle}>{row.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charge Details */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Charge Details</h2>
            <div className="rounded-[8px] overflow-x-auto bg-[#f8fafd]">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Charge', 'Old Amount', 'New Amount'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CHARGE_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.charge}</td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>
                        {row.oldAmount && (
                          <span className="flex items-center gap-[3px]">
                            <DirhamIcon size={13} color="#0e1b3d" />
                            <span className="text-[16px]">{row.oldAmount}</span>
                          </span>
                        )}
                      </td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>
                        {row.newAmount && (
                          <span className="flex items-center gap-[3px]">
                            <DirhamIcon size={13} color="#0e1b3d" />
                            <span className="text-[16px]">{row.newAmount}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Stepper Page
   ──────────────────────────────────────────────────────────── */
type Props = {
  onBack: () => void;
  onSubmit: () => void;
  mode?: 'create' | 'amend';
  initTransferType?: string;
  initTransferorBiz?: string;
  initTransferorPrem?: string;
  initTransfereeBiz?: string;
  initTransfereePrem?: string;
  initClientRef?: string;
  initCargoChannel?: string;
  initCarrierReg?: string;
  initMasterDoc?: string;
};

export default function CargoTransferStepperPage({ onBack, onSubmit, mode = 'create', initTransferType, initTransferorBiz, initTransferorPrem, initTransfereeBiz, initTransfereePrem, initClientRef, initCargoChannel, initCarrierReg, initMasterDoc }: Props) {
  const isAmend = mode === 'amend';
  const steps = isAmend ? AMEND_STEPS : CREATE_STEPS;
  const [step, setStep] = useState(0);
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="flex flex-col h-full bg-[#f8fafd] overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[20px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-10 pb-[12px] flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
          {isAmend ? 'Amend Cargo Transfer Request' : 'Cargo Transfer - New Request'}
        </h1>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-10 pb-[16px] flex-shrink-0">
        <Stepper current={step} steps={steps} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {step === 0 && <Step2 onBack={onBack} onNext={next} initCargoChannel={initCargoChannel} initCarrierReg={initCarrierReg} initMasterDoc={initMasterDoc} />}
        {step === 1 && <Step3 onBack={prev} onNext={next} />}
        {step === 2 && <Step4 onBack={prev} onNext={next} />}
        {step === 3 && isAmend && <StepAmendment onBack={prev} onNext={next} />}
        {step === 3 && !isAmend && <Step5 onBack={prev} onSubmit={onSubmit} />}
        {step === 4 && isAmend && <Step5 onBack={prev} onSubmit={onSubmit} />}
      </div>
    </div>
  );
}
