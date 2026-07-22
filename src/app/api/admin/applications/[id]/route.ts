import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageApplications } from "@/lib/permissions";
import { 
  readSubmissions, 
  updateSubmissionStatus, 
  deleteSubmission 
} from "@/lib/storage";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const submissions = readSubmissions();
  const submission = submissions.find(s => s.id === id);

  if (!submission) {
    return jsonError("Candidatura não encontrada", 404);
  }

  // Format to match expected structure
  const formatted = {
    ...submission,
    opportunity: {
      title: submission.opportunityTitle,
      slug: submission.opportunityId,
      type: "VOLUNTEERING"
    }
  };

  return jsonSuccess(formatted);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  if (!body.status || !["PENDING", "ACCEPTED", "REJECTED"].includes(body.status)) {
    return jsonError("Estado inválido");
  }

  const updated = updateSubmissionStatus(id, body.status);
  if (!updated) {
    return jsonError("Candidatura não encontrada", 404);
  }

  return jsonSuccess(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const deleted = deleteSubmission(id);
  
  if (!deleted) {
    return jsonError("Candidatura não encontrada", 404);
  }
  
  return jsonSuccess({ success: true });
}
