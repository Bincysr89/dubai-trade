import { useMemo, useState, type ReactNode } from 'react';
import Header from '../Header';
import DTSelect from '../DTSelect';
import FloatingField from '../FloatingField';
import ManageColumnsModal, { type ColDef } from '../ManageColumnsModal';
import { DateInputOutlined, StatusAsOnBadge } from '../DatePicker';
import DiscrepancyFeedbackFormPage from './DiscrepancyFeedbackFormPage';
import {
  ROTATION_GROUPS, ACTION_STATUS_COLORS, ACTION_STATUS_LABELS, RECON_TYPE_LABELS, DISCREPANCY_STATUS_OPTIONS, DISCREPANCY_ATTRIBUTE_OPTIONS, columnLabelsFor,
  type RotationGroup, type DiscrepancyRow, type ActionStatus, type ReconciliationType,
} from './discrepancyData';

const font = "'Dubai', sans-serif";

const LOCKED_COLUMNS: ColDef[] = [{ key: 'status', label: 'Action Status' }];

const WarningIcon = ({ color = '#b45309' }: { color?: string }) => (
  <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke={color} strokeWidth="1.8" className="flex-shrink-0">
    <path d="M10 2.5L18 16H2L10 2.5z" strokeLinejoin="round" />
    <path d="M10 8v3.5" strokeLinecap="round" />
    <circle cx="10" cy="13.6" r="0.6" fill={color} />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" className="flex-shrink-0">
    <path d="M3 4h14v9H7l-4 3.5V4z" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="currentColor" />
  </svg>
);

/* ── Reconciliation-type tab button — bordered, fills solid blue when active ── */
function TypeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="h-[48px] px-[20px] flex items-center justify-center rounded-[4px] border text-[16px] transition-colors"
      style={{ fontFamily: font, borderColor: active ? '#1360d2' : '#d5ddfb', background: active ? '#1360d2' : '#fff', color: active ? '#fff' : '#0e1b3d', fontWeight: active ? 500 : 400 }}>
      {children}
    </button>
  );
}

/* ── Small uppercase section divider label used inside the Advance Filters panel ── */
function FilterSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="col-span-full text-[12px] text-[#8f94ae] uppercase mt-[4px]" style={{ fontFamily: font, fontWeight: 600, letterSpacing: '0.6px' }}>
      {children}
    </p>
  );
}

type Props = { onBack: () => void; sidebar?: ReactNode };

export default function DiscrepancyFeedbackListingPage({ onBack, sidebar }: Props) {
  const [groups, setGroups] = useState<RotationGroup[]>(ROTATION_GROUPS);
  const [reconType, setReconType] = useState<ReconciliationType>('Export');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchText, setSearchText] = useState('');

  const [afOpen, setAfOpen] = useState(false);
  // Advance-filter draft fields
  const [dfAttribute, setDfAttribute] = useState('');
  const [dfBol, setDfBol] = useState('');
  const [dfMrn, setDfMrn] = useState('');
  const [dfDateFrom, setDfDateFrom] = useState('2026-07-01');
  const [dfDateTo, setDfDateTo] = useState('2026-08-11');
  const [dfStatus, setDfStatus] = useState('');
  // Applied filters
  const [statusFilter, setStatusFilter] = useState<ActionStatus | null>(null);
  const [attributeFilter, setAttributeFilter] = useState('');
  const [bolFilter, setBolFilter] = useState('');
  const [mrnFilter, setMrnFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-07-01');
  const [dateTo, setDateTo] = useState('2026-08-11');

  const labels = columnLabelsFor(reconType);
  const COLUMNS: ColDef[] = [
    { key: 'dischargeListContainer', label: labels.loaded },
    { key: 'inboundManifestContainer', label: labels.manifest },
    { key: 'bolNo', label: labels.bol },
    { key: 'mrn', label: 'MRN' },
    { key: 'attribute', label: 'Discrepancy Attribute' },
    { key: 'description', label: 'Discrepancy Description' },
  ];
  const colLabel: Record<string, string> = Object.fromEntries(COLUMNS.map(c => [c.key, c.label]));
  const [visibleCols, setVisibleCols] = useState<string[]>(COLUMNS.map(c => c.key));
  const [manageColsOpen, setManageColsOpen] = useState(false);
  const orderedVisibleCols = COLUMNS.filter(c => visibleCols.includes(c.key));

  const [feedbackTarget, setFeedbackTarget] = useState<DiscrepancyRow[] | null>(null);

  const switchTab = (t: ReconciliationType) => {
    setReconType(t);
    setSelectedIds(new Set());
  };

  const applyFilters = () => {
    setAttributeFilter(dfAttribute);
    setBolFilter(dfBol);
    setMrnFilter(dfMrn);
    setDateFrom(dfDateFrom);
    setDateTo(dfDateTo);
    setStatusFilter((dfStatus || null) as ActionStatus | null);
    setSelectedIds(new Set());
  };
  const resetFilters = () => {
    setDfAttribute(''); setDfBol(''); setDfMrn(''); setDfStatus('');
    setAttributeFilter(''); setBolFilter(''); setMrnFilter(''); setStatusFilter(null);
    setSelectedIds(new Set());
  };

  const filteredGroups = useMemo(() => {
    return groups
      .filter(g => g.type === reconType)
      .filter(g => !searchText || g.rotationNo.toLowerCase().includes(searchText.toLowerCase()))
      .map(g => ({
        ...g,
        rows: g.rows.filter(r =>
          !(statusFilter && r.status !== statusFilter) &&
          !(attributeFilter && r.attribute !== attributeFilter) &&
          !(bolFilter && !r.bolNo.toLowerCase().includes(bolFilter.toLowerCase())) &&
          !(mrnFilter && !r.mrn.toLowerCase().includes(mrnFilter.toLowerCase()))
        ),
      }))
      .filter(g => g.rows.length > 0);
  }, [groups, reconType, searchText, statusFilter, attributeFilter, bolFilter, mrnFilter]);

  const allVisibleRows = useMemo(() => filteredGroups.flatMap(g => g.rows), [filteredGroups]);
  const selectedRows = allVisibleRows.filter(r => selectedIds.has(r.id));

  const toggleExpand = (rotationNo: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(rotationNo) ? next.delete(rotationNo) : next.add(rotationNo);
      return next;
    });
  };
  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleGroupSelectAll = (g: RotationGroup) => {
    const ids = g.rows.map(r => r.id);
    const allSelected = ids.every(id => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  };

  const applyFeedback = (rowIds: string[], comment: string) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      rows: g.rows.map(r => {
        if (!rowIds.includes(r.id)) return r;
        return {
          ...r,
          status: r.status === 'Closed' ? 'Closed' : 'Submitted',
          conversation: [...r.conversation, { createdBy: 'AE-1019056', createdDate: nowStamp(), comment }],
        };
      }),
    })));
    setSelectedIds(new Set());
  };

  if (feedbackTarget) {
    return (
      <DiscrepancyFeedbackFormPage
        mode={feedbackTarget.length > 1 ? 'multi' : 'single'}
        rows={feedbackTarget}
        onBack={() => setFeedbackTarget(null)}
        onSubmit={(rowIds, comment) => applyFeedback(rowIds, comment)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto flex px-4 sm:px-10 pb-8 gap-[12px]">
        {sidebar}
        <div className="flex-1 min-w-0">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[8px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Cargo Reconciliation</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font }}>
          Provide Discrepancy Feedback
        </h1>

        {/* Toolbar row 1 — Advance Filters, plain rotation-number search, Need Help, primary action */}
        <div className="flex items-center gap-[10px] mb-[16px] flex-wrap">
          <button
            onClick={() => setAfOpen(o => !o)}
            className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
              afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
            }`}
            style={{ fontFamily: font }}
          >
            Advance Filters
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" /></svg>
          </button>

          <div className="relative" style={{ width: 280 }}>
            <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8f94ae]"><SearchIcon /></span>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search Rotation Number"
              className="h-[48px] w-full rounded-[4px] pl-[38px] pr-[12px] text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none bg-white"
              style={{ fontFamily: font, border: '1px solid #d5ddfb' }}
            />
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2] hover:opacity-80 px-[8px] flex-shrink-0 h-[48px]" style={{ fontFamily: font }}>
            Need Help
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
          </button>
          <button
            onClick={() => selectedIds.size > 0 && setFeedbackTarget(selectedRows)}
            disabled={selectedIds.size === 0}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white transition-colors disabled:cursor-not-allowed"
            style={{ background: selectedIds.size > 0 ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500 }}
          >
            Provide Feedback{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
          </button>
        </div>

        {/* Advance filters panel */}
        {afOpen && (
          <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[12px]" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
            <div className="flex items-center gap-[8px] mb-[16px]">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6"><path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" /></svg>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>Advanced Filters</span>
            </div>
            <button onClick={() => setAfOpen(false)} className="absolute top-3 right-3 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DTSelect label="Discrepancy Type" value={dfAttribute} onChange={setDfAttribute} options={DISCREPANCY_ATTRIBUTE_OPTIONS.map(a => ({ value: a, label: a }))} />
              <DTSelect label="Discrepancy Status" value={dfStatus} onChange={setDfStatus} options={DISCREPANCY_STATUS_OPTIONS.map(s => ({ value: s, label: ACTION_STATUS_LABELS[s] }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FilterSectionLabel>Reference Numbers</FilterSectionLabel>
              <FloatingField label={labels.bol} placeholder="e.g. BOL900131" value={dfBol} onChange={setDfBol} />
              <FloatingField label="MRN" placeholder="e.g. 1900131" value={dfMrn} onChange={setDfMrn} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FilterSectionLabel>Date Range</FilterSectionLabel>
              <DateInputOutlined label="From Date" value={dfDateFrom} onChange={setDfDateFrom} />
              <DateInputOutlined label="To Date" value={dfDateTo} onChange={setDfDateTo} />
            </div>

            <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1px solid #eef1f6' }}>
              <button onClick={applyFilters} className="h-[44px] px-5 rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontFamily: font }}>Search</button>
              <button onClick={resetFilters} className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>Reset</button>
            </div>
          </div>
        )}

        {/* Toolbar row 2 — Discrepancy-as-on date badge (centered) + Columns (right) */}
        <div className="flex items-center gap-[10px] mb-[16px]">
          <div className="flex-1 flex justify-center">
            <StatusAsOnBadge label="Discrepancy" fromValue={dateFrom} toValue={dateTo}
              onApply={(f, t) => { setDateFrom(f); setDateTo(t); setDfDateFrom(f); setDfDateTo(t); }} />
          </div>
          <button
            onClick={() => setManageColsOpen(true)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#0E1B3D" /></svg>
            Columns
          </button>
        </div>

        {/* Reconciliation type tabs */}
        <div className="flex items-center gap-[12px] mb-[16px]">
          <TypeTab active={reconType === 'Export'} onClick={() => switchTab('Export')}>{RECON_TYPE_LABELS.Export}</TypeTab>
          <TypeTab active={reconType === 'Import'} onClick={() => switchTab('Import')}>{RECON_TYPE_LABELS.Import}</TypeTab>
        </div>

        {/* Rotation count */}
        <div className="mb-[12px]">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
            {filteredGroups.length} Rotation{filteredGroups.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Rotation groups */}
        <div className="flex flex-col gap-[12px] pb-[20px]">
          {filteredGroups.length === 0 && (
            <div className="bg-white rounded-[8px] py-[40px] text-center text-[16px] text-[#8f94ae]" style={{ fontFamily: font, boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
              No discrepancies found for the selected filters.
            </div>
          )}
          {filteredGroups.map((g, gIdx) => {
            const isOpen = expanded.has(g.rotationNo);
            const actionRequiredCount = g.rows.filter(r => r.status === 'Action Required').length;
            const groupAllSelected = g.rows.length > 0 && g.rows.every(r => selectedIds.has(r.id));
            return (
              <div key={g.rotationNo} className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
                <div className="w-full flex items-center gap-[14px] px-[20px] py-[16px] hover:bg-[#f8fafd] transition-colors">
                  <button onClick={() => toggleExpand(g.rotationNo)} className="flex items-center gap-[14px] flex-1 min-w-0 text-left">
                    <span className="size-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[13px] text-[#455174]" style={{ border: '1px solid #d5ddfb', fontFamily: font, fontWeight: 600 }}>
                      {gIdx + 1}
                    </span>
                    <span className="text-[17px] text-[#1360d2] whitespace-nowrap" style={{ fontFamily: font, fontWeight: 600 }}>
                      Rotation No. : {g.rotationNo}
                    </span>
                    <span className="text-[15px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>
                      {g.rows.length} discrepanc{g.rows.length === 1 ? 'y' : 'ies'}
                    </span>
                    {actionRequiredCount > 0 && (
                      <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium whitespace-nowrap" style={{ background: 'rgba(180,83,9,0.10)', color: '#b45309', fontFamily: font }}>
                        <WarningIcon />
                        {actionRequiredCount} action required
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {}}
                    className="h-[36px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[14px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors flex-shrink-0"
                    style={{ fontFamily: font }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Download
                  </button>
                  <button onClick={() => toggleExpand(g.rotationNo)} className="flex-shrink-0 p-[4px]" aria-label={isOpen ? 'Collapse' : 'Expand'}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.2" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  <div className="overflow-x-auto" style={{ borderTop: '1px solid #eef1f6' }}>
                    <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'collapse', fontFamily: font }}>
                      <thead>
                        <tr style={{ background: '#e2ebf9' }}>
                          <th className="px-[16px] py-[10px]" style={{ width: 40 }}>
                            <input type="checkbox" checked={groupAllSelected} onChange={() => toggleGroupSelectAll(g)} className="size-[16px] cursor-pointer" />
                          </th>
                          {orderedVisibleCols.map(c => (
                            <th key={c.key} className="text-left px-[12px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>
                              {c.label}
                            </th>
                          ))}
                          <th className="text-left px-[12px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>Action Status</th>
                          <th className="text-center px-[12px] py-[10px] text-[14px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.rows.map(r => {
                          const st = ACTION_STATUS_COLORS[r.status];
                          return (
                            <tr key={r.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                              <td className="px-[16px] py-[12px]">
                                <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleRow(r.id)} className="size-[16px] cursor-pointer" />
                              </td>
                              {orderedVisibleCols.map(c => (
                                <td key={c.key} className="px-[12px] py-[12px] text-[14px] text-[#0e1b3d]" style={{ maxWidth: c.key === 'description' ? 240 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                                  {(r as unknown as Record<string, string>)[c.key] ?? ''}
                                </td>
                              ))}
                              <td className="px-[12px] py-[12px]">
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                                  {(r.status === 'Info Requested' || r.status === 'Action Required') && <WarningIcon color={st.color} />}
                                  {ACTION_STATUS_LABELS[r.status]}
                                </span>
                              </td>
                              <td className="px-[12px] py-[12px] text-center">
                                <button onClick={() => setFeedbackTarget([r])} className="inline-flex items-center gap-[5px] text-[14px] text-[#1360d2] hover:underline whitespace-nowrap" style={{ fontFamily: font, fontWeight: 500 }}>
                                  <CommentIcon />
                                  Add Comment
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {manageColsOpen && (
        <ManageColumnsModal
          columns={COLUMNS}
          visible={visibleCols}
          lockedColumns={LOCKED_COLUMNS}
          onSave={cols => setVisibleCols(cols.filter(k => colLabel[k]))}
          onClose={() => setManageColsOpen(false)}
        />
      )}
    </div>
  );
}

function nowStamp() {
  const d = new Date();
  const p2 = (n: number) => String(n).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${p2(d.getDate())}-${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
