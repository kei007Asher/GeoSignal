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
