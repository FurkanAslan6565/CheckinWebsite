'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Scroll animation frame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Dynamic global listener configuration
    window.addEventListener('resize', () => {
      lenis.resize();
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div className="lenis-container">{children}</div>;
}
