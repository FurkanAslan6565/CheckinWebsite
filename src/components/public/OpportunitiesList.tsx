'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Send, AlertCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Opportunity as DbOpportunity } from '@prisma/client';

interface Opportunity {
  id: string;
  title: string;
  type: 'Voluntariado' | 'Formação' | 'Intercâmbio';
  typeKey: 'volunteering' | 'training' | 'exchange';
  location: string;
  duration: string;
  deadline: string;
  description: string;
  requirements: string;
}

interface OpportunitiesListProps {
  opportunities?: DbOpportunity[];
}

const typeMap: Record<string, 'Voluntariado' | 'Formação' | 'Intercâmbio'> = {
  VOLUNTEERING: 'Voluntariado',
  TRAINING_COURSE: 'Formação',
  YOUTH_EXCHANGE: 'Intercâmbio'
};

const typeKeyMap: Record<string, 'volunteering' | 'training' | 'exchange'> = {
  VOLUNTEERING: 'volunteering',
  TRAINING_COURSE: 'training',
  YOUTH_EXCHANGE: 'exchange'
};

const TYPES = ['Todos', 'Voluntariado', 'Formação', 'Intercâmbio'];

export default function OpportunitiesList({ opportunities: dbOpportunities }: OpportunitiesListProps) {
  const [activeType, setActiveType] = useState('Todos');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const t = useTranslations('opportunities');
  const tForm = useTranslations('form');
  const tProjects = useTranslations('projects');
  const locale = useLocale();

  const typeLabels: Record<string, string> = {
    Todos: tProjects('all'),
    Voluntariado: t('types.volunteering'),
    Formação: t('types.training'),
    Intercâmbio: t('types.exchange'),
  };

  const getTrans = (val: string | null | undefined) => {
    if (!val) return '';
    return t.has(val) ? t(val) : val;
  };

  const formatDate = (dateVal: Date | string | null | undefined) => {
    if (!dateVal) return '';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return String(dateVal);
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-US' : 'pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const opportunitiesList: Opportunity[] = dbOpportunities && dbOpportunities.length > 0
    ? dbOpportunities.map((o) => ({
        id: o.id,
        title: getTrans(o.title),
        type: typeMap[o.type] || 'Voluntariado',
        typeKey: typeKeyMap[o.type] || 'volunteering',
        location: getTrans(o.location),
        duration: getTrans(o.duration),
        deadline: t.has(o.title) ? getTrans(`${o.title.replace('title', 'deadline')}`) : formatDate(o.deadline),
        description: getTrans(o.description),
        requirements: getTrans(o.requirements)
      }))
    : [
        {
          id: '1',
          title: t('o1_title'),
          type: 'Voluntariado',
          typeKey: 'volunteering',
          location: t('o1_loc'),
          duration: t('o1_dur'),
          deadline: t('o1_deadline'),
          description: t('o1_desc'),
          requirements: t('o1_req')
        },
        {
          id: '2',
          title: t('o2_title'),
          type: 'Formação',
          typeKey: 'training',
          location: t('o2_loc'),
          duration: t('o2_dur'),
          deadline: t('o2_deadline'),
          description: t('o2_desc'),
          requirements: t('o2_req')
        },
        {
          id: '3',
          title: t('o3_title'),
          type: 'Intercâmbio',
          typeKey: 'exchange',
          location: t('o3_loc'),
          duration: t('o3_dur'),
          deadline: t('o3_deadline'),
          description: t('o3_desc'),
          requirements: t('o3_req')
        },
        {
          id: '4',
          title: t('o4_title'),
          type: 'Voluntariado',
          typeKey: 'volunteering',
          location: t('o4_loc'),
          duration: t('o4_dur'),
          deadline: t('o4_deadline'),
          description: t('o4_desc'),
          requirements: t('o4_req')
        }
      ];

  const filtered = activeType === 'Todos'
    ? opportunitiesList
    : opportunitiesList.filter(o => o.type === activeType);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSelectedOpportunity(null);
    }, 3000);
  };

  return (
    <section id="oportunidades" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900/80">
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

      {/* Type Filter Controls */}
      <div className="flex flex-wrap gap-2.5 mb-12 border-b border-slate-800/80 pb-6">
        {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors z-10"
              style={{ color: activeType === type ? '#ffffff' : '#94a3b8' }}
            >
              {activeType === type && (
                <motion.div
                  layoutId="active-opp-pill"
                  className="absolute inset-0 bg-accent-blue rounded-full -z-10 shadow-lg shadow-accent-blue/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {typeLabels[type]}
            </button>
          ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((opp) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              key={opp.id}
              className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-accent-blue/30 transition-all group hover:shadow-2xl hover:shadow-accent-blue/5"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full ${
                    opp.type === 'Voluntariado' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50' :
                    opp.type === 'Formação' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  }`}>
                    {t(`types.${opp.typeKey}`)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-950/30 px-3 py-1.5 rounded-full border border-rose-900/30">
                    <Clock className="w-3.5 h-3.5" />
                    {t('deadline_label')} {opp.deadline}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-white text-xl group-hover:text-accent-blue transition-colors leading-snug mb-4">
                  {opp.title}
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {opp.description}
                </p>

                {/* Scope details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">{t('location_label')}</span>
                    <span className="flex items-center gap-1 text-slate-200 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-accent-blue" />
                      {opp.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">{t('duration_label')}</span>
                    <span className="flex items-center gap-1 text-slate-200 text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                      {opp.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="w-full bg-slate-800/80 hover:bg-accent-blue text-white hover:text-white font-medium text-xs sm:text-sm py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-accent-blue shadow-lg shadow-accent-blue/0 group-hover:shadow-accent-blue/15"
                >
                  <Send className="w-4 h-4" />
                  {t('apply_button')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Application Form Drawer / Modal Overlay */}
      <AnimatePresence>
        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-slate-900/60 border-b border-slate-800/80">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-accent-blue">{tForm('title')}</span>
                <h3 className="font-heading font-black text-white text-lg sm:text-xl mt-1 leading-snug">
                  {selectedOpportunity.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-accent-blue" /> {selectedOpportunity.location} | {t('deadline_label')}: {selectedOpportunity.deadline}
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4">
                      <Send className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold text-lg">{tForm('success_title')}</h4>
                    <p className="text-slate-400 text-xs max-w-xs mt-2">
                      {tForm('success_desc')}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">{tForm('name')}</label>
                        <input required type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue" placeholder="Rita" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">{tForm('surname')}</label>
                        <input required type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue" placeholder="Silva" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">{tForm('email')}</label>
                      <input required type="email" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue" placeholder="rita@exemplo.com" />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">{tForm('phone')}</label>
                      <input required type="tel" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue" placeholder="+351 912 345 678" />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">{tForm('motivation')}</label>
                      <textarea required rows={4} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue resize-none" placeholder="Explique brevemente..." />
                    </div>

                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 flex gap-2.5">
                      <AlertCircle className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {tForm('warning')}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setSelectedOpportunity(null)}
                        className="w-1/2 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-xs py-3.5 rounded-full transition-all"
                      >
                        {tForm('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 bg-accent-blue hover:bg-accent-blue/90 text-white font-medium text-xs py-3.5 rounded-full transition-all shadow-lg shadow-accent-blue/15"
                      >
                        {tForm('submit')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
