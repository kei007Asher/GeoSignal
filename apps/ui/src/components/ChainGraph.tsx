import type { ChainNode, ChainEdge } from '../lib/types';

interface Props {
  nodes: ChainNode[];
  edges: ChainEdge[];
}

const NODE_COLORS: Record<string, string> = {
  event: 'bg-blue-100 text-blue-800 border-blue-200',
  statement: 'bg-gray-100 text-gray-800 border-gray-200',
  sanction: 'bg-red-100 text-red-800 border-red-200',
  military: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function ChainGraph({ nodes, edges }: Props) {
  return (
    <div className="space-y-4">
      {nodes.map((node) => {
        const outgoingEdges = edges.filter((e) => e.from === node.id);
        const colorClass = NODE_COLORS[node.type] || NODE_COLORS.event;

        return (
          <div key={node.id} className="relative">
            <div className={`border rounded-lg p-4 ${colorClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/50">
                  {node.type}
                </span>
                <span className="text-xs opacity-75">{node.date}</span>
              </div>
              <p className="text-sm font-medium">{node.title}</p>
            </div>
            {outgoingEdges.map((edge) => (
              <div
                key={edge.to}
                className="ml-6 mt-2 flex items-center gap-2"
              >
                <div className="w-4 border-t border-gray-300" />
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    edge.is_inference
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {edge.is_inference ? 'INFERENCE' : 'FACT'}: {edge.label}
                </span>
                <div className="w-4 border-t border-gray-300" />
                <span className="text-xs text-gray-500">→</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
