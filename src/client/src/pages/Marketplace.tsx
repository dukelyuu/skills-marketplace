/*
 * Marketplace Page — Obsidian Forge Design
 * Now integrated with backend API
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, ArrowUpDown, LayoutGrid, List,
  X, Tag, Sparkles, ChevronDown, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillCard, SkillListItem, RankingSidebar, FilterDropdown, DiscoveryPanel } from "@/components/marketplace";
import { SkillCardSkeletonGrid } from "@/components/skeletons";
import { useSkills, useTopSkills } from "@/hooks/useSkills";
import { useSources } from "@/hooks/useSources";
import { useTags } from "@/hooks/useTags";
import { getTagColor, SORT_OPTIONS, type SortKey } from "@/lib/constants";

const SORT_MAP: Record<SortKey, string> = {
  stars: "-stars",
  downloads: "-downloads",
  forks: "-forks",
  updated: "-updated_at",
  name: "name",
};

export default function Marketplace() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("stars");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllTags, setShowAllTags] = useState(false);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch, selectedTags, selectedSource, sortKey]);

  const { sources } = useSources();
  const { skills: topSkills } = useTopSkills();
  const { tags } = useTags();

  const { data, loading } = useSkills({
    search: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sourceId: selectedSource ? sources.find((s) => s.name === selectedSource)?.id : undefined,
    sort: SORT_MAP[sortKey],
    page,
    pageSize: 12 * page,
  });

  const allSkills = data?.items || [];
  const totalSkills = data?.total || 0;
  const rankedSkills = useMemo(() => topSkills, [topSkills]);

  const getRank = useCallback((skillId: number) => {
    const idx = rankedSkills.findIndex((s: any) => s.id === skillId);
    return idx >= 0 ? idx + 1 : 0;
  }, [rankedSkills]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedTags([]);
    setSelectedSource("");
    setSortKey("stars");
  }, []);

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedSource;
  const displayedTags = showAllTags ? tags : tags.slice(0, 10);
  const hasMore = allSkills.length < totalSkills;

  const sourceOptions = useMemo(
    () => sources.map((s) => ({ key: s.name, label: s.name })),
    [sources]
  );
  const sortOptions = useMemo(
    () => SORT_OPTIONS.map((s) => ({ key: s.key, label: t(`sort.${s.key}`) })),
    [t]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">{t('marketplace.title')}</h1>
                <p className="text-xs text-muted-foreground">
                  {totalSkills} {t('common.skills')}{hasActiveFilters && ` (${t('common.filtered')})`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card/60 border border-border/40">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "grid" ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "list" ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('marketplace.searchPlaceholder')}
              className="w-full h-10 pl-10 pr-20 rounded-lg bg-card/60 border border-border/50 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-0.5 rounded hover:bg-accent/40 transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded border border-border/40 text-[10px] text-muted-foreground/60 font-mono">&#x2318;K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown label={t('sources.source')} icon={Filter} options={sourceOptions} value={selectedSource} onChange={setSelectedSource} allLabel={t('marketplace.allSources')} />
            <FilterDropdown label={t('sort.stars')} icon={ArrowUpDown} options={sortOptions} value={sortKey} onChange={(v) => setSortKey(v as SortKey)} allLabel={t('sort.stars')} />
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
            <div className="ml-auto">
              <DiscoveryPanel />
            </div>
          </div>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3 h-3 text-muted-foreground/40 mr-1 shrink-0" />
            {displayedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const color = getTagColor(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all duration-200 ${
                    isSelected
                      ? `${color.bg} ${color.text} ${color.border} shadow-sm`
                      : "border-transparent text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/30"
                  }`}
                >
                  {tag}
                  {isSelected && <X className="w-2.5 h-2.5 ml-1" />}
                </button>
              );
            })}
            {tags.length > 10 && (
              <button onClick={() => setShowAllTags(!showAllTags)} className="text-[11px] text-primary/70 hover:text-primary px-2 py-1 transition-colors">
                {showAllTags ? "Show less" : `+${tags.length - 10} more`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkillCardSkeletonGrid count={6} />
            ) : allSkills.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('marketplace.noSkillsTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  {t('marketplace.noSkillsDesc')}
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters} className="bg-transparent border-border/60 gap-1.5">
                  <X className="w-3.5 h-3.5" /> {t('marketplace.clearFilters')}
                </Button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {allSkills.map((skill, i) => (
                    <SkillCard key={skill.id} skill={skill} rank={getRank(skill.id)} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden divide-y divide-border/30">
                <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider bg-card/60">
                  <span className="w-8 text-center">#</span>
                  <span className="w-9" />
                  <span className="flex-1">Skill</span>
                  <span className="hidden lg:block w-32">Tags</span>
                  <span className="w-24 text-right">Stars</span>
                  <span className="w-24 text-right">Downloads</span>
                  <span className="hidden md:block w-12 text-right">Updated</span>
                  <span className="w-4" />
                </div>
                <AnimatePresence mode="popLayout">
                  {allSkills.map((skill, i) => (
                    <SkillListItem key={skill.id} skill={skill} rank={getRank(skill.id)} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && allSkills.length > 0 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground/40">
                  {t('marketplace.showing', { current: allSkills.length, total: totalSkills })}
                </p>
                {hasMore && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev + 1)}
                    className="bg-transparent border-border/50 hover:border-primary/40 hover:bg-primary/5 gap-1.5 px-6"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    {t('marketplace.loadMore', { count: totalSkills - allSkills.length })}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-[280px] shrink-0">
            <div className="sticky top-6">
              <RankingSidebar skills={rankedSkills.length > 0 ? rankedSkills : allSkills} />
              <div className="mt-4 rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] p-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{t('marketplace.quickStats')}</h4>
                <div className="space-y-2.5">
                  {[
                    { label: t('marketplace.totalSkills'), value: totalSkills, icon: Code2 },
                    { label: t('common.sources'), value: sources.length, icon: Filter },
                    { label: t('common.tags'), value: tags.length, icon: Tag },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <stat.icon className="w-3 h-3" />
                        {stat.label}
                      </span>
                      <span className="font-semibold text-foreground/80">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
