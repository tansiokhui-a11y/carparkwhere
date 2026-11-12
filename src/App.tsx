/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Carpark, CarparkFilter, RegionType, VehicleType } from './types/carpark';
import { INITIAL_CARPARKS } from './data/singaporeCarparks';
import { fetchLiveCarparkData, applyScenarioPreset } from './services/carparkService';

import { Header } from './components/Header';
import { QuickMetrics } from './components/QuickMetrics';
import { SearchAndFilters } from './components/SearchAndFilters';
import { InteractiveSGMap } from './components/InteractiveSGMap';
import { CarparkCard } from './components/CarparkCard';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { RateCalculatorModal } from './components/RateCalculatorModal';
import { SimulateScenarioBar } from './components/SimulateScenarioBar';

import { 
  Car, 
  MapPin, 
  Bookmark, 
  Navigation, 
  Radio, 
  Info, 
  CheckCircle2,
  Compass
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sg_parksense_theme') === 'dark' ||
        (!('sg_parksense_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sg_parksense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sg_parksense_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // App state
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [currentTab, setCurrentTab] = useState<'map' | 'list' | 'favorites' | 'calculator'>('map');
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [dataSource, setDataSource] = useState<'LTA DataMall' | 'data.gov.sg' | 'backend' | 'simulation'>('simulation');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sg_parksense_favs');
        return saved ? JSON.parse(saved) : ['ACB', 'ION', 'MBS', 'TM1'];
      } catch {
        return ['ACB', 'ION', 'MBS', 'TM1'];
      }
    }
    return ['ACB', 'ION', 'MBS', 'TM1'];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('sg_parksense_favs', JSON.stringify(next));
      return next;
    });
  };

  // Filter state
  const [filter, setFilter] = useState<CarparkFilter>({
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

  // Sync data handler
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await fetchLiveCarparkData(carparks);
      setCarparks(result.carparks);
      setDataSource(result.source);
      setLastUpdated(result.timestamp);
    } catch {
      // Keep existing data gracefully
    } finally {
      setIsSyncing(false);
    }
  }, [carparks]);

  // Initial fetch and auto-refresh interval
  useEffect(() => {
    handleSync();
    const interval = setInterval(() => {
      handleSync();
    }, 45000); // 45 seconds polling
    return () => clearInterval(interval);
  }, []);

  // Traffic scenario simulation handler
  const handleApplyScenario = (scenario: 'cbd_rush' | 'orchard_weekend' | 'midnight' | 'normal') => {
    const updated = applyScenarioPreset(carparks, scenario);
    setCarparks(updated);
    setLastUpdated(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }));
  };

  // Filtered & Sorted Carparks
  const filteredCarparks = useMemo(() => {
    return carparks.filter(cp => {
      // 1. Search query
      if (filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase().trim();
        const matchesName = cp.name.toLowerCase().includes(q);
        const matchesId = cp.id.toLowerCase().includes(q);
        const matchesAddress = cp.address.toLowerCase().includes(q);
        const matchesPostal = cp.postalCode.includes(q);
        const matchesArea = cp.area.toLowerCase().includes(q);

        if (!matchesName && !matchesId && !matchesAddress && !matchesPostal && !matchesArea) {
          return false;
        }
      }

      // 2. Region filter
      if (filter.region !== 'All' && cp.area !== filter.region) {
        return false;
      }

      // 3. Availability tier filter
      if (filter.availabilityTier === 'high' && cp.availableLots <= 30) return false;
      if (filter.availabilityTier === 'medium' && (cp.availableLots > 30 || cp.availableLots <= 5)) return false;
      if (filter.availabilityTier === 'low' && cp.availableLots > 5) return false;

      // 4. EV Only
      if (filter.evOnly && !cp.features.hasEVCharging) return false;

      // 5. Sheltered Only
      if (filter.shelteredOnly && !cp.features.isSheltered) return false;

      // 6. Sunday Free Only
      if (filter.freeSundayOnly && !cp.features.freeParkingSunday) return false;

      // 7. Clearance
      if (filter.minClearance > 0 && cp.features.heightMeters < filter.minClearance) return false;

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'availability') {
        return b.availableLots - a.availableLots;
      }
      if (filter.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (filter.sortBy === 'rates') {
        const rateA = a.rates.firstHour ?? (a.rates.baseRatePerHalfHour ? a.rates.baseRatePerHalfHour * 2 : 2.0);
        const rateB = b.rates.firstHour ?? (b.rates.baseRatePerHalfHour ? b.rates.baseRatePerHalfHour * 2 : 2.0);
        return rateA - rateB;
      }
      return 0;
    });
  }, [carparks, filter]);

  // Favorite Carparks
  const favoriteCarparks = useMemo(() => {
    return carparks.filter(c => favorites.includes(c.id));
  }, [carparks, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        favoritesCount={favorites.length}
        lastUpdated={lastUpdated}
        isSyncing={isSyncing}
        onRefresh={handleSync}
        dataSource={dataSource}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Hero Banner Section (Single Viewport Anchor) */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white mb-6 border border-slate-800 shadow-lg">
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/sg_smart_parking_banner_1794474723702.jpg"
              alt="Singapore Smart Mobility Skyline"
              className="w-full h-full object-cover opacity-35 filter brightness-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="tracking-wider uppercase">Live Singapore Parking Intelligence</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Real-time lot availability across HDB, URA & shopping malls.
            </h1>
            
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed max-w-xl">
              Track available parking lots instantly across Singapore before driving out. Check electronic parking system (EPS) rates, height clearances, and EV charging points.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentTab('map');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Live Radar Map</span>
              </button>

              <button
                onClick={() => setCurrentTab('calculator')}
                className="py-2 px-4 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold backdrop-blur-sm border border-slate-700 transition-colors"
              >
                Estimate Parking Fees
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics Statistics Strip */}
        <QuickMetrics carparks={carparks} />

        {/* Traffic Simulation & Backend Integration Helper */}
        <SimulateScenarioBar 
          onApplyScenario={handleApplyScenario} 
          dataSource={dataSource} 
        />

        {/* Search & Filter Controls */}
        <SearchAndFilters
          filter={filter}
          onFilterChange={setFilter}
          totalFilteredCount={filteredCarparks.length}
        />

        {/* View Content based on Selected Tab */}
        {currentTab === 'map' && (
          <div className="space-y-6">
            {/* Interactive Vector Radar Map */}
            <InteractiveSGMap
              carparks={filteredCarparks}
              selectedCarpark={selectedCarpark}
              onSelectCarpark={setSelectedCarpark}
              activeRegion={filter.region}
              onSelectRegion={(reg) => setFilter({ ...filter, region: reg })}
            />

            {/* Sub-grid of Carparks below the Map */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {filter.region === 'All' ? 'All Tracked Facilities' : `${filter.region} Carparks`}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ({filteredCarparks.length} locations)
                  </span>
                </div>

                <button
                  onClick={() => setCurrentTab('list')}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Switch to Full List View &rarr;
                </button>
              </div>

              {filteredCarparks.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No carparks matched your current search filters. Try clearing your search keyword or selecting "All" regions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCarparks.slice(0, 9).map((cp) => (
                    <CarparkCard
                      key={cp.id}
                      carpark={cp}
                      vehicleType={filter.vehicleType}
                      isFavorite={favorites.includes(cp.id)}
                      onToggleFavorite={toggleFavorite}
                      onOpenDetails={setSelectedCarpark}
                      isSelected={selectedCarpark?.id === cp.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'list' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Singapore Carpark Directory ({filteredCarparks.length} facilities)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by {filter.sortBy === 'availability' ? 'Most Available Lots' : filter.sortBy === 'rates' ? 'Lowest Parking Rates' : 'Alphabetical'}
              </span>
            </div>

            {filteredCarparks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Car className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No carparks found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust your search query or reset your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCarparks.map((cp) => (
                  <CarparkCard
                    key={cp.id}
                    carpark={cp}
                    vehicleType={filter.vehicleType}
                    isFavorite={favorites.includes(cp.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetails={setSelectedCarpark}
                    isSelected={selectedCarpark?.id === cp.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'calculator' && (
          <RateCalculatorModal
            carparks={carparks}
            onSelectCarpark={setSelectedCarpark}
          />
        )}

        {currentTab === 'favorites' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Saved Carparks ({favoriteCarparks.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pinned locations for fast access before your daily commute.
                </p>
              </div>
            </div>

            {favoriteCarparks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No saved carparks yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the bookmark icon on any carpark card to save it here for quick daily monitoring.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteCarparks.map((cp) => (
                  <CarparkCard
                    key={cp.id}
                    carpark={cp}
                    vehicleType={filter.vehicleType}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetails={setSelectedCarpark}
                    isSelected={selectedCarpark?.id === cp.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Selected Carpark Detail Modal / Drawer */}
      {selectedCarpark && (
        <CarparkDetailModal
          carpark={selectedCarpark}
          allCarparks={carparks}
          isFavorite={favorites.includes(selectedCarpark.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedCarpark(null)}
          onSelectAlternative={(alt) => setSelectedCarpark(alt)}
        />
      )}

      {/* Quiet Informational Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">SG ParkSense</span>
            <span>·</span>
            <span>Singapore Real-Time Parking Availability</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Data: Singapore data.gov.sg Transport API &amp; HDB / URA</span>
            <span>·</span>
            <span>Ready for Backend Integration</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
