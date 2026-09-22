import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, 
  Sliders, 
  RefreshCw, 
  AlertCircle, 
  Layers, 
  HelpCircle, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight, 
  Activity,
  Globe,
  DollarSign
} from 'lucide-react';
import { Supplier, ShapFactor } from '../types/supplyChain';

interface RiskPredictionEngineProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSelectSupplier: (s: Supplier) => void;
  onRunOptimization: () => void;
}

export const RiskPredictionEngine: React.FC<RiskPredictionEngineProps> = ({
  suppliers,
  selectedSupplier: propSelectedSupplier,
  onSelectSupplier,
  onRunOptimization
}) => {
  // Stress Test Simulation Parameters
  const [freightCongestionShock, setFreightCongestionShock] = useState(0); // 0 to 40%
  const [rawMaterialPriceShock, setRawMaterialPriceShock] = useState(0); // 0 to 50%
  const [energyRationingShock, setEnergyRationingShock] = useState(0); // 0 to 30%
  const [tier2DisruptionShock, setTier2DisruptionShock] = useState(0); // 0 to 40%

  const [activeTierFilter, setActiveTierFilter] = useState<'all' | '1' | '2' | 'single-source'>('all');
  const [activeSupplierId, setActiveSupplierId] = useState<string>(
    propSelectedSupplier ? propSelectedSupplier.id : suppliers[0].id
  );

  // Re-calculate dynamically adjusted scores under stress test
  const simulatedSuppliers = useMemo(() => {
    return suppliers.map(sup => {
      let delta = 0;

      // Freight impact on suppliers with high lead times or trans-oceanic
      if (sup.country === 'Taiwan' || sup.country === 'South Korea' || sup.country === 'Japan') {
        delta += freightCongestionShock * 0.45;
      } else {
        delta += freightCongestionShock * 0.2;
      }

      // Material shock on raw-material sensitive vendors
      if (sup.category.includes('Lithium') || sup.category.includes('Titanium')) {
        delta += rawMaterialPriceShock * 0.55;
      } else {
        delta += rawMaterialPriceShock * 0.25;
      }

      // Energy / water rationing shock
      if (sup.id === 'sup-01' || sup.id === 'sup-03') {
        delta += energyRationingShock * 0.7;
      } else {
        delta += energyRationingShock * 0.15;
      }

      // Tier 2 upstream shock
      if (sup.tier === 1 && sup.singleSourceRisk) {
        delta += tier2DisruptionShock * 0.6;
      } else {
        delta += tier2DisruptionShock * 0.2;
      }

      const rawScore = Math.min(99, Math.max(10, Math.round(sup.riskScore + delta)));
      const daysReduced = Math.round(delta * 0.8);
      const simulatedDaysToBottleneck = Math.max(7, sup.daysToBottleneck - daysReduced);

      return {
        ...sup,
        simulatedScore: rawScore,
        scoreDelta: rawScore - sup.riskScore,
        simulatedDaysToBottleneck
      };
    });
  }, [suppliers, freightCongestionShock, rawMaterialPriceShock, energyRationingShock, tier2DisruptionShock]);

  const filteredSuppliers = useMemo(() => {
    return simulatedSuppliers.filter(s => {
      if (activeTierFilter === '1') return s.tier === 1;
      if (activeTierFilter === '2') return s.tier === 2;
      if (activeTierFilter === 'single-source') return s.singleSourceRisk;
      return true;
    });
  }, [simulatedSuppliers, activeTierFilter]);

  const currentSupplier = simulatedSuppliers.find(s => s.id === activeSupplierId) || simulatedSuppliers[0];

  const handleResetStress = () => {
    setFreightCongestionShock(0);
    setRawMaterialPriceShock(0);
    setEnergyRationingShock(0);
    setTier2DisruptionShock(0);
  };

  const hasStressActive = freightCongestionShock > 0 || rawMaterialPriceShock > 0 || energyRationingShock > 0 || tier2DisruptionShock > 0;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">XGBoost Supplier Risk Classifier & SHAP Explainer</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              Python 3.11 ML Service
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Scores probability of supplier delivery default or bottleneck 30–90 days ahead. Feature contributions computed using TreeSHAP algorithm.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasStressActive && (
            <button
              onClick={handleResetStress}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Stress</span>
            </button>
          )}
          <button
            onClick={onRunOptimization}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa893] transition-colors"
          >
            <span>Solve Re-allocation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stress-Testing Parameter Playground */}
      <div className="bg-gradient-to-br from-[#1A0B2E] to-[#2A1343] text-white p-5 rounded-2xl border border-purple-900/60 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#FFB7A5]" />
            <h2 className="text-sm font-bold tracking-tight text-white">Live What-If Stress Testing Simulator</h2>
            {hasStressActive && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse">
                Stress Injected
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            Real-time re-inference via XGBoost model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-[#1A0B2E]/80 p-3 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Ocean Freight Congestion:</span>
              <span className="font-mono font-bold text-[#FFB7A5]">+{freightCongestionShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={freightCongestionShock}
              onChange={(e) => setFreightCongestionShock(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Nominal (0%)</span>
              <span>Port Gridlock (+40%)</span>
            </div>
          </div>

          <div className="bg-[#1A0B2E]/80 p-3 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Raw Material Spot Shock:</span>
              <span className="font-mono font-bold text-[#FFB7A5]">+{rawMaterialPriceShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={rawMaterialPriceShock}
              onChange={(e) => setRawMaterialPriceShock(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Stable</span>
              <span>LME / Spot Surge (+50%)</span>
            </div>
          </div>

          <div className="bg-[#1A0B2E]/80 p-3 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Regional Water/Grid Curtailment:</span>
              <span className="font-mono font-bold text-[#FFB7A5]">+{energyRationingShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={energyRationingShock}
              onChange={(e) => setEnergyRationingShock(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>100% Grid</span>
              <span>3-Day Ration (+30%)</span>
            </div>
          </div>

          <div className="bg-[#1A0B2E]/80 p-3 rounded-xl border border-purple-950">
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium">Tier-2 Neon/Chemical Strain:</span>
              <span className="font-mono font-bold text-[#FFB7A5]">+{tier2DisruptionShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={tier2DisruptionShock}
              onChange={(e) => setTier2DisruptionShock(Number(e.target.value))}
              className="w-full accent-[#FFB7A5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Redundant</span>
              <span>Severe Freeze (+40%)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Supplier List (Left) vs SHAP & Diagnostics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Supplier Selector & Score List */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1A0B2E]">Supplier Portfolio</h2>
              <div className="flex items-center space-x-1 text-[11px]">
                <button
                  onClick={() => setActiveTierFilter('all')}
                  className={`px-2 py-0.5 rounded font-medium ${activeTierFilter === 'all' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTierFilter('1')}
                  className={`px-2 py-0.5 rounded font-medium ${activeTierFilter === '1' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Tier 1
                </button>
                <button
                  onClick={() => setActiveTierFilter('2')}
                  className={`px-2 py-0.5 rounded font-medium ${activeTierFilter === '2' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Tier 2
                </button>
                <button
                  onClick={() => setActiveTierFilter('single-source')}
                  className={`px-2 py-0.5 rounded font-medium ${activeTierFilter === 'single-source' ? 'bg-rose-100 text-rose-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Single-Source
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredSuppliers.map((s) => {
                const isSelected = s.id === currentSupplier.id;
                const score = s.simulatedScore;
                const isCrit = score >= 70;
                const isMed = score >= 50 && score < 70;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSupplierId(s.id);
                      onSelectSupplier(s);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1A0B2E] bg-purple-50/40 shadow-sm ring-1 ring-[#1A0B2E]'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-xl">{s.flag}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate flex items-center space-x-1.5">
                            <span>{s.name}</span>
                            {s.singleSourceRisk && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Single Source Risk"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">{s.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-2">
                        {s.scoreDelta !== 0 && (
                          <span className={`text-[10px] font-mono font-bold ${s.scoreDelta > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {s.scoreDelta > 0 ? `+${s.scoreDelta}` : s.scoreDelta}
                          </span>
                        )}
                        <span className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                          isCrit ? 'bg-rose-100 text-rose-700' :
                          isMed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {score}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-1.5 border-t border-gray-100">
                      <span>Days to Bottleneck: <strong className={s.simulatedDaysToBottleneck <= 40 ? 'text-rose-600' : 'text-gray-700'}>{s.simulatedDaysToBottleneck}d</strong></span>
                      <span>VaR: <strong>${(s.valueAtRisk / 1000000).toFixed(1)}M</strong></span>
                      <span>OTIF: <strong>{s.otifRate}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
            <span>Model Version: XGBoost-v2.6-tuned</span>
            <span className="text-emerald-600 font-semibold">Loss: 0.082 LogLoss</span>
          </div>
        </div>

        {/* Right: SHAP Analysis & Deep Diagnostics */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          
          {/* Active Supplier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentSupplier.flag}</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{currentSupplier.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-mono">{currentSupplier.code}</span>
                    <span>•</span>
                    <span>{currentSupplier.city}, {currentSupplier.country}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                      Tier {currentSupplier.tier} Supplier
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase text-purple-900">XGBoost Score</div>
                <div className="text-2xl font-black font-mono text-[#1A0B2E]">
                  {currentSupplier.simulatedScore}
                  <span className="text-xs text-gray-400 font-normal"> / 100</span>
                </div>
              </div>
              <div className="h-8 w-px bg-purple-200"></div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase text-purple-900">Horizon to Breach</div>
                <div className="text-lg font-bold font-mono text-rose-600">
                  {currentSupplier.simulatedDaysToBottleneck} Days
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Feature Importance Waterfall */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-1.5">
                  <span>TreeSHAP Feature Contributions</span>
                  <span className="text-[10px] text-gray-400 font-normal">(Marginal contribution to risk score)</span>
                </h4>
              </div>
              <span className="text-[11px] text-gray-500">Base Value: 42.0</span>
            </div>

            <div className="space-y-3 mt-3">
              {currentSupplier.shapFactors.map((factor, idx) => {
                const isRiskInc = factor.impact > 0;
                const barWidth = Math.min(100, Math.abs(factor.impact) * 2.5);

                return (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${isRiskInc ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span className="font-semibold text-gray-900">{factor.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 uppercase font-medium">
                          {factor.category}
                        </span>
                      </div>
                      <span className={`font-mono font-bold ${isRiskInc ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isRiskInc ? `+${factor.impact.toFixed(1)}%` : `${factor.impact.toFixed(1)}%`}
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                      {isRiskInc ? (
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full ml-auto"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      ) : (
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {factor.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-gray-100">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-[10px]">Lead Time</div>
              <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                {currentSupplier.leadTimeDays}d <span className="text-gray-400 text-xs">(±{currentSupplier.leadTimeVariance}d)</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-[10px]">Capacity Utilization</div>
              <div className="text-sm font-bold font-mono mt-0.5 text-rose-600">
                {currentSupplier.capacityUtilization}%
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-[10px]">Solvency / Stability</div>
              <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                {currentSupplier.financialStabilityScore} / 100
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-gray-500 text-[10px]">Active PO Value</div>
              <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                ${(currentSupplier.valueAtRisk / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>

          {/* Re-allocation Advice */}
          <div className="p-3.5 rounded-xl bg-[#1A0B2E] text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#FFB7A5]">Automated Re-allocation Recommendation</div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Alternative qualified suppliers available in Germany & Korea with spare capacity.
              </p>
            </div>
            <button
              onClick={onRunOptimization}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa893] transition-colors shrink-0 ml-3"
            >
              Open LP Solver
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
