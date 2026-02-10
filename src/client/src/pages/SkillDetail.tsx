/*
 * SkillDetail — Obsidian Forge Design
 * Full SKILL.md rendering, metadata panel, star history chart, related skills
 * Now integrated with backend API via useSkillDetail hook
 */
import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Star, GitFork, Download, ExternalLink, Zap, Clock, Code2, TrendingUp, Archive, FileText, FolderOpen, Tag, History, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSkillDetail } from "@/hooks/useSkills";
import { formatNumber, getTagColor, LANG_COLORS } from "@/lib/constants";
import PlatformBadges from "@/components/PlatformBadges";
import { DetailSkeleton } from "@/components/skeletons";
import { motion } from "framer-motion";
import { Streamdown } from "streamdown";
import JSZip from "jszip";
import type { SkillFile as SkillFileType, SkillVersionEntry } from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useCallback, useState } from "react";

// ─── Generate fake star history data (fallback for mock mode) ───
function generateStarHistory(skill: { stars: number; created_at: string }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const start = new Date(skill.created_at);
  const now = new Date();
  const data: { month: string; stars: number }[] = [];
  const totalMonths = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth());
  for (let i = 0; i <= totalMonths; i++) {
    const progress = i / totalMonths;
    const stars = Math.round(skill.stars * (1 - Math.pow(1 - progress, 2.2)));
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    data.push({ month: `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`, stars });
  }
  return data;
}

// ─── Star History Chart ───
function StarHistoryChart({ skill }: { skill: any }) {
  const { t } = useTranslation();
  const data = useMemo(() => {
    // Use backend star_history if available, otherwise generate fake data
    if (skill.star_history && skill.star_history.length > 0) {
      return skill.star_history.map((h: any) => ({
        month: new Date(h.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        stars: h.stars,
      }));
    }
    return generateStarHistory(skill);
  }, [skill]);

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('detail.starHistory')}</h3>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.585 0.233 277)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="oklch(0.585 0.233 277)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.6 0.015 285)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.015 285)" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip
            contentStyle={{
              background: "oklch(0.17 0.005 285)",
              border: "1px solid oklch(1 0 0 / 12%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "oklch(0.93 0.005 285)" }}
            itemStyle={{ color: "oklch(0.75 0.15 195)" }}
          />
          <Area type="monotone" dataKey="stars" stroke="oklch(0.585 0.233 277)" fill="url(#starGrad)" strokeWidth={2} name="Stars" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Related Skills ───
function RelatedSkills({ relatedSkills }: { relatedSkills?: any[] }) {
  const { t } = useTranslation();
  if (!relatedSkills || relatedSkills.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('detail.relatedSkills')}</h3>
      <div className="space-y-2">
        {relatedSkills.slice(0, 4).map((s: any) => (
          <Link key={s.id} href={`/skills/${s.id}`}>
            <div className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-[oklch(0.75_0.15_195)]/15 flex items-center justify-center shrink-0 border border-border/30">
                <span className="text-[10px] font-bold text-primary">{s.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors font-mono">{s.name}</p>
                <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400/60" />
                  {formatNumber(s.stars)}
                  {s.overlap != null && (
                    <>
                      <span className="mx-0.5">·</span>
                      {s.overlap} shared tag{s.overlap > 1 ? "s" : ""}
                    </>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Version History (FE-105) ───
function VersionHistory({ versions }: { versions?: SkillVersionEntry[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  if (!versions || versions.length === 0) return null;
  const displayed = expanded ? versions : versions.slice(0, 3);

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('detail.versionHistory')}</h3>
      </div>
      <div className="space-y-2">
        {displayed.map((v, i) => (
          <div key={v.id} className="flex items-start gap-3 relative">
            {/* Timeline line */}
            {i < displayed.length - 1 && (
              <div className="absolute left-[7px] top-5 w-px h-[calc(100%+4px)] bg-border/40" />
            )}
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2 ${
              i === 0 ? "border-primary bg-primary/20" : "border-border/60 bg-card"
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">v{v.version}</span>
                {i === 0 && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-3.5 border-primary/30 text-primary">
                    {t('detail.latest')}
                  </Badge>
                )}
              </div>
              {v.changelog && (
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-1">{v.changelog}</p>
              )}
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                {new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        ))}
      </div>
      {versions.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[11px] text-primary/70 hover:text-primary transition-colors"
        >
          {expanded ? t('common.showLess') : t('detail.showAllVersions', { count: versions.length })}
        </button>
      )}
    </div>
  );
}

// ─── File Tree (FE-106) ───
function FileTree({ files }: { files?: SkillFileType[] }) {
  const { t } = useTranslation();
  if (!files || files.length === 0) return null;

  // Build tree structure from flat file paths
  interface TreeNode {
    name: string;
    path: string;
    isDir: boolean;
    size: number;
    type: string | null;
    children: TreeNode[];
  }

  const tree = useMemo(() => {
    const root: TreeNode[] = [];
    const dirMap = new Map<string, TreeNode>();

    for (const f of files) {
      const parts = f.file_path.split("/");
      let currentLevel = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const fullPath = parts.slice(0, i + 1).join("/");
        const isFile = i === parts.length - 1;

        let existing = currentLevel.find((n) => n.name === part);
        if (!existing) {
          existing = {
            name: part,
            path: fullPath,
            isDir: !isFile,
            size: isFile ? f.file_size : 0,
            type: isFile ? f.file_type : null,
            children: [],
          };
          currentLevel.push(existing);
          if (!isFile) dirMap.set(fullPath, existing);
        }
        currentLevel = existing.children;
      }
    }

    // Sort: dirs first, then files alphabetically
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      nodes.forEach((n) => sortNodes(n.children));
    };
    sortNodes(root);
    return root;
  }, [files]);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderNode(node: TreeNode, depth: number = 0) {
    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-2 py-1 px-2 -mx-2 rounded-md hover:bg-accent/20 transition-colors"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.isDir ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          )}
          <span className={`text-xs font-mono truncate ${node.isDir ? "text-foreground/80" : "text-muted-foreground"}`}>
            {node.name}
          </span>
          {!node.isDir && (
            <span className="text-[10px] text-muted-foreground/40 ml-auto shrink-0">
              {formatSize(node.size)}
            </span>
          )}
        </div>
        {node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('detail.files')}</h3>
        <span className="text-[10px] text-muted-foreground/50 ml-auto">{files.length} files</span>
      </div>
      <div className="space-y-0">
        {tree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}

export default function SkillDetail() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { skill, loading } = useSkillDetail(params.id ? Number(params.id) : null);

  const SKILL_MD_CONTENT = useMemo(() => {
    if (!skill) return "";
    // Use backend skill_md_content if available, otherwise generate
    if (skill.skill_md_content) return skill.skill_md_content;
    return `# ${skill.name}

${skill.description}

## Installation

\`\`\`bash
pip install ${skill.name}
\`\`\`

## Quick Start

\`\`\`python
from skills import ${skill.name.replace(/-/g, '_')}

# Initialize the skill
skill = ${skill.name.replace(/-/g, '_')}.init()

# Run the skill
result = skill.run(input_data)
print(result)
\`\`\`

## Features

- **High Performance**: Optimized for speed and reliability
- **Easy Integration**: Simple API that works with any agent framework
- **Extensible**: Plugin architecture for custom extensions
- **Well Documented**: Comprehensive documentation and examples

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`timeout\` | int | 30 | Request timeout in seconds |
| \`retries\` | int | 3 | Number of retry attempts |
| \`verbose\` | bool | false | Enable verbose logging |

## License

${skill.license}
`;
  }, [skill]);

  // Compute related skills: use backend data or generate from tags
  const relatedSkills = useMemo(() => {
    if (!skill) return [];
    if (skill.related_skills && skill.related_skills.length > 0) return skill.related_skills;
    return [];
  }, [skill]);

  const handleDownloadZip = useCallback(async () => {
    if (!skill) return;
    const zip = new JSZip();
    const folder = zip.folder(skill.name)!;
    folder.file("SKILL.md", SKILL_MD_CONTENT);
    folder.file("skill.json", JSON.stringify({
      name: skill.name,
      version: skill.version,
      description: skill.description,
      author: skill.source?.name,
      license: skill.license,
      language: skill.language,
      tags: skill.tags,
      github_url: skill.github_url,
    }, null, 2));
    folder.file("README.md", `# ${skill.name}\n\n${skill.description}\n\n> Generated from SkillHub\n`);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.name}-v${skill.version}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [skill, SKILL_MD_CONTENT]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-lg font-semibold mb-2">{t('detail.notFound')}</h2>
        <Link href="/marketplace">
          <Button variant="outline" size="sm" className="bg-transparent border-border/60 gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('detail.backToMarketplace')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-auto"
    >
      <div className="px-6 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/marketplace" className="hover:text-foreground transition-colors">{t('nav.marketplace')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{skill.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.75_0.15_195)]/20 flex items-center justify-center shrink-0 border border-border/40">
                <span className="text-xl font-bold text-primary">{skill.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight font-mono">{skill.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="outline" className="text-xs border-border/40">v{skill.version}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${LANG_COLORS[skill.language] || "bg-zinc-500"}`} />
                    {skill.language}
                  </span>
                  <span className="text-xs text-muted-foreground">{skill.source?.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.license}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-8">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                <Zap className="w-4 h-4" /> {t('detail.importToAgent')}
              </Button>
              <Link href={`/editor/${skill.id}`}>
                <Button variant="outline" className="bg-transparent border-border/60 gap-1.5">
                  <Code2 className="w-4 h-4" /> {t('detail.editSkill')}
                </Button>
              </Link>
              <Button variant="outline" className="bg-transparent border-border/60 gap-1.5" onClick={() => window.open(skill.github_url, '_blank')}>
                <ExternalLink className="w-4 h-4" /> {t('detail.viewOnGithub')}
              </Button>
              <Button variant="outline" className="bg-transparent border-border/60 gap-1.5" onClick={handleDownloadZip}>
                <Archive className="w-4 h-4" /> {t('detail.downloadZip')}
              </Button>
            </div>

            {/* SKILL.md content */}
            <div className="rounded-xl border border-border/50 bg-card/60 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">SKILL.md</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-code:text-primary prose-pre:bg-[oklch(0.11_0.005_285)] prose-pre:border prose-pre:border-border/40 prose-td:text-muted-foreground prose-th:text-foreground">
                <Streamdown>{SKILL_MD_CONTENT}</Streamdown>
              </div>
            </div>
          </div>

          {/* Right: Metadata panel */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Stats */}
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('detail.statistics')}</h3>
                <div className="space-y-3">
                  {[
                    { icon: Star, label: t('detail.stars'), value: formatNumber(skill.stars), color: "text-amber-400" },
                    { icon: GitFork, label: t('detail.forks'), value: formatNumber(skill.forks), color: "text-muted-foreground" },
                    { icon: Download, label: t('detail.downloads'), value: formatNumber(skill.downloads), color: "text-emerald-400" },
                    { icon: Clock, label: t('detail.updated'), value: new Date(skill.last_updated_at).toLocaleDateString(), color: "text-muted-foreground" },
                    { icon: Clock, label: t('detail.created'), value: new Date(skill.created_at).toLocaleDateString(), color: "text-muted-foreground" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                        {stat.label}
                      </span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('detail.tags')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((tag: string) => {
                    const color = getTagColor(tag);
                    return (
                      <Link key={tag} href={`/marketplace?tag=${tag}`}>
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${color.bg} ${color.text} ${color.border}`}>
                          {tag}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Supported Platforms */}
              {skill.platforms && skill.platforms.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('detail.supportedPlatforms')}</h3>
                  </div>
                  <PlatformBadges platforms={skill.platforms} max={12} size="md" />
                </div>
              )}

              {/* Star History Chart */}
              <StarHistoryChart skill={skill} />

              {/* Version History (FE-105) */}
              <VersionHistory versions={skill.versions} />

              {/* File Tree (FE-106) */}
              <FileTree files={skill.files} />

              {/* Related Skills */}
              <RelatedSkills relatedSkills={relatedSkills} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
