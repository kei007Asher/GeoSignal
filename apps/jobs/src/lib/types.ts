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
