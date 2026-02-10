<p align="center">
  <b>🌍 Language / 语言 / 言語 / 언어</b><br/>
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a>
</p>

<p align="center">
  <img src="docs/ui-slices/00-original-designs/01_skill_marketplace.png" alt="SkillHub Marketplace" width="800" />
</p>

<h1 align="center">🛠️ SkillHub — The World's First Agent Skill Marketplace</h1>

<p align="center">
  <strong>Discover, manage, and share AI agent skills across every major IDE and agent platform.</strong>
</p>

<p align="center">
  <a href="https://www.skill-marketplace.com">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-FTS5-003B57?logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## What is SkillHub?

SkillHub is the first open-source marketplace purpose-built for **AI agent skills** — the reusable, composable building blocks that power coding agents like Claude Code, Kiro, Cursor, Windsurf, GitHub Copilot, Cline, and more.

Think of it as **npm for agent skills**: browse a curated catalog, inspect SKILL.md definitions, one-click import into your agent, and manage the GitHub sources that feed the registry — all from a single, beautifully crafted dark-mode UI.

---

## Features

### 🏪 Skill Marketplace
- Full-text search powered by SQLite FTS5
- Multi-dimensional filtering by source, tags, language, and sort order
- Grid and List view toggle with smooth Framer Motion animations
- Top 20 ranking sidebar with star-based leaderboard
- `⌘K` keyboard shortcut for instant search focus
- Infinite scroll pagination

### 📄 Skill Detail
- Rich SKILL.md rendering with syntax-highlighted code blocks (Streamdown)
- Star history chart (Recharts)
- Version history timeline with changelog
- File tree explorer
- Related skills recommendation (tag-overlap algorithm)
- One-click ZIP download (JSZip) containing SKILL.md, skill.json, and README

### ✏️ Skill Editor
- Split-pane Markdown editor with live preview (react-resizable-panels)
- Toolbar: bold, italic, code, links, images, headings, lists, tables
- YAML frontmatter validation badge
- Template wizard: 6 starter templates × 2-step guided flow
- Import/export `.skill.md` files
- Fullscreen mode, word/line count

### 🖥️ Multi-Platform Support
- Skills declare compatible IDE/agent platforms in frontmatter
- 12 platforms supported out of the box:
  **Claude Code · Kiro · Cursor · Windsurf · GitHub Copilot · Cline · Antigravity · OpenCraw · CodeBuddy · Augment · Roo Code · Trae**
- Platform badges displayed on cards, list items, and detail pages

### 📡 Source Management
- Add GitHub repos and Awesome Lists as skill sources
- Real-time sync status with 3-second polling
- Sync log timeline with per-source history
- Row-level actions: sync, edit, open on GitHub, delete
- HMAC-SHA256 webhook verification for push-triggered syncs

### 🔍 Auto-Discovery Engine
- GitHub Search API integration — find skill repos by stars, topics, keywords
- Awesome List parser — crawl curated lists and extract repo links
- One-click "Full Discovery" to scan multiple queries and lists in parallel
- Configurable presets for search queries and awesome list URLs

### 📊 System Dashboard
- 4 stat cards: Total Skills, Active Sources, Downloads, API Quota
- Sync activity area chart
- API quota donut chart
- Top tags horizontal bar chart
- Star distribution pie chart

### ⚙️ Settings & Configuration
- GitHub token management with connection test
- Cron-based sync scheduling (presets + custom expressions)
- Concurrency control for parallel sync jobs

### 🧪 Quality & Testing
- 25 backend tests (pytest) — all passing
- 15 frontend smoke tests (Vitest) — all passing
- TypeScript strict mode — zero errors
- Clean Vite production build

---

## Screenshots

| Marketplace | Skill Detail |
|:-:|:-:|
| ![Marketplace](docs/ui-slices/00-original-designs/01_skill_marketplace.png) | ![Detail](docs/ui-slices/00-original-designs/02_skill_detail.png) |

| Source Management | Skill Editor |
|:-:|:-:|
| ![Sources](docs/ui-slices/00-original-designs/03_source_management.png) | ![Editor](docs/ui-slices/00-original-designs/04_skill_editor.png) |

| Dashboard |
|:-:|
| ![Dashboard](docs/ui-slices/00-original-designs/05_system_dashboard.png) |

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19.2 + TypeScript 5.6 |
| Routing | wouter 3.3 |
| UI Components | shadcn/ui (Radix + Tailwind CSS 4.1) |
| Animations | Framer Motion 12 |
| Charts | Recharts 2.15 |
| Markdown | Streamdown 1.4 |
| HTTP Client | Axios 1.12 |
| Build | Vite 7.1 + pnpm 10 |

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 + Uvicorn 0.34 |
| ORM | SQLModel 0.0.22 (SQLAlchemy 2.x) |
| Database | SQLite + FTS5 full-text search |
| Scheduler | APScheduler 3.10 |
| GitHub Integration | httpx 0.28 (REST + GraphQL) |
| Config | pydantic-settings 2.7 + .env |

### Infrastructure
| Layer | Technology |
|---|---|
| Frontend Hosting | Cloudflare Pages |
| Backend Hosting | Fly.io (Singapore) |
| Containerization | Docker + docker-compose |
| Reverse Proxy | Nginx |

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+
- (Optional) GitHub Personal Access Token for sync/discovery features

### 1. Clone the repo

```bash
git clone https://github.com/your-username/skill-hub.git
cd skill-hub
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env
# Edit .env — set GITHUB_TOKEN if you want sync/discovery
pip install -r requirements.txt
python -m app.seed          # Seed 6 sources, 40 skills, 18 tags
uvicorn app.main:app --port 8000
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 3. Start the frontend

```bash
cd src
pnpm install
pnpm run dev
```

Frontend runs at `http://localhost:3000`, proxying API requests to the backend.

### 4. (Alternative) Docker Compose

```bash
docker-compose up --build
```

Opens at `http://localhost:3000` with backend at `http://localhost:8000`.

---

## Deployment

SkillHub is deployed as a split architecture:

- **Frontend** → Cloudflare Pages (static SPA)
- **Backend** → Fly.io (FastAPI + SQLite persistent volume)

```bash
# Deploy everything
./deploy/deploy.sh all

# Or deploy individually
./deploy/deploy.sh backend
./deploy/deploy.sh frontend
```

See [`deploy/README.md`](deploy/README.md) for detailed deployment instructions.

---

## Project Structure

```
skill-hub/
├── src/                        # Frontend (React + TypeScript)
│   └── client/src/
│       ├── components/         # Reusable UI components
│       ├── hooks/              # React hooks (useSkills, useSources, etc.)
│       ├── lib/                # API client, types, constants
│       └── pages/              # 8 page components
├── backend/                    # Backend (FastAPI + Python)
│   ├── app/
│   │   ├── api/                # Route handlers
│   │   ├── models/             # SQLModel data models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic
│   │   └── tasks/              # APScheduler jobs
│   └── tests/                  # pytest test suite
├── deploy/                     # Deployment configs
│   ├── deploy.sh               # One-command deploy script
│   ├── fly.toml                # Fly.io config
│   └── cloudflare/             # Cloudflare Pages headers/redirects
├── docs/                       # Design docs, UI slices, specs
└── docker-compose.yml
```

---

## Roadmap

SkillHub follows a phased development plan. The current V1.0 release covers the core marketplace, source management, editor, dashboard, and deployment infrastructure. Future versions will expand the platform into a full-featured skill ecosystem.

### ✅ V1.0 — Core Platform (Current)

- Skill Marketplace with FTS5 search, multi-filter, grid/list views, Top 20 ranking
- Skill Detail with SKILL.md rendering, star history, version timeline, file tree, ZIP download
- Source Management with GitHub repo / Awesome List support, sync engine, webhook integration
- Skill Editor with split-pane Markdown editing, template wizard, YAML validation, export
- System Dashboard with stats, sync activity, API quota, tag/star distribution charts
- Auto-Discovery Engine (GitHub Search + Awesome List parser)
- Settings with GitHub token management, cron scheduling, concurrency control
- Multi-platform support (12 IDEs/agents), i18n (7 languages)
- Deployment: Cloudflare Pages (frontend) + Fly.io (backend)
- 25 backend tests + 15 frontend tests, TypeScript strict mode, clean builds

### 🚧 V1.1 — Community & Quality

- User registration and login system
- Personal favorites / collections
- Skill rating and review system
- Automated quality scoring (static analysis, sandbox testing)
- Security scanning and quality badges
- CodeMirror 6 integration for the Skill Editor (syntax highlighting, autocomplete)
- File Manager component (upload, edit, delete skill-attached files)
- Sync scroll for editor/preview panes

### 🔮 V1.2 — Advanced Editor & Creation

- 4-step creation wizard (Basic Info → Capabilities → Instructions → Preview)
- Dual-mode editor: Form Mode (structured sections) + Code Mode (CodeMirror)
- Skill validation engine: real-time format/content/quality checks (30+ rules)
- Description quality scorer with trigger-phrase detection
- Structure preview with progressive disclosure simulation
- Version management with diff comparison and rollback
- Fork functionality for community skills
- 8 official templates (Blank, Prompt, Web Scraper, API Integration, Data Analysis, Code Generator, Document Processor, Multi-Tool Workflow)

### 🚀 V2.0 — Framework Integration

- One-click integration with LangChain, CrewAI, and other agent frameworks
- Skill dependency management and resolution
- Multi-format conversion (SKILL.md ↔ GPT Actions ↔ LangChain Tools)
- AI-assisted creation: description optimization, instruction generation, example generation, trigger-word suggestions
- Community template marketplace with usage stats and ratings

### 🌐 V3.0 — Ecosystem & Enterprise

- Developer community with contribution incentives
- Enterprise edition with private deployment
- Team collaboration and permission management
- Commercial marketplace exploration (revenue sharing)
- GitLab / Bitbucket source adapters
- Data import/export (JSON, CSV bulk operations)

---

## Design

SkillHub uses the **Obsidian Forge** dark theme:

- Primary: `#6366f1` (Indigo)
- Accent: `#22d3ee` (Cyan)
- Background: OKLCH-based dark palette
- Typography: Inter + JetBrains Mono

Design specs and UI slices are in the [`docs/`](docs/) directory.

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

---

## License

Apache-2.0 license
