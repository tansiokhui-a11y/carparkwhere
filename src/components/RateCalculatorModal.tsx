import React, { useState, useMemo } from 'react';
import { Carpark, RegionType } from '../types/carpark';
import { estimateParkingCost } from '../services/carparkService';
import { Calculator, ArrowRight, DollarSign, Clock, Check, Sparkles, Navigation } from 'lucide-react';

interface RateCalculatorModalProps {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
}

export const RateCalculatorModal: React.FC<RateCalculatorModalProps> = ({
  carparks,
  onSelectCarpark
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('Orchard');
  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'sunday'>('weekday');
  const [entryTime, setEntryTime] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(3);

  // Filter carparks in the region
  const regionCarparks = useMemo(() => {
    const list = selectedRegion === 'All' 
      ? carparks 
      : carparks.filter(c => c.area === selectedRegion);
    
    const [h, m] = entryTime.split(':').map(Number);

    return list.map(c => {
      const calc = estimateParkingCost(c, h || 12, m || 0, durationHours, dayType === 'sunday');
      return {
        ...c,
        calculatedCost: calc.totalCost,
        breakdown: calc.breakdown
      };
    }).sort((a, b) => a.calculatedCost - b.calculatedCost);
  }, [carparks, selectedRegion, dayType, entryTime, durationHours]);

  const cheapest = regionCarparks[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Calculator className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Singapore Parking Fee Comparison Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare expected parking charges side-by-side across shopping malls, commercial office towers, and HDB EPS facilities.
          </p>
        </div>

        {cheapest && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block uppercase tracking-wide">
                Best Value in {selectedRegion}
              </span>
              <span className="font-bold text-slate-900 dark:text-white truncate block max-w-[180px]">
                {cheapest.name}: <strong className="font-mono text-emerald-600 dark:text-emerald-400">${cheapest.calculatedCost.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-5">
        {/* Destination Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Destination District
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as RegionType)}
            className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="Orchard">Orchard Road Shopping</option>
            <option value="Central & CBD">Central / CBD / Chinatown</option>
            <option value="Marina Bay">Marina Bay & Suntec</option>
            <option value="East">East (Tampines / Bedok / Changi)</option>
            <option value="West">West (Jurong / Clementi)</option>
            <option value="North">North (Woodlands / Yishun)</option>
            <option value="North-East">North-East (Punggol / Bishan)</option>
            <option value="South & HarbourFront">South (VivoCity / Sentosa)</option>
            <option value="All">All Islandwide</option>
          </select>
        </div>

        {/* Day Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Day of Week
          </label>
          <div className="flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            {(['weekday', 'saturday', 'sunday'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDayType(d)}
                className={`flex-1 py-1.5 text-center capitalize rounded-md transition-colors ${
                  dayType === d 
                    ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {d === 'sunday' ? 'Sunday/PH' : d === 'weekday' ? 'Mon-Fri' : 'Saturday'}
              </button>
            ))}
          </div>
        </div>

        {/* Entry Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Time
          </label>
          <input
            type="time"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className="w-full py-2 px-3 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Duration Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Parking Duration
            </label>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              {durationHours} Hours
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={durationHours}
            onChange={(e) => setDurationHours(parseFloat(e.target.value))}
            className="w-full accent-rose-600 mt-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
            <span>30m</span>
            <span>5 hrs</span>
            <span>10 hrs</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Carpark Facility</th>
              <th className="py-3 px-3">Agency</th>
              <th className="py-3 px-3">Live Lots</th>
              <th className="py-3 px-4">Rate Breakdown</th>
              <th className="py-3 px-4 text-right">Estimated Fee</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
            {regionCarparks.map((cp, idx) => {
              const isBest = idx === 0;

              return (
                <tr 
                  key={cp.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    isBest ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {isBest && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          1
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{cp.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">({cp.id})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{cp.carparkType}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-slate-500 font-medium">{cp.agency}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`font-mono font-bold ${
                      cp.availableLots > 30 ? 'text-emerald-600 dark:text-emerald-400' : cp.availableLots > 5 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {cp.availableLots} lots
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                    {cp.breakdown}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-sm font-bold tabular-nums">
                    <span className={isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                      ${cp.calculatedCost.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectCarpark(cp)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
