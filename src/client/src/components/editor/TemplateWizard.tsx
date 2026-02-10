/*
 * TemplateWizard — Step-based skill creation wizard (FE-307)
 * Step 1: Choose template → Step 2: Fill metadata → generates SKILL.md
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, FileText, Globe, Database, Bot, Shield, Wrench,
  ArrowRight, ArrowLeft, Check, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TAGS, IDE_PLATFORMS } from "@/lib/constants";

// ─── Templates ───
interface SkillTemplate {
  id: string;
  name: string;
  icon: typeof FileText;
  description: string;
  color: string;
  tags: string[];
  skeleton: (meta: TemplateMeta) => string;
}

interface TemplateMeta {
  name: string;
  description: string;
  author: string;
  version: string;
  language: string;
  tags: string[];
  platforms: string[];
}

const TEMPLATES: SkillTemplate[] = [
  {
    id: "blank",
    name: "Blank Skill",
    icon: FileText,
    description: "Start from scratch with a minimal template",
    color: "text-zinc-400",
    tags: [],
    skeleton: (m) => buildMd(m, "# " + m.name + "\n\nDescribe your skill here.\n"),
  },
  {
    id: "web-api",
    name: "Web / API Skill",
    icon: Globe,
    description: "HTTP requests, REST/GraphQL integration, web scraping",
    color: "text-cyan-400",
    tags: ["api-integration", "web-scraping"],
    skeleton: (m) => buildMd(m, webApiBody(m)),
  },
  {
    id: "data",
    name: "Data Processing",
    icon: Database,
    description: "Data transformation, analysis, database operations",
    color: "text-amber-400",
    tags: ["data-analysis", "database"],
    skeleton: (m) => buildMd(m, dataBody(m)),
  },
  {
    id: "agent",
    name: "Agent Tool",
    icon: Bot,
    description: "AI agent tool with structured input/output",
    color: "text-violet-400",
    tags: ["automation", "code-generation"],
    skeleton: (m) => buildMd(m, agentBody(m)),
  },
  {
    id: "security",
    name: "Security / DevOps",
    icon: Shield,
    description: "Security scanning, CI/CD, infrastructure automation",
    color: "text-rose-400",
    tags: ["security", "devops"],
    skeleton: (m) => buildMd(m, securityBody(m)),
  },
  {
    id: "utility",
    name: "Utility",
    icon: Wrench,
    description: "File management, text processing, general utilities",
    color: "text-emerald-400",
    tags: ["automation", "file-management"],
    skeleton: (m) => buildMd(m, utilityBody(m)),
  },
];

function buildMd(m: TemplateMeta, body: string): string {
  const tags = m.tags.length > 0 ? `\n${m.tags.map(t => `  - ${t}`).join("\n")}` : "\n  - automation";
  const platforms = m.platforms.length > 0 ? `\nplatforms:${m.platforms.map(p => `\n  - ${p}`).join("")}` : "";
  return `---
name: ${m.name || "my-skill"}
version: ${m.version || "1.0.0"}
description: ${m.description || "A brief description"}
author: ${m.author || "your-name"}
license: MIT
tags:${tags}${platforms}
---

${body}`;
}

function webApiBody(m: TemplateMeta) {
  const n = m.name || "my-api-skill";
  const mod = n.replace(/-/g, "_");
  return `# ${n}

${m.description || "A skill for integrating with external APIs."}

## Endpoints

This skill supports the following operations:

- \`GET\` — Fetch data from the target API
- \`POST\` — Send data to the target API
- \`PUT\` — Update existing resources

## Quick Start

\`\`\`python
from skills import ${mod}

client = ${mod}.init(base_url="https://api.example.com", api_key="...")
response = client.get("/users", params={"limit": 10})
print(response.json())
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`base_url\` | str | — | API base URL (required) |
| \`api_key\` | str | — | Authentication key |
| \`timeout\` | int | 30 | Request timeout in seconds |
| \`retries\` | int | 3 | Retry attempts on failure |

## Error Handling

The skill automatically retries on transient errors (429, 502, 503) with exponential backoff.

## License

MIT
`;
}

function dataBody(m: TemplateMeta) {
  const n = m.name || "my-data-skill";
  const mod = n.replace(/-/g, "_");
  return `# ${n}

${m.description || "A skill for data transformation and analysis."}

## Supported Formats

- CSV / TSV
- JSON / JSONL
- Parquet
- Excel (.xlsx)

## Quick Start

\`\`\`python
from skills import ${mod}

df = ${mod}.load("data.csv")
result = ${mod}.transform(df, operations=[
    {"type": "filter", "column": "status", "value": "active"},
    {"type": "aggregate", "group_by": "category", "agg": "sum"},
])
${mod}.export(result, "output.json")
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`chunk_size\` | int | 10000 | Rows per processing chunk |
| \`encoding\` | str | utf-8 | File encoding |
| \`null_handling\` | str | skip | How to handle null values |

## License

MIT
`;
}

function agentBody(m: TemplateMeta) {
  const n = m.name || "my-agent-tool";
  const mod = n.replace(/-/g, "_");
  return `# ${n}

${m.description || "An AI agent tool with structured input/output."}

## Tool Schema

\`\`\`json
{
  "name": "${n}",
  "description": "${m.description || "Describe what this tool does"}",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "The input query" }
    },
    "required": ["query"]
  }
}
\`\`\`

## Quick Start

\`\`\`python
from skills import ${mod}

tool = ${mod}.init()
result = tool.run({"query": "example input"})
print(result)
\`\`\`

## Features

- Structured JSON input/output
- Built-in validation
- Streaming support
- Error recovery

## License

MIT
`;
}

function securityBody(m: TemplateMeta) {
  const n = m.name || "my-security-skill";
  const mod = n.replace(/-/g, "_");
  return `# ${n}

${m.description || "A security and DevOps automation skill."}

## Capabilities

- Dependency vulnerability scanning
- Secret detection in code
- Infrastructure configuration audit
- Compliance checking

## Quick Start

\`\`\`python
from skills import ${mod}

scanner = ${mod}.init()
report = scanner.scan(target="./src", checks=["vulnerabilities", "secrets"])
print(report.summary())
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`severity_threshold\` | str | medium | Minimum severity to report |
| \`ignore_patterns\` | list | [] | File patterns to skip |
| \`output_format\` | str | json | Report format (json/sarif/html) |

## License

MIT
`;
}

function utilityBody(m: TemplateMeta) {
  const n = m.name || "my-utility";
  const mod = n.replace(/-/g, "_");
  return `# ${n}

${m.description || "A general-purpose utility skill."}

## Quick Start

\`\`\`python
from skills import ${mod}

result = ${mod}.run(input_data)
print(result)
\`\`\`

## Features

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`verbose\` | bool | false | Enable verbose logging |
| \`timeout\` | int | 30 | Operation timeout |

## License

MIT
`;
}

// ─── Languages ───
const LANGUAGES = ["Python", "TypeScript", "Go", "JavaScript", "Rust"];

// ═══════════════════════════════════════════════════════════════
// TemplateWizard Component
// ═══════════════════════════════════════════════════════════════
export default function TemplateWizard({ onComplete }: { onComplete: (content: string) => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<SkillTemplate | null>(null);
  const [meta, setMeta] = useState<TemplateMeta>({
    name: "", description: "", author: "", version: "1.0.0", language: "Python", tags: [], platforms: [],
  });

  const handleSelectTemplate = useCallback((t: SkillTemplate) => {
    setSelectedTemplate(t);
    setMeta((prev) => ({ ...prev, tags: [...t.tags] }));
    setStep(2);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setMeta((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }, []);

  const togglePlatform = useCallback((platformId: string) => {
    setMeta((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  }, []);

  const handleCreate = useCallback(() => {
    if (!selectedTemplate) return;
    const content = selectedTemplate.skeleton(meta);
    onComplete(content);
  }, [selectedTemplate, meta, onComplete]);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{t('editor.createNewSkill')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 ? t('editor.chooseTemplate') : t('editor.fillDetails')}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`w-8 h-0.5 transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className="group text-left p-4 rounded-xl border border-border/50 bg-card/60 hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
                >
                  <t.icon className={`w-6 h-6 ${t.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-sm font-semibold mb-1">{t.name}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.description}</p>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Template badge */}
              {selectedTemplate && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
                    <selectedTemplate.icon className="w-3 h-3" />
                    {selectedTemplate.name}
                  </Badge>
                </div>
              )}

              {/* Name + Version row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{t('editor.skillName')}</label>
                  <Input
                    value={meta.name}
                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                    placeholder="my-awesome-skill"
                    className="h-9 text-sm bg-card/60 border-border/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{t('editor.version')}</label>
                  <Input
                    value={meta.version}
                    onChange={(e) => setMeta({ ...meta, version: e.target.value })}
                    placeholder="1.0.0"
                    className="h-9 text-sm bg-card/60 border-border/50 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{t('editor.description')}</label>
                <Input
                  value={meta.description}
                  onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                  placeholder="A brief description of what this skill does"
                  className="h-9 text-sm bg-card/60 border-border/50"
                />
              </div>

              {/* Author + Language row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{t('editor.author')}</label>
                  <Input
                    value={meta.author}
                    onChange={(e) => setMeta({ ...meta, author: e.target.value })}
                    placeholder="your-name"
                    className="h-9 text-sm bg-card/60 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{t('editor.language')}</label>
                  <div className="flex gap-1.5">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setMeta({ ...meta, language: lang })}
                        className={`flex-1 h-9 text-xs rounded-md border transition-all ${
                          meta.language === lang
                            ? "border-primary/50 bg-primary/10 text-primary font-medium"
                            : "border-border/40 bg-card/40 text-muted-foreground hover:border-border"
                        }`}
                      >
                        {lang.slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        meta.tags.includes(tag)
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/30 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/30"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Supported IDEs / Agent Platforms */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">{t('editor.supportedPlatforms')}</label>
                <div className="flex flex-wrap gap-1.5">
                  {IDE_PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                        meta.platforms.includes(platform.id)
                          ? `${platform.border} ${platform.bg} ${platform.color}`
                          : "border-border/30 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/30"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                        meta.platforms.includes(platform.id) ? `${platform.bg} ${platform.color}` : "bg-muted/30"
                      }`}>
                        {platform.short}
                      </span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="gap-1.5 text-muted-foreground"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('common.back')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  className="bg-primary hover:bg-primary/90 gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('common.create')} Skill
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
