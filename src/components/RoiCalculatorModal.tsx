import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [annualSpend, setAnnualSpend] = useState<number>(350); // $ millions
  const [disruptionsPerYear, setDisruptionsPerYear] = useState<number>(6);
  const [downtimeCostPerHour, setDowntimeCostPerHour] = useState<number>(45); // $ thousands/hr
  const [avgBufferDays, setAvgBufferDays] = useState<number>(42);

  if (!isOpen) return null;

  // ROI Math
  // Average line-down hours per disruption = 36 hours
  const annualDowntimeLoss = disruptionsPerYear * 36 * (downtimeCostPerHour * 1000);
  
  // Logiskip 30-90d early warning prevents ~78% of unmitigated line stoppages
  const preventedDowntimeSavings = annualDowntimeLoss * 0.78;

  // Working capital reduction: trimming safety buffer days by 28% via predictive lead-time accuracy
  // Cost of capital = 8%
  const freedWorkingCapital = (annualSpend * 1000000 / 365) * (avgBufferDays * 0.28);
  const annualCapitalFinancingSavings = freedWorkingCapital * 0.08;

  // Total annual enterprise value delivered
  const totalAnnualSavings = preventedDowntimeSavings + annualCapitalFinancingSavings;

  // Estimated annual Logiskip software subscription for tier
  const softwareInvestment = Math.min(480000, Math.max(120000, annualSpend * 850));
  const netRoiRatio = (totalAnnualSavings / softwareInvestment).toFixed(1);
  const paybackMonths = Math.max(0.6, (softwareInvestment / (totalAnnualSavings / 12))).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0B2E]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-purple-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#1A0B2E] text-white flex items-center justify-between border-b border-purple-900">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#2A1343] text-[#FFB7A5]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Logiskip Enterprise ROI & Savings Model</h3>
              <p className="text-[11px] text-gray-300">Procurement optimization & stockout mitigation financial calculator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-purple-900 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-800">
          
          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Annual Direct Spend:</span>
                <span className="font-mono font-bold text-[#1A0B2E]">${annualSpend} Million</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={annualSpend}
                onChange={(e) => setAnnualSpend(Number(e.target.value))}
                className="w-full accent-[#1A0B2E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>$50M</span>
                <span>$1.2B</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Annual Bottleneck Events:</span>
                <span className="font-mono font-bold text-[#1A0B2E]">{disruptionsPerYear} events / yr</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={disruptionsPerYear}
                onChange={(e) => setDisruptionsPerYear(Number(e.target.value))}
                className="w-full accent-[#1A0B2E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>2 events</span>
                <span>24 events</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Assembly Line Cost / Hr:</span>
                <span className="font-mono font-bold text-[#1A0B2E]">${downtimeCostPerHour}k / hour</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={downtimeCostPerHour}
                onChange={(e) => setDowntimeCostPerHour(Number(e.target.value))}
                className="w-full accent-[#1A0B2E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>$10k/hr</span>
                <span>$150k/hr</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Current Buffer Stock:</span>
                <span className="font-mono font-bold text-[#1A0B2E]">{avgBufferDays} Days</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={avgBufferDays}
                onChange={(e) => setAvgBufferDays(Number(e.target.value))}
                className="w-full accent-[#1A0B2E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>15 days (Lean)</span>
                <span>90 days (Buffered)</span>
              </div>
            </div>

          </div>

          {/* Results Display */}
          <div className="bg-gradient-to-br from-[#1A0B2E] to-[#2A1343] text-white p-5 rounded-2xl border border-purple-900/80 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB7A5]">
                Projected First-Year Financial Value
              </span>
              <span className="text-xs text-gray-300 font-mono">
                Payback: <strong className="text-white">{paybackMonths} Months</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#1A0B2E]/90 border border-purple-950">
                <div className="text-[10px] text-gray-400">Avoided Line Downtime</div>
                <div className="text-xl font-black font-mono text-[#FFB7A5] mt-1">
                  ${(preventedDowntimeSavings / 1000000).toFixed(2)}M
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">78% risk mitigation</div>
              </div>

              <div className="p-3 rounded-xl bg-[#1A0B2E]/90 border border-purple-950">
                <div className="text-[10px] text-gray-400">Working Capital Released</div>
                <div className="text-xl font-black font-mono text-emerald-400 mt-1">
                  ${(freedWorkingCapital / 1000000).toFixed(1)}M
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">-${(annualCapitalFinancingSavings / 1000).toFixed(0)}k interest saved</div>
              </div>

              <div className="p-3 rounded-xl bg-[#1A0B2E]/90 border border-purple-950">
                <div className="text-[10px] text-gray-400">Net ROI Multiplier</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  {netRoiRatio}x
                </div>
                <div className="text-[9px] text-emerald-400 font-bold mt-0.5">Enterprise Proven</div>
              </div>
            </div>

            <div className="text-[11px] text-gray-300 pt-1 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Total Net Value: <strong className="text-white font-mono">${(totalAnnualSavings / 1000000).toFixed(2)}M / year</strong> delivered to procurement & manufacturing operations.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-500">Based on standard automotive & high-tech OEM benchmarks.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1A0B2E] text-white font-bold hover:bg-[#2A1343] transition-colors"
          >
            Apply Model to Current Portfolio
          </button>
        </div>

      </div>
    </div>
  );
};
