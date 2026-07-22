"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  FileText, 
  Check, 
  AlertCircle 
} from "lucide-react";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number" | "date";
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  opportunityId: string;
}

export default function FormBuilder({ opportunityId }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    async function loadForm() {
      try {
        const res = await fetch(`/api/admin/opportunities/${opportunityId}/form`);
        if (res.ok) {
          const data = await res.json();
          setFields(data || []);
        }
      } catch (err) {
        console.error("Failed to load form fields:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadForm();
  }, [opportunityId]);

  function addField() {
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      label: "Yeni Soru / New Question",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
    setSaveStatus("idle");
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
    setSaveStatus("idle");
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setFields(
      fields.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, ...updates };
        // Clean options if type is not select
        if (updates.type && updates.type !== "select") {
          delete updated.options;
        }
        return updated;
      })
    );
    setSaveStatus("idle");
  }

  function moveField(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
    setSaveStatus("idle");
  }

  async function handleSave() {
    setIsSaving(true);
    setErrorMsg("");
    setSaveStatus("idle");

    try {
      const res = await fetch(`/api/admin/opportunities/${opportunityId}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setErrorMsg("Form kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="mt-8 p-8 flex items-center justify-center text-slate-500 text-sm">
        Form Tasarımcısı Yükleniyor...
      </Card>
    );
  }

  return (
    <Card className="mt-8 p-6 md:p-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 mt-0.5">
            <FileText className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Başvuru Formu Tasarımcısı</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standart aday bilgilerine (Ad, E-posta vb.) ek olarak bu fırsata başvuracak kişilerden toplayacağınız soruları tasarlayın.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={addField}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Soru Ekle
        </Button>
      </div>

      {/* Field List */}
      {fields.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center">
          <FileText className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">Özel Soru Eklenmedi</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Başvuru formuna özel soru eklemek için yukarıdaki &quot;Soru Ekle&quot; butonunu kullanabilirsiniz. Eklenmeyen durumlarda sadece standart başvuru formu alanları gösterilecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col lg:flex-row gap-4 lg:items-end justify-between hover:border-slate-200 hover:bg-slate-50 transition-all"
            >
              {/* Form Controls */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Soru Başlığı */}
                <div className="sm:col-span-6">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Soru Başlığı (Label)</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[hsl(var(--accent-blue))]"
                    placeholder="Örn: Neden bu projeye başvuruyorsunuz?"
                  />
                </div>

                {/* Soru Tipi */}
                <div className="sm:col-span-3">
                  <Select
                    label="Yanıt Tipi (Type)"
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                    options={[
                      { value: "text", label: "Kısa Metin" },
                      { value: "textarea", label: "Uzun Metin (Textarea)" },
                      { value: "select", label: "Açılır Liste (Dropdown)" },
                      { value: "checkbox", label: "Onay Kutusu (Checkbox)" },
                      { value: "number", label: "Sayısal Değer" },
                      { value: "date", label: "Tarih Seçici" },
                    ]}
                  />
                </div>

                {/* Zorunlu mu? */}
                <div className="sm:col-span-3 flex items-center h-full pb-3.5 pl-1 sm:pl-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[hsl(var(--accent-blue))] focus:ring-[hsl(var(--accent-blue))]"
                    />
                    <span className="text-xs font-semibold text-slate-600">Zorunlu Alan</span>
                  </label>
                </div>

                {/* Options list (Only for select type) */}
                {field.type === "select" && (
                  <div className="col-span-12 border-t border-slate-100 pt-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Seçenekler (Virgülle ayırarak yazın)
                    </label>
                    <input
                      type="text"
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => 
                        updateField(field.id, { 
                          options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[hsl(var(--accent-blue))]"
                      placeholder="Seçenek A, Seçenek B, Seçenek C"
                    />
                  </div>
                )}
              </div>

              {/* Order & Action Controls */}
              <div className="flex lg:flex-col items-center gap-2 justify-end pt-2 border-t border-slate-100 lg:border-t-0 lg:pt-0 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveField(index, "up")}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    title="Yukarı Taşı"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, "down")}
                    disabled={index === fields.length - 1}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    title="Aşağı Taşı"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
                  title="Soruyu Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Area */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100 justify-end">
        {saveStatus === "success" && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
            <Check className="w-4 h-4" /> Değişiklikler kaydedildi!
          </span>
        )}
        {saveStatus === "error" && (
          <span className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </span>
        )}
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isSaving}
          className="flex items-center gap-1.5 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Form Alanlarını Kaydet
        </Button>
      </div>
    </Card>
  );
}
