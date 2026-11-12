import React from 'react';
import { Carpark } from '../types/carpark';
import { Car, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QuickMetricsProps {
  carparks: Carpark[];
}

export const QuickMetrics: React.FC<QuickMetricsProps> = ({ carparks }) => {
  const totalCapacity = carparks.reduce((acc, c) => acc + c.totalLots, 0);
  const totalAvailable = carparks.reduce((acc, c) => acc + c.availableLots, 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0;
  
  const fullCount = carparks.filter(c => c.availableLots <= 5).length;
  const evStationCount = carparks.filter(c => c.features.hasEVCharging).length;
  const highAvailCount = carparks.filter(c => c.availableLots > 30).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-4">
      {/* Metric 1: Total Available Lots */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Islandwide Available</span>
          <Car className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
            {totalAvailable.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            / {totalCapacity.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Across {carparks.length} monitored facilities
        </div>
      </div>

      {/* Metric 2: Occupancy Rate */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Island Occupancy</span>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{occupancyPercent}%</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
            {occupancyPercent}%
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {occupancyPercent > 80 ? 'Heavy Load' : occupancyPercent > 60 ? 'Moderate' : 'Smooth Flow'}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              occupancyPercent > 85 ? 'bg-rose-500' : occupancyPercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Plenty Lots Ready */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>High Availability</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
            {highAvailCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">carparks</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          &gt;30 lots ready immediately
        </div>
      </div>

      {/* Metric 4: Congestion Warning / EV Points */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Critical / Full</span>
          <AlertTriangle className={`w-4 h-4 ${fullCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${
            fullCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
          }`}>
            {fullCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">facilities full</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-500" />
          <span>{evStationCount} locations offer EV Charging</span>
        </div>
      </div>
    </div>
  );
};
