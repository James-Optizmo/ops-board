export default function WeeklyGoal({ issue, funMode }) {
  if (!issue) return null;

  if (funMode) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(12px)',
        border: '2px solid rgba(255,255,255,0.4)',
        borderRadius: '20px',
        padding: '16px 22px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        animation: 'float 4s ease-in-out infinite',
        fontFamily: '"Nunito", sans-serif',
      }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>🎯</span>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
            Weekly Goal
          </div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            {issue.title}
          </div>
          {issue.body && (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px', lineHeight: 1.5, fontWeight: 600 }}>
              {issue.body}
            </div>
          )}
        </div>
        <a href={issue.url} target="_blank" rel="noreferrer"
          style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: '16px', textDecoration: 'none', flexShrink: 0 }}>
          ↗
        </a>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
      border: '1px solid #c4b5fd',
      borderRadius: '10px',
      padding: '14px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>🎯</span>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          Weekly Goal
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{issue.title}</div>
        {issue.body && (
          <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px', lineHeight: 1.5 }}>{issue.body}</div>
        )}
      </div>
      <a href={issue.url} target="_blank" rel="noreferrer"
        style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>
        ↗
      </a>
    </div>
  );
}
