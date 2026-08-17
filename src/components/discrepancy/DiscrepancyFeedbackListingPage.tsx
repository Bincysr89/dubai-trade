import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../Header';
import DTSelect from '../DTSelect';
import StatusFilterHeader from '../StatusFilterHeader';
import ManageColumnsModal, { type ColDef } from '../ManageColumnsModal';
import { DateInputOutlined, DateRangeCalendar, fmtDate } from '../DatePicker';
import Pagination from '../Pagination';
import DiscrepancyFeedbackFormPage from './DiscrepancyFeedbackFormPage';
import {
  ROTATION_GROUPS, ACTION_STATUS_COLORS, LOAD_LIST_DISCREPANCY_TYPES, DISCHARGE_DISCREPANCY_TYPES, DISCREPANCY_STATUS_OPTIONS,
  type RotationGroup, type DiscrepancyRow, type ActionStatus, type DiscrepancyStatus, type ReconciliationType,
} from './discrepancyData';

const font = "'Dubai', sans-serif";
const PAGE_SIZE = 5;

const LOAD_LIST_COLUMNS: ColDef[] = [
  { key: 'loadedInfoContainerNo', label: 'Loaded Information Container No.' },
  { key: 'exportManifestContainerNo', label: 'Export Manifest Container No.' },
  { key: 'exportManifestBolNo', label: 'Export Manifest BOL No.' },
  { key: 'attribute', label: 'Discrepancy Attribute' },
  { key: 'discrepancyValueLoaded', label: 'Discrepancy Value in Loaded Information' },
  { key: 'discrepancyValueManifest', label: 'Discrepancy Value in Manifest' },
  { key: 'description', label: 'Discrepancy Description' },
];
const DISCHARGE_COLUMNS: ColDef[] = [
  { key: 'dischargeListContainerNo', label: 'Discharge List Container No.' },
  { key: 'inboundManifestContainerNo', label: 'Inbound Manifest Container No.' },
  { key: 'inboundManifestBolNo', label: 'Inbound Manifest BOL No.' },
  { key: 'inboundManifestMrn', label: 'Inbound Manifest MRN' },
  { key: 'attribute', label: 'Discrepancy Attribute' },
  { key: 'discrepancyDischargeList', label: 'Discrepancy Discharge List' },
  { key: 'discrepancyInboundManifest', label: 'Discrepancy Inbound Manifest' },
  { key: 'description', label: 'Discrepancy Description' },
];
const LOCKED_COLUMNS: ColDef[] = [{ key: 'status', label: 'Action Status' }];

const ACTION_STATUS_OPTIONS: ActionStatus[] = ['Feedback Submitted', 'Discrepancy Closed', 'Additional Information Requested'];
const ACTION_STATUS_DOT_COLOR: Record<ActionStatus, string> = {
  'Feedback Submitted': '#1360d2',
  'Discrepancy Closed': '#28a745',
  'Additional Information Requested': '#b45309',
};

type SearchType = 'Rotation Number' | 'BOL Number' | 'MRN Number';

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

/* ── "Discrepancy As On {from} To {to} [Modify]" — same pattern as StatusAsOnBadge, different label ── */
function DiscrepancyAsOnBadge({ fromValue, toValue, onApply }: { fromValue: string; toValue: string; onApply: (from: string, to: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <div className="inline-flex items-center gap-[8px] h-[40px] px-[20px] rounded-[8px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.6">
          <rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
        <span>Discrepancy As On {fmtDate(fromValue)} To {fmtDate(toValue)}</span>
        <button type="button" onClick={() => setOpen(o => !o)} className="text-[#1360d2] font-medium hover:opacity-70 flex items-center gap-1">
          Modify
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.6">
            <path d="M14 3l3 3-10 10H4v-3L14 3z" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', zIndex: 600, background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5', padding: 20, boxShadow: '0 8px 32px rgba(14,27,61,0.16)' }}>
          <DateRangeCalendar fromValue={fromValue} toValue={toValue} onApply={(from, to) => { onApply(from, to); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

const ACTION_STATUS_COL_W = 220;
const COMMENT_COL_W = 200;

/* ── One rotation's expandable card — owns its own pagination ───────────── */
function RotationCard({ group, index, isOpen, onToggle, columns, selectedIds, toggleRow, toggleGroupSelectAll, onComment, statusFilter, onStatusFilterChange }: {
  group: RotationGroup;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  columns: ColDef[];
  selectedIds: Set<string>;
  toggleRow: (id: string) => void;
  toggleGroupSelectAll: (g: RotationGroup) => void;
  onComment: (r: DiscrepancyRow) => void;
  statusFilter: ActionStatus | null;
  onStatusFilterChange: (v: ActionStatus | null) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const openDiscrepancyCount = group.rows.filter(r => r.discrepancyStatus === 'Discrepancy Exists' || r.discrepancyStatus === 'Discrepancy Exists - Escalated').length;
  const groupAllSelected = group.rows.length > 0 && group.rows.every(r => selectedIds.has(r.id));
  const totalPages = Math.max(1, Math.ceil(group.rows.length / pageSize));
  const pageRows = group.rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-[8px] overflow-hidden transition-colors"
      style={{
        boxShadow: isOpen ? '0px 5px 32px rgba(19,96,210,0.18)' : '0px 5px 32px rgba(143,155,186,0.10)',
        border: `1.5px solid ${isOpen ? '#1360d2' : 'transparent'}`,
      }}>
      {/* Group header */}
      <div className="w-full flex items-center gap-[14px] px-[20px] py-[16px] hover:bg-[#f8fafd] transition-colors">
        <span className="size-[24px] rounded-full inline-flex items-center justify-center flex-shrink-0 text-[13px]"
          style={{ border: '1.5px solid #a1aebe', color: '#455174', fontFamily: font, fontWeight: 600 }}>
          {index + 1}
        </span>
        <button onClick={onToggle} className="flex items-center gap-[14px] flex-1 min-w-0 text-left">
          <span className="text-[17px] text-[#1360d2] whitespace-nowrap" style={{ fontFamily: font, fontWeight: 700 }}>
            Rotation No. : {group.rotationNo}
          </span>
          <span className="text-[15px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>
            {group.rows.length} discrepanc{group.rows.length === 1 ? 'y' : 'ies'}
          </span>
          {openDiscrepancyCount > 0 && (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: 'rgba(180,83,9,0.10)', color: '#b45309', fontFamily: font }}>
              <WarningIcon />
              {openDiscrepancyCount} action required
            </span>
          )}
        </button>
        <button
          onClick={() => {}}
          className="h-[36px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors flex-shrink-0"
          style={{ fontFamily: font }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Download
        </button>
        <button type="button" onClick={onToggle} aria-label={isOpen ? 'Collapse' : 'Expand'}
          className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors flex-shrink-0"
          style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Expanded table + pagination */}
      {isOpen && (
        <>
          <div className="overflow-x-auto" style={{ borderTop: '1px solid #eef1f6' }}>
            <table style={{ width: '100%', minWidth: 1300, borderCollapse: 'collapse', fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="px-[16px] py-[10px]" style={{ width: 40 }}>
                    <input type="checkbox" checked={groupAllSelected} onChange={() => toggleGroupSelectAll(group)} className="size-[16px] accent-[#1360d2] cursor-pointer" />
                  </th>
                  {columns.map(c => (
                    <th key={c.key} className="text-left px-[12px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>
                      {c.label}
                    </th>
                  ))}
                  <th
                    className="text-left px-[12px] py-[10px] whitespace-nowrap"
                    style={{ position: 'sticky', right: COMMENT_COL_W, width: ACTION_STATUS_COL_W, minWidth: ACTION_STATUS_COL_W, background: '#a6c2e9', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}
                  >
                    <StatusFilterHeader label="Action Status" options={ACTION_STATUS_OPTIONS} value={statusFilter} onChange={v => onStatusFilterChange(v as ActionStatus | null)} colorMap={ACTION_STATUS_DOT_COLOR} />
                  </th>
                  <th
                    className="text-center px-[12px] py-[10px]"
                    style={{ position: 'sticky', right: 0, width: COMMENT_COL_W, minWidth: COMMENT_COL_W, background: '#a6c2e9', zIndex: 2 }}
                  />
                </tr>
              </thead>
              <tbody>
                {pageRows.map(r => {
                  const st = ACTION_STATUS_COLORS[r.status];
                  return (
                    <tr key={r.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                      <td className="px-[16px] py-[12px]">
                        <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleRow(r.id)} className="size-[16px] accent-[#1360d2] cursor-pointer" />
                      </td>
                      {columns.map(c => (
                        <td key={c.key} className="px-[12px] py-[12px] text-[16px] text-[#0e1b3d]" style={{ maxWidth: c.key === 'description' ? 240 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                          {(r as unknown as Record<string, string>)[c.key] || '—'}
                        </td>
                      ))}
                      <td
                        className="px-[12px] py-[12px]"
                        style={{ position: 'sticky', right: COMMENT_COL_W, width: ACTION_STATUS_COL_W, minWidth: ACTION_STATUS_COL_W, background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}
                      >
                        <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                          {r.status}
                        </span>
                      </td>
                      <td
                        className="px-[12px] py-[12px] text-center"
                        style={{ position: 'sticky', right: 0, width: COMMENT_COL_W, minWidth: COMMENT_COL_W, background: '#fff', zIndex: 1 }}
                      >
                        <button
                          onClick={() => onComment(r)}
                          className="inline-flex items-center gap-[5px] text-[16px] text-[#1360d2] hover:underline whitespace-nowrap"
                          style={{ fontFamily: font, fontWeight: 500 }}
                        >
                          <CommentIcon />
                          {r.conversation.length === 0 ? 'Add Comment' : `View / Comment (${r.conversation.length})`}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-[16px] pb-[12px]">
            <Pagination page={page} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={[5, 10, 25]} totalItems={group.rows.length}
              onPageChange={setPage} onPageSizeChange={n => { setPageSize(n); setPage(1); }} />
          </div>
        </>
      )}
    </div>
  );
}

type Props = { onBack: () => void };

export default function DiscrepancyFeedbackListingPage({ onBack }: Props) {
  const [groups, setGroups] = useState<RotationGroup[]>(ROTATION_GROUPS);
  const [reconType, setReconType] = useState<ReconciliationType>('loadList');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['5289596']));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchType, setSearchType] = useState<SearchType>('Rotation Number');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const [statusFilter, setStatusFilter] = useState<ActionStatus | null>(null);

  const [afOpen, setAfOpen] = useState(false);
  const [afDiscrepancyType, setAfDiscrepancyType] = useState('');
  const [afStatus, setAfStatus] = useState('');
  const [afDateFrom, setAfDateFrom] = useState('');
  const [afDateTo, setAfDateTo] = useState('');
  const [appliedDiscrepancyType, setAppliedDiscrepancyType] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');

  const [dateFrom, setDateFrom] = useState('2026-07-01');
  const [dateTo, setDateTo] = useState('2026-08-11');

  const activeColumns = reconType === 'loadList' ? LOAD_LIST_COLUMNS : DISCHARGE_COLUMNS;
  const [visibleCols, setVisibleCols] = useState<string[]>(LOAD_LIST_COLUMNS.map(c => c.key));
  const [manageColsOpen, setManageColsOpen] = useState(false);
  const colLabel: Record<string, string> = Object.fromEntries(activeColumns.map(c => [c.key, c.label]));
  const orderedVisibleCols = activeColumns.filter(c => visibleCols.includes(c.key));

  const [feedbackTarget, setFeedbackTarget] = useState<{ mode: 'multi' | 'single'; rows: DiscrepancyRow[] } | null>(null);

  useEffect(() => {
    if (searchTypeOpen) {
      const close = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchTypeOpen(false); };
      document.addEventListener('mousedown', close);
      return () => document.removeEventListener('mousedown', close);
    }
  }, [searchTypeOpen]);

  const switchTab = (t: ReconciliationType) => {
    setReconType(t);
    setSelectedIds(new Set());
    setSearchText('');
    setSearchType('Rotation Number');
    setStatusFilter(null);
    setAfDiscrepancyType(''); setAfStatus(''); setAfDateFrom(''); setAfDateTo('');
    setAppliedDiscrepancyType(''); setAppliedStatus(''); setAppliedDateFrom(''); setAppliedDateTo('');
    const cols = t === 'loadList' ? LOAD_LIST_COLUMNS : DISCHARGE_COLUMNS;
    setVisibleCols(cols.map(c => c.key));
    const firstOfType = groups.find(g => g.type === t);
    setExpanded(firstOfType ? new Set([firstOfType.rotationNo]) : new Set());
  };

  const filteredGroups = useMemo(() => {
    return groups
      .filter(g => g.type === reconType)
      .map(g => {
        const rows = g.rows.filter(r => {
          if (statusFilter && r.status !== statusFilter) return false;
          if (appliedDiscrepancyType && appliedDiscrepancyType !== 'All' && r.discrepancyType !== appliedDiscrepancyType) return false;
          if (appliedStatus && appliedStatus !== 'All' && r.discrepancyStatus !== appliedStatus) return false;
          if (appliedDateFrom && r.discrepancyDate < appliedDateFrom) return false;
          if (appliedDateTo && r.discrepancyDate > appliedDateTo) return false;
          if (searchText.trim()) {
            const q = searchText.trim().toLowerCase();
            if (searchType === 'Rotation Number') { if (!g.rotationNo.toLowerCase().includes(q)) return false; }
            else if (searchType === 'BOL Number') { if (!r.inboundManifestBolNo.toLowerCase().includes(q)) return false; }
            else { if (!r.inboundManifestMrn.toLowerCase().includes(q)) return false; }
          }
          return true;
        });
        return { ...g, rows };
      })
      .filter(g => g.rows.length > 0);
  }, [groups, reconType, statusFilter, appliedDiscrepancyType, appliedStatus, appliedDateFrom, appliedDateTo, searchText, searchType]);

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
          status: r.status === 'Discrepancy Closed' ? 'Discrepancy Closed' : 'Feedback Submitted',
          conversation: [...r.conversation, { createdBy: 'AE-1019056', createdDate: nowStamp(), comment }],
        };
      }),
    })));
    setSelectedIds(new Set());
  };

  const discrepancyTypeOptions = reconType === 'loadList' ? LOAD_LIST_DISCREPANCY_TYPES : DISCHARGE_DISCREPANCY_TYPES;

  if (feedbackTarget) {
    return (
      <DiscrepancyFeedbackFormPage
        mode={feedbackTarget.mode}
        rows={feedbackTarget.rows}
        onBack={() => setFeedbackTarget(null)}
        onSubmit={(rowIds, comment) => applyFeedback(rowIds, comment)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-8">
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

        <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[20px]" style={{ fontFamily: font }}>
          Provide Discrepancy Feedback
        </h1>

        {/* Toolbar row 1 — Advance Filters, search, status …… Need Help, primary action (mirrors the master listing template) */}
        <div className="flex items-center gap-[12px] mb-[12px] flex-wrap">
          <button
            onClick={() => setAfOpen(o => !o)}
            className={`flex items-center gap-[8px] h-[48px] px-[12px] sm:px-[16px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
              afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#0e1b3d] hover:bg-[#f0f4ff]'
            }`}
            style={{ fontFamily: font }}
          >
            <span className="hidden sm:inline">Advance Filters</span>
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg>
          </button>

          {/* Basic search — plain Rotation Number field for Load List, combined type-dropdown + input for Discharge List */}
          {reconType === 'loadList' ? (
            <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[220px] max-w-[440px]">
              <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search Rotation Number"
                className="flex-1 min-w-0 h-full px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                style={{ fontFamily: font }}
              />
              <span className="flex-shrink-0 px-[12px] flex items-center justify-center text-[#0e1b3d]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="currentColor" />
                </svg>
              </span>
            </div>
          ) : (
            <div ref={searchRef} className="relative flex-1 min-w-[280px] max-w-[480px]">
              <div className="flex items-center bg-white rounded-[4px] h-[48px]" style={{ border: `1px solid ${searchTypeOpen ? '#1360d2' : '#d5ddfb'}` }}>
                <button type="button" onClick={() => setSearchTypeOpen(o => !o)}
                  className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full flex-shrink-0 hover:bg-[#f7faff] transition-colors rounded-l-[4px]">
                  <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{searchType}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.5"
                    style={{ flexShrink: 0, transform: searchTypeOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder={`Search ${searchType}`}
                  className="flex-1 px-[10px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                  style={{ fontFamily: font }}
                />
                <span className="pr-[12px] text-[#0e1b3d] flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="currentColor" /></svg>
                </span>
              </div>
              {searchTypeOpen && (
                <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {(['Rotation Number', 'BOL Number', 'MRN Number'] as SearchType[]).map(opt => (
                    <button key={opt} type="button" onClick={() => { setSearchType(opt); setSearchTypeOpen(false); setSearchText(''); }}
                      className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                      style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === searchType ? 500 : 400 }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-[16px] ml-auto flex-wrap">
            <button className="flex items-center gap-[4px] h-[48px] px-[2px] flex-shrink-0">
              <span className="text-[16px] text-[#2950e5] font-medium" style={{ fontFamily: font }}>Need Help</span>
              <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={() => selectedIds.size > 0 && setFeedbackTarget({ mode: 'multi', rows: selectedRows })}
              disabled={selectedIds.size === 0}
              className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-colors disabled:cursor-not-allowed"
              style={{ background: selectedIds.size > 0 ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500, boxShadow: selectedIds.size > 0 ? '0px 0px 8px 0px rgba(28,72,191,0.16)' : 'none' }}
            >
              Provide Feedback{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
            </button>
          </div>
        </div>

        {/* Advance filters panel */}
        {afOpen && (
          <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[12px]" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
            <button onClick={() => setAfOpen(false)} className="absolute top-3 right-3 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              <DTSelect label="Discrepancy Type" value={afDiscrepancyType} onChange={setAfDiscrepancyType} options={['All', ...discrepancyTypeOptions].map(a => ({ value: a, label: a }))} />
              <DateInputOutlined label="Discrepancy From Date" value={afDateFrom} onChange={setAfDateFrom} />
              <DateInputOutlined label="Discrepancy To Date" value={afDateTo} onChange={setAfDateTo} />
              <DTSelect label="Discrepancy Status" value={afStatus} onChange={setAfStatus} options={['All', ...DISCREPANCY_STATUS_OPTIONS].map(s => ({ value: s, label: s }))} />
              <div className="flex gap-2 self-end">
                <button
                  onClick={() => { setAppliedDiscrepancyType(afDiscrepancyType); setAppliedStatus(afStatus); setAppliedDateFrom(afDateFrom); setAppliedDateTo(afDateTo); }}
                  className="h-[44px] px-5 rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontFamily: font }}>
                  Search
                </button>
                <button
                  onClick={() => { setAfDiscrepancyType(''); setAfStatus(''); setAfDateFrom(''); setAfDateTo(''); setAppliedDiscrepancyType(''); setAppliedStatus(''); setAppliedDateFrom(''); setAppliedDateTo(''); }}
                  className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar row 2 — Discrepancy-as-on date badge (centered) + Columns (right), mirrors the master listing template */}
        <div className="flex items-center justify-end mb-[12px] flex-wrap gap-[12px]">
          <div className="flex-1 flex justify-center min-w-0 overflow-x-auto">
            <DiscrepancyAsOnBadge fromValue={dateFrom} toValue={dateTo} onApply={(f, t) => { setDateFrom(f); setDateTo(t); }} />
          </div>

          <button
            onClick={() => setManageColsOpen(true)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors flex-shrink-0"
            style={{ fontFamily: font }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#0E1B3D" /></svg>
            Columns
          </button>
        </div>

        {/* Reconciliation type tabs — sit directly above the table, mirrors the master listing template */}
        <div className="flex items-center gap-[8px] bg-white rounded-[6px] p-[4px] w-max mb-[16px]"
          style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.16)', border: '1px solid #eef1f6' }}>
          {([
            { key: 'loadList' as ReconciliationType, label: 'Load List - Export Manifest' },
            { key: 'discharge' as ReconciliationType, label: 'Discharge List - Import Manifest' },
          ]).map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => switchTab(t.key)}
              className="text-[15px] px-[18px] py-[9px] rounded-[4px] transition-colors whitespace-nowrap"
              style={reconType === t.key
                ? { background: '#1360d2', color: '#fff', fontWeight: 500, fontFamily: font }
                : { color: '#5a6282', fontFamily: font }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Rotation count */}
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font, fontWeight: 500 }}>
          {filteredGroups.length} Rotation{filteredGroups.length === 1 ? '' : 's'}
        </p>

        {/* Rotation groups */}
        <div className="flex flex-col gap-[12px] pb-[20px]">
          {filteredGroups.length === 0 && (
            <div className="bg-white rounded-[8px] py-[40px] text-center text-[16px] text-[#8f94ae]" style={{ fontFamily: font, boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
              No discrepancies found for the selected filters.
            </div>
          )}
          {filteredGroups.map((g, gIdx) => (
            <RotationCard
              key={g.rotationNo}
              group={g}
              index={gIdx}
              isOpen={expanded.has(g.rotationNo)}
              onToggle={() => toggleExpand(g.rotationNo)}
              columns={orderedVisibleCols}
              selectedIds={selectedIds}
              toggleRow={toggleRow}
              toggleGroupSelectAll={toggleGroupSelectAll}
              onComment={r => setFeedbackTarget({ mode: 'single', rows: [r] })}
              statusFilter={statusFilter}
              onStatusFilterChange={v => setStatusFilter(v)}
            />
          ))}
        </div>
      </div>

      {manageColsOpen && (
        <ManageColumnsModal
          columns={activeColumns}
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
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
