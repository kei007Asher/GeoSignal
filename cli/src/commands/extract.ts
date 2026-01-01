import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function extractCommand(ctx: CLIContext): Promise<void> {
  console.log('⚙️  Extract');
  console.log('─'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      extract: { processed: number; created: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'extract' },
    });

    console.log(`Processed: ${result.extract?.processed || 0}`);
    console.log(`Created:   ${result.extract?.created || 0}`);

    if (result.extract?.errors?.length) {
      console.log('Errors:');
      result.extract.errors.forEach((e) => console.log(`  - ${e}`));
    }
  } catch (e) {
    console.error('Extract failed:', e);
  }
}
