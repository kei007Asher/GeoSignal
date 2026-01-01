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
