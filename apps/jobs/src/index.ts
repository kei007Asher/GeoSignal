import { handleSignals, handleSignalById } from './routes/signals';
import { handleChains } from './routes/chains';
import { handleRuns, handleCreateRun, handleTriggerJob } from './routes/runs';
import { handleSources } from './routes/sources';

export interface Env {
  DB: D1Database;
  MAX_RAW_PER_DAY: string;
  MAX_DEEP_PER_RUN: string;
  LLM_MODE: string;
  CRON_SECRET?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Cron-Secret',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/api/signals' && request.method === 'GET') {
        return handleSignals(request, env);
      }
      if (path.match(/^\/api\/signals\/[^/]+$/) && request.method === 'GET') {
        const id = path.split('/')[3];
        return handleSignalById(id, env);
      }
      if (path === '/api/chains' && request.method === 'GET') {
        return handleChains(request, env);
      }
      if (path === '/api/runs' && request.method === 'GET') {
        return handleRuns(request, env);
      }
      if (path === '/api/runs' && request.method === 'POST') {
        return handleCreateRun(request, env);
      }
      if (path === '/api/jobs/run' && request.method === 'POST') {
        return handleTriggerJob(request, env);
      }
      if (path === '/api/sources' && request.method === 'GET') {
        return handleSources(request, env);
      }
      if (path === '/api/health') {
        return jsonResponse({
          ok: true,
          llm_mode: env.LLM_MODE,
          max_raw_per_day: env.MAX_RAW_PER_DAY,
        });
      }

      return errorResponse('Not Found', 404);
    } catch (error) {
      console.error('API Error:', error);
      return errorResponse('Internal Server Error', 500);
    }
  },
};
