import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight, 
  CheckCircle, 
  ShieldAlert, 
  ChevronRight, 
  Cpu, 
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { Supplier, PurchaseOrder } from '../types/supplyChain';

interface DashboardOverviewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  onSelectSupplier: (supplier: Supplier) => void;
  onNavigateView: (view: string) => void;
  onRunOptimization: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  suppliers,
  purchaseOrders,
  onSelectSupplier,
  onNavigateView,
  onRunOptimization
}) => {
  const criticalSuppliers = suppliers.filter(s => s.riskScore >= 70);
  const totalValueAtRisk = suppliers.reduce((acc, s) => acc + s.valueAtRisk, 0);
  const delayedPOs = purchaseOrders.filter(po => po.predictedDelayDays > 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-[#1A0B2E] via-[#2A1343] to-[#1A0B2E] text-white p-5 rounded-2xl border border-purple-900/70 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#FFB7A5]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 rounded border border-rose-500/40 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>Active 30–90d Bottleneck Alert</span>
              </span>
              <span className="text-xs text-gray-300">Predictive Model Run: Q3-Live</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Global Supply Chain Risk Horizon: <span className="text-[#FFB7A5]">Elevated (78.4 / 100)</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              XGBoost classifier detected 3 critical Tier-1 & Tier-2 supply bottlenecks within the 34–48 day horizon, threatening vehicle line stoppage at Assembly Plant Alpha (Detroit).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onRunOptimization}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa893] transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simulate SciPy LP Re-allocation</span>
            </button>
            <button
              onClick={() => onNavigateView('risk')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2A1343] hover:bg-[#381B59] text-gray-200 border border-purple-800/80 transition-colors"
            >
              <span>Explain SHAP Drivers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Value At Risk */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Value at Risk (30-90d)</span>
            <div className="p-2 rounded-lg bg-[#FFB7A5]/20 text-[#1A0B2E]">
              <DollarSign className="w-4 h-4 text-[#1A0B2E]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-[#1A0B2E]">
              ${(totalValueAtRisk / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center mt-1 text-[11px] text-rose-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+$3.4M vs last month (neon surge)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
            Across 24 active purchase orders
          </div>
        </div>

        {/* High-Risk Suppliers */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">High-Risk Suppliers</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-rose-600">
              {criticalSuppliers.length} <span className="text-xs font-normal text-gray-400">/ {suppliers.length} monitored</span>
            </div>
            <div className="flex items-center mt-1 text-[11px] text-rose-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>2 single-source chokepoints</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
            Requires secondary vendor qualification
          </div>
        </div>

        {/* Lead Time Variance */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Mean Lead Time Drift</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-amber-600">
              +14.2 <span className="text-xs font-normal text-gray-500">days</span>
            </div>
            <div className="flex items-center mt-1 text-[11px] text-amber-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              <span>Port dwell + foundry water rations</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
            Average baseline: 42.0 days
          </div>
        </div>

        {/* Forecast Accuracy */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Prophet Engine Accuracy</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-emerald-600">
              6.4% <span className="text-xs font-normal text-gray-500">MAPE</span>
            </div>
            <div className="flex items-center mt-1 text-[11px] text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-0.5" />
              <span>Target &lt;8% satisfied (80/95% CI)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
            Changepoint detection calibrated
          </div>
        </div>

      </div>

      {/* 30-90 Day Bottleneck Horizon Timeline */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#1A0B2E] flex items-center space-x-2">
              <span>30–90 Day Predictive Bottleneck Horizon</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono font-medium">
                XGBoost + Prophet
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Anticipate supplier outages before line shutdown. Click any window to trigger pre-emptive mitigation.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Critical (0–30d)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Elevated (31–60d)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
              <span>Monitored (61–90d)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 0-30 Days Window */}
          <div className="rounded-xl p-4 bg-rose-50/70 border-2 border-rose-200/80 hover:border-rose-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded">
                  0–30 Days (T+30)
                </span>
                <span className="font-mono text-xs font-bold text-rose-700">Days: 1 to 30</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-gray-900">Foundry & Water Ration Bottleneck</h3>
              <p className="text-xs text-gray-600 mt-1">
                SilicoPrecision (Taiwan) running at 98.5% capacity. Water rationing in Hsinchu Science Park reduces wafer polishing throughput by 18%.
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Impacted PO:</span>
                  <span className="font-mono font-semibold text-rose-700">PO-2026-8891 ($1.91M)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Predicted Delay:</span>
                  <span className="font-bold text-rose-600">+22 Days</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-800">Action: Shift 25k units to Apex Dresden</span>
              <button 
                onClick={onRunOptimization}
                className="text-xs font-bold text-rose-700 hover:underline flex items-center"
              >
                Re-allocate →
              </button>
            </div>
          </div>

          {/* 31-60 Days Window */}
          <div className="rounded-xl p-4 bg-amber-50/70 border-2 border-amber-200/80 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  31–60 Days (T+60)
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">Days: 31 to 60</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-gray-900">Titanium Smelter & Raw Nickel Spike</h3>
              <p className="text-xs text-gray-600 mt-1">
                AeroTitanium (UK) energy peak tariffs and Nordic Battery raw nickel volatility threaten chassis nodes and 800V cell packs.
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Impacted POs:</span>
                  <span className="font-mono font-semibold text-amber-800">PO-8915 & PO-8904</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Predicted Delay:</span>
                  <span className="font-bold text-amber-600">+11 to +14 Days</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-800">Action: Pre-order Kyoto Extrusions</span>
              <button 
                onClick={() => onNavigateView('optimizer')}
                className="text-xs font-bold text-amber-700 hover:underline flex items-center"
              >
                Inspect →
              </button>
            </div>
          </div>

          {/* 61-90 Days Window */}
          <div className="rounded-xl p-4 bg-purple-50/70 border-2 border-purple-200/80 hover:border-purple-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#1A0B2E] bg-purple-200/60 px-2 py-0.5 rounded">
                  61–90 Days (T+90)
                </span>
                <span className="font-mono text-xs font-bold text-[#1A0B2E]">Days: 61 to 90</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-gray-900">Optic Germanium Export Bottleneck</h3>
              <p className="text-xs text-gray-600 mt-1">
                Vanguard Optics upstream monocrystal supply tightening. Lead times expected to expand from 42 to 60 days by late Q4.
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Forecast Deficit:</span>
                  <span className="font-mono font-semibold text-purple-900">64,000 Component Units</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Buffer Stock Status:</span>
                  <span className="font-bold text-purple-700">6 Weeks Remaining</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-900">Action: Issue rolling 90-day PO buffer</span>
              <button 
                onClick={() => onNavigateView('forecasting')}
                className="text-xs font-bold text-purple-800 hover:underline flex items-center"
              >
                Model Curve →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Two Column Layout: Critical Suppliers & Urgent POs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Supplier Scorecards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1A0B2E]">XGBoost Supplier Risk Scorecards</h2>
              <p className="text-xs text-gray-500">Ranked by 30-90d probability of delivery breach</p>
            </div>
            <button
              onClick={() => onNavigateView('risk')}
              className="text-xs font-semibold text-[#1A0B2E] hover:text-purple-700 flex items-center"
            >
              Full Matrix <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {suppliers.map((sup) => {
              const isCrit = sup.riskScore >= 70;
              const isMed = sup.riskScore >= 50 && sup.riskScore < 70;

              return (
                <div
                  key={sup.id}
                  onClick={() => onSelectSupplier(sup)}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-[#FFB7A5] hover:shadow-sm cursor-pointer transition-all bg-gray-50/50 hover:bg-white flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <span className="text-2xl">{sup.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900 truncate">{sup.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 font-mono rounded">
                          Tier {sup.tier}
                        </span>
                        {sup.singleSourceRisk && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-700 font-semibold rounded">
                            Single Source
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {sup.category} • Lead: {sup.leadTimeDays}d (±{sup.leadTimeVariance}d)
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Top SHAP: <span className="text-gray-700 font-medium">{sup.shapFactors[0]?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ml-3">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-base font-black font-mono ${
                        isCrit ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {sup.riskScore}
                      </span>
                      <span className="text-[10px] text-gray-400">/100</span>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                      isCrit ? 'bg-rose-100 text-rose-700' :
                      isMed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sup.riskLevel}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-1">
                      ${(sup.valueAtRisk / 1000000).toFixed(2)}M VaR
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Purchase Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1A0B2E]">Active PO Telemetry & Delays</h2>
              <p className="text-xs text-gray-500">Real-time status synced with port AIS and carriers</p>
            </div>
            <button
              onClick={() => onNavigateView('telemetry')}
              className="text-xs font-semibold text-[#1A0B2E] hover:text-purple-700 flex items-center"
            >
              Kafka Feed <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map((po) => {
              const isDelayed = po.predictedDelayDays > 0;

              return (
                <div
                  key={po.id}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-purple-300 transition-all bg-gray-50/50 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-gray-900">{po.poNumber}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        po.status === 'delayed' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                        po.status === 'customs_hold' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        po.status === 'in_transit' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-900">
                      ${po.totalValue.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-gray-800 mt-1 truncate">
                    {po.component}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <div>
                      <span>Supplier: </span>
                      <span className="font-medium text-gray-700">{po.supplierName}</span>
                    </div>
                    {isDelayed ? (
                      <span className="font-bold text-rose-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        +{po.predictedDelayDays}d delay
                      </span>
                    ) : (
                      <span className="font-medium text-emerald-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        On Schedule
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-[10px] text-gray-400 truncate">
                    Dest: {po.destinationFacility} • Carrier: {po.carrier || 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button
              onClick={onRunOptimization}
              className="text-xs font-bold text-[#1A0B2E] hover:text-purple-700 inline-flex items-center space-x-1"
            >
              <span>Solve optimal re-allocation across backup suppliers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
