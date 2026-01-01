interface CLIContext {
  dryRun: boolean;
  verbose: boolean;
}

export async function signalCommand(ctx: CLIContext): Promise<void> {
  console.log('📡 Signal');
  console.log('─'.repeat(40));
  console.log('(Not implemented yet)');
}
