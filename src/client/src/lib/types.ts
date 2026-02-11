// Skill MarketPlace — Shared TypeScript interfaces
// Matches backend API response shapes

export interface Skill {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  source: { id: number; name: string; avatar?: string };
  github_url: string;
  tags: string[];
  last_updated_at: string;
  created_at: string;
  language: string;
  license: string;
  version: string;
  downloads: number;
  skill_md_preview: string;
  platforms?: string[];
  // Detail fields (only on GET /skills/:id)
  skill_md_content?: string;
  files?: SkillFile[];
  star_history?: StarHistoryPoint[];
  related_skills?: RelatedSkillBrief[];
  versions?: SkillVersionEntry[];
}

export interface SkillFile {
  file_path: string;
  file_type: string | null;
  file_size: number;
}

export interface StarHistoryPoint {
  date: string;
  stars: number;
}

export interface RelatedSkillBrief {
  id: number;
  name: string;
  stars: number;
  tags: string[];
}

export interface SkillVersionEntry {
  id: number;
  version: string;
  changelog: string | null;
  created_at: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  type: "github_repo" | "awesome_list";
  status: "active" | "syncing" | "error" | "pending";
  skills_count: number;
  stars: number;
  last_synced_at: string;
  branch: string;
  skills_path: string;
  error_message?: string;
}

export interface SyncLog {
  id: number;
  source_id: number;
  source_name: string;
  status: "success" | "failed" | "running";
  skills_added: number;
  skills_updated: number;
  skills_removed: number;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  error_message?: string;
}
