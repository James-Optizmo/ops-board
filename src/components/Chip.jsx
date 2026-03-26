export default function Chip({ label, bg, text }) {
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
