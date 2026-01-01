import { planCommand } from './commands/plan.js';
import { collectCommand } from './commands/collect.js';
import { extractCommand } from './commands/extract.js';
import { signalCommand } from './commands/signal.js';
import { runCommand } from './commands/run.js';

const USAGE = `
GeoSignal CLI

Usage:
  pnpm cli plan              見積もり表示
  pnpm cli collect           ソース収集
  pnpm cli extract           シグナル抽出
  pnpm cli signal            シグナル生成
  pnpm cli run               全工程を順次実行

Options:
  --dry-run                  書き込みをスキップ
  --verbose                  詳細ログ出力

Environment:
  GS_API_URL                 API URL (default: http://localhost:8787)
  GS_CRON_SECRET             認証シークレット
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  const ctx = { dryRun, verbose };

  switch (command) {
    case 'plan':
      await planCommand(ctx);
      break;
    case 'collect':
      await collectCommand(ctx);
      break;
    case 'extract':
      await extractCommand(ctx);
      break;
    case 'signal':
      await signalCommand(ctx);
      break;
    case 'run':
      await runCommand(ctx);
      break;
    default:
      console.log(USAGE);
  }
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
