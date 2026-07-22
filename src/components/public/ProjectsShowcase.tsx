'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Calendar, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import type { Project as DbProject } from '@prisma/client';

interface Project {
  id: string;
  title: string;
  country: string;
  program: string;
  duration: string;
  description: string;
  results: string;
  coverImageUrl: string;
  galleryImages?: string[];
}

interface ProjectsShowcaseProps {
  projects?: DbProject[];
}

const programMap: Record<string, string> = {
  ERASMUS_PLUS: 'Erasmus+',
  ESC: 'ESC',
  YOUTH_EXCHANGE: 'Youth Exchange',
  TRAINING_COURSE: 'Training Course',
  KA1: 'KA1',
  KA2: 'KA2',
  YOUTH_PARTICIPATION: 'Youth Participation',
  CERV: 'CERV'
};

const FILTERS = ['Todos', 'Erasmus+', 'ESC', 'Youth Exchange', 'KA2', 'Youth Participation', 'CERV'];

export default function ProjectsShowcase({ projects: dbProjects }: ProjectsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const t = useTranslations('projects');
  const searchParams = useSearchParams();
  const projectIdParam = searchParams ? searchParams.get('id') : null;

  const getTrans = useCallback((val: string | null | undefined) => {
    if (!val) return '';
    return t.has(val) ? t(val) : val;
  }, [t]);

  const projectsList = useMemo<Project[]>(() => {
    return dbProjects && dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          title: getTrans(p.title),
          country: getTrans(p.country),
          program: programMap[p.program] || p.program,
          duration: getTrans(p.duration),
          description: getTrans(p.description),
          results: getTrans(p.results) || '',
          coverImageUrl: p.coverImageUrl,
          galleryImages: p.galleryImages || [],
        }))
      : [
          {
            id: '1',
            title: t('p1_title'),
            country: t('p1_country'),
            program: 'ESC',
            duration: t('p1_duration'),
            description: t('p1_desc'),
            results: t('p1_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '2',
            title: t('p2_title'),
            country: t('p2_country'),
            program: 'Erasmus+',
            duration: t('p2_duration'),
            description: t('p2_desc'),
            results: t('p2_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '3',
            title: t('p3_title'),
            country: t('p3_country'),
            program: 'Youth Participation',
            duration: t('p3_duration'),
            description: t('p3_desc'),
            results: t('p3_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '4',
            title: t('p4_title'),
            country: t('p4_country'),
            program: 'CERV',
            duration: t('p4_duration'),
            description: t('p4_desc'),
            results: t('p4_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '5',
            title: t('p5_title'),
            country: t('p5_country'),
            program: 'KA2',
            duration: t('p5_duration'),
            description: t('p5_desc'),
            results: t('p5_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '6',
            title: t('p6_title'),
            country: t('p6_country'),
            program: 'Youth Exchange',
            duration: t('p6_duration'),
            description: t('p6_desc'),
            results: t('p6_results'),
            coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
          }
        ];
  }, [dbProjects, t, getTrans]);

  useEffect(() => {
    if (projectIdParam) {
      const matched = projectsList.find(p => p.id === projectIdParam);
      if (matched) {
        setSelectedProject(matched);
      }
    }
  }, [projectIdParam, projectsList]);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'Todos'
      ? projectsList
      : projectsList.filter(p => p.program.toLowerCase() === activeFilter.toLowerCase());
  }, [activeFilter, projectsList]);

  return (
    <section id="projetos" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Title */}
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

      {/* Dynamic Filter Controls */}
      <div className="flex flex-wrap gap-2.5 mb-12 border-b border-slate-800/80 pb-6">
        {FILTERS.map((filter) => {
          const filterLabel = filter === 'Todos' ? t('all') : filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors z-10"
              style={{ color: activeFilter === filter ? '#ffffff' : '#94a3b8' }}
            >
              {activeFilter === filter && (
                <motion.div
                  layoutId="active-project-pill"
                  className="absolute inset-0 bg-accent-blue rounded-full -z-10 shadow-lg shadow-accent-blue/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {filterLabel}
            </button>
          );
        })}
      </div>

      {/* Project Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group glass-panel rounded-3xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-accent-blue/5 cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.coverImageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-accent-blue text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full">
                    {project.program}
                  </span>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex gap-4 items-center text-xs text-slate-400 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-accent-blue" />
                      {project.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                      {project.duration}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg group-hover:text-accent-blue transition-colors leading-snug mb-3">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Impact / Results Box */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <div className="bg-slate-900/50 rounded-xl p-3.5 border border-slate-800/40">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-accent-yellow block mb-1">
                      {t('results_label')}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed italic">
                      &ldquo;{project.results}&rdquo;
                    </p>
                  </div>
                  
                  {/* Explore Link */}
                  <div className="flex items-center justify-between text-xs font-semibold text-white mt-4 group/link">
                    <span className="group-hover/link:underline">{t('details_link')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent-blue group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex justify-center items-start z-50 p-4 sm:p-6 overflow-y-auto py-12 sm:py-16"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white border border-slate-100 w-full max-w-4xl rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] relative flex flex-col my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Banner Cover Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                <img 
                  src={selectedProject.coverImageUrl} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                {/* Premium Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
                
                {/* Accent Lights Border */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-blue via-violet-500 to-accent-yellow z-10" />
                
                {/* Close Button */}
                <button 
                  className="absolute top-6 right-6 bg-black/45 hover:bg-accent-blue hover:scale-110 force-text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 z-20 cursor-pointer shadow-lg active:scale-95"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Banner Content */}
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="inline-flex items-center gap-2 bg-accent-blue border border-accent-blue/30 force-text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full mb-3 shadow-md shadow-accent-blue/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {selectedProject.program}
                  </div>
                  <h3 className="font-heading font-black force-text-white text-2xl sm:text-3.5xl tracking-tight leading-tight drop-shadow-md">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Content Container with Split Layout */}
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
                
                {/* Left: Main Details (2/3 width) */}
                <div className="flex-1 p-8 sm:p-10 space-y-8">
                  {/* About Section */}
                  <div>
                    <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-accent-blue mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      {t('desc_label')}
                    </h4>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line font-sans font-medium">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Results Section */}
                  {selectedProject.results && (
                    <div className="relative overflow-hidden bg-amber-50/40 border border-amber-200/40 rounded-2xl p-6 shadow-sm">
                      <div className="absolute -right-4 -bottom-6 text-amber-500/[0.08] font-black font-heading text-9xl pointer-events-none select-none">
                        ”
                      </div>
                      <span className="text-[11px] uppercase font-extrabold tracking-widest text-amber-600 block mb-2 font-heading">
                        {t('results_label')}
                      </span>
                      <p className="text-slate-700 text-sm leading-relaxed italic relative z-10 pl-3.5 border-l-[3px] border-amber-400">
                        &ldquo;{selectedProject.results}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* 3 Photos Gallery */}
                  <div>
                    <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-accent-blue mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      {t('gallery_label')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(selectedProject.galleryImages && selectedProject.galleryImages.length > 0 
                        ? selectedProject.galleryImages 
                        : [
                            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
                          ]
                      ).slice(0, 3).map((imgUrl, i) => (
                        <div 
                          key={i} 
                          className="group/gallery relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 hover:border-accent-blue/30 hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer bg-slate-50 shadow-sm"
                          onClick={() => window.open(imgUrl, '_blank')}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-full object-cover group-hover/gallery:scale-105 transition-transform duration-500"
                          />
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-accent-blue/10 opacity-0 group-hover/gallery:opacity-100 transition-opacity flex justify-center items-center backdrop-blur-[2px]">
                            <span className="bg-[#0f172a]/80 text-[10px] force-text-white px-2.5 py-1.5 rounded-full border border-white/10 font-bold uppercase tracking-wider scale-90 group-hover/gallery:scale-100 transition-all duration-300 shadow-md">
                              {t('zoom') || 'Büyüt'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Sidebar Meta Details (1/3 width) */}
                <div className="w-full md:w-72 p-8 sm:p-10 flex flex-col justify-between shrink-0 bg-slate-50/30">
                  <div className="space-y-6">
                    {/* Country card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-accent-blue/30 hover:shadow-md transition-all duration-300 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                        {t('country_label')}
                      </span>
                      <span className="flex items-center gap-3 text-slate-800 text-sm sm:text-base font-extrabold">
                        <div className="w-9 h-9 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                          <Globe className="w-4.5 h-4.5 text-accent-blue" />
                        </div>
                        {selectedProject.country}
                      </span>
                    </div>

                    {/* Duration card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-accent-blue/30 hover:shadow-md transition-all duration-300 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                        {t('duration_label')}
                      </span>
                      <span className="flex items-center gap-3 text-slate-800 text-sm sm:text-base font-extrabold">
                        <div className="w-9 h-9 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-4.5 h-4.5 text-accent-blue" />
                        </div>
                        {selectedProject.duration}
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Footer Action */}
                  <div className="pt-8 mt-12 md:mt-0">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="w-full bg-slate-900 hover:bg-accent-blue force-text-white font-bold text-xs py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-accent-blue/15 hover:scale-[1.02] active:scale-98 cursor-pointer"
                    >
                      {t('close') || 'Kapat'}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
