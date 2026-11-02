import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoolSlideGallerySlide {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  category?: string;
}

export type TitlePosition = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";

export interface CoolSlideGalleryProps {
  slides: CoolSlideGallerySlide[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  dimOpacity?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  animationDuration?: number;
  showTitle?: boolean;
  titlePosition?: TitlePosition;
  showArrows?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  showBadge?: boolean;
  clickable?: boolean;
  draggable?: boolean;
  dragThreshold?: number;
  keyboardNavigation?: boolean;
  maxVisible?: number;
  depth?: number;
  scaleStep?: number;
  perspective?: number;
  className?: string;
  onSlideChange?: (index: number, slide: CoolSlideGallerySlide) => void;
  onSlideClick?: (index: number, slide: CoolSlideGallerySlide) => void;
}

function getTitleStyles(position: TitlePosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };
  switch (position) {
    case "bottom-left":
      return { ...base, bottom: 0, left: 0, right: 0 };
    case "bottom-right":
      return { ...base, bottom: 0, right: 0, textAlign: "right" };
    case "top-left":
      return { ...base, top: 0, left: 0, right: 0 };
    case "top-right":
      return { ...base, top: 0, right: 0, textAlign: "right" };
    case "center":
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        width: "100%",
      };
    default:
      return { ...base, bottom: 0, left: 0, right: 0 };
  }
}

function getGradientForPosition(position: TitlePosition): string {
  switch (position) {
    case "top-left":
    case "top-right":
      return "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)";
    case "center":
      return "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)";
    case "bottom-left":
    case "bottom-right":
    default:
      return "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)";
  }
}

export const CoolSlideGallery: React.FC<CoolSlideGalleryProps> = ({
  slides,
  cardWidth = 360,
  cardHeight = 440,
  radius = 16,
  tilt = 16,
  sideTilt = 6,
  gap = 7,
  dimOpacity = 50,
  autoplay = false,
  autoplayDelay = 3.5,
  animationDuration = 0.5,
  showTitle = false,
  titlePosition = "bottom-left",
  showArrows = true,
  showDots = true,
  showCounter = true,
  showBadge = true,
  clickable = true,
  draggable = true,
  dragThreshold = 40,
  keyboardNavigation = true,
  maxVisible = 2,
  depth = 220,
  scaleStep = 0.14,
  perspective = 1400,
  className,
  onSlideChange,
  onSlideClick,
}) => {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, Math.max(50, animationDuration * 1000));
  }, [animationDuration]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current || n === 0) return;
      lock();
      setActive((a) => {
        const next = (((a + dir) % n) + n) % n;
        onSlideChange?.(next, slides[next]);
        return next;
      });
    },
    [n, lock, onSlideChange, slides]
  );

  const goTo = useCallback(
    (i: number) => {
      if (lockRef.current || i === active || n === 0) return;
      lock();
      setActive(i);
      onSlideChange?.(i, slides[i]);
    },
    [active, lock, n, onSlideChange, slides]
  );

  useEffect(() => {
    if (!autoplay || n <= 1) return;
    const interval = window.setInterval(() => {
      step(1);
    }, autoplayDelay * 1000);
    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, n, step]);

  useEffect(() => {
    if (!keyboardNavigation) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [keyboardNavigation, step]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) >= dragThreshold) {
      step(delta < 0 ? 1 : -1);
    }
  };

  const effectiveRadius = `${radius}px`;
  const dimValue = Math.min(1, Math.max(0, dimOpacity / 100));

  if (n === 0) return null;

  return (
    <div
      className={cn("relative flex flex-col items-center select-none overflow-hidden py-4", className)}
      style={{ perspective: `${perspective}px` }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D Stage */}
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {slides.map((slide, i) => {
          let rel = i - active;
          if (rel > n / 2) rel -= n;
          if (rel < -n / 2) rel += n;

          const ax = Math.abs(rel);
          const visible = ax <= maxVisible;
          const isActive = rel === 0;
          const sc = Math.max(0.35, 1 - ax * scaleStep);
          const tx = rel * (gap * 30);
          const tz = -ax * depth;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: cardWidth,
                height: cardHeight,
                borderRadius: effectiveRadius,
                overflow: "hidden",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                pointerEvents: visible ? "auto" : "none",
                willChange: "transform, opacity",
                cursor: isActive ? "default" : "pointer",
                boxShadow: isActive ? "0 20px 40px -10px rgba(0,0,0,0.18)" : "0 10px 20px -5px rgba(0,0,0,0.08)",
              }}
              animate={{
                x: `calc(-50% + ${tx}px)`,
                y: "-50%",
                translateZ: tz,
                rotateY: ry,
                rotateZ: rz,
                scale: sc,
                opacity: visible ? 1 : 0,
              }}
              transition={{
                duration: animationDuration,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => {
                if (clickable && !isDragging.current) {
                  if (isActive) {
                    onSlideClick?.(i, slide);
                  } else {
                    goTo(i);
                  }
                }
              }}
            >
              {/* Media image container with full aspect ratio preservation & clean light background */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center p-3">
                <img
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${i + 1}`}
                  draggable={false}
                  className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Title overlay (only if explicitly enabled) */}
              {showTitle && (slide.title || slide.subtitle) && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: getGradientForPosition(titlePosition),
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      ...getTitleStyles(titlePosition),
                      padding: "20px",
                    }}
                  >
                    {slide.badge && showBadge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 bg-white/90 backdrop-blur-md text-neutral-900 border border-neutral-200">
                        {slide.badge}
                      </span>
                    )}
                    {slide.title && (
                      <p className="text-neutral-900 font-bold leading-tight text-base md:text-lg">
                        {slide.title}
                      </p>
                    )}
                    {slide.subtitle && (
                      <p className="text-neutral-500 text-xs font-medium mt-0.5">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Soft light tint on side cards (avoid black) */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  pointerEvents: "none",
                }}
                animate={{ opacity: isActive ? 0 : dimValue * 0.4 }}
                transition={{ duration: animationDuration }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Controls bar */}
      <div className="flex items-center gap-3 mt-8 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm pointer-events-auto">
        {showArrows && (
          <button
            aria-label="Previous slide"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="p-1.5 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {showDots && (
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(i);
                }}
                className={cn(
                  "rounded-full transition-all duration-300",
                  active === i ? "w-6 h-1.5 bg-neutral-900" : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400"
                )}
              />
            ))}
          </div>
        )}

        {showCounter && (
          <span className="text-[11px] font-mono text-neutral-500 px-1">
            {active + 1} / {n}
          </span>
        )}

        {showArrows && (
          <button
            aria-label="Next slide"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="p-1.5 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CoolSlideGallery;
