import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getSignals, getLatestRun } from '../lib/api';
import type { Signal, Run } from '../lib/types';
import SignalCard from '../components/SignalCard';

export default function Dashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [latestRun, setLatestRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setError(null);
      const [sigs, run] = await Promise.all([getSignals(), getLatestRun()]);
      setSignals(sigs);
      setLatestRun(run);
    } catch (e) {
      console.error('Failed to load data:', e);
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Signals</h1>
          <p className="text-sm text-gray-500">
            {format(new Date(), 'yyyy年M月d日 (eee)', { locale: ja })} JST
          </p>
        </div>
        {latestRun && (
          <div className="text-right text-xs text-gray-500">
            <p>
              最終更新:{' '}
              {latestRun.finished_at
                ? format(new Date(latestRun.finished_at), 'HH:mm')
                : '-'}
            </p>
            <p className="font-mono">
              {latestRun.raw_used_today} / {latestRun.max_raw_per_day} raw
            </p>
          </div>
        )}
      </div>

      {signals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-2">シグナルがありません。</p>
          <p className="text-sm text-gray-400">
            Run / Settings から収集を実行してください。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
