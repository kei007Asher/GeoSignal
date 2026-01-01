import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function collectCommand(ctx: CLIContext): Promise<void> {
  console.log('📥 Collect');
  console.log('─'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      collect: { collected: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'collect' },
    });

    console.log(`Collected: ${result.collect?.collected || 0}`);

    if (result.collect?.errors?.length) {
      console.log('Errors:');
      result.collect.errors.forEach((e) => console.log(`  - ${e}`));
    }
  } catch (e) {
    console.error('Collect failed:', e);
  }
}
