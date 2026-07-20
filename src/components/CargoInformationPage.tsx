import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Pagination from './Pagination';
import BackToListingBar from './BackToListingBar';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { DateInput } from './DatePicker';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

/* ─── Sidebar menu ──────────────────────────────────────────────── */
type MenuKey = 'carrierMovement' | 'flightManifest' | 'houseManifest' | 'seaExportManifest' | 'deliveryAdvice';

function MenuIcon({ menu }: { menu: MenuKey }) {
  const common = { width: 20, height: 20, fill: 'none', stroke: '#1360d2', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (menu) {
    case 'carrierMovement':
      return <svg viewBox="0 0 24 24" {...common}><path d="M3 16l1.5-5h15L21 16" /><path d="M5 16v3h14v-3" /><path d="M9 11V6h6v5" /><path d="M2 19h20" /></svg>;
    case 'flightManifest':
      return <svg viewBox="0 0 24 24" {...common}><path d="M10.5 20l1.5-5.5M13.5 20L12 14.5" /><path d="M2 12l8-2 3-7 2 1-1.5 6.5L21 8l1 2-6.5 4L17 20l-2-1-2.5-4.5-4 1L7 18l-1.5-1 1-3.5L2 12z" /></svg>;
    case 'houseManifest':
      return <svg viewBox="0 0 24 24" {...common}><path d="M5 10l7-6 7 6" /><path d="M6 9v10h12V9" /><path d="M10 19v-5h4v5" /></svg>;
    case 'seaExportManifest':
      return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="6" r="2" /><path d="M12 8v7" /><path d="M8 11h8" /><path d="M4 15c1 3 4.5 5 8 5s7-2 8-5" /><path d="M12 20v-1" /></svg>;
    case 'deliveryAdvice':
      return <svg viewBox="0 0 24 24" {...common}><rect x="2" y="8" width="12" height="9" rx="1" /><path d="M14 11h4l3 3v3h-7" /><circle cx="6.5" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>;
  }
}

const SIDEBAR_ITEMS: { key: MenuKey; label: string }[] = [
  { key: 'carrierMovement',   label: 'Carrier Movement' },
  { key: 'flightManifest',    label: 'Flight Manifest' },
  { key: 'houseManifest',     label: 'House Manifest' },
  { key: 'seaExportManifest', label: 'Sea Export Manifest' },
  { key: 'deliveryAdvice',    label: 'Delivery Advice' },
];

/* ─── Generic listing config — every sidebar section supplies one of these,
       so all 5 listings (and their detail pages) render off the same template. ── */
type FieldCol = ColDef & { w: number };
type SectionDef = { title: string; fields: { key: string; label: string }[] };
type ListingRow = Record<string, string | boolean | undefined> & { status: string; isDraft?: boolean };
const str = (v: string | boolean | undefined): string => typeof v === 'string' ? v : '';

type ListingConfig = {
  columns: FieldCol[];
  lockedColumns: ColDef[];
  rows: ListingRow[];
  statuses: string[];
  searchKeys: string[];          // subset of column keys offered in the basic-search type dropdown
  primaryLabel: string;
  refKey: string;                 // column rendered as the blue link / used as row id
  detailSections: SectionDef[];   // field grouping for the "View Request" page
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Approved':         { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':         { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':        { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};
const COMMON_STATUSES = ['Submitted', 'Under Processing', 'Approved', 'Rejected', 'Cancelled'];

/* ─── Carrier Movement ──────────────────────────────────────────── */
const CARRIER_MOVEMENT: ListingConfig = {
  columns: [
    { key: 'refNo',        label: 'Movement Reference No.', w: 190 },
    { key: 'vessel',       label: 'Vessel Name',             w: 190 },
    { key: 'voyage',       label: 'Voyage No.',              w: 130 },
    { key: 'carrier',      label: 'Carrier',                 w: 190 },
    { key: 'pol',          label: 'Port of Loading',         w: 170 },
    { key: 'pod',          label: 'Port of Discharge',       w: 170 },
    { key: 'eta',          label: 'ETA',                     w: 120 },
    { key: 'etd',          label: 'ETD',                     w: 120 },
    { key: 'movementType', label: 'Movement Type',           w: 160 },
    { key: 'submitted',    label: 'Submission Date',         w: 160 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['refNo', 'vessel', 'voyage'],
  primaryLabel: 'Create New Request',
  refKey: 'refNo',
  detailSections: [
    { title: 'Vessel Information', fields: [{ key: 'vessel', label: 'Vessel Name' }, { key: 'voyage', label: 'Voyage No.' }, { key: 'carrier', label: 'Carrier' }, { key: 'movementType', label: 'Movement Type' }] },
    { title: 'Port & Schedule',    fields: [{ key: 'pol', label: 'Port of Loading' }, { key: 'pod', label: 'Port of Discharge' }, { key: 'eta', label: 'ETA' }, { key: 'etd', label: 'ETD' }] },
    { title: 'Request Information', fields: [{ key: 'submitted', label: 'Submission Date' }] },
  ],
  rows: [
    { refNo: 'CM-2025-100234', vessel: 'MSC ISABELLA',   voyage: 'V.245E',  carrier: 'MSC MEDITERRANEAN SHIPPING', pol: 'Port Klang',        pod: 'Jebel Ali Port', eta: '18/07/2025', etd: '20/07/2025', movementType: 'Import',    submitted: '15/07/2025', status: 'Approved' },
    { refNo: 'CM-2025-100235', vessel: 'MAERSK ESSEX',   voyage: 'V.118W',  carrier: 'MAERSK LINE',                pol: 'Jebel Ali Port',    pod: 'Salalah Port',   eta: '19/07/2025', etd: '21/07/2025', movementType: 'Export',    submitted: '16/07/2025', status: 'Submitted' },
    { refNo: 'CM-2025-100236', vessel: 'CMA CGM MARCO POLO', voyage: 'V.302N', carrier: 'CMA CGM',              pol: 'Shanghai Port',     pod: 'Jebel Ali Port', eta: '22/07/2025', etd: '24/07/2025', movementType: 'Import',    submitted: '17/07/2025', status: 'Under Processing' },
    { refNo: 'CM-2025-100237', vessel: 'HAPAG LLOYD BERLIN', voyage: 'V.077S', carrier: 'HAPAG-LLOYD',          pol: 'Jebel Ali Port',    pod: 'Hamburg Port',   eta: '23/07/2025', etd: '25/07/2025', movementType: 'Transshipment', submitted: '17/07/2025', status: 'Approved' },
    { refNo: 'CM-2025-100238', vessel: 'EVER GIVEN',      voyage: 'V.412E',  carrier: 'EVERGREEN LINE',             pol: 'Colombo Port',      pod: 'Jebel Ali Port', eta: '24/07/2025', etd: '26/07/2025', movementType: 'Import',    submitted: '18/07/2025', status: 'Rejected' },
    { refNo: 'CM-2025-100239', vessel: 'COSCO SHIPPING PISCES', voyage: 'V.055W', carrier: 'COSCO SHIPPING LINES', pol: 'Jebel Ali Port',  pod: 'Jeddah Port',    eta: '25/07/2025', etd: '27/07/2025', movementType: 'Export',    submitted: '19/07/2025', status: 'Cancelled' },
    { refNo: 'CM-2025-100240', vessel: 'ONE INNOVATION',  voyage: 'V.198N',  carrier: 'OCEAN NETWORK EXPRESS',      pol: 'Nhava Sheva Port',  pod: 'Jebel Ali Port', eta: '26/07/2025', etd: '28/07/2025', movementType: 'Import',    submitted: '20/07/2025', status: 'Submitted' },
    { refNo: 'CM-2025-100241', vessel: 'YM WELLHEAD',     voyage: 'V.089E',  carrier: 'YANG MING MARINE',           pol: 'Jebel Ali Port',    pod: 'Karachi Port',   eta: '27/07/2025', etd: '29/07/2025', movementType: 'Export',    submitted: '20/07/2025', status: 'Under Processing' },
    { refNo: 'CM-2025-100242', vessel: 'ZIM SAO PAULO',   voyage: 'V.021S',  carrier: 'ZIM INTEGRATED SHIPPING',    pol: 'Jebel Ali Port',    pod: 'Beirut Port',    eta: '28/07/2025', etd: '30/07/2025', movementType: 'Transshipment', submitted: '21/07/2025', status: 'Approved' },
    { refNo: 'CM-2025-DRAFT01', vessel: 'MSC ISABELLA',   voyage: 'V.246E',  carrier: 'MSC MEDITERRANEAN SHIPPING', pol: 'Port Klang',       pod: 'Jebel Ali Port', eta: '02/08/2025', etd: '04/08/2025', movementType: 'Import',    submitted: '—',          status: 'Submitted', isDraft: true },
  ],
};

/* ─── Flight Manifest ───────────────────────────────────────────── */
const FLIGHT_MANIFEST: ListingConfig = {
  columns: [
    { key: 'awb',          label: 'AWB Number',       w: 170 },
    { key: 'flightNo',     label: 'Flight Number',    w: 140 },
    { key: 'airline',      label: 'Airline',          w: 180 },
    { key: 'origin',       label: 'Origin',           w: 140 },
    { key: 'destination',  label: 'Destination',      w: 140 },
    { key: 'flightDate',   label: 'Flight Date',      w: 140 },
    { key: 'manifestType', label: 'Manifest Type',    w: 150 },
    { key: 'submitted',    label: 'Submission Date',  w: 160 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['awb', 'flightNo'],
  primaryLabel: 'Create New Request',
  refKey: 'awb',
  detailSections: [
    { title: 'Flight Information', fields: [{ key: 'flightNo', label: 'Flight Number' }, { key: 'airline', label: 'Airline' }, { key: 'flightDate', label: 'Flight Date' }, { key: 'manifestType', label: 'Manifest Type' }] },
    { title: 'Route Information',  fields: [{ key: 'origin', label: 'Origin' }, { key: 'destination', label: 'Destination' }] },
    { title: 'Request Information', fields: [{ key: 'submitted', label: 'Submission Date' }] },
  ],
  rows: [
    { awb: 'AWB-176-88213456', flightNo: 'EK518', airline: 'Emirates SkyCargo', origin: 'Hong Kong (HKG)',  destination: 'Dubai (DXB)', flightDate: '15/07/2025', manifestType: 'Import',    submitted: '14/07/2025', status: 'Approved' },
    { awb: 'AWB-176-88213457', flightNo: 'EK055', airline: 'Emirates SkyCargo', origin: 'Dubai (DXB)',      destination: 'London (LHR)', flightDate: '16/07/2025', manifestType: 'Export',    submitted: '15/07/2025', status: 'Submitted' },
    { awb: 'AWB-176-88213458', flightNo: 'QR815', airline: 'Qatar Airways Cargo', origin: 'Doha (DOH)',    destination: 'Dubai (DXB)', flightDate: '17/07/2025', manifestType: 'Transshipment', submitted: '16/07/2025', status: 'Under Processing' },
    { awb: 'AWB-176-88213459', flightNo: 'EY171', airline: 'Etihad Cargo',      origin: 'Abu Dhabi (AUH)',  destination: 'Dubai (DXB)', flightDate: '18/07/2025', manifestType: 'Import',    submitted: '17/07/2025', status: 'Rejected' },
    { awb: 'AWB-176-88213460', flightNo: 'CV901',  airline: 'Cargolux',         origin: 'Luxembourg (LUX)', destination: 'Dubai (DXB)', flightDate: '19/07/2025', manifestType: 'Import',    submitted: '18/07/2025', status: 'Approved' },
    { awb: 'AWB-176-88213461', flightNo: 'FZ1509', airline: 'flydubai',        origin: 'Dubai (DXB)',      destination: 'Karachi (KHI)', flightDate: '20/07/2025', manifestType: 'Export',    submitted: '19/07/2025', status: 'Cancelled' },
    { awb: 'AWB-176-DRAFT01',  flightNo: 'EK518', airline: 'Emirates SkyCargo', origin: 'Hong Kong (HKG)',  destination: 'Dubai (DXB)', flightDate: '25/07/2025', manifestType: 'Import',    submitted: '—',          status: 'Submitted', isDraft: true },
  ],
};

/* ─── House Manifest ────────────────────────────────────────────── */
const HOUSE_MANIFEST: ListingConfig = {
  columns: [
    { key: 'hawb',        label: 'HAWB Number',       w: 170 },
    { key: 'mawb',        label: 'MAWB Number',       w: 170 },
    { key: 'shipper',     label: 'Shipper',           w: 190 },
    { key: 'consignee',   label: 'Consignee',         w: 190 },
    { key: 'origin',      label: 'Origin',            w: 140 },
    { key: 'destination', label: 'Destination',       w: 140 },
    { key: 'pieces',      label: 'Pieces',             w: 100 },
    { key: 'weight',      label: 'Weight (kg)',       w: 130 },
    { key: 'submitted',   label: 'Submission Date',   w: 160 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['hawb', 'mawb'],
  primaryLabel: 'Create New Request',
  refKey: 'hawb',
  detailSections: [
    { title: 'Shipment Parties', fields: [{ key: 'shipper', label: 'Shipper' }, { key: 'consignee', label: 'Consignee' }] },
    { title: 'Manifest Details', fields: [{ key: 'mawb', label: 'MAWB Number' }, { key: 'origin', label: 'Origin' }, { key: 'destination', label: 'Destination' }, { key: 'pieces', label: 'Pieces' }, { key: 'weight', label: 'Weight (kg)' }] },
    { title: 'Request Information', fields: [{ key: 'submitted', label: 'Submission Date' }] },
  ],
  rows: [
    { hawb: 'HAWB-24-771001', mawb: 'AWB-176-88213456', shipper: 'GOLDEN DRAGON TRADING LLC', consignee: 'SONY GULF UAE',    origin: 'Hong Kong (HKG)', destination: 'Dubai (DXB)', pieces: '48',  weight: '620.50',  submitted: '14/07/2025', status: 'Approved' },
    { hawb: 'HAWB-24-771002', mawb: 'AWB-176-88213456', shipper: 'PACIFIC ELECTRONICS CO.',  consignee: 'SW LOGISTICS LLC', origin: 'Hong Kong (HKG)', destination: 'Dubai (DXB)', pieces: '20',  weight: '310.00',  submitted: '14/07/2025', status: 'Submitted' },
    { hawb: 'HAWB-24-771003', mawb: 'AWB-176-88213458', shipper: 'AL FUTTAIM AUTO PARTS',    consignee: 'FREIGHT FORWARDER CO.', origin: 'Doha (DOH)', destination: 'Dubai (DXB)', pieces: '12', weight: '95.80',   submitted: '16/07/2025', status: 'Under Processing' },
    { hawb: 'HAWB-24-771004', mawb: 'AWB-176-88213459', shipper: 'GULF MEDICAL SUPPLIES',    consignee: 'SONY GULF UAE',    origin: 'Abu Dhabi (AUH)', destination: 'Dubai (DXB)', pieces: '6',   weight: '48.20',   submitted: '17/07/2025', status: 'Rejected' },
    { hawb: 'HAWB-24-771005', mawb: 'AWB-176-88213460', shipper: 'EUROTECH MACHINERY GMBH',  consignee: 'SW LOGISTICS LLC', origin: 'Luxembourg (LUX)', destination: 'Dubai (DXB)', pieces: '3',  weight: '1240.00', submitted: '18/07/2025', status: 'Approved' },
    { hawb: 'HAWB-24-DRAFT01', mawb: 'AWB-176-88213456', shipper: 'GOLDEN DRAGON TRADING LLC', consignee: 'SONY GULF UAE',  origin: 'Hong Kong (HKG)', destination: 'Dubai (DXB)', pieces: '48', weight: '620.50',  submitted: '—', status: 'Submitted', isDraft: true },
  ],
};

/* ─── Sea Export Manifest ───────────────────────────────────────── */
const SEA_EXPORT_MANIFEST: ListingConfig = {
  columns: [
    { key: 'manifestNo', label: 'Export Manifest No.', w: 190 },
    { key: 'vessel',     label: 'Vessel Name',          w: 190 },
    { key: 'voyage',     label: 'Voyage No.',           w: 130 },
    { key: 'pol',        label: 'Port of Loading',      w: 170 },
    { key: 'pod',        label: 'Port of Discharge',    w: 170 },
    { key: 'exportDate', label: 'Export Date',          w: 140 },
    { key: 'containers', label: 'Total Containers',     w: 150 },
    { key: 'submitted',  label: 'Submission Date',      w: 160 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['manifestNo', 'vessel'],
  primaryLabel: 'Create New Request',
  refKey: 'manifestNo',
  detailSections: [
    { title: 'Vessel Information', fields: [{ key: 'vessel', label: 'Vessel Name' }, { key: 'voyage', label: 'Voyage No.' }] },
    { title: 'Port & Schedule',    fields: [{ key: 'pol', label: 'Port of Loading' }, { key: 'pod', label: 'Port of Discharge' }, { key: 'exportDate', label: 'Export Date' }] },
    { title: 'Cargo Summary',      fields: [{ key: 'containers', label: 'Total Containers' }] },
    { title: 'Request Information', fields: [{ key: 'submitted', label: 'Submission Date' }] },
  ],
  rows: [
    { manifestNo: 'SEM-2025-500112', vessel: 'MAERSK ESSEX',    voyage: 'V.118W', pol: 'Jebel Ali Port', pod: 'Salalah Port',   exportDate: '21/07/2025', containers: '128', submitted: '19/07/2025', status: 'Approved' },
    { manifestNo: 'SEM-2025-500113', vessel: 'ONE INNOVATION',  voyage: 'V.198N', pol: 'Jebel Ali Port', pod: 'Jeddah Port',    exportDate: '22/07/2025', containers: '96',  submitted: '20/07/2025', status: 'Submitted' },
    { manifestNo: 'SEM-2025-500114', vessel: 'ZIM SAO PAULO',   voyage: 'V.021S', pol: 'Jebel Ali Port', pod: 'Beirut Port',    exportDate: '23/07/2025', containers: '64',  submitted: '21/07/2025', status: 'Under Processing' },
    { manifestNo: 'SEM-2025-500115', vessel: 'YM WELLHEAD',     voyage: 'V.089E', pol: 'Jebel Ali Port', pod: 'Karachi Port',   exportDate: '24/07/2025', containers: '210', submitted: '22/07/2025', status: 'Rejected' },
    { manifestNo: 'SEM-2025-500116', vessel: 'COSCO SHIPPING PISCES', voyage: 'V.055W', pol: 'Jebel Ali Port', pod: 'Jeddah Port', exportDate: '25/07/2025', containers: '75', submitted: '23/07/2025', status: 'Cancelled' },
    { manifestNo: 'SEM-2025-DRAFT01', vessel: 'MAERSK ESSEX',   voyage: 'V.119W', pol: 'Jebel Ali Port', pod: 'Salalah Port',   exportDate: '28/07/2025', containers: '128', submitted: '—', status: 'Submitted', isDraft: true },
  ],
};

/* ─── Delivery Advice ───────────────────────────────────────────── */
const DELIVERY_ADVICE: ListingConfig = {
  columns: [
    { key: 'doNo',         label: 'DO Number',            w: 160 },
    { key: 'blNo',         label: 'Bill of Lading No.',   w: 170 },
    { key: 'consignee',    label: 'Consignee',            w: 190 },
    { key: 'containerNo',  label: 'Container No.',        w: 150 },
    { key: 'vessel',       label: 'Vessel Name',          w: 190 },
    { key: 'deliveryDate', label: 'Delivery Date',        w: 150 },
    { key: 'warehouse',    label: 'Warehouse',            w: 170 },
    { key: 'submitted',    label: 'Submission Date',      w: 160 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['doNo', 'blNo'],
  primaryLabel: 'Create New Request',
  refKey: 'doNo',
  detailSections: [
    { title: 'Delivery Parties',  fields: [{ key: 'consignee', label: 'Consignee' }, { key: 'warehouse', label: 'Warehouse' }] },
    { title: 'Shipment Details',  fields: [{ key: 'blNo', label: 'Bill of Lading No.' }, { key: 'containerNo', label: 'Container No.' }, { key: 'vessel', label: 'Vessel Name' }] },
    { title: 'Request Information', fields: [{ key: 'deliveryDate', label: 'Delivery Date' }, { key: 'submitted', label: 'Submission Date' }] },
  ],
  rows: [
    { doNo: 'DO-2025-330045', blNo: 'BL-MSK-7761234', consignee: 'SONY GULF UAE',        containerNo: 'MSKU7712345', vessel: 'MSC ISABELLA', deliveryDate: '19/07/2025', warehouse: 'JAFZA Warehouse 4', submitted: '18/07/2025', status: 'Approved' },
    { doNo: 'DO-2025-330046', blNo: 'BL-MSK-7761235', consignee: 'SW LOGISTICS LLC',     containerNo: 'MSKU7712346', vessel: 'MAERSK ESSEX', deliveryDate: '20/07/2025', warehouse: 'JAFZA Warehouse 2', submitted: '19/07/2025', status: 'Submitted' },
    { doNo: 'DO-2025-330047', blNo: 'BL-MSK-7761236', consignee: 'FREIGHT FORWARDER CO.', containerNo: 'MSKU7712347', vessel: 'EVER GIVEN',   deliveryDate: '21/07/2025', warehouse: 'Al Quoz Warehouse', submitted: '20/07/2025', status: 'Under Processing' },
    { doNo: 'DO-2025-330048', blNo: 'BL-MSK-7761237', consignee: 'SONY GULF UAE',        containerNo: 'MSKU7712348', vessel: 'ONE INNOVATION', deliveryDate: '22/07/2025', warehouse: 'JAFZA Warehouse 4', submitted: '21/07/2025', status: 'Rejected' },
    { doNo: 'DO-2025-330049', blNo: 'BL-MSK-7761238', consignee: 'SW LOGISTICS LLC',     containerNo: 'MSKU7712349', vessel: 'ZIM SAO PAULO', deliveryDate: '23/07/2025', warehouse: 'JAFZA Warehouse 2', submitted: '22/07/2025', status: 'Cancelled' },
    { doNo: 'DO-2025-DRAFT01', blNo: 'BL-MSK-7761234', consignee: 'SONY GULF UAE',       containerNo: 'MSKU7712345', vessel: 'MSC ISABELLA', deliveryDate: '29/07/2025', warehouse: 'JAFZA Warehouse 4', submitted: '—', status: 'Submitted', isDraft: true },
  ],
};

const MENU_CONFIGS: Record<MenuKey, ListingConfig> = {
  carrierMovement:   CARRIER_MOVEMENT,
  flightManifest:    FLIGHT_MANIFEST,
  houseManifest:     HOUSE_MANIFEST,
  seaExportManifest: SEA_EXPORT_MANIFEST,
  deliveryAdvice:    DELIVERY_ADVICE,
};

/* ─── Small local filter helpers (matches ServiceListingPage's floating-label look) ─── */
function flLabel(active: boolean): React.CSSProperties {
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
function FilterInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }} />
      <span style={flLabel(active)}>{label}</span>
    </div>
  );
}

type Props = { onBack: () => void };

export default function CargoInformationPage({ onBack }: Props) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('carrierMovement');
  const config = MENU_CONFIGS[activeMenu];

  /* Toolbar state — shared by every listing, reset whenever the active menu changes */
  const [showFilters, setShowFilters]         = useState(false);
  const [afValues, setAfValues]               = useState<Record<string, string>>({});
  const [searchKey, setSearchKey]             = useState(config.searchKeys[0]);
  const [searchTypeOpen, setSearchTypeOpen]   = useState(false);
  const [searchValue, setSearchValue]         = useState('');
  const [toolbarStatus, setToolbarStatus]     = useState<string | null>(null);
  const [toolbarStatusOpen, setToolbarStatusOpen] = useState(false);
  const [showDrafts, setShowDrafts]           = useState(false);
  const [showColModal, setShowColModal]       = useState(false);
  const [visibleCols, setVisibleCols]         = useState<string[]>(config.columns.map(c => c.key));
  const [page, setPage]                       = useState(1);
  const [pageSize, setPageSize]               = useState(8);
  const [openFlyout, setOpenFlyout]           = useState<number | null>(null);
  const [showNewRequest, setShowNewRequest]   = useState(false);
  const [viewRow, setViewRow]                 = useState<ListingRow | null>(null);
  const [colOrder, setColOrder]               = useState<string[]>(() => config.columns.map(c => c.key));

  const {
    tableRef, scrollRef, hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const statusRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toolbarStatusOpen && !searchTypeOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setToolbarStatusOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchTypeOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [toolbarStatusOpen, searchTypeOpen]);

  const switchMenu = (key: MenuKey) => {
    setActiveMenu(key);
    const next = MENU_CONFIGS[key];
    setPage(1); setSearchValue(''); setSearchKey(next.searchKeys[0]); setToolbarStatus(null);
    setShowDrafts(false); setShowFilters(false); setAfValues({}); setViewRow(null);
    setVisibleCols(next.columns.map(c => c.key));
    setColOrder(next.columns.map(c => c.key));
  };

  const orderedVisible = (colOrder.length === config.columns.length ? colOrder : config.columns.map(c => c.key))
    .filter(k => visibleCols.includes(k))
    .map(k => config.columns.find(c => c.key === k))
    .filter((c): c is FieldCol => Boolean(c));
  const colLabel = (key: string) => config.columns.find(c => c.key === key)?.label ?? key;

  const filteredRows = config.rows.filter(r => {
    if (showDrafts !== !!r.isDraft) return false;
    if (toolbarStatus && r.status !== toolbarStatus) return false;
    if (searchValue.trim() && !str(r[searchKey]).toLowerCase().includes(searchValue.trim().toLowerCase())) return false;
    for (const [k, v] of Object.entries(afValues)) {
      if (v.trim() && !str(r[k]).toLowerCase().includes(v.trim().toLowerCase())) return false;
    }
    return true;
  });
  const paginated = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  /* Detail-view field values, used by both the "View Request" page and (implicitly) future amend/cancel flows */
  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>{label}</span>
      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} />
      </div>

      <div className="flex flex-1 px-4 md:px-10 pt-[14px] pb-[20px] gap-[12px] items-stretch">
        {/* Left collapsible panel — same design as Integrated Clearance module */}
        <div
          className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300 max-md:!w-16"
          style={{ width: panelCollapsed ? 64 : 200, background: '#e4efff', border: '1px solid #a6c2e9' }}
        >
          <button
            onClick={() => setPanelCollapsed(c => !c)}
            className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] w-full flex-shrink-0"
            title={panelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <span className="size-[32px] rounded-full flex items-center justify-center bg-white transition-colors hover:bg-[#eef4ff]" style={{ border: '1.5px solid #a6c2e9' }}>
              <svg viewBox="0 0 20 20" className="size-[16px] transition-transform duration-300" style={{ transform: panelCollapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 15l-5-5 5-5" /><path d="M8 15l-5-5 5-5" />
              </svg>
            </span>
          </button>
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => switchMenu(item.key)}
                className="flex items-center w-full text-left transition-all hover:opacity-80"
                style={{
                  gap: panelCollapsed ? 0 : 10,
                  padding: panelCollapsed ? '12px 12px' : '12px 14px',
                  justifyContent: panelCollapsed ? 'center' : 'flex-start',
                  ...(isActive ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' } : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
                }}
                title={panelCollapsed ? item.label : undefined}
              >
                <div className="flex items-center justify-center flex-shrink-0 rounded-[8px]" style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <MenuIcon menu={item.key} />
                </div>
                {!panelCollapsed && (
                  <span className="text-[16px] text-[#0e1b3d] leading-tight whitespace-nowrap overflow-hidden" style={{ fontFamily: font, fontWeight: isActive ? 700 : 400 }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb + agent banner — same on every listing AND detail page */}
          <div className="flex items-center justify-between pb-[10px] flex-wrap gap-y-[6px] flex-shrink-0">
            <div className="flex items-center gap-[6px] flex-wrap">
              <span className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2] transition-colors" style={{ fontFamily: font }} onClick={onBack}>Home</span>
              <span className="text-[#dc3545] text-[15px] leading-none">/</span>
              <span className="text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>Service Catalog</span>
              <span className="text-[#dc3545] text-[15px] leading-none">/</span>
              {viewRow ? (
                <>
                  <span className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2] transition-colors" style={{ fontFamily: font }} onClick={() => setViewRow(null)}>
                    {SIDEBAR_ITEMS.find(s => s.key === activeMenu)?.label}
                  </span>
                  <span className="text-[#dc3545] text-[15px] leading-none">/</span>
                  <span className="text-[#111838] text-[16px] font-medium" style={{ fontFamily: font }}>{str(viewRow[config.refKey])}</span>
                </>
              ) : (
                <span className="text-[#111838] text-[16px] font-medium" style={{ fontFamily: font }}>Submit Cargo Information</span>
              )}
            </div>
            <div className="px-[16px] py-[4px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
              AE-1019056 — Dubai Customs - Test LLC
            </div>
          </div>

          {viewRow ? (
            /* ─── Detail / View Request page — same template for every listing, only the content changes ─── */
            <>
              <div className="flex items-center gap-[12px] mb-[16px] flex-shrink-0 flex-wrap">
                <h1 className="text-[28px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>
                  {SIDEBAR_ITEMS.find(s => s.key === activeMenu)?.label} — {str(viewRow[config.refKey])}
                </h1>
                <span
                  className="inline-flex items-center px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                  style={{ ...(STATUS_STYLE[viewRow.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' }), fontFamily: font }}
                >
                  {viewRow.status}
                </span>
              </div>

              <div className="bg-white rounded-[8px] flex-1 flex flex-col gap-[20px] p-[24px]" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
                {config.detailSections.map(section => (
                  <div key={section.title} className="rounded-[6px] p-[16px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                    <p className="text-[14px] text-[#455174] mb-[12px]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: font }}>{section.title}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 20px' }}>
                      {section.fields.map(f => <Field key={f.key} label={f.label} value={str(viewRow[f.key])} />)}
                    </div>
                  </div>
                ))}
              </div>

              <BackToListingBar onBackToListing={() => setViewRow(null)} />
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px] flex-shrink-0" style={{ fontFamily: font }}>
                {SIDEBAR_ITEMS.find(s => s.key === activeMenu)?.label}
              </h1>

              {/* Row 1 — Advance Filters, search, status …… Need Help, primary action */}
              <div className="flex items-center gap-[12px] mb-[12px] flex-wrap flex-shrink-0">
                <button
                  onClick={() => setShowFilters(o => !o)}
                  className={`flex items-center gap-[8px] h-[48px] px-[12px] sm:px-[16px] py-[12px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#000000]'}`}
                  style={{ fontFamily: font }}
                >
                  <span className="hidden sm:inline">Advance Filters</span>
                  <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Basic search — type dropdown + input, magnifier on the right (app-wide convention) */}
                <div ref={searchRef} className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[220px] max-w-[440px] relative">
                  <button type="button" onClick={() => setSearchTypeOpen(o => !o)}
                    className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 hover:bg-[#f7faff] transition-colors">
                    <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{colLabel(searchKey)}</span>
                    <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {searchTypeOpen && (
                    <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 210, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                      {config.searchKeys.map(k => (
                        <button key={k} onClick={() => { setSearchKey(k); setSearchTypeOpen(false); setSearchValue(''); }}
                          className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                          style={{ color: k === searchKey ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: k === searchKey ? 500 : 400 }}>
                          {colLabel(k)}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center flex-1 px-[12px]">
                    <input type="text" value={searchValue} onChange={e => { setSearchValue(e.target.value); setPage(1); }}
                      placeholder={`Search ${colLabel(searchKey)}`}
                      className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                      style={{ fontFamily: font }} />
                    {searchValue !== '' && (
                      <button type="button" onClick={() => setSearchValue('')} aria-label="Clear search"
                        className="flex-shrink-0 mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] hover:text-[#0e1b3d] transition-colors">
                        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l10 10M15 5l-10 10" /></svg>
                      </button>
                    )}
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#8f94ae" strokeWidth="1.8" className="flex-shrink-0">
                      <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Status dropdown */}
                <div className="relative flex-shrink-0" ref={statusRef}>
                  <button type="button" onClick={() => setToolbarStatusOpen(o => !o)}
                    className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff] transition-colors"
                    aria-haspopup="listbox" aria-expanded={toolbarStatusOpen}>
                    <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{toolbarStatus ?? 'Status'}</span>
                    <svg viewBox="0 0 24 24" className={`size-[22px] text-[#1360d2] transition-transform ${toolbarStatusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {toolbarStatusOpen && (
                    <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 220, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }} role="listbox">
                      <button onClick={() => { setToolbarStatus(null); setToolbarStatusOpen(false); setPage(1); }}
                        className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                        style={{ color: toolbarStatus === null ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: toolbarStatus === null ? 500 : 400 }}>
                        All statuses
                      </button>
                      {config.statuses.map(opt => (
                        <button key={opt} onClick={() => { setToolbarStatus(opt); setToolbarStatusOpen(false); setPage(1); }}
                          className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                          style={{ color: opt === toolbarStatus ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === toolbarStatus ? 500 : 400 }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-[16px] ml-auto flex-wrap">
                  <button className="flex items-center gap-[4px] h-[48px] px-[2px] flex-shrink-0">
                    <span className="text-[16px] text-[#2950e5] font-medium" style={{ fontFamily: font }}>Need Help</span>
                    <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
                    </svg>
                  </button>
                  <button onClick={() => setShowNewRequest(true)}
                    className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-colors"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px 0px rgba(28,72,191,0.16)' }}>
                    {config.primaryLabel}
                  </button>
                </div>
              </div>

              {/* Row 2 — Status-as-on date badge (centered) + Drafts/Columns (right), mirrors the master listing template */}
              <div className="flex items-center justify-between mb-[12px] flex-shrink-0">
                <div className="flex-1 flex justify-center">
                  <div
                    className="inline-flex items-center gap-[10px] h-[44px] px-[24px] rounded-[8px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d]"
                    style={{ fontFamily: font }}
                  >
                    <span>Status As On 28-Dec-22 To 10-Jan-23</span>
                    <button className="text-[#1360d2] font-medium hover:opacity-80 ml-[6px]" style={{ fontFamily: font }}>Modify</button>
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
                      <rect x="3" y="4" width="14" height="13" rx="2" />
                      <path d="M3 8h14M7 2v4M13 2v4" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-[16px] flex-shrink-0">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Drafts</span>
                    <button onClick={() => { setShowDrafts(d => !d); setPage(1); }}
                      className={`relative w-[48px] h-[28px] rounded-full transition-colors ${showDrafts ? 'bg-[#1360d2]' : 'bg-[#e2ebf9]'}`}>
                      <div className={`absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${showDrafts ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                    </button>
                  </div>
                  <button onClick={() => setShowColModal(true)}
                    className="flex items-center gap-[8px] h-[48px] px-[14px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
                    Columns
                  </button>
                </div>
              </div>

              {/* Advance Filters panel */}
              {showFilters && (
                <div className="bg-white rounded-[8px] mb-[12px] p-[20px] flex-shrink-0" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
                  <div className="flex items-center justify-between mb-[20px]">
                    <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advance Filters</span>
                    <button onClick={() => setShowFilters(false)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {config.columns.slice(1, 4).map(col => (
                      col.key.toLowerCase().includes('date') || col.key === 'eta' || col.key === 'etd'
                        ? <DateInput key={col.key} label={col.label} value={afValues[col.key] ?? ''} onChange={v => setAfValues(p => ({ ...p, [col.key]: v }))} />
                        : <FilterInput key={col.key} label={col.label} value={afValues[col.key] ?? ''} onChange={v => setAfValues(p => ({ ...p, [col.key]: v }))} />
                    ))}
                  </div>
                  <div className="flex justify-end gap-[10px] mt-[16px]">
                    <button onClick={() => { setAfValues({}); setPage(1); }}
                      className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]" style={{ fontFamily: font }}>
                      Reset
                    </button>
                    <button onClick={() => setPage(1)} className="h-[44px] px-5 rounded-[4px] text-[15px] text-white" style={{ background: '#1360d2', fontFamily: font }}>
                      Search
                    </button>
                  </div>
                </div>
              )}

              {/* Table — same structure (sticky Status + Actions, drag-reorder, resize, scroll arrows) for every listing */}
              <div className="pb-[20px] flex-1" style={{ position: 'relative' }}>
                <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={232} />
                <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto" style={{ position: 'relative' }}>
                  {resizeIndicatorLeft !== null && (
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360d2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
                  )}
                <table
                  ref={tableRef}
                  onMouseMove={handleTableMouseMove}
                  onMouseLeave={handleTableMouseLeave}
                  onMouseDown={handleTableMouseDown}
                  style={{ width: 'max-content', minWidth: '100%', tableLayout: 'auto', borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined }}
                >
                  <thead>
                    <tr>
                      {orderedVisible.map((col, i) => (
                        <th key={col.key} data-col-key={col.key} style={{
                          padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0, paddingLeft: i === 0 ? 16 : 12,
                          width: getW(col.key, col.w), minWidth: getW(col.key, col.w), whiteSpace: 'nowrap', position: 'relative',
                          ...getThStyle(col.key),
                        }}
                          onDragOver={(e) => onDragOver(col.key, e)}
                          onDragLeave={onDragLeave}
                          onDrop={(e) => onDrop(col.key, e, colOrder, setColOrder)}
                        >
                          <div
                            draggable
                            onDragStart={(e) => onDragStart(col.key, e)}
                            onDragEnd={onDragEnd}
                            style={{ display: hoveredColKey === col.key ? 'flex' : 'none', position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4 }}
                          >
                            <DragDots />
                          </div>
                          <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                        </th>
                      ))}
                      <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, position: 'sticky', right: 72, minWidth: 160, width: 160, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                        <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">Status</span>
                      </th>
                      <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', borderTopRightRadius: 8, borderBottomRightRadius: 8, position: 'sticky', right: 0, minWidth: 72, width: 72, zIndex: 2 }}>
                        <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr><td colSpan={orderedVisible.length + 2} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>No matching records found.</span>
                      </td></tr>
                    ) : paginated.map((row, i) => {
                      const st = STATUS_STYLE[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                      return (
                        <tr key={str(row[config.refKey])}>
                          {orderedVisible.map((col, ci) => (
                            <td key={col.key} data-col-key={col.key} style={{ background: getTdBg(col.key) ?? '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', paddingLeft: ci === 0 ? 16 : 12, width: getW(col.key, col.w), minWidth: getW(col.key, col.w), whiteSpace: 'nowrap' }}>
                              {col.key === config.refKey ? (
                                <button onClick={() => setViewRow(row)} className="text-[16px] text-[#1360d2] font-medium hover:underline whitespace-nowrap overflow-hidden text-ellipsis block" style={{ fontFamily: font, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                  {str(row[col.key])}
                                </button>
                              ) : (
                                <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">{str(row[col.key])}</span>
                              )}
                            </td>
                          ))}
                          <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', position: 'sticky', right: 72, width: 160, minWidth: 160, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: openFlyout === i ? 49 : 1 }}>
                            <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right: 0, width: 72, minWidth: 72, zIndex: openFlyout === i ? 50 : 1 }}>
                            <div className="relative inline-block">
                              <button onClick={() => setOpenFlyout(openFlyout === i ? null : i)} className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498"><circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" /></svg>
                              </button>
                              {openFlyout === i && (
                                <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ top: 36, width: 168, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                                  {['View Request', 'Amend Request', 'Cancel Request'].map(label => (
                                    <button key={label} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                      onClick={() => { setOpenFlyout(null); if (label === 'View Request') setViewRow(row); }}>
                                      <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{label}</span>
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
                </div>

                <Pagination
                  page={page}
                  totalPages={Math.max(1, Math.ceil(filteredRows.length / pageSize))}
                  pageSize={pageSize}
                  totalItems={filteredRows.length}
                  onPageChange={setPage}
                  onPageSizeChange={s => { setPageSize(s); setPage(1); }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {showColModal && (
        <ManageColumnsModal
          columns={config.columns}
          visible={visibleCols}
          lockedColumns={config.lockedColumns}
          onSave={setVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}

      {showNewRequest && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-[20px]" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setShowNewRequest(false)}>
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(480px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: font }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
              <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>New {SIDEBAR_ITEMS.find(s => s.key === activeMenu)?.label} Request</p>
              <button onClick={() => setShowNewRequest(false)} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="px-[28px] py-[32px] flex flex-col items-center gap-[12px]">
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#d5ddfb" strokeWidth="2">
                <circle cx="24" cy="24" r="20" /><path d="M24 16v8l4 4" strokeLinecap="round" />
              </svg>
              <p className="text-[16px] text-[#697498] text-center">Content coming soon</p>
            </div>
            <div className="border-t border-[#eef1f6] px-[28px] py-[16px] flex items-center justify-end">
              <button onClick={() => setShowNewRequest(false)} className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontWeight: 500 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
