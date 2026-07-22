"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const t = useTranslations("admin.login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errors.invalid"));
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3.5 top-[2.65rem] w-4 h-4 text-slate-400" />
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@checkin.org.pt"
          required
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3.5 top-[2.65rem] w-4 h-4 text-slate-400" />
        <Input
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="pl-10"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        {t("submit")}
      </Button>
    </form>
  );
}
