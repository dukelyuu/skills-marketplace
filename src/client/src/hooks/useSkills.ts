/*
 * useSkills — Skill data query hook (FE-004)
 * Supports mock/API dual mode via lib/api.ts
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { getSkills, getSkillById, getTopSkills, type SkillQueryParams, type PaginatedResponse } from "@/lib/api";
import type { Skill } from "@/lib/types";

export function useSkills(params: SkillQueryParams) {
  const [data, setData] = useState<PaginatedResponse<Skill> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSkills = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const response = await getSkills(params);
      setData(response);
      setError(null);
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchSkills();
    return () => abortRef.current?.abort();
  }, [fetchSkills]);

  return { data, loading, error, refetch: fetchSkills };
}

export function useSkillDetail(id: number | null) {
  const [skill, setSkill] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id === null) { setLoading(false); return; }
    setLoading(true);
    getSkillById(id)
      .then((s) => { setSkill(s); setError(null); })
      .catch((err) => setError(err as Error))
      .finally(() => setLoading(false));
  }, [id]);

  return { skill, loading, error };
}

export function useTopSkills(tag?: string) {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopSkills(tag)
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tag]);

  return { skills, loading };
}
