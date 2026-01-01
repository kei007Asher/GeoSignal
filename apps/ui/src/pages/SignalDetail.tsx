import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getSignal } from '../lib/api';
import type { Signal } from '../lib/types';
import EvidenceList from '../components/EvidenceList';
import DiffBadge from '../components/DiffBadge';

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSignal(id);
    }
  }, [id]);

  async function loadSignal(signalId: string) {
    try {
      setError(null);
      const data = await getSignal(signalId);
      setSignal(data);
    } catch (e) {
      console.error('Failed to load signal:', e);
      setError('シグナルの読み込みに失敗しました');
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

  if (error || !signal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          {error || 'シグナルが見つかりません。'}
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        ← ダッシュボードに戻る
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {signal.labels.map((label) => (
                  <span
                    key={label}
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      label === 'FACT'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{signal.title}</h1>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(signal.updated_at), 'yyyy年M月d日 HH:mm', {
                  locale: ja,
                })}
              </p>
            </div>
            <div
              className={`text-3xl font-bold ${
                signal.score >= 70
                  ? 'text-red-600'
                  : signal.score >= 50
                    ? 'text-amber-600'
                    : 'text-gray-600'
              }`}
            >
              {signal.score}
            </div>
          </div>
        </div>

        {signal.summary && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">要点</h2>
            <p className="text-gray-900">{signal.summary}</p>
            <p className="text-xs text-gray-500 mt-2">
              ※ LLM OFF のためテンプレート整形
            </p>
          </div>
        )}

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Evidence（根拠）— {signal.evidence.length}件
          </h2>
          <EvidenceList evidence={signal.evidence} />
        </div>

        <div className="p-6 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            スコア上昇理由（score_components diff）
          </h2>
          <div className="flex flex-wrap gap-3">
            {signal.why_up.map((w) => (
              <div
                key={w.metric}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <DiffBadge metric={w.metric} delta={w.delta} />
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {w.prev} → {w.curr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
