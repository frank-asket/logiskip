import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  DollarSign, 
  Clock, 
  Building2, 
  ChevronRight,
  Zap,
  Lock,
  Globe
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterDashboard: () => void;
  onOpenRoi: () => void;
  onOpenReport: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterDashboard,
  onOpenRoi,
  onOpenReport
}) => {
  const [trialEmail, setTrialEmail] = useState('');
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'enterprise' | 'defense'>('enterprise');

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialEmail) return;
    setTrialSubmitted(true);
    setTimeout(() => {
      onEnterDashboard();
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1A0B2E] via-[#2A1343] to-[#1A0B2E] text-white p-8 sm:p-12 border border-purple-900 shadow-xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#FFB7A5]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFB7A5]/20 border border-[#FFB7A5]/30 text-xs font-semibold text-[#FFB7A5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Enterprise AI Supply Chain Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Stop Firefighting. <br />
            <span className="text-[#FFB7A5]">Anticipate Supplier Bottlenecks</span> 30–90 Days Early.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Logiskip fuses <strong>XGBoost risk scoring</strong>, <strong>Facebook Prophet demand forecasting</strong>, and <strong>SciPy linear programming re-allocation</strong> to protect production lines from multi-tier disruption before assembly halts.
          </p>

          {/* Quick CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onEnterDashboard}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa58f] transition-all shadow-lg active:scale-95 text-sm"
            >
              <span>Launch Enterprise Operations Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenRoi}
              className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold bg-[#2A1343] hover:bg-[#381B59] text-gray-200 border border-purple-800 transition-colors text-sm"
            >
              <Calculator className="w-4 h-4 text-[#FFB7A5]" />
              <span>Interactive ROI Calculator</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>&lt;8% MAPE Prophet Engine</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SciPy Constrained LP Solver</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>N-Tier Neo4j Graph Topology</span>
            </span>
          </div>
        </div>
      </div>

      {/* Trial Signup Form Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-[#1A0B2E]">Start Your 30-Day Enterprise Trial</h2>
            <p className="text-xs text-gray-500">
              Deploy our pre-trained supply chain XGBoost models on your purchase orders with instant ERP connector.
            </p>
          </div>

          {trialSubmitted ? (
            <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-300 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Access granted! Loading Operations Workspace...</span>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className="flex w-full md:w-auto items-center gap-2">
              <input
                type="email"
                placeholder="procurement@enterprise.com"
                value={trialEmail}
                onChange={(e) => setTrialEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#1A0B2E]"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1A0B2E] text-white font-bold text-xs hover:bg-[#2A1343] transition-colors shrink-0"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Core Platform Pillars (From README monorepo microservices) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-black text-[#1A0B2E]">Enterprise AI Engine Architecture</h2>
          <p className="text-xs text-gray-600">
            Four purpose-built mathematical engines working in unison to defend your assembly lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#FFB7A5] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#1A0B2E] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#1A0B2E]" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">XGBoost Risk Classifier</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              TreeSHAP-explained scoring evaluating financial solvency, weather events, and geopolitical freight chokepoints 30–90 days ahead.
            </p>
            <div className="pt-2 text-[11px] font-mono text-purple-900 font-semibold">
              Python 3.11 / FastAPI
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#FFB7A5] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Prophet Demand Engine</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bayesian additive regression decomposing trend changepoints and multi-horizon confidence intervals (&lt;8% MAPE).
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-800 font-semibold">
              80% & 95% Confidence Bounds
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#FFB7A5] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">SciPy LP Optimizer</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Constrained Simplex linear programming solver for What-If purchase order re-allocation across qualified secondary vendors.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-800 font-semibold">
              Pareto Optimal Re-allocation
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#FFB7A5] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">N-Tier Neo4j Graph</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Multi-tier relationship graph identifying single points of failure across Tier 1 assemblers, Tier 2 sub-nodes, and Tier 3 smelters.
            </p>
            <div className="pt-2 text-[11px] font-mono text-rose-800 font-semibold">
              Cypher Multi-Tier Traversal
            </div>
          </div>

        </div>
      </div>

      {/* Pricing / Deployment Tiers */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <h2 className="text-xl font-bold text-[#1A0B2E]">Enterprise Sizing & Deployment</h2>
          <p className="text-xs text-gray-500">Available as single-tenant cloud deployment or air-gapped on-premises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className={`p-5 rounded-2xl border transition-all ${selectedPlan === 'growth' ? 'border-[#1A0B2E] ring-2 ring-[#1A0B2E]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-gray-900">Tier-1 Professional</h4>
                <div className="text-gray-500 mt-0.5">For mid-market manufacturers</div>
              </div>
              <button 
                onClick={() => setSelectedPlan('growth')}
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${selectedPlan === 'growth' ? 'bg-[#1A0B2E] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Select
              </button>
            </div>
            <div className="my-4 text-2xl font-black font-mono text-[#1A0B2E]">$8,500 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Up to 150 Tier-1 suppliers</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>XGBoost risk scoring & SHAP</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Weekly Prophet demand sync</span></li>
            </ul>
          </div>

          <div className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${selectedPlan === 'enterprise' ? 'border-[#1A0B2E] ring-2 ring-[#1A0B2E] bg-purple-50/20' : 'border-gray-200'}`}>
            <span className="absolute top-0 right-0 bg-[#FFB7A5] text-[#1A0B2E] font-bold text-[9px] uppercase px-3 py-0.5 rounded-bl">Most Popular</span>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-gray-900">Global Enterprise</h4>
                <div className="text-gray-500 mt-0.5">Automotive & High-Tech OEMs</div>
              </div>
              <button 
                onClick={() => setSelectedPlan('enterprise')}
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${selectedPlan === 'enterprise' ? 'bg-[#1A0B2E] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Selected
              </button>
            </div>
            <div className="my-4 text-2xl font-black font-mono text-[#1A0B2E]">$22,000 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Unlimited N-Tier network graph</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>SciPy Linear Programming solver</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Live Kafka PO telemetry ingestion</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Keycloak Enterprise RBAC + SSO</span></li>
            </ul>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${selectedPlan === 'defense' ? 'border-[#1A0B2E] ring-2 ring-[#1A0B2E]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-gray-900">Defense & Aerospace</h4>
                <div className="text-gray-500 mt-0.5">ITAR / FedRAMP Air-Gapped</div>
              </div>
              <button 
                onClick={() => setSelectedPlan('defense')}
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${selectedPlan === 'defense' ? 'bg-[#1A0B2E] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Select
              </button>
            </div>
            <div className="my-4 text-2xl font-black font-mono text-[#1A0B2E]">Custom <span className="text-xs font-normal text-gray-500">Contract</span></div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>ITAR-compliant deployment</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Dedicated ML engineering SLA</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Custom solver constraints & ERP sync</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Lock className="w-4 h-4 text-gray-400" />
            <span>SOC2 Type II Certified • GDPR Compliant • Single Tenant Architecture</span>
          </div>

          <button
            onClick={onEnterDashboard}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#1A0B2E] hover:underline"
          >
            <span>Proceed to Workspace Demo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
