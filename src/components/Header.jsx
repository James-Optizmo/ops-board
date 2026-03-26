import { timeSince } from '../utils/labels';

const TEAMS = ['all', 'platform', 'product'];

export default function Header({ teamFilter, onTeamChange, onRefresh, loading, lastUpdated }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 24px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontWeight: 800, fontSize: '17px', color: '#111827', letterSpacing: '-0.3px' }}>
        Ops Board
      </span>

      <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '8px', padding: '3px' }}>
        {TEAMS.map((team) => (
          <button
            key={team}
            onClick={() => onTeamChange(team)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              background: teamFilter === team ? '#fff' : 'transparent',
              color: teamFilter === team ? '#111827' : '#6b7280',
              boxShadow: teamFilter === team ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {team}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {lastUpdated && (
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            Updated {timeSince(lastUpdated)}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '6px 14px',
            borderRadius: '7px',
            border: '1px solid #e5e7eb',
            background: loading ? '#f9fafb' : '#fff',
            color: loading ? '#9ca3af' : '#374151',
            fontWeight: 600,
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
            ↻
          </span>
          Refresh
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
