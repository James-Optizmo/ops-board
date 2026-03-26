export default function ModeToggle({ funMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={funMode ? 'Switch to normal mode' : 'Switch to fun mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: funMode ? '6px 14px' : '5px 12px',
        borderRadius: '999px',
        border: funMode
          ? '2px solid rgba(255,255,255,0.6)'
          : '1px solid #e5e7eb',
        background: funMode ? 'rgba(255,255,255,0.2)' : '#fff',
        color: funMode ? '#fff' : '#374151',
        fontWeight: 800,
        fontSize: '12px',
        fontFamily: funMode ? '"Nunito", sans-serif' : 'inherit',
        cursor: 'pointer',
        backdropFilter: funMode ? 'blur(4px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <span style={{ fontSize: '15px' }}>{funMode ? '😎' : '🎨'}</span>
      {funMode ? 'Normal mode' : 'Fun mode'}
    </button>
  );
}
