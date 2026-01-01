interface Props {
  used: number;
  max: number;
}

export default function RunMeter({ used, max }: Props) {
  const pct = Math.min(100, (used / max) * 100);
  const color =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">MAX_RAW_PER_DAY</span>
        <span className="font-mono font-medium">
          {used} / {max}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 90 && (
        <p className="text-xs text-red-600 mt-1">⚠️ 日次上限に近づいています</p>
      )}
    </div>
  );
}
