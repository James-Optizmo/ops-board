import { createPortal } from 'react-dom';
import { marked } from 'marked';
import Chip from './Chip';
import { TEAM_COLORS, PRIORITY_COLORS, EFFORT_COLORS } from '../utils/labels';
import { dark } from '../theme';

marked.setOptions({ breaks: true, gfm: true });

const PRIORITY_FUN = { now: '🚨', later: '🌿' };
const EFFORT_FUN = { large: '🏋️', medium: '🏃', small: '🚶' };
const TEAM_FUN = { platform: '⚙️', product: '🚀' };

export default function CardDetail({ issue, onClose, funMode, palette }) {
  if (funMode) {
    const p = palette || { bg: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', border: '#e879f9', accent: '#a21caf' };

    return createPortal(
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: p.bg,
            border: `3px solid ${p.border}`,
            borderRadius: '28px',
            padding: '28px',
            maxWidth: '520px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: `0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5), 0 0 60px ${p.border}44`,
            fontFamily: '"Nunito", sans-serif',
            animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
          }}
        >
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${p.border}33`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -10, left: -10, width: 50, height: 50, borderRadius: '50%', background: `${p.border}22`, pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: p.accent, opacity: 0.7 }}>#{issue.number}</span>
            <button
              onClick={onClose}
              style={{
                background: `${p.border}33`, border: `2px solid ${p.border}`,
                borderRadius: '50%', width: 32, height: 32,
                cursor: 'pointer', fontSize: '14px', color: p.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = p.border; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${p.border}33`; e.currentTarget.style.color = p.accent; }}
            >
              ✕
            </button>
          </div>

          <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.3 }}>
            {issue.title}
          </h2>

          {/* Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {issue.team && (
              <span style={{
                background: issue.team === 'platform' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#f093fb,#f5576c)',
                color: '#fff', fontSize: '12px', fontWeight: 900, padding: '4px 12px', borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>
                {TEAM_FUN[issue.team]} {issue.team}
              </span>
            )}
            {issue.priority && (
              <span style={{ background: PRIORITY_COLORS[issue.priority].bg, color: PRIORITY_COLORS[issue.priority].text, fontSize: '12px', fontWeight: 900, padding: '4px 12px', borderRadius: '999px' }}>
                {PRIORITY_FUN[issue.priority]} {issue.priority}
              </span>
            )}
            {issue.effort && (
              <span style={{ background: EFFORT_COLORS[issue.effort].bg, color: EFFORT_COLORS[issue.effort].text, fontSize: '12px', fontWeight: 900, padding: '4px 12px', borderRadius: '999px' }}>
                {EFFORT_FUN[issue.effort]} {issue.effort}
              </span>
            )}
          </div>

          {/* Assignees */}
          {issue.assignees.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {issue.assignees.map((a) => (
                <div key={a.login} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', borderRadius: '999px', padding: '4px 12px 4px 4px', border: `1.5px solid ${p.border}` }}>
                  <img src={a.avatarUrl} alt={a.login} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: p.accent }}>@{a.login}</span>
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          {issue.body && (
            <div style={{
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '20px',
              borderLeft: `4px solid ${p.border}`,
              boxShadow: `inset 0 0 0 1px ${p.border}33`,
            }}>
              <div style={{ fontSize: '10px', fontWeight: 900, color: p.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.8 }}>
                📝 Description
              </div>
              <div
                className="md-body md-body--fun"
                dangerouslySetInnerHTML={{ __html: marked(issue.body) }}
              />
            </div>
          )}

          {/* Footer */}
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: `linear-gradient(135deg, ${p.border}, ${p.accent})`,
              color: '#fff', fontSize: '13px', fontWeight: 900,
              textDecoration: 'none', padding: '8px 18px', borderRadius: '999px',
              boxShadow: `0 4px 16px ${p.border}66`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${p.border}88`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${p.border}66`; }}
          >
            Open on GitHub 🚀
          </a>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popIn {
            0%   { transform: scale(0.85) translateY(20px); opacity: 0; }
            70%  { transform: scale(1.03); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>,
      document.body
    );
  }

  // Normal (dark) mode
  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2a2540', border: `1px solid ${dark.border}`,
          borderRadius: '14px', padding: '28px', maxWidth: '560px', width: '90%',
          maxHeight: '80vh', overflowY: 'auto',
          fontFamily: '"Inter", sans-serif',
          boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${dark.accent}33`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: dark.textMuted, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>#{issue.number}</span>
          <button onClick={onClose} style={{ background: dark.elevated, border: `1px solid ${dark.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: dark.textSecondary, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>✕</button>
        </div>

        <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: dark.textPrimary, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>{issue.title}</h2>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {issue.team && (
            <span style={{ backgroundColor: dark.chips[issue.team].bg, color: dark.chips[issue.team].text, fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px', border: `1px solid ${dark.chips[issue.team].text}33` }}>
              {issue.team}
            </span>
          )}
          {issue.priority && (
            <span style={{ backgroundColor: dark.chips[issue.priority].bg, color: dark.chips[issue.priority].text, fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px' }}>
              {issue.priority}
            </span>
          )}
          {issue.effort && (
            <span style={{ backgroundColor: dark.chips[issue.effort].bg, color: dark.chips[issue.effort].text, fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px' }}>
              {issue.effort}
            </span>
          )}
        </div>

        {issue.assignees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {issue.assignees.map((a) => (
              <div key={a.login} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: dark.elevated, borderRadius: '999px', padding: '4px 10px 4px 4px', border: `1px solid ${dark.border}` }}>
                <img src={a.avatarUrl} alt={a.login} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                <span style={{ fontSize: '12px', color: dark.textSecondary, fontFamily: '"Inter", sans-serif' }}>@{a.login}</span>
              </div>
            ))}
          </div>
        )}

        {issue.body && (
          <div
            className="md-body md-body--dark"
            style={{ marginBottom: '20px' }}
            dangerouslySetInnerHTML={{ __html: marked(issue.body) }}
          />
        )}

        <a
          href={issue.url} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: dark.accentBright, textDecoration: 'none', fontWeight: 600, padding: '7px 14px', borderRadius: '8px', background: dark.accentDim, border: `1px solid ${dark.accent}55`, transition: 'all 0.15s', fontFamily: '"Inter", sans-serif' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = dark.accent; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = dark.accentDim; e.currentTarget.style.color = dark.accentBright; }}
        >
          Open on GitHub →
        </a>
      </div>
    </div>,
    document.body
  );
}
