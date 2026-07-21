import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Pagination from './Pagination';
import BackToListingBar from './BackToListingBar';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { DateInput } from './DatePicker';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';
import CarrierMovementNewRequestPage from './CarrierMovementNewRequestPage';
import CarrierMovementViewPage, { type CarrierMovementRow } from './CarrierMovementViewPage';
import FlightManifestNewRequestPage from './FlightManifestNewRequestPage';
import FlightManifestUploadPage, { type FlightManifestUploadRow } from './FlightManifestUploadPage';
import FlightManifestViewPage, { type FlightManifestViewRow } from './FlightManifestViewPage';
import SeaExportManifestNewRequestPage from './SeaExportManifestNewRequestPage';
import SeaExportManifestUploadPage, { type SeaExportManifestUploadRow } from './SeaExportManifestUploadPage';
import HouseManifestNewRequestPage from './HouseManifestNewRequestPage';
import DeliveryAdviceNewRequestPage from './DeliveryAdviceNewRequestPage';

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
type LockedColDef = ColDef & { w?: number };   // sticky trailing columns — 'actions' defaults to 72px, others to 160px
type SectionDef = { title: string; fields: { key: string; label: string }[] };
type ListingRow = Record<string, string | boolean | undefined> & { status: string; isDraft?: boolean };
const str = (v: string | boolean | undefined): string => typeof v === 'string' ? v : '';

type ListingConfig = {
  columns: FieldCol[];
  lockedColumns: LockedColDef[];
  rows: ListingRow[];
  statuses: string[];
  searchKeys: string[];          // subset of column keys offered in the basic-search type dropdown
  primaryLabel: string;
  refKey: string;                 // column rendered as the blue link / used as row id
  detailSections: SectionDef[];   // field grouping for the "View Request" page
  advancedFilterKeys?: string[];  // which column keys the Advance Filters panel shows (defaults to columns[1..4])
  flyoutItems?: string[];         // Action-column flyout menu labels (defaults to View/Amend/Cancel Request)
  lockedStatusStyles?: Record<string, Record<string, { bg: string; color: string }>>; // per-locked-column badge color map (defaults to shared STATUS_STYLE)
  searchKeyLabels?: Record<string, string>; // label overrides for search-type dropdown keys that aren't visible columns
  noScrollArrows?: boolean;       // suppress the left/right scroll-arrow overlay on the main listing table
};
const lockedColW = (col: LockedColDef) => col.w ?? (col.key === 'actions' ? 72 : 160);

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Approved':         { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':         { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':        { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Active':           { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
};
const COMMON_STATUSES = ['Submitted', 'Under Processing', 'Approved', 'Rejected', 'Cancelled'];

const MANIFEST_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Submitted': { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Cancelled': { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Draft':     { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
};
const UPLOAD_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Successful': { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Failure':    { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
};

/* ─── Carrier Movement ──────────────────────────────────────────── */
const CARRIER_MOVEMENT: ListingConfig = {
  columns: [
    { key: 'flightNo',         label: 'Flight Number',            w: 150 },
    { key: 'arrDep',           label: 'Arrival/Departure',        w: 150 },
    { key: 'scheduleDate',     label: 'Schedule Date of Arrival', w: 190 },
    { key: 'eta',              label: 'Estimated Time of Arrival', w: 190 },
    { key: 'ata',              label: 'Actual Time of Arrival',   w: 180 },
    { key: 'aircraftType',     label: 'Aircraft Type',            w: 170 },
    { key: 'airportLoading',   label: 'Airport of Loading',       w: 170 },
    { key: 'airportUnloading', label: 'Airport of Unloading',     w: 170 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: ['Active'],
  searchKeys: ['flightNo'],
  advancedFilterKeys: ['flightNo', 'arrDep', 'aircraftType', 'airportLoading', 'scheduleDate', 'eta'],
  flyoutItems: ['View Request', 'Amend', 'Cancel'],
  primaryLabel: 'New Request',
  refKey: 'flightNo',
  detailSections: [
    { title: 'Flight Information', fields: [{ key: 'arrDep', label: 'Arrival/Departure' }, { key: 'scheduleDate', label: 'Schedule Date of Arrival' }, { key: 'eta', label: 'Estimated Time of Arrival' }, { key: 'ata', label: 'Actual Time of Arrival' }] },
    { title: 'Aircraft & Port',    fields: [{ key: 'aircraftType', label: 'Aircraft Type' }, { key: 'airportLoading', label: 'Airport of Loading' }, { key: 'airportUnloading', label: 'Airport of Unloading' }] },
  ],
  rows: [
    { flightNo: 'EK337788', arrDep: 'Arrival',   scheduleDate: '06/07/2025 11:34', eta: '06/07/2025 11:34', ata: '06/07/2025 11:40', aircraftType: 'Passenger',      airportLoading: 'DXB', airportUnloading: 'MAA', status: 'Active' },
    { flightNo: 'B123456',  arrDep: 'Arrival',   scheduleDate: '06/07/2025 11:34', eta: '06/07/2025 11:34', ata: '—',                aircraftType: 'Cargo only',     airportLoading: 'DXB', airportUnloading: 'LHR', status: 'Active' },
    { flightNo: 'C123456',  arrDep: 'Arrival',   scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Combi',          airportLoading: 'DXB', airportUnloading: 'JFK', status: 'Active' },
    { flightNo: 'D123456',  arrDep: 'Arrival',   scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Surface Flights', airportLoading: 'DXB', airportUnloading: 'SIN', status: 'Active' },
    { flightNo: 'E123456',  arrDep: 'Departure', scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Truck',          airportLoading: 'DXB', airportUnloading: 'AUH', status: 'Active' },
    { flightNo: 'F123456',  arrDep: 'Departure', scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Passenger',      airportLoading: 'DXB', airportUnloading: 'MAA', status: 'Active' },
    { flightNo: 'G123456',  arrDep: 'Departure', scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Cargo only',     airportLoading: 'DXB', airportUnloading: 'LHR', status: 'Active' },
    { flightNo: 'H123456',  arrDep: 'Departure', scheduleDate: '02/07/2025 10:15', eta: '02/07/2025 10:15', ata: '—',                aircraftType: 'Combi',          airportLoading: 'DXB', airportUnloading: 'JFK', status: 'Active' },
    { flightNo: 'CM-DRAFT01', arrDep: 'Arrival', scheduleDate: '02/08/2025 09:00', eta: '02/08/2025 09:00', ata: '—',                aircraftType: 'Passenger',      airportLoading: 'DXB', airportUnloading: 'SIN', status: 'Active', isDraft: true },
  ],
};

/* ─── Flight Manifest ───────────────────────────────────────────── */
const FLIGHT_MANIFEST: ListingConfig = {
  columns: [
    { key: 'flightNo',        label: 'Flight Number',          w: 140 },
    { key: 'scheduleDate',    label: 'Schedule Date',          w: 160 },
    { key: 'airportLoading',  label: 'Airport of Loading',     w: 170 },
    { key: 'manifestType',    label: 'Manifest Type',          w: 150 },
    { key: 'createdDate',     label: 'Created Date',           w: 150 },
    { key: 'uploadRefNo',     label: 'Upload Reference No.',   w: 170 },
    { key: 'uploadedFiles',   label: 'No. of Uploaded files',  w: 170 },
    { key: 'filesSuccessful', label: 'No. of files successful', w: 170 },
    { key: 'filesFailed',     label: 'No. of Files failed',    w: 160 },
  ],
  lockedColumns: [
    { key: 'manifestStatus', label: 'Manifest Status', w: 150 },
    { key: 'uploadStatus',   label: 'Upload Status',   w: 150 },
    { key: 'actions',        label: 'Actions' },
  ],
  lockedStatusStyles: { manifestStatus: MANIFEST_STATUS_STYLE, uploadStatus: UPLOAD_STATUS_STYLE },
  statuses: ['Submitted', 'Cancelled', 'Draft'],
  searchKeys: ['flightNo', 'uploadRefNo'],
  advancedFilterKeys: ['flightNo', 'airportLoading', 'manifestType', 'uploadRefNo', 'scheduleDate', 'createdDate'],
  flyoutItems: ['View Manifest Request', 'View Manifest', 'Amend', 'Cancel', 'Upload Manifest', 'Error Files'],
  primaryLabel: 'New Request',
  refKey: 'flightNo',
  detailSections: [
    { title: 'Flight Information', fields: [{ key: 'scheduleDate', label: 'Schedule Date' }, { key: 'airportLoading', label: 'Airport of Loading' }, { key: 'manifestType', label: 'Manifest Type' }] },
    { title: 'Upload Information', fields: [{ key: 'uploadRefNo', label: 'Upload Reference No.' }, { key: 'createdDate', label: 'Created Date' }, { key: 'uploadedFiles', label: 'No. of Uploaded files' }, { key: 'filesSuccessful', label: 'No. of files successful' }, { key: 'filesFailed', label: 'No. of Files failed' }] },
  ],
  rows: [
    { flightNo: '337788',  scheduleDate: '06/07/2025 11:34', airportLoading: 'DXB', manifestType: 'FFM',             createdDate: '03/12/2025', uploadRefNo: 'MNF-337788', uploadedFiles: '1', filesSuccessful: '1', filesFailed: '0', manifestStatus: 'Submitted', uploadStatus: 'Successful', status: 'Submitted' },
    { flightNo: 'B123456', scheduleDate: '06/07/2025 11:34', airportLoading: 'DXB', manifestType: 'FWB',             createdDate: '—',          uploadRefNo: '—',          uploadedFiles: '0', filesSuccessful: '0', filesFailed: '0', manifestStatus: 'Draft',     uploadStatus: 'Failure',    status: 'Draft' },
    { flightNo: 'C123456', scheduleDate: '06/07/2025 11:34', airportLoading: 'DXB', manifestType: 'Inbound Manifest', createdDate: '02/07/2025', uploadRefNo: 'MNF-C123456', uploadedFiles: '2', filesSuccessful: '1', filesFailed: '1', manifestStatus: 'Submitted', uploadStatus: 'Failure',    status: 'Submitted' },
    { flightNo: 'D123456', scheduleDate: '02/07/2025 10:15', airportLoading: 'DXB', manifestType: 'FFM',             createdDate: '02/07/2025', uploadRefNo: 'MNF-D123456', uploadedFiles: '1', filesSuccessful: '0', filesFailed: '1', manifestStatus: 'Cancelled', uploadStatus: 'Failure',    status: 'Cancelled' },
    { flightNo: 'E123456', scheduleDate: '02/07/2025 10:15', airportLoading: 'DXB', manifestType: 'FWB',             createdDate: '02/07/2025', uploadRefNo: 'MNF-E123456', uploadedFiles: '1', filesSuccessful: '1', filesFailed: '0', manifestStatus: 'Cancelled', uploadStatus: 'Successful', status: 'Cancelled' },
    { flightNo: 'F123456', scheduleDate: '02/07/2025 10:15', airportLoading: 'DXB', manifestType: 'Inbound Manifest', createdDate: '—',          uploadRefNo: '—',          uploadedFiles: '0', filesSuccessful: '0', filesFailed: '0', manifestStatus: 'Draft',     uploadStatus: 'Failure',    status: 'Draft' },
    { flightNo: 'G123456', scheduleDate: '02/07/2025 10:15', airportLoading: 'DXB', manifestType: 'FFM',             createdDate: '02/07/2025', uploadRefNo: 'MNF-G123456', uploadedFiles: '3', filesSuccessful: '3', filesFailed: '0', manifestStatus: 'Submitted', uploadStatus: 'Successful', status: 'Submitted' },
    { flightNo: 'H123456', scheduleDate: '02/07/2025 10:15', airportLoading: 'DXB', manifestType: 'FWB',             createdDate: '02/07/2025', uploadRefNo: 'MNF-H123456', uploadedFiles: '1', filesSuccessful: '1', filesFailed: '0', manifestStatus: 'Submitted', uploadStatus: 'Successful', status: 'Submitted' },
    { flightNo: 'FM-DRAFT01', scheduleDate: '02/08/2025 09:00', airportLoading: 'DXB', manifestType: 'Inbound Manifest', createdDate: '—', uploadRefNo: '—', uploadedFiles: '0', filesSuccessful: '0', filesFailed: '0', manifestStatus: 'Draft', uploadStatus: 'Failure', status: 'Draft', isDraft: true },
  ],
};

/* ─── House Manifest ────────────────────────────────────────────── */
const HOUSE_MANIFEST: ListingConfig = {
  columns: [
    { key: 'mawbNo',          label: 'Master Airway Bill No.', w: 200 },
    { key: 'manifestType',    label: 'House Manifest Type',    w: 190 },
    { key: 'weight',          label: 'Weight & Unit',          w: 160 },
    { key: 'createdDate',     label: 'Created Date',           w: 160 },
    { key: 'transactionType', label: 'Transaction Type',       w: 170 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['mawbNo'],
  noScrollArrows: true,
  primaryLabel: 'New Manifest',
  refKey: 'mawbNo',
  detailSections: [
    { title: 'Manifest Details', fields: [{ key: 'manifestType', label: 'House Manifest Type' }, { key: 'weight', label: 'Weight & Unit' }, { key: 'transactionType', label: 'Transaction Type' }] },
    { title: 'Request Information', fields: [{ key: 'createdDate', label: 'Created Date' }] },
  ],
  rows: [
    { mawbNo: 'AWB-176-88213456', manifestType: 'Consolidated', weight: '620.50 KG', createdDate: '14/07/2025', transactionType: 'Import', status: 'Approved' },
    { mawbNo: 'AWB-176-88213457', manifestType: 'Direct',       weight: '310.00 KG', createdDate: '14/07/2025', transactionType: 'Import', status: 'Submitted' },
    { mawbNo: 'AWB-176-88213458', manifestType: 'Consolidated', weight: '95.80 KG',  createdDate: '16/07/2025', transactionType: 'Import', status: 'Under Processing' },
    { mawbNo: 'AWB-176-88213459', manifestType: 'Direct',       weight: '48.20 KG',  createdDate: '17/07/2025', transactionType: 'Export', status: 'Rejected' },
    { mawbNo: 'AWB-176-88213460', manifestType: 'Consolidated', weight: '1240.00 KG', createdDate: '18/07/2025', transactionType: 'Import', status: 'Approved' },
    { mawbNo: 'AWB-176-88213461', manifestType: 'Direct',       weight: '85.00 KG',  createdDate: '19/07/2025', transactionType: 'Export', status: 'Cancelled' },
    { mawbNo: 'AWB-176-DRAFT01',  manifestType: 'Consolidated', weight: '620.50 KG', createdDate: '—',          transactionType: 'Import', status: 'Submitted', isDraft: true },
  ],
};

/* ─── Sea Export Manifest ───────────────────────────────────────── */
const CARGO_TYPES = ['BULK LIQUID', 'BULK SOLID', 'EMPTY CONTAINER', 'FCL CONTAINER', 'GENERAL CARGO (BREAK BULK)', 'LCL CONTAINER', 'Live Stock', 'RO-RO UNIT'];

const SEA_EXPORT_MANIFEST: ListingConfig = {
  columns: [
    { key: 'bolNumber',         label: 'BOL Number',            w: 150 },
    { key: 'rotationNumber',    label: 'Rotation Number',       w: 160 },
    { key: 'cargoType',         label: 'Cargo Type',            w: 190 },
    { key: 'lastModifiedDate',  label: 'Last Modified Date',    w: 190 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status', w: 150 }, { key: 'actions', label: 'Actions' }],
  statuses: ['Active'],
  searchKeys: ['bolNumber', 'rotationNumber', 'fileRefNo'],
  searchKeyLabels: { rotationNumber: 'Rotation Number', fileRefNo: 'File Reference Number' },
  noScrollArrows: true,
  advancedFilterKeys: ['bolNumber', 'rotationNumber', 'cargoType'],
  flyoutItems: ['View Manifest Request', 'Amend Request', 'Upload BOL', 'Audit History', 'Download Error Report', 'Cancel'],
  primaryLabel: 'New Request',
  refKey: 'bolNumber',
  detailSections: [
    { title: 'BOL Information', fields: [{ key: 'rotationNumber', label: 'Rotation Number' }, { key: 'cargoType', label: 'Cargo Type' }, { key: 'lastModifiedDate', label: 'Last Modified Date' }] },
    { title: 'Upload Information', fields: [{ key: 'uploadRefNo', label: 'Upload Reference No.' }, { key: 'uploadDate', label: 'Upload Date' }, { key: 'remarks', label: 'Remarks' }] },
  ],
  rows: [
    { bolNumber: 'BOL101',      rotationNumber: '210101', cargoType: 'FCL CONTAINER',   lastModifiedDate: '01/06/2026 10:52:40', uploadRefNo: '26060160001', fileRefNo: '26060160001', fileName: 'Success BOL_3 new.csv', noOfBols: '3', noOfSuccessfulBols: '3', uploadDate: '01/06/2026 10:55:00', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL102',      rotationNumber: '210102', cargoType: 'GENERAL CARGO (BREAK BULK)', lastModifiedDate: '21/05/2026 09:03:57', uploadRefNo: '26052160001', fileRefNo: '26052160001', fileName: 'Valid and Invalid ports.csv', noOfBols: '8', noOfSuccessfulBols: '8', uploadDate: '21/05/2026 09:03:57', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL103',      rotationNumber: '210103', cargoType: 'BULK LIQUID',     lastModifiedDate: '18/05/2026 12:18:10', uploadRefNo: '26051860001', fileRefNo: '26051860001', fileName: 'emxn.csv', noOfBols: '1', noOfSuccessfulBols: '1', uploadDate: '18/05/2026 12:18:10', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL104',      rotationNumber: '210104', cargoType: 'LCL CONTAINER',   lastModifiedDate: '17/05/2026 08:40:00', uploadRefNo: '—', fileRefNo: '—', fileName: '—', noOfBols: '—', noOfSuccessfulBols: '—', uploadDate: '—', remarks: 'Missing seal number', status: 'Active' },
    { bolNumber: 'BOL105',      rotationNumber: '210105', cargoType: 'BULK SOLID',      lastModifiedDate: '16/05/2026 14:20:00', uploadRefNo: '—', fileRefNo: '—', fileName: '—', noOfBols: '—', noOfSuccessfulBols: '—', uploadDate: '—', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL106',      rotationNumber: '210106', cargoType: 'RO-RO UNIT',      lastModifiedDate: '15/05/2026 11:05:00', uploadRefNo: '—', fileRefNo: '—', fileName: '—', noOfBols: '—', noOfSuccessfulBols: '—', uploadDate: '—', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL107',      rotationNumber: '210107', cargoType: 'EMPTY CONTAINER', lastModifiedDate: '14/05/2026 16:30:00', uploadRefNo: '—', fileRefNo: '—', fileName: '—', noOfBols: '—', noOfSuccessfulBols: '—', uploadDate: '—', remarks: '—', status: 'Active' },
    { bolNumber: 'BOL-DRAFT01', rotationNumber: '210108', cargoType: 'FCL CONTAINER',   lastModifiedDate: '—', uploadRefNo: '—', fileRefNo: '—', fileName: '—', noOfBols: '—', noOfSuccessfulBols: '—', uploadDate: '—', remarks: '—', status: 'Active', isDraft: true },
  ],
};

/* ─── Delivery Advice ───────────────────────────────────────────── */
const DELIVERY_ADVICE: ListingConfig = {
  columns: [
    { key: 'daNumber',        label: 'Delivery Advice Number', w: 190 },
    { key: 'hawbNumber',      label: 'HAWB Number',            w: 160 },
    { key: 'daDate',          label: 'DA Date',                w: 150 },
    { key: 'daRemarks',       label: 'DA Remarks',             w: 190 },
    { key: 'transactionType', label: 'Transaction Type',       w: 170 },
  ],
  lockedColumns: [{ key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }],
  statuses: COMMON_STATUSES,
  searchKeys: ['daNumber', 'hawbNumber'],
  noScrollArrows: true,
  primaryLabel: 'New Request',
  refKey: 'daNumber',
  detailSections: [
    { title: 'Delivery Advice Details', fields: [{ key: 'hawbNumber', label: 'HAWB Number' }, { key: 'daRemarks', label: 'DA Remarks' }, { key: 'transactionType', label: 'Transaction Type' }] },
    { title: 'Request Information', fields: [{ key: 'daDate', label: 'DA Date' }] },
  ],
  rows: [
    { daNumber: '202635696', hawbNumber: 'HAWB101', daDate: '01/06/2025', daRemarks: 'Release to consignee', transactionType: 'Import', status: 'Approved' },
    { daNumber: '202635697', hawbNumber: 'HAWB102', daDate: '02/06/2025', daRemarks: '—', transactionType: 'Import', status: 'Submitted' },
    { daNumber: '202635698', hawbNumber: 'HAWB103', daDate: '03/06/2025', daRemarks: '—', transactionType: 'Import', status: 'Under Processing' },
    { daNumber: '202635699', hawbNumber: 'HAWB104', daDate: '04/06/2025', daRemarks: '—', transactionType: 'Export', status: 'Rejected' },
    { daNumber: '202635700', hawbNumber: 'HAWB105', daDate: '05/06/2025', daRemarks: '—', transactionType: 'Import', status: 'Cancelled' },
    { daNumber: 'DA-DRAFT01', hawbNumber: 'HAWB101', daDate: '—', daRemarks: '—', transactionType: 'Import', status: 'Submitted', isDraft: true },
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
function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const active = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white flex items-center justify-between"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}>
        <span>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span style={flLabel(active)}>{label}</span>
      {open && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = { onBack: () => void; onHome?: () => void };

export default function CargoInformationPage({ onBack, onHome }: Props) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('carrierMovement');
  const config = MENU_CONFIGS[activeMenu];

  /* Toolbar state — shared by every listing, reset whenever the active menu changes */
  const [showFilters, setShowFilters]         = useState(false);
  const [afValues, setAfValues]               = useState<Record<string, string>>({});
  const [afStatusType, setAfStatusType]       = useState('');
  const [afDateFrom, setAfDateFrom]           = useState('');
  const [afDateTo, setAfDateTo]               = useState('');
  const [searchKey, setSearchKey]             = useState(config.searchKeys[0]);
  const [searchTypeOpen, setSearchTypeOpen]   = useState(false);
  const [searchValue, setSearchValue]         = useState('');
  const [searchQuery, setSearchQuery]         = useState('');
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
  const [errorFilesRow, setErrorFilesRow]     = useState<ListingRow | null>(null);
  const [auditHistoryRow, setAuditHistoryRow] = useState<ListingRow | null>(null);
  const [fileDetailsRow, setFileDetailsRow]   = useState<ListingRow | null>(null);
  const [semPrefill, setSemPrefill]           = useState<{ bolNumber: string; rotationNumber: string; cargoCode?: string } | null>(null);
  const [semRequestKind, setSemRequestKind]   = useState<'new' | 'view' | 'amend'>('new');
  const [colOrder, setColOrder]               = useState<string[]>(() => config.columns.map(c => c.key));

  /* Carrier Movement / Flight Manifest — dedicated Figma-matched sub-flows */
  const [cmView, setCmView]                   = useState<'list' | 'new' | 'view'>('list');
  const [cmSelectedRow, setCmSelectedRow]     = useState<ListingRow | null>(null);
  const [fmView, setFmView]                   = useState<'list' | 'new' | 'upload' | 'view'>('list');
  const [fmSelectedRow, setFmSelectedRow]     = useState<ListingRow | null>(null);
  const [fmRequestKind, setFmRequestKind]     = useState<'new' | 'view' | 'amend'>('new');
  const [fmPrefill, setFmPrefill]             = useState<{
    flightNo: string; scheduleDate: string; airportLoadingCode: string;
  } | null>(null);

  /* Sea Export Manifest / House Manifest / Delivery Advice — dedicated Figma-matched sub-flows */
  const [semView, setSemView]                 = useState<'list' | 'new' | 'upload'>('list');
  const [semMode, setSemMode]                 = useState<'manual' | 'upload'>('manual');
  const [semSelectedRow, setSemSelectedRow]   = useState<ListingRow | null>(null);
  const [hmView, setHmView]                   = useState<'list' | 'new'>('list');
  const [daView, setDaView]                   = useState<'list' | 'new'>('list');

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
    setPage(1); setSearchValue(''); setSearchQuery(''); setSearchKey(next.searchKeys[0]); setToolbarStatus(null);
    setShowDrafts(false); setShowFilters(false); setAfValues({}); setAfStatusType(''); setAfDateFrom(''); setAfDateTo(''); setViewRow(null);
    setFileDetailsRow(null); setSemPrefill(null); setSemRequestKind('new');
    setVisibleCols(next.columns.map(c => c.key));
    setColOrder(next.columns.map(c => c.key));
    setCmView('list'); setCmSelectedRow(null);
    setFmView('list'); setFmSelectedRow(null); setFmPrefill(null); setFmRequestKind('new');
    setSemView('list'); setSemSelectedRow(null);
    setHmView('list');
    setDaView('list');
  };

  const orderedVisible = (colOrder.length === config.columns.length ? colOrder : config.columns.map(c => c.key))
    .filter(k => visibleCols.includes(k))
    .map(k => config.columns.find(c => c.key === k))
    .filter((c): c is FieldCol => Boolean(c));
  const colLabel = (key: string) => config.columns.find(c => c.key === key)?.label ?? config.searchKeyLabels?.[key] ?? key;

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

  /* Sea Export Manifest — searching by File Reference Number swaps in a dedicated upload-tracking table.
     Requires a committed search (Enter / search icon), same as VCC Number search on the VCC listing —
     not a live per-keystroke swap. */
  const showTrackUpload = activeMenu === 'seaExportManifest' && searchKey === 'fileRefNo' && searchQuery.trim() !== '';
  const trackUploadRows = showTrackUpload
    ? config.rows.filter(r => str(r.fileRefNo).toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  /* File Details page — mock per-BOL line items derived from the uploaded file's aggregate counts */
  type BolLine = { bolNo: string; cargoCode: string; requestId: string; status: 'Success' | 'Error'; remarks: string };
  const bolLines: BolLine[] = fileDetailsRow ? (() => {
    const total = Number(fileDetailsRow.noOfBols ?? 0) || 0;
    const success = Number(fileDetailsRow.noOfSuccessfulBols ?? 0) || 0;
    const failed = Math.max(0, total - success);
    const baseNo = str(fileDetailsRow.bolNumber).replace(/\D/g, '') || '101';
    const cargoLetter = (str(fileDetailsRow.cargoType)[0] || 'F').toUpperCase();
    return Array.from({ length: total }, (_, i) => {
      const isFailed = i < failed;
      return {
        bolNo: `BOL${baseNo}${String(i + 1).padStart(3, '0')}`,
        cargoCode: cargoLetter,
        requestId: isFailed ? '' : `${str(fileDetailsRow.uploadRefNo)}-${String(i + 1).padStart(3, '0')}`,
        status: isFailed ? 'Error' as const : 'Success' as const,
        remarks: isFailed ? 'Bill Of Lading record has been deleted.' : '',
      };
    });
  })() : [];

  /* Flight Manifest — View/Amend prefill: convert the listing's "DD/MM/YYYY HH:mm" mock date to the ISO date the wizard's DatePicker expects, and synthesize a plausible pre-filled Airport of Unloading row */
  const toIsoDate = (ddmmyyyy: string): string => {
    const datePart = ddmmyyyy.split(' ')[0];
    const [d, m, y] = datePart.split('/');
    return d && m && y ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : '';
  };
  const AIRPORT_NAMES: Record<string, string> = { DXB: 'Dubai International Airport', JFK: 'John F. Kennedy International Airport' };
  const fmInitialUnloadingRows = fmPrefill ? [{
    id: 'ul-mock-1', airportCode: 'JFK', airportName: AIRPORT_NAMES.JFK, nilCargo: 'No',
    lines: [
      { id: 'awb-mock-1', awbNo: '176-88213456', goodsDescription: 'General Cargo', weight: '450', weightUnit: 'KG', shipperName: 'Acme Exports LLC', pieces: '12', shipmentDescCode: 'Total Consignment', consigneeName: 'Global Imports Inc', originCode: fmPrefill.airportLoadingCode, originName: AIRPORT_NAMES[fmPrefill.airportLoadingCode] ?? '', destCode: 'JFK', destName: AIRPORT_NAMES.JFK },
      { id: 'awb-mock-2', awbNo: '176-88213457', goodsDescription: 'Electronics', weight: '210', weightUnit: 'KG', shipperName: 'Acme Exports LLC', pieces: '5', shipmentDescCode: 'Part Consignment', consigneeName: 'Global Imports Inc', originCode: fmPrefill.airportLoadingCode, originName: AIRPORT_NAMES[fmPrefill.airportLoadingCode] ?? '', destCode: 'JFK', destName: AIRPORT_NAMES.JFK },
    ],
  }] : [];

  /* Detail-view field values, used by both the "View Request" page and (implicitly) future amend/cancel flows */
  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>{label}</span>
      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{value || '—'}</span>
    </div>
  );

  /* ─── Carrier Movement / Flight Manifest — dedicated Figma-matched sub-flows ─── */
  if (activeMenu === 'carrierMovement' && cmView === 'new') {
    return (
      <CarrierMovementNewRequestPage
        onBack={onBack}
        onBackToListing={() => setCmView('list')}
        onContinueToFlightManifest={() => { setCmView('list'); setFmView('new'); setActiveMenu('flightManifest'); }}
      />
    );
  }
  if (activeMenu === 'carrierMovement' && cmView === 'view' && cmSelectedRow) {
    return (
      <CarrierMovementViewPage
        row={cmSelectedRow as CarrierMovementRow}
        onBack={onBack}
        onBackToListing={() => { setCmView('list'); setCmSelectedRow(null); }}
      />
    );
  }
  if (activeMenu === 'flightManifest' && fmView === 'new') {
    return (
      <FlightManifestNewRequestPage
        viewOnly={fmRequestKind === 'view'}
        amend={fmRequestKind === 'amend'}
        initialFlightNo={fmPrefill?.flightNo}
        initialScheduleDate={fmPrefill ? toIsoDate(fmPrefill.scheduleDate) : undefined}
        initialAirportLoadingCode={fmPrefill?.airportLoadingCode}
        initialAirportLoadingName={fmPrefill ? (AIRPORT_NAMES[fmPrefill.airportLoadingCode] ?? '') : undefined}
        initialUnloadingRows={fmPrefill ? fmInitialUnloadingRows : undefined}
        onBack={onBack}
        onBackToListing={() => { setFmView('list'); setFmPrefill(null); setFmRequestKind('new'); }}
      />
    );
  }
  if (activeMenu === 'flightManifest' && fmView === 'upload' && fmSelectedRow) {
    return (
      <FlightManifestUploadPage
        row={fmSelectedRow as unknown as FlightManifestUploadRow}
        onBack={() => setFmView('list')}
        onBackToListing={() => { setFmView('list'); setFmSelectedRow(null); }}
      />
    );
  }
  if (activeMenu === 'flightManifest' && fmView === 'view' && fmSelectedRow) {
    return (
      <FlightManifestViewPage
        row={fmSelectedRow as unknown as FlightManifestViewRow}
        onBack={() => setFmView('list')}
        onBackToListing={() => { setFmView('list'); setFmSelectedRow(null); }}
      />
    );
  }

  /* ─── Sea Export Manifest / House Manifest / Delivery Advice — dedicated Figma-matched sub-flows ─── */
  if (activeMenu === 'seaExportManifest' && semView === 'new') {
    return (
      <SeaExportManifestNewRequestPage
        mode={semMode}
        amend={semRequestKind === 'amend'}
        viewOnly={semRequestKind === 'view'}
        initialBolNumber={semPrefill?.bolNumber}
        initialRotationNumber={semPrefill?.rotationNumber}
        initialCargoCode={semPrefill?.cargoCode}
        onBack={onBack}
        onBackToListing={() => { setSemView('list'); setSemPrefill(null); setSemRequestKind('new'); }}
      />
    );
  }
  if (activeMenu === 'seaExportManifest' && semView === 'upload' && semSelectedRow) {
    return (
      <SeaExportManifestUploadPage
        row={semSelectedRow as unknown as SeaExportManifestUploadRow}
        onBack={() => setSemView('list')}
        onBackToListing={() => { setSemView('list'); setSemSelectedRow(null); }}
      />
    );
  }
  if (activeMenu === 'houseManifest' && hmView === 'new') {
    return (
      <HouseManifestNewRequestPage onBack={onBack} onBackToListing={() => setHmView('list')} />
    );
  }
  if (activeMenu === 'deliveryAdvice' && daView === 'new') {
    return (
      <DeliveryAdviceNewRequestPage onBack={onBack} onBackToListing={() => setDaView('list')} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} onHome={onHome ?? onBack} />
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
              {fileDetailsRow ? (
                <>
                  <span className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2] transition-colors" style={{ fontFamily: font }} onClick={() => setFileDetailsRow(null)}>
                    {SIDEBAR_ITEMS.find(s => s.key === activeMenu)?.label}
                  </span>
                  <span className="text-[#dc3545] text-[15px] leading-none">/</span>
                  <span className="text-[#111838] text-[16px] font-medium" style={{ fontFamily: font }}>File Details</span>
                </>
              ) : viewRow ? (
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

          {fileDetailsRow ? (
            /* ─── File Details — File Details card + List of BOL table, matching the Figma "Track Upload" detail reference ─── */
            <>
              <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px] flex-shrink-0" style={{ fontFamily: font }}>File Details</h1>

              <div className="bg-white rounded-[8px] p-[24px] mb-[20px] flex-shrink-0" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px 20px' }}>
                  <Field label="File Name" value={str(fileDetailsRow.fileName)} />
                  <Field label="Upload Ref. No." value={str(fileDetailsRow.uploadRefNo)} />
                  <Field label="Rotation No." value={str(fileDetailsRow.rotationNumber)} />
                  <Field label="No. of BOLs" value={str(fileDetailsRow.noOfBols)} />
                  <Field label="No. of Successful BOLs" value={str(fileDetailsRow.noOfSuccessfulBols)} />
                  <Field label="Upload Date" value={str(fileDetailsRow.uploadDate)} />
                </div>
              </div>

              <div className="flex flex-col gap-[16px] flex-1">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of BOL</p>
                <div className="bg-white rounded-[8px] p-[20px] flex-1" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
                  <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>Total No. of BOLs: <b style={{ color: '#0e1b3d' }}>{bolLines.length}</b></p>
                  <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                    <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 760 }}>
                      <thead>
                        <tr style={{ background: '#e2ebf9' }}>
                          {['BOL No.', 'Cargo Code', 'Request ID', 'Status', 'Remarks', 'Action'].map(h => (
                            <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bolLines.length === 0 ? (
                          <tr><td colSpan={6} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No BOL records found for this upload.</td></tr>
                        ) : bolLines.map((line, i) => (
                          <tr key={i} style={{ borderTop: '1px solid #f0f4ff' }}>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{line.bolNo}</td>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{line.cargoCode}</td>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{line.requestId || '—'}</td>
                            <td className="px-[16px] py-[10px] text-[15px]" style={{ color: line.status === 'Error' ? '#dc3545' : '#28a745', fontWeight: 500 }}>{line.status}</td>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{line.remarks || '—'}</td>
                            <td className="px-[16px] py-[10px]">
                              {line.status === 'Success' && (
                                <button
                                  onClick={() => { setSemPrefill({ bolNumber: line.bolNo, rotationNumber: str(fileDetailsRow.rotationNumber) }); setSemRequestKind('amend'); setSemMode('manual'); setSemView('new'); setFileDetailsRow(null); }}
                                  className="text-[15px] text-[#1360d2] hover:underline" style={{ fontWeight: 500, fontFamily: font }}>
                                  Amend
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <BackToListingBar onBackToListing={() => setFileDetailsRow(null)} />
            </>
          ) : viewRow ? (
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
                  <div className="flex items-center flex-1 min-w-0 h-full overflow-hidden">
                    <button type="button" onClick={() => setSearchTypeOpen(o => !o)}
                      className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 max-w-[160px] hover:bg-[#f7faff] transition-colors">
                      <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: font }}>{colLabel(searchKey)}</span>
                      <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform flex-shrink-0 ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="flex items-center flex-1 min-w-0 px-[12px]">
                      <input type="text" value={searchValue}
                        onChange={e => { setSearchValue(e.target.value); setPage(1); if (searchQuery && e.target.value.trim() === '') setSearchQuery(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setSearchQuery(searchValue); } }}
                        placeholder={`Search ${colLabel(searchKey)}`}
                        className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                        style={{ fontFamily: font }} />
                      {searchValue !== '' && (
                        <button type="button" onClick={() => { setSearchValue(''); setSearchQuery(''); }} aria-label="Clear search"
                          className="flex-shrink-0 mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] hover:text-[#0e1b3d] transition-colors">
                          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l10 10M15 5l-10 10" /></svg>
                        </button>
                      )}
                      <button type="button" onClick={() => setSearchQuery(searchValue)} aria-label="Search" className="flex-shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#8f94ae" strokeWidth="1.8" className="flex-shrink-0">
                          <circle cx="9" cy="9" r="6" /><path d="M15 15l-3-3" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {searchTypeOpen && (
                    <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 210, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                      {config.searchKeys.map(k => (
                        <button key={k} onClick={() => { setSearchKey(k); setSearchTypeOpen(false); setSearchValue(''); setSearchQuery(''); }}
                          className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                          style={{ color: k === searchKey ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: k === searchKey ? 500 : 400 }}>
                          {colLabel(k)}
                        </button>
                      ))}
                    </div>
                  )}
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
                  {activeMenu === 'seaExportManifest' && (
                    <button onClick={() => { setSemMode('upload'); setSemRequestKind('new'); setSemPrefill(null); setSemView('new'); }}
                      className="h-[48px] px-[22px] rounded-[4px] text-[16px] flex-shrink-0 transition-colors"
                      style={{ border: '1px solid #1360d2', color: '#1360d2', background: '#fff', fontFamily: font, fontWeight: 500 }}>
                      Upload BOL's
                    </button>
                  )}
                  <button onClick={() => {
                      if (activeMenu === 'carrierMovement') setCmView('new');
                      else if (activeMenu === 'flightManifest') { setFmRequestKind('new'); setFmPrefill(null); setFmView('new'); }
                      else if (activeMenu === 'seaExportManifest') { setSemMode('manual'); setSemRequestKind('new'); setSemPrefill(null); setSemView('new'); }
                      else if (activeMenu === 'houseManifest') setHmView('new');
                      else if (activeMenu === 'deliveryAdvice') setDaView('new');
                      else setShowNewRequest(true);
                    }}
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
                  {/* Standing rule: Apply/Reset always sit inline as the grid cell right after the last filter field, never on their own row below. */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(config.advancedFilterKeys ?? config.columns.slice(1, 4).map(c => c.key)).flatMap(key => {
                      const col = config.columns.find(c => c.key === key);
                      if (!col) return [];
                      const isDate = col.key.toLowerCase().includes('date') || col.key === 'eta' || col.key === 'etd' || col.key === 'ata';
                      return isDate ? [
                        <DateInput key={`${col.key}From`} label={`${col.label} From`} value={afValues[`${col.key}From`] ?? ''} onChange={v => setAfValues(p => ({ ...p, [`${col.key}From`]: v }))} />,
                        <DateInput key={`${col.key}To`} label={`${col.label} To`} value={afValues[`${col.key}To`] ?? ''} onChange={v => setAfValues(p => ({ ...p, [`${col.key}To`]: v }))} />,
                      ] : [
                        <FilterInput key={col.key} label={col.label} value={afValues[col.key] ?? ''} onChange={v => setAfValues(p => ({ ...p, [col.key]: v }))} />,
                      ];
                    })}
                    {activeMenu === 'seaExportManifest' && (
                      <FilterSelect label="Status Type" value={afStatusType} onChange={setAfStatusType} options={['Upload Status', 'BOL Status']} />
                    )}
                    {activeMenu === 'seaExportManifest' && afStatusType !== '' && (
                      <>
                        <DateInput label="Date From" value={afDateFrom} onChange={setAfDateFrom} />
                        <DateInput label="Date To" value={afDateTo} onChange={setAfDateTo} />
                      </>
                    )}
                    <div className="flex items-end gap-[10px]">
                      <button onClick={() => setPage(1)} className="h-[44px] px-5 rounded-[4px] text-[15px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font }}>
                        Apply
                      </button>
                      <button onClick={() => { setAfValues({}); setAfStatusType(''); setAfDateFrom(''); setAfDateTo(''); setPage(1); }}
                        className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] flex-shrink-0" style={{ fontFamily: font }}>
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showTrackUpload ? (
                /* ─── Sea Export Manifest: File Reference Number search swaps just the table below, matching the Figma "Track Upload" reference ─── */
                (() => {
                  const TU_ACTIONS_W = 72;
                  const TU_STATUS_W = 150;
                  const tuStickyWidth = TU_ACTIONS_W + TU_STATUS_W;
                  return (
                  <div className="pb-[20px] flex-1 flex flex-col">
                    <p className="text-[15px] text-[#0e1b3d] mb-[12px] flex-shrink-0" style={{ fontFamily: font }}>
                      Total No. of records found: <b>{trackUploadRows.length}</b>
                    </p>
                    <div className="flex-1" style={{ position: 'relative' }}>
                      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={tuStickyWidth} />
                      <div ref={scrollRef} onScroll={handleScroll} className="bg-white rounded-[8px] overflow-x-auto" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)', position: 'relative' }}>
                        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1100 }}>
                          <thead>
                            <tr style={{ background: '#a6c2e9' }}>
                              {['Upload Reference Number', 'Date Of Upload', 'Rotation No.', 'BOL Number', 'No. Of Uploaded Files', 'No. Of Files Successful', 'No. Of Files Failed'].map(h => (
                                <th key={h} className="text-left text-[16px] text-[#051937]" style={{ padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                              <th className="text-left text-[16px] text-[#051937]" style={{
                                position: 'sticky', right: TU_ACTIONS_W, width: TU_STATUS_W, minWidth: TU_STATUS_W,
                                padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap', background: '#a6c2e9', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                              }}>Uploaded Status</th>
                              <th className="text-left text-[16px] text-[#051937]" style={{
                                position: 'sticky', right: 0, width: TU_ACTIONS_W, minWidth: TU_ACTIONS_W,
                                padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap', background: '#a6c2e9', zIndex: 2, borderRadius: '0 8px 0 0',
                              }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trackUploadRows.length === 0 ? (
                              <tr><td colSpan={9} style={{ padding: '40px 12px', textAlign: 'center' }}><span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>No matching upload records found.</span></td></tr>
                            ) : trackUploadRows.map((row, i) => {
                              const failed = Number(row.noOfBols ?? 0) - Number(row.noOfSuccessfulBols ?? 0);
                              const uploadedStatus = failed > 0 ? 'FAILURE' : 'SUCCESS';
                              const st = uploadedStatus === 'FAILURE' ? { bg: 'rgba(220,53,69,0.10)', color: '#dc3545' } : { bg: 'rgba(40,167,69,0.10)', color: '#28a745' };
                              return (
                              <tr key={i} style={{ borderTop: '1px solid #f0f4ff' }}>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap', background: '#fff' }}>{str(row.uploadRefNo)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap', background: '#fff' }}>{str(row.uploadDate)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', background: '#fff' }}>{str(row.rotationNumber)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', background: '#fff' }}>{str(row.bolNumber)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', background: '#fff' }}>{str(row.noOfBols)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', background: '#fff' }}>{str(row.noOfSuccessfulBols)}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', background: '#fff' }}>{failed > 0 ? failed : '0'}</td>
                                <td style={{ position: 'sticky', right: TU_ACTIONS_W, width: TU_STATUS_W, minWidth: TU_STATUS_W, padding: '12px', background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                                  <span className="text-[15px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap" style={{ background: st.bg, color: st.color }}>{uploadedStatus}</span>
                                </td>
                                <td style={{ position: 'sticky', right: 0, width: TU_ACTIONS_W, minWidth: TU_ACTIONS_W, padding: '12px', background: '#fff' }}>
                                  <button type="button" onClick={() => { setFileDetailsRow(row); }} aria-label="View file details"
                                    className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#e8f0ff] transition-colors" style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
                                  </button>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  );
                })()
              ) : (
              <div className="pb-[20px] flex-1" style={{ position: 'relative' }}>
                {!config.noScrollArrows && (
                  <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={config.lockedColumns.reduce((s, c) => s + lockedColW(c), 0)} />
                )}
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
                      {config.lockedColumns.map((col, li) => {
                        const right = config.lockedColumns.slice(li + 1).reduce((s, c) => s + lockedColW(c), 0);
                        const w = lockedColW(col);
                        const isLast = li === config.lockedColumns.length - 1;
                        return (
                          <th key={col.key} style={{
                            background: '#a6c2e9', padding: '10px 12px', textAlign: col.key === 'actions' ? 'center' : 'left', fontWeight: 500,
                            position: 'sticky', right, minWidth: w, width: w,
                            boxShadow: li === 0 ? '-3px 0 6px rgba(0,0,0,0.06)' : undefined,
                            borderTopRightRadius: isLast ? 8 : 0, borderBottomRightRadius: isLast ? 8 : 0,
                            zIndex: 2,
                          }}>
                            <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr><td colSpan={orderedVisible.length + config.lockedColumns.length} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>No matching records found.</span>
                      </td></tr>
                    ) : paginated.map((row, i) => {
                      return (
                        <tr key={str(row[config.refKey])}>
                          {orderedVisible.map((col, ci) => (
                            <td key={col.key} data-col-key={col.key} style={{ background: getTdBg(col.key) ?? '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', paddingLeft: ci === 0 ? 16 : 12, width: getW(col.key, col.w), minWidth: getW(col.key, col.w), whiteSpace: 'nowrap' }}>
                              {col.key === config.refKey ? (
                                <button onClick={() => {
                                    if (activeMenu === 'carrierMovement') { setCmSelectedRow(row); setCmView('view'); }
                                    else setViewRow(row);
                                  }}
                                  className="text-[16px] text-[#1360d2] font-medium hover:underline whitespace-nowrap overflow-hidden text-ellipsis block" style={{ fontFamily: font, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                  {str(row[col.key])}
                                </button>
                              ) : (
                                <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap overflow-hidden text-ellipsis block">{str(row[col.key])}</span>
                              )}
                            </td>
                          ))}
                          {config.lockedColumns.map((col, li) => {
                            const right = config.lockedColumns.slice(li + 1).reduce((s, c) => s + lockedColW(c), 0);
                            const w = lockedColW(col);
                            const cellZ = openFlyout === i ? (col.key === 'actions' ? 50 : 49) : 1;
                            if (col.key === 'actions') {
                              return (
                                <td key={col.key} style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right, width: w, minWidth: w, zIndex: cellZ }}>
                                  <div className="relative inline-block">
                                    <button onClick={() => setOpenFlyout(openFlyout === i ? null : i)} className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                                      <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498"><circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" /></svg>
                                    </button>
                                    {openFlyout === i && (
                                      <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ top: 36, width: 208, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                                        {(config.flyoutItems ?? ['View Request', 'Amend Request', 'Cancel Request']).map(label => (
                                          <button key={label} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                            onClick={() => {
                                              setOpenFlyout(null);
                                              if (activeMenu === 'carrierMovement') {
                                                if (label === 'View Request' || label === 'Cancel') { setCmSelectedRow(row); setCmView('view'); }
                                                else setShowNewRequest(true); // Amend — no design provided yet
                                              } else if (activeMenu === 'flightManifest') {
                                                if (label === 'Upload Manifest') { setFmSelectedRow(row); setFmView('upload'); }
                                                else if (label === 'View Manifest') { setFmSelectedRow(row); setFmView('view'); }
                                                else if (label === 'View Manifest Request') {
                                                  setFmPrefill({ flightNo: str(row.flightNo), scheduleDate: str(row.scheduleDate), airportLoadingCode: str(row.airportLoading) });
                                                  setFmRequestKind('view'); setFmView('new');
                                                }
                                                else if (label === 'Amend') {
                                                  setFmPrefill({ flightNo: str(row.flightNo), scheduleDate: str(row.scheduleDate), airportLoadingCode: str(row.airportLoading) });
                                                  setFmRequestKind('amend'); setFmView('new');
                                                }
                                                else if (label === 'Error Files') setErrorFilesRow(row);
                                                else setShowNewRequest(true); // Cancel — no design provided yet
                                              } else if (activeMenu === 'seaExportManifest') {
                                                if (label === 'Upload BOL') { setSemSelectedRow(row); setSemView('upload'); }
                                                else if (label === 'View Manifest Request') {
                                                  setSemPrefill({ bolNumber: str(row.bolNumber), rotationNumber: str(row.rotationNumber), cargoCode: str(row.cargoType) });
                                                  setSemRequestKind('view'); setSemMode('manual'); setSemView('new');
                                                }
                                                else if (label === 'Amend Request') {
                                                  setSemPrefill({ bolNumber: str(row.bolNumber), rotationNumber: str(row.rotationNumber), cargoCode: str(row.cargoType) });
                                                  setSemRequestKind('amend'); setSemMode('manual'); setSemView('new');
                                                }
                                                else if (label === 'Audit History') setAuditHistoryRow(row);
                                                else setShowNewRequest(true); // Download Error Report/Cancel — no design provided yet
                                              } else if (label === 'View Request') {
                                                setViewRow(row);
                                              }
                                            }}>
                                            <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            }
                            const styles = config.lockedStatusStyles?.[col.key] ?? STATUS_STYLE;
                            const st = styles[str(row[col.key])] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                            return (
                              <td key={col.key} style={{ background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', position: 'sticky', right, width: w, minWidth: w, boxShadow: li === 0 ? '-3px 0 6px rgba(0,0,0,0.06)' : undefined, zIndex: cellZ }}>
                                <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                                  {str(row[col.key])}
                                </span>
                              </td>
                            );
                          })}
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
              )}
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

      {errorFilesRow && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-[20px]" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setErrorFilesRow(null)}>
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(640px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: font }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#455174] flex items-center justify-between px-[24px] py-[16px]">
              <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>List Of Errors</p>
              <button onClick={() => setErrorFilesRow(null)} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="px-[24px] py-[20px]">
              <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>
                File: <span style={{ color: '#0e1b3d', fontWeight: 500 }}>{str(errorFilesRow.flightNo)}_{str(errorFilesRow.manifestType)}_manifest.txt</span>
              </p>
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f4ff' }}>
                      <th className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, width: 60 }}>S.No</th>
                      <th className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Number(errorFilesRow.filesFailed) > 0 ? [
                      `Rejected Flight Manifest for Flight Number ${str(errorFilesRow.flightNo)} scheduled on ${str(errorFilesRow.scheduleDate)} identified as duplicate flight manifest.`,
                    ] : ['No errors reported for this upload.']).map((msg, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d] align-top">{idx + 1}</td>
                        <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{msg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center pb-[20px]">
              <button onClick={() => setErrorFilesRow(null)}
                className="h-[42px] px-[22px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[8px]" style={{ background: '#455174', fontFamily: font, fontWeight: 500 }}>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l8 8M14 6l-8 8" /></svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {auditHistoryRow && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-[20px]" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setAuditHistoryRow(null)}>
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(600px, 100%)', maxHeight: '86vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: font }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[16px] flex-shrink-0">
              <div className="flex items-center gap-[10px]">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 3" /></svg>
                <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>Audit History</p>
              </div>
              <button onClick={() => setAuditHistoryRow(null)} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="px-[24px] py-[16px] flex items-center gap-[32px] flex-wrap flex-shrink-0" style={{ background: '#f8fafd', borderBottom: '1px solid #eef1f6' }}>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[11px] text-[#8f94ae]" style={{ fontWeight: 600, letterSpacing: '0.06em' }}>BOL NUMBER</span>
                <span className="text-[15px] text-[#1360d2]" style={{ fontWeight: 500 }}>{str(auditHistoryRow.bolNumber) || str(auditHistoryRow.flightNo)}</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[11px] text-[#8f94ae]" style={{ fontWeight: 600, letterSpacing: '0.06em' }}>ROTATION NO.</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{str(auditHistoryRow.rotationNumber) || '—'}</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[11px] text-[#8f94ae]" style={{ fontWeight: 600, letterSpacing: '0.06em' }}>CURRENT STATUS</span>
                <span className="inline-flex items-center gap-[6px] text-[14px]" style={{ color: '#28a745', fontWeight: 500 }}>
                  <span className="size-[6px] rounded-full" style={{ background: '#28a745' }} />
                  {str(auditHistoryRow.status) === 'Active' && str(auditHistoryRow.uploadRefNo) !== '—' && str(auditHistoryRow.uploadRefNo) ? 'Uploaded' : str(auditHistoryRow.status)}
                </span>
              </div>
            </div>
            <div className="px-[24px] py-[20px] overflow-y-auto" style={{ flex: 1 }}>
              {[
                { icon: 'clock', color: '#1360d2', title: 'Manifest Created', desc: `${str(auditHistoryRow.bolNumber) || str(auditHistoryRow.flightNo)} created with rotation ${str(auditHistoryRow.rotationNumber) || '—'}`, ts: str(auditHistoryRow.createdDate) || str(auditHistoryRow.lastModifiedDate) || '—', by: 'mohd.hamdan@trade.ae' },
                { icon: 'check', color: '#28a745', title: 'BOL Submitted', desc: 'Manifest submitted to DP World port system', ts: str(auditHistoryRow.lastModifiedDate) || '—', by: 'mohd.hamdan@trade.ae' },
                ...(str(auditHistoryRow.uploadRefNo) && str(auditHistoryRow.uploadRefNo) !== '—' ? [
                  { icon: 'clock', color: '#1360d2', title: 'File Uploaded', desc: `${str(auditHistoryRow.fileName) || 'manifest file'} uploaded (${str(auditHistoryRow.uploadRefNo)})`, ts: str(auditHistoryRow.uploadDate) || '—', by: 'mohd.hamdan@trade.ae' },
                  { icon: 'check', color: '#28a745', title: 'Upload Processed', desc: `${str(auditHistoryRow.noOfSuccessfulBols) || '0'} of ${str(auditHistoryRow.noOfBols) || '0'} BOL records processed successfully`, ts: str(auditHistoryRow.uploadDate) || '—', by: 'System' },
                ] : []),
              ].map((ev, idx, arr) => (
                <div key={idx} className="flex gap-[14px]">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="size-[32px] rounded-full flex items-center justify-center" style={{ background: ev.color === '#28a745' ? '#eafaf0' : '#e2ebf9' }}>
                      {ev.icon === 'clock' ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={ev.color} strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={ev.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
                      )}
                    </span>
                    {idx < arr.length - 1 && <span className="w-[2px] flex-1" style={{ background: '#eef1f6', minHeight: 32 }} />}
                  </div>
                  <div className="pb-[24px] flex-1 flex items-start justify-between gap-[12px]">
                    <div>
                      <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{ev.title}</p>
                      <p className="text-[14px] text-[#455174]">{ev.desc}</p>
                      <p className="text-[13px] text-[#8f94ae]">By: {ev.by}</p>
                    </div>
                    <span className="text-[13px] text-[#8f94ae] whitespace-nowrap">{ev.ts}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #eef1f6' }}>
              <button onClick={() => setAuditHistoryRow(null)}
                className="h-[42px] px-[22px] rounded-[4px] border text-[15px]" style={{ borderColor: '#d5ddfb', color: '#455174', fontFamily: font, fontWeight: 500 }}>
                Close
              </button>
            </div>
          </div>
        </div>
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
