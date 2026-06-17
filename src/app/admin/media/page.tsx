import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageGallery } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageGallery(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("media");

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
        />
        <MediaLibrary
          initialAssets={assets.map((a) => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
