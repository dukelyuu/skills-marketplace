<p align="center">
  <b>🌍 Language / 语言 / 言語 / 언어</b><br/>
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a>
</p>

<p align="center">
  <img src="docs/ui-slices/00-original-designs/01_skill_marketplace.png" alt="Skill MarketPlace Marketplace" width="800" />
</p>

<h1 align="center">🛠️ Skill MarketPlace — 全球首个 AI Agent 技能市场</h1>

<p align="center">
  <strong>发现、管理和分享 AI Agent 技能，覆盖所有主流 IDE 和 Agent 平台。</strong>
</p>

<p align="center">
  <a href="https://www.skill-marketplace.com">在线演示</a> ·
  <a href="#功能特性">功能特性</a> ·
  <a href="#技术栈">技术栈</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#部署">部署</a> ·
  <a href="#路线图">路线图</a>
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

## Skill MarketPlace 是什么？

Skill MarketPlace 是全球首个专为 **AI Agent 技能** 打造的开源市场 —— 这些技能是驱动 Claude Code、Kiro、Cursor、Windsurf、GitHub Copilot、Cline 等编程 Agent 的可复用、可组合的构建模块。

你可以把它理解为 **Agent 技能的 npm**：浏览精选目录、查看 SKILL.md 定义、一键导入到你的 Agent、管理为注册表提供数据的 GitHub 源 —— 所有操作都在一个精心设计的暗色主题 UI 中完成。

---

## 功能特性

### 🏪 技能市场
- 基于 SQLite FTS5 的全文搜索
- 多维度筛选：按来源、标签、语言、排序方式
- Grid / List 双视图切换，Framer Motion 流畅动画
- Top 20 排行榜侧边栏，基于 Star 数排名
- `⌘K` 快捷键快速聚焦搜索
- 无限滚动分页加载

### 📄 技能详情
- SKILL.md 富文本渲染，代码块语法高亮（Streamdown）
- Star 增长历史图表（Recharts）
- 版本历史时间线，含变更日志
- 文件树浏览器
- 相关技能推荐（标签重叠算法）
- 一键 ZIP 下载（JSZip），包含 SKILL.md、skill.json 和 README

### ✏️ 技能编辑器
- 分屏 Markdown 编辑器，实时预览（react-resizable-panels）
- 工具栏：加粗、斜体、代码、链接、图片、标题、列表、表格
- YAML frontmatter 校验徽章
- 模板向导：6 个起始模板 × 2 步引导流程
- 导入/导出 `.skill.md` 文件
- 全屏模式、字数/行数统计

### 🖥️ 多平台支持
- 技能在 frontmatter 中声明兼容的 IDE/Agent 平台
- 开箱即用支持 12 个平台：
  **Claude Code · Kiro · Cursor · Windsurf · GitHub Copilot · Cline · Antigravity · OpenCraw · CodeBuddy · Augment · Roo Code · Trae**
- 平台徽章展示在卡片、列表项和详情页上

### 📡 数据源管理
- 添加 GitHub 仓库和 Awesome List 作为技能来源
- 实时同步状态，3 秒轮询更新
- 同步日志时间线，按来源查看历史
- 行级操作：同步、编辑、在 GitHub 打开、删除
- HMAC-SHA256 Webhook 签名验证，支持 push 触发同步

### 🔍 自动发现引擎
- GitHub Search API 集成 —— 按 Star 数、主题、关键词发现技能仓库
- Awesome List 解析器 —— 爬取精选列表并提取仓库链接
- 一键"全量发现"，并行扫描多个查询和列表
- 可配置的搜索查询和 Awesome List URL 预设

### 📊 系统仪表盘
- 4 个统计卡片：技能总数、活跃来源、下载量、API 配额
- 同步活动面积图
- API 配额环形图
- 热门标签水平条形图
- Star 分布饼图

### ⚙️ 设置与配置
- GitHub Token 管理，支持连接测试
- 基于 Cron 的同步调度（预设 + 自定义表达式）
- 并行同步任务并发控制

### 🧪 质量与测试
- 25 个后端测试（pytest）—— 全部通过
- 15 个前端冒烟测试（Vitest）—— 全部通过
- TypeScript 严格模式 —— 零错误
- Vite 生产构建 —— 干净无警告

---

## 截图

| 技能市场 | 技能详情 |
|:-:|:-:|
| ![Marketplace](docs/ui-slices/00-original-designs/01_skill_marketplace.png) | ![Detail](docs/ui-slices/00-original-designs/02_skill_detail.png) |

| 数据源管理 | 技能编辑器 |
|:-:|:-:|
| ![Sources](docs/ui-slices/00-original-designs/03_source_management.png) | ![Editor](docs/ui-slices/00-original-designs/04_skill_editor.png) |

| 系统仪表盘 |
|:-:|
| ![Dashboard](docs/ui-slices/00-original-designs/05_system_dashboard.png) |

---

## 技术栈

### 前端
| 层面 | 技术 |
|---|---|
| 框架 | React 19.2 + TypeScript 5.6 |
| 路由 | wouter 3.3 |
| UI 组件库 | shadcn/ui (Radix + Tailwind CSS 4.1) |
| 动画 | Framer Motion 12 |
| 图表 | Recharts 2.15 |
| Markdown 渲染 | Streamdown 1.4 |
| HTTP 客户端 | Axios 1.12 |
| 构建工具 | Vite 7.1 + pnpm 10 |

### 后端
| 层面 | 技术 |
|---|---|
| 框架 | FastAPI 0.115 + Uvicorn 0.34 |
| ORM | SQLModel 0.0.22 (SQLAlchemy 2.x) |
| 数据库 | SQLite + FTS5 全文搜索 |
| 定时任务 | APScheduler 3.10 |
| GitHub 集成 | httpx 0.28 (REST + GraphQL) |
| 配置管理 | pydantic-settings 2.7 + .env |

### 基础设施
| 层面 | 技术 |
|---|---|
| 前端托管 | Cloudflare Pages |
| 后端托管 | Fly.io（新加坡） |
| 容器化 | Docker + docker-compose |
| 反向代理 | Nginx |

---

## 快速开始

### 前置条件

- Node.js 18+ 和 pnpm
- Python 3.11+
- （可选）GitHub Personal Access Token，用于同步/发现功能

### 1. 克隆仓库

```bash
git clone https://github.com/dukelyuu/skills-marketplace.git
cd skills-marketplace
```

### 2. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env —— 如需同步/发现功能请设置 GITHUB_TOKEN
pip install -r requirements.txt
python -m app.seed          # 初始化 6 个来源、40 个技能、18 个标签
uvicorn app.main:app --port 8000
```

后端运行在 `http://localhost:8000`，API 文档在 `http://localhost:8000/docs`。

### 3. 启动前端

```bash
cd src
pnpm install
pnpm run dev
```

前端运行在 `http://localhost:3000`，API 请求代理到后端。

### 4. （可选）Docker Compose

```bash
docker-compose up --build
```

访问 `http://localhost:3000`，后端在 `http://localhost:8000`。

---

## 部署

Skill MarketPlace 采用前后端分离部署架构：

- **前端** → Cloudflare Pages（静态 SPA）
- **后端** → Fly.io（FastAPI + SQLite 持久化卷）

```bash
# 一键部署全部
./deploy/deploy.sh all

# 或单独部署
./deploy/deploy.sh backend
./deploy/deploy.sh frontend
```

详细部署说明请参阅 [`deploy/README.md`](deploy/README.md)。

---

## 项目结构

```
skill-hub/
├── src/                        # 前端（React + TypeScript）
│   └── client/src/
│       ├── components/         # 可复用 UI 组件
│       ├── hooks/              # React Hooks（useSkills、useSources 等）
│       ├── lib/                # API 客户端、类型定义、常量
│       └── pages/              # 8 个页面组件
├── backend/                    # 后端（FastAPI + Python）
│   ├── app/
│   │   ├── api/                # 路由处理器
│   │   ├── models/             # SQLModel 数据模型
│   │   ├── schemas/            # Pydantic 请求/响应模式
│   │   ├── services/           # 业务逻辑
│   │   └── tasks/              # APScheduler 定时任务
│   └── tests/                  # pytest 测试套件
├── deploy/                     # 部署配置
│   ├── deploy.sh               # 一键部署脚本
│   ├── fly.toml                # Fly.io 配置
│   └── cloudflare/             # Cloudflare Pages headers/redirects
├── docs/                       # 设计文档、UI 切图、规格说明
└── docker-compose.yml
```

---

## 路线图

Skill MarketPlace 采用分阶段开发计划。当前 V1.0 版本涵盖核心市场、数据源管理、编辑器、仪表盘和部署基础设施。后续版本将把平台扩展为完整的 Skill 生态系统。

### ✅ V1.0 — 核心平台（当前版本）

- Skill 市场：FTS5 全文搜索、多维筛选、Grid/List 双视图、Top 20 排行榜
- Skill 详情：SKILL.md 渲染、Star 增长图表、版本时间线、文件树、ZIP 下载
- 数据源管理：GitHub 仓库 / Awesome List 支持、同步引擎、Webhook 集成
- Skill 编辑器：分屏 Markdown 编辑、模板向导、YAML 校验、导出
- 系统仪表盘：统计卡片、同步活动图、API 配额、标签/Star 分布图
- 自动发现引擎（GitHub Search + Awesome List 解析器）
- 设置：GitHub Token 管理、Cron 调度、并发控制
- 多平台支持（12 个 IDE/Agent）、国际化（7 种语言）
- 部署：Cloudflare Pages（前端）+ Fly.io（后端）
- 25 个后端测试 + 15 个前端测试，TypeScript 严格模式，构建零错误

### 🚧 V1.1 — 社区与质量

- 用户注册与登录系统
- 个人收藏夹
- Skill 评分与评论系统
- 自动化质量评估（静态分析、沙盒测试）
- 安全扫描与质量徽章
- CodeMirror 6 集成（语法高亮、自动补全）
- 文件管理器组件（上传、编辑、删除 Skill 附属文件）
- 编辑器/预览同步滚动

### 🔮 V1.2 — 高级编辑器与创建

- 4 步创建向导（基本信息 → 功能配置 → 指令编写 → 预览确认）
- 双模式编辑器：表单模式（结构化章节）+ 代码模式（CodeMirror）
- Skill 验证引擎：实时格式/内容/质量检查（30+ 条规则）
- 描述质量评分器（触发短语检测）
- 结构化预览（渐进式披露模拟）
- 版本管理（差异对比与回滚）
- 社区 Skill Fork 功能
- 8 个官方模板（空白、Prompt、Web 爬虫、API 集成、数据分析、代码生成、文档处理、多工具工作流）

### 🚀 V2.0 — 框架集成

- 与 LangChain、CrewAI 等 Agent 框架一键集成
- Skill 依赖管理与解析
- 多格式转换（SKILL.md ↔ GPT Actions ↔ LangChain Tools）
- AI 辅助创建：描述优化、指令生成、示例生成、触发词建议
- 社区模板市场（使用统计与评分）

### 🌐 V3.0 — 生态与企业版

- 开发者社区与贡献激励机制
- 企业版私有化部署
- 团队协作与权限管理
- 商业化市场探索（收益分成）
- GitLab / Bitbucket 数据源适配器
- 数据导入/导出（JSON、CSV 批量操作）

---

## 设计

Skill MarketPlace 使用 **Obsidian Forge** 暗色主题：

- 主色：`#6366f1`（Indigo 靛蓝）
- 强调色：`#22d3ee`（Cyan 青色）
- 背景：基于 OKLCH 的暗色调色板
- 字体：Inter + JetBrains Mono

设计规范和 UI 切图位于 [`docs/`](docs/) 目录。

---

## 贡献

欢迎贡献！请先提 Issue 讨论你想要的改动。

---

## 许可证

Apache-2.0 license
