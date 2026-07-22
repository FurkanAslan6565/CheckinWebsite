'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { formatDate } from '@/lib/utils';
import DeleteButton from '@/components/admin/DeleteButton';
import { useLocale, useTranslations } from 'next-intl';
import { toIntlLocale, type AdminLocale } from '@/lib/admin-locale';
import { Eye, X, Calendar, User, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function MessagesTable({ messages: initialMessages }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  const router = useRouter();
  const locale = useLocale() as AdminLocale;

  // Sync selected message with URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && messages.length > 0) {
        const matched = messages.find((msg) => msg.id === id);
        if (matched) {
          setSelectedMessage(matched);
        }
      }
    }
  }, [messages]);
  const t = useTranslations('admin.messagesPage');
  const tCommon = useTranslations('admin.common');

  const handleDeleteSuccess = (deletedId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
    if (selectedMessage?.id === deletedId) {
      setSelectedMessage(null);
    }
    router.refresh();
  };

  return (
    <>
      <DataTable
        data={messages}
        keyExtractor={(msg) => msg.id}
        onRowClick={(msg) => setSelectedMessage(msg)}
        emptyMessage={t('empty')}
        columns={[
          {
            key: 'name',
            header: t('table.sender'),
            render: (msg) => (
              <div>
                <p className="font-semibold text-slate-900">{msg.name}</p>
                <p className="text-xs text-slate-500">{msg.email}</p>
              </div>
            ),
          },
          {
            key: 'subject',
            header: t('table.subject'),
            render: (msg) => (
              <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{msg.subject}</p>
            ),
          },
          {
            key: 'message',
            header: t('table.message'),
            render: (msg) => (
              <p className="text-slate-500 text-xs line-clamp-1 max-w-md">{msg.message}</p>
            ),
          },
          {
            key: 'date',
            header: t('table.date'),
            render: (msg) => (
              <span className="text-slate-500 text-sm">
                {formatDate(msg.createdAt, toIntlLocale(locale))}
              </span>
            ),
          },
          {
            key: 'actions',
            header: '',
            className: 'w-24',
            render: (msg) => (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[hsl(var(--accent-blue))] hover:bg-slate-50 transition-colors"
                  title={t('viewMessage')}
                >
                  <Eye className="w-4.5 h-4.5" />
                </button>
                <DeleteButton
                  endpoint={`/api/admin/messages/${msg.id}`}
                  label=""
                  onSuccess={() => handleDeleteSuccess(msg.id)}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Message Reader Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-slate-100 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-accent-blue flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t('viewMessage')}
                  </span>
                  <h3 className="font-heading font-bold text-slate-900 text-lg leading-snug">
                    {selectedMessage.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 border border-slate-100/50">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">{t('table.sender')}</span>
                    <span className="text-slate-800 font-bold">{selectedMessage.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">{t('table.email')}</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-accent-blue font-bold hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">{t('table.date')}</span>
                    <span className="text-slate-800 font-bold">
                      {formatDate(selectedMessage.createdAt, toIntlLocale(locale))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {t('table.message')}
                </span>
                <p className="bg-slate-50/30 border border-slate-100 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <DeleteButton
                  endpoint={`/api/admin/messages/${selectedMessage.id}`}
                  label={tCommon('delete')}
                  onSuccess={() => handleDeleteSuccess(selectedMessage.id)}
                />
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
