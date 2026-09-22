import React, { useState } from 'react';
import { 
  Share2, 
  AlertTriangle, 
  Filter, 
  Layers, 
  CheckCircle, 
  ArrowRight, 
  Info,
  Building2,
  Anchor,
  Compass
} from 'lucide-react';
import { NetworkNode, NetworkEdge } from '../types/supplyChain';
import { networkGraphNodes, networkGraphEdges } from '../data/mockData';

interface NetworkGraphViewProps {
  onNavigateRisk: (supplierId?: string) => void;
}

export const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({ onNavigateRisk }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-t1-silico');
  const [tierFilter, setTierFilter] = useState<'all' | 'bottlenecks' | 'tier1' | 'tier2' | 'tier3'>('all');

  const selectedNode = networkGraphNodes.find(n => n.id === selectedNodeId) || networkGraphNodes[0];

  // Upstream and Downstream relationships
  const upstreamEdges = networkGraphEdges.filter(e => e.target === selectedNodeId);
  const downstreamEdges = networkGraphEdges.filter(e => e.source === selectedNodeId);

  const upstreamNodes = networkGraphNodes.filter(n => upstreamEdges.some(e => e.source === n.id));
  const downstreamNodes = networkGraphNodes.filter(n => downstreamEdges.some(e => e.target === n.id));

  const isVisible = (node: NetworkNode) => {
    if (tierFilter === 'bottlenecks') return node.isBottleneck;
    if (tierFilter === 'tier1') return node.type === 'tier1' || node.type === 'oem';
    if (tierFilter === 'tier2') return node.type === 'tier2';
    if (tierFilter === 'tier3') return node.type === 'tier3';
    return true;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <Share2 className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Multi-Tier (N-Tier) Supplier Network Topology</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              Neo4j Cypher Graph
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tracks hidden single points of failure across Tier-1 contractors, Tier-2 component makers, and Tier-3 raw material smelters.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-xl text-xs">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tierFilter === 'all' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setTierFilter('bottlenecks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tierFilter === 'bottlenecks' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Bottlenecks Only
          </button>
          <button
            onClick={() => setTierFilter('tier1')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tierFilter === 'tier1' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tier 1
          </button>
          <button
            onClick={() => setTierFilter('tier2')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tierFilter === 'tier2' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tier 2
          </button>
          <button
            onClick={() => setTierFilter('tier3')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tierFilter === 'tier3' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tier 3
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Interactive Topology Canvas */}
        <div className="lg:col-span-8 bg-[#1A0B2E] p-4 rounded-2xl border border-purple-900/70 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          
          {/* Legend Overlay */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-300 pb-3 border-b border-purple-900/60 z-10 gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Low Risk (&lt;40)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Medium (40–69)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-rose-300 font-bold">Critical Chokepoint (≥70)</span>
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Flow Direction: Tier 3 (Left) → Tier 2 → Tier 1 → OEM (Right)
            </div>
          </div>

          {/* SVG Map */}
          <div className="relative w-full h-[440px] select-none my-auto">
            <svg viewBox="0 0 820 560" className="w-full h-full">
              <defs>
                <linearGradient id="gradEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFB7A5" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Column Guidelines & Headers */}
              <text x="60" y="30" fill="#9CA3AF" textAnchor="middle" className="text-[10px] uppercase font-bold tracking-wider">Tier 3 (Raw Materials)</text>
              <text x="240" y="30" fill="#9CA3AF" textAnchor="middle" className="text-[10px] uppercase font-bold tracking-wider">Tier 2 (Sub-Components)</text>
              <text x="460" y="30" fill="#9CA3AF" textAnchor="middle" className="text-[10px] uppercase font-bold tracking-wider">Tier 1 (Assembly)</text>
              <text x="720" y="30" fill="#9CA3AF" textAnchor="middle" className="text-[10px] uppercase font-bold tracking-wider">OEM Assembly Plants</text>

              <line x1="150" y1="45" x2="150" y2="540" stroke="#2A1343" strokeDasharray="3 3" />
              <line x1="350" y1="45" x2="350" y2="540" stroke="#2A1343" strokeDasharray="3 3" />
              <line x1="590" y1="45" x2="590" y2="540" stroke="#2A1343" strokeDasharray="3 3" />

              {/* Edges */}
              {networkGraphEdges.map((edge) => {
                const sNode = networkGraphNodes.find(n => n.id === edge.source);
                const tNode = networkGraphNodes.find(n => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const isConnectedToSelected = edge.source === selectedNodeId || edge.target === selectedNodeId;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={
                        isConnectedToSelected
                          ? '#FFB7A5'
                          : edge.isCongested
                          ? '#EF4444'
                          : '#4B2677'
                      }
                      strokeWidth={isConnectedToSelected ? 3 : edge.isCongested ? 2 : 1.5}
                      strokeDasharray={edge.isCongested ? '4 4' : 'none'}
                      opacity={isConnectedToSelected ? 1 : 0.65}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {networkGraphNodes.map((node) => {
                if (!isVisible(node)) return null;

                const isSelected = node.id === selectedNodeId;
                const isCrit = node.risk >= 70;
                const isMed = node.risk >= 40 && node.risk < 70;
                const nodeColor = node.type === 'oem' 
                  ? '#3B82F6' 
                  : isCrit ? '#EF4444' : isMed ? '#F59E0B' : '#10B981';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Pulsing halo if bottleneck */}
                    {node.isBottleneck && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill="#EF4444"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.type === 'oem' ? 18 : 14}
                      fill={nodeColor}
                      stroke={isSelected ? '#FFB7A5' : '#1A0B2E'}
                      strokeWidth={isSelected ? 3 : 2}
                    />

                    {/* Node Risk Label inside */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill="#FFFFFF"
                      textAnchor="middle"
                      className="text-[9px] font-bold font-mono pointer-events-none"
                    >
                      {node.type === 'oem' ? 'OEM' : node.risk}
                    </text>

                    {/* Node Name Label */}
                    <text
                      x={node.x}
                      y={node.y + 26}
                      fill={isSelected ? '#FFB7A5' : '#D1D5DB'}
                      textAnchor="middle"
                      className={`text-[10px] font-medium pointer-events-none ${isSelected ? 'font-bold' : ''}`}
                    >
                      {node.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>

          <div className="text-center text-[10px] text-gray-400 pt-2 border-t border-purple-900/40">
            Click on any node to reveal upstream dependency chain and critical single-source risks.
          </div>
        </div>

        {/* Right Details Panel for Selected Node */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedNode.type === 'oem' ? 'bg-blue-100 text-blue-800' :
                selectedNode.type === 'tier1' ? 'bg-purple-100 text-purple-800' :
                selectedNode.type === 'tier2' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedNode.type.toUpperCase()} Node
              </span>

              <span className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                selectedNode.risk >= 70 ? 'bg-rose-100 text-rose-700' :
                selectedNode.risk >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Risk: {selectedNode.risk}/100
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-gray-900">{selectedNode.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedNode.category} • {selectedNode.location}
              </p>
              {selectedNode.leadTime > 0 && (
                <div className="text-xs text-gray-600 font-medium mt-1">
                  Contract Lead Time: <span className="font-mono font-bold text-gray-900">{selectedNode.leadTime} days</span>
                </div>
              )}
            </div>

            {/* Chokepoint Warning */}
            {selectedNode.isBottleneck && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Single Point of Failure (Chokepoint)</strong>
                  Critical dependency in manufacturing flow. No qualified Tier-2 alternative currently in buffer stock.
                </div>
              </div>
            )}

            {/* Upstream Dependencies */}
            <div className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Upstream Suppliers ({upstreamNodes.length})
              </h4>
              {upstreamNodes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Primary tier root node (no upstream dependencies)</p>
              ) : (
                <div className="space-y-1.5">
                  {upstreamNodes.map(up => (
                    <div 
                      key={up.id} 
                      onClick={() => setSelectedNodeId(up.id)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-medium text-gray-800">{up.label}</span>
                        <span className="text-[10px] text-gray-500 block">{up.category}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        up.risk >= 70 ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {up.risk}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Destination Assemblies */}
            <div className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Downstream Consumers ({downstreamNodes.length})
              </h4>
              {downstreamNodes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Final assembly tier (OEM destination)</p>
              ) : (
                <div className="space-y-1.5">
                  {downstreamNodes.map(down => (
                    <div 
                      key={down.id} 
                      onClick={() => setSelectedNodeId(down.id)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-medium text-gray-800">{down.label}</span>
                        <span className="text-[10px] text-gray-500 block">{down.category}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        down.risk >= 70 ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {down.risk}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Action button to jump to XGBoost score */}
          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => onNavigateRisk()}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors"
            >
              <span>Drill into XGBoost SHAP Factors</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFB7A5]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
