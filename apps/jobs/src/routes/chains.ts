import type { Env } from '../index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleChains(
  request: Request,
  env: Env
): Promise<Response> {
  const { results: signals } = await env.DB.prepare(
    'SELECT id, title, date_jst, labels FROM signals ORDER BY date_jst DESC LIMIT 20'
  ).all();

  const nodes = (signals || []).map((s: Record<string, unknown>) => ({
    id: s.id,
    signal_id: s.id,
    title: s.title,
    date: s.date_jst,
    type: 'event',
  }));

  const edges: unknown[] = [];

  return new Response(JSON.stringify({ nodes, edges }), {
    headers: corsHeaders,
  });
}
