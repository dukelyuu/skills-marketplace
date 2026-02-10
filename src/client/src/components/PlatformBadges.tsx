/*
 * PlatformBadges — Reusable IDE/Agent platform badges
 * Shows small colored badges for supported platforms
 */
import { getPlatformInfo } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlatformBadgesProps {
  platforms: string[];
  max?: number;
  size?: "sm" | "md";
}

export default function PlatformBadges({ platforms, max = 4, size = "sm" }: PlatformBadgesProps) {
  if (!platforms || platforms.length === 0) return null;

  const displayed = platforms.slice(0, max);
  const remaining = platforms.length - max;

  return (
    <div className="flex items-center gap-1">
      {displayed.map((pid) => {
        const p = getPlatformInfo(pid);
        return (
          <Tooltip key={pid} delayDuration={0}>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center justify-center rounded border text-[9px] font-bold leading-none ${p.bg} ${p.color} ${p.border} ${
                  size === "sm" ? "w-5 h-4 text-[8px]" : "px-1.5 py-0.5 text-[10px] gap-1"
                }`}
              >
                {size === "sm" ? p.short : p.name}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">{p.name}</TooltipContent>
          </Tooltip>
        );
      })}
      {remaining > 0 && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="text-[9px] text-muted-foreground/50 px-0.5">
              +{remaining}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {platforms.slice(max).map((pid) => getPlatformInfo(pid).name).join(", ")}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
