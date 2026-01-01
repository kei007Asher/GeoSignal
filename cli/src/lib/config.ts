export const config = {
  apiUrl: process.env.GS_API_URL || 'http://localhost:8787',
  cronSecret: process.env.GS_CRON_SECRET || '',
};
