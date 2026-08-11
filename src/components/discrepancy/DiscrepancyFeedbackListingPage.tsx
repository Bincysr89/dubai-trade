import { useMemo, useState } from 'react';
import Header from '../Header';
import DTSelect from '../DTSelect';
import StatusFilterHeader from '../StatusFilterHeader';
import ManageColumnsModal, { type ColDef } from '../ManageColumnsModal';
import { StatusAsOnBadge } from '../DatePicker';
import DiscrepancyFeedbackModal from './DiscrepancyFeedbackModal';
import {
  ROTATION_GROUPS, STATUS_COLORS, ATTRIBUTE_OPTIONS,
  type RotationGroup, type DiscrepancyRow, type DiscrepancyStatus, type ReconciliationType,
} from './discrepancyData';

const font = "'Dubai', sans-serif";

const ALL_COLUMNS: ColDef[] = [
  { key: 'type', label: 'Type' },
  { key: 'dischargeListContainer', label: 'Discharge List Container' },
  { key: 'inboundManifestContainer', label: 'Inbound Manifest Container' },
  { key: 'bolNo', label: 'BOL No.' },
  { key: 'mrn', label: 'MRN' },
  { key: 'attribute', label: 'Discrepancy Attribute' },
  { key: 'description', label: 'Description' },
];
const LOCKED_COLUMNS: ColDef[] = [{ key: 'status', label: 'Discrepancy / Action Status' }];

const COL_LABEL: Record<string, string> = Object.fromEntries(ALL_COLUMNS.map(c => [c.key, c.label]));
const STATUS_OPTIONS: DiscrepancyStatus[] = ['Action Required', 'Info Requested', 'Submitted', 'Closed'];
const STATUS_DOT_COLOR: Record<DiscrepancyStatus, string> = {
  'Action Required': '#dc3545',
  'Info Requested': '#ffa91a',
  Submitted: '#1360d2',
  Closed: '#28a745',
};
const worstStatus = (rows: DiscrepancyRow[]): DiscrepancyStatus => {
  const order: DiscrepancyStatus[] = ['Action Required', 'Info Requested', 'Submitted', 'Closed'];
  for (const s of order) if (rows.some(r => r.status === s)) return s;
  return 'Closed';
};

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

type Props = { onBack: () => void };

export default function DiscrepancyFeedbackListingPage({ onBack }: Props) {
  const [groups, setGroups] = useState<RotationGroup[]>(ROTATION_GROUPS);
  const [reconType, setReconType] = useState<ReconciliationType>('Import');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['900131']));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DiscrepancyStatus | null>(null);
  const [afOpen, setAfOpen] = useState(false);
  const [afAttribute, setAfAttribute] = useState('');
  const [afStatus, setAfStatus] = useState('');
  const [appliedAttribute, setAppliedAttribute] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-07-01');
  const [dateTo, setDateTo] = useState('2026-08-11');
  const [visibleCols, setVisibleCols] = useState<string[]>(ALL_COLUMNS.map(c => c.key));
  const [manageColsOpen, setManageColsOpen] = useState(false);
  const [modal, setModal] = useState<{ mode: 'multi' | 'single'; rows: DiscrepancyRow[] } | null>(null);

  const orderedVisibleCols = ALL_COLUMNS.filter(c => visibleCols.includes(c.key));

  const filteredGroups = useMemo(() => {
    return groups
      .filter(g => g.type === reconType)
      .map(g => {
        const rows = g.rows.filter(r => {
          if (statusFilter && r.status !== statusFilter) return false;
          if (appliedAttribute && r.attribute !== appliedAttribute) return false;
          if (search) {
            const q = search.toLowerCase();
            if (!(g.rotationNo.toLowerCase().includes(q) || r.bolNo.toLowerCase().includes(q) || r.mrn.toLowerCase().includes(q))) return false;
          }
          return true;
        });
        return { ...g, rows };
      })
      .filter(g => g.rows.length > 0);
  }, [groups, reconType, statusFilter, appliedAttribute, search]);

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

          {/* Basic search — magnifier on the right (app-wide convention) */}
          <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[220px] max-w-[440px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Rotation No. / BOL / MRN"
              className="flex-1 min-w-0 h-full px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
              style={{ fontFamily: font }}
            />
            <button type="button" onClick={() => {}} aria-label="Search" className="flex-shrink-0 px-[12px] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
              </svg>
            </button>
          </div>

          <div className="h-[48px] px-[14px] flex items-center rounded-[4px] border border-[#d5ddfb] bg-white flex-shrink-0">
            <StatusFilterHeader label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={v => setStatusFilter(v as DiscrepancyStatus | null)} colorMap={STATUS_DOT_COLOR} />
          </div>

          <div className="flex items-center gap-[16px] ml-auto flex-wrap">
            <button className="flex items-center gap-[4px] h-[48px] px-[2px] flex-shrink-0">
              <span className="text-[16px] text-[#2950e5] font-medium" style={{ fontFamily: font }}>Need Help</span>
              <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={() => selectedIds.size > 0 && setModal({ mode: 'multi', rows: selectedRows })}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <DTSelect label="Discrepancy Attribute" value={afAttribute} onChange={setAfAttribute} options={ATTRIBUTE_OPTIONS.map(a => ({ value: a, label: a }))} />
              <DTSelect label="Status" value={afStatus} onChange={setAfStatus} options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))} />
              <div className="flex gap-2 self-end">
                <button
                  onClick={() => { setAppliedAttribute(afAttribute); setStatusFilter((afStatus || null) as DiscrepancyStatus | null); }}
                  className="h-[44px] px-5 rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontFamily: font }}>
                  Search
                </button>
                <button
                  onClick={() => { setSearch(''); setAfAttribute(''); setAfStatus(''); setAppliedAttribute(''); setStatusFilter(null); }}
                  className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar row 2 — Import/Export toggle (left) + Status-as-on date badge (centered) + Columns (right), mirrors the master listing template */}
        <div className="flex items-center justify-between mb-[12px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[8px] bg-white rounded-[6px] p-[4px] w-max flex-shrink-0"
            style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.16)', border: '1px solid #eef1f6' }}>
            {(['Import', 'Export'] as ReconciliationType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setReconType(t); setSelectedIds(new Set()); }}
                className="text-[15px] px-[18px] py-[9px] rounded-[4px] transition-colors"
                style={reconType === t
                  ? { background: '#1360d2', color: '#fff', fontWeight: 500, fontFamily: font }
                  : { color: '#5a6282', fontFamily: font }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 flex justify-center min-w-0 overflow-x-auto">
            <StatusAsOnBadge fromValue={dateFrom} toValue={dateTo} onApply={(f, t) => { setDateFrom(f); setDateTo(t); }} />
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
          {filteredGroups.map((g, gIdx) => {
            const isOpen = expanded.has(g.rotationNo);
            const actionRequiredCount = g.rows.filter(r => r.status === 'Action Required').length;
            const dotColor = STATUS_DOT_COLOR[worstStatus(g.rows)];
            const groupAllSelected = g.rows.length > 0 && g.rows.every(r => selectedIds.has(r.id));

            return (
              <div key={g.rotationNo} className="bg-white rounded-[8px] overflow-hidden transition-colors"
                style={{
                  boxShadow: isOpen ? '0px 5px 32px rgba(19,96,210,0.18)' : '0px 5px 32px rgba(143,155,186,0.10)',
                  border: `1.5px solid ${isOpen ? '#1360d2' : 'transparent'}`,
                }}>
                {/* Group header */}
                <div className="w-full flex items-center gap-[14px] px-[20px] py-[16px] hover:bg-[#f8fafd] transition-colors">
                  <span className="text-[16px] text-[#455174] flex-shrink-0" style={{ fontFamily: font }}>{gIdx + 1}</span>
                  <button onClick={() => toggleExpand(g.rotationNo)} className="flex items-center gap-[14px] flex-1 min-w-0 text-left">
                    <span className="size-[10px] rounded-full flex-shrink-0" style={{ background: dotColor }} />
                    <span className="text-[17px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font, fontWeight: 600 }}>
                      Rotation No.: {g.rotationNo}
                    </span>
                    <span className="text-[15px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>
                      {g.rows.length} discrepanc{g.rows.length === 1 ? 'y' : 'ies'}
                    </span>
                    {actionRequiredCount > 0 && (
                      <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: 'rgba(180,83,9,0.10)', color: '#b45309', fontFamily: font }}>
                        <WarningIcon />
                        {actionRequiredCount} action required
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
                  <button type="button" onClick={() => toggleExpand(g.rotationNo)} aria-label={isOpen ? 'Collapse' : 'Expand'}
                    className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors flex-shrink-0"
                    style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Expanded table */}
                {isOpen && (
                  <div className="overflow-x-auto" style={{ borderTop: '1px solid #eef1f6' }}>
                    <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'collapse', fontFamily: font }}>
                      <thead>
                        <tr style={{ background: '#a6c2e9' }}>
                          <th className="px-[16px] py-[10px]" style={{ width: 40 }}>
                            <input type="checkbox" checked={groupAllSelected} onChange={() => toggleGroupSelectAll(g)} className="size-[16px] accent-[#1360d2] cursor-pointer" />
                          </th>
                          {orderedVisibleCols.map(c => (
                            <th key={c.key} className="text-left px-[12px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>
                              {c.label}
                            </th>
                          ))}
                          <th className="text-left px-[12px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>
                            Discrepancy / Action Status
                          </th>
                          <th className="text-center px-[12px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.rows.map(r => {
                          const st = STATUS_COLORS[r.status];
                          return (
                            <tr key={r.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                              <td className="px-[16px] py-[12px]">
                                <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleRow(r.id)} className="size-[16px] accent-[#1360d2] cursor-pointer" />
                              </td>
                              {orderedVisibleCols.map(c => (
                                <td key={c.key} className="px-[12px] py-[12px] text-[16px] text-[#0e1b3d]" style={{ maxWidth: c.key === 'description' ? 240 : undefined, whiteSpace: c.key === 'description' ? 'normal' : 'nowrap' }}>
                                  {(r as unknown as Record<string, string>)[c.key] ?? ''}
                                </td>
                              ))}
                              <td className="px-[12px] py-[12px]">
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                                  {(r.status === 'Info Requested' || r.status === 'Action Required') && <WarningIcon color={st.color} />}
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-[12px] py-[12px] text-center">
                                <button
                                  onClick={() => setModal({ mode: 'single', rows: [r] })}
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
                )}
              </div>
            );
          })}
        </div>
      </div>

      {manageColsOpen && (
        <ManageColumnsModal
          columns={ALL_COLUMNS}
          visible={visibleCols}
          lockedColumns={LOCKED_COLUMNS}
          onSave={cols => setVisibleCols(cols.filter(k => COL_LABEL[k]))}
          onClose={() => setManageColsOpen(false)}
        />
      )}

      {modal && (
        <DiscrepancyFeedbackModal
          mode={modal.mode}
          rows={modal.rows}
          onClose={() => setModal(null)}
          onSubmit={(rowIds, comment) => applyFeedback(rowIds, comment)}
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
