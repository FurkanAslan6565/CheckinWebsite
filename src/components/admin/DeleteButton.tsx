"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface DeleteButtonProps {
  endpoint: string;
  redirectTo?: string;
  label?: string;
}

export default function DeleteButton({
  endpoint,
  redirectTo,
  label,
}: DeleteButtonProps) {
  const router = useRouter();
  const t = useTranslations("admin.common");
  const [isLoading, setIsLoading] = useState(false);
  const buttonLabel = label ?? t("delete");

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;

    setIsLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || t("deleteError"));
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      onClick={handleDelete}
      isLoading={isLoading}
      aria-label={buttonLabel || t("delete")}
    >
      <Trash2 className="w-4 h-4" />
      {buttonLabel}
    </Button>
  );
}
