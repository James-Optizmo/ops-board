import Card from './Card';

const COLUMN_STYLES = {
  proposed: { header: '#f3f4f6', accent: '#6b7280', dot: '#d1d5db' },
  'in-progress': { header: '#eff6ff', accent: '#2563eb', dot: '#3b82f6' },
  done: { header: '#f0fdf4', accent: '#16a34a', dot: '#22c55e' },
};

const LABELS = {
  proposed: 'Proposed',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function Column({ status, issues, onUpdate, availableAssignees }) {
  const style = COLUMN_STYLES[status];

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#f9fafb',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: style.header,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: '13px', color: style.accent }}>
          {LABELS[status]}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            background: '#e5e7eb',
            color: '#6b7280',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '999px',
            padding: '1px 8px',
          }}
        >
          {issues.length}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {issues.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
            No issues
          </p>
        ) : (
          issues.map((issue) => (
            <Card
              key={issue.number}
              issue={issue}
              onUpdate={onUpdate}
              availableAssignees={availableAssignees}
            />
          ))
        )}
      </div>
    </div>
  );
}
