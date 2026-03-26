import Card from './Card';

const COLUMN_NORMAL = {
  proposed: { header: '#f3f4f6', accent: '#6b7280', dot: '#d1d5db' },
  'in-progress': { header: '#eff6ff', accent: '#2563eb', dot: '#3b82f6' },
  done: { header: '#f0fdf4', accent: '#16a34a', dot: '#22c55e' },
};

const COLUMN_FUN = {
  proposed: {
    emoji: '💡', label: 'Proposed',
    bg: 'rgba(255,255,255,0.15)',
    headerBg: 'rgba(255,255,255,0.25)',
    glow: 'rgba(168,85,247,0.4)',
    countColor: '#a855f7',
  },
  'in-progress': {
    emoji: '🔥', label: 'In Progress',
    bg: 'rgba(255,255,255,0.15)',
    headerBg: 'rgba(255,255,255,0.25)',
    glow: 'rgba(251,146,60,0.4)',
    countColor: '#f97316',
  },
  done: {
    emoji: '🎉', label: 'Done',
    bg: 'rgba(255,255,255,0.15)',
    headerBg: 'rgba(255,255,255,0.25)',
    glow: 'rgba(74,222,128,0.4)',
    countColor: '#22c55e',
  },
};

const LABELS = { proposed: 'Proposed', 'in-progress': 'In Progress', done: 'Done' };

export default function Column({ status, issues, onUpdate, availableAssignees, funMode }) {
  const normal = COLUMN_NORMAL[status];
  const fun = COLUMN_FUN[status];

  if (funMode) {
    return (
      <div style={{
        flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.3)',
        boxShadow: `0 8px 40px ${fun.glow}, 0 2px 8px rgba(0,0,0,0.1)`,
        transition: 'box-shadow 0.3s ease',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '16px',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span style={{ fontSize: '24px', animation: 'wiggle 2s ease-in-out infinite' }}>{fun.emoji}</span>
          <span style={{
            fontWeight: 900, fontSize: '16px', color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontFamily: '"Nunito", sans-serif',
            letterSpacing: '-0.3px',
          }}>
            {fun.label}
          </span>
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.9)',
            color: fun.countColor,
            fontSize: '13px', fontWeight: 900,
            borderRadius: '999px', padding: '3px 12px',
            boxShadow: `0 2px 8px ${fun.glow}`,
            fontFamily: '"Nunito", sans-serif',
          }}>
            {issues.length}
          </div>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {issues.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🌵</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 800, fontFamily: '"Nunito", sans-serif', margin: 0 }}>
                Nothing here!
              </p>
            </div>
          ) : (
            issues.map((issue, i) => (
              <div key={issue.number} style={{ animation: `popIn 0.4s ${i * 0.05}s ease both` }}>
                <Card issue={issue} onUpdate={onUpdate} availableAssignees={availableAssignees} funMode={funMode} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column',
      background: '#f9fafb', borderRadius: '10px', overflow: 'hidden',
    }}>
      <div style={{
        background: normal.header, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: normal.dot, flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: '13px', color: normal.accent }}>{LABELS[status]}</span>
        <span style={{ marginLeft: 'auto', background: '#e5e7eb', color: '#6b7280', fontSize: '11px', fontWeight: 600, borderRadius: '999px', padding: '1px 8px' }}>
          {issues.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {issues.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>No issues</p>
        ) : (
          issues.map((issue) => (
            <Card key={issue.number} issue={issue} onUpdate={onUpdate} availableAssignees={availableAssignees} funMode={funMode} />
          ))
        )}
      </div>
    </div>
  );
}
