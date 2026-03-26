import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useIssues } from './hooks/useIssues';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import WeeklyGoal from './components/WeeklyGoal';
import Column from './components/Column';

const PRIORITY_ORDER = { now: 0, later: 1, null: 2 };
const EFFORT_ORDER = { large: 0, medium: 1, small: 2, null: 3 };

function applySort(issues, sort) {
  return [...issues].sort((a, b) => {
    if (sort === 'priority') {
      return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2);
    }
    if (sort === 'effort') {
      return (EFFORT_ORDER[a.effort] ?? 3) - (EFFORT_ORDER[b.effort] ?? 3);
    }
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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Header
        teamFilter={teamFilter}
        onTeamChange={setTeamFilter}
        onRefresh={refresh}
        loading={loading}
        lastUpdated={lastUpdated}
      />
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={setSort}
        assignees={assignees}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <WeeklyGoal issue={weeklyGoal} />

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {loading && issues.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '60px' }}>
            Loading…
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', height: 'calc(100vh - 210px)' }}>
            <Column status="proposed" issues={proposed} onUpdate={updateIssue} availableAssignees={assignees} />
            <Column status="in-progress" issues={inProgress} onUpdate={updateIssue} availableAssignees={assignees} />
            <Column status="done" issues={[]} onUpdate={updateIssue} availableAssignees={assignees} />
          </div>
        )}
      </div>
    </div>
  );
}
