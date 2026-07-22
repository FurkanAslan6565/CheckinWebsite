import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import MessagesTable from "@/components/admin/tables/MessagesTable";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  
  // Only Super Admins and Admins can manage contact messages
  const userRole = session.user.role;
  if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") redirect("/admin");

  const t = await getAdminTranslations("messagesPage");

  const messages = await prisma.contactMessage.findMany({
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
        <MessagesTable
          messages={messages.map((msg) => ({
            ...msg,
            createdAt: msg.createdAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
