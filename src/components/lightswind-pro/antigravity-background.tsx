import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AntigravityBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  opacity: number;
}

export const AntigravityBackground: React.FC<AntigravityBackgroundProps> = ({
  particleCount = 55,
  particleColor = "rgba(180, 185, 195, 0.45)",
  lineColor = "rgba(215, 220, 230, 0.25)",
  speed = 0.45,
  interactive = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize particles floating upwards against gravity
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 1,
        baseVx: (Math.random() - 0.5) * speed * 0.4,
        baseVy: -(Math.random() * speed + speed * 0.4), // Anti-gravity: upward drift
        vx: 0,
        vy: 0,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const repelDist = 110;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply anti-gravity upward movement
        p.x += p.baseVx + p.vx;
        p.y += p.baseVy + p.vy;

        // Damping velocity from mouse interaction
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Mouse deflection
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelDist) {
            const force = (1 - dist / repelDist) * 1.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = (1 - dist / 90) * 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [particleCount, particleColor, lineColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none z-0 w-full h-full", className)}
    />
  );
};

export default AntigravityBackground;
