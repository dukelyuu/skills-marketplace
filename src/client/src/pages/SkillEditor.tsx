/*
 * Skill Editor — Obsidian Forge Design
 * Left-right split Markdown editor with toolbar, live preview, YAML frontmatter
 */
import { useState, useCallback, useRef, useMemo } from "react";
import { useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  PenTool, Eye, Bold, Italic, Code2, List, ListOrdered,
  Link2, Image, Table, Heading1, Heading2, Heading3,
  Save, Download, Upload, FileText, Copy, Check,
  ChevronDown, Undo2, Redo2, Maximize2, Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/ui/resizable";
import { useSkillDetail } from "@/hooks/useSkills";
import { createSkill, updateSkill } from "@/lib/api";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import TemplateWizard from "@/components/editor/TemplateWizard";

// ─── Toolbar actions ───
interface ToolbarAction {
  icon: typeof Bold;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: Bold, label: "Bold", prefix: "**", suffix: "**" },
  { icon: Italic, label: "Italic", prefix: "_", suffix: "_" },
  { icon: Code2, label: "Inline Code", prefix: "`", suffix: "`" },
  { icon: Link2, label: "Link", prefix: "[", suffix: "](url)" },
  { icon: Image, label: "Image", prefix: "![alt](", suffix: ")" },
];

const BLOCK_ACTIONS: ToolbarAction[] = [
  { icon: Heading1, label: "Heading 1", prefix: "# ", suffix: "", block: true },
  { icon: Heading2, label: "Heading 2", prefix: "## ", suffix: "", block: true },
  { icon: Heading3, label: "Heading 3", prefix: "### ", suffix: "", block: true },
  { icon: List, label: "Bullet List", prefix: "- ", suffix: "", block: true },
  { icon: ListOrdered, label: "Numbered List", prefix: "1. ", suffix: "", block: true },
  { icon: Table, label: "Table", prefix: "| Column 1 | Column 2 |\n|----------|----------|\n| ", suffix: " | data |", block: true },
];

// ─── YAML frontmatter parser ───
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string; valid: boolean } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content, valid: false };
  try {
    const lines = match[1].split("\n");
    const fm: Record<string, any> = {};
    let currentKey = "";
    for (const line of lines) {
      const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
      if (kvMatch) {
        currentKey = kvMatch[1];
        const val = kvMatch[2].trim();
        fm[currentKey] = val || [];
      } else if (line.match(/^\s+-\s+(.+)$/) && currentKey) {
        const item = line.match(/^\s+-\s+(.+)$/)?.[1];
        if (item) {
          if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
          fm[currentKey].push(item);
        }
      }
    }
    return { frontmatter: fm, body: match[2], valid: true };
  } catch {
    return { frontmatter: {}, body: content, valid: false };
  }
}

export default function SkillEditor() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const skillId = params.id ? Number(params.id) : null;
  const { skill, loading: skillLoading } = useSkillDetail(skillId);
  const isNew = !params.id;

  const [showWizard, setShowWizard] = useState(isNew);
  const [initialized, setInitialized] = useState(false);

  const [content, setContent] = useState("");

  // Initialize content when skill loads
  useMemo(() => {
    if (skill && !initialized) {
      const skillContent = skill.skill_md_content || `---\nname: ${skill.name}\nversion: ${skill.version}\ndescription: ${skill.description}\nauthor: ${skill.source?.name}\nlicense: ${skill.license}\ntags:\n${skill.tags.map((t: string) => `  - ${t}`).join("\n")}\n---\n\n# ${skill.name}\n\n${skill.description}\n\n## Installation\n\n\`\`\`bash\npip install ${skill.name}\n\`\`\`\n\n## Quick Start\n\n\`\`\`python\nfrom skills import ${skill.name.replace(/-/g, "_")}\n\nskill = ${skill.name.replace(/-/g, "_")}.init()\nresult = skill.run(input_data)\nprint(result)\n\`\`\`\n`;
      setContent(skillContent);
      setInitialized(true);
    }
  }, [skill, initialized]);

  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { frontmatter, valid: fmValid } = useMemo(() => parseFrontmatter(content), [content]);

  const insertMarkdown = useCallback((action: ToolbarAction) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end) || action.label;

    let newContent: string;
    if (action.block) {
      const lineStart = content.lastIndexOf("\n", start - 1) + 1;
      newContent = content.substring(0, lineStart) + action.prefix + content.substring(lineStart, end) + action.suffix + content.substring(end);
    } else {
      newContent = content.substring(0, start) + action.prefix + selected + action.suffix + content.substring(end);
    }
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const newPos = start + action.prefix.length + selected.length + action.suffix.length;
      ta.setSelectionRange(newPos, newPos);
    });
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleExport = useCallback(() => {
    const name = frontmatter.name || "skill";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.skill.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${name}.skill.md`);
  }, [content, frontmatter]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.skill,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setContent(reader.result as string);
        toast.success(`Imported ${file.name}`);
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const wordCount = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content]);
  const lineCount = useMemo(() => content.split("\n").length, [content]);

  const handleWizardComplete = useCallback((generatedContent: string) => {
    setContent(generatedContent);
    setShowWizard(false);
  }, []);

  // Show wizard for new skills
  if (showWizard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full"
      >
        <TemplateWizard onComplete={handleWizardComplete} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col ${fullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <PenTool className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">
              {skillLoading ? t('common.loading') : skill ? t('editor.editing', { name: skill.name }) : t('editor.newSkill')}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{t('editor.lines', { count: lineCount })}</span>
              <span>·</span>
              <span>{t('editor.words', { count: wordCount })}</span>
              {fmValid && (
                <>
                  <span>·</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-3.5 border-emerald-500/30 text-emerald-400">
                    {t('editor.yamlValid')}
                  </Badge>
                </>
              )}
              {!fmValid && content.includes("---") && (
                <>
                  <span>·</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-3.5 border-amber-500/30 text-amber-400">
                    {t('editor.yamlInvalid')}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleImport}>
                <Upload className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import .md file</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy content</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{fullscreen ? t('editor.exitFullscreen') : t('editor.fullscreen')}</TooltipContent>
          </Tooltip>
          <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 gap-1.5 ml-2" onClick={handleExport}>
            <Download className="w-3 h-3" /> {t('editor.exportSkill')}
          </Button>
          <Button size="sm" className="h-7 text-xs gap-1.5" onClick={async () => {
            try {
              const { frontmatter: fm } = parseFrontmatter(content);
              if (skill && skillId) {
                await updateSkill(skillId, {
                  description: fm.description,
                  skill_md_content: content,
                  tags: Array.isArray(fm.tags) ? fm.tags : [],
                  version: fm.version,
                });
                toast.success("Skill updated!");
              } else {
                await createSkill({
                  name: fm.name || "untitled-skill",
                  description: fm.description,
                  skill_md_content: content,
                  tags: Array.isArray(fm.tags) ? fm.tags : [],
                  version: fm.version,
                });
                toast.success("Skill created!");
              }
            } catch {
              toast.error("Save failed");
            }
          }}>
            <Save className="w-3 h-3" /> {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 px-4 py-1.5 border-b border-border/40 bg-[oklch(0.14_0.005_285)] flex items-center gap-0.5 overflow-x-auto">
        {TOOLBAR_ACTIONS.map((action) => (
          <Tooltip key={action.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown(action)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                <action.icon className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{action.label}</TooltipContent>
          </Tooltip>
        ))}
        <div className="w-px h-5 bg-border/40 mx-1" />
        {BLOCK_ACTIONS.map((action) => (
          <Tooltip key={action.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown(action)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                <action.icon className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{action.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Editor + Preview split */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="px-4 py-1.5 border-b border-border/30 flex items-center gap-2 bg-[oklch(0.12_0.005_285)]">
                <Code2 className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">{t('editor.editorTab')}</span>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full resize-none bg-[oklch(0.11_0.005_285)] text-sm font-mono leading-relaxed p-4 focus:outline-none text-foreground/90 placeholder:text-muted-foreground/30"
                placeholder={t('editor.placeholder')}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="px-4 py-1.5 border-b border-border/30 flex items-center gap-2 bg-[oklch(0.12_0.005_285)]">
                <Eye className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">{t('editor.previewTab')}</span>
                {fmValid && frontmatter.name && (
                  <Badge variant="secondary" className="text-[9px] ml-auto">{frontmatter.name} v{frontmatter.version || "0.0.0"}</Badge>
                )}
              </div>
              <div className="flex-1 overflow-auto p-6 bg-[oklch(0.13_0.005_285)]">
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-code:text-primary prose-pre:bg-[oklch(0.11_0.005_285)] prose-pre:border prose-pre:border-border/40 prose-td:text-muted-foreground prose-th:text-foreground">
                  <Streamdown>{content.replace(/^---\n[\s\S]*?\n---\n?/, "")}</Streamdown>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
}
