import { apiRequest } from '../lib/api.js';

interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function runCommand(ctx: CLIContext): Promise<void> {
  console.log('🚀 GeoSignal CLI - Full Run');
  console.log('═'.repeat(40));
  console.log(`Mode: ${ctx.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  try {
    const result = await apiRequest<{
      ok: boolean;
      run_id: string;
      dry_run: boolean;
      collect: { collected: number; errors: string[] };
      extract: { processed: number; created: number; errors: string[] };
    }>('/api/jobs/run', {
      method: 'POST',
      body: { dry_run: ctx.dryRun, job: 'all' },
    });

    console.log(`Run ID: ${result.run_id}`);
    console.log('');
    console.log('📥 Collect');
    console.log(`  Collected: ${result.collect?.collected || 0}`);
    console.log('');
    console.log('⚙️  Extract');
    console.log(`  Processed: ${result.extract?.processed || 0}`);
    console.log(`  Created:   ${result.extract?.created || 0}`);
    console.log('');
    console.log('✅ Complete!');
  } catch (e) {
    console.error('Run failed:', e);
  }
}
