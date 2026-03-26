import { timeSince } from '../utils/labels';

const TEAMS = ['all', 'platform', 'product'];
const TEAM_EMOJI = { all: '🌍', platform: '⚙️', product: '🚀' };

export default function Header({ teamFilter, onTeamChange, onRefresh, loading, lastUpdated, funMode, extra }) {
  const fun = funMode;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '14px 24px',
      background: fun ? 'rgba(255,255,255,0.15)' : '#fff',
      backdropFilter: fun ? 'blur(12px)' : 'none',
      borderBottom: fun ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e5e7eb',
      flexWrap: 'wrap',
      transition: 'all 0.4s ease',
    }}>
      <span style={{
        fontWeight: 900,
        fontSize: fun ? '20px' : '17px',
        color: fun ? '#fff' : '#111827',
        letterSpacing: fun ? '-0.5px' : '-0.3px',
        textShadow: fun ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        fontFamily: fun ? '"Nunito", sans-serif' : 'inherit',
        transition: 'all 0.4s ease',
      }}>
        {fun ? '✨ Ops Board' : 'Ops Board'}
      </span>

      <div style={{ display: 'flex', gap: fun ? '6px' : '4px' }}>
        {TEAMS.map((team) => {
          const active = teamFilter === team;
          return (
            <button
              key={team}
              onClick={() => onTeamChange(team)}
              style={{
                padding: fun ? '6px 14px' : '4px 12px',
                borderRadius: fun ? '999px' : '6px',
                border: fun
                  ? active ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.3)'
                  : 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: fun ? 800 : 600,
                fontFamily: fun ? '"Nunito", sans-serif' : 'inherit',
                background: fun
                  ? active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)'
                  : active ? '#fff' : 'transparent',
                color: fun
                  ? active ? '#7c3aed' : 'rgba(255,255,255,0.9)'
                  : active ? '#111827' : '#6b7280',
                boxShadow: !fun && active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                transform: fun && active ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {fun ? `${TEAM_EMOJI[team]} ` : ''}{team}
            </button>
          );
        })}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {lastUpdated && (
          <span style={{ fontSize: '12px', color: fun ? 'rgba(255,255,255,0.7)' : '#9ca3af', fontWeight: fun ? 600 : 400 }}>
            Updated {timeSince(lastUpdated)}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: fun ? '7px 16px' : '6px 14px',
            borderRadius: fun ? '999px' : '7px',
            border: fun ? '2px solid rgba(255,255,255,0.6)' : '1px solid #e5e7eb',
            background: fun
              ? loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'
              : loading ? '#f9fafb' : '#fff',
            color: fun ? '#fff' : loading ? '#9ca3af' : '#374151',
            fontWeight: fun ? 800 : 600,
            fontSize: '12px',
            fontFamily: fun ? '"Nunito", sans-serif' : 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            backdropFilter: fun ? 'blur(4px)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none', fontSize: fun ? '14px' : '13px' }}>
            {fun ? '🔄' : '↻'}
          </span>
          Refresh
        </button>
        {extra}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
