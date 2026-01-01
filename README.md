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
