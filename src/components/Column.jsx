import Card from './Card';

const COLUMN_NORMAL = {
  proposed: { header: '#f3f4f6', accent: '#6b7280', dot: '#d1d5db', border: '#e5e7eb' },
  'in-progress': { header: '#eff6ff', accent: '#2563eb', dot: '#3b82f6', border: '#e5e7eb' },
  done: { header: '#f0fdf4', accent: '#16a34a', dot: '#22c55e', border: '#e5e7eb' },
};

const COLUMN_FUN = {
  proposed: { emoji: '💡', accent: '#4f46e5', dot: '#818cf8', countBorder: '#c7d2fe' },
  'in-progress': { emoji: '🔥', accent: '#d97706', dot: '#fbbf24', countBorder: '#fde68a' },
  done: { emoji: '🎉', accent: '#16a34a', dot: '#4ade80', countBorder: '#bbf7d0' },
};

const LABELS = { proposed: 'Proposed', 'in-progress': 'In Progress', done: 'Done' };

export default function Column({ status, issues, onUpdate, availableAssignees, funMode }) {
  const normal = COLUMN_NORMAL[status];
  const fun = COLUMN_FUN[status];

  if (funMode) {
    return (
      <div style={{
        flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.3)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}>
          <span style={{ fontSize: '18px' }}>{fun.emoji}</span>
          <span style={{ fontWeight: 900, fontSize: '14px', color: '#1e1b4b', fontFamily: '"Nunito", sans-serif' }}>
            {LABELS[status]}
          </span>
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.6)',
            color: fun.accent,
            fontSize: '11px', fontWeight: 900,
            borderRadius: '999px', padding: '2px 10px',
            border: `1.5px solid ${fun.countBorder}`,
            fontFamily: '"Nunito", sans-serif',
          }}>
            {issues.length}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {issues.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', marginTop: '32px', fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>
              Nothing here yet!
            </p>
          ) : (
            issues.map((issue) => (
              <Card key={issue.number} issue={issue} onUpdate={onUpdate} availableAssignees={availableAssignees} funMode={funMode} />
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
        background: normal.header,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: normal.dot, flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: '13px', color: normal.accent }}>{LABELS[status]}</span>
        <span style={{
          marginLeft: 'auto', background: '#e5e7eb', color: '#6b7280',
          fontSize: '11px', fontWeight: 600, borderRadius: '999px', padding: '1px 8px',
        }}>
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
