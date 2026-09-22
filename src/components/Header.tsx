import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Calculator, 
  Bell, 
  Cpu, 
  Layers, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { TelemetryEvent } from '../types/supplyChain';

interface HeaderProps {
  onOpenReport: () => void;
  onOpenRoi: () => void;
  telemetryEvents: TelemetryEvent[];
  activeView: string;
  setActiveView: (view: string) => void;
  isSupplierPortalMode: boolean;
  setIsSupplierPortalMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  onOpenRoi,
  telemetryEvents,
  activeView,
  setActiveView,
  isSupplierPortalMode,
  setIsSupplierPortalMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const criticalCount = telemetryEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length;

  return (
    <header className="sticky top-0 z-40 bg-[#1A0B2E] text-white border-b border-[#2A1343] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setIsSupplierPortalMode(false); setActiveView('overview'); }}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A1343] to-[#1A0B2E] border border-[#FFB7A5]/40 flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-[#FFB7A5] tracking-tighter">LS</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFB7A5] rounded-full ring-2 ring-[#1A0B2E] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">Logiskip</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FFB7A5]/20 text-[#FFB7A5] rounded border border-[#FFB7A5]/30">
                  Enterprise AI
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-medium hidden sm:block">Supply Chain Risk & Optimization</p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden lg:flex items-center space-x-6 px-4 py-1.5 bg-[#2A1343]/60 rounded-full border border-purple-900/50 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-gray-300">Global Risk Index:</span>
              <span className="font-bold font-mono text-rose-300">78.4 / 100</span>
            </div>
            <div className="h-3 w-px bg-purple-800"></div>
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-300">Value at Risk:</span>
              <span className="font-bold font-mono text-[#FFB7A5]">$24.8M</span>
            </div>
            <div className="h-3 w-px bg-purple-800"></div>
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-300">Horizon:</span>
              <span className="font-semibold text-emerald-400">30–90d Predictive</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {/* ROI Calculator */}
            <button
              onClick={onOpenRoi}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:text-white bg-[#2A1343] hover:bg-[#381B59] border border-purple-900 transition-colors"
              title="Calculate potential enterprise savings"
            >
              <Calculator className="w-3.5 h-3.5 text-[#FFB7A5]" />
              <span>ROI Model</span>
            </button>

            {/* AI Executive Brief */}
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FFB7A5] to-[#FFA088] text-[#1A0B2E] hover:opacity-95 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Brief</span>
            </button>

            {/* Supplier Portal Toggle Mode */}
            <button
              onClick={() => {
                setIsSupplierPortalMode(!isSupplierPortalMode);
                if (!isSupplierPortalMode) setActiveView('portal');
                else setActiveView('overview');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSupplierPortalMode 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                  : 'bg-[#2A1343] text-gray-300 border-purple-900 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSupplierPortalMode ? 'Exit Supplier Portal' : 'Supplier Portal'}</span>
            </button>

            {/* Live Telemetry Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-[#2A1343] hover:bg-[#381B59] text-gray-200 border border-purple-900 transition-colors"
                title="Live Kafka PO Telemetry Feed"
              >
                <Bell className="w-4 h-4" />
                {criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {criticalCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1A0B2E] rounded-xl border border-purple-800/80 shadow-2xl p-3 text-xs z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-900/60">
                    <div className="flex items-center space-x-1.5 font-semibold text-white">
                      <Cpu className="w-3.5 h-3.5 text-[#FFB7A5]" />
                      <span>Kafka PO Telemetry Stream</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Live 100ms sync</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {telemetryEvents.map((evt) => (
                      <div 
                        key={evt.id} 
                        className="p-2.5 rounded-lg bg-[#2A1343]/70 hover:bg-[#2A1343] border border-purple-900/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                            evt.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            evt.severity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {evt.severity}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{evt.timestamp}</span>
                        </div>
                        <p className="mt-1 font-medium text-gray-100">{evt.title}</p>
                        <p className="mt-0.5 text-[11px] text-gray-300 leading-relaxed">{evt.description}</p>
                        {evt.poNumber && (
                          <div className="mt-1 text-[10px] text-[#FFB7A5] font-mono">
                            Ref: {evt.poNumber} • {evt.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-purple-900/60 text-center">
                    <button
                      onClick={() => { setShowNotifications(false); setActiveView('telemetry'); }}
                      className="text-[11px] text-[#FFB7A5] hover:underline font-medium"
                    >
                      View all telemetry logs & Kafka stream →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
