interface Props {
  metric: string;
  delta: number;
}

const METRIC_LABELS: Record<string, string> = {
  source_mentions: '言及数',
  cross_region: '地域跨ぎ',
  official_source: '公式',
  travel_related: '渡航関連',
  recency: '新着度',
};

export default function DiffBadge({ metric, delta }: Props) {
  const label = METRIC_LABELS[metric] || metric;
  const sign = delta > 0 ? '+' : '';

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
      <span>{label}</span>
      <span
        className={
          delta > 0
            ? 'text-red-600 font-medium'
            : delta < 0
              ? 'text-green-600 font-medium'
              : 'text-gray-500'
        }
      >
        {sign}
        {delta}
      </span>
    </span>
  );
}
