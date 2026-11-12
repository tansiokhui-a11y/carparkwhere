import React from 'react';
import { Carpark, VehicleType } from '../types/carpark';
import { 
  Navigation, 
  Zap, 
  ShieldCheck, 
  Bookmark, 
  ArrowUpRight, 
  Clock, 
  DollarSign
} from 'lucide-react';

interface CarparkCardProps {
  carpark: Carpark;
  vehicleType: VehicleType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (carpark: Carpark) => void;
  isSelected?: boolean;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  vehicleType,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  isSelected = false
}) => {
  // Determine relevant lot numbers based on vehicleType
  let available = carpark.availableLots;
  let total = carpark.totalLots;

  if (vehicleType === 'Y' && carpark.vehicleTypes.motorcycle) {
    available = carpark.vehicleTypes.motorcycle.available;
    total = carpark.vehicleTypes.motorcycle.total;
  } else if (vehicleType === 'H' && carpark.vehicleTypes.heavyVehicle) {
    available = carpark.vehicleTypes.heavyVehicle.available;
    total = carpark.vehicleTypes.heavyVehicle.total;
  }

  const occupancyRatio = total > 0 ? (total - available) / total : 0;
  const occupancyPercent = Math.round(occupancyRatio * 100);

  // Status tiers
  let statusText = 'Available';
  let statusBadgeClass = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
  let progressBarClass = 'bg-emerald-500';

  if (available <= 5) {
    statusText = available === 0 ? 'Full' : 'Almost Full';
    statusBadgeClass = 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
    progressBarClass = 'bg-rose-500';
  } else if (available <= 30) {
    statusText = 'Filling Fast';
    statusBadgeClass = 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    progressBarClass = 'bg-amber-500';
  }

  return (
    <div 
      className={`group rounded-xl border bg-white dark:bg-slate-900 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md ${
        isSelected 
          ? 'border-rose-500 ring-1 ring-rose-500/30' 
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div>
        {/* Top Kicker: ID, Agency & Favorite Action */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{carpark.id}</span>
            <span aria-hidden="true">·</span>
            <span>{carpark.agency}</span>
            <span aria-hidden="true">·</span>
            <span>{carpark.carparkType}</span>
            <span aria-hidden="true">·</span>
            <span>{carpark.area}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(carpark.id);
            }}
            title={isFavorite ? 'Remove from saved' : 'Save carpark'}
            className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Carpark Name & Address */}
        <button
          onClick={() => onOpenDetails(carpark)}
          className="text-left w-full group/title focus:outline-none"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight group-hover/title:text-rose-600 dark:group-hover/title:text-rose-400 transition-colors">
            {carpark.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {carpark.address}
          </p>
        </button>

        {/* Live Lots Availability Display */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Lots Available Now
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {available}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  / {total} lots
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusBadgeClass}`}>
                {statusText}
              </span>
              <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                {occupancyPercent}% full
              </span>
            </div>
          </div>

          {/* Occupancy Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${progressBarClass}`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Feature Amenities Row (Clean unboxed tags) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {carpark.features.hasEVCharging && (
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>EV Ready ({carpark.features.evDetails?.operator || 'Charger'})</span>
            </span>
          )}

          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{carpark.features.clearanceHeight} Clearance</span>
          </span>

          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{carpark.features.gracePeriodMins}m Grace</span>
          </span>

          {carpark.features.freeParkingSunday && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>Sunday Free</span>
            </span>
          )}
        </div>

        {/* Rate Preview Line */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="truncate pr-2">Rate: <strong className="font-semibold text-slate-700 dark:text-slate-300">{carpark.rates.weekdayDay}</strong></span>
          <span className="font-mono text-[10px] text-slate-400 shrink-0">{carpark.lastUpdated}</span>
        </div>

      </div>

      {/* Action Buttons Row */}
      <div className="mt-4 pt-3 flex items-center gap-2">
        <button
          onClick={() => onOpenDetails(carpark)}
          className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
        >
          <span>Calculate Fee</span>
        </button>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          title="Open Directions in Google Maps"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Direct Me</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
