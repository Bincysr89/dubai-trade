import React, { useState } from 'react';
import { JourneyStepper, SectionCard, font } from './DeclarationUI';

const filterSrc = new URL('../../assets/declaration/filter-list.svg', import.meta.url).href;

const AVAILABILITY = [
  { label: 'Invoice', required: true, value: 'Select' },
  { label: 'Packaging List', required: true, value: 'Select' },
  { label: 'AWB/BOL', required: true, value: 'Select' },
  { label: 'Certificate of Origin', required: true, value: 'Not Required' },
];

type DocOption = { label: string; required?: boolean; badge?: { text: string; tone: 'count' | 'new' } };
const DOC_OPTIONS: DocOption[] = [
  { label: 'Passport Copy', required: true, badge: { text: '2/5', tone: 'count' } },
  { label: 'Trade License copy' },
  { label: 'Certificate Of Origin issued by the Ministry' },
  { label: 'Organizational Structure/Profile Copy', badge: { text: 'New', tone: 'new' } },
  { label: 'Invoice Consumption Request Letter' },
  { label: 'Letter of Undertaking for Shipping Agent', badge: { text: 'New', tone: 'new' } },
];

const UPLOADED = [
  ['Passport Copy', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Trade License copy', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Certificate Of Origin issued by the Ministry', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Organizational Structure/Profile Copy', 'Dubai Customs', 'AWB/BOL', '50 MB', '08-12-2024'],
  ['Invoice Consumption Request Letter', 'Dubai Customs', 'Cert. of Origin', '50 MB', '08-12-2024'],
  ['Laboratory 123234.pdf', 'Dubai Customs', 'Laboratory Results', '50 MB', '08-12-2024'],
];

const UPLOADED_COLUMNS = ['Document Name', 'Authority Name', 'Document Type', 'Uploaded size', 'Uploaded on'];

function Dropdown({ label, required, value }: { label: string; required?: boolean; value: string }) {
  return (
    <div className="relative" style={{ fontFamily: font }}>
      <div className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]">
        <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#697498" strokeWidth="2" className="flex-shrink-0"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px' }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

/** Document Upload step — Figma 2650:50767. */
export default function DeclarationDocumentUploadPage() {
  const [picked, setPicked] = useState(DOC_OPTIONS[0].label);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={3} />

      {/* ── Availability of Documents ── */}
      <SectionCard>
        <p className="text-[20px] text-[#0e1b3d] mb-[24px]" style={{ fontWeight: 600 }}>Availability of Documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-x-[20px] gap-y-[32px]">
          {AVAILABILITY.map((a) => <Dropdown key={a.label} label={a.label} required={a.required} value={a.value} />)}
          <div className="relative">
            <div className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]">
              <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">Reason for not required</span>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#697498" strokeWidth="2" className="flex-shrink-0"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Upload Documents ── */}
      <SectionCard>
        <div className="flex flex-col lg:flex-row gap-[40px]">
          <div className="flex-1 min-w-0">
            <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Upload Documents</p>
            <p className="text-[15px] text-[#455174] mt-[10px]">
              Select the document type and upload the file, we will share the documents with authorities.
            </p>
            <p className="text-[16px] text-[#0e1b3d] mt-[24px] mb-[16px]" style={{ fontWeight: 600 }}>Dubai Customs</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[20px] pr-[12px]"
              style={{ maxHeight: 200, overflowY: 'auto' }}>
              {DOC_OPTIONS.map((o) => (
                <label key={o.label} className="flex items-start gap-[10px] cursor-pointer select-none">
                  <input
                    type="radio"
                    name="docType"
                    checked={picked === o.label}
                    onChange={() => setPicked(o.label)}
                    className="mt-[3px] size-[16px] flex-shrink-0"
                    style={{ accentColor: '#1360d2' }}
                  />
                  <span className="text-[15px] text-[#0e1b3d] leading-[1.35]">
                    {o.required && <span style={{ color: '#dc3545' }}>*</span>}
                    {o.label}
                    {o.badge && (
                      <span
                        className="ml-[8px] inline-flex items-center px-[8px] py-[1px] rounded-[10px] text-[12px] align-middle"
                        style={o.badge.tone === 'count'
                          ? { background: '#e4f6e9', color: '#219653', fontWeight: 600 }
                          : { background: '#1360d2', color: '#fff', fontWeight: 600 }}
                      >{o.badge.text}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:w-[420px] flex-shrink-0">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Upload File</p>
            <p className="text-[14px] text-[#455174] mt-[12px] mb-[16px]">
              <span style={{ color: '#dc3545' }}>*</span>Supported file type of .pdf, .jpg etc , max file size up to 50MB
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); }}
              className="flex flex-col items-center justify-center gap-[14px] rounded-[6px] py-[40px] transition-colors"
              style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#fbfcfe' }}
            >
              <div className="size-[54px] rounded-full inline-flex items-center justify-center" style={{ background: '#eef1f6' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-[15px] text-[#6d707e]">Drag and drop or</p>
              <button data-secondary-btn type="button"
                className="h-[42px] px-[22px] rounded-[4px] border text-[15px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
              >Choose File</button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Documents Uploaded ── */}
      <SectionCard className="!px-0 !py-0 overflow-hidden">
        <p className="text-[20px] text-[#0e1b3d] px-[20px] pt-[24px] pb-[16px]" style={{ fontWeight: 600 }}>Documents Uploaded</p>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                {UPLOADED_COLUMNS.map((c) => (
                  <th key={c} style={{ background: '#e2ebf9', padding: 12, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    <span className="inline-flex items-center gap-[4px]">
                      <span className="text-[14px]" style={{ color: '#455174', fontWeight: 500, letterSpacing: '0.07px' }}>{c}</span>
                      <img src={filterSrc} alt="" width={16} height={16} />
                    </span>
                  </th>
                ))}
                <th style={{ background: '#e2ebf9', padding: 12, textAlign: 'left', width: 110 }}>
                  <span className="text-[14px]" style={{ color: '#455174', fontWeight: 500 }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {UPLOADED.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eef1f6' }}>
                  {r.map((cell, j) => (
                    <td key={j} className="text-[14px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap' }}>{cell}</td>
                  ))}
                  <td style={{ padding: 12 }}>
                    <span className="flex items-center gap-[16px]">
                      <button type="button" aria-label={`Delete ${r[0]}`} className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#dc3545' }}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12M9 8v6M11 8v6" />
                        </svg>
                      </button>
                      <button type="button" aria-label={`Download ${r[0]}`} className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#1360d2' }}>
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
