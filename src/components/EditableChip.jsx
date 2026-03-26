import { useState, useRef, useEffect } from 'react';

export default function EditableChip({ label, bg, text, options, onSelect, saving }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{
          backgroundColor: saving ? '#f3f4f6' : bg,
          color: saving ? '#9ca3af' : text,
          fontSize: '11px',
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          cursor: saving ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          border: open ? `1.5px solid ${text}` : '1.5px solid transparent',
          transition: 'all 0.1s',
        }}
      >
        {saving ? '…' : label}
      </span>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 50,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '110px',
            overflow: 'hidden',
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onSelect(opt.value);
              }}
              style={{
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: opt.value === null ? '#9ca3af' : opt.text,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              {opt.value !== null && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: opt.bg, flexShrink: 0,
                }} />
              )}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
