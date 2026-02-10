/*
 * SkillListItem — List view row for Marketplace
 * Extracted from Marketplace.tsx (FE-001)
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Download, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Skill } from "@/lib/types";
import { getTagColor, formatNumber, timeAgo } from "@/lib/constants";
import PlatformBadges from "@/components/PlatformBadges";

const listVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, x: 8, transition: { duration: 0.15, ease: "easeIn" as const } },
};

export default function SkillListItem({ skill, rank, index }: { skill: Skill; rank: number; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={listVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      layoutId={`skill-list-${skill.id}`}
    >
      <Link href={`/skills/${skill.id}`}>
        <div className="group flex items-center gap-4 px-4 py-3.5 rounded-lg border border-transparent hover:border-border/50 hover:bg-card/60 transition-all duration-200">
          {/* Rank */}
          <div className={`w-8 text-center shrink-0 font-mono text-sm font-bold ${
            rank <= 3 ? "text-amber-400" : "text-muted-foreground/50"
          }`}>
            {rank}
          </div>

          {/* Icon */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-[oklch(0.75_0.15_195)]/15 flex items-center justify-center shrink-0 border border-border/30">
            <span className="text-xs font-bold text-primary">{skill.name.charAt(0).toUpperCase()}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors font-mono truncate">
                {skill.name}
              </h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/40 text-muted-foreground/60 shrink-0">
                v{skill.version}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xl">
              {skill.description}
            </p>
          </div>

          {/* Tags */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {skill.tags.slice(0, 2).map((tag) => {
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
          </div>

          {/* Platform badges */}
          {skill.platforms && skill.platforms.length > 0 && (
            <div className="hidden md:flex shrink-0">
              <PlatformBadges platforms={skill.platforms} max={3} />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400/80" />
              <span className="font-medium text-foreground/80 w-8 text-right">{formatNumber(skill.stars)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span className="w-8 text-right">{formatNumber(skill.downloads)}</span>
            </span>
            <span className="hidden md:inline text-[11px] text-muted-foreground/50 w-12 text-right">
              {timeAgo(skill.last_updated_at)}
            </span>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
