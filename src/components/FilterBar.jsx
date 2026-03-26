const PRIORITY_OPTIONS = ['all', 'now', 'later'];
const EFFORT_OPTIONS = ['all', 'large', 'medium', 'small'];
const SORT_OPTIONS = [
  { value: 'priority', label: 'Priority' },
  { value: 'effort', label: 'Effort' },
  { value: 'number-desc', label: '# Newest' },
  { value: 'number-asc', label: '# Oldest' },
];

function ToggleGroup({ options, value, onChange, colorFn }) {
  return (
    <div style={{ display: 'flex', gap: '3px', background: '#f3f4f6', borderRadius: '7px', padding: '3px' }}>
      {options.map((opt) => {
        const active = value === opt;
        const colors = colorFn?.(opt);
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '3px 10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              background: active ? (colors?.bg || '#fff') : 'transparent',
              color: active ? (colors?.text || '#111827') : '#6b7280',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

const PRIORITY_COLORS = {
  now: { bg: '#fee2e2', text: '#b91c1c' },
  later: { bg: '#dcfce7', text: '#15803d' },
};

const EFFORT_COLORS = {
  large: { bg: '#fef3c7', text: '#92400e' },
  medium: { bg: '#e0f2fe', text: '#0369a1' },
  small: { bg: '#f0fdf4', text: '#166534' },
};

export default function FilterBar({ filters, onFilterChange, sort, onSortChange, assignees }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 24px',
        background: '#fafafa',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
      }}
    >
      <FilterLabel>Priority</FilterLabel>
      <ToggleGroup
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(v) => onFilterChange('priority', v)}
        colorFn={(opt) => PRIORITY_COLORS[opt]}
      />

      <Divider />

      <FilterLabel>Effort</FilterLabel>
      <ToggleGroup
        options={EFFORT_OPTIONS}
        value={filters.effort}
        onChange={(v) => onFilterChange('effort', v)}
        colorFn={(opt) => EFFORT_COLORS[opt]}
      />

      <Divider />

      <FilterLabel>Assignee</FilterLabel>
      <select
        value={filters.assignee}
        onChange={(e) => onFilterChange('assignee', e.target.value)}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          background: filters.assignee !== 'all' ? '#fff7ed' : '#fff',
          color: filters.assignee !== 'all' ? '#c2410c' : '#374151',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="all">All</option>
        {assignees.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <Divider />

      <FilterLabel>Sort</FilterLabel>
      <div style={{ display: 'flex', gap: '3px', background: '#f3f4f6', borderRadius: '7px', padding: '3px' }}>
        {SORT_OPTIONS.map(({ value, label }) => {
          const active = sort === value;
          return (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              style={{
                padding: '3px 10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                background: active ? '#fff' : 'transparent',
                color: active ? '#111827' : '#6b7280',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
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

function FilterLabel({ children }) {
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ width: '1px', height: '16px', background: '#e5e7eb', flexShrink: 0 }} />;
}
