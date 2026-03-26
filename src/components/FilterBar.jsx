import { dark } from '../theme';

const PRIORITY_OPTIONS = ['all', 'now', 'later'];
const EFFORT_OPTIONS = ['all', 'large', 'medium', 'small'];
const SORT_OPTIONS = [
  { value: 'priority', label: '🔴 Priority' },
  { value: 'effort', label: '🏋️ Effort' },
  { value: 'number-desc', label: '# Newest' },
  { value: 'number-asc', label: '# Oldest' },
];

const PRIORITY_CHIP = {
  now:   { light: { bg: '#fee2e2', text: '#b91c1c' }, dark: { bg: '#2d1515', text: '#fca5a5' } },
  later: { light: { bg: '#dcfce7', text: '#15803d' }, dark: { bg: '#0f2318', text: '#86efac' } },
};
const EFFORT_CHIP = {
  large:  { light: { bg: '#fef3c7', text: '#92400e' }, dark: { bg: '#231a0a', text: '#fcd34d' } },
  medium: { light: { bg: '#e0f2fe', text: '#0369a1' }, dark: { bg: '#0a1e2d', text: '#7dd3fc' } },
  small:  { light: { bg: '#f0fdf4', text: '#166534' }, dark: { bg: '#0a200f', text: '#86efac' } },
};

function ToggleGroup({ options, value, onChange, chipFn, funMode }) {
  return (
    <div style={{
      display: 'flex', gap: '3px',
      background: funMode ? 'transparent' : dark.elevated,
      borderRadius: funMode ? '0' : '7px',
      padding: funMode ? '0' : '3px',
    }}>
      {options.map((opt) => {
        const active = value === opt;
        const chip = chipFn?.(opt);
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: funMode ? '4px 12px' : '3px 10px',
              borderRadius: funMode ? '999px' : '5px',
              border: funMode
                ? active ? `2px solid ${chip?.text || 'rgba(255,255,255,0.8)'}` : '2px solid rgba(255,255,255,0.25)'
                : 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
              background: funMode
                ? active ? (chip?.bg || 'rgba(255,255,255,0.9)') : 'rgba(255,255,255,0.15)'
                : active ? (chip?.bg || dark.accentDim) : 'transparent',
              color: funMode
                ? active ? (chip?.text || '#1e1b4b') : 'rgba(255,255,255,0.85)'
                : active ? (chip?.text || dark.accentBright) : dark.textSecondary,
              transition: 'all 0.15s',
              textTransform: 'capitalize',
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
      background: funMode ? 'rgba(255,255,255,0.1)' : dark.surface,
      backdropFilter: funMode ? 'blur(8px)' : 'none',
      borderBottom: `1px solid ${funMode ? 'rgba(255,255,255,0.15)' : dark.border}`,
      flexWrap: 'wrap',
    }}>
      <Label funMode={funMode}>Priority</Label>
      <ToggleGroup
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(v) => onFilterChange('priority', v)}
        chipFn={(opt) => opt === 'all' ? null : (funMode ? PRIORITY_CHIP[opt]?.light : PRIORITY_CHIP[opt]?.dark)}
        funMode={funMode}
      />

      <Divider funMode={funMode} />

      <Label funMode={funMode}>Effort</Label>
      <ToggleGroup
        options={EFFORT_OPTIONS}
        value={filters.effort}
        onChange={(v) => onFilterChange('effort', v)}
        chipFn={(opt) => opt === 'all' ? null : (funMode ? EFFORT_CHIP[opt]?.light : EFFORT_CHIP[opt]?.dark)}
        funMode={funMode}
      />

      <Divider funMode={funMode} />

      <Label funMode={funMode}>Assignee</Label>
      <select
        value={filters.assignee}
        onChange={(e) => onFilterChange('assignee', e.target.value)}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
          padding: '4px 10px',
          borderRadius: funMode ? '999px' : '6px',
          border: funMode
            ? filters.assignee !== 'all' ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.3)'
            : `1px solid ${filters.assignee !== 'all' ? dark.accent : dark.border}`,
          background: funMode
            ? filters.assignee !== 'all' ? '#fef3c7' : 'rgba(255,255,255,0.15)'
            : filters.assignee !== 'all' ? dark.accentDim : dark.elevated,
          color: funMode
            ? filters.assignee !== 'all' ? '#92400e' : 'rgba(255,255,255,0.85)'
            : filters.assignee !== 'all' ? dark.accentBright : dark.textSecondary,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="all" style={{ background: dark.elevated, color: dark.textPrimary }}>All</option>
        {assignees.map((a) => (
          <option key={a} value={a} style={{ background: dark.elevated, color: dark.textPrimary }}>{a}</option>
        ))}
      </select>

      <Divider funMode={funMode} />

      <Label funMode={funMode}>Sort</Label>
      <div style={{
        display: 'flex', gap: '3px',
        background: funMode ? 'transparent' : dark.elevated,
        borderRadius: funMode ? '0' : '7px',
        padding: funMode ? '0' : '3px',
      }}>
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
                fontWeight: 600,
                fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
                background: funMode
                  ? active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)'
                  : active ? dark.accentDim : 'transparent',
                color: funMode
                  ? active ? '#1e1b4b' : 'rgba(255,255,255,0.85)'
                  : active ? dark.accentBright : dark.textSecondary,
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

function Label({ children, funMode }) {
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700,
      color: funMode ? 'rgba(255,255,255,0.5)' : dark.textMuted,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      {children}
    </span>
  );
}

function Divider({ funMode }) {
  return <div style={{ width: '1px', height: '16px', background: funMode ? 'rgba(255,255,255,0.2)' : dark.border, flexShrink: 0 }} />;
}
