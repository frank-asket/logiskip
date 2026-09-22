import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TrendingUp, 
  Cpu, 
  Share2, 
  UserCheck, 
  Radio, 
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  criticalSuppliersCount: number;
  openPOsCount: number;
  isSupplierPortalMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  criticalSuppliersCount,
  openPOsCount,
  isSupplierPortalMode
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Operations Workspace',
      desc: '30-90d Horizon & Gauges',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'risk',
      label: 'XGBoost Risk Engine',
      desc: 'SHAP Factors & Stress Tests',
      icon: BrainCircuit,
      badge: criticalSuppliersCount > 0 ? `${criticalSuppliersCount} At Risk` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'forecasting',
      label: 'Prophet Forecasting',
      desc: 'Time-Series & Lead Times',
      icon: TrendingUp,
      badge: '<8% MAPE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'optimizer',
      label: 'SciPy LP Solver',
      desc: 'What-If PO Re-allocation',
      icon: Cpu,
      badge: 'LP Solved',
      badgeColor: 'bg-[#FFB7A5]/20 text-[#FFB7A5] border border-[#FFB7A5]/30'
    },
    {
      id: 'graph',
      label: 'N-Tier Network Graph',
      desc: 'Multi-Tier Neo4j Topology',
      icon: Share2,
      badge: 'Tier 1–3'
    },
    {
      id: 'portal',
      label: 'Supplier Self-Service',
      desc: 'PO Confirmations & ASN',
      icon: UserCheck,
      badge: `${openPOsCount} POs`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'telemetry',
      label: 'Kafka PO Telemetry',
      desc: 'Real-time Event Stream',
      icon: Radio,
      badge: 'Live',
      badgeColor: 'bg-rose-500/20 text-rose-300 animate-pulse'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#1A0B2E] text-white p-4 flex flex-col justify-between border-r border-[#2A1343] shrink-0">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Navigation Modules
          </div>
          <nav className="space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2A1343] to-[#381B59] text-white font-semibold shadow-sm border-l-4 border-[#FFB7A5]'
                      : 'text-gray-300 hover:text-white hover:bg-[#2A1343]/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFB7A5]' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <div className="text-xs truncate">{item.label}</div>
                      <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1 ${item.badgeColor || 'bg-purple-900/50 text-gray-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Monorepo Architecture Badge */}
        <div className="p-3 rounded-xl bg-[#2A1343]/60 border border-purple-900/60 text-xs text-gray-300 space-y-2">
          <div className="flex items-center justify-between font-semibold text-white text-[11px]">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#FFB7A5]" />
              <span>Monorepo Engine</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-[#1A0B2E] p-1.5 rounded border border-purple-950">
              <div className="text-gray-400">FastAPI ML</div>
              <div className="text-emerald-400 font-mono">v3.11 Active</div>
            </div>
            <div className="bg-[#1A0B2E] p-1.5 rounded border border-purple-950">
              <div className="text-gray-400">SciPy Solver</div>
              <div className="text-emerald-400 font-mono">Simplex LP</div>
            </div>
            <div className="bg-[#1A0B2E] p-1.5 rounded border border-purple-950">
              <div className="text-gray-400">Neo4j Graph</div>
              <div className="text-emerald-400 font-mono">N-Tier Sync</div>
            </div>
            <div className="bg-[#1A0B2E] p-1.5 rounded border border-purple-950">
              <div className="text-gray-400">PostgreSQL</div>
              <div className="text-emerald-400 font-mono">POs & Audit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="pt-4 border-t border-purple-900/40 text-[11px] text-gray-400">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium text-white">Logiskip Core</span>
          </span>
          <span className="font-mono text-[10px] text-[#FFB7A5]">Prod 2026.3</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-400">
          Predictive Horizon: T+30 to T+90 Days
        </div>
      </div>
    </aside>
  );
};
