# GeoSignal MVP — Repo Pack

---

## 1) TREE

```
geosignal/
├── apps/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── vite-env.d.ts
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── SignalDetail.tsx
│   │   │   │   ├── Chains.tsx
│   │   │   │   └── RunSettings.tsx
│   │   │   ├── components/
│   │   │   │   ├── SignalCard.tsx
│   │   │   │   ├── EvidenceList.tsx
│   │   │   │   ├── DiffBadge.tsx
│   │   │   │   ├── ChainGraph.tsx
│   │   │   │   └── RunMeter.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   └── types.ts
│   │   │   └── fixtures/
│   │   │       ├── signals.json
│   │   │       ├── sources.json
│   │   │       └── runs.json
│   │   ├── public/
│   │   │   └── favicon.svg
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── jobs/
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── signals.ts
│       │   │   ├── chains.ts
│       │   │   ├── runs.ts
│       │   │   └── sources.ts
│       │   ├── jobs/
│       │   │   ├── collect.ts
│       │   │   ├── extract.ts
│       │   │   ├── cluster.ts
│       │   │   ├── signal.ts
│       │   │   └── index-update.ts
│       │   ├── lib/
│       │   │   ├── db.ts
│       │   │   ├── jst.ts
│       │   │   ├── rss.ts
│       │   │   ├── html.ts
│       │   │   ├── dedupe.ts
│       │   │   ├── llm.ts
│       │   │   └── types.ts
│       │   └── middleware/
│       │       └── auth.ts
│       ├── wrangler.toml
│       ├── tsconfig.json
│       └── package.json
│
├── cli/
│   ├── src/
│   │   ├── index.ts
│   │   ├── commands/
│   │   │   ├── plan.ts
│   │   │   ├── collect.ts
│   │   │   ├── extract.ts
│   │   │   ├── signal.ts
│   │   │   └── run.ts
│   │   └── lib/
│   │       ├── api.ts
│   │       └── config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── index.ts
│       │   ├── types.ts
│       │   ├── constants.ts
│       │   └── jst.ts
│       ├── tsconfig.json
│       └── package.json
│
├── docs/
│   └── handoff/
│       └── decisions.md
│
├── tools/
│   └── unpack-repopack.mjs
│
├── schema.sql
├── .dev.vars.example
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 2) FILES

### package.json
```json
{
  "name": "geosignal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev:ui": "pnpm --filter @geosignal/ui dev",
    "dev:jobs": "pnpm --filter @geosignal/jobs dev",
    "build:ui": "pnpm --filter @geosignal/ui build",
    "build:jobs": "pnpm --filter @geosignal/jobs build",
    "deploy:ui": "pnpm --filter @geosignal/ui deploy",
    "deploy:jobs": "pnpm --filter @geosignal/jobs deploy",
    "cli": "pnpm --filter @geosignal/cli start",
    "cli:plan": "pnpm --filter @geosignal/cli start -- plan",
    "cli:run": "pnpm --filter @geosignal/cli start -- run",
    "cli:run:dry": "pnpm --filter @geosignal/cli start -- run --dry-run",
    "db:migrate": "wrangler d1 execute geosignal-db --file=./schema.sql",
    "db:migrate:local": "wrangler d1 execute geosignal-db --local --file=./schema.sql"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'cli'
  - 'packages/*'
```

### .gitignore
```
# Dependencies
node_modules/
.pnpm-store/

# Build
dist/
.wrangler/

# Environment
.env
.env.*
!.env.example
.dev.vars
!.dev.vars.example

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Local D1
.wrangler/state/
```

### .dev.vars.example
```bash
# Cloudflare D1 (wrangler dev uses local SQLite)
# No secrets needed for local dev

# API認証 (本番用、ローカルでは不要)
CRON_SECRET=your-random-secret-here

# 課金安全設定
MAX_RAW_PER_DAY=200
MAX_DEEP_PER_RUN=10
LLM_MODE=off

# OpenAI (on_demand時のみ使用、デフォはOFFなので不要)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

### .env.example
```bash
# UI開発用
VITE_USE_FIXTURES=true
VITE_API_BASE_URL=http://localhost:8787

# CLI用
GS_API_URL=http://localhost:8787
GS_CRON_SECRET=your-random-secret-here
```

### README.md
```markdown
# GeoSignal MVP

地政学リスク監視システム — 台湾海峡・米中・日本・渡航リスクを早期検知

## アーキテクチャ

| レイヤー | 技術 | 役割 |
|---------|------|------|
| UI | Cloudflare Pages (Vite + React) | 4画面SPA |
| API/Jobs | Cloudflare Workers | REST API + バックグラウンド処理 |
| DB | Cloudflare D1 (SQLite) | シグナル・ソース・実行履歴 |
| CLI | Node.js + tsx | 手動実行（デフォルト） |

## 課金安全設計

- `MAX_RAW_PER_DAY=200`: JST日次で強制停止
- `MAX_DEEP_PER_RUN=10`: LLM実行上限
- `LLM_MODE=off`: デフォルトOFF（課金ゼロ）
- Cron: デフォルトOFF（手動実行推奨）

## セットアップ

### 1. 依存パッケージ

```bash
pnpm install
```

### 2. D1データベース作成

```bash
# 本番用
wrangler d1 create geosignal-db
# → 出力されるdatabase_idをapps/jobs/wrangler.tomlに設定

# ローカル用（自動作成）
pnpm db:migrate:local
```

### 3. 環境変数

```bash
cp .dev.vars.example apps/jobs/.dev.vars
cp .env.example .env
```

### 4. Secrets設定（本番のみ）

```bash
cd apps/jobs
wrangler secret put CRON_SECRET
wrangler secret put OPENAI_API_KEY  # LLM_MODE=on_demand時のみ
```

## 開発

### UI（フロントエンド）

```bash
# fixturesでモック動作
pnpm dev:ui
# → http://localhost:5173
```

### Jobs（API/Workers）

```bash
pnpm dev:jobs
# → http://localhost:8787
```

### 両方同時

```bash
pnpm dev:ui & pnpm dev:jobs
```

## CLI使用方法

```bash
# 見積もり表示
pnpm cli:plan

# 全工程実行（dry-run = 書き込みなし）
pnpm cli:run:dry

# 全工程実行（本番）
pnpm cli:run

# 個別コマンド
pnpm cli -- collect --dry-run
pnpm cli -- extract --dry-run
pnpm cli -- signal --dry-run
```

## LLM_MODE=off の課金ゼロ確認

```bash
# 1. 環境変数確認
grep LLM_MODE apps/jobs/.dev.vars
# → LLM_MODE=off であること

# 2. CLI実行
pnpm cli:run:dry

# 3. ログ確認
# → "LLM: OFF" が表示されること
# → OpenAI APIへのリクエストがないこと
```

## デプロイ

```bash
# UI (Cloudflare Pages)
pnpm deploy:ui

# Jobs (Cloudflare Workers)
pnpm deploy:jobs
```

## 設計原則

1. **監査性**: 根拠リンク必須、DBに保存されたURLのみ使用
2. **推測ラベル**: FACTとINFERENCEを分離
3. **説明可能**: スコア上昇理由はscore_components diffで説明
4. **LLMはOFF**: デフォルト課金ゼロ、on_demandは文章整形のみ

## ライセンス

Private
```

### schema.sql
```sql
-- ============================================
-- GeoSignal MVP - D1 Schema
-- ============================================

-- Sources (情報ソース)
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'html', 'api')),
  url TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 2,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Raw Items (収集生データ)
CREATE TABLE IF NOT EXISTS raw_items (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  published_at TEXT,
  fetched_at TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  date_jst TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processed', 'error')),
  UNIQUE(source_id, content_hash),
  FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX IF NOT EXISTS idx_raw_items_date ON raw_items(date_jst);
CREATE INDEX IF NOT EXISTS idx_raw_items_status ON raw_items(status);
CREATE INDEX IF NOT EXISTS idx_raw_items_hash ON raw_items(content_hash);

-- Clusters (クラスタリング結果)
CREATE TABLE IF NOT EXISTS clusters (
  id TEXT PRIMARY KEY,
  representative_title TEXT,
  item_count INTEGER DEFAULT 0,
  date_jst TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clusters_date ON clusters(date_jst);

-- Cluster Items (クラスタ-アイテム紐付け)
CREATE TABLE IF NOT EXISTS cluster_items (
  cluster_id TEXT NOT NULL,
  raw_item_id TEXT NOT NULL,
  PRIMARY KEY (cluster_id, raw_item_id),
  FOREIGN KEY (cluster_id) REFERENCES clusters(id),
  FOREIGN KEY (raw_item_id) REFERENCES raw_items(id)
);

-- Signals
CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  cluster_id TEXT,
  date_jst TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  labels TEXT NOT NULL DEFAULT '["FACT"]',
  score INTEGER NOT NULL DEFAULT 0,
  score_components TEXT NOT NULL DEFAULT '{}',
  why_up TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL,
  polished_at TEXT,
  FOREIGN KEY (cluster_id) REFERENCES clusters(id)
);

CREATE INDEX IF NOT EXISTS idx_signals_date ON signals(date_jst);
CREATE INDEX IF NOT EXISTS idx_signals_score ON signals(score DESC);

-- Signal Evidence (根拠リンク)
CREATE TABLE IF NOT EXISTS signal_evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  signal_id TEXT NOT NULL,
  url TEXT NOT NULL,
  source_id TEXT,
  title TEXT,
  quote TEXT,
  evidence_type TEXT DEFAULT 'news' CHECK (evidence_type IN ('official', 'news', 'social')),
  FOREIGN KEY (signal_id) REFERENCES signals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_evidence_signal ON signal_evidence(signal_id);

-- Runs (実行履歴)
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('manual', 'cron')),
  dry_run INTEGER NOT NULL DEFAULT 1,
  llm_mode TEXT NOT NULL DEFAULT 'off',
  max_raw_per_day INTEGER NOT NULL DEFAULT 200,
  raw_used_today INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'error')),
  meta TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_runs_started ON runs(started_at DESC);

-- Daily Index (日次指数)
CREATE TABLE IF NOT EXISTS daily_index (
  id TEXT PRIMARY KEY,
  date_jst TEXT NOT NULL,
  theme TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  delta_24h INTEGER NOT NULL DEFAULT 0,
  top_contributors TEXT NOT NULL DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(date_jst, theme)
);

CREATE INDEX IF NOT EXISTS idx_daily_index_date ON daily_index(date_jst);

-- Initial Sources
INSERT OR IGNORE INTO sources (id, name, type, url, tier) VALUES
  ('bbc_world', 'BBC World', 'rss', 'http://feeds.bbci.co.uk/news/world/rss.xml', 2),
  ('guardian_asia', 'The Guardian Asia', 'rss', 'https://www.theguardian.com/world/asia/rss', 2),
  ('eu_council', 'EU Council Press', 'rss', 'https://www.consilium.europa.eu/en/rss/press-releases/', 1),
  ('un_news', 'UN News', 'rss', 'https://news.un.org/feed/subscribe/en/news/all/rss.xml', 1),
  ('state_dept', 'US State Dept Travel', 'html', 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html', 1);
```

### tools/unpack-repopack.mjs
```javascript
#!/usr/bin/env node
/**
 * unpack-repopack.mjs
 * Repo Pack形式のMarkdownからファイルを展開するスクリプト
 *
 * Usage:
 *   node tools/unpack-repopack.mjs < repopack.md
 *   cat repopack.md | node tools/unpack-repopack.mjs
 *   node tools/unpack-repopack.mjs --input=repopack.md --output=./out
 */

import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { createInterface } from 'readline';

const args = process.argv.slice(2);
let inputFile = null;
let outputDir = '.';

for (const arg of args) {
  if (arg.startsWith('--input=')) {
    inputFile = arg.slice(8);
  } else if (arg.startsWith('--output=')) {
    outputDir = arg.slice(9);
  }
}

async function ensureDir(filePath) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}

async function main() {
  let input;
  if (inputFile) {
    const { readFile } = await import('fs/promises');
    input = await readFile(inputFile, 'utf-8');
  } else {
    const chunks = [];
    const rl = createInterface({ input: process.stdin });
    for await (const line of rl) {
      chunks.push(line);
    }
    input = chunks.join('\n');
  }

  const filePattern = /^### (.+)\n```(\w*)\n([\s\S]*?)```$/gm;
  let match;
  let count = 0;

  while ((match = filePattern.exec(input)) !== null) {
    const [, filePath, , content] = match;
    const fullPath = join(outputDir, filePath.trim());

    await ensureDir(fullPath);
    await writeFile(fullPath, content);
    console.log(`✓ ${filePath}`);
    count++;
  }

  console.log(`\n✅ ${count} files extracted to ${outputDir}`);
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
```

### docs/handoff/decisions.md
```markdown
# decisions.md（GeoSignal MVP）

## 2025-12-29: UIはPages、API/収集はWorkersのハイブリッドで進める

- **Decision**: Cloudflare Pages（UI SPA） + Cloudflare Workers（API/Jobs） + CLI手動実行をデフォ
- **Why**:
  - 価値の初期立ち上げは「読む体験（UI）」が最重要
  - "ヒアリング→MVPを見せる"運用の練度を早期に上げる
  - Workers単体より、UI改善サイクルが速い

## 2025-12-29: Cronは実装してもデフォOFF

- **Decision**: Cron triggerは実装可能だが、初期はOFF（手動実行が主）
- **Why**:
  - コスト/暴発リスクを最小化
  - 監査性（いつ/誰が回したか）を担保しやすい

## 2025-12-29: LLM_MODEはデフォOFF、on_demandのみ

- **Decision**:
  - LLM_MODE=off をデフォ
  - on_demand時のみ GPT-4o mini を使用（文章整形のみ）
- **Constraints**:
  - 新しい事実・根拠URLの追加は禁止
  - 推測ラベル必須（INFERENCE）
- **Why**:
  - 監査性を壊さない
  - 課金ゼロ運用をデフォにする

## 2025-12-29: 情報源は「生きているRSS/公式発表」を優先

- **Decision**: 公式RSSやPress Releaseを軸にする（State Dept / EU Council / UN 等）
- **Note**: OFACはRSSを退役しているため、OFACをRSS前提にしない

## 2025-12-29: スコア上昇理由はDB差分で説明

- **Decision**: score_componentsをJSONで保存し、前日との差分をwhy_upとして生成
- **Why**:
  - 監査性（なぜ上がったかを後から追跡可能）
  - 説明可能性（UIで"寄与シグナル"を表示）

## 2025-12-29: 根拠リンクはDB保存分のみ

- **Decision**: signal_evidenceテーブルに保存されたURLのみを使用
- **Constraints**:
  - LLMが新しいURLを生成することを禁止
  - 必ずraw_items経由でDBに入ったURLを参照
- **Why**:
  - 幻覚URLの防止
  - 監査証跡の確保
```

### packages/shared/package.json
```json
{
  "name": "@geosignal/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

### packages/shared/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### packages/shared/src/index.ts
```typescript
export * from './types';
export * from './constants';
export * from './jst';
```

### packages/shared/src/types.ts
```typescript
export interface Signal {
  id: string;
  cluster_id?: string;
  date_jst: string;
  title: string;
  summary?: string;
  labels: ('FACT' | 'INFERENCE')[];
  score: number;
  score_components: ScoreComponents;
  why_up: WhyUp[];
  updated_at: string;
  polished_at?: string;
}

export interface ScoreComponents {
  source_mentions: number;
  cross_region: number;
  official_source: number;
  travel_related: number;
  recency: number;
}

export interface WhyUp {
  metric: string;
  prev: number;
  curr: number;
  delta: number;
}

export interface Evidence {
  id?: number;
  signal_id: string;
  url: string;
  source_id?: string;
  title?: string;
  quote?: string;
  evidence_type: 'official' | 'news' | 'social';
}

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'html' | 'api';
  url: string;
  tier: number;
  is_active: boolean;
  created_at?: string;
}

export interface RawItem {
  id: string;
  source_id: string;
  url: string;
  title?: string;
  content?: string;
  published_at?: string;
  fetched_at: string;
  content_hash: string;
  date_jst: string;
  status: 'new' | 'processed' | 'error';
}

export interface Cluster {
  id: string;
  representative_title?: string;
  item_count: number;
  date_jst: string;
  created_at?: string;
}

export interface Run {
  id: string;
  mode: 'manual' | 'cron';
  dry_run: boolean;
  llm_mode: 'off' | 'on_demand';
  max_raw_per_day: number;
  raw_used_today: number;
  started_at: string;
  finished_at?: string;
  status: 'running' | 'success' | 'error';
  meta?: Record<string, unknown>;
}

export interface DailyIndex {
  id: string;
  date_jst: string;
  theme: string;
  value: number;
  delta_24h: number;
  top_contributors: TopContributor[];
  created_at?: string;
}

export interface TopContributor {
  signal_id: string;
  title: string;
  points: number;
}

export interface ChainNode {
  id: string;
  signal_id: string;
  title: string;
  date: string;
  type: 'event' | 'statement' | 'sanction' | 'military';
}

export interface ChainEdge {
  from: string;
  to: string;
  label: string;
  is_inference: boolean;
}
```

### packages/shared/src/constants.ts
```typescript
export const THEMES = ['taiwan', 'us_cn_trade', 'japan_risk', 'travel'] as const;
export type Theme = typeof THEMES[number];

export const THEME_LABELS: Record<Theme, string> = {
  taiwan: '台湾',
  us_cn_trade: '米中',
  japan_risk: '日本',
  travel: '渡航',
};

export const TRAVEL_SIGNAL_TYPES = [
  'embassy_consular',
  'advisory',
  'visa_entry',
  'aviation',
  'payments_finance',
  'insurance',
  'none',
] as const;
export type TravelSignalType = typeof TRAVEL_SIGNAL_TYPES[number];

export const TRAVEL_TYPE_LABELS: Record<TravelSignalType, string> = {
  embassy_consular: '大使館・領事館',
  advisory: '渡航勧告',
  visa_entry: 'ビザ・入国',
  aviation: '航空',
  payments_finance: '金融・決済',
  insurance: '保険',
  none: 'なし',
};

export const DEFAULT_MAX_RAW_PER_DAY = 200;
export const DEFAULT_MAX_DEEP_PER_RUN = 10;
export const DEFAULT_LLM_MODE = 'off';
export const DEFAULT_LLM_MODEL = 'gpt-4o-mini';
```

### packages/shared/src/jst.ts
```typescript
export function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

export function getJSTToday(): string {
  return getJSTNow().toISOString().split('T')[0];
}

export function getJSTDayRange(dateStr?: string): {
  start: string;
  end: string;
  ymd: string;
} {
  const ymd = dateStr || getJSTToday();
  const start = `${ymd}T00:00:00+09:00`;
  const end = `${ymd}T23:59:59.999+09:00`;
  return { start, end, ymd };
}

export function formatJSTDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().replace('T', ' ').slice(0, 19);
}
```

### apps/ui/package.json
```json
{
  "name": "@geosignal/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "pnpm build && wrangler pages deploy dist --project-name=geosignal-ui"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "wrangler": "^3.28.0"
  }
}
```

### apps/ui/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### apps/ui/vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
```

### apps/ui/tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### apps/ui/postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### apps/ui/index.html
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GeoSignal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### apps/ui/public/favicon.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#3b82f6" />
  <text x="50" y="65" font-size="40" font-weight="bold" text-anchor="middle" fill="white">G</text>
</svg>
```

### apps/ui/src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### apps/ui/src/App.tsx
```tsx
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignalDetail from './pages/SignalDetail';
import Chains from './pages/Chains';
import RunSettings from './pages/RunSettings';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/chains', label: 'Chains' },
  { path: '/run', label: 'Run / Settings' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                GeoSignal
              </Link>
              <div className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-mono">
                LLM: OFF
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signals/:id" element={<SignalDetail />} />
          <Route path="/chains" element={<Chains />} />
          <Route path="/run" element={<RunSettings />} />
        </Routes>
      </main>
    </div>
  );
}
```

### apps/ui/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #f9fafb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### apps/ui/src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_FIXTURES: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### apps/ui/src/lib/types.ts
```typescript
export interface Signal {
  id: string;
  date_jst: string;
  title: string;
  summary?: string;
  labels: ('FACT' | 'INFERENCE')[];
  score: number;
  score_components: ScoreComponents;
  why_up: WhyUp[];
  evidence: Evidence[];
  updated_at: string;
}

export interface ScoreComponents {
  source_mentions: number;
  cross_region: number;
  official_source: number;
  travel_related: number;
  recency: number;
}

export interface WhyUp {
  metric: string;
  prev: number;
  curr: number;
  delta: number;
}

export interface Evidence {
  url: string;
  source_id: string;
  title: string;
  quote?: string;
  evidence_type: 'official' | 'news' | 'social';
}

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'html' | 'api';
  url: string;
  tier: number;
  is_active: boolean;
}

export interface Run {
  id: string;
  mode: 'manual' | 'cron';
  dry_run: boolean;
  llm_mode: 'off' | 'on_demand';
  max_raw_per_day: number;
  raw_used_today: number;
  started_at: string;
  finished_at?: string;
  status: 'success' | 'error' | 'running';
}

export interface ChainNode {
  id: string;
  signal_id: string;
  title: string;
  date: string;
  type: 'event' | 'statement' | 'sanction' | 'military';
}

export interface ChainEdge {
  from: string;
  to: string;
  label: string;
  is_inference: boolean;
}
```

### apps/ui/src/lib/api.ts
```typescript
import type { Signal, Source, Run } from './types';
import signalsFixture from '../fixtures/signals.json';
import sourcesFixture from '../fixtures/sources.json';
import runsFixture from '../fixtures/runs.json';

const USE_FIXTURES =
  import.meta.env.DEV && import.meta.env.VITE_USE_FIXTURES === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  if (USE_FIXTURES) {
    await new Promise((r) => setTimeout(r, 100));

    if (path === '/api/signals' || path.startsWith('/api/signals?')) {
      return signalsFixture as unknown as T;
    }
    if (path.startsWith('/api/signals/')) {
      const id = path.split('/')[3];
      const signal = (signalsFixture as Signal[]).find((s) => s.id === id);
      if (!signal) throw new Error('Signal not found');
      return signal as T;
    }
    if (path === '/api/sources') {
      return sourcesFixture as unknown as T;
    }
    if (path === '/api/runs') {
      return runsFixture as unknown as T;
    }
    throw new Error(`Unknown fixture path: ${path}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getSignals(date?: string): Promise<Signal[]> {
  const query = date ? `?date=${date}` : '';
  return fetchAPI<Signal[]>(`/api/signals${query}`);
}

export async function getSignal(id: string): Promise<Signal> {
  return fetchAPI<Signal>(`/api/signals/${id}`);
}

export async function getSources(): Promise<Source[]> {
  return fetchAPI<Source[]>('/api/sources');
}

export async function getRuns(): Promise<Run[]> {
  return fetchAPI<Run[]>('/api/runs');
}

export async function getLatestRun(): Promise<Run | null> {
  const runs = await getRuns();
  return runs[0] || null;
}

export async function triggerRun(
  dryRun: boolean
): Promise<{ ok: boolean; run_id: string }> {
  return fetchAPI<{ ok: boolean; run_id: string }>('/api/runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dry_run: dryRun }),
  });
}
```

### apps/ui/src/fixtures/signals.json
```json
[
  {
    "id": "sig_2025-12-29_001",
    "date_jst": "2025-12-29",
    "title": "台湾周辺での軍事動向と港湾封鎖シナリオが再浮上",
    "summary": "中国軍が台湾周辺で大規模演習を実施。港湾封鎖シナリオへの言及が複数ソースで確認された。",
    "labels": ["INFERENCE"],
    "score": 78,
    "score_components": {
      "source_mentions": 11,
      "cross_region": 3,
      "official_source": 0,
      "travel_related": 0,
      "recency": 10
    },
    "why_up": [
      { "metric": "source_mentions", "prev": 6, "curr": 11, "delta": 5 },
      { "metric": "cross_region", "prev": 1, "curr": 3, "delta": 2 }
    ],
    "evidence": [
      {
        "url": "https://www.bbc.com/news/world-asia-12345",
        "source_id": "bbc_world",
        "title": "China conducts military drills near Taiwan",
        "evidence_type": "news"
      },
      {
        "url": "https://www.theguardian.com/world/2025/dec/28/taiwan-tensions",
        "source_id": "guardian_asia",
        "title": "Taiwan tensions rise amid new exercises",
        "evidence_type": "news"
      }
    ],
    "updated_at": "2025-12-29T10:15:00+09:00"
  },
  {
    "id": "sig_2025-12-29_002",
    "date_jst": "2025-12-29",
    "title": "EU、対中半導体輸出規制の強化を検討",
    "summary": "EU理事会が半導体製造装置の対中輸出規制強化について協議。2026年Q1に決定予定。",
    "labels": ["FACT"],
    "score": 65,
    "score_components": {
      "source_mentions": 7,
      "cross_region": 2,
      "official_source": 1,
      "travel_related": 0,
      "recency": 8
    },
    "why_up": [
      { "metric": "source_mentions", "prev": 3, "curr": 7, "delta": 4 },
      { "metric": "official_source", "prev": 0, "curr": 1, "delta": 1 }
    ],
    "evidence": [
      {
        "url": "https://www.consilium.europa.eu/en/press/press-releases/2025/12/28/semiconductor-export/",
        "source_id": "eu_council",
        "title": "Council discusses semiconductor export controls",
        "evidence_type": "official"
      }
    ],
    "updated_at": "2025-12-29T09:30:00+09:00"
  },
  {
    "id": "sig_2025-12-28_001",
    "date_jst": "2025-12-28",
    "title": "米国務省、台湾渡航に関する注意喚起を更新",
    "summary": "米国務省が台湾渡航に関する注意喚起を更新。レベル2（注意強化）を維持。",
    "labels": ["FACT"],
    "score": 72,
    "score_components": {
      "source_mentions": 3,
      "cross_region": 1,
      "official_source": 1,
      "travel_related": 1,
      "recency": 5
    },
    "why_up": [
      { "metric": "official_source", "prev": 0, "curr": 1, "delta": 1 },
      { "metric": "travel_related", "prev": 0, "curr": 1, "delta": 1 }
    ],
    "evidence": [
      {
        "url": "https://travel.state.gov/content/travel/en/traveladvisories/taiwan.html",
        "source_id": "state_dept",
        "title": "Taiwan Travel Advisory",
        "evidence_type": "official"
      }
    ],
    "updated_at": "2025-12-28T22:00:00+09:00"
  }
]
```

### apps/ui/src/fixtures/sources.json
```json
[
  {
    "id": "bbc_world",
    "name": "BBC World",
    "type": "rss",
    "url": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "tier": 2,
    "is_active": true
  },
  {
    "id": "guardian_asia",
    "name": "The Guardian Asia",
    "type": "rss",
    "url": "https://www.theguardian.com/world/asia/rss",
    "tier": 2,
    "is_active": true
  },
  {
    "id": "eu_council",
    "name": "EU Council Press",
    "type": "rss",
    "url": "https://www.consilium.europa.eu/en/rss/press-releases/",
    "tier": 1,
    "is_active": true
  },
  {
    "id": "state_dept",
    "name": "US State Dept Travel",
    "type": "html",
    "url": "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html",
    "tier": 1,
    "is_active": true
  },
  {
    "id": "un_news",
    "name": "UN News",
    "type": "rss",
    "url": "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
    "tier": 1,
    "is_active": true
  }
]
```

### apps/ui/src/fixtures/runs.json
```json
[
  {
    "id": "run_2025-12-29_01",
    "mode": "manual",
    "dry_run": true,
    "llm_mode": "off",
    "max_raw_per_day": 200,
    "raw_used_today": 32,
    "started_at": "2025-12-29T09:55:00+09:00",
    "finished_at": "2025-12-29T10:02:00+09:00",
    "status": "success"
  },
  {
    "id": "run_2025-12-28_01",
    "mode": "manual",
    "dry_run": false,
    "llm_mode": "off",
    "max_raw_per_day": 200,
    "raw_used_today": 87,
    "started_at": "2025-12-28T08:30:00+09:00",
    "finished_at": "2025-12-28T08:45:00+09:00",
    "status": "success"
  }
]
```

### apps/ui/src/components/SignalCard.tsx
```tsx
import { Link } from 'react-router-dom';
import type { Signal } from '../lib/types';
import DiffBadge from './DiffBadge';

interface Props {
  signal: Signal;
}

export default function SignalCard({ signal }: Props) {
  const hasOfficial = signal.evidence.some(
    (e) => e.evidence_type === 'official'
  );

  return (
    <Link
      to={`/signals/${signal.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {signal.labels.map((label) => (
              <span
                key={label}
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  label === 'FACT'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {label}
              </span>
            ))}
            {hasOfficial && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                公式
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {signal.title}
          </h3>
          {signal.summary && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {signal.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {signal.why_up.slice(0, 3).map((w) => (
              <DiffBadge key={w.metric} metric={w.metric} delta={w.delta} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div
            className={`text-2xl font-bold ${
              signal.score >= 70
                ? 'text-red-600'
                : signal.score >= 50
                  ? 'text-amber-600'
                  : 'text-gray-600'
            }`}
          >
            {signal.score}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {signal.evidence.length} sources
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### apps/ui/src/components/DiffBadge.tsx
```tsx
interface Props {
  metric: string;
  delta: number;
}

const METRIC_LABELS: Record<string, string> = {
  source_mentions: '言及数',
  cross_region: '地域跨ぎ',
  official_source: '公式',
  travel_related: '渡航関連',
  recency: '新着度',
};

export default function DiffBadge({ metric, delta }: Props) {
  const label = METRIC_LABELS[metric] || metric;
  const sign = delta > 0 ? '+' : '';

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
      <span>{label}</span>
      <span
        className={
          delta > 0
            ? 'text-red-600 font-medium'
            : delta < 0
              ? 'text-green-600 font-medium'
              : 'text-gray-500'
        }
      >
        {sign}
        {delta}
      </span>
    </span>
  );
}
```

### apps/ui/src/components/EvidenceList.tsx
```tsx
import type { Evidence } from '../lib/types';

interface Props {
  evidence: Evidence[];
}

const TYPE_LABELS: Record<string, { label: string; class: string }> = {
  official: { label: '公式', class: 'bg-green-100 text-green-800' },
  news: { label: '報道', class: 'bg-blue-100 text-blue-800' },
  social: { label: 'SNS', class: 'bg-purple-100 text-purple-800' },
};

export default function EvidenceList({ evidence }: Props) {
  return (
    <div className="space-y-3">
      {evidence.map((ev, i) => {
        const typeInfo = TYPE_LABELS[ev.evidence_type] || TYPE_LABELS.news;
        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${typeInfo.class}`}>
                  {typeInfo.label}
                </span>
                <span className="text-xs text-gray-500">{ev.source_id}</span>
              </div>
              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline line-clamp-2"
              >
                {ev.title}
              </a>
              {ev.quote && (
                <blockquote className="mt-2 text-sm text-gray-600 border-l-2 border-gray-300 pl-3 italic">
                  "{ev.quote}"
                </blockquote>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### apps/ui/src/components/ChainGraph.tsx
```tsx
import type { ChainNode, ChainEdge } from '../lib/types';

interface Props {
  nodes: ChainNode[];
  edges: ChainEdge[];
}

const NODE_COLORS: Record<string, string> = {
  event: 'bg-blue-100 text-blue-800 border-blue-200',
  statement: 'bg-gray-100 text-gray-800 border-gray-200',
  sanction: 'bg-red-100 text-red-800 border-red-200',
  military: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function ChainGraph({ nodes, edges }: Props) {
  return (
    <div className="space-y-4">
      {nodes.map((node) => {
        const outgoingEdges = edges.filter((e) => e.from === node.id);
        const colorClass = NODE_COLORS[node.type] || NODE_COLORS.event;

        return (
          <div key={node.id} className="relative">
            <div className={`border rounded-lg p-4 ${colorClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/50">
                  {node.type}
                </span>
                <span className="text-xs opacity-75">{node.date}</span>
              </div>
              <p className="text-sm font-medium">{node.title}</p>
            </div>
            {outgoingEdges.map((edge) => (
              <div
                key={edge.to}
                className="ml-6 mt-2 flex items-center gap-2"
              >
                <div className="w-4 border-t border-gray-300" />
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    edge.is_inference
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {edge.is_inference ? 'INFERENCE' : 'FACT'}: {edge.label}
                </span>
                <div className="w-4 border-t border-gray-300" />
                <span className="text-xs text-gray-500">→</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### apps/ui/src/components/RunMeter.tsx
```tsx
interface Props {
  used: number;
  max: number;
}

export default function RunMeter({ used, max }: Props) {
  const pct = Math.min(100, (used / max) * 100);
  const color =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">MAX_RAW_PER_DAY</span>
        <span className="font-mono font-medium">
          {used} / {max}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 90 && (
        <p className="text-xs text-red-600 mt-1">⚠️ 日次上限に近づいています</p>
      )}
    </div>
  );
}
```

### apps/ui/src/pages/Dashboard.tsx
```tsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getSignals, getLatestRun } from '../lib/api';
import type { Signal, Run } from '../lib/types';
import SignalCard from '../components/SignalCard';

export default function Dashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [latestRun, setLatestRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setError(null);
      const [sigs, run] = await Promise.all([getSignals(), getLatestRun()]);
      setSignals(sigs);
      setLatestRun(run);
    } catch (e) {
      console.error('Failed to load data:', e);
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Signals</h1>
          <p className="text-sm text-gray-500">
            {format(new Date(), 'yyyy年M月d日 (eee)', { locale: ja })} JST
          </p>
        </div>
        {latestRun && (
          <div className="text-right text-xs text-gray-500">
            <p>
              最終更新:{' '}
              {latestRun.finished_at
                ? format(new Date(latestRun.finished_at), 'HH:mm')
                : '-'}
            </p>
            <p className="font-mono">
              {latestRun.raw_used_today} / {latestRun.max_raw_per_day} raw
            </p>
          </div>
        )}
      </div>

      {signals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">シグナルがありません。</p>
          <p className="text-sm text-gray-400">
            Run / Settings から収集を実行してください。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### apps/ui/src/pages/SignalDetail.tsx
```tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getSignal } from '../lib/api';
import type { Signal } from '../lib/types';
import EvidenceList from '../components/EvidenceList';
import DiffBadge from '../components/DiffBadge';

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSignal(id);
    }
  }, [id]);

  async function loadSignal(signalId: string) {
    try {
      setError(null);
      const data = await getSignal(signalId);
      setSignal(data);
    } catch (e) {
      console.error('Failed to load signal:', e);
      setError('シグナルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          {error || 'シグナルが見つかりません。'}
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        ← ダッシュボードに戻る
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {signal.labels.map((label) => (
                  <span
                    key={label}
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      label === 'FACT'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{signal.title}</h1>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(signal.updated_at), 'yyyy年M月d日 HH:mm', {
                  locale: ja,
                })}
              </p>
            </div>
            <div
              className={`text-3xl font-bold ${
                signal.score >= 70
                  ? 'text-red-600'
                  : signal.score >= 50
                    ? 'text-amber-600'
                    : 'text-gray-600'
              }`}
            >
              {signal.score}
            </div>
          </div>
        </div>

        {signal.summary && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">要点</h2>
            <p className="text-gray-900">{signal.summary}</p>
            <p className="text-xs text-gray-500 mt-2">
              ※ LLM OFF のためテンプレート整形
            </p>
          </div>
        )}

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Evidence（根拠）— {signal.evidence.length}件
          </h2>
          <EvidenceList evidence={signal.evidence} />
        </div>

        <div className="p-6 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            スコア上昇理由（score_components diff）
          </h2>
          <div className="flex flex-wrap gap-3">
            {signal.why_up.map((w) => (
              <div
                key={w.metric}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <DiffBadge metric={w.metric} delta={w.delta} />
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {w.prev} → {w.curr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### apps/ui/src/pages/Chains.tsx
```tsx
import { useState } from 'react';
import ChainGraph from '../components/ChainGraph';
import type { ChainNode, ChainEdge } from '../lib/types';

const sampleNodes: ChainNode[] = [
  {
    id: 'n1',
    signal_id: 'sig_2025-12-29_001',
    title: '中国軍が台湾周辺で大規模演習を実施',
    date: '2025-12-28',
    type: 'military',
  },
  {
    id: 'n2',
    signal_id: 'sig_2025-12-29_002',
    title: 'EU、対中半導体輸出規制の強化を検討',
    date: '2025-12-28',
    type: 'sanction',
  },
  {
    id: 'n3',
    signal_id: '',
    title: '台湾TSMCが生産計画の見直しを示唆',
    date: '2025-12-29',
    type: 'event',
  },
];

const sampleEdges: ChainEdge[] = [
  {
    from: 'n1',
    to: 'n2',
    label: '安全保障懸念が規制議論を加速',
    is_inference: true,
  },
  {
    from: 'n2',
    to: 'n3',
    label: 'サプライチェーンへの影響',
    is_inference: true,
  },
];

export default function Chains() {
  const [nodes] = useState<ChainNode[]>(sampleNodes);
  const [edges] = useState<ChainEdge[]>(sampleEdges);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chains（事象の連鎖）
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          イベント間の因果関係を可視化。
          <span className="text-amber-600">INFERENCE</span>は推測を示す。
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {nodes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            連鎖データがありません。
          </p>
        ) : (
          <ChainGraph nodes={nodes} edges={edges} />
        )}
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          ⚠️
          この画面は簡易版です。将来的にはインタラクティブなグラフ可視化を実装予定。
        </p>
      </div>
    </div>
  );
}
```

### apps/ui/src/pages/RunSettings.tsx
```tsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getRuns, getSources, triggerRun } from '../lib/api';
import type { Run, Source } from '../lib/types';
import RunMeter from '../components/RunMeter';

export default function RunSettings() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [runsData, sourcesData] = await Promise.all([
        getRuns(),
        getSources(),
      ]);
      setRuns(runsData);
      setSources(sourcesData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun(dryRun: boolean) {
    setRunning(true);
    try {
      await triggerRun(dryRun);
      await loadData();
    } catch (e) {
      console.error('Run failed:', e);
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const latestRun = runs[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Run / Settings</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">手動実行</h2>

        {latestRun && (
          <div className="mb-6">
            <RunMeter
              used={latestRun.raw_used_today}
              max={latestRun.max_raw_per_day}
            />
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleRun(true)}
            disabled={running}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {running ? '実行中...' : 'Run (dry-run)'}
          </button>
          <button
            onClick={() => handleRun(false)}
            disabled={running}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {running ? '実行中...' : 'Run (write)'}
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Cron:</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                OFF
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">LLM:</span>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                OFF
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">MAX_DEEP:</span>
              <span className="font-mono text-xs">10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">実行履歴</h2>
        <div className="space-y-3">
          {runs.length === 0 ? (
            <p className="text-gray-500 text-sm">実行履歴がありません。</p>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(run.started_at), 'M/d HH:mm', {
                      locale: ja,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {run.mode} {run.dry_run && '(dry-run)'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono">
                    {run.raw_used_today} raw
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      run.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : run.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sources ({sources.length})
        </h2>
        <div className="space-y-2">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {source.name}
                </p>
                <p className="text-xs text-gray-500">
                  {source.type} | Tier {source.tier}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  source.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {source.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### apps/jobs/package.json
```json
{
  "name": "@geosignal/jobs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "db:migrate": "wrangler d1 execute geosignal-db --file=../../schema.sql",
    "db:migrate:local": "wrangler d1 execute geosignal-db --local --file=../../schema.sql"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240117.0",
    "typescript": "^5.3.3",
    "wrangler": "^3.28.0"
  }
}
```

### apps/jobs/wrangler.toml
```toml
name = "geosignal-jobs"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
MAX_RAW_PER_DAY = "200"
MAX_DEEP_PER_RUN = "10"
LLM_MODE = "off"

[[d1_databases]]
binding = "DB"
database_name = "geosignal-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Cron triggers (デフォルトはOFF = コメントアウト)
# [triggers]
# crons = ["0 21 * * *"]
```

### apps/jobs/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2021"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

### apps/jobs/src/index.ts
```typescript
import { handleSignals, handleSignalById } from './routes/signals';
import { handleChains } from './routes/chains';
import { handleRuns, handleCreateRun, handleTriggerJob } from './routes/runs';
import { handleSources } from './routes/sources';

export interface Env {
  DB: D1Database;
  MAX_RAW_PER_DAY: string;
  MAX_DEEP_PER_RUN: string;
  LLM_MODE: string;
  CRON_SECRET?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Cron-Secret',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/api/signals' && request.method === 'GET') {
        return handleSignals(request, env);
      }
      if (path.match(/^\/api\/signals\/[^/]+$/) && request.method === 'GET') {
        const id = path.split('/')[3];
        return handleSignalById(id, env);
      }
      if (path === '/api/chains' && request.method === 'GET') {
        return handleChains(request, env);
      }
      if (path === '/api/runs' && request.method === 'GET') {
        return handleRuns(request, env);
      }
      if (path === '/api/runs' && request.method === 'POST') {
        return handleCreateRun(request, env);
      }
      if (path === '/api/jobs/run' && request.method === 'POST') {
        return handleTriggerJob(request, env);
      }
      if (path === '/api/sources' && request.method === 'GET') {
        return handleSources(request, env);
      }
      if (path === '/api/health') {
        return jsonResponse({
          ok: true,
          llm_mode: env.LLM_MODE,
          max_raw_per_day: env.MAX_RAW_PER_DAY,
        });
      }

      return errorResponse('Not Found', 404);
    } catch (error) {
      console.error('API Error:', error);
      return errorResponse('Internal Server Error', 500);
    }
  },
};
```

### apps/jobs/src/lib/types.ts
```typescript
export interface Signal {
  id: string;
  cluster_id?: string;
  date_jst: string;
  title: string;
  summary?: string;
  labels: string;
  score: number;
  score_components: string;
  why_up: string;
  updated_at: string;
  polished_at?: string;
}

export interface SignalEvidence {
  id?: number;
  signal_id: string;
  url: string;
  source_id?: string;
  title?: string;
  quote?: string;
  evidence_type: string;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  url: string;
  tier: number;
  is_active: number;
  created_at?: string;
}

export interface RawItem {
  id: string;
  source_id: string;
  url: string;
  title?: string;
  content?: string;
  published_at?: string;
  fetched_at: string;
  content_hash: string;
  date_jst: string;
  status: string;
}

export interface Run {
  id: string;
  mode: string;
  dry_run: number;
  llm_mode: string;
  max_raw_per_day: number;
  raw_used_today: number;
  started_at: string;
  finished_at?: string;
  status: string;
  meta?: string;
}
```

### apps/jobs/src/lib/db.ts
```typescript
import type { Env } from '../index';

export function getJSTToday(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
}

export async function getTodayRawCount(env: Env): Promise<number> {
  const today = getJSTToday();
  const result = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM raw_items WHERE date_jst = ?'
  )
    .bind(today)
    .first<{ count: number }>();

  return result?.count || 0;
}

export async function getRemainingQuota(env: Env): Promise<number> {
  const max = parseInt(env.MAX_RAW_PER_DAY || '200');
  const used = await getTodayRawCount(env);
  return Math.max(0, max - used);
}
```

### apps/jobs/src/lib/jst.ts
```typescript
export function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

export function getJSTToday(): string {
  return getJSTNow().toISOString().split('T')[0];
}

export function getJSTTimestamp(): string {
  return getJSTNow().toISOString();
}
```

### apps/jobs/src/lib/rss.ts
```typescript
interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}

export async function parseRSS(url: string): Promise<RSSItem[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const text = await response.text();
  const items: RSSItem[] = [];

  const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/gi);
  for (const match of itemMatches) {
    const itemXml = match[1];

    const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1] || '';
    const link = itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)?.[1];
    const description = itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i)?.[1];

    if (title && link) {
      items.push({
        title: title.trim(),
        link: link.trim(),
        pubDate: pubDate?.trim(),
        description: description?.trim(),
      });
    }
  }

  return items;
}
```

### apps/jobs/src/lib/html.ts
```typescript
interface HTMLContent {
  title: string;
  content: string;
}

export async function fetchHTML(url: string): Promise<HTMLContent> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTML fetch failed: ${response.status}`);
  }

  const html = await response.text();

  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim() || 'Untitled';

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch?.[1] || html;

  content = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000);

  return { title, content };
}
```

### apps/jobs/src/lib/dedupe.ts
```typescript
export function hashContent(title: string, content: string): string {
  const str = `${title}${content}`.toLowerCase().replace(/\s+/g, '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
```

### apps/jobs/src/lib/llm.ts
```typescript
import type { Env } from '../index';

interface PolishInput {
  title: string;
  summary: string;
  facts: string[];
}

interface PolishOutput {
  summary: string;
}

export function isLLMEnabled(env: Env): boolean {
  return env.LLM_MODE === 'on_demand' && !!env.OPENAI_API_KEY;
}

export async function polishText(
  input: PolishInput,
  env: Env
): Promise<PolishOutput> {
  if (!isLLMEnabled(env)) {
    return { summary: input.summary };
  }

  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  const systemPrompt = `あなたは文章整形アシスタントです。
重要なルール:
1. 新しい事実や根拠URLを追加しない
2. 入力された情報のみを整形する
3. 推測は「推測:」で始める
4. 簡潔で読みやすい日本語にする`;

  const userPrompt = `以下の情報を整形してください:
タイトル: ${input.title}
要約: ${input.summary}
事実: ${input.facts.join(', ')}

JSON形式で返してください: { "summary": "..." }`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content || '{}';

  try {
    return JSON.parse(content);
  } catch {
    return { summary: input.summary };
  }
}
```

### apps/jobs/src/middleware/auth.ts
```typescript
import type { Env } from '../index';

export function assertCronAuth(request: Request, env: Env): boolean {
  if (!env.CRON_SECRET) {
    return true;
  }

  const provided =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  return provided === env.CRON_SECRET;
}
```

### apps/jobs/src/routes/signals.ts
```typescript
import type { Env } from '../index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleSignals(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  let sql = `
    SELECT id, cluster_id, date_jst, title, summary, labels, score, 
           score_components, why_up, updated_at, polished_at
    FROM signals
  `;
  const params: string[] = [];

  if (date) {
    sql += ' WHERE date_jst = ?';
    params.push(date);
  }

  sql += ' ORDER BY score DESC, updated_at DESC LIMIT 50';

  const { results } = await env.DB.prepare(sql).bind(...params).all();

  const signals = await Promise.all(
    (results || []).map(async (row: Record<string, unknown>) => {
      const { results: evidence } = await env.DB.prepare(
        'SELECT url, source_id, title, quote, evidence_type FROM signal_evidence WHERE signal_id = ?'
      )
        .bind(row.id)
        .all();

      return {
        ...row,
        labels: JSON.parse((row.labels as string) || '[]'),
        score_components: JSON.parse((row.score_components as string) || '{}'),
        why_up: JSON.parse((row.why_up as string) || '[]'),
        evidence: evidence || [],
      };
    })
  );

  return new Response(JSON.stringify(signals), { headers: corsHeaders });
}

export async function handleSignalById(
  id: string,
  env: Env
): Promise<Response> {
  const signal = await env.DB.prepare(
    'SELECT * FROM signals WHERE id = ?'
  )
    .bind(id)
    .first();

  if (!signal) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  const { results: evidence } = await env.DB.prepare(
    'SELECT url, source_id, title, quote, evidence_type FROM signal_evidence WHERE signal_id = ?'
  )
    .bind(id)
    .all();

  const result = {
    ...signal,
    labels: JSON.parse((signal.labels as string) || '[]'),
    score_components: JSON.parse((signal.score_components as string) || '{}'),
    why_up: JSON.parse((signal.why_up as string) || '[]'),
    evidence: evidence || [],
  };

  return new Response(JSON.stringify(result), { headers: corsHeaders });
}
```

### apps/jobs/src/routes/chains.ts
```typescript
import type { Env } from '../index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleChains(
  request: Request,
  env: Env
): Promise<Response> {
  const { results: signals } = await env.DB.prepare(
    'SELECT id, title, date_jst, labels FROM signals ORDER BY date_jst DESC LIMIT 20'
  ).all();

  const nodes = (signals || []).map((s: Record<string, unknown>) => ({
    id: s.id,
    signal_id: s.id,
    title: s.title,
    date: s.date_jst,
    type: 'event',
  }));

  const edges: unknown[] = [];

  return new Response(JSON.stringify({ nodes, edges }), {
    headers: corsHeaders,
  });
}
```

### apps/jobs/src/routes/runs.ts
```typescript
import type { Env } from '../index';
import { getJSTToday, getJSTTimestamp } from '../lib/jst';
import { getTodayRawCount } from '../lib/db';
import { assertCronAuth } from '../middleware/auth';
import { runCollect } from '../jobs/collect';
import { runExtract } from '../jobs/extract';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleRuns(
  request: Request,
  env: Env
): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM runs ORDER BY started_at DESC LIMIT 20'
  ).all();

  const runs = (results || []).map((row: Record<string, unknown>) => ({
    ...row,
    dry_run: row.dry_run === 1,
    meta: row.meta ? JSON.parse(row.meta as string) : {},
  }));

  return new Response(JSON.stringify(runs), { headers: corsHeaders });
}

export async function handleCreateRun(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as { dry_run?: boolean };
  const dryRun = body.dry_run ?? true;
  const today = getJSTToday();
  const runId = `run_${today}_${Date.now()}`;
  const rawUsed = await getTodayRawCount(env);

  await env.DB.prepare(
    `INSERT INTO runs (id, mode, dry_run, llm_mode, max_raw_per_day, raw_used_today, started_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      runId,
      'manual',
      dryRun ? 1 : 0,
      env.LLM_MODE || 'off',
      parseInt(env.MAX_RAW_PER_DAY || '200'),
      rawUsed,
      getJSTTimestamp(),
      'running'
    )
    .run();

  return new Response(JSON.stringify({ ok: true, run_id: runId }), {
    headers: corsHeaders,
  });
}

export async function handleTriggerJob(
  request: Request,
  env: Env
): Promise<Response> {
  if (!assertCronAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const body = (await request.json()) as { dry_run?: boolean; job?: string };
  const dryRun = body.dry_run ?? true;
  const job = body.job || 'all';

  const today = getJSTToday();
  const runId = `run_${today}_${Date.now()}`;
  const startedAt = getJSTTimestamp();

  await env.DB.prepare(
    `INSERT INTO runs (id, mode, dry_run, llm_mode, max_raw_per_day, raw_used_today, started_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      runId,
      'manual',
      dryRun ? 1 : 0,
      env.LLM_MODE || 'off',
      parseInt(env.MAX_RAW_PER_DAY || '200'),
      0,
      startedAt,
      'running'
    )
    .run();

  try {
    let collectResult = null;
    let extractResult = null;

    if (job === 'all' || job === 'collect') {
      collectResult = await runCollect(env, dryRun);
    }
    if (job === 'all' || job === 'extract') {
      extractResult = await runExtract(env, dryRun);
    }

    const rawUsed = await getTodayRawCount(env);

    await env.DB.prepare(
      `UPDATE runs SET status = ?, finished_at = ?, raw_used_today = ?, meta = ? WHERE id = ?`
    )
      .bind(
        'success',
        getJSTTimestamp(),
        rawUsed,
        JSON.stringify({ collect: collectResult, extract: extractResult }),
        runId
      )
      .run();

    return new Response(
      JSON.stringify({
        ok: true,
        run_id: runId,
        dry_run: dryRun,
        collect: collectResult,
        extract: extractResult,
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    await env.DB.prepare(
      `UPDATE runs SET status = ?, finished_at = ?, meta = ? WHERE id = ?`
    )
      .bind(
        'error',
        getJSTTimestamp(),
        JSON.stringify({ error: String(error) }),
        runId
      )
      .run();

    return new Response(
      JSON.stringify({ ok: false, run_id: runId, error: String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
}
```

### apps/jobs/src/routes/sources.ts
```typescript
import type { Env } from '../index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleSources(
  request: Request,
  env: Env
): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM sources ORDER BY tier ASC, name ASC'
  ).all();

  const sources = (results || []).map((row: Record<string, unknown>) => ({
    ...row,
    is_active: row.is_active === 1,
  }));

  return new Response(JSON.stringify(sources), { headers: corsHeaders });
}
```

### apps/jobs/src/jobs/collect.ts
```typescript
import type { Env } from '../index';
import { getJSTToday } from '../lib/jst';
import { getRemainingQuota } from '../lib/db';
import { parseRSS } from '../lib/rss';
import { fetchHTML } from '../lib/html';
import { hashContent } from '../lib/dedupe';

interface CollectResult {
  collected: number;
  remaining: number;
  errors: string[];
}

export async function runCollect(
  env: Env,
  dryRun: boolean
): Promise<CollectResult> {
  const remaining = await getRemainingQuota(env);
  const today = getJSTToday();
  const errors: string[] = [];
  let collected = 0;

  if (remaining <= 0) {
    return { collected: 0, remaining: 0, errors: ['MAX_RAW_PER_DAY reached'] };
  }

  const { results: sources } = await env.DB.prepare(
    'SELECT * FROM sources WHERE is_active = 1'
  ).all();

  for (const source of sources || []) {
    if (collected >= remaining) break;

    try {
      const sourceType = source.type as string;
      const sourceUrl = source.url as string;
      const sourceId = source.id as string;

      if (sourceType === 'rss') {
        const items = await parseRSS(sourceUrl);
        for (const item of items.slice(0, 10)) {
          if (collected >= remaining) break;

          const contentHash = hashContent(item.title, item.description || '');

          if (dryRun) {
            console.log(`[dry-run] Would insert: ${item.title}`);
            collected++;
            continue;
          }

          const id = `raw_${sourceId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

          await env.DB.prepare(
            `INSERT OR IGNORE INTO raw_items 
             (id, source_id, url, title, content, published_at, fetched_at, content_hash, date_jst, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(
              id,
              sourceId,
              item.link,
              item.title,
              item.description || '',
              item.pubDate ? new Date(item.pubDate).toISOString() : null,
              new Date().toISOString(),
              contentHash,
              today,
              'new'
            )
            .run();

          collected++;
        }
      } else if (sourceType === 'html') {
        const { title, content } = await fetchHTML(sourceUrl);
        const contentHash = hashContent(title, content);

        if (dryRun) {
          console.log(`[dry-run] Would insert HTML: ${title}`);
          collected++;
          continue;
        }

        const id = `raw_${sourceId}_${Date.now()}`;

        await env.DB.prepare(
          `INSERT OR IGNORE INTO raw_items 
           (id, source_id, url, title, content, fetched_at, content_hash, date_jst, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            id,
            sourceId,
            sourceUrl,
            title,
            content,
            new Date().toISOString(),
            contentHash,
            today,
            'new'
          )
          .run();

        collected++;
      }
    } catch (e) {
      errors.push(`${source.name}: ${String(e)}`);
    }
  }

  return { collected, remaining: remaining - collected, errors };
}
```

### apps/jobs/src/jobs/extract.ts
```typescript
import type { Env } from '../index';
import { getJSTToday, getJSTTimestamp } from '../lib/jst';

interface ExtractResult {
  processed: number;
  created: number;
  errors: string[];
}

export async function runExtract(
  env: Env,
  dryRun: boolean
): Promise<ExtractResult> {
  const today = getJSTToday();
  const errors: string[] = [];
  let processed = 0;
  let created = 0;

  const { results: rawItems } = await env.DB.prepare(
    `SELECT * FROM raw_items WHERE status = 'new' ORDER BY fetched_at DESC LIMIT 30`
  ).all();

  for (const item of rawItems || []) {
    try {
      processed++;

      const scoreComponents = {
        source_mentions: 1,
        cross_region: 0,
        official_source: 0,
        travel_related: 0,
        recency: 5,
      };
      const score = Object.values(scoreComponents).reduce((a, b) => a + b, 0) * 5;

      if (dryRun) {
        console.log(`[dry-run] Would create signal: ${item.title}`);
        continue;
      }

      const signalId = `sig_${today}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await env.DB.prepare(
        `INSERT INTO signals 
         (id, date_jst, title, summary, labels, score, score_components, why_up, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          signalId,
          today,
          item.title as string,
          (item.content as string)?.slice(0, 200) || '',
          JSON.stringify(['FACT']),
          score,
          JSON.stringify(scoreComponents),
          JSON.stringify([]),
          getJSTTimestamp()
        )
        .run();

      await env.DB.prepare(
        `INSERT INTO signal_evidence (signal_id, url, source_id, title, evidence_type)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(signalId, item.url, item.source_id, item.title, 'news')
        .run();

      await env.DB.prepare(
        `UPDATE raw_items SET status = 'processed' WHERE id = ?`
      )
        .bind(item.id)
        .run();

      created++;
    } catch (e) {
      errors.push(`${item.id}: ${String(e)}`);
      await env.DB.prepare(
        `UPDATE raw_items SET status = 'error' WHERE id = ?`
      )
        .bind(item.id)
        .run();
    }
  }

  return { processed, created, errors };
}
```

### apps/jobs/src/jobs/cluster.ts
```typescript
import type { Env } from '../index';

export async function runCluster(env: Env, dryRun: boolean): Promise<void> {
  console.log('[cluster] Not implemented yet');
}
```

### apps/jobs/src/jobs/signal.ts
```typescript
import type { Env } from '../index';

export async function runSignalGeneration(
  env: Env,
  dryRun: boolean
): Promise<void> {
  console.log('[signal] Not implemented yet');
}
```

### apps/jobs/src/jobs/index-update.ts
```typescript
import type { Env } from '../index';

export async function runIndexUpdate(env: Env, dryRun: boolean): Promise<void> {
  console.log('[index-update] Not implemented yet');
}
```

### cli/package.json
```json
{
  "name": "@geosignal/cli",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "tsx src/index.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

### cli/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### cli/src/index.ts
```typescript
import { planCommand } from './commands/plan.js';
import { collectCommand } from './commands/collect.js';
import { extractCommand } from './commands/extract.js';
import { signalCommand } from './commands/signal.js';
import { runCommand } from './commands/run.js';

const USAGE = `
GeoSignal CLI

Usage:
  pnpm cli plan              見積もり表示
  pnpm cli collect           ソース収集
  pnpm cli extract           シグナル抽出
  pnpm cli signal            シグナル生成
  pnpm cli run               全工程を順次実行

Options:
  --dry-run                  書き込みをスキップ
  --verbose                  詳細ログ出力

Environment:
  GS_API_URL                 API URL (default: http://localhost:8787)
  GS_CRON_SECRET             認証シークレット
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  const ctx = { dryRun, verbose };

  switch (command) {
    case 'plan':
      await planCommand(ctx);
      break;
    case 'collect':
      await collectCommand(ctx);
      break;
    case 'extract':
      await extractCommand(ctx);
      break;
    case 'signal':
      await signalCommand(ctx);
      break;
    case 'run':
      await runCommand(ctx);
      break;
    default:
      console.log(USAGE);
  }
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
```

### cli/src/lib/config.ts
```typescript
export const config = {
  apiUrl: process.env.GS_API_URL || 'http://localhost:8787',
  cronSecret: process.env.GS_CRON_SECRET || '',
};
```

### cli/src/lib/api.ts
```typescript
import { config } from './config.js';

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.cronSecret) {
    headers['X-Cron-Secret'] = config.cronSecret;
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}
```

### cli/src/commands/plan.ts
```typescript
import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function planCommand(ctx: CLIContext): Promise<void> {
  console.log('📊 Plan');
  console.log('─'.repeat(40));

  try {
    const health = await apiRequest<{
      ok: boolean;
      llm_mode: string;
      max_raw_per_day: string;
    }>('/api/health');

    console.log(`API Status:        ${health.ok ? '✓ OK' : '✗ Error'}`);
    console.log(`LLM_MODE:          ${health.llm_mode}`);
    console.log(`MAX_RAW_PER_DAY:   ${health.max_raw_per_day}`);

    const runs = await apiRequest<Array<{ raw_used_today: number }>>('/api/runs');
    const latest = runs[0];

    if (latest) {
      console.log(`Used today:        ${latest.raw_used_today}`);
      console.log(
        `Remaining:         ${parseInt(health.max_raw_per_day) - latest.raw_used_today}`
      );
    }

    const sources = await apiRequest<Array<{ is_active: boolean }>>('/api/sources');
    const activeSources = sources.filter((s) => s.is_active).length;
    console.log(`Active sources:    ${activeSources}`);
  } catch (e) {
    console.error('Failed to fetch plan:', e);
  }
}
```

### cli/src/commands/collect.ts
```typescript
import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function collectCommand(ctx: CLIContext): Promise<void> {
  console.log('📥 Collect');
  console.log('─'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      collect: { collected: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'collect' },
    });

    console.log(`Collected: ${result.collect?.collected || 0}`);

    if (result.collect?.errors?.length) {
      console.log('Errors:');
      result.collect.errors.forEach((e) => console.log(`  - ${e}`));
    }
  } catch (e) {
    console.error('Collect failed:', e);
  }
}
```

### cli/src/commands/extract.ts
```typescript
import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function extractCommand(ctx: CLIContext): Promise<void> {
  console.log('⚙️  Extract');
  console.log('─'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      extract: { processed: number; created: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'extract' },
    });

    console.log(`Processed: ${result.extract?.processed || 0}`);
    console.log(`Created:   ${result.extract?.created || 0}`);

    if (result.extract?.errors?.length) {
      console.log('Errors:');
      result.extract.errors.forEach((e) => console.log(`  - ${e}`));
    }
  } catch (e) {
    console.error('Extract failed:', e);
  }
}
```

### cli/src/commands/signal.ts
```typescript
interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function signalCommand(ctx: CLIContext): Promise<void> {
  console.log('📡 Signal');
  console.log('─'.repeat(40));
  console.log('(Not implemented yet)');
}
```

### cli/src/commands/run.ts
```typescript
import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function runCommand(ctx: CLIContext): Promise<void> {
  console.log('🚀 GeoSignal CLI - Full Run');
  console.log('═'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      run_id: string;
      dry_run: boolean;
      collect: { collected: number; errors: string[] };
      extract: { processed: number; created: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'all' },
    });

    console.log(`Run ID: ${result.run_id}`);
    console.log('');
    console.log('📥 Collect');
    console.log(`  Collected: ${result.collect?.collected || 0}`);
    console.log('');
    console.log('⚙️  Extract');
    console.log(`  Processed: ${result.extract?.processed || 0}`);
    console.log(`  Created:   ${result.extract?.created || 0}`);
    console.log('');
    console.log('✅ Complete!');
  } catch (e) {
    console.error('Run failed:', e);
  }
}
```

---

## 3) SQL

上記 `schema.sql` を参照。

---

## 4) ENV

上記 `.dev.vars.example` と `.env.example` を参照。

---

## 5) RUN: ローカル実行手順

```bash
# ============================================
# 1. リポジトリ展開
# ============================================

# Repo Packを展開
node tools/unpack-repopack.mjs --input=repopack.md --output=.

# または標準入力から
cat repopack.md | node tools/unpack-repopack.mjs --output=.

# ============================================
# 2. 依存パッケージインストール
# ============================================

pnpm install

# ============================================
# 3. 環境変数設定
# ============================================

cp .dev.vars.example apps/jobs/.dev.vars
cp .env.example .env

# LLM_MODE=off を確認
cat apps/jobs/.dev.vars | grep LLM_MODE

# ============================================
# 4. D1データベース作成（ローカル）
# ============================================

cd apps/jobs
pnpm db:migrate:local
cd ../..

# ============================================
# 5. 開発サーバー起動
# ============================================

# ターミナル1: Jobs (API)
pnpm dev:jobs
# → http://localhost:8787

# ターミナル2: UI
VITE_USE_FIXTURES=true pnpm dev:ui
# → http://localhost:5173

# ============================================
# 6. LLM_MODE=off の課金ゼロ確認
# ============================================

# Health check
curl http://localhost:8787/api/health
# → {"ok":true,"llm_mode":"off","max_raw_per_day":"200"}

# CLI dry-run
pnpm cli:run:dry
# → "LLM: OFF" が表示されること
# → OpenAI API呼び出しがないこと

# ============================================
# 7. 本番デプロイ前のSecrets設定
# ============================================

cd apps/jobs

# D1データベース作成（本番）
wrangler d1 create geosignal-db
# → 出力されるdatabase_idをwrangler.tomlに設定

# Secrets設定
wrangler secret put CRON_SECRET
# → ランダムな文字列を入力

# LLM使う場合のみ（デフォルトはOFFなので不要）
# wrangler secret put OPENAI_API_KEY

# デプロイ
pnpm deploy

cd ../..
```
