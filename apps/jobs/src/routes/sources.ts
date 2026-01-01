import type { Env } from '../index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleSources(
  request: Request,
  env: Env
): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM sources ORDER BY tier ASC, name ASC'
  ).all();

  const sources = (results || []).map((row: Record<string, unknown>) => ({
    ...row,
    is_active: row.is_active === 1,
  }));

  return new Response(JSON.stringify(sources), { headers: corsHeaders });
}
