'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GalleryItem as DbGalleryItem } from '@prisma/client';

interface GalleryMedia {
  id: string;
  title: string;
  category: 'Erasmus+' | 'Voluntariado' | 'Atividades';
  categoryKey: 'erasmus' | 'volunteering' | 'activities';
  url: string;
}

interface MediaGalleryProps {
  galleryItems?: DbGalleryItem[];
}

const categoryKeyMap: Record<string, 'erasmus' | 'volunteering' | 'activities'> = {
  'Erasmus+': 'erasmus',
  'Voluntariado': 'volunteering',
  'Atividades': 'activities',
  'Volunteering': 'volunteering',
  'Activities': 'activities',
};

const CATEGORIES = ['Todos', 'Erasmus+', 'Voluntariado', 'Atividades'];

export default function MediaGallery({ galleryItems: dbGalleryItems }: MediaGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const t = useTranslations('gallery');
  const tProj = useTranslations('projects');

  const getTrans = (val: string | null | undefined) => {
    if (!val) return '';
    return t.has(val) ? t(val) : val;
  };

  const galleryList: GalleryMedia[] = dbGalleryItems && dbGalleryItems.length > 0
    ? dbGalleryItems.map((item) => ({
        id: item.id,
        title: getTrans(item.title),
        category: (item.category === 'Activities' ? 'Atividades' : item.category === 'Volunteering' ? 'Voluntariado' : item.category) as 'Erasmus+' | 'Voluntariado' | 'Atividades',
        categoryKey: categoryKeyMap[item.category] || 'erasmus',
        url: item.url,
      }))
    : [
        {
          id: '1',
          title: t('i1_title'),
          category: 'Erasmus+',
          categoryKey: 'erasmus',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          title: t('i2_title'),
          category: 'Atividades',
          categoryKey: 'activities',
          url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '3',
          title: t('i3_title'),
          category: 'Voluntariado',
          categoryKey: 'volunteering',
          url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '4',
          title: t('i4_title'),
          category: 'Erasmus+',
          categoryKey: 'erasmus',
          url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '5',
          title: t('i5_title'),
          category: 'Atividades',
          categoryKey: 'activities',
          url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '6',
          title: t('i6_title'),
          category: 'Erasmus+',
          categoryKey: 'erasmus',
          url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
        }
      ];

  const filteredItems = activeCategory === 'Todos'
    ? galleryList
    : galleryList.filter(item => item.category === activeCategory);

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'Voluntariado':
        return t('categories.volunteering');
      case 'Atividades':
        return t('categories.activities');
      default:
        return cat;
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-accent-blue text-xs uppercase tracking-widest font-bold">{t('label')}</span>
          <h2 className="font-heading font-black text-white text-3xl sm:text-4xl md:text-5xl mt-2 tracking-tight">
            {t('title')}
          </h2>
        </div>
        <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
          {t('desc')}
        </p>
      </div>

      {/* Categories filter controls */}
      <div className="flex flex-wrap gap-2.5 mb-12 border-b border-slate-800/80 pb-6">
        {CATEGORIES.map((cat) => {
          const catLabel = cat === 'Todos' ? tProj('all') : getCategoryLabel(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors z-10"
              style={{ color: activeCategory === cat ? '#ffffff' : '#94a3b8' }}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="active-gallery-pill"
                  className="absolute inset-0 bg-accent-blue rounded-full -z-10 shadow-lg shadow-accent-blue/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {catLabel}
            </button>
          );
        })}
      </div>

      {/* Masonry Layout Grid */}
      <div className="masonry-grid">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              className="masonry-item group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/30 cursor-pointer"
              onClick={() => setLightboxImage(item.url)}
            >
              <img 
                src={item.url} 
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Blur Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="bg-accent-blue text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                    {getCategoryLabel(item.category)}
                  </span>
                  <ZoomIn className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h4 className="text-white font-heading font-bold text-sm sm:text-base leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Popout */}
      <AnimatePresence>
        {lightboxImage && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors border border-white/10"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={lightboxImage} 
                alt="Selected Gallery Item" 
                className="w-full h-auto max-h-[80vh] object-contain shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
