"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Compass } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  currentPage?: "index" | "portfolio";
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

export function SpotlightNavbar({
  items = [
    { label: "Overview", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Competencies", href: "#competencies" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Leadership", href: "#leadership" },
    { label: "Contact", href: "#contact" },
  ],
  currentPage = "index",
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  // Mouse move handler for spotlight effect
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 220,
          damping: 22,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  // Ambience indicator tracking active item
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 220,
        damping: 22,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  // Scroll spy to update active item based on current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      items.forEach((item, idx) => {
        if (!item.href.startsWith("#")) return;
        const section = document.querySelector(item.href);
        if (section) {
          const top = (section as HTMLElement).offsetTop;
          const height = (section as HTMLElement).offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveIndex(idx);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleLinkClick = (item: NavItem, idx: number, e: React.MouseEvent) => {
    setActiveIndex(idx);
    setMobileMenuOpen(false);
    onItemClick?.(item, idx);

    if (item.href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={cn("fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none", className)}>
      <div className="pointer-events-auto flex items-center gap-2 max-w-7xl w-full justify-between sm:justify-center">
        
        {/* Main Navbar Pill */}
        <nav
          ref={navRef}
          style={
            {
              "--spotlight-x": "0px",
              "--ambience-x": "0px",
              "--spotlight-color": "rgba(0, 0, 0, 0.06)",
              "--ambience-color": "rgba(23, 23, 23, 0.9)",
            } as React.CSSProperties
          }
          className={cn(
            "relative flex items-center h-12 md:h-14 px-2 md:px-3 rounded-full",
            "bg-white/92 backdrop-blur-md border border-neutral-200/90",
            "shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300"
          )}
        >
          {/* Logo & Identity */}
          <a
            href="index.html"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 mr-1 border-r border-neutral-200/80 group shrink-0"
            title="Vigneshwaran Pugazhenthi"
          >
            <img
              src="assets/images/global/LogoVickyLive_01.png"
              alt="VP Logo"
              className="w-6 h-6 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight text-neutral-900 leading-none whitespace-nowrap">
                Vigneshwaran Pugazhenthi
              </span>
              <span className="text-[9px] font-mono text-neutral-400 leading-tight hidden md:inline">
                Principal R&amp;D Technologist
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <ul className="hidden lg:flex items-center h-full gap-0.5 z-10">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <li key={idx} className="relative h-full flex items-center">
                  <a
                    href={item.href}
                    data-index={idx}
                    onClick={(e) => handleLinkClick(item, idx, e)}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 flex items-center gap-1.5",
                      isActive
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase",
                          isActive
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Page Switcher Button */}
          <div className="pl-1 sm:pl-2 shrink-0 z-10 flex items-center">
            {currentPage === "index" ? (
              <a
                href="portfolio.html"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm group"
              >
                <Compass className="w-3.5 h-3.5 text-neutral-300 group-hover:rotate-45 transition-transform" />
                <span>Visual Archive</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <a
                href="index.html"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm group"
              >
                <span>The Architect</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>

          {/* Moving Spotlight (Follows Mouse) */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
            style={{
              opacity: hoverX !== null ? 1 : 0,
              background: `radial-gradient(120px circle at var(--spotlight-x) 100%, var(--spotlight-color) 0%, transparent 70%)`,
            }}
          />

          {/* Active State Ambience Line (Under Active Item) */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-0"
            style={{
              background: `radial-gradient(60px circle at var(--ambience-x) 0%, var(--ambience-color) 0%, transparent 100%)`,
            }}
          />
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-full bg-white/92 backdrop-blur-md border border-neutral-200 text-neutral-800 shadow-sm hover:bg-neutral-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-3xl p-5 shadow-2xl lg:hidden flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <img
                src="assets/images/global/LogoVickyLive_01.png"
                alt="VP Logo"
                className="w-5 h-5 object-contain"
              />
              <span className="font-bold text-xs text-neutral-900">
                Vigneshwaran Pugazhenthi
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              Navigation
            </span>
          </div>

          <div className="flex flex-col gap-1 py-1">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => handleLinkClick(item, idx, e)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors",
                  activeIndex === idx
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-mono px-2 py-0.5 rounded-full uppercase",
                      activeIndex === idx ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            {currentPage === "index" ? (
              <a
                href="portfolio.html"
                className="w-full text-center py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Go to Visual Archive &amp; Systems &rarr;
              </a>
            ) : (
              <a
                href="index.html"
                className="w-full text-center py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Go to The Architect (Main Page) &rarr;
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default SpotlightNavbar;
