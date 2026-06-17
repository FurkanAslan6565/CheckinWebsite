import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import { getAdminTranslations } from "@/lib/admin-i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminTranslations("meta");
  return { title: t("loginTitle") };
}

export default async function AdminLoginPage() {
  const t = await getAdminTranslations("login");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0E1A]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--accent-blue))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--european-blue))]/15 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <AdminLocaleSwitcher variant="login" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/Logos/Check-IN/SVG/Check-IN_Logotipo_Cor.svg" alt="Check-IN Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">{t("subtitle")}</p>
        </div>

        <div className="glass-panel-light rounded-2xl p-8 shadow-2xl">
          <Suspense
            fallback={
              <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
