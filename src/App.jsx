import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useIssues } from './hooks/useIssues';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import WeeklyGoal from './components/WeeklyGoal';
import Column from './components/Column';
import ModeToggle from './components/ModeToggle';

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

  const normalBg = { background: '#f3f4f6', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' };
  const funBg = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    fontFamily: '"Nunito", sans-serif',
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.6s ease',
      ...(funMode ? funBg : normalBg),
    }}>
      {funMode && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -100, left: -100 }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -50, right: 100 }} />
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: '40%', left: '60%' }} />
        </div>
      )}

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
              background: funMode ? 'rgba(255,255,255,0.9)' : '#fef2f2',
              border: `${funMode ? '2px' : '1px'} solid #fca5a5`,
              borderRadius: funMode ? '16px' : '8px',
              padding: '12px 16px', marginBottom: '20px',
              color: '#b91c1c', fontSize: '13px', fontWeight: funMode ? 700 : 400,
            }}>
              {funMode ? '😬 ' : ''}{error}
            </div>
          )}

          {loading && issues.length === 0 ? (
            <div style={{ textAlign: 'center', color: funMode ? 'rgba(255,255,255,0.8)' : '#9ca3af', fontSize: '14px', marginTop: '60px', fontWeight: funMode ? 700 : 400 }}>
              {funMode ? '✨ Loading your tasks...' : 'Loading…'}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', height: 'calc(100vh - 210px)' }}>
              <Column status="proposed" issues={proposed} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
              <Column status="in-progress" issues={inProgress} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
              <Column status="done" issues={[]} onUpdate={updateIssue} availableAssignees={assignees} funMode={funMode} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
