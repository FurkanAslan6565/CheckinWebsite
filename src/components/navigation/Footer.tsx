'use client';

import React from 'react';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050811] border-t border-slate-900/90 pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="h-9 relative inline-block mb-6">
              <img src="/Logos/Check-IN/SVG/Check-IN_Logotipo_Branco.svg" alt="Check-IN Logo" className="h-full w-auto object-contain" />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              {t('desc')}
            </p>
            <span className="text-slate-500 text-[11px] block mb-3">
              NIPC: 509200424 | Registo IPDJ nº 156
            </span>
            <Link 
              href="/estatutos" 
              className="inline-block text-accent-blue hover:text-white text-xs font-semibold transition-colors underline underline-offset-4 decoration-accent-blue/30 hover:decoration-white"
            >
              {tNav('estatutos')}
            </Link>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-6">{tNav('contact')}</h4>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-blue shrink-0" />
                <a href="mailto:info@checkin.org.pt" className="hover:text-white transition-colors">info@checkin.org.pt</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-blue shrink-0" />
                <a href="tel:+351218870104" className="hover:text-white transition-colors">+351 218 870 104</a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-6">{t('offices')}</h4>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">{t('lisbon')}</span>
                  <span>Rua da Penha de França 112B, 1170-302 Lisboa</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">{t('beja')}</span>
                  <span>Rua de Moçambique, Lote 4 cave, 7800-432 Beja</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Accreditation */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-6">{t('accreditation')}</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              {t('accreditation_desc')}
            </p>
            <div className="inline-block bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2">
              <span className="text-[10px] uppercase font-bold text-accent-yellow block">
                Erasmus+ Accredited
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>{t('love')}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer"
          >
            <span>{t('top')}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
