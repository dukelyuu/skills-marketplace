/*
 * Sources Management — Obsidian Forge Design
 * Source table, add/edit dialogs, sync log timeline, status badges
 * Now integrated with backend API via useSources/useSyncLogs hooks
 */
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Plus, RefreshCw, Search, ExternalLink,
  GitBranch, FolderOpen, Clock, AlertCircle, CheckCircle2,
  Loader2, Pause, Trash2, Pencil, MoreHorizontal,
  Activity, ChevronDown, ChevronUp, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Source, type SyncLog } from "@/lib/types";
import { useSources, useSyncLogs } from "@/hooks/useSources";
import { formatNumber, timeAgo, formatDate, formatDuration } from "@/lib/constants";
import { TableSkeleton } from "@/components/skeletons";
import { toast } from "sonner";

// ─── Status config ───
const STATUS_CONFIG: Record<Source["status"], { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  active: { label: "Active", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  syncing: { label: "Syncing", icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  error: { label: "Error", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  pending: { label: "Pending", icon: Pause, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

const LOG_STATUS_CONFIG: Record<SyncLog["status"], { label: string; icon: typeof CheckCircle2; color: string }> = {
  success: { label: "Success", icon: CheckCircle2, color: "text-emerald-400" },
  failed: { label: "Failed", icon: AlertCircle, color: "text-red-400" },
  running: { label: "Running", icon: Loader2, color: "text-blue-400" },
};

function StatusBadge({ status }: { status: Source["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <Icon className={`w-3 h-3 ${status === "syncing" ? "animate-spin" : ""}`} />
      {cfg.label}
    </span>
  );
}

// ─── Add/Edit Source Dialog ───
function SourceDialog({
  open, onOpenChange, source, onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  source?: Source | null;
  onSubmit: (data: { url: string; branch?: string; skills_path?: string; name?: string }, isEdit: boolean, id?: number) => void;
}) {
  const isEdit = !!source;
  const { t } = useTranslation();
  const [name, setName] = useState(source?.name || "");
  const [url, setUrl] = useState(source?.url || "");
  const [type, setType] = useState<string>(source?.type || "github_repo");
  const [branch, setBranch] = useState(source?.branch || "main");
  const [skillsPath, setSkillsPath] = useState(source?.skills_path || "/skills");

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    onSubmit({ url, branch, skills_path: skillsPath, name }, isEdit, source?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[oklch(0.17_0.005_285)] border-border/60">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('sources.editSource') : t('sources.addNewSource')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('sources.editDesc') : t('sources.addDesc')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="source-name">{t('sources.name')}</Label>
            <Input id="source-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="owner/repo" className="bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-url">{t('sources.repoUrl')}</Label>
            <Input id="source-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/owner/repo" className="bg-background/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('sources.type')}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="github_repo">{t('sources.githubRepo')}</SelectItem>
                  <SelectItem value="awesome_list">{t('sources.awesomeList')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-branch">{t('sources.branch')}</Label>
              <Input id="source-branch" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="main" className="bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-path">{t('sources.skillsPath')}</Label>
            <Input id="source-path" value={skillsPath} onChange={(e) => setSkillsPath(e.target.value)} placeholder="/skills" className="bg-background/50" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-border/60">{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">{isEdit ? t('sources.saveChanges') : t('sources.addSource')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sync Log Timeline ───
function SyncLogTimeline({ logs }: { logs: SyncLog[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? logs : logs.slice(0, 4);

  return (
    <motion.div
      custom={2}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)]"
    >
      <div className="px-5 py-4 border-b border-[oklch(1_0_0/10%)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{t('sources.syncLogs')}</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">{logs.length} {t('common.entries')}</span>
      </div>
      <div className="divide-y divide-[oklch(1_0_0/6%)]">
        {displayed.map((log) => {
          const cfg = LOG_STATUS_CONFIG[log.status];
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-accent/20 transition-colors">
              <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                log.status === "success" ? "bg-emerald-500/10" : log.status === "failed" ? "bg-red-500/10" : "bg-blue-500/10"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color} ${log.status === "running" ? "animate-spin" : ""}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium truncate">{log.source_name}</span>
                  <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
                {log.status === "failed" && log.error_message && (
                  <p className="text-[11px] text-red-400/80 mb-1 truncate">{log.error_message}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{formatDate(log.started_at)}</span>
                  {log.duration_seconds > 0 && <span>{formatDuration(log.duration_seconds)}</span>}
                  {(log.skills_added > 0 || log.skills_updated > 0 || log.skills_removed > 0) && (
                    <span className="flex items-center gap-1.5">
                      {log.skills_added > 0 && <span className="text-emerald-400">+{log.skills_added}</span>}
                      {log.skills_updated > 0 && <span className="text-blue-400">~{log.skills_updated}</span>}
                      {log.skills_removed > 0 && <span className="text-red-400">-{log.skills_removed}</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {logs.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors flex items-center justify-center gap-1 border-t border-[oklch(1_0_0/6%)]"
        >
          {expanded ? <>{t('common.showLess')} <ChevronUp className="w-3 h-3" /></> : <>{t('sources.showAll', { count: logs.length })} <ChevronDown className="w-3 h-3" /></>}
        </button>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN: Sources Page
// ═══════════════════════════════════════════════════════════════
export default function Sources() {
  const { t } = useTranslation();
  const { sources, loading, addSource, editSource, removeSource, syncSource } = useSources();
  const { logs: syncLogs } = useSyncLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [deletingSource, setDeletingSource] = useState<Source | null>(null);

  const filteredSources = useMemo(() => {
    let result = [...sources];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q));
    }
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }
    return result;
  }, [sources, searchQuery, statusFilter]);

  const sortedLogs = useMemo(() =>
    [...syncLogs].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()),
  [syncLogs]);

  const handleSourceSubmit = async (data: { url: string; branch?: string; skills_path?: string; name?: string }, isEdit: boolean, id?: number) => {
    try {
      if (isEdit && id) {
        await editSource(id, data);
        toast.success(`Source "${data.name}" updated`);
      } else {
        await addSource(data);
        toast.success(`Source "${data.name}" added`);
      }
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingSource) return;
    try {
      await removeSource(deletingSource.id);
      toast.success(`Source "${deletingSource.name}" deleted`);
    } catch {
      toast.error("Delete failed");
    }
    setDeletingSource(null);
  };

  const handleSync = async (source: Source) => {
    try {
      await syncSource(source.id);
      toast.success(`Syncing ${source.name}...`);
    } catch {
      toast.error("Sync failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
      <div className="px-6 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{t('sources.title')}</h1>
              <p className="text-xs text-muted-foreground">{sources.length} {t('common.sources')} · {t('sources.skillsIndexed', { count: (sources || []).reduce((a, s) => a + (s.skills_count || 0), 0) })}</p>
            </div>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 gap-1.5">
            <Plus className="w-4 h-4" /> {t('sources.addSource')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('sources.searchPlaceholder')}
              className="w-full h-9 pl-10 pr-4 rounded-lg bg-card/60 border border-border/50 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-card/60 border-border/50 h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('sources.allStatus')}</SelectItem>
              <SelectItem value="active">{t('sources.active')}</SelectItem>
              <SelectItem value="syncing">{t('sources.syncing')}</SelectItem>
              <SelectItem value="error">{t('sources.error')}</SelectItem>
              <SelectItem value="pending">{t('sources.pending')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Table */}
        {loading ? (
          <div className="mb-6"><TableSkeleton rows={4} cols={5} /></div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] overflow-hidden mb-6"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_100px_80px_80px_120px_44px] gap-4 px-5 py-3 text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider border-b border-[oklch(1_0_0/10%)] bg-[oklch(0.19_0.005_285)]">
            <span>{t('sources.source')}</span>
            <span>{t('sources.status')}</span>
            <span className="text-right">{t('sources.skills')}</span>
            <span className="text-right">{t('sources.stars')}</span>
            <span className="text-right">{t('sources.lastSynced')}</span>
            <span />
          </div>

          {/* Table rows */}
          <div className="divide-y divide-[oklch(1_0_0/6%)]">
            {filteredSources.map((source, i) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="grid grid-cols-[1fr_100px_80px_80px_120px_44px] gap-4 px-5 py-3.5 items-center hover:bg-accent/20 transition-colors group"
              >
                {/* Source info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate font-mono">{source.name}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border/40 shrink-0">
                      {source.type === "github_repo" ? "Repo" : "Awesome"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 truncate">
                      <GitBranch className="w-3 h-3" />{source.branch}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <FolderOpen className="w-3 h-3" />{source.skills_path}
                    </span>
                  </div>
                  {source.error_message && (
                    <p className="text-[10px] text-red-400/80 mt-1 truncate">{source.error_message}</p>
                  )}
                </div>

                <div><StatusBadge status={source.status} /></div>
                <div className="text-right text-sm font-medium">{source.skills_count}</div>
                <div className="text-right text-sm text-muted-foreground">{formatNumber(source.stars)}</div>
                <div className="text-right text-xs text-muted-foreground">
                  {source.last_synced_at ? timeAgo(source.last_synced_at) : t('common.never')}
                </div>

                {/* Actions */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleSync(source)}>
                        <RefreshCw className="w-3.5 h-3.5 mr-2" /> {t('sources.syncNow')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingSource(source)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" /> {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(source.url, "_blank")}>
                        <ExternalLink className="w-3.5 h-3.5 mr-2" /> {t('sources.openInGithub')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDeletingSource(source)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              {t('sources.noSources')}
            </div>
          )}
        </motion.div>
        )}

        {/* Sync Logs */}
        <SyncLogTimeline logs={sortedLogs} />
      </div>

      {/* Dialogs */}
      <SourceDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleSourceSubmit} />
      <SourceDialog open={!!editingSource} onOpenChange={(v) => !v && setEditingSource(null)} source={editingSource} onSubmit={handleSourceSubmit} />

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingSource} onOpenChange={(v) => !v && setDeletingSource(null)}>
        <AlertDialogContent className="bg-[oklch(0.17_0.005_285)] border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sources.deleteSource')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sources.deleteConfirm', { name: deletingSource?.name, count: deletingSource?.skills_count })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border/60">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
