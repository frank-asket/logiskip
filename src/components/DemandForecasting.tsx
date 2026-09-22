import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  Layers, 
  BarChart2, 
  ArrowUpRight, 
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { DemandForecastPoint } from '../types/supplyChain';
import { prophetDemandData } from '../data/mockData';

interface DemandForecastingProps {
  onRunOptimization: () => void;
}

export const DemandForecasting: React.FC<DemandForecastingProps> = ({ onRunOptimization }) => {
  const [selectedComponent, setSelectedComponent] = useState<'mcu' | 'battery' | 'titanium' | 'lidar'>('mcu');
  const [confidenceInterval, setConfidenceInterval] = useState<'95' | '80'>('95');
  const [hoveredPoint, setHoveredPoint] = useState<DemandForecastPoint | null>(null);

  // Component factors
  const componentMultiplier = {
    mcu: 1.0,
    battery: 0.25,
    titanium: 0.18,
    lidar: 0.08
  }[selectedComponent];

  const componentTitles = {
    mcu: 'ASIL-D 32-bit Automotive Microcontrollers',
    battery: '800V Modular Battery Sub-packs',
    titanium: 'Ti-6Al-4V Chassis Extrusions',
    lidar: 'Flash Solid-State LIDAR Transceivers'
  };

  const data = prophetDemandData.map(p => ({
    ...p,
    predictedDemand: Math.round(p.predictedDemand * componentMultiplier),
    historical: p.historical ? Math.round(p.historical * componentMultiplier) : undefined,
    plannedSupply: Math.round(p.plannedSupply * componentMultiplier),
    lowerBound95: Math.round(p.lowerBound95 * componentMultiplier),
    upperBound95: Math.round(p.upperBound95 * componentMultiplier),
    lowerBound80: Math.round(p.lowerBound80 * componentMultiplier),
    upperBound80: Math.round(p.upperBound80 * componentMultiplier),
  }));

  // SVG Chart Geometry
  const width = 800;
  const height = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.upperBound95)) * 1.08;
  const minVal = Math.min(...data.map(d => d.lowerBound95)) * 0.92;

  const getX = (idx: number) => padding.left + (idx / (data.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Confidence Interval Path
  const upperKey = confidenceInterval === '95' ? 'upperBound95' : 'upperBound80';
  const lowerKey = confidenceInterval === '95' ? 'lowerBound95' : 'lowerBound80';

  const ciPath = [
    ...data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[upperKey])}`),
    ...data.slice().reverse().map((d, i) => `L ${getX(data.length - 1 - i)} ${getY(d[lowerKey])}`),
    'Z'
  ].join(' ');

  // Predicted Demand Line
  const predictedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.predictedDemand)}`)
    .join(' ');

  // Planned Supply Line
  const supplyPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.plannedSupply)}`)
    .join(' ');

  // Historical Line (only where historical exists)
  const histPoints = data.filter(d => d.historical !== undefined);
  const historicalPath = histPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.historical!)}`)
    .join(' ');

  // Deficit at T+90
  const t90Point = data[data.length - 1];
  const deficitUnits = t90Point.predictedDemand - t90Point.plannedSupply;

  return (
    <div className="space-y-6">
      
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Facebook Prophet Demand & Lead-Time Forecast</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold">
              MAPE: 6.4% (&lt;8% Target)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Bayesian time-series decomposition modeling trend changepoints, lead-time variance, and 80%/95% confidence intervals.
          </p>
        </div>

        {/* Component Selector Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-xl text-xs">
          <button
            onClick={() => setSelectedComponent('mcu')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedComponent === 'mcu' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            MCUs
          </button>
          <button
            onClick={() => setSelectedComponent('battery')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedComponent === 'battery' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Battery Packs
          </button>
          <button
            onClick={() => setSelectedComponent('titanium')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedComponent === 'titanium' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Titanium
          </button>
          <button
            onClick={() => setSelectedComponent('lidar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedComponent === 'lidar' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            LIDAR
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{componentTitles[selectedComponent]}</h3>
            <div className="flex items-center space-x-4 mt-1 text-xs">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-gray-900"></span>
                <span className="text-gray-600">Historical Actuals</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-[#1A0B2E]"></span>
                <span className="text-gray-900 font-semibold">Prophet Forecast</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-500"></span>
                <span className="text-rose-600 font-semibold">Committed Supplier Capacity</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-2 bg-purple-200 rounded-sm"></span>
                <span className="text-purple-700">Confidence Band</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Envelope:</span>
            <button
              onClick={() => setConfidenceInterval('95')}
              className={`px-2 py-1 rounded text-xs font-mono font-medium ${confidenceInterval === '95' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-gray-500'}`}
            >
              95% CI
            </button>
            <button
              onClick={() => setConfidenceInterval('80')}
              className={`px-2 py-1 rounded text-xs font-mono font-medium ${confidenceInterval === '80' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-gray-500'}`}
            >
              80% CI
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[380px] select-none">
            
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = minVal + ratio * (maxVal - minVal);
              const yPos = getY(yVal);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={width - padding.right}
                    y2={yPos}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] fill-gray-400 font-mono"
                  >
                    {Math.round(yVal).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Labels */}
            {data.map((d, idx) => {
              const xPos = getX(idx);
              return (
                <g key={idx}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={height - padding.bottom}
                    stroke="#F3F4F6"
                  />
                  <text
                    x={xPos}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className={`text-[10px] font-mono ${
                      idx >= 5 ? 'fill-purple-900 font-bold' : 'fill-gray-500'
                    }`}
                  >
                    {d.date}
                  </text>
                </g>
              );
            })}

            {/* Vertical Divider for Forecast Horizon */}
            <line
              x1={getX(4)}
              y1={padding.top}
              x2={getX(4)}
              y2={height - padding.bottom}
              stroke="#1A0B2E"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={getX(4) + 6}
              y={padding.top + 12}
              className="text-[9px] font-bold uppercase fill-[#1A0B2E] tracking-wider"
            >
              Today (T-0) → Forecast Horizon
            </text>

            {/* Confidence Interval Band */}
            <path
              d={ciPath}
              fill="rgba(192, 132, 252, 0.18)"
              stroke="rgba(192, 132, 252, 0.4)"
              strokeWidth="1"
            />

            {/* Historical Curve */}
            <path
              d={historicalPath}
              fill="none"
              stroke="#4B5563"
              strokeWidth="2.5"
            />

            {/* Planned Supply Line (Dashed) */}
            <path
              d={supplyPath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeDasharray="5 5"
            />

            {/* Predicted Demand Curve */}
            <path
              d={predictedPath}
              fill="none"
              stroke="#1A0B2E"
              strokeWidth="3"
            />

            {/* Deficit Highlight between T+90 points */}
            <line
              x1={getX(data.length - 1)}
              y1={getY(t90Point.plannedSupply)}
              x2={getX(data.length - 1)}
              y2={getY(t90Point.predictedDemand)}
              stroke="#EF4444"
              strokeWidth="3"
            />

            {/* Data point dots */}
            {data.map((d, idx) => {
              const xPos = getX(idx);
              const isFuture = idx > 4;

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(d)}
                >
                  {/* Outer ring */}
                  <circle
                    cx={xPos}
                    cy={getY(d.predictedDemand)}
                    r="5"
                    fill={isFuture ? "#FFB7A5" : "#1A0B2E"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Planned supply dot */}
                  <circle
                    cx={xPos}
                    cy={getY(d.plannedSupply)}
                    r="3.5"
                    fill="#EF4444"
                  />
                </g>
              );
            })}

          </svg>
        </div>

        {/* Dynamic Point Inspection Bar */}
        {hoveredPoint && (
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-800" />
              <span className="font-bold text-purple-900">{hoveredPoint.date}</span>
            </div>
            <div className="flex items-center space-x-6 font-mono text-xs">
              <div>
                <span className="text-gray-500">Forecast: </span>
                <span className="font-bold text-gray-900">{hoveredPoint.predictedDemand.toLocaleString()} units</span>
              </div>
              <div>
                <span className="text-gray-500">Supply: </span>
                <span className="font-bold text-rose-600">{hoveredPoint.plannedSupply.toLocaleString()} units</span>
              </div>
              <div>
                <span className="text-gray-500">Gap: </span>
                <span className={`font-bold ${hoveredPoint.predictedDemand > hoveredPoint.plannedSupply ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {(hoveredPoint.predictedDemand - hoveredPoint.plannedSupply).toLocaleString()} units
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Deficit Alert Banner */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Critical Supply Deficit Predicted at T+90 Horizon (December 2026)
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Projected demand exceeds contracted supplier capacity by <strong className="font-mono">+{deficitUnits.toLocaleString()} units</strong>. Without immediate re-allocation, buffer inventory will deplete in 41 days.
              </p>
            </div>
          </div>

          <button
            onClick={onRunOptimization}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors shrink-0 flex items-center space-x-1.5"
          >
            <span>Run SciPy Optimization</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FFB7A5]" />
          </button>
        </div>

      </div>

    </div>
  );
};
