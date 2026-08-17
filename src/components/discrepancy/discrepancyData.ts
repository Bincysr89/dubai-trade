export type ReconciliationType = 'loadList' | 'discharge';

/** Per-row workflow state — shown in the "Action Status" column. */
export type ActionStatus = 'Feedback Submitted' | 'Discrepancy Closed' | 'Additional Information Requested';

/** System-level discrepancy state — Advance Filters "Discrepancy Status" only, not a column. */
export type DiscrepancyStatus = 'Discrepancy Exists' | 'Discrepancy Exists - Escalated' | 'Discrepancy Ignored by Customs' | 'Discrepancy Resolved';

export type CommentEntry = {
  createdBy: string;
  createdDate: string; // "31/07/2026 08:10"
  comment: string;
};

export type DiscrepancyRow = {
  id: string;
  rotationNo: string;
  type: ReconciliationType;

  // Load List - Export Manifest columns
  loadedInfoContainerNo: string;
  exportManifestContainerNo: string;
  exportManifestBolNo: string;
  discrepancyValueLoaded: string;
  discrepancyValueManifest: string;

  // Discharge List - Import Manifest columns
  dischargeListContainerNo: string;
  inboundManifestContainerNo: string;
  inboundManifestBolNo: string;
  inboundManifestMrn: string;
  discrepancyDischargeList: string;
  discrepancyInboundManifest: string;

  // Shared
  attribute: string;
  description: string;
  status: ActionStatus;

  // Advance-filter-only fields (not rendered as table columns)
  discrepancyType: string;
  discrepancyStatus: DiscrepancyStatus;
  discrepancyDate: string; // 'YYYY-MM-DD'

  conversation: CommentEntry[];
};

export type RotationGroup = {
  rotationNo: string;
  type: ReconciliationType;
  rows: DiscrepancyRow[];
};

export const ACTION_STATUS_COLORS: Record<ActionStatus, { bg: string; color: string }> = {
  'Feedback Submitted':               { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Discrepancy Closed':               { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Additional Information Requested': { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

export const LOAD_LIST_DISCREPANCY_TYPES = [
  'Container not Found in Load List',
  'Container not Found in Manifest',
  'Discharge Port mismatch',
  'LCL BOL Manifest Not Found against Stuffing Tally',
  'Manifest Not Found against General Cargo Loaded',
  'Manifested Cargo not found in General Cargo Loaded',
  'No. Of Packages mismatch between LCL BOL & S.Tally',
  'No. Of Packages mismatch for General Cargo',
  'Stuffing Tally Not found for LCL Manifested Cargo',
  'Weight Mismatch for General Cargo',
];

export const DISCHARGE_DISCREPANCY_TYPES = [
  'Container category mismatch',
  'Container Record Not Found in Discharge List',
  'Container Record Not Found in Import Manifest',
  'Discharge Port Mismatch',
  'LCL Container - Only Single BOL Found',
];

export const DISCREPANCY_STATUS_OPTIONS: DiscrepancyStatus[] = [
  'Discrepancy Exists',
  'Discrepancy Exists - Escalated',
  'Discrepancy Ignored by Customs',
  'Discrepancy Resolved',
];

/* ── Mock rotation groups ─────────────────────────────────────────────── */
let seq = 0;
const nextId = () => `disc-${++seq}`;

function loadListRow(partial: {
  rotationNo: string;
  exportManifestContainerNo: string;
  exportManifestBolNo: string;
  status: ActionStatus;
  discrepancyStatus: DiscrepancyStatus;
  discrepancyDate: string;
  conversation?: CommentEntry[];
}): DiscrepancyRow {
  return {
    id: nextId(),
    rotationNo: partial.rotationNo,
    type: 'loadList',
    loadedInfoContainerNo: '',
    exportManifestContainerNo: partial.exportManifestContainerNo,
    exportManifestBolNo: partial.exportManifestBolNo,
    discrepancyValueLoaded: '',
    discrepancyValueManifest: partial.exportManifestContainerNo,
    dischargeListContainerNo: '', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '',
    discrepancyDischargeList: '', discrepancyInboundManifest: '',
    attribute: 'Container Number',
    description: 'Container not Found in Load List',
    status: partial.status,
    discrepancyType: 'Container not Found in Load List',
    discrepancyStatus: partial.discrepancyStatus,
    discrepancyDate: partial.discrepancyDate,
    conversation: partial.conversation ?? [],
  };
}

function dischargeRow(partial: {
  rotationNo: string;
  dischargeListContainerNo: string;
  inboundManifestContainerNo: string;
  inboundManifestBolNo: string;
  inboundManifestMrn: string;
  description: string;
  discrepancyType: string;
  status: ActionStatus;
  discrepancyStatus: DiscrepancyStatus;
  discrepancyDate: string;
  conversation?: CommentEntry[];
}): DiscrepancyRow {
  return {
    id: nextId(),
    rotationNo: partial.rotationNo,
    type: 'discharge',
    loadedInfoContainerNo: '', exportManifestContainerNo: '', exportManifestBolNo: '',
    discrepancyValueLoaded: '', discrepancyValueManifest: '',
    dischargeListContainerNo: partial.dischargeListContainerNo,
    inboundManifestContainerNo: partial.inboundManifestContainerNo,
    inboundManifestBolNo: partial.inboundManifestBolNo,
    inboundManifestMrn: partial.inboundManifestMrn,
    discrepancyDischargeList: partial.dischargeListContainerNo,
    discrepancyInboundManifest: partial.inboundManifestContainerNo,
    attribute: 'Container Number',
    description: partial.description,
    status: partial.status,
    discrepancyType: partial.discrepancyType,
    discrepancyStatus: partial.discrepancyStatus,
    discrepancyDate: partial.discrepancyDate,
    conversation: partial.conversation ?? [],
  };
}

export const ROTATION_GROUPS: RotationGroup[] = [
  {
    rotationNo: '5289596',
    type: 'loadList',
    rows: [
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU405767', exportManifestBolNo: '910892340', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-20' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU421393', exportManifestBolNo: '910892344', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-20' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU421393', exportManifestBolNo: '910892342', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-18' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU421393', exportManifestBolNo: '910892343', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists - Escalated', discrepancyDate: '2026-07-21' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU421393', exportManifestBolNo: '910892340', status: 'Additional Information Requested', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-22',
        conversation: [{ createdBy: 'CUSTOMS02', createdDate: '22/07/2026 10:05', comment: 'Please confirm the correct container number with the shipping line.' }] }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU421393', exportManifestBolNo: '910892341', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-15' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU405767', exportManifestBolNo: '910892343', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-23' }),
      loadListRow({ rotationNo: '5289596', exportManifestContainerNo: 'MAEU405767', exportManifestBolNo: '910892344', status: 'Discrepancy Ignored by Customs' as ActionStatus, discrepancyStatus: 'Discrepancy Ignored by Customs', discrepancyDate: '2026-07-16' }),
    ],
  },
  {
    rotationNo: 'LL-882134',
    type: 'loadList',
    rows: [
      loadListRow({ rotationNo: 'LL-882134', exportManifestContainerNo: 'TCLU998123', exportManifestBolNo: '820489001', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-10' }),
      loadListRow({ rotationNo: 'LL-882134', exportManifestContainerNo: 'TCLU998124', exportManifestBolNo: '820489002', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-09' }),
    ],
  },
  {
    rotationNo: '5289596',
    type: 'discharge',
    rows: [
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT69', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-20' }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT38', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-14' }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT26', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-13' }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT65', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-21' }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT66', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists - Escalated', discrepancyDate: '2026-07-22' }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: '', inboundManifestContainerNo: 'CONT800056', inboundManifestBolNo: 'BOL04274031741010050', inboundManifestMrn: '04274031', description: 'Container Record Not Found in Discharge List', discrepancyType: 'Container Record Not Found in Discharge List', status: 'Additional Information Requested', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-23',
        conversation: [{ createdBy: 'CUSTOMS01', createdDate: '23/07/2026 09:12', comment: 'Please provide the discharge list entry for this container.' }] }),
      dischargeRow({ rotationNo: '5289596', dischargeListContainerNo: 'CONT70', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container Record Not Found in Import Manifest', discrepancyType: 'Container Record Not Found in Import Manifest', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-24' }),
    ],
  },
  {
    rotationNo: 'DL-990211',
    type: 'discharge',
    rows: [
      dischargeRow({ rotationNo: 'DL-990211', dischargeListContainerNo: 'CONT91', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Container category mismatch', discrepancyType: 'Container category mismatch', status: 'Feedback Submitted', discrepancyStatus: 'Discrepancy Exists', discrepancyDate: '2026-07-11' }),
      dischargeRow({ rotationNo: 'DL-990211', dischargeListContainerNo: 'CONT92', inboundManifestContainerNo: '', inboundManifestBolNo: '', inboundManifestMrn: '', description: 'Discharge Port Mismatch', discrepancyType: 'Discharge Port Mismatch', status: 'Discrepancy Closed', discrepancyStatus: 'Discrepancy Resolved', discrepancyDate: '2026-07-10' }),
    ],
  },
];
