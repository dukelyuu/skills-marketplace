/*
 * Dashboard — Obsidian Forge Design
 * 4 stat cards, SyncActivityChart, ApiQuotaChart, TopTagsChart, StarDistributionChart
 * Now integrated with backend API via useDashboard hook
 */
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Database, Download, Activity, Clock,
  TrendingUp, RefreshCw, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { formatNumber, timeAgo } from "@/lib/constants";
import { DashboardSkeleton } from "@/components/skeletons";

// ─── Chart colors ───
const CHART_COLORS = [
  "oklch(0.585 0.233 277)",
  "oklch(0.75 0.15 195)",
  "oklch(0.65 0.2 320)",
  "oklch(0.7 0.18 150)",
  "oklch(0.72 0.16 60)",
];

const STAR_COLORS = ["#6366f1", "#22d3ee", "#a78bfa", "#34d399", "#fbbf24"];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { stats, loading } = useDashboard();

  if (loading || !stats) {
    return <DashboardSkeleton />;
  }

  const quotaPercent = Math.round((stats.api_quota.used / stats.api_quota.limit) * 100);
  // Handle both backend field name (sync_history_7d) and mock field name (sync_history)
  const syncHistory = stats.sync_history_7d || stats.sync_history || [];

  const statCards = [
    { label: t('dashboard.totalSkills'), value: stats.total_skills, icon: Sparkles, color: "text-primary", delta: `+${stats.skills_added_today} ${t('common.today')}` },
    { label: t('dashboard.activeSources'), value: `${stats.active_sources}/${stats.total_sources}`, icon: Database, color: "text-[oklch(0.75_0.15_195)]", delta: `${stats.syncing_sources || 0} ${t('sources.syncing').toLowerCase()}` },
    { label: t('dashboard.totalDownloads'), value: formatNumber(stats.total_downloads), icon: Download, color: "text-emerald-400", delta: "+2.4k this week" },
    { label: t('dashboard.apiQuota'), value: `${quotaPercent}%`, icon: Activity, color: quotaPercent > 80 ? "text-amber-400" : "text-primary", delta: `${formatNumber(stats.api_quota.remaining)} ${t('common.remaining')}` },
  ];

  const pieData = [
    { name: "Used", value: stats.api_quota.used },
    { name: "Remaining", value: stats.api_quota.remaining },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-auto"
    >
      <div className="px-6 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{t('dashboard.title')}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {t('dashboard.lastSync', { time: timeAgo(stats.last_sync) })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-border/40 gap-1.5">
            <RefreshCw className="w-3 h-3" /> {t('dashboard.autoRefresh')}
          </Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                {card.delta}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1: Sync Activity + API Quota */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Sync Activity — AreaChart */}
          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t('dashboard.syncActivity')}</h3>
              <Badge variant="secondary" className="text-[10px]">{t('dashboard.last7days')}</Badge>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={syncHistory}>
                <defs>
                  <linearGradient id="gradAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUpdated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.6 0.015 285)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.6 0.015 285)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="added" name="Added" stroke={CHART_COLORS[0]} fill="url(#gradAdded)" strokeWidth={2} />
                <Area type="monotone" dataKey="updated" name="Updated" stroke={CHART_COLORS[1]} fill="url(#gradUpdated)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* API Quota — Donut PieChart */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t('dashboard.apiQuota')}</h3>
              <Badge variant="secondary" className="text-[10px]">{t('dashboard.githubApi')}</Badge>
            </div>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill={quotaPercent > 80 ? "#f59e0b" : CHART_COLORS[0]} />
                    <Cell fill="oklch(0.21 0.006 285)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="-mt-[120px] text-center mb-14">
                <p className="text-2xl font-bold">{quotaPercent}%</p>
                <p className="text-[11px] text-muted-foreground">{t('dashboard.used').toLowerCase()}</p>
              </div>
              <div className="w-full space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('dashboard.used')}</span>
                  <span className="font-medium text-foreground">{formatNumber(stats.api_quota.used)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('common.remaining')}</span>
                  <span className="font-medium text-foreground">{formatNumber(stats.api_quota.remaining)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('dashboard.resets')}</span>
                  <span className="font-medium text-foreground">{timeAgo(stats.api_quota.reset_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2: Top Tags + Star Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Tags — Horizontal BarChart */}
          <motion.div
            custom={6}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t('dashboard.topTags')}</h3>
              <span className="text-[11px] text-muted-foreground">{stats.top_tags.length} tags</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.top_tags} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.6 0.015 285)" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "oklch(0.6 0.015 285)" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Skills" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {stats.top_tags.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Star Distribution — PieChart donut */}
          <motion.div
            custom={7}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t('dashboard.starDistribution')}</h3>
              <span className="text-[11px] text-muted-foreground">{stats.total_skills} skills</span>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.star_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    strokeWidth={0}
                  >
                    {stats.star_distribution.map((_: any, i: number) => (
                      <Cell key={i} fill={STAR_COLORS[i % STAR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {stats.star_distribution.map((item: any, i: number) => (
                  <div key={item.range} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STAR_COLORS[i % STAR_COLORS.length] }} />
                    <span className="text-muted-foreground flex-1">{item.range}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
