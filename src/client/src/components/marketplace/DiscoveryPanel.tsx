/*
 * DiscoveryPanel — Auto-discover skills from GitHub Search & Awesome Lists
 * Rendered as a Dialog, triggered by a button in the Marketplace filter bar
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, Globe, Sparkles, Loader2,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { discoverSearch, discoverAwesome, runFullDiscovery } from "@/lib/api";

interface DiscoveryResult {
  found?: number;
  added?: number;
  skipped?: number;
  errors?: number;
  links_found?: number;
  total_added?: number;
}

export default function DiscoveryPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("Skills");
  const [minStars, setMinStars] = useState("1000");
  const [awesomeUrl, setAwesomeUrl] = useState(
    "https://github.com/ComposioHQ/awesome-claude-skills"
  );
  const [searching, setSearching] = useState(false);
  const [awesomeLoading, setAwesomeLoading] = useState(false);
  const [fullRunning, setFullRunning] = useState(false);
  const [lastResult, setLastResult] = useState<DiscoveryResult | null>(null);

  const isLoading = searching || awesomeLoading || fullRunning;

  const handleSearch = async () => {
    setSearching(true);
    setLastResult(null);
    try {
      const result = await discoverSearch({
        query: searchQuery,
        min_stars: parseInt(minStars) || 1000,
        max_results: 50,
      });
      setLastResult(result);
      toast.success(t('discovery.searchSuccess', { found: result.found, added: result.added }));
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || t('discovery.searchFailed'));
    } finally {
      setSearching(false);
    }
  };

  const handleAwesome = async () => {
    if (!awesomeUrl.trim()) return;
    setAwesomeLoading(true);
    setLastResult(null);
    try {
      const result = await discoverAwesome(awesomeUrl.trim());
      setLastResult(result);
      toast.success(t('discovery.awesomeSuccess', { found: result.links_found, added: result.added }));
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || t('discovery.awesomeFailed'));
    } finally {
      setAwesomeLoading(false);
    }
  };

  const handleFullDiscovery = async () => {
    setFullRunning(true);
    setLastResult(null);
    try {
      const result = await runFullDiscovery(parseInt(minStars) || 1000);
      setLastResult(result);
      toast.success(t('discovery.fullSuccess', { added: result.total_added }));
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || t('discovery.fullFailed'));
    } finally {
      setFullRunning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-xs text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all">
          <Sparkles className="w-3 h-3" />
          {t('discovery.discoverSkills')}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            {t('discovery.discoverSkills')}
            <Badge variant="outline" className="text-[8px] border-cyan-500/30 text-cyan-400 px-1.5 py-0">
              {t('discovery.beta')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <p className="text-xs text-muted-foreground">
            {t('discovery.description')}
          </p>

          {/* GitHub Search */}
          <div className="space-y-2.5">
            <label className="text-xs text-muted-foreground/80 font-medium flex items-center gap-1.5">
              <Search className="w-3 h-3" /> {t('discovery.githubSearch')}
            </label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('discovery.searchPlaceholder')}
                className="bg-background/50 text-xs h-9 flex-1"
              />
              <Input
                value={minStars}
                onChange={(e) => setMinStars(e.target.value)}
                placeholder={t('discovery.minStars')}
                className="bg-background/50 text-xs h-9 w-24"
                type="number"
              />
              <Button
                variant="outline" size="sm"
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-transparent border-border/50 gap-1.5 text-xs h-9 shrink-0"
              >
                {searching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                {t('discovery.search')}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/50">
              github.com/search?q={searchQuery}+stars:≥{minStars || "1000"}&type=repositories
            </p>
          </div>

          {/* Awesome List */}
          <div className="space-y-2.5">
            <label className="text-xs text-muted-foreground/80 font-medium flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> {t('discovery.awesomeListImport')}
            </label>
            <div className="flex gap-2">
              <Input
                value={awesomeUrl}
                onChange={(e) => setAwesomeUrl(e.target.value)}
                placeholder={t('discovery.awesomePlaceholder')}
                className="bg-background/50 text-xs h-9 flex-1 font-mono"
              />
              <Button
                variant="outline" size="sm"
                onClick={handleAwesome}
                disabled={isLoading}
                className="bg-transparent border-border/50 gap-1.5 text-xs h-9 shrink-0"
              >
                {awesomeLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                {t('discovery.import')}
              </Button>
            </div>
          </div>

          {/* Full Discovery */}
          <Button
            onClick={handleFullDiscovery}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 gap-1.5 text-xs h-9"
          >
            {fullRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {t('discovery.discoverAll')}
          </Button>

          {/* Result */}
          {lastResult && (
            <div className="rounded-lg bg-background/40 border border-border/30 p-3 space-y-1.5">
              {(lastResult.added ?? 0) > 0 || (lastResult.total_added ?? 0) > 0 ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('discovery.newSourcesAdded', { count: lastResult.added ?? lastResult.total_added })}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t('discovery.noNewSources')}
                </div>
              )}
              {lastResult.found !== undefined && (
                <p className="text-[10px] text-muted-foreground/50">
                  {t('discovery.reposFound', { found: lastResult.found, skipped: lastResult.skipped || 0, errors: lastResult.errors || 0 })}
                </p>
              )}
              {lastResult.links_found !== undefined && (
                <p className="text-[10px] text-muted-foreground/50">
                  {t('discovery.linksParsed', { found: lastResult.links_found, skipped: lastResult.skipped || 0, errors: lastResult.errors || 0 })}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
