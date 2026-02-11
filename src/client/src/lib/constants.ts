// Skill MarketPlace — Shared Constants
// Extracted from Marketplace.tsx for reuse across pages

export const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "web-scraping": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  "data-analysis": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  "automation": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  "api-integration": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  "file-management": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  "code-generation": { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  "nlp": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  "image-processing": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
  "database": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  "testing": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  "deployment": { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  "monitoring": { bg: "bg-lime-500/10", text: "text-lime-400", border: "border-lime-500/20" },
  "security": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  "documentation": { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  "communication": { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  "search": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "ml-ops": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  "devops": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  "cloud": { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  "blockchain": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
};
// ─── IDE / Agent Platforms ───
export const IDE_PLATFORMS = [
  { id: "claude-code", name: "Claude Code", short: "CC", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "kiro", name: "Kiro", short: "Ki", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: "cursor", name: "Cursor", short: "Cu", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "windsurf", name: "Windsurf", short: "Ws", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { id: "github-copilot", name: "GitHub Copilot", short: "GC", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { id: "cline", name: "Cline", short: "Cl", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "antigravity", name: "Antigravity", short: "AG", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { id: "opencraw", name: "OpenCraw", short: "OC", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { id: "codebuddy", name: "CodeBuddy", short: "CB", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { id: "augment", name: "Augment", short: "Au", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "roo-code", name: "Roo Code", short: "Ro", color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/20" },
  { id: "trae", name: "Trae", short: "Tr", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
] as const;

export function getPlatformInfo(platformId: string) {
  return IDE_PLATFORMS.find((p) => p.id === platformId) || { id: platformId, name: platformId, short: platformId.slice(0, 2).toUpperCase(), color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
}

const DEFAULT_TAG_COLOR = { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" };

export function getTagColor(tag: string) {
  return TAG_COLORS[tag] || DEFAULT_TAG_COLOR;
}

export const LANG_COLORS: Record<string, string> = {
  Python: "bg-[#3572A5]",
  TypeScript: "bg-[#3178C6]",
  Go: "bg-[#00ADD8]",
  JavaScript: "bg-[#F7DF1E]",
  Rust: "bg-[#DEA584]",
};

export type SortKey = "stars" | "forks" | "downloads" | "updated" | "name";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "stars", label: "Most Stars" },
  { key: "downloads", label: "Most Downloads" },
  { key: "forks", label: "Most Forks" },
  { key: "updated", label: "Recently Updated" },
  { key: "name", label: "Name A-Z" },
];

// ─── Default TAGS (fallback when API unavailable) ───
export const TAGS = [
  "web-scraping", "data-analysis", "automation", "api-integration",
  "file-management", "code-generation", "nlp", "image-processing",
  "database", "testing", "deployment", "monitoring",
  "security", "documentation", "communication", "search",
  "ml-ops", "devops", "cloud", "blockchain",
];

// ─── Helpers ───
export function formatNumber(n: number): string {
  if (n >= 10000) return (n / 1000).toFixed(0) + "k";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}
