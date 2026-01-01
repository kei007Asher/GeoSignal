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
