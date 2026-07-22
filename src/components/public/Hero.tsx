'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/navigation/Navbar';

const BACKGROUND_IMAGES = [
  [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80'
  ]
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const t = useTranslations('hero');

  const [bgIndices, setBgIndices] = useState([0, 0, 0]);
  const [showContent, setShowContent] = useState(false);

  // Background rotators
  useEffect(() => {
    const intervals = [
      setInterval(() => {
        setBgIndices(prev => [1 - prev[0], prev[1], prev[2]]);
      }, 7000),
      setInterval(() => {
        setBgIndices(prev => [prev[0], 1 - prev[1], prev[2]]);
      }, 9500),
      setInterval(() => {
        setBgIndices(prev => [prev[0], prev[1], 1 - prev[2]]);
      }, 8200)
    ];

    return () => intervals.forEach(clearInterval);
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll('.hero-char');
    const tl = gsap.timeline({
      onComplete: () => setShowContent(true)
    });

    // 1. Stagger letters reveal
    tl.fromTo(chars,
      { y: 120, opacity: 0, scale: 0.6 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out', transformOrigin: "50% 100%" }
    );

    // 2. Slow scale-up and subtle background exposure transition
    tl.to(titleRef.current, {
      scale: 1.05,
      duration: 1.8,
      ease: 'power2.out'
    }, '-=0.4');

    // 3. Fade in header navigation and bottom tagline/scroll indicators
    if (headerRef.current && bottomRef.current) {
      tl.fromTo([headerRef.current, bottomRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 },
        '-=1.2'
      );
    }
  }, []);



  return (
    <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-[#0A0E1A] flex flex-col justify-between">
      {/* Background Split Image Columns */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-0.5 opacity-50 z-0">
        {[0, 1, 2].map((colIndex) => (
          <div key={colIndex} className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={bgIndices[colIndex]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKGROUND_IMAGES[colIndex][bgIndices[colIndex]]})` }}
              />
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Radial and Linear Dark Gradients Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/70 via-[#0A0E1A]/45 to-[#0A0E1A] z-5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.06),transparent_60%)] z-5 pointer-events-none" />

      {/* Navigation Header */}
      <Navbar ref={headerRef} className="opacity-0" variant="dark" />

      {/* Center Animated Title */}
      <div className="w-full flex-grow flex flex-col justify-center items-center px-6 z-10 relative">
        <h1 ref={titleRef} className="select-none pointer-events-none flex justify-center w-full">
          <span className="sr-only">CHECK-IN</span>
          <svg 
            viewBox="-15 10 936.82 153" 
            className="w-full max-w-[85vw] md:max-w-[70vw] lg:max-w-4xl h-auto text-white overflow-visible"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            {/* C */}
            <g className="hero-char opacity-0">
              <path d="M55,73.27c18.27,0,24.84,12.13,26.45,19.29l21.77-6.87C99.84,70.78,86.11,50.76,55,50.76c-19.63,0-37.23,10.1-46.53,26.67L26.56,95.54C30.36,80.32,43.29,73.27,55,73.27Z" fill="currentColor" />
              <path d="M82.45,116.23c-2,7.46-9.2,19.44-27.18,19.44-12.81,0-24.82-7.7-28.59-21.37L8.42,132.57c9.21,16.35,26.68,26.19,46.85,26.19,32.15,0,45.89-21.92,49.25-36.24Z" fill="currentColor" />
              <polygon points="5.1,84.63 0,79.53 0,130.44 5.07,125.37 25.46,105" fill="#2ea9be" />
              <path d="M3.75,121.41a.29.29,0,0,0,0-.09V88.77c0-.06,0-.13,0-.19L20.18,105Z" fill="#2ea9be" />
            </g>

            {/* H */}
            <g className="hero-char opacity-0">
              <path d="M199.53,156.58V115.36H158.16v41.22H135.07V52.94h23.09V93.58h41.37V52.94h23.24V156.58Z" fill="currentColor" />
            </g>

            {/* E */}
            <g className="hero-char opacity-0">
              <path d="M259.76,156.58V52.94h65.63V74.72H282.86V94.46h38.59v20.32H282.86v19.88h42.68v21.92Z" fill="currentColor" />
            </g>

            {/* C */}
            <g className="hero-char opacity-0">
              <path d="M407,73.27c18.27,0,24.85,12.13,26.46,19.29l21.77-6.87c-3.36-14.91-17.1-34.93-48.23-34.93-19.62,0-37.22,10.1-46.52,26.67l18.11,18.11C382.34,80.32,395.28,73.27,407,73.27Z" fill="currentColor" />
              <path d="M434.44,116.23c-2.05,7.46-9.21,19.44-27.18,19.44-12.82,0-24.82-7.7-28.59-21.37L360.4,132.57c9.21,16.35,26.69,26.19,46.86,26.19,32.15,0,45.89-21.92,49.25-36.24Z" fill="currentColor" />
              <polygon points="357.09,84.63 351.99,79.53 351.99,130.44 357.06,125.37 377.44,104.98 357.09,84.63" fill="#2ea9be" />
            </g>

            {/* K */}
            <g className="hero-char opacity-0">
              <path d="M521.72,115.8l-11.7,13v27.77H486.93V52.94H510V96.5l37.87-43.56h30.4L537.94,97.82l40.5,58.76h-28.8Z" fill="currentColor" />
            </g>

            {/* - */}
            <g className="hero-char opacity-0">
              <polygon points="627.17,117.49 678.09,117.49 690.82,104.76 678.09,92.03 627.17,92.03 614.44,104.76 627.17,117.49" fill="currentColor" />
            </g>

            {/* I */}
            <g className="hero-char opacity-0">
              <polygon points="762.82,14.76 726.82,50.76 726.82,14.76 762.82,14.76" fill="currentColor" />
              <polygon points="726.82,158.76 762.82,158.76 762.82,50.76 726.82,86.76 726.82,158.76" fill="#2ea9be" />
            </g>

            {/* N */}
            <g className="hero-char opacity-0">
              <polygon points="798.82,86.76 798.82,158.76 834.82,122.76 798.82,86.76" fill="currentColor" />
              <polygon points="906.82,50.76 906.82,122.76 870.82,86.76 906.82,50.76" fill="currentColor" />
              <polygon points="824.28,50.76 798.82,50.76 798.82,76.22 881.37,158.76 906.82,158.76 906.82,133.31 824.28,50.76" fill="#2ea9be" />
            </g>
          </svg>
        </h1>

        {/* Tagline & Call-to-Actions (Visible post-intro) */}
        <div className="max-w-2xl mx-auto text-center mt-6">
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <p className="text-slate-300 text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl leading-relaxed">
                  {t('tagline')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <button className="bg-accent-blue hover:bg-accent-blue/90 text-white font-medium px-8 py-4 rounded-full transition-all shadow-xl shadow-accent-blue/25 hover:scale-[1.02]">
                    {t('explore')}
                  </button>
                  <button className="bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-full transition-all border border-white/10 backdrop-blur-md hover:scale-[1.02]">
                    {t('participate')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Scroll Indicator Section */}
      <div ref={bottomRef} className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-slate-400 text-xs sm:text-sm z-10 relative opacity-0">
        <div>
          <span>© 2026 Check-IN Portugal. Todos os direitos reservados.</span>
        </div>
        <div className="flex flex-col items-center gap-2 select-none cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 animate-pulse">{t('scroll')}</span>
          <ChevronDown className="w-4 h-4 text-accent-blue animate-bounce" />
        </div>
      </div>
    </div>
  );
}
