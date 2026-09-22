import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  BrainCircuit, 
  ShieldAlert,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Supplier, PurchaseOrder } from '../types/supplyChain';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  purchaseOrders
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const criticalSuppliers = suppliers.filter(s => s.riskScore >= 70);
  const totalVaR = suppliers.reduce((acc, s) => acc + s.valueAtRisk, 0);

  const reportDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const reportText = `# LOGISKIP EXECUTIVE PROCUREMENT INTELLIGENCE BRIEF
Generated: ${reportDate} | Classification: STRICTLY CONFIDENTIAL - C-SUITE ONLY
Authoring Engine: Logiskip LLM / RAG Reporter Service

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & THREAT MATRIX (30–90 DAY HORIZON)
--------------------------------------------------------------------------------
The global supply chain risk index currently registers at 78.4 / 100 (ELEVATED). 
Across monitored supply contracts, Total Value at Risk (VaR) has climbed to $${(totalVaR / 1000000).toFixed(1)}M across ${purchaseOrders.length} critical purchase orders.

Key finding:
Without immediate intervention, Assembly Plant Alpha (Detroit) faces a projected line shutdown event within 34 days, driven by compound constraints at SilicoPrecision Semiconductor Corp (Taiwan) and AeroTitanium Forgings Ltd (UK).

--------------------------------------------------------------------------------
2. CRITICAL BOTTLENECK CHOKEPOINTS (XGBoost + SHAP ANALYSIS)
--------------------------------------------------------------------------------
* SilicoPrecision Semiconductor Corp (Taiwan | Risk: 84/100 | Tier 1)
  - Primary Risk Driver: Local municipal water rationing at Hsinchu Science Park (-18% wafer run-rate).
  - Sub-Tier Vulnerability: Sole-sourced neon gas pipeline under Eastern European export restrictions.
  - Active Exposure: PO-2026-8891 ($1.91M MCU shipment, +22 day predicted delay).

* AeroTitanium Forgings Ltd (UK | Risk: 73/100 | Tier 2)
  - Primary Risk Driver: Grid peak pricing curtailment forcing 3-day workweek operating cycles.
  - Requalification Barrier: FAA / EASA secondary vendor compliance takes 90+ days.
  - Active Exposure: PO-2026-8915 ($1.98M chassis nodes, +14 day predicted delay).

--------------------------------------------------------------------------------
3. DEMAND VS CAPACITY DEFICIT (PROPHET ENGINE)
--------------------------------------------------------------------------------
Facebook Prophet Bayesian decomposition (<6.4% MAPE) projects Q4 automotive MCU demand of 229,000 units by December 2026 (T+90 days).
Committed supplier run-rate remains capped at 165,000 units, yielding a net deficit of 64,000 units ($2.72M production delta).

--------------------------------------------------------------------------------
4. SCIPY LINEAR PROGRAMMING OPTIMIZATION DIRECTIVE
--------------------------------------------------------------------------------
SciPy Simplex optimization has established a Pareto-optimal allocation strategy:
- Throttle SilicoPrecision (TW) allocation from 55,000 units down to 15,000 units (minimum contract safe line).
- Surge Apex Microelectronics (Dresden, Germany) allocation from 15,000 units to 40,000 units (+25k shift).
- Surge Apex Energy & Micro (Korea) allocation from 5,000 units to 20,000 units (+15k shift).

Financial Impact:
- Procurement Premium: +$35,500 (+1.1% landed cost increase)
- Systemic Risk Reduction: -51% (weighted risk falls from 71 to 35/100)
- Net Downtime Avoided: 18 line-down days ($14.2M gross downtime loss averted)

--------------------------------------------------------------------------------
5. 7-DAY PROCUREMENT ACTION PROTOCOL
--------------------------------------------------------------------------------
[ ] 1. Issue Purchase Order Change Amendments to Apex Microelectronics Dresden.
[ ] 2. Release customs documents for PO-2026-8892 held at Hamburg Port.
[ ] 3. Qualify Kyoto Precision Extrusions (Japan) for backup titanium node batch.
[ ] 4. Re-run daily Kafka PO telemetry ingest for real-time AIS marine tracking.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Logiskip-Executive-Brief-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0B2E]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-purple-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#1A0B2E] text-white flex items-center justify-between border-b border-purple-900">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#2A1343] text-[#FFB7A5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Logiskip Executive AI Procurement Brief</h3>
              <p className="text-[11px] text-gray-300">Automated RAG Synthesis • 30–90 Day Risk Mitigation Protocol</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="p-1.5 rounded-lg hover:bg-purple-900 text-gray-300 hover:text-white transition-colors"
              title="Re-synthesize with latest telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-purple-900 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Formatted Report */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-gray-800 bg-gray-50/70 space-y-4">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#1A0B2E] animate-bounce" />
              <p className="text-xs font-sans font-bold text-[#1A0B2E]">Synthesizing Executive RAG Brief via Logiskip LLM Reporter...</p>
              <p className="text-[11px] font-sans text-gray-500">Cross-referencing XGBoost risk scores with Prophet demand deficits</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono leading-relaxed bg-white p-5 rounded-xl border border-gray-200 shadow-inner">
              {reportText}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-gray-500 font-sans">
            Ready for dissemination to Chief Procurement Officer (CPO) & VP of Supply Chain.
          </span>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#1A0B2E] font-bold text-white hover:bg-[#2A1343] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#FFB7A5]" />
              <span>Download Markdown</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
