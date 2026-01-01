import { useState } from 'react';
import ChainGraph from '../components/ChainGraph';
import type { ChainNode, ChainEdge } from '../lib/types';

const sampleNodes: ChainNode[] = [
  {
    id: 'n1',
    signal_id: 'sig_2025-12-29_001',
    title: '中国軍が台湾周辺で大規模演習を実施',
    date: '2025-12-28',
    type: 'military',
  },
  {
    id: 'n2',
    signal_id: 'sig_2025-12-29_002',
    title: 'EU、対中半導体輸出規制の強化を検討',
    date: '2025-12-28',
    type: 'sanction',
  },
  {
    id: 'n3',
    signal_id: '',
    title: '台湾TSMCが生産計画の見直しを示唆',
    date: '2025-12-29',
    type: 'event',
  },
];

const sampleEdges: ChainEdge[] = [
  {
    from: 'n1',
    to: 'n2',
    label: '安全保障懸念が規制議論を加速',
    is_inference: true,
  },
  {
    from: 'n2',
    to: 'n3',
    label: 'サプライチェーンへの影響',
    is_inference: true,
  },
];

export default function Chains() {
  const [nodes] = useState<ChainNode[]>(sampleNodes);
  const [edges] = useState<ChainEdge[]>(sampleEdges);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chains（事象の連鎖）
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          イベント間の因果関係を可視化。
          <span className="text-amber-600">INFERENCE</span>は推測を示す。
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {nodes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            連鎖データがありません。
          </p>
        ) : (
          <ChainGraph nodes={nodes} edges={edges} />
        )}
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          ⚠️
          この画面は簡易版です。将来的にはインタラクティブなグラフ可視化を実装予定。
        </p>
      </div>
    </div>
  );
}
