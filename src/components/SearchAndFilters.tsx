import React from 'react';
import { CarparkFilter, RegionType, VehicleType, AvailabilityTier } from '../types/carpark';
import { Search, SlidersHorizontal, X, Zap, ShieldCheck, DollarSign, Car, Bike, Truck } from 'lucide-react';

interface SearchAndFiltersProps {
  filter: CarparkFilter;
  onFilterChange: (newFilter: CarparkFilter) => void;
  totalFilteredCount: number;
}

const REGIONS: RegionType[] = [
  'All',
  'Central & CBD',
  'Orchard',
  'Marina Bay',
  'East',
  'West',
  'North',
  'North-East',
  'South & HarbourFront'
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filter,
  onFilterChange,
  totalFilteredCount
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchQuery: e.target.value });
  };

  const handleRegionSelect = (region: RegionType) => {
    onFilterChange({ ...filter, region });
  };

  const handleTierSelect = (availabilityTier: AvailabilityTier) => {
    onFilterChange({ ...filter, availabilityTier });
  };

  const handleVehicleSelect = (vehicleType: VehicleType) => {
    onFilterChange({ ...filter, vehicleType });
  };

  const handleToggle = (key: 'evOnly' | 'shelteredOnly' | 'freeSundayOnly') => {
    onFilterChange({ ...filter, [key]: !filter[key] });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, sortBy: e.target.value as CarparkFilter['sortBy'] });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      region: 'All',
      availabilityTier: 'all',
      vehicleType: 'C',
      evOnly: false,
      shelteredOnly: false,
      minClearance: 0,
      freeSundayOnly: false,
      sortBy: 'availability'
    });
  };

  const hasActiveFilters = 
    filter.searchQuery !== '' || 
    filter.region !== 'All' || 
    filter.availabilityTier !== 'all' || 
    filter.evOnly || 
    filter.shelteredOnly || 
    filter.freeSundayOnly;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm mb-4 transition-colors">
      
      {/* Top Search & Primary Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search carparks by name, HDB code (ACB, BM1...), postal code, or road..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Vehicle Type Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleVehicleSelect('C')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter.vehicleType === 'C'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Cars</span>
          </button>

          <button
            onClick={() => handleVehicleSelect('Y')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter.vehicleType === 'Y'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Bikes</span>
          </button>

          <button
            onClick={() => handleVehicleSelect('H')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter.vehicleType === 'H'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Heavy</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={filter.sortBy}
            onChange={handleSortChange}
            className="py-2 px-3 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="availability">Sort: Most Lots Available</option>
            <option value="rates">Sort: Lowest Parking Rates</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Region Filter Bar (Clean single-line horizontal scroll) */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mr-1">Region:</span>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionSelect(region)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filter.region === region
                  ? 'bg-slate-900 text-white dark:bg-rose-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 pl-2">
          <span className="font-mono font-semibold text-slate-900 dark:text-white">{totalFilteredCount}</span> found
        </div>
      </div>

      {/* Advanced Filter Toggles (Collapsible) */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Availability Tier Buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => handleTierSelect('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter.availabilityTier === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Lots
              </button>
              <button
                onClick={() => handleTierSelect('high')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter.availabilityTier === 'high'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                &gt;30 Lots
              </button>
              <button
                onClick={() => handleTierSelect('medium')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter.availabilityTier === 'medium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                6-30 Lots
              </button>
              <button
                onClick={() => handleTierSelect('low')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter.availabilityTier === 'low'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                &le;5 Full
              </button>
            </div>

            {/* Feature Check Toggles */}
            <button
              onClick={() => handleToggle('evOnly')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                filter.evOnly
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>EV Charging</span>
            </button>

            <button
              onClick={() => handleToggle('shelteredOnly')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                filter.shelteredOnly
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sheltered</span>
            </button>

            <button
              onClick={() => handleToggle('freeSundayOnly')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                filter.freeSundayOnly
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sunday Free (FPS)</span>
            </button>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium flex items-center gap-1 ml-auto"
            >
              <X className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          )}

        </div>
      )}

    </div>
  );
};
