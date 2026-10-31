import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight, Download } from 'lucide-react';
import { downloadPhoto } from '../services/api';

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before Repair (Reported)',
  afterLabel = 'After Repair (Resolved)',
  aspectRatio = 'aspect-[16/9]'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const defaultBefore = 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60';
  const defaultAfter = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-2 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> {beforeLabel}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <ArrowLeftRight className="w-3.5 h-3.5" /> Drag slider to inspect proof
        </span>
        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> {afterLabel}
        </span>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 shadow-md cursor-ew-resize ${aspectRatio}`}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <img
          src={afterImage || defaultAfter}
          alt="After repair"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage || defaultBefore}
            alt="Before repair"
            className="absolute inset-0 max-w-none w-full h-full object-cover pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow backdrop-blur-sm pointer-events-none">
          BEFORE
        </div>
        <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow backdrop-blur-sm pointer-events-none">
          AFTER (VERIFIED)
        </div>

        {/* Slider Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Draggable Button Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-transform">
            <ArrowLeftRight className="w-4 h-4 text-slate-800" />
          </div>
        </div>
      </div>

      {/* Photo Download Actions for Student, Staff, and Admin */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => downloadPhoto(beforeImage || defaultBefore, 'before-repair-photo.jpg')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-200"
          title="Download Before Repair Photo"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Before Photo</span>
        </button>

        <button
          type="button"
          onClick={() => downloadPhoto(afterImage || defaultAfter, 'after-repair-photo.jpg')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors border border-emerald-200"
          title="Download After Repair Photo"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download After Photo</span>
        </button>
      </div>
    </div>
  );
};

