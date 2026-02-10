/*
 * FilterDropdown — Reusable dropdown filter for Marketplace
 * Extracted from Marketplace.tsx (FE-001)
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  icon: LucideIcon;
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  allLabel?: string;
}

export default function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  allLabel = "All",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = value ? options.find((o) => o.key === value)?.label || value : allLabel;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border transition-all duration-200 ${
          value
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}:</span>
        <span className="max-w-[100px] truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 z-50 min-w-[180px] rounded-lg border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => { onChange(""); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                  !value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                {allLabel}
              </button>
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    value === opt.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
