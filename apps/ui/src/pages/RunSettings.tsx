import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getRuns, getSources, triggerRun } from '../lib/api';
import type { Run, Source } from '../lib/types';
import RunMeter from '../components/RunMeter';

export default function RunSettings() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [runsData, sourcesData] = await Promise.all([
        getRuns(),
        getSources(),
      ]);
      setRuns(runsData);
      setSources(sourcesData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun(dryRun: boolean) {
    setRunning(true);
    try {
      await triggerRun(dryRun);
      await loadData();
    } catch (e) {
      console.error('Run failed:', e);
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const latestRun = runs[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Run / Settings</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">手動実行</h2>

        {latestRun && (
          <div className="mb-6">
            <RunMeter
              used={latestRun.raw_used_today}
              max={latestRun.max_raw_per_day}
            />
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleRun(true)}
            disabled={running}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {running ? '実行中...' : 'Run (dry-run)'}
          </button>
          <button
            onClick={() => handleRun(false)}
            disabled={running}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {running ? '実行中...' : 'Run (write)'}
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Cron:</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                OFF
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">LLM:</span>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                OFF
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">MAX_DEEP:</span>
              <span className="font-mono text-xs">10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">実行履歴</h2>
        <div className="space-y-3">
          {runs.length === 0 ? (
            <p className="text-gray-500 text-sm">実行履歴がありません。</p>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(run.started_at), 'M/d HH:mm', {
                      locale: ja,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {run.mode} {run.dry_run && '(dry-run)'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono">
                    {run.raw_used_today} raw
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      run.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : run.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sources ({sources.length})
        </h2>
        <div className="space-y-2">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {source.name}
                </p>
                <p className="text-xs text-gray-500">
                  {source.type} | Tier {source.tier}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  source.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {source.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
