/*
 * useDashboard — Dashboard data query hook (FE-006)
 */
import { useState, useEffect, useCallback } from "react";
import { getDashboardStats } from "@/lib/api";

export function useDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
