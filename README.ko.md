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

<h1 align="center">🛠️ Skill MarketPlace — 세계 최초의 AI 에이전트 스킬 마켓플레이스</h1>

<p align="center">
  <strong>모든 주요 IDE와 에이전트 플랫폼에서 AI 에이전트 스킬을 발견, 관리, 공유하세요.</strong>
</p>

<p align="center">
  <a href="https://www.skill-marketplace.com">라이브 데모</a> ·
  <a href="#기능">기능</a> ·
  <a href="#기술-스택">기술 스택</a> ·
  <a href="#시작하기">시작하기</a> ·
  <a href="#배포">배포</a> ·
  <a href="#로드맵">로드맵</a>
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

## Skill MarketPlace이란?

Skill MarketPlace은 **AI 에이전트 스킬**을 위해 특별히 구축된 세계 최초의 오픈소스 마켓플레이스입니다. AI 에이전트 스킬은 Claude Code, Kiro, Cursor, Windsurf, GitHub Copilot, Cline 등의 코딩 에이전트를 구동하는 재사용 가능하고 조합 가능한 빌딩 블록입니다.

**에이전트 스킬의 npm**이라고 생각하세요: 엄선된 카탈로그를 탐색하고, SKILL.md 정의를 확인하고, 원클릭으로 에이전트에 가져오고, 레지스트리에 데이터를 공급하는 GitHub 소스를 관리 — 모든 것을 아름다운 다크 모드 UI에서 수행합니다.

---

## 기능

### 🏪 스킬 마켓플레이스
- SQLite FTS5 기반 전문 검색
- 소스, 태그, 언어, 정렬 순서별 다차원 필터링
- Grid / List 뷰 전환, Framer Motion 부드러운 애니메이션
- Star 기반 Top 20 랭킹 사이드바
- `⌘K` 키보드 단축키로 즉시 검색 포커스
- 무한 스크롤 페이지네이션

### 📄 스킬 상세
- 구문 강조 코드 블록이 포함된 SKILL.md 리치 렌더링 (Streamdown)
- Star 히스토리 차트 (Recharts)
- 변경 로그가 포함된 버전 히스토리 타임라인
- 파일 트리 탐색기
- 관련 스킬 추천 (태그 중복 알고리즘)
- 원클릭 ZIP 다운로드 (JSZip) — SKILL.md, skill.json, README 포함

### ✏️ 스킬 에디터
- 실시간 미리보기가 있는 분할 패널 Markdown 에디터 (react-resizable-panels)
- 툴바: 굵게, 기울임, 코드, 링크, 이미지, 제목, 목록, 표
- YAML 프론트매터 유효성 검사 배지
- 템플릿 마법사: 6개 스타터 템플릿 × 2단계 가이드 플로우
- `.skill.md` 파일 가져오기/내보내기
- 전체 화면 모드, 단어/줄 수 카운트

### 🖥️ 멀티 플랫폼 지원
- 스킬이 프론트매터에서 호환 IDE/에이전트 플랫폼을 선언
- 12개 플랫폼 기본 지원:
  **Claude Code · Kiro · Cursor · Windsurf · GitHub Copilot · Cline · Antigravity · OpenCraw · CodeBuddy · Augment · Roo Code · Trae**
- 카드, 리스트 아이템, 상세 페이지에 플랫폼 배지 표시

### 📡 소스 관리
- GitHub 저장소와 Awesome List를 스킬 소스로 추가
- 3초 폴링으로 실시간 동기화 상태 확인
- 소스별 동기화 로그 타임라인
- 행 수준 작업: 동기화, 편집, GitHub에서 열기, 삭제
- 푸시 트리거 동기화를 위한 HMAC-SHA256 Webhook 검증

### 🔍 자동 발견 엔진
- GitHub Search API 통합 — Star 수, 토픽, 키워드로 스킬 저장소 발견
- Awesome List 파서 — 큐레이션 목록을 크롤링하여 저장소 링크 추출
- 원클릭 "전체 발견" — 여러 쿼리와 목록을 병렬 스캔
- 검색 쿼리 및 Awesome List URL 설정 가능한 프리셋

### 📊 시스템 대시보드
- 4개 통계 카드: 총 스킬 수, 활성 소스, 다운로드 수, API 쿼터
- 동기화 활동 영역 차트
- API 쿼터 도넛 차트
- 인기 태그 수평 막대 차트
- Star 분포 파이 차트

### ⚙️ 설정
- GitHub 토큰 관리 (연결 테스트 포함)
- Cron 기반 동기화 스케줄링 (프리셋 + 커스텀 표현식)
- 병렬 동기화 작업 동시 실행 제어

### 🧪 품질 및 테스트
- 25개 백엔드 테스트 (pytest) — 모두 통과
- 15개 프론트엔드 스모크 테스트 (Vitest) — 모두 통과
- TypeScript 엄격 모드 — 에러 제로
- 깨끗한 Vite 프로덕션 빌드

---

## 스크린샷

| 마켓플레이스 | 스킬 상세 |
|:-:|:-:|
| ![Marketplace](docs/ui-slices/00-original-designs/01_skill_marketplace.png) | ![Detail](docs/ui-slices/00-original-designs/02_skill_detail.png) |

| 소스 관리 | 스킬 에디터 |
|:-:|:-:|
| ![Sources](docs/ui-slices/00-original-designs/03_source_management.png) | ![Editor](docs/ui-slices/00-original-designs/04_skill_editor.png) |

| 대시보드 |
|:-:|
| ![Dashboard](docs/ui-slices/00-original-designs/05_system_dashboard.png) |

---

## 기술 스택

### 프론트엔드
| 레이어 | 기술 |
|---|---|
| 프레임워크 | React 19.2 + TypeScript 5.6 |
| 라우팅 | wouter 3.3 |
| UI 컴포넌트 | shadcn/ui (Radix + Tailwind CSS 4.1) |
| 애니메이션 | Framer Motion 12 |
| 차트 | Recharts 2.15 |
| Markdown | Streamdown 1.4 |
| HTTP 클라이언트 | Axios 1.12 |
| 빌드 | Vite 7.1 + pnpm 10 |

### 백엔드
| 레이어 | 기술 |
|---|---|
| 프레임워크 | FastAPI 0.115 + Uvicorn 0.34 |
| ORM | SQLModel 0.0.22 (SQLAlchemy 2.x) |
| 데이터베이스 | SQLite + FTS5 전문 검색 |
| 스케줄러 | APScheduler 3.10 |
| GitHub 통합 | httpx 0.28 (REST + GraphQL) |
| 설정 | pydantic-settings 2.7 + .env |

### 인프라
| 레이어 | 기술 |
|---|---|
| 프론트엔드 호스팅 | Cloudflare Pages |
| 백엔드 호스팅 | Fly.io (싱가포르) |
| 컨테이너화 | Docker + docker-compose |
| 리버스 프록시 | Nginx |

---

## 시작하기

### 사전 요구 사항

- Node.js 18+ 및 pnpm
- Python 3.11+
- (선택) 동기화/발견 기능을 위한 GitHub Personal Access Token

### 1. 저장소 클론

```bash
git clone https://github.com/dukelyuu/skills-marketplace.git
cd skills-marketplace
```

### 2. 백엔드 시작

```bash
cd backend
cp .env.example .env
# .env 편집 — 동기화/발견 기능이 필요하면 GITHUB_TOKEN 설정
pip install -r requirements.txt
python -m app.seed          # 6개 소스, 40개 스킬, 18개 태그 초기화
uvicorn app.main:app --port 8000
```

백엔드는 `http://localhost:8000`에서 실행. API 문서는 `http://localhost:8000/docs`.

### 3. 프론트엔드 시작

```bash
cd src
pnpm install
pnpm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행, API 요청은 백엔드로 프록시됩니다.

### 4. (대안) Docker Compose

```bash
docker-compose up --build
```

`http://localhost:3000`에서 접속, 백엔드는 `http://localhost:8000`.

---

## 배포

Skill MarketPlace은 프론트엔드와 백엔드를 분리하여 배포합니다:

- **프론트엔드** → Cloudflare Pages (정적 SPA)
- **백엔드** → Fly.io (FastAPI + SQLite 영구 볼륨)

```bash
# 전체 배포
./deploy/deploy.sh all

# 또는 개별 배포
./deploy/deploy.sh backend
./deploy/deploy.sh frontend
```

자세한 배포 안내는 [`deploy/README.md`](deploy/README.md)를 참조하세요.

---

## 프로젝트 구조

```
skill-hub/
├── src/                        # 프론트엔드 (React + TypeScript)
│   └── client/src/
│       ├── components/         # 재사용 가능한 UI 컴포넌트
│       ├── hooks/              # React Hooks (useSkills, useSources 등)
│       ├── lib/                # API 클라이언트, 타입 정의, 상수
│       └── pages/              # 8개 페이지 컴포넌트
├── backend/                    # 백엔드 (FastAPI + Python)
│   ├── app/
│   │   ├── api/                # 라우트 핸들러
│   │   ├── models/             # SQLModel 데이터 모델
│   │   ├── schemas/            # Pydantic 요청/응답 스키마
│   │   ├── services/           # 비즈니스 로직
│   │   └── tasks/              # APScheduler 작업
│   └── tests/                  # pytest 테스트 스위트
├── deploy/                     # 배포 설정
│   ├── deploy.sh               # 원커맨드 배포 스크립트
│   ├── fly.toml                # Fly.io 설정
│   └── cloudflare/             # Cloudflare Pages headers/redirects
├── docs/                       # 설계 문서, UI 슬라이스, 사양
└── docker-compose.yml
```

---

## 로드맵

Skill MarketPlace은 단계적 개발 계획을 따릅니다. 현재 V1.0 릴리스는 핵심 마켓플레이스, 소스 관리, 에디터, 대시보드 및 배포 인프라를 포함합니다. 향후 버전에서는 플랫폼을 완전한 Skill 생태계로 확장합니다.

### ✅ V1.0 — 핵심 플랫폼 (현재)

- Skill 마켓플레이스: FTS5 전문 검색, 다차원 필터, Grid/List 뷰, Top 20 랭킹
- Skill 상세: SKILL.md 렌더링, Star 추이 차트, 버전 타임라인, 파일 트리, ZIP 다운로드
- 소스 관리: GitHub 저장소 / Awesome List 지원, 동기화 엔진, Webhook 연동
- Skill 에디터: 분할 패널 Markdown 편집, 템플릿 마법사, YAML 검증, 내보내기
- 시스템 대시보드: 통계 카드, 동기화 활동, API 할당량, 태그/Star 분포 차트
- 자동 발견 엔진 (GitHub Search + Awesome List 파서)
- 설정: GitHub Token 관리, Cron 스케줄링, 동시성 제어
- 멀티 플랫폼 지원 (12개 IDE/Agent), i18n (7개 언어)
- 배포: Cloudflare Pages (프론트엔드) + Fly.io (백엔드)
- 25개 백엔드 테스트 + 15개 프론트엔드 테스트, TypeScript strict 모드, 클린 빌드

### 🚧 V1.1 — 커뮤니티 및 품질

- 사용자 등록 및 로그인 시스템
- 개인 즐겨찾기/컬렉션
- Skill 평점 및 리뷰 시스템
- 자동화 품질 평가 (정적 분석, 샌드박스 테스트)
- 보안 스캔 및 품질 배지
- CodeMirror 6 통합 (구문 강조, 자동 완성)
- 파일 관리자 컴포넌트 (업로드, 편집, 삭제)
- 에디터/미리보기 동기화 스크롤

### 🔮 V1.2 — 고급 에디터 및 생성

- 4단계 생성 마법사 (기본 정보 → 기능 설정 → 지시 작성 → 미리보기)
- 듀얼 모드 에디터: 폼 모드 (구조화된 섹션) + 코드 모드 (CodeMirror)
- Skill 검증 엔진: 실시간 형식/내용/품질 검사 (30+ 규칙)
- 설명 품질 스코어러 (트리거 문구 감지)
- 구조화 미리보기 (점진적 공개 시뮬레이션)
- 버전 관리 (차이 비교 및 롤백)
- 커뮤니티 Skill Fork 기능
- 8개 공식 템플릿

### 🚀 V2.0 — 프레임워크 통합

- LangChain, CrewAI 등 Agent 프레임워크와 원클릭 통합
- Skill 의존성 관리
- 멀티 포맷 변환 (SKILL.md ↔ GPT Actions ↔ LangChain Tools)
- AI 지원 생성: 설명 최적화, 지시 생성, 예제 생성, 트리거 워드 제안
- 커뮤니티 템플릿 마켓플레이스

### 🌐 V3.0 — 생태계 및 엔터프라이즈

- 개발자 커뮤니티 및 기여 인센티브
- 엔터프라이즈 에디션 프라이빗 배포
- 팀 협업 및 권한 관리
- 상업화 마켓플레이스 탐색 (수익 분배)
- GitLab / Bitbucket 소스 어댑터
- 데이터 가져오기/내보내기 (JSON, CSV 대량 작업)

---

## 디자인

Skill MarketPlace은 **Obsidian Forge** 다크 테마를 사용합니다:

- 프라이머리: `#6366f1` (Indigo)
- 액센트: `#22d3ee` (Cyan)
- 배경: OKLCH 기반 다크 팔레트
- 타이포그래피: Inter + JetBrains Mono

디자인 사양과 UI 슬라이스는 [`docs/`](docs/) 디렉토리에 있습니다.

---

## 기여

기여를 환영합니다! 먼저 Issue를 생성하여 변경하고 싶은 내용을 논의해 주세요.

---

## 라이선스

Apache-2.0 license