import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageGallery } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminGalleryPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageGallery(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("gallery");

  const items = await prisma.galleryItem.findMany({
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
        <GalleryManager
          initialItems={items.map((i) => ({
            ...i,
            createdAt: i.createdAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
