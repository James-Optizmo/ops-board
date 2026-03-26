import { useEffect, useState } from 'react';

export default function Sparkle({ active }) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 8) * 360,
      emoji: ['✨', '⭐', '💫', '🌟'][i % 4],
    }));
    setSparks(newSparks);
    const t = setTimeout(() => setSparks([]), 700);
    return () => clearTimeout(t);
  }, [active]);

  if (!sparks.length) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {sparks.map((s) => (
        <div key={s.id} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          fontSize: '14px',
          animation: `sparkFly 0.7s ease-out forwards`,
          '--angle': `${s.angle}deg`,
        }}>
          {s.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sparkFly {
          0%   { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-40px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
