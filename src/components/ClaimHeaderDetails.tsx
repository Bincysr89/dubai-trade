import React from 'react';

const font = "'Dubai', sans-serif";

/** How the deposit being claimed was originally lodged. */
export type DepositMethod = 'Standing Guarantee' | 'Debit Account' | 'Cash' | string;
/** How the refund is paid back out. */
export type RefundMode = 'Bank Transfer' | 'Credit Account' | 'Debit Account' | 'Card' | string;

export type ClaimHeaderProps = {
  requestNo?: string;
  requestDate?: string;
  requestStatus?: string;
  claimType?: string;
  submissionDate?: string;
  registrationDate?: string;
  claimNo?: string;
  claimVersion?: string;
  claimant?: string;
  beneficiary?: string;
  claimStatus?: string;
  customsBroker?: string;

  depositMethod?: DepositMethod;
  /** The guarantee or debit account the deposit sits against. */
  depositAccountNo?: string;
  depositAccountName?: string;

  /** Hidden where the refund mode belongs to each declaration rather than the claim. */
  showRefundMode?: boolean;
  refundMode?: RefundMode;
  /** Bank Transfer */
  bankAccountNo?: string;
  bankAccountName?: string;
  bankName?: string;
  iban?: string;
  /** Credit Account / Debit Account */
  refundAccountNo?: string;
  refundAccountName?: string;
  /** Card */
  maskedCardNo?: string;
  cardHolderName?: string;
  cardType?: string;
};

/** Four columns on a wide card, two on a narrow one — the same grid for every row,
    so the second field of one row sits under the second field of the row above. */
const ROW = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

function FieldItem({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px] min-w-0">
      <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

/**
 * The Claim Header Details card body, shared by the View Claim pages so the same
 * twelve header fields — plus the deposit and refund blocks — read identically
 * whichever claim type opened the page.
 */
export default function ClaimHeaderDetails({
  requestNo = '232803',
  requestDate = '29/06/2026',
  requestStatus = 'Under Processing',
  claimType = 'Non Remittance Claim',
  submissionDate = '29/06/2026',
  registrationDate = '29/06/2026',
  claimNo = '2420390',
  claimVersion = '1',
  claimant = 'SW Logistics LLC (Business - AE-9106286)',
  beneficiary = 'SW Logistics LLC (Business - AE-9106286)',
  claimStatus = 'Under Processing',
  customsBroker = "M&M's special holding private company associated with 1900 Waverly Co United arab emirates L.L.C (AE-8122451)",

  depositMethod = 'Standing Guarantee',
  depositAccountNo = 'SG-100004120',
  depositAccountName = 'SW Logistics LLC',

  showRefundMode = true,
  refundMode = 'Bank Transfer',
  bankAccountNo = '019100458921',
  bankAccountName = 'SW Logistics LLC',
  bankName = 'Emirates NBD',
  iban = 'AE070331234567890123456',
  refundAccountNo = 'A-100004120',
  refundAccountName = 'SW Logistics LLC',
  maskedCardNo = '**** **** **** 4821',
  cardHolderName = 'SW Logistics LLC',
  cardType = 'Visa Credit',
}: ClaimHeaderProps) {
  /* The deposit's account details only apply to some methods — a cash deposit has none. */
  const depositFields: [string, string | undefined][] =
    depositMethod === 'Standing Guarantee'
      ? [['Standing Guarantee No.', depositAccountNo], ['Standing Guarantee Name', depositAccountName]]
      : depositMethod === 'Debit Account'
      ? [['Debit Account No.', depositAccountNo], ['Debit Account Name', depositAccountName]]
      : [];

  /* What is shown alongside the refund mode depends on where the money goes. */
  const refundFields: [string, string | undefined][] =
    refundMode === 'Bank Transfer'
      ? [
          ['Consignee Bank Account Number', bankAccountNo],
          ['Account Name', bankAccountName],
          ['Bank Name', bankName],
          ['IBAN Account No.', iban],
        ]
      : refundMode === 'Credit Account'
      ? [['Credit Account No.', refundAccountNo], ['Account Name', refundAccountName]]
      : refundMode === 'Debit Account'
      ? [['Debit Account No.', refundAccountNo], ['Account Name', refundAccountName]]
      : refundMode === 'Card'
      ? [['Masked Card Number', maskedCardNo], ['Card Type', cardType], ['Card Holder Name', cardHolderName]]
      : [];

  return (
    <>
      <div className={ROW}>
        <FieldItem label="Request No." value={requestNo} />
        <FieldItem label="Request Date" value={requestDate} />
        <FieldItem label="Request Status" value={requestStatus} />
        <FieldItem label="Claim Type" value={claimType} />
      </div>
      <Divider />
      <div className={ROW}>
        <FieldItem label="Submission Date" value={submissionDate} />
        <FieldItem label="Registration Date" value={registrationDate} />
        <FieldItem label="Claim No." value={claimNo} />
        <FieldItem label="Claim Version" value={claimVersion} />
      </div>
      <Divider />
      <div className={ROW}>
        <FieldItem label="Claimant" value={claimant} />
        <FieldItem label="Beneficiary" value={beneficiary} />
        <FieldItem label="Claim Status" value={claimStatus} />
        <FieldItem label="Customs Broker" value={customsBroker} />
      </div>
      <Divider />
      <div className={ROW}>
        <FieldItem label="Deposit Method" value={depositMethod} />
        {depositFields.map(([l, v]) => <FieldItem key={l} label={l} value={v} />)}
      </div>
      {/* The refund mode and whatever it needs alongside it get a row of their own */}
      {showRefundMode && (
        <>
          <Divider />
          <div className={ROW}>
            <FieldItem label="Refund Mode" value={refundMode} />
            {refundFields.map(([l, v]) => <FieldItem key={l} label={l} value={v} />)}
          </div>
        </>
      )}
    </>
  );
}
