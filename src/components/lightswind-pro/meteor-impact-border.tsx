import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface MeteorImpactBorderProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: string;
  meteorColor?: string;
  glowColor?: string;
  impactScale?: number;
}

export const MeteorImpactBorder: React.FC<MeteorImpactBorderProps> = ({
  children,
  className,
  duration = 6,
  borderWidth = 1.5,
  borderRadius = "1.5rem",
  meteorColor = "rgba(23, 23, 23, 0.75)",
  glowColor = "rgba(37, 99, 235, 0.25)",
}) => {
  return (
    <div
      className={cn("relative p-[1.5px] overflow-hidden group", className)}
      style={
        {
          borderRadius,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--meteor-color": meteorColor,
          "--glow-color": glowColor,
        } as CSSProperties
      }
    >
      {/* Animated rotating conical beam simulation */}
      <div
        className="absolute -inset-[100%] animate-[spin_var(--duration)_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${meteorColor} 340deg, #ffffff 360deg)`,
        }}
      />

      {/* Subtle impact corner glow */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 12px ${glowColor}`,
        }}
      />

      {/* Internal Content Container */}
      <div
        className="relative z-10 w-full h-full bg-white rounded-[inherit] overflow-hidden"
        style={{ borderRadius: `calc(${borderRadius} - 1.5px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default MeteorImpactBorder;
