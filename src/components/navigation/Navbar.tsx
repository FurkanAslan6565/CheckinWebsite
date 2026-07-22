'use client';

import React, { forwardRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarProps {
  variant?: 'dark' | 'light';
  className?: string;
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(({ variant = 'dark', className }, ref) => {
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  const isHomepage = pathname === '/';
  const isDark = true; // Force dark theme styling (white logo, white links) on all pages

  return (
    <header
      ref={ref}
      className={cn(
        'w-full transition-all duration-300 z-50',
        isHomepage
          ? 'max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative bg-transparent'
          : 'sticky top-0 bg-[#0A0E1A] border-b border-slate-900 px-6 py-4 flex justify-between items-center shadow-md',
        className
      )}
    >
      <div className={cn('flex justify-between items-center w-full', !isHomepage && 'max-w-7xl mx-auto')}>
        {/* Logo */}
        <Link href="/" className="h-8 md:h-10 relative flex items-center shrink-0">
          <img
            src="/Logos/Check-IN/SVG/Check-IN_Logotipo_Branco.svg"
            alt="Check-IN Logo"
            className="h-full w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/projects"
            className={cn(
              'transition-colors font-semibold',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('projects')}
          </Link>
          <Link
            href="/#oportunidades"
            className={cn(
              'transition-colors',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('opportunities')}
          </Link>
          <Link
            href="/#novidades"
            className={cn(
              'transition-colors',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('news')}
          </Link>
          <Link
            href="/about"
            className={cn(
              'transition-colors font-semibold',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('about')}
          </Link>
          <Link
            href="/gonulluler-nerede"
            className={cn(
              'transition-colors',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('volunteers')}
          </Link>
          <Link
            href="/contacto"
            className={cn(
              'transition-colors',
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-accent-blue'
            )}
          >
            {tNav('contact')}
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <select
            value={locale}
            onChange={handleLanguageChange}
            className={cn(
              'border text-white font-semibold text-xs px-3 py-2 rounded-full cursor-pointer transition-colors focus:outline-none',
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-white hover:border-accent-blue'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-accent-blue'
            )}
          >
            <option value="pt">PT</option>
            <option value="tr">TR</option>
          </select>
          
          {/* Admin panel link */}
          <NextLink
            href="/admin"
            className={cn(
              'font-medium text-sm px-5 py-2.5 rounded-full transition-all shadow-lg cursor-pointer text-center block',
              isDark
                ? 'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-accent-blue/20'
                : 'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-accent-blue/15 hover:shadow-accent-blue/25'
            )}
          >
            {tNav('login')}
          </NextLink>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
