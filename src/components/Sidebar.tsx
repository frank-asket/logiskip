import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TrendingUp, 
  Cpu, 
  Share2, 
  UserCheck, 
  Radio, 
  Smartphone,
  Globe,
  Database,
  Calculator,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';
import { UserRole } from './Header';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  criticalSuppliersCount: number;
  openPOsCount: number;
  currentRole: UserRole;
  onOpenRoi: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  criticalSuppliersCount,
  openPOsCount,
  currentRole,
  onOpenRoi
}) => {
  const clientApps = [
    {
      id: 'overview',
      label: 'Operations Workspace',
      sub: 'clients/web-dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'landing',
      label: 'Public Landing & Pricing',
      sub: 'clients/landing-page',
      icon: Globe
    },
    {
      id: 'portal',
      label: 'Supplier Self-Service',
      sub: 'clients/portal',
      icon: UserCheck,
      badge: `${openPOsCount} POs`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'mobile',
      label: 'Mobile Push Gateway',
      sub: 'clients/mobile',
      icon: Smartphone,
      badge: 'Push Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    }
  ];

  const microservices = [
    {
      id: 'risk',
      label: 'XGBoost Risk & SHAP',
      sub: 'microservices/risk-prediction',
      icon: BrainCircuit,
      badge: criticalSuppliersCount > 0 ? `${criticalSuppliersCount} At Risk` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'forecasting',
      label: 'Prophet Demand Engine',
      sub: 'microservices/forecasting',
      icon: TrendingUp,
      badge: '<8% MAPE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'optimizer',
      label: 'SciPy LP Re-allocation',
      sub: 'microservices/optimization',
      icon: Cpu,
      badge: 'Simplex LP',
      badgeColor: 'bg-[#FFB7A5]/20 text-[#FFB7A5]'
    },
    {
      id: 'graph',
      label: 'N-Tier Network Topology',
      sub: 'database-graph (Neo4j)',
      icon: Share2,
      badge: 'T1–T3'
    },
    {
      id: 'telemetry',
      label: 'Kafka Telemetry Streaming',
      sub: 'message-broker (Kafka)',
      icon: Radio,
      badge: 'Active',
      badgeColor: 'bg-rose-500/20 text-rose-300 animate-pulse'
    },
    {
      id: 'databases',
      label: 'Polyglot Data Explorer',
      sub: 'Postgres • Neo4j • Mongo',
      icon: Database,
      badge: '3 DBs',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#1A0B2E] text-white p-4 flex flex-col justify-between border-r border-[#2A1343] shrink-0">
      <div className="space-y-5">
        
        {/* Monorepo Client Applications */}
        <div>
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Client Applications</span>
            <span className="text-[9px] font-mono text-[#FFB7A5]">clients/</span>
          </div>
          <nav className="space-y-1 mt-1">
            {clientApps.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2A1343] to-[#381B59] text-white font-semibold shadow-sm border-l-4 border-[#FFB7A5]'
                      : 'text-gray-300 hover:text-white hover:bg-[#2A1343]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFB7A5]' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <div className="text-xs truncate">{item.label}</div>
                      <div className="text-[9px] text-gray-400 font-mono truncate">{item.sub}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1 ${item.badgeColor || 'bg-purple-900/50 text-gray-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Microservices & Engines */}
        <div>
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Microservices & Engines</span>
            <span className="text-[9px] font-mono text-[#FFB7A5]">FastAPI / DB</span>
          </div>
          <nav className="space-y-1 mt-1">
            {microservices.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2A1343] to-[#381B59] text-white font-semibold shadow-sm border-l-4 border-[#FFB7A5]'
                      : 'text-gray-300 hover:text-white hover:bg-[#2A1343]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFB7A5]' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <div className="text-xs truncate">{item.label}</div>
                      <div className="text-[9px] text-gray-400 font-mono truncate">{item.sub}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1 ${item.badgeColor || 'bg-purple-900/50 text-gray-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer / System Architecture */}
      <div className="pt-4 border-t border-purple-900/40 text-[10px] text-gray-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">Logiskip v1.0</span>
          </span>
          <span className="font-mono text-[#FFB7A5]">Monorepo Polyglot</span>
        </div>
        <button
          onClick={onOpenRoi}
          className="w-full py-1.5 px-2 rounded-lg bg-[#2A1343] hover:bg-[#381B59] text-[#FFB7A5] font-semibold text-center block transition-colors"
        >
          Open ROI Calculator →
        </button>
      </div>
    </aside>
  );
};
