/*
 * SkillCard — Grid view card for Marketplace
 * Extracted from Marketplace.tsx (FE-001)
 */
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Star, GitFork, Download, ExternalLink, Zap, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type Skill } from "@/lib/types";
import { getTagColor, LANG_COLORS, formatNumber, timeAgo } from "@/lib/constants";
import PlatformBadges from "@/components/PlatformBadges";
import { toast } from "sonner";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export default function SkillCard({ skill, rank, index }: { skill: Skill; rank: number; index: number }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`pip install ${skill.name}`);
    setCopied(true);
    toast.success(t('skillCard.installCopied'));
    setTimeout(() => setCopied(false), 2000);
  }, [skill.name, t]);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      layoutId={`skill-card-${skill.id}`}
    >
      <Link href={`/skills/${skill.id}`}>
        <div className="group relative rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] overflow-hidden transition-all duration-300 hover:border-primary/40 hover:bg-[oklch(0.25_0.008_285)] hover:shadow-[inset_0_1px_0_0_oklch(1_0_0/8%),0_0_40px_rgba(99,102,241,0.12)] h-full">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="p-5">
            {/* Header: icon + name + rank */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-[oklch(0.75_0.15_195)]/20 flex items-center justify-center shrink-0 border border-border/40 group-hover:border-primary/30 transition-colors">
                  <span className="text-sm font-bold text-primary">{skill.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate font-mono">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${LANG_COLORS[skill.language] || "bg-zinc-500"}`} />
                    {skill.language}
                    <span className="mx-1 text-border">·</span>
                    {skill.source.name}
                  </p>
                </div>
              </div>
              {rank <= 20 && (
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  rank <= 3
                    ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}>
                  #{rank}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[13px] text-[oklch(0.72_0.01_285)] leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
              {skill.description}
            </p>

            {/* Tags + Platforms */}
            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[1.5rem]">
              {skill.tags.slice(0, 3).map((tag) => {
                const color = getTagColor(tag);
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border}`}
                  >
                    {tag}
                  </span>
                );
              })}
              {skill.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground/60 px-1 py-0.5">
                  +{skill.tags.length - 3}
                </span>
              )}
            </div>
            {skill.platforms && skill.platforms.length > 0 && (
              <div className="mb-4">
                <PlatformBadges platforms={skill.platforms} max={5} />
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-[oklch(1_0_0/10%)]">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="font-medium text-foreground/80">{formatNumber(skill.stars)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                {formatNumber(skill.forks)}
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                {formatNumber(skill.downloads)}
              </span>
              <span className="ml-auto text-[11px] text-muted-foreground/60">
                {timeAgo(skill.last_updated_at)}
              </span>
            </div>
          </div>

          {/* Hover action bar */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-[oklch(0.22_0.006_285)] via-[oklch(0.22_0.006_285)] to-[oklch(0.22_0.006_285/90%)] border-t border-[oklch(1_0_0/10%)] px-5 py-3">
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 flex-1">
                <Zap className="w-3 h-3" />
                {t('skillCard.importToAgent')}
              </Button>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 bg-transparent border-border/60"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">{t('skillCard.copyInstall')}</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 bg-transparent border-border/60"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(skill.github_url, "_blank");
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">{t('skillCard.viewOnGithub')}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
