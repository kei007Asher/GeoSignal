import { Link } from 'react-router-dom';
import type { Signal } from '../lib/types';
import DiffBadge from './DiffBadge';

interface Props {
  signal: Signal;
}

export default function SignalCard({ signal }: Props) {
  const hasOfficial = signal.evidence.some(
    (e) => e.evidence_type === 'official'
  );

  return (
    <Link
      to={`/signals/${signal.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
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
            {hasOfficial && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                公式
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {signal.title}
          </h3>
          {signal.summary && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {signal.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {signal.why_up.slice(0, 3).map((w) => (
              <DiffBadge key={w.metric} metric={w.metric} delta={w.delta} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div
            className={`text-2xl font-bold ${
              signal.score >= 70
                ? 'text-red-600'
                : signal.score >= 50
                  ? 'text-amber-600'
                  : 'text-gray-600'
            }`}
          >
            {signal.score}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {signal.evidence.length} sources
          </div>
        </div>
      </div>
    </Link>
  );
}
