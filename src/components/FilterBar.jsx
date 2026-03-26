const PRIORITY_OPTIONS = ['all', 'now', 'later'];
const EFFORT_OPTIONS = ['all', 'large', 'medium', 'small'];
const SORT_OPTIONS = [
  { value: 'priority', label: '🔴 Priority' },
  { value: 'effort', label: '🏋️ Effort' },
  { value: 'number-desc', label: '# Newest' },
  { value: 'number-asc', label: '# Oldest' },
];

const PRIORITY_COLORS = {
  now: { bg: '#fee2e2', text: '#b91c1c' },
  later: { bg: '#dcfce7', text: '#15803d' },
};

const EFFORT_COLORS = {
  large: { bg: '#fef3c7', text: '#92400e' },
  medium: { bg: '#e0f2fe', text: '#0369a1' },
  small: { bg: '#f0fdf4', text: '#166534' },
};

function ToggleGroup({ options, value, onChange, colorFn, funMode }) {
  return (
    <div style={{ display: 'flex', gap: funMode ? '4px' : '3px', background: funMode ? 'transparent' : '#f3f4f6', borderRadius: funMode ? '0' : '7px', padding: funMode ? '0' : '3px' }}>
      {options.map((opt) => {
        const active = value === opt;
        const colors = colorFn?.(opt);
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: funMode ? '4px 12px' : '3px 10px',
              borderRadius: funMode ? '999px' : '5px',
              border: funMode
                ? active ? `2px solid ${colors?.text || 'rgba(255,255,255,0.8)'}` : '2px solid rgba(255,255,255,0.25)'
                : 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: funMode ? 800 : 600,
              fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
              background: funMode
                ? active ? (colors?.bg || 'rgba(255,255,255,0.9)') : 'rgba(255,255,255,0.15)'
                : active ? '#fff' : 'transparent',
              color: funMode
                ? active ? (colors?.text || '#1e1b4b') : 'rgba(255,255,255,0.85)'
                : active ? (colors?.text || '#111827') : '#6b7280',
              boxShadow: !funMode && active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
              textTransform: 'capitalize',
              transform: funMode && active ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterBar({ filters, onFilterChange, sort, onSortChange, assignees, funMode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 24px',
      background: funMode ? 'rgba(255,255,255,0.1)' : '#fafafa',
      backdropFilter: funMode ? 'blur(8px)' : 'none',
      borderBottom: funMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e5e7eb',
      flexWrap: 'wrap',
    }}>
      <FilterLabel funMode={funMode}>Priority</FilterLabel>
      <ToggleGroup
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(v) => onFilterChange('priority', v)}
        colorFn={(opt) => PRIORITY_COLORS[opt]}
        funMode={funMode}
      />

      <Divider funMode={funMode} />

      <FilterLabel funMode={funMode}>Effort</FilterLabel>
      <ToggleGroup
        options={EFFORT_OPTIONS}
        value={filters.effort}
        onChange={(v) => onFilterChange('effort', v)}
        colorFn={(opt) => EFFORT_COLORS[opt]}
        funMode={funMode}
      />

      <Divider funMode={funMode} />

      <FilterLabel funMode={funMode}>Assignee</FilterLabel>
      <select
        value={filters.assignee}
        onChange={(e) => onFilterChange('assignee', e.target.value)}
        style={{
          fontSize: '11px',
          fontWeight: 800,
          fontFamily: '"Nunito", sans-serif',
          padding: '4px 10px',
          borderRadius: '999px',
          border: filters.assignee !== 'all' ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.3)',
          background: filters.assignee !== 'all' ? '#fef3c7' : 'rgba(255,255,255,0.15)',
          color: filters.assignee !== 'all' ? '#92400e' : 'rgba(255,255,255,0.85)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="all">All</option>
        {assignees.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <Divider funMode={funMode} />

      <FilterLabel funMode={funMode}>Sort</FilterLabel>
      <div style={{ display: 'flex', gap: funMode ? '4px' : '3px', background: funMode ? 'transparent' : '#f3f4f6', borderRadius: funMode ? '0' : '7px', padding: funMode ? '0' : '3px' }}>
        {SORT_OPTIONS.map(({ value, label }) => {
          const active = sort === value;
          return (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              style={{
                padding: funMode ? '4px 12px' : '3px 10px',
                borderRadius: funMode ? '999px' : '5px',
                border: funMode
                  ? active ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.25)'
                  : 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: funMode ? 800 : 600,
                fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
                background: funMode
                  ? active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)'
                  : active ? '#fff' : 'transparent',
                color: funMode
                  ? active ? '#1e1b4b' : 'rgba(255,255,255,0.85)'
                  : active ? '#111827' : '#6b7280',
                boxShadow: !funMode && active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                transform: funMode && active ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterLabel({ children, funMode }) {
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, color: funMode ? 'rgba(255,255,255,0.6)' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </span>
  );
}

function Divider({ funMode }) {
  return <div style={{ width: '1px', height: '16px', background: funMode ? 'rgba(255,255,255,0.2)' : '#e5e7eb', flexShrink: 0 }} />;
}
