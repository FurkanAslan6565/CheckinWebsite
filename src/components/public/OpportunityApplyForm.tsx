'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, ArrowLeft, ArrowRight, Loader2, Home } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Opportunity as DbOpportunity } from '@prisma/client';
import { type FormField } from '@/components/admin/FormBuilder';

// Dynamic expressive SVG Mascot representing Mert (The Hipster Character) with fluid animations
interface MascotProps {
  state: 'welcome' | 'typing' | 'success' | 'warning' | 'thinking';
}

function Mascot({ state }: MascotProps) {
  // Common transition configuration for seamless loops
  const duration = state === 'success' ? 0.8 : state === 'typing' ? 0.4 : state === 'warning' ? 0.3 : 2.0;

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <svg viewBox="0 0 200 240" className="w-48 h-56 select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
        <defs>
          {/* Yellow and Blue vertical stripes pattern for Mert's shirt */}
          <pattern id="stripes" width="16" height="20" patternUnits="userSpaceOnUse">
            <rect width="8" height="20" fill="#fbbf24" /> {/* Yellow */}
            <rect x="8" width="8" height="20" fill="#3b82f6" /> {/* Blue */}
          </pattern>
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
          {/* Soft drop shadow for character parts */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.06"/>
          </filter>
        </defs>

        {/* Dancing/Bouncing Legs & Shoes */}
        <g id="lower-body" filter="url(#shadow)">
          {/* Left Leg */}
          <motion.g
            style={{ originX: "83px", originY: "176px" }}
            animate={
              state === 'success'
                ? { rotate: [-10, 10, -10], y: [0, -3, 0] }
                : state === 'warning'
                ? { x: [-0.5, 0.5, -0.5] }
                : { rotate: 0 }
            }
            transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
          >
            <path d="M 72 176 L 74 224 L 88 224 L 92 176 Z" fill="#475569" />
            <rect x="65" y="222" width="24" height="12" rx="6" fill="#78350f" />
          </motion.g>

          {/* Right Leg */}
          <motion.g
            style={{ originX: "117px", originY: "176px" }}
            animate={
              state === 'success'
                ? { rotate: [10, -10, 10], y: [0, -3, 0] }
                : state === 'warning'
                ? { x: [0.5, -0.5, 0.5] }
                : { rotate: 0 }
            }
            transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
          >
            <path d="M 108 176 L 112 224 L 126 224 L 128 176 Z" fill="#475569" />
            <rect x="110" y="222" width="24" height="12" rx="6" fill="#78350f" />
          </motion.g>
        </g>

        {/* Belt */}
        <rect x="70" y="170" width="60" height="7" fill="#5c2c16" />
        <rect x="94" y="168" width="12" height="11" fill="#eab308" rx="2" /> {/* Buckle */}

        {/* Torso & Arms (Bounces and sways) */}
        <motion.g
          style={{ originX: "100px", originY: "170px" }}
          animate={
            state === 'success'
              ? { y: [0, -10, 2, -10, 0], rotate: [-6, 6, -6] }
              : state === 'typing'
              ? { y: [0, 1, 0], rotate: [0.5, -0.5, 0.5] }
              : state === 'warning'
              ? { x: [-1, 1, -1, 1, -1], y: [-0.5, 0.5, -0.5] }
              : state === 'thinking'
              ? { y: [0, -2, 0], rotate: [-1, 1, -1] }
              : { y: [0, -3, 0], rotate: [-1, 1, -1] }
          }
          transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
        >
          {/* Torso / Striped Shirt */}
          <path d="M 70 115 L 130 115 L 130 172 L 70 172 Z" fill="url(#stripes)" filter="url(#shadow)" />
          {/* Collar */}
          <path d="M 85 115 L 100 127 L 115 115 Z" fill="#2563eb" />

          {/* Left Arm */}
          <motion.g
            style={{ originX: "72px", originY: "120px" }}
            animate={
              state === 'success'
                ? { rotate: [-150, -80, -150], scaleY: [1, 1.1, 1] }
                : state === 'typing'
                ? { rotate: [-30, -50, -30], y: [0, -2, 0] }
                : state === 'thinking'
                ? { rotate: [-120, -110, -120] } // Scratching head/chin
                : state === 'warning'
                ? { rotate: [-110, -115, -110] } // Covering/worrying
                : { rotate: [0, -15, 0] }
            }
            transition={{ repeat: Infinity, duration: state === 'typing' ? 0.4 : duration, ease: "easeInOut" }}
          >
            <path d="M 72 120 C 50 120, 42 90, 48 80" fill="none" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />
            <path d="M 72 120 C 50 120, 42 90, 48 80" fill="none" stroke="url(#stripes)" strokeWidth="10" strokeLinecap="round" />
            <circle cx="48" cy="80" r="7" fill="#fed7aa" />
          </motion.g>

          {/* Right Arm */}
          <motion.g
            style={{ originX: "128px", originY: "120px" }}
            animate={
              state === 'success'
                ? { rotate: [150, 80, 150], scaleY: [1, 1.1, 1] }
                : state === 'typing'
                ? { rotate: [30, 50, 30], y: [0, -2, 0] }
                : state === 'warning'
                ? { rotate: [110, 115, 110] } // Covering/worrying
                : state === 'welcome'
                ? { rotate: [0, -50, -20, -50, 0] } // Waving hello
                : { rotate: [0, 15, 0] }
            }
            transition={{ repeat: Infinity, duration: state === 'typing' ? 0.5 : duration, ease: "easeInOut" }}
          >
            <path d="M 128 120 C 150 120, 158 90, 152 80" fill="none" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />
            <path d="M 128 120 C 150 120, 158 90, 152 80" fill="none" stroke="url(#stripes)" strokeWidth="10" strokeLinecap="round" />
            <circle cx="152" cy="80" r="7" fill="#fed7aa" />
          </motion.g>

          {/* Head & Neck (with bouncy secondary motion) */}
          <motion.g
            style={{ originX: "100px", originY: "115px" }}
            animate={
              state === 'success'
                ? { y: [0, -5, 0], rotate: [5, -5, 5] }
                : state === 'typing'
                ? { y: [0, 2, 0], rotate: [1, -1, 1] }
                : state === 'thinking'
                ? { rotate: [8, 12, 8], y: [0, -1, 0] }
                : state === 'warning'
                ? { x: [-1.5, 1.5, -1.5], rotate: [-2, 2, -2] }
                : { y: [0, -1.5, 0], rotate: [1, -1, 1] }
            }
            transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
          >
            {/* Neck */}
            <rect x="94" y="98" width="12" height="18" fill="#fed7aa" />

            {/* Ears */}
            <circle cx="68" cy="74" r="7" fill="#fed7aa" />
            <circle cx="132" cy="74" r="7" fill="#fed7aa" />

            {/* Head Shape */}
            <rect x="70" y="46" width="60" height="56" rx="20" fill="#fed7aa" filter="url(#shadow)" />

            {/* Slick Back Undercut Hair */}
            <path d="M 68 50 C 68 30, 132 30, 132 50 L 132 58 L 68 58 Z" fill="#1e293b" />
            {/* Sideburns */}
            <path d="M 70 54 L 73 66 L 76 54 Z" fill="#1e293b" />
            <path d="M 130 54 L 127 66 L 124 54 Z" fill="#1e293b" />

            {/* Glasses */}
            <g id="glasses">
              {/* Bridge */}
              <rect x="92" y="65" width="16" height="3" fill="#1e293b" />
              {/* Left frame */}
              <rect x="74" y="58" width="19" height="15" rx="3" fill="none" stroke="#1e293b" strokeWidth="3.5" />
              <rect x="75" y="59" width="17" height="13" rx="2" fill="url(#lensGrad)" />
              {/* Right frame */}
              <rect x="107" y="58" width="19" height="15" rx="3" fill="none" stroke="#1e293b" strokeWidth="3.5" />
              <rect x="108" y="59" width="17" height="13" rx="2" fill="url(#lensGrad)" />
              {/* Glasses temples */}
              <line x1="74" y1="65" x2="68" y2="62" stroke="#1e293b" strokeWidth="3" />
              <line x1="126" y1="65" x2="132" y2="62" stroke="#1e293b" strokeWidth="3" />
            </g>

            {/* Eyes behind glasses */}
            <motion.g
              id="eyes"
              animate={
                state === 'thinking'
                  ? { y: [-2, -2, -2], x: [1.5, -1.5, 1.5] }
                  : state === 'typing'
                  ? { y: [1.5, 1.5, 1.5] }
                  : { y: 0, x: 0 }
              }
              transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
            >
              {/* Left Eye */}
              <motion.circle
                cx="83"
                cy="65"
                r="2"
                fill="#111827"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.92, 0.94, 1] }}
              />
              {/* Right Eye */}
              <motion.circle
                cx="116"
                cy="65"
                r="2"
                fill="#111827"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.92, 0.94, 1] }}
              />
            </motion.g>

            {/* Mustache (wiggles slightly) */}
            <motion.path
              d="M 88 80 C 88 80, 94 77, 100 80 C 106 77, 112 80, 112 80 C 114 84, 108 84, 100 83 C 92 84, 88 80, 88 80 Z"
              fill="#1e293b"
              animate={
                state === 'success'
                  ? { rotate: [-10, 10, -10], scale: 1.1 }
                  : state === 'warning'
                  ? { y: [0.5, -0.5, 0.5] }
                  : { scaleX: [1, 1.05, 1], rotate: [-2, 2, -2] }
              }
              transition={{ repeat: Infinity, duration: duration }}
            />

            {/* Mouth */}
            <motion.path
              d={
                state === 'success'
                  ? "M 94 88 Q 100 97 106 88" // Happy open laugh
                  : state === 'warning'
                  ? "M 96 92 Q 100 87 104 92" // Worried down-curve
                  : state === 'typing'
                  ? "M 97 89 H 103" // Focused straight line
                  : "M 95 87 Q 100 93 105 87" // Soft smile
              }
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}

interface OpportunityApplyFormProps {
  opportunity: DbOpportunity;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 150 : -150,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 150 : -150,
    opacity: 0
  })
};

export default function OpportunityApplyForm({ opportunity }: OpportunityApplyFormProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    motivation: "",
    cvUrl: "",
  });
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [direction, setDirection] = useState(1);

  const tForm = useTranslations('form');
  const locale = useLocale();

  // Load custom dynamic fields
  useEffect(() => {
    setIsLoadingForm(true);
    fetch(`/api/opportunities/${opportunity.id}/form`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFormFields(data || []))
      .catch((err) => {
        console.error("Error loading fields:", err);
        setFormFields([]);
      })
      .finally(() => setIsLoadingForm(false));
  }, [opportunity.id]);

  const totalSlides = 5 + formFields.length;

  const handleNext = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();

    // Step verification
    if (currentStep === 0) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setFormError(tForm('required_fields_error') || "Lütfen tüm zorunlu alanları doldurun.");
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.email.trim()) {
        setFormError(tForm('required_fields_error') || "Lütfen tüm zorunlu alanları doldurun.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setFormError(tForm('invalid_email_error') || "Lütfen geçerli bir e-posta adresi girin.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.phone.trim() || !formData.birthDate) {
        setFormError(tForm('required_fields_error') || "Lütfen tüm zorunlu alanları doldurun.");
        return;
      }
    } else if (currentStep >= 3 && currentStep < 3 + formFields.length) {
      const field = formFields[currentStep - 3];
      if (field.required && !answers[field.id]) {
        setFormError(tForm('required_fields_error') || "Lütfen bu alanı doldurun.");
        return;
      }
    } else if (currentStep === 3 + formFields.length) {
      if (!formData.motivation.trim() || formData.motivation.length < 10) {
        setFormError(formData.motivation.length < 10 && formData.motivation.trim().length > 0
          ? (locale === 'tr' ? "Motivasyon mektubu en az 10 karakter olmalıdır." : "A carta de motivação deve ter pelo menos 10 caracteres.")
          : (tForm('required_fields_error') || "Lütfen tüm zorunlu alanları doldurun."));
        return;
      }
    }

    setFormError("");
    setDirection(1);

    if (currentStep === 4 + formFields.length) {
      handleApplySubmit();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSlides - 1));
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setFormError("");
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleApplySubmit = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch('/api/opportunities/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          opportunityTitle: opportunity.title,
          ...formData,
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setFormSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Başvuru gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMascotState = () => {
    if (formSubmitted) return 'success';
    if (isSubmitting || isLoadingForm) return 'thinking';
    if (formError) return 'warning';
    if (isTyping) return 'typing';
    return 'welcome';
  };

  const getBubbleMessage = () => {
    if (formSubmitted) return locale === 'tr' ? "Harika! Başvurun başarıyla gönderildi." : "Incrível! A tua candidatura foi enviada com sucesso.";
    if (formError) return locale === 'tr' ? "Hoppala! Bilgilerde bir eksik var." : "Ups! Há um pequeno erro nos teus dados.";
    if (isSubmitting) return locale === 'tr' ? "Başvurunu gönderiyorum..." : "A submeter a tua candidatura...";
    if (isLoadingForm) return locale === 'tr' ? "Form yükleniyor..." : "A carregar o formulário...";

    switch (currentStep) {
      case 0:
        return locale === 'tr' ? "Merhaba! Seninle tanışalım, ismin nedir?" : "Olá! Vamos conhecer-nos, qual é o teu nome?";
      case 1:
        return locale === 'tr' ? "Memnun oldum! E-posta adresini yazar mısın?" : "Prazer! Podes indicar o teu e-mail?";
      case 2:
        return locale === 'tr' ? "Harika! Doğum tarihini ve telefonunu ekleyebilir misin?" : "Boa! Podes introduzir a tua data de nascimento e telefone?";
      case 3 + formFields.length:
        return locale === 'tr' ? "Bu fırsata neden katılmak istersin? Motivasyonunu anlat." : "Qual é a tua motivação para participar nesta oportunidade?";
      case 4 + formFields.length:
        return locale === 'tr' ? "Son adım! Özgeçmiş (CV) linkini ekleyip gönderebilirsin." : "Último passo! Podes adicionar o link do teu CV e submeter.";
      default:
        if (currentStep >= 3 && currentStep < 3 + formFields.length) {
          const field = formFields[currentStep - 3];
          return locale === 'tr' ? `Önemli bir soru: ${field.label}` : `Uma questão importante: ${field.label}`;
        }
        return locale === 'tr' ? "Hadi devam edelim!" : "Vamos continuar!";
    }
  };

  const confettiArray = useMemo(() => {
    const CONFETTI_COLORS = ["#3b82f6", "#eab308", "#10b981", "#ec4899", "#8b5cf6", "#f97316"];
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -30 - 15,
      size: Math.random() * 10 + 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.0,
      duration: Math.random() * 2.0 + 1.2,
      angle: Math.random() * 360,
    }));
  }, []);

  const renderStep0 = () => (
    <div className="space-y-4">
      <h4 className="text-slate-900 font-bold text-lg mb-2">
        {locale === 'tr' ? "Adınız ve Soyadınız" : "O teu Nome e Apelido"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">{tForm('name')} *</label>
          <input
            required
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Rita"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">{tForm('surname')} *</label>
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Silva"
          />
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h4 className="text-slate-900 font-bold text-lg mb-2">
        {locale === 'tr' ? "E-posta Adresiniz" : "O teu Endereço de E-mail"}
      </h4>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">{tForm('email')} *</label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          placeholder="rita@exemplo.com"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h4 className="text-slate-900 font-bold text-lg mb-2">
        {locale === 'tr' ? "İrtibat Bilgileri" : "Informações de Contacto"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">{tForm('phone')} *</label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="+351 912 345 678"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
            {tForm('birth_date') || "Doğum Tarihi"} *
          </label>
          <input
            required
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [color-scheme:light] shadow-sm transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderCustomStep = (index: number) => {
    const field = formFields[index];
    if (!field) return null;

    return (
      <div className="space-y-4">
        <h4 className="text-slate-900 font-bold text-lg mb-2 leading-snug">
          {field.label} {field.required && "*"}
        </h4>
        <div>
          {field.type === "text" && (
            <input
              required={field.required}
              type="text"
              value={(answers[field.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              required={field.required}
              rows={4}
              value={(answers[field.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none shadow-sm transition-all"
            />
          )}

          {field.type === "select" && (
            <select
              required={field.required}
              value={(answers[field.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            >
              <option value="" className="text-slate-400">Seçiniz / Selecione...</option>
              {field.options?.map((opt: string) => (
                <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>
              ))}
            </select>
          )}

          {field.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer py-2">
              <input
                required={field.required}
                type="checkbox"
                checked={!!answers[field.id]}
                onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-700">
                {locale === 'tr' ? "Onaylıyorum" : "Confirmo"}
              </span>
            </label>
          )}

          {field.type === "number" && (
            <input
              required={field.required}
              type="number"
              value={(answers[field.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            />
          )}

          {field.type === "date" && (
            <input
              required={field.required}
              type="date"
              value={(answers[field.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [color-scheme:light] shadow-sm transition-all"
            />
          )}
        </div>
      </div>
    );
  };

  const renderStepMotivation = () => (
    <div className="space-y-4">
      <h4 className="text-slate-900 font-bold text-lg mb-2">
        {locale === 'tr' ? "Motivasyon Mektubunuz" : "A tua Carta de Motivação"}
      </h4>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
          {tForm('motivation')} *
        </label>
        <textarea
          required
          rows={5}
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none shadow-sm transition-all"
          placeholder={locale === 'tr' ? "Neden bu fırsata katılmak istediğinizi açıklayın..." : "Explica porque queres participar nesta oportunidade..."}
        />
      </div>
    </div>
  );

  const renderStepCV = () => (
    <div className="space-y-4">
      <h4 className="text-slate-900 font-bold text-lg mb-2">
        {locale === 'tr' ? "Özgeçmiş ve Gönderim" : "CV e Submissão"}
      </h4>

      <div>
        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
          {tForm('cv_link_label') || "Özgeçmiş (CV) Bağlantısı"}
        </label>
        <input
          type="url"
          value={formData.cvUrl}
          onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          placeholder="https://drive.google.com/..."
        />
        <span className="text-[9px] text-slate-400 mt-1.5 block leading-relaxed">
          {tForm('cv_link_hint') || "* CV belgenizin Google Drive, Dropbox veya LinkedIn bağlantısını ekleyebilirsiniz."}
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-600 leading-relaxed">
          {tForm('warning') || "Göndermeden önce lütfen tüm bilgilerinizi doğrulayın."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row min-h-[580px] border border-slate-200/60 my-6">
      {isLoadingForm ? (
        <div className="flex flex-col items-center justify-center w-full py-24 text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-sm text-slate-500">{locale === 'tr' ? "Form yükleniyor..." : "A carregar o formulário..."}</p>
        </div>
      ) : formSubmitted ? (
        <div className="relative w-full flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[580px] overflow-hidden bg-gradient-to-b from-blue-50/60 to-indigo-50/60">
          {/* Confetti Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
            {confettiArray.map((p) => (
              <div
                key={p.id}
                className="absolute animate-confetti rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  transform: `rotate(${p.angle}deg)`,
                }}
              />
            ))}
          </div>

          <Mascot state="success" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="z-10 mt-4 max-w-md"
          >
            <h4 className="text-slate-900 font-black text-2xl tracking-tight mb-3">
              {tForm('success_title') || "Candidatura Submetida!"}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {tForm('success_desc') || "Agradecemos o teu interesse. Entraremos em contacto brevemente."}
            </p>
            <Link
              href="/"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 max-w-[240px] mx-auto"
            >
              <Home className="w-4 h-4" />
              {locale === 'tr' ? "Ana Sayfaya Dön" : "Voltar ao Início"}
            </Link>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Left Pane (Mascot & Progress) */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-6 md:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
            {/* Header info */}
            <div className="w-full text-center md:text-left mb-6">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-600 block mb-1">
                {tForm('title') || "Candidatura"}
              </span>
              <h3 className="font-heading font-black text-slate-800 text-base md:text-lg leading-snug line-clamp-2">
                {opportunity.title}
              </h3>
            </div>

            {/* Mascot and Bubble */}
            <div className="flex flex-col items-center justify-center my-auto relative w-full py-4">
              {/* Speech Bubble */}
              <motion.div
                key={`bubble-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative mb-6 bg-white border border-slate-200/80 text-slate-700 text-[11px] py-2.5 px-4 rounded-2xl max-w-[220px] text-center shadow-md"
              >
                <p className="leading-relaxed font-semibold">{getBubbleMessage()}</p>
                {/* Caret pointing down at mascot */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-slate-200 -z-10" />
              </motion.div>

              {/* Mascot component */}
              <Mascot state={getMascotState()} />
            </div>

            {/* Progress display */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 px-1">
                <span>{locale === 'tr' ? "İlerleme" : "Progresso"}</span>
                <span>
                  {Math.round(((currentStep + 1) / totalSlides) * 100)}%
                </span>
              </div>
              {/* Bar indicator */}
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / totalSlides) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-center text-[10px] text-slate-500 font-bold mt-1">
                {locale === 'tr' ? `Soru ${currentStep + 1} / ${totalSlides}` : `Questão ${currentStep + 1} / ${totalSlides}`}
              </div>
            </div>
          </div>

          {/* Right Pane (Active Slide Content & Buttons) */}
          <div className="w-full md:w-7/12 bg-slate-50/30 p-6 md:p-8 flex flex-col justify-between overflow-hidden relative min-h-[420px] md:min-h-0">
            {/* Error Box (placed at the top) */}
            <div className="absolute top-6 left-6 right-6 z-20">
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex gap-2 shadow-lg"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{formError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Question Content Area */}
            <div className="flex-1 flex flex-col justify-center pt-8 pb-4">
              <form onSubmit={handleNext} className="w-full">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`slide-${currentStep}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    className="space-y-4"
                  >
                    {/* RENDER STEP CONTENT */}
                    {currentStep === 0 && renderStep0()}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep >= 3 && currentStep < 3 + formFields.length && renderCustomStep(currentStep - 3)}
                    {currentStep === 3 + formFields.length && renderStepMotivation()}
                    {currentStep === 4 + formFields.length && renderStepCV()}
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/80 mt-auto">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {tForm('back') || "Geri"}
                </button>
              ) : (
                <div /> // Spacer to keep Next aligned right
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 disabled:opacity-50"
              >
                {currentStep === 4 + formFields.length ? (
                  isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {tForm('submitting') || "Gönderiliyor..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      {tForm('submit') || "Gönder"}
                    </>
                  )
                ) : (
                  <>
                    {tForm('next') || "İleri"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
