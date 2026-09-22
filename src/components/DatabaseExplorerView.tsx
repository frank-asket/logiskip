import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Share2, 
  FileCode, 
  Search, 
  Terminal, 
  Check, 
  Copy, 
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';
import { Supplier, PurchaseOrder, TelemetryEvent } from '../types/supplyChain';

interface DatabaseExplorerViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  telemetryEvents: TelemetryEvent[];
}

export const DatabaseExplorerView: React.FC<DatabaseExplorerViewProps> = ({
  suppliers,
  purchaseOrders,
  telemetryEvents
}) => {
  const [activeDb, setActiveDb] = useState<'postgres' | 'neo4j' | 'mongo'>('postgres');
  const [copied, setCopied] = useState(false);

  const postgresQuery = `SELECT 
    po.po_number,
    v.name AS supplier_name,
    v.country,
    po.component,
    po.quantity,
    po.total_value,
    po.predicted_delay_days,
    po.status
FROM purchase_orders po
JOIN vendor_master v ON po.supplier_id = v.id
WHERE po.predicted_delay_days > 0
ORDER BY po.total_value DESC;`;

  const cypherQuery = `MATCH (t3:Supplier {tier: 3})-[r1:SUPPLIES]->(t2:Supplier {tier: 2})
MATCH (t2)-[r2:FEEDS]->(t1:Supplier {tier: 1})
MATCH (t1)-[r3:DELIVERS]->(oem:Plant {name: "Assembly Plant Alpha"})
WHERE t3.is_bottleneck = true
RETURN t3.name, t2.name, t1.name, r1.lead_time_days + r2.lead_time_days AS cumulative_risk_lag;`;

  const mongoSample = {
    _id: "66f194a2b910283c840291f0",
    event_type: "LLM_EXECUTIVE_BRIEF_GENERATION",
    cpo_user_id: "usr_keycloak_procurement_dir_01",
    timestamp: new Date().toISOString(),
    llm_metadata: {
      model: "gemini-3.8-flash",
      temperature: 0.2,
      rag_sources_indexed: [
        "postgresql://purchase_orders",
        "neo4j://tier_topology_v3",
        "kafka://topic.po.telemetry.v1"
      ]
    },
    risk_assessment: {
      global_index: 78.4,
      total_var_usd: 24800000,
      predicted_shutdown_days: 34,
      chokepoint_suppliers: ["SPSC-TW", "ATF-UK"]
    },
    compliance_audit: {
      iso_26262_verified: true,
      customs_eccn_flag: "3A090"
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Polyglot Data Layer Explorer</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              databases/ (PostgreSQL • Neo4j • MongoDB)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Integrated multi-model storage layer powering relational purchase orders, graph relationship traversals, and document audit trails.
          </p>
        </div>

        {/* Database Switcher Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-xl text-xs">
          <button
            onClick={() => setActiveDb('postgres')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeDb === 'postgres' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>PostgreSQL (Relational)</span>
          </button>
          <button
            onClick={() => setActiveDb('neo4j')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeDb === 'neo4j' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Neo4j (Graph)</span>
          </button>
          <button
            onClick={() => setActiveDb('mongo')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeDb === 'mongo' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>MongoDB (Document)</span>
          </button>
        </div>
      </div>

      {/* Database 1: PostgreSQL */}
      {activeDb === 'postgres' && (
        <div className="space-y-4">
          
          {/* SQL Terminal Bar */}
          <div className="bg-[#1A0B2E] text-white p-4 rounded-2xl border border-purple-900/60 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/50 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-[#FFB7A5]" />
                <span className="font-bold text-gray-200">psql — PostgreSQL 16.2 (logiskip_relational)</span>
              </div>
              <button
                onClick={() => handleCopy(postgresQuery)}
                className="text-[10px] text-gray-300 hover:text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] text-[#FFB7A5] overflow-x-auto leading-relaxed">
              {postgresQuery}
            </pre>
          </div>

          {/* Table Results */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-gray-900">Query Output: purchase_orders JOIN vendor_master ({purchaseOrders.length} Rows)</h3>
              <span className="text-gray-500 font-mono text-[11px]">Execution time: 3.4ms</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                    <th className="pb-2">po_number</th>
                    <th className="pb-2">supplier_name</th>
                    <th className="pb-2">component</th>
                    <th className="pb-2 text-right">quantity</th>
                    <th className="pb-2 text-right">total_value</th>
                    <th className="pb-2 text-right">predicted_delay</th>
                    <th className="pb-2">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[11px]">
                  {purchaseOrders.map(po => (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="py-2.5 font-bold text-gray-900">{po.poNumber}</td>
                      <td className="py-2.5 text-gray-700">{po.supplierName}</td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[200px]">{po.component}</td>
                      <td className="py-2.5 text-right text-gray-800">{po.quantity.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">${po.totalValue.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        {po.predictedDelayDays > 0 ? (
                          <span className="text-rose-600 font-bold">+{po.predictedDelayDays}d</span>
                        ) : (
                          <span className="text-emerald-600">0d</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded uppercase text-[9px] font-bold bg-gray-100 text-gray-700">
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Database 2: Neo4j Cypher */}
      {activeDb === 'neo4j' && (
        <div className="space-y-4">
          
          <div className="bg-[#1A0B2E] text-white p-4 rounded-2xl border border-purple-900/60 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/50 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-[#FFB7A5]" />
                <span className="font-bold text-gray-200">cypher-shell — Neo4j Enterprise (logiskip_graph)</span>
              </div>
              <button
                onClick={() => handleCopy(cypherQuery)}
                className="text-[10px] text-gray-300 hover:text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Cypher'}</span>
              </button>
            </div>
            <pre className="text-[11px] text-[#FFB7A5] overflow-x-auto leading-relaxed">
              {cypherQuery}
            </pre>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-xs">Identified Multi-Tier Graph Paths</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-rose-600 font-bold">Odessa Purified Gases (T3)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-amber-600 font-bold">Formosa Wafer Foundry (T2)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-purple-900 font-bold">SilicoPrecision Corp (T1)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-blue-700 font-bold">OEM Detroit Alpha</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded">Lag: 78 Days</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-amber-600 font-bold">Norilsk Class 1 Nickel (T3)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-amber-600 font-bold">Umicore Cathode Synthesis (T2)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-purple-900 font-bold">Nordic Battery Systems (T1)</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-blue-700 font-bold">OEM Detroit Alpha</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded">Lag: 45 Days</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Database 3: MongoDB */}
      {activeDb === 'mongo' && (
        <div className="space-y-4">
          
          <div className="bg-[#1A0B2E] text-white p-4 rounded-2xl border border-purple-900/60 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/50 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-[#FFB7A5]" />
                <span className="font-bold text-gray-200">mongosh — MongoDB 7.0 (collection: audit_briefs)</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(mongoSample, null, 2))}
                className="text-[10px] text-gray-300 hover:text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-[11px] text-[#FFB7A5] overflow-x-auto leading-relaxed">
              db.audit_briefs.find().sort(&#123; timestamp: -1 &#125;).limit(1)
            </pre>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <h3 className="font-bold text-gray-900 text-xs">Document Record (JSON Document View)</h3>
            <pre className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 overflow-x-auto leading-relaxed">
              {JSON.stringify(mongoSample, null, 2)}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
};
