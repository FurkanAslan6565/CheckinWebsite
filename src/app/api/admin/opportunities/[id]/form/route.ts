import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageOpportunities } from "@/lib/permissions";
import { getOpportunityForm, saveOpportunityForm } from "@/lib/storage";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const fields = getOpportunityForm(id);

  return jsonSuccess(fields);
}

export async function POST(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  try {
    const body = await request.json();
    
    // Body should be an array of fields
    if (!Array.isArray(body)) {
      return jsonError("Form fields must be an array");
    }

    // Basic structure validation
    for (const field of body) {
      if (!field.id || !field.label || !field.type) {
        return jsonError("Invalid form field structure");
      }
    }

    saveOpportunityForm(id, body);
    return jsonSuccess({ success: true, fields: body });
  } catch (err) {
    console.error("Error saving opportunity form:", err);
    return jsonError("Internal server error", 500);
  }
}
