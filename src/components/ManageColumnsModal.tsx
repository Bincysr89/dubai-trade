import React, { useRef, useState } from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

export type ColDef = { key: string; label: string };

type Props = {
  columns: ColDef[];
  visible: string[];
  onSave: (visible: string[]) => void;
  onClose: () => void;
};

export default function ManageColumnsModal({ columns, visible, onSave, onClose }: Props) {
  const defaultOrder = columns.map((c) => c.key);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(visible));
  const [orderedKeys, setOrderedKeys] = useState<string[]>(() => {
    const vis = visible.filter((k) => columns.some((c) => c.key === k));
    const missing = defaultOrder.filter((k) => !vis.includes(k) && visible.includes(k));
    return [...vis, ...missing];
  });
  const [chooseSearch, setChooseSearch] = useState('');
  const [arrangeSearch, setArrangeSearch] = useState('');
  const dragKey = useRef<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  const toggleKey = (key: string, checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      checked ? next.add(key) : next.delete(key);
      return next;
    });
    if (checked) {
      setOrderedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    } else {
      setOrderedKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const reset = () => {
    setCheckedKeys(new Set(defaultOrder));
    setOrderedKeys(defaultOrder);
  };

  const handleSave = () => {
    onSave(orderedKeys.filter((k) => checkedKeys.has(k)));
    onClose();
  };

  const filteredChoose = columns.filter((c) =>
    c.label.toLowerCase().includes(chooseSearch.toLowerCase()),
  );

  const filteredArrange = orderedKeys
    .filter((k) => checkedKeys.has(k))
    .map((k) => columns.find((c) => c.key === k)!)
    .filter(Boolean)
    .filter((c) => c.label.toLowerCase().includes(arrangeSearch.toLowerCase()));

  const onDragStart = (key: string) => {
    dragKey.current = key;
    setDraggingKey(key);
  };

  const onDragOver = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    setDragOverKey(targetKey);
    if (!dragKey.current || dragKey.current === targetKey) return;
    setOrderedKeys((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(dragKey.current!);
      const toIdx = next.indexOf(targetKey);
      if (fromIdx === -1 || toIdx === -1) return prev;
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragKey.current!);
      return next;
    });
  };

  const onDragEnd = () => {
    dragKey.current = null;
    setDraggingKey(null);
    setDragOverKey(null);
  };

  const removeFromArrange = (key: string) => {
    toggleKey(key, false);
  };

  const SearchBox = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div
      className="flex items-center gap-[8px] px-[12px] flex-shrink-0"
      style={{ height: 48, border: '1px solid #f0f0f0', borderRadius: 4, background: '#fff' }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#696F83" strokeWidth="1.6" />
        <path d="M16.5 16.5L21 21" stroke="#696F83" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder="Search column"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none placeholder:text-[#696F83]"
        style={{ border: 'none', fontFamily: font, fontSize: 16, color: '#0E1B3D' }}
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col overflow-hidden"
        style={{
          width: 880,
          maxWidth: '96vw',
          maxHeight: '88vh',
          borderRadius: 8,
          boxShadow: '0 12px 48px rgba(0,0,0,0.20)',
          fontFamily: font,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[18px] flex-shrink-0">
          <span style={{ fontSize: 24, fontWeight: 500, color: '#051937', fontFamily: font }}>
            Manage Columns
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center hover:bg-[#f0f4ff] rounded-full transition-colors"
            style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#455174"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Two-panel body */}
        <div
          className="flex flex-1 overflow-hidden"
          style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}
        >
          {/* Left — Choose Column */}
          <div
            className="flex flex-col gap-[14px] px-[24px] py-[20px] overflow-hidden flex-1"
            style={{ borderRight: '1px solid #f0f0f0' }}
          >
            <span style={{ fontSize: 18, fontWeight: 500, color: '#051937', fontFamily: font, flexShrink: 0 }}>
              Choose Column
            </span>
            <SearchBox value={chooseSearch} onChange={setChooseSearch} />
            <div className="flex-1 overflow-y-auto flex flex-col">
              {filteredChoose.map((col) => {
                const checked = checkedKeys.has(col.key);
                return (
                  <label
                    key={col.key}
                    className="flex items-center gap-[10px] px-[4px] flex-shrink-0 rounded-[3px] cursor-pointer hover:bg-[#F8FAFD]"
                    style={{ height: 44 }}
                    onClick={() => toggleKey(col.key, !checked)}
                  >
                    <span
                      className="inline-flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: `2px solid ${checked ? '#1360d2' : '#a7abb2'}`,
                        background: checked ? '#1360d2' : '#fff',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 16 16"
                          width="11"
                          height="11"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8l3 3 7-7" />
                        </svg>
                      )}
                    </span>
                    <span style={{ fontSize: 16, color: '#0E1B3D', fontFamily: font }}>
                      {col.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Right — Arrange Column */}
          <div className="flex flex-col gap-[14px] px-[24px] py-[20px] overflow-hidden flex-1">
            <span style={{ fontSize: 18, fontWeight: 500, color: '#051937', fontFamily: font, flexShrink: 0 }}>
              Arrange Column
            </span>
            <SearchBox value={arrangeSearch} onChange={setArrangeSearch} />
            <div className="flex-1 overflow-y-auto flex flex-col gap-[6px]">
              {filteredArrange.map((col) => {
                const isDragging = draggingKey === col.key;
                const isOver = dragOverKey === col.key && draggingKey !== col.key;
                return (
                  <div
                    key={col.key}
                    draggable
                    onDragStart={() => onDragStart(col.key)}
                    onDragOver={(e) => onDragOver(e, col.key)}
                    onDragLeave={() => setDragOverKey(null)}
                    onDragEnd={onDragEnd}
                    className="flex items-center justify-between px-[12px] flex-shrink-0 rounded-[4px] select-none transition-colors"
                    style={{
                      height: 44,
                      background: isOver ? '#a7c2e8' : '#fff',
                      border: isOver ? '1.5px dashed #1360D2' : '1px solid #EAECF0',
                      cursor: 'grab',
                      opacity: isDragging ? 0.45 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isDragging) (e.currentTarget as HTMLElement).style.borderColor = '#1360D2';
                    }}
                    onMouseLeave={(e) => {
                      if (!isOver) (e.currentTarget as HTMLElement).style.borderColor = '#EAECF0';
                    }}
                  >
                    <div className="flex items-center gap-[10px]">
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="5" cy="3.5"  r="1.3" fill="#9CA3AF" />
                        <circle cx="5" cy="8"    r="1.3" fill="#9CA3AF" />
                        <circle cx="5" cy="12.5" r="1.3" fill="#9CA3AF" />
                        <circle cx="11" cy="3.5"  r="1.3" fill="#9CA3AF" />
                        <circle cx="11" cy="8"    r="1.3" fill="#9CA3AF" />
                        <circle cx="11" cy="12.5" r="1.3" fill="#9CA3AF" />
                      </svg>
                      <span style={{ fontSize: 16, color: '#111838', fontFamily: font }}>{col.label}</span>
                    </div>
                    <button
                      onClick={() => removeFromArrange(col.key)}
                      title="Remove column"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#9CA3AF', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#dc3545')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#9CA3AF')}
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              {filteredArrange.length === 0 && (
                <p style={{ fontSize: 14, color: '#697498', fontFamily: font, padding: '8px 4px' }}>
                  {checkedKeys.size === 0 ? 'Select columns from the left panel.' : 'No columns match your search.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-[20px] py-[16px] flex-shrink-0"
          style={{ boxShadow: '0 -1px 4px rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={reset}
            style={{
              fontFamily: font,
              fontSize: 16,
              fontWeight: 500,
              color: '#1360D2',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 8px',
            }}
          >
            Reset to default
          </button>
          <div className="flex items-center gap-[12px]">
            <button
              onClick={onClose}
              className="hover:bg-[#f0f4ff] transition-colors"
              style={{
                height: 44,
                padding: '0 24px',
                borderRadius: 4,
                border: '1.5px solid #1360D2',
                background: '#fff',
                color: '#1360D2',
                fontFamily: font,
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="hover:opacity-90 transition-opacity"
              style={{
                height: 44,
                padding: '0 36px',
                borderRadius: 4,
                border: 'none',
                background: '#1360D2',
                color: '#fff',
                fontFamily: font,
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
