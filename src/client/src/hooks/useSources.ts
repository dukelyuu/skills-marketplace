/*
 * useSources — Source data query hook (FE-005)
 * Now supports CRUD operations via backend API + sync status polling (FE-207)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { getSources, getSyncLogs, createSource, updateSource, deleteSource, triggerSync, getSyncStatus } from "@/lib/api";
import type { Source, SyncLog } from "@/lib/types";

export function useSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncingIdsRef = useRef<Set<number>>(new Set());

  const fetchSources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSources();
      setSources(Array.isArray(data) ? data : []);
      // Track syncing sources for polling
      const syncingIds = new Set(data.filter(s => s.status === "syncing").map(s => s.id));
      syncingIdsRef.current = syncingIds;
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll syncing sources every 3 seconds
  useEffect(() => {
    const poll = async () => {
      const ids = syncingIdsRef.current;
      if (ids.size === 0) return;

      const idsArray = Array.from(ids);
      for (const id of idsArray) {
        try {
          const status = await getSyncStatus(id);
          if (status.status !== "syncing") {
            // Source finished syncing — update local state
            setSources(prev => prev.map(s =>
              s.id === id ? {
                ...s,
                status: status.status as Source["status"],
                skills_count: status.skills_count,
                last_synced_at: status.last_synced_at || s.last_synced_at,
                error_message: status.error_message || undefined,
              } : s
            ));
            ids.delete(id);
          }
        } catch {
          // ignore polling errors
        }
      }
    };

    pollingRef.current = setInterval(poll, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => { fetchSources(); }, [fetchSources]);

  const addSource = useCallback(async (data: { url: string; branch?: string; skills_path?: string; name?: string }) => {
    const newSource = await createSource(data);
    setSources((prev) => [newSource, ...prev]);
    return newSource;
  }, []);

  const editSource = useCallback(async (id: number, data: { branch?: string; skills_path?: string; name?: string }) => {
    const updated = await updateSource(id, data);
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    return updated;
  }, []);

  const removeSource = useCallback(async (id: number) => {
    await deleteSource(id);
    setSources((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const syncSource = useCallback(async (id: number) => {
    const result = await triggerSync(id);
    // Mark source as syncing in local state and start polling
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, status: "syncing" as const } : s)));
    syncingIdsRef.current.add(id);
    return result;
  }, []);

  return { sources, loading, error, refetch: fetchSources, addSource, editSource, removeSource, syncSource };
}

export function useSyncLogs(sourceId?: number) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSyncLogs(sourceId);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sourceId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}
