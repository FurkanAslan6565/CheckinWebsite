'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowLeft, Maximize2, Sparkles, UserPlus, Sliders } from 'lucide-react';
import Link from 'next/link';

type TabType = 'slideshow' | 'board';

export default function GonullulerNeredePage() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [activeTab, setActiveTab] = useState<TabType>('slideshow');

  const t = {
    badge: isTr ? 'İNTERAKTİF SERGİ & HARİTA' : 'EXPOSIÇÃO INTERATIVA & MAPA',
    title: isTr ? 'Gönüllülerimiz Nerede?' : 'Onde Estão os Nossos Voluntários?',
    desc: isTr 
      ? 'Check-IN bünyesinde dünya genelinde faaliyet gösteren gönüllülerimizin maceralarını, katkılarını ve yaşam hikayelerini bu etkileşimli sunum ve harita üzerinden keşfedin.'
      : 'Descubra as aventuras, contribuições e histórias de vida dos voluntários da Check-IN que operam em todo o mundo através desta apresentação e mapa interativos.',
    backBtn: isTr ? 'Ana Sayfaya Dön' : 'Voltar ao Início',
    fullscreenBtn: isTr ? 'Tam Ekran Aç' : 'Abrir em Ecrã Inteiro',
    tabSlideshow: isTr ? 'Gönüllü Sergisi' : 'Galeria de Voluntários',
    tabBoard: isTr ? 'Gönüllü Ekle (İnteraktif)' : 'Adicionar Voluntário (Interativo)',
    infoTitle: isTr ? 'Etkileşimli Deneyim' : 'Experiência Interativa',
    infoDescSlideshow: isTr 
      ? 'Gönüllülerimizin projelerini, fotoğraflarını ve yerel topluluklara sundukları katkıları slayt gösterisi halinde izleyin.'
      : 'Assista aos projetos de voluntariado, fotografias e contribuições em formato de apresentação de diapositivos.',
    infoDescBoard: isTr 
      ? 'Bu etkileşimli pano üzerinden haritaya yeni gönderiler/gönüllüler ekleyebilir, mevcut paylaşımlara fotoğraf ve yorum bırakabilirsiniz.'
      : 'Utilize este painel interativo para adicionar voluntários, publicações, fotos e comentários diretamente no mapa.'
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between select-none">
      
      {/* Navbar with Light Variant */}
      <Navbar variant="light" />

      {/* Main Page Area */}
      <div className="bg-white text-slate-800 transition-colors duration-300 flex-grow py-12 relative overflow-hidden">
        
        {/* Subtle Decorative Grid Pattern in Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Back button */}
          <div className="mb-6">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-accent-blue transition-colors uppercase tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              {t.backBtn}
            </Link>
          </div>

          {/* Header Section */}
          <div className="border-b border-slate-100 pb-8 space-y-4 mb-10 text-center md:text-left flex flex-col items-center md:items-start">
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-accent-blue/10 text-accent-blue uppercase border border-accent-blue/20">
              <Sparkles className="w-3.5 h-3.5" />
              {t.badge}
            </span>

            <h1 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
              {t.title}
            </h1>

            <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-light">
              {t.desc}
            </p>

          </div>

          {/* Premium Tab Switcher */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100/80 max-w-md mx-auto mb-10 relative">
            <button
              type="button"
              onClick={() => setActiveTab('slideshow')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10 cursor-pointer ${
                activeTab === 'slideshow' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              {t.tabSlideshow}
              {activeTab === 'slideshow' && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute inset-0 bg-accent-blue rounded-xl -z-10 shadow-md shadow-accent-blue/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('board')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10 cursor-pointer ${
                activeTab === 'board' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {t.tabBoard}
              {activeTab === 'board' && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute inset-0 bg-accent-blue rounded-xl -z-10 shadow-md shadow-accent-blue/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Main Embed Content Card */}
          <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.025)] hover:shadow-[0_30px_70px_rgba(0,102,255,0.05)] hover:border-accent-blue/15 transition-all duration-500 ease-out mb-10 relative">
            
            <AnimatePresence mode="wait">
              {activeTab === 'slideshow' ? (
                <motion.div
                  key="slideshow-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Header toolbar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Globe className="w-4 h-4 text-accent-blue animate-pulse" />
                      <span>{t.infoDescSlideshow}</span>
                    </div>
                    <a 
                      href="https://padlet.com/embed/typsqesepocdwkxy/slideshow?autoplay=0&loop=0&duration=auto" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-accent-blue hover:text-white border border-slate-100 transition-colors text-[10px] font-extrabold uppercase tracking-widest text-slate-500 shadow-sm"
                    >
                      <Maximize2 className="w-3 h-3" />
                      {t.fullscreenBtn}
                    </a>
                  </div>

                  {/* Embed Iframe */}
                  <div className="w-full h-[650px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner relative">
                    <iframe 
                      src="https://padlet.com/embed/typsqesepocdwkxy/slideshow?autoplay=0&loop=0&duration=auto" 
                      frameBorder="0" 
                      allow="clipboard-write" 
                      className="w-full h-full border-0 absolute inset-0"
                      title={t.tabSlideshow}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="board-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Header toolbar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Globe className="w-4 h-4 text-accent-blue animate-pulse" />
                      <span>{t.infoDescBoard}</span>
                    </div>
                    <a 
                      href="https://padlet.com/embed/typsqesepocdwkxy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-accent-blue hover:text-white border border-slate-100 transition-colors text-[10px] font-extrabold uppercase tracking-widest text-slate-500 shadow-sm"
                    >
                      <Maximize2 className="w-3 h-3" />
                      {t.fullscreenBtn}
                    </a>
                  </div>

                  {/* Embed Iframe */}
                  <div className="w-full h-[650px] rounded-2xl overflow-hidden bg-[#F4F4F4] border border-slate-100 shadow-inner relative">
                    <iframe 
                      src="https://padlet.com/embed/typsqesepocdwkxy" 
                      frameBorder="0" 
                      allow="camera;microphone;geolocation;display-capture;clipboard-write" 
                      className="w-full h-full border-0 absolute inset-0"
                      title={t.tabBoard}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Info Details Footer section */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                {t.infoTitle}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light max-w-2xl">
                {activeTab === 'slideshow' ? t.infoDescSlideshow : t.infoDescBoard}
              </p>
            </div>
            
            <a 
              href="https://padlet.com/typsqesepocdwkxy/check-in-volunteers-onde-est-o-os-nossos-volunt-rios-slides-typsqesepocdwkxy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto text-center bg-accent-blue hover:bg-accent-blue/95 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:translate-y-[-1px] active:translate-y-[1px] text-xs uppercase tracking-widest flex-shrink-0"
            >
              Padlet {isTr ? 'Sayfasına Git' : 'Ver no Padlet'}
            </a>
          </div>

        </div>

      </div>

      {/* Footer with Dark Variant */}
      <Footer />

    </main>
  );
}
