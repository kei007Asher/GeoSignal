import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function planCommand(ctx: CLIContext): Promise<void> {
  console.log('📊 Plan');
  console.log('─'.repeat(40));

  try {
    const health = await apiRequest<{
      ok: boolean;
      llm_mode: string;
      max_raw_per_day: string;
    }>('/api/health');

    console.log(`API Status:        ${health.ok ? '✓ OK' : '✗ Error'}`);
    console.log(`LLM_MODE:          ${health.llm_mode}`);
    console.log(`MAX_RAW_PER_DAY:   ${health.max_raw_per_day}`);

    const runs = await apiRequest<Array<{ raw_used_today: number }>>('/api/runs');
    const latest = runs[0];

    if (latest) {
      console.log(`Used today:        ${latest.raw_used_today}`);
      console.log(
        `Remaining:         ${parseInt(health.max_raw_per_day) - latest.raw_used_today}`
      );
    }

    const sources = await apiRequest<Array<{ is_active: boolean }>>('/api/sources');
    const activeSources = sources.filter((s) => s.is_active).length;
    console.log(`Active sources:    ${activeSources}`);
  } catch (e) {
    console.error('Failed to fetch plan:', e);
  }
}
