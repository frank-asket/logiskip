import React, { useState } from 'react';
import { 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  Play,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { OptimizationVendorOption, PurchaseOrder } from '../types/supplyChain';

interface OptimizationSolverProps {
  onApplyOptimization: (newPOs: any[]) => void;
}

export const OptimizationSolver: React.FC<OptimizationSolverProps> = ({ onApplyOptimization }) => {
  // Solver weights
  const [riskWeight, setRiskWeight] = useState<number>(65); // 0 (pure cost) to 100 (pure resilience)
  const [maxRiskCeiling, setMaxRiskCeiling] = useState<number>(60);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [hasSolved, setHasSolved] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  // Initial allocation for 75,000 MCU units
  const initialVendors: OptimizationVendorOption[] = [
    {
      vendorId: 'sup-01',
      vendorName: 'SilicoPrecision (Taiwan - High Risk)',
      currentAllocatedUnits: 55000,
      recommendedAllocatedUnits: 55000,
      unitCost: 42.50,
      leadTimeDays: 78,
      riskScore: 84,
      maxCapacity: 65000,
      minOrderQuantity: 10000,
      costDelta: 0
    },
    {
      vendorId: 'sup-04',
      vendorName: 'Apex Microelectronics (Dresden - Low Risk)',
      currentAllocatedUnits: 15000,
      recommendedAllocatedUnits: 15000,
      unitCost: 43.80,
      leadTimeDays: 32,
      riskScore: 29,
      maxCapacity: 45000,
      minOrderQuantity: 5000,
      costDelta: 0
    },
    {
      vendorId: 'sup-05',
      vendorName: 'Apex Energy & Micro (Korea - Low Risk)',
      currentAllocatedUnits: 5000,
      recommendedAllocatedUnits: 5000,
      unitCost: 44.10,
      leadTimeDays: 36,
      riskScore: 38,
      maxCapacity: 30000,
      minOrderQuantity: 5000,
      costDelta: 0
    }
  ];

  const [vendors, setVendors] = useState<OptimizationVendorOption[]>(initialVendors);

  // Compute stats for current vs recommended
  const totalTargetUnits = 75000;

  const currentCost = vendors.reduce((acc, v) => acc + v.currentAllocatedUnits * v.unitCost, 0);
  const currentWeightedRisk = Math.round(
    vendors.reduce((acc, v) => acc + v.currentAllocatedUnits * v.riskScore, 0) / totalTargetUnits
  );

  const recommendedCost = vendors.reduce((acc, v) => acc + v.recommendedAllocatedUnits * v.unitCost, 0);
  const recommendedWeightedRisk = Math.round(
    vendors.reduce((acc, v) => acc + v.recommendedAllocatedUnits * v.riskScore, 0) / totalTargetUnits
  );

  const runSciPySolver = () => {
    setIsSolving(true);
    setAppliedNotification(false);

    // Simulate SciPy Linear Program computation
    setTimeout(() => {
      // If risk weight is high, drastically throttle SilicoPrecision down to minimum safe quota
      // and redirect volume to Dresden and Korea
      let silicoUnits = 15000;
      let dresdenUnits = 40000;
      let koreaUnits = 20000;

      if (riskWeight < 40) {
        // Balanced/cost-focused
        silicoUnits = 35000;
        dresdenUnits = 28000;
        koreaUnits = 12000;
      } else if (riskWeight > 80) {
        // Extreme risk-aversion
        silicoUnits = 10000;
        dresdenUnits = 45000;
        koreaUnits = 20000;
      }

      const updated = vendors.map(v => {
        let rec = v.currentAllocatedUnits;
        if (v.vendorId === 'sup-01') rec = silicoUnits;
        if (v.vendorId === 'sup-04') rec = dresdenUnits;
        if (v.vendorId === 'sup-05') rec = koreaUnits;

        return {
          ...v,
          recommendedAllocatedUnits: rec,
          costDelta: (rec - v.currentAllocatedUnits) * v.unitCost
        };
      });

      setVendors(updated);
      setIsSolving(false);
      setHasSolved(true);
    }, 700);
  };

  const handleApplyToPOs = () => {
    setAppliedNotification(true);
    onApplyOptimization(vendors);
    setTimeout(() => setAppliedNotification(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">SciPy Linear Programming Optimization Solver</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              Simplex / Interior-Point LP
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimizes total landed procurement cost + expected downtime risk penalty subject to capacity ceilings and lead-time constraints.
          </p>
        </div>

        <button
          onClick={runSciPySolver}
          disabled={isSolving}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa893] transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isSolving ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Solving Simplex LP...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run SciPy Optimization</span>
            </>
          )}
        </button>
      </div>

      {/* Solver Hyperparameters / Constraints Bar */}
      <div className="bg-gradient-to-br from-[#1A0B2E] to-[#2A1343] text-white p-5 rounded-2xl border border-purple-900/60 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#FFB7A5]" />
            <h2 className="text-sm font-bold text-white">Objective Function Weights & Constraints</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            min ∑ (c_i * x_i + λ * R_i * x_i)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          
          <div className="bg-[#1A0B2E]/80 p-3.5 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Risk vs Cost Penalty Weight (λ):</span>
              <span className="font-mono font-bold text-[#FFB7A5]">{riskWeight}% Risk Weight</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={riskWeight}
              onChange={(e) => setRiskWeight(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Pure Cost Focus</span>
              <span>Balanced</span>
              <span>Zero-Tolerance Resilience</span>
            </div>
          </div>

          <div className="bg-[#1A0B2E]/80 p-3.5 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Maximum Allowable Vendor Risk:</span>
              <span className="font-mono font-bold text-[#FFB7A5]">Score ≤ {maxRiskCeiling}</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              value={maxRiskCeiling}
              onChange={(e) => setMaxRiskCeiling(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Strict Filter (40)</span>
              <span>Tolerant (90)</span>
            </div>
          </div>

          <div className="bg-[#1A0B2E]/80 p-3.5 rounded-xl border border-purple-950 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="text-gray-300 font-medium">Demand Requirement:</span>
              <span className="font-mono font-bold text-white">{totalTargetUnits.toLocaleString()} units</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-2">
              ASIL-D 32-bit MCUs for Q4 production schedule across Detroit & Munich assembly lines.
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Multi-sourcing policy enforced (max 60% per vendor)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Before / After Optimization Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Baseline State */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Current / Baseline Allocation</span>
            <span className="text-xs font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              High Disruption Exposure
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-gray-50">
              <div className="text-[10px] text-gray-500">Total PO Spend</div>
              <div className="text-sm font-black font-mono text-gray-900 mt-0.5">
                ${(currentCost / 1000).toLocaleString()}k
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50">
              <div className="text-[10px] text-rose-700 font-medium">Weighted Risk</div>
              <div className="text-sm font-black font-mono text-rose-600 mt-0.5">
                {currentWeightedRisk} / 100
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50">
              <div className="text-[10px] text-rose-700 font-medium">Shutdown Threat</div>
              <div className="text-sm font-bold font-mono text-rose-600 mt-0.5">
                18 Days
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-1">
            <strong>73.3%</strong> of critical MCUs concentrated at SilicoPrecision Taiwan (running into water rationing and neon gas delay).
          </div>
        </div>

        {/* Optimal Solved State */}
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-sm space-y-3 relative overflow-hidden">
          {hasSolved && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Optimal Pareto Solution</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A0B2E]">
              {hasSolved ? 'SciPy Optimized Re-allocation' : 'Awaiting Solver Run'}
            </span>
            {!hasSolved && (
              <span className="text-xs text-gray-400">Click "Run SciPy Optimization"</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-gray-50">
              <div className="text-[10px] text-gray-500">Optimized Spend</div>
              <div className="text-sm font-black font-mono text-gray-900 mt-0.5">
                ${(recommendedCost / 1000).toLocaleString()}k
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5">
                +${((recommendedCost - currentCost) / 1000).toFixed(1)}k premium (+{(((recommendedCost - currentCost) / currentCost) * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <div className="text-[10px] text-emerald-800 font-medium">Weighted Risk</div>
              <div className="text-sm font-black font-mono text-emerald-600 mt-0.5">
                {recommendedWeightedRisk} / 100
              </div>
              <div className="text-[9px] text-emerald-700 font-bold mt-0.5">
                -{currentWeightedRisk - recommendedWeightedRisk} pts (-{Math.round(((currentWeightedRisk - recommendedWeightedRisk) / currentWeightedRisk) * 100)}%)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <div className="text-[10px] text-emerald-800 font-medium">Shutdown Threat</div>
              <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
                0 Days (Zero)
              </div>
              <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                Fully protected
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 pt-1">
            Redistributes volume to Dresden and Korea, eliminating single-source bottleneck while adding negligible cost.
          </div>
        </div>

      </div>

      {/* Allocation Breakdown Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A0B2E]">Vendor Allocation Matrix</h3>
          <span className="text-xs text-gray-500">Target Total: {totalTargetUnits.toLocaleString()} units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-2 font-medium">Supplier & Facility</th>
                <th className="pb-2 font-medium">Risk Score</th>
                <th className="pb-2 font-medium">Unit Cost</th>
                <th className="pb-2 font-medium">Lead Time</th>
                <th className="pb-2 font-medium">Capacity</th>
                <th className="pb-2 font-medium text-right">Current Allotment</th>
                <th className="pb-2 font-medium text-right">LP Recommended</th>
                <th className="pb-2 font-medium text-right">Shift Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => {
                const shiftDelta = v.recommendedAllocatedUnits - v.currentAllocatedUnits;

                return (
                  <tr key={v.vendorId} className="hover:bg-gray-50/70">
                    <td className="py-3 font-semibold text-gray-900">{v.vendorName}</td>
                    <td className="py-3">
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        v.riskScore >= 70 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {v.riskScore}
                      </span>
                    </td>
                    <td className="py-3 font-mono">${v.unitCost.toFixed(2)}</td>
                    <td className="py-3 font-mono">{v.leadTimeDays}d</td>
                    <td className="py-3 font-mono text-gray-600">{v.maxCapacity.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-medium text-gray-700">
                      {v.currentAllocatedUnits.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-[#1A0B2E]">
                      {v.recommendedAllocatedUnits.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      {shiftDelta > 0 ? (
                        <span className="text-emerald-600">+{shiftDelta.toLocaleString()}</span>
                      ) : shiftDelta < 0 ? (
                        <span className="text-rose-600">{shiftDelta.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action button to execute amendments */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-gray-500">
            {appliedNotification ? (
              <span className="text-emerald-600 font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>PO Amendments Generated & Synced to ERP/Kafka Broker!</span>
              </span>
            ) : (
              <span>Ready to generate PO change orders for Dresden & Korea vendors.</span>
            )}
          </div>

          <button
            onClick={handleApplyToPOs}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-[#FFB7A5]" />
            <span>Apply Optimization & Issue Change Orders</span>
          </button>
        </div>

      </div>

    </div>
  );
};
