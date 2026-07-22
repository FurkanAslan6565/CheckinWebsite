'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import type { Partner as DbPartner } from '@prisma/client';

interface PartnersLogoWallProps {
  partners?: DbPartner[];
}

interface LogoItem {
  name: string;
  logoUrl?: string;
  x: string;
  y: string;
  shadow: string;
  border: string;
  floatDelay: number;
}

// 8 Left floating brand logos with coordinates matching the screenshot
const LEFT_LOGOS: LogoItem[] = [
  {
    name: 'Kubernetes',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    x: '45%',
    y: '8%',
    shadow: 'shadow-blue-500/10 hover:shadow-blue-500/20',
    border: 'border-blue-100/50',
    floatDelay: 0
  },
  {
    name: 'TensorFlow',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    x: '15%',
    y: '22%',
    shadow: 'shadow-orange-500/10 hover:shadow-orange-500/20',
    border: 'border-orange-100/50',
    floatDelay: 1.2
  },
  {
    name: 'Figma',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    x: '65%',
    y: '24%',
    shadow: 'shadow-purple-500/10 hover:shadow-purple-500/20',
    border: 'border-purple-100/50',
    floatDelay: 0.6
  },
  {
    name: 'Docker',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    x: '48%',
    y: '42%',
    shadow: 'shadow-sky-500/10 hover:shadow-sky-500/20',
    border: 'border-sky-100/50',
    floatDelay: 2.0
  },
  {
    name: 'C',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    x: '8%',
    y: '48%',
    shadow: 'shadow-blue-500/10 hover:shadow-blue-500/20',
    border: 'border-blue-100/50',
    floatDelay: 1.5
  },
  {
    name: 'Git',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    x: '20%',
    y: '62%',
    shadow: 'shadow-red-500/10 hover:shadow-red-500/20',
    border: 'border-red-100/50',
    floatDelay: 0.8
  },
  {
    name: 'Vue',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    x: '75%',
    y: '66%',
    shadow: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
    border: 'border-emerald-100/50',
    floatDelay: 2.4
  },
  {
    name: 'Postgres',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    x: '42%',
    y: '82%',
    shadow: 'shadow-indigo-500/10 hover:shadow-indigo-500/20',
    border: 'border-indigo-100/50',
    floatDelay: 1.0
  }
];

// 7 Right floating brand logos with coordinates matching the screenshot
const RIGHT_LOGOS: LogoItem[] = [
  {
    name: 'Python',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    x: '45%',
    y: '10%',
    shadow: 'shadow-yellow-500/10 hover:shadow-yellow-500/20',
    border: 'border-yellow-100/50',
    floatDelay: 0.4
  },
  {
    name: 'Github',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    x: '75%',
    y: '22%',
    shadow: 'shadow-slate-500/10 hover:shadow-slate-500/20',
    border: 'border-slate-100/50',
    floatDelay: 1.8
  },
  {
    name: 'Kotlin',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    x: '25%',
    y: '26%',
    shadow: 'shadow-purple-500/10 hover:shadow-purple-500/20',
    border: 'border-purple-100/50',
    floatDelay: 1.0
  },
  {
    name: '.NET',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
    x: '35%',
    y: '44%',
    shadow: 'shadow-indigo-500/10 hover:shadow-indigo-500/20',
    border: 'border-indigo-100/50',
    floatDelay: 2.2
  },
  {
    name: 'Redis',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    x: '80%',
    y: '48%',
    shadow: 'shadow-red-500/10 hover:shadow-red-500/20',
    border: 'border-red-100/50',
    floatDelay: 0.5
  },
  {
    name: 'Stripe',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg',
    x: '50%',
    y: '65%',
    shadow: 'shadow-blue-500/10 hover:shadow-blue-500/20',
    border: 'border-blue-100/50',
    floatDelay: 1.6
  },
  {
    name: 'Django',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    x: '30%',
    y: '80%',
    shadow: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
    border: 'border-emerald-100/50',
    floatDelay: 0.9
  }
];

// Staggered pattern for the background grid (indices of cells that will be filled)
const GRID_CELLS_LEFT = [3, 8, 14, 22, 28, 35, 41, 47, 52];
const GRID_CELLS_RIGHT = [5, 11, 19, 23, 31, 38, 44, 50, 56];

function FloatingLogoCard({ name, logoUrl, x, y, shadow, border, floatDelay }: LogoItem) {
  const [imgError, setImgError] = React.useState(false);

  const initials = React.useMemo(() => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }, [name]);

  return (
    <motion.div
      style={{ left: x, top: y }}
      animate={{ y: [0, -5, 0] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay
      }}
      whileHover={{ scale: 1.1, zIndex: 30 }}
      className={`absolute w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border ${border} flex items-center justify-center p-3 sm:p-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-accent-blue/30 transition-all duration-300 ease-out cursor-pointer group`}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm bg-gradient-to-tr from-accent-blue/5 to-transparent ${shadow}`} />
      
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300 relative z-10"
        />
      ) : (
        <span className="font-heading font-black text-sm text-slate-700 relative z-10">
          {initials}
        </span>
      )}
    </motion.div>
  );
}

export default function PartnersLogoWall({ partners: dbPartners }: PartnersLogoWallProps) {
  const t = useTranslations('partnersLogoWall');
  const locale = useLocale();

  // Distribute database partners to left and right lists dynamically
  const leftLogos = React.useMemo(() => {
    const base = [...LEFT_LOGOS];
    if (dbPartners && dbPartners.length > 0) {
      dbPartners.forEach((dbP, idx) => {
        if (idx % 2 === 0 && Math.floor(idx / 2) < base.length) {
          base[Math.floor(idx / 2)] = {
            ...base[Math.floor(idx / 2)],
            name: dbP.name,
            logoUrl: dbP.logoUrl || undefined
          };
        }
      });
    }
    return base;
  }, [dbPartners]);

  const rightLogos = React.useMemo(() => {
    const base = [...RIGHT_LOGOS];
    if (dbPartners && dbPartners.length > 0) {
      dbPartners.forEach((dbP, idx) => {
        if (idx % 2 !== 0 && Math.floor((idx - 1) / 2) < base.length) {
          base[Math.floor((idx - 1) / 2)] = {
            ...base[Math.floor((idx - 1) / 2)],
            name: dbP.name,
            logoUrl: dbP.logoUrl || undefined
          };
        }
      });
    }
    return base;
  }, [dbPartners]);

  // Combined logos list for mobile layout
  const mobileLogos = React.useMemo(() => {
    return [...leftLogos, ...rightLogos];
  }, [leftLogos, rightLogos]);

  return (
    <section className="py-24 bg-white overflow-hidden border-b border-slate-100 relative w-full flex items-center min-h-[620px]">
      
      {/* Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="max-w-[1440px] mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ================= LEFT MOSAIC GRID (Desktop Only) ================= */}
        <div className="hidden lg:block lg:col-span-3 h-[520px] relative">
          
          {/* Mosaic Cell Grid Background */}
          <div className="grid grid-cols-5 gap-4 absolute inset-0 opacity-[0.25] select-none pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={`grid-l-${i}`}
                className={`w-full aspect-square rounded-lg border border-slate-200 transition-colors duration-300 ${
                  GRID_CELLS_LEFT.includes(i) ? 'bg-slate-100' : ''
                }`}
              />
            ))}
          </div>

          {/* Floating Logo Cards */}
          {leftLogos.map((logo, idx) => (
            <FloatingLogoCard key={`left-logo-${idx}`} {...logo} />
          ))}

        </div>

        {/* ================= CENTER HEADING & STATS ================= */}
        <div className="col-span-12 lg:col-span-6 text-center space-y-10 px-4 max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Badge Label */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-accent-blue/10 text-accent-blue uppercase border border-accent-blue/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
            {t('label')}
          </span>

          {/* Big Premium Header */}
          <h2 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            {t('title')}
          </h2>

          {/* Elegant Description */}
          <p className="text-slate-500 text-sm sm:text-base md:text-lg font-light leading-relaxed">
            {t('desc')}
          </p>

          {/* GitHub-style stats row */}
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 pt-6 border-t border-slate-100 w-full">
            
            {/* Stat 1 */}
            <div className="text-center">
              <span className="font-heading font-black text-slate-900 text-3xl sm:text-4xl lg:text-5xl tracking-tight block">
                15+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                {locale === 'tr' ? 'Yıllık Deneyim' : 'Anos de Experiência'}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <span className="font-heading font-black text-slate-900 text-3xl sm:text-4xl lg:text-5xl tracking-tight block">
                5000+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                {locale === 'tr' ? 'Aktif Katılımcı' : 'Participantes'}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <span className="font-heading font-black text-slate-900 text-3xl sm:text-4xl lg:text-5xl tracking-tight block">
                100+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                {locale === 'tr' ? 'Küresel Ortak' : 'Parceiros Globais'}
              </span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT MOSAIC GRID (Desktop Only) ================= */}
        <div className="hidden lg:block lg:col-span-3 h-[520px] relative">
          
          {/* Mosaic Cell Grid Background */}
          <div className="grid grid-cols-5 gap-4 absolute inset-0 opacity-[0.25] select-none pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={`grid-r-${i}`}
                className={`w-full aspect-square rounded-lg border border-slate-200 transition-colors duration-300 ${
                  GRID_CELLS_RIGHT.includes(i) ? 'bg-slate-100' : ''
                }`}
              />
            ))}
          </div>

          {/* Floating Logo Cards */}
          {rightLogos.map((logo, idx) => (
            <FloatingLogoCard key={`right-logo-${idx}`} {...logo} />
          ))}

        </div>

        {/* ================= MOBILE LOGO GRID ================= */}
        <div className="col-span-12 lg:hidden w-full mt-10">
          <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 relative inline-block">
              {locale === 'tr' ? 'Uluslararası Ortaklar Ağımız' : 'Rede de Parceiros Internacionais'}
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-accent-blue/20 rounded-full" />
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 justify-items-center">
            {mobileLogos.map((logo, idx) => (
              <motion.div
                key={`mobile-logo-${idx}`}
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-3 shadow-md shadow-slate-100/50"
              >
                {logo.logoUrl ? (
                  <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain filter" />
                ) : (
                  <span className="font-heading font-bold text-xs text-slate-600">
                    {logo.name.slice(0,2).toUpperCase()}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
