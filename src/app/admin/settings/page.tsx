import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import { Card } from "@/components/ui/Card";
import { toIntlLocale } from "@/lib/admin-locale";
import { getAdminLocale } from "@/lib/admin-locale-server";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageUsers(session.user.role)) redirect("/admin");

  const locale = await getAdminLocale();
  const intlLocale = toIntlLocale(locale);
  const t = await getAdminTranslations("users");
  const tCommon = await getAdminTranslations("common");
  const tRoles = await getAdminTranslations("roles");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          projects: true,
          opportunities: true,
          newsArticles: true,
        },
      },
    },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
          createHref="/admin/settings/new"
          createLabel={t("createLabel")}
        />

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">
                    {t("table.user")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">
                    {t("table.role")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">
                    {t("table.content")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">
                    {t("table.since")}
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase">
                    {tCommon("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/settings/${user.id}`}
                        className="block"
                      >
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{tRoles(user.role)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user._count.projects}P · {user._count.opportunities}O ·{" "}
                      {user._count.newsArticles}N
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(user.createdAt, intlLocale)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.id !== session.user.id && (
                        <DeleteButton
                          endpoint={`/api/admin/users/${user.id}`}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
