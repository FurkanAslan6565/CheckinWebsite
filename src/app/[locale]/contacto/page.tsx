'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Globe, 
  Building, 
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const t = useTranslations('contactPage');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [activeCenter, setActiveCenter] = useState<'lisbon' | 'beja'>('lisbon');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedText, setCopiedText] = useState<'lisbon' | 'beja' | 'correspondence' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Limit message to 180 characters
    if (name === 'message' && value.length > 180) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text: string, type: 'lisbon' | 'beja' | 'correspondence') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // Prepare payload complying with existing database/API schema requirements
    const payload = {
      name: formData.name,
      email: formData.email,
      subject: 'İletişim Formu / Contact Form', // default subject to satisfy schema constraint
      message: formData.phone 
        ? `[Telefon: ${formData.phone}]\n\n${formData.message}` 
        : formData.message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit form.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  const centers = {
    lisbon: {
      name: 'Start UP Juventude – Fundação da Juventude',
      address: 'Campo Grande nº35, 2º andar, 1700-087 Lisboa – Portugal',
      mapUrl: 'https://maps.google.com/maps?q=Campo%20Grande%20n%C2%BA35%201700-087%20Lisboa%20Portugal&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    beja: {
      name: 'Center INPOWER – Beja',
      address: 'Rua Professor Janeiro Acabado, IPDJ IP, Casa da Associações, 7800 – 506 Beja',
      mapUrl: 'https://maps.google.com/maps?q=Rua%20Professor%20Janeiro%20Acabado%20Beja%20Portugal&t=&z=15&ie=UTF8&iwloc=&output=embed'
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC]">
      {/* Navbar with Light Variant */}
      <Navbar variant="light" />

      {/* Light Theme wrapper to match the style tokens and overrides */}
      <div className="theme-light bg-background text-foreground transition-colors duration-300">
        
        {/* Core Presentation Section */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-4 sm:pt-16 sm:pb-6">
          <div className="border-b border-slate-200/60 pb-8 space-y-4">
            <span className="text-accent-blue text-xs uppercase tracking-widest font-black block">
              {t('label')}
            </span>
            <h1 className="font-heading font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
              {t('title')}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t('desc')}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 px-6 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Map only, sticky so it stays visible while scrolling the form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            
            {/* Office Centers Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-6">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-accent-blue" />
                <h2 className="font-heading font-extrabold text-slate-900 text-lg uppercase tracking-wider">
                  {t('whereWeAre')}
                </h2>
              </div>

              {/* Tab Switcher Buttons */}
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 relative">
                <button
                  type="button"
                  onClick={() => setActiveCenter('lisbon')}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10 cursor-pointer ${
                    activeCenter === 'lisbon' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('lisbonCenter')}
                  {activeCenter === 'lisbon' && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute inset-0 bg-accent-blue rounded-xl -z-10 shadow-md shadow-accent-blue/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenter('beja')}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10 cursor-pointer ${
                    activeCenter === 'beja' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('bejaCenter')}
                  {activeCenter === 'beja' && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute inset-0 bg-accent-blue rounded-xl -z-10 shadow-md shadow-accent-blue/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              {/* Active Tab Panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCenter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <h3 className="font-heading font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                      {centers[activeCenter].name}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {centers[activeCenter].address}
                    </p>
                    
                    {/* Copy and Directions Bar */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100/80 mt-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(centers[activeCenter].address, activeCenter)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/60 hover:bg-slate-50 transition-colors text-[11px] font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        {copiedText === activeCenter ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centers[activeCenter].address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/60 hover:bg-slate-50 transition-colors text-[11px] font-semibold text-slate-600 hover:text-slate-800"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Directions
                      </a>
                    </div>
                  </div>

                  {/* Embed Map Frame */}
                  <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner relative group">
                    <iframe
                      title={`${centers[activeCenter].name} Map`}
                      src={centers[activeCenter].mapUrl}
                      className="w-full h-full border-0 absolute inset-0"
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.03)] relative overflow-hidden">
              
              {/* Decorative design highlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-blue/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* First Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {t('formFirstName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="given-name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('formFirstNamePlaceholder')}
                      disabled={status === 'sending'}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-accent-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] disabled:opacity-60 disabled:pointer-events-none"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {t('formEmail')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('formEmailPlaceholder')}
                      disabled={status === 'sending'}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-accent-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] disabled:opacity-60 disabled:pointer-events-none"
                    />
                  </div>
                </div>

                {/* Phone Number field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    {t('formPhone')} <span className="text-slate-400 font-normal">({useLocale() === 'tr' ? 'İsteğe Bağlı' : 'Opcional'})</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('formPhonePlaceholder')}
                    disabled={status === 'sending'}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-accent-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] disabled:opacity-60 disabled:pointer-events-none"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="message" className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {t('formMessage')} <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Character limit counter */}
                    <span className={`text-[10px] font-bold ${
                      formData.message.length >= 170 ? 'text-red-500 animate-pulse' : 'text-slate-400'
                    }`}>
                      {formData.message.length} / 180
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('formMessagePlaceholder')}
                    disabled={status === 'sending'}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-accent-blue focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] min-h-[140px] disabled:opacity-60 disabled:pointer-events-none resize-none"
                  />
                </div>

                {/* Submit button and feedback states */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-accent-blue hover:bg-accent-blue/95 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('formSending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('formSubmit')}
                      </>
                    )}
                  </button>
                </div>

                {/* Response messages */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-800 text-sm mt-4 shadow-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-extrabold block">{t('successTitle')}</strong>
                        <span className="text-xs text-emerald-700/90 leading-relaxed block mt-0.5">
                          {t('successDesc')}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-800 text-sm mt-4 shadow-sm"
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-extrabold block">{t('errorTitle')}</strong>
                        <span className="text-xs text-rose-700/90 leading-relaxed block mt-0.5">
                          {errorMessage || t('errorDesc')}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          </div>
        </section>

        {/* Full-width Contact Info Strip */}
        <section className="px-6 sm:px-8 pb-12 max-w-7xl mx-auto">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.02)] overflow-hidden">
            
            {/* Strip header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('officialContacts')}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('correspondenceAddress')}
              </span>
            </div>

            {/* 4-column horizontal grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <a
                href="tel:+351962429732"
                className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/70 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Phone</span>
                  <span className="text-slate-800 text-sm font-semibold">+351 962 429 732</span>
                </div>
              </a>

              <a
                href="mailto:info@checkin.org.pt"
                className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/70 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Email</span>
                  <span className="text-slate-800 text-sm font-semibold truncate block">info@checkin.org.pt</span>
                </div>
              </a>

              <a
                href="https://checkin.org.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/70 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Website</span>
                  <span className="text-slate-800 text-sm font-semibold">checkin.org.pt</span>
                </div>
              </a>

              <div className="flex items-center gap-4 px-6 py-5 bg-slate-50/50">
                <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Correspondence</span>
                  <p className="text-slate-800 text-sm font-semibold leading-snug">
                    Rua Campo de Tiro, nº 14<br />
                    <span className="text-slate-500 font-normal text-xs">7800 – 256 Beja</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Rua Campo de Tiro, nº 14, 7800 – 256 Beja', 'correspondence')}
                  className="flex items-center justify-center w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-700 cursor-pointer shadow-sm shrink-0"
                  title="Copy Address"
                >
                  {copiedText === 'correspondence' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

