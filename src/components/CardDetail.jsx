import Chip from './Chip';
import { TEAM_COLORS, PRIORITY_COLORS, EFFORT_COLORS } from '../utils/labels';

export default function CardDetail({ issue, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '28px',
          maxWidth: '560px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>#{issue.number}</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>
          {issue.title}
        </h2>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {issue.team && <Chip label={issue.team} {...TEAM_COLORS[issue.team]} />}
          {issue.priority && <Chip label={issue.priority} {...PRIORITY_COLORS[issue.priority]} />}
          {issue.effort && <Chip label={issue.effort} {...EFFORT_COLORS[issue.effort]} />}
        </div>

        {issue.assignees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {issue.assignees.map((a) => (
              <div key={a.login} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={a.avatarUrl} alt={a.login} style={{ width: 22, height: 22, borderRadius: '50%' }} />
                <span style={{ fontSize: '13px', color: '#374151' }}>@{a.login}</span>
              </div>
            ))}
          </div>
        )}

        {issue.body && (
          <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: '0 0 20px' }}>
            {issue.body}
          </p>
        )}

        <a
          href={issue.url}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
        >
          Open on GitHub →
        </a>
      </div>
    </div>
  );
}
