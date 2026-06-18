"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * CANVAS STAGGERED PHYSICS ENGINE
 * Outward expansion ripple of pixels — smooth, cohesive, responsive.
 * (Engine adapted from the provided pixel-perfect-hero component.)
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number; y: number; color: string; ctx: CanvasRenderingContext2D;
  speed: number; size: number; sizeStep: number; minSize: number;
  maxSizeInt: number; maxSize: number; delay: number; counter: number;
  counterStep: number; isIdle: boolean; isReverse: boolean; isShimmer: boolean;
  draw: () => void; appear: () => void; disappear: () => void; shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number, y: number, color: string, baseSpeed: number, delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const p: Pixel = {
    x, y, color, ctx,
    speed: rand(0.08, 0.4) * baseSpeed,
    size: 0, sizeStep: rand(0.12, 0.28), minSize: 0.5, maxSizeInt: 2,
    maxSize: rand(0.5, 2), delay, counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false, isReverse: false, isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) { p.counter += p.counterStep; return; }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer(); else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false; p.counter = 0;
      if (p.size <= 0) { p.isIdle = true; return; }
      p.size -= 0.1; p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed; else p.size += p.speed;
    },
  };
  return p;
}

function PixelCanvas({ colors, gap = 6, speed = 30 }: { colors: string[]; gap?: number; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || colors.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width), h = Math.floor(height);
    canvas.width = w; canvas.height = h;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2, dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }
    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;
    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();
      if (pixels.every((p) => p.isIdle)) cancelAnimationFrame(animationRef.current);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();
    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);
    animate("appear");
    return () => { resizeObserver.disconnect(); cancelAnimationFrame(animationRef.current); };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * HERO
 * -------------------------------------------------------------------------- */

interface PixelHeroProps {
  word1: string;
  word2: string;
  badge: string;
  description: string;
  primaryLabel: string;
  primaryLabelMobile: string;
  secondaryLabel: string;
  secondaryLabelMobile: string;
  phoneHref: string;
  quoteHref?: string;
  areaLabel: string;
  areas: string[];
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const PIXEL_COLORS = ["#bfe3ff", "#9ecbff", "#7ee2a8", "#ffffff", "#5fa8e6"];

export function PixelHero({
  word1, word2, badge, description,
  primaryLabel, primaryLabelMobile, secondaryLabel, secondaryLabelMobile,
  phoneHref, quoteHref = "#quote", areaLabel, areas,
  onPrimaryClick, onSecondaryClick,
}: PixelHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const loop = [...areas, ...areas];

  return (
    <div
      className="relative w-full min-h-[100dvh] flex flex-col justify-between md:justify-center md:gap-6 py-8 md:py-0 px-3 sm:px-6 overflow-hidden select-none isolate text-white"
      style={{ background: "linear-gradient(140deg,#06203f 0%,#0a4f9e 50%,#0a66c2 100%)" }}
    >
      <style>{`
        .tahoe-glass-text {
          color: transparent;
          background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.45) 25%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0.25) 75%, rgba(255,255,255,1) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.28);
          filter: drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 5px 10px rgba(0,0,0,0.2));
          animation: heroShimmer 8s linear infinite;
        }
        @keyframes heroShimmer { 0% { background-position: 200% center; } 100% { background-position: 0% center; } }
        @media (prefers-reduced-motion: reduce) { .tahoe-glass-text { animation: none; } }
      `}</style>

      {/* Pixel canvas background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PixelCanvas colors={PIXEL_COLORS} gap={6} speed={30} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06203f_115%)] opacity-80 pointer-events-none" />
      </div>

      {/* Headline */}
      <div className="flex flex-col items-center justify-center text-center order-1 mt-24 sm:mt-0 pointer-events-none w-full relative z-10">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide backdrop-blur-md">
          ⭐ {badge}
        </span>
        <h1 className="tahoe-glass-text flex flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6 px-1 w-full flex-wrap text-[2.8rem] xs:text-[3.2rem] sm:text-6xl md:text-8xl lg:text-9xl leading-none">
          <span className="font-serif italic font-medium">{word1}</span>
          <span className="font-sans font-extrabold tracking-tighter">{word2}</span>
        </h1>
      </div>

      {/* Description + CTAs */}
      <div className="flex flex-col items-center justify-center text-center my-auto md:my-0 order-2 px-1 w-full relative z-10">
        <p className="text-sm sm:text-lg md:text-xl font-light text-white/90 max-w-[95%] sm:max-w-md md:max-w-2xl px-1 leading-relaxed">
          {description}
        </p>

        <div
          className={cn(
            "pointer-events-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-8 w-full max-w-md sm:max-w-none transition-all duration-1000 transform",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "350ms" }}
        >
          <a
            href={phoneHref}
            onClick={onPrimaryClick}
            className="animate-pulseglow relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand-green to-brand-green/90 px-8 text-sm font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_12px_24px_rgba(0,0,0,0.2)] ring-1 ring-white/20 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span className="inline sm:hidden">{primaryLabelMobile}</span>
            <span className="hidden sm:inline">{primaryLabel}</span>
          </a>
          <a
            href={quoteHref}
            onClick={onSecondaryClick}
            className="relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand-amber to-brand-amber/90 px-8 text-sm font-bold text-[oklch(0.32_0.08_75)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            🧾
            <span className="inline sm:hidden">{secondaryLabelMobile}</span>
            <span className="hidden sm:inline">{secondaryLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Service-area marquee */}
      <div
        className={cn(
          "w-full z-10 pointer-events-none flex flex-col items-center justify-center gap-3 mt-12 md:mt-0 md:absolute md:bottom-8 md:left-0 md:right-0 order-3 transition-all duration-1000 transform",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: "550ms" }}
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-medium">{areaLabel}</span>
        <div className="relative w-full max-w-4xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="flex w-max gap-3 py-1 animate-marquee">
            {loop.map((a, i) => (
              <span key={i} className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold whitespace-nowrap backdrop-blur-sm">
                📍 {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
