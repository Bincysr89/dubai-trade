import { useState } from 'react';
import Header from './Header';
import Pagination from './Pagination';
import { DateInput } from './DatePicker';

const font = "'Dubai', sans-serif";

/* ── Advanced-filter field definitions ── */
export type AFFieldDef =
  | { key: string; label: string; type: 'text' | 'date' }
  | { key: string; label: string; type: 'dropdown'; options: string[] };

/* ── Floating-label helpers (matching Integrated Clearance / Bill Payment design) ── */
function flLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: '#0e1b3d',
    background: active ? '#fff' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}
function AFInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }}
      />
      <span style={flLabel(active, focused)}>{label}</span>
    </div>
  );
}
function AFDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <DateInput label={label} value={value} onChange={onChange} />
  );
}
function AFDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const active = open || value !== '';
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d] bg-white focus:outline-none text-left"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}
      >
        <span className="flex-1 truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span style={flLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[200] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px]"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#697498] hover:bg-[#f5f7ff]"
            style={{ fontFamily: font }} onClick={() => { onChange(''); setOpen(false); }}>
            — All —
          </button>
          {options.map(opt => (
            <button key={opt} className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => { onChange(opt); setOpen(false); }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function AFField({ def, value, onChange }: { def: AFFieldDef; value: string; onChange: (v: string) => void }) {
  if (def.type === 'date')     return <AFDate     label={def.label} value={value} onChange={onChange} />;
  if (def.type === 'dropdown') return <AFDropdown label={def.label} value={value} options={def.options} onChange={onChange} />;
  return                              <AFInput    label={def.label} value={value} onChange={onChange} />;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Approved':            { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Closed':              { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Submitted':           { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Payment Pending':     { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'VAT Payment Pending': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Declined':            { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':           { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

export type ColConfig = { label: string; key: string; width: number; isLink?: boolean };
export type RowData   = Record<string, string>;

type Props = {
  title: string;
  breadcrumb: string;
  onBack: () => void;
  primaryLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchFields?: string[];
  advancedFilterFields?: AFFieldDef[];
  columns: ColConfig[];
  rows: RowData[];
  hasDraftsToggle?: boolean;
  onNewRequest?: () => void;
  onViewRequest?: (row: RowData) => void;
  onMakePayment?: (row: RowData) => void;
};

export default function ServiceListingPage({
  title, breadcrumb, onBack, primaryLabel,
  searchLabel, searchPlaceholder, searchFields, advancedFilterFields,
  columns, rows, hasDraftsToggle, onNewRequest, onViewRequest, onMakePayment,
}: Props) {
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(8);
  const [search, setSearch]               = useState('');
  const [openFlyout, setOpenFlyout]       = useState<number | null>(null);
  const [showDrafts, setShowDrafts]       = useState(false);
  const [activeField, setActiveField]     = useState(searchFields?.[0] ?? searchLabel);
  const [fieldDropOpen, setFieldDropOpen] = useState(false);

  /* Advanced filter — generic keyed state, populated from advancedFilterFields */
  const [afOpen,   setAfOpen]   = useState(false);
  const [afValues, setAfValues] = useState<Record<string, string>>({});
  const setAF = (key: string, val: string) => setAfValues(prev => ({ ...prev, [key]: val }));
  const resetAF = () => setAfValues({});
  const hasAF = !!advancedFilterFields?.length;

  const paginated = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} />
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-8">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[8px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span
              className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors"
              onClick={onBack}
            >
              Home
            </span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span
              className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors"
              onClick={onBack}
            >
              Service Catalog
            </span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">{breadcrumb}</span>
          </div>
          <div
            className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]"
            style={{ background: '#e2ebf9', fontFamily: font }}
          >
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        {/* Page title */}
        <h1
          className="text-[28px] font-bold text-[#0e1b3d] mb-[20px]"
          style={{ fontFamily: font }}
        >
          {title}
        </h1>

        {/* Toolbar */}
        <div className="flex items-center gap-[10px] mb-[12px] flex-wrap">
          {/* Advance Filters */}
          <button
            onClick={() => hasAF && setAfOpen(o => !o)}
            className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
              hasAF && afOpen
                ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]'
                : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
            }`}
            style={{ fontFamily: font }}
          >
            Advance Filters
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
            </svg>
          </button>

          {/* Search bar */}
          <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-visible relative">
            {/* Left label / field selector */}
            <div
              className="flex items-center gap-[6px] px-[12px] border-r border-[#d5ddfb] select-none min-w-[180px]"
              style={{ cursor: searchFields ? 'pointer' : 'default' }}
              onClick={() => searchFields && setFieldDropOpen(o => !o)}
            >
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>
                {activeField}
              </span>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Field dropdown */}
              {searchFields && fieldDropOpen && (
                <div
                  className="absolute left-0 top-[50px] bg-white rounded-[8px] py-[4px] z-[200]"
                  style={{ minWidth: 200, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                  onClick={e => e.stopPropagation()}
                >
                  {searchFields.map(f => (
                    <button
                      key={f}
                      className="w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] group transition-colors"
                      onClick={() => { setActiveField(f); setSearch(''); setFieldDropOpen(false); }}
                    >
                      <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{f}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center px-[12px] gap-[8px]">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-[180px] text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none"
                style={{ fontFamily: font }}
              />
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#8f94ae" strokeWidth="1.8">
                <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Status dropdown */}
          <button
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            Status
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Need Help */}
          <button
            className="flex items-center gap-[6px] text-[16px] text-[#1360d2] hover:opacity-80 px-[8px]"
            style={{ fontFamily: font }}
          >
            Need Help
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 14v-1" strokeLinecap="round" />
              <path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Reports */}
          <button
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            Reports
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Primary action */}
          <button
            className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            onClick={onNewRequest}
          >
            {primaryLabel}
          </button>
        </div>

        {/* Advanced Filters panel — opens above status row, pushing it and table down */}
        {hasAF && afOpen && (
          <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[12px]"
            style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
            {/* Close — top RIGHT */}
            <button onClick={() => setAfOpen(false)}
              className="absolute top-3 right-3 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            {/* Fields + Search/Reset all in the same grid */}
            <div className="grid grid-cols-4 gap-4 pt-2">
              {advancedFilterFields!.map(def => (
                <AFField key={def.key} def={def} value={afValues[def.key] ?? ''} onChange={v => setAF(def.key, v)} />
              ))}
              {/* Search & Reset together in one grid cell */}
              <div className="flex gap-2 self-end">
                <button className="h-[44px] px-5 rounded-[4px] text-[15px] text-white"
                  style={{ background: '#1360d2', fontFamily: font }}>
                  Search
                </button>
                <button onClick={resetAF}
                  className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]"
                  style={{ fontFamily: font }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date filter row */}
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex-1 flex justify-center">
            <div
              className="inline-flex items-center gap-[10px] h-[44px] px-[24px] rounded-[8px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d]"
              style={{ fontFamily: font }}
            >
              <span>Status As On 28-Dec-22 To 10-Jan-23</span>
              <button className="text-[#1360d2] font-medium hover:opacity-80 ml-[6px]">Modify</button>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
                <rect x="3" y="4" width="14" height="13" rx="2" />
                <path d="M3 8h14M7 2v4M13 2v4" />
              </svg>
            </div>
          </div>
          {hasDraftsToggle && (
            <div className="flex items-center gap-[8px] ml-[16px]">
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Drafts</span>
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                className="relative inline-flex h-[24px] w-[44px] rounded-full transition-colors"
                style={{ background: showDrafts ? '#1360d2' : '#d5ddfb' }}
              >
                <span
                  className="inline-block size-[20px] rounded-full bg-white shadow transition-transform mt-[2px]"
                  style={{ transform: showDrafts ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-[20px]">
          <table
            style={{
              width: 'max-content',
              minWidth: '100%',
              tableLayout: 'auto',
              borderCollapse: 'separate',
              borderSpacing: '0 8px',
              fontFamily: font,
            }}
          >
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    style={{
                      background: '#a6c2e9',
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: 500,
                      borderTopLeftRadius:    i === 0 ? 8 : 0,
                      borderBottomLeftRadius: i === 0 ? 8 : 0,
                      paddingLeft: i === 0 ? 16 : 12,
                      minWidth: col.width ?? 150,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                  </th>
                ))}
                {/* Status col — sticky right */}
                <th style={{
                  background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500,
                  position: 'sticky', right: 72, minWidth: 160, width: 160,
                  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                }}>
                  <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">Request Status</span>
                </th>
                {/* Actions col — sticky right */}
                <th style={{
                  background: '#a6c2e9', padding: '10px 12px', textAlign: 'center',
                  borderTopRightRadius: 8, borderBottomRightRadius: 8,
                  position: 'sticky', right: 0, minWidth: 72, width: 72, zIndex: 2,
                }}>
                  <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => {
                const st = STATUS_STYLE[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                return (
                  <tr key={i}>
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        style={{
                          background: '#fff',
                          padding: '0 12px',
                          height: 54,
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff',
                          paddingLeft: ci === 0 ? 16 : 12,
                          minWidth: col.width ?? 150,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">{row[col.key]}</span>
                      </td>
                    ))}

                    {/* Status badge — sticky */}
                    <td style={{
                      background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle',
                      borderBottom: '1px solid #f0f4ff',
                      position: 'sticky', right: 72, width: 160, minWidth: 160,
                      boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                      zIndex: openFlyout === i ? 49 : 1,
                    }}>
                      <div className="flex items-center gap-[6px]">
                        <span
                          className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                          style={{ background: st.bg, color: st.color, fontFamily: font }}
                        >
                          {row.status}
                        </span>
                        {row.status === 'Declined' && (
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
                            <circle cx="10" cy="10" r="7.5" />
                            <path d="M10 7v4" strokeLinecap="round" />
                            <circle cx="10" cy="14" r="0.8" fill="#1360d2" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Actions — sticky */}
                    <td style={{
                      background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle',
                      borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                      position: 'sticky', right: 0, width: 72, minWidth: 72,
                      zIndex: openFlyout === i ? 50 : 1,
                    }}>
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                          className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors"
                        >
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                            <circle cx="10" cy="4"  r="1.7" />
                            <circle cx="10" cy="10" r="1.7" />
                            <circle cx="10" cy="16" r="1.7" />
                          </svg>
                        </button>
                        {openFlyout === i && (
                          <div
                            className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                            style={{ top: 36, width: 168, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                          >
                            {(onMakePayment
                              ? [
                                  { label: 'View Request',   action: () => { if (onViewRequest) onViewRequest(row); } },
                                  { label: 'Make Payment',   action: () => onMakePayment(row) },
                                  { label: 'Amend Request',  action: () => {} },
                                  { label: 'Cancel Request', action: () => {} },
                                ]
                              : [
                                  { label: 'View Request',   action: () => { if (onViewRequest) onViewRequest(row); } },
                                  { label: 'Amend Request',  action: () => {} },
                                  { label: 'Cancel Request', action: () => {} },
                                ]
                            ).map(item => (
                              <button
                                key={item.label}
                                className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => { setOpenFlyout(null); item.action(); }}
                              >
                                <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(rows.length / pageSize))}
            pageSize={pageSize}
            totalItems={rows.length}
            onPageChange={setPage}
            onPageSizeChange={s => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}
