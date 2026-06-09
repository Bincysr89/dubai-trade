import React, { useState } from 'react';
import { ColumnFilter } from './ColumnFilter';

const font = "'Dubai', sans-serif";

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#6d707e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20v-8M12 16l4-4 4 4" />
      <path d="M8 24a6 6 0 0 1-2-11.6A8 8 0 0 1 22 8a6 6 0 0 1 2 11.6" />
    </svg>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[12px] py-[12px] px-[12px]" style={{ width: 307, minWidth: 200 }}>
      <span className="text-[14px]" style={{ color: '#696f83', fontFamily: font }}>{label}</span>
      <span className="text-[16px] font-semibold" style={{ color: '#051937', fontFamily: font }}>{value}</span>
    </div>
  );
}

const DOC_ROWS = [
  { name: 'Invoice 12124.PDF',   type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024', canDelete: true },
  { name: 'Invoice 898486.xls',  type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024', canDelete: true },
  { name: 'Invoice 189777.xls',  type: 'Invoice',               size: '50 MB', date: '08-12-2024', canDelete: false },
  { name: 'Invoice.xls',         type: 'Invoice',               size: '50 MB', date: '08-12-2024', canDelete: false },
];

const DOC_TYPES = ['*Doc 1', 'Doc 2', 'Doc 3', 'Doc 4'];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
  onSubmit: () => void;
};

export default function SuspensionResponsePage({ onBack, onBackToListing, onSubmit }: Props) {
  const [response, setResponse] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb + Title — sticky */}
      <div className="flex-shrink-0 bg-[#f8fafd]">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button
              onClick={onBackToListing ?? onBack}
              className="text-[16px] text-[#8f94ae] hover:underline"
              style={{ fontFamily: font }}
            >
              Home
            </button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Cargo Transfer</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Suspension Response</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>

        {/* Page title */}
        <div className="px-4 sm:px-10 pt-[8px] pb-[20px] flex items-center gap-[16px]">
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font }}>
            Suspension Response - CT - 601232423898
          </h1>
          <span className="text-[14px] font-medium px-[12px] py-[4px] rounded-[4px]" style={{ background: 'rgba(220,53,69,0.10)', color: '#dc3545', fontFamily: font }}>
            Suspended
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="flex flex-col gap-[24px]">

          {/* Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[18px] font-semibold text-[#051937]" style={{ fontFamily: font }}>Request Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="To" value="AE123 Companies" />
                <InfoCard label="Comments" value="Please upload Documents" />
                <div className="flex flex-col gap-[12px] py-[12px] px-[12px]" style={{ width: 600, minWidth: 200, flex: 1 }}>
                  <span className="text-[14px]" style={{ color: '#696f83', fontFamily: font }}>Response</span>
                  <input
                    type="text"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter Text"
                    className="h-[56px] w-full border rounded-[4px] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors"
                    style={{ borderColor: '#d5ddfb', fontFamily: font }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1360d2'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d5ddfb'; }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Documents */}
          <div className="bg-white rounded-[8px] px-[14px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex gap-[40px]">
              {/* Left: doc type selector */}
              <div className="flex flex-col gap-[16px]" style={{ flex: 1, minWidth: 0 }}>
                <div>
                  <h3 className="text-[24px] font-medium text-[#060c28]" style={{ fontFamily: font }}>Upload Documents</h3>
                  <p className="text-[18px] text-[#323c64] mt-[8px]" style={{ fontFamily: font }}>Select the document type and upload the file</p>
                </div>
                <div className="flex flex-wrap gap-[30px] mt-[16px]">
                  {DOC_TYPES.map((doc, i) => (
                    <label key={i} className="flex items-center gap-[8px] cursor-pointer">
                      <div
                        className="size-[16px] rounded-full border-2 flex items-center justify-center transition-colors"
                        style={{ borderColor: selectedDoc === i ? '#1360d2' : '#aaa', background: selectedDoc === i ? '#1360d2' : 'transparent' }}
                        onClick={() => setSelectedDoc(i)}
                      >
                        {selectedDoc === i && <div className="size-[6px] rounded-full bg-white" />}
                      </div>
                      <span className="text-[18px] text-[#060c28]" style={{ fontFamily: font }}>
                        {i === 0 && <span className="text-[#ea2428]">*</span>}{doc.replace('*', '')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right: upload area */}
              <div className="bg-white rounded-[8px] flex flex-col" style={{ width: 516, flexShrink: 0 }}>
                <h4 className="text-[20px] font-medium text-[#060c28] mb-[4px]" style={{ fontFamily: font }}>Upload File</h4>
                <p className="text-[16px] text-[#323c64] mb-[12px]" style={{ fontFamily: font }}>
                  *Supported file type of .pdf, .jpg etc, max file size up to 50MB
                </p>
                <div
                  className="flex flex-col items-center justify-center gap-[12px] rounded-[4px]"
                  style={{ border: '1px dashed #8f94ae', background: '#f8fafd', height: 200, padding: '20px' }}
                >
                  <div className="size-[60px] rounded-full flex items-center justify-center" style={{ background: '#dfe5e9' }}>
                    <CloudUploadIcon />
                  </div>
                  <p className="text-[16px] text-[#6d707e] font-medium" style={{ fontFamily: font }}>Drag and drop or</p>
                  <button
                    className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font }}
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="bg-white rounded-[8px] px-[14px] pt-[24px] pb-[20px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="text-[24px] font-medium text-[#051937] mb-[20px]" style={{ fontFamily: font }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ width: 60, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '8px 0 0 0', paddingLeft: 16 }} />
                    {[
                      { label: 'Document Name',  w: 255 },
                      { label: 'Document Type',  w: 296 },
                      { label: 'Uploaded size',  w: 240 },
                      { label: 'Uploaded on',    w: 312 },
                    ].map((col) => (
                      <th key={col.label} style={{ width: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left' }}>
                        <ColumnFilter label={col.label} />
                      </th>
                    ))}
                    <th style={{ width: 169, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>
                      <span className="text-[14px] text-[#051937] font-medium">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOC_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '16px 8px 16px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#051937]">{i + 1}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.name}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.type}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.size}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.date}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-[16px]">
                          {row.canDelete && (
                            <button className="hover:opacity-70 transition-opacity"><DeleteIcon /></button>
                          )}
                          <button className="hover:opacity-70 transition-opacity"><DownloadIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CDM Contact Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[18px] font-semibold text-[#051937]" style={{ fontFamily: font }}>CDM Contact Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="Contact Section Name" value="Customs Declaration Management" />
                <InfoCard label="Phone Number" value="04-34567890" />
                <InfoCard label="Fax Number" value="04-5876888" />
                <InfoCard label="Contact Time" value="08:00 - 14:00" />
                <InfoCard label="Contact Location" value="Dubai Customs HQ, Port Rashid, Dubai" />
                <InfoCard label="Contact Department" value="Customs Declaration Management" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom navigation — sticky */}
      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center justify-between px-[40px]">
          <button
            onClick={onBack}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
