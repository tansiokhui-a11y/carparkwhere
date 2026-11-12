import React from 'react';
import { RefreshCw, Moon, Sun, Bookmark } from 'lucide-react';

interface HeaderProps {
  currentTab: 'map' | 'list' | 'favorites' | 'calculator';
  onTabChange: (tab: 'map' | 'list' | 'favorites' | 'calculator') => void;
  favoritesCount: number;
  lastUpdated: string;
  isSyncing: boolean;
  onRefresh: () => void;
  dataSource: 'data.gov.sg' | 'backend' | 'simulation';
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
  lastUpdated,
  isSyncing,
  onRefresh,
  dataSource,
  isDarkMode,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Wordmark Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => onTabChange('map')} 
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md group-hover:bg-rose-500 transition-colors">
              SG
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              ParkSense
            </span>
          </button>
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onTabChange('map')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white pb-0.5 border-b-2 ${
              currentTab === 'map'
                ? 'border-rose-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            Live Radar Map
          </button>

          <button
            onClick={() => onTabChange('list')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white pb-0.5 border-b-2 ${
              currentTab === 'list'
                ? 'border-rose-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            Carparks Directory
          </button>

          <button
            onClick={() => onTabChange('calculator')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white pb-0.5 border-b-2 ${
              currentTab === 'calculator'
                ? 'border-rose-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            Rates Estimator
          </button>

          <button
            onClick={() => onTabChange('favorites')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'favorites'
                ? 'border-rose-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Lots</span>
            {favoritesCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Sync & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Data Source & Timestamp Indicator */}
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {dataSource === 'data.gov.sg' ? 'Gov Transport API' : 'Simulated Real-Time'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Updated {lastUpdated}
            </span>
          </div>

          {/* Sync Trigger */}
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            title="Fetch latest carpark availability"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Dark Mode Switch */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
