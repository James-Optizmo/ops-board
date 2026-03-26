export default function WeeklyGoal({ issue }) {
  if (!issue) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
        border: '1px solid #c4b5fd',
        borderRadius: '10px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '18px', flexShrink: 0 }}>🎯</span>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          Weekly Goal
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
          {issue.title}
        </div>
        {issue.body && (
          <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px', lineHeight: 1.5 }}>
            {issue.body}
          </div>
        )}
      </div>
      <a
        href={issue.url}
        target="_blank"
        rel="noreferrer"
        style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}
      >
        ↗
      </a>
    </div>
  );
}
