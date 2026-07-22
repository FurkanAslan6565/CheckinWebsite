"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";
import { 
  X, 
  ExternalLink, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2 
} from "lucide-react";
import { type FormField } from "@/components/admin/FormBuilder";
import { motion, AnimatePresence } from "framer-motion";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  motivation: string;
  cvUrl: string | null;
  status: string;
  createdAt: string;
  answers: Record<string, unknown>;
  opportunity: { title: string; slug: string };
}

const statusVariant = (status: string) => {
  if (status === "ACCEPTED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
};

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Custom form fields loaded dynamically for selected app
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);

  const t = useTranslations("admin.applications");
  const tCommon = useTranslations("admin.common");
  const tStatus = useTranslations("admin.status.application");

  // Sync selected application with URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id && applications.length > 0) {
        const matched = applications.find((a) => a.id === id);
        if (matched) {
          setSelectedApp(matched);
        }
      }
    }
  }, [applications]);

  useEffect(() => {
    if (selectedApp) {
      setIsLoadingFields(true);
      fetch(`/api/opportunities/${selectedApp.opportunity.slug}/form`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setFormFields(data || []))
        .catch(() => setFormFields([]))
        .finally(() => setIsLoadingFields(false));
    } else {
      setFormFields([]);
    }
  }, [selectedApp]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Refresh router first
        router.refresh();
        // Update selected app state if open
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(tCommon("confirmDelete"))) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedApp(null);
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <DataTable
        data={applications}
        keyExtractor={(a) => a.id}
        emptyMessage={t("empty")}
        onRowClick={(a) => setSelectedApp(a)}
        columns={[
          {
            key: "name",
            header: t("table.candidate"),
            render: (a) => (
              <div>
                <p className="font-medium text-slate-900">
                  {a.firstName} {a.lastName}
                </p>
                <p className="text-xs text-slate-500">{a.email}</p>
              </div>
            ),
          },
          {
            key: "opportunity",
            header: t("table.opportunity"),
            render: (a) => (
              <span className="text-slate-600 text-sm">{a.opportunity.title}</span>
            ),
          },
          {
            key: "date",
            header: t("table.date"),
            render: (a) => (
              <span className="text-slate-500">
                {formatDate(a.createdAt, toIntlLocale(locale))}
              </span>
            ),
          },
          {
            key: "status",
            header: tCommon("status"),
            render: (a) => (
              <Badge variant={statusVariant(a.status)}>
                {tStatus(a.status as "PENDING")}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: tCommon("actions"),
            render: (a) => (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {a.status !== "ACCEPTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updating === a.id}
                    onClick={() => updateStatus(a.id, "ACCEPTED")}
                  >
                    {tCommon("accept")}
                  </Button>
                )}
                {a.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    isLoading={updating === a.id}
                    onClick={() => updateStatus(a.id, "REJECTED")}
                  >
                    {tCommon("reject")}
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />

      {/* Details Overlay Drawer / Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl relative z-10"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[hsl(var(--accent-blue))] block mb-1">
                    {t("detailsTitle")}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* Target Opportunity */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">{t("appliedOpportunity")}</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedApp.opportunity.title}</span>
                  </div>
                  <Badge variant={statusVariant(selectedApp.status)}>
                    {tStatus(selectedApp.status as "PENDING")}
                  </Badge>
                </div>

                {/* Grid: Candidate Info & Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("contactInfo")}</h4>
                    
                    <div className="flex items-center gap-3 text-slate-700 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${selectedApp.email}`} className="hover:text-[hsl(var(--accent-blue))] underline">
                        {selectedApp.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${selectedApp.phone}`} className="hover:text-[hsl(var(--accent-blue))] underline">
                        {selectedApp.phone}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("otherInfo")}</h4>

                    <div className="flex items-center gap-3 text-slate-700 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{t("birthDate")}: {selectedApp.birthDate}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{t("applyDate")}: {formatDate(selectedApp.createdAt, toIntlLocale(locale))}</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Custom Questions Responses */}
                <div className="border-b border-slate-100 pb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">{t("customQuestions")}</h4>
                  {isLoadingFields ? (
                    <p className="text-xs text-slate-400 italic">{t("loadingFields")}</p>
                  ) : formFields.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">{t("noCustomQuestions")}</p>
                  ) : (
                    <div className="space-y-4">
                      {formFields.map((field) => {
                        const ans = selectedApp.answers[field.id];
                        return (
                          <div key={field.id} className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-500 block mb-1">{field.label}</span>
                            <span className="text-xs text-slate-800 font-medium">
                              {typeof ans === "boolean" 
                                ? (ans ? t("yes") : t("no")) 
                                : (ans ? String(ans) : "-")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Motivation Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("motivation")}</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.motivation}
                  </div>
                </div>

                {/* CV Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("cv")}</h4>
                  {selectedApp.cvUrl ? (
                    <a
                      href={selectedApp.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold text-xs px-5 py-3 rounded-full hover:bg-slate-700 transition-colors"
                    >
                      {t("viewCv")}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">{t("noCv")}</span>
                  )}
                </div>

              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 flex items-center gap-1.5"
                  isLoading={deleting === selectedApp.id}
                  onClick={() => handleDelete(selectedApp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("deleteApp")}
                </Button>

                <div className="flex gap-3">
                  {selectedApp.status !== "ACCEPTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={updating === selectedApp.id}
                      onClick={() => updateStatus(selectedApp.id, "ACCEPTED")}
                    >
                      {tCommon("accept")}
                    </Button>
                  )}
                  {selectedApp.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      isLoading={updating === selectedApp.id}
                      onClick={() => updateStatus(selectedApp.id, "REJECTED")}
                    >
                      {tCommon("reject")}
                    </Button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
