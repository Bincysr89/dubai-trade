import React, { useEffect, useRef, useState } from 'react';

type Props = {
  page: number;                       // 1-based current page
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalItems?: number;                // optional, for the "1 - N" label
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
};

/**
 * Pagination component — reference: Figma node 159:40898.
 * Right-aligned. Left pill = "Result" range + page-size selector.
 * Right pill = chevron + numbered pages (active = filled blue circle) + chevron.
 */
export default function Pagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [8, 16, 24, 50],
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const start = (page - 1) * pageSize + 1;
  const end = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;

  // Build the visible page-number list. Up to 7 buttons with current page near center when possible.
  const pages = (() => {
    const max = 7;
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let from = Math.max(1, page - half);
    let to = from + max - 1;
    if (to > totalPages) { to = totalPages; from = to - max + 1; }
    return Array.from({ length: max }, (_, i) => from + i);
  })();

  return (
    <div className="flex items-center justify-end gap-[20px] flex-wrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
      {/* Result + page-size pill */}
      <div className="inline-flex items-center gap-[16px]">
        <span className="text-[14px] text-[#111838]" style={{ fontWeight: 500 }}>Result</span>
        <div ref={wrapRef} className="relative">
          <div className="flex items-stretch h-[48px] bg-white border border-[#d5ddfb] rounded-[10px] overflow-hidden">
            <span className="flex items-center px-[14px] text-[14px] text-[#8f94ae]" style={{ fontWeight: 500 }}>
              {start} <span className="mx-[4px]">-</span> {end}
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-[6px] border-l border-[#d5ddfb] px-[14px] hover:bg-[#f7faff] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="text-[16px] text-[#111838]">{pageSize}</span>
              <svg viewBox="0 0 20 20" width="18" height="18" className={`text-[#697498] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 7.5l5 5 5-5" />
              </svg>
            </button>
          </div>
          {open && (
            <ul
              role="listbox"
              className="absolute right-0 top-[52px] z-[80] bg-white rounded-[8px] py-[4px] overflow-hidden min-w-[80px]"
              style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
            >
              {pageSizeOptions.map((n) => {
                const active = n === pageSize;
                return (
                  <li
                    key={n}
                    role="option"
                    aria-selected={active}
                    onClick={() => { onPageSizeChange(n); setOpen(false); }}
                    className="px-[14px] py-[8px] text-[14px] cursor-pointer hover:bg-[#e2ebf9] hover:text-[#1360d2] transition-colors"
                    style={{
                      color: active ? '#1360d2' : '#111838',
                      background: active ? '#e2ebf9' : 'transparent',
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {n}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Page-number pill */}
      <div
        className="inline-flex items-center gap-[8px] bg-white rounded-[10px] px-[16px] py-[8px]"
        style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}
      >
        <ChevronBtn
          direction="left"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        />
        {pages.map((n) => {
          const active = n === page;
          return (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className="size-[32px] rounded-full flex items-center justify-center transition-colors"
              style={{
                background: active ? '#1360d2' : 'transparent',
                color: active ? '#f8fafd' : '#7681ab',
                fontWeight: 500,
                fontSize: 16,
                opacity: active ? 1 : 0.7,
              }}
              aria-current={active ? 'page' : undefined}
            >
              {n}
            </button>
          );
        })}
        <ChevronBtn
          direction="right"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        />
      </div>
    </div>
  );
}

function ChevronBtn({ direction, disabled, onClick }: { direction: 'left' | 'right'; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="size-[32px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f7faff] rounded-full transition-colors"
      aria-label={direction === 'left' ? 'Previous page' : 'Next page'}
    >
      <svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        className={direction === 'right' ? 'rotate-180' : ''}
        fill="none"
        stroke="#7681ab"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.5 5l-5 5 5 5" />
      </svg>
    </button>
  );
}
