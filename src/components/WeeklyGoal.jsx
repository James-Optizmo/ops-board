export default function WeeklyGoal({ issue, funMode }) {
  if (!issue) return null;

  if (funMode) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(255,255,255,0.5)',
        borderRadius: '24px',
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
        animation: 'float 3s ease-in-out infinite',
        fontFamily: '"Nunito", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <span style={{ fontSize: '36px', animation: 'wiggle 1.5s ease-in-out infinite', flexShrink: 0 }}>🎯</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
            ⭐ This Week's Goal ⭐
          </div>
          <div style={{ fontSize: '17px', fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.3 }}>
            {issue.title}
          </div>
          {issue.body && (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '6px', lineHeight: 1.5, fontWeight: 600 }}>
              {issue.body}
            </div>
          )}
        </div>
        <a href={issue.url} target="_blank" rel="noreferrer"
          style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', textDecoration: 'none', flexShrink: 0, fontWeight: 900 }}>
          ↗
        </a>

        <style>{`
          @keyframes shimmer {
            0%   { left: -100%; }
            100% { left: 200%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
      border: '1px solid #c4b5fd', borderRadius: '10px',
      padding: '14px 20px', marginBottom: '20px',
      display: 'flex', alignItems: 'flex-start', gap: '12px',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>🎯</span>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Weekly Goal</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{issue.title}</div>
        {issue.body && <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px', lineHeight: 1.5 }}>{issue.body}</div>}
      </div>
      <a href={issue.url} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>↗</a>
    </div>
  );
}
