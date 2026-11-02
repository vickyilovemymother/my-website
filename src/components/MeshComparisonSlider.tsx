import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

export const MeshComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 bg-neutral-100 shadow-sm"
    >
      {/* Background Image: Final 3D Render (After) */}
      <img
        src="assets/images/portfolio/pipeline_execution/after.png"
        alt="Final Photorealistic 3D Render Composite"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-white/95 text-neutral-900 border border-neutral-200/80 backdrop-blur-md shadow-xs pointer-events-none">
        Final 3D Render
      </span>

      {/* Foreground Image: Wireframe Mesh Topology (Before) with Clip-Path */}
      <img
        src="assets/images/portfolio/pipeline_execution/before.png"
        alt="3D Mesh Topology Wireframe"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
        }}
      />
      <span
        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-neutral-900/90 text-white border border-neutral-700 backdrop-blur-md shadow-xs pointer-events-none transition-opacity"
        style={{
          opacity: sliderPos > 12 ? 1 : 0,
        }}
      >
        Mesh Topology
      </span>

      {/* Divider line and draggable handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-neutral-900 border border-neutral-300 shadow-md flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
          <MoveHorizontal className="w-4 h-4 text-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export default MeshComparisonSlider;
