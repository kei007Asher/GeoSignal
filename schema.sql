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
