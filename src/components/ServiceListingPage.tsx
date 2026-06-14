import { useState } from 'react';
import Header from './Header';
import Pagination from './Pagination';

const font = "'Dubai', sans-serif";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
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
  columns: ColConfig[];
  rows: RowData[];
  hasDraftsToggle?: boolean;
};

export default function ServiceListingPage({
  title, breadcrumb, onBack, primaryLabel,
  searchLabel, searchPlaceholder,
  columns, rows, hasDraftsToggle,
}: Props) {
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(8);
  const [search, setSearch]         = useState('');
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [showDrafts, setShowDrafts] = useState(false);

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
          <div className="flex items-center gap-[4px] text-[14px]" style={{ fontFamily: font }}>
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
            className="px-[16px] py-[5px] rounded-[4px] text-[14px] text-[#0e1b3d]"
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
            className="h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            Advance Filters
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
            </svg>
          </button>

          {/* Search bar */}
          <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden">
            <div className="flex items-center gap-[6px] px-[12px] border-r border-[#d5ddfb] cursor-pointer select-none min-w-[160px]">
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>
                {searchLabel}
              </span>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
          >
            {primaryLabel}
          </button>
        </div>

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
              width: '100%',
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
                      width: col.width,
                      minWidth: col.width,
                      borderTopLeftRadius:    i === 0 ? 8 : 0,
                      borderBottomLeftRadius: i === 0 ? 8 : 0,
                      paddingLeft: i === 0 ? 16 : 12,
                    }}
                  >
                    <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                  </th>
                ))}
                {/* Status col */}
                <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, minWidth: 170 }}>
                  <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">Request Status</span>
                </th>
                {/* Actions col */}
                <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 80, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
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
                        }}
                      >
                        {col.isLink ? (
                          <a className="text-[16px] text-[#1360d2] underline cursor-pointer whitespace-nowrap">
                            {row[col.key]}
                          </a>
                        ) : (
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row[col.key]}</span>
                        )}
                      </td>
                    ))}

                    {/* Status badge */}
                    <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                      <div className="flex items-center gap-[6px]">
                        <span
                          className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[14px] font-medium whitespace-nowrap"
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

                    {/* Actions */}
                    <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center' }}>
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
                            style={{ top: 36, width: 160, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                          >
                            {['View', 'Edit', 'Download'].map(item => (
                              <button
                                key={item}
                                className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => setOpenFlyout(null)}
                              >
                                <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>
                                  {item}
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
