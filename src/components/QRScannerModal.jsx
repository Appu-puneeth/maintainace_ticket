import React, { useState } from 'react';
import { QrCode, Scan, Camera, X, CheckCircle, Sparkles, Building2, MapPin, ArrowRight } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onLocationScanned }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  // Preset campus QR locations for 1-click simulated scan
  const campusLocations = [
    {
      id: 'LOC-203',
      label: 'Classroom 203',
      building: 'Block B',
      floor: '2nd Floor',
      room: '203',
      type: 'Classroom',
      highlight: true, // Exact scenario match!
    },
    {
      id: 'LOC-LAB2',
      label: 'Lab 2 (Computer Science)',
      building: 'Science Block',
      floor: '1st Floor',
      room: 'Lab 2',
      type: 'Laboratory',
    },
    {
      id: 'LOC-WR-B',
      label: 'Washroom 2nd Floor',
      building: 'Block B',
      floor: '2nd Floor',
      room: 'Washroom B2',
      type: 'Restroom',
    },
    {
      id: 'LOC-SEM1',
      label: 'Seminar Hall 1',
      building: 'Admin Block',
      floor: '3rd Floor',
      room: 'Seminar Hall 1',
      type: 'Auditorium',
    },
    {
      id: 'LOC-LIB',
      label: 'Central Reading Hall',
      building: 'Library',
      floor: 'Ground Floor',
      room: 'Main Hall',
      type: 'Library',
    },
  ];

  const handleConfirmLocation = (loc) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onLocationScanned({
        building: loc.building,
        floor: loc.floor,
        room: loc.room,
        location: `${loc.label}, ${loc.building} (${loc.floor})`,
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <QrCode className="w-6 h-6 text-white" />
            </span>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
                SMART QR REPORTING
              </span>
              <h2 className="text-xl font-bold">Smart Classroom QR Scanner</h2>
            </div>
          </div>

          {/* Slogan */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Scan it. Report it. Fix it.</span>
          </div>
          <p className="text-xs text-blue-100 mt-2">
            No login required! Instant location auto-fill directly by scanning classroom QR tags.
          </p>
        </div>

        {/* Scanner Simulation Body */}
        <div className="p-6 space-y-5">
          {/* Virtual Scanner Viewfinder */}
          <div className="relative bg-slate-900 rounded-2xl h-52 flex flex-col items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
            {/* Animated Laser Line */}
            <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan-line pointer-events-none" />

            {/* Corner guide brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />

            {/* Center Content */}
            <div className="text-center z-10 px-4">
              <Scan className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-80 animate-pulse" />
              <p className="text-xs font-medium text-slate-300">
                Point camera at the FixIt sticker on room door
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                (Select a preset below to instantly simulate scanning in your browser)
              </p>
            </div>

            {isScanning && (
              <div className="absolute inset-0 bg-blue-600/90 flex flex-col items-center justify-center text-white z-20">
                <CheckCircle className="w-10 h-10 mb-2 animate-bounce" />
                <p className="font-bold text-sm">QR Code Decoded!</p>
                <p className="text-xs text-blue-100">Auto-filling location data...</p>
              </div>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Simulate Classroom QR Codes:
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
              {campusLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleConfirmLocation(loc)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    loc.highlight
                      ? 'bg-blue-50/80 border-blue-300 hover:bg-blue-100 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2 rounded-lg ${loc.highlight ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{loc.label}</span>
                        {loc.highlight && (
                          <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-1.5 py-0.5 rounded">
                            Demo Scenario
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {loc.building} · {loc.floor} · Room {loc.room}
                      </span>
                    </div>
                  </div>

                  <button className="flex items-center gap-1 text-xs font-bold text-blue-600 group">
                    <span>Scan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

