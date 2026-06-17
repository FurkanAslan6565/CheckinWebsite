'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';

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
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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
      { y: 150, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out' }
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

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
      <header ref={headerRef} className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative opacity-0">
        <Link href="/" className="h-8 md:h-10 relative flex items-center shrink-0">
          <img src="/Logos/Check-IN/SVG/Check-IN_Logotipo_Branco.svg" alt="Check-IN Logo" className="h-full w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#projetos" className="hover:text-white transition-colors">{tNav('projects')}</a>
          <a href="#oportunidades" className="hover:text-white transition-colors">{tNav('opportunities')}</a>
          <a href="#novidades" className="hover:text-white transition-colors">{tNav('news')}</a>
          <a href="#sobre-nos" className="hover:text-white transition-colors">{tNav('about')}</a>
          <a href="#contacto" className="hover:text-white transition-colors">{tNav('contact')}</a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <select 
            value={locale}
            onChange={handleLanguageChange}
            className="bg-slate-900/80 border border-slate-800 text-white font-semibold text-xs px-3 py-2 rounded-full cursor-pointer hover:border-accent-blue transition-colors focus:outline-none"
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="tr">TR</option>
          </select>
          <button className="bg-accent-blue hover:bg-accent-blue/90 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-all shadow-lg shadow-accent-blue/20">
            {tNav('login')}
          </button>
        </div>
      </header>

      {/* Center Animated Title */}
      <div className="w-full flex-grow flex flex-col justify-center items-center px-6 z-10 relative">
        <h1 ref={titleRef} className="font-heading font-black text-white select-none pointer-events-none tracking-tighter text-center">
          <span className="flex justify-center flex-wrap gap-x-6 text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
            {"CHECK-IN".split("").map((char, index) => (
              <span 
                key={index} 
                className="hero-char inline-block origin-bottom opacity-0"
              >
                {char}
              </span>
            ))}
          </span>
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
