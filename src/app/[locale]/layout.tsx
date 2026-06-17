import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import SmoothScroll from "@/components/animations/SmoothScroll";

export const metadata: Metadata = {
  title: "Check-IN Portugal | Mobilidade, Voluntariado e Projetos Europeus",
  description: "Conectamos Pessoas. Criamos Oportunidades. Transformamos Comunidades. Projetos Erasmus+, Corpo Europeu de Solidariedade, Voluntariado e Intercâmbios.",
  keywords: "Erasmus+, ESC, Voluntariado, Intercâmbios, Portugal, NGO, Projetos Europeus, KA1, KA2, CERV, Inclusão, Sustentabilidade",
  openGraph: {
    title: "Check-IN Portugal | Mobilidade e Projetos Europeus",
    description: "Associação juvenil portuguesa de cooperação europeia. Conectamos Pessoas, Criamos Oportunidades.",
    url: "https://checkin.org.pt",
    siteName: "Check-IN Portugal",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Check-IN Portugal",
    description: "Projetos Erasmus+, Corpo Europeu de Solidariedade, Voluntariado e Intercâmbios.",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the request locale is supported
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Fetch localized messages for NextIntl context
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
