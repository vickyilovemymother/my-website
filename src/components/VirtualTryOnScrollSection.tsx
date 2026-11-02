import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Layers, RefreshCw, Shirt, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Colorway {
  name: string;
  hex: string;
  timestamp: number;
}

const colorways: Colorway[] = [
  { name: "Heather Grey", hex: "#9CA3AF", timestamp: 5.5 },
  { name: "Stealth Black", hex: "#171717", timestamp: 6.8 },
  { name: "Pure White", hex: "#FFFFFF", timestamp: 7.6 },
  { name: "Deep Navy", hex: "#1E293B", timestamp: 8.4 },
  { name: "Sand Beige", hex: "#D6D3D1", timestamp: 9.3 },
];

export const VirtualTryOnScrollSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [isManualOverride, setIsManualOverride] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (isManualOverride) return;

      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) return;

      // Map scroll 0 to 1 directly to video duration (0s to ~9.9s)
      const targetTime = latest * video.duration;
      if (Math.abs(video.currentTime - targetTime) > 0.08) {
        video.currentTime = targetTime;
      }

      // Update active stage based on scroll percentage
      if (latest < 0.28) {
        setActiveStage(0);
      } else if (latest < 0.54) {
        setActiveStage(1);
      } else if (latest < 0.78) {
        setActiveStage(2);
      } else {
        setActiveStage(3);
        // Map 0.78-1.0 to colorways
        const colorProgress = (latest - 0.78) / 0.22;
        const colorIdx = Math.min(colorways.length - 1, Math.floor(colorProgress * colorways.length));
        setActiveColor(colorIdx);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isManualOverride]);

  const jumpToColorway = (index: number) => {
    setIsManualOverride(true);
    setActiveColor(index);
    const video = videoRef.current;
    if (video) {
      video.currentTime = colorways[index].timestamp;
      video.pause();
    }
    // Resume scroll tracking after 2.5s
    setTimeout(() => {
      setIsManualOverride(false);
    }, 2500);
  };

  const jumpToStage = (stageIdx: number, time: number) => {
    setActiveStage(stageIdx);
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  };

  return (
    <section ref={containerRef} className="relative w-full h-[320vh] bg-white">
      {/* Pinned Sticky Stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-12 px-4 md:px-8">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Reference Video Display Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl bg-neutral-100 border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
              
              {/* Reference Video with 0 modification */}
              <video
                ref={videoRef}
                src="assets/images/portfolio/video_scroll.mp4"
                playsInline
                muted
                preload="auto"
                className="w-full h-full object-cover"
              />

              {/* Top Glass Metadata Bar */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-sm z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-800">
                    Scroll-Driven Transformation
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  VP R&amp;D PIPELINE
                </span>
              </div>

              {/* Colorway Swatch Bar Overlay (Active during Stage 4 / Colorway swapping) */}
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md z-20 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 font-semibold uppercase">Active SKU:</span>
                  <span className="text-neutral-900 font-bold">{colorways[activeColor]?.name}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {colorways.map((cw, idx) => {
                    const isSelected = activeColor === idx;
                    return (
                      <button
                        key={cw.name}
                        onClick={() => jumpToColorway(idx)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200 border",
                          isSelected
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm scale-105"
                            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: cw.hex }}
                        />
                        <span className="hidden sm:inline-block">{cw.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Scroll Hint */}
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Scroll down to advance digital fashion pipeline</span>
            </div>
          </div>

          {/* Right Column: Architectural Scrollytelling Stages */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            
            <div className="mb-2">
              <span className="inline-block px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full mb-3">
                Scrollytelling // Architecture
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                Virtual Try-On &amp; Digital Twin Pipeline.
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Synchronized frame-accurate cloth dynamics, mannequin topology fitting, neural human synthesis, and automated multi-SKU variant swapping.
              </p>
            </div>

            {/* Stage Cards */}
            <div className="space-y-3">
              {/* Stage 1 */}
              <div
                onClick={() => jumpToStage(0, 0.5)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                  activeStage === 0
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase opacity-75">
                    STAGE 01 // 00:00 - 00:02
                  </span>
                  <Shirt className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold">Ghost Mannequin Simulation</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-80">
                  Garment CAD pattern simulation in CLO3D capturing authentic warp/weft tension and realistic gravity drape.
                </p>
              </div>

              {/* Stage 2 */}
              <div
                onClick={() => jumpToStage(1, 2.5)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                  activeStage === 1
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase opacity-75">
                    STAGE 02 // 00:02 - 00:04
                  </span>
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold">Anatomical Mannequin Calibration</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-80">
                  Fitting and collision volume alignment to 3D male/female forms with calibrated studio lighting.
                </p>
              </div>

              {/* Stage 3 */}
              <div
                onClick={() => jumpToStage(2, 4.5)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                  activeStage === 2
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase opacity-75">
                    STAGE 03 // 00:04 - 00:06
                  </span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold">Neural Model Synthesis</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-80">
                  Photorealistic virtual try-on composite mapping 3D garment physics onto human models with natural posture.
                </p>
              </div>

              {/* Stage 4 */}
              <div
                onClick={() => jumpToStage(3, 7.5)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                  activeStage === 3
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase opacity-75">
                    STAGE 04 // 00:06 - 00:09
                  </span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold">Autonomous Multi-SKU Colorway Engine</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-80">
                  Batch automated PBR shader variant swapping across all catalog colorways without reshooting.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default VirtualTryOnScrollSection;
