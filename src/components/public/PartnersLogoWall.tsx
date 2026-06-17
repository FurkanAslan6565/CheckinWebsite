'use client';

import React from 'react';
import type { Partner as DbPartner } from '@prisma/client';

interface PartnersLogoWallProps {
  partners?: DbPartner[];
}

const partnerTypeMap: Record<string, string> = {
  EUROPEAN_INSTITUTION: 'Institucional',
  MUNICIPALITY: 'Município',
  UNIVERSITY: 'Universidade',
  NGO: 'Rede NGO',
};

const PARTNERS = [
  { name: 'União Europeia', type: 'Institucional' },
  { name: 'Câmara Municipal de Lisboa', type: 'Município' },
  { name: 'IPDJ IP', type: 'Governo PT' },
  { name: 'Universidade de Lisboa', type: 'Universidade' },
  { name: 'CEIPES Itália', type: 'Rede NGO' },
  { name: 'Adel Slovakia', type: 'Rede NGO' },
  { name: 'Eramus+ Portugal', type: 'Agência Nacional' },
  { name: 'Corpo Europeu Solidariedade', type: 'Agência Nacional' },
];

export default function PartnersLogoWall({ partners: dbPartners }: PartnersLogoWallProps) {
  const partnersList = dbPartners && dbPartners.length > 0
    ? dbPartners.map((p) => ({
        name: p.name,
        type: partnerTypeMap[p.type] || p.type
      }))
    : PARTNERS;

  // Duplicate for infinite seamless scroll
  const items = [...partnersList, ...partnersList];

  return (
    <section className="py-16 bg-background overflow-hidden border-b border-slate-900/80">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left">
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block">
          Rede de Cooperação & Apoios
        </span>
      </div>

      <div className="relative w-full flex items-center overflow-hidden">
        {/* Gradients masks left & right */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-8">
          {items.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center px-8 py-5 rounded-2xl glass-panel min-w-[200px] border border-slate-800/40 select-none"
            >
              <span className="text-white font-heading font-extrabold text-sm sm:text-base tracking-tight text-center">
                {partner.name}
              </span>
              <span className="text-[10px] uppercase font-semibold text-accent-blue mt-1">
                {partner.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
