import type { Evidence } from '../lib/types';

interface Props {
  evidence: Evidence[];
}

const TYPE_LABELS: Record<string, { label: string; class: string }> = {
  official: { label: '公式', class: 'bg-green-100 text-green-800' },
  news: { label: '報道', class: 'bg-blue-100 text-blue-800' },
  social: { label: 'SNS', class: 'bg-purple-100 text-purple-800' },
};

export default function EvidenceList({ evidence }: Props) {
  return (
    <div className="space-y-3">
      {evidence.map((ev, i) => {
        const typeInfo = TYPE_LABELS[ev.evidence_type] || TYPE_LABELS.news;
        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${typeInfo.class}`}>
                  {typeInfo.label}
                </span>
                <span className="text-xs text-gray-500">{ev.source_id}</span>
              </div>
              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline line-clamp-2"
              >
                {ev.title}
              </a>
              {ev.quote && (
                <blockquote className="mt-2 text-sm text-gray-600 border-l-2 border-gray-300 pl-3 italic">
                  "{ev.quote}"
                </blockquote>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
