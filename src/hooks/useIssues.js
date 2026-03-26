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
      const { data } = await axios.get('/api/issues');
      setIssues(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssue = useCallback(async (number, patch) => {
    // Optimistic update
    setIssues((prev) =>
      prev.map((i) => (i.number === number ? { ...i, ...patch } : i))
    );
    try {
      const { data } = await axios.patch(`/api/issues/${number}`, patch);
      // Replace with server response (authoritative shaped issue)
      setIssues((prev) => prev.map((i) => (i.number === number ? data : i)));
    } catch (err) {
      // Revert by refreshing on failure
      refresh();
      throw err;
    }
  }, [refresh]);

  return { issues, loading, error, lastUpdated, refresh, updateIssue };
}
