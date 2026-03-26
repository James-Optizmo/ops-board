import { useState, useRef, useEffect } from 'react';
import EditableChip from './EditableChip';
import CardDetail from './CardDetail';
import Sparkle from './Sparkle';
import { TEAM_COLORS, PRIORITY_COLORS, EFFORT_COLORS } from '../utils/labels';

const PRIORITY_OPTIONS = [
  { value: 'now', label: 'Now', ...PRIORITY_COLORS.now },
  { value: 'later', label: 'Later', ...PRIORITY_COLORS.later },
  { value: null, label: 'None', bg: null, text: null },
];

const EFFORT_OPTIONS = [
  { value: 'large', label: 'Large', ...EFFORT_COLORS.large },
  { value: 'medium', label: 'Medium', ...EFFORT_COLORS.medium },
  { value: 'small', label: 'Small', ...EFFORT_COLORS.small },
  { value: null, label: 'None', bg: null, text: null },
];

const LABEL_PREFIXES = {
  priority: ['priority:now', 'priority:later'],
  effort: ['effort:large', 'effort:medium', 'effort:small'],
};

function replaceLabel(labels, prefix, newValue) {
  const filtered = labels.filter((l) => !LABEL_PREFIXES[prefix].includes(l));
  return newValue ? [...filtered, `${prefix}:${newValue}`] : filtered;
}

const PRIORITY_FUN = { now: '🚨', later: '🌿' };
const EFFORT_FUN = { large: '🏋️', medium: '🏃', small: '🚶' };

// Deterministic pastel based on issue number
const FUN_CARD_PALETTES = [
  { bg: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', border: '#e879f9', accent: '#a21caf' },
  { bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '#fb923c', accent: '#c2410c' },
  { bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '#4ade80', accent: '#15803d' },
  { bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#60a5fa', accent: '#1d4ed8' },
  { bg: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '#facc15', accent: '#a16207' },
  { bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', border: '#fb7185', accent: '#be123c' },
  { bg: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '#2dd4bf', accent: '#0f766e' },
];

export default function Card({ issue, onUpdate, availableAssignees, funMode }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const palette = FUN_CARD_PALETTES[issue.number % FUN_CARD_PALETTES.length];

  async function handleLabelChange(field, value) {
    setSaving(field);
    const newLabels = replaceLabel(issue.labels, field, value);
    try {
      await onUpdate(issue.number, { labels: newLabels });
      setSaved(true);
      setTimeout(() => setSaved(false), 100);
    } finally {
      setSaving(null);
    }
  }

  async function handleAssigneeChange(login) {
    setSaving('assignee');
    const current = issue.assignees.map((a) => a.login);
    const next = current.includes(login) ? current.filter((l) => l !== login) : [...current, login];
    try {
      await onUpdate(issue.number, { assignees: next });
      setSaved(true);
      setTimeout(() => setSaved(false), 100);
    } finally {
      setSaving(null);
    }
  }

  async function handleUnassign(login) {
    setSaving('assignee');
    try {
      await onUpdate(issue.number, { assignees: issue.assignees.map((a) => a.login).filter((l) => l !== login) });
      setSaved(true);
      setTimeout(() => setSaved(false), 100);
    } finally {
      setSaving(null);
    }
  }

  const priorityColors = issue.priority ? PRIORITY_COLORS[issue.priority] : { bg: '#f3f4f6', text: '#9ca3af' };
  const effortColors = issue.effort ? EFFORT_COLORS[issue.effort] : { bg: '#f3f4f6', text: '#9ca3af' };

  if (funMode) {
    return (
      <>
        <div
          className="fun-card"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: palette.bg,
            border: `2px solid ${hovered ? palette.border : 'rgba(255,255,255,0.6)'}`,
            borderRadius: '18px',
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: hovered ? 'translateY(-6px) rotate(-1.5deg) scale(1.03)' : 'translateY(0) rotate(0deg) scale(1)',
            boxShadow: hovered
              ? `0 20px 40px rgba(0,0,0,0.15), 0 0 0 3px ${palette.border}44`
              : '0 4px 12px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Sparkle active={saved} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.4, flex: 1, fontFamily: '"Nunito", sans-serif' }}>
              {issue.title}
            </span>
            <a
              href={issue.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: palette.accent, fontSize: '14px', flexShrink: 0, textDecoration: 'none', fontWeight: 900 }}
              title="Open on GitHub"
            >
              ↗
            </a>
          </div>

          <div style={{ fontSize: '11px', color: palette.accent, marginTop: '3px', marginBottom: '10px', fontWeight: 800, opacity: 0.7 }}>
            #{issue.number}
          </div>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
            {issue.team && (
              <span style={{
                background: issue.team === 'platform'
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : 'linear-gradient(135deg, #f093fb, #f5576c)',
                color: '#fff', fontSize: '11px', fontWeight: 900,
                padding: '3px 10px', borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontFamily: '"Nunito", sans-serif',
              }}>
                {issue.team === 'platform' ? '⚙️' : '🚀'} {issue.team}
              </span>
            )}
            <EditableChip
              label={issue.priority ? `${PRIORITY_FUN[issue.priority]} ${issue.priority}` : '· priority'}
              {...priorityColors}
              options={PRIORITY_OPTIONS}
              onSelect={(v) => handleLabelChange('priority', v)}
              saving={saving === 'priority'}
            />
            <EditableChip
              label={issue.effort ? `${EFFORT_FUN[issue.effort]} ${issue.effort}` : '· effort'}
              {...effortColors}
              options={EFFORT_OPTIONS}
              onSelect={(v) => handleLabelChange('effort', v)}
              saving={saving === 'effort'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
            {issue.assignees.map((a) => (
              <div
                key={a.login}
                title={`Remove @${a.login}`}
                onClick={(e) => { e.stopPropagation(); handleUnassign(a.login); }}
                style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2) rotate(-5deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
              >
                <img src={a.avatarUrl} alt={a.login}
                  style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${palette.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              </div>
            ))}
            {availableAssignees && availableAssignees.length > 0 && (
              <AssigneeDropdown
                assignees={availableAssignees}
                current={issue.assignees.map((a) => a.login)}
                saving={saving === 'assignee'}
                onChange={handleAssigneeChange}
                accentColor={palette.border}
              />
            )}
          </div>
        </div>
        {open && <CardDetail issue={issue} onClose={() => setOpen(false)} />}
      </>
    );
  }

  // Normal mode
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
          padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow 0.15s',
          boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.4, flex: 1 }}>{issue.title}</span>
          <a href={issue.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
            style={{ color: '#9ca3af', fontSize: '13px', flexShrink: 0, textDecoration: 'none' }} title="Open on GitHub">↗</a>
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginBottom: '10px' }}>#{issue.number}</div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {issue.team && (
            <span style={{ backgroundColor: issue.team === 'platform' ? '#dbeafe' : '#ede9fe', color: issue.team === 'platform' ? '#1d4ed8' : '#6d28d9', fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px' }}>
              {issue.team}
            </span>
          )}
          <EditableChip label={issue.priority || 'priority'} {...priorityColors} options={PRIORITY_OPTIONS} onSelect={(v) => handleLabelChange('priority', v)} saving={saving === 'priority'} />
          <EditableChip label={issue.effort || 'effort'} {...effortColors} options={EFFORT_OPTIONS} onSelect={(v) => handleLabelChange('effort', v)} saving={saving === 'effort'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
          {issue.assignees.map((a) => (
            <div key={a.login} title={`Remove @${a.login}`} onClick={(e) => { e.stopPropagation(); handleUnassign(a.login); }} style={{ cursor: 'pointer' }}>
              <img src={a.avatarUrl} alt={a.login} style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #e5e7eb', opacity: saving === 'assignee' ? 0.4 : 1 }} />
            </div>
          ))}
          {availableAssignees && availableAssignees.length > 0 && (
            <AssigneeDropdown assignees={availableAssignees} current={issue.assignees.map((a) => a.login)} saving={saving === 'assignee'} onChange={handleAssigneeChange} />
          )}
        </div>
      </div>
      {open && <CardDetail issue={issue} onClose={() => setOpen(false)} />}
    </>
  );
}

function AssigneeDropdown({ assignees, current, saving, onChange, accentColor }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!pos) return;
    function handleClick(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setPos(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pos]);

  function handleOpen(e) {
    e.stopPropagation();
    if (pos) { setPos(null); return; }
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={saving}
        title="Assign someone"
        style={{
          width: accentColor ? 24 : 20,
          height: accentColor ? 24 : 20,
          borderRadius: '50%',
          border: `2px dashed ${accentColor || '#d1d5db'}`,
          background: accentColor ? `${accentColor}22` : 'transparent',
          cursor: saving ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor || '#9ca3af',
          fontSize: accentColor ? '14px' : '11px',
          fontWeight: 900, padding: 0,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => accentColor && (e.currentTarget.style.background = `${accentColor}44`)}
        onMouseLeave={(e) => accentColor && (e.currentTarget.style.background = `${accentColor}22`)}
      >
        +
      </button>

      {pos && (
        <div
          style={{
            position: 'fixed', top: pos.top, left: pos.left, zIndex: 1000,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            border: `2px solid ${accentColor || '#e5e7eb'}`,
            borderRadius: '14px',
            boxShadow: accentColor ? `0 16px 40px ${accentColor}44` : '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '160px', maxHeight: '240px', overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {assignees.map((login) => {
            const assigned = current.includes(login);
            return (
              <div
                key={login}
                onClick={(e) => { e.stopPropagation(); setPos(null); onChange(login); }}
                style={{
                  padding: '8px 14px', fontSize: '12px', fontWeight: 800,
                  cursor: 'pointer', color: assigned ? (accentColor || '#6366f1') : '#374151',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: accentColor ? '"Nunito", sans-serif' : 'inherit',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = accentColor ? `${accentColor}18` : '#eef2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ opacity: assigned ? 1 : 0 }}>✓</span>
                @{login}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
