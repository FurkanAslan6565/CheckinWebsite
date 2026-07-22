import { NextResponse } from 'next/server';
import { getOpportunityForm } from '@/lib/storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const fields = getOpportunityForm(id);
    return NextResponse.json(fields);
  } catch (error) {
    console.error('Error fetching opportunity form fields:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
