import { useState, useRef, useEffect } from 'react';
import Chip from './Chip';
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

export default function Card({ issue, onUpdate, availableAssignees }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(null); // 'priority' | 'effort' | 'assignee'

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

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 14px',
          cursor: 'pointer',
          transition: 'box-shadow 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.4, flex: 1 }}>
            {issue.title}
          </span>
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: '#9ca3af', fontSize: '13px', flexShrink: 0, textDecoration: 'none' }}
            title="Open on GitHub"
          >
            ↗
          </a>
        </div>

        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginBottom: '10px' }}>
          #{issue.number}
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {issue.team && <Chip label={issue.team} {...TEAM_COLORS[issue.team]} />}

          <EditableChip
            label={issue.priority || 'priority'}
            {...priorityColors}
            options={PRIORITY_OPTIONS}
            onSelect={(v) => handleLabelChange('priority', v)}
            saving={saving === 'priority'}
          />

          <EditableChip
            label={issue.effort || 'effort'}
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
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <img
                src={a.avatarUrl}
                alt={a.login}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '1.5px solid #e5e7eb',
                  opacity: saving === 'assignee' ? 0.4 : 1,
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
          width: 20, height: 20, borderRadius: '50%',
          border: '1.5px dashed #d1d5db',
          background: 'transparent',
          cursor: saving ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#9ca3af', fontSize: '11px', padding: 0,
        }}
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
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '140px',
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
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: assigned ? '#2563eb' : '#374151',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                <span style={{ width: 8, opacity: assigned ? 1 : 0 }}>✓</span>
                @{login}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
