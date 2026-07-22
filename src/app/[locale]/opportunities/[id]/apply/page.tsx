import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OpportunityApplyForm from '@/components/public/OpportunityApplyForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

type Params = Promise<{ locale: string; id: string }>;

interface ApplyPageProps {
  params: Params;
}

export const dynamic = 'force-dynamic';

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id, locale } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: id },
  });

  if (!opportunity || !opportunity.isPublished) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header/Navigation Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-200/80 mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors font-black text-lg sm:text-xl tracking-tight"
        >
          <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/10">
            C
          </span>
          Check-in Portal
        </Link>

        <Link
          href="/#oportunidades"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold bg-white border border-slate-200/80 px-3.5 py-2 rounded-full transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {locale === 'tr' ? "Fırsatlara Dön" : "Voltar às Oportunidades"}
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center w-full">
        <OpportunityApplyForm opportunity={JSON.parse(JSON.stringify(opportunity))} />
      </div>

      {/* Simple Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-6 border-t border-slate-200/50 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        &copy; {new Date().getFullYear()} Check-in. {locale === 'tr' ? "Tüm Hakları Saklıdır." : "Todos os direitos reservados."}
      </footer>
    </main>
  );
}
