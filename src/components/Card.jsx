import { useState, useRef, useEffect } from 'react';
import EditableChip from './EditableChip';
import CardDetail from './CardDetail';
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

const TEAM_FUN = { platform: '⚙️', product: '🚀' };
const PRIORITY_FUN = { now: '🔴', later: '🟢' };
const EFFORT_FUN = { large: '🏋️', medium: '🏃', small: '🚶' };

export default function Card({ issue, onUpdate, availableAssignees, funMode }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(null);
  const [hovered, setHovered] = useState(false);

  async function handleLabelChange(field, value) {
    setSaving(field);
    const newLabels = replaceLabel(issue.labels, field, value);
    try {
      await onUpdate(issue.number, { labels: newLabels });
    } finally {
      setSaving(null);
    }
  }

  async function handleAssigneeChange(login) {
    setSaving('assignee');
    const current = issue.assignees.map((a) => a.login);
    const next = current.includes(login)
      ? current.filter((l) => l !== login)
      : [...current, login];
    try {
      await onUpdate(issue.number, { assignees: next });
    } finally {
      setSaving(null);
    }
  }

  async function handleUnassign(login) {
    setSaving('assignee');
    try {
      await onUpdate(issue.number, { assignees: issue.assignees.map((a) => a.login).filter((l) => l !== login) });
    } finally {
      setSaving(null);
    }
  }

  const priorityColors = issue.priority ? PRIORITY_COLORS[issue.priority] : { bg: '#f3f4f6', text: '#9ca3af' };
  const effortColors = issue.effort ? EFFORT_COLORS[issue.effort] : { bg: '#f3f4f6', text: '#9ca3af' };

  const cardStyle = funMode ? {
    background: hovered ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.88)',
    border: '2px solid rgba(255,255,255,0.7)',
    borderRadius: '16px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: hovered ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
    boxShadow: hovered ? '0 12px 32px rgba(99,102,241,0.2), 0 2px 8px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.06)',
    backdropFilter: 'blur(8px)',
  } : {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 14px',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
    boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={cardStyle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: funMode ? 800 : 600, color: funMode ? '#1e1b4b' : '#111827', lineHeight: 1.4, flex: 1 }}>
            {issue.title}
          </span>
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: funMode ? '#a5b4fc' : '#9ca3af', fontSize: '13px', flexShrink: 0, textDecoration: 'none' }}
            title="Open on GitHub"
          >
            ↗
          </a>
        </div>

        <div style={{ fontSize: '11px', color: funMode ? '#a5b4fc' : '#9ca3af', marginTop: '4px', marginBottom: '10px', fontWeight: funMode ? 700 : 400 }}>
          #{issue.number}
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {issue.team && (funMode ? (
            <span style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 9px', borderRadius: '999px' }}>
              {TEAM_FUN[issue.team]} {issue.team}
            </span>
          ) : (
            <span style={{ backgroundColor: issue.team === 'platform' ? '#dbeafe' : '#ede9fe', color: issue.team === 'platform' ? '#1d4ed8' : '#6d28d9', fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px' }}>
              {issue.team}
            </span>
          ))}

          <EditableChip
            label={funMode ? (issue.priority ? `${PRIORITY_FUN[issue.priority]} ${issue.priority}` : '· priority') : (issue.priority || 'priority')}
            {...priorityColors}
            options={PRIORITY_OPTIONS}
            onSelect={(v) => handleLabelChange('priority', v)}
            saving={saving === 'priority'}
          />

          <EditableChip
            label={funMode ? (issue.effort ? `${EFFORT_FUN[issue.effort]} ${issue.effort}` : '· effort') : (issue.effort || 'effort')}
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
              style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.15s', }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={a.avatarUrl}
                alt={a.login}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: '2px solid #a5b4fc',
                  opacity: saving === 'assignee' ? 0.4 : 1,
                  boxShadow: '0 2px 6px rgba(99,102,241,0.3)',
                }}
              />
            </div>
          ))}

          {availableAssignees && availableAssignees.length > 0 && (
            <AssigneeDropdown
              assignees={availableAssignees}
              current={issue.assignees.map((a) => a.login)}
              saving={saving === 'assignee'}
              onChange={handleAssigneeChange}
            />
          )}
        </div>
      </div>

      {open && <CardDetail issue={issue} onClose={() => setOpen(false)} />}
    </>
  );
}

function AssigneeDropdown({ assignees, current, saving, onChange }) {
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
          width: 22, height: 22, borderRadius: '50%',
          border: '2px dashed #a5b4fc',
          background: 'rgba(165,180,252,0.1)',
          cursor: saving ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#818cf8', fontSize: '13px', padding: 0,
          fontWeight: 900,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(165,180,252,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(165,180,252,0.1)'; }}
      >
        +
      </button>

      {pos && (
        <div
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            border: '2px solid #e0e7ff',
            borderRadius: '14px',
            boxShadow: '0 16px 40px rgba(99,102,241,0.2)',
            minWidth: '160px',
            maxHeight: '240px',
            overflowY: 'auto',
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
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: assigned ? '#6366f1' : '#374151',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: '"Nunito", sans-serif',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eef2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ opacity: assigned ? 1 : 0, fontSize: '14px' }}>✓</span>
                @{login}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
