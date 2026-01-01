import type { Env } from '../index';
import { getJSTToday, getJSTTimestamp } from '../lib/jst';
import { getTodayRawCount } from '../lib/db';
import { assertCronAuth } from '../middleware/auth';
import { runCollect } from '../jobs/collect';
import { runExtract } from '../jobs/extract';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleRuns(
  request: Request,
  env: Env
): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM runs ORDER BY started_at DESC LIMIT 20'
  ).all();

  const runs = (results || []).map((row: Record<string, unknown>) => ({
    ...row,
    dry_run: row.dry_run === 1,
    meta: row.meta ? JSON.parse(row.meta as string) : {},
  }));

  return new Response(JSON.stringify(runs), { headers: corsHeaders });
}

export async function handleCreateRun(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as { dry_run?: boolean };
  const dryRun = body.dry_run ?? true;
  const today = getJSTToday();
  const runId = `run_${today}_${Date.now()}`;
  const rawUsed = await getTodayRawCount(env);

  await env.DB.prepare(
    `INSERT INTO runs (id, mode, dry_run, llm_mode, max_raw_per_day, raw_used_today, started_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      runId,
      'manual',
      dryRun ? 1 : 0,
      env.LLM_MODE || 'off',
      parseInt(env.MAX_RAW_PER_DAY || '200'),
      rawUsed,
      getJSTTimestamp(),
      'running'
    )
    .run();

  return new Response(JSON.stringify({ ok: true, run_id: runId }), {
    headers: corsHeaders,
  });
}

export async function handleTriggerJob(
  request: Request,
  env: Env
): Promise<Response> {
  if (!assertCronAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const body = (await request.json()) as { dry_run?: boolean; job?: string };
  const dryRun = body.dry_run ?? true;
  const job = body.job || 'all';

  const today = getJSTToday();
  const runId = `run_${today}_${Date.now()}`;
  const startedAt = getJSTTimestamp();

  await env.DB.prepare(
    `INSERT INTO runs (id, mode, dry_run, llm_mode, max_raw_per_day, raw_used_today, started_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      runId,
      'manual',
      dryRun ? 1 : 0,
      env.LLM_MODE || 'off',
      parseInt(env.MAX_RAW_PER_DAY || '200'),
      0,
      startedAt,
      'running'
    )
    .run();

  try {
    let collectResult = null;
    let extractResult = null;

    if (job === 'all' || job === 'collect') {
      collectResult = await runCollect(env, dryRun);
    }
    if (job === 'all' || job === 'extract') {
      extractResult = await runExtract(env, dryRun);
    }

    const rawUsed = await getTodayRawCount(env);

    await env.DB.prepare(
      `UPDATE runs SET status = ?, finished_at = ?, raw_used_today = ?, meta = ? WHERE id = ?`
    )
      .bind(
        'success',
        getJSTTimestamp(),
        rawUsed,
        JSON.stringify({ collect: collectResult, extract: extractResult }),
        runId
      )
      .run();

    return new Response(
      JSON.stringify({
        ok: true,
        run_id: runId,
        dry_run: dryRun,
        collect: collectResult,
        extract: extractResult,
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    await env.DB.prepare(
      `UPDATE runs SET status = ?, finished_at = ?, meta = ? WHERE id = ?`
    )
      .bind(
        'error',
        getJSTTimestamp(),
        JSON.stringify({ error: String(error) }),
        runId
      )
      .run();

    return new Response(
      JSON.stringify({ ok: false, run_id: runId, error: String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
}
