import React, { Suspense } from 'react';
import Navbar from '@/components/navigation/Navbar';
import ProjectsShowcase from '@/components/public/ProjectsShowcase';
import Footer from '@/components/navigation/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#FAFAFC]">
      {/* Reusable Navbar in Light Theme Variant */}
      <Navbar variant="light" />

      {/* Light Theme wrapper to match the style tokens and overrides */}
      <div className="theme-light bg-background text-foreground transition-colors duration-300">
        <Suspense fallback={<div className="py-24 text-center text-slate-500">Loading projects...</div>}>
          <ProjectsShowcase projects={JSON.parse(JSON.stringify(projects))} />
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
