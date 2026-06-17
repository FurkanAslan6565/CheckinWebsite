"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Role } from "@prisma/client";
import { useTranslations } from "next-intl";

const ROLE_KEYS: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "PROJECT_MANAGER",
];

interface UserFormProps {
  initialData?: {
    id?: string;
    name?: string;
    email?: string;
    role?: Role;
  };
  currentUserRole: Role;
}

export default function UserForm({ initialData, currentUserRole }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const t = useTranslations("admin.users.form");
  const tCommon = useTranslations("admin.common");
  const tRoles = useTranslations("admin.roles");

  const ROLE_OPTIONS = ROLE_KEYS.map((value) => ({
    value,
    label: tRoles(value),
  }));

  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "EDITOR",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const availableRoles = ROLE_OPTIONS.filter(
    (r) => currentUserRole === "SUPER_ADMIN" || r.value !== "SUPER_ADMIN"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isEditing && !form.password) {
      setError(t("passwordRequired"));
      setIsLoading(false);
      return;
    }

    try {
      const url = isEditing
        ? `/api/admin/users/${initialData!.id}`
        : "/api/admin/users";
      const method = isEditing ? "PUT" : "POST";

      const payload = { ...form };
      if (isEditing && !form.password) {
        delete (payload as { password?: string }).password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || tCommon("saveError"));
      }

      router.push("/admin/settings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("saveError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label={t("email")}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label={isEditing ? t("passwordOptional") : t("password")}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!isEditing}
          />
          <Select
            label={t("role")}
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as Role })
            }
            options={availableRoles}
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? tCommon("save") : t("createButton")}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            {tCommon("cancel")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
