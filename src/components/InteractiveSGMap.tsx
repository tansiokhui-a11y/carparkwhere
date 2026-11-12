import React, { useState, useRef, useMemo } from 'react';
import { Carpark, RegionType } from '../types/carpark';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Zap, 
  MapPin, 
  Navigation,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface InteractiveSGMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  activeRegion: RegionType;
  onSelectRegion: (region: RegionType) => void;
}

// Singapore coordinate bounds for accurate projection
const SG_BOUNDS = {
  minLng: 103.63,
  maxLng: 104.02,
  minLat: 1.22,
  maxLat: 1.47,
  width: 1000,
  height: 620
};

// Convert Lat/Lng to SVG Canvas X/Y coordinates
function projectCoord(lat: number, lng: number) {
  const x = ((lng - SG_BOUNDS.minLng) / (SG_BOUNDS.maxLng - SG_BOUNDS.minLng)) * 900 + 50;
  const y = 570 - ((lat - SG_BOUNDS.minLat) / (SG_BOUNDS.maxLat - SG_BOUNDS.minLat)) * 500;
  return { x, y };
}

export const InteractiveSGMap: React.FC<InteractiveSGMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  activeRegion,
  onSelectRegion
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCarpark, setHoveredCarpark] = useState<Carpark | null>(null);
  const [showExpressways, setShowExpressways] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.35, 3.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.35, 0.9));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Center on selected carpark when changed
  React.useEffect(() => {
    if (selectedCarpark) {
      const { x, y } = projectCoord(selectedCarpark.coordinates.lat, selectedCarpark.coordinates.lng);
      // Adjust pan to center the marker in viewport
      const targetPanX = (500 - x) * zoom * 0.5;
      const targetPanY = (310 - y) * zoom * 0.5;
      setPan({ x: targetPanX, y: targetPanY });
    }
  }, [selectedCarpark]);

  // Project all carparks
  const projectedCarparks = useMemo(() => {
    return carparks.map(cp => ({
      ...cp,
      pos: projectCoord(cp.coordinates.lat, cp.coordinates.lng)
    }));
  }, [carparks]);

  return (
    <div 
      ref={mapContainerRef}
      className="relative w-full h-[520px] lg:h-[600px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <Compass className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-semibold text-white">Singapore Live Radar</span>
          <span className="text-slate-500">·</span>
          <span>{carparks.length} Carparks Tracked</span>
        </div>

        {/* Region Quick Zoom Buttons */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/60">
          {(['All', 'Central & CBD', 'Orchard', 'Marina Bay', 'East', 'West', 'North'] as RegionType[]).map((reg) => (
            <button
              key={reg}
              onClick={(e) => {
                e.stopPropagation();
                onSelectRegion(reg);
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                activeRegion === reg 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'Central & CBD' ? 'CBD' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowExpressways(prev => !prev)}
          title="Toggle Expressways"
          className={`w-8 h-8 rounded-lg backdrop-blur-md border flex items-center justify-center transition-colors ${
            showExpressways 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
              : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3.5 py-2 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700/60 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>&gt;30 Lots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>6-30 Lots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>&le;5 Full</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-700 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>EV Charger</span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 1000 620"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%'
        }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
          </pattern>
          {/* Gradients */}
          <radialGradient id="singaporeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Grid Background */}
        <rect width="1000" height="620" fill="url(#radar-grid)" />
        <circle cx="500" cy="310" r="400" fill="url(#singaporeGlow)" />

        {/* Straits of Johor & Singapore Water Labels */}
        <text x="500" y="45" fill="#475569" fontSize="11" fontFamily="sans-serif" letterSpacing="3" textAnchor="middle">
          STRAITS OF JOHOR (MALAYSIA)
        </text>
        <text x="500" y="595" fill="#475569" fontSize="11" fontFamily="sans-serif" letterSpacing="3" textAnchor="middle">
          SINGAPORE STRAIT
        </text>

        {/* Mainland Singapore Geographic Outline (Faithfully tracing SG Coastline) */}
        <path
          d="
            M 140 380
            C 130 350, 160 300, 210 260
            C 250 230, 280 180, 320 160
            C 360 145, 410 130, 470 135
            C 530 138, 590 150, 640 180
            C 690 200, 750 230, 810 270
            C 860 300, 920 330, 930 365
            C 920 395, 870 410, 810 425
            C 750 440, 680 460, 600 480
            C 550 495, 480 500, 420 485
            C 360 470, 310 440, 250 425
            C 190 415, 150 405, 140 380 Z
          "
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Secondary Land Masses: Sentosa, Jurong Island, Pulau Ubin */}
        {/* Sentosa */}
        <path
          d="M 440 520 C 470 515, 500 520, 520 535 C 500 545, 460 545, 440 535 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1.8"
        />
        <text x="480" y="533" fill="#64748b" fontSize="8" textAnchor="middle">Sentosa</text>

        {/* Jurong Island */}
        <path
          d="M 170 450 C 210 435, 260 445, 270 470 C 250 485, 200 490, 170 470 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <text x="220" y="468" fill="#64748b" fontSize="8" textAnchor="middle">Jurong Island</text>

        {/* Pulau Ubin & Changi Area */}
        <ellipse cx="800" cy="180" rx="35" ry="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <text x="800" y="183" fill="#64748b" fontSize="8" textAnchor="middle">Pulau Ubin</text>

        {/* Major Singapore Expressways (PIE, CTE, AYE, ECP, SLE/BKE) */}
        {showExpressways && (
          <g stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="4 3" fill="none">
            {/* PIE (Pan Island Expressway: Tuas to Changi) */}
            <path d="M 180 390 Q 350 320, 530 330 T 900 360" />
            {/* AYE (Ayer Rajah Expressway: Tuas to Marina) */}
            <path d="M 200 425 Q 380 430, 540 480" />
            {/* CTE (Central Expressway: Ang Mo Kio to CBD) */}
            <path d="M 520 200 Q 525 350, 530 485" />
            {/* ECP (East Coast Parkway: Marina to Changi) */}
            <path d="M 540 490 Q 720 450, 910 380" />
            {/* SLE / BKE (Seletar / Bukit Timah to Woodlands) */}
            <path d="M 370 170 Q 430 240, 510 320" />
          </g>
        )}

        {/* Prominent District Geographic Anchor Labels */}
        <g fill="#94a3b8" fontSize="9" fontWeight="600" opacity="0.6">
          <text x="530" y="475" textAnchor="middle">CBD / MARINA</text>
          <text x="470" y="435" textAnchor="middle">ORCHARD</text>
          <text x="760" y="340" textAnchor="middle">TAMPINES</text>
          <text x="270" y="350" textAnchor="middle">JURONG EAST</text>
          <text x="380" y="195" textAnchor="middle">WOODLANDS</text>
          <text x="680" y="240" textAnchor="middle">PUNGGOL</text>
          <text x="900" y="380" textAnchor="middle">CHANGI</text>
        </g>

        {/* Plot All Real-Time Carpark Markers */}
        {projectedCarparks.map((cp) => {
          const isSelected = selectedCarpark?.id === cp.id;
          const isHovered = hoveredCarpark?.id === cp.id;

          // Color coded availability
          let badgeColor = '#10b981'; // emerald (>30)
          let glowColor = 'rgba(16, 185, 129, 0.4)';
          if (cp.availableLots <= 5) {
            badgeColor = '#f43f5e'; // rose (critical / full)
            glowColor = 'rgba(244, 63, 94, 0.5)';
          } else if (cp.availableLots <= 30) {
            badgeColor = '#f59e0b'; // amber (moderate)
            glowColor = 'rgba(245, 158, 11, 0.4)';
          }

          return (
            <g
              key={cp.id}
              transform={`translate(${cp.pos.x}, ${cp.pos.y})`}
              className="cursor-pointer transition-transform duration-150"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCarpark(cp);
              }}
              onMouseEnter={() => setHoveredCarpark(cp)}
              onMouseLeave={() => setHoveredCarpark(null)}
            >
              {/* Pulse effect if selected or low lots */}
              {isSelected && (
                <circle
                  r="24"
                  fill="none"
                  stroke={badgeColor}
                  strokeWidth="2"
                  opacity="0.8"
                  className="animate-ping"
                />
              )}

              {/* Marker Backdrop Circle */}
              <circle
                r={isSelected ? 16 : isHovered ? 14 : 11}
                fill="#0f172a"
                stroke={isSelected ? '#ffffff' : badgeColor}
                strokeWidth={isSelected ? 2.5 : 1.8}
                style={{
                  filter: `drop-shadow(0 2px 6px ${glowColor})`
                }}
              />

              {/* Inner lot count or agency mark */}
              <text
                y="3.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize={isSelected ? "9" : "8"}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
              >
                {cp.availableLots > 999 ? '999+' : cp.availableLots}
              </text>

              {/* EV indicator lightning badge */}
              {cp.features.hasEVCharging && (
                <circle
                  cx="8"
                  cy="-8"
                  r="3.5"
                  fill="#06b6d4"
                  stroke="#0f172a"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Card (Interactive Tooltip) */}
      {hoveredCarpark && (
        <div 
          className="absolute bottom-16 right-4 z-30 w-72 p-3 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl text-left pointer-events-none transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-mono text-slate-300 font-semibold">{hoveredCarpark.id}</span>
                <span>·</span>
                <span>{hoveredCarpark.agency}</span>
                <span>·</span>
                <span>{hoveredCarpark.carparkType}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug mt-0.5 line-clamp-1">
                {hoveredCarpark.name}
              </h4>
            </div>

            <div className="text-right shrink-0">
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                hoveredCarpark.availableLots > 30 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : hoveredCarpark.availableLots > 5 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-rose-500/20 text-rose-400'
              }`}>
                {hoveredCarpark.availableLots} Lots
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">of {hoveredCarpark.totalLots} total</p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">{hoveredCarpark.rates.weekdayDay}</span>
            {hoveredCarpark.features.hasEVCharging && (
              <span className="flex items-center gap-1 text-cyan-400 font-medium shrink-0 ml-2">
                <Zap className="w-3 h-3" /> EV Ready
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile/Desktop Selected Carpark Bottom Bar Drawer */}
      {selectedCarpark && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-20 p-3.5 bg-slate-900/95 backdrop-blur-md rounded-xl border border-rose-500/50 shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400">Selected Carpark</span>
              <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                {selectedCarpark.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{selectedCarpark.address}</p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-mono font-bold text-white">
                {selectedCarpark.availableLots}
                <span className="text-xs font-normal text-slate-400 font-sans"> / {selectedCarpark.totalLots}</span>
              </div>
              <span className={`text-[10px] font-medium ${
                selectedCarpark.availableLots > 30 ? 'text-emerald-400' : selectedCarpark.availableLots > 5 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {selectedCarpark.availableLots > 30 ? 'Plenty Available' : selectedCarpark.availableLots > 5 ? 'Limited Lots' : 'Nearly Full'}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCarpark.coordinates.lat},${selectedCarpark.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              onClick={() => onSelectCarpark(selectedCarpark)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              View Rates & Lots
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
