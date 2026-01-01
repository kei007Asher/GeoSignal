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
