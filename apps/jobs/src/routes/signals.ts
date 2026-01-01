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
