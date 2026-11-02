import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';

export interface SliderItemData {
  title: string;
  num: string;
  imageUrl: string;
  category?: string;
  spec?: string;
  data?: any;
}

export interface ThreeDSliderProps {
  items: SliderItemData[];
  speedWheel?: number;
  speedDrag?: number;
  containerStyle?: CSSProperties;
  onItemClick?: (item: SliderItemData, index: number) => void;
}

interface SliderItemProps {
  item: SliderItemData;
  index: number;
  onClick: () => void;
}

const SliderItem = React.forwardRef<HTMLDivElement, SliderItemProps>(({ item, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-1/2 left-1/2 cursor-pointer select-none rounded-2xl 
        shadow-[0_20px_50px_rgba(0,0,0,0.18)] bg-neutral-900 origin-[0%_100%] pointer-events-auto
        w-[var(--width)] h-[var(--height)]
        -mt-[calc(var(--height)/2)] -ml-[calc(var(--width)/2)]
        overflow-hidden will-change-transform border border-neutral-700/80"
      style={
        {
          '--width': 'clamp(260px, 34vw, 380px)',
          '--height': 'clamp(340px, 44vw, 500px)',
          transition: 'none',
          display: 'block',
        } as CSSProperties & { [key: string]: any }
      }
      onClick={onClick}
    >
      <div
        className="slider-item-content absolute inset-0 z-10 transition-opacity duration-300 ease-out will-change-opacity flex flex-col justify-between p-5 bg-neutral-950/70"
        style={{ opacity: 1 }}
      >
        {/* Header number & category badge */}
        <div className="relative z-10 flex items-start justify-between">
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-white tracking-tighter drop-shadow-md">
            {item.num}
          </span>
          {item.category && (
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/20 text-neutral-100 border border-white/20 backdrop-blur-md shadow-sm">
              {item.category}
            </span>
          )}
        </div>

        {/* Central Display: Uncropped Image with Original Aspect Ratio */}
        <div className="absolute inset-0 flex items-center justify-center p-6 z-0 bg-neutral-950">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-lg"
            loading="lazy"
            decoding="async"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/50 pointer-events-none" />
        </div>

        {/* Footer Title & Specification Details */}
        <div className="relative z-10 pt-2">
          <h4 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md">
            {item.title}
          </h4>
          {item.spec && (
            <p className="text-[11px] font-mono text-neutral-300 mt-1">
              SPEC // {item.spec}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

SliderItem.displayName = 'SliderItem';

export const ThreeDSlider: React.FC<ThreeDSliderProps> = ({
  items,
  speedWheel = 0.05,
  speedDrag = -0.15,
  containerStyle = {},
  onItemClick,
}) => {
  const progressRef = useRef(50);
  const targetProgressRef = useRef(50);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cacheRef = useRef<Record<number, { transform: string; zIndex: string; opacity: string }>>({});

  const numItems = items.length;

  const update = useCallback(() => {
    if (!itemRefs.current.length) return;

    progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;
    const progress = progressRef.current;
    const clamped = Math.max(0, Math.min(progress, 100));
    const activeFloat = (clamped / 100) * (numItems - 1);

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const denominator = numItems > 1 ? numItems - 1 : 1;
      const ratio = (index - activeFloat) / denominator;

      const tx = ratio * 720;
      const ty = ratio * 160;
      const rot = ratio * 105;

      const dist = Math.abs(index - activeFloat);
      const z = numItems - dist;
      const opacity = (z / numItems) * 3 - 2;

      const newTransform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
      const newZIndex = Math.round(z * 10).toString();
      const newOpacity = Math.max(0, Math.min(1, opacity)).toString();

      if (!cacheRef.current[index]) {
        cacheRef.current[index] = { transform: '', zIndex: '', opacity: '' };
      }

      const cache = cacheRef.current[index];

      if (cache.transform !== newTransform) {
        el.style.transform = newTransform;
        cache.transform = newTransform;
      }
      if (cache.zIndex !== newZIndex) {
        el.style.zIndex = newZIndex;
        cache.zIndex = newZIndex;
      }

      const inner = el.querySelector('.slider-item-content') as HTMLElement;
      if (inner && cache.opacity !== newOpacity) {
        inner.style.opacity = newOpacity;
        cache.opacity = newOpacity;
      }
    });
  }, [numItems]);

  useEffect(() => {
    let active = true;
    const loop = () => {
      if (active) {
        update();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const wheelProgress = e.deltaY * speedWheel;
      const current = targetProgressRef.current;
      const next = current + wheelProgress;

      if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) {
        return;
      }

      e.preventDefault();
      targetProgressRef.current = Math.max(0, Math.min(100, next));
    },
    [speedWheel]
  );

  const getClientX = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) return e.touches[0].clientX;
    return (e as MouseEvent).clientX;
  };

  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    isDownRef.current = true;
    const x = getClientX(e);
    if (x !== undefined) startXRef.current = x;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDownRef.current) return;
      const x = getClientX(e);
      if (x === undefined) return;

      const diff = (x - startXRef.current) * speedDrag;
      const current = targetProgressRef.current;
      targetProgressRef.current = Math.max(0, Math.min(100, current + diff));
      startXRef.current = x;
    },
    [speedDrag]
  );

  const handleMouseUp = useCallback(() => {
    isDownRef.current = false;
  }, []);

  const handleClick = useCallback(
    (item: SliderItemData, index: number) => {
      const denominator = numItems > 1 ? numItems - 1 : 1;
      targetProgressRef.current = (index / denominator) * 100;
      if (onItemClick) onItemClick(item, index);
    },
    [numItems, onItemClick]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelOpts = { passive: false };
    container.addEventListener('wheel', handleWheel, wheelOpts);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown, { passive: true });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleMouseDown);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[680px] overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800"
      style={containerStyle}
    >
      {/* 3D Cards Stage */}
      <div className="relative z-10 h-full overflow-hidden pointer-events-none scale-[0.8] md:scale-[0.88] w-full">
        {items.map((item, index) => (
          <SliderItem
            key={`slider-item-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            item={item}
            index={index}
            onClick={() => handleClick(item, index)}
          />
        ))}
      </div>

      {/* Subtle Architectural Overlay Grid lines */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-8 py-6">
        <div className="flex flex-col justify-between">
          <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            3D TOPOLOGY // DRAG OR SCROLL TO ROTATE
          </div>
          <div className="text-[10px] font-mono text-neutral-400">
            ASSET STAGE // {items.length} MODELS &amp; WIREFRAMES
          </div>
        </div>
        <div className="text-right flex flex-col justify-between">
          <span className="text-[11px] font-mono text-neutral-400">
            UNCROPPED MESH ACCURACY
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            CALIBRATED PBR &amp; WIREFRAME
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSlider;
