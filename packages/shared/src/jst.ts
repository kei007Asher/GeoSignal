export function getJSTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

export function getJSTToday(): string {
  return getJSTNow().toISOString().split('T')[0];
}

export function getJSTDayRange(dateStr?: string): {
  start: string;
  end: string;
  ymd: string;
} {
  const ymd = dateStr || getJSTToday();
  const start = `${ymd}T00:00:00+09:00`;
  const end = `${ymd}T23:59:59.999+09:00`;
  return { start, end, ymd };
}

export function formatJSTDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().replace('T', ' ').slice(0, 19);
}
