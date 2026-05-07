import React, { useId, useState } from 'react';
import SearchPickerModal, { type SearchPickerRow } from './SearchPickerModal';

type Props = {
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  trailingIcon?: React.ReactNode;
  type?: 'text' | 'number' | 'email' | 'date';
  height?: number;
  /** When true, the field shows a magnifier trailing icon that opens a search-picker modal. */
  searchable?: boolean;
  pickerColumns?: { key: string; label: string }[];
  pickerRows?: SearchPickerRow[];
  pickerSelectKey?: string; // which row key fills this field
};

const DEFAULT_PICKER_COLUMNS = [
  { key: 'businessCode', label: 'Business Code' },
  { key: 'businessName', label: 'Business Name' },
  { key: 'businessType', label: 'Business Types' },
  { key: 'facilityLocation', label: 'Facility Locations' },
];

const DEFAULT_PICKER_ROWS: SearchPickerRow[] = Array.from({ length: 8 }, () => ({
  businessCode: 'D12345678',
  businessName: 'D12345678',
  businessType: 'D12345678',
  facilityLocation: 'D12345678',
}));

/**
 * Material-style floating label.
 * At rest with no value: label sits centered inside the textbox at full opacity (readable).
 * On focus or when filled: label animates up to sit on the border.
 * If `searchable` is true: trailing magnifier icon opens a search picker modal.
 */
export default function FloatingField({
  label, required, placeholder = '', value = '', onChange, trailingIcon,
  type = 'text', height = 56,
  searchable, pickerColumns = DEFAULT_PICKER_COLUMNS, pickerRows = DEFAULT_PICKER_ROWS, pickerSelectKey = 'businessCode',
}: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const filled = value.length > 0;
  const floated = focused || filled;
  // Native date inputs always show "mm/dd/yyyy". Render as text at rest so the
  // label can sit centered; switch to date once focused/filled and show our
  // own "dd-mm-yyyy" placeholder.
  const isDate = type === 'date';
  const effectiveType = isDate ? (floated ? 'date' : 'text') : type;
  const effectivePlaceholder = isDate
    ? (focused ? 'dd-mm-yyyy' : '')
    : (floated ? placeholder : '');
  const borderColor = focused ? '#1360d2' : '#d5ddfb';

  const effectiveTrailing = searchable ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}
      className="size-[24px] inline-flex items-center justify-center text-[#697498] hover:text-[#1360d2] transition-colors"
      aria-label={`Search ${label}`}
    >
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
    </button>
  ) : trailingIcon;

  return (
    <>
      <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
        <div
          className="bg-white rounded-[4px] flex items-center px-[16px] transition-colors"
          style={{ border: `1px solid ${borderColor}`, height }}
        >
          <input
            id={id}
            type={effectiveType}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={effectivePlaceholder}
            className="flex-1 text-[14px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
          />
          {effectiveTrailing}
        </div>
        <label
          htmlFor={id}
          className="absolute pointer-events-none transition-all"
          style={{
            left: floated ? 10 : 16,
            top: floated ? -9 : '50%',
            transform: floated ? 'none' : 'translateY(-50%)',
            background: floated ? '#fff' : 'transparent',
            padding: floated ? '0 4px' : 0,
            fontSize: floated ? 12 : 14,
            color: floated ? (focused ? '#1360d2' : '#0e1b3d') : '#455174',
            transitionDuration: '120ms',
            transitionProperty: 'top, left, font-size, transform, padding, background, color',
            fontFamily: "'Dubai', sans-serif",
          }}
        >
          {required && <span style={{ color: '#dc3545' }}>*</span>}
          {required ? ' ' : ''}{label}
        </label>
      </div>

      {searchable && (
        <SearchPickerModal
          open={pickerOpen}
          title={`Search ${label}`}
          placeholder={`Enter ${label}`}
          columns={pickerColumns}
          fetchRows={(q) => q ? pickerRows.map((r, i) => ({ ...r, [pickerSelectKey]: `${q}-${String(i + 1).padStart(3, '0')}` })) : []}
          onClose={() => setPickerOpen(false)}
          onSelect={(row) => onChange?.(row[pickerSelectKey] ?? '')}
        />
      )}
    </>
  );
}
