export function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

export function getJSTToday(): string {
  return getJSTNow().toISOString().split('T')[0];
}

export function getJSTTimestamp(): string {
  return getJSTNow().toISOString();
}
