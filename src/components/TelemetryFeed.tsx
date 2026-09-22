import React, { useState } from 'react';
import { 
  Radio, 
  Terminal, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause,
  PlusCircle,
  Cpu
} from 'lucide-react';
import { TelemetryEvent } from '../types/supplyChain';

interface TelemetryFeedProps {
  events: TelemetryEvent[];
  onEmitEvent: (event: TelemetryEvent) => void;
}

export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({ events, onEmitEvent }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter(evt => {
    if (filterSeverity !== 'all' && evt.severity !== filterSeverity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        (evt.poNumber && evt.poNumber.toLowerCase().includes(q)) ||
        (evt.location && evt.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const injectSimulatedEvent = () => {
    const sampleEvents: Omit<TelemetryEvent, 'id' | 'timestamp'>[] = [
      {
        title: 'AIS Vessel Route Deviation: Maersk Gibraltar',
        description: 'Vessel carrying PO-2026-8892 diverted south of English Channel due to naval exercise; +2.5d transit delta.',
        severity: 'medium',
        type: 'delay_warning',
        poNumber: 'PO-2026-8892',
        location: 'English Channel'
      },
      {
        title: 'Port of Kaohsiung Berth Free: Container Loaded',
        description: 'Crane operator confirmed Evergreen container EGLV-90184420 cleared quay; ship underway.',
        severity: 'low',
        type: 'po_status',
        poNumber: 'PO-2026-8891',
        location: 'Kaohsiung, Taiwan'
      },
      {
        title: 'Lithium Carbonate Spot Price Shift: +8.4%',
        description: 'Benchmark spot auction surge detected by automated web scraper; Prophet lead-time elasticity triggered.',
        severity: 'high',
        type: 'delay_warning',
        location: 'Shanghai Metals Market'
      }
    ];

    const pick = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    const newEvent: TelemetryEvent = {
      ...pick,
      id: `tel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString()
    };

    onEmitEvent(newEvent);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <Radio className="w-4 h-4 animate-pulse text-[#FFB7A5]" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Apache Kafka PO Telemetry Stream</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-semibold">
              Topic: `supplychain.po.telemetry.v1`
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time event-driven streaming architecture receiving carrier AIS signals, port congestions, and customs holds.
          </p>
        </div>

        <button
          onClick={injectSimulatedEvent}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-[#FFB7A5]" />
          <span>Simulate Incoming Kafka Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search telemetry (PO#, carrier, location)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1A0B2E]"
          />
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-gray-500 font-medium">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-[#1A0B2E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Stream Console */}
      <div className="bg-[#1A0B2E] text-white rounded-2xl border border-purple-900/60 shadow-lg p-5 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/50 text-[11px] text-gray-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#FFB7A5]" />
            <span className="font-bold text-gray-200">Kafka Broker Cluster [3 Nodes Active]</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Stream Rate: 1.4k msgs/sec</span>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
          {filteredEvents.map((evt) => {
            const isCrit = evt.severity === 'critical';
            const isHigh = evt.severity === 'high';
            const isMed = evt.severity === 'medium';

            return (
              <div
                key={evt.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCrit
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                    : isHigh
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    : 'bg-[#2A1343]/50 border-purple-900/40 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400">[{evt.timestamp}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                      isCrit ? 'bg-rose-500 text-white' :
                      isHigh ? 'bg-amber-500 text-black' :
                      isMed ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {evt.severity}
                    </span>
                    <span className="font-bold text-white text-xs">{evt.title}</span>
                  </div>

                  {evt.poNumber && (
                    <span className="text-[10px] font-bold text-[#FFB7A5] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      {evt.poNumber}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-gray-300 font-sans leading-relaxed">
                  {evt.description}
                </p>

                {evt.location && (
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center space-x-1">
                    <span>Geo Telemetry:</span>
                    <span className="text-gray-200">{evt.location}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
