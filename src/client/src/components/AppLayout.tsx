/*
 * AppLayout — Obsidian Forge Design
 * Narrow icon sidebar (56px) + content area with dot-grid background
 * Light-line borders, indigo-purple accent, spring-animated active indicator
 */
import { ReactNode, useState } from "react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Database,
  PenTool,
  BarChart3,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV_ITEMS = [
  { path: "/marketplace", labelKey: "nav.marketplace", icon: LayoutGrid },
  { path: "/sources", labelKey: "nav.sources", icon: Database },
  { path: "/editor", labelKey: "nav.editor", icon: PenTool },
  { path: "/dashboard", labelKey: "nav.dashboard", icon: BarChart3 },
  { path: "/settings", labelKey: "nav.settings", icon: Settings },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const activeIndex = NAV_ITEMS.findIndex((item) => location.startsWith(item.path));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[56px] border-r border-border bg-[oklch(0.11_0.005_285)] shrink-0">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center justify-center h-14 border-b border-border hover:bg-accent/50 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </Link>

        {/* Nav Icons */}
        <nav className="flex-1 flex flex-col items-center py-3 gap-1 relative">
          {/* Active indicator bar */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute left-0 w-[2px] h-8 bg-primary rounded-r-full"
              initial={false}
              animate={{ top: 12 + activeIndex * 40 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {t(item.labelKey)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Language Switcher + Search shortcut */}
        <div className="flex flex-col items-center py-3 border-t border-border gap-1">
          <LanguageSwitcher />
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
                <Search className="w-[18px] h-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {t('nav.search')}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-[oklch(0.11_0.005_285)] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <Link href="/">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">SkillHub</span>
          </div>
        </Link>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[oklch(0.13_0.005_285)] border-r border-border"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-semibold">SkillHub</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md hover:bg-accent/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t(item.labelKey)}
                        {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto dot-grid md:pt-0 pt-14">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
