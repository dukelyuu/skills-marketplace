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

<h1 align="center">🛠️ SkillHub — 世界初の AI エージェントスキルマーケットプレイス</h1>

<p align="center">
  <strong>主要な IDE とエージェントプラットフォーム全体で、AI エージェントスキルを発見・管理・共有。</strong>
</p>

<p align="center">
  <a href="https://www.skill-marketplace.com">ライブデモ</a> ·
  <a href="#機能">機能</a> ·
  <a href="#技術スタック">技術スタック</a> ·
  <a href="#はじめに">はじめに</a> ·
  <a href="#デプロイ">デプロイ</a> ·
  <a href="#ロードマップ">ロードマップ</a>
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

## SkillHub とは？

SkillHub は、**AI エージェントスキル**のために特別に構築された世界初のオープンソースマーケットプレイスです。
AI エージェントスキルとは、Claude Code、Kiro、Cursor、Windsurf、GitHub Copilot、Cline などのコーディングエージェントを動かす、再利用可能で組み合わせ可能なビルディングブロックです。

**エージェントスキルの npm** と考えてください：厳選されたカタログを閲覧し、SKILL.md 定義を確認し、ワンクリックでエージェントにインポートし、レジストリにデータを供給する GitHub ソースを管理 — すべてを美しいダークモード UI で実現します。

---

## 機能

### 🏪 スキルマーケットプレイス
- SQLite FTS5 による全文検索
- ソース、タグ、言語、ソート順による多次元フィルタリング
- Grid / List ビュー切り替え、Framer Motion のスムーズなアニメーション
- Star 数ベースの Top 20 ランキングサイドバー
- `⌘K` キーボードショートカットで即座に検索フォーカス
- 無限スクロールページネーション

### 📄 スキル詳細
- シンタックスハイライト付き SKILL.md リッチレンダリング（Streamdown）
- Star 履歴チャート（Recharts）
- 変更ログ付きバージョン履歴タイムライン
- ファイルツリーエクスプローラー
- 関連スキル推薦（タグ重複アルゴリズム）
- ワンクリック ZIP ダウンロード（JSZip）— SKILL.md、skill.json、README を含む

### ✏️ スキルエディタ
- ライブプレビュー付き分割ペイン Markdown エディタ（react-resizable-panels）
- ツールバー：太字、斜体、コード、リンク、画像、見出し、リスト、テーブル
- YAML フロントマター検証バッジ
- テンプレートウィザード：6 つのスターターテンプレート × 2 ステップガイド
- `.skill.md` ファイルのインポート/エクスポート
- フルスクリーンモード、文字数/行数カウント

### 🖥️ マルチプラットフォーム対応
- スキルはフロントマターで互換性のある IDE/エージェントプラットフォームを宣言
- 12 プラットフォームをすぐにサポート：
  **Claude Code · Kiro · Cursor · Windsurf · GitHub Copilot · Cline · Antigravity · OpenCraw · CodeBuddy · Augment · Roo Code · Trae**
- カード、リストアイテム、詳細ページにプラットフォームバッジを表示

### 📡 ソース管理
- GitHub リポジトリと Awesome List をスキルソースとして追加
- 3 秒ポーリングによるリアルタイム同期ステータス
- ソースごとの同期ログタイムライン
- 行レベル操作：同期、編集、GitHub で開く、削除
- プッシュトリガー同期のための HMAC-SHA256 Webhook 検証

### 🔍 自動発見エンジン
- GitHub Search API 統合 — Star 数、トピック、キーワードでスキルリポジトリを発見
- Awesome List パーサー — キュレーションリストをクロールしてリポジトリリンクを抽出
- ワンクリック「フルディスカバリー」— 複数のクエリとリストを並列スキャン
- 検索クエリと Awesome List URL の設定可能なプリセット

### 📊 システムダッシュボード
- 4 つの統計カード：スキル総数、アクティブソース、ダウンロード数、API クォータ
- 同期アクティビティエリアチャート
- API クォータドーナツチャート
- 人気タグ水平バーチャート
- Star 分布パイチャート

### ⚙️ 設定
- GitHub トークン管理（接続テスト付き）
- Cron ベースの同期スケジューリング（プリセット + カスタム式）
- 並列同期ジョブの同時実行制御

### 🧪 品質とテスト
- 25 のバックエンドテスト（pytest）— すべてパス
- 15 のフロントエンドスモークテスト（Vitest）— すべてパス
- TypeScript 厳格モード — エラーゼロ
- クリーンな Vite プロダクションビルド

---

## スクリーンショット

| マーケットプレイス | スキル詳細 |
|:-:|:-:|
| ![Marketplace](docs/ui-slices/00-original-designs/01_skill_marketplace.png) | ![Detail](docs/ui-slices/00-original-designs/02_skill_detail.png) |

| ソース管理 | スキルエディタ |
|:-:|:-:|
| ![Sources](docs/ui-slices/00-original-designs/03_source_management.png) | ![Editor](docs/ui-slices/00-original-designs/04_skill_editor.png) |

| ダッシュボード |
|:-:|
| ![Dashboard](docs/ui-slices/00-original-designs/05_system_dashboard.png) |

---

## 技術スタック

### フロントエンド
| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19.2 + TypeScript 5.6 |
| ルーティング | wouter 3.3 |
| UI コンポーネント | shadcn/ui (Radix + Tailwind CSS 4.1) |
| アニメーション | Framer Motion 12 |
| チャート | Recharts 2.15 |
| Markdown | Streamdown 1.4 |
| HTTP クライアント | Axios 1.12 |
| ビルド | Vite 7.1 + pnpm 10 |

### バックエンド
| レイヤー | 技術 |
|---|---|
| フレームワーク | FastAPI 0.115 + Uvicorn 0.34 |
| ORM | SQLModel 0.0.22 (SQLAlchemy 2.x) |
| データベース | SQLite + FTS5 全文検索 |
| スケジューラ | APScheduler 3.10 |
| GitHub 統合 | httpx 0.28 (REST + GraphQL) |
| 設定 | pydantic-settings 2.7 + .env |

### インフラストラクチャ
| レイヤー | 技術 |
|---|---|
| フロントエンドホスティング | Cloudflare Pages |
| バックエンドホスティング | Fly.io（シンガポール） |
| コンテナ化 | Docker + docker-compose |
| リバースプロキシ | Nginx |

---

## はじめに

### 前提条件

- Node.js 18+ と pnpm
- Python 3.11+
- （オプション）同期/発見機能用の GitHub Personal Access Token

### 1. リポジトリをクローン

```bash
git clone https://github.com/dukelyuu/skills-marketplace.git
cd skills-marketplace
```

### 2. バックエンドを起動

```bash
cd backend
cp .env.example .env
# .env を編集 — 同期/発見機能が必要な場合は GITHUB_TOKEN を設定
pip install -r requirements.txt
python -m app.seed          # 6 ソース、40 スキル、18 タグを初期化
uvicorn app.main:app --port 8000
```

バックエンドは `http://localhost:8000` で起動。API ドキュメントは `http://localhost:8000/docs`。

### 3. フロントエンドを起動

```bash
cd src
pnpm install
pnpm run dev
```

フロントエンドは `http://localhost:3000` で起動、API リクエストはバックエンドにプロキシされます。

### 4. （代替）Docker Compose

```bash
docker-compose up --build
```

`http://localhost:3000` でアクセス、バックエンドは `http://localhost:8000`。

---

## デプロイ

SkillHub はフロントエンドとバックエンドを分離してデプロイします：

- **フロントエンド** → Cloudflare Pages（静的 SPA）
- **バックエンド** → Fly.io（FastAPI + SQLite 永続ボリューム）

```bash
# すべてをデプロイ
./deploy/deploy.sh all

# または個別にデプロイ
./deploy/deploy.sh backend
./deploy/deploy.sh frontend
```

詳細なデプロイ手順は [`deploy/README.md`](deploy/README.md) を参照してください。

---

## プロジェクト構成

```
skill-hub/
├── src/                        # フロントエンド（React + TypeScript）
│   └── client/src/
│       ├── components/         # 再利用可能な UI コンポーネント
│       ├── hooks/              # React Hooks（useSkills、useSources など）
│       ├── lib/                # API クライアント、型定義、定数
│       └── pages/              # 8 つのページコンポーネント
├── backend/                    # バックエンド（FastAPI + Python）
│   ├── app/
│   │   ├── api/                # ルートハンドラ
│   │   ├── models/             # SQLModel データモデル
│   │   ├── schemas/            # Pydantic リクエスト/レスポンススキーマ
│   │   ├── services/           # ビジネスロジック
│   │   └── tasks/              # APScheduler ジョブ
│   └── tests/                  # pytest テストスイート
├── deploy/                     # デプロイ設定
│   ├── deploy.sh               # ワンコマンドデプロイスクリプト
│   ├── fly.toml                # Fly.io 設定
│   └── cloudflare/             # Cloudflare Pages headers/redirects
├── docs/                       # 設計ドキュメント、UI スライス、仕様
└── docker-compose.yml
```

---

## ロードマップ

SkillHub は段階的な開発計画に従っています。現在の V1.0 リリースはコアマーケットプレイス、ソース管理、エディタ、ダッシュボード、デプロイインフラをカバーしています。今後のバージョンでは、プラットフォームを完全な Skill エコシステムに拡張します。

### ✅ V1.0 — コアプラットフォーム（現在）

- Skill マーケットプレイス：FTS5 全文検索、マルチフィルター、Grid/List ビュー、Top 20 ランキング
- Skill 詳細：SKILL.md レンダリング、Star 推移グラフ、バージョンタイムライン、ファイルツリー、ZIP ダウンロード
- ソース管理：GitHub リポジトリ / Awesome List 対応、同期エンジン、Webhook 連携
- Skill エディタ：分割ペイン Markdown 編集、テンプレートウィザード、YAML バリデーション、エクスポート
- システムダッシュボード：統計カード、同期アクティビティ、API クォータ、タグ/Star 分布チャート
- 自動発見エンジン（GitHub Search + Awesome List パーサー）
- 設定：GitHub Token 管理、Cron スケジューリング、並行制御
- マルチプラットフォーム対応（12 IDE/Agent）、i18n（7 言語）
- デプロイ：Cloudflare Pages（フロントエンド）+ Fly.io（バックエンド）
- 25 バックエンドテスト + 15 フロントエンドテスト、TypeScript strict モード、クリーンビルド

### 🚧 V1.1 — コミュニティと品質

- ユーザー登録・ログインシステム
- 個人お気に入り/コレクション
- Skill 評価・レビューシステム
- 自動品質評価（静的解析、サンドボックステスト）
- セキュリティスキャンと品質バッジ
- CodeMirror 6 統合（シンタックスハイライト、オートコンプリート）
- ファイルマネージャーコンポーネント（アップロード、編集、削除）
- エディタ/プレビュー同期スクロール

### 🔮 V1.2 — 高度なエディタと作成機能

- 4 ステップ作成ウィザード（基本情報 → 機能設定 → 指示作成 → プレビュー）
- デュアルモードエディタ：フォームモード + コードモード（CodeMirror）
- Skill バリデーションエンジン：リアルタイム形式/内容/品質チェック（30+ ルール）
- 説明品質スコアラー（トリガーフレーズ検出）
- 構造化プレビュー（段階的開示シミュレーション）
- バージョン管理（差分比較とロールバック）
- コミュニティ Skill Fork 機能
- 8 つの公式テンプレート

### 🚀 V2.0 — フレームワーク統合

- LangChain、CrewAI 等の Agent フレームワークとのワンクリック統合
- Skill 依存関係管理
- マルチフォーマット変換（SKILL.md ↔ GPT Actions ↔ LangChain Tools）
- AI 支援作成：説明最適化、指示生成、例生成、トリガーワード提案
- コミュニティテンプレートマーケットプレイス

### 🌐 V3.0 — エコシステムとエンタープライズ

- 開発者コミュニティと貢献インセンティブ
- エンタープライズ版プライベートデプロイ
- チームコラボレーションと権限管理
- 商用マーケットプレイス探索（収益分配）
- GitLab / Bitbucket ソースアダプター
- データインポート/エクスポート（JSON、CSV 一括操作）

---

## デザイン

SkillHub は **Obsidian Forge** ダークテーマを使用：

- プライマリ：`#6366f1`（Indigo）
- アクセント：`#22d3ee`（Cyan）
- 背景：OKLCH ベースのダークパレット
- タイポグラフィ：Inter + JetBrains Mono

デザイン仕様と UI スライスは [`docs/`](docs/) ディレクトリにあります。

---

## コントリビューション

コントリビューション歓迎です！まず Issue を作成して、変更内容について議論してください。

---

## ライセンス

Apache-2.0 license