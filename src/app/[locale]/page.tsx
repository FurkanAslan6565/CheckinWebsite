import React from 'react';
import Hero from '@/components/public/Hero';
import PartnersLogoWall from '@/components/public/PartnersLogoWall';

import SuccessStories from '@/components/public/SuccessStories';
import OpportunitiesList from '@/components/public/OpportunitiesList';
import MediaGallery from '@/components/public/MediaGallery';
import Footer from '@/components/navigation/Footer';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const opportunities = await prisma.opportunity.findMany({
    where: { isPublished: true },
  });
  const partners = await prisma.partner.findMany({
    where: { isPublished: true },
  });
  const galleryItems = await prisma.galleryItem.findMany();

  return (
    <main className="min-h-screen bg-[#0A0E1A]">
      {/* 1. Cinematic Animated Hero section - Remains fully dark */}
      <Hero />

      {/* Content wrapper transitioning to light theme */}
      <div className="theme-light bg-background text-foreground transition-colors duration-300">

        {/* 2. Scrolling Partners and Accreditation Board */}
        <PartnersLogoWall partners={JSON.parse(JSON.stringify(partners))} />



        {/* 4. Volunteer Stories & Counters */}
        <SuccessStories />

        {/* 5. Active Calls for applications */}
        <OpportunitiesList opportunities={JSON.parse(JSON.stringify(opportunities))} />

        {/* 6. Pinterest Masonry Media Gallery */}
        <MediaGallery galleryItems={JSON.parse(JSON.stringify(galleryItems))} />

      </div>

      {/* 7. Site Navigation Footer - Remains fully dark */}
      <Footer />
    </main>
  );
}
