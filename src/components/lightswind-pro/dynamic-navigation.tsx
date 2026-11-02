import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  isPageLink?: boolean;
}

export interface DynamicNavigationProps {
  links: NavLinkItem[];
  currentPage?: "index" | "portfolio";
  className?: string;
  onLinkClick?: (link: NavLinkItem) => void;
  activeLink?: string;
}

export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  links,
  currentPage = "index",
  className,
  onLinkClick,
  activeLink,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(activeLink || (links[0]?.href ?? ""));

  useEffect(() => {
    if (activeLink) {
      setActive(activeLink);
    }
  }, [activeLink]);

  useEffect(() => {
    const updateHighlight = () => {
      if (!navRef.current || !highlightRef.current) return;
      const activeEl = navRef.current.querySelector<HTMLElement>(`[data-nav-href="${active}"]`);
      if (activeEl) {
        highlightRef.current.style.opacity = "1";
        highlightRef.current.style.transform = `translateX(${activeEl.offsetLeft}px)`;
        highlightRef.current.style.width = `${activeEl.offsetWidth}px`;
        highlightRef.current.style.height = `${activeEl.offsetHeight}px`;
      } else {
        highlightRef.current.style.opacity = "0";
      }
    };

    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [active, links]);

  const handleItemClick = (e: React.MouseEvent, link: NavLinkItem) => {
    if (!link.isPageLink && link.href.startsWith("#")) {
      setActive(link.href);
    }
    if (onLinkClick) {
      onLinkClick(link);
    }
  };

  return (
    <nav className={cn("fixed top-4 inset-x-0 z-50 flex items-center justify-center px-3 md:px-6 pointer-events-none", className)}>
      <div
        ref={navRef}
        className="pointer-events-auto relative flex items-center gap-1 sm:gap-2 p-1.5 md:p-2 rounded-full bg-white/92 backdrop-blur-md border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all max-w-full overflow-x-auto no-scrollbar"
      >
        {/* Brand Logo & Name */}
        <a
          href="index.html"
          className="flex items-center gap-2 pl-2 pr-3 py-1 mr-1 border-r border-neutral-200 shrink-0 group select-none"
        >
          <img
            src="assets/images/global/LogoVickyLive_01.png"
            alt="VickyLive Logo"
            className="w-6 h-6 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-xs tracking-tight text-neutral-900 hidden sm:inline-block">
            VickyLive
          </span>
        </a>

        {/* Dynamic sliding highlight pill */}
        <div
          ref={highlightRef}
          className="absolute top-1.5 md:top-2 left-0 rounded-full bg-neutral-900 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none z-0"
          style={{ opacity: 0 }}
        />

        {/* Navigation Links */}
        <div className="flex items-center gap-1 shrink-0">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                data-nav-href={link.href}
                onClick={(e) => handleItemClick(e, link)}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 select-none whitespace-nowrap",
                  isActive
                    ? "text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                {link.icon && <span className="text-xs">{link.icon}</span>}
                <span>{link.name}</span>
                {link.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase",
                      isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* Dedicated Page Switcher Button */}
        <div className="pl-1 sm:pl-2 shrink-0">
          {currentPage === "index" ? (
            <a
              href="portfolio.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900 text-xs font-bold transition-all"
            >
              <span>Visual Archive &amp; Systems</span>
              <span className="text-[10px] font-mono">&rarr;</span>
            </a>
          ) : (
            <a
              href="index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900 text-xs font-bold transition-all"
            >
              <span className="text-[10px] font-mono">&larr;</span>
              <span>The Architect</span>
            </a>
          )}
        </div>

      </div>
    </nav>
  );
};

export default DynamicNavigation;
