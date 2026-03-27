import { useState, useCallback } from 'react';
import axios from 'axios';

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [openRes, doneRes] = await Promise.allSettled([
        axios.get('/api/issues'),
        axios.get('/api/issues/done'),
      ]);
      if (openRes.status === 'rejected') throw openRes.reason;
      const open = openRes.value.data;
      const done = doneRes.status === 'fulfilled' ? doneRes.value.data : [];
      setIssues([...open, ...done]);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssue = useCallback(async (number, patch) => {
    // Optimistic update — compute likely new status
    const optimisticPatch = { ...patch };
    if (patch.state === 'closed') {
      optimisticPatch.status = 'done';
    } else if (patch.state === 'open') {
      optimisticPatch.status = patch.labels?.includes('status:in-progress') ? 'in-progress' : 'proposed';
    }

    setIssues((prev) =>
      prev.map((i) => (i.number === number ? { ...i, ...optimisticPatch } : i))
    );
    try {
      const { data } = await axios.patch(`/api/issues/${number}`, patch);
      setIssues((prev) => prev.map((i) => (i.number === number ? data : i)));
    } catch (err) {
      refresh();
      throw err;
    }
  }, [refresh]);

  return { issues, loading, error, lastUpdated, refresh, updateIssue };
}
