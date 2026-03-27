import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useIssues } from './hooks/useIssues';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import WeeklyGoal from './components/WeeklyGoal';
import Column from './components/Column';
import ModeToggle from './components/ModeToggle';
import Particles from './components/Particles';
import { dark } from './theme';

const PRIORITY_ORDER = { now: 0, later: 1, null: 2 };
const EFFORT_ORDER = { large: 0, medium: 1, small: 2, null: 3 };

function applySort(issues, sort) {
  return [...issues].sort((a, b) => {
    if (sort === 'priority') return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2);
    if (sort === 'effort') return (EFFORT_ORDER[a.effort] ?? 3) - (EFFORT_ORDER[b.effort] ?? 3);
    if (sort === 'number-desc') return b.number - a.number;
    if (sort === 'number-asc') return a.number - b.number;
    return 0;
  });
}

export default function App() {
  const { issues, loading, error, lastUpdated, refresh, updateIssue } = useIssues();
  const [teamFilter, setTeamFilter] = useState('all');
  const [filters, setFilters] = useState({ priority: 'all', effort: 'all', assignee: 'all' });
  const [sort, setSort] = useState('priority');
  const [members, setMembers] = useState([]);
  const [funMode, setFunMode] = useState(false);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    axios.get('/api/members')
      .then(({ data }) => setMembers(data.map((m) => m.login).sort()))
      .catch(() => {});
  }, []);

  function handleFilterChange(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const assignees = useMemo(() => {
    const logins = new Set(members);
    issues.forEach((i) => i.assignees.forEach((a) => logins.add(a.login)));
    return [...logins].sort();
  }, [issues, members]);

  const weeklyGoal = issues.find((i) => i.isWeeklyGoal);

  const boardIssues = useMemo(() => {
    let result = issues.filter((i) => !i.isWeeklyGoal);
    if (teamFilter !== 'all') result = result.filter((i) => i.team === teamFilter);
    if (filters.priority !== 'all') result = result.filter((i) => i.priority === filters.priority);
    if (filters.effort !== 'all') result = result.filter((i) => i.effort === filters.effort);
    if (filters.assignee !== 'all') result = result.filter((i) => i.assignees.some((a) => a.login === filters.assignee));
    return applySort(result, sort);
  }, [issues, teamFilter, filters, sort]);

  const proposed = boardIssues.filter((i) => i.status === 'proposed');
  const inProgress = boardIssues.filter((i) => i.status === 'in-progress');
  const done = boardIssues.filter((i) => i.status === 'done');

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: funMode ? '"Nunito", sans-serif' : '"Inter", sans-serif',
      background: funMode ? 'transparent' : dark.bg,
      transition: 'background 0.6s ease',
    }}>
      {funMode && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #a855f7, #f59e0b)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          zIndex: 0,
        }} />
      )}

      {funMode && <Particles />}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header
          teamFilter={teamFilter}
          onTeamChange={setTeamFilter}
          onRefresh={refresh}
          loading={loading}
          lastUpdated={lastUpdated}
          funMode={funMode}
          extra={<ModeToggle funMode={funMode} onToggle={() => setFunMode((f) => !f)} />}
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          sort={sort}
          onSortChange={setSort}
          assignees={assignees}
          funMode={funMode}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <WeeklyGoal issue={weeklyGoal} funMode={funMode} />

          {error && (
            <div style={{
              background: funMode ? 'rgba(255,255,255,0.9)' : '#2d1515',
              border: `1px solid ${funMode ? '#fca5a5' : '#7f1d1d'}`,
              borderRadius: funMode ? '16px' : '8px',
              padding: '12px 16px', marginBottom: '20px',
              color: funMode ? '#b91c1c' : '#fca5a5',
              fontSize: '13px',
            }}>
              {funMode ? '😬 ' : ''}{error}
            </div>
          )}

          {loading && issues.length === 0 ? (
            <div style={{ textAlign: 'center', color: funMode ? 'rgba(255,255,255,0.8)' : dark.textMuted, fontSize: funMode ? '20px' : '14px', marginTop: '60px', fontWeight: funMode ? 900 : 400 }}>
              {funMode ? '✨🚀 Loading your epic tasks... 🚀✨' : 'Loading…'}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', height: 'calc(100vh - 210px)' }}>
              <Column status="proposed" issues={proposed} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
              <Column status="in-progress" issues={inProgress} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
              <Column status="done" issues={done} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rainbow { 0% { color: #f87171; } 16% { color: #fb923c; } 33% { color: #facc15; } 50% { color: #4ade80; } 66% { color: #60a5fa; } 83% { color: #c084fc; } 100% { color: #f87171; } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
        @keyframes popIn { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        .fun-card:hover { cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 100 100' style='font-size:24px'><text y='50%'>✨</text></svg>") 16 16, pointer !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${funMode ? 'rgba(255,255,255,0.1)' : dark.surface}; }
        ::-webkit-scrollbar-thumb { background: ${funMode ? 'rgba(255,255,255,0.3)' : dark.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${funMode ? 'rgba(255,255,255,0.5)' : dark.accent}; }
      `}</style>
    </div>
  );
}
