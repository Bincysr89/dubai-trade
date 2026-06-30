import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import VccTable, { type VccRow } from './VccTable';
import VccListPopup from './VccListPopup';
import VccRecheckSuccessModal from './VccRecheckSuccessModal';
import VccVehicleSearchTable from './VccVehicleSearchTable';
import CustomsDeclarationViewPage from './CustomsDeclarationViewPage';
import RequestVccPage from './RequestVccPage';
import VccSearchResultPage from './VccSearchResultPage';
import VccViewRequestPage from './VccViewRequestPage';
import VccPaymentSuccessPage from './VccPaymentSuccessPage';
import VccEPaymentPendingPage from './VccEPaymentPendingPage';
import VccEPaymentSuccessPage from './VccEPaymentSuccessPage';
import VccEPaymentConfirmedPage from './VccEPaymentConfirmedPage';
import VccEPaymentFailedPage from './VccEPaymentFailedPage';
import VccAuditHistoryPage from './VccAuditHistoryPage';
import VccUpdatePaymentModePage from './VccUpdatePaymentModePage';
import EPaymentsTable from './EPaymentsTable';
import CargoTransferTable from './CargoTransferTable';
import ClaimsTable from './ClaimsTable';
import AcknowledgementTable, { ACK_ROWS } from './AcknowledgementTable';
import { AckAcceptConfirmModal, AckDeclineReasonModal, AckDeclineConfirmModal, AckSuccessPage } from './AckModals';
import StatusFilterHeader from './StatusFilterHeader';
import EligibleDeclarationsPage from './EligibleDeclarationsPage';
import RaiseClaimRequestPage from './RaiseClaimRequestPage';
import type { ClaimType } from './ClaimTypeSelectionPage';
import { RefundTypePage, OutboundDeclarationPage, MissingDocDepositPage, DocumentUploadPage, PaymentDetailsPage, REFUND_TYPE_LABEL, type RefundType } from './ClaimSubPages';
import CargoTransferPrePage from './CargoTransferPrePage';
import CargoTransferRequestPage from './CargoTransferRequestPage';
import CargoTransferNewRequestPage from './CargoTransferNewRequestPage';
import CargoTransferSuccessPage from './CargoTransferSuccessPage';
import CargoTransferDocumentPage from './CargoTransferDocumentPage';
import CargoTransferStepperPage from './CargoTransferStepperPage';
import CargoTransferPaymentReviewPage from './CargoTransferPaymentReviewPage';
import CargoTransferViewPage from './CargoTransferViewPage';
import CargoTransferCancelFlow from './CargoTransferCancelFlow';
import CargoTransferReceiptReleasePage from './CargoTransferReceiptReleasePage';
import CargoTransferHistoryPage from './CargoTransferHistoryPage';
import SuspensionHistoryPage from './SuspensionHistoryPage';
import SuspensionHistoryViewPage from './SuspensionHistoryViewPage';
import SuspensionResponsePage from './SuspensionResponsePage';
import SuspensionSuccessModal from './SuspensionSuccessModal';
import ClaimSubmittedSuccessPage from './ClaimSubmittedSuccessPage';
import NonRemittanceDocumentsPage from './NonRemittanceDocumentsPage';
import ClaimTypeEntryPage from './ClaimTypeEntryPage';
import NonRemittanceChargesPage from './NonRemittanceChargesPage';
import NonRemittanceReviewPage from './NonRemittanceReviewPage';
import NonRemittanceSuccessPage from './NonRemittanceSuccessPage';
import NonRemittanceAckPage from './NonRemittanceAckPage';
import NonRemittanceClaimViewPage from './NonRemittanceClaimViewPage';
import ClaimsAuditHistoryPage from './ClaimsAuditHistoryPage';
import NRPaymentProcessingPage from './NRPaymentProcessingPage';
import NRPaymentSuccessPage from './NRPaymentSuccessPage';
import NRPaymentRejectedPage from './NRPaymentRejectedPage';
import type { Row } from './EligibleDeclarationsPage';
import { ColumnFilter } from './ColumnFilter';
import { DateInput } from './DatePicker';
// @ts-ignore
import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
// @ts-ignore
import integratedClearanceSrc from '../assets/integratedclearance.svg';
// @ts-ignore
import paymentsSrc from '../assets/payments.svg';
// @ts-ignore
import cargoWavesSrc from '../assets/cargowaves.svg';
// @ts-ignore
import declarationSrc from '../assets/declaration.svg';
// @ts-ignore
import acknowledgementSrc from '../assets/acknoeldgement.svg';
// @ts-ignore
import vccSrc from '../assets/VCC.svg';
// @ts-ignore
import refundsSrc from '../assets/REFUNDS.svg';
// @ts-ignore
import cargoTransferSrc from '../assets/cargotrasnfer.svg';
// @ts-ignore
import waveSrc from '../assets/wave.svg';

// Figma asset URLs (valid for 7 days)
const wlpLogoSrc = 'https://www.figma.com/api/mcp/asset/09b98e1a-ea9f-41ca-97a4-31b56c097b09';
const aeoLogoSrc = 'https://www.figma.com/api/mcp/asset/5de21541-f817-4a23-bf16-0ba8c4300be7';

type Props = {
  onClose: () => void;
  onServiceCatalogue?: () => void;
};


type BadgeType = 'both' | 'aeo' | 'wlp';
type DeclStatus = 'Completed' | 'Submitted' | 'Payment Pending' | 'VAT Payment Pending' | 'Declined' | 'Cancelled' | 'Clearance Inspection';

const STATUS_STYLE: Record<DeclStatus, { bg: string; color: string; border: string }> = {
  'Completed':              { bg: '#e6f4ec', color: '#1b6c3a', border: '#a8d5b8' },
  'Submitted':            { bg: '#e8f0ff', color: '#1360d2', border: '#b3caff' },
  'Payment Pending':      { bg: 'rgba(255,169,26,0.16)', color: '#b45309', border: '#fcd7a0' },
  'VAT Payment Pending':  { bg: 'rgba(255,169,26,0.16)', color: '#b45309', border: '#fcd7a0' },
  'Declined':             { bg: '#fde8e8', color: '#c0392b', border: '#f5b8b8' },
  'Cancelled':            { bg: '#f0f0f3', color: '#4a4f60', border: '#d0d3de' },
  'Clearance Inspection': { bg: '#e6f4ec', color: '#1b6c3a', border: '#a8d5b8' },
};

// Figma asset URLs for flyout icons (valid 7 days)
const flyoutIcons = {
  eye:     'https://www.figma.com/api/mcp/asset/54f63cca-ab32-420e-9562-b3653ed20d3b',
  edit:    'https://www.figma.com/api/mcp/asset/747c197c-57e3-4b4b-8203-a9af9e05828d',
  cancel:  'https://www.figma.com/api/mcp/asset/19b4409e-4a30-4551-8af2-090cff64d382',
  payment: 'https://www.figma.com/api/mcp/asset/4c2f63a8-2be3-49c5-bf87-ffd8b832cb64',
  history: 'https://www.figma.com/api/mcp/asset/0795ebbf-9e2d-4a19-ba44-0dc98340a3d5',
  print:   'https://www.figma.com/api/mcp/asset/926990db-4fa2-436b-a237-0f2df32ca565',
  article: 'https://www.figma.com/api/mcp/asset/baf825bc-211b-41be-b088-a4a9dff64f7b',
};

const FLYOUT_ITEMS = [
  { icon: flyoutIcons.eye,     label: 'View Declaration' },
  { icon: flyoutIcons.edit,    label: 'Amend' },
  { icon: flyoutIcons.cancel,  label: 'Cancel' },
  { icon: flyoutIcons.payment, label: 'E-Payment' },
  { icon: flyoutIcons.payment, label: 'VCC Requests' },
  { icon: flyoutIcons.history, label: 'Declaration History' },
  { icon: flyoutIcons.history, label: "Declarant's Suspension Response" },
  { icon: flyoutIcons.history, label: 'Suspension History' },
  { icon: flyoutIcons.print,   label: 'Print Declaration' },
  { icon: flyoutIcons.article, label: 'Apply for Permit' },
];

const DECLARATIONS: {
  no: string; badge: BadgeType; type: string; date: string;
  owner: string; channel: string; reqNo: string; reqType: string;
  clientRef: string; carrierReg: string; mawb: string; hawb: string;
  doNo: string; permit: boolean; broker: string; createdBy: string;
  statusDate: string; status: DeclStatus; showInfo?: boolean;
}[] = [
  { no:'1012132132', badge:'both', type:'Export from Local',                               date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'JOB213354578',   carrierReg:'JOB213354578',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'NIL',       permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Completed' },
  { no:'1012132132', badge:'aeo',  type:'Export Statistical',                               date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'PGH658916794',   carrierReg:'PGH658916794',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Submitted' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'GJF4589789487',  carrierReg:'GJF4589789487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:false, broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Submitted' },
  { no:'1012132132', badge:'both', type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'VNF215648748',   carrierReg:'VNF215648748',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Payment Pending' },
  { no:'1012132132', badge:'aeo',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'TYT4897879487',  carrierReg:'TYT4897879487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:false, broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'VAT Payment Pending' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'TYT4897879487',  carrierReg:'TYT4897879487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Declined',   showInfo:true },
  { no:'1012132132', badge:'aeo',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'24/02/24, 09:30', carrierReg:'24/02/24, 09:30', mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Cancelled' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'24/02/24, 09:30', carrierReg:'24/02/24, 09:30', mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Clearance Inspection' },
];


export default function DeclarationListPage({ onClose, onServiceCatalogue }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'epay'>('all');
  const [ePayVccFilter, setEPayVccFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  // TODO: derive from auth context. For now broker login is enabled by default
  // so the Customer Type / Code filters are visible.
  const isBroker = true;
  const [showDrafts, setShowDrafts] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [searchType, setSearchType] = useState('Declaration');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  /** Submitted query — populated only when the user presses Enter or clicks the search icon. */
  const [searchQuery, setSearchQuery] = useState('');
  const submitSearch = () => {
    if (searchValue.trim() !== '') setSearchQuery(searchValue.trim());
  };
  const [ePayReqType, setEPayReqType] = useState('');
  const [ePayReqTypeOpen, setEPayReqTypeOpen] = useState(false);

  // Toolbar Status filter — declared here; effect that depends on `activeMenu`
  // is placed below where `activeMenu` is defined to avoid a TDZ error.
  const [toolbarStatus, setToolbarStatus] = useState<string | null>(null);
  const [toolbarStatusOpen, setToolbarStatusOpen] = useState(false);
  const toolbarStatusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toolbarStatusOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (toolbarStatusRef.current && !toolbarStatusRef.current.contains(e.target as Node)) setToolbarStatusOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [toolbarStatusOpen]);
  const [vccStep, setVccStep] = useState<'list' | 'create' | 'searchResult' | 'retryRequest' | 'amend' | 'viewRequest' | 'paymentSuccess' | 'ePaymentPending' | 'ePaymentSuccess' | 'ePaymentProcessing' | 'ePaymentConfirmed' | 'ePaymentFailed' | 'auditHistory' | 'declarationView' | 'updatePaymentMode' | 'creditDebitFailed' | 'retryPayment'>('list');
  const [selectedVccStatus, setSelectedVccStatus] = useState('');
  const [vccListPopupRow, setVccListPopupRow] = useState<VccRow | null>(null);
  const [recheckModalOpen, setRecheckModalOpen] = useState(false);
  const [vccDeclNo, setVccDeclNo] = useState<string>('');
  const [vccRetryReqNo, setVccRetryReqNo] = useState<string>('');
  const [cargoStep, setCargoStep] = useState<'list' | 'pre' | 'create' | 'amend' | 'success' | 'amendSuccess' | 'document' | 'stepper' | 'paymentReview' | 'viewRequest' | 'cancel' | 'cargoHistory' | 'suspensionHistory' | 'suspensionHistoryView' | 'suspensionResponse' | 'receiptRelease'>('list');
  const [showSuspensionSuccess, setShowSuspensionSuccess] = useState(false);
  const [suspensionHistoryFrom, setSuspensionHistoryFrom] = useState<'list' | 'cargoHistory'>('list');
  const [cargoFlowMode, setCargoFlowMode] = useState<'create' | 'amend'>('create');
  const [cargoTransferNumber, setCargoTransferNumber] = useState('');
  const [stepperReturnStep, setStepperReturnStep] = useState(0);
  const [cargoPreValues, setCargoPreValues] = useState<{ cargoChannel: string; clientRef: string; carrierReg: string; transferType: string }>({ cargoChannel: 'Sea', clientRef: '', carrierReg: '', transferType: '' });
  const [cargoFormValues, setCargoFormValues] = useState<{ clientRef: string; carrierReg: string; mawb: string; transferorBizCode: string; transferorPremCode: string; transfereeBizCode: string; transfereePremCode: string }>({ clientRef: '', carrierReg: '', mawb: '', transferorBizCode: '', transferorPremCode: '', transfereeBizCode: '', transfereePremCode: '' });
  type ClaimSubStep = 'list' | 'claimTypeEntry' | 'eligible' | 'refundType' | 'outbound' | 'missingDoc' | 'documents' | 'payment' | 'success' | 'nonRemittanceDocs' | 'nonRemittanceCharges' | 'nonRemittanceReview' | 'nonRemittanceSuccess' | 'nonRemittanceAck' | 'nonRemittanceClaimView' | 'claimListView' | 'claimHistory' | 'nrPaymentProcessing' | 'nrPaymentSuccess' | 'nrPaymentRejected';
  const [claimDeclViewOpen, setClaimDeclViewOpen] = useState(false);
  const [claimStep, setClaimStep] = useState<ClaimSubStep>('list');
  const [claimContext, setClaimContext] = useState<{ claimType: ClaimType; declarationNo: string; depositType: string; declarationCategory: string | null; refundType?: RefundType; allowedRefundTypes?: RefundType[] } | null>(null);
  const [nonRemittanceRows, setNonRemittanceRows] = useState<Row[]>([]);
  const [nonRemittancePaymentMode, setNonRemittancePaymentMode] = useState('');
  const [nonRemittanceAccountNo, setNonRemittanceAccountNo] = useState('');
  const [selectedClaimTypeForFlow, setSelectedClaimTypeForFlow] = useState<ClaimType | null>(null);
  const [claimViewReturnStep, setClaimViewReturnStep] = useState<ClaimSubStep>('nonRemittanceSuccess');
  const [ackStep, setAckStep] = useState<'list' | 'acceptSuccess' | 'declineSuccess'>('list');
  const [ackSelected, setAckSelected] = useState<Set<number>>(new Set());
  const [ackAcceptOpen, setAckAcceptOpen] = useState(false);
  const [ackDeclineReasonOpen, setAckDeclineReasonOpen] = useState(false);
  const [ackDeclineConfirmOpen, setAckDeclineConfirmOpen] = useState(false);
  const [ackDeclineRowIndex, setAckDeclineRowIndex] = useState<number | null>(null);
  const [declStatusFilter, setDeclStatusFilter] = useState<DeclStatus | null>(null);
  const DECL_STATUS_COLOR: Record<DeclStatus, string> = {
    'Completed': '#1b6c3a', 'Submitted': '#1360d2', 'Payment Pending': '#b45309',
    'VAT Payment Pending': '#b45309', 'Declined': '#dc3545',
    'Cancelled': '#697498', 'Clearance Inspection': '#1360d2',
  };
  const ackDeclarationNumbers = (() => {
    if (ackStep === 'acceptSuccess') return Array.from(ackSelected).map((i) => ACK_ROWS[i]?.declaration).filter(Boolean) as string[];
    if (ackStep === 'declineSuccess' && ackDeclineRowIndex !== null) return [ACK_ROWS[ackDeclineRowIndex]?.declaration].filter(Boolean) as string[];
    return [];
  })();
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'Declaration' | 'Acknowledgement' | 'VCC' | 'Refund & Claims' | 'Cargo Transfer' | 'E-Payment'>('Declaration');

  // Status options per menu — defined here so it can reference `activeMenu`.
  const TOOLBAR_STATUS_OPTIONS: Record<typeof activeMenu, string[]> = {
    'Declaration':       ['Completed', 'Submitted', 'Payment Pending', 'VAT Payment Pending', 'Declined', 'Cancelled', 'Clearance Inspection'],
    'Acknowledgement':   ['Accepted', 'Pending', 'Declined'],
    'VCC':               ['Submitted', 'Payment Pending', 'Payment Failed', 'Under Processing', 'Completed'],
    'Refund & Claims':   ['Under Processing', 'Completed', 'Suspended', 'Draft'],
    'Cargo Transfer':    ['Completed', 'Submitted', 'Cancelled'],
    'E-Payment':         ['Pending', 'Completed', 'Failed'],
  };
  // Reset toolbar status when switching tabs so previous filter doesn't leak.
  useEffect(() => { setToolbarStatus(null); }, [activeMenu]);

  // Reset the search-type dropdown when switching modules or tabs so options stay consistent
  useEffect(() => {
    if (activeMenu === 'E-Payment' || activeTab === 'epay') {
      setSearchType('Declaration Number');
    } else {
      setSearchType(activeMenu === 'VCC' ? 'Request Number' : activeMenu === 'Cargo Transfer' ? 'Cargo Transfer No.' : activeMenu === 'Refund & Claims' ? 'Declaration Number' : 'Declaration');
    }
    setSearchTypeOpen(false);
    setSearchValue('');
    setSearchQuery('');
    setEPayReqType('');
    setEPayReqTypeOpen(false);
  }, [activeMenu, activeTab]);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [filterFocused, setFilterFocused] = useState<Record<string, boolean>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const flyoutRef = useRef<HTMLDivElement>(null);

  const isFloated = (key: string) => filterFocused[key] || !!filterValues[key];
  const floatLabel = (active: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: 12,
    top: active ? 0 : '50%',
    transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: active ? '#697498' : '#0e1b3d',
    background: active ? 'white' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none',
    transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease, background 0.15s ease',
    fontFamily: "'Dubai', sans-serif",
    whiteSpace: 'nowrap',
    zIndex: 1,
  });
  const focusField = (key: string) => setFilterFocused(f => ({ ...f, [key]: true }));
  const blurField  = (key: string) => setFilterFocused(f => ({ ...f, [key]: false }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setOpenFlyout(null);
      }
    };
    if (openFlyout !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFlyout]);

  const resetNRClaim = () => { setNonRemittanceRows([]); setNonRemittancePaymentMode(''); setNonRemittanceAccountNo(''); setClaimContext(null); };

  if (claimStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {claimStep === 'claimTypeEntry' && (
            <ClaimTypeEntryPage
              onBack={() => setClaimStep('list')}
              onContinue={(selectedType) => {
                setSelectedClaimTypeForFlow(selectedType);
                setClaimStep('eligible');
              }}
            />
          )}
          {claimStep === 'eligible' && (
            <EligibleDeclarationsPage
              initialClaimType={selectedClaimTypeForFlow}
              onBack={() => setClaimStep('claimTypeEntry')}
              onProceed={(rows, selectedClaimType) => {
                // Non Remittance goes to its own per-declaration docs page
                if (selectedClaimType === 'nonRemittance') {
                  setNonRemittanceRows(rows);
                  setClaimContext({
                    claimType: selectedClaimType,
                    declarationNo: rows.map((r) => r.declarationNo).join(', '),
                    depositType: 'Non Remittance Claim',
                    declarationCategory: 'Freezone Export',
                  });
                  setClaimStep('nonRemittanceDocs');
                  return;
                }

                // Use the first selected row to determine routing
                const row = rows[0];
                const cat = row.declarationCategory;

                // Determine which refund types are allowed (null = direct refund, no selection needed)
                let allowedRefundTypes: RefundType[] | null = null;

                if (selectedClaimType === 'refundDeposit' && row.depositType === 'Alternative Duty Deposit') {
                  if (cat === 'Import for Re Export') {
                    allowedRefundTypes = ['full', 'partial', 'no'];
                  } else if (cat === 'Temporary Admission') {
                    allowedRefundTypes = ['full', 'fullImport', 'partialImport', 'partial'];
                  } else if (cat === 'Transit (ROW to ROW)' || cat === 'FZ Export') {
                    allowedRefundTypes = ['full'];
                  }
                } else if (selectedClaimType === 'refundDuty' && row.depositType === 'Duty Deposit') {
                  allowedRefundTypes = ['full', 'partial'];
                }
                // All other combinations → direct refund

                setClaimContext({
                  claimType: selectedClaimType,
                  declarationNo: rows.map((r) => r.declarationNo).join(', '),
                  depositType: row.depositType,
                  declarationCategory: cat,
                  allowedRefundTypes: allowedRefundTypes ?? undefined,
                });

                if (allowedRefundTypes) {
                  setClaimStep('refundType');
                } else {
                  setClaimStep('missingDoc');
                }
              }}
            />
          )}
          {claimStep === 'refundType' && claimContext && !claimDeclViewOpen && (
            <RefundTypePage
              onBack={() => setClaimStep('eligible')}
              onContinue={(type) => {
                setClaimContext({ ...claimContext, refundType: type });
                setClaimStep('documents');
              }}
              declaration={{
                claimType: claimContext.claimType === 'refundDeposit' ? 'Refund of Deposits' : claimContext.claimType === 'refundDuty' ? 'Refund of Duty' : 'Non Remittance',
                declarationNo: claimContext.declarationNo,
                depositType: claimContext.depositType,
                declarationCategory: claimContext.declarationCategory,
              }}
              allowedTypes={claimContext.allowedRefundTypes}
              onViewDeclaration={() => setClaimDeclViewOpen(true)}
            />
          )}
          {claimStep === 'refundType' && claimContext && claimDeclViewOpen && (
            <CustomsDeclarationViewPage
              declarationNo={claimContext.declarationNo}
              onBack={() => setClaimDeclViewOpen(false)}
              onServiceCatalogue={onServiceCatalogue}
              onHome={onClose}
            />
          )}
          {claimStep === 'documents' && claimContext && (
            <DocumentUploadPage
              onBack={() => setClaimStep('refundType')}
              onContinue={() => setClaimStep('payment')}
            />
          )}
          {claimStep === 'payment' && claimContext && (
            <PaymentDetailsPage
              summary={{
                declarationNo: claimContext.declarationNo || '101-04498436-24',
                depositType: claimContext.depositType || 'Missing Document Deposit',
                depositAmount: 'Dh 1,000',
                depositMethod: 'Cash (ePayment)',
                refundType: claimContext.refundType ? REFUND_TYPE_LABEL[claimContext.refundType] : 'N/A',
                hsCount: 10,
                outboundDeclarationNo: 'E: 2080004915824',
                totalRefundAmount: 'Dh 200.0',
              }}
              onBack={() => setClaimStep('documents')}
              onContinue={() => setClaimStep('success')}
            />
          )}
          {claimStep === 'outbound' && claimContext && (
            <OutboundDeclarationPage
              onBack={() => setClaimStep('refundType')}
              onContinue={() => setClaimStep('documents')}
            />
          )}
          {claimStep === 'missingDoc' && claimContext && (
            <MissingDocDepositPage
              onBack={() => setClaimStep('eligible')}
              onContinue={() => setClaimStep('documents')}
            />
          )}
          {claimStep === 'nonRemittanceDocs' && nonRemittanceRows.length > 0 && (
            <NonRemittanceDocumentsPage
              rows={nonRemittanceRows}
              onBack={() => setClaimStep('eligible')}
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onContinue={() => setClaimStep('nonRemittanceCharges')}
            />
          )}
          {claimStep === 'nonRemittanceCharges' && (
            <NonRemittanceChargesPage
              selectedRows={nonRemittanceRows}
              onBack={() => setClaimStep('nonRemittanceDocs')}
              onContinue={(mode, acct) => { setNonRemittancePaymentMode(mode); setNonRemittanceAccountNo(acct); setClaimStep('nonRemittanceReview'); }}
            />
          )}
          {claimStep === 'nonRemittanceReview' && (
            <NonRemittanceReviewPage
              selectedRows={nonRemittanceRows}
              paymentMode={nonRemittancePaymentMode}
              accountNo={nonRemittanceAccountNo}
              onBack={() => setClaimStep('nonRemittanceCharges')}
              onSubmit={() => nonRemittancePaymentMode === 'E-Payment' ? setClaimStep('nrPaymentProcessing') : setClaimStep('nonRemittanceSuccess')}
              onSaveAndPreview={() => { setClaimViewReturnStep('nonRemittanceReview'); setClaimStep('nonRemittanceClaimView'); }}
            />
          )}
          {claimStep === 'nonRemittanceSuccess' && (
            <NonRemittanceSuccessPage
              onBack={() => { setClaimStep('list'); resetNRClaim(); }}
              onViewAck={() => setClaimStep('nonRemittanceAck')}
              onViewClaim={() => { setClaimViewReturnStep('nonRemittanceSuccess'); setClaimStep('nonRemittanceClaimView'); }}
            />
          )}
          {claimStep === 'nonRemittanceAck' && (
            <NonRemittanceAckPage
              selectedRows={nonRemittanceRows}
              onBack={() => setClaimStep('nonRemittanceSuccess')}
            />
          )}
          {claimStep === 'nonRemittanceClaimView' && (
            <NonRemittanceClaimViewPage
              selectedRows={nonRemittanceRows}
              onBack={() => setClaimStep(claimViewReturnStep)}
            />
          )}
          {claimStep === 'claimListView' && (
            <NonRemittanceClaimViewPage
              selectedRows={[]}
              onBack={() => setClaimStep('list')}
            />
          )}
          {claimStep === 'claimHistory' && (
            <ClaimsAuditHistoryPage
              onBack={() => setClaimStep('list')}
            />
          )}
          {claimStep === 'nrPaymentProcessing' && (
            <NRPaymentProcessingPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onCheckStatus={() => setClaimStep('nrPaymentSuccess')}
              onPaymentFailed={() => setClaimStep('nrPaymentRejected')}
            />
          )}
          {claimStep === 'nrPaymentSuccess' && (
            <NRPaymentSuccessPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
            />
          )}
          {claimStep === 'nrPaymentRejected' && (
            <NRPaymentRejectedPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onRetryPayment={() => setClaimStep('nrPaymentProcessing')}
            />
          )}
          {claimStep === 'success' && (
            <ClaimSubmittedSuccessPage
              onBack={() => { setClaimStep('list'); setClaimContext(null); setNonRemittanceRows([]); }}
              onCreateAnother={() => { setClaimStep('eligible'); setNonRemittanceRows([]); }}
            />
          )}
        </div>
      </div>
    );
  }

  if (ackStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          <AckSuccessPage
            mode={ackStep === 'acceptSuccess' ? 'accept' : 'decline'}
            count={ackStep === 'acceptSuccess' ? ackSelected.size : undefined}
            declarationNumbers={ackDeclarationNumbers}
            onBack={() => {
              setAckStep('list');
              setAckSelected(new Set());
              setAckDeclineRowIndex(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (cargoStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {cargoStep === 'pre' && (
            <CargoTransferPrePage
              onBack={() => setCargoStep('list')}
              onStartJourney={(values) => { setCargoPreValues(values); setCargoStep('create'); }}
              initialValues={cargoFlowMode === 'amend' ? cargoPreValues : undefined}
              mode={cargoFlowMode}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'create' && (
            <CargoTransferNewRequestPage
              onBack={() => setCargoStep(cargoFlowMode === 'amend' ? 'list' : 'pre')}
              onSave={(values) => { setCargoFormValues(values); setStepperReturnStep(0); setCargoStep('stepper'); }}
              initialCargoChannel={cargoPreValues.cargoChannel}
              initialClientRef={cargoPreValues.clientRef}
              initialCarrierReg={cargoPreValues.carrierReg}
              initialMawb={cargoFormValues.mawb}
              initialTransferorBizCode={cargoFormValues.transferorBizCode}
              initialTransferorPremCode={cargoFormValues.transferorPremCode}
              initialTransfereeBizCode={cargoFormValues.transfereeBizCode}
              initialTransfereePremCode={cargoFormValues.transfereePremCode}
              initialTransferType={cargoPreValues.transferType}
              mode={cargoFlowMode}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'document' && (
            <CargoTransferDocumentPage
              onBack={() => setCargoStep('create')}
              onProceed={() => setCargoStep('stepper')}
            />
          )}
          {cargoStep === 'stepper' && (
            <CargoTransferStepperPage
              onBack={() => setCargoStep('create')}
              onSubmit={() => { setStepperReturnStep(cargoFlowMode === 'amend' ? 4 : 3); setCargoStep('paymentReview'); }}
              onSaveExit={() => setCargoStep('list')}
              mode={cargoFlowMode}
              initialStep={stepperReturnStep}
              initTransferType={cargoPreValues.transferType}
              initTransferNumber={cargoTransferNumber}
              initCargoChannel={cargoPreValues.cargoChannel}
              initClientRef={cargoFormValues.clientRef}
              initCarrierReg={cargoFormValues.carrierReg}
              initMasterDoc={cargoFormValues.mawb}
              initTransferorBiz={cargoFormValues.transferorBizCode}
              initTransferorPrem={cargoFormValues.transferorPremCode}
              initTransfereeBiz={cargoFormValues.transfereeBizCode}
              initTransfereePrem={cargoFormValues.transfereePremCode}
            />
          )}
          {cargoStep === 'paymentReview' && (
            <CargoTransferPaymentReviewPage
              onBack={() => setCargoStep('stepper')}
              onSubmit={() => setCargoStep(cargoFlowMode === 'amend' ? 'amendSuccess' : 'success')}
              onSaveExit={() => { setStepperReturnStep(0); setCargoStep('list'); }}
              mode={cargoFlowMode}
              onViewRequest={() => setCargoStep('viewRequest')}
              transferType={cargoPreValues.transferType}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'viewRequest' && (
            <CargoTransferViewPage
              onBack={() => setCargoStep('list')}
              onSubmit={() => setCargoStep(cargoFlowMode === 'amend' ? 'amendSuccess' : 'success')}
              transferNumber={cargoTransferNumber}
              onRefresh={() => setCargoStep('viewRequest')}
            />
          )}
          {cargoStep === 'success' && (
            <CargoTransferSuccessPage mode="create" onBack={() => setCargoStep('list')} onViewDetails={() => setCargoStep('viewRequest')} />
          )}
          {cargoStep === 'amendSuccess' && (
            <CargoTransferSuccessPage mode="amend" transferType={cargoPreValues.transferType} transferNumber={cargoTransferNumber} onBack={() => setCargoStep('list')} onViewDetails={() => setCargoStep('viewRequest')} />
          )}
          {cargoStep === 'cancel' && (
            <CargoTransferCancelFlow onBack={() => setCargoStep('list')} />
          )}
          {cargoStep === 'cargoHistory' && (
            <CargoTransferHistoryPage
              onBack={() => setCargoStep('list')}
              onBackToListing={() => setCargoStep('list')}
              onSuspensionHistory={() => { setSuspensionHistoryFrom('cargoHistory'); setCargoStep('suspensionHistory'); }}
              onSuspensionResponse={() => setCargoStep('suspensionResponse')}
              onViewRequest={() => setCargoStep('viewRequest')}
              onAmend={() => {
                setCargoPreValues({ transferType: 'From CTO to CH - Same Location', cargoChannel: 'Sea', clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543' });
                setCargoFormValues({ clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543', mawb: 'AWB-987654321', transferorBizCode: 'AE-1019056', transferorPremCode: 'PRE-001', transfereeBizCode: 'AE-1019057', transfereePremCode: 'PRE-002' });
                setCargoFlowMode('amend');
                setCargoTransferNumber('601001745352');
                setStepperReturnStep(0);
                setCargoStep('create');
              }}
              onCancel={() => setCargoStep('cancel')}
            />
          )}
          {cargoStep === 'suspensionHistory' && (
            <SuspensionHistoryPage
              onBack={() => setCargoStep(suspensionHistoryFrom)}
              onBackToListing={() => setCargoStep('list')}
              onView={() => setCargoStep('suspensionHistoryView')}
            />
          )}
          {cargoStep === 'suspensionHistoryView' && (
            <SuspensionHistoryViewPage
              onBack={() => setCargoStep('suspensionHistory')}
              onBackToListing={() => setCargoStep('list')}
            />
          )}
          {cargoStep === 'suspensionResponse' && (
            <SuspensionResponsePage
              onBack={() => setCargoStep('list')}
              onBackToListing={() => setCargoStep('list')}
              onSubmit={() => setShowSuspensionSuccess(true)}
            />
          )}
          {cargoStep === 'receiptRelease' && (
            <CargoTransferReceiptReleasePage
              onBack={() => setCargoStep('list')}
            />
          )}
          {showSuspensionSuccess && (
            <SuspensionSuccessModal
              onClose={() => { setShowSuspensionSuccess(false); setCargoStep('cargoHistory'); }}
              onBackToListing={() => { setShowSuspensionSuccess(false); setCargoStep('list'); }}
            />
          )}
        </div>
      </div>
    );
  }

  if (vccStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {vccStep === 'create' && (
            <RequestVccPage
              onBack={() => setVccStep('list')}
              onSearch={() => setVccStep('searchResult')}
            />
          )}
          {vccStep === 'searchResult' && (
            <VccSearchResultPage
              onBack={() => setVccStep('create')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'amend' && (
            <VccSearchResultPage
              mode="amend"
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'retryRequest' && (
            <VccSearchResultPage
              mode="amend"
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('create')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'viewRequest' && (
            <VccViewRequestPage onBack={() => setVccStep('list')} status={selectedVccStatus} />
          )}
          {vccStep === 'paymentSuccess' && (
            <VccPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onShowPaymentFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'ePaymentPending' && (
            <VccEPaymentPendingPage
              onBackToListing={() => setVccStep('list')}
              onMakePayment={() => setVccStep('ePaymentProcessing')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'ePaymentSuccess' && (
            <VccEPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onRecheckStatus={() => setVccStep('ePaymentConfirmed')}
            />
          )}
          {vccStep === 'ePaymentProcessing' && (
            <VccEPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onRecheckStatus={() => setVccStep('ePaymentConfirmed')}
              onPaymentFailed={() => setVccStep('ePaymentFailed')}
            />
          )}
          {vccStep === 'ePaymentConfirmed' && (
            <VccEPaymentConfirmedPage
              onBackToListing={() => setVccStep('list')}
              onMakeEPayment={() => setActiveMenu('Declaration')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'ePaymentFailed' && (
            <VccEPaymentFailedPage
              onBackToListing={() => setVccStep('list')}
              onRetryPayment={() => setVccStep('ePaymentProcessing')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'updatePaymentMode' && (
            <VccUpdatePaymentModePage
              onBackToListing={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentProcessing' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'creditDebitFailed' && (
            <VccEPaymentFailedPage
              retryLabel="Retry Payment"
              onRetryPayment={() => setVccStep('retryPayment')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
              onBackToListing={() => setVccStep('list')}
            />
          )}
          {vccStep === 'retryPayment' && (
            <VccSearchResultPage
              mode="retry"
              requestNumber={vccRetryReqNo}
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'auditHistory' && (
            <VccAuditHistoryPage onBack={() => setVccStep('list')} />
          )}
          {vccStep === 'declarationView' && (
            <CustomsDeclarationViewPage
              declarationNo={vccDeclNo}
              onBack={() => setVccStep('list')}
              onServiceCatalogue={onServiceCatalogue}
              onHome={onClose}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[24px] z-[60] size-[36px] flex items-center justify-center text-white hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Breadcrumb + Journey stepper — full width, fixed */}
      <div className="flex-shrink-0">
        {/* Breadcrumb + Agent banner */}
        <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[10px] flex-wrap gap-y-[6px]">
          <div className="flex items-center gap-[6px]">
            <span
              className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif" }}
              onClick={onClose}
            >Home</span>
            <span className="text-[#dc3545] text-[15px] leading-none">/</span>
            <span className="text-[#8f94ae] text-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>Service Catalog</span>
            <span className="text-[#dc3545] text-[15px] leading-none">/</span>
            <span className="text-[#111838] text-[16px] font-medium" style={{ fontFamily: "'Dubai', sans-serif" }}>Integrated Clearance</span>
          </div>
          {/* Agent banner */}
          <div
            className="px-[16px] py-[4px] rounded-[4px] text-[16px] text-[#0e1b3d]"
            style={{ background: '#e2ebf9', fontFamily: "'Dubai', sans-serif" }}
          >
            AE-1019056 — Dubai Customs - Test LLC
          </div>
        </div>

        {/* Journey stepper bar */}
        <div className="px-4 md:px-10 pt-[20px] pb-[40px] overflow-x-auto flex justify-center">
          <div
            className="bg-white rounded-[8px] px-[20px] py-[10px] inline-flex items-center flex-shrink-0"
            style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}
          >
            {/* Import by Sea label */}
            <div className="flex items-center gap-[10px] flex-shrink-0">
              <img src={importBySeaSrc} alt="Import by Sea" className="h-[30px] w-auto flex-shrink-0" />
              <span className="text-[16px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Import by Sea
              </span>
            </div>

            {/* Red ) arc separator */}
            <div className="flex items-center flex-shrink-0 mx-[10px]">
              <svg viewBox="0 0 14 46" width="14" height="46" fill="none">
                <path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Step: Trade + */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={tradePlusSrc} alt="Trade +" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Trade +</span>
            </div>

            {/* Blue line connector */}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 130 }} />

            {/* Step: Integrated Clearance (active) */}
            <div
              className="flex items-center gap-[8px] flex-shrink-0 px-[10px] py-[5px] rounded-[22px]"
              style={{ border: '2px solid #28a745', boxShadow: '0 0 18px 0 rgba(40,167,69,0.25)', background: '#fff' }}
            >
              <div className="size-[36px] rounded-full border-2 border-[#28a745] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={integratedClearanceSrc} alt="Integrated Clearance" className="size-[20px] object-contain" />
              </div>
              <span className="text-[18px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Integrated Clearance
              </span>
            </div>

            {/* Green wave connector (wave.svg) */}
            <div className="mx-[10px] flex items-center" style={{ width: 130 }}>
              <img src={waveSrc} alt="" style={{ width: 130, height: 16 }} />
            </div>

            {/* Step: Payments */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={paymentsSrc} alt="Payments" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Payments</span>
            </div>

            {/* Blue line connector */}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 130 }} />

            {/* Step: Cargo Waves */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={cargoWavesSrc} alt="Cargo Waves" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Cargo Waves</span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-[14px] size-[28px] rounded-full border border-[#d5ddfb] flex items-center justify-center text-[#8f94ae] hover:text-[#0e1b3d] hover:border-[#0e1b3d] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>{/* end breadcrumb+stepper */}

      {/* Main layout: left panel + right scrollable content */}
      <div className="flex flex-1 px-4 md:px-10 pb-[20px] pt-[4px] gap-[12px]">

        {/* Left action panel — full height sidebar */}
        <div
          className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300 max-md:!w-16"
          style={{
            width: panelCollapsed ? 64 : 180,
            background: '#e4efff',
            border: '1px solid #a6c2e9',
          }}
        >
          {/* Collapse / expand button */}
          <button
            onClick={() => setPanelCollapsed(c => !c)}
            className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] hover:bg-[#dde2f0] transition-colors w-full flex-shrink-0"
            title={panelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <svg viewBox="0 0 20 20" className="size-[17px] transition-transform duration-300" style={{ transform: panelCollapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#0e1b3d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 15l-5-5 5-5" />
              <path d="M8 15l-5-5 5-5" />
            </svg>
          </button>
          {/* Items */}
          {([
            { src: declarationSrc,    label: 'Declaration'     as const },
            { src: cargoTransferSrc,  label: 'Cargo Transfer'  as const },
            { src: acknowledgementSrc,label: 'Acknowledgement' as const },
            { src: refundsSrc,        label: 'Refund & Claims' as const },
            { src: vccSrc,            label: 'VCC'             as const },
            { src: paymentsSrc,       label: 'E-Payment'       as const },
          ]).map((action, i) => {
            const isActive = activeMenu === action.label;
            return (
            <button
              key={action.label}
              onClick={() => setActiveMenu(action.label)}
              className="flex items-center w-full text-left transition-all hover:opacity-80"
              style={{
                gap: panelCollapsed ? 0 : 10,
                padding: panelCollapsed ? '12px 12px' : '12px 14px',
                justifyContent: panelCollapsed ? 'center' : 'flex-start',
                ...(isActive
                  ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                  : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
              }}
              title={panelCollapsed ? action.label : undefined}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-[8px]"
                style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
              >
                <img src={action.src} alt={action.label} className="size-[20px] object-contain" />
              </div>
              {!panelCollapsed && (
                <span
                  className="text-[16px] text-[#0e1b3d] leading-tight whitespace-nowrap overflow-hidden"
                  style={{ fontFamily: "'Dubai', sans-serif", fontWeight: isActive ? 700 : 400 }}
                >
                  {action.label}
                </span>
              )}
            </button>
            );
          })}
        </div>

        {/* Right scrollable content */}
        <div className="flex-1 flex flex-col min-w-0">

        {/* Controls row */}
        <div className="flex items-center justify-between mb-[12px] gap-[12px] flex-wrap">
          {/* Left: advance filters button — hidden on ePayment tab and ePayments sidebar */}
          {activeTab !== 'epay' && activeMenu !== 'E-Payment' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-[8px] h-[48px] px-[12px] sm:px-[16px] py-[12px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
                showFilters
                  ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]'
                  : 'bg-white border-[#d4dcfa] text-[#000000]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              <span className="hidden sm:inline">Advance Filters</span>
              <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Center: search bar */}
          <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[180px] max-w-[420px] relative">
            {/* Type dropdown */}
            <button
              type="button"
              onClick={() => setSearchTypeOpen(o => !o)}
              className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 hover:bg-[#f7faff] transition-colors"
            >
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                {searchType}
              </span>
              <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {searchTypeOpen && (
              <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 180, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                {(activeMenu === 'E-Payment' || activeTab === 'epay'
                  ? ['Declaration Number', 'Request Number']
                  : activeMenu === 'VCC'
                  ? ['Request Number', 'VCC Number', 'Chasis Number', 'Declaration Number']
                  : activeMenu === 'Refund & Claims'
                  ? ['Declaration Number', 'Claim Number']
                  : activeMenu === 'Cargo Transfer'
                  ? ['Cargo Transfer No.', 'Request Number', 'Client Reference Number', 'Container Number', 'MAWB/MBOL']
                  : ['Declaration', 'Request No.', 'Client Ref.', 'MAWB/MBOL']
                ).map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSearchType(opt); setSearchTypeOpen(false); setSearchValue(''); setSearchQuery(''); setEPayReqType(''); setEPayReqTypeOpen(false); }}
                    className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                    style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === searchType ? 500 : 400 }}
                  >{opt}</button>
                ))}
              </div>
            )}
            {/* Input */}
            <div className="flex items-center flex-1 px-[12px] relative">
              <input
                type="text"
                value={searchValue}
                onChange={e => { setSearchValue(e.target.value); if (searchQuery && e.target.value.trim() === '') setSearchQuery(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch(); } }}
                placeholder={
                  (searchType === 'VCC Number' || searchType === 'Chasis Number')
                    ? `Enter ${searchType.toLowerCase()} and press Enter`
                    : activeMenu === 'E-Payment' && searchType === 'Request Number'
                    ? 'Enter request number'
                    : `${searchType.toLowerCase()}`
                }
                className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              />
              {searchValue !== '' && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(''); setSearchQuery(''); }}
                  aria-label="Clear search"
                  className="flex-shrink-0 ml-[8px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] hover:text-[#0e1b3d] transition-colors"
                >
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 5l10 10M15 5l-10 10" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={submitSearch}
                disabled={searchValue.trim() === ''}
                aria-label="Search"
                className="flex-shrink-0 ml-[8px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" className="size-[22px] text-[#455174]" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>

          {/* Request Type secondary dropdown — only for standalone ePayments + Request Number */}
          {activeMenu === 'E-Payment' && searchType === 'Request Number' && (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setEPayReqTypeOpen(o => !o)}
                className="flex items-center gap-[6px] h-[48px] px-[14px] bg-white border border-[#d5ddfb] rounded-[4px] hover:bg-[#f7faff] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                <span className="text-[16px] font-medium whitespace-nowrap" style={{ color: ePayReqType ? '#1360d2' : '#697498' }}>
                  {ePayReqType || 'Request Type'}
                </span>
                <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${ePayReqTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {ePayReqTypeOpen && (
                <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {['New Declaration', 'Amendment', 'VCC Request', 'VCC Amendment', 'New Cargo Transfer', 'Amend Transfer', 'Refund Request', 'Deposit Claim', 'Ack. Fee'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setEPayReqType(ePayReqType === opt ? '' : opt); setEPayReqTypeOpen(false); }}
                      className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                      style={{ color: opt === ePayReqType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === ePayReqType ? 500 : 400 }}
                    >{opt}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status dropdown — populated from the active table */}
          <div className="relative flex-shrink-0" ref={toolbarStatusRef}>
            <button
              type="button"
              onClick={() => setToolbarStatusOpen((o) => !o)}
              className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={toolbarStatusOpen}
            >
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                {toolbarStatus ?? 'Status'}
              </span>
              <svg viewBox="0 0 24 24" className={`size-[22px] text-[#1360d2] transition-transform ${toolbarStatusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {toolbarStatusOpen && (
              <div
                className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                style={{ minWidth: 220, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                role="listbox"
              >
                <button
                  onClick={() => { setToolbarStatus(null); setToolbarStatusOpen(false); }}
                  className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                  style={{ color: toolbarStatus === null ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: toolbarStatus === null ? 500 : 400 }}
                >
                  All statuses
                </button>
                {TOOLBAR_STATUS_OPTIONS[activeMenu].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setToolbarStatus(opt); setToolbarStatusOpen(false); }}
                    className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                    style={{ color: opt === toolbarStatus ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === toolbarStatus ? 500 : 400 }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right-side group: pushes to end */}
          <div className="flex items-center gap-[12px] ml-auto flex-wrap">
            {/* Need Help */}
            <button className="flex items-center gap-[4px] h-[48px] px-[2px] flex-shrink-0">
              <span className="text-[16px] text-[#2950e5] font-medium" style={{ fontFamily: "'Dubai', sans-serif" }}>Need Help</span>
              <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
            </button>

            {/* CT Release / Receipt button — Cargo Transfer only (not on epay sub-tab) */}
            {activeMenu === 'Cargo Transfer' && activeTab !== 'epay' && (
              <button
                onClick={() => setCargoStep('receiptRelease')}
                className="h-[48px] px-[22px] rounded-[4px] text-[16px] flex-shrink-0 border border-[#1360d2] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
              >
                Cargo Release/Receipt
              </button>
            )}

            {/* Start Journey / Create New Request / Accept — hidden on ePayments views */}
            {activeMenu !== 'E-Payment' && activeTab !== 'epay' && (() => {
              const isAck = activeMenu === 'Acknowledgement';
              const ackDisabled = isAck && ackSelected.size === 0;
              return (
                <button
                  disabled={ackDisabled}
                  onClick={() => {
                    if (activeMenu === 'VCC') setVccStep('create');
                    if (activeMenu === 'Cargo Transfer') { setCargoFlowMode('create'); setCargoStep('pre'); }
                    if (activeMenu === 'Refund & Claims') setClaimStep('claimTypeEntry');
                    if (activeMenu === 'Acknowledgement' && ackSelected.size > 0) setAckAcceptOpen(true);
                  }}
                  className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-colors"
                  style={{
                    background: ackDisabled ? '#a7c3eb' : '#1360d2',
                    cursor: ackDisabled ? 'not-allowed' : 'pointer',
                    fontFamily: "'Dubai', sans-serif",
                    fontWeight: 500,
                    boxShadow: ackDisabled ? 'none' : '0px 0px 8px 0px rgba(28,72,191,0.16)',
                  }}
                >
                  {activeMenu === 'VCC' || activeMenu === 'Cargo Transfer'
                    ? 'Create New Request'
                    : activeMenu === 'Refund & Claims'
                    ? 'Raise New Claim'
                    : activeMenu === 'Acknowledgement'
                    ? 'Accept'
                    : 'Start Journey'}
                </button>
              );
            })()}
          </div>
        </div>

        {/* Advance Filters Panel */}
        {showFilters && (
          <div
            className="bg-white rounded-[8px] mb-[12px] p-[20px]"
            style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between mb-[20px]">
              <span
                className="text-[16px] font-semibold text-[#0e1b3d]"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Advance Filters
              </span>
              <button
                onClick={() => setShowFilters(false)}
                className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjk3NDk4IiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMiAybDE0IDE0TTE2IDJMMiAxNiIvPjwvc3ZnPg=="
                  alt="Close"
                  className="size-[18px]"
                />
              </button>
            </div>

            {/* Filter fields — responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
              {activeMenu === 'Acknowledgement' ? (
                <>
                  {/* Declaration Type — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackDeclType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackDeclType')}
                      onBlur={() => blurField('ackDeclType')}
                    >
                      <span style={floatLabel(isFloated('ackDeclType'))}>Declaration Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackDeclType']}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Acknowledgement Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackStatus')}
                      onBlur={() => blurField('ackStatus')}
                    >
                      <span style={floatLabel(isFloated('ackStatus'))}>Acknowledgement Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackStatus']}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *Party Type — dropdown (default: Both) */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackPartyType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackPartyType')}
                      onBlur={() => blurField('ackPartyType')}
                    >
                      <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Party Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackPartyType'] || 'Both'}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *Business Code — search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['ackBusinessCode'] ?? '57316187'}
                      onChange={e => setFilterValues(v => ({ ...v, ackBusinessCode: e.target.value }))}
                      onFocus={() => focusField('ackBusinessCode')}
                      onBlur={() => blurField('ackBusinessCode')}
                      className={`h-[56px] w-full border rounded-[4px] pl-[12px] pr-[40px] text-[16px] text-[#697498] focus:outline-none transition-colors ${filterFocused['ackBusinessCode'] ? 'border-[#1360d2] bg-white' : 'border-[#d5ddfb] bg-[#f5f6f8]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Business Code</span>
                    <svg className="absolute right-[12px] top-1/2 -translate-y-1/2" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
                  </div>

                  {/* *Date Type — dropdown (default: Clearance Date) */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackDateType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackDateType')}
                      onBlur={() => blurField('ackDateType')}
                    >
                      <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Date Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackDateType'] || 'Clearance Date'}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *From Date — calendar */}
                  <DateInput
                    label="From Date"
                    required
                    value={filterValues['ackFromDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, ackFromDate: v }))}
                  />

                  {/* *To Date — calendar */}
                  <DateInput
                    label="To Date"
                    required
                    value={filterValues['ackToDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, ackToDate: v }))}
                  />
                </>
              ) : activeMenu === 'VCC' ? (
                <>
                  {/* *Request Date From — calendar (mandatory) */}
                  <DateInput
                    label="Request Date From"
                    required
                    value={filterValues['vccDateFrom'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, vccDateFrom: v }))}
                  />

                  {/* *Request Date To — calendar (mandatory) */}
                  <DateInput
                    label="Request Date To"
                    required
                    value={filterValues['vccDateTo'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, vccDateTo: v }))}
                  />

                  {/* Status dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['vccStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('vccStatus')}
                      onBlur={() => blurField('vccStatus')}
                    >
                      <span style={floatLabel(isFloated('vccStatus'))}>Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['vccStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Customer Type dropdown — broker only */}
                  {isBroker && (
                    <div className="relative">
                      <div
                        tabIndex={0}
                        className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['vccCustomerType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                        onClick={() => focusField('vccCustomerType')}
                        onBlur={() => blurField('vccCustomerType')}
                      >
                        <span style={floatLabel(isFloated('vccCustomerType'))}>Customer Type</span>
                        <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['vccCustomerType'] || ''}</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                      </div>
                    </div>
                  )}

                  {/* Customer Code text — broker only */}
                  {isBroker && (
                    <div className="relative">
                      <input
                        type="text"
                        value={filterValues['vccCustomerCode'] || ''}
                        onChange={e => setFilterValues(v => ({ ...v, vccCustomerCode: e.target.value }))}
                        onFocus={() => focusField('vccCustomerCode')}
                        onBlur={() => blurField('vccCustomerCode')}
                        className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccCustomerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                        style={{ fontFamily: "'Dubai', sans-serif" }}
                      />
                      <span style={floatLabel(isFloated('vccCustomerCode'))}>Customer Code</span>
                    </div>
                  )}

                  {/* Vehicle Brand */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleBrand'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleBrand: e.target.value }))}
                      onFocus={() => focusField('vccVehicleBrand')}
                      onBlur={() => blurField('vccVehicleBrand')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleBrand'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleBrand'))}>Vehicle Brand</span>
                  </div>

                  {/* Vehicle Model */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleModel'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleModel: e.target.value }))}
                      onFocus={() => focusField('vccVehicleModel')}
                      onBlur={() => blurField('vccVehicleModel')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleModel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleModel'))}>Vehicle Model</span>
                  </div>

                  {/* Vehicle Type */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleType'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleType: e.target.value }))}
                      onFocus={() => focusField('vccVehicleType')}
                      onBlur={() => blurField('vccVehicleType')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleType'))}>Vehicle Type</span>
                  </div>

                  {/* Specification Standard Name */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccSpecStandard'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccSpecStandard: e.target.value }))}
                      onFocus={() => focusField('vccSpecStandard')}
                      onBlur={() => blurField('vccSpecStandard')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccSpecStandard'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccSpecStandard'))}>Specification Standard Name</span>
                  </div>

                  {/* Vehicle Year Build */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccYearBuild'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccYearBuild: e.target.value }))}
                      onFocus={() => focusField('vccYearBuild')}
                      onBlur={() => blurField('vccYearBuild')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccYearBuild'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccYearBuild'))}>Vehicle Year Build</span>
                  </div>
                </>
              ) : activeMenu === 'Refund & Claims' ? (
                <>
                  {/* Claim Type — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcClaimType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcClaimType')}
                      onBlur={() => blurField('rcClaimType')}
                    >
                      <span style={floatLabel(isFloated('rcClaimType'))}>Claim Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcClaimType'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Claim Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcClaimStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcClaimStatus')}
                      onBlur={() => blurField('rcClaimStatus')}
                    >
                      <span style={floatLabel(isFloated('rcClaimStatus'))}>Claim Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcClaimStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Declaration Number — text */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['rcDeclNumber'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, rcDeclNumber: e.target.value }))}
                      onFocus={() => focusField('rcDeclNumber')}
                      onBlur={() => blurField('rcDeclNumber')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['rcDeclNumber'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('rcDeclNumber'))}>Declaration Number</span>
                  </div>

                  {/* Time Interval — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcTimeInterval'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcTimeInterval')}
                      onBlur={() => blurField('rcTimeInterval')}
                    >
                      <span style={floatLabel(isFloated('rcTimeInterval'))}>Time Interval</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcTimeInterval'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* From Date — calendar */}
                  <DateInput
                    label="From Date"
                    value={filterValues['rcFromDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, rcFromDate: v }))}
                  />

                  {/* To Date — calendar */}
                  <DateInput
                    label="To Date"
                    value={filterValues['rcToDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, rcToDate: v }))}
                  />

                  {/* Claimant Type — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcClaimantType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcClaimantType')}
                      onBlur={() => blurField('rcClaimantType')}
                    >
                      <span style={floatLabel(isFloated('rcClaimantType'))}>Claimant Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcClaimantType'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Code — text */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['rcCode'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, rcCode: e.target.value }))}
                      onFocus={() => focusField('rcCode')}
                      onBlur={() => blurField('rcCode')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['rcCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('rcCode'))}>Code</span>
                  </div>

                  {/* Name — text */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['rcName'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, rcName: e.target.value }))}
                      onFocus={() => focusField('rcName')}
                      onBlur={() => blurField('rcName')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['rcName'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('rcName'))}>Name</span>
                  </div>

                  {/* Subclaim Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcSubclaimStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcSubclaimStatus')}
                      onBlur={() => blurField('rcSubclaimStatus')}
                    >
                      <span style={floatLabel(isFloated('rcSubclaimStatus'))}>Subclaim Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcSubclaimStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Submission Mode — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcSubmissionMode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcSubmissionMode')}
                      onBlur={() => blurField('rcSubmissionMode')}
                    >
                      <span style={floatLabel(isFloated('rcSubmissionMode'))}>Submission Mode</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcSubmissionMode'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>
                </>
              ) : activeMenu === 'Cargo Transfer' ? (
              <>

              {/* Cargo Channel (inbound) — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctCargoChannel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctCargoChannel')}
                  onBlur={() => blurField('ctCargoChannel')}
                >
                  <span style={floatLabel(isFloated('ctCargoChannel'))}>Cargo Channel (inbound)</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctCargoChannel'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Carrier Reg No.(inbound) — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctCarrierReg'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctCarrierReg: e.target.value }))}
                  onFocus={() => focusField('ctCarrierReg')}
                  onBlur={() => blurField('ctCarrierReg')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctCarrierReg'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctCarrierReg'))}>Carrier Reg No.(inbound)</span>
              </div>

              {/* Cargo Transfer Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctTransferType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctTransferType')}
                  onBlur={() => blurField('ctTransferType')}
                >
                  <span style={floatLabel(isFloated('ctTransferType'))}>Cargo Transfer Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctTransferType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Cargo Transfer Status — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctStatus')}
                  onBlur={() => blurField('ctStatus')}
                >
                  <span style={floatLabel(isFloated('ctStatus'))}>Cargo Transfer Status</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctStatus'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Transferee (Owner) — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctTransferee'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctTransferee: e.target.value }))}
                  onFocus={() => focusField('ctTransferee')}
                  onBlur={() => blurField('ctTransferee')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctTransferee'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctTransferee'))}>Transferee (Owner)</span>
              </div>

              {/* Transferor — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctTransferor'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctTransferor: e.target.value }))}
                  onFocus={() => focusField('ctTransferor')}
                  onBlur={() => blurField('ctTransferor')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctTransferor'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctTransferor'))}>Transferor</span>
              </div>

              {/* *From Date — calendar */}
              <DateInput
                label="From Date (15 days)"
                required
                value={filterValues['ctFromDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, ctFromDate: v }))}
              />

              {/* *To Date — calendar */}
              <DateInput
                label="To Date"
                required
                value={filterValues['ctToDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, ctToDate: v }))}
              />

              {/* Broker Code — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctBrokerCode'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctBrokerCode: e.target.value }))}
                  onFocus={() => focusField('ctBrokerCode')}
                  onBlur={() => blurField('ctBrokerCode')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctBrokerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctBrokerCode'))}>Broker Code</span>
              </div>

              </>
              ) : (
              <>

              {/* Cargo Channel — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['cargoChannel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('cargoChannel')}
                  onBlur={() => blurField('cargoChannel')}
                >
                  <span style={floatLabel(isFloated('cargoChannel'))}>Cargo Channel</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['cargoChannel'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Regime Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['regimeType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('regimeType')}
                  onBlur={() => blurField('regimeType')}
                >
                  <span style={floatLabel(isFloated('regimeType'))}>Regime Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['regimeType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Declaration Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['declType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('declType')}
                  onBlur={() => blurField('declType')}
                >
                  <span style={floatLabel(isFloated('declType'))}>Declaration Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['declType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Permit — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['permit'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('permit')}
                  onBlur={() => blurField('permit')}
                >
                  <span style={floatLabel(isFloated('permit'))}>Permit</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['permit'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Declaration Status — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['declStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('declStatus')}
                  onBlur={() => blurField('declStatus')}
                >
                  <span style={floatLabel(isFloated('declStatus'))}>Declaration Status</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['declStatus'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* *From Date — calendar */}
              <DateInput
                label="From Date (15 days)"
                required
                value={filterValues['fromDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, fromDate: v }))}
              />

              {/* *To Date — calendar */}
              <DateInput
                label="To Date"
                required
                value={filterValues['toDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, toDate: v }))}
              />

              {/* Carrier Registration No. — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['carrierReg'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, carrierReg: e.target.value }))}
                  onFocus={() => focusField('carrierReg')}
                  onBlur={() => blurField('carrierReg')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['carrierReg'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('carrierReg'))}>Carrier Registration No.</span>
              </div>

              {/* Customer Type — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['customerType'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, customerType: e.target.value }))}
                  onFocus={() => focusField('customerType')}
                  onBlur={() => blurField('customerType')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['customerType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('customerType'))}>Customer Type</span>
              </div>

              {/* Customer Code — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['customerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('customerCode')}
                  onBlur={() => blurField('customerCode')}
                >
                  <span style={floatLabel(isFloated('customerCode'))}>Customer Code</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['customerCode'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Importer Code / Broker Code — disabled */}
              <div className="relative">
                <div
                  className="h-[56px] border border-[#d5ddfb] rounded-[4px] flex items-center px-[12px] cursor-not-allowed"
                  style={{ background: '#e8e8e8' }}
                >
                  <span
                    style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, color: '#aaa', background: 'transparent', pointerEvents: 'none',
                      fontFamily: "'Dubai', sans-serif", whiteSpace: 'nowrap',
                    }}
                  >
                    Importer Code / Broker Code
                  </span>
                </div>
              </div>

              </>
              )}
            </div>

            {/* Footer: Reset + Apply */}
            <div className="flex justify-end gap-[12px] mt-[24px]">
              <button
                className="h-[48px] rounded-[4px] text-[16px] font-medium transition-colors hover:bg-[#f0f4ff]"
                style={{ width: 146, border: '1.5px solid #2950e5', color: '#2950e5', fontFamily: "'Dubai', sans-serif" }}
              >
                Reset
              </button>
              <button
                className="h-[48px] rounded-[4px] text-[16px] font-medium text-white transition-colors hover:opacity-90"
                style={{ width: 146, background: '#1360d2', fontFamily: "'Dubai', sans-serif" }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Tabs row + date filter + show drafts */}
        <div className="flex items-center mb-[12px] gap-[12px] flex-wrap">
          {/* Tabs — All Records | E-Payments (shown for all modules except the ePayments sidebar itself and Cargo Transfer) */}
          {activeMenu !== 'E-Payment' && activeMenu !== 'Cargo Transfer' && (
          <div className="bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] flex-shrink-0" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => { setActiveTab('all'); setEPayVccFilter(''); }}
              className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1360d2] text-white'
                  : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              All Records
            </button>
            <button
              onClick={() => { setActiveTab('epay'); setEPayVccFilter(''); }}
              className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors ${
                activeTab === 'epay'
                  ? 'bg-[#1360d2] text-white'
                  : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              E-Payment
            </button>
          </div>
          )}

          {/* Date range pill */}
          <div className="flex-1 flex justify-center">
            <div
              className="bg-white border border-[#d5ddfb] rounded-[8px] h-[49px] px-[16px] py-[8px] flex items-center gap-[12px] flex-shrink-0"
              style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}
            >
              <span className="text-[16px] text-[#4c4c4c] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Status As On 28-Dec-22 To 10-Jan-23
              </span>
              <div className="flex items-center gap-[6px]">
                <span className="text-[16px] text-[#1360d2] font-medium" style={{ fontFamily: "'Dubai', sans-serif" }}>Modify</span>
                <svg viewBox="0 0 18 18" className="size-[18px]" fill="none" stroke="#1360d2" strokeWidth="1.8">
                  <path d="M12 3l3 3-9 9H3v-3L12 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Drafts toggle — all tabs except VCC, ePayments sidebar, and epay sub-tabs */}
          {activeMenu !== 'VCC' && activeMenu !== 'E-Payment' && activeTab !== 'epay' && (
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                className={`relative w-[48px] h-[28px] rounded-full transition-colors ${showDrafts ? 'bg-[#1360d2]' : 'bg-[#e2ebf9]'}`}
              >
                <div className={`absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${showDrafts ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className="text-[16px] text-[#0e1b3d] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Drafts
              </span>
            </div>
          )}

          {/* Columns button */}
          <button
            onClick={() => setShowColModal(true)}
            className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-white border border-[#d5ddfb] text-[#1360d2] text-[16px] font-medium flex-shrink-0"
            style={{ fontFamily: "'Dubai', sans-serif", boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
              <rect x="2" y="3" width="4" height="14" rx="1" />
              <rect x="8" y="3" width="4" height="14" rx="1" />
              <rect x="14" y="3" width="4" height="14" rx="1" />
            </svg>
            Columns
          </button>
        </div>

        {/* Table swap based on active sidebar menu */}
        {activeMenu === 'E-Payment' ? (
          <EPaymentsTable
            searchDeclNo={searchType === 'Declaration Number' ? searchQuery : undefined}
            searchReqNo={searchType === 'Request Number' ? searchQuery : undefined}
            searchReqType={searchType === 'Request Number' ? ePayReqType : undefined}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
          />
        ) : activeTab === 'epay' ? (
          <EPaymentsTable filterReqNo={ePayVccFilter || undefined} module={activeMenu} showColModal={showColModal} onCloseColModal={() => setShowColModal(false)} />
        ) : activeMenu === 'VCC' ? (
          (searchType === 'VCC Number' || searchType === 'Chasis Number') && searchQuery !== '' ? (
            <VccVehicleSearchTable
              searchTerm={searchQuery}
              searchType={searchType as 'VCC Number' | 'Chasis Number'}
              onViewRequest={() => setVccStep('viewRequest')}
            />
          ) : (
            <VccTable
              onView={(status) => { setSelectedVccStatus(status || ''); setVccStep('viewRequest'); }}
              onAmend={() => setVccStep('amend')}
              onAudit={() => setVccStep('auditHistory')}
              onVccCountOpen={(row) => setVccListPopupRow(row)}
              onDeclarationOpen={(declNo) => { setVccDeclNo(declNo); setVccStep('declarationView'); }}
              externalStatus={toolbarStatus}
              onMakePayment={(reqNo) => { setActiveMenu('Declaration'); setActiveTab('epay'); setEPayVccFilter(reqNo); }}
              onChangePaymentMode={() => setVccStep('ePaymentProcessing')}
              onUpdatePaymentMode={() => setVccStep('updatePaymentMode')}
              onCheckEPaymentStatus={() => setRecheckModalOpen(true)}
              onRetry={(reqNo) => { setVccRetryReqNo(reqNo); setVccStep('retryPayment'); }}
              onMakePaymentReview={(reqNo) => { setVccRetryReqNo(reqNo); setVccStep('retryPayment'); }}
              onRecheckStatus={() => setRecheckModalOpen(true)}
              showColModal={showColModal}
              onCloseColModal={() => setShowColModal(false)}
            />
          )
        ) : activeMenu === 'Cargo Transfer' ? (
          <CargoTransferTable
            showDrafts={showDrafts}
            onViewRequest={() => setCargoStep('viewRequest')}
            onCancel={() => setCargoStep('cancel')}
            onCargoHistory={() => setCargoStep('cargoHistory')}
            onSuspensionHistory={() => { setSuspensionHistoryFrom('list'); setCargoStep('suspensionHistory'); }}
            onSuspensionResponse={() => setCargoStep('suspensionResponse')}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
            onAmend={() => {
              setCargoPreValues({ transferType: 'From CTO to CH - Same Location', cargoChannel: 'Sea', clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543' });
              setCargoFormValues({ clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543', mawb: 'AWB-987654321', transferorBizCode: 'AE-1019056', transferorPremCode: 'PRE-001', transfereeBizCode: 'AE-1019057', transfereePremCode: 'PRE-002' });
              setCargoFlowMode('amend');
              setCargoTransferNumber('601001745352');
              setStepperReturnStep(0);
              setCargoStep('create');
            }}
          />
        ) : activeMenu === 'Refund & Claims' ? (
          <ClaimsTable
            showDrafts={showDrafts}
            onView={() => setClaimStep('claimListView')}
            onHistory={() => setClaimStep('claimHistory')}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
          />
        ) : activeMenu === 'Acknowledgement' ? (
          <AcknowledgementTable
            selected={ackSelected}
            onSelectedChange={setAckSelected}
            onDecline={(rowIndex) => { setAckDeclineRowIndex(rowIndex); setAckDeclineReasonOpen(true); }}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
          />
        ) : (
          <div className="overflow-x-auto pb-[20px]">
            <table
              style={{
                minWidth: 2100,
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                fontFamily: "'Dubai', sans-serif",
              }}
              className="w-full"
            >
              {/* ── HEADER ── */}
              <thead>
                <tr>
                  {([
                    { label: 'Declaration No.',    w: 148 },
                    { label: 'Declaration Type',   w: 210 },
                    { label: 'Submitted Date',     w: 110 },
                    { label: 'Declaration owner',  w: 120 },
                    { label: 'Cargo Channel',      w: 100 },
                    { label: 'Request No.',        w: 105 },
                    { label: 'Request Type',       w: 95  },
                    { label: 'Client Ref. No.',    w: 130 },
                    { label: 'Carrier Reg No.',    w: 130 },
                    { label: 'MAWB/MBOL',          w: 105 },
                    { label: 'HAWB/HBOL',          w: 100 },
                    { label: 'DO No.',             w: 95  },
                    { label: 'Permit',             w: 72  },
                    { label: 'Broker',             w: 110 },
                    { label: 'Created by',         w: 100 },
                    { label: 'Status Date',        w: 100 },
                  ] as { label: string; w: number }[]).map((col, idx) => (
                    <th
                      key={col.label}
                      style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 8 }}
                    >
                      <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                    </th>
                  ))}
                  {/* STICKY: Declaration Status */}
                  <th style={{
                    position: 'sticky', right: 76, width: 150, minWidth: 150,
                    background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                    boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                  }}>
                    <StatusFilterHeader
                      label="Declaration Status"
                      options={Object.keys(STATUS_STYLE)}
                      value={declStatusFilter}
                      onChange={(v) => setDeclStatusFilter(v as DeclStatus | null)}
                      colorMap={DECL_STATUS_COLOR}
                    />
                  </th>
                  {/* STICKY: Actions */}
                  <th style={{
                    position: 'sticky', right: 0, width: 76, minWidth: 76,
                    background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2,
                    borderRadius: '0 8px 0 0',
                  }}>
                    <span className="text-[16px] text-[#051937]">Actions</span>
                  </th>
                </tr>
              </thead>

              {/* ── BODY ── */}
              <tbody>
                {(declStatusFilter ? DECLARATIONS.filter((d) => d.status === declStatusFilter) : DECLARATIONS).map((decl, i) => {
                  const st = STATUS_STYLE[decl.status];
                  const cell = (content: React.ReactNode, w?: number, extra?: React.CSSProperties) => (
                    <td style={{ background: '#fff', padding: '0 8px', height: 46, verticalAlign: 'middle', width: w, ...(extra || {}) }}>
                      {content}
                    </td>
                  );
                  const txt = (v: string) => (
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>
                  );
                  return (
                    <tr key={i}>
                      {/* Declaration No. */}
                      <td style={{ background: '#fff', padding: '0 8px 0 16px', height: 46, verticalAlign: 'middle', width: 148 }}>
                        <div className="flex items-center gap-[6px]">
                          <div className="flex items-center gap-[3px] flex-shrink-0">
                            {(decl.badge === 'both' || decl.badge === 'wlp') && (
                              <img src={wlpLogoSrc} alt="WLP" style={{ height: 9 }} />
                            )}
                            {(decl.badge === 'both' || decl.badge === 'aeo') && (
                              <img src={aeoLogoSrc} alt="AEO" style={{ height: 8 }} />
                            )}
                          </div>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{decl.no}</span>
                        </div>
                      </td>
                      {cell(txt(decl.type),       210)}
                      {cell(txt(decl.date),        110)}
                      {cell(txt(decl.owner),       120)}
                      {cell(txt(decl.channel),     100)}
                      {cell(txt(decl.reqNo),       105)}
                      {cell(txt(decl.reqType),     95)}
                      {cell(txt(decl.clientRef),   130)}
                      {cell(txt(decl.carrierReg),  130)}
                      {cell(txt(decl.mawb),        105)}
                      {cell(txt(decl.hawb),        100)}
                      {cell(txt(decl.doNo),        95)}
                      {/* Permit */}
                      <td style={{ background: '#fff', padding: '0 8px', height: 46, verticalAlign: 'middle', width: 72 }}>
                        {decl.permit
                          ? <span className="text-[16px] text-[#1360d2] cursor-pointer hover:underline">Yes</span>
                          : <span className="text-[16px] text-[#0e1b3d]">No</span>
                        }
                      </td>
                      {cell(txt(decl.broker),      110)}
                      {cell(txt(decl.createdBy),   100)}
                      {cell(txt(decl.statusDate),  100)}

                      {/* STICKY: Declaration Status */}
                      <td style={{
                        position: 'sticky', right: 76, background: '#fff',
                        padding: '0 8px', height: 46, verticalAlign: 'middle', width: 150,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                        zIndex: openFlyout === i ? 49 : 1,
                      }}>
                        <div className="flex items-center gap-[6px]">
                          <span
                            className="text-[16px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap"
                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                          >
                            {decl.status}
                          </span>
                          {decl.showInfo && (
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6">
                              <circle cx="10" cy="10" r="8" />
                              <path d="M10 9v5M10 7h.01" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* STICKY: Actions */}
                      <td style={{
                        position: 'sticky', right: 0, background: '#fff',
                        padding: '0 8px', height: 46, verticalAlign: 'middle', width: 76,
                        zIndex: openFlyout === i ? 50 : 1,
                      }}>
                        <div className="flex items-center gap-[6px]" ref={openFlyout === i ? flyoutRef : undefined}>
                          {/* Three dots button */}
                          <div className="relative">
                            <button
                              className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                              onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                            >
                              <svg viewBox="0 0 4 18" width="4" height="18" fill="#697498">
                                <circle cx="2" cy="2" r="2"/><circle cx="2" cy="9" r="2"/><circle cx="2" cy="16" r="2"/>
                              </svg>
                            </button>

                            {/* Flyout menu */}
                            {openFlyout === i && (
                              <div
                                className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                                style={{
                                  right: '100%',
                                  top: 0,
                                  marginRight: 6,
                                  width: 210,
                                  boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
                                  border: '1px solid #f0f0f5',
                                }}
                              >
                                {FLYOUT_ITEMS.map((item) => (
                                  <button
                                    key={item.label}
                                    className="flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left group hover:bg-[#1360d2] transition-colors"
                                    onClick={() => setOpenFlyout(null)}
                                  >
                                    <img src={item.icon} alt="" className="size-[20px] object-contain flex-shrink-0 group-hover:brightness-0 group-hover:invert" />
                                    <span
                                      className="text-[16px] text-[#111838] leading-[20px] group-hover:text-white"
                                      style={{ fontFamily: "'Dubai', sans-serif" }}
                                    >
                                      {item.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <button className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>

      {/* Acknowledgement Accept confirm */}
      <AckAcceptConfirmModal
        open={ackAcceptOpen}
        count={ackSelected.size}
        onClose={() => setAckAcceptOpen(false)}
        onConfirm={() => { setAckAcceptOpen(false); setAckStep('acceptSuccess'); }}
      />

      {/* Acknowledgement Decline reason */}
      <AckDeclineReasonModal
        open={ackDeclineReasonOpen}
        onClose={() => setAckDeclineReasonOpen(false)}
        onDecline={() => { setAckDeclineReasonOpen(false); setAckDeclineConfirmOpen(true); }}
      />

      {/* Acknowledgement Decline confirm */}
      <AckDeclineConfirmModal
        open={ackDeclineConfirmOpen}
        onClose={() => setAckDeclineConfirmOpen(false)}
        onConfirm={() => { setAckDeclineConfirmOpen(false); setAckStep('declineSuccess'); }}
      />

      <VccRecheckSuccessModal open={recheckModalOpen} onClose={() => setRecheckModalOpen(false)} />
      {vccListPopupRow && (
        <VccListPopup row={vccListPopupRow} onClose={() => setVccListPopupRow(null)} />
      )}
    </div>
  );
}
