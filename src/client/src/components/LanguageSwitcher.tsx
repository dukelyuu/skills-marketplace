import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

interface LanguageSwitcherProps {
  /** Tooltip and dropdown placement: "right" for sidebar, "bottom" for top nav */
  side?: "right" | "bottom";
}

export default function LanguageSwitcher({ side = "right" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
              <Globe className="w-[18px] h-[18px]" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={8}>{current.label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" side={side} sideOffset={8} className="w-36">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`gap-2 text-xs ${i18n.language === lang.code ? "text-primary font-medium" : ""}`}
          >
            <span>{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
