/*
 * RankingSidebar — Top 20 ranking panel for Marketplace
 * Extracted from Marketplace.tsx (FE-001)
 */
import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, Trophy, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { type Skill } from "@/lib/types";
import { formatNumber } from "@/lib/constants";

export default function RankingSidebar({ skills }: { skills: Skill[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const top20 = skills.slice(0, 20);
  const displayed = expanded ? top20 : top20.slice(0, 10);

  return (
    <div className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-[oklch(1_0_0/10%)] flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h3 className="font-semibold text-sm">{t('ranking.title')}</h3>
        <TrendingUp className="w-3 h-3 text-emerald-400 ml-auto" />
      </div>

      {/* List */}
      <div className="divide-y divide-border/30">
        {displayed.map((skill, i) => (
          <Link key={skill.id} href={`/skills/${skill.id}`}>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className="group flex items-center gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors"
            >
              <span className={`w-5 text-center font-mono text-[11px] font-bold shrink-0 ${
                i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-amber-600" : "text-muted-foreground/40"
              }`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors font-mono">
                  {skill.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60 truncate">
                  {skill.source.name}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                <Star className="w-3 h-3 text-amber-400/60" />
                {formatNumber(skill.stars)}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Expand/Collapse */}
      {top20.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors flex items-center justify-center gap-1 border-t border-border/30"
        >
          {expanded ? (
            <>{t('ranking.showLess')} <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>{t('ranking.showAll')} <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  );
}
