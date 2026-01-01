import { config } from './config.js';

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.cronSecret) {
    headers['X-Cron-Secret'] = config.cronSecret;
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}
