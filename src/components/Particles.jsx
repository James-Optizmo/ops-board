import { useEffect, useRef } from 'react';

const EMOJIS = ['⭐', '✨', '💫', '🌟', '🎉', '🚀', '💜', '🔥', '⚡', '🎊', '💥', '🌈'];

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];

    function spawn() {
      const el = document.createElement('div');
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const size = 14 + Math.random() * 18;
      const left = Math.random() * 100;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * 4;
      const drift = (Math.random() - 0.5) * 120;

      el.textContent = emoji;
      el.style.cssText = `
        position: absolute;
        font-size: ${size}px;
        left: ${left}%;
        bottom: -40px;
        opacity: 0;
        pointer-events: none;
        animation: floatUp ${duration}s ${delay}s ease-in infinite;
        --drift: ${drift}px;
      `;
      container.appendChild(el);
      particles.push(el);

      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
        const idx = particles.indexOf(el);
        if (idx > -1) particles.splice(idx, 1);
      }, (duration + delay) * 1000 + 500);
    }

    // Spawn initial batch
    for (let i = 0; i < 12; i++) setTimeout(spawn, i * 400);
    // Keep spawning
    const interval = setInterval(spawn, 800);

    return () => {
      clearInterval(interval);
      particles.forEach((p) => { if (container.contains(p)) container.removeChild(p); });
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-105vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}
