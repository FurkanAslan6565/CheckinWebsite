import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canViewApplications } from "@/lib/permissions";
import { getSubmissions } from "@/lib/storage";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canViewApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { searchParams } = new URL(request.url);
  const opportunityId = searchParams.get("opportunityId");
  const status = searchParams.get("status");

  let submissions = getSubmissions(opportunityId || undefined);

  if (status) {
    submissions = submissions.filter(s => s.status === status);
  }

  // Format to match expected structure
  const formatted = submissions.map(s => ({
    ...s,
    opportunity: {
      title: s.opportunityTitle,
      slug: s.opportunityId,
    }
  }));

  return jsonSuccess(formatted);
}
