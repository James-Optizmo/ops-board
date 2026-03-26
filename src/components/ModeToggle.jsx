import { dark } from '../theme';

export default function ModeToggle({ funMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={funMode ? 'Switch to normal mode' : 'Switch to fun mode'}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: funMode ? '6px 14px' : '5px 12px',
        borderRadius: '999px',
        border: funMode ? '2px solid rgba(255,255,255,0.6)' : `1px solid ${dark.border}`,
        background: funMode ? 'rgba(255,255,255,0.2)' : dark.elevated,
        color: funMode ? '#fff' : dark.textSecondary,
        fontWeight: 600, fontSize: '12px',
        fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { if (!funMode) { e.currentTarget.style.borderColor = dark.accent; e.currentTarget.style.color = dark.accentBright; } }}
      onMouseLeave={(e) => { if (!funMode) { e.currentTarget.style.borderColor = dark.border; e.currentTarget.style.color = dark.textSecondary; } }}
    >
      <span style={{ fontSize: '14px' }}>{funMode ? '😎' : '🎨'}</span>
      {funMode ? 'Normal mode' : 'Fun mode'}
    </button>
  );
}
