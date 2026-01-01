import type { Env } from '../index';

export function assertCronAuth(request: Request, env: Env): boolean {
  if (!env.CRON_SECRET) {
    return true;
  }

  const provided =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  return provided === env.CRON_SECRET;
}
