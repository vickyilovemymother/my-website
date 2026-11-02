import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  LucideIcon,
  Search,
  X,
  Cpu,
  Layers,
  Sparkles,
  Workflow,
  Glasses,
  Box,
  Palette,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChainItem {
  id: string | number;
  name: string;
  icon?: LucideIcon;
  details?: string;
  logo?: string;
  category?: string;
}

interface AnimatedChainItem extends ChainItem {
  distanceFromCenter: number;
  originalIndex: number;
}

interface CarouselItemProps {
  chain: AnimatedChainItem;
  side: 'left' | 'right';
  onClick?: () => void;
}

const CarouselItemCard: React.FC<CarouselItemProps> = ({ chain, side, onClick }) => {
  const isCenter = chain.distanceFromCenter === 0;
  const absDistance = Math.abs(chain.distanceFromCenter);

  const yOffset = chain.distanceFromCenter * 68;
  const scale = Math.max(0.72, 1 - absDistance * 0.12);
  const opacity = Math.max(0.25, 1 - absDistance * 0.28);
  const xOffset = side === 'left' ? -absDistance * 14 : absDistance * 14;

  const IconComp = chain.icon || Box;

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "absolute flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer select-none",
        isCenter
          ? "bg-neutral-900 text-white border-neutral-900 shadow-lg z-20"
          : "bg-white/80 text-neutral-700 border-neutral-200/80 hover:bg-neutral-50 z-10"
      )}
      animate={{
        y: yOffset,
        x: xOffset,
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      style={{
        width: '260px',
      }}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          isCenter ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-800"
        )}
      >
        {chain.logo ? (
          <img src={chain.logo} alt={chain.name} className="w-5 h-5 object-contain" />
        ) : (
          <IconComp className="w-4 h-4" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className={cn("text-xs font-semibold truncate", isCenter ? "text-white" : "text-neutral-900")}>
          {chain.name}
        </span>
        {chain.details && (
          <span className={cn("text-[11px] truncate", isCenter ? "text-neutral-300" : "text-neutral-500")}>
            {chain.details}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export interface ChainCarouselProps {
  items?: ChainItem[];
  scrollSpeedMs?: number;
  visibleItemCount?: number;
  className?: string;
  onItemSelect?: (item: ChainItem) => void;
  title?: string;
  subtitle?: string;
}

const defaultChainItems: ChainItem[] = [
  { id: 'clo3d', name: 'CLO3D Fashion CAD', icon: Layers, details: 'Cloth Physics & Drape Simulation', category: '3D Fashion' },
  { id: 'blender', name: 'Blender 3D Suite', icon: Box, details: 'Topology, Geometry Nodes & Cycles', category: 'Pipeline' },
  { id: 'threejs', name: 'Three.js WebGL', icon: Sparkles, details: 'Real-Time 3D Configurator Engine', category: 'Web3D' },
  { id: 'python', name: 'Python Automation', icon: Workflow, details: 'Headless Batch RPA Microservices', category: 'Automation' },
  { id: 'avataar', name: 'Avataar AI Platform', icon: Cpu, details: 'Spatial Computing & Neural Shaders', category: 'AI Tech' },
  { id: 'marvelous', name: 'Marvelous Designer', icon: Palette, details: 'Dynamic Garment Simulation', category: '3D Fashion' },
  { id: 'generative', name: 'Generative Diffusion', icon: Bot, details: 'Virtual Photoshoots & Inpainting', category: 'GenAI' },
  { id: 'spatial', name: 'AR/VR Spatial Systems', icon: Glasses, details: 'WebXR, USDZ & Mobile Discovery', category: 'Spatial' },
];

export const ChainCarousel: React.FC<ChainCarouselProps> = ({
  items = defaultChainItems,
  scrollSpeedMs = 2800,
  visibleItemCount = 5,
  className,
  onItemSelect,
  title = "Core Technical Ecosystem",
  subtitle = "Hover to pause, search to inspect verified pipeline toolchains",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused || !isInView || items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, scrollSpeedMs);
    return () => clearInterval(timer);
  }, [isPaused, isInView, items.length, scrollSpeedMs]);

  const currentItem = items[currentIndex];

  const getVisibleItems = useCallback((): AnimatedChainItem[] => {
    if (items.length === 0) return [];
    const count = visibleItemCount;
    const half = Math.floor(count / 2);
    const visible: AnimatedChainItem[] = [];

    for (let offset = -half; offset <= half; offset++) {
      const idx = (currentIndex + offset + items.length * 10) % items.length;
      visible.push({
        ...items[idx],
        distanceFromCenter: offset,
        originalIndex: idx,
      });
    }
    return visible;
  }, [currentIndex, items, visibleItemCount]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return [];
    return items.filter((i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.details && i.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  const handleSelectChain = (id: string | number) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      if (onItemSelect) onItemSelect(items[idx]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const visibleItems = getVisibleItems();

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full py-12 px-4 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 overflow-hidden",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10 max-w-xl">
          <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
            Ecosystem Pipeline
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            {subtitle}
          </p>
        </div>

        {/* Carousel Grid */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[420px]">
          {/* Left Arc */}
          <div
            className="relative hidden lg:flex items-center justify-center h-[380px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {visibleItems.map((item) => (
              <CarouselItemCard
                key={`left-${item.id}-${item.originalIndex}`}
                chain={item}
                side="left"
                onClick={() => handleSelectChain(item.id)}
              />
            ))}
          </div>

          {/* Center Stage & Spotlight Card */}
          <div className="flex flex-col items-center text-center px-4 z-20">
            {currentItem && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm p-6 rounded-2xl bg-white border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-4 shadow-sm">
                  {currentItem.icon ? (
                    <currentItem.icon className="w-7 h-7" />
                  ) : (
                    <Box className="w-7 h-7" />
                  )}
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  {currentItem.category || "Architecture"}
                </span>

                <h4 className="text-lg font-bold text-neutral-900 mb-1">
                  {currentItem.name}
                </h4>

                <p className="text-xs text-neutral-600 text-center leading-relaxed">
                  {currentItem.details}
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-100 w-full flex items-center justify-between text-xs text-neutral-600 font-mono">
                  <span>INDEX // {String(currentIndex + 1).padStart(2, '0')}</span>
                  <span>TOTAL // {String(items.length).padStart(2, '0')}</span>
                </div>
              </motion.div>
            )}

            {/* Search Input */}
            <div className="mt-6 relative w-full max-w-xs">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-neutral-600 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Filter toolchain..."
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    setShowDropdown(val.length > 0);
                    if (val === '') setIsPaused(false);
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowDropdown(true);
                    setIsPaused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-600 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setShowDropdown(false);
                      setIsPaused(false);
                    }}
                    className="absolute right-3 text-neutral-600 hover:text-neutral-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && filteredItems.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 p-1 bg-white rounded-xl border border-neutral-200 shadow-xl z-30 max-h-48 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectChain(item.id);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      {item.icon && <item.icon className="w-4 h-4 text-neutral-700" />}
                      <span className="text-xs font-medium text-neutral-900">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Arc */}
          <div
            className="relative hidden lg:flex items-center justify-center h-[380px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {visibleItems.map((item) => (
              <CarouselItemCard
                key={`right-${item.id}-${item.originalIndex}`}
                chain={item}
                side="right"
                onClick={() => handleSelectChain(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainCarousel;
