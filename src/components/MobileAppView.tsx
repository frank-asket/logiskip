import React, { useState } from 'react';
import { 
  Smartphone, 
  Bell, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Battery, 
  Wifi, 
  Signal, 
  Volume2, 
  VolumeX, 
  Layers,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { TelemetryEvent, PurchaseOrder, Supplier } from '../types/supplyChain';

interface MobileAppViewProps {
  telemetryEvents: TelemetryEvent[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  onQuickApproveReallocation: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  telemetryEvents,
  purchaseOrders,
  suppliers,
  onQuickApproveReallocation
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileTab, setMobileTab] = useState<'alerts' | 'pos' | 'scores'>('alerts');
  const [approvedNotice, setApprovedNotice] = useState(false);

  const criticalAlerts = telemetryEvents.filter(e => e.severity === 'critical' || e.severity === 'high');

  const handleApprove = () => {
    setApprovedNotice(true);
    onQuickApproveReallocation();
    setTimeout(() => setApprovedNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <Smartphone className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Mobile Push Alert Gateway</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              React Native / Expo Client
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time push alert telemetry delivered to plant managers, logistics coordinators, and CPOs for immediate line-stoppage authorization.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            <span>{soundEnabled ? 'Push Chimes Active' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Mobile Device Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Device Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[360px] h-[680px] bg-[#1A0B2E] rounded-[48px] p-3.5 shadow-2xl border-4 border-gray-800 relative flex flex-col">
            
            {/* Top Speaker / Dynamic Island */}
            <div className="w-32 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-900"></div>
            </div>

            {/* Phone Screen Canvas */}
            <div className="flex-1 bg-[#F4F1F8] rounded-[36px] overflow-hidden flex flex-col text-xs text-[#1A0B2E]">
              
              {/* Status bar */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-gray-700">
                <span>9:41</span>
                <div className="flex items-center space-x-1.5 text-gray-700">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Bar inside phone */}
              <div className="px-4 py-2 bg-[#1A0B2E] text-white flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#FFB7A5] text-[#1A0B2E] flex items-center justify-center font-black text-[11px]">
                    LS
                  </div>
                  <span className="font-bold text-xs tracking-tight">Logiskip Mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-[10px] font-mono text-[#FFB7A5]">Live</span>
                </div>
              </div>

              {/* Push Alert Toast */}
              {approvedNotice && (
                <div className="m-3 p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-bold">1-Tap Re-allocation Approved & Sent to ERP!</span>
                </div>
              )}

              {/* Phone Content Screen */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                
                {/* Urgent Action Card */}
                <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-2xl shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="bg-white/20 px-2 py-0.5 rounded">Action Required</span>
                    <span>T+34 Days</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">SilicoPrecision Foundry Bottleneck</h4>
                    <p className="text-[11px] text-rose-100 mt-0.5 leading-snug">
                      Assembly Plant Alpha faces shutdown. SciPy solver recommends fast-track 40k units to Apex Dresden.
                    </p>
                  </div>
                  <button
                    onClick={handleApprove}
                    className="w-full py-2 bg-white text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-50 shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>1-Tap Approve Re-allocation</span>
                  </button>
                </div>

                {/* Sub-Tabs inside Phone */}
                <div className="flex items-center space-x-1 p-1 bg-gray-200 rounded-xl text-[10px]">
                  <button
                    onClick={() => setMobileTab('alerts')}
                    className={`flex-1 py-1 rounded-lg font-bold ${mobileTab === 'alerts' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600'}`}
                  >
                    Alerts ({criticalAlerts.length})
                  </button>
                  <button
                    onClick={() => setMobileTab('pos')}
                    className={`flex-1 py-1 rounded-lg font-bold ${mobileTab === 'pos' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600'}`}
                  >
                    At-Risk POs
                  </button>
                  <button
                    onClick={() => setMobileTab('scores')}
                    className={`flex-1 py-1 rounded-lg font-bold ${mobileTab === 'scores' ? 'bg-[#1A0B2E] text-white' : 'text-gray-600'}`}
                  >
                    Gauges
                  </button>
                </div>

                {/* Mobile View Content */}
                {mobileTab === 'alerts' && (
                  <div className="space-y-2">
                    {criticalAlerts.map(alert => (
                      <div key={alert.id} className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-rose-600 uppercase">{alert.type.replace('_', ' ')}</span>
                          <span className="text-gray-400 font-mono">{alert.timestamp}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-[11px] mt-1">{alert.title}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {mobileTab === 'pos' && (
                  <div className="space-y-2">
                    {purchaseOrders.slice(0, 3).map(po => (
                      <div key={po.id} className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-gray-900">{po.poNumber}</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${po.predictedDelayDays > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {po.predictedDelayDays > 0 ? `+${po.predictedDelayDays}d` : 'On Time'}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-gray-800 mt-1 truncate">{po.component}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">${po.totalValue.toLocaleString()} • {po.supplierName}</div>
                      </div>
                    ))}
                  </div>
                )}

                {mobileTab === 'scores' && (
                  <div className="space-y-2">
                    {suppliers.slice(0, 4).map(s => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm">{s.flag}</span>
                            <span className="font-bold text-[11px] text-gray-900 truncate max-w-[150px]">{s.name}</span>
                          </div>
                          <div className="text-[10px] text-gray-500">{s.daysToBottleneck}d to breach</div>
                        </div>
                        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${s.riskScore >= 70 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {s.riskScore}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Bottom Phone Navigation */}
              <div className="px-6 py-2.5 bg-white border-t border-gray-200 flex items-center justify-between text-gray-400 text-[10px]">
                <div className="flex flex-col items-center text-[#1A0B2E] font-bold">
                  <Bell className="w-4 h-4" />
                  <span>Alerts</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-4 h-4" />
                  <span>Horizon</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Suppliers</span>
                </div>
              </div>

              {/* Phone Home Bar */}
              <div className="w-28 h-1 bg-gray-400 rounded-full mx-auto my-1.5"></div>
            </div>
          </div>
        </div>

        {/* Right: Explanatory Specs & Features */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#1A0B2E]">Critical Push Alert Architecture</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When the XGBoost risk prediction service or Kafka telemetry engine detects a predicted breach threshold (&gt;75 risk index or AIS route diversion), high-priority APNs/FCM push notifications are dispatched to mobile devices.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-start space-x-2">
                <Zap className="w-4 h-4 text-purple-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-950 font-bold">1-Tap Re-allocation Authorization</strong>
                  Plant managers can directly review and execute SciPy LP optimal re-allocations from their phone without waiting to return to a desk.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-start space-x-2">
                <Bell className="w-4 h-4 text-purple-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-950 font-bold">Sound & Vibration Chime Profiles</strong>
                  Configured with custom alert tones for Tier-1 single-source halts vs standard customs clearances.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A0B2E] text-white p-5 rounded-2xl border border-purple-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFB7A5] uppercase tracking-wider">Device Test Payload</span>
              <span className="text-[10px] text-gray-400 font-mono">Expo SDK 51</span>
            </div>
            <pre className="text-[10px] font-mono bg-[#2A1343] p-3 rounded-xl text-gray-300 overflow-x-auto">
{`{
  "to": "ExponentPushToken[cpo_mobile_device_01]",
  "title": "CRITICAL: Assembly Line Stoppage Risk",
  "body": "SilicoPrecision Taiwan water ration breach detected. Tap to execute Dresden re-allocation.",
  "data": { "poId": "po-101", "action": "SCIPY_LP_APPROVE" },
  "priority": "high",
  "sound": "default"
}`}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
