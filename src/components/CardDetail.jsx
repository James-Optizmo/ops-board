import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { marked } from 'marked';
import EditableChip from './EditableChip';
import { PRIORITY_COLORS, EFFORT_COLORS } from '../utils/labels';
import { dark } from '../theme';

marked.setOptions({ breaks: true, gfm: true });

const PRIORITY_FUN = { now: '🚨', later: '🌿' };
const EFFORT_FUN = { large: '🏋️', medium: '🏃', small: '🚶' };
const TEAM_FUN = { platform: '⚙️', product: '🚀' };

const LABEL_PREFIXES = {
  priority: ['priority:now', 'priority:later'],
  effort:   ['effort:large', 'effort:medium', 'effort:small'],
};

function replaceLabel(labels, prefix, newValue) {
  const filtered = labels.filter((l) => !LABEL_PREFIXES[prefix].includes(l));
  return newValue ? [...filtered, `${prefix}:${newValue}`] : filtered;
}

const DARK_PRIORITY_OPTIONS = [
  { value: 'now',   label: 'Now',   bg: '#2d1515', text: '#fca5a5' },
  { value: 'later', label: 'Later', bg: '#0f2318', text: '#86efac' },
  { value: null,    label: 'None',  bg: null,      text: null },
];
const DARK_EFFORT_OPTIONS = [
  { value: 'large',  label: 'Large',  bg: '#1e1a3a', text: '#c4b5fd' },
  { value: 'medium', label: 'Medium', bg: '#1e1a3a', text: '#c4b5fd' },
  { value: 'small',  label: 'Small',  bg: '#1e1a3a', text: '#c4b5fd' },
  { value: null,     label: 'None',   bg: null,      text: null },
];
const PRIORITY_OPTIONS = [
  { value: 'now',   label: 'Now',   ...PRIORITY_COLORS.now },
  { value: 'later', label: 'Later', ...PRIORITY_COLORS.later },
  { value: null,    label: 'None',  bg: null, text: null },
];
const EFFORT_OPTIONS = [
  { value: 'large',  label: 'Large',  ...EFFORT_COLORS.large },
  { value: 'medium', label: 'Medium', ...EFFORT_COLORS.medium },
  { value: 'small',  label: 'Small',  ...EFFORT_COLORS.small },
  { value: null,     label: 'None',   bg: null, text: null },
];

export default function CardDetail({ issue, onClose, funMode, palette, onUpdate, availableAssignees }) {
  const [saving, setSaving] = useState(null);
  const [editingBody, setEditingBody] = useState(false);
  const [bodyDraft, setBodyDraft] = useState(issue.body || '');

  // Keep bodyDraft in sync if issue updates externally
  useEffect(() => {
    if (!editingBody) setBodyDraft(issue.body || '');
  }, [issue.body, editingBody]);

  async function handleLabelChange(field, value) {
    setSaving(field);
    const newLabels = replaceLabel(issue.labels, field, value);
    try { await onUpdate(issue.number, { labels: newLabels }); }
    finally { setSaving(null); }
  }

  async function handleAssigneeToggle(login) {
    setSaving('assignee');
    const current = issue.assignees.map((a) => a.login);
    const next = current.includes(login) ? current.filter((l) => l !== login) : [...current, login];
    try { await onUpdate(issue.number, { assignees: next }); }
    finally { setSaving(null); }
  }

  async function handleBodySave() {
    setSaving('body');
    try {
      await onUpdate(issue.number, { body: bodyDraft });
      setEditingBody(false);
    } finally {
      setSaving(null);
    }
  }

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
              style={{ background: `${p.border}33`, border: `2px solid ${p.border}`, borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '14px', color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = p.border; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${p.border}33`; e.currentTarget.style.color = p.accent; }}
            >✕</button>
          </div>

          <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.3 }}>
            {issue.title}
          </h2>

          {/* Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px', alignItems: 'center' }}>
            {issue.team && (
              <span style={{ background: issue.team === 'platform' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#f093fb,#f5576c)', color: '#fff', fontSize: '12px', fontWeight: 900, padding: '4px 12px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                {TEAM_FUN[issue.team]} {issue.team}
              </span>
            )}
            <EditableChip
              label={issue.priority ? `${PRIORITY_FUN[issue.priority]} ${issue.priority}` : '· priority'}
              bg={issue.priority ? PRIORITY_COLORS[issue.priority].bg : '#f3f4f6'}
              text={issue.priority ? PRIORITY_COLORS[issue.priority].text : '#9ca3af'}
              options={PRIORITY_OPTIONS}
              onSelect={(v) => handleLabelChange('priority', v)}
              saving={saving === 'priority'}
            />
            <EditableChip
              label={issue.effort ? `${EFFORT_FUN[issue.effort]} ${issue.effort}` : '· effort'}
              bg={issue.effort ? EFFORT_COLORS[issue.effort].bg : '#f3f4f6'}
              text={issue.effort ? EFFORT_COLORS[issue.effort].text : '#9ca3af'}
              options={EFFORT_OPTIONS}
              onSelect={(v) => handleLabelChange('effort', v)}
              saving={saving === 'effort'}
            />
          </div>

          {/* Assignees */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: p.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.8 }}>👤 Assignees</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {issue.assignees.map((a) => (
                <div key={a.login} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.6)', borderRadius: '999px', padding: '4px 10px 4px 4px', border: `1.5px solid ${p.border}` }}>
                  <img src={a.avatarUrl} alt={a.login} style={{ width: 22, height: 22, borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: p.accent }}>@{a.login}</span>
                  <button
                    onClick={() => handleAssigneeToggle(a.login)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.accent, fontSize: '12px', padding: '0 0 0 2px', lineHeight: 1, opacity: 0.6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                    title="Remove"
                  >×</button>
                </div>
              ))}
              {availableAssignees && (
                <ModalAssigneeDropdown
                  assignees={availableAssignees}
                  current={issue.assignees.map((a) => a.login)}
                  saving={saving === 'assignee'}
                  onChange={handleAssigneeToggle}
                  accentColor={p.border}
                  funMode
                />
              )}
            </div>
          </div>

          {/* Body */}
          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '16px', padding: '16px 18px', marginBottom: '20px', borderLeft: `4px solid ${p.border}`, boxShadow: `inset 0 0 0 1px ${p.border}33` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 900, color: p.accent, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>📝 Description</div>
              {!editingBody ? (
                <button onClick={() => setEditingBody(true)} style={{ background: `${p.border}22`, border: `1px solid ${p.border}`, borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 900, color: p.accent, cursor: 'pointer', fontFamily: '"Nunito", sans-serif' }}>✏️ Edit</button>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { setEditingBody(false); setBodyDraft(issue.body || ''); }} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${p.border}55`, borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 900, color: p.accent, cursor: 'pointer', fontFamily: '"Nunito", sans-serif' }}>Cancel</button>
                  <button onClick={handleBodySave} disabled={saving === 'body'} style={{ background: `linear-gradient(135deg, ${p.border}, ${p.accent})`, border: 'none', borderRadius: '8px', padding: '3px 12px', fontSize: '11px', fontWeight: 900, color: '#fff', cursor: saving === 'body' ? 'not-allowed' : 'pointer', fontFamily: '"Nunito", sans-serif', opacity: saving === 'body' ? 0.6 : 1 }}>
                    {saving === 'body' ? 'Saving…' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            {editingBody ? (
              <textarea
                value={bodyDraft}
                onChange={(e) => setBodyDraft(e.target.value)}
                style={{ width: '100%', minHeight: '160px', border: `1.5px solid ${p.border}`, borderRadius: '10px', padding: '10px', fontSize: '13px', fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: '#1e1b4b', background: 'rgba(255,255,255,0.8)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            ) : (
              <div className="md-body md-body--fun" dangerouslySetInnerHTML={{ __html: marked(issue.body || '_No description_') }} />
            )}
          </div>

          {/* Footer */}
          <a
            href={issue.url} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg, ${p.border}, ${p.accent})`, color: '#fff', fontSize: '13px', fontWeight: 900, textDecoration: 'none', padding: '8px 18px', borderRadius: '999px', boxShadow: `0 4px 16px ${p.border}66`, transition: 'transform 0.15s, box-shadow 0.15s' }}
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
  const darkPriority = issue.priority
    ? DARK_PRIORITY_OPTIONS.find((o) => o.value === issue.priority)
    : { bg: dark.elevated, text: dark.textMuted };
  const darkEffort = issue.effort
    ? DARK_EFFORT_OPTIONS.find((o) => o.value === issue.effort)
    : { bg: dark.elevated, text: dark.textMuted };

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#2a2540', border: `1px solid ${dark.border}`, borderRadius: '14px', padding: '28px', maxWidth: '560px', width: '90%', maxHeight: '80vh', overflowY: 'auto', fontFamily: '"Inter", sans-serif', boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${dark.accent}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: dark.textMuted, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>#{issue.number}</span>
          <button onClick={onClose} style={{ background: dark.elevated, border: `1px solid ${dark.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: dark.textSecondary, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>✕</button>
        </div>

        <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: dark.textPrimary, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>{issue.title}</h2>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
          {issue.team && (
            <span style={{ backgroundColor: dark.chips[issue.team].bg, color: dark.chips[issue.team].text, fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px', border: `1px solid ${dark.chips[issue.team].text}33` }}>
              {issue.team}
            </span>
          )}
          <EditableChip
            label={issue.priority || 'priority'}
            bg={darkPriority?.bg || dark.elevated}
            text={darkPriority?.text || dark.textMuted}
            options={DARK_PRIORITY_OPTIONS}
            onSelect={(v) => handleLabelChange('priority', v)}
            saving={saving === 'priority'}
          />
          <EditableChip
            label={issue.effort || 'effort'}
            bg={darkEffort?.bg || dark.elevated}
            text={darkEffort?.text || dark.textMuted}
            options={DARK_EFFORT_OPTIONS}
            onSelect={(v) => handleLabelChange('effort', v)}
            saving={saving === 'effort'}
          />
        </div>

        {/* Assignees */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: dark.textMuted, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignees</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {issue.assignees.map((a) => (
              <div key={a.login} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: dark.elevated, borderRadius: '999px', padding: '4px 8px 4px 4px', border: `1px solid ${dark.border}` }}>
                <img src={a.avatarUrl} alt={a.login} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                <span style={{ fontSize: '12px', color: dark.textSecondary, fontFamily: '"Inter", sans-serif' }}>@{a.login}</span>
                <button
                  onClick={() => handleAssigneeToggle(a.login)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark.textMuted, fontSize: '13px', padding: '0 0 0 2px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fca5a5')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = dark.textMuted)}
                  title="Remove"
                >×</button>
              </div>
            ))}
            {availableAssignees && (
              <ModalAssigneeDropdown
                assignees={availableAssignees}
                current={issue.assignees.map((a) => a.login)}
                saving={saving === 'assignee'}
                onChange={handleAssigneeToggle}
              />
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: dark.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</div>
            {!editingBody ? (
              <button
                onClick={() => setEditingBody(true)}
                style={{ background: dark.elevated, border: `1px solid ${dark.border}`, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: dark.textSecondary, cursor: 'pointer', fontFamily: '"Inter", sans-serif', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = dark.accent; e.currentTarget.style.color = dark.accentBright; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = dark.border; e.currentTarget.style.color = dark.textSecondary; }}
              >Edit</button>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => { setEditingBody(false); setBodyDraft(issue.body || ''); }}
                  style={{ background: dark.elevated, border: `1px solid ${dark.border}`, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: dark.textSecondary, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}
                >Cancel</button>
                <button
                  onClick={handleBodySave}
                  disabled={saving === 'body'}
                  style={{ background: dark.accentDim, border: `1px solid ${dark.accent}55`, borderRadius: '6px', padding: '3px 12px', fontSize: '11px', fontWeight: 600, color: dark.accentBright, cursor: saving === 'body' ? 'not-allowed' : 'pointer', fontFamily: '"Inter", sans-serif', opacity: saving === 'body' ? 0.6 : 1 }}
                >{saving === 'body' ? 'Saving…' : 'Save'}</button>
              </div>
            )}
          </div>
          {editingBody ? (
            <textarea
              value={bodyDraft}
              onChange={(e) => setBodyDraft(e.target.value)}
              style={{ width: '100%', minHeight: '160px', background: dark.surface, border: `1px solid ${dark.accent}66`, borderRadius: '8px', padding: '10px', fontSize: '13px', fontFamily: '"Inter", sans-serif', color: dark.textPrimary, resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
            />
          ) : (
            <div
              className="md-body md-body--dark"
              dangerouslySetInnerHTML={{ __html: marked(issue.body || '_No description_') }}
            />
          )}
        </div>

        {/* Footer */}
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

function ModalAssigneeDropdown({ assignees, current, saving, onChange, accentColor, funMode }) {
  const [pos, setPos] = useState(null);
  const containerRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!pos) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setPos(null);
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

  const btnStyle = funMode
    ? { width: 28, height: 28, borderRadius: '999px', border: `2px dashed ${accentColor}`, background: `${accentColor}22`, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: '16px', fontWeight: 900, padding: 0, fontFamily: '"Nunito", sans-serif' }
    : { width: 28, height: 28, borderRadius: '999px', border: `1px dashed ${dark.border}`, background: 'transparent', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dark.textMuted, fontSize: '14px', fontWeight: 600, padding: 0 };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button ref={btnRef} onClick={handleOpen} disabled={saving} style={btnStyle}
        onMouseEnter={(e) => { if (!funMode) e.currentTarget.style.borderColor = dark.accentBright; }}
        onMouseLeave={(e) => { if (!funMode) e.currentTarget.style.borderColor = dark.border; }}
        title="Add assignee"
      >+</button>

      {pos && (
        <div
          style={{
            position: 'fixed', top: pos.top, left: pos.left, zIndex: 2000,
            background: funMode ? 'rgba(255,255,255,0.97)' : dark.elevated,
            border: `1px solid ${funMode ? (accentColor || '#e5e7eb') : dark.border}`,
            borderRadius: '12px',
            boxShadow: funMode ? `0 16px 40px ${accentColor}44` : `0 8px 24px rgba(0,0,0,0.4)`,
            minWidth: '160px', maxHeight: '220px', overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {assignees.map((login) => {
            const assigned = current.includes(login);
            return (
              <div
                key={login}
                onClick={(e) => { e.stopPropagation(); setPos(null); onChange(login); }}
                style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: assigned ? (funMode ? accentColor : dark.accentBright) : (funMode ? '#374151' : dark.textSecondary), fontFamily: funMode ? '"Nunito", sans-serif' : '"Inter", sans-serif' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = funMode ? `${accentColor}18` : dark.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ opacity: assigned ? 1 : 0, fontSize: '11px' }}>✓</span>
                @{login}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
