import React, { useState } from 'react';
import { Building2, AlertTriangle, CheckCircle, ShieldAlert, Layers, MapPin, Eye } from 'lucide-react';
import { api } from '../services/api';

export const CampusHeatmap = ({ onSelectBuilding, selectedBuilding }) => {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const blocks = api.getCampusHeatmapData();

  const getHeatColor = (heat) => {
    switch (heat) {
      case 'critical':
        return {
          bg: 'bg-red-500/20 border-red-500 hover:bg-red-500/30 text-red-900',
          badge: 'bg-red-600 text-white',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)] ring-2 ring-red-400 animate-pulse',
          label: 'Critical Hotspot',
        };
      case 'high':
        return {
          bg: 'bg-amber-500/20 border-amber-500 hover:bg-amber-500/30 text-amber-900',
          badge: 'bg-amber-600 text-white',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
          label: 'High Attention',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 text-yellow-900',
          badge: 'bg-yellow-600 text-white',
          glow: '',
          label: 'Moderate',
        };
      default:
        return {
          bg: 'bg-emerald-500/20 border-emerald-400 hover:bg-emerald-500/30 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          glow: '',
          label: 'Healthy',
        };
    }
  };

  const totalOpenTickets = blocks.reduce((acc, b) => acc + b.open, 0);
  const totalCritical = blocks.reduce((acc, b) => acc + b.critical, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-800">Campus Maintenance Heatmap</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Live Geo-Density
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual complaint distribution across all campus wings and classrooms.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-600 font-medium">Critical / Hot</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-slate-600 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Clear</span>
          </div>
        </div>
      </div>

      {/* Campus Map Grid Visualization */}
      <div className="relative mt-4 bg-slate-950 rounded-xl p-4 min-h-[300px] overflow-hidden border border-slate-800">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Compass & North Indicator */}
        <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500 flex flex-col items-center">
          <span className="text-blue-400 font-bold">▲ N</span>
          <span>CAMPUS MAP</span>
        </div>

        {/* Quick summary overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-lg p-2 text-xs text-slate-300 flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-[10px] block">OPEN ISSUES</span>
            <span className="font-bold text-white text-sm">{totalOpenTickets}</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-slate-400 text-[10px] block">CRITICAL</span>
            <span className="font-bold text-red-400 text-sm">{totalCritical}</span>
          </div>
          {selectedBuilding && (
            <>
              <div className="w-px h-6 bg-slate-700" />
              <button
                onClick={() => onSelectBuilding && onSelectBuilding(null)}
                className="text-xs text-blue-400 hover:underline"
              >
                Clear Filter ✕
              </button>
            </>
          )}
        </div>

        {/* Building Blocks Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 py-2">
          {blocks.map((block) => {
            const heatStyle = getHeatColor(block.heat);
            const isSelected = selectedBuilding === block.id;

            return (
              <div
                key={block.id}
                onMouseEnter={() => setHoveredBlock(block)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => onSelectBuilding && onSelectBuilding(isSelected ? null : block.id)}
                className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
                } ${heatStyle.bg} ${heatStyle.glow} backdrop-blur-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-black/30 rounded-lg text-white">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white tracking-wide">{block.id}</h4>
                      <p className="text-[11px] text-slate-300">{block.name}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${heatStyle.badge}`}>
                    {block.heat}
                  </span>
                </div>

                {/* Metrics inside block card */}
                <div className="mt-3 grid grid-cols-3 gap-1 text-center bg-black/40 rounded-lg p-2 text-white text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400">Total</span>
                    <span className="font-bold">{block.total}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-amber-400">Open</span>
                    <span className="font-bold text-amber-300">{block.open}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-red-400">Critical</span>
                    <span className="font-bold text-red-400">{block.critical}</span>
                  </div>
                </div>

                {/* Rooms preview */}
                <div className="mt-2 text-[10px] text-slate-300 truncate">
                  <span className="text-slate-400">Monitored rooms:</span> {block.rooms.join(', ')}
                </div>

                {/* Special Highlight for Block B (Classroom 203 Scenario) */}
                {block.id === 'Block B' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-red-300 font-semibold bg-red-950/60 px-2 py-1 rounded border border-red-800">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span>Classroom 203 Electrical Hazard Hotspot</span>
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

