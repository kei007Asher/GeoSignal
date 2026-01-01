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
