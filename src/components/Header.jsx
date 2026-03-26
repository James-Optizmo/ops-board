import { timeSince } from '../utils/labels';
import { dark } from '../theme';

const TEAMS = ['all', 'platform', 'product'];
const TEAM_EMOJI = { all: '🌍', platform: '⚙️', product: '🚀' };

export default function Header({ teamFilter, onTeamChange, onRefresh, loading, lastUpdated, funMode, extra }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '14px 24px',
      background: funMode ? 'rgba(255,255,255,0.15)' : dark.surface,
      backdropFilter: funMode ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${funMode ? 'rgba(255,255,255,0.2)' : dark.border}`,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontWeight: 700,
        fontSize: funMode ? '20px' : '16px',
        color: funMode ? '#fff' : dark.textPrimary,
        letterSpacing: funMode ? '-0.5px' : '-0.2px',
        fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
      }}>
        {funMode ? '✨ Ops Board' : 'Ops Board'}
      </span>

      <div style={{ display: 'flex', gap: '4px', background: funMode ? 'transparent' : dark.elevated, borderRadius: '8px', padding: funMode ? '0' : '3px' }}>
        {TEAMS.map((team) => {
          const active = teamFilter === team;
          return (
            <button
              key={team}
              onClick={() => onTeamChange(team)}
              style={{
                padding: funMode ? '6px 14px' : '4px 12px',
                borderRadius: funMode ? '999px' : '6px',
                border: funMode
                  ? active ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.3)'
                  : 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
                background: funMode
                  ? active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)'
                  : active ? dark.accentDim : 'transparent',
                color: funMode
                  ? active ? '#7c3aed' : 'rgba(255,255,255,0.9)'
                  : active ? dark.accentBright : dark.textSecondary,
                boxShadow: !funMode && active ? `0 0 0 1px ${dark.accent}66` : 'none',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {funMode ? `${TEAM_EMOJI[team]} ` : ''}{team}
            </button>
          );
        })}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {lastUpdated && (
          <span style={{ fontSize: '12px', color: funMode ? 'rgba(255,255,255,0.7)' : dark.textMuted }}>
            Updated {timeSince(lastUpdated)}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: funMode ? '7px 16px' : '6px 14px',
            borderRadius: funMode ? '999px' : '7px',
            border: funMode ? '2px solid rgba(255,255,255,0.6)' : `1px solid ${dark.border}`,
            background: funMode
              ? loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'
              : loading ? dark.elevated : dark.elevated,
            color: funMode ? '#fff' : loading ? dark.textMuted : dark.textSecondary,
            fontWeight: 600,
            fontSize: '12px',
            fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { if (!funMode && !loading) { e.currentTarget.style.borderColor = dark.accent; e.currentTarget.style.color = dark.accentBright; } }}
          onMouseLeave={(e) => { if (!funMode) { e.currentTarget.style.borderColor = dark.border; e.currentTarget.style.color = dark.textSecondary; } }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
            {funMode ? '🔄' : '↻'}
          </span>
          Refresh
        </button>
        {extra}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
