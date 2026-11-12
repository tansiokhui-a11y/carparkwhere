import React, { useState, useMemo } from 'react';
import { Carpark, VehicleType } from '../types/carpark';
import { estimateParkingCost, calculateDistanceKm } from '../services/carparkService';
import { 
  X, 
  Navigation, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Bookmark, 
  ArrowUpRight, 
  MapPin, 
  DollarSign, 
  Car, 
  Bike, 
  Truck, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: Carpark;
  allCarparks: Carpark[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectAlternative: (carpark: Carpark) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  allCarparks,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectAlternative
}) => {
  // Calculator state
  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'sunday'>('weekday');
  const [entryTime, setEntryTime] = useState<string>('12:00');
  const [durationHours, setDurationHours] = useState<number>(2);

  // Compute parking fee
  const calculatedFee = useMemo(() => {
    const [h, m] = entryTime.split(':').map(Number);
    return estimateParkingCost(
      carpark,
      h || 12,
      m || 0,
      durationHours,
      dayType === 'sunday'
    );
  }, [carpark, entryTime, durationHours, dayType]);

  // Find nearby alternatives
  const nearbyAlternatives = useMemo(() => {
    return allCarparks
      .filter(c => c.id !== carpark.id)
      .map(c => ({
        ...c,
        distanceKm: calculateDistanceKm(
          carpark.coordinates.lat, 
          carpark.coordinates.lng, 
          c.coordinates.lat, 
          c.coordinates.lng
        )
      }))
      .filter(c => c.distanceKm <= 2.5) // within 2.5km
      .sort((a, b) => b.availableLots - a.availableLots) // highest availability first
      .slice(0, 3);
  }, [carpark, allCarparks]);

  const carAvail = carpark.vehicleTypes.car.available;
  const carTotal = carpark.vehicleTypes.car.total;
  const carPercent = Math.round(((carTotal - carAvail) / carTotal) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{carpark.id}</span>
              <span>·</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{carpark.agency}</span>
              <span>·</span>
              <span>{carpark.carparkType}</span>
              <span>·</span>
              <span>{carpark.area}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight mt-1">
              {carpark.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{carpark.address} (Singapore {carpark.postalCode})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(carpark.id)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:border-rose-300 transition-colors"
              title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* 1. Live Lot Availability Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Live Lot Availability Breakdown
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Sync: {carpark.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Cars */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Car className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Car Lots</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {carAvail}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ {carTotal}</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${carAvail > 30 ? 'bg-emerald-500' : carAvail > 5 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${carPercent}%` }}
                  />
                </div>
              </div>

              {/* Motorcycles */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Bike className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Motorcycles</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {carpark.vehicleTypes.motorcycle?.available ?? 0}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / {carpark.vehicleTypes.motorcycle?.total ?? 0}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">$0.65/day HDB cap</span>
              </div>

              {/* Status Indicator */}
              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Lot Status</span>
                <div className="my-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    carAvail > 30 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : carAvail > 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}>
                    {carAvail > 30 ? 'Plenty Lots Available' : carAvail > 5 ? 'Filling Fast' : 'Critically Low / Full'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {carPercent}% occupied
                </span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Parking Fee Estimator */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Parking Fee Estimator
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Day Selector */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Day of Entry</label>
                <div className="flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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
                      {d === 'sunday' ? 'Sun/PH' : d === 'weekday' ? 'Mon-Fri' : 'Sat'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry Time */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Entry Time</label>
                <input
                  type="time"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Duration Stepper */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  Duration: <strong className="font-mono text-slate-900 dark:text-white">{durationHours} hrs</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 mt-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Computed Result Box */}
            <div className="mt-4 p-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 block">
                  Estimated Total Fee
                </span>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                  {calculatedFee.breakdown}
                </p>
              </div>

              <div className="text-right shrink-0 pl-3">
                <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                  ${calculatedFee.totalCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">SGD Estimated</span>
              </div>
            </div>
          </div>

          {/* 3. Official Rates Schedule */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Official Rate Structure
            </h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Weekday Daytime (7am - 5pm/6pm)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{carpark.rates.weekdayDay}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Weekday Evening / Overnight</span>
                <span className="font-semibold text-slate-900 dark:text-white">{carpark.rates.weekdayNight}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Saturday</span>
                <span className="font-semibold text-slate-900 dark:text-white">{carpark.rates.saturday}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sunday & Public Holidays</span>
                <span className="font-semibold text-slate-900 dark:text-white">{carpark.rates.sundayPH}</span>
              </div>
            </div>
          </div>

          {/* 4. Amenities & Restraints Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Facility Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Height Limit</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {carpark.features.clearanceHeight}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Grace Period</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {carpark.features.gracePeriodMins} Minutes
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Sheltered</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {carpark.features.isSheltered ? 'Yes (Covered)' : 'Surface Open'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">EV Charging</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {carpark.features.hasEVCharging ? `${carpark.features.evDetails?.operator || 'EV'} (${carpark.features.evDetails?.ports || 2} ports)` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. 24-Hour Typical Occupancy Pattern */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-semibold">Typical 24-Hour Congestion Pattern</span>
              <span className="text-[10px] text-slate-400">Peak lunch & evening hours</span>
            </div>
            <div className="h-12 flex items-end gap-1 pt-2">
              {carpark.typicalOccupancy.map((val, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  <div
                    className={`w-full rounded-t-xs transition-all ${
                      val > 80 ? 'bg-rose-500' : val > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                  {/* Hover tooltip for hour */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-mono whitespace-nowrap shadow-md">
                      {idx.toString().padStart(2, '0')}:00 · {val}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* 6. Nearby Alternatives (If lots are low) */}
          {nearbyAlternatives.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Nearby Alternative Carparks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {nearbyAlternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlternative(alt)}
                    className="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 transition-colors bg-white dark:bg-slate-900 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{alt.id}</span>
                      <span className="text-[10px] text-slate-500">{alt.distanceKm} km</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-rose-600 transition-colors">
                      {alt.name}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {alt.availableLots} lots
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                        {alt.rates.weekdayDay}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Coordinates: <span className="font-mono">{carpark.coordinates.lat.toFixed(4)}, {carpark.coordinates.lng.toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Waze Link */}
            <a
              href={`https://waze.com/ul?ll=${carpark.coordinates.lat},${carpark.coordinates.lng}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Waze</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>

            {/* Google Maps Primary CTA */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Direct via Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
