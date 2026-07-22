'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Story {
  id: string;
  name: string;
  role: string;
  project: string;
  quote: string;
  imageUrl: string;
}

interface Stat {
  labelKey: 'projects' | 'participants' | 'countries' | 'volunteers';
  target: number;
  suffix: string;
}

const STATS: Stat[] = [
  { labelKey: 'projects', target: 120, suffix: '+' },
  { labelKey: 'participants', target: 5000, suffix: '+' },
  { labelKey: 'countries', target: 25, suffix: '' },
  { labelKey: 'volunteers', target: 450, suffix: '+' }
];

// Reusable Counter component
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalSteps = 60;
    const stepDuration = (duration * 1000) / totalSteps;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / totalSteps);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function SuccessStories() {
  const t = useTranslations('testimonials');
  const tStats = useTranslations('stats');

  const stories: Story[] = [
    {
      id: '1',
      name: t('s1_name'),
      role: t('s1_role'),
      project: t('s1_project'),
      quote: t('s1_quote'),
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      name: t('s2_name'),
      role: t('s2_role'),
      project: t('s2_project'),
      quote: t('s2_quote'),
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0E1424]/40 border-y border-slate-900/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Statistics Wall */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {STATS.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={stat.labelKey}
              className="text-center p-6 glass-panel rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Sparkles className="w-16 h-16 text-accent-blue" />
              </div>
              <span className="font-heading font-black text-white text-3xl sm:text-4xl md:text-5xl block tracking-tight">
                <AnimatedCounter target={stat.target} />{stat.suffix}
              </span>
              <span className="text-slate-400 text-xs md:text-sm font-medium mt-2 block">
                {tStats(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>

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

        {/* Storytelling Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              key={story.id}
              className="glass-panel rounded-3xl p-8 relative flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6 text-slate-700/30">
                <Quote className="w-12 h-12" />
              </div>

              <div>
                <span className="bg-slate-900 border border-slate-800 text-[10px] text-accent-blue uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full mb-6 inline-block">
                  {story.project}
                </span>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light italic mb-8 relative z-10">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-800/80 pt-6">
                <img 
                  src={story.imageUrl} 
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent-blue/30"
                />
                <div>
                  <h4 className="font-heading font-bold text-white text-sm sm:text-base">
                    {story.name}
                  </h4>
                  <span className="text-slate-500 text-xs block">
                    {story.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
