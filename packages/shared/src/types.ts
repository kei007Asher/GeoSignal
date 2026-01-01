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
