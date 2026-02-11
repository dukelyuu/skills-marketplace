/*
 * API Client — Skill MarketPlace (FE-002)
 * Axios instance with interceptors — real API only
 */
import axios from "axios";
import type { Skill, Source, SyncLog, SkillFile, SkillVersionEntry } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || "An error occurred";
    console.error("[API Error]", message);
    return Promise.reject(error);
  }
);

// ─── Paginated response type ───
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

// ─── Skills API ───
export interface SkillQueryParams {
  search?: string;
  tags?: string[];
  sourceId?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function getSkills(params: SkillQueryParams): Promise<PaginatedResponse<Skill>> {
  const res: any = await api.get("/skills", { params: {
    search: params.search,
    tags: params.tags?.join(","),
    source_id: params.sourceId,
    sort: params.sort || "-stars",
    page: params.page || 1,
    page_size: params.pageSize || 20,
  }});
  return {
    total: res?.total ?? 0,
    page: res?.page ?? 1,
    page_size: res?.page_size ?? 20,
    items: Array.isArray(res?.items) ? res.items : [],
  };
}

export async function getSkillById(id: number): Promise<Skill | null> {
  return api.get(`/skills/${id}`) as any;
}

export async function getTopSkills(tag?: string): Promise<any[]> {
  const res: any = await api.get("/skills/top", { params: tag ? { tag } : {} });
  return Array.isArray(res) ? res : [];
}

export async function createSkill(data: {
  name: string; description?: string; skill_md_content?: string;
  tags?: string[]; language?: string; version?: string; platforms?: string[];
}): Promise<Skill> {
  return api.post("/skills", data) as any;
}

export async function updateSkill(id: number, data: {
  description?: string; skill_md_content?: string;
  tags?: string[]; version?: string; platforms?: string[];
}): Promise<Skill> {
  return api.put(`/skills/${id}`, data) as any;
}

export async function deleteSkill(id: number): Promise<void> {
  await api.delete(`/skills/${id}`);
}

// ─── Sources API ───
export async function getSources(): Promise<Source[]> {
  const res: any = await api.get("/sources");
  const data = res?.items || res;
  return Array.isArray(data) ? data : [];
}

export async function createSource(data: {
  url: string; branch?: string; skills_path?: string; name?: string;
}): Promise<Source> {
  return api.post("/sources", data) as any;
}

export async function updateSource(id: number, data: {
  branch?: string; skills_path?: string; name?: string;
}): Promise<Source> {
  return api.put(`/sources/${id}`, data) as any;
}

export async function deleteSource(id: number): Promise<void> {
  await api.delete(`/sources/${id}`);
}

export async function triggerSync(sourceId: number): Promise<{ sync_log_id: number; status: string; message: string }> {
  return api.post(`/sources/${sourceId}/sync`) as any;
}

export async function getSyncLogs(sourceId?: number): Promise<SyncLog[]> {
  const url = sourceId ? `/sources/${sourceId}/logs` : `/sources/logs`;
  const res: any = await api.get(url);
  const data = res?.items || res;
  return Array.isArray(data) ? data : [];
}

// ─── Tags API ───
export async function getTags(): Promise<string[]> {
  const res: any = await api.get("/tags");
  return Array.isArray(res) ? res : [];
}

// ─── Skill Versions API ───
export async function getSkillVersions(skillId: number): Promise<SkillVersionEntry[]> {
  return api.get(`/skills/${skillId}/versions`) as any;
}

// ─── Skill Files API ───
export async function getSkillFiles(skillId: number): Promise<SkillFile[]> {
  return api.get(`/skills/${skillId}/files`) as any;
}

// ─── Source Sync Status API ───
export async function getSyncStatus(sourceId: number): Promise<{
  source_id: number;
  status: string;
  skills_count: number;
  last_synced_at: string | null;
  error_message: string | null;
  latest_log: any | null;
}> {
  return api.get(`/sources/${sourceId}/sync/status`) as any;
}

// ─── Dashboard API ───
export async function getDashboardStats() {
  return api.get("/system/status") as any;
}

// ─── Discovery API ───
export async function discoverSearch(params: {
  query?: string; min_stars?: number; max_results?: number;
}): Promise<any> {
  return api.post("/discovery/search", params) as any;
}

export async function discoverAwesome(url: string): Promise<any> {
  return api.post("/discovery/awesome", { url }) as any;
}

export async function runFullDiscovery(min_stars: number = 1000): Promise<any> {
  return api.post("/discovery/run", { min_stars }) as any;
}

export async function getDiscoveryPresets(): Promise<{
  search_queries: string[]; awesome_lists: string[];
}> {
  return api.get("/discovery/presets") as any;
}

export default api;
