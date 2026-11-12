import React, { useState } from 'react';
import { Play, Code, Check, ExternalLink, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface SimulateScenarioBarProps {
  onApplyScenario: (scenario: 'cbd_rush' | 'orchard_weekend' | 'midnight' | 'normal') => void;
  dataSource: 'data.gov.sg' | 'backend' | 'simulation';
}

export const SimulateScenarioBar: React.FC<SimulateScenarioBarProps> = ({
  onApplyScenario,
  dataSource
}) => {
  const [showBackendGuide, setShowBackendGuide] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string>('normal');

  const handleScenarioClick = (scenario: 'cbd_rush' | 'orchard_weekend' | 'midnight' | 'normal') => {
    setActiveScenario(scenario);
    onApplyScenario(scenario);
  };

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl p-3 sm:p-4 my-4 border border-slate-800 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Quick Scenario Testing buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mr-1">
            <Play className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Traffic:</span>
          </span>

          <button
            onClick={() => handleScenarioClick('cbd_rush')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              activeScenario === 'cbd_rush'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Morning Peak (CBD Full)
          </button>

          <button
            onClick={() => handleScenarioClick('orchard_weekend')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              activeScenario === 'orchard_weekend'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Weekend Shopping (Orchard Surge)
          </button>

          <button
            onClick={() => handleScenarioClick('midnight')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              activeScenario === 'midnight'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Late Night (HDB High)
          </button>

          <button
            onClick={() => handleScenarioClick('normal')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              activeScenario === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Normal Flow
          </button>
        </div>

        {/* Right: Backend Integration Guide Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowBackendGuide(!showBackendGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backend Integration Notes</span>
            {showBackendGuide ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>

      </div>

      {/* Expandable Backend Integration Helper */}
      {showBackendGuide && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3">
          <div className="flex items-start gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">How to connect your custom backend later:</p>
              <p className="text-slate-400 mt-1">
                The frontend already communicates through <code className="text-cyan-300 font-mono">/src/services/carparkService.ts</code>. When your backend (Express/NestJS/Go/Python or Firebase) is ready, simply point the environment variable or proxy:
              </p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
            <span className="text-slate-500">// 1. Set environment variable in .env</span><br />
            <span className="text-emerald-400">VITE_BACKEND_API_URL</span>=<span className="text-amber-300">&quot;https://your-backend.com/api/carparks&quot;</span><br /><br />
            <span className="text-slate-500">// 2. The endpoint returns JSON matching Carpark[] or GovApi:</span><br />
            &#123; <span className="text-cyan-400">&quot;carparks&quot;</span>: [ ... ] &#125;
          </div>

          <p className="text-[11px] text-slate-400">
            Currently running on: <strong className="text-white uppercase font-mono">{dataSource}</strong> (Official Singapore Gov Data.gov.sg API + realistic fluctuation fallback).
          </p>
        </div>
      )}
    </div>
  );
};
