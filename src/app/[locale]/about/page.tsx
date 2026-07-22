'use client';

import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useTranslations, useLocale } from 'next-intl';
import { Globe, Users, Heart, BookOpen, Milestone, ShieldCheck, Mail, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

// Dynamic Team Members list - easily expandable/editable with placeholder photos
const TEAM_MEMBERS = [
  {
    id: 'member-1',
    name: 'António Silva',
    role: {
      pt: 'Presidente & Diretor Executivo',
      tr: 'Başkan & Yönetici Direktör'
    },
    bio: {
      pt: 'Fundador da Check-IN, com mais de 15 anos de experiência na gestão de parcerias estratégicas europeias.',
      tr: 'Check-IN kurucusu, Avrupa stratejik ortaklıkları yönetiminde 15 yılı aşkın deneyim.'
    },
    email: 'antonio.silva@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=12'
  },
  {
    id: 'member-2',
    name: 'Sofia Santos',
    role: {
      pt: 'Coordenadora de Projetos Erasmus+',
      tr: 'Erasmus+ Proje Koordinatörü'
    },
    bio: {
      pt: 'Especialista em mobilidade juvenil e candidaturas KA1 e KA2, focada na inclusão social.',
      tr: 'Gençlik hareketliliği ve KA1/KA2 başvuruları uzmanı, sosyal kapsayıcılığa odaklı.'
    },
    email: 'sofia.santos@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=47'
  },
  {
    id: 'member-3',
    name: 'Mert Yılmaz',
    role: {
      pt: 'Gestor de Projetos Internacionais',
      tr: 'Uluslararası Projeler Yöneticisi'
    },
    bio: {
      pt: 'Responsável pelo planeamento de intercâmbios e redes de cooperação com parceiros globais.',
      tr: 'Ortak ağları ve küresel ortaklarla iş birliği projelerinin planlanmasından sorumlu.'
    },
    email: 'mert.yilmaz@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=11'
  },
  {
    id: 'member-4',
    name: 'Ana Rodrigues',
    role: {
      pt: 'Coordenadora do Corpo Europeu de Solidariedade (CES)',
      tr: 'Avrupa Dayanışma Programı (ESC) Koordinatörü'
    },
    bio: {
      pt: 'Acompanha os voluntários acolhidos e enviados, garantindo o apoio pedagógico e logístico.',
      tr: 'Gelen ve giden gönüllülere pedagojik ve lojistik destek sağlayarak rehberlik eder.'
    },
    email: 'ana.rodrigues@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=32'
  },
  {
    id: 'member-5',
    name: 'Carlos Mendes',
    role: {
      pt: 'Gestor Financeiro & Administrativo',
      tr: 'Finans ve İdari İşler Yöneticisi'
    },
    bio: {
      pt: 'Supervisiona a gestão orçamental e a conformidade regulamentar dos projetos financiados pela UE.',
      tr: 'AB hibeli projelerin bütçe yönetimini ve yasal düzenlemelere uygunluğunu denetler.'
    },
    email: 'carlos.mendes@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=68'
  },
  {
    id: 'member-6',
    name: 'Beatriz Costa',
    role: {
      pt: 'Coordenadora de Comunicação & Marketing',
      tr: 'İletişim & Pazarlama Koordinatörü'
    },
    bio: {
      pt: 'Garante a visibilidade dos projetos e gere os canais digitais e a rede Eurodesk.',
      tr: 'Projelerin görünürlüğünü sağlar, dijital kanalları ve Eurodesk ağını yönetir.'
    },
    email: 'beatriz.costa@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=38'
  },
  {
    id: 'member-7',
    name: 'Diogo Ferreira',
    role: {
      pt: 'Facilitador de Aprendizagem Não-Formal',
      tr: 'Yaygın Eğitim Kolaylaştırıcısı'
    },
    bio: {
      pt: 'Desenvolve workshops dinâmicos e sessões de formação focadas em cidadania ativa.',
      tr: 'Aktif vatandaşlık odaklı dinamik atölye çalışmaları ve eğitim oturumları geliştirir.'
    },
    email: 'diogo.ferreira@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=33'
  },
  {
    id: 'member-8',
    name: 'Mariana Oliveira',
    role: {
      pt: 'Gestora de Projetos Locais & Inclusão',
      tr: 'Yerel Projeler & Kapsayıcılık Yöneticisi'
    },
    bio: {
      pt: 'Focada no desenvolvimento comunitário em bairros sensíveis e apoio a jovens vulneráveis.',
      tr: 'Hassas mahallelerde toplumsal gelişim ve dezavantajlı gençlerin desteklenmesine odaklanır.'
    },
    email: 'mariana.oliveira@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=49'
  },
  {
    id: 'member-9',
    name: 'João Pereira',
    role: {
      pt: 'Coordenador do Hub de Lisboa',
      tr: 'Lizbon Ofis Koordinatörü'
    },
    bio: {
      pt: 'Gere as atividades da Check-IN na área metropolitana de Lisboa e projetos parceiros.',
      tr: 'Lizbon metropol alanındaki Check-IN faaliyetlerini ve ortak projelerini yönetir.'
    },
    email: 'joao.pereira@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=59'
  },
  {
    id: 'member-10',
    name: 'Inês Martins',
    role: {
      pt: 'Mentora de Voluntários Internacionais',
      tr: 'Uluslararası Gönüllü Mentörü'
    },
    bio: {
      pt: 'Presta apoio pessoal e cultural a jovens estrangeiros acolhidos em Portugal.',
      tr: 'Portekiz\'de ağırlanan yabancı gençlere kişisel ve kültürel destek sağlar.'
    },
    email: 'ines.martins@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=22'
  },
  {
    id: 'member-11',
    name: 'Filippo Rossi',
    role: {
      pt: 'Oficial de Cooperação Europeia',
      tr: 'Avrupa İş Birliği Sorumlusu'
    },
    bio: {
      pt: 'Desenvolve pontes com parceiros na bacia do Mediterrâneo e apoia a rede Anna Lindh.',
      tr: 'Akdeniz havzasındaki ortaklarla köprüler kurar ve Anna Lindh ağını destekler.'
    },
    email: 'filippo.rossi@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=15'
  },
  {
    id: 'member-12',
    name: 'Tânia Nunes',
    role: {
      pt: 'Coordenadora de Estágios Profissionais (VET)',
      tr: 'Mesleki Staj Koordinatörü (VET)'
    },
    bio: {
      pt: 'Organiza programas de estágio para estudantes internacionais de escolas profissionais.',
      tr: 'Uluslararası meslek okulu öğrencileri için staj ve staj programları düzenler.'
    },
    email: 'tania.nunes@checkin.org.pt',
    linkedin: '#',
    imageUrl: 'https://i.pravatar.cc/300?img=20'
  }
];

// Animated connector showing connections/network dots representing volunteers and European Union values
const NetworkConnector = () => {
  return (
    <div className="relative w-full h-24 -my-4 overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradients for smooth fading lines */}
          <linearGradient id="line-grad-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0" />
            <stop offset="35%" stopColor="#0066FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFCC00" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#0066FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="50%" stopColor="#0066FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path 1: Main organic curve */}
        <path
          d="M0 50 Q 360 10, 720 50 T 1440 50"
          stroke="url(#line-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          fill="none"
        />

        {/* Path 2: Intersecting curve */}
        <path
          d="M0 20 Q 360 80, 720 20 T 1440 20"
          stroke="url(#line-grad-2)"
          strokeWidth="1"
          strokeDasharray="5 5"
          fill="none"
        />

        {/* Animated Particle 1: Golden Star traveling along Path 1 */}
        <g fill="#FFCC00" filter="url(#glow)">
          <path d="M0,-3 L0.8,-0.8 L3,-0.8 L1.2,0.4 L2,2.6 L0,1.3 L-2,2.6 L-1.2,0.4 L-3,-0.8 L-0.8,-0.8 Z">
            <animateMotion
              path="M0 50 Q 360 10, 720 50 T 1440 50"
              dur="12s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Animated Particle 2: Glowing blue dot traveling along Path 1 */}
        <circle r="4" fill="#0066FF" filter="url(#glow)">
          <animateMotion
            path="M0 50 Q 360 10, 720 50 T 1440 50"
            dur="8s"
            repeatCount="indefinite"
            begin="4s"
          />
        </circle>

        {/* Animated Particle 3: Glowing green dot traveling along Path 2 */}
        <circle r="3.5" fill="#10B981" filter="url(#glow)">
          <animateMotion
            path="M0 20 Q 360 80, 720 20 T 1440 20"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Intersecting central node: Pulsing network hub */}
        <g transform="translate(720, 35)">
          <circle r="10" fill="#0066FF" fillOpacity="0.05" />
          <circle r="6" fill="#0066FF" fillOpacity="0.1" className="animate-pulse" />
          <circle r="2.5" fill="#0066FF" />
        </g>
      </svg>
    </div>
  );
};

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const locale = useLocale();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCards, setVisibleCards] = React.useState(4);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, TEAM_MEMBERS.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  // Helper to fetch translated role and bio
  const getMemberDetails = (member: typeof TEAM_MEMBERS[number]) => {
    const role = locale === 'tr' ? member.role.tr : member.role.pt;
    const bio = locale === 'tr' ? member.bio.tr : member.bio.pt;
    return { role, bio };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-slate-800">
      <Navbar variant="light" />

      {/* Main Light Theme Wrapper */}
      <div className="theme-light bg-background text-foreground transition-colors duration-300">
        
        {/* Core Presentation Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 sm:pt-24 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Organization Detailed Mission */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-accent-blue text-xs uppercase tracking-widest font-black block">
                {locale === 'tr' ? 'BİZ KİMİZ?' : 'QUEM SOMOS?'}
              </span>
              <h2 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
                {locale === 'tr' ? 'Avrupa Değerleriyle Geleceği Şekillendiriyoruz.' : 'Moldando o Futuro com Valores Europeus.'}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                {t('desc1')}
              </p>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t('desc2')}
              </p>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t('desc3')}
              </p>
            </div>

            {/* Right: Key Info Board */}
            <div className="lg:col-span-5 space-y-6 lg:mt-10">
              <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm space-y-6">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block border-b border-slate-100 pb-3">
                  {locale === 'tr' ? 'TEMEL BİLGİLER' : 'FACTOS CHAVE'}
                </span>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-3xl font-black text-accent-blue block">2010</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                      {locale === 'tr' ? 'Kuruluş Yılı' : 'Ano de Fundação'}
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-accent-blue block">2</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                      {locale === 'tr' ? 'Merkez (Beja & Lizbon)' : 'Polos (Beja & Lisboa)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-accent-blue block">3000+</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                      {locale === 'tr' ? 'Gönderilen Katılımcı' : 'Participantes Enviados'}
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-accent-blue block">100+</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                      {locale === 'tr' ? 'Küresel Ortaklıklar' : 'Parcerias Globais'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Erasmus+ KA1, KA2 & Sport</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>European Solidarity Corps (ESC)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>CERV & Horizon 2020</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <NetworkConnector />

        {/* Pillars / Values Section */}
        <section className="bg-slate-50 border-y border-slate-100 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent-blue text-xs uppercase tracking-widest font-black block mb-2">
                {t('valueTitle')}
              </span>
              <h2 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl tracking-tight">
                {locale === 'tr' ? 'Çalışma Yöntemlerimiz ve İnançlarımız' : 'Os Nossos Métodos de Trabalho e Crenças'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-7 shadow-sm hover:shadow-[0_12px_24px_rgba(0,51,153,0.05)] transition-all flex flex-col justify-between min-h-[230px] cursor-default"
              >
                <span className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl text-accent-blue w-fit block">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#FFCC00" strokeWidth="1.5" strokeDasharray="3 3.5" className="opacity-80 group-hover:rotate-45 transition-transform duration-700 origin-center" />
                    <path d="M12 3v16M5 7h14M8 7l-2 5h4l-2-5zM16 7l-2 5h4l-2-5zM9 19h6" stroke="#003399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="mt-4">
                  <h3 className="font-heading text-slate-950 font-black text-base tracking-tight mb-2 group-hover:text-blue-900 transition-colors">
                    {locale === 'tr' ? 'İnsan Hakları & Eşitlik' : 'Direitos Humanos e Igualdade'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {locale === 'tr' ? 'Kültürlerarası hoşgörü, dayanışma ve toplumsal cinsiyet eşitliği ilkelerine tam bağlılık.' : 'Compromisso total com os princípios de tolerância intercultural, solidariedade e igualdade de género.'}
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-7 shadow-sm hover:shadow-[0_12px_24px_rgba(0,51,153,0.05)] transition-all flex flex-col justify-between min-h-[230px] cursor-default"
              >
                <span className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl text-accent-blue w-fit block">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#FFCC00" strokeWidth="1.5" strokeDasharray="3 3.5" className="opacity-80 group-hover:rotate-90 transition-transform duration-1000 origin-center" />
                    <path d="M12 6.5C10.5 4.5 5 4.5 5 4.5V17.5C5 17.5 10.5 17.5 12 19.5C13.5 17.5 19 17.5 19 17.5V4.5C19 4.5 13.5 4.5 12 6.5Z" stroke="#003399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6.5V19.5" stroke="#003399" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="mt-4">
                  <h3 className="font-heading text-slate-950 font-black text-base tracking-tight mb-2 group-hover:text-blue-900 transition-colors">
                    {locale === 'tr' ? 'Yaşam Boyu Öğrenme' : 'Aprendizagem ao Longo da Vida'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {locale === 'tr' ? 'Yaygın eğitim metotlarıyla bireysel ve mesleki becerilerin geliştirilmesi.' : 'Desenvolvimento de competências pessoais e profissionais através de metodologias de educação não-formal.'}
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-7 shadow-sm hover:shadow-[0_12px_24px_rgba(0,51,153,0.05)] transition-all flex flex-col justify-between min-h-[230px] cursor-default"
              >
                <span className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl text-accent-blue w-fit block">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#FFCC00" strokeWidth="1.5" strokeDasharray="3 3.5" className="opacity-80 group-hover:rotate-180 transition-transform duration-[1500ms] origin-center" />
                    <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9" stroke="#003399" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 3c4 0 5 4 5 9s-1 9-5 9" stroke="#003399" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 3c-4 0-5 4-5 9s1 9 5 9" stroke="#003399" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 12h18" stroke="#003399" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 7c2 0 4 2 4 5s-2 5-4 5-4-2-4-5 2-5 4-5Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5" />
                  </svg>
                </span>
                <div className="mt-4">
                  <h3 className="font-heading text-slate-950 font-black text-base tracking-tight mb-2 group-hover:text-blue-900 transition-colors">
                    {locale === 'tr' ? 'Ekolojik Bilinç' : 'Consciência Ecológica'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {locale === 'tr' ? 'Sürdürülebilir kalkınma hedefleri doğrultusunda çevre bilincinin yaygınlaştırılması.' : 'Promoção da sensibilização ambiental em alinhamento com os objetivos de desenvolvimento sustentável.'}
                  </p>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-7 shadow-sm hover:shadow-[0_12px_24px_rgba(0,51,153,0.05)] transition-all flex flex-col justify-between min-h-[230px] cursor-default"
              >
                <span className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl text-accent-blue w-fit block">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#FFCC00" strokeWidth="1.5" strokeDasharray="3 3.5" className="opacity-80 group-hover:-rotate-45 transition-transform duration-700 origin-center" />
                    <path d="M5 12h14v7H5z" stroke="#003399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12V7h6v5" stroke="#003399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3v4" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="mt-4">
                  <h3 className="font-heading text-slate-950 font-black text-base tracking-tight mb-2 group-hover:text-blue-900 transition-colors">
                    {locale === 'tr' ? 'Aktif Vatandaşlık' : 'Cidadania Ativa'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {locale === 'tr' ? 'Gençlerin karar alma süreçlerine ve yerel topluluk hayatına aktif katılımı.' : 'Incentivo à participação ativa dos jovens nos processos de decisão e na vida comunitária local.'}
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <NetworkConnector />

        {/* Accreditations Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent-blue text-xs uppercase tracking-widest font-black block mb-2">
              {t('accreditationsTitle')}
            </span>
            <h2 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl tracking-tight">
              {locale === 'tr' ? 'Avrupa Düzeyinde Resmi Üyeliklerimiz' : 'As Nossas Filiações Oficiais a Nível Europeu'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Eurodesk */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-300/80 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[310px] cursor-default"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-slate-800 text-lg group-hover:text-accent-blue transition-colors">
                  {t('eurodeskTitle')}
                </h3>
                <p className="font-sans text-slate-500 text-xs leading-relaxed max-w-[260px]">
                  {t('eurodeskDesc')}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50/60 text-blue-600 border border-blue-100 rounded-full px-4 py-1.5 mt-4 transition-colors group-hover:bg-blue-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] uppercase font-black tracking-wider">EURODESK Multiplier</span>
              </div>
            </motion.div>

            {/* Anna Lindh */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-300/80 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[310px] cursor-default"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-slate-800 text-lg group-hover:text-amber-700 transition-colors">
                  {t('alfTitle')}
                </h3>
                <p className="font-sans text-slate-500 text-xs leading-relaxed max-w-[260px]">
                  {t('alfDesc')}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-amber-50/60 text-amber-700 border border-amber-100 rounded-full px-4 py-1.5 mt-4 transition-colors group-hover:bg-amber-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] uppercase font-black tracking-wider">Anna Lindh Member</span>
              </div>
            </motion.div>

            {/* ESC Quality Label */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-300/80 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[310px] cursor-default"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
                  {t('escAccredited')}
                </h3>
                <p className="font-sans text-slate-500 text-xs leading-relaxed max-w-[260px]">
                  {t('escAccreditedDesc')}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50/60 text-emerald-600 border border-emerald-100 rounded-full px-4 py-1.5 mt-4 transition-colors group-hover:bg-emerald-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase font-black tracking-wider">ESC Quality Label</span>
              </div>
            </motion.div>

          </div>
        </section>

        <NetworkConnector />

        {/* Dynamic Team Section */}
        <section className="bg-[#FAFAFC] border-t border-slate-200/80 text-slate-800 py-20 sm:py-24 relative overflow-hidden">
          
          {/* Animated geometric background orbit */}
          <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none flex items-center justify-center">
            <svg width="800" height="800" viewBox="0 0 100 100" fill="none" className="w-[120%] h-[120%] text-slate-900 animate-spin" style={{ animationDuration: '60s' }}>
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.08" strokeDasharray="1 3" />
              <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.04" strokeDasharray="2 4" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent-blue text-xs uppercase tracking-[0.2em] font-black block mb-2">
                {t('teamTitle')}
              </span>
              <h2 className="font-heading font-black text-slate-900 text-3xl sm:text-5xl tracking-tight leading-tight">
                {locale === 'tr' ? 'Değişim Yaratan' : 'A Equipa que Faz'}
                <span className="font-serif italic font-light text-accent-blue/90 block text-2xl sm:text-3.5xl mt-1.5 lowercase">
                  {locale === 'tr' ? 'dinamik ve profesyonel ekibimiz' : 'a nossa equipa dinâmica e profissional'}
                </span>
              </h2>
            </div>

            {/* Carousel Frame Wrapper */}
            <div className="relative w-full px-0 sm:px-12 md:px-16">
              
              {/* Chevron Navigation Controls */}
              <button
                onClick={handlePrev}
                className="absolute -left-2 sm:left-0 lg:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer z-20 hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute -right-2 sm:right-0 lg:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer z-20 hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Viewport */}
              <div className="w-full overflow-hidden">
                <div
                  className="flex gap-6 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`
                  }}
                >
                  {TEAM_MEMBERS.map((member) => {
                    const { role, bio } = getMemberDetails(member);
                    return (
                      <div
                        key={member.id}
                        className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0"
                      >
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200/80 hover:border-blue-500/30 aspect-[3/4] group shadow-sm flex flex-col justify-end p-6 min-h-[380px] select-none"
                        >
                          {/* Background Member Portrait Image */}
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />

                          {/* Fading bottom vignette overlay to keep name readable */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10 pointer-events-none" />

                          {/* Basic card name display (Overlay on vignette) */}
                          <div className="relative z-20 transition-transform duration-300 group-hover:-translate-y-4 text-left">
                            <h3 className="font-heading font-extrabold !text-white text-lg tracking-tight leading-tight">
                              {member.name}
                            </h3>
                            <span className="font-heading !text-blue-100/90 font-medium text-[11px] uppercase tracking-[0.08em] block mt-1.5">
                              {role}
                            </span>
                          </div>

                          {/* Interactive sliding overlay details drawer (Light theme style with staggered animations) */}
                          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 p-6 z-20 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between h-[68%] shadow-xl">
                            <div className="text-left">
                              <span className="font-heading text-[11px] !text-accent-blue font-extrabold uppercase tracking-[0.12em] block mb-1.5 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-[80ms]">
                                {role}
                              </span>
                              <h4 className="font-heading font-extrabold !text-slate-900 text-lg leading-tight mb-2.5 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-[130ms]">
                                {member.name}
                              </h4>
                              <p className="font-sans text-slate-500 text-[11px] leading-relaxed line-clamp-4 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-[180ms]">
                                {bio}
                              </p>
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex justify-center items-center gap-4 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-[230ms]">
                              <a
                                href={`mailto:${member.email}`}
                                className="w-10 h-10 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-accent-blue hover:text-white hover:border-accent-blue flex items-center justify-center text-slate-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
                                title={locale === 'tr' ? 'E-posta Gönder' : 'Enviar E-mail'}
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              
                              <a
                                href={member.linkedin}
                                className="w-10 h-10 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] flex items-center justify-center text-[#0A66C2] hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
                                title="LinkedIn"
                              >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            </div>
                          </div>

                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Custom Carousel Scrollbar Progress Indicator */}
            <div className="w-full max-w-[200px] h-[3px] bg-slate-200 rounded-full mx-auto mt-12 overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 bg-accent-blue transition-all duration-300 rounded-full"
                style={{
                  width: `${(visibleCards / TEAM_MEMBERS.length) * 100}%`,
                  left: `${(currentIndex / TEAM_MEMBERS.length) * 100}%`
                }}
              />
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
